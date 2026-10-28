import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Compass,
    Sparkles,
    CheckCircle2,
    ArrowLeft,
    GraduationCap,
    TrendingUp,
    Brain,
    Rocket,
    Clock,
    UserCheck,
    RotateCcw,
} from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { vibrate } from '@/lib/haptics';

interface StageOption {
    id: string;
    title: string;
    subtitle: string;
    icon: typeof GraduationCap;
}

interface GoalOption {
    id: string;
    title: string;
    desc: string;
    badge: string;
}

const STAGES: StageOption[] = [
    {
        id: 'middle',
        title: 'متوسطه اول (هفتم تا نهم)',
        subtitle: 'کشف استعدادهای پنهان و آمادگی برای انتخاب رشته هوشمندانه',
        icon: Brain,
    },
    {
        id: 'high',
        title: 'متوسطه دوم (دهم و یازدهم)',
        subtitle: 'تثبیت علاقه، برنامه‌ریزی هدفمند و تقویت مهارت‌های فردی',
        icon: Compass,
    },
    {
        id: 'senior',
        title: 'سال کنکور و دوازدهم',
        subtitle: 'مدیریت استرس، انتخاب رشته دانشگاهی و ترسیم چشم‌انداز آینده',
        icon: TrendingUp,
    },
    {
        id: 'youth',
        title: 'دانشجو و ورود به بازار کار',
        subtitle: 'راه‌اندازی کسب‌وکار نوپا، برندسازی فردی و استقلال مالی',
        icon: Rocket,
    },
];

const GOALS: Record<string, GoalOption[]> = {
    middle: [
        { id: 'major-selection', title: 'انتخاب رشته نهم به دهم بدون پشیمانی', desc: 'تحلیل دقیق هوش‌های گاردنر و تطبیق با رشته‌های دبیرستان و هنرستان', badge: 'اولویت بالا' },
        { id: 'talent-discovery', title: 'کشف رسالت و تیپ شخصیتی MBTI', desc: 'شناخت نقاط قوت واقعی و هوش غالب برای تصمیم‌گیری آگاهانه', badge: 'بنیادین' },
        { id: 'confidence', title: 'تقویت فن بیان، اعتماد‌به‌نفس و عزت‌نفس', desc: 'ارتباط موثر در جمع همسالان و مدرسه با تمرین‌های عملی', badge: 'مهارتی' },
    ],
    high: [
        { id: 'career-map', title: 'طراحی نقشه راه شغلی ۱۰ ساله', desc: 'شناخت مشاغل دنیای جدید، هوش مصنوعی و جایگاه آینده شغلی', badge: 'استراتژیک' },
        { id: 'focus-motivation', title: 'مدیریت زمان، تمرکز و رفع اهمال‌کاری', desc: 'تبدیل اهداف بزرگ به گام‌های هفتگی بدون فرسودگی تحصیلی', badge: 'عملکردی' },
        { id: 'entrepreneurship', title: 'آموزش تفکر ثروت‌آفرین و بیزینس نوجوان', desc: 'یادگیری مبانی کارآفرینی، فروش و تولید ارزش واقعی', badge: 'کاربردی' },
    ],
    senior: [
        { id: 'university-match', title: 'انتخاب رشته تخصصی دانشگاه', desc: 'تحلیل جامع رشته‌ها، بازار کار ایران و جهان و آینده هر شغل', badge: 'سرنوشت‌ساز' },
        { id: 'exam-coaching', title: 'کوچینگ مدیریت استرس و ذهنیت برنده', desc: 'همراهی هفتگی تا روز آزمون و تسلط بر اضطراب ناشی از کنکور', badge: 'پشتیبانی' },
    ],
    youth: [
        { id: 'startup-launch', title: 'شروع اولین استارتاپ یا پروژه فریلنسری', desc: 'از ایده تا مشتری اول با هدایت و متدهای منتورینگ دکتر بیدی', badge: 'شتاب‌دهی' },
        { id: 'personal-branding', title: 'ساخت برند شخصی و مهارت مذاکره', desc: 'ارائه حرفه‌ای توانمندی‌ها و ورود به موقعیت‌های شغلی ارزشمند', badge: 'حرفه‌ای' },
    ],
};

