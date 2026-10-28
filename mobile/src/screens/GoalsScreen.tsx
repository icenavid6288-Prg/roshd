import React, { useCallback, useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Chip, Field, Loading, PrimaryButton, ProgressBar, Screen } from '../components';
import { api, openSitePage } from '../api/client';
import type { CertificatePayload, GoalPayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';

export function GoalsScreen() {
    const { colors } = useTheme();
    const [goals, setGoals] = useState<GoalPayload[]>([]);
    const [certificates, setCertificates] = useState<CertificatePayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [adding, setAdding] = useState(false);

    const load = useCallback(async () => {
        const res = await api<{ goals: GoalPayload[]; certificates: CertificatePayload[] }>('/api/v1/goals');
        setGoals(res.goals || []);
        setCertificates(res.certificates || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const toggleGoal = async (id: number) => {
        const res = await api<{ goals: GoalPayload[]; certificates: CertificatePayload[] }>('/api/v1/goals', {
            method: 'POST',
            body: { action: 'toggle', id },
        });
        setGoals(res.goals);
    };

    const addGoal = async () => {
        if (!newGoalTitle.trim()) return;
        setAdding(true);
        try {
            const res = await api<{ goals: GoalPayload[]; certificates: CertificatePayload[] }>('/api/v1/goals', {
                method: 'POST',
                body: { title: newGoalTitle.trim(), category: 'رشد فردی و کسب‌وکار' },
            });
            setGoals(res.goals);
            setNewGoalTitle('');
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <Loading label="در حال بارگذاری اهداف و گواهینامه‌ها…" />;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>🎯 اهداف رشد فردی و سازمانی</Text>
                <View style={[styles.addCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Field
                        label="تعریف هدف ۹۰ روزه جدید"
                        value={newGoalTitle}
                        onChangeText={setNewGoalTitle}
                        placeholder="مثلاً: افزایش ۳۰٪ نرخ تبدیل لیدهای سازمانی"
                    />
                    <PrimaryButton title="افزودن به اهداف من" onPress={addGoal} loading={adding} />
                </View>

                {goals.map((g) => (
                    <Pressable
                        key={g.id}
                        onPress={() => toggleGoal(g.id)}
                        style={[
                            styles.goalCard,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        <View style={styles.goalHeader}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.goalTitle,
                                        {
                                            color: colors.text,
                                            textDecorationLine: g.completed ? 'line-through' : 'none',
                                        },
                                    ]}
                                >
                                    {g.completed ? '✅ ' : '⬜ '}
                                    {g.title}
                                </Text>
                                <Text style={[styles.goalMeta, { color: colors.muted }]}>
                                    {g.category} • سررسید: {g.target_date}
                                </Text>
                            </View>
                            <Chip
                                label={`${faNum(g.progress)}٪`}
                                tone={g.completed ? 'primary' : 'gold'}
                            />
                        </View>
                        <ProgressBar value={g.progress} />
                    </Pressable>
                ))}

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>
                    🏅 گواهینامه‌های صادر شده
                </Text>
                {certificates.map((cert) => (
                    <View
                        key={cert.id}
                        style={[
                            styles.certCard,
                            { backgroundColor: colors.surface, borderColor: colors.gold },
                        ]}
                    >
                        <View style={styles.goalHeader}>
                            <Chip label="گواهینامه رسمی" tone="gold" />
                            <Text style={[styles.goalMeta, { color: colors.muted }]}>کد: {cert.code}</Text>
                        </View>
                        <Text style={[styles.goalTitle, { color: colors.text }]}>{cert.course_title}</Text>
                        <Text style={[styles.goalMeta, { color: colors.muted }]}>
                            تاریخ صدور: {cert.issued_at} • نمره: {cert.grade}
                        </Text>
                        <PrimaryButton
                            title="استعلام و دانلود گواهینامه"
                            onPress={() => openSitePage(cert.download_url)}
                            variant="outline"
                        />
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
    sectionTitle: { ...typography.title },
    addCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
    },
    goalCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: spacing.sm,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.sm,
    },
    goalTitle: { ...typography.subtitle, fontWeight: '700' },
    goalMeta: { ...typography.small, marginTop: 4 },
    certCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        gap: spacing.sm,
    },
});
