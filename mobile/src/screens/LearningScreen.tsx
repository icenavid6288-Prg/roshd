import React, { useEffect, useMemo, useState } from 'react';
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Chip, Loading, PrimaryButton, ProgressBar, Screen } from '../components';
import { api, ApiError } from '../api/client';
import type { CourseLessonPayload, LearningData, LessonNotePayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Learning'>;

export function LearningScreen({ route, navigation }: Props) {
    const { slug, lessonId } = route.params;
    const { colors } = useTheme();
    const [data, setData] = useState<LearningData | null>(null);
    const [currentLesson, setCurrentLesson] = useState<CourseLessonPayload | null>(null);
    const [completedIds, setCompletedIds] = useState<number[]>([]);
    const [progress, setProgress] = useState(0);
    const [notesList, setNotesList] = useState<LessonNotePayload[]>([]);
    const [noteText, setNoteText] = useState('');
    const [savingNote, setSavingNote] = useState(false);
    const [studySeconds, setStudySeconds] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api<LearningData>(`/api/v1/learning/${slug}`)
            .then((result) => {
                setData(result);
                setCompletedIds(result.completed_lesson_ids || []);
                setProgress(result.enrollment?.progress ?? 0);
                setNotesList(result.saved_notes || []);
                const allLessons = (result.course.modules || []).flatMap((m) => m.lessons);
                const found = lessonId ? allLessons.find((l) => l.id === lessonId) : allLessons[0];
                setCurrentLesson(found || allLessons[0] || null);
            })
            .catch((e) => setError(e instanceof ApiError ? e.message : 'خطا در بارگذاری دوره'));
    }, [slug, lessonId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setStudySeconds((s) => s + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTimer = useMemo(() => {
        const mins = Math.floor(studySeconds / 60);
        const secs = studySeconds % 60;
        return `${faNum(String(mins).padStart(2, '0'))}:${faNum(String(secs).padStart(2, '0'))}`;
    }, [studySeconds]);

    const toggleComplete = async () => {
        if (!currentLesson) return;
        const res = await api<{ completed_lesson_ids: number[]; progress: number }>(
            `/api/v1/learning/${slug}/toggle-lesson`,
            {
                method: 'POST',
                body: { lesson_id: currentLesson.id },
            },
        );
        setCompletedIds(res.completed_lesson_ids);
        setProgress(res.progress);
    };

    const saveNote = async () => {
        if (!noteText.trim() || !currentLesson) return;
        setSavingNote(true);
        try {
            const created = await api<LessonNotePayload>(`/api/v1/learning/${slug}/notes`, {
                method: 'POST',
                body: {
                    lesson_id: currentLesson.id,
                    lesson_title: currentLesson.title,
                    content: noteText.trim(),
                },
            });
            setNotesList((prev) => [created, ...prev]);
            setNoteText('');
        } finally {
            setSavingNote(false);
        }
    };

    if (!data) {
        return error ? (
            <Screen>
                <View style={styles.errorBox}>
                    <Ionicons name="lock-closed-outline" size={44} color={colors.primary} />
                    <Text style={[styles.errorTitle, { color: colors.text }]}>دسترسی محدود</Text>
                    <View style={{ marginTop: spacing.md, width: '100%', gap: spacing.sm }}>
                        <PrimaryButton
                            title="فعال‌سازی دوره VIP"
                            onPress={() =>
                                navigation.navigate('Upsell', {
                                    source: 'learning',
                                    courseSlug: slug,
                                })
                            }
                            icon="star"
                        />
                        <PrimaryButton
                            title="بازگشت"
                            variant="outline"
                            icon="arrow-forward-outline"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </Screen>
        ) : (
            <Loading />
        );
    }

    const { course } = data;
    const isCurrentCompleted = currentLesson ? completedIds.includes(currentLesson.id) : false;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.headerTopRow}>
                        <Chip label={formattedTimer} tone="gold" icon="timer-outline" />
                        <Chip label={`${faNum(progress)}٪`} tone="primary" icon="pie-chart-outline" />
                    </View>
                    <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={1}>
                        {course.title}
                    </Text>
                    <ProgressBar value={progress} />
                </View>

                {currentLesson ? (
                    <View style={[styles.lessonBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.videoPlaceholder}>
                            <View style={styles.playCircle}>
                                <Ionicons name="play" size={26} color="#123E30" />
                            </View>
                            <Text style={styles.videoTitle} numberOfLines={2}>
                                {currentLesson.title}
                            </Text>
                            {currentLesson.duration ? (
                                <View style={styles.iconRow}>
                                    <Ionicons name="time-outline" size={14} color="#FACC15" />
                                    <Text style={styles.videoDuration}>{faNum(currentLesson.duration)}</Text>
                                </View>
                            ) : null}
                            {currentLesson.video_url ? (
                                <View style={{ marginTop: spacing.sm }}>
                                    <PrimaryButton
                                        title="پخش ویدیو"
                                        icon="play-circle-outline"
                                        variant="gold"
                                        onPress={() => Linking.openURL(currentLesson.video_url!)}
                                    />
                                </View>
                            ) : null}
                        </View>

                        <View style={styles.lessonActionsRow}>
                            <PrimaryButton
                                title={isCurrentCompleted ? 'تکمیل شده' : 'ثبت تکمیل درس'}
                                icon={isCurrentCompleted ? 'checkmark-done-circle' : 'checkmark-circle-outline'}
                                onPress={toggleComplete}
                                variant={isCurrentCompleted ? 'outline' : 'primary'}
                            />
                        </View>

                        {currentLesson.description ? (
                            <Text style={[styles.lessonDesc, { color: colors.muted }]} numberOfLines={2}>
                                {currentLesson.description}
                            </Text>
                        ) : null}

                        {/* Compact Notes Section */}
                        <View style={[styles.notesBox, { borderTopColor: colors.border }]}>
                            <View style={styles.iconRow}>
                                <Ionicons name="create-outline" size={18} color={colors.primary} />
                                <Text style={[styles.notesLabel, { color: colors.text }]}>یادداشت</Text>
                            </View>
                            <TextInput
                                value={noteText}
                                onChangeText={setNoteText}
                                multiline
                                placeholder="یادداشت کلیدی…"
                                placeholderTextColor={colors.muted}
                                style={[
                                    styles.notesInput,
                                    {
                                        backgroundColor: colors.surfaceAlt,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    },
                                ]}
                            />
                            <PrimaryButton
                                title="ذخیره"
                                icon="bookmark-outline"
                                onPress={saveNote}
                                loading={savingNote}
                                variant="gold"
                            />

                            {notesList.length > 0 ? (
                                <View style={styles.savedNotesList}>
                                    {notesList.map((n) => (
                                        <View
                                            key={n.id}
                                            style={[
                                                styles.savedNoteItem,
                                                { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                                            ]}
                                        >
                                            <View style={styles.iconRow}>
                                                <Ionicons name="document-text-outline" size={13} color={colors.primary} />
                                                <Text style={[styles.savedNoteMeta, { color: colors.primary }]}>
                                                    {n.lesson_title}
                                                </Text>
                                            </View>
                                            <Text style={[styles.savedNoteContent, { color: colors.text }]} numberOfLines={2}>
                                                {n.content}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ) : null}
                        </View>
                    </View>
                ) : null}

                <View style={styles.syllabus}>
                    <View style={styles.iconRow}>
                        <Ionicons name="list-outline" size={20} color={colors.primary} />
                        <Text style={[styles.syllabusTitle, { color: colors.text }]}>جلسات</Text>
                    </View>
                    {course.modules?.map((mod, mIdx) => (
                        <View
                            key={mod.id}
                            style={[styles.moduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.iconRow}>
                                <Ionicons name="folder-open-outline" size={16} color={colors.primary} />
                                <Text style={[styles.moduleTitle, { color: colors.primary }]}>
                                    فصل {faNum(mIdx + 1)}: {mod.title}
                                </Text>
                            </View>
                            {mod.lessons.map((lesson, lIdx) => {
                                const active = currentLesson?.id === lesson.id;
                                const done = completedIds.includes(lesson.id);
                                return (
                                    <Pressable
                                        key={lesson.id}
                                        onPress={() => setCurrentLesson(lesson)}
                                        style={[
                                            styles.lessonItem,
                                            { borderTopColor: colors.border },
                                            active && { backgroundColor: colors.primarySoft },
                                        ]}
                                    >
                                        <View style={[styles.iconRow, { flex: 1 }]}>
                                            <Ionicons
                                                name={done ? 'checkmark-circle' : active ? 'play-circle' : 'ellipse-outline'}
                                                size={18}
                                                color={done || active ? colors.primary : colors.muted}
                                            />
                                            <Text
                                                style={[
                                                    styles.lessonItemText,
                                                    { color: active ? colors.primary : colors.text },
                                                    active && styles.lessonItemTextActive,
                                                ]}
                                                numberOfLines={1}
                                            >
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
                                    </Pressable>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
    errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
    errorTitle: { ...typography.title },
    headerCard: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        gap: spacing.sm,
    },
    headerTopRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    courseTitle: { ...typography.title, textAlign: 'right' },
    lessonBox: {
        borderRadius: radius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    videoPlaceholder: {
        backgroundColor: '#0B3B2B',
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 175,
        gap: 6,
    },
    playCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#D6F39A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    videoTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', textAlign: 'center' },
    videoDuration: { color: '#FACC15', fontSize: 12 },
    iconRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    lessonActionsRow: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    lessonDesc: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, ...typography.small, textAlign: 'right' },
    notesBox: {
        padding: spacing.lg,
        marginTop: spacing.sm,
        borderTopWidth: 1,
        gap: spacing.sm,
    },
    notesLabel: { ...typography.subtitle, fontWeight: '700' },
    notesInput: {
        minHeight: 72,
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing.md,
        textAlign: 'right',
        textAlignVertical: 'top',
        fontSize: 13,
    },
    savedNotesList: {
        marginTop: spacing.xs,
        gap: spacing.sm,
    },
    savedNoteItem: {
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        gap: 4,
    },
    savedNoteMeta: { fontSize: 11, fontWeight: '700' },
    savedNoteContent: { fontSize: 13, lineHeight: 20, textAlign: 'right' },
    syllabus: { gap: spacing.md },
    syllabusTitle: { ...typography.title },
    moduleCard: {
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        gap: 6,
    },
    moduleTitle: { ...typography.subtitle },
    lessonItem: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.sm,
        borderTopWidth: 1,
        gap: 8,
    },
    lessonItemText: { ...typography.body, flex: 1, textAlign: 'right' },
    lessonItemTextActive: { fontWeight: '700' },
    lessonDuration: { ...typography.tiny },
});
