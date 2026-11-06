import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, ExternalLink, HeartHandshake, Radio, Smartphone, Video } from 'lucide-react';
import type { ReactNode } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatDate, formatDuration } from '@/lib/format';
import type { PageProps } from '@/types';

interface Session {
    id: number;
    title?: string | null;
    scheduled_at?: string | null;
    duration_minutes: number;
    status: string;
    meeting_link?: string | null;
    platform?: string | null;
    platform_label?: string | null;
    room_code?: string | null;
    coach?: string | null;
    can_cancel?: boolean;
}

const statusLabels: Record<string, string> = {
    pending: 'در انتظار تأیید',
    confirmed: 'تأیید شده و آماده ورود',
};

export default function DashboardSessions() {
    const { sessions = [] } = usePage<PageProps & { sessions: Session[] }>().props;

    return (
        <UserDashboardLayout>
            <div className="mx-auto flex max-w-5xl flex-col gap-7">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="dashboard-eyebrow">
                            <span /> همراهی تخصصی و کلاس‌های زنده
                        </span>
                        <h2 className="mt-2 text-2xl font-black text-navy dark:text-white">
                            جلسات کوچینگ و وبینارهای آنلاین من
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-navy/60 dark:text-white/60">
                            جلسه‌های کوچینگ فردی و لینک مستقیم ورود به کلاس‌های آنلاین (اسکای‌روم، گوگل میت و ادوبی کانکت) که با اپلیکیشن همگام‌سازی شده‌اند.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href="/downloads/markaz.apk"
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-black text-emerald-700 transition hover:bg-emerald-500/20 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                        >
                            <Smartphone className="size-4" />
                            باز کردن درگاه کلاس در اپلیکیشن
                        </Link>
                        <Link
                            href="/coaching"
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-black text-white shadow-glow hover:bg-brand-600"
                        >
                            رزرو جلسه کوچینگ جدید
                            <ArrowLeft className="size-4" />
                        </Link>
                    </div>
                </header>

                <section className="flex flex-col gap-4">
                    {sessions.length > 0 ? (
                        sessions.map((session) => (
                            <article
                                key={session.id}
                                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-navy/8 bg-white/90 p-5 shadow-soft transition hover:border-brand-500/40 dark:border-white/10 dark:bg-[#10261d]/90"
                            >
                                <div className="flex min-w-0 flex-1 items-start gap-4">
                                    <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-1 ring-emerald-500/25 dark:from-emerald-400/20 dark:to-teal-500/10 dark:text-emerald-300">
                                        <Video className="size-6" />
                                        <span className="mt-1 text-[0.6rem] font-black">آنلاین</span>
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[0.65rem] font-black text-red-600 dark:bg-red-500/20 dark:text-red-300">
                                                <Radio className="size-3 animate-pulse" />
                                                همگام با اپلیکیشن
                                            </span>
                                            {session.platform_label && (
                                                <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[0.65rem] font-black text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                                                    پلتفرم: {session.platform_label}
                                                </span>
                                            )}
                                            {session.room_code && (
                                                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                                    کد اتاق: {session.room_code}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mt-2 text-base font-black text-navy dark:text-white">
                                            {session.title ?? `جلسه تخصصی با ${session.coach ?? 'دکتر علیرضا بیدی'}`}
                                        </h3>

                                        <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                            مدرس و راهبر: {session.coach ?? 'دکتر علیرضا بیدی'}
                                        </p>

                                        <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-bold text-navy/55 dark:text-white/60">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays className="size-3.5 text-brand-600 dark:text-brand-300" />
                                                {formatDate(session.scheduled_at)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock3 className="size-3.5 text-brand-600 dark:text-brand-300" />
                                                {formatDuration(session.duration_minutes)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-2 text-xs font-black text-brand-700 dark:bg-white/10 dark:text-emerald-300">
                                        <CheckCircle2 className="size-3.5" />
                                        {statusLabels[session.status] ?? session.status}
                                    </span>

                                    {session.meeting_link && (
                                        <a
                                            href={session.meeting_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition hover:brightness-110"
                                        >
                                            <span>ورود مستقیم به کلاس</span>
                                            <ExternalLink className="size-3.5" />
                                        </a>
                                    )}

                                    {session.can_cancel && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(`/dashboard/sessions/${session.id}/cancel`)
                                            }
                                            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 dark:bg-red-500/15 dark:text-red-300"
                                        >
                                            لغو جلسه
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-brand-200 bg-white/55 px-5 py-14 text-center dark:border-white/15 dark:bg-white/5">
                            <HeartHandshake className="mx-auto size-8 text-brand-500" />
                            <p className="mt-3 text-sm font-bold text-navy/50 dark:text-white/60">
                                هنوز جلسه‌ای برای شما رزرو نشده است.
                            </p>
                            <Link
                                href="/coaching"
                                className="mt-3 inline-flex items-center gap-1 text-xs font-black text-brand-700 dark:text-emerald-300"
                            >
                                مشاهده کوچ‌ها <ArrowLeft className="size-3.5" />
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </UserDashboardLayout>
    );
}

DashboardSessions.layout = (page: ReactNode) => page;
