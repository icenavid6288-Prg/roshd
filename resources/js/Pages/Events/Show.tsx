import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Clock3, ExternalLink, MapPin, PlayCircle, Radio, ShoppingCart, Smartphone, Users, Video } from 'lucide-react';
import type { ReactNode } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps } from '@/types';
import { formatDate, formatNumber, formatPrice } from '@/lib/format';

interface EventData {
    id: number;
    slug: string;
    title: string;
    type: string;
    summary?: string;
    description?: string;
    poster?: string;
    live_url?: string | null;
    platformLabel?: string;
    roomCode?: string;
    accessHint?: string;
    participantsCount?: number;
    video_url?: string;
    video_path?: string;
    event_date?: string;
    duration_minutes?: number;
    location?: string;
    speaker?: string;
    price: number;
    discount_price?: number | null;
}

export default function EventShow() {
    const { event, has_access, auth } = usePage<PageProps & { event: EventData; has_access: boolean }>().props;
    const form = useForm({});
    const finalPrice = event.discount_price ?? event.price;
    const free = finalPrice === 0;
    const buy = () => form.post(`/events/${event.slug}/checkout`);

    return (
        <div className="min-h-screen bg-[#fafbf7] transition-colors dark:bg-[#061811]">
            <main className="container-site py-28 md:py-32">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:underline dark:text-emerald-300"
                    >
                        <ArrowRight className="size-4" /> بازگشت به وبینارها و کلاس‌های آنلاین
                    </Link>
                    <Link
                        href="/mobile-app?screen=sessions"
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-800 transition hover:bg-emerald-500/20 dark:border-emerald-400/30 dark:text-emerald-300"
                    >
                        <Smartphone className="size-4" />
                        مشاهده و ورود از طریق سوپراپلیکیشن موبایل
                    </Link>
                </div>

                <article className="mt-6 overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-lift dark:border-white/10 dark:bg-[#0d221a]">
                    <div className="grid lg:grid-cols-2">
                        <div className="relative aspect-video bg-emerald-950 lg:aspect-auto">
                            {event.poster ? (
                                <img src={event.poster} alt={event.title} className="size-full object-cover" />
                            ) : (
                                <div className="flex size-full items-center justify-center text-emerald-300">
                                    <PlayCircle className="size-20" />
                                </div>
                            )}
                        </div>

                        <div className="p-6 md:p-10">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
                                    {event.type === 'webinar' ? 'وبینار و کلاس آنلاین' : 'سمینار و کارگاه'}
                                </span>
                                {event.platformLabel && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-3 py-1 text-xs font-black text-sky-700 dark:text-sky-300">
                                        <Video className="size-3.5" />
                                        {event.platformLabel}
                                    </span>
                                )}
                                {event.roomCode && (
                                    <span className="rounded-full bg-amber-500/15 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                                        کد اتاق: {event.roomCode}
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-4 text-2xl font-black text-navy md:text-3xl dark:text-white">
                                {event.title}
                            </h1>

                            {event.summary && (
                                <p className="mt-4 text-sm leading-8 text-navy/65 dark:text-white/70">
                                    {event.summary}
                                </p>
                            )}

                            <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-navy/60 dark:text-white/60">
                                {event.event_date && (
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        {formatDate(event.event_date)}
                                    </span>
                                )}
                                {event.duration_minutes && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock3 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        {formatNumber(event.duration_minutes)} دقیقه
                                    </span>
                                )}
                                {event.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        {event.location}
                                    </span>
                                )}
                                {event.participantsCount && (
                                    <span className="flex items-center gap-1.5">
                                        <Users className="size-4 text-amber-500" />
                                        {formatNumber(event.participantsCount)} نفر ثبت‌نام‌شده
                                    </span>
                                )}
                            </div>

                            {event.speaker && (
                                <p className="mt-5 text-sm font-black text-emerald-700 dark:text-emerald-300">
                                    مدرس و سخنران: {event.speaker}
                                </p>
                            )}

                            {event.accessHint && (
                                <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs font-bold text-navy/75 dark:text-white/75">
                                    راهنمای ورود: {event.accessHint}
                                </div>
                            )}

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                {event.live_url && (
                                    <a
                                        href={event.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:brightness-110"
                                    >
                                        <Radio className="size-4 animate-pulse" />
                                        ورود مستقیم به اتاق کلاس آنلاین
                                        <ExternalLink className="size-4" />
                                    </a>
                                )}

                                {has_access || free ? (
                                    <span className="rounded-2xl bg-emerald-500/15 px-4 py-3.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
                                        {free ? 'شرکت در این وبینار رایگان است' : 'دسترسی شما به این کلاس فعال است'}
                                    </span>
                                ) : auth.user ? (
                                    <button
                                        type="button"
                                        onClick={buy}
                                        disabled={form.processing}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white"
                                    >
                                        <ShoppingCart className="size-4" /> خرید دسترسی · {formatPrice(finalPrice)}
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white"
                                    >
                                        ورود برای ثبت‌نام
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-emerald-900/10 p-6 md:p-10 dark:border-white/10">
                        <h2 className="text-xl font-black text-navy dark:text-white">درباره این وبینار و سرفصل‌ها</h2>
                        <p className="mt-4 whitespace-pre-line text-sm leading-8 text-navy/70 dark:text-white/70">
                            {event.description || event.summary}
                        </p>
                        {(has_access || free) && (event.video_url || event.video_path) && (
                            <div className="mt-8 overflow-hidden rounded-2xl bg-black">
                                <video
                                    controls
                                    className="aspect-video w-full"
                                    src={event.video_path || event.video_url}
                                    poster={event.poster}
                                >
                                    <track kind="captions" />
                                </video>
                            </div>
                        )}
                    </div>
                </article>
            </main>
        </div>
    );
}

EventShow.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

