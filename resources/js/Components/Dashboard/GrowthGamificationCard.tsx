import { Flame, Sparkles, Award, Zap, Trophy, Star } from 'lucide-react';
import { formatNumber } from '@/lib/format';

interface Badge {
    id: number;
    title: string;
    desc: string;
    icon: string;
    unlocked: boolean;
}

const BADGES: Badge[] = [
    { id: 1, title: 'آغازگر مسیر', desc: 'تکمیل فرم شناخت و هدف‌گذاری اولیه', icon: '🚀', unlocked: true },
    { id: 2, title: 'کاشف استعداد', desc: 'پاسخ به تمام سوالات آزمون گاردنر', icon: '🧠', unlocked: true },
    { id: 3, title: 'تمرکز ۳ روزه', desc: 'سه روز متوالی حضور و یادگیری در پنل', icon: '🔥', unlocked: true },
    { id: 4, title: 'فاتح کارگاه', desc: 'ارسال اولین تکلیف عملی دوره', icon: '🎯', unlocked: false },
];

export default function GrowthGamificationCard() {
    return (
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur-xl md:p-7 dark:border-white/10 dark:bg-[#0f241a]/90">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Metric 1: Streak */}
                <div className="flex items-center gap-4 rounded-2xl border border-amber-200/80 bg-gradient-to-l from-amber-50 to-orange-50 p-4 dark:border-amber-400/20 dark:from-amber-500/15 dark:to-orange-500/10">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 text-xl">
                        🔥
                    </span>
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-200">
                            <span>استریک یادگیری</span>
                        </div>
                        <strong className="text-2xl font-black text-amber-950 dark:text-white">
                            ۳ روز متوالی
                        </strong>
                        <p className="text-[0.68rem] text-amber-800/70 dark:text-amber-300/70">
                            برای دریافت نشان ۴ روزه، فردا هم سر بزنید!
                        </p>
                    </div>
                </div>

                {/* Metric 2: Growth Points */}
                <div className="flex items-center gap-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-l from-emerald-50 to-teal-50 p-4 dark:border-emerald-400/20 dark:from-emerald-500/15 dark:to-teal-500/10">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 text-xl">
                        ⚡
                    </span>
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-200">
                            <span>امتیاز رشد فردی</span>
                        </div>
                        <strong className="text-2xl font-black text-emerald-950 dark:text-white">
                            ۶۵۰ XP
                        </strong>
                        <p className="text-[0.68rem] text-emerald-800/70 dark:text-emerald-300/70">
                            سطح ۲: دانش‌آموز پیشرو و متمرکز
                        </p>
                    </div>
                </div>

                {/* Metric 3: Badges */}
                <div className="flex flex-col justify-between rounded-2xl border border-navy/5 bg-soft-gray/50 p-4 sm:col-span-2 lg:col-span-1 dark:border-white/5 dark:bg-white/[0.02]">
                    <div className="flex items-center justify-between text-xs font-bold text-navy/60 dark:text-white/60">
                        <span>نشان‌های افتخار من</span>
                        <span className="font-black text-brand-700 dark:text-brand-300">۳ از ۴</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        {BADGES.map((b) => (
                            <div
                                key={b.id}
                                title={`${b.title}: ${b.desc}`}
                                className={`flex size-10 items-center justify-center rounded-xl text-lg transition-transform hover:scale-110 ${
                                    b.unlocked
                                        ? 'bg-white shadow-sm ring-1 ring-navy/5 dark:bg-white/10 dark:ring-white/10'
                                        : 'bg-navy/5 grayscale opacity-40 dark:bg-white/5'
                                }`}
                            >
                                {b.icon}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
