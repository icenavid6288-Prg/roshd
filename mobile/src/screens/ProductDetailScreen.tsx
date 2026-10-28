import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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
                    <Text style={[styles.errorTitle, { color: colors.text }]}>محصول یافت نشد</Text>
                    <Text style={[styles.errorText, { color: colors.muted }]}>{error}</Text>
                </View>
            </Screen>
        ) : (
            <Loading label="در حال دریافت محصول…" />
        );
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.imageFallback, { backgroundColor: colors.primaryDark }]}>
                        <Text style={styles.imageFallbackText}>{product.title}</Text>
                    </View>
                )}

                <View style={styles.body}>
                    <View style={styles.chipsRow}>
                        <Chip label={product.category || (product.type === 'book' ? 'کتاب' : 'محصول')} />
                        {product.is_featured ? <Chip label="پیشنهاد ویژه" tone="gold" /> : null}
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
                    {product.author ? (
                        <Text style={[styles.author, { color: colors.muted }]}>پدیدآورنده: {product.author}</Text>
                    ) : null}

                    <View style={styles.metaRow}>
                        {product.publisher ? (
                            <Text style={[styles.meta, { color: colors.muted }]}>ناشر: {product.publisher}</Text>
                        ) : null}
                        {product.pages ? (
                            <Text style={[styles.meta, { color: colors.muted }]}>{faNum(product.pages)} صفحه</Text>
                        ) : null}
                        {product.isbn ? (
                            <Text style={[styles.meta, { color: colors.muted }]}>ISBN: {product.isbn}</Text>
                        ) : null}
                    </View>

                    <View style={[styles.priceBox, { backgroundColor: colors.primarySoft }]}>
                        <Text style={[styles.priceLabel, { color: colors.primary }]}>بهای محصول</Text>
                        <PriceTag priceValue={product.price} discount={product.discount_price} size="lg" />
                    </View>

                    <PrimaryButton
                        title="ثبت سفارش و خرید از فروشگاه"
                        onPress={() =>
                            openSitePage(`/shop/${product.slug}`).catch((e) =>
                                Alert.alert('خطا', e instanceof ApiError ? e.message : 'خطا در باز کردن صفحه'),
                            )
                        }
                    />

                    {product.description ? (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>معرفی و توضیحات</Text>
                            <Text style={[styles.sectionBody, { color: colors.text }]}>{product.description}</Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { paddingBottom: spacing.xxl },
    errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
    errorTitle: { ...typography.title },
    errorText: { ...typography.small, textAlign: 'center' },
    image: { width: '100%', height: 240 },
    imageFallback: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    imageFallbackText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', textAlign: 'center' },
    body: { padding: spacing.lg, gap: spacing.md },
    chipsRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    title: { ...typography.hero },
    author: { ...typography.body },
    metaRow: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
    meta: { ...typography.small },
    priceBox: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: 4,
    },
    priceLabel: { ...typography.small, fontWeight: '700' },
    section: { marginTop: spacing.md, gap: spacing.sm },
    sectionTitle: { ...typography.title, fontSize: 17 },
    sectionBody: { ...typography.body, lineHeight: 26 },
});
