import React, { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

    if (loading) return <Loading />;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.iconRow}>
                            <Ionicons name="headset-outline" size={22} color={colors.primary} />
                            <Text style={[styles.title, { color: colors.text }]}>پشتیبانی سریع</Text>
                        </View>
                        <Chip label="< ۲ ساعت" tone="gold" icon="flash-outline" />
                    </View>
                    <Field
                        label="موضوع"
                        value={subject}
                        onChangeText={setSubject}
                        placeholder="موضوع پیام…"
                    />
                    <Field
                        label="پیام"
                        value={message}
                        onChangeText={setMessage}
                        placeholder="متن درخواست…"
                        multiline
                    />
                    <PrimaryButton
                        title="ارسال تیکت"
                        icon="paper-plane-outline"
                        onPress={submitTicket}
                        loading={sending}
                    />
                </View>

                <View style={styles.iconRow}>
                    <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>تیکت‌ها</Text>
                </View>

                {tickets.length === 0 ? (
                    <EmptyState icon="chatbubbles-outline" title="تیکتی ثبت نشده" />
                ) : (
                    tickets.map((t) => (
                        <View
                            key={t.id}
                            style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.topRow}>
                                <Chip
                                    label={t.status === 'answered' ? 'پاسخ داده شد' : 'در بررسی'}
                                    tone={t.status === 'answered' ? 'primary' : 'gold'}
                                    icon={t.status === 'answered' ? 'checkmark-done' : 'time-outline'}
                                />
                                <View style={styles.iconRow}>
                                    <Ionicons name="pricetag-outline" size={12} color={colors.muted} />
                                    <Text style={[styles.meta, { color: colors.muted }]}>
                                        #{faNum(t.id)} • {t.updated_at}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.ticketSubject, { color: colors.text }]} numberOfLines={1}>
                                {t.subject}
                            </Text>
                            <Text style={[styles.ticketMessage, { color: colors.muted }]} numberOfLines={2}>
                                {t.last_message}
                            </Text>
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
        gap: 8,
    },
    headerRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    iconRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    title: { ...typography.title },
    sectionTitle: { ...typography.title },
    ticketCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: spacing.xs,
    },
    topRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    meta: { ...typography.tiny },
    ticketSubject: { ...typography.subtitle, fontWeight: '700', marginTop: 4, textAlign: 'right' },
    ticketMessage: { ...typography.small, marginTop: 2, textAlign: 'right' },
});
