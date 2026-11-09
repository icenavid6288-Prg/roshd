import React from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    Check,
    CheckCircle2,
    Clock,
    Crown,
    GraduationCap,
    Lock,
    MessageSquare,
    Play,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
    Video,
    Zap,
} from 'lucide-react';

interface UpsellScreenProps {
    courseTitle?: string;
    courseSlug?: string;
    featureName?: string;
    onUpgrade?: () => void;
    onBack?: () => void;
    onPreviewCourse?: () => void;
    isDark?: boolean;
}

const faNum = (value: number | string) => {
    const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(value).replace(/\d/g, (d) => map[Number(d)] ?? d);
};

export function UpsellScreen({
    courseTitle = 'طراحی آینده نوجوان (دوره جامع پریمیوم VIP)',
    featureName = 'اتاق یادگیری و محتوای دوره',
    onUpgrade,
    onBack,
    onPreviewCourse,
    isDark = false,
}: UpsellScreenProps) {
    const colors = {
        bg: isDark ? '#0D1A15' : '#F6F9F5',
        surface: isDark ? '#142B23' : '#FFFFFF',
        surfaceAlt: isDark ? '#1A362C' : '#F0F6F2',
        border: isDark ? 'rgba(255,255,255,0.1)' : '#E2ECE5',
        text: isDark ? '#F0FDF4' : '#102B22',
        muted: isDark ? '#A1C3B4' : '#5E7D72',
        primary: '#174938',
        primaryLight: '#23644E',
        accent: '#D6F39A',
        gold: '#F59E0B',
    };

    return (
        <div className="space-y-4 max-w-xl mx-auto py-2">
            {/* Top Back Navigation */}
            {onBack && (
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-1.5 text-xs font-bold transition hover:opacity-80"
                        style={{ color: colors.text }}
                    >
                        <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>بازگشت</span>
                    </button>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                        <Lock className="w-3 h-3" />
                        <span>محتوای ویژه اعضا</span>
                    </span>
                </div>
            )}

            {/* Hero Upsell Card */}
            <div
                className="rounded-[28px] p-5 relative overflow-hidden text-white shadow-xl border border-amber-400/40"
                style={{
                    background: 'linear-gradient(145deg, #0F382B 0%, #154D3B 55%, #1A5E48 100%)',
                }}
            >
                {/* Decorative glowing orb */}
                <div
                    className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-30"
                    style={{ background: '#D6F39A' }}
                />
                <div
                    className="absolute -bottom-16 -right-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-20"
                    style={{ background: '#F59E0B' }}
                />

                <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-[11px]">
                            <Crown className="w-3.5 h-3.5 fill-current text-amber-400" />
                            <span>دسترسی پریمیوم (VIP)</span>
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-300">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h1 className="font-black text-lg sm:text-xl leading-7 text-white">
                            دسترسی به {featureName} نیازمند عضویت VIP است
                        </h1>
                        <p className="text-xs text-emerald-100/90 leading-5 mt-1.5">
                            شما در حال تلاش برای مشاهده بخش‌های تخصصی دوره «{courseTitle}» هستید. با ارتقا به عضویت ویژه، تمام قفل‌ها باز شده و دسترسی نامحدود به جلسات، اساتید و گواهینامه برای شما فعال می‌شود.
                        </p>
                    </div>

                    {/* Price & Guarantee Teaser */}
                    <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                            <span className="text-[10px] text-amber-200 font-bold block">
                                تخفیف ویژه رونمایی نسخه جدید:
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-black text-base text-[#D6F39A]">
                                    {faNum('۵٬۴۰۰٬۰۰۰')} تومان
                                </span>
                                <span className="text-[11px] line-through text-white/50">
                                    {faNum('۶٬۸۰۰٬۰۰۰')} تومان
                                </span>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-[#0D2E22] font-black text-[11px] shrink-0">
                            ۲۰٪ تخفیف
                        </span>
                    </div>

                    {/* Primary Upgrade Button */}
                    <button
                        type="button"
                        onClick={onUpgrade}
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#D6F39A] text-[#123E30] font-black text-sm shadow-lg flex items-center justify-center gap-2 transition hover:bg-[#e2f9b3] active:scale-[0.99]"
                    >
                        <Sparkles className="w-4 h-4 fill-current text-emerald-700" />
                        <span>ارتقا به عضویت ویژه و باز شدن فوری دسترسی</span>
                    </button>
                </div>
            </div>

            {/* Bento Grid: What Unlocks with Premium */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="font-black text-xs" style={{ color: colors.text }}>
                        امکاناتی که با فعال‌سازی باز می‌شوند:
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        ۴ دسترسی انحصاری
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                        {
                            title: 'اتاق یادگیری و ویدیوهای تعاملی',
                            desc: 'مشاهده کامل تمام جلسات با قابلیت ثبت یادداشت، نشان‌گذاری و آزمون‌های سنجش مهارت.',
                            icon: Video,
                            color: '#10B981',
                        },
                        {
                            title: 'چت خصوصی با اساتید ۴ آیتم دوره',
                            desc: 'پرسش و پاسخ فردی با دکتر بیدی و اساتید دوره تخصصی برای رفع اشکال مستمر.',
                            icon: MessageSquare,
                            color: '#3B82F6',
                        },
                        {
                            title: 'حضور در کارگاه‌های حضوری و تقویم',
                            desc: 'دعوت‌نامه رسمی به سالن کارگاه VIP مرکز رشد و لینک اختصاصی وبینارهای زنده.',
                            icon: Users,
                            color: '#8B5CF6',
                        },
                        {
                            title: 'گواهینامه رسمی با مهر طلایی VIP',
                            desc: 'اعطای مدرک معتبر با کد استعلام آنلاین و گزارش ارزیابی استعدادیابی برای والدین.',
                            icon: Award,
                            color: '#F59E0B',
                        },
                    ].map((feat, idx) => {
                        const Icon = feat.icon;
                        return (
                            <div
                                key={idx}
                                className="p-3.5 rounded-2xl border flex items-start gap-3 transition"
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                }}
                            >
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor: `${feat.color}15`,
                                        color: feat.color,
                                    }}
                                >
                                    <Icon className="w-4.5 h-4.5" />
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                    <div className="font-bold text-xs" style={{ color: colors.text }}>
                                        {feat.title}
                                    </div>
                                    <div className="text-[11px] leading-4" style={{ color: colors.muted }}>
                                        {feat.desc}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Trust and Guarantee Bar */}
            <div
                className="p-3.5 rounded-2xl border flex items-center justify-between text-xs"
                style={{
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                }}
            >
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold" style={{ color: colors.text }}>
                        ضمانت کیفیت آموزش و بازگشت وجه در جلسه اول
                    </span>
                </div>
                {onPreviewCourse && (
                    <button
                        type="button"
                        onClick={onPreviewCourse}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 hover:underline"
                    >
                        <span>مشاهده معرفی دوره</span>
                        <ArrowLeft className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}
export default UpsellScreen;
