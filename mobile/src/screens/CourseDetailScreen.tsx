import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
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
                    <Text style={[styles.errorTitle, { color: colors.text }]}>خطا در دریافت دوره</Text>
                    <Text style={[styles.errorText, { color: colors.muted }]}>{error}</Text>
                </View>
            </Screen>
        ) : (
            <Loading label="در حال دریافت جزئیات دوره…" />
        );
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {thumb ? (
                    <Image source={{ uri: thumb }} style={styles.thumb} resizeMode="cover" />
                ) : (
                    <View style={[styles.thumb, styles.thumbFallback, { backgroundColor: colors.primaryDark }]}>
                        <Text style={styles.thumbFallbackText}>{course.title}</Text>
                    </View>
                )}

                <View style={styles.body}>
                    <View style={styles.chipsRow}>
                        {course.category ? <Chip label={course.category} /> : null}
                        {course.level ? <Chip label={course.level} tone="muted" /> : null}
                        {course.delivery_mode ? <Chip label={course.delivery_mode} tone="gold" /> : null}
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
                    {course.subtitle ? (
                        <Text style={[styles.subtitle, { color: colors.muted }]}>{course.subtitle}</Text>
                    ) : null}

                    <View style={styles.metaGrid}>
                        {course.duration ? (
                            <View style={[styles.metaItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Text style={[styles.metaLabel, { color: colors.muted }]}>مدت دوره</Text>
                                <Text style={[styles.metaValue, { color: colors.text }]}>{faNum(course.duration)}</Text>
                            </View>
                        ) : null}
                        {course.lessons_count ? (
                            <View style={[styles.metaItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Text style={[styles.metaLabel, { color: colors.muted }]}>تعداد جلسات</Text>
                                <Text style={[styles.metaValue, { color: colors.text }]}>
                                    {faNum(course.lessons_count)} جلسه
                                </Text>
                            </View>
                        ) : null}
                        {course.students_count ? (
                            <View style={[styles.metaItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Text style={[styles.metaLabel, { color: colors.muted }]}>دانش‌پذیران</Text>
                                <Text style={[styles.metaValue, { color: colors.text }]}>
                                    {faNum(course.students_count)} نفر
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {course.instructor ? (
                        <View style={[styles.instructorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Avatar name={course.instructor.name} uri={course.instructor.avatar} size={52} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.instructorName, { color: colors.text }]}>
                                    {course.instructor.name}
                                </Text>
                                {course.instructor.title ? (
                                    <Text style={[styles.instructorTitle, { color: colors.muted }]}>
                                        {course.instructor.title}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    ) : null}

                    <View style={[styles.priceCard, { backgroundColor: colors.primarySoft }]}>
                        <View>
                            <Text style={[styles.priceCaption, { color: colors.primary }]}>شهریه سرمایه‌گذاری</Text>
                            <PriceTag
                                priceValue={course.price}
                                discount={course.discount_price}
                                isFree={course.is_free}
                                size="lg"
                            />
                        </View>
                    </View>

                    <View style={styles.actionsRow}>
                        <PrimaryButton
                            title="ورود به اتاق یادگیری و مشاهده دروس"
                            onPress={() => navigation.navigate('Learning', { slug: course.slug })}
                        />
                        {!course.is_free && course.price > 0 ? (
                            <PrimaryButton
                                title="ثبت‌نام و خرید از وب‌سایت"
                                variant="outline"
                                onPress={() =>
                                    openSitePage(`/courses/${course.slug}`).catch((e) =>
                                        Alert.alert(
                                            'خطا',
                                            e instanceof ApiError ? e.message : 'خطا در باز کردن صفحه وب',
                                        ),
                                    )
                                }
                            />
                        ) : null}
                    </View>

                    {course.description ? (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>درباره این دوره</Text>
                            <Text style={[styles.sectionBody, { color: colors.text }]}>{course.description}</Text>
                        </View>
                    ) : null}

                    {course.modules?.length ? (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>سرفصل‌های دوره</Text>
                            {course.modules.map((mod, idx) => (
                                <View
                                    key={mod.id}
                                    style={[
                                        styles.moduleBox,
                                        { backgroundColor: colors.surface, borderColor: colors.border },
                                    ]}
                                >
                                    <Text style={[styles.moduleTitle, { color: colors.primary }]}>
                                        فصل {faNum(idx + 1)}: {mod.title}
                                    </Text>
                                    {mod.lessons.map((lesson, lIdx) => (
                                        <View
                                            key={lesson.id}
                                            style={[styles.lessonRow, { borderTopColor: colors.border }]}
                                        >
                                            <Text style={[styles.lessonName, { color: colors.text }]}>
                                                {faNum(lIdx + 1)}. {lesson.title}
                                            </Text>
                                            {lesson.duration ? (
                                                <Text style={[styles.lessonDuration, { color: colors.muted }]}>
                                                    {faNum(lesson.duration)}
                                                </Text>
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
    errorTitle: { ...typography.title },
    errorText: { ...typography.small, textAlign: 'center' },
    thumb: { width: '100%', height: 210 },
    thumbFallback: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    thumbFallbackText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', textAlign: 'center' },
    body: { padding: spacing.lg, gap: spacing.md },
    chipsRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    title: { ...typography.hero },
    subtitle: { ...typography.body },
    metaGrid: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    metaItem: {
        flex: 1,
        borderRadius: radius.md,
        padding: spacing.md,
        borderWidth: 1,
        alignItems: 'center',
    },
    metaLabel: { ...typography.tiny },
    metaValue: { ...typography.subtitle, marginTop: 2 },
    instructorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
    },
    instructorName: { ...typography.subtitle },
    instructorTitle: { ...typography.small },
    priceCard: {
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    priceCaption: { ...typography.small, marginBottom: 4, fontWeight: '700' },
    actionsRow: { gap: spacing.sm },
    section: { marginTop: spacing.md, gap: spacing.sm },
    sectionTitle: { ...typography.title },
    sectionBody: { ...typography.body, lineHeight: 24 },
    moduleBox: {
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        gap: spacing.xs,
    },
    moduleTitle: { ...typography.subtitle, marginBottom: 4 },
    lessonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderTopWidth: 1,
    },
    lessonName: { ...typography.body, flex: 1 },
    lessonDuration: { ...typography.tiny },
});
