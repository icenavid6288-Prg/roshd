import React, { useCallback, useEffect, useState } from 'react';
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
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

    if (loading) return <Loading label="در حال دریافت جلسات کوچینگ…" />;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.title, { color: colors.text }]}>جلسات کوچینگ من</Text>
                        <Text style={[styles.subtitle, { color: colors.muted }]}>
                            جلسات مشاوره اختصاصی و پیگیری اهداف استراتژیک
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => setShowForm((v) => !v)}
                        style={[styles.newBtn, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.newBtnText}>{showForm ? 'بستن فرم' : '+ رزرو جلسه'}</Text>
                    </Pressable>
                </View>

                {showForm ? (
                    <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                        <Text style={[styles.formTitle, { color: colors.text }]}>رزرو جلسه کوچینگ جدید</Text>
                        <Field
                            label="موضوع جلسه"
                            value={title}
                            onChangeText={setTitle}
                            placeholder="مثلاً: بررسی استراتژی فروش و قیمت‌گذاری"
                        />
                        <Field
                            label="تاریخ پیشنهادی"
                            value={dateLabel}
                            onChangeText={setDateLabel}
                            placeholder="پنج‌شنبه ۱ خرداد ۱۴۰۴"
                        />
                        <Field
                            label="بازه زمانی"
                            value={timeLabel}
                            onChangeText={setTimeLabel}
                            placeholder="ساعت ۱۷:۰۰ تا ۱۸:۰۰"
                        />
                        <Field
                            label="توضیحات یا دغدغه اصلی"
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="نکات مهمی که کوچ باید پیش از جلسه بداند…"
                        />
                        <PrimaryButton
                            title="ثبت نهایی رزرو جلسه"
                            onPress={handleBook}
                            loading={submitting}
                        />
                    </View>
                ) : null}

                {sessions.length === 0 ? (
                    <EmptyState icon="🎯" title="هنوز جلسه‌ای رزرو نشده است" />
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
                                        label={isUpcoming ? 'در انتظار برگزاری' : 'برگزار شده'}
                                        tone={isUpcoming ? 'gold' : 'primary'}
                                    />
                                    <Text style={[styles.duration, { color: colors.muted }]}>
                                        {faNum(s.duration_minutes)} دقیقه
                                    </Text>
                                </View>
                                <Text style={[styles.sessionTitle, { color: colors.text }]}>{s.title}</Text>
                                <Text style={[styles.coachName, { color: colors.primary }]}>
                                    👤 {s.coach_name} ({s.coach_title})
                                </Text>
                                <View style={[styles.dateBox, { backgroundColor: colors.surfaceAlt }]}>
                                    <Text style={[styles.dateText, { color: colors.text }]}>📅 {s.date_label}</Text>
                                    <Text style={[styles.dateText, { color: colors.text }]}>⏰ {s.time_label}</Text>
                                </View>
                                {s.notes ? (
                                    <Text style={[styles.notes, { color: colors.muted }]}>📝 {s.notes}</Text>
                                ) : null}
                                {isUpcoming && s.meeting_url ? (
                                    <PrimaryButton
                                        title="ورود به اتاق جلسه آنلاین"
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    title: { ...typography.title },
    subtitle: { ...typography.small, marginTop: 2 },
    newBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: radius.md,
    },
    newBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
    formCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        gap: 4,
    },
    formTitle: { ...typography.subtitle, fontWeight: '700', marginBottom: spacing.sm },
    sessionCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: spacing.sm,
    },
    sessionTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    duration: { ...typography.small },
    sessionTitle: { ...typography.subtitle, fontWeight: '700' },
    coachName: { ...typography.small, fontWeight: '700' },
    dateBox: {
        padding: spacing.md,
        borderRadius: radius.md,
        gap: 4,
    },
    dateText: { ...typography.small, fontWeight: '600' },
    notes: { ...typography.small },
});
