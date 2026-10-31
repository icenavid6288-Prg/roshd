import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api, ApiError } from '../api/client';
import type { DashboardData } from '../api/types';
import type { TabStackNavigation } from '../navigation/types';
import { Loading, ProgressBar, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { faNum } from '../theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function DashboardScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation<TabStackNavigation>();
    const { width } = useWindowDimensions();
    const wide = width > 760;
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api<DashboardData>('/api/v1/dashboard')); setError(''); }
        catch (e) { setError(e instanceof ApiError ? e.message : 'اطلاعات مسیرت دریافت نشد. دوباره تلاش کن.'); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { void load(); }, [load]);
    if (loading && !data) return <Loading />;

    const firstName = (data?.user.name || user?.name || 'دوست رشد').trim().split(/\s+/)[0];
    const game = data?.gamification;
    const goal = game?.weekly_goal_minutes ?? 0;
    const studied = game?.weekly_studied_minutes ?? 0;
    const percent = goal > 0 ? Math.min(100, Math.round(studied / goal * 100)) : 0;
    const courses = (data?.enrollments ?? []).filter(item => item.course);
    const next = courses.find(item => item.progress < 100);
    const services: { title: string; subtitle: string; icon: IconName; action: () => void }[] = [
        { title: 'جلسات من', subtitle: 'همراهی با کوچ', icon: 'calendar-outline', action: () => navigation.navigate('Sessions') },
        { title: 'هدف‌ها', subtitle: 'قدم‌های پیش رو', icon: 'flag-outline', action: () => navigation.navigate('Goals') },
        { title: 'یادآوری‌ها', subtitle: 'برنامهٔ شخصی', icon: 'notifications-outline', action: () => navigation.navigate('Reminders') },
        { title: 'پشتیبانی', subtitle: 'کنارت هستیم', icon: 'chatbubble-ellipses-outline', action: () => navigation.navigate('Support') },
    ];

    return <Screen><ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.content, { paddingHorizontal: width < 360 ? 16 : 24 }]}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}>
        <View style={s.header}>
            <View style={s.flex}><Text style={[s.eyebrow, { color: colors.muted }]}>فضای شخصی تو</Text><Text style={[s.pageTitle, { color: colors.text }]}>{firstName}، این مسیر توست.</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel="مشاهده پروفایل" onPress={() => navigation.navigate('ProfileTab')}
                style={({ pressed }) => [s.avatar, { backgroundColor: colors.primarySoft }, pressed && s.pressed]}>
                <Text style={[s.avatarLetter, { color: colors.primary }]}>{firstName.slice(0, 1)}</Text>
            </Pressable>
        </View>

        {!!error && <View style={[s.error, { backgroundColor: colors.dangerSoft }]}>
            <Ionicons name="cloud-offline-outline" size={24} color={colors.danger} />
            <Text style={[s.body, s.flex, { color: colors.danger }]}>{error}</Text>
            <Pressable accessibilityRole="button" onPress={load} style={s.retry}><Text style={[s.bold, { color: colors.danger }]}>تلاش دوباره</Text></Pressable>
        </View>}

        <View style={[s.hero, wide && s.heroWide]}>
            <View style={s.heroCopy}>
                <View style={s.heroTop}><View style={s.statusDot} /><Text style={s.heroOverline}>{game?.level_title || 'مسیر یادگیری و خودشناسی'}</Text></View>
                <Text style={s.heroTitle}>{next ? 'نوبت قدم بعدی توست.' : 'رشد، از یک انتخاب شروع می‌شود.'}</Text>
                <Text style={s.heroBody}>{next?.course?.title || 'دوره‌ای متناسب با علاقه‌ات پیدا کن و مسیر خودت را بساز.'}</Text>
                <Pressable accessibilityRole="button" onPress={() => next?.course ? navigation.navigate('Learning', { slug: next.course.slug }) : navigation.navigate('Courses')}
                    style={({ pressed }) => [s.heroButton, pressed && s.pressed]}>
                    <Ionicons name={next ? 'play' : 'compass-outline'} size={19} color="#103F32" />
                    <Text style={s.heroButtonLabel}>{next ? 'ادامهٔ یادگیری' : 'کشف دوره‌ها'}</Text>
                    <Ionicons name="arrow-back" size={20} color="#103F32" />
                </Pressable>
            </View>
            <View style={[s.week, wide && s.weekWide]}>
                <View style={s.weekTop}><Ionicons name="time-outline" size={22} color="#D4F095" /><Text style={s.weekLabel}>یادگیری این هفته</Text></View>
                <View style={s.weekNumberRow}><Text style={s.weekNumber}>{data ? faNum(studied) : '—'}</Text><Text style={s.weekUnit}>دقیقه</Text></View>
                <View style={s.weekTrack}><View style={[s.weekFill, { width: `${percent}%` }]} /></View>
                <Text style={s.weekFoot}>{goal > 0 ? `از هدف ${faNum(goal)} دقیقه‌ای این هفته` : 'زمان یادگیری تو اینجا ثبت می‌شود'}</Text>
            </View>
        </View>

        <View style={[s.metrics, { borderBottomColor: colors.border }]}>
            {[
                { label: 'دورهٔ فعال', value: data?.stats.in_progress_count, icon: 'book-outline' as IconName },
                { label: 'روز پیوسته', value: game?.streak_days, icon: 'flame-outline' as IconName },
                { label: 'امتیاز رشد', value: game?.xp, icon: 'sparkles-outline' as IconName },
            ].map(item => <View key={item.label} style={s.metric}>
                <Ionicons name={item.icon} size={21} color={colors.primary} />
                <Text style={[s.metricValue, { color: colors.text }]}>{item.value === undefined ? '—' : faNum(item.value)}</Text>
                <Text style={[s.metricLabel, { color: colors.muted }]}>{item.label}</Text>
            </View>)}
        </View>

        <View style={s.sectionHeader}><Text style={[s.sectionTitle, { color: colors.text }]}>همراه‌های مسیر تو</Text><Ionicons name="apps-outline" size={23} color={colors.muted} /></View>
        <View style={s.services}>{services.map(item => <Pressable key={item.title} accessibilityRole="button" onPress={item.action}
            style={({ pressed }) => [s.service, { width: wide ? '23.5%' : '48%', backgroundColor: colors.surface, borderColor: colors.border }, pressed && s.pressed]}>
            <View style={[s.serviceIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name={item.icon} size={25} color={colors.primary} /></View>
            <Text style={[s.serviceTitle, { color: colors.text }]}>{item.title}</Text><Text style={[s.serviceSub, { color: colors.muted }]}>{item.subtitle}</Text>
        </Pressable>)}</View>

        <View style={[s.columns, wide && s.columnsWide]}>
            <View style={[s.column, wide && { flex: 1 }]}>
                <View style={s.sectionHeader}><Text style={[s.sectionTitle, { color: colors.text }]}>کتابخانهٔ یادگیری</Text>
                    <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Courses')} style={s.sectionAction}><Text style={[s.bold, { color: colors.primary }]}>آکادمی</Text><Ionicons name="chevron-back" size={18} color={colors.primary} /></Pressable>
                </View>
                <View style={[s.library, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {courses.length ? courses.slice(0, 4).map((course, index) => <Pressable key={course.id} accessibilityRole="button" onPress={() => navigation.navigate('Learning', { slug: course.course!.slug })}
                        style={({ pressed }) => [s.course, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }, pressed && s.pressed]}>
                        <View style={[s.courseMark, { backgroundColor: colors.primarySoft }]}><Ionicons name={course.progress >= 100 ? 'checkmark' : 'play-outline'} size={24} color={colors.primary} /></View>
                        <View style={s.flex}><Text style={[s.courseTitle, { color: colors.text }]}>{course.course!.title}</Text>
                            <View style={s.courseProgress}><View style={s.flex}><ProgressBar value={course.progress} /></View><Text style={[s.progressLabel, { color: colors.muted }]}>{faNum(Math.round(course.progress))}٪</Text></View>
                        </View>
                    </Pressable>) : <View style={s.empty}><View style={[s.emptyIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name="library-outline" size={32} color={colors.primary} /></View>
                        <Text style={[s.serviceTitle, { color: colors.text }]}>جای اولین دوره‌ات اینجاست</Text><Text style={[s.body, { color: colors.muted, textAlign: 'center' }]}>دوره‌های ثبت‌نام‌شده و پیشرفتت را اینجا دنبال کن.</Text>
                        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Courses')} style={[s.outlineButton, { borderColor: colors.border }]}><Text style={[s.bold, { color: colors.primary }]}>دیدن دوره‌ها</Text><Ionicons name="arrow-back" size={20} color={colors.primary} /></Pressable>
                    </View>}
                </View>
            </View>
            <View style={[s.column, wide && { flex: 1 }]}>
                <View style={s.sectionHeader}><Text style={[s.sectionTitle, { color: colors.text }]}>مسیر در یک نگاه</Text><Ionicons name="trail-sign-outline" size={24} color={colors.muted} /></View>
                <View style={[s.journey, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {[
                        { title: 'شروع یادگیری', detail: data ? `${faNum(data.stats.enrolled_count)} دوره در کتابخانه` : 'دوره‌های ثبت‌نام‌شده', complete: !!data?.stats.enrolled_count, icon: 'leaf-outline' as IconName },
                        { title: 'ساختن مهارت', detail: data ? `${faNum(data.stats.completed_count)} دوره تکمیل‌شده` : 'تکمیل دوره و تمرین', complete: !!data?.stats.completed_count, icon: 'layers-outline' as IconName },
                        { title: 'ثبت دستاورد', detail: data ? `${faNum(data.stats.certificates_count)} گواهی دریافت‌شده` : 'گواهی‌های آموزشی', complete: !!data?.stats.certificates_count, icon: 'ribbon-outline' as IconName },
                    ].map((stage, index) => <View key={stage.title} style={s.journeyRow}>
                        <View style={s.journeyRail}><View style={[s.journeyNode, { backgroundColor: stage.complete ? colors.primarySoft : colors.surfaceAlt }]}><Ionicons name={stage.complete ? 'checkmark' : stage.icon} size={22} color={stage.complete ? colors.primary : colors.muted} /></View>{index < 2 && <View style={[s.journeyLine, { backgroundColor: colors.border }]} />}</View>
                        <View style={s.journeyCopy}><Text style={[s.serviceTitle, { color: colors.text }]}>{stage.title}</Text><Text style={[s.body, { color: colors.muted }]}>{stage.detail}</Text></View>
                    </View>)}
                </View>
            </View>
        </View>

        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Sessions')} style={({ pressed }) => [s.coach, { backgroundColor: colors.primarySoft }, pressed && s.pressed]}>
            <View style={[s.coachIcon, { backgroundColor: colors.surface }]}><Ionicons name="people-outline" size={27} color={colors.primary} /></View>
            <View style={s.flex}><Text style={[s.serviceTitle, { color: colors.text }]}>برای قدم بعدی، همراه داشته باش.</Text><Text style={[s.body, { color: colors.muted }]}>جلسات کوچینگ و مشاورهٔ تو</Text></View>
            <Ionicons name="arrow-back" size={23} color={colors.primary} />
        </Pressable>
    </ScrollView></Screen>;
}

const s = StyleSheet.create({
    content: { width: '100%', maxWidth: 1120, alignSelf: 'center', paddingTop: 24, paddingBottom: 40, gap: 24 },
    flex: { flex: 1, minWidth: 0 }, header: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16 },
    eyebrow: { fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 25, textAlign: 'right' },
    pageTitle: { fontFamily: 'VazirmatnBlack', fontSize: 25, lineHeight: 42, textAlign: 'right' },
    avatar: { width: 54, height: 54, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, avatarLetter: { fontFamily: 'VazirmatnBold', fontSize: 25 },
    hero: { borderRadius: 28, backgroundColor: '#123F33', overflow: 'hidden', padding: 24, gap: 26 }, heroWide: { flexDirection: 'row-reverse', alignItems: 'center', padding: 32 },
    heroCopy: { flex: 1, minWidth: 0, gap: 14 }, heroTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }, statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D4F095' },
    heroOverline: { fontFamily: 'Vazirmatn', fontSize: 13, color: '#C3D5CC', textAlign: 'right' }, heroTitle: { fontFamily: 'VazirmatnBlack', fontSize: 27, lineHeight: 44, color: '#FFFFFF', textAlign: 'right' },
    heroBody: { fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 26, color: '#D0E1D8', textAlign: 'right' },
    heroButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, backgroundColor: '#D4F095', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 15, alignSelf: 'flex-end', minHeight: 52 }, heroButtonLabel: { fontFamily: 'VazirmatnBold', fontSize: 15, color: '#103F32' },
    week: { borderTopWidth: 1, borderTopColor: '#356154', paddingTop: 20, gap: 10 }, weekWide: { width: 230, borderTopWidth: 0, borderRightWidth: 1, borderRightColor: '#356154', paddingRight: 26, paddingTop: 0 },
    weekTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }, weekLabel: { fontFamily: 'Vazirmatn', color: '#DCEADF', fontSize: 14 }, weekNumberRow: { flexDirection: 'row-reverse', alignItems: 'baseline', gap: 9 }, weekNumber: { fontFamily: 'VazirmatnBlack', fontSize: 42, lineHeight: 62, color: '#FFFFFF' }, weekUnit: { fontFamily: 'Vazirmatn', fontSize: 14, color: '#BDD0C6' }, weekTrack: { height: 7, borderRadius: 4, backgroundColor: '#365D50', overflow: 'hidden', alignItems: 'flex-end' }, weekFill: { height: 7, backgroundColor: '#D4F095', borderRadius: 4 }, weekFoot: { fontFamily: 'Vazirmatn', fontSize: 12, lineHeight: 23, color: '#BDD0C6', textAlign: 'right' },
    metrics: { flexDirection: 'row-reverse', paddingBottom: 24, borderBottomWidth: 1 }, metric: { flex: 1, alignItems: 'center', gap: 4 }, metricValue: { fontFamily: 'VazirmatnBold', fontSize: 26, lineHeight: 40 }, metricLabel: { fontFamily: 'Vazirmatn', fontSize: 13, lineHeight: 23, textAlign: 'center' },
    sectionHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 12 }, sectionTitle: { fontFamily: 'VazirmatnBold', fontSize: 19, lineHeight: 32, textAlign: 'right', flexShrink: 1 }, sectionAction: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, minHeight: 44 },
    services: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginTop: -8 }, service: { padding: 18, borderRadius: 20, borderWidth: 1, alignItems: 'flex-end', gap: 5 }, serviceIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }, serviceTitle: { fontFamily: 'VazirmatnBold', fontSize: 15, lineHeight: 27, textAlign: 'right' }, serviceSub: { fontFamily: 'Vazirmatn', fontSize: 13, lineHeight: 24, textAlign: 'right' },
    columns: { gap: 28 }, columnsWide: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 24 }, column: { minWidth: 0, gap: 14 }, library: { borderWidth: 1, borderRadius: 22, overflow: 'hidden' }, course: { flexDirection: 'row-reverse', alignItems: 'center', gap: 14, padding: 18 }, courseMark: { width: 46, height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }, courseTitle: { fontFamily: 'VazirmatnBold', fontSize: 14, lineHeight: 26, textAlign: 'right' }, courseProgress: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginTop: 10 }, progressLabel: { fontFamily: 'Vazirmatn', fontSize: 12 },
    empty: { padding: 28, alignItems: 'center', gap: 12 }, emptyIcon: { width: 66, height: 66, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }, outlineButton: { flexDirection: 'row-reverse', borderWidth: 1, borderRadius: 14, paddingHorizontal: 20, minHeight: 48, justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 6 },
    journey: { borderWidth: 1, borderRadius: 22, padding: 20 }, journeyRow: { flexDirection: 'row-reverse', gap: 16 }, journeyRail: { alignItems: 'center' }, journeyNode: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, journeyLine: { width: 2, minHeight: 28, flex: 1, marginVertical: 5 }, journeyCopy: { flex: 1, minWidth: 0, paddingBottom: 24, paddingTop: 2, gap: 4 },
    coach: { flexDirection: 'row-reverse', alignItems: 'center', gap: 14, padding: 20, borderRadius: 22 }, coachIcon: { width: 54, height: 54, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    body: { fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 26, textAlign: 'right' }, bold: { fontFamily: 'VazirmatnBold', fontSize: 14, lineHeight: 24 }, pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
    error: { borderRadius: 18, padding: 16, flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 12, alignItems: 'center' }, retry: { minHeight: 44, justifyContent: 'center' },
});
