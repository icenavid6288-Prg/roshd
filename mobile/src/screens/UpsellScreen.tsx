import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton, Screen } from '../components';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { openSitePage } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Upsell'>;

export function UpsellScreen({ route, navigation }: Props) {
    const { colors } = useTheme();
    const courseTitle = route.params?.courseTitle || 'طراحی آینده نوجوان (VIP)';

    const handleUpgrade = () => {
        openSitePage('/courses/designing-teen-future-vip').catch(() => {});
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Visual VIP Hero Card */}
                <View style={[styles.heroCard, { backgroundColor: colors.primaryDark, borderColor: colors.gold }]}>
                    <View style={styles.badgeRow}>
                        <View style={styles.vipBadge}>
                            <Ionicons name="ribbon" size={14} color="#D6F39A" />
                            <Text style={styles.vipBadgeText}>دسترسی پریمیوم (VIP)</Text>
                        </View>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Ionicons key={i} name="star" size={14} color="#F59E0B" />
                            ))}
                        </View>
                    </View>

                    <Text style={styles.heroTitle} numberOfLines={2}>
                        {courseTitle}
                    </Text>

                    {/* Icon Chips Row instead of long paragraph */}
                    <View style={styles.heroIconRow}>
                        <View style={styles.heroChip}>
                            <Ionicons name="videocam-outline" size={14} color="#D6F39A" />
                            <Text style={styles.heroChipText}>جلسات کامل</Text>
                        </View>
                        <View style={styles.heroChip}>
                            <Ionicons name="chatbubbles-outline" size={14} color="#D6F39A" />
                            <Text style={styles.heroChipText}>چت اساتید</Text>
                        </View>
                        <View style={styles.heroChip}>
                            <Ionicons name="calendar-outline" size={14} color="#D6F39A" />
                            <Text style={styles.heroChipText}>کارگاه حضوری</Text>
                        </View>
                    </View>

                    <View style={styles.priceBox}>
                        <View style={styles.priceRight}>
                            <Ionicons name="pricetag-outline" size={18} color="#D6F39A" />
                            <Text style={styles.priceValue}>{faNum('۵٬۴۰۰٬۰۰۰')} تومان</Text>
                        </View>
                        <View style={styles.discountBadge}>
                            <Ionicons name="flame" size={12} color="#0D2E22" />
                            <Text style={styles.discountText}>۲۰٪ تخفیف</Text>
                        </View>
                    </View>

                    <PrimaryButton
                        label="ارتقا به VIP و باز کردن قفل‌ها"
                        icon="sparkles"
                        onPress={handleUpgrade}
                    />
                </View>

                {/* 2x2 Visual Icon Features Grid instead of long text cards */}
                <View style={styles.grid}>
                    {[
                        {
                            title: 'اتاق یادگیری کامل',
                            badge: 'ویدیو + آزمون',
                            icon: 'play-circle' as const,
                        },
                        {
                            title: 'چت مستقیم اساتید',
                            badge: 'رفع اشکال VIP',
                            icon: 'chatbubbles' as const,
                        },
                        {
                            title: 'کارگاه‌های حضوری',
                            badge: 'دعوت‌نامه اختصاصی',
                            icon: 'calendar' as const,
                        },
                        {
                            title: 'پرونده استعدادیابی',
                            badge: 'تحلیل اختصاصی',
                            icon: 'analytics' as const,
                        },
                    ].map((f, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.featureTile,
                                { backgroundColor: colors.surface, borderColor: colors.border },
                            ]}
                        >
                            <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
                                <Ionicons name={f.icon} size={26} color={colors.primary} />
                            </View>
                            <Text style={[styles.featureTitle, { color: colors.text }]} numberOfLines={1}>
                                {f.title}
                            </Text>
                            <View style={[styles.tileBadge, { backgroundColor: colors.surfaceAlt }]}>
                                <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                                <Text style={[styles.tileBadgeText, { color: colors.muted }]}>{f.badge}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Back Button */}
                <View style={styles.backRow}>
                    <PrimaryButton
                        label="بازگشت"
                        icon="arrow-forward-outline"
                        tone="subtle"
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
    heroCard: {
        borderRadius: radius.xl,
        padding: spacing.xl,
        borderWidth: 1.5,
        gap: spacing.md,
    },
    badgeRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
    vipBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(214, 243, 154, 0.15)',
    },
    vipBadgeText: { color: '#D6F39A', fontSize: 11, fontWeight: '800' },
    starsRow: { flexDirection: 'row', gap: 2 },
    heroTitle: { color: '#FFFFFF', ...typography.title, fontSize: 18, lineHeight: 28, textAlign: 'right' },
    heroIconRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
    heroChip: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: radius.pill,
    },
    heroChipText: { color: '#E2F2EA', fontSize: 11, fontWeight: '700' },
    priceBox: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.25)',
        padding: spacing.md,
        borderRadius: radius.lg,
    },
    priceRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    priceValue: { color: '#D6F39A', ...typography.title, fontSize: 16 },
    discountBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F59E0B',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.md,
    },
    discountText: { color: '#0D2E22', fontSize: 11, fontWeight: '800' },
    grid: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 10,
    },
    featureTile: {
        width: '48%',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: 8,
    },
    iconWrap: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureTitle: { ...typography.subtitle, fontSize: 13, textAlign: 'center' },
    tileBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.pill,
    },
    tileBadgeText: { fontSize: 10, fontWeight: '700' },
    backRow: { marginTop: spacing.xs },
});
