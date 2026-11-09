import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Field, PrimaryButton, Screen } from '../components';
import { api, getBaseUrl, setBaseUrl } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme';

export type MobileLogoStyle = 'lotus' | 'crown' | 'crystal' | 'eagle' | 'monogram';
export type MobileThemePalette = 'instagram' | 'telegram' | 'emerald' | 'cyberpunk' | 'gold';

export function SettingsScreen() {
    const { colors } = useTheme();
    const [appName, setAppName] = useState('بهار زندگی');
    const [appTagline, setAppTagline] = useState('آکادمی رشد');
    const [selectedLogo, setSelectedLogo] = useState<MobileLogoStyle>('lotus');
    const [selectedTheme, setSelectedTheme] = useState<MobileThemePalette>('instagram');
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        getBaseUrl().then(setUrl);
    }, []);

    const saveBranding = () => {
        setStatus(`«${appName}» ذخیره شد`);
    };

    const saveAndTestServer = async () => {
        setStatus(null);
        setTesting(true);
        await setBaseUrl(url);
        try {
            const res = await api<{ status: string; app?: string }>('/api/v1/health', { auth: false });
            setStatus(`متصل شد (${res.app || 'سرور'})`);
        } catch {
            setStatus('حالت آفلاین فعال است');
        } finally {
            setTesting(false);
        }
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Branding Section */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.iconHeaderRow}>
                        <Ionicons name="color-palette-outline" size={20} color={colors.primary} />
                        <Text style={[styles.title, { color: colors.text }]}>برندینگ و ظاهر</Text>
                    </View>

                    <Field
                        label="نام اپلیکیشن"
                        value={appName}
                        onChangeText={setAppName}
                    />

                    <Field
                        label="شعار کوتاه"
                        value={appTagline}
                        onChangeText={setAppTagline}
                    />

                    {/* Visual Ionicons Logo Picker instead of emojis */}
                    <View style={styles.gridRow}>
                        {[
                            { id: 'lotus' as MobileLogoStyle, label: 'نیلوفر', icon: 'flower-outline' as const },
                            { id: 'crown' as MobileLogoStyle, label: 'تاج', icon: 'ribbon-outline' as const },
                            { id: 'crystal' as MobileLogoStyle, label: 'کریستال', icon: 'diamond-outline' as const },
                            { id: 'eagle' as MobileLogoStyle, label: 'اوج', icon: 'flash-outline' as const },
                            { id: 'monogram' as MobileLogoStyle, label: 'نشان', icon: 'sparkles-outline' as const },
                        ].map((item) => {
                            const active = selectedLogo === item.id;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => setSelectedLogo(item.id)}
                                    style={[
                                        styles.logoBtn,
                                        {
                                            borderColor: active ? colors.primary : colors.border,
                                            backgroundColor: active ? colors.primarySoft : colors.surfaceAlt,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={item.icon}
                                        size={22}
                                        color={active ? colors.primary : colors.muted}
                                    />
                                    <Text style={[styles.logoText, { color: colors.text }]}>{item.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Compact Color Swatches */}
                    <View style={styles.themeCol}>
                        {[
                            { id: 'instagram' as MobileThemePalette, label: 'سانست', color: '#E1306C' },
                            { id: 'telegram' as MobileThemePalette, label: 'رویال', color: '#2481CC' },
                            { id: 'emerald' as MobileThemePalette, label: 'زمرد', color: '#166534' },
                            { id: 'cyberpunk' as MobileThemePalette, label: 'نئون', color: '#7B2CBF' },
                            { id: 'gold' as MobileThemePalette, label: 'طلایی', color: '#D4AF37' },
                        ].map((th) => (
                            <TouchableOpacity
                                key={th.id}
                                onPress={() => setSelectedTheme(th.id)}
                                style={[
                                    styles.themeRow,
                                    {
                                        borderColor: selectedTheme === th.id ? th.color : colors.border,
                                        backgroundColor: selectedTheme === th.id ? colors.surfaceAlt : colors.surface,
                                    },
                                ]}
                            >
                                <Text style={[styles.themeLabel, { color: colors.text }]}>{th.label}</Text>
                                <View style={[styles.colorDot, { backgroundColor: th.color }]} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <PrimaryButton
                        title="ذخیره ظاهر"
                        icon="checkmark-circle-outline"
                        onPress={saveBranding}
                    />
                </View>

                {/* Server Connection Section */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.iconHeaderRow}>
                        <Ionicons name="server-outline" size={20} color={colors.primary} />
                        <Text style={[styles.title, { color: colors.text }]}>سرور</Text>
                    </View>

                    <Field
                        label="Base URL"
                        value={url}
                        onChangeText={setUrl}
                        autoCapitalize="none"
                        keyboardType="url"
                        placeholder="https://markazbidi.ir"
                        style={{ textAlign: 'left' }}
                    />

                    <PrimaryButton
                        title="تست اتصال"
                        icon="pulse-outline"
                        onPress={saveAndTestServer}
                        loading={testing}
                    />
                </View>

                {status ? (
                    <View
                        style={[
                            styles.statusBox,
                            { backgroundColor: colors.successSoft, borderColor: colors.primary },
                        ]}
                    >
                        <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                        <Text style={[styles.statusText, { color: colors.primary }]}>{status}</Text>
                    </View>
                ) : null}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, gap: spacing.md },
    card: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        gap: spacing.sm,
    },
    iconHeaderRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    title: { ...typography.title, fontSize: 16 },
    gridRow: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    logoBtn: {
        flex: 1,
        minWidth: 58,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        borderRadius: radius.md,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    logoText: { fontSize: 10, fontWeight: '700' },
    themeCol: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginVertical: spacing.xs,
    },
    themeRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: radius.md,
        borderWidth: 1.5,
    },
    themeLabel: { fontSize: 12, fontWeight: '700' },
    colorDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    statusBox: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
    },
    statusText: { ...typography.small, fontWeight: '700' },
});
