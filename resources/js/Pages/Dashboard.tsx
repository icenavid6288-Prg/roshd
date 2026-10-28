import { useState, type ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    HeartHandshake,
    Route,
    ShoppingBag,
    Sparkles,
    Target,
    TrendingUp,
    UserCheck,
    FileText,
    Brain,
    Video,
    ShieldCheck,
} from 'lucide-react';
import { CourseCard, type CourseCardData } from '@/Components/CourseCard';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import StudentGrowthRoadmap from '@/Components/Dashboard/StudentGrowthRoadmap';
import NextActionCoachingCard from '@/Components/Dashboard/NextActionCoachingCard';
import TalentRadarSnapshot from '@/Components/Dashboard/TalentRadarSnapshot';
import GrowthGamificationCard from '@/Components/Dashboard/GrowthGamificationCard';
import AutomatedRemindersWidget from '@/Components/Dashboard/AutomatedRemindersWidget';
import { formatDate, formatDuration, formatNumber, formatPrice } from '@/lib/format';
import { vibrate } from '@/lib/haptics';
import type { PageProps } from '@/types';

interface DashboardCourse {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string | null;
    duration_minutes: number;
    progress_percent: number;
    status: string;
}

interface Session {
    id: number;
    scheduled_at?: string | null;
    duration_minutes: number;
    status: string;
    coach?: string | null;
}

interface Goal {
    id: number;
    title: string;
    status: string;
    total_tasks: number;
    completed_tasks: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at?: string | null;
    items_count: number;
}

interface Certificate {
    id: number;
    certificate_number: string;
    issued_at: string;
    course: { id: number; title: string } | null;
    url: string;
}

interface Assignment {
    id: number;
    title: string;
    course: string;
    lesson_id?: number | null;
    course_slug?: string | null;
    status: string;
    score?: number | null;
    max_score: number;
    feedback?: string | null;
    submitted_at?: string | null;
    url?: string | null;
}

interface RecommendationCourse extends CourseCardData {
    type: 'course';
}

interface RecommendationService {
    type: 'service';
    title: string;
    slug: string;
    url: string;
    thumbnail?: string | null;
    price?: number | null;
    summary?: string | null;
}

type Recommendation = RecommendationCourse | RecommendationService;

interface DashboardProps {
    onboarding_incomplete: boolean;
    profile: { name: string; avatar?: string | null; role: string };
    stats: {
        courses_count: number;
        average_progress: number;
        active_goals: number;
        upcoming_sessions: number;
    };
    courses: DashboardCourse[];
    sessions: Session[];
    goals: Goal[];
    certificates: Certificate[];
    assignments: Assignment[];
    assignment_stats: { pending: number; graded: number; average_score: number };
    orders: Order[];
    recommendations: Recommendation[];
}

