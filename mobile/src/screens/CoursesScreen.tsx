import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CourseCard, EmptyState, FilterChips, Loading, Screen, SearchBar } from '../components';
import { api, ApiError } from '../api/client';
import type { CoursePayload, Paginated } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../theme';
import type { TabStackNavigation } from '../navigation/types';

const COURSE_CATEGORIES = ['همه', 'رهبری و مدیریت', 'کارآفرینی', 'توسعه فردی', 'فروش و مذاکره'];

export function CoursesScreen() {
    const navigation = useNavigation<TabStackNavigation>();
    const { colors } = useTheme();
    const [courses, setCourses] = useState<CoursePayload[]>([]);
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
                const result = await api<Paginated<CoursePayload>>('/api/v1/courses', {
                    query: {
                        page: String(pageNum),
                        per_page: '12',
                        q: search.trim() || undefined,
                        category: category !== 'همه' ? category : undefined,
                    },
                });
                setCourses((prev) => (replace ? result.data : [...prev, ...result.data]));
                setPage(result.current_page);
                setLastPage(result.last_page);
                setError(null);
            } catch (e) {
                setError(e instanceof ApiError ? e.message : 'خطا در دریافت دوره‌ها');
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
                <View style={styles.headingRow}><View style={styles.headingCopy}><Text style={[styles.title, { color: colors.text }]}>آکادمی رشد</Text><Text style={[styles.subtitle, { color: colors.muted }]}>مهارتی که قدم بعدی تو را می‌سازد</Text></View><View style={[styles.headerIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name="school-outline" size={28} color={colors.primary} /></View></View>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="جستجوی نام دوره، مهارت یا مدرس…"
                />
            </View>
            <View>
                <FilterChips items={COURSE_CATEGORIES} selected={category} onSelect={setCategory} />
            </View>

            {loading ? (
                <Loading label="در حال دریافت دوره‌ها…" />
            ) : error && courses.length === 0 ? (
                <View style={styles.state}><Ionicons name="cloud-offline-outline" size={40} color={colors.muted} /><Text style={[styles.subtitle, { color: colors.text }]}>{error}</Text><Pressable accessibilityRole="button" onPress={() => load(1, true)} style={styles.retry}><Text style={styles.retryText}>دریافت دوباره دوره‌ها</Text></Pressable></View>
            ) : (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={<View style={styles.catalogBanner}><View style={styles.bannerMark}><Ionicons name="play" size={23} color="#D5F58A" /></View><View style={styles.headingCopy}><Text style={styles.bannerTitle}>زمانی برای یادگیری خودت</Text><Text style={styles.bannerCopy}>یک دوره انتخاب کن و با ریتم خودت پیش برو.</Text></View></View>}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.4}
                    ListEmptyComponent={<View style={styles.state}><Ionicons name="search-outline" size={36} color={colors.muted} /><Text style={[styles.subtitle, { color: colors.text }]}>دوره‌ای با این انتخاب پیدا نشد</Text><Text style={[styles.subtitle, { color: colors.muted }]}>عنوان دیگری بنویس یا دسته‌بندی را تغییر بده.</Text></View>}
                    ListFooterComponent={
                        loadingMore ? (
                            <Loading label="در حال دریافت…" />
                        ) : page >= lastPage && courses.length ? (
                            <Text style={[styles.endText, { color: colors.muted }]}>— پایان فهرست —</Text>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <View style={styles.itemWrap}>
                            <CourseCard
                                course={item}
                                onPress={() => navigation.navigate('CourseDetail', { slug: item.slug })}
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
        gap: spacing.sm,
    },
    title: { fontFamily: 'VazirmatnBlack', fontSize: 27, lineHeight: 44, textAlign: 'right' },
    subtitle: { fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 25, textAlign: 'right' },
    headingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16, marginBottom: 14 }, headingCopy: { flex: 1, minWidth: 0 }, headerIcon: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    catalogBanner: { backgroundColor: '#153F31', padding: 22, borderRadius: 26, marginBottom: 22, flexDirection: 'row-reverse', alignItems: 'center', gap: 16 }, bannerMark: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#315A47', alignItems: 'center', justifyContent: 'center' }, bannerTitle: { fontFamily: 'VazirmatnBold', fontSize: 18, lineHeight: 31, textAlign: 'right', color: '#FFFFFF' }, bannerCopy: { fontFamily: 'Vazirmatn', fontSize: 13, lineHeight: 23, textAlign: 'right', color: '#C5DCCF' },
    state: { alignItems: 'center', padding: 28, gap: 14 }, retry: { paddingVertical: 14, paddingHorizontal: 22, backgroundColor: '#153F31', borderRadius: 16 }, retryText: { fontFamily: 'VazirmatnBold', color: '#FFFFFF', fontSize: 14 },
    list: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40, width: '100%', maxWidth: 820, alignSelf: 'center' },
    itemWrap: { marginBottom: spacing.md },
    endText: { textAlign: 'center', fontSize: 12, paddingVertical: spacing.lg },
});
