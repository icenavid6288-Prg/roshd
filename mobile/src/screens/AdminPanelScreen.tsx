import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, PrimaryButton } from '../components';
import { openSitePage } from '../api/client';
import { useTheme } from '../context/ThemeContext';

export function AdminPanelScreen() {
    const { colors } = useTheme();
    const [error, setError] = useState('');
    return (
        <Screen>
            <View style={styles.container}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
                        <Ionicons name="settings-outline" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>پنل مدیریت مرکز رشد</Text>
                    <PrimaryButton
                        title="ورود به پنل وب"
                        icon="open-outline"
                        onPress={() => {
                            openSitePage('/admin').catch(() => setError('خطا در باز کردن پنل'));
                        }}
                    />
                    {!!error && <Text style={{ color: colors.danger, fontSize: 12 }}>{error}</Text>}
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    card: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 68,
        height: 68,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
});
