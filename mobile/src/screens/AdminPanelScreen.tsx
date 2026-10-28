import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Badge, Card, Field, PrimaryButton, SectionHeader } from '../components';
import { formatPrice } from '../utils/format';
import { getServerOrigin } from '../api/client';
import { radius, spacing, typography } from '../theme';

type AdminCategory =
    | 'overview'
    | 'courses'
    | 'users'
    | 'crm'
    | 'finance'
    | 'automations'
    | 'tickets';

export function AdminPanelScreen() {
    const { colors } = useTheme();
    const [activeCategory, setActiveCategory] = useState<AdminCategory>('overview');

    // 1. In-App Courses CRUD
    const [courses, setCourses] = useState([
        { id: 1, title: 'معماری ذهن و تسلط بر هیجان', students: 428, price: 3900000, published: true, category: 'کوچینگ ذهن' },
        { id: 2, title: 'کوچینگ بهره‌وری و سیستم‌سازی فردی', students: 312, price: 2850000, published: true, category: 'بهره‌وری' },
        { id: 3, title: 'رهبری خود و تصمیم‌گیری استراتژیک', students: 195, price: 4500000, published: true, category: 'رهبری' },
        { id: 4, title: 'مسترکلاس هدف‌گذاری OKR فردی', students: 84, price: 1950000, published: false, category: 'هدف‌گذاری' },
    ]);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newPrice, setNewPrice] = useState('۲,۵۰۰,۰۰۰');
    const [newCat, setNewCat] = useState('رشد فردی');

    // 2. In-App Users & RBAC
    const [users, setUsers] = useState([
        { id: 101, name: 'محمدرضا کاظمی', email: 'm.kazemi@example.com', role: 'مدیر ارشد', status: 'فعال', wallet: '۲,۴۰۰,۰۰۰' },
        { id: 102, name: 'سارا احمدی', email: 'sara.ahmadi@example.com', role: 'دانش‌پذیر VIP', status: 'فعال', wallet: '۵۰۰,۰۰۰' },
        { id: 103, name: 'امیرحسین رضایی', email: 'amir.rezaei@example.com', role: 'پشتیبان فنی', status: 'فعال', wallet: '۰' },
    ]);

    // 3. In-App CRM & Leads
    const [leads, setLeads] = useState([
        { id: 1, name: 'علیرضا شمس', phone: '۰۹۱۲۳۴۵۶۷۸۹', course: 'کوچینگ استراتژیک', stage: 'جدید' },
        { id: 2, name: 'مریم کمالی', phone: '۰۹۱۸۲۳۴۵۶۷۸', course: 'معماری ذهن', stage: 'در حال پیگیری' },
        { id: 3, name: 'کامران نوری', phone: '۰۹۳۵۱۲۳۴۵۶۷', course: 'رهبری فردی', stage: 'جلسه مشاوره' },
    ]);

    // 4. In-App Finance & Slips
    const [discountCodes, setDiscountCodes] = useState([
        { id: 1, code: 'BAHAR50', percent: '۵۰٪', active: true },
        { id: 2, code: 'VIP2025', percent: '۳۰٪', active: true },
    ]);
    const [newCode, setNewCode] = useState('');
    const [pendingSlips, setPendingSlips] = useState([
        { id: 'INV-8841', user: 'سامان یزدانی', amount: '۳,۹۰۰,۰۰۰ تومان', status: 'در انتظار تایید' },
    ]);

    // 5. In-App Automations
    const [botSwitches, setBotSwitches] = useState({
        instagram: true,
        eitaa: true,
        sms: true,
        maintenance: false,
    });
    const [broadcastMsg, setBroadcastMsg] = useState('');

    // 6. In-App Support Resolution
    const [tickets, setTickets] = useState([
        { id: 401, user: 'امیرحسین رضایی', subject: 'مشکل در باز شدن ویدیوی جلسه ۴', status: 'باز', reply: '' },
        { id: 402, user: 'سارا احمدی', subject: 'درخواست صدور مدرک هولوگرام‌دار', status: 'پاسخ داده شد', reply: 'مدرک با پست پیشتاز ارسال شد.' },
    ]);
    const [replyInput, setReplyInput] = useState('');

    const categories: { id: AdminCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
        { id: 'overview', label: 'پیشخوان و آمار', icon: 'speedometer-outline' },
        { id: 'courses', label: 'مدیریت دوره‌ها', icon: 'school-outline' },
        { id: 'users', label: 'کاربران و نقش‌ها', icon: 'people-outline' },
        { id: 'crm', label: 'سرنخ‌ها و CRM', icon: 'funnel-outline' },
        { id: 'finance', label: 'مالی و تخفیف‌ها', icon: 'card-outline' },
        { id: 'automations', label: 'ربات‌ها و کانال', icon: 'hardware-chip-outline' },
        { id: 'tickets', label: 'تیکت‌های باز', icon: 'chatbubbles-outline' },
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.bg }]}
            contentContainerStyle={styles.content}
        >
            {/* Executive In-App Header */}
            <View style={[styles.heroBanner, { backgroundColor: '#0B3B2B', borderColor: '#D4AF37' }]}>
                <View style={styles.heroTopRow}>
                    <View style={styles.adminBadge}>
                        <Ionicons name="shield-checkmark" size={14} color="#0B3B2B" />
                        <Text style={styles.adminBadgeText}>FULL IN-APP ADMIN</Text>
                    </View>
                    <Text style={{ color: '#F4D06F', fontSize: 11, fontWeight: '700' }}>
                        مدیریت ۱۰۰٪ درون‌برنامه‌ای
                    </Text>
                </View>

                <Text style={styles.heroTitle}>مرکز مدیریت و کنترل عملیاتی سامانه</Text>
                <Text style={styles.heroSubtitle}>
                    تمامی عملیات‌های ادمین (دوره‌ها، کاربران، مالی، لیدها و ربات‌ها) بدون خروج از اپلیکیشن قابل اجرا هستند.
                </Text>

                {/* Live Stats */}
                <View style={styles.kpiRow}>
                    <View style={styles.kpiBox}>
                        <Text style={styles.kpiValue}>۱۸۴M</Text>
                        <Text style={styles.kpiLabel}>فروش ماه</Text>
                    </View>
                    <View style={styles.kpiBox}>
                        <Text style={styles.kpiValue}>۱,۴۲۰</Text>
                        <Text style={styles.kpiLabel}>کاربران</Text>
                    </View>
                    <View style={styles.kpiBox}>
                        <Text style={styles.kpiValue}>۳۴</Text>
                        <Text style={styles.kpiLabel}>لید امروز</Text>
                    </View>
                    <View style={styles.kpiBox}>
                        <Text style={styles.kpiValue}>۲</Text>
                        <Text style={styles.kpiLabel}>تیکت باز</Text>
                    </View>
                </View>
            </View>

            {/* In-App Category Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
            >
                {categories.map((cat) => {
                    const active = activeCategory === cat.id;
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setActiveCategory(cat.id)}
                            style={[
                                styles.categoryChip,
                                {
                                    backgroundColor: active ? colors.primary : colors.surface,
                                    borderColor: active ? colors.primary : colors.border,
                                },
                            ]}
                        >
                            <Ionicons
                                name={cat.icon}
                                size={16}
                                color={active ? '#FFFFFF' : colors.muted}
                            />
                            <Text
                                style={[
                                    styles.categoryChipText,
                                    { color: active ? '#FFFFFF' : colors.text },
                                ]}
                            >
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* TAB 1: OVERVIEW */}
            {activeCategory === 'overview' && (
                <View style={{ gap: spacing.md }}>
                    <Card>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>عملیات‌های سریع ادمین در اپ</Text>
                        <View style={styles.quickGrid}>
                            <TouchableOpacity
                                style={[styles.quickBox, { backgroundColor: colors.surfaceAlt }]}
                                onPress={() => setActiveCategory('courses')}
                            >
                                <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                                <Text style={[styles.quickBoxTitle, { color: colors.text }]}>ایجاد دوره جدید</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.quickBox, { backgroundColor: colors.surfaceAlt }]}
                                onPress={() => setActiveCategory('finance')}
                            >
                                <Ionicons name="card-outline" size={24} color="#D4AF37" />
                                <Text style={[styles.quickBoxTitle, { color: colors.text }]}>تایید فیش‌های واریزی</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.quickBox, { backgroundColor: colors.surfaceAlt }]}
                                onPress={() => setActiveCategory('crm')}
                            >
                                <Ionicons name="people-outline" size={24} color="#2481CC" />
                                <Text style={[styles.quickBoxTitle, { color: colors.text }]}>پیگیری ۳۴ لید جدید</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.quickBox, { backgroundColor: colors.surfaceAlt }]}
                                onPress={() => setActiveCategory('automations')}
                            >
                                <Ionicons name="paper-plane-outline" size={24} color="#9D4EDD" />
                                <Text style={[styles.quickBoxTitle, { color: colors.text }]}>ارسال پیام همگانی</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            )}

            {/* TAB 2: COURSES MANAGEMENT */}
            {activeCategory === 'courses' && (
                <View style={{ gap: spacing.md }}>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            دوره‌های آموزشی ({courses.length} دوره)
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowAddCourse(!showAddCourse)}
                            style={[styles.smallBtn, { backgroundColor: colors.primary }]}
                        >
                            <Text style={styles.smallBtnText}>+ افزودن دوره</Text>
                        </TouchableOpacity>
                    </View>

                    {showAddCourse && (
                        <Card style={{ borderColor: colors.primary, borderWidth: 1.5 }}>
                            <Text style={[styles.cardTitle, { color: colors.primary }]}>فرم ثبت دوره جدید</Text>
                            <Field label="عنوان دوره" value={newTitle} onChangeText={setNewTitle} />
                            <Field label="قیمت دوره (تومان)" value={newPrice} onChangeText={setNewPrice} />
                            <PrimaryButton
                                title="ذخیره و انتشار فوری در اپ و سایت"
                                onPress={() => {
                                    if (!newTitle.trim()) return;
                                    setCourses([
                                        {
                                            id: Date.now(),
                                            title: newTitle,
                                            price: 2500000,
                                            category: newCat,
                                            students: 0,
                                            published: true,
                                        },
                                        ...courses,
                                    ]);
                                    setNewTitle('');
                                    setShowAddCourse(false);
                                }}
                            />
                        </Card>
                    )}

                    {courses.map((c) => (
                        <Card key={c.id}>
                            <View style={styles.rowBetween}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.itemTitle, { color: colors.text }]}>{c.title}</Text>
                                    <Text style={[styles.itemMeta, { color: colors.muted }]}>
                                        {c.category} • {c.students} دانش‌پذیر • {formatPrice(c.price)}
                                    </Text>
                                </View>
                                <Switch
                                    value={c.published}
                                    onValueChange={(val) =>
                                        setCourses((prev) =>
                                            prev.map((item) => (item.id === c.id ? { ...item, published: val } : item)),
                                        )
                                    }
                                    trackColor={{ false: colors.border, true: colors.primary }}
                                />
                            </View>
                            <View style={[styles.rowBetween, { marginTop: spacing.sm, paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: colors.border }]}>
                                <Badge
                                    label={c.published ? 'منتشر شده' : 'پیش‌نویس'}
                                    tone={c.published ? 'success' : 'warning'}
                                />
                                <TouchableOpacity
                                    onPress={() => setCourses(courses.filter((x) => x.id !== c.id))}
                                >
                                    <Text style={{ color: colors.danger, fontSize: 11, fontWeight: '700' }}>حذف دوره</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>
            )}

            {/* TAB 3: USERS & RBAC */}
            {activeCategory === 'users' && (
                <View style={{ gap: spacing.md }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>کاربران و سطوح دسترسی</Text>
                    {users.map((u) => (
                        <Card key={u.id}>
                            <View style={styles.rowBetween}>
                                <View>
                                    <Text style={[styles.itemTitle, { color: colors.text }]}>{u.name}</Text>
                                    <Text style={[styles.itemMeta, { color: colors.muted }]}>{u.email}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setUsers(
                                            users.map((x) =>
                                                x.id === u.id
                                                    ? { ...x, role: x.role === 'مدیر ارشد' ? 'دانش‌پذیر VIP' : 'مدیر ارشد' }
                                                    : x,
                                            ),
                                        );
                                    }}
                                    style={[styles.smallBtn, { backgroundColor: colors.surfaceAlt }]}
                                >
                                    <Text style={[styles.smallBtnText, { color: colors.primary }]}>
                                        نقش: {u.role} (تغییر)
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.rowBetween, { marginTop: spacing.sm, paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: colors.border }]}>
                                <Text style={[styles.itemMeta, { color: colors.text }]}>کیف پول: {u.wallet} تومان</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setUsers(
                                            users.map((x) =>
                                                x.id === u.id
                                                    ? { ...x, status: x.status === 'فعال' ? 'مسدود' : 'فعال' }
                                                    : x,
                                            ),
                                        );
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: u.status === 'فعال' ? colors.danger : colors.success,
                                            fontSize: 11,
                                            fontWeight: '700',
                                        }}
                                    >
                                        {u.status === 'فعال' ? 'مسدودسازی' : 'رفع مسدودی'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>
            )}

            {/* TAB 4: CRM & LEADS */}
            {activeCategory === 'crm' && (
                <View style={{ gap: spacing.md }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>سرنخ‌های فروش و پیگیری</Text>
                    {leads.map((l) => (
                        <Card key={l.id}>
                            <View style={styles.rowBetween}>
                                <View>
                                    <Text style={[styles.itemTitle, { color: colors.text }]}>{l.name}</Text>
                                    <Text style={[styles.itemMeta, { color: colors.muted }]}>
                                        تلفن: {l.phone} • {l.course}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        const stages = ['جدید', 'در حال پیگیری', 'جلسه مشاوره', 'ثبت‌نام قطعی'];
                                        const nxt = (stages.indexOf(l.stage) + 1) % stages.length;
                                        setLeads(leads.map((x) => (x.id === l.id ? { ...x, stage: stages[nxt] } : x)));
                                    }}
                                    style={[styles.smallBtn, { backgroundColor: colors.surfaceAlt }]}
                                >
                                    <Text style={[styles.smallBtnText, { color: colors.primary }]}>
                                        مرحله: {l.stage}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>
            )}

            {/* TAB 5: FINANCE & DISCOUNTS */}
            {activeCategory === 'finance' && (
                <View style={{ gap: spacing.md }}>
                    <Card>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>ساخت کد تخفیف جدید</Text>
                        <Field label="کد تخفیف" value={newCode} onChangeText={setNewCode} placeholder="مثال: BAHAR40" />
                        <PrimaryButton
                            title="+ ثبت و فعال‌سازی فوری کد"
                            onPress={() => {
                                if (!newCode.trim()) return;
                                setDiscountCodes([{ id: Date.now(), code: newCode.toUpperCase(), percent: '۴۰٪', active: true }, ...discountCodes]);
                                setNewCode('');
                            }}
                        />
                    </Card>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>فیش‌های واریزی در انتظار</Text>
                    {pendingSlips.map((p) => (
                        <Card key={p.id}>
                            <View style={styles.rowBetween}>
                                <Text style={[styles.itemTitle, { color: colors.text }]}>{p.user} ({p.id})</Text>
                                <Text style={{ color: colors.primary, fontWeight: '800' }}>{p.amount}</Text>
                            </View>
                            <View style={[styles.rowBetween, { marginTop: spacing.sm }]}>
                                <TouchableOpacity
                                    onPress={() => setPendingSlips(pendingSlips.filter((x) => x.id !== p.id))}
                                    style={[styles.smallBtn, { backgroundColor: colors.primary }]}
                                >
                                    <Text style={styles.smallBtnText}>✓ تایید واریز</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setPendingSlips(pendingSlips.filter((x) => x.id !== p.id))}
                                >
                                    <Text style={{ color: colors.danger, fontSize: 11, fontWeight: '700' }}>رد فیش</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>
            )}

            {/* TAB 6: AUTOMATIONS & BOTS */}
            {activeCategory === 'automations' && (
                <View style={{ gap: spacing.md }}>
                    <Card>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>ارسال پیام همگانی به کانال‌ها</Text>
                        <Field
                            label="متن پیام"
                            value={broadcastMsg}
                            onChangeText={setBroadcastMsg}
                            placeholder="متن را بنویسید..."
                            multiline
                        />
                        <PrimaryButton
                            title="ارسال همزمان به کانال تلگرام و ایتا"
                            onPress={() => {
                                Alert.alert('موفق', 'پیام با موفقیت در کانال‌ها منتشر شد.');
                                setBroadcastMsg('');
                            }}
                        />
                    </Card>

                    <Card>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>کلیدهای اتصال ربات‌ها</Text>
                        {[
                            { key: 'instagram' as const, label: 'ربات دایرکت اینستاگرام' },
                            { key: 'eitaa' as const, label: 'ربات و کانال ایتا' },
                            { key: 'sms' as const, label: 'گیت‌وی پیامک کاوه‌نگار' },
                        ].map((b) => (
                            <View key={b.key} style={[styles.rowBetween, { paddingVertical: spacing.sm }]}>
                                <Text style={[styles.itemTitle, { color: colors.text }]}>{b.label}</Text>
                                <Switch
                                    value={botSwitches[b.key]}
                                    onValueChange={(val) => setBotSwitches({ ...botSwitches, [b.key]: val })}
                                    trackColor={{ false: colors.border, true: colors.primary }}
                                />
                            </View>
                        ))}
                    </Card>
                </View>
            )}

            {/* TAB 7: TICKETS */}
            {activeCategory === 'tickets' && (
                <View style={{ gap: spacing.md }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>پاسخگویی به تیکت‌های پشتیبانی</Text>
                    {tickets.map((t) => (
                        <Card key={t.id}>
                            <View style={styles.rowBetween}>
                                <Text style={[styles.itemTitle, { color: colors.text }]}>#{t.id} — {t.user}</Text>
                                <Badge label={t.status} tone={t.status === 'باز' ? 'danger' : 'success'} />
                            </View>
                            <Text style={[styles.itemMeta, { color: colors.muted, marginVertical: spacing.xs }]}>
                                موضوع: {t.subject}
                            </Text>
                            {t.reply ? (
                                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600' }}>
                                    پاسخ شما: {t.reply}
                                </Text>
                            ) : (
                                <View style={{ gap: spacing.xs, marginTop: spacing.xs }}>
                                    <TextInput
                                        placeholder="پاسخ مستقیم خود را تایپ کنید..."
                                        placeholderTextColor={colors.muted}
                                        value={replyInput}
                                        onChangeText={setReplyInput}
                                        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (!replyInput.trim()) return;
                                            setTickets(
                                                tickets.map((x) =>
                                                    x.id === t.id ? { ...x, status: 'پاسخ داده شد', reply: replyInput } : x,
                                                ),
                                            );
                                            setReplyInput('');
                                        }}
                                        style={[styles.smallBtn, { backgroundColor: colors.primary }]}
                                    >
                                        <Text style={styles.smallBtnText}>ارسال پاسخ مستقیم</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Card>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: spacing.md, gap: spacing.md },
    heroBanner: {
        padding: spacing.lg,
        borderRadius: radius.xl,
        borderWidth: 1.5,
        gap: spacing.sm,
    },
    heroTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    adminBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D4AF37',
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: radius.sm,
        gap: 4,
    },
    adminBadgeText: { fontSize: 10, fontWeight: '900', color: '#0B3B2B' },
    heroTitle: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
    heroSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
    kpiRow: {
        flexDirection: 'row',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    kpiBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: spacing.sm,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    kpiValue: { fontSize: 14, fontWeight: '900', color: '#F4D06F' },
    kpiLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    categoryScroll: { gap: spacing.xs, paddingVertical: spacing.xs },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        borderWidth: 1,
        gap: 6,
    },
    categoryChipText: { fontSize: 11, fontWeight: '700' },
    sectionTitle: { fontSize: 13, fontWeight: '800', marginBottom: spacing.xs },
    cardTitle: { fontSize: 13, fontWeight: '800', marginBottom: spacing.sm },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemTitle: { fontSize: 12, fontWeight: '700' },
    itemMeta: { fontSize: 10, marginTop: 2 },
    smallBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
    },
    smallBtnText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', textAlign: 'center' },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    quickBox: {
        flex: 1,
        minWidth: 120,
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        gap: spacing.xs,
    },
    quickBoxTitle: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderRadius: radius.sm,
        padding: spacing.sm,
        fontSize: 11,
    },
});
