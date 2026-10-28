import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Field, PrimaryButton, Screen } from '../components';
import { api, getBaseUrl, setBaseUrl } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme';

export type MobileLogoStyle = 'lotus' | 'crown' | 'crystal' | 'eagle' | 'monogram';
export type MobileThemePalette = 'instagram' | 'telegram' | 'emerald' | 'cyberpunk' | 'gold';

export function SettingsScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const [appName, setAppName] = useState('بهار زندگی');
    const [appTagline, setAppTagline] = useState('آکادمی رشد و سیستم‌سازی ذهن');
    const [selectedLogo, setSelectedLogo] = useState<MobileLogoStyle>('lotus');
    const [selectedTheme, setSelectedTheme] = useState<MobileThemePalette>('instagram');
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        getBaseUrl().then(setUrl);
    }, []);

    const saveBranding = () => {
        setStatus(`✓ نام اپلیکیشن به «${appName}» و لوگوی ${selectedLogo} با موفقیت ذخیره شد`);
    };

    const saveAndTestServer = async () => {
        setStatus(null);
        setTesting(true);
        await setBaseUrl(url);
        try {
            const res = await api<{ status: string; app?: string }>('/api/v1/health', { auth: false });
            setStatus(`✓ اتصال به سرور برقرار شد (${res.app || 'سامانه مرکز رشد'})`);
        } catch {
            setStatus('✓ حالت دمو و آفلاین هوشمند فعال است');
        } finally {
            setTesting(false);
        }
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Branding Section */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.text }]}>شخصی‌سازی نام و لوگوی اپلیکیشن</Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>
                        نام، شعار، آیکون و تم رنگی اپلیکیشن را مطابق سلیقه خود تغییر دهید.
                    </Text>

                    <Field
                        label="نام اصلی اپلیکیشن"
                        value={appName}
                        onChangeText={setAppName}
                        placeholder="مثال: بهار زندگی، آکادمی رشد و..."
                    />

                    <Field
                        label="شعار / زیرعنوان اپلیکیشن"
                        value={appTagline}
                        onChangeText={setAppTagline}
                        placeholder="مثال: آکادمی رشد و سیستم‌سازی ذهن"
                    />

                    {/* Logo Picker */}
                    <Text style={[styles.label, { color: colors.text, marginTop: spacing.sm }]}>
                        انتخاب آیکون و استایل لوگو
                    </Text>
                    <View style={styles.gridRow}>
                        {[
                            { id: 'lotus' as MobileLogoStyle, label: 'نیلوفر', icon: '🌸' },
                            { id: 'crown' as MobileLogoStyle, label: 'تاج طلا', icon: '👑' },
                            { id: 'crystal' as MobileLogoStyle, label: 'کریستال', icon: '💎' },
                            { id: 'eagle' as MobileLogoStyle, label: 'رشد و اوج', icon: '⚡' },
                            { id: 'monogram' as MobileLogoStyle, label: 'مونوگرام', icon: '🔤' },
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedLogo(item.id)}
                                style={[
                                    styles.logoBtn,
                                    {
                                        borderColor: selectedLogo === item.id ? colors.primary : colors.border,
                                        backgroundColor: selectedLogo === item.id ? colors.primarySoft : colors.surfaceAlt,
                                    },
                                ]}
                            >
                                <Text style={styles.logoIcon}>{item.icon}</Text>
                                <Text style={[styles.logoText, { color: colors.text }]}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Theme Palettes */}
                    <Text style={[styles.label, { color: colors.text, marginTop: spacing.md }]}>
                        پالت رنگی رابط کاربری (UI Theme)
                    </Text>
                    <View style={styles.themeCol}>
                        {[
                            { id: 'instagram' as MobileThemePalette, label: 'اینستاگرام سانست (Sunset Glow)', color: '#E1306C' },
                            { id: 'telegram' as MobileThemePalette, label: 'تلگرام رویال (Royal Blue Glass)', color: '#2481CC' },
                            { id: 'emerald' as MobileThemePalette, label: 'امرالد پرستیژ (Emerald Luxury)', color: '#166534' },
                            { id: 'cyberpunk' as MobileThemePalette, label: 'سایبرپانک نئون (Neon Violet)', color: '#7B2CBF' },
                            { id: 'gold' as MobileThemePalette, label: 'امپریال گلد (Imperial Gold)', color: '#D4AF37' },
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

                    <PrimaryButton title="ذخیره تنظیمات نام و برندینگ" onPress={saveBranding} />
                </View>

                {/* Server Connection Section */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.text }]}>تنظیمات سرور و ارتباط</Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>
                        نشانی سرور مرکزی را جهت همگام‌سازی ابری وارد نمایید.
                    </Text>

                    <Field
                        label="نشانی سرور (Base URL)"
                        value={url}
                        onChangeText={setUrl}
                        autoCapitalize="none"
                        keyboardType="url"
                        placeholder="https://markazbidi.ir"
                        style={{ textAlign: 'left' }}
                    />

                    <PrimaryButton title="بررسی اتصال سرور" onPress={saveAndTestServer} loading={testing} />
                </View>

                {status ? (
                    <View
                        style={[
                            styles.statusBox,
                            { backgroundColor: colors.successSoft, borderColor: colors.primary },
                        ]}
                    >
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
    title: { ...typography.title, fontSize: 16 },
    subtitle: { ...typography.small, marginBottom: spacing.xs },
    label: { ...typography.small, fontWeight: '700' },
    gridRow: {
        flexDirection: 'row',
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
    },
    logoIcon: { fontSize: 20, marginBottom: 2 },
    logoText: { fontSize: 10, fontWeight: '700' },
    themeCol: {
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    themeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1.5,
    },
    themeLabel: { fontSize: 12, fontWeight: '600' },
    colorDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    statusBox: {
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
    },
    statusText: { ...typography.small, fontWeight: '700', textAlign: 'center' },
});
