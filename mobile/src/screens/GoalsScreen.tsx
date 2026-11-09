import React, { useCallback, useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chip, Field, Loading, PrimaryButton, ProgressBar, Screen } from '../components';
import { api } from '../api/client';
import type { GoalPayload } from '../api/types';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing, typography } from '../theme';

export function GoalsScreen() {
    const { colors } = useTheme();
    const [goals, setGoals] = useState<GoalPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [adding, setAdding] = useState(false);

    const load = useCallback(async () => {
        const res = await api<{ goals: GoalPayload[] }>('/api/v1/goals');
        setGoals(res.goals || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const toggleGoal = async (id: number) => {
        const res = await api<{ goals: GoalPayload[] }>('/api/v1/goals', {
            method: 'POST',
            body: { action: 'toggle', id },
        });
        setGoals(res.goals);
    };

    const addGoal = async () => {
        if (!newGoalTitle.trim()) return;
        setAdding(true);
        try {
            const res = await api<{ goals: GoalPayload[] }>('/api/v1/goals', {
                method: 'POST',
                body: { title: newGoalTitle.trim(), category: 'رشد فردی' },
            });
            setGoals(res.goals);
            setNewGoalTitle('');
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <Ionicons name="flag-outline" size={22} color={colors.primary} />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>اهداف ۹۰ روزه</Text>
                </View>

                <View style={[styles.addCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Field
                        value={newGoalTitle}
                        onChangeText={setNewGoalTitle}
                        placeholder="عنوان هدف جدید…"
                    />
                    <PrimaryButton
                        title="افزودن هدف"
                        icon="add-circle-outline"
                        onPress={addGoal}
                        loading={adding}
                    />
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
                            <View style={styles.goalTitleWrap}>
                                <Ionicons
                                    name={g.completed ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={22}
                                    color={g.completed ? colors.primary : colors.muted}
                                />
                                <Text
                                    style={[
                                        styles.goalTitle,
                                        {
                                            color: colors.text,
                                            textDecorationLine: g.completed ? 'line-through' : 'none',
                                        },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {g.title}
                                </Text>
                            </View>
                            <Chip
                                label={`${faNum(g.progress)}٪`}
                                tone={g.completed ? 'primary' : 'gold'}
                                icon={g.completed ? 'checkmark' : 'trending-up-outline'}
                            />
                        </View>
                        <View style={styles.metaRow}>
                            <View style={styles.metaPill}>
                                <Ionicons name="pricetag-outline" size={12} color={colors.muted} />
                                <Text style={[styles.goalMeta, { color: colors.muted }]}>{g.category}</Text>
                            </View>
                            {g.target_date ? (
                                <View style={styles.metaPill}>
                                    <Ionicons name="calendar-outline" size={12} color={colors.muted} />
                                    <Text style={[styles.goalMeta, { color: colors.muted }]}>{g.target_date}</Text>
                                </View>
                            ) : null}
                        </View>
                        <ProgressBar value={g.progress} />
                    </Pressable>
                ))}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
    headerRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
    sectionTitle: { ...typography.title },
    addCard: {
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1,
    },
    goalCard: {
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: spacing.sm,
    },
    goalHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.sm,
    },
    goalTitleWrap: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
    },
    goalTitle: { ...typography.subtitle, fontWeight: '700', flex: 1, textAlign: 'right' },
    metaRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 12,
    },
    metaPill: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
    },
    goalMeta: { ...typography.tiny },
});
