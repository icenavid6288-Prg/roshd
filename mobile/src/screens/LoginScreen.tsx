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
            <View style={styles.brand}>
                <View style={styles.brandRow}><Image source={require('../../assets/roshd-logo.png')} style={styles.logo} accessibilityLabel="لوگوی Roshd" /><View><Text style={styles.wordmark} accessibilityRole="header">Roshd</Text><Text style={styles.brandCaption}>فضای رشد تو</Text></View></View>
                <Text style={styles.brandHeadline}>یک شروع تازه،{ '\n' }برای خودت.</Text>
                <Text style={styles.tagline}>یاد بگیر، خودت را بهتر بشناس و مسیرت را بساز.</Text>
                <View style={styles.journey}><View style={styles.journeyNode}><Ionicons name="compass-outline" size={23} color="#D5F58A" /></View><View style={styles.journeyLine}/><View style={styles.journeyNode}><Ionicons name="book-outline" size={23} color="#D5F58A" /></View><View style={styles.journeyLine}/><View style={[styles.journeyNode, styles.journeyEnd]}><Ionicons name="leaf-outline" size={23} color="#153F31" /></View></View>
            </View>
            <View style={styles.card}>
                <View style={styles.cardTop}><View style={styles.progressTrack}><View style={[styles.progressFill, challenge && styles.progressComplete]} /></View><Text style={styles.stepText}>{challenge ? 'مرحله ۲ از ۲' : 'مرحله ۱ از ۲'}</Text></View>
                <Text style={styles.title} accessibilityRole="header">{challenge ? 'شماره‌ات را تأیید کن' : 'خوش اومدی به رشد'}</Text>
                <Text style={styles.description}>{challenge ? `یک کد شش‌رقمی به شماره ${phone} پیامک شد.` : 'با شماره موبایلت وارد شو. اگر حساب نداری، بعد از تأیید شماره برات ساخته می‌شه.'}</Text>
                {challenge ? <>
                    <Pressable onPress={() => { setChallenge(null); setCode(''); setError(''); }} disabled={busy} accessibilityRole="button" style={styles.editButton}><Ionicons name="create-outline" size={16} color="#34704b" /><Text style={styles.editText}>ویرایش شماره موبایل</Text></Pressable>
                    <Text style={styles.label}>کد تأیید پیامکی</Text>
                    <TextInput ref={codeInput} value={code} onChangeText={v => { setCode(normalizeCode(v)); setError(''); }} style={[styles.input, styles.codeInput, !!error && styles.inputError]} placeholder="------" placeholderTextColor="#a1afa6" keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp" maxLength={6} editable={!busy} accessibilityLabel="کد تأیید شش رقمی" onSubmitEditing={verify} />
                </> : <>
                    <Text style={styles.label}>شماره موبایل</Text>
                    <View style={[styles.phoneBox, !!error && styles.inputError]}>
                        <TextInput value={phone} onChangeText={v => { setPhone(v); setError(''); }} style={styles.phoneInput} placeholder="0912 345 6789" placeholderTextColor="#a1afa6" keyboardType="phone-pad" textContentType="telephoneNumber" autoComplete="tel" maxLength={16} editable={!busy} accessibilityLabel="شماره موبایل" returnKeyType="done" onSubmitEditing={send} />
                        <View style={styles.country}><Text style={styles.countryText}>ایران</Text><Ionicons name="phone-portrait-outline" size={19} color="#567061" /></View>
                    </View>
                </>}
                {!!error && <View style={styles.errorBox} accessibilityRole="alert"><Ionicons name="alert-circle-outline" size={18} color="#b84538" /><Text style={styles.errorText}>{error}</Text></View>}
                <Pressable onPress={challenge ? verify : send} disabled={busy} accessibilityRole="button" accessibilityLabel={challenge ? 'تأیید کد و ورود' : 'دریافت کد ورود'} style={({ pressed }) => [styles.submit, pressed && styles.submitPressed, busy && styles.submitBusy]}>
                    {busy ? <ActivityIndicator color="#fff" /> : <><Text style={styles.submitText}>{challenge ? 'تأیید و ادامه' : 'ارسال کد ورود'}</Text><Ionicons name={challenge ? 'checkmark' : 'arrow-back'} color="#fff" size={20} /></>}
                </Pressable>
                {challenge ? <Pressable disabled={busy || seconds > 0} onPress={send} style={styles.resend} accessibilityRole="button"><Text style={[styles.resendText, seconds > 0 && styles.disabledText]}>{seconds > 0 ? `ارسال مجدد کد تا ${seconds.toLocaleString('fa-IR')} ثانیه دیگر` : 'کد نرسید؟ ارسال مجدد'}</Text></Pressable> : <View style={styles.hint}><Ionicons name="lock-closed-outline" size={13} color="#758679" /><Text style={styles.hintText}>بدون رمز عبور · فقط با کد تأیید پیامکی</Text></View>}
            </View>
            <View style={styles.footerRow}><Ionicons name="shield-checkmark-outline" size={16} color="#587465" /><Text style={styles.footer}>ورود با شماره موبایل و کد یک‌بارمصرف</Text></View>
        </ScrollView>
    </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F2F5EF' }, scroll: { flexGrow: 1, paddingHorizontal: 20, justifyContent: 'center', width: '100%', maxWidth: 540, alignSelf: 'center' },
    glow: { position: 'absolute', width: 340, height: 340, borderRadius: 170, backgroundColor: '#17482e', top: -95, right: -170, opacity: 0.6 },
    topRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, eyebrow: { fontSize: 12, color: '#c4d8c8', fontWeight: '500' },
    secureBadge: { flexDirection: 'row-reverse', gap: 6, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#315540' }, secureText: { color: '#c7e3ba', fontSize: 11 },
    brand: { backgroundColor: '#153F31', padding: 28, borderRadius: 30, marginBottom: 18 }, logo: { width: 48, height: 48, borderRadius: 16 },
    brandRow: { flexDirection: 'row-reverse', gap: 12, alignItems: 'center', marginBottom: 22 }, brandCaption: { fontFamily: 'Vazirmatn', fontSize: 12, color: '#BDD6C8', textAlign: 'right' }, brandHeadline: { fontFamily: 'VazirmatnBlack', fontSize: 32, lineHeight: 48, color: '#FFFFFF', textAlign: 'right' },
    wordmark: { fontSize: 25, fontWeight: '700', color: '#fff', textAlign: 'right', letterSpacing: 0.5 }, tagline: { fontFamily: 'Vazirmatn', color: '#c6dbcb', fontSize: 14, lineHeight: 26, marginTop: 10, textAlign: 'right' },
    journey: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 24 }, journeyNode: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#315A47', alignItems: 'center', justifyContent: 'center' }, journeyLine: { height: 1, flex: 1, backgroundColor: '#4E725F' }, journeyEnd: { backgroundColor: '#D5F58A' },
    benefits: { flexDirection: 'row-reverse', gap: 12, alignItems: 'center', marginTop: 14 }, benefit: { color: '#a9ca9d', fontSize: 11 }, dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#b2d28a' },
    card: { backgroundColor: '#FFFFFF', padding: 26, borderRadius: 28, width: '100%', alignSelf: 'center', borderWidth: 1, borderColor: '#E1E8DE' },
    cardTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginBottom: 19 }, progressTrack: { height: 5, flex: 1, backgroundColor: '#e8ede4', borderRadius: 5, overflow: 'hidden' }, progressFill: { width: '50%', height: 5, backgroundColor: '#4d8b5c', borderRadius: 5 }, progressComplete: { width: '100%' },
    stepText: { fontSize: 11, color: '#748276', fontWeight: '600' },
    title: { fontFamily: 'VazirmatnBlack', color: '#173e2a', fontSize: 24, textAlign: 'right', lineHeight: 38 }, description: { fontFamily: 'Vazirmatn', color: '#5F7568', fontSize: 14, lineHeight: 27, textAlign: 'right', marginTop: 8, marginBottom: 24 },
    label: { color: '#37513d', fontSize: 12, fontWeight: '700', textAlign: 'right', marginBottom: 9 }, phoneBox: { flexDirection: 'row', borderWidth: 1, borderColor: '#d8e1d1', backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', minHeight: 60 },
    phoneInput: { flex: 1, minWidth: 0, color: '#1b3826', fontSize: 20, fontWeight: '600', textAlign: 'left', writingDirection: 'ltr', paddingHorizontal: 16, paddingVertical: 14 }, country: { paddingHorizontal: 12, borderLeftWidth: 1, borderLeftColor: '#e4eadf', flexDirection: 'row', gap: 6, alignItems: 'center' }, countryText: { fontSize: 11, color: '#567061' },
    input: { borderWidth: 1, borderColor: '#d8e1d1', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12, backgroundColor: '#fff', color: '#193e2a' }, codeInput: { textAlign: 'center', writingDirection: 'ltr', fontSize: 26, letterSpacing: 10, fontWeight: '700' }, inputError: { borderColor: '#cb7a6c' },
    errorBox: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, backgroundColor: '#fcf0eb', borderRadius: 12, padding: 10, marginTop: 12 }, errorText: { flex: 1, color: '#a44636', textAlign: 'right', fontSize: 12, lineHeight: 22 },
    submit: { flexDirection: 'row-reverse', justifyContent: 'center', gap: 10, alignItems: 'center', backgroundColor: '#286841', borderRadius: 15, paddingHorizontal: 20, minHeight: 56, marginTop: 20 }, submitText: { color: '#fff', fontSize: 15, fontWeight: '700' }, submitPressed: { backgroundColor: '#194f30', transform: [{ scale: 0.99 }] }, submitBusy: { opacity: 0.7, justifyContent: 'center' },
    hint: { flexDirection: 'row-reverse', gap: 5, alignItems: 'center', justifyContent: 'center', marginTop: 18 }, hintText: { fontFamily: 'Vazirmatn', fontSize: 12, color: '#758679', flexShrink: 1, textAlign: 'center' }, footerRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 22 }, footer: { fontFamily: 'Vazirmatn', textAlign: 'center', color: '#587465', fontSize: 12, lineHeight: 23 },
    editButton: { flexDirection: 'row-reverse', gap: 6, alignSelf: 'flex-end', marginTop: -14, marginBottom: 22, paddingVertical: 6 }, editText: { color: '#34704b', fontSize: 12 }, resend: { paddingVertical: 15, alignItems: 'center' }, resendText: { color: '#286841', fontSize: 12 }, disabledText: { color: '#81917f' },
});
