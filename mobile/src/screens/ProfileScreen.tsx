import React, { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Field, PrimaryButton, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { TabStackNavigation } from '../navigation/types';
import { faNum } from '../theme';

const formatCurrency = (value: number) => `${faNum(value.toLocaleString('en-US'))} تومان`;

export function ProfileScreen() {
    const navigation = useNavigation<TabStackNavigation>();
    const { user, logout, updateProfile } = useAuth();
    const { colors, isDark, toggleTheme } = useTheme();
    const [editing, setEditing] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [parentPhone, setParentPhone] = useState('09121112233');
    const [city, setCity] = useState(user?.city || 'تهران');
    const [jobTitle, setJobTitle] = useState(user?.job_title || 'پایه یازدهم · طراحی آینده نوجوان');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Wallet & Orders state
    const [walletBalance, setWalletBalance] = useState(480000);
    const [parentReportAuto, setParentReportAuto] = useState(true);
    const [smsTwoHoursBefore, setSmsTwoHoursBefore] = useState(true);
    const [smsParentAttendance, setSmsParentAttendance] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    if (!user) return null;

    const saveEdit = async () => {
        setSaving(true);
        setError('');
        try {
            await updateProfile({
                name: name.trim() || user.name,
                phone: phone.trim(),
                city: city.trim(),
                job_title: jobTitle.trim(),
            });
            setEditing(false);
            setStatusMessage('مشخصات فردی و پرونده شما ذخیره شد.');
        } catch {
            setError('ذخیره انجام نشد. اطلاعات شما باقی مانده؛ دوباره تلاش کنید.');
        } finally {
            setSaving(false);
        }
    };

    const shareReferral = async () => {
        try {
            await Share.share({
                message:
                    'همراه من در Roshd یاد بگیر و رشد کن. https://saradars.ir/' +
                    (user.referral_code
                        ? 'invite?ref=' + encodeURIComponent(user.referral_code)
                        : ''),
            });
        } catch {}
    };

    const talentDimensions = [
        { title: 'تفکر استراتژیک و آینده‌نگری', score: 88 },
        { title: 'رهبری تیمی و ارتباط موثر', score: 84 },
        { title: 'حل مسئله خلاق و تصمیم‌گیری', score: 79 },
    ];

    const orders = [
        {
            id: 'INV-404-881',
            title: 'ثبت‌نام دوره جامع طراحی آینده نوجوان (VIP)',
            date: '۱۲ فروردین ۱۴۰۴',
            amount: 3900000,
        },
        {
            id: 'INV-404-904',
            title: 'جلسه کوچینگ اختصاصی نقشه راه و استعدادیابی',
            date: '۲۸ فروردین ۱۴۰۴',
            amount: 680000,
        },
    ];

    return (
        <Screen>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
                {/* 1. Golden VIP Identity Header with Level & 3 Key Metrics */}
                <View style={s.identity}>
                    <View style={s.row}>
                        <Avatar name={user.name} uri={user.avatar} size={60} />
                        <View style={s.copy}>
                            <View style={s.badgeRow}>
                                <Text style={s.name}>{user.name}</Text>
                                <View style={s.vipChip}>
                                    <Ionicons name="ribbon" size={12} color="#0D2E22" />
                                    <Text style={s.vipChipText}>VIP-403-892</Text>
                                </View>
                            </View>
                            <Text style={s.identityDetail}>
                                {[city, jobTitle].filter(Boolean).join(' · ')}
                            </Text>
                            <Text style={s.identityLabel}>
                                عضو رسمی دوره طراحی آینده نوجوان
                            </Text>
                        </View>
                        <View style={s.headerActions}>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="کارت تردد QR"
                                onPress={() => setShowQrModal((v) => !v)}
                                style={s.qrBtn}
                            >
                                <Ionicons name="qr-code-outline" size={18} color="#0D2E22" />
                            </Pressable>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="ویرایش مشخصات"
                                onPress={() => {
                                    setName(user.name);
                                    setPhone(user.phone || '');
                                    setEditing((v) => !v);
                                    setError('');
                                }}
                                style={s.editBtn}
                            >
                                <Ionicons
                                    name={editing ? 'close' : 'create-outline'}
                                    size={18}
                                    color="#FFFFFF"
                                />
                            </Pressable>
                        </View>
                    </View>

                    {/* Level Bar */}
                    <View style={s.levelSection}>
                        <View style={s.levelHeader}>
                            <Text style={s.levelTitle}>سطح ۴: معمار آینده</Text>
                            <Text style={s.levelSub}>۱٬۴۵۰ از ۲٬۰۰۰ امتیاز رشد (۷۳٪)</Text>
                        </View>
                        <View style={s.progressTrack}>
                            <View style={[s.progressFill, { width: '73%' }]} />
                        </View>
                    </View>

                    {/* 3 Key Stats */}
                    <View style={s.statsRow}>
                        <View style={s.statBox}>
                            <Text style={s.statValue}>{faNum(42)} ساعت</Text>
                            <Text style={s.statLabel}>ساعت آموزش</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={[s.statValue, { color: '#FCD34D' }]}>{faNum(95)}٪ حضور</Text>
                            <Text style={s.statLabel}>نظم کلاس VIP</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={[s.statValue, { color: '#D6F39A' }]}>{faNum(6)} دستاورد</Text>
                            <Text style={s.statLabel}>نشان و مدرک</Text>
                        </View>
                    </View>
                </View>

                {!!statusMessage && (
                    <View style={[s.statusBanner, { backgroundColor: colors.primarySoft }]}>
                        <Text style={[s.caption, { color: colors.primary }]}>{statusMessage}</Text>
                    </View>
                )}

                {showQrModal && (
                    <View
                        style={[
                            s.panel,
                            { backgroundColor: colors.surface, borderColor: '#F59E0B' },
                        ]}
                    >
                        <Text style={[s.sectionTitle, { color: colors.text }]}>
                            کارت تردد دیجیتال کارگاه حضوری
                        </Text>
                        <Text style={[s.caption, { color: colors.muted }]}>
                            کد دانش‌پذیری: VIP-403-892 · جهت اسکن حضور در ورودی کلاس
                        </Text>
                        <PrimaryButton
                            title="مشاهده برنامه کلاس‌ها و حضور و غیاب"
                            onPress={() => {
                                setShowQrModal(false);
                                navigation.navigate('Dashboard');
                            }}
                        />
                    </View>
                )}

                {editing && (
                    <View
                        style={[
                            s.panel,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        <Text style={[s.sectionTitle, { color: colors.text }]}>
                            ویرایش مشخصات و پرونده نوجوان
                        </Text>
                        <Field label="نام و نام خانوادگی" value={name} onChangeText={setName} />
                        <Field label="پایه تحصیلی و گرایش" value={jobTitle} onChangeText={setJobTitle} />
                        <Field label="شهر" value={city} onChangeText={setCity} />
                        <Field label="شماره موبایل دانش‌پذیر" value={phone} onChangeText={setPhone} />
                        <Field
                            label="شماره همراه والدین (جهت گزارش هفتگی)"
                            value={parentPhone}
                            onChangeText={setParentPhone}
                        />
                        {!!error && (
                            <Text
                                accessibilityRole="alert"
                                style={[s.caption, { color: colors.danger }]}
                            >
                                {error}
                            </Text>
                        )}
                        <PrimaryButton
                            title="ذخیره تغییرات پروفایل"
                            onPress={saveEdit}
                            loading={saving}
                        />
                    </View>
                )}

                {/* 2. Teen Talent Assessment, Coach Feedback & Parent Dossier */}
                <View
                    style={[
                        s.panel,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <Text style={[s.sectionTitle, { color: colors.text }]}>
                        پرونده استعدادیابی نوجوان و بازخورد کوچ
                    </Text>
                    {talentDimensions.map((dim) => (
                        <View key={dim.title} style={{ gap: 4 }}>
                            <View style={s.betweenRow}>
                                <Text style={[s.menuTitle, { color: colors.text }]}>
                                    {dim.title}
                                </Text>
                                <Text style={[s.menuTitle, { color: colors.primary }]}>
                                    {faNum(dim.score)}٪
                                </Text>
                            </View>
                            <View
                                style={[
                                    s.progressTrackLight,
                                    { backgroundColor: colors.primarySoft },
                                ]}
                            >
                                <View
                                    style={[
                                        s.progressFillPrimary,
                                        {
                                            width: `${dim.score}%`,
                                            backgroundColor: colors.primary,
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                    ))}
                    <View style={[s.coachNoteBox, { backgroundColor: colors.primarySoft }]}>
                        <Text style={[s.menuTitle, { color: colors.primary }]}>
                            آخرین یادداشت اختصاصی مدرس (استاد سارا درس)
                        </Text>
                        <Text style={[s.caption, { color: colors.text }]}>
                            «در کارگاه ترسیم نقشه راه ۹۰ روزه تمرکز و قدرت تحلیل بسیار خوبی داشتی؛ تمرین هدف‌گذاری تابستان را با همین دقت ادامه بده.»
                        </Text>
                    </View>
                    <View style={s.betweenRow}>
                        <View style={s.copy}>
                            <Text style={[s.menuTitle, { color: colors.text }]}>
                                ارسال خودکار کارنامه هفتگی به والدین
                            </Text>
                            <Text style={[s.caption, { color: colors.muted }]}>
                                شماره والدین: {faNum(parentPhone)}
                            </Text>
                        </View>
                        <Switch
                            value={parentReportAuto}
                            onValueChange={setParentReportAuto}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                {/* 3. Digital Wallet & Order History */}
                <View
                    style={[
                        s.panel,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <View style={s.betweenRow}>
                        <View style={s.copy}>
                            <Text style={[s.sectionTitle, { color: colors.text }]}>
                                کیف پول دیجیتال و سفارش‌ها
                            </Text>
                            <Text style={[s.caption, { color: colors.muted }]}>
                                اعتبار هدیه باشگاه: {formatCurrency(150000)}
                            </Text>
                        </View>
                        <Text style={[s.sectionTitle, { color: colors.primary }]}>
                            {formatCurrency(walletBalance)}
                        </Text>
                    </View>
                    <View style={s.topUpRow}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => {
                                setWalletBalance((b) => b + 200000);
                                setStatusMessage('کیف پول شما ۲۰۰٬۰۰۰ تومان شارژ شد.');
                            }}
                            style={[s.topUpBtn, { backgroundColor: colors.primarySoft }]}
                        >
                            <Text style={[s.menuTitle, { color: colors.primary }]}>
                                + شارژ ۲۰۰٬۰۰۰ تومان
                            </Text>
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => {
                                setWalletBalance((b) => b + 500000);
                                setStatusMessage('کیف پول شما ۵۰۰٬۰۰۰ تومان شارژ شد.');
                            }}
                            style={[s.topUpBtn, { backgroundColor: '#153F31' }]}
                        >
                            <Text style={[s.menuTitle, { color: '#FFFFFF' }]}>
                                + شارژ ۵۰۰٬۰۰۰ تومان
                            </Text>
                        </Pressable>
                    </View>
                    {orders.map((ord) => (
                        <View
                            key={ord.id}
                            style={[
                                s.betweenRow,
                                {
                                    borderTopWidth: StyleSheet.hairlineWidth,
                                    borderTopColor: colors.border,
                                    paddingTop: 10,
                                },
                            ]}
                        >
                            <View style={s.copy}>
                                <Text style={[s.menuTitle, { color: colors.text }]}>
                                    {ord.title}
                                </Text>
                                <Text style={[s.caption, { color: colors.muted }]}>
                                    {ord.date} · {ord.id}
                                </Text>
                            </View>
                            <Text style={[s.menuTitle, { color: colors.primary }]}>
                                {formatCurrency(ord.amount)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* 4. Certificates, Badges & Smart SMS Reminders */}
                <View
                    style={[
                        s.panel,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <Text style={[s.sectionTitle, { color: colors.text }]}>
                        گواهینامه‌ها و تنظیمات پیامک هوشمند
                    </Text>
                    <View style={s.betweenRow}>
                        <View style={s.copy}>
                            <Text style={[s.menuTitle, { color: colors.text }]}>
                                پیامک یادآور ۲ ساعت قبل از کلاس VIP
                            </Text>
                            <Text style={[s.caption, { color: colors.muted }]}>
                                کارگاه‌های حضوری و جلسات آنلاین
                            </Text>
                        </View>
                        <Switch
                            value={smsTwoHoursBefore}
                            onValueChange={setSmsTwoHoursBefore}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                    <View style={s.betweenRow}>
                        <View style={s.copy}>
                            <Text style={[s.menuTitle, { color: colors.text }]}>
                                پیامک ثبت حضور و غیاب به والدین
                            </Text>
                            <Text style={[s.caption, { color: colors.muted }]}>
                                ارسال آنی پس از ثبت توسط مدرس
                            </Text>
                        </View>
                        <Switch
                            value={smsParentAttendance}
                            onValueChange={setSmsParentAttendance}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                    <View style={s.betweenRow}>
                        <View style={s.copy}>
                            <Text style={[s.menuTitle, { color: colors.text }]}>
                                حالت تاریک برنامه
                            </Text>
                            <Text style={[s.caption, { color: colors.muted }]}>
                                نمایش مناسب برای مطالعه در شب
                            </Text>
                        </View>
                        <Switch
                            accessibilityLabel="حالت تاریک"
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                {/* Referral Invite Card */}
                <Pressable
                    accessibilityRole="button"
                    onPress={shareReferral}
                    style={({ pressed }) => [s.invite, pressed && s.pressed]}
                >
                    <Ionicons name="gift-outline" size={26} color="#214F3A" />
                    <View style={s.copy}>
                        <Text style={s.inviteTitle}>باشگاه دعوت دوستان · ۱۵۰٬۰۰۰ تومان هدیه</Text>
                        <Text style={s.inviteCaption}>
                            کد اختصاصی: {user.referral_code || 'ROSHD-NAVID'}
                        </Text>
                    </View>
                    <Ionicons name="share-social-outline" size={20} color="#214F3A" />
                </Pressable>

                {/* 5. Separated Instructor & Admin Panel Box at the Bottom */}
                <View
                    style={[
                        s.adminBox,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <Text style={[s.sectionTitle, { color: colors.text }]}>
                        دسترسی ویژه کادر آموزشی و مدیریت
                    </Text>
                    <Text style={[s.caption, { color: colors.muted }]}>
                        مجزا از منوی دانش‌پذیر · ویژه مدرس دوره طراحی آینده نوجوان
                    </Text>
                    <PrimaryButton
                        title="پنل مدرس: حضور و غیاب و تنظیمات دوره VIP"
                        onPress={() => navigation.navigate('AdminPanel')}
                    />
                </View>

                {confirmExit ? (
                    <View
                        style={[
                            s.panel,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        <Text style={[s.menuTitle, { color: colors.text }]}>
                            از حساب خارج می‌شوید؟
                        </Text>
                        <PrimaryButton title="بله، خروج از حساب" variant="danger" onPress={logout} />
                        <PrimaryButton
                            title="ماندن در حساب"
                            variant="outline"
                            onPress={() => setConfirmExit(false)}
                        />
                    </View>
                ) : (
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => setConfirmExit(true)}
                        style={s.logout}
                    >
                        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                        <Text style={[s.menuTitle, { color: colors.danger }]}>خروج از حساب</Text>
                    </Pressable>
                )}
            </ScrollView>
        </Screen>
    );
}

const s = StyleSheet.create({
    content: {
        width: '100%',
        maxWidth: 760,
        alignSelf: 'center',
        padding: 20,
        paddingBottom: 40,
        gap: 16,
    },
    identity: {
        backgroundColor: '#123E30',
        borderRadius: 26,
        padding: 18,
        gap: 16,
        borderWidth: 1,
        borderColor: '#F59E0B',
    },
    row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
    badgeRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    vipChip: {
        backgroundColor: '#FBBF24',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
    },
    vipChipText: { fontFamily: 'VazirmatnBold', fontSize: 10, color: '#0D2E22' },
    copy: { flex: 1, minWidth: 0, gap: 2 },
    identityLabel: { fontFamily: 'VazirmatnBold', fontSize: 11, color: '#FDE68A', textAlign: 'right' },
    name: { fontFamily: 'VazirmatnBold', fontSize: 18, color: '#FFFFFF', textAlign: 'right' },
    identityDetail: { fontFamily: 'Vazirmatn', fontSize: 12, color: '#D3E5D8', textAlign: 'right' },
    headerActions: { flexDirection: 'row-reverse', gap: 6 },
    qrBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#FBBF24',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.16)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelSection: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.15)',
        paddingTop: 12,
        gap: 6,
    },
    levelHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    levelTitle: { fontFamily: 'VazirmatnBold', fontSize: 12, color: '#D6F39A' },
    levelSub: { fontFamily: 'Vazirmatn', fontSize: 11, color: '#D3E5D8' },
    progressTrack: {
        height: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(0,0,0,0.28)',
        overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: 999, backgroundColor: '#FBBF24' },
    progressTrackLight: { height: 6, borderRadius: 999, overflow: 'hidden' },
    progressFillPrimary: { height: '100%', borderRadius: 999 },
    statsRow: { flexDirection: 'row-reverse', gap: 8 },
    statBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    statValue: { fontFamily: 'VazirmatnBold', fontSize: 14, color: '#FFFFFF' },
    statLabel: { fontFamily: 'Vazirmatn', fontSize: 10, color: '#D3E5D8', marginTop: 2 },
    statusBanner: { padding: 12, borderRadius: 16 },
    sectionTitle: { fontFamily: 'VazirmatnBold', fontSize: 16, lineHeight: 26, textAlign: 'right' },
    panel: { padding: 16, borderRadius: 22, borderWidth: 1, gap: 12 },
    betweenRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    coachNoteBox: { padding: 12, borderRadius: 16, gap: 4 },
    topUpRow: { flexDirection: 'row-reverse', gap: 8 },
    topUpBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuTitle: { fontFamily: 'VazirmatnBold', fontSize: 13, lineHeight: 22, textAlign: 'right' },
    caption: { fontFamily: 'Vazirmatn', fontSize: 12, lineHeight: 20, textAlign: 'right' },
    invite: {
        backgroundColor: '#E8F2D5',
        padding: 16,
        borderRadius: 22,
        flexDirection: 'row-reverse',
        gap: 12,
        alignItems: 'center',
    },
    inviteTitle: {
        fontFamily: 'VazirmatnBold',
        fontSize: 14,
        color: '#214F3A',
        textAlign: 'right',
    },
    inviteCaption: {
        fontFamily: 'Vazirmatn',
        fontSize: 12,
        color: '#4D705B',
        textAlign: 'right',
    },
    adminBox: {
        padding: 16,
        borderRadius: 22,
        borderWidth: 1,
        borderStyle: 'dashed',
        gap: 10,
    },
    logout: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        minHeight: 44,
    },
    pressed: { opacity: 0.7 },
});
