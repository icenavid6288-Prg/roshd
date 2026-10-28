import { Link } from '@inertiajs/react';
import { Play, Calendar, Video, Clock, ArrowLeft, UserCheck, BookOpen, Sparkles } from 'lucide-react';
import { formatNumber, formatDuration } from '@/lib/format';
import { vibrate } from '@/lib/haptics';

interface NextActionProps {
    session?: {
        id: number;
        scheduled_at?: string | null;
        duration_minutes: number;
        coach?: string | null;
        status: string;
    } | null;
    course?: {
        id: number;
        title: string;
        slug: string;
        thumbnail?: string | null;
        progress_percent: number;
        duration_minutes: number;
    } | null;
}

export default function NextActionCoachingCard({ session, course }: NextActionProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Left/Card 1: Upcoming Coaching Session (7 cols) */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0c2b21] via-[#092219] to-[#061811] p-6 text-white shadow-soft lg:col-span-7">
                <div className="pointer-events-none absolute -left-12 -top-12 size-56 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 size-48 rounded-full bg-amber-400/10 blur-2xl" />

                <div className="relative z-10 flex flex-col justify-between h-full gap-5">
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                            <Video className="size-3.5 text-emerald-400 animate-pulse" />
                            جلسه کوچینگ پیش‌رو
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[0.68rem] font-bold text-amber-300">
                                تأیید شده · آنلاین
                            </span>
                            <Link
                                href="/dashboard/reminders"
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2 py-1 text-[0.65rem] font-black text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                                title="تنظیمات یادآوری خودکار پیامکی"
                            >
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>پیامک یادآوری ۱ ساعت قبل فعال</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 font-black text-slate-950 shadow-md">
                                د.ب
                            </span>
                            <div>
                                <h3 className="text-base font-black text-white md:text-lg">
                                    جلسه تحلیل استعدادیابی و هدایت تحصیلی
                                </h3>
                                <p className="text-xs font-bold text-emerald-200/80">
                                    کوچینگ اختصاصی با {session?.coach ?? 'دکتر علیرضا بیدی'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-white/70">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="size-4 text-emerald-400" />
                                <span>{session?.scheduled_at ?? 'پنج‌شنبه ۱۷ آبان · ساعت ۱۶:۰۰'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="size-4 text-amber-300" />
                                <span>مدت: {formatNumber(session?.duration_minutes ?? 60)} دقیقه</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Link
                            href="/dashboard/sessions"
                            onClick={() => vibrate()}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
                        >
                            <Video className="size-4" />
                            ورود به اتاق جلسه تصویری
                        </Link>

                        <Link
                            href="/dashboard/sessions"
                            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-white/10"
                        >
                            مشاهده دستور جلسه و آمادگی
                            <ArrowLeft className="size-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right/Card 2: Resume Last Course (5 cols) */}
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur-xl lg:col-span-5 dark:border-white/10 dark:bg-[#0f241a]/90">
                <div className="flex flex-col justify-between h-full gap-4">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs font-black text-brand-700 dark:text-brand-300">
                            <BookOpen className="size-4" />
                            ادامه یادگیری دوره فعال
                        </span>
                        <span className="text-xs font-black text-navy/40 dark:text-white/40">
                            {formatNumber(course?.progress_percent ?? 60)}٪ تکمیل
                        </span>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-navy dark:text-white md:text-base line-clamp-1">
                            {course?.title ?? 'طراحی مسیر آینده و کشف رسالت فردی نوجوانان'}
                        </h4>
                        <p className="mt-1 text-xs text-navy/50 dark:text-white/50">
                            درس جاری: فصل ۱ · خودشناسی و هوش‌های چندگانه گاردنر
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-soft-gray dark:bg-white/10">
                                <div
                                    className="h-full rounded-full bg-brand-500"
                                    style={{ width: `${course?.progress_percent ?? 60}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <Link
                            href={course ? `/courses/${course.slug}` : '/dashboard/courses'}
                            onClick={() => vibrate()}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3 text-xs font-black text-white shadow-glow transition-all hover:bg-brand-600 active:scale-[0.98]"
                        >
                            <Play className="size-3.5 fill-current" />
                            پخش ویدیو و ادامه درس
                        </Link>
                        <div className="flex items-center justify-between px-1 text-[0.68rem] text-navy/50 dark:text-white/50">
                            <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>یادآوری پیامکی استمرار: فردا ۱۸:۰۰</span>
                            </span>
                            <Link href="/dashboard/reminders" className="font-bold text-brand-700 hover:underline dark:text-brand-300">
                                تنظیمات یادآور
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
