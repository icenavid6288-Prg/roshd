import React, { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Field, PrimaryButton, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { TabStackNavigation } from '../navigation/types';

export function ProfileScreen() {
 const navigation = useNavigation<TabStackNavigation>();
 const { user, logout, updateProfile } = useAuth();
 const { colors, isDark, toggleTheme } = useTheme();
 const [editing, setEditing] = useState(false);
 const [confirmExit, setConfirmExit] = useState(false);
 const [name, setName] = useState(user?.name || '');
 const [phone, setPhone] = useState(user?.phone || '');
 const [city, setCity] = useState(user?.city || '');
 const [jobTitle, setJobTitle] = useState(user?.job_title || '');
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState('');
 if (!user) return null;
 const saveEdit = async () => {
   setSaving(true); setError('');
   try { await updateProfile({ name: name.trim() || user.name, phone: phone.trim(), city: city.trim(), job_title: jobTitle.trim() }); setEditing(false); }
   catch { setError('ذخیره انجام نشد. اطلاعات شما باقی مانده؛ دوباره تلاش کنید.'); }
   finally { setSaving(false); }
 };
 const shareReferral = async () => {
   try { await Share.share({ message: 'همراه من در Roshd یاد بگیر و رشد کن. https://saradars.ir/' + (user.referral_code ? 'invite?ref=' + encodeURIComponent(user.referral_code) : '') }); } catch { }
 };
 const items = [
 { title: 'جلسه‌های من', caption: 'همراهی با مشاور در مسیر رشد', icon: 'calendar-outline' as const, route: 'Sessions' as const },
 { title: 'هدف‌ها و دستاوردها', caption: 'قدم‌هایی که برای خودت می‌سازی', icon: 'flag-outline' as const, route: 'Goals' as const },
 { title: 'یادآوری‌ها', caption: 'زمان و روش دریافت اعلان', icon: 'notifications-outline' as const, route: 'Reminders' as const },
 { title: 'گفت‌وگو با پشتیبانی', caption: 'پرسش‌ها و درخواست‌های شما', icon: 'chatbubble-ellipses-outline' as const, route: 'Support' as const },
 ];
 return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
 <View><Text style={[s.pageTitle, { color: colors.text }]}>فضای شخصی من</Text><Text style={[s.caption, { color: colors.muted }]}>حساب، همراهان و انتخاب‌های تو</Text></View>
 <View style={s.identity}><View style={s.row}><Avatar name={user.name} uri={user.avatar} size={64} /><View style={s.copy}><Text style={s.identityLabel}>حساب Roshd</Text><Text style={s.name}>{user.name}</Text><Text style={s.phone}>{user.phone || 'شماره موبایل ثبت نشده'}</Text></View></View>
 <View style={s.identityBottom}><Text style={s.identityDetail}>{[user.city, user.job_title].filter(Boolean).join('، ') || 'این فضا برای مسیر رشد توست.'}</Text><Pressable accessibilityRole="button" accessibilityLabel="ویرایش مشخصات" onPress={() => { setName(user.name); setPhone(user.phone || ''); setCity(user.city || ''); setJobTitle(user.job_title || ''); setEditing(v => !v); setError(''); }} style={({ pressed }) => [s.edit, pressed && s.pressed]}><Ionicons name={editing ? 'close' : 'create-outline'} size={20} color="#163F32" /></Pressable></View></View>
 {editing && <View style={[s.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[s.sectionTitle, { color: colors.text }]}>ویرایش مشخصات</Text><Field label="نام و نام خانوادگی" value={name} onChangeText={setName} /><Field label="شماره موبایل" value={phone} onChangeText={setPhone} /><Field label="شهر" value={city} onChangeText={setCity} /><Field label="عنوان شغلی" value={jobTitle} onChangeText={setJobTitle} />{!!error && <Text accessibilityRole="alert" style={[s.caption, { color: colors.danger }]}>{error}</Text>}<PrimaryButton title="ذخیره مشخصات" onPress={saveEdit} loading={saving} /></View>}
 <Text style={[s.sectionTitle, { color: colors.text }]}>مسیر و همراهان</Text>
 <View style={[s.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>{items.map((item, i) => <Pressable accessibilityRole="button" key={item.route} onPress={() => navigation.navigate(item.route)} style={({ pressed }) => [s.menuRow, i > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }, pressed && s.pressed]}><View style={[s.icon, { backgroundColor: colors.primarySoft }]}><Ionicons name={item.icon} color={colors.primary} size={23} /></View><View style={s.copy}><Text style={[s.menuTitle, { color: colors.text }]}>{item.title}</Text><Text style={[s.caption, { color: colors.muted }]}>{item.caption}</Text></View><Ionicons name="chevron-back" size={18} color={colors.muted} /></Pressable>)}</View>
 <Pressable accessibilityRole="button" onPress={shareReferral} style={({ pressed }) => [s.invite, pressed && s.pressed]}><Ionicons name="people-outline" size={28} color="#214F3A" /><View style={s.copy}><Text style={s.inviteTitle}>رشد، کنار هم بهتره</Text><Text style={s.inviteCaption}>دوستانت را به Roshd دعوت کن</Text></View><Ionicons name="share-social-outline" size={22} color="#214F3A" /></Pressable>
 <Text style={[s.sectionTitle, { color: colors.text }]}>تنظیمات</Text>
 <View style={[s.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={s.menuRow}><Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={23} color={colors.primary} /><View style={s.copy}><Text style={[s.menuTitle, { color: colors.text }]}>حالت تاریک</Text><Text style={[s.caption, { color: colors.muted }]}>نمایش مناسب برای نور کم</Text></View><Switch accessibilityLabel="حالت تاریک" value={isDark} onValueChange={toggleTheme} trackColor={{ false: colors.border, true: colors.primary }} /></View><Pressable accessibilityRole="button" onPress={() => navigation.navigate('Settings')} style={[s.menuRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}><Ionicons name="options-outline" size={23} color={colors.muted} /><Text style={[s.menuTitle, s.copy, { color: colors.muted }]}>تنظیمات پیشرفته</Text><Ionicons name="chevron-back" size={18} color={colors.muted} /></Pressable></View>
 {confirmExit ? <View style={[s.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[s.menuTitle, { color: colors.text }]}>از حساب خارج می‌شوید؟</Text><PrimaryButton title="بله، خروج از حساب" variant="danger" onPress={logout} /><PrimaryButton title="ماندن در حساب" variant="outline" onPress={() => setConfirmExit(false)} /></View> : <Pressable accessibilityRole="button" onPress={() => setConfirmExit(true)} style={s.logout}><Ionicons name="log-out-outline" size={20} color={colors.danger} /><Text style={[s.menuTitle, { color: colors.danger }]}>خروج از حساب</Text></Pressable>}
 <Text style={[s.signature, { color: colors.muted }]}>Roshd · فضای رشد تو</Text>
 </ScrollView></Screen>;
}
const s = StyleSheet.create({
 content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 22, paddingBottom: 40, gap: 20 },
 pageTitle: { fontFamily: 'VazirmatnBlack', fontSize: 26, lineHeight: 42, textAlign: 'right' },
 identity: { backgroundColor: '#153F31', borderRadius: 28, padding: 22, gap: 22 }, row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16 }, copy: { flex: 1, minWidth: 0, gap: 3 },
 identityLabel: { fontFamily: 'Vazirmatn', fontSize: 12, color: '#C1DBCC', textAlign: 'right' }, name: { fontFamily: 'VazirmatnBold', fontSize: 22, color: '#FFFFFF', lineHeight: 36, textAlign: 'right' }, phone: { fontFamily: 'Vazirmatn', fontSize: 14, color: '#C1DBCC', textAlign: 'right' },
 identityBottom: { borderTopWidth: 1, borderTopColor: '#386151', paddingTop: 16, flexDirection: 'row-reverse', gap: 14, alignItems: 'center' }, identityDetail: { flex: 1, fontFamily: 'Vazirmatn', fontSize: 14, lineHeight: 24, color: '#D3E5D8', textAlign: 'right' }, edit: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#D5F58A', alignItems: 'center', justifyContent: 'center' },
 sectionTitle: { fontFamily: 'VazirmatnBold', fontSize: 18, lineHeight: 30, textAlign: 'right' }, panel: { padding: 20, borderRadius: 24, borderWidth: 1, gap: 14 }, menu: { borderWidth: 1, borderRadius: 24, paddingHorizontal: 16 }, menuRow: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 18, gap: 13 }, icon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, menuTitle: { fontFamily: 'VazirmatnBold', fontSize: 15, lineHeight: 26, textAlign: 'right' }, caption: { fontFamily: 'Vazirmatn', fontSize: 13, lineHeight: 23, textAlign: 'right' },
 invite: { backgroundColor: '#E8F2D5', padding: 20, borderRadius: 24, flexDirection: 'row-reverse', gap: 14, alignItems: 'center' }, inviteTitle: { fontFamily: 'VazirmatnBold', fontSize: 17, lineHeight: 28, color: '#214F3A', textAlign: 'right' }, inviteCaption: { fontFamily: 'Vazirmatn', fontSize: 13, lineHeight: 24, color: '#4D705B', textAlign: 'right' }, logout: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 9, minHeight: 48 }, signature: { fontFamily: 'Vazirmatn', fontSize: 12, textAlign: 'center' }, pressed: { opacity: 0.7 },
});

