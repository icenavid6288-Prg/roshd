import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { fetchDashboard, type DashboardPayload } from '../api/endpoints';
import {
    Badge,
    Button,
    Card,
    EmptyState,
    Loading,
    ProgressBar,
    SectionHeader,
    StatCard,
} from '../components';
import { formatDate, formatPrice } from '../utils/format';
import type { TabStackNavigation } from '../navigation/types';

export function DashboardScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation<TabStackNavigation>();
    const [data, setData] = useState<DashboardPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            const payload = await fetchDashboard();
            setData(payload);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    if (loading && !data) {
        return <Loading label="در حال بارگذاری داشبورد حرفه‌ای…" />;
    }

    const stats = data?.stats;
    const enrollments = data?.enrollments ?? [];
    const orders = data?.recentOrders ?? [];

    const allAccessModules: {
        title: string;
        subtitle: string;
        icon: keyof typeof Ionicons.glyphMap;
        onPress: () => void;
        accent?: string;
    }[] = [
        {
            title: 'پنل مدیریت کل سایت (Admin)',
            subtitle: 'کنترل ۲۱ بخش ادمین، کاربران و دوره‌ها',
            icon: 'shield-checkmark-outline',
            onPress: () => navigation.navigate('AdminPanel'),
            accent: '#D4AF37',
        },
        {
            title: 'آکادمی و دوره‌های آموزشی',
            subtitle: 'دسترسی به سرفصل‌ها و ویدیوها',
            icon: 'school-outline',
            onPress: () => navigation.navigate('Courses'),
        },
        {
            title: 'جلسات کوچینگ و مشاوره',
            subtitle: 'رزرو وقت و مدیریت جلسات ۱ به ۱',
            icon: 'calendar-outline',
            onPress: () => navigation.navigate('Sessions'),
        },
        {
            title: 'آزمون‌ها، تکالیف و گواهینامه‌ها',
            subtitle: 'ارزیابی تخصصی و دریافت مدرک',
            icon: 'ribbon-outline',
            onPress: () => navigation.navigate('Goals'),
        },
        {
            title: 'فروشگاه محصولات و بسته‌ها',
            subtitle: 'کتاب‌ها، کارگاه‌ها و فایل‌های تخصصی',
            icon: 'cart-outline',
            onPress: () => navigation.navigate('Shop'),
        },
        {
            title: 'یادآوری‌های هوشمند چندکاناله',
            subtitle: 'تنظیم اعلان پیامک، تلگرام، ایتا و ایمیل',
            icon: 'notifications-outline',
            onPress: () => navigation.navigate('Reminders'),
        },
        {
            title: 'تیکت و پشتیبانی تخصصی',
            subtitle: 'ارتباط مستقیم با واحد آموزش و فنی',
            icon: 'chatbubbles-outline',
            onPress: () => navigation.navigate('Support'),
        },
        {
            title: 'پروفایل و تنظیمات حساب',
            subtitle: 'اطلاعات کاربری، امنیت و اتصال سرور',
            icon: 'person-circle-outline',
            onPress: () => navigation.navigate('ProfileTab'),
        },
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.bg }]}
            contentContainerStyle={styles.content}
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
            {/* Professional Executive Header */}
            <View style={[styles.execHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.execTopRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.execWelcome, { color: colors.muted }]}>
                            داشبورد جامع کاربری و مدیریتی
                        </Text>
                        <Text style={[styles.execName, { color: colors.text }]}>
                            {user?.name || 'کاربر ارشد بهار زندگی'}
                        </Text>
                    </View>
                    <Badge label="دسترسی کامل" tone="primary" />
                </View>

                {/* Direct Admin Command Center Entry */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('AdminPanel')}
                    style={[styles.adminBannerBtn, { backgroundColor: '#0B3B2B', borderColor: '#D4AF37' }]}
                >
                    <View style={styles.adminBannerIcon}>
                        <Ionicons name="shield-checkmark" size={20} color="#0B3B2B" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.adminBannerTitle}>ورود به پنل مدیریت کل سایت (ویژه ادمین)</Text>
                        <Text style={styles.adminBannerSub}>
                            مدیریت دوره‌ها، کاربران، CRM، مالی، آزمون‌ها، اتوماسیون و تنظیمات
                        </Text>
                    </View>
                    <Ionicons name="chevron-back" size={18} color="#F4D06F" />
                </TouchableOpacity>
            </View>

            {/* Executive KPI Grid */}
            <View style={styles.statsGrid}>
                <StatCard
                    label="دوره‌های ثبت‌نام‌شده"
                    value={stats?.enrolledCoursesCount ?? 0}
                    icon={<Ionicons name="book-outline" size={20} color={colors.primary} />}
                />
                <StatCard
                    label="دوره‌های در حال مطالعه"
                    value={stats?.inProgressCount ?? 0}
                    accent={colors.accent}
                    icon={<Ionicons name="play-circle-outline" size={20} color={colors.accent} />}
                />
            </View>
            <View style={[styles.statsGrid, { marginTop: 10 }]}>
                <StatCard
                    label="دوره‌های تکمیل‌شده"
                    value={stats?.completedCount ?? 0}
                    accent={colors.success}
                    icon={<Ionicons name="checkmark-done-outline" size={20} color={colors.success} />}
                />
                <StatCard
                    label="گواهینامه‌های رسمی"
                    value={stats?.certificatesCount ?? 0}
                    accent={colors.info}
                    icon={<Ionicons name="ribbon-outline" size={20} color={colors.info} />}
                />
            </View>

            {/* Complete System Access Hub */}
            <View style={styles.section}>
                <SectionHeader
                    title="دسترسی سریع به تمامی بخش‌های سامانه"
                    subtitle="مدیریت یکپارچه آموزش، کوچینگ، مالی و پنل ادمین"
                />
                <View style={styles.hubGrid}>
                    {allAccessModules.map((mod) => (
                        <TouchableOpacity
                            key={mod.title}
                            activeOpacity={0.8}
                            onPress={mod.onPress}
                            style={[
                                styles.hubCard,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: mod.accent ? mod.accent : colors.border,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.hubIconBox,
                                    {
                                        backgroundColor: mod.accent
                                            ? 'rgba(212, 175, 55, 0.15)'
                                            : colors.primarySoft,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={mod.icon}
                                    size={20}
                                    color={mod.accent ? mod.accent : colors.primary}
                                />
                            </View>
                            <Text style={[styles.hubTitle, { color: colors.text }]} numberOfLines={1}>
                                {mod.title}
                            </Text>
                            <Text style={[styles.hubSub, { color: colors.muted }]} numberOfLines={2}>
                                {mod.subtitle}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Enrolled Courses & Progress */}
            <View style={styles.section}>
                <SectionHeader
                    title="دوره‌های فعال و وضعیت پیشرفت"
                    subtitle={
                        enrollments.length
                            ? `${enrollments.length} دوره در پرونده آموزشی شما`
                            : undefined
                    }
                    actionLabel="مشاهده آکادمی"
                    onAction={() => navigation.navigate('Courses')}
                />
                {enrollments.length === 0 ? (
                    <EmptyState
                        title="هنوز در دوره‌ای ثبت‌نام نکرده‌اید"
                        description="از بخش آکادمی، دوره‌های تخصصی کوچینگ و توسعه فردی را مشاهده و ثبت‌نام کنید."
                    />
                ) : (
                    enrollments.map((item) => (
                        <Card key={item.id}>
                            <View style={styles.enrollmentHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.courseTitle, { color: colors.text }]}>
                                        {item.course.title}
                                    </Text>
                                    {item.course.instructor ? (
                                        <Text style={[styles.instructor, { color: colors.muted }]}>
                                            مدرس: {item.course.instructor}
                                        </Text>
                                    ) : null}
                                </View>
                                <Badge
                                    label={item.completedAt ? 'تکمیل‌شده' : `${item.progress}%`}
                                    tone={item.completedAt ? 'success' : 'primary'}
                                />
                            </View>
                            <View style={{ marginVertical: 12 }}>
                                <ProgressBar value={item.progress} />
                            </View>
                            <View style={styles.enrollmentFooter}>
                                <Text style={[styles.smallNote, { color: colors.muted }]}>
                                    {item.course.lessonsCount ?? 0} جلسه آموزشی
                                </Text>
                                <Button
                                    title="ورود به اتاق یادگیری"
                                    fullWidth={false}
                                    variant="primary"
                                    onPress={() =>
                                        navigation.navigate('Learning', { slug: item.course.slug })
                                    }
                                />
                            </View>
                        </Card>
                    ))
                )}
            </View>

            {/* Financial Orders & Invoices */}
            {orders.length > 0 && (
                <View style={styles.section}>
                    <SectionHeader
                        title="سوابق مالی، سفارش‌ها و فاکتورها"
                        subtitle="آخرین تراکنش‌های ثبت‌شده در حساب کاربری"
                    />
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <View style={styles.orderRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.orderNumber, { color: colors.text }]}>
                                        فاکتور #{order.orderNumber}
                                    </Text>
                                    <Text style={[styles.orderMeta, { color: colors.muted }]}>
                                        {order.itemsCount} آیتم • {formatDate(order.createdAt)}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.orderAmount, { color: colors.primary }]}>
                                        {formatPrice(order.totalAmount)}
                                    </Text>
                                    <Badge
                                        label={order.status === 'paid' ? 'پرداخت موفق' : order.status}
                                        tone={order.status === 'paid' ? 'success' : 'warning'}
                                    />
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 40 },
    execHeader: {
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        marginBottom: 14,
    },
    execTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    execWelcome: {
        fontSize: 12,
        textAlign: 'right',
    },
    execName: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 2,
        textAlign: 'right',
    },
    adminBannerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    adminBannerIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#D4AF37',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adminBannerTitle: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        textAlign: 'right',
    },
    adminBannerSub: {
        color: '#D1FAE5',
        fontSize: 11,
        marginTop: 3,
        textAlign: 'right',
    },
    statsGrid: { flexDirection: 'row', gap: 10 },
    section: { marginTop: 24 },
    hubGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    hubCard: {
        width: '48%',
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
    },
    hubIconBox: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    hubTitle: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'right',
    },
    hubSub: {
        fontSize: 11,
        lineHeight: 16,
        marginTop: 4,
        textAlign: 'right',
    },
    enrollmentHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    courseTitle: { fontSize: 15, fontWeight: '700', textAlign: 'right' },
    instructor: { fontSize: 12, marginTop: 4, textAlign: 'right' },
    enrollmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    smallNote: { fontSize: 12 },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderNumber: { fontSize: 14, fontWeight: '700', textAlign: 'right' },
    orderMeta: { fontSize: 12, marginTop: 4, textAlign: 'right' },
    orderAmount: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
});
