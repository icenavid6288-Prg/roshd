import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    type TextInputProps,
    type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { faNum, price, radius, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';
import type { CoursePayload, ProductPayload } from '../api/types';
import { resolveAssetUrl } from '../api/client';

export type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
    const { colors } = useTheme();
    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }, style]} edges={['top', 'left', 'right']}>
            {children}
        </SafeAreaView>
    );
}

export function Loading({ label }: { label?: string }) {
    const { colors } = useTheme();
    return (
        <View style={[styles.center, { backgroundColor: colors.bg }]}>
            <View style={[styles.loadingMark, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Image source={require('../../assets/roshd-logo.png')} style={styles.loadingLogo} accessibilityLabel={label || 'لوگوی Roshd'} />
            </View>
            <ActivityIndicator size="small" color={colors.primary} style={styles.loadingSpinner} />
        </View>
    );
}

export function EmptyState({
    icon = 'leaf-outline',
    title,
    subtitle,
}: {
    icon?: IoniconName;
    title: string;
    subtitle?: string;
}) {
    const { colors } = useTheme();
    return (
        <View style={styles.empty}>
            <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm }}>
                <Ionicons name={icon} size={30} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
            {subtitle ? <Text style={[styles.emptySubtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
        </View>
    );
}

export function SectionHeader({
    title,
    actionLabel,
    onAction,
}: {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    const { colors } = useTheme();
    return (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            {actionLabel && onAction ? (
                <Pressable onPress={onAction} hitSlop={8} style={styles.sectionActionBtn}>
                    <Text style={[styles.sectionAction, { color: colors.primary }]}>{actionLabel}</Text>
                    <Ionicons name="arrow-back" size={14} color={colors.primary} />
                </Pressable>
            ) : null}
        </View>
    );
}

export function Chip({
    label,
    tone = 'primary',
    icon,
}: {
    label: string;
    tone?: 'primary' | 'gold' | 'muted' | 'danger';
    icon?: IoniconName;
}) {
    const { colors } = useTheme();
    const bgMap = {
        primary: colors.primarySoft,
        gold: colors.goldSoft,
        muted: colors.surfaceAlt,
        danger: colors.dangerSoft,
    };
    const fgMap = {
        primary: colors.primary,
        gold: '#92400E',
        muted: colors.muted,
        danger: colors.danger,
    };
    return (
        <View style={[styles.chip, { backgroundColor: bgMap[tone] }]}>
            {icon ? <Ionicons name={icon} size={12} color={fgMap[tone]} /> : null}
            <Text style={[styles.chipText, { color: fgMap[tone] }]}>{label}</Text>
        </View>
    );
}

export function SearchBar({
    value,
    onChangeText,
    placeholder = 'جستجو…',
}: {
    value: string;
    onChangeText: (val: string) => void;
    placeholder?: string;
}) {
    const { colors } = useTheme();
    return (
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={20} color={colors.muted} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.muted}
                style={[styles.searchInput, { color: colors.text }]}
            />
            {value.length > 0 ? (
                <Pressable onPress={() => onChangeText('')} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={colors.muted} />
                </Pressable>
            ) : null}
        </View>
    );
}

export function FilterChips({
    items,
    selected,
    onSelect,
}: {
    items: string[];
    selected: string;
    onSelect: (item: string) => void;
}) {
    const { colors } = useTheme();
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
        >
            {items.map((item) => {
                const active = item === selected;
                return (
                    <Pressable
                        key={item}
                        onPress={() => onSelect(item)}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: active ? colors.primary : colors.surface,
                                borderColor: active ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <Ionicons
                            name={active ? 'checkmark-circle' : 'pricetag-outline'}
                            size={13}
                            color={active ? colors.white : colors.muted}
                        />
                        <Text
                            style={[
                                styles.filterChipText,
                                { color: active ? colors.white : colors.text },
                            ]}
                        >
                            {item}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

export function PriceTag({
    priceValue,
    discount,
    isFree,
    size = 'md',
}: {
    priceValue: number;
    discount?: number | null;
    isFree?: boolean;
    size?: 'sm' | 'md' | 'lg';
}) {
    const { colors } = useTheme();
    const fontSize = size === 'lg' ? 18 : size === 'sm' ? 12 : 14;
    if (isFree || priceValue <= 0) {
        return <Text style={[styles.priceFree, { fontSize, color: colors.primary }]}>رایگان</Text>;
    }
    const hasDiscount = discount && discount > 0 && discount < priceValue;
    return (
        <View style={styles.priceRow}>
            <Text style={[styles.priceMain, { fontSize, color: colors.primary }]}>
                {price(hasDiscount ? discount : priceValue)}
            </Text>
            {hasDiscount ? <Text style={[styles.priceStrike, { color: colors.muted }]}>{faNum(priceValue)}</Text> : null}
        </View>
    );
}

export function ProgressBar({ value }: { value: number }) {
    const { colors } = useTheme();
    const clamped = Math.max(0, Math.min(100, value || 0));
    return (
        <View style={[styles.progressTrack, { backgroundColor: colors.surfaceAlt }]}>
            <View style={[styles.progressFill, { width: `${clamped}%`, backgroundColor: colors.primary }]} />
        </View>
    );
}

export function Avatar({ name, uri, size = 44 }: { name?: string; uri?: string | null; size?: number }) {
    const { colors } = useTheme();
    return (
        <View
            style={[
                styles.avatarFallback,
                { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primarySoft },
            ]}
        >
            <Ionicons name="person-circle-outline" size={size * 0.72} color={colors.primary} />
        </View>
    );
}

export function CourseCard({
    course,
    onPress,
    progress,
    compact = false,
}: {
    course: CoursePayload;
    onPress: () => void;
    progress?: number;
    compact?: boolean;
}) {
    const { colors } = useTheme();
    const [thumb, setThumb] = useState<string | null>(null);
    useEffect(() => {
        let mounted = true;
        resolveAssetUrl(course.thumbnail).then((u) => {
            if (mounted) setThumb(u);
        });
        return () => {
            mounted = false;
        };
    }, [course.thumbnail]);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
                compact && styles.cardCompact,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.thumbContainer}>
                {thumb ? (
                    <Image source={{ uri: thumb }} style={styles.cardThumb} resizeMode="cover" />
                ) : (
                    <View style={[styles.cardThumb, styles.cardThumbPlaceholder, { backgroundColor: colors.primaryDark }]}>
                        <Ionicons name="school-outline" size={32} color="#D6F39A" />
                        <Text style={styles.cardThumbPlaceholderText} numberOfLines={1}>
                            {course.title}
                        </Text>
                    </View>
                )}
                {course.category ? (
                    <View style={styles.floatingBadge}>
                        <Ionicons name="layers-outline" size={11} color="#10382B" />
                        <Text style={styles.floatingBadgeText}>{course.category}</Text>
                    </View>
                ) : null}
            </View>

            <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                    {course.title}
                </Text>

                <View style={styles.iconMetaRow}>
                    {course.instructor?.name ? (
                        <View style={styles.iconMetaItem}>
                            <Ionicons name="person-circle-outline" size={15} color={colors.primary} />
                            <Text style={[styles.cardMeta, { color: colors.muted }]} numberOfLines={1}>
                                {course.instructor.name}
                            </Text>
                        </View>
                    ) : null}
                    {course.lessons_count ? (
                        <View style={styles.iconMetaItem}>
                            <Ionicons name="videocam-outline" size={14} color={colors.muted} />
                            <Text style={[styles.cardMeta, { color: colors.muted }]}>
                                {faNum(course.lessons_count)}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {typeof progress === 'number' ? (
                    <View style={{ marginTop: 4, gap: 4 }}>
                        <ProgressBar value={progress} />
                        <View style={styles.progressBadgeRow}>
                            <Ionicons name="checkmark-done-circle-outline" size={14} color={colors.primary} />
                            <Text style={[styles.progressLabel, { color: colors.primary }]}>
                                {faNum(progress)}٪
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                        <PriceTag
                            priceValue={course.price}
                            discount={course.discount_price}
                            isFree={course.is_free}
                        />
                        <View style={[styles.goCircle, { backgroundColor: colors.primarySoft }]}>
                            <Ionicons name="arrow-back" size={14} color={colors.primary} />
                        </View>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

export function ProductCard({
    product,
    onPress,
}: {
    product: ProductPayload;
    onPress: () => void;
}) {
    const { colors } = useTheme();
    const [image, setImage] = useState<string | null>(null);
    useEffect(() => {
        let mounted = true;
        resolveAssetUrl(product.image).then((u) => {
            if (mounted) setImage(u);
        });
        return () => {
            mounted = false;
        };
    }, [product.image]);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.productCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && styles.pressed,
            ]}
        >
            {image ? (
                <Image source={{ uri: image }} style={styles.productImage} resizeMode="cover" />
            ) : (
                <View style={[styles.productImage, styles.cardThumbPlaceholder, { backgroundColor: colors.primaryDark }]}>
                    <Ionicons name="book-outline" size={28} color="#D6F39A" />
                    <Text style={styles.cardThumbPlaceholderText} numberOfLines={1}>
                        {product.title}
                    </Text>
                </View>
            )}
            <View style={styles.cardBodyCompact}>
                <Text style={[styles.cardTitle, { color: colors.text, fontSize: 14 }]} numberOfLines={1}>
                    {product.title}
                </Text>
                {product.author ? (
                    <View style={styles.iconMetaItem}>
                        <Ionicons name="person-outline" size={12} color={colors.muted} />
                        <Text style={[styles.cardMeta, { color: colors.muted }]} numberOfLines={1}>
                            {product.author}
                        </Text>
                    </View>
                ) : null}
                <View style={styles.productFooterRow}>
                    <PriceTag priceValue={product.price} discount={product.discount_price} size="sm" />
                    <Ionicons name="chevron-back-circle-outline" size={18} color={colors.primary} />
                </View>
            </View>
        </Pressable>
    );
}

export function PrimaryButton({
    title,
    label,
    icon,
    onPress,
    loading = false,
    variant = 'primary',
    tone,
    disabled = false,
}: {
    title?: string;
    label?: string;
    icon?: IoniconName;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'danger' | 'subtle';
    tone?: 'primary' | 'subtle';
    disabled?: boolean;
}) {
    const { colors } = useTheme();
    const resolvedVariant = tone === 'subtle' ? 'subtle' : variant;
    const textLabel = title || label || '';
    const bg =
        resolvedVariant === 'gold' || resolvedVariant === 'secondary'
            ? colors.gold
            : resolvedVariant === 'outline'
            ? 'transparent'
            : resolvedVariant === 'subtle'
            ? colors.surfaceAlt
            : resolvedVariant === 'danger'
            ? colors.danger
            : colors.primary;
    const fg =
        resolvedVariant === 'gold' || resolvedVariant === 'secondary'
            ? '#0F172A'
            : resolvedVariant === 'outline'
            ? colors.primary
            : resolvedVariant === 'subtle'
            ? colors.text
            : colors.white;

    return (
        <Pressable
            disabled={disabled || loading}
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: bg,
                    borderWidth: resolvedVariant === 'outline' ? 1.5 : 0,
                    borderColor: colors.primary,
                    opacity: disabled || loading ? 0.6 : pressed ? 0.88 : 1,
                },
            ]}
        >
            {loading ? (
                <ActivityIndicator color={fg} />
            ) : (
                <View style={styles.buttonContent}>
                    {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
                    <Text style={[styles.buttonText, { color: fg }]}>{textLabel}</Text>
                </View>
            )}
        </Pressable>
    );
}

export function Field({
    label,
    style,
    ...props
}: TextInputProps & { label?: string }) {
    const { colors } = useTheme();
    return (
        <View style={styles.fieldWrap}>
            {label ? <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text> : null}
            <TextInput
                placeholderTextColor={colors.muted}
                style={[
                    styles.input,
                    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                    style,
                ]}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, minHeight: 0 },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    loadingMark: {
        width: 104,
        height: 104,
        borderRadius: 32,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0B3B2B',
        shadowOpacity: 0.12,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
    },
    loadingLogo: { width: 78, height: 78, borderRadius: 23 },
    loadingSpinner: { marginTop: 20 },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: { ...typography.title, textAlign: 'center' },
    emptySubtitle: {
        ...typography.small,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    sectionHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    sectionTitle: { ...typography.title },
    sectionActionBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
    sectionAction: { ...typography.small, fontWeight: '700' },
    chip: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.pill,
        alignSelf: 'flex-start',
    },
    chipText: { fontSize: 11, fontWeight: '700' },
    searchBox: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        minHeight: 50,
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        textAlign: 'right',
        paddingVertical: 6,
    },
    filterChipsRow: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    filterChip: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 13,
        paddingVertical: 7,
        borderRadius: radius.pill,
        borderWidth: 1,
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '700',
    },
    priceRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm },
    priceMain: { fontWeight: '800' },
    priceFree: { fontWeight: '800' },
    priceStrike: {
        fontSize: 12,
        textDecorationLine: 'line-through',
    },
    progressTrack: {
        height: 8,
        borderRadius: radius.pill,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: radius.pill,
    },
    progressBadgeRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
    },
    progressLabel: { ...typography.tiny, fontWeight: '700' },
    avatarFallback: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: { fontWeight: '800' },
    card: {
        borderRadius: radius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    cardCompact: { width: 256 },
    thumbContainer: { position: 'relative' },
    cardThumb: { width: '100%', height: 156 },
    cardThumbPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        gap: 6,
    },
    cardThumbPlaceholderText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
        textAlign: 'center',
    },
    floatingBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#D6F39A',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: radius.pill,
    },
    floatingBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#10382B',
    },
    cardBody: { padding: 14, gap: 8 },
    cardBodyCompact: { padding: 12, gap: 6 },
    iconMetaRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    iconMetaItem: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
    },
    cardTitle: { ...typography.subtitle },
    cardMeta: { ...typography.small, fontSize: 11 },
    cardFooter: {
        marginTop: 2,
        paddingTop: 8,
        borderTopWidth: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    goCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productCard: {
        width: 172,
        borderRadius: radius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    productImage: { width: '100%', height: 140 },
    productFooterRow: {
        marginTop: 2,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
    button: {
        minHeight: 50,
        paddingVertical: 12,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: { fontSize: 14, fontWeight: '700' },
    fieldWrap: { marginBottom: spacing.md },
    fieldLabel: {
        ...typography.small,
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        fontSize: 14,
        textAlign: 'right',
    },
});

export { PremiumGuard } from './PremiumGuard';
