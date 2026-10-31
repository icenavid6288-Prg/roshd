import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CourseCard, ProductCard, ProgressBar, Screen } from '../components';
import { api, ApiError } from '../api/client';
import type { HomeData } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { faNum } from '../theme';
import type { TabStackNavigation } from '../navigation/types';

type IconName = keyof typeof Ionicons.glyphMap;

export function HomeScreen() {
    const navigation = useNavigation<TabStackNavigation>();
    const { colors, isDark, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const wide = width >= 720;
    const [data, setData] = useState<HomeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const load = useCallback(async () => {
        try { setError(null); setData(await api<HomeData>('/api/v1/home', { auth: false })); }
        catch (e) { setError(e instanceof ApiError ? e.message : 'دریافت پیشنهادها انجام نشد.'); }
        finally { setRefreshing(false); setLoading(false); }
    }, []);
    useEffect(() => { void load(); }, [load]);
    const services: { title: string; icon: IconName; action: () => void }[] = [
        { title: 'آکادمی', icon: 'school-outline', action: () => navigation.navigate('Courses') },
        { title: 'مسیر من', icon: 'compass-outline', action: () => navigation.navigate('Dashboard') },
        { title: 'کوچینگ', icon: 'people-outline', action: () => navigation.navigate('Sessions') },
        { title: 'فروشگاه', icon: 'bag-handle-outline', action: () => navigation.navigate('Shop') },
        { title: 'هدف‌ها', icon: 'flag-outline', action: () => navigation.navigate('Goals') },
        { title: 'یادآوری', icon: 'notifications-outline', action: () => navigation.navigate('Reminders') },
        { title: 'پشتیبانی', icon: 'chatbubbles-outline', action: () => navigation.navigate('Support') },
        { title: 'حساب من', icon: 'person-outline', action: () => navigation.navigate('ProfileTab') },
    ];
    const lesson = data?.continue_lesson;
    const section = (title: string, subtitle: string, action: () => void) => (
        <View style={styles.sectionHeading}>
            <View style={styles.sectionCopy}><Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text><Text style={[styles.sectionSubtitle, { color: colors.muted }]}>{subtitle}</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel={`مشاهده همه ${title}`} onPress={action} style={({ pressed }) => [styles.more, { backgroundColor: colors.surfaceAlt }, pressed && styles.pressed]}><Ionicons name="arrow-back" size={20} color={colors.primary} /></Pressable>
        </View>
    );
    return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} tintColor={colors.primary} />}>
        <View style={styles.topbar}>
            <View style={styles.brand}><Image source={require('../../assets/roshd-logo.png')} style={styles.logo} /><View><Text style={[styles.wordmark, { color: colors.text }]}>Roshd</Text><Text style={[styles.brandCaption, { color: colors.muted }]}>هر روز، یک قدم جلوتر</Text></View></View>
            <View style={styles.topActions}>
                <Pressable accessibilityRole="button" accessibilityLabel={isDark ? 'فعال کردن حالت روشن' : 'فعال کردن حالت تاریک'} onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.surface }]}><Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={21} color={colors.text} /></Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="یادآوری‌های من" onPress={() => navigation.navigate('Reminders')} style={[styles.iconButton, { backgroundColor: colors.surface }]}><Ionicons name="notifications-outline" size={21} color={colors.text} /></Pressable>
            </View>
        </View>
        <View style={styles.helloRow}><Text style={[styles.greeting, { color: colors.text }]}>سلام {user?.name?.split(' ')[0] || 'دوست رشد'}، خوش اومدی</Text><View style={[styles.dayDot, { backgroundColor: colors.primary }]} /></View>
        <View style={[styles.hero, wide && styles.heroWide]}>
            <View style={styles.heroCopy}><View style={styles.heroPill}><View style={styles.pillDot} /><Text style={styles.heroPillText}>فضای رشد شخصی تو</Text></View><Text style={styles.heroTitle}>بهترین نسخهٔ تو،{ '\n' }از همین امروز.</Text><Text style={styles.heroBody}>یاد بگیر، خودت را بهتر بشناس و مسیرت را با همراهی یک کوچ بساز.</Text><Pressable accessibilityRole="button" onPress={() => navigation.navigate('Dashboard')} style={({ pressed }) => [styles.heroCta, pressed && styles.pressed]}><Text style={styles.heroCtaText}>شروع مسیر من</Text><Ionicons name="arrow-back" size={20} color="#153F32" /></Pressable></View>
            <Image source={require('../../assets/growth-editorial.png')} style={[styles.heroArt, !wide && styles.heroArtSmall]} resizeMode="cover" accessible={false} />
        </View>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Courses')} style={({ pressed }) => [styles.search, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><Ionicons name="search-outline" size={22} color={colors.primary} /><Text style={[styles.searchText, { color: colors.muted }]}>چی می‌خوای یاد بگیری؟</Text><View style={[styles.searchEnd, { backgroundColor: colors.surfaceAlt }]}><Ionicons name="options-outline" size={18} color={colors.muted} /></View></Pressable>
        <View style={[styles.services, { backgroundColor: colors.surface }]}>
            <View style={styles.serviceHeading}><Text style={[styles.sectionTitle, { color: colors.text }]}>همهٔ رشد، یک‌جا</Text><Text style={[styles.serviceCount, { color: colors.muted }]}>دسترسی سریع</Text></View>
            <View style={styles.serviceGrid}>{services.map((service, index) => <Pressable key={service.title} accessibilityRole="button" onPress={service.action} style={({ pressed }) => [styles.service, { width: wide ? '12.5%' : '25%' }, pressed && styles.pressed]}><View style={[styles.serviceIcon, { backgroundColor: isDark ? colors.surfaceAlt : index < 4 ? '#EBF4ED' : '#F2F4ED' }]}><Ionicons name={service.icon} size={25} color={colors.primary} /></View><Text style={[styles.serviceLabel, { color: colors.text }]}>{service.title}</Text></Pressable>)}</View>
        </View>
        {lesson ? <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Learning', { slug: lesson.course_slug, lessonId: lesson.lesson_id })} style={({ pressed }) => [styles.continue, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><View style={styles.continueTop}><View style={styles.continueCopy}><Text style={[styles.eyebrow, { color: colors.primary }]}>ادامهٔ یادگیری</Text><Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.lesson_title}</Text><Text style={[styles.body, { color: colors.muted }]}>{lesson.course_title}</Text></View><View style={[styles.play, { backgroundColor: colors.primary }]}><Ionicons name="play" size={23} color="#FFF" /></View></View><ProgressBar value={lesson.progress} /><View style={styles.continueMeta}><Text style={[styles.meta, { color: colors.muted }]}>{faNum(lesson.remaining_minutes)} دقیقه باقی مانده</Text><Text style={[styles.meta, { color: colors.primary }]}>{faNum(lesson.progress)}٪ تکمیل شده</Text></View></Pressable> : null}
        {section('برای یادگیری بعدی', 'دوره‌های منتخب آکادمی رشد', () => navigation.navigate('Courses'))}
        {loading ? <View style={styles.loading}><ActivityIndicator color={colors.primary} /></View> : data?.featured_courses?.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>{data.featured_courses.map(course => <CourseCard key={course.id} course={course} compact onPress={() => navigation.navigate('CourseDetail', { slug: course.slug })} />)}</ScrollView> : <View style={[styles.empty, { backgroundColor: colors.surface }]}><Ionicons name="school-outline" size={30} color={colors.primary} /><Text style={[styles.body, { color: colors.muted }]}>{error || 'دوره‌های تازه به‌زودی اینجا قرار می‌گیرند.'}</Text>{error ? <Pressable accessibilityRole="button" onPress={load}><Text style={[styles.retry, { color: colors.primary }]}>تلاش دوباره</Text></Pressable> : null}</View>}
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Sessions')} style={({ pressed }) => [styles.coaching, { backgroundColor: isDark ? colors.surfaceAlt : '#EDF0E1' }, pressed && styles.pressed]}><View style={styles.coachingCopy}><Text style={[styles.coachingTitle, { color: colors.text }]}>لازم نیست تنهایی{ '\n' }مسیرت را پیدا کنی.</Text><Text style={[styles.body, { color: colors.muted }]}>جلسه‌های کوچینگ و همراهی فردی</Text><View style={styles.coachingAction}><Text style={[styles.retry, { color: colors.primary }]}>دیدن جلسه‌ها</Text><Ionicons name="arrow-back" size={19} color={colors.primary} /></View></View><View style={styles.coachingVisual}><Ionicons name="people" size={54} color="#476246" /><View style={styles.coachAccent}><Ionicons name="chatbubble-ellipses" size={22} color="#31503F" /></View></View></Pressable>
        {section('ابزارهای رشد', 'کتاب‌ها و محصولات برای ادامهٔ مسیر', () => navigation.navigate('Shop'))}
        {data?.featured_products?.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>{data.featured_products.map(product => <ProductCard key={product.id} product={product} onPress={() => navigation.navigate('ProductDetail', { slug: product.slug })} />)}</ScrollView> : <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Shop')} style={[styles.shopLink, { borderColor: colors.border }]}><Ionicons name="bag-handle-outline" size={25} color={colors.primary} /><Text style={[styles.shopLabel, { color: colors.text }]}>گشت‌وگذار در فروشگاه</Text><Ionicons name="chevron-back" size={19} color={colors.muted} /></Pressable>}
        <View style={[styles.footer, { borderTopColor: colors.border }]}><Ionicons name="leaf-outline" size={18} color={colors.primary} /><Text style={[styles.meta, { color: colors.muted }]}>رشد، همراه مسیر تو</Text></View>
    </ScrollView></Screen>;
}

const styles = StyleSheet.create({
    page: { width: '100%', maxWidth: 1060, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 36, gap: 22 },
    topbar: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, brand: { flexDirection: 'row-reverse', gap: 10, alignItems: 'center' }, logo: { width: 44, height: 44, borderRadius: 15 }, wordmark: { fontFamily: 'VazirmatnBlack', fontSize: 23, lineHeight: 28, textAlign: 'right' }, brandCaption: { fontFamily: 'Vazirmatn', fontSize: 11, lineHeight: 20, textAlign: 'right' }, topActions: { flexDirection: 'row', gap: 7 }, iconButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    helloRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginBottom: -9 }, greeting: { fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 26 }, dayDot: { width: 6, height: 6, borderRadius: 3 },
    hero: { backgroundColor: '#123E30', borderRadius: 28, padding: 24, overflow: 'hidden', minHeight: 290 }, heroWide: { padding: 34, minHeight: 300 }, heroCopy: { alignItems: 'flex-end', zIndex: 1 }, heroPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, backgroundColor: '#275342' }, pillDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D6F39A' }, heroPillText: { color: '#D6F39A', fontFamily: 'Vazirmatn', fontSize: 11, lineHeight: 20 }, heroTitle: { color: '#FFFFFF', fontFamily: 'VazirmatnBlack', fontSize: 29, lineHeight: 45, textAlign: 'right', marginTop: 14 }, heroBody: { color: '#C5D7CA', fontFamily: 'Vazirmatn', fontSize: 13, lineHeight: 24, textAlign: 'right', marginTop: 8, maxWidth: 320 }, heroCta: { flexDirection: 'row-reverse', gap: 18, alignItems: 'center', backgroundColor: '#D6F39A', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, marginTop: 22 }, heroCtaText: { fontFamily: 'VazirmatnBold', fontSize: 14, lineHeight: 24, color: '#153F32' },
    heroArt: { position: 'absolute', left: 48, top: 55, width: 190, height: 190, justifyContent: 'center', alignItems: 'center', opacity: 0.92 }, heroArtSmall: { left: -38, top: 110, width: 150, height: 180, opacity: 0.35 }, artOrbit: { position: 'absolute', width: '100%', height: '100%', borderRadius: 110, borderWidth: 1, borderColor: '#719876' }, artOrbitInner: { position: 'absolute', width: '76%', height: '76%', borderRadius: 100, borderWidth: 1, borderColor: '#537F5F' }, artDisc: { width: '56%', height: '56%', borderRadius: 90, backgroundColor: '#2C6045', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-15deg' }] }, artSpark: { position: 'absolute', right: 6, bottom: 23, width: 43, height: 43, borderRadius: 16, backgroundColor: '#D6F39A', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '12deg' }] },
    search: { minHeight: 58, flexDirection: 'row-reverse', alignItems: 'center', gap: 11, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 18, borderWidth: 1 }, searchText: { fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 25, flex: 1, textAlign: 'right' }, searchEnd: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    services: { borderRadius: 24, padding: 14 }, serviceHeading: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, paddingBottom: 12, gap: 8 }, serviceCount: { fontFamily: 'Vazirmatn', fontSize: 11, lineHeight: 22 }, serviceGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', rowGap: 18 }, service: { alignItems: 'center', gap: 8, paddingVertical: 5 }, serviceIcon: { width: 54, height: 54, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, serviceLabel: { fontFamily: 'VazirmatnBold', fontSize: 12, lineHeight: 23, textAlign: 'center' },
    sectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', gap: 15, marginTop: 4, marginBottom: -8 }, sectionCopy: { flex: 1 }, sectionTitle: { fontFamily: 'VazirmatnBold', fontSize: 18, lineHeight: 30, textAlign: 'right' }, sectionSubtitle: { fontFamily: 'Vazirmatn', fontSize: 12, lineHeight: 23, textAlign: 'right', marginTop: 3 }, more: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, rail: { gap: 14, paddingBottom: 4, flexDirection: 'row-reverse' },
    continue: { borderWidth: 1, borderRadius: 22, padding: 18, gap: 15 }, continueTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16 }, continueCopy: { flex: 1 }, eyebrow: { fontFamily: 'VazirmatnBold', fontSize: 11, lineHeight: 22, textAlign: 'right' }, lessonTitle: { fontFamily: 'VazirmatnBold', fontSize: 17, lineHeight: 29, textAlign: 'right', marginTop: 5 }, play: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, continueMeta: { flexDirection: 'row-reverse', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }, meta: { fontFamily: 'Vazirmatn', fontSize: 12, lineHeight: 22 }, body: { fontFamily: 'Vazirmatn', fontSize: 13, lineHeight: 25, textAlign: 'right' },
    coaching: { flexDirection: 'row-reverse', alignItems: 'center', padding: 24, borderRadius: 24, gap: 14 }, coachingCopy: { flex: 1, gap: 8 }, coachingTitle: { fontFamily: 'VazirmatnBlack', fontSize: 21, lineHeight: 35, textAlign: 'right' }, coachingAction: { flexDirection: 'row-reverse', gap: 12, alignItems: 'center', marginTop: 9 }, coachingVisual: { width: 70, height: 92, justifyContent: 'center', alignItems: 'center' }, coachAccent: { position: 'absolute', top: -2, right: 0, width: 32, height: 32, borderRadius: 10, backgroundColor: '#D6F39A', alignItems: 'center', justifyContent: 'center' }, retry: { fontFamily: 'VazirmatnBold', fontSize: 13, lineHeight: 24 },
    loading: { minHeight: 120, justifyContent: 'center', alignItems: 'center' }, empty: { padding: 24, borderRadius: 20, gap: 12, alignItems: 'center' }, shopLink: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 18, gap: 14, borderTopWidth: 1, borderBottomWidth: 1 }, shopLabel: { fontFamily: 'VazirmatnBold', fontSize: 14, lineHeight: 26, flex: 1, textAlign: 'right' }, footer: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 20, borderTopWidth: 1, marginTop: 4 }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
