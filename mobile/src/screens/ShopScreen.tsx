import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EmptyState, FilterChips, Loading, ProductCard, Screen, SearchBar } from '../components';
import { api, ApiError } from '../api/client';
import type { Paginated, ProductPayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../theme';
import type { TabStackNavigation } from '../navigation/types';

const PRODUCT_CATEGORIES = ['همه', 'کتاب چاپی', 'ابزار برنامه‌ریزی', 'محصول دیجیتال'];

export function ShopScreen() {
    const { width } = useWindowDimensions();
    const columns = width < 380 ? 1 : 2;
    const navigation = useNavigation<TabStackNavigation>();
    const { colors } = useTheme();
    const [products, setProducts] = useState<ProductPayload[]>([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('همه');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(
        async (pageNum: number, replace: boolean) => {
            if (replace) setLoading(true);
            else setLoadingMore(true);
            try {
                const result = await api<Paginated<ProductPayload>>('/api/v1/products', {
                    query: {
                        page: String(pageNum),
                        per_page: '12',
                        q: search.trim() || undefined,
                        category: category !== 'همه' ? category : undefined,
                    },
                });
                setProducts((prev) => (replace ? result.data : [...prev, ...result.data]));
                setPage(result.current_page);
                setLastPage(result.last_page);
                setError(null);
            } catch (e) {
                setError(e instanceof ApiError ? e.message : 'خطا در دریافت محصولات');
            } finally {
                setLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
            }
        },
        [search, category],
    );

    useEffect(() => {
        load(1, true);
    }, [load]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        load(1, true);
    }, [load]);

    const onEndReached = useCallback(() => {
        if (!loading && !loadingMore && page < lastPage) {
            load(page + 1, false);
        }
    }, [loading, loadingMore, page, lastPage, load]);

    return (
        <Screen>
            <View style={styles.header}>
                <View style={styles.headingRow}><View style={styles.headingCopy}><Text style={[styles.title, { color: colors.text }]}>فروشگاه رشد</Text><Text style={[styles.subtitle, { color: colors.muted }]}>ابزارهای کوچک برای تغییرهای ماندگار</Text></View><View style={styles.headerIcon}><Ionicons name="bag-handle-outline" size={28} color="#264D35" /></View></View>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="جستجوی کتاب، نویسنده یا ابزار…"
                />
            </View>
            <View>
                <FilterChips items={PRODUCT_CATEGORIES} selected={category} onSelect={setCategory} />
            </View>

            {loading ? (
                <Loading label="در حال دریافت محصولات…" />
            ) : error && products.length === 0 ? (
                <View style={styles.state}><Ionicons name="cloud-offline-outline" size={40} color={colors.muted} /><Text style={[styles.subtitle, { color: colors.text }]}>{error}</Text><Pressable accessibilityRole="button" onPress={() => load(1, true)} style={styles.retry}><Text style={styles.retryText}>دریافت دوباره محصولات</Text></Pressable></View>
            ) : (
                <FlatList
                    key={columns}
                    data={products}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={<View style={styles.catalogBanner}><Ionicons name="book-outline" size={38} color="#34563A" /><View style={styles.headingCopy}><Text style={styles.bannerTitle}>همراهِ روزهای رشد</Text><Text style={styles.bannerCopy}>کتاب، برنامه‌ریز و ابزارهایی برای مسیر تو</Text></View></View>}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.4}
                    numColumns={columns}
                    columnWrapperStyle={columns > 1 ? styles.row : undefined}
                    ListEmptyComponent={<View style={styles.state}><Ionicons name="bag-outline" size={36} color={colors.muted} /><Text style={[styles.subtitle, { color: colors.text }]}>محصولی با این انتخاب پیدا نشد</Text><Text style={[styles.subtitle, { color: colors.muted }]}>جستجو یا دسته‌بندی را تغییر بده.</Text></View>}
                    ListFooterComponent={
                        loadingMore ? (
                            <Loading label="در حال دریافت…" />
                        ) : page >= lastPage && products.length ? (
                            <Text style={[styles.endText, { color: colors.muted }]}>— پایان فهرست —</Text>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <View style={styles.itemWrap}>
                            <ProductCard
                                product={item}
                                onPress={() => navigation.navigate('ProductDetail', { slug: item.slug })}
                            />
                        </View>
                    )}
                />
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xs,
        gap: 6,
    },
    title: { fontFamily: 'VazirmatnBlack', fontSize: 27, lineHeight: 44, textAlign: 'right' },
    subtitle: { fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 25, textAlign: 'right' },
    headingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16, marginBottom: 14 }, headingCopy: { flex: 1, minWidth: 0 }, headerIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: '#E5F0D2', alignItems: 'center', justifyContent: 'center' },
    catalogBanner: { backgroundColor: '#E7EED9', padding: 22, borderRadius: 26, marginBottom: 22, flexDirection: 'row-reverse', alignItems: 'center', gap: 18 }, bannerTitle: { fontFamily: 'VazirmatnBold', fontSize: 20, lineHeight: 34, textAlign: 'right', color: '#264D35' }, bannerCopy: { fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 25, textAlign: 'right', color: '#52694A' },
    state: { alignItems: 'center', padding: 28, gap: 14 }, retry: { paddingVertical: 14, paddingHorizontal: 22, backgroundColor: '#153F31', borderRadius: 16 }, retryText: { fontFamily: 'VazirmatnBold', color: '#FFFFFF', fontSize: 14 },
    list: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40, width: '100%', maxWidth: 820, alignSelf: 'center' },
    row: { gap: spacing.md },
    itemWrap: { flex: 1, marginBottom: spacing.md },
    endText: { textAlign: 'center', fontSize: 12, paddingVertical: spacing.lg },
});
