import React, { useCallback, useEffect, useState } from 'react';
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chip, EmptyState, Field, Loading, PrimaryButton, Screen } from '../components';
import { api } from '../api/client';
import type { CoachingSessionPayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';

export function SessionsScreen() {
    const { colors } = useTheme();
    const [sessions, setSessions] = useState<CoachingSessionPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [dateLabel, setDateLabel] = useState('پنج‌شنبه ۱ خرداد ۱۴۰۴');
    const [timeLabel, setTimeLabel] = useState('ساعت ۱۷:۰۰ تا ۱۸:۰۰');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(async () => {
        const res = await api<CoachingSessionPayload[]>('/api/v1/sessions');
        setSessions(res);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleBook = async () => {
        if (!title.trim()) return;
        setSubmitting(true);
        try {
            const updated = await api<CoachingSessionPayload[]>('/api/v1/sessions', {
                method: 'POST',
                body: {
                    title: title.trim(),
                    date_label: dateLabel,
                    time_label: timeLabel,
                    notes: notes.trim(),
                },
            });
            setSessions(updated);
            setTitle('');
            setNotes('');
            setShowForm(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <View style={styles.iconTitleRow}>
                        <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                        <Text style={[styles.title, { color: colors.text }]}>جلسات کوچینگ</Text>
                    </View>
                    <Pressable
                        onPress={() => setShowForm((v) => !v)}
                        style={[styles.newBtn, { backgroundColor: colors.primary }]}
                    >
                        <Ionicons
                            name={showForm ? 'close-circle-outline' : 'add-circle-outline'}
                            size={18}
                            color="#FFFFFF"
                        />
                        <Text style={styles.newBtnText}>{showForm ? 'بستن' : 'رزرو'}</Text>
                    </Pressable>
                </View>

                {showForm ? (
                    <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                        <Field
                            label="موضوع جلسه"
                            value={title}
                            onChangeText={setTitle}
                            placeholder="موضوع مشاوره…"
                        />
                        <Field
                            label="تاریخ"
                            value={dateLabel}
                            onChangeText={setDateLabel}
                        />
                        <Field
                            label="ساعت"
                            value={timeLabel}
                            onChangeText={setTimeLabel}
                        />
                        <Field
                            label="یادداشت"
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="نکات کلیدی…"
                        />
                        <PrimaryButton
                            title="ثبت رزرو"
                            icon="checkmark-circle-outline"
                            onPress={handleBook}
                            loading={submitting}
                        />
                    </View>
                ) : null}

                {sessions.length === 0 ? (
                    <EmptyState icon="calendar-outline" title="جلسه‌ای رزرو نشده" />
                ) : (
                    sessions.map((s) => {
                        const isUpcoming = s.status === 'upcoming';
                        return (
                            <View
                                key={s.id}
                                style={[
                                    styles.sessionCard,
                                    { backgroundColor: colors.surface, borderColor: colors.border },
                                ]}
                            >
                                <View style={styles.sessionTop}>
                                    <Chip
                                        label={isUpcoming ? 'در انتظار' : 'برگزار شده'}
                                        tone={isUpcoming ? 'gold' : 'primary'}
                                        icon={isUpcoming ? 'time-outline' : 'checkmark-circle-outline'}
                                    />
                                    <Chip
                                        label={`${faNum(s.duration_minutes)} دقیقه`}
                                        tone="muted"
                                        icon="hourglass-outline"
                                    />
                                </View>
                                <Text style={[styles.sessionTitle, { color: colors.text }]} numberOfLines={1}>
                                    {s.title}
                                </Text>
                                <View style={styles.iconTitleRow}>
                                    <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
                                    <Text style={[styles.coachName, { color: colors.primary }]}>
                                        {s.coach_name}
                                    </Text>
                                </View>
                                <View style={[styles.dateBox, { backgroundColor: colors.surfaceAlt }]}>
                                    <View style={styles.iconTitleRow}>
                                        <Ionicons name="calendar-outline" size={15} color={colors.text} />
                                        <Text style={[styles.dateText, { color: colors.text }]}>{s.date_label}</Text>
                                    </View>
                                    <View style={styles.iconTitleRow}>
                                        <Ionicons name="time-outline" size={15} color={colors.text} />
                                        <Text style={[styles.dateText, { color: colors.text }]}>{s.time_label}</Text>
                                    </View>
                                </View>
                                {isUpcoming && s.meeting_url ? (
                                    <PrimaryButton
                                        title="ورود به جلسه آنلاین"
                                        icon="videocam-outline"
                                        onPress={() => Linking.openURL(s.meeting_url!)}
                                        variant="primary"
                                    />
                                ) : null}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
    headerRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    iconTitleRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    title: { ...typography.title },
    newBtn: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: radius.md,
    },
    newBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
    formCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        gap: 4,
    },
    sessionCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: spacing.sm,
    },
    sessionTop: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionTitle: { ...typography.subtitle, fontWeight: '700', textAlign: 'right' },
    coachName: { ...typography.small, fontWeight: '700' },
    dateBox: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderRadius: radius.md,
    },
    dateText: { ...typography.small, fontWeight: '600' },
});
