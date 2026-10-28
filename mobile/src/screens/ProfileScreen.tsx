import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Chip, Field, PrimaryButton, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme';
import type { TabStackNavigation } from '../navigation/types';

export function ProfileScreen() {
    const navigation = useNavigation<TabStackNavigation>();
    const { user, logout, updateProfile } = useAuth();
    const { colors, isDark, toggleTheme } = useTheme();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [city, setCity] = useState(user?.city || '');
    const [jobTitle, setJobTitle] = useState(user?.job_title || '');
    const [saving, setSaving] = useState(false);

    if (!user) return null;

    const saveEdit = async () => {
        setSaving(true);
        try {
            await updateProfile({
                name: name.trim() || user.name,
                phone: phone.trim(),
                city: city.trim(),
                job_title: jobTitle.trim(),
            });
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const shareReferral = async () => {
        const code = user.referral_code || 'BIDI-VIP';
        try {
            await Share.share({
                message: `با کد دعوت من (${code}) در مرکز رشد و کارآفرینی دکتر بیدی ثبت‌نام کنید و ۲۵۰ هزار تومان اعتبار هدیه بگیرید: https://markazbidi.ir/invite?ref=${code}`,
            });
        } catch {
            // Ignore share cancellation
        }
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Avatar name={user.name} uri={user.avatar} size={78} />
                    <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.email, { color: colors.muted }]}>{user.email}</Text>
                    {user.job_title ? <Chip label={user.job_title} tone="gold" /> : null}
                    <Pressable
                        onPress={() => {
                            setName(user.name);
                            setPhone(user.phone || '');
                            setCity(user.city || '');
                            setJobTitle(user.job_title || '');
                            setEditing((v) => !v);
                        }}
                        style={[styles.editToggleBtn, { borderColor: colors.primary }]}
                    >
                        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
                            {editing ? 'بستن ویرایش' : '✎ ویرایش مشخصات پروفایل'}
                        </Text>
                    </Pressable>
                </View>

                {editing ? (
                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                        <Field label="نام و نام خانوادگی" value={name} onChangeText={setName} />
                        <Field label="سمت شغلی" value={jobTitle} onChangeText={setJobTitle} />
                        <Field label="شماره موبایل" value={phone} onChangeText={setPhone} />
                        <Field label="شهر" value={city} onChangeText={setCity} />
                        <PrimaryButton title="ذخیره تغییرات" onPress={saveEdit} loading={saving} />
                    </View>
                ) : null}

                {/* Dark Mode Switch Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={[styles.menuLabel, { color: colors.text }]}>
                                {isDark ? '🌙 حالت شب (تاریک) فعال است' : '☀️ حالت روز (روشن) فعال است'}
                            </Text>
                            <Text style={[styles.subText, { color: colors.muted }]}>
                                تغییر رنگ‌بندی کل صفحات اپلیکیشن موبایل
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                {/* Referral Card */}
                <View style={[styles.referralCard, { backgroundColor: colors.primaryDark }]}>
                    <Text style={styles.refBadge}>🎁 دعوت از دوستان و همکاران</Text>
                    <Text style={styles.refTitle}>کد معرف اختصاصی: {user.referral_code || 'BIDI-AMIR78'}</Text>
                    <Text style={styles.refSub}>
                        با اشتراک‌گذاری کد دعوت خود، به ازای هر ثبت‌نام ۲۵۰,۰۰۰ تومان اعتبار کیف پول دریافت کنید.
                    </Text>
                    <PrimaryButton title="اشتراک‌گذاری لینک دعوت" onPress={shareReferral} variant="gold" />
                </View>

                {/* Quick Menu Links */}
                <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {[
                        { label: '🔔 تنظیمات یادآوری هوشمند دوره‌ها و جلسات', route: 'Reminders' as const },
                        { label: '🎯 جلسات کوچینگ رزرو شده من', route: 'Sessions' as const },
                        { label: '🏅 اهداف ۹۰ روزه و گواهینامه‌ها', route: 'Goals' as const },
                        { label: '💬 تیکت‌های پشتیبانی و ارتباط با منتور', route: 'Support' as const },
                        { label: '⚙️ تنظیمات اتصال سرور (API)', route: 'Settings' as const },
                    ].map((item, idx) => (
                        <Pressable
                            key={item.route}
                            onPress={() => navigation.navigate(item.route)}
                            style={[
                                styles.menuRow,
                                idx > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                            ]}
                        >
                            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                            <Text style={[styles.menuArrow, { color: colors.primary }]}>←</Text>
                        </Pressable>
                    ))}
                </View>

                <PrimaryButton
                    title="خروج از حساب کاربری"
                    variant="danger"
                    onPress={() =>
                        Alert.alert('خروج از حساب', 'آیا مطمئن هستید که می‌خواهید خارج شوید؟', [
                            { text: 'انصراف', style: 'cancel' },
                            { text: 'خروج', style: 'destructive', onPress: () => logout() },
                        ])
                    }
                />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
    headerCard: {
        borderRadius: radius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        gap: 6,
    },
    name: { ...typography.title, marginTop: spacing.xs },
    email: { ...typography.small },
    editToggleBtn: {
        marginTop: spacing.xs,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: radius.pill,
        borderWidth: 1,
    },
    infoCard: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        gap: spacing.xs,
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    subText: { ...typography.tiny, marginTop: 2 },
    referralCard: {
        borderRadius: radius.xl,
        padding: spacing.lg,
        gap: spacing.sm,
    },
    refBadge: { color: '#FACC15', fontSize: 12, fontWeight: '700' },
    refTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    refSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 19 },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
    },
    menuLabel: { ...typography.subtitle, fontSize: 14 },
    menuArrow: { fontSize: 16, fontWeight: '700' },
});
