import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CourseCard, EmptyState, Loading, ProductCard, ProgressBar, Screen, SectionHeader } from '../components';
import { api, ApiError } from '../api/client';
import type { HomeData } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';
import type { TabStackNavigation } from '../navigation/types';

export function HomeScreen() {
    const navigation = useNavigation<TabStackNavigation>();
    const { colors, isDark, toggleTheme } = useTheme();
    const [data, setData] = useState<HomeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(null);
            const result = await api<HomeData>('/api/v1/home', { auth: false });
            setData(result);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'خطا در دریافت اطلاعات');
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    if (!data && !error) {
        return <Loading label="در حال آماده‌سازی خانه…" />;
    }

    if (error && !data) {
        return (
            <Screen>
                <EmptyState icon="📡" title="عدم دسترسی به سرور" subtitle={error} />
            </Screen>
        );
    }

    return (
        <Screen>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            load();
                        }}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Hero Banner */}
                <View style={[styles.hero, { backgroundColor: colors.primaryDark }]}>
                    <View style={styles.heroTopRow}>
                        <Text style={styles.heroBadge}>{data?.site.name || 'مرکز رشد دکتر بیدی'}</Text>
                        <Pressable
                            onPress={toggleTheme}
                            style={styles.themeBtn}
                        >
                            <Text style={styles.themeBtnText}>{isDark ? '☀️ روز' : '🌙 شب'}</Text>
                        </Pressable>
                    </View>
                    <Text style={styles.heroTitle}>
                        {data?.site.hero_title || 'مسیر رشد استراتژیک شما، از اینجا آغاز می‌شود'}
                    </Text>
                    {data?.site.hero_subtitle ? (
                        <Text style={styles.heroSubtitle}>{data.site.hero_subtitle}</Text>
                    ) : null}

                    {data?.stats?.length ? (
                        <View style={styles.statsRow}>
                            {data.stats.slice(0, 3).map((s) => (
                                <View key={s.id} style={styles.statCard}>
                                    <Text style={styles.statValue}>{faNum(s.value)}</Text>
                                    <Text style={styles.statLabel} numberOfLines={1}>
                                        {s.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : null}
                </View>

                {/* Continue Last Lesson Card */}
                {data?.continue_lesson ? (
                    <Pressable
                        onPress={() =>
                            navigation.navigate('Learning', {
                                slug: data.continue_lesson!.course_slug,
                                lessonId: data.continue_lesson!.lesson_id,
                            })
                        }
                        style={[
                            styles.continueCard,
                            { backgroundColor: colors.surface, borderColor: colors.primary },
                        ]}
                    >
                        <View style={styles.continueHeader}>
                            <Text style={[styles.continueBadge, { color: colors.primary }]}>
                                ▶ ادامه آخرین درس مطالعه شده
                            </Text>
                            <Text style={[styles.continueRemain, { color: colors.muted }]}>
                                {faNum(data.continue_lesson.remaining_minutes)} دقیقه باقی‌مانده
                            </Text>
                        </View>
                        <Text style={[styles.continueTitle, { color: colors.text }]}>
                            {data.continue_lesson.lesson_title}
                        </Text>
                        <Text style={[styles.continueCourse, { color: colors.muted }]}>
                            از دوره: {data.continue_lesson.course_title}
                        </Text>
                        <View style={{ marginTop: spacing.xs, gap: 4 }}>
                            <ProgressBar value={data.continue_lesson.progress} />
                            <Text style={[styles.continuePercent, { color: colors.primary }]}>
                                {faNum(data.continue_lesson.progress)}٪ پیشرفت دوره — لمس برای ادامه پخش
                            </Text>
                        </View>
                    </Pressable>
                ) : null}

                {/* Enterprise Professional Access Grid */}
                <SectionHeader title="دسترسی سریع به بخش‌های سامانه و مدیریت" />
                <View style={styles.superGrid}>
                    {[
                        { label: 'پنل ادمین سایت', icon: '🛡️', onPress: () => navigation.navigate('AdminPanel'), badge: 'مدیر کل' },
                        { label: 'داشبورد حرفه‌ای', icon: '📊', onPress: () => navigation.navigate('Dashboard'), badge: 'پیشخوان' },
                        { label: 'آکادمی دوره‌ها', icon: '🎓', onPress: () => navigation.navigate('Courses') },
                        { label: 'فروشگاه تخصصی', icon: '🛍️', onPress: () => navigation.navigate('Shop') },
                        { label: 'جلسات کوچینگ', icon: '🎯', onPress: () => navigation.navigate('Sessions') },
                        { label: 'آزمون و مدارک', icon: '🏅', onPress: () => navigation.navigate('Goals') },
                        { label: 'یادآوری هوشمند', icon: '🔔', onPress: () => navigation.navigate('Reminders') },
                        { label: 'تیکت پشتیبانی', icon: '💬', onPress: () => navigation.navigate('Support') },
                    ].map((item) => (
                        <Pressable
                            key={item.label}
                            onPress={item.onPress}
                            style={[
                                styles.superCard,
                                { backgroundColor: colors.surface, borderColor: colors.border },
                            ]}
                        >
                            {item.badge ? (
                                <Text style={styles.superBadge}>{item.badge}</Text>
                            ) : null}
                            <Text style={styles.quickIcon}>{item.icon}</Text>
                            <Text style={[styles.quickLabel, { color: colors.text }]}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>

                <SectionHeader
                    title="دوره‌های برگزیده"
                    actionLabel="همه دوره‌ها"
                    onAction={() => navigation.navigate('Courses')}
                />
                {data?.featured_courses?.length ? (
                    <FlatList
                        data={data.featured_courses}
                        keyExtractor={(item) => String(item.id)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                        renderItem={({ item }) => (
                            <CourseCard
                                course={item}
                                compact
                                onPress={() => navigation.navigate('CourseDetail', { slug: item.slug })}
                            />
                        )}
                    />
                ) : (
                    <EmptyState icon="🎓" title="دوره‌ای یافت نشد" />
                )}

                <SectionHeader
                    title="تازه‌های فروشگاه"
                    actionLabel="همه محصولات"
                    onAction={() => navigation.navigate('Shop')}
                />
                {data?.featured_products?.length ? (
                    <FlatList
                        data={data.featured_products}
                        keyExtractor={(item) => String(item.id)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                        renderItem={({ item }) => (
                            <ProductCard
                                product={item}
                                onPress={() => navigation.navigate('ProductDetail', { slug: item.slug })}
                            />
                        )}
                    />
                ) : (
                    <EmptyState icon="📚" title="محصولی یافت نشد" />
                )}

                {data?.testimonials?.length ? (
                    <>
                        <SectionHeader title="تجربه دانش‌پذیران و مدیران" />
                        <View style={styles.testimonials}>
                            {data.testimonials.map((t) => (
                                <View
                                    key={t.id}
                                    style={[
                                        styles.testimonialCard,
                                        { backgroundColor: colors.surface, borderColor: colors.border },
                                    ]}
                                >
                                    <Text style={[styles.testimonialQuote, { color: colors.text }]}>
                                        «{t.content}»
                                    </Text>
                                    <Text style={[styles.testimonialAuthor, { color: colors.primary }]}>
                                        {t.name} {t.role ? `— ${t.role}` : ''}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                ) : null}

                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    hero: {
        margin: spacing.lg,
        padding: spacing.xl,
        borderRadius: radius.xl,
        gap: spacing.sm,
    },
    heroTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heroBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        color: '#FACC15',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: radius.pill,
        fontSize: 12,
        fontWeight: '700',
    },
    themeBtn: {
        backgroundColor: 'rgba(255,255,255,0.14)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: radius.pill,
    },
    themeBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    heroTitle: { ...typography.hero, color: '#FFFFFF', marginTop: spacing.xs },
    heroSubtitle: { ...typography.body, color: 'rgba(255,255,255,0.85)' },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    statValue: { color: '#FACC15', fontSize: 18, fontWeight: '800' },
    statLabel: { color: '#FFFFFF', fontSize: 11, marginTop: 2 },
    continueCard: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        gap: 6,
    },
    continueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    continueBadge: { fontSize: 12, fontWeight: '800' },
    continueRemain: { fontSize: 11, fontWeight: '600' },
    continueTitle: { ...typography.subtitle, fontWeight: '700' },
    continueCourse: { ...typography.small },
    continuePercent: { fontSize: 11, fontWeight: '700' },
    quickGrid: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    superGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    superCard: {
        width: '22.5%',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: 4,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: 6,
        position: 'relative',
    },
    superBadge: {
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: 'rgba(16, 185, 129, 0.16)',
        color: '#059669',
        fontSize: 8,
        fontWeight: '800',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 6,
    },
    quickCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: 6,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: 6,
    },
    quickIcon: { fontSize: 20 },
    quickLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
    horizontalList: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    testimonials: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    testimonialCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: spacing.sm,
    },
    testimonialQuote: { ...typography.body },
    testimonialAuthor: { ...typography.small, fontWeight: '700' },
});
