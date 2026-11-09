import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CourseCard, ProductCard, ProgressBar, Screen } from '../components';
import { api, ApiError } from '../api/client';
import type { HomeData } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { faNum, formatToman } from '../theme';
import type { TabStackNavigation } from '../navigation/types';

export function HomeScreen() {
    const navigation = useNavigation<TabStackNavigation>();
    const { colors, isDark, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [data, setData] = useState<HomeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            setError(null);
            setData(await api<HomeData>('/api/v1/home', { auth: true }));
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'خطا در اتصال');
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const flagship = data?.flagship_course ?? data?.featured_courses?.[0] ?? null;
    const isVipUnlocked = Boolean(data?.flagship_course?.enrolled);
    const otherCourses = (data?.featured_courses ?? []).filter((c) => c.id !== flagship?.id);

    const section = (
        title: string,
        icon: React.ComponentProps<typeof Ionicons>['name'],
        action: () => void,
    ) => (
        <View style={styles.sectionHeading}>
            <View style={styles.sectionTitleWrap}>
                <Ionicons name={icon} size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            </View>
            <Pressable
                accessibilityRole="button"
                onPress={action}
                style={({ pressed }) => [styles.moreLink, pressed && styles.pressed]}
            >
                <Ionicons name="grid-outline" size={14} color={colors.primary} />
                <Ionicons name="arrow-back" size={14} color={colors.primary} />
            </Pressable>
        </View>
    );

    return (
        <Screen>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.page}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            void load();
                        }}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* 1. Compact Visual Topbar */}
                <View style={styles.topbar}>
                    <View style={styles.brand}>
                        <Image source={require('../../assets/roshd-logo.png')} style={styles.logo} />
                        <View>
                            <View style={styles.nameRow}>
                                <Text style={[styles.greeting, { color: colors.text }]}>
                                    {data?.site?.name || 'مرکز رشد'}
                                </Text>
                                <View style={styles.vipBadge}>
                                    <Ionicons name="sparkles" size={11} color="#B45309" />
                                    <Text style={styles.vipBadgeText}>VIP</Text>
                                </View>
                            </View>
                            {user?.name ? (
                                <View style={styles.userMiniRow}>
                                    <Ionicons name="person-circle-outline" size={13} color={colors.muted} />
                                    <Text style={[styles.brandCaption, { color: colors.muted }]}>{user.name}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                    <View style={styles.topActions}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={toggleTheme}
                            style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color={colors.text} />
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => navigation.navigate('Support')}
                            style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <Ionicons name="headset-outline" size={18} color={colors.text} />
                        </Pressable>
                    </View>
                </View>

                {/* 2. Visual Icon Quick Dock */}
                <View style={styles.quickDock}>
                    {[
                        { label: 'دوره‌ها', icon: 'school-outline' as const, onPress: () => navigation.navigate('Courses') },
                        { label: 'رشد من', icon: 'trending-up-outline' as const, onPress: () => navigation.navigate('Dashboard') },
                        { label: 'گفتگو', icon: 'chatbubbles-outline' as const, onPress: () => navigation.navigate('Chat') },
                        { label: 'فروشگاه', icon: 'bag-handle-outline' as const, onPress: () => navigation.navigate('Shop') },
                    ].map((item) => (
                        <Pressable
                            key={item.label}
                            onPress={item.onPress}
                            style={({ pressed }) => [
                                styles.dockTile,
                                { backgroundColor: colors.surface, borderColor: colors.border },
                                pressed && styles.pressed,
                            ]}
                        >
                            <View style={[styles.dockIconWrap, { backgroundColor: colors.primarySoft }]}>
                                <Ionicons name={item.icon} size={22} color={colors.primary} />
                            </View>
                            <Text style={[styles.dockLabel, { color: colors.text }]}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* 3. Visual Flagship VIP Course Hero */}
                {flagship ? (
                    <View style={styles.vipCard}>
                        <View style={styles.vipPillRow}>
                            <View style={styles.vipPill}>
                                <Ionicons name="ribbon" size={13} color="#10382B" />
                                <Text style={styles.vipPillText}>دوره VIP</Text>
                            </View>
                            <View style={styles.vipStatusChip}>
                                <Ionicons
                                    name={isVipUnlocked ? 'checkmark-circle' : 'lock-closed'}
                                    size={13}
                                    color="#D6F39A"
                                />
                                <Text style={styles.vipStatusText}>
                                    {isVipUnlocked ? 'فعال' : 'پیش‌نمایش'}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.vipTitle} numberOfLines={2}>
                            {flagship.title}
                        </Text>

                        {/* Visual KPI Chips Row instead of long summary paragraph */}
                        <View style={styles.vipMetricsRow}>
                            <View style={styles.vipMetricChip}>
                                <Ionicons name="videocam-outline" size={14} color="#D6F39A" />
                                <Text style={styles.vipMetricText}>
                                    {faNum(flagship.lessons_count || 24)} جلسه
                                </Text>
                            </View>
                            <View style={styles.vipMetricChip}>
                                <Ionicons name="layers-outline" size={14} color="#D6F39A" />
                                <Text style={styles.vipMetricText}>
                                    {faNum(flagship.modules?.length || 4)} فصل
                                </Text>
                            </View>
                            <View style={styles.vipMetricChip}>
                                <Ionicons name="shield-checkmark-outline" size={14} color="#D6F39A" />
                                <Text style={styles.vipMetricText}>پشتیبانی VIP</Text>
                            </View>
                        </View>

                        {isVipUnlocked ? (
                            <View style={styles.vipProgressBox}>
                                <View style={styles.vipProgressRow}>
                                    <Ionicons name="pie-chart-outline" size={14} color="#D6F39A" />
                                    <Text style={styles.vipProgressLabel}>
                                        {faNum(data?.flagship_course?.progress_percent ?? 0)}٪
                                    </Text>
                                </View>
                                <ProgressBar value={data?.flagship_course?.progress_percent ?? 0} />
                            </View>
                        ) : null}

                        {/* Compact Visual Modules Preview */}
                        {flagship.modules && flagship.modules.length > 0 ? (
                            <View style={styles.modulesList}>
                                {flagship.modules.slice(0, 3).map((mod, idx) => {
                                    const firstLesson = mod.lessons?.[0];
                                    const unlocked = isVipUnlocked || Boolean(firstLesson?.is_free) || idx === 0;
                                    return (
                                        <Pressable
                                            key={mod.id}
                                            onPress={() =>
                                                navigation.navigate('CourseDetail', { slug: flagship.slug })
                                            }
                                            style={styles.moduleRow}
                                        >
                                            <Ionicons
                                                name={unlocked ? 'play-circle' : 'lock-closed'}
                                                size={18}
                                                color={unlocked ? '#D6F39A' : '#FCD34D'}
                                            />
                                            <Text style={styles.moduleTitle} numberOfLines={1}>
                                                {mod.title}
                                            </Text>
                                            <Ionicons
                                                name={unlocked ? 'eye-outline' : 'key-outline'}
                                                size={15}
                                                color="#D6F39A"
                                            />
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ) : null}

                        <View style={styles.vipFooter}>
                            <View style={styles.vipPriceWrap}>
                                <Ionicons name="pricetag-outline" size={15} color="#D6F39A" />
                                <Text style={styles.vipPriceValue}>
                                    {formatToman(flagship.discount_price ?? flagship.price)}
                                </Text>
                            </View>
                            <Pressable
                                accessibilityRole="button"
                                onPress={() => navigation.navigate('CourseDetail', { slug: flagship.slug })}
                                style={({ pressed }) => [styles.vipCtaBtn, pressed && styles.pressed]}
                            >
                                <Ionicons
                                    name={isVipUnlocked ? 'play' : 'rocket-outline'}
                                    size={15}
                                    color="#10382B"
                                />
                                <Text style={styles.vipCtaText}>
                                    {isVipUnlocked ? 'ورود به دوره' : 'مشاهده و شروع'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ) : null}

                {/* 4. Compact Next Session Pill */}
                {data?.next_session ? (
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate('Sessions')}
                        style={[styles.nextSessionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                        <View style={styles.nextSessionRight}>
                            <View style={[styles.sessionIconBox, { backgroundColor: colors.primarySoft }]}>
                                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.nextSessionCopy}>
                                <Text style={[styles.nextSessionTitle, { color: colors.text }]} numberOfLines={1}>
                                    {data.next_session.title}
                                </Text>
                                {data.next_session.scheduled_at ? (
                                    <View style={styles.userMiniRow}>
                                        <Ionicons name="time-outline" size={12} color={colors.muted} />
                                        <Text style={[styles.nextSessionMeta, { color: colors.muted }]}>
                                            {data.next_session.scheduled_at}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                        <Ionicons name="chevron-back" size={18} color={colors.muted} />
                    </Pressable>
                ) : null}

                {/* 5. Other Courses Rail */}
                {section('دوره‌های تخصصی', 'school-outline', () => navigation.navigate('Courses'))}
                {loading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator color={colors.primary} />
                    </View>
                ) : otherCourses.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
                        {otherCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                compact
                                onPress={() => navigation.navigate('CourseDetail', { slug: course.slug })}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={[styles.empty, { backgroundColor: colors.surface }]}>
                        <Ionicons name="school-outline" size={28} color={colors.muted} />
                        {error ? <Text style={[styles.body, { color: colors.muted }]}>{error}</Text> : null}
                    </View>
                )}

                {/* 6. Podcasts & Books Rail */}
                {section('پادکست و کتاب', 'headset-outline', () => navigation.navigate('Shop'))}
                {data?.featured_products?.length ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
                        {data.featured_products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onPress={() => navigation.navigate('ProductDetail', { slug: product.slug })}
                            />
                        ))}
                    </ScrollView>
                ) : null}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        maxWidth: 1060,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 32,
        gap: 14,
    },
    topbar: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    brand: { flexDirection: 'row-reverse', gap: 10, alignItems: 'center' },
    logo: { width: 40, height: 40, borderRadius: 14 },
    nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    greeting: { fontFamily: 'VazirmatnBlack', fontSize: 15, lineHeight: 24, textAlign: 'right' },
    vipBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 12,
    },
    vipBadgeText: { fontFamily: 'VazirmatnBold', fontSize: 10, color: '#B45309' },
    userMiniRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
    brandCaption: { fontFamily: 'Vazirmatn', fontSize: 11, lineHeight: 18, textAlign: 'right' },
    topActions: { flexDirection: 'row', gap: 6 },
    iconButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickDock: {
        flexDirection: 'row-reverse',
        gap: 8,
    },
    dockTile: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
        gap: 5,
    },
    dockIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dockLabel: { fontFamily: 'VazirmatnBold', fontSize: 11 },
    vipCard: {
        backgroundColor: '#10382B',
        borderRadius: 22,
        padding: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(214, 243, 154, 0.25)',
    },
    vipPillRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    vipPill: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#D6F39A',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    vipPillText: { fontFamily: 'VazirmatnBlack', fontSize: 11, color: '#10382B' },
    vipStatusChip: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 10,
    },
    vipStatusText: { fontFamily: 'VazirmatnBold', fontSize: 11, color: '#D6F39A' },
    vipTitle: { fontFamily: 'VazirmatnBlack', fontSize: 17, lineHeight: 26, color: '#FFFFFF', textAlign: 'right' },
    vipMetricsRow: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 8,
    },
    vipMetricChip: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    vipMetricText: { fontFamily: 'VazirmatnBold', fontSize: 11, color: '#E2F2EA' },
    vipProgressBox: { gap: 6, marginTop: 2 },
    vipProgressRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
    vipProgressLabel: { fontFamily: 'VazirmatnBold', fontSize: 12, color: '#D6F39A' },
    modulesList: { gap: 6, marginTop: 2 },
    moduleRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 12,
    },
    moduleTitle: { fontFamily: 'VazirmatnBold', fontSize: 12, color: '#FFFFFF', flex: 1, textAlign: 'right' },
    vipFooter: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.14)',
        paddingTop: 12,
        marginTop: 2,
    },
    vipPriceWrap: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    vipPriceValue: { fontFamily: 'VazirmatnBlack', fontSize: 15, color: '#D6F39A', textAlign: 'right' },
    vipCtaBtn: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#D6F39A',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
    },
    vipCtaText: { fontFamily: 'VazirmatnBlack', fontSize: 12, color: '#10382B' },
    nextSessionCard: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    sessionIconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextSessionRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, flex: 1 },
    nextSessionCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
    nextSessionTitle: { fontFamily: 'VazirmatnBold', fontSize: 13, textAlign: 'right' },
    nextSessionMeta: { fontFamily: 'Vazirmatn', fontSize: 11, textAlign: 'right' },
    sectionHeading: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    sectionTitleWrap: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    sectionTitle: { fontFamily: 'VazirmatnBold', fontSize: 15, textAlign: 'right' },
    moreLink: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    rail: { gap: 12, paddingBottom: 4, flexDirection: 'row-reverse' },
    body: { fontFamily: 'Vazirmatn', fontSize: 12, textAlign: 'center' },
    loading: { minHeight: 100, justifyContent: 'center', alignItems: 'center' },
    empty: { padding: 20, borderRadius: 18, gap: 8, alignItems: 'center' },
    pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
