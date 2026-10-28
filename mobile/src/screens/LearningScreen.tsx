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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Chip, Loading, PrimaryButton, ProgressBar, Screen } from '../components';
import { api, ApiError } from '../api/client';
import type { CourseLessonPayload, LearningData, LessonNotePayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Learning'>;

export function LearningScreen({ route }: Props) {
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
            .catch((e) => setError(e instanceof ApiError ? e.message : 'خطا در بارگذاری محتوای دوره'));
    }, [slug, lessonId]);

    // Live study timer
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
                    <Text style={[styles.errorTitle, { color: colors.text }]}>دسترسی محدود</Text>
                    <Text style={[styles.errorText, { color: colors.muted }]}>{error}</Text>
                </View>
            </Screen>
        ) : (
            <Loading label="در حال آماده‌سازی اتاق یادگیری…" />
        );
    }

    const { course } = data;
    const isCurrentCompleted = currentLesson ? completedIds.includes(currentLesson.id) : false;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.headerTopRow}>
                        <Chip label={`⏱ زمان مطالعه این جلسه: ${formattedTimer}`} tone="gold" />
                        <Text style={[styles.progressMeta, { color: colors.primary }]}>
                            {faNum(progress)}٪ تکمیل شده
                        </Text>
                    </View>
                    <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                    <ProgressBar value={progress} />
                </View>

                {currentLesson ? (
                    <View style={[styles.lessonBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.videoPlaceholder}>
                            <Text style={styles.videoIcon}>🎬</Text>
                            <Text style={styles.videoTitle}>{currentLesson.title}</Text>
                            {currentLesson.duration ? (
                                <Text style={styles.videoDuration}>مدت زمان: {faNum(currentLesson.duration)}</Text>
                            ) : null}
                            {currentLesson.video_url ? (
                                <View style={{ marginTop: spacing.md }}>
                                    <PrimaryButton
                                        title="پخش ویدیو"
                                        variant="gold"
                                        onPress={() => Linking.openURL(currentLesson.video_url!)}
                                    />
                                </View>
                            ) : null}
                        </View>

                        <View style={styles.lessonActionsRow}>
                            <PrimaryButton
                                title={
                                    isCurrentCompleted
                                        ? '✓ این درس تکمیل شده (لغو تکمیل)'
                                        : 'ثبت تکمیل این درس (+XP)'
                                }
                                onPress={toggleComplete}
                                variant={isCurrentCompleted ? 'outline' : 'primary'}
                            />
                        </View>

                        {currentLesson.description ? (
                            <Text style={[styles.lessonDesc, { color: colors.text }]}>
                                {currentLesson.description}
                            </Text>
                        ) : null}

                        {/* Notes Section */}
                        <View style={[styles.notesBox, { borderTopColor: colors.border }]}>
                            <Text style={[styles.notesLabel, { color: colors.text }]}>
                                📝 یادداشت‌های من برای این درس
                            </Text>
                            <TextInput
                                value={noteText}
                                onChangeText={setNoteText}
                                multiline
                                placeholder="نکات کلیدی یا اقدام‌های اجرایی این درس را یادداشت کنید…"
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
                                title="ذخیره یادداشت"
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
                                            <Text style={[styles.savedNoteMeta, { color: colors.primary }]}>
                                                {n.lesson_title} • {n.created_at}
                                            </Text>
                                            <Text style={[styles.savedNoteContent, { color: colors.text }]}>
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
                    <Text style={[styles.syllabusTitle, { color: colors.text }]}>فهرست جلسات دوره</Text>
                    {course.modules?.map((mod, mIdx) => (
                        <View
                            key={mod.id}
                            style={[styles.moduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <Text style={[styles.moduleTitle, { color: colors.primary }]}>
                                فصل {faNum(mIdx + 1)}: {mod.title}
                            </Text>
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
                                        <Text
                                            style={[
                                                styles.lessonItemText,
                                                { color: active ? colors.primary : colors.text },
                                                active && styles.lessonItemTextActive,
                                            ]}
                                        >
                                            {done ? '✅ ' : `${faNum(lIdx + 1)}. `}
                                            {lesson.title}
                                        </Text>
                                        {lesson.duration ? (
                                            <Text style={[styles.lessonDuration, { color: colors.muted }]}>
                                                {faNum(lesson.duration)}
                                            </Text>
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
    errorText: { ...typography.small, textAlign: 'center' },
    headerCard: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        gap: spacing.sm,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    courseTitle: { ...typography.title },
    progressMeta: { ...typography.small, fontWeight: '700' },
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
        minHeight: 190,
        gap: 6,
    },
    videoIcon: { fontSize: 36 },
    videoTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', textAlign: 'center' },
    videoDuration: { color: '#FACC15', fontSize: 12 },
    lessonActionsRow: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    lessonDesc: { padding: spacing.lg, ...typography.body },
    notesBox: {
        padding: spacing.lg,
        borderTopWidth: 1,
        gap: spacing.sm,
    },
    notesLabel: { ...typography.subtitle, fontWeight: '700' },
    notesInput: {
        minHeight: 90,
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing.md,
        textAlign: 'right',
        textAlignVertical: 'top',
        fontSize: 13,
    },
    savedNotesList: {
        marginTop: spacing.sm,
        gap: spacing.sm,
    },
    savedNoteItem: {
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        gap: 4,
    },
    savedNoteMeta: { fontSize: 11, fontWeight: '700' },
    savedNoteContent: { fontSize: 13, lineHeight: 20 },
    syllabus: { gap: spacing.md },
    syllabusTitle: { ...typography.title },
    moduleCard: {
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        gap: 6,
    },
    moduleTitle: { ...typography.subtitle, marginBottom: 4 },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.sm,
        borderTopWidth: 1,
    },
    lessonItemText: { ...typography.body, flex: 1 },
    lessonItemTextActive: { fontWeight: '700' },
    lessonDuration: { ...typography.tiny },
});
