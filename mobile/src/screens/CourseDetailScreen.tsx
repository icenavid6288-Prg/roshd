import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Chip, Loading, PrimaryButton, PriceTag, Screen } from '../components';
import { api, ApiError, openSitePage, resolveAssetUrl } from '../api/client';
import type { CoursePayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export function CourseDetailScreen({ route, navigation }: Props) {
    const { slug } = route.params;
    const { colors } = useTheme();
    const [course, setCourse] = useState<CoursePayload | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [thumb, setThumb] = useState<string | null>(null);
    const [descExpanded, setDescExpanded] = useState(false);

    useEffect(() => {
        let mounted = true;
        api<CoursePayload>(`/api/v1/courses/${slug}`)
            .then((c) => {
                if (mounted) setCourse(c);
            })
            .catch((e) => {
                if (mounted) setError(e instanceof ApiError ? e.message : 'خطا در دریافت دوره');
            });
        return () => {
            mounted = false;
        };
    }, [slug]);

    useEffect(() => {
        let mounted = true;
        resolveAssetUrl(course?.thumbnail).then((u) => {
            if (mounted) setThumb(u);
        });
        return () => {
            mounted = false;
        };
    }, [course?.thumbnail]);

    if (!course) {
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
                {thumb ? (
                    <Image source={{ uri: thumb }} style={styles.thumb} resizeMode="cover" />
                ) : (
                    <View style={[styles.thumb, styles.thumbFallback, { backgroundColor: colors.primaryDark }]}>
                        <Ionicons name="school-outline" size={44} color="#D6F39A" />
                        <Text style={styles.thumbFallbackText}>{course.title}</Text>
                    </View>
                )}

                <View style={styles.body}>
                    <View style={styles.chipsRow}>
                        {course.category ? <Chip label={course.category} icon="layers-outline" /> : null}
                        {course.level ? <Chip label={course.level} tone="muted" icon="speedometer-outline" /> : null}
                        {course.delivery_mode ? <Chip label={course.delivery_mode} tone="gold" icon="sparkles-outline" /> : null}
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>

                    {/* Icon-first KPI Grid instead of verbose text labels */}
                    <View style={styles.metaGrid}>
                        {course.duration ? (
                            <View style={[styles.metaItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Ionicons name="time-outline" size={20} color={colors.primary} />
                                <Text style={[styles.metaValue, { color: colors.text }]}>{faNum(course.duration)}</Text>
                            </View>
                        ) : null}
                        {course.lessons_count ? (
                            <View style={[styles.metaItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Ionicons name="videocam-outline" size={20} color={colors.primary} />
                                <Text style={[styles.metaValue, { color: colors.text }]}>
                                    {faNum(course.lessons_count)} جلسه
                                </Text>
                            </View>
                        ) : null}
                        {course.students_count ? (
                            <View style={[styles.metaItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Ionicons name="people-outline" size={20} color={colors.primary} />
                                <Text style={[styles.metaValue, { color: colors.text }]}>
                                    {faNum(course.students_count)}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {course.instructor ? (
                        <View style={[styles.instructorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Avatar name={course.instructor.name} uri={course.instructor.avatar} size={48} />
                            <View style={{ flex: 1 }}>
                                <View style={styles.iconRow}>
                                    <Ionicons name="ribbon-outline" size={15} color={colors.primary} />
                                    <Text style={[styles.instructorName, { color: colors.text }]}>
                                        {course.instructor.name}
                                    </Text>
                                </View>
                                {course.instructor.title ? (
                                    <Text style={[styles.instructorTitle, { color: colors.muted }]} numberOfLines={1}>
                                        {course.instructor.title}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    ) : null}

                    <View style={[styles.priceCard, { backgroundColor: colors.primarySoft }]}>
                        <View style={styles.iconRow}>
                            <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
                            <Text style={[styles.priceCaption, { color: colors.primary }]}>شهریه</Text>
                        </View>
                        <PriceTag
                            priceValue={course.price}
                            discount={course.discount_price}
                            isFree={course.is_free}
                            size="lg"
                        />
                    </View>

                    <View style={styles.actionsRow}>
                        <PrimaryButton
                            title="ورود به اتاق یادگیری"
                            icon="play-circle-outline"
                            onPress={() => navigation.navigate('Learning', { slug: course.slug })}
                        />
                        {!course.is_free && course.price > 0 ? (
                            <>
                                <PrimaryButton
                                    title="عضویت ویژه VIP"
                                    variant="secondary"
                                    icon="star"
                                    onPress={() =>
                                        navigation.navigate('Upsell', {
                                            source: 'course_detail',
                                            courseSlug: course.slug,
                                            courseTitle: course.title,
                                        })
                                    }
                                />
                                <PrimaryButton
                                    title="خرید مستقیم از سایت"
                                    variant="outline"
                                    icon="globe-outline"
                                    onPress={() =>
                                        openSitePage(`/courses/${course.slug}`).catch((e) =>
                                            Alert.alert(
                                                'خطا',
                                                e instanceof ApiError ? e.message : 'خطا در باز کردن صفحه وب',
                                            ),
                                        )
                                    }
                                />
                            </>
                        ) : null}
                    </View>

                    {course.description ? (
                        <Pressable
                            onPress={() => setDescExpanded((v) => !v)}
                            style={[styles.descCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.descHeader}>
                                <View style={styles.iconRow}>
                                    <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>معرفی دوره</Text>
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
                                {course.description}
                            </Text>
                        </Pressable>
                    ) : null}

                    {course.modules?.length ? (
                        <View style={styles.section}>
                            <View style={styles.iconRow}>
                                <Ionicons name="list-outline" size={20} color={colors.primary} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>سرفصل‌ها</Text>
                            </View>
                            {course.modules.map((mod, idx) => (
                                <View
                                    key={mod.id}
                                    style={[
                                        styles.moduleBox,
                                        { backgroundColor: colors.surface, borderColor: colors.border },
                                    ]}
                                >
                                    <View style={styles.iconRow}>
                                        <Ionicons name="folder-open-outline" size={16} color={colors.primary} />
                                        <Text style={[styles.moduleTitle, { color: colors.primary }]}>
                                            فصل {faNum(idx + 1)}: {mod.title}
                                        </Text>
                                    </View>
                                    {mod.lessons.map((lesson, lIdx) => (
                                        <View
                                            key={lesson.id}
                                            style={[styles.lessonRow, { borderTopColor: colors.border }]}
                                        >
                                            <View style={[styles.iconRow, { flex: 1 }]}>
                                                <Ionicons name="play-circle-outline" size={16} color={colors.primary} />
                                                <Text style={[styles.lessonName, { color: colors.text }]} numberOfLines={1}>
                                                    {faNum(lIdx + 1)}. {lesson.title}
                                                </Text>
                                            </View>
                                            {lesson.duration ? (
                                                <View style={styles.iconRow}>
                                                    <Ionicons name="time-outline" size={12} color={colors.muted} />
                                                    <Text style={[styles.lessonDuration, { color: colors.muted }]}>
                                                        {faNum(lesson.duration)}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    ))}
                                </View>
                            ))}
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
    errorTitle: { ...typography.title, textAlign: 'center' },
    thumb: { width: '100%', height: 210 },
    thumbFallback: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 8 },
    thumbFallbackText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', textAlign: 'center' },
    body: { padding: spacing.lg, gap: spacing.md },
    chipsRow: { flexDirection: 'row-reverse', gap: spacing.sm, flexWrap: 'wrap' },
    title: { ...typography.hero, textAlign: 'right' },
    metaGrid: { flexDirection: 'row-reverse', gap: spacing.sm },
    metaItem: {
        flex: 1,
        borderRadius: radius.md,
        paddingVertical: 12,
        paddingHorizontal: spacing.sm,
        borderWidth: 1,
        alignItems: 'center',
        gap: 4,
    },
    metaValue: { ...typography.subtitle, fontSize: 13 },
    instructorCard: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: spacing.md,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
    },
    iconRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    instructorName: { ...typography.subtitle },
    instructorTitle: { ...typography.small, textAlign: 'right' },
    priceCard: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    priceCaption: { ...typography.small, fontWeight: '700' },
    actionsRow: { gap: spacing.sm },
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
    section: { marginTop: spacing.xs, gap: spacing.sm },
    sectionTitle: { ...typography.subtitle, fontWeight: '800' },
    sectionBody: { ...typography.small, lineHeight: 22, textAlign: 'right' },
    moduleBox: {
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        gap: spacing.xs,
    },
    moduleTitle: { ...typography.subtitle, fontSize: 14 },
    lessonRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderTopWidth: 1,
        gap: 8,
    },
    lessonName: { ...typography.small, flex: 1, textAlign: 'right' },
    lessonDuration: { ...typography.tiny },
});
