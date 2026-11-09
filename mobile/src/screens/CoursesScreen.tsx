import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CourseCard, FilterChips, Loading, Screen, SearchBar } from '../components';
import { api, ApiError } from '../api/client';
import type { CoursePayload, Paginated } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, spacing } from '../theme';
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
                <View style={styles.headingRow}>
                    <View style={[styles.headerIcon, { backgroundColor: colors.primarySoft }]}>
                        <Ionicons name="school-outline" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.headingCopy}>
                        <Text style={[styles.title, { color: colors.text }]}>آکادمی رشد</Text>
                        <View style={styles.iconBadgesRow}>
                            <View style={[styles.miniPill, { backgroundColor: colors.surfaceAlt }]}>
                                <Ionicons name="videocam-outline" size={12} color={colors.primary} />
                                <Text style={[styles.miniPillText, { color: colors.muted }]}>ویدیویی</Text>
                            </View>
                            <View style={[styles.miniPill, { backgroundColor: colors.surfaceAlt }]}>
                                <Ionicons name="sparkles-outline" size={12} color={colors.primary} />
                                <Text style={[styles.miniPillText, { color: colors.muted }]}>پریمیوم</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.countBadge, { backgroundColor: colors.primarySoft }]}>
                        <Ionicons name="layers-outline" size={14} color={colors.primary} />
                        <Text style={[styles.countBadgeText, { color: colors.primary }]}>
                            {faNum(courses.length)}
                        </Text>
                    </View>
                </View>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="جستجوی دوره یا مدرس…"
                />
            </View>
            <View>
                <FilterChips items={COURSE_CATEGORIES} selected={category} onSelect={setCategory} />
            </View>

            {loading ? (
                <Loading />
            ) : error && courses.length === 0 ? (
                <View style={styles.state}>
                    <Ionicons name="cloud-offline-outline" size={40} color={colors.muted} />
                    <Text style={[styles.stateTitle, { color: colors.text }]}>{error}</Text>
                    <Pressable accessibilityRole="button" onPress={() => load(1, true)} style={styles.retry}>
                        <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.retryText}>تلاش مجدد</Text>
                    </Pressable>
                </View>
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
                    ListEmptyComponent={
                        <View style={styles.state}>
                            <Ionicons name="search-outline" size={38} color={colors.muted} />
                            <Text style={[styles.stateTitle, { color: colors.text }]}>دوره‌ای یافت نشد</Text>
                        </View>
                    }
                    ListFooterComponent={
                        loadingMore ? (
                            <Loading />
                        ) : page >= lastPage && courses.length ? (
                            <View style={styles.endRow}>
                                <Ionicons name="checkmark-done-outline" size={18} color={colors.muted} />
                            </View>
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
        paddingTop: spacing.md,
        paddingBottom: spacing.xs,
        gap: spacing.sm,
    },
    headingRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 12,
    },
    headerIcon: {
        width: 46,
        height: 46,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headingCopy: { flex: 1, minWidth: 0, gap: 4 },
    title: { fontFamily: 'VazirmatnBlack', fontSize: 20, textAlign: 'right' },
    iconBadgesRow: { flexDirection: 'row-reverse', gap: 6 },
    miniPill: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    miniPillText: { fontFamily: 'VazirmatnBold', fontSize: 10 },
    countBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    countBadgeText: { fontFamily: 'VazirmatnBlack', fontSize: 13 },
    state: { alignItems: 'center', padding: 28, gap: 12 },
    stateTitle: { fontFamily: 'VazirmatnBold', fontSize: 14, textAlign: 'center' },
    retry: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 18,
        backgroundColor: '#153F31',
        borderRadius: 14,
    },
    retryText: { fontFamily: 'VazirmatnBold', color: '#FFFFFF', fontSize: 13 },
    list: {
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 36,
        width: '100%',
        maxWidth: 820,
        alignSelf: 'center',
    },
    itemWrap: { marginBottom: spacing.md },
    endRow: { alignItems: 'center', paddingVertical: spacing.md },
});
