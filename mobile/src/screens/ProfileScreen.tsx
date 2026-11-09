import React, { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Field, PrimaryButton, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { TabStackNavigation } from '../navigation/types';
import { faNum } from '../theme';

export function ProfileScreen() {
    const navigation = useNavigation<TabStackNavigation>();
    const { user, logout, updateProfile } = useAuth();
    const { colors, isDark, toggleTheme } = useTheme();
    const [editing, setEditing] = useState(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [city, setCity] = useState(user?.city || 'تهران');
    const [jobTitle, setJobTitle] = useState(user?.job_title || 'پایه یازدهم · طراحی آینده نوجوان');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [smsTwoHoursBefore, setSmsTwoHoursBefore] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
        } catch {}
        navigation.navigate('Login');
    };

    if (!user) {
        return (
            <Screen>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
                    <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="log-out-outline" size={32} color={colors.danger} />
                    </View>
                    <Text style={{ fontFamily: 'VazirmatnBold', fontSize: 16, color: colors.text, textAlign: 'center' }}>
                        از حساب کاربری خارج شده‌اید.
                    </Text>
                    <PrimaryButton
                        title="ورود به حساب کاربری"
                        icon="log-in-outline"
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>
            </Screen>
        );
    }

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
            setStatusMessage('مشخصات ذخیره شد.');
        } catch {
            setError('ذخیره انجام نشد.');
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
        { title: 'تفکر استراتژیک', icon: 'bulb-outline' as const, score: 88 },
        { title: 'رهبری تیمی', icon: 'people-outline' as const, score: 84 },
        { title: 'حل مسئله خلاق', icon: 'extension-puzzle-outline' as const, score: 79 },
    ];

    return (
        <Screen>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
                {/* 1. Golden VIP Identity Header with Avatar & Visual KPI Tiles */}
                <View style={s.identity}>
                    <View style={s.row}>
                        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="person-circle-outline" size={42} color="#FFFFFF" />
                        </View>
                        <View style={s.copy}>
                            <View style={s.badgeRow}>
                                <Text style={s.name}>{user.name}</Text>
                                <View style={s.vipChip}>
                                    <Ionicons name="shield-checkmark" size={12} color="#0D2E22" />
                                    <Text style={s.vipChipText}>احراز شده</Text>
                                </View>
                            </View>
                            <View style={s.metaIconRow}>
                                <Ionicons name="location-outline" size={13} color="#D3E5D8" />
                                <Text style={s.identityDetail} numberOfLines={1}>
                                    {[city, jobTitle].filter(Boolean).join(' · ')}
                                </Text>
                            </View>
                        </View>
                        <View style={s.headerActions}>
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
                            <View style={s.metaIconRow}>
                                <Ionicons name="flash" size={14} color="#D6F39A" />
                                <Text style={s.levelTitle}>سطح ۴</Text>
                            </View>
                            <Text style={s.levelSub}>{faNum(73)}٪</Text>
                        </View>
                        <View style={s.progressTrack}>
                            <View style={[s.progressFill, { width: '73%' }]} />
                        </View>
                    </View>

                    {/* 3 Icon-First Key Stats */}
                    <View style={s.statsRow}>
                        <View style={s.statBox}>
                            <Ionicons name="time-outline" size={18} color="#D6F39A" />
                            <Text style={s.statValue}>{faNum(42)} ساعت</Text>
                        </View>
                        <View style={s.statBox}>
                            <Ionicons name="checkmark-done-circle-outline" size={18} color="#FCD34D" />
                            <Text style={[s.statValue, { color: '#FCD34D' }]}>{faNum(95)}٪</Text>
                        </View>
                        <View style={s.statBox}>
                            <Ionicons name="trophy-outline" size={18} color="#D6F39A" />
                            <Text style={[s.statValue, { color: '#D6F39A' }]}>{faNum(6)} نشان</Text>
                        </View>
                    </View>
                </View>

                {!!statusMessage && (
                    <View style={[s.statusBanner, { backgroundColor: colors.primarySoft }]}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                        <Text style={[s.caption, { color: colors.primary }]}>{statusMessage}</Text>
                    </View>
                )}

                {editing && (
                    <View
                        style={[
                            s.panel,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        <View style={s.sectionHeaderRow}>
                            <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
                            <Text style={[s.sectionTitle, { color: colors.text }]}>ویرایش مشخصات</Text>
                        </View>
                        <Field label="نام و نام خانوادگی" value={name} onChangeText={setName} />
                        <Field label="پایه تحصیلی" value={jobTitle} onChangeText={setJobTitle} />
                        <Field label="شهر" value={city} onChangeText={setCity} />
                        <Field label="شماره موبایل" value={phone} onChangeText={setPhone} />
                        {!!error && (
                            <Text
                                accessibilityRole="alert"
                                style={[s.caption, { color: colors.danger }]}
                            >
                                {error}
                            </Text>
                        )}
                        <PrimaryButton
                            title="ذخیره تغییرات"
                            icon="checkmark-circle-outline"
                            onPress={saveEdit}
                            loading={saving}
                        />
                    </View>
                )}

                {/* 2. Visual Talent Assessment Bars */}
                <View
                    style={[
                        s.panel,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <View style={s.sectionHeaderRow}>
                        <Ionicons name="analytics-outline" size={20} color={colors.primary} />
                        <Text style={[s.sectionTitle, { color: colors.text }]}>نیمرخ استعداد</Text>
                    </View>
                    {talentDimensions.map((dim) => (
                        <View key={dim.title} style={{ gap: 5 }}>
                            <View style={s.betweenRow}>
                                <View style={s.metaIconRow}>
                                    <Ionicons name={dim.icon} size={16} color={colors.primary} />
                                    <Text style={[s.menuTitle, { color: colors.text }]}>
                                        {dim.title}
                                    </Text>
                                </View>
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
                </View>

                {/* 3. Visual Preferences (Compact Icon Switches) */}
                <View
                    style={[
                        s.panel,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <View style={s.sectionHeaderRow}>
                        <Ionicons name="options-outline" size={20} color={colors.primary} />
                        <Text style={[s.sectionTitle, { color: colors.text }]}>تنظیمات سریع</Text>
                    </View>
                    <View style={s.betweenRow}>
                        <View style={s.metaIconRow}>
                            <Ionicons name="notifications-outline" size={18} color={colors.primary} />
                            <Text style={[s.menuTitle, { color: colors.text }]}>
                                یادآور پیامکی جلسات VIP
                            </Text>
                        </View>
                        <Switch
                            value={smsTwoHoursBefore}
                            onValueChange={setSmsTwoHoursBefore}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                    <View style={s.betweenRow}>
                        <View style={s.metaIconRow}>
                            <Ionicons name="moon-outline" size={18} color={colors.primary} />
                            <Text style={[s.menuTitle, { color: colors.text }]}>حالت تاریک</Text>
                        </View>
                        <Switch
                            accessibilityLabel="حالت تاریک"
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                {/* 4. Referral Invite Card */}
                <Pressable
                    accessibilityRole="button"
                    onPress={shareReferral}
                    style={({ pressed }) => [s.invite, pressed && s.pressed]}
                >
                    <Ionicons name="gift-outline" size={24} color="#214F3A" />
                    <View style={s.copy}>
                        <Text style={s.inviteTitle}>دعوت دوستان</Text>
                        <Text style={s.inviteCaption}>
                            {user.referral_code || 'ROSHD-VIP'}
                        </Text>
                    </View>
                    <Ionicons name="share-social-outline" size={20} color="#214F3A" />
                </Pressable>

                {/* 5. Compact Instructor & Admin Access */}
                <View
                    style={[
                        s.adminBox,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <PrimaryButton
                        title="پنل مدرس و مدیریت"
                        icon="shield-checkmark-outline"
                        variant="outline"
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
                        <PrimaryButton
                            title="خروج از حساب"
                            icon="log-out-outline"
                            variant="danger"
                            onPress={handleLogout}
                        />
                        <PrimaryButton
                            title="انصراف"
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
                        <Text style={[s.menuTitle, { color: colors.danger }]}>خروج</Text>
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
        padding: 18,
        paddingBottom: 40,
        gap: 14,
    },
    identity: {
        backgroundColor: '#123E30',
        borderRadius: 24,
        padding: 16,
        gap: 14,
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
    copy: { flex: 1, minWidth: 0, gap: 4 },
    metaIconRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    name: { fontFamily: 'VazirmatnBold', fontSize: 18, color: '#FFFFFF', textAlign: 'right' },
    identityDetail: { fontFamily: 'Vazirmatn', fontSize: 12, color: '#D3E5D8', textAlign: 'right' },
    headerActions: { flexDirection: 'row-reverse', gap: 6 },
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
        paddingTop: 10,
        gap: 6,
    },
    levelHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    levelTitle: { fontFamily: 'VazirmatnBold', fontSize: 12, color: '#D6F39A' },
    levelSub: { fontFamily: 'VazirmatnBold', fontSize: 12, color: '#D3E5D8' },
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
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        gap: 4,
    },
    statValue: { fontFamily: 'VazirmatnBold', fontSize: 13, color: '#FFFFFF' },
    statusBanner: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        padding: 12,
        borderRadius: 16,
    },
    sectionHeaderRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    sectionTitle: { fontFamily: 'VazirmatnBold', fontSize: 15, textAlign: 'right' },
    panel: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
    betweenRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    menuTitle: { fontFamily: 'VazirmatnBold', fontSize: 13, textAlign: 'right' },
    caption: { fontFamily: 'Vazirmatn', fontSize: 12, textAlign: 'right' },
    invite: {
        backgroundColor: '#E8F2D5',
        padding: 14,
        borderRadius: 20,
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
        fontFamily: 'VazirmatnBold',
        fontSize: 11,
        color: '#4D705B',
        textAlign: 'right',
    },
    adminBox: {
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
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