const ROADMAP_RESULTS: Record<string, {
    title: string;
    programName: string;
    timeline: string;
    sessions: string;
    outcomes: string[];
    suggestedCourseSlug: string;
}> = {
    'middle:major-selection': {
        title: 'بسته جامع هدایت تحصیلی و استعدادیابی نهم به دهم',
        programName: 'دوره جامع طراحی مسیر آینده + تست هوش‌های چندگانه',
        timeline: '۴ هفته فشرده + آزمون',
        sessions: '۳ جلسه ارزیابی تخصصی + تحلیل با والدین',
        outcomes: [
            'شناسایی دقیق ۳ رشته اولویت‌دار متناسب با تیپ شخصیتی',
            'دریافت کارنامه تحلیلی ۳۰ صفحه‌ای استعدادیابی گاردنر',
            'جلسه مشاوره اختصاصی ۶۰ دقیقه‌ای با دکتر بیدی',
            'پایان سردرگمی بین رشته‌های تجربی، ریاضی و انسانی',
        ],
        suggestedCourseSlug: 'future-path-design',
    },
    'middle:talent-discovery': {
        title: 'پکیج طلایی کشف رسالت فردی و خودشناسی نوجوان',
        programName: 'کارگاه تعاملی کشف هوش‌های غالب و خودآگاهی',
        timeline: '۳ هفته تعاملی',
        sessions: '۲ جلسه تحلیل فردی + کارگاه گروهی',
        outcomes: [
            'کشف ارزش‌های بنیادین و علایق واقعی خارج از فشار اطرافیان',
            'شناخت نقاط ضعف و تبدیل آن‌ها به فرصت‌های یادگیری',
            'ترسیم ماتریس مهارت‌های مورد نیاز آینده',
        ],
        suggestedCourseSlug: 'future-path-design',
    },
    'middle:confidence': {
        title: 'بوت‌کمپ فن بیان و اعتماد‌به‌نفس نوجوانان پیشرو',
        programName: 'کارگاه کوچینگ و مهارت‌های ارتباط موثر نوجوان',
        timeline: '۶ هفته کارگاهی',
        sessions: '۶ جلسه تمرین عملی و ضبط استودیویی',
        outcomes: [
            'غلبه کامل بر استرس صحبت در جمع و کلاس درس',
            'یادگیری زبان بدن، فن بیان و مدیریت هیجانات فردی',
            'کسب عزت‌نفس پایدار در محیط‌های اجتماعی و مدرسه',
        ],
        suggestedCourseSlug: 'teen-communication-skills',
    },
    default: {
        title: 'برنامه اختصاصی کوچینگ فردی و توسعه مهارت‌های آینده',
        programName: 'جلسات ارزیابی جامع + همراهی منتور ارشد',
        timeline: '۳۰ روز ارزیابی و اقدام',
        sessions: 'جلسه اختصاصی ۱ به ۱ + تست‌های استاندارد',
        outcomes: [
            'تدوین پرونده رشد شخصی بر اساس متدهای بین‌المللی',
            'جلسه آنلاین یا حضوری با دکتر بیدی و خانواده',
            'دسترسی رایگان به پادکست‌ها و کارگاه‌های مکمل',
        ],
        suggestedCourseSlug: 'future-path-design',
    },
};

