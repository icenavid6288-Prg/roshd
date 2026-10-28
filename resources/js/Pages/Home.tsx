import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    BookOpen,
    CheckCircle2,
    Compass,
    FlaskConical,
    Headphones,
    HeartHandshake,
    Lightbulb,
    Mic,
    Phone,
    Rocket,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Users,
    Brain,
    ShieldCheck,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { type FormEvent, type ReactNode } from 'react';
import { CourseCard, type CourseCardData } from '@/Components/CourseCard';
import JourneyProgress from '@/Components/JourneyProgress';
import SectionMedia from '@/Components/SectionMedia';
import FuturePathFinder from '@/Components/FuturePathFinder';
import FutureRadioPlayer from '@/Components/FutureRadioPlayer';
import TransformationStories from '@/Components/TransformationStories';
import ParentFaqSection from '@/Components/ParentFaqSection';
import TalentCompassHeroVisual from '@/Components/TalentCompassHeroVisual';
import { formatNumber, formatPrice } from '@/lib/format';
import { vibrate } from '@/lib/haptics';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps } from '@/types';

interface ServiceData {
    id: number;
    title: string;
    slug: string;
    summary?: string | null;
    icon?: string | null;
    price?: number | null;
    features?: string[] | null;
}

interface TestimonialData {
    id: number;
    name: string;
    role: string;
    content: string;
    rating?: number | null;
}

interface PostData {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    cover_image?: string | null;
    published_at?: string | null;
    author?: { name?: string } | null;
}

interface ProductData {
    id: number;
    title: string;
    slug: string;
    type: string;
    image?: string | null;
    price: number;
    discount_price?: number | null;
    author?: string | null;
    pages?: number | null;
    episodes?: Array<{ id: number; title: string; duration_seconds: number | null; is_free: boolean }>;
}

const keyPillars = [
    {
        icon: Brain,
        title: 'استعدادیابی علمی گاردنر و MBTI',
        desc: 'شناخت ۸ هوش چندگانه، رغبت‌سنجی شغلی و کشف نقاط قوت پنهان نوجوان بدون حدس و گمان.',
    },
    {
        icon: Target,
        title: 'هدایت تحصیلی و انتخاب رشته نهم به دهم',
        desc: 'پایان سردرگمی بین تجربی، ریاضی و انسانی با کارنامه تحلیلی ۳۰ صفحه‌ای و جلسه با خانواده.',
    },
    {
        icon: HeartHandshake,
        title: 'کوچینگ فردی ۱ به ۱ با منتور ارشد',
        desc: 'همراهی هفتگی برای تقویت اعتماد‌به‌نفس، رفع اهمال‌کاری و مدیریت اضطراب کنکور و مدرسه.',
    },
    {
        icon: Rocket,
        title: 'مهارت‌های پول‌ساز و کارآفرینی نوجوانان',
        desc: 'آموزش تفکر ثروت‌آفرین، فن بیان، مذاکره و ورود مطمئن به مشاغل قرن ۲۱ و عصر هوش مصنوعی.',
    },
];

