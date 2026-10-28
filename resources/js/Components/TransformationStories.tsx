import { useState } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { vibrate } from '@/lib/haptics';

interface Story {
    id: number;
    name: string;
    role: string;
    age: string;
    city: string;
    beforeState: string;
    afterState: string;
    quote: string;
    resultMetric: string;
    program: string;
}

const STORIES: Story[] = [
    {
        id: 1,
        name: 'سجاد محمدی',
        role: 'دانش‌آموز پایه دهم',
        age: '۱۶ ساله',
        city: 'تهران',
        beforeState: 'سردرگمی شدید بین ریاضی و انسانی و افت انگیزه تحصیلی به دلیل فشار اطرافیان',
        afterState: 'کشف هوش فضایی و تجسمی بالا در تست گاردنر؛ انتخاب باانگیزه رشته مهندسی معماری و افزایش معدل به ۱۹.۴',
        quote: 'همیشه فکر می‌کردم اگر پزشکی نخوانم شکست خورده‌ام. جلسه تحلیل اختصاصی با دکتر بیدی نگاهم را به زندگی تغییر داد و فهمیدم رسالت من کجاست.',
        resultMetric: 'رتبه ۱ استعدادیابی استانی',
        program: 'دوره جامع طراحی مسیر آینده + کوچینگ فردی',
    },
    {
        id: 2,
        name: 'خانم دکتر رضایی',
        role: 'مادر نیلوفر (دانش‌آموز کنکوری)',
        age: 'والدین',
        city: 'اصفهان',
        beforeState: 'استرس شدید کنکور، درگیری‌های مداوم خانوادگی بر سر ساعت مطالعه و بی‌هدفی',
        afterState: 'برنامه‌ریزی علمی بدون تنش، یادگیری مدیریت ذهن در آزمون، و قبولی در رشته هدف',
        quote: 'بزرگ‌ترین کمکی که مرکز دکتر بیدی به ما کرد، آرامش به خانه برگشتن بود. فرزندم به جای اضطراب، برای هدفش مشتاقانه تلاش می‌کرد.',
        resultMetric: 'قبولی دانشگاه تهران',
        program: 'بسته کوچینگ مدیریت اضطراب و هدایت تحصیلی',
    },
    {
        id: 3,
        name: 'امیرعلی صابری',
        role: 'فارغ‌التحصیل دوره کارآفرینی',
        age: '۱۷ ساله',
        city: 'مشهد',
        beforeState: 'علاقه‌مند به بیزینس اما بدون مهارت عملی و ترس شدید از صحبت در جمع و فروش',
        afterState: 'راه‌اندازی اولین فروشگاه آنلاین صنایع خلاق، اجرای اولین ارائه عمومی موفق در کارگاه',
        quote: 'در مدرسه هیچ‌وقت سواد مالی و ارتباطی به ما یاد ندادند. این دوره‌ها باعث شد در ۱۷ سالگی اولین درآمدم را به صورت مستقل کسب کنم.',
        resultMetric: 'راه‌اندازی اولین کسب‌وکار شخصی',
        program: 'کارگاه کوچینگ و مهارت‌های ارتباط موثر',
    },
];

export default function TransformationStories() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prev = () => {
        vibrate();
        setCurrentIndex((i) => (i === 0 ? STORIES.length - 1 : i - 1));
    };

    const next = () => {
        vibrate();
        setCurrentIndex((i) => (i === STORIES.length - 1 ? 0 : i + 1));
    };

    const story = STORIES[currentIndex];

    return (
        <section className="relative overflow-hidden bg-[#f4f8f5] py-16 text-navy dark:bg-[#061811] dark:text-white md:py-24">
            <div className="container-site relative z-10">
                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-black text-amber-600 dark:text-amber-400">
                            <Award className="size-4" />
                            داستان‌های تحول واقعی
                        </div>
                        <h2 className="mt-2 text-2xl font-black text-navy dark:text-white md:text-4xl">
                            قبل و بعد: تغییرات ماندگار در زندگی نوجوانان و خانواده‌ها
                        </h2>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={prev}
                            className="flex size-11 items-center justify-center rounded-2xl border border-navy/15 bg-white text-navy shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-emerald-400 dark:hover:bg-emerald-500/20"
                            aria-label="داستان قبلی"
                        >
                            <ArrowRight className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="flex size-11 items-center justify-center rounded-2xl border border-navy/15 bg-white text-navy shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-emerald-400 dark:hover:bg-emerald-500/20"
                            aria-label="داستان بعدی"
                        >
                            <ArrowLeft className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Main Transformation Spotlight Card */}
                <div className="mt-10 overflow-hidden rounded-[2.5rem] border border-navy/10 bg-white p-8 shadow-soft dark:border-white/10 dark:bg-gradient-to-br dark:from-white/[0.06] dark:to-white/[0.02] md:p-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                        {/* Quote & Info (7 cols) */}
                        <div className="flex flex-col gap-6 lg:col-span-7">
                            <div className="flex items-center gap-3">
                                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 font-black text-slate-950 shadow-sm">
                                    {story.name.slice(0, 1)}
                                </span>
                                <div>
                                    <h3 className="text-lg font-black text-navy dark:text-white md:text-xl">{story.name}</h3>
                                    <p className="text-xs font-bold text-navy/60 dark:text-white/50">{story.role} · {story.city}</p>
                                </div>
                                <div className="mr-auto flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            </div>

                            <blockquote className="relative text-base font-bold leading-9 text-navy/90 dark:text-emerald-50/90 md:text-lg">
                                <Quote className="absolute -right-4 -top-3 size-8 -scale-x-100 text-navy/10 dark:text-white/10" />
                                «{story.quote}»
                            </blockquote>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <span className="rounded-xl border border-brand-300 bg-brand-50 px-3.5 py-1.5 text-xs font-black text-brand-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    {story.program}
                                </span>
                                <span className="rounded-xl bg-amber-100 px-3.5 py-1.5 text-xs font-black text-amber-900 dark:bg-amber-400/15 dark:text-amber-300">
                                    {story.resultMetric}
                                </span>
                            </div>
                        </div>

                        {/* Before / After Comparison Column (5 cols) */}
                        <div className="flex flex-col gap-4 rounded-3xl border border-navy/10 bg-[#f8fbf9] p-6 dark:border-white/10 dark:bg-[#071913]/90 lg:col-span-5">
                            {/* Before Box */}
                            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs dark:border-red-500/20 dark:bg-red-500/10">
                                <span className="font-black text-red-700 dark:text-red-400">وضعیت قبل از همراهی:</span>
                                <p className="mt-1.5 leading-6 text-navy/80 dark:text-white/75">{story.beforeState}</p>
                            </div>

                            {/* After Box */}
                            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-4 text-xs dark:border-emerald-400/30 dark:bg-emerald-500/10">
                                <span className="flex items-center gap-1.5 font-black text-emerald-800 dark:text-emerald-300">
                                    <CheckCircle2 className="size-4" /> وضعیت پس از ارزیابی و کوچینگ:
                                </span>
                                <p className="mt-1.5 leading-6 text-navy dark:text-white/90">{story.afterState}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story Indicators */}
                <div className="mt-6 flex justify-center gap-2">
                    {STORIES.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                vibrate();
                                setCurrentIndex(idx);
                            }}
                            className={`h-2 rounded-full transition-all ${
                                currentIndex === idx ? 'w-8 bg-brand-600 dark:bg-emerald-400' : 'w-2 bg-navy/20 dark:bg-white/20'
                            }`}
                            aria-label={`رفتن به داستان ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
