import { useState } from 'react';
import {
    Compass,
    Sparkles,
    CheckCircle2,
    Brain,
    Target,
    Award,
    TrendingUp,
    Users,
    ShieldCheck,
    Zap,
} from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { vibrate } from '@/lib/haptics';

interface IntelligenceMetric {
    label: string;
    score: number;
    highlight?: boolean;
}

const INTELLIGENCES: IntelligenceMetric[] = [
    { label: 'هوش فضایی و تجسمی', score: 94, highlight: true },
    { label: 'هوش درون‌فردی (خودآگاهی)', score: 88 },
    { label: 'هوش کلامی و زبانی', score: 82 },
    { label: 'هوش منطقی و محاسباتی', score: 76 },
];

export default function TalentCompassHeroVisual() {
    const [activeTab, setActiveTab] = useState<'radar' | 'roadmap'>('radar');

    return (
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Ambient Lighting Behind Visual */}
            <div className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-emerald-500/20 via-amber-400/15 to-transparent blur-2xl" />

            {/* Main Interactive Glassmorphic Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
                {/* Top Header of Card */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 font-black text-slate-950 shadow-md shadow-emerald-500/30">
                            <Compass className="size-6" />
                        </span>
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                                <Sparkles className="size-3.5" />
                                <span>سامانه هوشمند ارزیابی استعداد</span>
                            </div>
                            <span className="text-xs font-bold text-white/60">
                                مدل تلفیقی گاردنر + هالند + MBTI
                            </span>
                        </div>
                    </div>

                    <div className="flex rounded-xl bg-white/10 p-1 text-[0.68rem] font-bold">
                        <button
                            type="button"
                            onClick={() => {
                                vibrate();
                                setActiveTab('radar');
                            }}
                            className={`rounded-lg px-2.5 py-1 transition-all ${
                                activeTab === 'radar' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-white/70 hover:text-white'
                            }`}
                        >
                            کارنامه استعداد
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                vibrate();
                                setActiveTab('roadmap');
                            }}
                            className={`rounded-lg px-2.5 py-1 transition-all ${
                                activeTab === 'roadmap' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-white/70 hover:text-white'
                            }`}
                        >
                            نقشه رشد
                        </button>
                    </div>
                </div>

                {/* Tab 1: Talent Intelligence Radar */}
                {activeTab === 'radar' && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white/75">تحلیل هوش‌های ۸گانه هاوارد گاردنر:</span>
                            <span className="font-mono text-emerald-300">نمره کل: ۹۲ / ۱۰۰</span>
                        </div>

                        <div className="space-y-3">
                            {INTELLIGENCES.map((item) => (
                                <div key={item.label} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[0.72rem] font-bold">
                                        <span className={item.highlight ? 'text-amber-300 font-black' : 'text-white/80'}>
                                            {item.label}
                                        </span>
                                        <span className="font-mono text-white/50">{formatNumber(item.score)}٪</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${
                                                item.highlight
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_8px_#f59e0b]'
                                                    : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                            }`}
                                            style={{ width: `${item.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Top Match Tag */}
                        <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                            <div className="flex items-center gap-2">
                                <Zap className="size-4 text-amber-400" />
                                <span>پیشنهاد اولویت انتخاب رشته:</span>
                            </div>
                            <span className="font-black text-white">ریاضی و معماری / طراحی نوآورانه</span>
                        </div>
                    </div>
                )}

                {/* Tab 2: Roadmap Milestones */}
                {activeTab === 'roadmap' && (
                    <div className="mt-6 space-y-3">
                        {[
                            { step: '۱', title: 'آزمون علمی MBTI و گاردنر', status: 'تکمیل شده', done: true },
                            { step: '۲', title: 'جلسه ارزیابی تخصصی با دکتر بیدی', status: 'تکمیل شده', done: true },
                            { step: '۳', title: 'تدوین کارنامه جامع ۳۰ صفحه‌ای', status: 'آماده تحویل', done: true },
                            { step: '۴', title: 'کوچینگ ماهانه پیشرفت تحصیلی', status: 'در حال اجرا', done: false },
                        ].map((m) => (
                            <div
                                key={m.step}
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className={`flex size-6 items-center justify-center rounded-lg text-[0.7rem] font-black ${
                                        m.done ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-white'
                                    }`}>
                                        {m.step}
                                    </span>
                                    <span className="font-bold text-white/90">{m.title}</span>
                                </div>
                                <span className={`text-[0.68rem] font-black ${m.done ? 'text-emerald-400' : 'text-amber-300'}`}>
                                    {m.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Floating Social Trust Chips */}
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                    <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.04] p-3">
                        <Users className="size-4 text-emerald-400" />
                        <div>
                            <div className="text-xs font-black text-white">+۱٬۰۲۵ نفر</div>
                            <div className="text-[0.62rem] text-white/50">دانش‌آموز هدایت‌شده</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.04] p-3">
                        <ShieldCheck className="size-4 text-amber-300" />
                        <div>
                            <div className="text-xs font-black text-white">۹۷٪ رضایت</div>
                            <div className="text-[0.62rem] text-white/50">تضمین بازگشت وجه</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
