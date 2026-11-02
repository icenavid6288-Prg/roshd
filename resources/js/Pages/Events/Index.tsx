import { Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, Clock3, ExternalLink, MapPin, PlayCircle, Radio, Smartphone, Users, Video } from 'lucide-react';
import type { ReactNode } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps } from '@/types';
import { formatDate, formatNumber } from '@/lib/format';

interface EventItem {
    id: number;
    title: string;
    slug: string;
    type: string;
    summary?: string;
    poster?: string;
    live_url?: string | null;
    platform?: string;
    platformLabel?: string;
    roomCode?: string;
    accessHint?: string;
    status?: 'live' | 'upcoming' | 'recorded';
    participantsCount?: number;
    isVipOnly?: boolean;
    event_date?: string;
    duration_minutes?: number;
    location?: string;
    speaker?: string;
}

export default function EventsIndex() {
    const { events, filters } = usePage<
        PageProps & {
            events: { data: EventItem[]; links: unknown[]; total: number };
            filters: { type: string };
        }
    >().props;

    return (
        <div className="min-h-screen bg-[#fafbf7] transition-colors dark:bg-[#061811]">
            <section className="relative overflow-hidden bg-gradient-to-b from-[#071f17] via-[#061811] to-[#09241a] px-4 pb-16 pt-32 text-white">
                <div className="pointer-events-none absolute -right-32 top-0 size-96 rounded-full bg-emerald-500/15 blur-[110px]" />
                <div className="container-site relative z-10 flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-black text-emerald-300">
                            <Video className="size-3.5" />
                            درگاه یکپارچه وبینارها و کلاس‌های آنلاین (همگام با سوپراپ)
                        </span>
                        <h1 className="mt-4 text-3xl font-black md:text-5xl">
                            وبینارها، کلاس‌های آنلاین و سمینارها
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-8 text-emerald-100/75">
                            ورود مستقیم به اتاق‌های اسکای‌روم (Skyroom)، گوگل میت (Google Meet) و ادوبی کانکت (Adobe Connect) بدون نیاز به نصب برنامه اضافه، هم از طریق سایت و هم از داخل اپلیکیشن رشد.
                        </p>
                    </div>
                    <Link
                        href="/mobile-app?screen=sessions"
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#D6F39A] px-5 py-3 text-xs font-black text-[#123E30] shadow-lg transition hover:brightness-105"
                    >
                        <Smartphone className="size-4" />
                        <span>ورود به اتاق وبینار در اپلیکیشن</span>
                    </Link>
                </div>
            </section>

            <main className="container-site py-12">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => router.get('/events')}
                            className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                                !filters.type
                                    ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950'
                                    : 'bg-white text-navy/70 ring-1 ring-navy/10 hover:bg-emerald-50 dark:bg-white/5 dark:text-white/70 dark:ring-white/10'
                            }`}
                        >
                            همه رویدادها ({formatNumber(events.data.length)})
                        </button>
                        <button
                            type="button"
                            onClick={() => router.get('/events?type=webinar')}
                            className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                                filters.type === 'webinar'
                                    ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950'
                                    : 'bg-white text-navy/70 ring-1 ring-navy/10 hover:bg-emerald-50 dark:bg-white/5 dark:text-white/70 dark:ring-white/10'
                            }`}
                        >
                            وبینارها و کلاس‌های زنده
                        </button>
                        <button
                            type="button"
                            onClick={() => router.get('/events?type=seminar')}
                            className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                                filters.type === 'seminar'
                                    ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950'
                                    : 'bg-white text-navy/70 ring-1 ring-navy/10 hover:bg-emerald-50 dark:bg-white/5 dark:text-white/70 dark:ring-white/10'
                            }`}
                        >
                            سمینارها و کارگاه‌ها
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {events.data.map((event) => (
                        <article
                            key={event.id}
                            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lift dark:border-white/10 dark:bg-[#0d221a]"
                        >
                            <div>
                                <div className="relative aspect-[16/8] bg-emerald-950">
                                    {event.poster ? (
                                        <img src={event.poster} alt={event.title} className="size-full object-cover" />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-emerald-400">
                                            <PlayCircle className="size-14" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                                    <div className="absolute right-3 top-3 flex flex-wrap items-center gap-1.5">
                                        <span className="rounded-full bg-emerald-900/90 px-3 py-1 text-xs font-black text-white backdrop-blur-md">
                                            {event.type === 'webinar' ? 'وبینار آنلاین' : 'سمینار و کارگاه'}
                                        </span>
                                        {event.platformLabel && (
                                            <span className="rounded-full bg-sky-500/90 px-3 py-1 text-[0.68rem] font-black text-white backdrop-blur-md">
                                                {event.platformLabel}
                                            </span>
                                        )}
                                    </div>

                                    {event.status === 'live' ? (
                                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white shadow-lg">
                                            <Radio className="size-3.5 animate-pulse" />
                                            در حال برگزاری (زنده)
                                        </span>
                                    ) : event.live_url ? (
                                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[0.68rem] font-black text-white backdrop-blur-md">
                                            اتاق آنلاین فعال
                                        </span>
                                    ) : null}

                                    <div className="absolute bottom-3 right-3 left-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-white/90">
                                        <span>{event.speaker ?? 'دکتر علیرضا بیدی'}</span>
                                        {event.roomCode && (
                                            <span className="rounded-lg bg-black/50 px-2.5 py-1 font-mono text-[0.68rem] text-amber-300 backdrop-blur-sm">
                                                کد اتاق: {event.roomCode}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <Link href={`/events/${event.slug}`}>
                                        <h2 className="line-clamp-2 text-lg font-black text-navy transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                                            {event.title}
                                        </h2>
                                    </Link>
                                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-navy/65 dark:text-white/65">
                                        {event.summary}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-navy/55 dark:text-white/55">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                            {event.event_date ? formatDate(event.event_date) : 'پنج‌شنبه ۱۱ اردیبهشت'}
                                        </span>
                                        {event.duration_minutes ? (
                                            <span className="flex items-center gap-1">
                                                <Clock3 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                {formatNumber(event.duration_minutes)} دقیقه
                                            </span>
                                        ) : null}
                                        {event.location ? (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                {event.location}
                                            </span>
                                        ) : null}
                                        {event.participantsCount ? (
                                            <span className="flex items-center gap-1">
                                                <Users className="size-3.5 text-amber-500" />
                                                {formatNumber(event.participantsCount)} شرکت‌کننده
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-900/10 bg-[#f4f8f5]/60 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">
                                <Link
                                    href={`/events/${event.slug}`}
                                    className="text-xs font-black text-emerald-700 hover:underline dark:text-emerald-300"
                                >
                                    جزئیات و راهنمای ورود ←
                                </Link>
                                {event.live_url && (
                                    <a
                                        href={event.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:brightness-110"
                                    >
                                        <span>ورود مستقیم به کلاس</span>
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}

EventsIndex.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

