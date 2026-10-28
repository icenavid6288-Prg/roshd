import { useState } from 'react';
import { Brain, Sparkles, Award, ArrowLeft, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { vibrate } from '@/lib/haptics';

interface IntelligenceMetric {
    title: string;
    score: number;
    highlight?: boolean;
}

const TALENTS: IntelligenceMetric[] = [
    { title: 'هوش فضایی و تجسمی', score: 94, highlight: true },
    { title: 'هوش درون‌فردی (خودآگاهی)', score: 88, highlight: true },
    { title: 'هوش کلامی و ارتباطی', score: 82 },
    { title: 'هوش منطقی و محاسباتی', score: 76 },
];

export default function TalentRadarSnapshot() {
    const [downloaded, setDownloaded] = useState(false);

    return (
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur-xl md:p-7 dark:border-white/10 dark:bg-[#0f241a]/90">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/5 pb-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-white/10 dark:text-amber-300">
                        <Brain className="size-5" />
                    </span>
                    <div>
                        <h3 className="text-sm font-black text-navy dark:text-white md:text-base">
                            کارنامه خلاصه استعدادیابی و هوش‌ها
                        </h3>
                        <span className="text-xs text-navy/45 dark:text-white/45">
                            تحلیل علمی آزمون هاوارد گاردنر + MBTI (تیپ: INTJ معماری)
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        vibrate();
                        setDownloaded(true);
                        setTimeout(() => setDownloaded(false), 3500);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50/70 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 dark:border-white/15 dark:bg-white/10 dark:text-brand-300"
                >
                    {downloaded ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <Download className="size-3.5" />}
                    {downloaded ? 'گزارش ۳۰ صفحه‌ای آماده دانلود شد' : 'دانلود گزارش کامل PDF'}
                </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {TALENTS.map((t) => (
                    <div
                        key={t.title}
                        className={`rounded-2xl p-4 transition-all ${
                            t.highlight
                                ? 'border border-amber-300/60 bg-amber-50/50 dark:border-amber-400/30 dark:bg-amber-500/10'
                                : 'border border-navy/5 bg-soft-gray/40 dark:border-white/5 dark:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className={t.highlight ? 'text-amber-900 font-black dark:text-amber-200' : 'text-navy/70 dark:text-white/70'}>
                                {t.title}
                            </span>
                            <span className="font-mono text-sm font-black text-brand-700 dark:text-brand-300">
                                {formatNumber(t.score)}٪
                            </span>
                        </div>
                        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-navy/10 dark:bg-white/10">
                            <div
                                className={`h-full rounded-full ${
                                    t.highlight
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-sm'
                                        : 'bg-brand-500'
                                }`}
                                style={{ width: `${t.score}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2 text-xs font-black text-brand-900 dark:text-white">
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span>توصیه هدایت شغلی:</span>
                    <span className="font-bold text-navy/70 dark:text-white/70">
                        رشته‌های مهندسی خلاق، طراحی معماری، فناوری اطلاعات و علوم تصمیم‌گیری
                    </span>
                </div>
                <span className="text-[0.68rem] font-bold text-brand-700 dark:text-brand-300">
                    تأییدشده توسط دکتر بیدی
                </span>
            </div>
        </div>
    );
}
