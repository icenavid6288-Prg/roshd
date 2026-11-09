import React, { useCallback, useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chip, Loading, PrimaryButton, Screen } from '../components';
import { api } from '../api/client';
import type { ReminderSettingsPayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';

const FREQUENCIES: Array<{ key: ReminderSettingsPayload['course_frequency']; label: string }> = [
    { key: 'daily', label: 'روزانه' },
    { key: 'every_2_days', label: 'یک روز در میان' },
    { key: 'weekly', label: 'هفتگی' },
];

const LEAD_TIMES: Array<{ key: string; label: string }> = [
    { key: '24h', label: '۲۴ ساعت' },
    { key: '3h', label: '۳ ساعت' },
    { key: '1h', label: '۱ ساعت' },
    { key: '15m', label: '۱۵ دقیقه' },
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
        return <Loading />;
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Compact Hero Switch */}
                <View style={[styles.heroCard, { backgroundColor: colors.primaryDark }]}>
                    <View style={styles.heroHeaderRow}>
                        <View style={styles.heroIconWrap}>
                            <Ionicons name="notifications" size={24} color="#D6F39A" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.heroTitle}>یادآور هوشمند</Text>
                            <Text style={styles.heroBadge}>پیگیری خودکار دروس و جلسات</Text>
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
                        <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                        <Text style={[styles.bannerText, { color: colors.primary }]}>{banner}</Text>
                    </View>
                ) : null}

                {/* Incomplete Courses Section */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.rowBetween}>
                        <View style={styles.iconTitleRow}>
                            <Ionicons name="book-outline" size={20} color={colors.primary} />
                            <Text style={[styles.cardTitle, { color: colors.text }]}>دوره‌های ناتمام</Text>
                        </View>
                        <Switch
                            value={settings.incomplete_courses}
                            onValueChange={(val) => update({ incomplete_courses: val })}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

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
                                    <Ionicons
                                        name="repeat-outline"
                                        size={13}
                                        color={active ? colors.white : colors.muted}
                                    />
                                    <Text style={{ color: active ? colors.white : colors.text, fontSize: 12, fontWeight: '700' }}>
                                        {freq.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={[styles.timeRow, { backgroundColor: colors.surfaceAlt }]}>
                        <Ionicons name="time-outline" size={18} color={colors.primary} />
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
                        <View style={styles.iconTitleRow}>
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                            <Text style={[styles.cardTitle, { color: colors.text }]}>جلسات کوچینگ</Text>
                        </View>
                        <Switch
                            value={settings.coaching_sessions}
                            onValueChange={(val) => update({ coaching_sessions: val })}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

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
                                    <Ionicons
                                        name="alarm-outline"
                                        size={13}
                                        color={active ? colors.white : colors.muted}
                                    />
                                    <Text style={{ color: active ? colors.white : colors.text, fontSize: 12, fontWeight: '700' }}>
                                        {lt.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Notification Channels Grid */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.iconTitleRow}>
                        <Ionicons name="radio-outline" size={20} color={colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.text }]}>کانال‌های اعلان</Text>
                    </View>
                    <View style={styles.channelsGrid}>
                        {[
                            { key: 'push' as const, label: 'اعلان موبایل', icon: 'notifications-outline' as const },
                            { key: 'sms' as const, label: 'پیامک', icon: 'chatbubble-ellipses-outline' as const },
                            { key: 'telegram' as const, label: 'تلگرام', icon: 'paper-plane-outline' as const },
                            { key: 'email' as const, label: 'ایمیل', icon: 'mail-outline' as const },
                        ].map((ch) => {
                            const active = settings.channels[ch.key];
                            return (
                                <Pressable
                                    key={ch.key}
                                    onPress={() => toggleChannel(ch.key)}
                                    style={[
                                        styles.channelTile,
                                        {
                                            backgroundColor: active ? colors.primarySoft : colors.surfaceAlt,
                                            borderColor: active ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Ionicons name={ch.icon} size={22} color={active ? colors.primary : colors.muted} />
                                    <Text style={[styles.channelLabel, { color: colors.text }]}>{ch.label}</Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={[styles.quietRow, { borderTopColor: colors.border }]}>
                        <View style={styles.iconTitleRow}>
                            <Ionicons name="moon-outline" size={18} color={colors.primary} />
                            <Text style={[styles.channelLabel, { color: colors.text }]}>
                                سکوت شبانه ({faNum(settings.quiet_hours_start)} - {faNum(settings.quiet_hours_end)})
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
                    title={saving ? 'در حال ذخیره…' : 'ارسال یادآور آزمایشی'}
                    icon="paper-plane-outline"
                    onPress={sendTestReminder}
                    loading={testing}
                    variant="gold"
                />

                {/* Compact Recent Logs */}
                {settings.recent_logs.length > 0 ? (
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.iconTitleRow}>
                            <Ionicons name="time-outline" size={18} color={colors.primary} />
                            <Text style={[styles.cardTitle, { color: colors.text }]}>آخرین ارسال‌ها</Text>
                        </View>
                        {settings.recent_logs.slice(0, 3).map((log) => (
                            <View key={log.id} style={[styles.logRow, { borderBottomColor: colors.border }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.logTitle, { color: colors.text }]} numberOfLines={1}>
                                        {log.title}
                                    </Text>
                                    <Text style={[styles.logMeta, { color: colors.muted }]}>
                                        {log.channel} • {log.sent_at}
                                    </Text>
                                </View>
                                <Chip label="ارسال شد" tone="primary" icon="checkmark" />
                            </View>
                        ))}
                    </View>
                ) : null}
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
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: spacing.md,
    },
    heroIconWrap: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: 'rgba(214,243,154,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroBadge: {
        color: '#D6F39A',
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'right',
    },
    heroTitle: {
        ...typography.title,
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'right',
    },
    bannerBox: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
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
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    iconTitleRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
    },
    cardTitle: { ...typography.subtitle, fontWeight: '700' },
    chipsRow: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    choiceBtn: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: radius.pill,
        borderWidth: 1,
    },
    timeRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.sm,
        borderRadius: radius.md,
    },
    timeOptions: { flexDirection: 'row-reverse', gap: spacing.sm },
    timeChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: radius.md,
    },
    channelsGrid: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 8,
    },
    channelTile: {
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: radius.md,
        borderWidth: 1,
        gap: 6,
    },
    channelLabel: { fontSize: 12, fontWeight: '700' },
    quietRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.md,
        borderTopWidth: 1,
    },
    logRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
        borderBottomWidth: 1,
        gap: spacing.sm,
    },
    logTitle: { fontSize: 12, fontWeight: '600', textAlign: 'right' },
    logMeta: { fontSize: 10, textAlign: 'right' },
});
