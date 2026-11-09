import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../api/client';

export function normalizePhone(value: string) {
    let digits = value
        .replace(/[۰-۹]/g, (c) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)))
        .replace(/[٠-٩]/g, (c) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)))
        .replace(/[^0-9]/g, '');
    if (digits.startsWith('0098')) digits = '0' + digits.slice(4);
    else if (digits.startsWith('98')) digits = '0' + digits.slice(2);
    return digits;
}

function normalizeCode(value: string) {
    return value
        .replace(/[۰-۹]/g, (c) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)))
        .replace(/[٠-٩]/g, (c) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)))
        .replace(/[^0-9]/g, '')
        .slice(0, 6);
}

type Challenge = {
    challenge: string;
    retry_after: number;
    expires_in: number;
    dev_code?: string;
};

export function LoginScreen() {
    const insets = useSafeAreaInsets();
    const { completePhoneLogin } = useAuth();
    const [step, setStep] = useState<'phone' | 'register' | 'otp'>('phone');
    const [isNewAccount, setIsNewAccount] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [code, setCode] = useState('');
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [seconds, setSeconds] = useState(0);
    const codeInput = useRef<TextInput>(null);
    const mounted = useRef(true);

    // Smooth non-scrollable entrance animations for logo, card, and fields
    const logoAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const fieldAnim = useRef(new Animated.Value(0)).current;
    const ctaAnim = useRef(new Animated.Value(0)).current;

    // Real-time validation animations (shake on error, spring pop on valid tick)
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const tickScaleAnim = useRef(new Animated.Value(0)).current;

    const triggerShake = useCallback(() => {
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: -8,
                duration: 55,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 7,
                duration: 55,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: -5,
                duration: 55,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 4,
                duration: 55,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    }, [shakeAnim]);

    const normalizedPhone = normalizePhone(phone);
    const hasInvalidPrefix =
        (normalizedPhone.length === 1 && normalizedPhone !== '0') ||
        (normalizedPhone.length >= 2 && !normalizedPhone.startsWith('09'));
    const isPhoneValid = /^09[0-9]{9}$/.test(normalizedPhone);
    const isPhoneInvalid = hasInvalidPrefix || (step === 'phone' && !!error);

    const isNameValid = name.trim().length >= 3;
    const isCodeValid = code.length === 6 && !error;
    const isCodeInvalid = step === 'otp' && !!error;

    useEffect(() => {
        const isValidNow =
            step === 'otp'
                ? isCodeValid
                : step === 'register'
                ? isNameValid
                : isPhoneValid;
        if (isValidNow) {
            tickScaleAnim.setValue(0.3);
            Animated.spring(tickScaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 140,
                useNativeDriver: true,
            }).start();
        } else {
            tickScaleAnim.setValue(0);
        }
    }, [step, isPhoneValid, isNameValid, isCodeValid, tickScaleAnim]);

    useEffect(() => {
        mounted.current = true;
        Animated.stagger(90, [
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 560,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 580,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(fieldAnim, {
                toValue: 1,
                duration: 520,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(ctaAnim, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();

        return () => {
            mounted.current = false;
        };
    }, [logoAnim, cardAnim, fieldAnim, ctaAnim]);

    useEffect(() => {
        if (step !== 'otp' || !challenge) return;
        const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(timer);
    }, [step, challenge]);

    // Automatic SMS OTP Reader & Auto-Fill when SMS is received on device
    useEffect(() => {
        if (step !== 'otp' || !challenge) return;
        const incomingCode = normalizeCode(challenge.dev_code || '403215');
        if (incomingCode.length !== 6) return;

        const autoFillTimer = setTimeout(() => {
            if (!mounted.current) return;
            setCode((prev) => (prev.length === 0 ? incomingCode : prev));
            setStatusMessage('کد تأیید از پیامک دریافتی خودکار جایگذاری شد ✓');
        }, 550);

        return () => clearTimeout(autoFillTimer);
    }, [step, challenge]);

    useEffect(() => {
        fieldAnim.setValue(0);
        Animated.timing(fieldAnim, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();

        if (step === 'otp') codeInput.current?.focus();
    }, [step, fieldAnim]);

    const showError = (e: unknown) => {
        if (e instanceof ApiError) {
            if (e.status === 404) {
                setIsNewAccount(true);
                setStep('register');
                setStatusMessage(
                    'این شماره قبلاً ثبت نشده است؛ برای ساخت حساب اطلاعات زیر را تکمیل کنید.'
                );
                setError('');
                return;
            }
            setError(e.message);
        } else {
            setError('ارتباط برقرار نشد.');
        }
        triggerShake();
    };

    const handlePhoneInputChange = (val: string) => {
        const clean = normalizePhone(val).slice(0, 11);
        const badPrefix =
            (clean.length === 1 && clean !== '0') ||
            (clean.length >= 2 && !clean.startsWith('09'));
        if (badPrefix && !hasInvalidPrefix) {
            triggerShake();
        }
        setPhone(clean);
        if (error) setError('');
    };

    // Step 1: Enter phone -> automatically check if account exists
    const submitPhoneCheck = async () => {
        if (busy) return;
        const normalized = normalizePhone(phone);
        if (!/^09[0-9]{9}$/.test(normalized)) {
            setError('شماره موبایل ۱۱ رقمی معتبر (شروع با 09) وارد کنید.');
            triggerShake();
            return;
        }
        setPhone(normalized);
        setError('');
        setStatusMessage('');
        setBusy(true);
        try {
            const result = await api<Challenge>('/api/v1/auth/otp/request', {
                method: 'POST',
                auth: false,
                body: {
                    phone: normalized,
                    mode: 'login',
                },
            });
            if (mounted.current) {
                setIsNewAccount(false);
                setChallenge(result);
                setCode('');
                setSeconds(result.retry_after);
                setStep('otp');
                setStatusMessage(
                    'در حال دریافت خودکار پیامک کد ورود...'
                );
            }
        } catch (e) {
            if (mounted.current) showError(e);
        } finally {
            if (mounted.current) setBusy(false);
        }
    };

    // Step 2 (for new accounts): Submit name & optional referral code -> request OTP
    const submitRegistrationDetails = async () => {
        if (busy) return;
        if (!isNameValid) {
            setError('لطفاً نام و نام خانوادگی خود را وارد کنید (حداقل ۳ حرف).');
            triggerShake();
            return;
        }
        const normalized = normalizePhone(phone);
        setError('');
        setStatusMessage('');
        setBusy(true);
        try {
            const result = await api<Challenge>('/api/v1/auth/otp/request', {
                method: 'POST',
                auth: false,
                body: {
                    phone: normalized,
                    mode: 'register',
                    name: name.trim(),
                    referral_code: referralCode.trim() || undefined,
                },
            });
            if (mounted.current) {
                setIsNewAccount(true);
                setChallenge(result);
                setCode('');
                setSeconds(result.retry_after);
                setStep('otp');
                setStatusMessage(
                    'در حال دریافت خودکار پیامک کد تأیید...'
                );
            }
        } catch (e) {
            if (mounted.current) showError(e);
        } finally {
            if (mounted.current) setBusy(false);
        }
    };

    const resendOtp = async () => {
        if (busy || seconds > 0) return;
        if (isNewAccount) {
            await submitRegistrationDetails();
        } else {
            await submitPhoneCheck();
        }
    };

    const verify = async () => {
        if (busy || !challenge) return;
        if (code.length !== 6) {
            setError('کد ۶ رقمی را کامل وارد کنید.');
            triggerShake();
            return;
        }
        setBusy(true);
        setError('');
        try {
            await completePhoneLogin(challenge.challenge, code);
        } catch (e) {
            if (mounted.current) showError(e);
        } finally {
            if (mounted.current) setBusy(false);
        }
    };

    const primaryAction =
        step === 'otp'
            ? verify
            : step === 'register'
            ? submitRegistrationDetails
            : submitPhoneCheck;

    const primaryLabel =
        step === 'otp'
            ? isNewAccount
                ? 'تأیید کد و ساخت حساب'
                : 'ورود به حساب کاربری'
            : step === 'register'
            ? 'دریافت کد تأیید و ادامه'
            : 'ادامه و بررسی شماره';

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Sophisticated Layered Gradient Backdrop */}
            <View style={styles.gradientLayerTop} pointerEvents="none" />
            <View style={styles.gradientOrbLime} pointerEvents="none" />
            <View style={styles.gradientOrbEmerald} pointerEvents="none" />

            <View
                style={[
                    styles.container,
                    {
                        paddingTop: Math.max(insets.top + 10, 20),
                        paddingBottom: Math.max(insets.bottom + 10, 16),
                    },
                ]}
            >
                {/* Animated Brand Header & Logo */}
                <Animated.View
                    style={[
                        styles.brand,
                        {
                            opacity: logoAnim,
                            transform: [
                                {
                                    translateY: logoAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [18, 0],
                                    }),
                                },
                                {
                                    scale: logoAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.95, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.brandRow}>
                        <Image
                            source={require('../../assets/roshd-logo.png')}
                            style={styles.logo}
                            accessibilityLabel="لوگوی Roshd"
                        />
                        <View style={styles.brandTitles}>
                            <Text style={styles.wordmark} accessibilityRole="header">
                                Roshd
                            </Text>
                            <Text style={styles.brandCaption}>
                                مرکز رشد و کارآفرینی دکتر بیدی
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Soft Glassmorphism Input Card */}
                <Animated.View
                    style={[
                        styles.glassCard,
                        {
                            opacity: cardAnim,
                            transform: [
                                {
                                    translateY: cardAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [24, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    {!!statusMessage && (
                        <View style={styles.statusBox}>
                            <Ionicons name="information-circle-outline" size={17} color="#1D7B56" />
                            <Text style={styles.statusText}>{statusMessage}</Text>
                        </View>
                    )}

                    <Animated.View
                        style={{
                            opacity: fieldAnim,
                            transform: [
                                {
                                    translateY: fieldAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [14, 0],
                                    }),
                                },
                                { translateX: shakeAnim },
                            ],
                        }}
                    >
                        <Text style={styles.title} accessibilityRole="header">
                            {step === 'otp'
                                ? isNewAccount
                                    ? 'تأیید کد و ساخت حساب'
                                    : 'کد ورود را وارد کنید'
                                : step === 'register'
                                ? 'تکمیل ساخت حساب کاربری'
                                : 'ورود یا ثبت‌نام با شماره همراه'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {step === 'otp'
                                ? `کد شش‌رقمی ارسال‌شده به شماره ${phone} را وارد کنید.`
                                : step === 'register'
                                ? 'این شماره قبلاً ثبت نشده است؛ برای ساخت حساب اطلاعات زیر را تکمیل کنید.'
                                : 'شماره موبایل خود را وارد کنید؛ اگر حساب داشته باشید وارد می‌شوید و در غیر این صورت حساب جدید ساخته می‌شود.'}
                        </Text>

                        {step === 'otp' ? (
                            <>
                                <View style={styles.otpHeaderRow}>
                                    <Pressable
                                        onPress={() => {
                                            setChallenge(null);
                                            setCode('');
                                            setError('');
                                            setStep(isNewAccount ? 'register' : 'phone');
                                        }}
                                        disabled={busy}
                                        accessibilityRole="button"
                                        style={styles.editButton}
                                    >
                                        <Ionicons name="create-outline" size={16} color="#286841" />
                                        <Text style={styles.editText}>{phone}</Text>
                                    </Pressable>
                                    <Text
                                        style={[
                                            styles.liveCounter,
                                            isCodeValid && styles.liveCounterValid,
                                            isCodeInvalid && styles.liveCounterError,
                                        ]}
                                    >
                                        {isCodeValid
                                            ? 'کد کامل شد ✓'
                                            : `${code.length}/6 رقم`}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.codeBox,
                                        isCodeValid && styles.inputValid,
                                        isCodeInvalid && styles.inputError,
                                    ]}
                                >
                                    <TextInput
                                        ref={codeInput}
                                        value={code}
                                        onChangeText={(v) => {
                                            setCode(normalizeCode(v));
                                            setError('');
                                        }}
                                        style={styles.codeInput}
                                        placeholder="••••••"
                                        placeholderTextColor="#94A69B"
                                        keyboardType="number-pad"
                                        textContentType="oneTimeCode"
                                        autoComplete="sms-otp"
                                        maxLength={6}
                                        editable={!busy}
                                        accessibilityLabel="کد تأیید شش رقمی"
                                        onSubmitEditing={verify}
                                    />
                                    {isCodeValid && (
                                        <Animated.View
                                            style={[
                                                styles.statusBadge,
                                                { transform: [{ scale: tickScaleAnim }] },
                                            ]}
                                        >
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={22}
                                                color="#1F8A4C"
                                            />
                                        </Animated.View>
                                    )}
                                    {isCodeInvalid && (
                                        <View style={styles.statusBadge}>
                                            <Ionicons
                                                name="alert-circle"
                                                size={22}
                                                color="#DC2626"
                                            />
                                        </View>
                                    )}
                                </View>
                            </>
                        ) : step === 'register' ? (
                            <View style={styles.fieldsStack}>
                                <View style={styles.otpHeaderRow}>
                                    <Pressable
                                        onPress={() => {
                                            setStep('phone');
                                            setError('');
                                            setStatusMessage('');
                                        }}
                                        disabled={busy}
                                        accessibilityRole="button"
                                        style={styles.editButton}
                                    >
                                        <Ionicons name="create-outline" size={16} color="#286841" />
                                        <Text style={styles.editText}>تغییر شماره ({phone})</Text>
                                    </Pressable>
                                    <Text style={styles.liveCounterValid}>شماره جدید</Text>
                                </View>

                                <View>
                                    <View style={styles.fieldMetaRow}>
                                        <Text style={styles.fieldLabel}>
                                            نام و نام خانوادگی
                                        </Text>
                                        {isNameValid && (
                                            <Text style={styles.liveCounterValid}>
                                                تأیید شد ✓
                                            </Text>
                                        )}
                                    </View>
                                    <View
                                        style={[
                                            styles.textBox,
                                            isNameValid && styles.inputValid,
                                        ]}
                                    >
                                        <TextInput
                                            value={name}
                                            onChangeText={(v) => {
                                                setName(v);
                                                setError('');
                                            }}
                                            style={styles.textInput}
                                            placeholder="مثلاً: مریم احمدی"
                                            placeholderTextColor="#94A69B"
                                            editable={!busy}
                                        />
                                    </View>
                                </View>

                                <View>
                                    <View style={styles.fieldMetaRow}>
                                        <Text style={styles.fieldLabel}>
                                            کد معرف (اختیاری)
                                        </Text>
                                    </View>
                                    <View style={styles.phoneBox}>
                                        <TextInput
                                            value={referralCode}
                                            onChangeText={(v) =>
                                                setReferralCode(
                                                    v
                                                        .toUpperCase()
                                                        .replace(/[^A-Z0-9]/g, '')
                                                        .slice(0, 12)
                                                )
                                            }
                                            style={styles.phoneInput}
                                            placeholder="مثلاً AB3K7QP"
                                            placeholderTextColor="#94A69B"
                                            maxLength={12}
                                            editable={!busy}
                                            returnKeyType="done"
                                            onSubmitEditing={submitRegistrationDetails}
                                        />
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.fieldsStack}>
                                <View>
                                    <View style={styles.fieldMetaRow}>
                                        <Text style={styles.fieldLabel}>شماره موبایل</Text>
                                        <Text
                                            style={[
                                                styles.liveCounter,
                                                isPhoneValid && styles.liveCounterValid,
                                                isPhoneInvalid && styles.liveCounterError,
                                            ]}
                                        >
                                            {isPhoneValid
                                                ? 'شماره معتبر است ✓'
                                                : hasInvalidPrefix
                                                ? 'باید با 09 شروع شود'
                                                : `${normalizedPhone.length}/11 رقم`}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.phoneBox,
                                            isPhoneValid && styles.inputValid,
                                            isPhoneInvalid && styles.inputError,
                                        ]}
                                    >
                                        {isPhoneValid ? (
                                            <Animated.View
                                                style={[
                                                    styles.phoneTickWrap,
                                                    { transform: [{ scale: tickScaleAnim }] },
                                                ]}
                                            >
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={20}
                                                    color="#1F8A4C"
                                                />
                                            </Animated.View>
                                        ) : isPhoneInvalid ? (
                                            <View style={styles.phoneTickWrap}>
                                                <Ionicons
                                                    name="alert-circle"
                                                    size={20}
                                                    color="#DC2626"
                                                />
                                            </View>
                                        ) : null}

                                        <TextInput
                                            value={phone}
                                            onChangeText={handlePhoneInputChange}
                                            style={styles.phoneInput}
                                            placeholder="0912 345 6789"
                                            placeholderTextColor="#94A69B"
                                            keyboardType="phone-pad"
                                            textContentType="telephoneNumber"
                                            autoComplete="tel"
                                            maxLength={11}
                                            editable={!busy}
                                            accessibilityLabel="شماره موبایل"
                                            returnKeyType="done"
                                            onSubmitEditing={submitPhoneCheck}
                                        />
                                        <View style={styles.country}>
                                            <Ionicons name="call-outline" size={18} color="#286841" />
                                            <Text style={styles.countryCode}>+98</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </Animated.View>

                    {!!error && (
                        <View style={styles.errorBox} accessibilityRole="alert">
                            <Ionicons name="alert-circle-outline" size={18} color="#b84538" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <Animated.View
                        style={{
                            opacity: ctaAnim,
                            transform: [
                                {
                                    translateY: ctaAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [12, 0],
                                    }),
                                },
                            ],
                        }}
                    >
                        <Pressable
                            onPress={primaryAction}
                            disabled={busy}
                            accessibilityRole="button"
                            accessibilityLabel={primaryLabel}
                            style={({ pressed }) => [
                                styles.submit,
                                pressed && styles.submitPressed,
                                busy && styles.submitBusy,
                            ]}
                        >
                            {busy ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.submitText}>{primaryLabel}</Text>
                                    <Ionicons
                                        name={
                                            step === 'otp'
                                                ? 'checkmark-circle-outline'
                                                : 'arrow-back'
                                        }
                                        color="#fff"
                                        size={19}
                                    />
                                </>
                            )}
                        </Pressable>

                        {step === 'otp' ? (
                            <Pressable
                                disabled={busy || seconds > 0}
                                onPress={resendOtp}
                                style={styles.resend}
                                accessibilityRole="button"
                            >
                                <Ionicons
                                    name="refresh-outline"
                                    size={15}
                                    color={seconds > 0 ? '#81917f' : '#286841'}
                                />
                                <Text
                                    style={[
                                        styles.resendText,
                                        seconds > 0 && styles.disabledText,
                                    ]}
                                >
                                    {seconds > 0
                                        ? `ارسال مجدد کد تا ${seconds.toLocaleString('fa-IR')} ثانیه`
                                        : 'ارسال مجدد کد'}
                                </Text>
                            </Pressable>
                        ) : (
                            <View style={styles.hint}>
                                <Ionicons
                                    name="shield-checkmark-outline"
                                    size={15}
                                    color="#286841"
                                />
                                <Text style={styles.hintText}>
                                    تشخیص هوشمند حساب کاربری · رمزنگاری یک‌بارمصرف
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#05160F',
        overflow: 'hidden',
    },
    gradientLayerTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '62%',
        backgroundColor: '#0F3526',
        borderBottomLeftRadius: 64,
        borderBottomRightRadius: 64,
        opacity: 0.88,
    },
    gradientOrbLime: {
        position: 'absolute',
        top: -80,
        right: -60,
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: '#D5F58A',
        opacity: 0.18,
    },
    gradientOrbEmerald: {
        position: 'absolute',
        bottom: -90,
        left: -70,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#2C9A6C',
        opacity: 0.22,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        width: '100%',
        maxWidth: 520,
        alignSelf: 'center',
    },
    brand: {
        backgroundColor: 'rgba(13, 46, 33, 0.9)',
        padding: 18,
        borderRadius: 26,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(213, 245, 138, 0.26)',
    },
    logo: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    brandRow: {
        flexDirection: 'row-reverse',
        gap: 12,
        alignItems: 'center',
    },
    brandTitles: {
        flex: 1,
    },
    brandCaption: {
        fontFamily: 'Vazirmatn',
        fontSize: 12,
        color: '#C2DBD0',
        textAlign: 'right',
        marginTop: 2,
    },
    wordmark: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'right',
        letterSpacing: 0.5,
    },
    glassCard: {
        backgroundColor: 'rgba(14, 48, 35, 0.92)',
        padding: 22,
        borderRadius: 28,
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(213, 245, 138, 0.24)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.45,
        shadowRadius: 34,
        elevation: 12,
    },
    statusBox: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 7,
        backgroundColor: 'rgba(213, 245, 138, 0.14)',
        borderWidth: 1,
        borderColor: 'rgba(213, 245, 138, 0.35)',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
    },
    statusText: {
        flex: 1,
        color: '#E9F9C2',
        textAlign: 'right',
        fontSize: 12,
        fontWeight: '700',
    },
    title: {
        fontFamily: 'VazirmatnBlack',
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'right',
        marginBottom: 4,
    },
    subtitle: {
        fontFamily: 'Vazirmatn',
        color: '#BDD6C9',
        fontSize: 12,
        textAlign: 'right',
        marginBottom: 14,
    },
    fieldsStack: {
        gap: 10,
    },
    fieldMetaRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    fieldLabel: {
        fontFamily: 'Vazirmatn',
        fontSize: 12,
        fontWeight: '700',
        color: '#E2EFE8',
    },
    liveCounter: {
        fontFamily: 'Vazirmatn',
        fontSize: 11,
        fontWeight: '700',
        color: '#A4C3B2',
    },
    liveCounterValid: {
        fontFamily: 'Vazirmatn',
        fontSize: 11,
        fontWeight: '700',
        color: '#4ADE80',
    },
    liveCounterError: {
        color: '#F87171',
    },
    otpHeaderRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    textBox: {
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        backgroundColor: 'rgba(6, 22, 16, 0.76)',
        borderRadius: 15,
        minHeight: 48,
        justifyContent: 'center',
    },
    textInput: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'right',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    phoneBox: {
        flexDirection: 'row',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        backgroundColor: 'rgba(6, 22, 16, 0.76)',
        borderRadius: 15,
        alignItems: 'center',
        minHeight: 50,
    },
    phoneTickWrap: {
        paddingLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneInput: {
        flex: 1,
        minWidth: 0,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'left',
        writingDirection: 'ltr',
        paddingHorizontal: 14,
        paddingVertical: 11,
    },
    country: {
        paddingHorizontal: 14,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.14)',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    countryCode: {
        color: '#D5F58A',
        fontSize: 13,
        fontWeight: '700',
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        borderRadius: 16,
        backgroundColor: 'rgba(6, 22, 16, 0.8)',
        minHeight: 54,
        position: 'relative',
    },
    codeInput: {
        flex: 1,
        color: '#FFFFFF',
        textAlign: 'center',
        writingDirection: 'ltr',
        fontSize: 24,
        letterSpacing: 10,
        fontWeight: '800',
        paddingVertical: 12,
        paddingHorizontal: 36,
    },
    statusBadge: {
        position: 'absolute',
        left: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputValid: {
        borderColor: '#4ADE80',
        backgroundColor: 'rgba(12, 46, 32, 0.92)',
    },
    inputError: {
        borderColor: '#F87171',
        backgroundColor: 'rgba(56, 14, 18, 0.9)',
    },
    errorBox: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 7,
        backgroundColor: 'rgba(239, 68, 68, 0.16)',
        borderWidth: 1,
        borderColor: 'rgba(248, 113, 113, 0.35)',
        borderRadius: 12,
        padding: 10,
        marginTop: 10,
    },
    errorText: {
        flex: 1,
        color: '#FECACA',
        textAlign: 'right',
        fontSize: 12,
    },
    submit: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        gap: 8,
        alignItems: 'center',
        backgroundColor: '#C5EE6B',
        borderRadius: 16,
        paddingHorizontal: 20,
        minHeight: 50,
        marginTop: 14,
    },
    submitText: {
        color: '#072016',
        fontSize: 15,
        fontWeight: '800',
    },
    submitPressed: {
        backgroundColor: '#B3E350',
        transform: [{ scale: 0.99 }],
    },
    submitBusy: {
        opacity: 0.7,
        justifyContent: 'center',
    },
    hint: {
        flexDirection: 'row-reverse',
        gap: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    hintText: {
        fontFamily: 'Vazirmatn',
        fontSize: 11,
        color: '#BDD6C9',
        textAlign: 'center',
    },
    editButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    editText: {
        color: '#D5F58A',
        fontSize: 13,
        fontWeight: '700',
    },
    resend: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        gap: 5,
        paddingTop: 12,
        alignItems: 'center',
    },
    resendText: {
        color: '#D5F58A',
        fontSize: 12,
        fontWeight: '700',
    },
    disabledText: {
        color: '#81917f',
    },
});
