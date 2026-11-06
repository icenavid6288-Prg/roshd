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
        try {
            setError(null);
            setData(await api<HomeData>('/api/v1/home', { auth: false }));
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'دریافت پیشنهادها انجام نشد.');
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const services: {
        title: string;
        icon: IconName;
        badge?: string;
        bgLight: string;
        bgDark: string;
        iconColor: string;
        action: () => void;
    }[] = [
        {
            title: 'باشگاه VIP',
            icon: 'ribbon-outline',
            badge: 'ویژه',
            bgLight: '#FEF3C7',
            bgDark: '#3B2F13',
            iconColor: '#D97706',
            action: () => navigation.navigate('Courses'),
        },
        {
            title: 'دوره‌ها',
            icon: 'school-outline',
            bgLight: '#E6F4EA',
            bgDark: '#193529',
            iconColor: '#15803D',
            action: () => navigation.navigate('Courses'),
        },
        {
            title: 'رزرو کوچینگ',
            icon: 'people-outline',
            bgLight: '#E0F2FE',
            bgDark: '#162C3D',
            iconColor: '#0369A1',
            action: () => navigation.navigate('Sessions'),
        },
        {
            title: 'فروشگاه',
            icon: 'bag-handle-outline',
            bgLight: '#FCE7F3',
            bgDark: '#381B2C',
            iconColor: '#BE185D',
            action: () => navigation.navigate('Shop'),
        },
        {
            title: 'تکالیف و آزمون',
            icon: 'clipboard-outline',
            badge: '۱',
            bgLight: '#EDE9FE',
            bgDark: '#271E40',
            iconColor: '#6D28D9',
            action: () => navigation.navigate('Dashboard'),
        },
        {
            title: 'اهداف من',
            icon: 'flag-outline',
            bgLight: '#ECFCCB',
            bgDark: '#263616',
            iconColor: '#4D7C0F',
            action: () => navigation.navigate('Goals'),
        },
        {
            title: 'گواهینامه‌ها',
            icon: 'medal-outline',
            bgLight: '#FFEDD5',
            bgDark: '#3B2313',
            iconColor: '#C2410C',
            action: () => navigation.navigate('Dashboard'),
        },
        {
            title: 'پشتیبانی',
            icon: 'chatbubbles-outline',
            bgLight: '#E0E7FF',
            bgDark: '#1E2540',
            iconColor: '#4338CA',
            action: () => navigation.navigate('Support'),
        },
    ];

    const section = (title: string, action: () => void) => (
        <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`مشاهده همه ${title}`}
                onPress={action}
                style={({ pressed }) => [styles.moreLink, pressed && styles.pressed]}
            >
                <Text style={[styles.moreText, { color: colors.primary }]}>مشاهده همه</Text>
                <Ionicons name="arrow-back" size={15} color={colors.primary} />
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
                {/* 1. Compact Profile & Brand Header */}
                <View style={styles.topbar}>
                    <View style={styles.brand}>
                        <Image source={require('../../assets/roshd-logo.png')} style={styles.logo} />
                        <View>
                            <View style={styles.nameRow}>
                                <Text style={[styles.greeting, { color: colors.text }]}>
                                    سلام {user?.name?.split(' ')[0] || 'دوست رشد'} عزیز
                                </Text>
                                <View style={styles.vipBadge}>
                                    <Ionicons name="ribbon" size={11} color="#B45309" />
                                    <Text style={styles.vipBadgeText}>VIP</Text>
                                </View>
                            </View>
                            <Text style={[styles.brandCaption, { color: colors.muted }]}>
                                عضو باشگاه طراحی آینده نوجوان • ۱۲۵۰ امتیاز
                            </Text>
                        </View>
                    </View>
                    <View style={styles.topActions}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={isDark ? 'فعال کردن حالت روشن' : 'فعال کردن حالت تاریک'}
                            onPress={toggleTheme}
                            style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color={colors.text} />
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="یادآوری‌های من"
                            onPress={() => navigation.navigate('Reminders')}
                            style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <Ionicons name="notifications-outline" size={18} color={colors.text} />
                        </Pressable>
                    </View>
                </View>

                {/* Compact Search Bar */}
                <Pressable
                    accessibilityRole="button"
                    onPress={() => navigation.navigate('Courses')}
                    style={({ pressed }) => [
                        styles.search,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        pressed && styles.pressed,
                    ]}
                >
                    <Ionicons name="search-outline" size={18} color={colors.primary} />
                    <Text style={[styles.searchText, { color: colors.muted }]}>
                        جستجوی دوره، جلسه کوچینگ، آزمون یا ابزار رشد...
                    </Text>
                    <View style={[styles.searchEnd, { backgroundColor: colors.surfaceAlt }]}>
                        <Ionicons name="options-outline" size={16} color={colors.muted} />
                    </View>
                </Pressable>

                {/* Slim Live Next Class Status Bar (Replaces Bulky Hero Banner) */}
                <View style={styles.liveStatusBar}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate('Dashboard')}
                        style={styles.liveStatusRight}
                    >
                        <View style={styles.liveIconBox}>
                            <Ionicons name="business-outline" size={18} color="#FCD34D" />
                        </View>
                        <View style={styles.liveCopy}>
                            <View style={styles.livePillRow}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveEyebrow}>کلاس بعدی طراحی آینده نوجوان (حضوری)</Text>
                            </View>
                            <Text style={styles.liveTitle} numberOfLines={1}>
                                کارگاه حضوری هدف‌گذاری و نقشه مسیر ۹۰ روزه
                            </Text>
                            <Text style={styles.liveMeta} numberOfLines={1}>
                                سه‌شنبه ۹ اردیبهشت • ساعت ۱۷:۰۰ تا ۱۹:۰۰
                            </Text>
                        </View>
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate('Chat')}
                        style={({ pressed }) => [styles.qrBtn, pressed && styles.pressed]}
                    >
                        <Ionicons name="chatbubbles-outline" size={14} color="#0D2E22" />
                        <Text style={styles.qrBtnText}>گروه دوره</Text>
                    </Pressable>
                </View>

                {/* 2. Super-App 8-Item Service Grid (2x4 Colored Icons) */}
                <View style={[styles.services, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.serviceHeading}>
                        <Text style={[styles.serviceSectionTitle, { color: colors.text }]}>میز خدمات سریع رشد</Text>
                        <Text style={[styles.serviceCount, { color: colors.muted }]}>همه‌چیز در یک نگاه</Text>
                    </View>
                    <View style={styles.serviceGrid}>
                        {services.map((service) => (
                            <Pressable
                                key={service.title}
                                accessibilityRole="button"
                                onPress={service.action}
                                style={({ pressed }) => [
                                    styles.service,
                                    { width: wide ? '12.5%' : '25%' },
                                    pressed && styles.pressed,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.serviceIcon,
                                        { backgroundColor: isDark ? service.bgDark : service.bgLight },
                                    ]}
                                >
                                    <Ionicons name={service.icon} size={22} color={service.iconColor} />
                                    {service.badge ? (
                                        <View style={styles.serviceBadge}>
                                            <Text style={styles.serviceBadgeText}>{service.badge}</Text>
                                        </View>
                                    ) : null}
                                </View>
                                <Text style={[styles.serviceLabel, { color: colors.text }]}>{service.title}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* 3. Twin Side-by-Side Status Widgets */}
                <View style={styles.twinGrid}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate('Sessions')}
                        style={({ pressed }) => [
                            styles.twinCard,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            pressed && styles.pressed,
                        ]}
                    >
                        <View style={styles.twinTop}>
                            <Text style={[styles.twinEyebrow, { color: colors.muted }]}>وضعیت حضور VIP</Text>
                            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                        </View>
                        <Text style={[styles.twinValue, { color: colors.text }]}>{faNum(95)}٪ حضور منظم</Text>
                        <Text style={[styles.twinSub, { color: colors.muted }]}>۲ جلسه حضوری • ۱ آنلاین</Text>
                        <View style={styles.twinProgressWrap}>
                            <ProgressBar value={95} />
                        </View>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate('Goals')}
                        style={({ pressed }) => [
                            styles.twinCard,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            pressed && styles.pressed,
                        ]}
                    >
                        <View style={styles.twinTop}>
                            <Text style={[styles.twinEyebrow, { color: colors.muted }]}>اهداف و تکالیف</Text>
                            <Ionicons name="flame-outline" size={16} color="#D97706" />
                        </View>
                        <Text style={[styles.twinValue, { color: colors.text }]}>{faNum(3)} هدف در حال اجرا</Text>
                        <Text style={[styles.twinSub, { color: colors.muted }]}>میانگین پیشرفت: {faNum(68)}٪</Text>
                        <View style={styles.twinProgressWrap}>
                            <ProgressBar value={68} />
                        </View>
                    </Pressable>
                </View>

                {/* 4. Horizontal Course Slider */}
                {section('دوره‌های منتخب آکادمی', () => navigation.navigate('Courses'))}
                {loading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator color={colors.primary} />
                    </View>
                ) : data?.featured_courses?.length ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
                        {data.featured_courses.map((course) => (
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
                        <Ionicons name="school-outline" size={26} color={colors.primary} />
                        <Text style={[styles.body, { color: colors.muted }]}>
                            {error || 'دوره‌های تازه به‌زودی اینجا قرار می‌گیرند.'}
                        </Text>
                    </View>
                )}

                {/* 5. Horizontal Shop Products Slider */}
                {section('ابزارها و فروشگاه رشد', () => navigation.navigate('Shop'))}
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
    brandCaption: { fontFamily: 'Vazirmatn', fontSize: 11, lineHeight: 18, textAlign: 'right' },
    topActions: { flexDirection: 'row', gap: 6 },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    search: {
        minHeight: 44,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 9,
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 15,
        borderWidth: 1,
    },
    searchText: { fontFamily: 'Vazirmatn', fontSize: 12, lineHeight: 20, flex: 1, textAlign: 'right' },
    searchEnd: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    liveStatusBar: {
        backgroundColor: '#123E30',
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.35)',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    liveStatusRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, flex: 1 },
    liveIconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    liveCopy: { flex: 1, alignItems: 'flex-end' },
    livePillRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D6F39A' },
    liveEyebrow: { fontFamily: 'VazirmatnBold', fontSize: 10, color: '#D6F39A', textAlign: 'right' },
    liveTitle: { fontFamily: 'VazirmatnBold', fontSize: 12, color: '#FFFFFF', textAlign: 'right', marginTop: 2 },
    liveMeta: { fontFamily: 'Vazirmatn', fontSize: 10, color: '#C5D7CA', textAlign: 'right' },
    qrBtn: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FBBF24',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
    },
    qrBtnText: { fontFamily: 'VazirmatnBlack', fontSize: 11, color: '#0D2E22' },
    services: { borderRadius: 22, padding: 13, borderWidth: 1 },
    serviceHeading: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingBottom: 10,
    },
    serviceSectionTitle: { fontFamily: 'VazirmatnBold', fontSize: 14, textAlign: 'right' },
    serviceCount: { fontFamily: 'VazirmatnBold', fontSize: 10 },
    serviceGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', rowGap: 12 },
    service: { alignItems: 'center', gap: 6, paddingVertical: 2 },
    serviceIcon: {
        width: 50,
        height: 50,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    serviceBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 8,
    },
    serviceBadgeText: { fontFamily: 'VazirmatnBlack', fontSize: 9, color: '#FFFFFF' },
    serviceLabel: { fontFamily: 'VazirmatnBold', fontSize: 11, lineHeight: 18, textAlign: 'center' },
    twinGrid: { flexDirection: 'row-reverse', gap: 10 },
    twinCard: { flex: 1, borderRadius: 18, padding: 12, borderWidth: 1, gap: 4 },
    twinTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
    twinEyebrow: { fontFamily: 'VazirmatnBold', fontSize: 10, textAlign: 'right' },
    twinValue: { fontFamily: 'VazirmatnBlack', fontSize: 13, textAlign: 'right', marginTop: 2 },
    twinSub: { fontFamily: 'Vazirmatn', fontSize: 10, textAlign: 'right' },
    twinProgressWrap: { marginTop: 6 },
    sectionHeading: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    sectionTitle: { fontFamily: 'VazirmatnBold', fontSize: 15, textAlign: 'right' },
    moreLink: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
    moreText: { fontFamily: 'VazirmatnBold', fontSize: 11 },
    rail: { gap: 12, paddingBottom: 4, flexDirection: 'row-reverse' },
    body: { fontFamily: 'Vazirmatn', fontSize: 12, lineHeight: 22, textAlign: 'right' },
    loading: { minHeight: 100, justifyContent: 'center', alignItems: 'center' },
    empty: { padding: 20, borderRadius: 18, gap: 10, alignItems: 'center' },
    pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
