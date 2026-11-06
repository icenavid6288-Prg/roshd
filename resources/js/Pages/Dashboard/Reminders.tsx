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
import { formatNumber } from '@/lib/format';
import { addReminderToState, useDynamicAppStore } from '@/lib/dynamicAppStore';

export default function RemindersIndex() {
    const { appState, updateAppState } = useDynamicAppStore();
    const { reminders, reminderLogs, userProfile } = appState;
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('۱۸:۳۰');
    const [newDays, setNewDays] = useState('هر روز · ۶۰ دقیقه قبل');

    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        updateAppState((prev) => ({
            ...prev,
            reminders: addReminderToState(prev.reminders, newTitle, newTime, newDays, 'sms'),
        }));
        setNewTitle('');
    };

    const handleTestSms = () => {
        updateAppState((prev) => ({
            ...prev,
            reminderLogs: [
                {
                    id: Date.now(),
                    title: 'پیامک تست یادآوری جلسه و برنامه هفتگی رشد',
                    recipient: `${userProfile.phone} (دانش‌پذیر) و ${userProfile.parentPhone} (والدین)`,
                    sentAt: 'هم‌اکنون · تحویل فوری',
                    channel: 'sms',
                    status: 'delivered',
                },
                ...prev.reminderLogs,
            ],
        }));
    };

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
                                سیستم انگیزش و استمرار هوشمند (همگام با اپلیکیشن)
                            </div>
                            <h1 className="mt-3 text-2xl font-black text-white md:text-3xl">
                                یادآوری خودکار دوره‌ها و جلسات کوچینگ
                            </h1>
                            <p className="mt-2 max-w-2xl text-xs leading-7 text-emerald-100/75 md:text-sm">
                                این ابزار برای جلوگیری از رها شدن دوره‌ها و فراموشی جلسات طراحی شده است تا مسیر رشد فردی شما بدون وقفه ادامه یابد.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleTestSms}
                                className="rounded-xl bg-[#D6F39A] px-4 py-2.5 text-xs font-black text-[#123E30] transition hover:brightness-105"
                            >
                                ارسال پیامک تست آنی
                            </button>
                            <Link
                                href="/mobile-app?screen=reminders"
                                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-black text-white"
                            >
                                مشاهده در اپلیکیشن
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Active Smart Reminders Synced with App */}
                <section className="rounded-3xl border border-white/80 bg-white/85 p-6 shadow-soft space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-base font-black text-navy">
                            یادآورهای فعال من ({formatNumber(reminders.filter((r) => r.enabled).length)} فعال)
                        </h3>
                        <form onSubmit={handleAddReminder} className="flex flex-wrap items-center gap-2">
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="عنوان یادآور جدید..."
                                className="rounded-xl border border-navy/15 bg-white px-3.5 py-2 text-xs text-navy outline-none focus:border-brand-500"
                            />
                            <input
                                type="text"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                placeholder="ساعت (۱۸:۳۰)"
                                className="w-24 rounded-xl border border-navy/15 bg-white px-3 py-2 text-xs text-navy outline-none focus:border-brand-500"
                            />
                            <button
                                type="submit"
                                className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-black text-white"
                            >
                                + افزودن یادآور
                            </button>
                        </form>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {reminders.map((rem) => (
                            <div
                                key={rem.id}
                                onClick={() =>
                                    updateAppState((prev) => ({
                                        ...prev,
                                        reminders: prev.reminders.map((r) =>
                                            r.id === rem.id ? { ...r, enabled: !r.enabled } : r
                                        ),
                                    }))
                                }
                                className="flex cursor-pointer items-center justify-between rounded-2xl border border-navy/10 bg-[#fafbf7] p-4 transition hover:border-brand-300"
                            >
                                <div>
                                    <div className="text-sm font-black text-navy">{rem.title}</div>
                                    <div className="mt-1 text-xs text-navy/55">
                                        ساعت {rem.time} · {rem.days}
                                    </div>
                                </div>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-black ${
                                        rem.enabled
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-navy/5 text-navy/50'
                                    }`}
                                >
                                    {rem.enabled ? 'فعال' : 'غیرفعال'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

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
                            {formatNumber(reminderLogs.length)} مورد ارسال موفق
                        </span>
                    </div>

                    <div className="mt-5 space-y-3">
                        {reminderLogs.map((log) => (
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
                                            <span>زمان ارسال: {log.sentAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-black text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                        تحویل به مخابرات (موفق)
                                    </span>
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
