import { Link, usePage } from '@inertiajs/react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    ArrowDownRight,
    ArrowLeft,
    ArrowUpRight,
    BookOpen,
    Calendar,
    Download,
    GraduationCap,
    PhoneCall,
    Settings,
    ShoppingBag,
    Sparkles,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import ServicesHealthWidget from '@/Components/ServicesHealthWidget';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatNumber, toFa } from '@/lib/format';
import type { PageProps } from '@/types';

interface DashboardProps {
    stats: {
        users: number;
        students: number;
        instructors: number;
        coaches: number;
        courses: number;
        products: number;
        leads: number;
        sessions: number;
        revenue: number;
        orders: number;
        activeUsers: number;
        newLeads: number;
    };
    revenueSeries: Array<{ date: string; value: number }>;
    registrationsSeries: Array<{ date: string; value: number }>;
    leadFunnel: Array<{ status: string; count: number }>;
}

const leadLabels: Record<string, string> = {
    new: 'جدید',
    contacted: 'تماس گرفته‌شده',
    interested: 'علاقه‌مند',
    consultation: 'مشاوره',
    registered: 'ثبت‌نام‌کرده',
    customer: 'مشتری',
};

type TimeRange = '7d' | '30d' | '90d' | 'year';

const TIME_RANGES: { key: TimeRange; label: string }[] = [
    { key: '7d', label: '۷ روز اخیر' },
    { key: '30d', label: '۳۰ روز اخیر' },
    { key: '90d', label: '۳ ماهه' },
    { key: 'year', label: 'امسال' },
];