export default function Home() {
    const { courses, services, testimonials, posts, books, podcast, stats, site, pageContent } = usePage<
        PageProps & {
            courses: CourseCardData[];
            services: ServiceData[];
            testimonials: TestimonialData[];
            posts: PostData[];
            books: ProductData[];
            podcast: ProductData | null;
            stats: Array<{ value: number; suffix: string; label: string }>;
        }
    >().props;

    const pageFields = pageContent?.fields ?? {};
    const editable = (key: string, fallback: string) => pageFields[key]?.value?.trim() || fallback;
    const media = (key: string) => pageFields[key]?.value?.trim() || '';

    const lead = useForm({
        name: '',
        phone: '',
        need: '',
        consent: false,
    });

    const submitLead = (e: FormEvent) => {
        e.preventDefault();
        vibrate();
        lead.post('/leads', { preserveScroll: true });
    };

    return (
        <div className="bg-[#fafbf7] text-navy transition-colors duration-300 dark:bg-[#061811] dark:text-white">
            <JourneyProgress />

            {/* ── ۱. Luxury Hero Section ── */}
            <section
                id="home-hero"
                data-journey-section="hero"
                className="relative overflow-hidden bg-gradient-to-b from-[#071f17] via-[#061811] to-[#09241a] pb-16 pt-24 text-white md:pb-24 md:pt-32"
            >
                {/* Ambient Radial Lights */}
                <div className="pointer-events-none absolute -right-40 top-0 size-[32rem] rounded-full bg-emerald-500/15 blur-[120px]" />
                <div className="pointer-events-none absolute -left-40 top-40 size-[32rem] rounded-full bg-amber-400/10 blur-[120px]" />

                <div className="container-site relative z-10 grid items-center gap-12 lg:grid-cols-12">
                    {/* Right/Text Content (7 cols) */}
                    <div className="flex flex-col items-start gap-6 lg:col-span-7">
                        {/* Kicker Tag */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black text-emerald-300 backdrop-blur-md">
                            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                            <span>{editable('hero_eyebrow', 'مرکز تخصصی هدایت شغلی و استعدادیابی · دکتر علیرضا بیدی')}</span>
                        </div>

                        {/* Master Headline */}
                        <h1 className="text-4xl font-black leading-[1.25] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            مسیر آینده‌ات کجاست؟
                            <span className="mt-2 block bg-gradient-to-l from-amber-300 via-emerald-300 to-white bg-clip-text text-transparent">
                                طراحی مسیر رشد و استعدادیابی نوجوانان
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="max-w-2xl text-base leading-8 text-emerald-100/75 md:text-lg md:leading-9">
                            {editable(
                                'hero_subtitle',
                                'با متدهای علمی استعدادیابی هاوارد گاردنر، مدل شخصیت‌شناسی هالند و جلسات کوچینگ ۱:۱؛ پیش از آنکه دیر شود، نقاط قوت و رسالت واقعی فرزندتان را کشف کنید.'
                            )}
                        </p>

                        {/* High-Converting CTA Row */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <a
                                href="#home-consultation"
                                onClick={() => vibrate()}
                                className="group relative inline-flex min-h-[3.35rem] items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 text-base font-black text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
                            >
                                <Phone className="size-5" />
                                <span>{editable('hero_cta_primary', 'رزرو ارزیابی رایگان مسیر رشد')}</span>
                            </a>

                            <a
                                href="#future-path-finder"
                                onClick={() => vibrate()}
                                className="inline-flex min-h-[3.35rem] items-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-bold text-white backdrop-blur-md transition-all hover:border-emerald-400/60 hover:bg-emerald-500/15 active:scale-[0.98]"
                            >
                                <span>آزمون آنلاین ۳۰ ثانیه‌ای</span>
                                <ArrowLeft className="size-5 text-emerald-300" />
                            </a>
                        </div>

                        {/* Quiet Clean Social Proof Row (No Pill Enclosures) */}
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-white/60">
                            <span className="flex items-center gap-1.5 text-emerald-300">
                                <CheckCircle2 className="size-4" />
                                روش علمی ثبت‌شده
                            </span>
                            <span className="text-white/25">·</span>
                            <span className="flex items-center gap-1.5 text-emerald-300">
                                <ShieldCheck className="size-4" />
                                گزارش ۳۰ صفحه‌ای نقشه راه
                            </span>
                            <span className="text-white/25">·</span>
                            <span className="flex items-center gap-1.5 text-emerald-300">
                                <Award className="size-4" />
                                گارانتی رضایت جلسه اول
                            </span>
                        </div>
                    </div>

                    {/* Left/Visual Content (5 cols): Interactive Talent Compass Visual */}
                    <div className="lg:col-span-5">
                        <TalentCompassHeroVisual />
                    </div>
                </div>
            </section>

            {/* ── ۲. Impact Metric Stats Bar ── */}
            <section id="home-stats" data-journey-section="stats" className="border-y border-emerald-900/10 bg-white py-8 backdrop-blur-xl dark:border-white/10 dark:bg-[#04120d]/80">
                <div className="container-site">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {(stats && stats.length > 0 ? stats : [
                            { value: 1025, suffix: '+', label: 'دانش‌آموز و مراجع موفق' },
                            { value: 14, suffix: '', label: 'دوره تخصصی و کارگاه' },
                            { value: 8, suffix: 'نفر', label: 'کوچ و مشاور ارشد' },
                            { value: 97, suffix: '٪', label: 'رضایت والدین و دانش‌آموزان' },
                        ]).map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center justify-center rounded-2xl border border-emerald-900/10 bg-[#f4f8f5] p-5 text-center transition-all hover:border-emerald-500/30 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                            >
                                <div className="text-3xl font-black text-amber-600 dark:text-amber-300 md:text-4xl">
                                    {formatNumber(stat.value)}
                                    <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{stat.suffix}</span>
                                </div>
                                <div className="mt-1 text-xs font-bold text-navy/70 dark:text-white/60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ۳. Interactive Future Path Finder Widget ── */}
            <FuturePathFinder />

            {/* ── ۴. Four Core Pillars Bento ── */}
            <section className="relative overflow-hidden bg-white py-16 md:py-24 dark:bg-[#061811]">
                <div className="container-site relative z-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-black text-emerald-800 dark:border-emerald-400/30 dark:text-emerald-300">
                            <Sparkles className="size-3.5 text-amber-500 dark:text-amber-400" />
                            چهار ستون رشد همه‌جانبه
                        </div>
                        <h2 className="mt-4 text-3xl font-black text-navy dark:text-white md:text-4xl">
                            چرا صدها خانواده مسیر فرزندشان را به دکتر بیدی می‌سپارند؟
                        </h2>
                        <p className="mt-3 text-xs leading-7 text-navy/70 dark:text-emerald-100/70 md:text-sm">
                            ما صرفاً مشاوره کنکور نمی‌دهیم؛ ما رسالت فردی و معماری آینده نوجوان را می‌سازیم.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {keyPillars.map((pillar) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={pillar.title}
                                    className="group relative flex flex-col rounded-3xl border border-emerald-900/10 bg-[#f4f8f5] p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 dark:border-white/10 dark:bg-gradient-to-b dark:from-white/[0.06] dark:to-white/[0.02] dark:hover:bg-white/[0.08]"
                                >
                                    <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-600/20 transition-transform duration-300 group-hover:scale-110 dark:bg-gradient-to-br dark:from-emerald-500/20 dark:to-emerald-500/5 dark:text-emerald-300 dark:ring-emerald-400/30">
                                        <Icon className="size-7" />
                                    </span>
                                    <h3 className="mt-5 text-base font-black text-navy dark:text-white">{pillar.title}</h3>
                                    <p className="mt-3 text-xs leading-6 text-navy/70 dark:text-white/60">{pillar.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── ۵. Featured Premier Courses Showcase ── */}
            <section id="home-courses" data-journey-section="courses" className="border-t border-emerald-900/10 bg-[#f4f8f5] py-16 md:py-24 dark:border-white/10 dark:bg-[#05150f]">
                <div className="container-site">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">آموزش‌های تخصصی و کاربردی</span>
                            <h2 className="mt-2 text-2xl font-black text-navy dark:text-white md:text-4xl">
                                دوره‌ها و بوت‌کمپ‌های مهارتی آینده
                            </h2>
                            <p className="mt-2 text-xs text-navy/65 dark:text-white/60 md:text-sm">
                                یادگیری مهارت‌های عملی با تدریس مستقیم دکتر بیدی و ارائه گواهینامه معتبر.
                            </p>
                        </div>
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/15 bg-white px-5 py-2.5 text-xs font-bold text-emerald-700 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                        >
                            مشاهده تمام دوره‌ها
                            <ArrowLeft className="size-4" />
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ۶. Future Radio Podcast Player ── */}
            <FutureRadioPlayer podcast={podcast} />

            {/* ── ۷. Transformation Stories & Case Studies ── */}
            <TransformationStories />

            {/* ── ۸. Free Consultation & Assessment Form ── */}
            <section id="home-consultation" data-journey-section="consultation" className="relative overflow-hidden bg-white py-16 text-white md:py-24 dark:bg-[#061811]">
                <div className="container-site relative z-10">
                    <div className="grid overflow-hidden rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-[#0c261e] via-[#071913] to-[#04120d] shadow-2xl lg:grid-cols-12">
                        {/* Info Column (6 cols) */}
                        <div className="flex flex-col justify-center gap-6 p-8 md:p-14 lg:col-span-6">
                            <div className="inline-flex items-center gap-2 text-xs font-black text-amber-400">
                                <Sparkles className="size-4" />
                                بدون هیچ تعهد یا هزینه‌ای
                            </div>
                            <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">
                                {editable('cta_title', 'اولین قدم مسیر رشد فرزندتان را همین امروز بردارید')}
                            </h2>
                            <p className="text-sm leading-8 text-emerald-100/75">
                                {editable(
                                    'cta_description',
                                    'فرم کوتاه را تکمیل کنید تا کارشناسان ارشد استعدادیابی مرکز ظرف کمتر از ۲۴ ساعت برای هماهنگی جلسه ارزیابی اولیه با شما تماس بگیرند.'
                                )}
                            </p>

                            <div className="space-y-3 pt-2 text-xs font-bold text-white/80">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="size-4 text-emerald-400" />
                                    <span>بررسی رایگان پیشینه تحصیلی و چالش‌های فعلی نوجوان</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="size-4 text-emerald-400" />
                                    <span>امکان انتخاب شیوه برگزاری (حضوری تهران / آنلاین سراسر کشور)</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="size-4 text-emerald-400" />
                                    <span>پاسخگویی سریع مشاوران ارشد</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Column (6 cols) */}
                        <div className="border-t border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl md:p-12 lg:border-r lg:border-t-0 lg:col-span-6">
                            <form onSubmit={submitLead} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="lead-name" className="mb-1.5 block text-xs font-bold text-white/80">
                                        نام و نام خانوادگی والد یا دانش‌آموز *
                                    </label>
                                    <input
                                        id="lead-name"
                                        type="text"
                                        required
                                        value={lead.data.name}
                                        onChange={(e) => lead.setData('name', e.target.value)}
                                        className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-amber-400 focus:bg-white/10"
                                        placeholder="مثلاً: دکتر مریم احمدی"
                                    />
                                    {lead.errors.name && <p className="mt-1 text-xs text-red-400">{lead.errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-bold text-white/80">
                                        شماره تلفن همراه (جهت هماهنگی پیامکی و تماس) *
                                    </label>
                                    <input
                                        id="lead-phone"
                                        type="tel"
                                        required
                                        dir="ltr"
                                        value={lead.data.phone}
                                        onChange={(e) => lead.setData('phone', e.target.value)}
                                        className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-right text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-amber-400 focus:bg-white/10"
                                        placeholder="0912xxxxxxx"
                                    />
                                    {lead.errors.phone && <p className="mt-1 text-xs text-red-400">{lead.errors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="lead-need" className="mb-1.5 block text-xs font-bold text-white/80">
                                        موضوع اصلی مورد نیاز
                                    </label>
                                    <select
                                        id="lead-need"
                                        value={lead.data.need}
                                        onChange={(e) => lead.setData('need', e.target.value)}
                                        className="w-full rounded-2xl border border-white/15 bg-[#0a231b] px-4 py-3.5 text-sm text-white outline-none transition-colors focus:border-amber-400"
                                    >
                                        <option value="">انتخاب کنید...</option>
                                        <option value="استعدادیابی و انتخاب رشته نهم به دهم">استعدادیابی و انتخاب رشته نهم به دهم</option>
                                        <option value="کوچینگ انگیزه، تمرکز و برنامه‌ریزی">کوچینگ انگیزه، تمرکز و برنامه‌ریزی</option>
                                        <option value="کارگاه‌های فن بیان و اعتماد‌به‌نفس نوجوان">کارگاه‌های فن بیان و اعتماد‌به‌نفس نوجوان</option>
                                        <option value="انتخاب رشته تخصصی کنکور">انتخاب رشته تخصصی کنکور</option>
                                        <option value="آموزش مهارت‌های بیزینس و کارآفرینی">آموزش مهارت‌های بیزینس و کارآفرینی</option>
                                    </select>
                                </div>

                                <label className="flex items-start gap-2.5 text-xs leading-6 text-white/60">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(lead.data.consent)}
                                        onChange={(e) => lead.setData('consent', e.target.checked)}
                                        className="mt-1 size-4 shrink-0 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400"
                                        required
                                    />
                                    <span>با قوانین حفظ حریم خصوصی مرکز موافقم و اجازه ارتباط کارشناس را می‌دهم.</span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={lead.processing}
                                    className="mt-2 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-base font-black text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                                >
                                    <HeartHandshake className="size-5" />
                                    {lead.processing ? 'در حال ثبت...' : 'ثبت درخواست ارزیابی اولیه'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ۹. Parent Anxiety FAQ Section ── */}
            <ParentFaqSection />

            {/* ── ۱۰. Knowledge Hub: Books & Articles ── */}
            <section className="border-t border-emerald-900/10 bg-white py-16 md:py-24 dark:border-white/10 dark:bg-[#05150f]">
                <div className="container-site">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">کتاب‌ها و منابع مکمل</span>
                            <h2 className="mt-2 text-2xl font-black text-navy dark:text-white md:text-4xl">
                                کتاب‌ها و مقالات آموزشی مرکز
                            </h2>
                        </div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/15 bg-[#f4f8f5] px-5 py-2.5 text-xs font-bold text-emerald-700 hover:border-emerald-500/50 hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                        >
                            فروشگاه کتاب‌ها و ورک‌بوک‌ها
                            <ArrowLeft className="size-4" />
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {books.map((book) => (
                            <Link
                                key={book.id}
                                href={`/shop/${book.slug}`}
                                className="group flex flex-col justify-between rounded-3xl border border-emerald-900/10 bg-[#f4f8f5] p-6 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-500/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-xs text-navy/60 dark:text-white/50">
                                        <span>{book.author ?? 'دکتر علیرضا بیدی'}</span>
                                        <span>{book.pages ? `${formatNumber(book.pages)} صفحه` : 'ورک‌بوک عملیاتی'}</span>
                                    </div>
                                    <h3 className="mt-4 text-base font-black text-navy group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                                        {book.title}
                                    </h3>
                                </div>
                                <div className="mt-6 flex items-center justify-between border-t border-emerald-900/10 pt-4 text-xs font-bold dark:border-white/10">
                                    <span className="font-mono text-sm text-amber-700 dark:text-amber-300">
                                        {formatPrice(book.discount_price ?? book.price)}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                                        سفارش آنلاین
                                        <ArrowLeft className="size-3.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

Home.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;
