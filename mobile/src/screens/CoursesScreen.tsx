import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
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
                <Text style={[styles.title, { color: colors.text }]}>دوره‌های آموزشی</Text>
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
                <EmptyState icon="📡" title="خطا در دریافت دوره‌ها" subtitle={error} />
            ) : (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.4}
                    ListEmptyComponent={<EmptyState icon="🎓" title="دوره‌ای متناسب با جستجوی شما یافت نشد" />}
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
    title: { ...typography.title },
    list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl, gap: spacing.md },
    itemWrap: { marginBottom: spacing.md },
    endText: { textAlign: 'center', fontSize: 12, paddingVertical: spacing.lg },
});
