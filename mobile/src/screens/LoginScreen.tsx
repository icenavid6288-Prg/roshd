import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Field, PrimaryButton, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ApiError } from '../api/client';
import { radius, spacing, typography } from '../theme';

export function LoginScreen({ onGoRegister }: { onGoRegister: () => void }) {
    const { login } = useAuth();
    const { colors } = useTheme();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const submit = async () => {
        setError(null);
        if (!identifier.trim() || !password) {
            setError('ایمیل یا شماره موبایل و رمز عبور را وارد کنید.');
            return;
        }
        setBusy(true);
        try {
            await login(identifier.trim(), password);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'خطا در ورود. دوباره تلاش کنید.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <Screen>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={[styles.logo, { backgroundColor: colors.primary }]}>
                        <Text style={styles.logoText}>مرکز رشد دکتر بیدی</Text>
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>ورود به حساب کاربری</Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>
                        برای ادامه مسیر یادگیری، وارد حساب خود شوید
                    </Text>

                    <View style={styles.form}>
                        <Field
                            label="ایمیل یا شماره موبایل"
                            value={identifier}
                            onChangeText={setIdentifier}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            placeholder="you@example.com یا 09120000000"
                            style={{ textAlign: 'left' }}
                        />
                        <Field
                            label="رمز عبور"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password"
                            placeholder="••••••••"
                        />
                        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

                        <PrimaryButton title="ورود به اپلیکیشن" onPress={submit} loading={busy} />

                        <Pressable onPress={onGoRegister} style={styles.switchRow}>
                            <Text style={[styles.switchText, { color: colors.muted }]}>حساب کاربری ندارید؟ </Text>
                            <Text style={[styles.switchLink, { color: colors.primary }]}>ثبت‌نام کنید</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.xl,
    },
    logo: {
        alignSelf: 'center',
        borderRadius: radius.xl,
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginBottom: spacing.xl,
    },
    logoText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
    title: { ...typography.title, textAlign: 'center' },
    subtitle: { ...typography.small, textAlign: 'center', marginTop: 6, marginBottom: spacing.xl },
    form: { gap: 4 },
    error: { ...typography.small, marginBottom: spacing.md },
    switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
    switchText: { fontSize: 14 },
    switchLink: { fontSize: 14, fontWeight: '700' },
});
