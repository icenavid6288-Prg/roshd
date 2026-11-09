import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Chip, Loading, PrimaryButton, PriceTag, Screen } from '../components';
import { api, ApiError, openSitePage, resolveAssetUrl } from '../api/client';
import type { ProductPayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route }: Props) {
    const { slug } = route.params;
    const { colors } = useTheme();
    const [product, setProduct] = useState<ProductPayload | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [descExpanded, setDescExpanded] = useState(false);

    useEffect(() => {
        api<ProductPayload>(`/api/v1/products/${slug}`)
            .then(setProduct)
            .catch((e) => setError(e instanceof ApiError ? e.message : 'خطا در دریافت محصول'));
    }, [slug]);

    useEffect(() => {
        let mounted = true;
        resolveAssetUrl(product?.image).then((uri) => {
            if (mounted) setImageUri(uri);
        });
        return () => {
            mounted = false;
        };
    }, [product?.image]);

    if (!product) {
        return error ? (
            <Screen>
                <View style={styles.errorBox}>
                    <Ionicons name="alert-circle-outline" size={42} color={colors.danger} />
                    <Text style={[styles.errorTitle, { color: colors.text }]}>{error}</Text>
                </View>
            </Screen>
        ) : (
            <Loading />
        );
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.imageFallback, { backgroundColor: colors.primaryDark }]}>
                        <Ionicons name="book-outline" size={44} color="#D6F39A" />
                        <Text style={styles.imageFallbackText}>{product.title}</Text>
                    </View>
                )}

                <View style={styles.body}>
                    <View style={styles.chipsRow}>
                        <Chip
                            label={product.category || (product.type === 'book' ? 'کتاب' : 'محصول')}
                            icon="book-outline"
                        />
                        {product.is_featured ? <Chip label="ویژه" tone="gold" icon="star" /> : null}
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>

                    {/* Icon-based Meta Grid */}
                    <View style={styles.metaGrid}>
                        {product.author ? (
                            <View style={[styles.metaTile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Ionicons name="person-outline" size={18} color={colors.primary} />
                                <Text style={[styles.metaValue, { color: colors.text }]} numberOfLines={1}>
                                    {product.author}
                                </Text>
                            </View>
                        ) : null}
                        {product.publisher ? (
                            <View style={[styles.metaTile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Ionicons name="business-outline" size={18} color={colors.primary} />
                                <Text style={[styles.metaValue, { color: colors.text }]} numberOfLines={1}>
                                    {product.publisher}
                                </Text>
                            </View>
                        ) : null}
                        {product.pages ? (
                            <View style={[styles.metaTile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                                <Text style={[styles.metaValue, { color: colors.text }]}>
                                    {faNum(product.pages)} ص
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    <View style={[styles.priceBox, { backgroundColor: colors.primarySoft }]}>
                        <View style={styles.iconRow}>
                            <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
                            <Text style={[styles.priceLabel, { color: colors.primary }]}>بهای محصول</Text>
                        </View>
                        <PriceTag priceValue={product.price} discount={product.discount_price} size="lg" />
                    </View>

                    <PrimaryButton
                        title="ثبت سفارش و خرید"
                        icon="cart-outline"
                        onPress={() =>
                            openSitePage(`/shop/${product.slug}`).catch((e) =>
                                Alert.alert('خطا', e instanceof ApiError ? e.message : 'خطا در باز کردن صفحه'),
                            )
                        }
                    />

                    {product.description ? (
                        <Pressable
                            onPress={() => setDescExpanded((v) => !v)}
                            style={[styles.descCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.descHeader}>
                                <View style={styles.iconRow}>
                                    <Ionicons name="reader-outline" size={18} color={colors.primary} />
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>معرفی</Text>
                                </View>
                                <Ionicons
                                    name={descExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                                    size={18}
                                    color={colors.muted}
                                />
                            </View>
                            <Text
                                style={[styles.sectionBody, { color: colors.muted }]}
                                numberOfLines={descExpanded ? undefined : 2}
                            >
                                {product.description}
                            </Text>
                        </Pressable>
                    ) : null}
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { paddingBottom: spacing.xxl },
    errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
    errorTitle: { ...typography.title, textAlign: 'center' },
    image: { width: '100%', height: 230 },
    imageFallback: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 8 },
    imageFallbackText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', textAlign: 'center' },
    body: { padding: spacing.lg, gap: spacing.md },
    chipsRow: { flexDirection: 'row-reverse', gap: spacing.sm, flexWrap: 'wrap' },
    title: { ...typography.hero, textAlign: 'right' },
    metaGrid: { flexDirection: 'row-reverse', gap: spacing.sm },
    metaTile: {
        flex: 1,
        borderRadius: radius.md,
        paddingVertical: 10,
        paddingHorizontal: spacing.sm,
        borderWidth: 1,
        alignItems: 'center',
        gap: 4,
    },
    metaValue: { ...typography.small, fontWeight: '700', fontSize: 12 },
    iconRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    priceBox: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    priceLabel: { ...typography.small, fontWeight: '700' },
    descCard: {
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        gap: 6,
    },
    descHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: { ...typography.subtitle, fontWeight: '800' },
    sectionBody: { ...typography.small, lineHeight: 22, textAlign: 'right' },
});