export default function FuturePathFinder() {
    const [selectedStage, setSelectedStage] = useState<string>('middle');
    const [selectedGoal, setSelectedGoal] = useState<string>('major-selection');

    const goalsList = GOALS[selectedStage] || GOALS.middle;
    const currentGoal = goalsList.find((g) => g.id === selectedGoal) ? selectedGoal : goalsList[0]?.id;
    const resultKey = `${selectedStage}:${currentGoal}`;
    const result = ROADMAP_RESULTS[resultKey] || ROADMAP_RESULTS.default;

    const handleStageSelect = (stageId: string) => {
        vibrate();
        setSelectedStage(stageId);
        const nextGoals = GOALS[stageId] || [];
        if (nextGoals.length > 0) {
            setSelectedGoal(nextGoals[0].id);
        }
    };

    const handleGoalSelect = (goalId: string) => {
        vibrate();
        setSelectedGoal(goalId);
    };

    return (
        <section id="future-path-finder" className="relative overflow-hidden bg-[#f4f8f5] py-16 text-navy dark:bg-[#061811] dark:text-white md:py-24">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -right-32 top-10 size-96 rounded-full bg-emerald-500/10 blur-[100px]" aria-hidden />
            <div className="pointer-events-none absolute -left-32 bottom-10 size-96 rounded-full bg-amber-500/10 blur-[100px]" aria-hidden />

            <div className="container-site relative z-10">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-50 px-4 py-1.5 text-xs font-black text-brand-700 backdrop-blur-md dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <Sparkles className="size-3.5 text-amber-500 dark:text-amber-400" />
                        ابزار هوشمند ترسیم نقشه راه
                    </div>
                    <h2 className="mt-4 text-3xl font-black leading-tight text-navy dark:text-white md:text-5xl">
                        مسیر اختصاصی فرزندتان را در <span className="text-brand-600 dark:bg-gradient-to-l dark:from-amber-300 dark:via-emerald-300 dark:to-white dark:bg-clip-text dark:text-transparent">۳۰ ثانیه</span> کشف کنید
                    </h2>
                    <p className="mt-4 text-sm leading-8 text-navy/70 dark:text-emerald-100/70 md:text-base">
                        پایه تحصیلی و دغدغه اصلی را انتخاب کنید تا برنامه علمی متناسب با ویژگی‌های شخصیتی فرزندتان را مشاهده نمایید.
                    </p>
                </div>

                {/* Interactive Finder Grid */}
                <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
                    {/* Left: Steps & Choices (7 cols) */}
                    <div className="flex flex-col gap-8 lg:col-span-7">
                        {/* Step 1: Grade Selection */}
                        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] md:p-8">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2.5 text-xs font-black text-amber-700 dark:text-amber-400">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-[0.7rem] font-black text-amber-800 dark:bg-amber-400/20 dark:text-amber-300">۱</span>
                                    مرحله اول: پایه یا مقطع تحصیلی
                                </span>
                                <span className="text-xs font-bold text-navy/50 dark:text-white/40">انتخاب یک مورد</span>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {STAGES.map((stage) => {
                                    const Icon = stage.icon;
                                    const isActive = selectedStage === stage.id;
                                    return (
                                        <button
                                            key={stage.id}
                                            type="button"
                                            onClick={() => handleStageSelect(stage.id)}
                                            className={`group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-right transition-all duration-200 ${
                                                isActive
                                                    ? 'border-brand-500 bg-brand-50 shadow-sm ring-1 ring-brand-500/40 dark:border-emerald-400/60 dark:bg-emerald-500/15 dark:shadow-[0_0_24px_rgba(45,154,108,0.25)] dark:ring-emerald-400/50'
                                                    : 'border-navy/10 bg-[#f8fbf9] hover:border-brand-300 hover:bg-brand-50/40 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.06]'
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <span className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                                                    isActive
                                                        ? 'bg-brand-600 text-white font-black dark:bg-emerald-400 dark:text-slate-950'
                                                        : 'bg-brand-100 text-brand-700 dark:bg-white/10 dark:text-emerald-300'
                                                }`}>
                                                    <Icon className="size-4" />
                                                </span>
                                                {isActive && (
                                                    <span className="size-2 rounded-full bg-brand-600 dark:bg-emerald-400 dark:shadow-[0_0_8px_#34d399]" />
                                                )}
                                            </div>
                                            <span className={`text-sm font-black transition-colors ${isActive ? 'text-brand-900 dark:text-white' : 'text-navy dark:text-white/80'}`}>
                                                {stage.title}
                                            </span>
                                            <span className="text-[0.72rem] leading-5 text-navy/60 dark:text-white/50">
                                                {stage.subtitle}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step 2: Main Goal */}
                        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] md:p-8">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2.5 text-xs font-black text-brand-700 dark:text-emerald-300">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-brand-100 text-[0.7rem] font-black text-brand-800 dark:bg-emerald-400/20 dark:text-emerald-300">۲</span>
                                    مرحله دوم: مهم‌ترین نیاز و هدف فعلی
                                </span>
                                <span className="text-xs font-bold text-navy/50 dark:text-white/40">{goalsList.length} گزینه فعال</span>
                            </div>

                            <div className="mt-5 flex flex-col gap-3">
                                {goalsList.map((goal) => {
                                    const isActive = selectedGoal === goal.id;
                                    return (
                                        <button
                                            key={goal.id}
                                            type="button"
                                            onClick={() => handleGoalSelect(goal.id)}
                                            className={`group relative flex items-start justify-between gap-3 rounded-2xl border p-4 text-right transition-all duration-200 ${
                                                isActive
                                                    ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-1 ring-amber-400/50 dark:border-amber-400/60 dark:bg-amber-500/10 dark:shadow-[0_0_24px_rgba(245,158,11,0.2)]'
                                                    : 'border-navy/10 bg-[#f8fbf9] hover:border-amber-300 hover:bg-amber-50/30 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.06]'
                                            }`}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-black transition-colors ${isActive ? 'text-amber-950 dark:text-amber-200' : 'text-navy dark:text-white'}`}>
                                                        {goal.title}
                                                    </span>
                                                    <span className={`rounded-md px-2 py-0.5 text-[0.62rem] font-bold ${
                                                        isActive ? 'bg-amber-200/70 text-amber-900 dark:bg-amber-400/20 dark:text-amber-300' : 'bg-navy/5 text-navy/60 dark:bg-white/10 dark:text-white/50'
                                                    }`}>
                                                        {goal.badge}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs leading-6 text-navy/65 dark:text-white/60">
                                                    {goal.desc}
                                                </p>
                                            </div>
                                            <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border border-navy/20 dark:border-white/20">
                                                {isActive ? (
                                                    <div className="size-2.5 rounded-full bg-amber-500 dark:bg-amber-400 dark:shadow-[0_0_6px_#f59e0b]" />
                                                ) : null}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Instant Recommended Result Card (5 cols) */}
                    <div className="sticky top-28 lg:col-span-5">
                        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-b from-[#0d2a20] to-[#071913] p-6 shadow-2xl shadow-emerald-950/80 backdrop-blur-2xl md:p-8">
                            {/* Card Accent Top Bar */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-500" />
                            
                            <div className="flex items-center justify-between text-xs">
                                <span className="inline-flex items-center gap-1.5 font-black text-amber-300">
                                    <Sparkles className="size-3.5" />
                                    برنامه پیشنهادی شما
                                </span>
                                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-200">
                                    تطابق ۹۸٪
                                </span>
                            </div>

                            <h3 className="mt-4 text-xl font-black leading-snug text-white md:text-2xl">
                                {result.title}
                            </h3>
                            <p className="mt-2 text-xs font-bold text-emerald-300/80">
                                {result.programName}
                            </p>

                            {/* Meta Specs */}
                            <div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-xs">
                                <div className="flex items-center gap-2 text-white/70">
                                    <Clock className="size-4 text-amber-300" />
                                    <span>طول دوره: <strong className="text-white">{result.timeline}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-white/70">
                                    <UserCheck className="size-4 text-emerald-300" />
                                    <span>مشاوره: <strong className="text-white">{result.sessions}</strong></span>
                                </div>
                            </div>

                            {/* Outcomes */}
                            <div className="mt-5">
                                <span className="text-xs font-black text-white/90">دستاوردهای ملموس این مسیر:</span>
                                <ul className="mt-3 space-y-2.5">
                                    {result.outcomes.map((outcome, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-xs leading-6 text-white/75">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                                            <span>{outcome}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTAs */}
                            <div className="mt-7 flex flex-col gap-3">
                                <a
                                    href="#home-consultation"
                                    onClick={() => vibrate()}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
                                >
                                    <Sparkles className="size-4" />
                                    رزرو ارزیابی رایگان این مسیر
                                </a>

                                <Link
                                    href={`/courses/${result.suggestedCourseSlug}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-bold text-white transition-colors hover:border-white/30 hover:bg-white/10"
                                >
                                    مشاهده سرفصل‌ها و جزئیات دوره
                                    <ArrowLeft className="size-3.5" />
                                </Link>
                            </div>

                            <div className="mt-4 text-center">
                                <span className="text-[0.68rem] font-bold text-white/40">
                                    گارانتی رضایت کامل در اولین جلسه ارزیابی
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
