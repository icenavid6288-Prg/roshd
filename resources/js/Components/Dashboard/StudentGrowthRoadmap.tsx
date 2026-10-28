import { CheckCircle2, Circle, Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { vibrate } from '@/lib/haptics';

interface Stage {
    id: number;
    title: string;
    subtitle: string;
    status: 'completed' | 'current' | 'upcoming';
    date?: string;
}

const STAGES: Stage[] = [
    {
        id: 1,
        title: 'خودشناسی و MBTI',
        subtitle: 'آزمون تیپ شخصیتی و ارزش‌های فردی',
        status: 'completed',
        date: 'تکمیل شده',
    },
    {
        id: 2,
        title: 'استعدادیابی گاردنر',
        subtitle: 'تحلیل هوش‌های چندگانه و کارنامه ۳۰ صفحه‌ای',
        status: 'completed',
        date: 'نمره ۹۲ / ۱۰۰',
    },
    {
        id: 3,
        title: 'جلسه ارزیابی با دکتر بیدی',
        subtitle: 'جلسه تحلیل ۹۰ دقیقه‌ای اختصاصی با خانواده',
        status: 'current',
        date: 'در حال هماهنگی',
    },
    {
        id: 4,
        title: 'هدایت تحصیلی و مهارتی',
        subtitle: 'انتخاب رشته هوشمندانه و تقویت فن بیان',
        status: 'upcoming',
        date: 'گام بعدی',
    },
    {
        id: 5,
        title: 'استقلال و رسالت فردی',
        subtitle: 'شروع پروژه‌های واقعی و ورود مطمئن به آینده',
        status: 'upcoming',
        date: 'هدف نهایی',
    },
];

export default function StudentGrowthRoadmap() {
    const completedCount = STAGES.filter((s) => s.status === 'completed').length;
    const progressPercent = Math.round((completedCount / STAGES.length) * 100);

    return (
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-[#0f241a]/90">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/5 pb-5 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-300">
                        <Trophy className="size-6" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-black text-navy dark:text-white md:text-lg">
                                نقشه سفر رشد و رسالت فردی
                            </h2>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.68rem] font-black text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/30">
                                مرحله ۳ از ۵
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-navy/50 dark:text-white/50">
                            مسیر اختصاصی طراحی‌شده بر اساس نتایج استعدادیابی و اهداف شخصی شما
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-left">
                        <span className="block text-xs font-bold text-navy/40 dark:text-white/40">پیشرفت پرونده</span>
                        <strong className="text-lg font-black text-brand-600 dark:text-brand-300">{formatNumber(progressPercent)}٪</strong>
                    </div>
                    <div className="h-10 w-24 overflow-hidden rounded-full bg-navy/5 p-1 dark:bg-white/10">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 shadow-sm"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline Steps */}
            <div className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {STAGES.map((stage) => {
                        const isDone = stage.status === 'completed';
                        const isCurrent = stage.status === 'current';

                        return (
                            <div
                                key={stage.id}
                                className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all ${
                                    isCurrent
                                        ? 'border-2 border-brand-500 bg-brand-50/50 shadow-md ring-4 ring-brand-100/50 dark:border-brand-400 dark:bg-brand-500/10 dark:ring-brand-500/10'
                                        : isDone
                                        ? 'border border-emerald-200 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/5'
                                        : 'border border-navy/5 bg-soft-gray/50 opacity-60 dark:border-white/5 dark:bg-white/[0.02]'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className={`flex size-7 items-center justify-center rounded-xl text-xs font-black ${
                                            isDone
                                                ? 'bg-emerald-500 text-white'
                                                : isCurrent
                                                ? 'bg-brand-600 text-white animate-pulse'
                                                : 'bg-navy/10 text-navy/50 dark:bg-white/10 dark:text-white/40'
                                        }`}>
                                            {isDone ? <CheckCircle2 className="size-4" /> : formatNumber(stage.id)}
                                        </span>
                                        <span className={`text-[0.65rem] font-bold ${
                                            isDone
                                                ? 'text-emerald-700 dark:text-emerald-300'
                                                : isCurrent
                                                ? 'font-black text-brand-700 dark:text-brand-300'
                                                : 'text-navy/40 dark:text-white/30'
                                        }`}>
                                            {stage.date}
                                        </span>
                                    </div>

                                    <h3 className={`mt-3 text-xs font-black ${
                                        isCurrent ? 'text-brand-900 dark:text-white text-sm' : 'text-navy dark:text-white'
                                    }`}>
                                        {stage.title}
                                    </h3>
                                    <p className="mt-1 text-[0.68rem] leading-5 text-navy/55 dark:text-white/55">
                                        {stage.subtitle}
                                    </p>
                                </div>

                                {isCurrent && (
                                    <div className="mt-3 flex items-center gap-1 text-[0.65rem] font-black text-brand-700 dark:text-brand-300">
                                        <span>اقدام جاری شما</span>
                                        <ArrowLeft className="size-3" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
