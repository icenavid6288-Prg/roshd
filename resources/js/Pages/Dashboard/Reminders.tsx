import { useState, type ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    BellRing,
    Calendar,
    CheckCircle2,
    Clock,
    Flame,
    History,
    PhoneCall,
    Send,
    ShieldCheck,
    Smartphone,
    Sparkles,
    TrendingUp,
    Zap,
} from 'lucide-react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import AutomatedRemindersWidget from '@/Components/Dashboard/AutomatedRemindersWidget';
import { formatNumber, formatDate } from '@/lib/format';
import type { PageProps } from '@/types';

interface ReminderLog {
    id: number;
    title: string;
    channel: 'sms' | 'eitaa' | 'in_app';
    recipient: string;
    sent_at: string;
    status: 'delivered' | 'pending';
    target_url?: string;
}

const PAST_LOGS: ReminderLog[] = [
    {
        id: 1,
        title: 'یادآوری جلسه تحلیل استعدادیابی با دکتر بیدی (۱ ساعت قبل)',
        channel: 'sms',
        recipient: '۰۹۱۲۳۴۵۶۷۸۹ (دانش‌آموز و والد)',
        sent_at: '۱۴۰۳/۰۸/۱۰ ساعت ۱۵:۰۰',
        status: 'delivered',
        target_url: '/dashboard/sessions',
    },
    {
        id: 2,
        title: 'یادآوری استمرار دوره: درس ۲ هوش‌های چندگانه گاردنر',
        channel: 'sms',
        recipient: '۰۹۱۲۳۴۵۶۷۸۹',
        sent_at: '۱۴۰۳/۰۸/۰۸ ساعت ۱۸:۰۰',
        status: 'delivered',
        target_url: '/courses/future-path-design',
    },
    {
        id: 3,
        title: 'یادآوری تکمیل تکلیف تحلیل ارزش‌های فردی',
        channel: 'eitaa',
        recipient: '@user_bidi',
        sent_at: '۱۴۰۳/۰۸/۰۵ ساعت ۱۷:۳۰',
        status: 'delivered',
        target_url: '/dashboard/assignments',
    },
];

export default function RemindersIndex() {
    return (
        <UserDashboardLayout>
            <Head title="یادآوری‌های خودکار دوره‌ها و جلسات" />
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                {/* Header Banner */}
                <header className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0c2b21] via-[#081d16] to-[#05140e] p-6 text-white shadow-lift md:p-8">
                    <div className="pointer-events-none absolute -left-12 -top-12 size-64 rounded-full bg-emerald-400/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -right-10 size-60 rounded-full bg-amber-400/10 blur-2xl" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-black text-amber-300">
                                <Sparkles className="size-3.5" />
                                سیستم انگیزش و استمرار هوشمند
                            </div>
                            <h1 className="mt-3 text-2xl font-black text-white md:text-3xl">
                                یادآوری خودکار دوره‌ها و جلسات کوچینگ
                            </h1>
                            <p className="mt-2 max-w-2xl text-xs leading-7 text-emerald-100/75 md:text-sm">
                                این ابزار برای جلوگیری از رها شدن دوره‌ها و فراموشی جلسات طراحی شده است تا مسیر رشد فردی شما بدون وقفه ادامه یابد.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                            <span className="text-3xl font-black text-emerald-300 font-mono">+۶۴٪</span>
                            <div className="text-xs text-white/70">
                                <strong>تکمیل دوره‌ها</strong>
                                <span className="block text-[0.68rem] text-white/50">با پیامک‌های به‌موقع</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Automation Widget */}
                <AutomatedRemindersWidget />

                {/* History of Sent Reminders */}
                <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-[#0f241a]/90">
                    <div className="flex items-center justify-between border-b border-navy/5 pb-4 dark:border-white/10">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-9 items-center justify-center rounded-xl bg-navy/5 text-navy dark:bg-white/10 dark:text-white">
                                <History className="size-4.5" />
                            </span>
                            <div>
                                <h3 className="text-sm font-black text-navy dark:text-white md:text-base">
                                    تاریخچه پیامک‌ها و یادآوری‌های ارسال‌شده اخیر
                                </h3>
                                <p className="text-xs text-navy/45 dark:text-white/45">
                                    ثبت تمام پیامک‌ها و اعلان‌های تحویل داده‌شده به تلفن همراه شما
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ۳ مورد ارسال موفق
                        </span>
                    </div>

                    <div className="mt-5 space-y-3">
                        {PAST_LOGS.map((log) => (
                            <div
                                key={log.id}
                                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy/5 bg-soft-gray/40 p-4 transition-all hover:bg-white dark:border-white/5 dark:bg-white/[0.02]"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                                        <CheckCircle2 className="size-5" />
                                    </span>
                                    <div>
                                        <strong className="text-xs font-black text-navy dark:text-white">
                                            {log.title}
                                        </strong>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.68rem] text-navy/50 dark:text-white/50">
                                            <span>تحویل به: {log.recipient}</span>
                                            <span>·</span>
                                            <span>زمان ارسال: {log.sent_at}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-black text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                        تحویل به مخابرات (موفق)
                                    </span>
                                    {log.target_url && (
                                        <Link
                                            href={log.target_url}
                                            className="text-xs font-bold text-brand-700 hover:underline dark:text-brand-300"
                                        >
                                            ورود مستقیم ←
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </UserDashboardLayout>
    );
}

RemindersIndex.layout = (page: ReactNode) => page;
