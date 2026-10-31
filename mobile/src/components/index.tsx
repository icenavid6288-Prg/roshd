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

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
    const { colors } = useTheme();
    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }, style]} edges={['top', 'left', 'right']}>
            {children}
        </SafeAreaView>
    );
}

export function Loading({ label = 'در حال بارگذاری…' }: { label?: string }) {
    const { colors } = useTheme();
    return (
        <View style={[styles.center, { backgroundColor: colors.bg }]}>
            <View style={[styles.loadingMark, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Image source={require('../../assets/roshd-logo.png')} style={styles.loadingLogo} accessibilityLabel="لوگوی Roshd" />
            </View>
            <ActivityIndicator size="small" color={colors.primary} style={styles.loadingSpinner} />
        </View>
    );
}

export function EmptyState({
    icon = '🌱',
    title,
    subtitle,
}: {
    icon?: string;
    title: string;
    subtitle?: string;
}) {
    const { colors } = useTheme();
    return (
        <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{icon}</Text>
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
                <Pressable onPress={onAction} hitSlop={8}>
                    <Text style={[styles.sectionAction, { color: colors.primary }]}>{actionLabel} ←</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

export function Chip({
    label,
    tone = 'primary',
}: {
    label: string;
    tone?: 'primary' | 'gold' | 'muted' | 'danger';
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
            <Ionicons name="search-outline" size={21} color={colors.muted} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.muted}
                style={[styles.searchInput, { color: colors.text }]}
            />
            {value.length > 0 ? (
                <Pressable onPress={() => onChangeText('')} hitSlop={8}>
                    <Text style={[styles.clearText, { color: colors.muted }]}>✕</Text>
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

export function Avatar({ name, uri, size = 44 }: { name: string; uri?: string | null; size?: number }) {
    const { colors } = useTheme();
    const [resolved, setResolved] = useState<string | null>(null);
    useEffect(() => {
        let mounted = true;
        resolveAssetUrl(uri).then((u) => {
            if (mounted) setResolved(u);
        });
        return () => {
            mounted = false;
        };
    }, [uri]);

    const initial = (name || '?').trim().charAt(0);

    if (resolved) {
        return (
            <Image
                source={{ uri: resolved }}
                style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primarySoft }}
            />
        );
    }

    return (
        <View
            style={[
                styles.avatarFallback,
                { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary },
            ]}
        >
            <Text style={[styles.avatarInitial, { fontSize: size * 0.42, color: colors.white }]}>{initial}</Text>
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
            {thumb ? (
                <Image source={{ uri: thumb }} style={styles.cardThumb} resizeMode="cover" />
            ) : (
                <View style={[styles.cardThumb, styles.cardThumbPlaceholder, { backgroundColor: colors.primaryDark }]}>
                    <Text style={styles.cardThumbPlaceholderText} numberOfLines={2}>
                        {course.title}
                    </Text>
                </View>
            )}
            <View style={styles.cardBody}>
                <View style={styles.cardMetaRow}>
                    {course.category ? <Chip label={course.category} /> : null}
                    {course.level ? <Chip label={course.level} tone="muted" /> : null}
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {course.title}
                </Text>
                {course.instructor?.name ? (
                    <Text style={[styles.cardMeta, { color: colors.muted }]} numberOfLines={1}>
                        مدرس: {course.instructor.name}
                    </Text>
                ) : null}
                {typeof progress === 'number' ? (
                    <View style={{ marginTop: spacing.sm, gap: 4 }}>
                        <ProgressBar value={progress} />
                        <Text style={[styles.progressLabel, { color: colors.muted }]}>
                            {faNum(progress)}٪ تکمیل شده
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                        <PriceTag
                            priceValue={course.price}
                            discount={course.discount_price}
                            isFree={course.is_free}
                        />
                        {course.lessons_count ? (
                            <Text style={[styles.cardMeta, { color: colors.muted }]}>
                                {faNum(course.lessons_count)} جلسه
                            </Text>
                        ) : null}
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
                    <Text style={styles.cardThumbPlaceholderText} numberOfLines={2}>
                        {product.title}
                    </Text>
                </View>
            )}
            <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {product.title}
                </Text>
                {product.author ? (
                    <Text style={[styles.cardMeta, { color: colors.muted }]} numberOfLines={1}>
                        {product.author}
                    </Text>
                ) : null}
                <View style={{ marginTop: spacing.xs }}>
                    <PriceTag priceValue={product.price} discount={product.discount_price} size="sm" />
                </View>
            </View>
        </Pressable>
    );
}

export function PrimaryButton({
    title,
    onPress,
    loading = false,
    variant = 'primary',
    disabled = false,
}: {
    title: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'gold' | 'outline' | 'danger';
    disabled?: boolean;
}) {
    const { colors } = useTheme();
    const bg =
        variant === 'gold'
            ? colors.gold
            : variant === 'outline'
            ? 'transparent'
            : variant === 'danger'
            ? colors.danger
            : colors.primary;
    const fg =
        variant === 'gold'
            ? '#0F172A'
            : variant === 'outline'
            ? colors.primary
            : colors.white;

    return (
        <Pressable
            disabled={disabled || loading}
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: bg,
                    borderWidth: variant === 'outline' ? 1.5 : 0,
                    borderColor: colors.primary,
                    opacity: disabled || loading ? 0.6 : pressed ? 0.88 : 1,
                },
            ]}
        >
            {loading ? (
                <ActivityIndicator color={fg} />
            ) : (
                <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
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
    loadingText: { ...typography.small, marginTop: spacing.md },
    loadingMark: { width: 104, height: 104, borderRadius: 32, borderWidth: 1, alignItems: 'center', justifyContent: 'center', shadowColor: '#0B3B2B', shadowOpacity: 0.12, shadowRadius: 22, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
    loadingLogo: { width: 78, height: 78, borderRadius: 23 },
    loadingSpinner: { marginTop: 20 },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
    },
    emptyIcon: { fontSize: 40, marginBottom: spacing.sm },
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
    sectionAction: { ...typography.small, fontWeight: '700' },
    chip: {
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
        minHeight: 54,
        gap: spacing.sm,
    },
    searchIcon: { fontSize: 15 },
    searchInput: {
        flex: 1,
        fontSize: 14,
        textAlign: 'right',
        paddingVertical: 6,
    },
    clearText: { fontSize: 14, fontWeight: '700', paddingHorizontal: 4 },
    filterChipsRow: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    filterChip: {
        paddingHorizontal: 14,
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
    progressLabel: { ...typography.tiny },
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
    cardCompact: { width: 280 },
    cardThumb: { width: '100%', height: 170 },
    cardThumbPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
    },
    cardThumbPlaceholderText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
    },
    cardBody: { padding: 18, gap: 10 },
    cardMetaRow: { flexDirection: 'row-reverse', gap: 6, flexWrap: 'wrap' },
    cardTitle: { ...typography.subtitle },
    cardMeta: { ...typography.small },
    cardFooter: {
        marginTop: spacing.xs,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productCard: {
        width: 180,
        borderRadius: radius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    productImage: { width: '100%', height: 150 },
    pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
    button: {
        minHeight: 52,
        paddingVertical: 14,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: { fontSize: 15, fontWeight: '700' },
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
