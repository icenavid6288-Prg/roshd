import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../api/client';

export function normalizePhone(value: string) {
    let digits = value.replace(/[۰-۹]/g, c => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g, c => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[^0-9]/g, '');
    if (digits.startsWith('0098')) digits = '0' + digits.slice(4);
    else if (digits.startsWith('98')) digits = '0' + digits.slice(2);
    return digits;
}
function normalizeCode(value: string) {
    return value.replace(/[۰-۹]/g, c => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g, c => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[^0-9]/g, '').slice(0, 6);
}
type Challenge = { challenge: string; retry_after: number; expires_in: number };
export function LoginScreen() {
    const insets = useSafeAreaInsets();
    const { completePhoneLogin } = useAuth();
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [seconds, setSeconds] = useState(0);
    const codeInput = useRef<TextInput>(null);
    const mounted = useRef(true);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
    useEffect(() => {
        if (!challenge) return;
        const timer = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
        return () => clearInterval(timer);
    }, [challenge]);
    useEffect(() => { if (challenge) codeInput.current?.focus(); }, [challenge]);
    const showError = (e: unknown) => setError(e instanceof ApiError ? e.message : 'ارتباط برقرار نشد. دوباره تلاش کنید.');
    const send = async () => {
        if (busy) return;
        const normalized = normalizePhone(phone);
        if (!/^09[0-9]{9}$/.test(normalized)) { setError('شماره موبایل را به‌صورت ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.'); return; }
        setPhone(normalized); setError(''); setBusy(true);
        try {
            const result = await api<Challenge>('/api/v1/auth/otp/request', { method: 'POST', auth: false, body: { phone: normalized } });
            if (mounted.current) { setChallenge(result); setCode(''); setSeconds(result.retry_after); }
        } catch (e) { if (mounted.current) showError(e); }
        finally { if (mounted.current) setBusy(false); }
    };
    const verify = async () => {
        if (busy || !challenge) return;
        if (code.length !== 6) { setError('کد شش‌رقمی پیامک را کامل وارد کنید.'); return; }
        setBusy(true); setError('');
        try { await completePhoneLogin(challenge.challenge, code); }
        catch (e) { if (mounted.current) showError(e); }
        finally { if (mounted.current) setBusy(false); }
    };
    return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.glow} pointerEvents="none" />
            <View style={styles.topRow}><Text style={styles.eyebrow}>فضایی برای رشد تو</Text><View style={styles.secureBadge}><Ionicons name="shield-checkmark-outline" color="#c7e3ba" size={14} /><Text style={styles.secureText}>ورود امن</Text></View></View>
            <View style={styles.brand}>
                <Image source={require('../../assets/roshd-logo.png')} style={styles.logo} accessibilityLabel="لوگوی Roshd" />
                <Text style={styles.wordmark} accessibilityRole="header">Roshd</Text>
                <Text style={styles.tagline}>هر روز، یک قدم به خودِ بهترت نزدیک‌تر</Text>
                <View style={styles.benefits}><Text style={styles.benefit}>یادگیری</Text><View style={styles.dot} /><Text style={styles.benefit}>کشف استعداد</Text><View style={styles.dot} /><Text style={styles.benefit}>توسعه فردی</Text></View>
            </View>
            <View style={styles.card}>
                <View style={styles.cardTop}><View style={styles.stepPill}><Text style={styles.stepText}>{challenge ? 'قدم ۲ از ۲' : 'قدم ۱ از ۲'}</Text></View><View style={styles.iconBox}><Ionicons name={challenge ? 'chatbubble-ellipses-outline' : 'phone-portrait-outline'} size={24} color="#276440" /></View></View>
                <Text style={styles.title} accessibilityRole="header">{challenge ? 'کد تأیید را وارد کن' : 'مسیر رشدت از اینجا شروع می‌شه'}</Text>
                <Text style={styles.description}>{challenge ? `یک کد شش‌رقمی به شماره ${phone} پیامک شد.` : 'با شماره موبایلت وارد شو. اگر حساب نداری، بعد از تأیید شماره برات ساخته می‌شه.'}</Text>
                {challenge ? <>
                    <Pressable onPress={() => { setChallenge(null); setCode(''); setError(''); }} disabled={busy} accessibilityRole="button" style={styles.editButton}><Ionicons name="create-outline" size={16} color="#34704b" /><Text style={styles.editText}>ویرایش شماره موبایل</Text></Pressable>
                    <Text style={styles.label}>کد تأیید پیامکی</Text>
                    <TextInput ref={codeInput} value={code} onChangeText={v => { setCode(normalizeCode(v)); setError(''); }} style={[styles.input, styles.codeInput, !!error && styles.inputError]} placeholder="— — — — — —" placeholderTextColor="#a1afa6" keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp" maxLength={6} editable={!busy} accessibilityLabel="کد تأیید شش رقمی" onSubmitEditing={verify} />
                </> : <>
                    <Text style={styles.label}>شماره موبایل</Text>
                    <View style={[styles.phoneBox, !!error && styles.inputError]}>
                        <TextInput value={phone} onChangeText={v => { setPhone(v); setError(''); }} style={styles.phoneInput} placeholder="0912 345 6789" placeholderTextColor="#a1afa6" keyboardType="phone-pad" textContentType="telephoneNumber" autoComplete="tel" maxLength={16} editable={!busy} accessibilityLabel="شماره موبایل" returnKeyType="done" onSubmitEditing={send} />
                        <View style={styles.country}><Text style={styles.countryText}>ایران</Text><Ionicons name="phone-portrait-outline" size={19} color="#567061" /></View>
                    </View>
                </>}
                {!!error && <View style={styles.errorBox} accessibilityRole="alert"><Ionicons name="alert-circle-outline" size={18} color="#b84538" /><Text style={styles.errorText}>{error}</Text></View>}
                <Pressable onPress={challenge ? verify : send} disabled={busy} accessibilityRole="button" accessibilityLabel={challenge ? 'تأیید کد و ورود' : 'دریافت کد ورود'} style={({ pressed }) => [styles.submit, pressed && styles.submitPressed, busy && styles.submitBusy]}>
                    {busy ? <ActivityIndicator color="#fff" /> : <><Ionicons name="arrow-back" color="#fff" size={20} /><Text style={styles.submitText}>{challenge ? 'تأیید و ورود به Roshd' : 'دریافت کد ورود'}</Text></>}
                </Pressable>
                {challenge ? <Pressable disabled={busy || seconds > 0} onPress={send} style={styles.resend} accessibilityRole="button"><Text style={[styles.resendText, seconds > 0 && styles.disabledText]}>{seconds > 0 ? `ارسال مجدد کد تا ${seconds.toLocaleString('fa-IR')} ثانیه دیگر` : 'کد نرسید؟ ارسال مجدد'}</Text></Pressable> : <View style={styles.hint}><Ionicons name="lock-closed-outline" size={13} color="#758679" /><Text style={styles.hintText}>بدون رمز عبور · فقط با کد تأیید پیامکی</Text></View>}
            </View>
            <Text style={styles.footer}>رشد، از یک قدم کوچک شروع می‌شود.</Text>
        </ScrollView>
    </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#092d20' }, scroll: { flexGrow: 1, paddingHorizontal: 22, justifyContent: 'center', overflow: 'hidden' },
    glow: { position: 'absolute', width: 340, height: 340, borderRadius: 170, backgroundColor: '#17482e', top: -95, right: -170, opacity: 0.6 },
    topRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, eyebrow: { fontSize: 12, color: '#adcfb8' },
    secureBadge: { flexDirection: 'row-reverse', gap: 6, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#315540' }, secureText: { color: '#c7e3ba', fontSize: 11 },
    brand: { alignItems: 'center', marginBottom: 28 }, logo: { width: 86, height: 86, borderRadius: 24, borderWidth: 1, borderColor: '#9bc784' },
    wordmark: { fontSize: 43, fontWeight: '800', color: '#fff', letterSpacing: 1.5, marginTop: 10 }, tagline: { color: '#c6dbcb', fontSize: 13, lineHeight: 26, marginTop: 3, textAlign: 'center' },
    benefits: { flexDirection: 'row-reverse', gap: 12, alignItems: 'center', marginTop: 14 }, benefit: { color: '#a9ca9d', fontSize: 11 }, dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#b2d28a' },
    card: { backgroundColor: '#fbfcf7', padding: 25, borderRadius: 28, width: '100%', maxWidth: 460, alignSelf: 'center', borderWidth: 1, borderColor: '#e0e8da' },
    cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, iconBox: { backgroundColor: '#e8f0e1', width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    stepPill: { backgroundColor: '#edf1e7', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 }, stepText: { fontSize: 10, color: '#6d806f' },
    title: { color: '#173e2a', fontSize: 23, fontWeight: '800', textAlign: 'right', lineHeight: 36 }, description: { color: '#788476', fontSize: 13, lineHeight: 25, textAlign: 'right', marginTop: 9, marginBottom: 24 },
    label: { color: '#37513d', fontSize: 12, fontWeight: '700', textAlign: 'right', marginBottom: 9 }, phoneBox: { flexDirection: 'row', borderWidth: 1, borderColor: '#d8e1d1', backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', minHeight: 60 },
    phoneInput: { flex: 1, minWidth: 0, color: '#1b3826', fontSize: 20, fontWeight: '600', textAlign: 'left', writingDirection: 'ltr', paddingHorizontal: 16, paddingVertical: 14 }, country: { paddingHorizontal: 12, borderLeftWidth: 1, borderLeftColor: '#e4eadf', flexDirection: 'row', gap: 6, alignItems: 'center' }, countryText: { fontSize: 11, color: '#567061' },
    input: { borderWidth: 1, borderColor: '#d8e1d1', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12, backgroundColor: '#fff', color: '#193e2a' }, codeInput: { textAlign: 'center', writingDirection: 'ltr', fontSize: 26, letterSpacing: 10, fontWeight: '700' }, inputError: { borderColor: '#cb7a6c' },
    errorBox: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, backgroundColor: '#fcf0eb', borderRadius: 12, padding: 10, marginTop: 12 }, errorText: { flex: 1, color: '#a44636', textAlign: 'right', fontSize: 12, lineHeight: 22 },
    submit: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#286841', borderRadius: 16, paddingHorizontal: 20, minHeight: 58, marginTop: 20 }, submitText: { color: '#fff', fontSize: 15, fontWeight: '800' }, submitPressed: { backgroundColor: '#194f30' }, submitBusy: { opacity: 0.7, justifyContent: 'center' },
    hint: { flexDirection: 'row-reverse', gap: 5, alignItems: 'center', justifyContent: 'center', marginTop: 18 }, hintText: { fontSize: 10, color: '#758679' }, footer: { textAlign: 'center', color: '#88aa91', fontSize: 11, marginTop: 24, lineHeight: 22 },
    editButton: { flexDirection: 'row-reverse', gap: 6, alignSelf: 'flex-end', marginTop: -14, marginBottom: 22, paddingVertical: 6 }, editText: { color: '#34704b', fontSize: 12 }, resend: { paddingVertical: 15, alignItems: 'center' }, resendText: { color: '#286841', fontSize: 12 }, disabledText: { color: '#81917f' },
});
