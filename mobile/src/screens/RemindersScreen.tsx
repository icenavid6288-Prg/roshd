import React, { useCallback, useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { Chip, Loading, PrimaryButton, Screen } from '../components';
import { api } from '../api/client';
import type { ReminderSettingsPayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';

const FREQUENCIES: Array<{ key: ReminderSettingsPayload['course_frequency']; label: string }> = [
    { key: 'daily', label: 'هر روز' },
    { key: 'every_2_days', label: 'یک روز در میان' },
    { key: 'weekly', label: 'هفتگی' },
];

const LEAD_TIMES: Array<{ key: string; label: string }> = [
    { key: '24h', label: '۲۴ ساعت قبل' },
    { key: '3h', label: '۳ ساعت قبل' },
    { key: '1h', label: '۱ ساعت قبل' },
    { key: '15m', label: '۱۵ دقیقه قبل' },
];

export function RemindersScreen() {
    const { colors } = useTheme();
    const [settings, setSettings] = useState<ReminderSettingsPayload | null>(null);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [banner, setBanner] = useState<string | null>(null);

    const load = useCallback(async () => {
        const res = await api<ReminderSettingsPayload>('/api/v1/reminders');
        setSettings(res);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const update = async (patch: Partial<ReminderSettingsPayload>) => {
        if (!settings) return;
        const next = { ...settings, ...patch };
        setSettings(next);
        setSaving(true);
        try {
            const saved = await api<ReminderSettingsPayload>('/api/v1/reminders', {
                method: 'POST',
                body: next as unknown as Record<string, unknown>,
            });
            setSettings(saved);
        } finally {
            setSaving(false);
        }
    };

    const toggleChannel = (channel: keyof ReminderSettingsPayload['channels']) => {
        if (!settings) return;
        update({
            channels: {
                ...settings.channels,
                [channel]: !settings.channels[channel],
            },
        });
    };

    const toggleLeadTime = (leadKey: string) => {
        if (!settings) return;
        const exists = settings.session_lead_times.includes(leadKey);
        const nextLeads = exists
            ? settings.session_lead_times.filter((k) => k !== leadKey)
            : [...settings.session_lead_times, leadKey];
        update({ session_lead_times: nextLeads });
    };

    const sendTestReminder = async () => {
        setTesting(true);
        setBanner(null);
        try {
            const res = await api<{ ok: boolean; message: string; reminders: ReminderSettingsPayload }>(
                '/api/v1/reminders/test',
                { method: 'POST' },
            );
            setSettings(res.reminders);
            setBanner(res.message);
        } finally {
            setTesting(false);
        }
    };

    if (!settings) {
        return <Loading label="در حال بارگذاری تنظیمات یادآوری…" />;
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Hero Banner */}
                <View style={[styles.heroCard, { backgroundColor: colors.primaryDark }]}>
                    <View style={styles.heroHeaderRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.heroBadge}>افزایش نرخ تکمیل دوره‌ها تا ۳ برابر</Text>
                            <Text style={styles.heroTitle}>سیستم یادآوری هوشمند</Text>
                            <Text style={styles.heroSubtitle}>
                                یادآوری خودکار ادامه درس‌های ناتمام و جلسات کوچینگ رزرو شده روی موبایل شما.
                            </Text>
                        </View>
                        <Switch
                            value={settings.enabled}
                            onValueChange={(val) => update({ enabled: val })}
                            trackColor={{ false: '#475569', true: colors.gold }}
                            thumbColor={colors.white}
                        />
                    </View>
                </View>

                {banner ? (
                    <View style={[styles.bannerBox, { backgroundColor: colors.successSoft, borderColor: colors.primary }]}>
                        <Text style={[styles.bannerText, { color: colors.primary }]}>✓ {banner}</Text>
                    </View>
                ) : null}

                {/* Incomplete Courses Section */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>📚 یادآوری دوره‌های ناتمام</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
                                پیگیری هوشمند درس‌هایی که نیمه‌تمام رها شده‌اند
                            </Text>
                        </View>
                        <Switch
                            value={settings.incomplete_courses}
                            onValueChange={(val) => update({ incomplete_courses: val })}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <Text style={[styles.label, { color: colors.text }]}>تناوب ارسال یادآوری:</Text>
                    <View style={styles.chipsRow}>
                        {FREQUENCIES.map((freq) => {
                            const active = settings.course_frequency === freq.key;
                            return (
                                <Pressable
                                    key={freq.key}
                                    onPress={() => update({ course_frequency: freq.key })}
                                    style={[
                                        styles.choiceBtn,
                                        {
                                            backgroundColor: active ? colors.primary : colors.surfaceAlt,
                                            borderColor: active ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text style={{ color: active ? colors.white : colors.text, fontSize: 12, fontWeight: '700' }}>
                                        {freq.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={[styles.timeRow, { backgroundColor: colors.surfaceAlt }]}>
                        <Text style={[styles.timeLabel, { color: colors.text }]}>⏰ ساعت ترجیحی مطالعه روزانه:</Text>
                        <View style={styles.timeOptions}>
                            {['18:00', '20:00', '21:30'].map((t) => {
                                const active = settings.course_preferred_time === t;
                                return (
                                    <Pressable
                                        key={t}
                                        onPress={() => update({ course_preferred_time: t })}
                                        style={[
                                            styles.timeChip,
                                            { backgroundColor: active ? colors.primary : colors.surface },
                                        ]}
                                    >
                                        <Text style={{ color: active ? colors.white : colors.text, fontSize: 12, fontWeight: '700' }}>
                                            {faNum(t)}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Coaching Sessions Section */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>🎯 یادآوری جلسات کوچینگ</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
                                اعلام زمان جلسه و ارسال لینک ورود به اتاق آنلاین
                            </Text>
                        </View>
                        <Switch
                            value={settings.coaching_sessions}
                            onValueChange={(val) => update({ coaching_sessions: val })}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <Text style={[styles.label, { color: colors.text }]}>زمان‌های اطلاع‌رسانی قبل از شروع جلسه:</Text>
                    <View style={styles.chipsRow}>
                        {LEAD_TIMES.map((lt) => {
                            const active = settings.session_lead_times.includes(lt.key);
                            return (
                                <Pressable
                                    key={lt.key}
                                    onPress={() => toggleLeadTime(lt.key)}
                                    style={[
                                        styles.choiceBtn,
                                        {
                                            backgroundColor: active ? colors.primary : colors.surfaceAlt,
                                            borderColor: active ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text style={{ color: active ? colors.white : colors.text, fontSize: 12, fontWeight: '700' }}>
                                        {active ? '✓ ' : ''}{lt.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Notification Channels */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>📲 کانال‌های دریافت اعلان</Text>
                    <View style={styles.channelsGrid}>
                        {[
                            { key: 'push' as const, label: 'پوش نوتیفیکیشن موبایل', icon: '🔔' },
                            { key: 'sms' as const, label: 'پیامک (SMS)', icon: '💬' },
                            { key: 'telegram' as const, label: 'ربات تلگرام', icon: '✈️' },
                            { key: 'email' as const, label: 'ایمیل', icon: '✉️' },
                        ].map((ch) => {
                            const active = settings.channels[ch.key];
                            return (
                                <Pressable
                                    key={ch.key}
                                    onPress={() => toggleChannel(ch.key)}
                                    style={[
                                        styles.channelItem,
                                        {
                                            backgroundColor: active ? colors.primarySoft : colors.surfaceAlt,
                                            borderColor: active ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text style={styles.channelIcon}>{ch.icon}</Text>
                                    <Text style={[styles.channelLabel, { color: colors.text }]}>{ch.label}</Text>
                                    <Chip label={active ? 'فعال' : 'غیرفعال'} tone={active ? 'primary' : 'muted'} />
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={[styles.quietRow, { borderTopColor: colors.border }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.label, { color: colors.text, marginTop: 0 }]}>🌙 ساعات سکوت شبانه</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
                                عدم ارسال پیام بین ساعت {faNum(settings.quiet_hours_start)} تا {faNum(settings.quiet_hours_end)}
                            </Text>
                        </View>
                        <Switch
                            value={settings.quiet_hours_enabled}
                            onValueChange={(val) => update({ quiet_hours_enabled: val })}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <PrimaryButton
                    title={saving ? 'در حال ذخیره…' : 'ارسال یادآوری آزمایشی همین الان'}
                    onPress={sendTestReminder}
                    loading={testing}
                    variant="gold"
                />

                {/* Recent Logs */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>📋 تاریخچه آخرین یادآوری‌های ارسالی</Text>
                    {settings.recent_logs.map((log) => (
                        <View key={log.id} style={[styles.logRow, { borderBottomColor: colors.border }]}>
                            <View style={{ flex: 1, gap: 2 }}>
                                <Text style={[styles.logTitle, { color: colors.text }]}>{log.title}</Text>
                                <Text style={[styles.logMeta, { color: colors.muted }]}>
                                    {log.channel} • {log.sent_at}
                                </Text>
                            </View>
                            <Chip label="ارسال شد" tone="primary" />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
    heroCard: {
        borderRadius: radius.xl,
        padding: spacing.lg,
    },
    heroHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    heroBadge: {
        color: '#FACC15',
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 4,
    },
    heroTitle: {
        ...typography.title,
        color: '#FFFFFF',
        fontSize: 20,
    },
    heroSubtitle: {
        ...typography.small,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
    },
    bannerBox: {
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
    },
    bannerText: {
        ...typography.small,
        fontWeight: '700',
    },
    card: {
        borderRadius: radius.lg,
        borderWidth: 1,
        padding: spacing.lg,
        gap: spacing.md,
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    cardTitle: { ...typography.subtitle, fontWeight: '700' },
    cardSubtitle: { ...typography.small, marginTop: 2 },
    label: { ...typography.small, fontWeight: '700', marginTop: spacing.xs },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    choiceBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: radius.pill,
        borderWidth: 1,
    },
    timeRow: {
        padding: spacing.md,
        borderRadius: radius.md,
        gap: spacing.sm,
    },
    timeLabel: { ...typography.small, fontWeight: '600' },
    timeOptions: { flexDirection: 'row', gap: spacing.sm },
    timeChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: radius.md,
    },
    channelsGrid: { gap: spacing.sm },
    channelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        gap: spacing.sm,
    },
    channelIcon: { fontSize: 18 },
    channelLabel: { flex: 1, fontSize: 13, fontWeight: '600' },
    quietRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        gap: spacing.md,
    },
    logRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        gap: spacing.sm,
    },
    logTitle: { fontSize: 13, fontWeight: '600' },
    logMeta: { fontSize: 11 },
});