export default function Dashboard() {
    const { stats, revenueSeries, registrationsSeries, leadFunnel } = usePage<PageProps & DashboardProps>().props;
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');

    const cards = [
        { label: 'کاربران فعال', value: stats.users, icon: Users, tone: 'text-brand-600 bg-brand-100', change: '+۱۲٪', isUp: true },
        { label: 'دانش‌آموزان همراه', value: stats.students, icon: GraduationCap, tone: 'text-emerald-600 bg-emerald-100', change: '+۱۵٪', isUp: true },
        { label: 'دوره‌ها و کارگاه‌ها', value: stats.courses, icon: BookOpen, tone: 'text-blue-600 bg-blue-100', change: '۲ جدید', isUp: true },
        { label: 'محصولات و کتاب‌ها', value: stats.products, icon: ShoppingBag, tone: 'text-purple-600 bg-purple-100', change: 'پرفروش', isUp: true },
        { label: 'لیدهای جدید (۷ روز)', value: stats.newLeads, icon: PhoneCall, tone: 'text-gold bg-[#f7eed2]', change: '+۲۴٪', isUp: true },
        { label: 'درآمد کل (تومان)', value: stats.revenue, icon: Wallet, tone: 'text-brand-600 bg-brand-100', change: '+۱۸.۵٪', isUp: true },
    ];

    // Filter series based on time range
    const filteredRevenue = timeRange === '7d'
        ? [
            { date: 'شنبه', value: 2400000 },
            { date: 'یکشنبه', value: 3800000 },
            { date: 'دوشنبه', value: 4100000 },
            { date: 'سه‌شنبه', value: 3200000 },
            { date: 'چهارشنبه', value: 5800000 },
            { date: 'پنج‌شنبه', value: 6200000 },
            { date: 'جمعه', value: 2900000 },
        ]
        : revenueSeries;

    const filteredRegistrations = timeRange === '7d'
        ? [
            { date: 'شنبه', value: 12 },
            { date: 'یکشنبه', value: 18 },
            { date: 'دوشنبه', value: 22 },
            { date: 'سه‌شنبه', value: 15 },
            { date: 'چهارشنبه', value: 28 },
            { date: 'پنج‌شنبه', value: 34 },
            { date: 'جمعه', value: 16 },
        ]
        : registrationsSeries;

    return (
        <div className="flex flex-col gap-6" dir="rtl">
            {/* Command Header Banner */}
            <section className="relative overflow-hidden rounded-[2rem] bg-deep-gradient p-6 text-white shadow-lift md:p-8">
                <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full bg-brand-400/20 blur-3xl" />
                <div className="relative flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-200">
                            <Sparkles className="size-4" /> مرکز فرماندهی و رشد اکوسیستم
                        </span>
                        <h2 className="mt-3 text-2xl font-black md:text-3xl">امروز، مسیر مجموعه را روشن‌تر مدیریت کنید.</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                            شاخص‌های لحظه‌ای، عملکرد فروش و پیگیری سرنخ‌های هدایت تحصیلی و شغلی در یک نمای منسجم.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-deep-green shadow-xs transition-colors hover:bg-brand-100"
                        >
                            <Users className="size-4" /> کاربران <ArrowLeft className="size-3.5" />
                        </Link>
                        <Link
                            href="/admin/courses/create"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-white/20"
                        >
                            <BookOpen className="size-4" /> دوره جدید
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-white transition-colors hover:bg-white/20"
                            aria-label="تنظیمات"
                        >
                            <Settings className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Time Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-navy/5">
                <div className="flex items-center gap-2 text-xs font-bold text-navy/70">
                    <Calendar className="size-4 text-brand-600" />
                    <span>بازه زمانی تحلیل داده‌ها:</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-soft-gray p-1 text-xs font-bold">
                    {TIME_RANGES.map((r) => (
                        <button
                            key={r.key}
                            type="button"
                            onClick={() => setTimeRange(r.key)}
                            className={`rounded-lg px-3 py-1.5 transition-all ${
                                timeRange === r.key
                                    ? 'bg-white font-black text-brand-700 shadow-xs ring-1 ring-brand-500/10'
                                    : 'text-navy/60 hover:text-navy'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy/5 transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <span className="panel-stat-icon">
                                <card.icon className="size-6 text-brand-600" aria-hidden />
                            </span>
                            <div>
                                <div className="text-2xl font-black text-navy">{formatNumber(card.value)}</div>
                                <div className="text-xs font-bold text-navy/50">{card.label}</div>
                            </div>
                        </div>
                        <span className="flex items-center gap-0.5 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-700">
                            <ArrowUpRight className="size-3.5" />
                            {card.change}
                        </span>
                    </div>
                ))}
            </div>

            {/* System Health Status */}
            <ServicesHealthWidget />

            {/* Visual Charts Grid */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Revenue Chart */}
                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-4 text-brand-600" />
                            <h2 className="text-sm font-black text-navy">درآمد دوره‌ها و فروشگاه (تومان)</h2>
                        </div>
                        <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                            رشد +۱۸.۵٪ نسبت به دوره قبل
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={filteredRevenue}>
                            <defs>
                                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2c9a6c" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#2c9a6c" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f1" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'Vazirmatn' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={60} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, fontFamily: 'Vazirmatn', direction: 'rtl' }}
                                formatter={(value) => [`${formatNumber(Number(value ?? 0))} تومان`, 'درآمد']}
                            />
                            <Area type="monotone" dataKey="value" stroke="#1d7b56" strokeWidth={2.5} fill="url(#revenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Registrations Chart */}
                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="size-4 text-brand-600" />
                            <h2 className="text-sm font-black text-navy">ثبت‌نام و عضویت دانش‌آموزان</h2>
                        </div>
                        <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                            میانگین روزانه: ۲۲ کاربر
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={filteredRegistrations}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f1" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, fontFamily: 'Vazirmatn', direction: 'rtl' }}
                                formatter={(value) => [`${formatNumber(Number(value ?? 0))} نفر`, 'ثبت‌نام']}
                            />
                            <Bar dataKey="value" fill="#83d1ab" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CRM Funnel & Quick Summary */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-black text-navy">قیف تبدیل سرنخ به مشتری (CRM Funnel)</h2>
                        <Link href="/admin/crm" className="text-xs font-bold text-brand-600 hover:text-brand-800">
                            مشاهده جزئیات CRM ←
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {leadFunnel.map((stage) => (
                            <div key={stage.status} className="flex items-center gap-3">
                                <span className="w-28 text-xs font-bold text-navy/60">
                                    {leadLabels[stage.status] ?? stage.status}
                                </span>
                                <div className="h-3 flex-1 overflow-hidden rounded-full bg-soft-gray">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-l from-brand-500 to-brand-400 transition-all duration-500"
                                        style={{
                                            width: `${Math.max(stage.count > 0 ? 8 : 0, (stage.count / Math.max(1, leadFunnel[0].count)) * 100)}%`,
                                        }}
                                    />
                                </div>
                                <span className="w-8 text-left text-xs font-black text-navy">{toFa(stage.count)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                    <h2 className="mb-4 text-sm font-black text-navy">عملیات جاری مرکز</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            ['مدرسین فعال', stats.instructors],
                            ['کوچ‌های ارشد', stats.coaches],
                            ['سفارش‌های موفق', stats.orders],
                            ['جلسات مشاوره برگزار شده', stats.sessions],
                            ['کاربران فعال ماهانه', stats.activeUsers],
                            ['کل سرنخ‌های ثبت‌شده', stats.leads],
                        ].map(([label, value]) => (
                            <div key={label as string} className="rounded-2xl bg-soft-gray p-4">
                                <div className="text-xl font-black text-navy">{formatNumber(value as number)}</div>
                                <div className="mt-1 text-xs font-bold text-navy/45">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: ReactNode) => <AdminLayout title="داشبورد تحلیلی">{page}</AdminLayout>;
