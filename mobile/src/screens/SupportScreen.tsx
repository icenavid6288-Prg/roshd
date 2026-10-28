import React, { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Chip, EmptyState, Field, Loading, PrimaryButton, Screen } from '../components';
import { api } from '../api/client';
import type { SupportTicketPayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';

export function SupportScreen() {
    const { colors } = useTheme();
    const [tickets, setTickets] = useState<SupportTicketPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const load = useCallback(async () => {
        const res = await api<SupportTicketPayload[]>('/api/v1/support');
        setTickets(res);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const submitTicket = async () => {
        if (!subject.trim() || !message.trim()) return;
        setSending(true);
        try {
            const updated = await api<SupportTicketPayload[]>('/api/v1/support', {
                method: 'POST',
                body: {
                    subject: subject.trim(),
                    department: 'پشتیبانی آموزشی',
                    message: message.trim(),
                },
            });
            setTickets(updated);
            setSubject('');
            setMessage('');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <Loading label="در حال دریافت تیکت‌های پشتیبانی…" />;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.text }]}>ارسال تیکت پشتیبانی جدید</Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>
                        تیم پشتیبانی مرکز رشد در کمتر از ۲ ساعت پاسخ‌گوی شماست.
                    </Text>
                    <Field
                        label="موضوع درخواست"
                        value={subject}
                        onChangeText={setSubject}
                        placeholder="مثلاً: راهنمایی درباره نحوه دسترسی به جلسات کارگاه"
                    />
                    <Field
                        label="متن پیام"
                        value={message}
                        onChangeText={setMessage}
                        placeholder="سؤال یا درخواست خود را بنویسید…"
                        multiline
                    />
                    <PrimaryButton title="ثبت و ارسال تیکت" onPress={submitTicket} loading={sending} />
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>تیکت‌های اخیر شما</Text>
                {tickets.length === 0 ? (
                    <EmptyState icon="💬" title="تیکتی ثبت نشده است" />
                ) : (
                    tickets.map((t) => (
                        <View
                            key={t.id}
                            style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.topRow}>
                                <Chip
                                    label={t.status === 'answered' ? 'پاسخ داده شده' : 'در حال بررسی'}
                                    tone={t.status === 'answered' ? 'primary' : 'gold'}
                                />
                                <Text style={[styles.meta, { color: colors.muted }]}>
                                    #{faNum(t.id)} • {t.updated_at}
                                </Text>
                            </View>
                            <Text style={[styles.ticketSubject, { color: colors.text }]}>{t.subject}</Text>
                            <Text style={[styles.ticketMessage, { color: colors.muted }]}>{t.last_message}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
    formCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: 6,
    },
    title: { ...typography.title },
    subtitle: { ...typography.small, marginBottom: spacing.sm },
    sectionTitle: { ...typography.title, marginTop: spacing.sm },
    ticketCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: spacing.xs,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    meta: { ...typography.tiny },
    ticketSubject: { ...typography.subtitle, fontWeight: '700', marginTop: 4 },
    ticketMessage: { ...typography.small, marginTop: 2 },
});