export default function Dashboard() {
    const {
        onboarding_incomplete,
        profile,
        stats,
        courses,
        sessions,
        goals,
        certificates,
        assignments,
        assignment_stats,
        orders,
        recommendations,
    } = usePage<PageProps & DashboardProps>().props;

    const [activePerspective, setActivePerspective] = useState<'student' | 'parent'>('student');
    const [parentSessionRequested, setParentSessionRequested] = useState(false);

    const nextCourse = courses[0];
    const nextSession = sessions[0];
    const nextGoal = goals[0];
    const latestOrder = orders[0];

    const quickLinks = [
        {
            label: 'دوره‌های من',
            description: nextCourse ? `ادامه «${nextCourse.title}»` : 'دوره‌های ثبت‌نام‌شده و پیشرفت',
            value: formatNumber(stats.courses_count),
            caption: 'دوره فعال',
            href: '/dashboard/courses',
            icon: BookOpen,
        },
        {
            label: 'نقشه سفر رشد',
            description: nextGoal ? nextGoal.title : 'هدف‌ها و گام‌های بعدی شما',
            value: formatNumber(stats.active_goals),
            caption: 'هدف فعال',
            href: '/dashboard/goals',
            icon: Target,
        },
        {
            label: 'جلسات با دکتر بیدی',
            description: nextSession ? `جلسه با ${nextSession.coach ?? 'دکتر بیدی'}` : 'جلسات پیش‌رو و هماهنگی',
            value: formatNumber(stats.upcoming_sessions),
            caption: 'جلسه پیش‌رو',
            href: '/dashboard/sessions',
            icon: CalendarDays,
        },
        {
            label: 'تکالیف و آزمون‌ها',
            description: assignments[0] ? assignments[0].title : 'تکالیف بررسی‌شده و در انتظار',
            value: formatNumber(assignment_stats?.pending ?? 0),
            caption: 'تکلیف جاری',
            href: '/dashboard/assignments',
            icon: ClipboardList,
        },
    ];

    return (
        <UserDashboardLayout>
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                {/* ── Perspective Selector (Student vs Parent Mode) ── */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/80 p-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-[#0c1f17]/90">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                vibrate();
                                setActivePerspective('student');
                            }}
                            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all ${
                                activePerspective === 'student'
                                    ? 'bg-gradient-to-r from-brand-600 to-emerald-600 text-white shadow-md shadow-brand-600/25'
                                    : 'text-navy/60 hover:text-navy dark:text-white/60 dark:hover:text-white'
                            }`}
                        >
                            <Brain className="size-4" />
                            <span>نمای دانش‌آموز (برنامه یادگیری و رسالت)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                vibrate();
                                setActivePerspective('parent');
                            }}
                            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all ${
                                activePerspective === 'parent'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/25'
                                    : 'text-navy/60 hover:text-navy dark:text-white/60 dark:hover:text-white'
                            }`}
                        >
                            <UserCheck className="size-4" />
                            <span>نمای والدین (پرونده تحلیلی، جلسات و نظارت)</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-navy/50 dark:text-white/50">
                        <span>فرزند تحت ارزیابی:</span>
                        <strong className="text-navy dark:text-white">{profile.name} (پایه دهم)</strong>
                    </div>
                </div>

                {/* ── ۰. Onboarding Reminder if Incomplete ── */}
                {onboarding_incomplete && (
                    <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-amber-300/60 bg-gradient-to-l from-amber-50 via-orange-50 to-white p-6 shadow-soft dark:border-amber-400/20 dark:from-amber-500/15 dark:via-[#12261d] dark:to-[#0f241a]">
                        <div className="flex items-center gap-4">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                                <Sparkles className="size-6" />
                            </span>
                            <div>
                                <strong className="block text-sm font-black text-amber-950 dark:text-white">
                                    مسیر رشد شما هنوز ساخته نشده است!
                                </strong>
                                <p className="mt-1 text-xs leading-6 text-amber-900/70 dark:text-amber-200/70">
                                    با پاسخ به چند سؤال کوتاه، پیشنهادهای اختصاصی دوره و خدمات برایتان فعال می‌شود.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/onboarding"
                            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400"
                        >
                            شروع ارزیابی ۳۰ ثانیه‌ای
                            <ArrowLeft className="size-4" />
                        </Link>
                    </section>
                )}

                {/* ── ۱. Next Action Smart Card (Upcoming Session + Resume Learning) ── */}
                <NextActionCoachingCard session={nextSession} course={nextCourse} />

                {/* ── ۲. Five-Stage Growth Journey Timeline ── */}
                <StudentGrowthRoadmap />

                {/* ── ۳. Talent Radar Snapshot & Insights ── */}
                <TalentRadarSnapshot />

                {/* ── ۴. Gamification, Streak & Achievements ── */}
                <GrowthGamificationCard />

                {/* ── ۴.۵. Automated Course & Session Reminders ── */}
                <AutomatedRemindersWidget />

                {/* ── ۵. If in Parent Mode: Family Supervision & Reports Card ── */}
                {activePerspective === 'parent' && (
                    <section className="overflow-hidden rounded-3xl border border-amber-300/40 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 p-6 shadow-soft md:p-8 dark:border-amber-400/20 dark:from-[#16241c] dark:via-[#122119] dark:to-[#0f1d16]">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/60 pb-5 dark:border-white/10">
                            <div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400">
                                    <ShieldCheck className="size-4" />
                                    میز کار والدین و سرپرست خانواده
                                </span>
                                <h3 className="mt-2 text-lg font-black text-navy dark:text-white">
                                    گزارش پیشرفت تحصیلی و استعدادیابی فرزند
                                </h3>
                                <p className="mt-1 text-xs text-navy/60 dark:text-white/60">
                                    خلاصه جلسات مشاوره با دکتر بیدی، فاکتورهای پرداخت‌شده و توصیه‌های رفتاری در منزل
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    vibrate();
                                    setParentSessionRequested(true);
                                    setTimeout(() => setParentSessionRequested(false), 4000);
                                }}
                                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400"
                            >
                                {parentSessionRequested ? <CheckCircle2 className="size-4" /> : <CalendarDays className="size-4" />}
                                {parentSessionRequested ? 'درخواست جلسه اولیا ثبت شد' : 'درخواست جلسه مشاوره اولیا با دکتر بیدی'}
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-amber-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <span className="text-xs font-bold text-navy/50 dark:text-white/50">آخرین ارزیابی روانشناختی</span>
                                <strong className="mt-1 block text-sm font-black text-navy dark:text-white">آزمون گاردنر (نمره ۹۲)</strong>
                                <span className="mt-2 inline-block text-[0.68rem] text-emerald-600 font-bold dark:text-emerald-400">تأیید شده · گزارش آماده است</span>
                            </div>

                            <div className="rounded-2xl border border-amber-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <span className="text-xs font-bold text-navy/50 dark:text-white/50">جلسات برگزار شده</span>
                                <strong className="mt-1 block text-sm font-black text-navy dark:text-white">۲ جلسه (۱ جلسه پیش‌رو)</strong>
                                <span className="mt-2 inline-block text-[0.68rem] text-brand-600 font-bold dark:text-brand-300">پنج‌شنبه ۱۷ آبان ساعت ۱۶:۰۰</span>
                            </div>

                            <div className="rounded-2xl border border-amber-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <span className="text-xs font-bold text-navy/50 dark:text-white/50">وضعیت مالی و شهریه‌ها</span>
                                <strong className="mt-1 block text-sm font-black text-navy dark:text-white">سفارش ORD-9821 (تسویه شده)</strong>
                                <span className="mt-2 inline-block text-[0.68rem] text-emerald-600 font-bold dark:text-emerald-400">فاکتور رسمی صادر شد</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── ۶. Quick Navigation Hub ── */}
                <section>
                    <div className="mb-4">
                        <span className="text-xs font-bold text-brand-700 dark:text-brand-300">مسیرهای سریع</span>
                        <h2 className="mt-1 text-base font-black text-navy dark:text-white md:text-lg">
                            میانبرهای اصلی پنل شما
                        </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex flex-col justify-between rounded-3xl border border-white/80 bg-white/85 p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-[#0f241a]/90"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-colors dark:bg-white/10 dark:text-brand-300">
                                        <item.icon className="size-5" />
                                    </span>
                                    <span className="text-lg font-black text-brand-700 dark:text-brand-300">{item.value}</span>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-sm font-black text-navy group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                                        {item.label}
                                    </h3>
                                    <p className="mt-1 truncate text-xs text-navy/50 dark:text-white/50">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-[0.68rem] font-bold text-brand-700 dark:text-brand-300">
                                    <span>مشاهده جزئیات</span>
                                    <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── ۷. Assignments & Feedback Section ── */}
                <section>
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <span className="text-xs font-bold text-brand-700 dark:text-brand-300">تکلیف‌ها و آزمون‌ها</span>
                            <h2 className="mt-1 text-base font-black text-navy dark:text-white md:text-lg">
                                وضعیت ارسال و بازخورد استاد
                            </h2>
                        </div>
                        <Link href="/dashboard/assignments" className="text-xs font-bold text-brand-700 hover:underline dark:text-brand-300">
                            مشاهده تمام تکالیف ←
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        {assignments.length > 0 ? (
                            assignments.map((assignment) => (
                                <Link
                                    key={assignment.id}
                                    href={assignment.url ?? '/dashboard/assignments'}
                                    className="group flex flex-wrap items-center gap-4 rounded-3xl border border-white/80 bg-white/85 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift dark:border-white/10 dark:bg-[#0f241a]/90"
                                >
                                    <span
                                        className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                                            assignment.status === 'graded'
                                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                                                : 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300'
                                        }`}
                                    >
                                        {assignment.status === 'graded' ? <CheckCircle2 className="size-5" /> : <Clock3 className="size-5" />}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-black text-navy group-hover:text-brand-700 dark:text-white">
                                            {assignment.title}
                                        </h3>
                                        <p className="mt-1 truncate text-xs font-bold text-navy/45 dark:text-white/45">
                                            {assignment.course}
                                            {assignment.submitted_at ? ` · تاریخ ارسال: ${formatDate(assignment.submitted_at)}` : ''}
                                        </p>
                                    </div>
                                    {assignment.status === 'graded' ? (
                                        <div className="shrink-0 text-left">
                                            <div className="text-sm font-black text-brand-700 dark:text-brand-300">
                                                نمره: {formatNumber(assignment.score ?? 0)} از {formatNumber(assignment.max_score)}
                                            </div>
                                            {assignment.feedback && (
                                                <div className="mt-1 max-w-56 truncate text-[0.68rem] font-bold text-navy/50 dark:text-white/50">
                                                    بازخورد: «{assignment.feedback}»
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="shrink-0 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                            در انتظار تصحیح مدرس
                                        </span>
                                    )}
                                    <ArrowLeft className="size-4 shrink-0 text-navy/25 transition-transform group-hover:-translate-x-1 group-hover:text-brand-600 dark:text-white/25" />
                                </Link>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-dashed border-brand-200 bg-white/55 px-5 py-10 text-center dark:border-white/10 dark:bg-white/5">
                                <ClipboardList className="mx-auto size-8 text-brand-500" />
                                <p className="mt-3 text-sm font-bold text-navy/50 dark:text-white/50">
                                    هنوز تکلیفی ارسال نکرده‌اید.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── ۸. Recommendations ── */}
                {recommendations.length > 0 && (
                    <section>
                        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <span className="text-xs font-bold text-brand-700 dark:text-brand-300">پیشنهاد هوشمند</span>
                                <h2 className="mt-1 text-base font-black text-navy dark:text-white md:text-lg">
                                    گام‌های مکمل بر اساس تیپ استعدادی شما
                                </h2>
                            </div>
                            <Link href="/courses" className="text-xs font-bold text-brand-700 hover:underline dark:text-brand-300">
                                مشاهده همه دوره‌ها ←
                            </Link>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {recommendations.map((item) =>
                                item.type === 'service' ? (
                                    <Link
                                        key={`s-${item.slug}`}
                                        href={item.url}
                                        className="group flex flex-col justify-between rounded-3xl border border-white/80 bg-white/85 p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-[#0f241a]/90"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-300">
                                                <HeartHandshake className="size-6" />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-black text-navy group-hover:text-brand-700 dark:text-white">
                                                    {item.title}
                                                </h3>
                                                <span className="text-[0.68rem] text-brand-700 dark:text-brand-300">خدمت کوچینگ اختصاصی</span>
                                            </div>
                                        </div>
                                        <p className="mt-3 line-clamp-2 text-xs leading-6 text-navy/60 dark:text-white/60">
                                            {item.summary}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between border-t border-navy/5 pt-3 dark:border-white/10">
                                            <span className="text-xs font-black text-brand-700 dark:text-brand-300">
                                                {item.price ? formatPrice(item.price) : 'رایگان'}
                                            </span>
                                            <span className="flex items-center gap-1 text-[0.68rem] font-bold text-navy/40 dark:text-white/40">
                                                اطلاعات بیشتر
                                                <ArrowLeft className="size-3" />
                                            </span>
                                        </div>
                                    </Link>
                                ) : (
                                    <CourseCard key={`c-${item.id ?? item.slug}`} course={item as RecommendationCourse} />
                                )
                            )}
                        </div>
                    </section>
                )}
            </div>
        </UserDashboardLayout>
    );
}

Dashboard.layout = (page: ReactNode) => page;
