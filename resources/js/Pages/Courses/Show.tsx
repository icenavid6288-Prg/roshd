import { Link, router, usePage } from '@inertiajs/react';
import { ReviewComposer, type ExistingReviewData } from '@/Components/ReviewComposer';
import {
    ArrowLeft,
    Award,
    BadgeCheck,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    Clock,
    GraduationCap,
    Heart,
    HeartHandshake,
    LayoutList,
    Lock,
    MapPin,
    MessageCircle,
    MessageSquare,
    PlayCircle,
    Send,
    ShieldCheck,
    Star,
    UserRound,
    Users,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { CourseCard, type CourseCardData } from '@/Components/CourseCard';
import { Badge } from '@/Components/ui/Badge';
import { formatDate, formatDuration, formatNumber, formatPrice } from '@/lib/format';
import {
    appendChatMessage,
    canSendMessageInChannel,
    defaultCourseItemsWithInstructors,
    type ChatChannelType,
} from '@/lib/mobileAppLogic';
import { useDynamicAppStore } from '@/lib/dynamicAppStore';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps } from '@/types';

interface LessonData {
    id: number;
    title: string;
    duration_minutes: number | null;
    is_free: boolean;
}

interface ModuleData {
    id: number;
    title: string;
    lessons: LessonData[];
}

interface InstructorData {
    id?: number;
    specialty?: string | null;
    bio?: string | null;
    experience_years?: number | null;
    user?: { name?: string; avatar?: string | null } | null;
}

interface CourseDetail extends Omit<CourseCardData, 'instructor'> {
    description?: string | null;
    certificate_enabled?: boolean;
    category?: string | null;
    instructor?: InstructorData | null;
    modules: ModuleData[];
    faqs?: Array<{ id: number; question: string; answer: string }>;
    is_in_person?: boolean;
    location?: string | null;
    schedule?: Array<{ day: string; time: string; label?: string }> | null;
    max_students?: number | null;
    in_person_description?: string | null;
}

interface CourseReview {
    id: number;
    name: string;
    avatar?: string | null;
    rating: number;
    title?: string | null;
    body?: string | null;
    created_at?: string | null;
}

interface EnrollmentState {
    is_enrolled: boolean;
    status?: string | null;
    progress_percent: number;
}

const levelLabels: Record<string, string> = { beginner: 'مقدماتی', intermediate: 'متوسط', advanced: 'پیشرفته' };
const tabs = [
    { id: 'about', label: 'درباره دوره', icon: BookOpen },
    { id: 'curriculum', label: 'سرفصل‌ها و ۴ آیتم', icon: LayoutList },
    { id: 'mentors_chat', label: 'گفتگو با اساتید و گروه دوره', icon: MessageSquare },
    { id: 'instructor', label: 'راهبر و اساتید', icon: UserRound },
    { id: 'reviews', label: 'نظرات', icon: MessageCircle },
] as const;
type TabId = (typeof tabs)[number]['id'];

function Avatar({ name, avatar, large = false }: { name: string; avatar?: string | null; large?: boolean }) {
    const size = large ? 'size-20 md:size-24' : 'size-11';
    return avatar ? (
        <img src={avatar} alt={name} className={`${size} shrink-0 rounded-2xl object-cover`} />
    ) : (
        <span className={`flex ${size} shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-deep-green ${large ? 'text-3xl' : 'text-base'} font-black text-white`}>
            {name.slice(0, 1)}
        </span>
    );
}

export default function CourseShow() {
    const { course: baseCourse, related, reviews, review_summary, my_review, can_review, enrollment, auth, wishlisted = false } = usePage<
        PageProps & {
            course: CourseDetail;
            related: CourseCardData[];
            reviews: CourseReview[];
            review_summary: { count: number; average: number };
            my_review?: ExistingReviewData | null;
            can_review: boolean;
            enrollment: EnrollmentState;
            wishlisted?: boolean;
        }
    >().props;

    // 3-Layer Course Chat & Dynamic Course State (Synced with Admin Panel & Mobile App)
    const { appState, updateAppState } = useDynamicAppStore();
    const { courses: dynamicCourses, courseItems, groupChatEnabled, groupMessages, supportMessages } = appState;

    const currentPathSlug =
        typeof window !== 'undefined' && window.location.pathname.startsWith('/courses/')
            ? window.location.pathname.replace('/courses/', '').replace(/\/$/, '')
            : baseCourse.slug;

    const matchedDynamic =
        dynamicCourses.find((c) => c.slug === currentPathSlug || c.id === baseCourse.id) ||
        dynamicCourses.find((c) => c.slug === baseCourse.slug);

    const course: CourseDetail = matchedDynamic
        ? {
              ...baseCourse,
              id: matchedDynamic.id,
              title: matchedDynamic.title,
              subtitle: matchedDynamic.subtitle || matchedDynamic.summary,
              slug: matchedDynamic.slug,
              description: matchedDynamic.description,
              price: matchedDynamic.price,
              discount_price: matchedDynamic.discount_price,
              duration_minutes: matchedDynamic.duration_minutes,
              thumbnail: matchedDynamic.thumbnail,
              certificate_enabled: matchedDynamic.certificate_enabled,
              is_in_person: matchedDynamic.is_in_person,
              location: matchedDynamic.location || baseCourse.location,
              max_students: matchedDynamic.max_students ?? baseCourse.max_students,
              instructor: {
                  ...baseCourse.instructor,
                  specialty: matchedDynamic.instructor?.title || baseCourse.instructor?.specialty,
                  user: {
                      name: matchedDynamic.instructor?.name || baseCourse.instructor?.user?.name,
                      avatar: matchedDynamic.instructor?.avatar || baseCourse.instructor?.user?.avatar,
                  },
              },
              modules:
                  matchedDynamic.modules && matchedDynamic.modules.length > 0
                      ? matchedDynamic.modules.map((m) => ({
                            id: m.id,
                            title: m.title,
                            lessons: (m.lessons || []).map((l) => ({
                                id: l.id,
                                title: l.title,
                                duration_minutes: 90,
                                is_free: Boolean(l.is_free),
                            })),
                        }))
                      : baseCourse.modules,
          }
        : baseCourse;

    const [activeTab, setActiveTab] = useState<TabId>('about');
    const [openModule, setOpenModule] = useState<number | null>(course.modules[0]?.id ?? null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const [chatChannel, setChatChannel] = useState<ChatChannelType>('instructor');
    const [selectedItemId, setSelectedItemId] = useState<number>(
        defaultCourseItemsWithInstructors[0].itemId
    );
    const [chatDraft, setChatDraft] = useState('');

    const setGroupChatEnabled = (
        updater: boolean | ((prev: boolean) => boolean)
    ) => {
        updateAppState((prev) => ({
            ...prev,
            groupChatEnabled:
                typeof updater === 'function'
                    ? updater(prev.groupChatEnabled)
                    : updater,
        }));
    };

    const activeCourseItem =
        courseItems.find((item) => item.itemId === selectedItemId) ??
        courseItems[0];

    const currentChatMessages =
        chatChannel === 'instructor'
            ? activeCourseItem.initialMessages ?? []
            : chatChannel === 'group'
            ? groupMessages
            : supportMessages;

    const sendPermission = canSendMessageInChannel(chatChannel, groupChatEnabled, 'vip_student');

    const handleSendChatMessage = () => {
        if (!sendPermission.allowed || !chatDraft.trim()) return;
        const senderName = appState.userProfile.name || auth?.user?.name || 'نوید محمدی';
        if (chatChannel === 'instructor') {
            updateAppState((prev) => ({
                ...prev,
                courseItems: prev.courseItems.map((it) =>
                    it.itemId === activeCourseItem.itemId
                        ? {
                              ...it,
                              initialMessages: appendChatMessage(
                                  it.initialMessages,
                                  chatDraft,
                                  'student',
                                  senderName,
                                  'دانش‌پذیر دوره'
                              ),
                          }
                        : it
                ),
            }));
        } else if (chatChannel === 'group') {
            updateAppState((prev) => ({
                ...prev,
                groupMessages: appendChatMessage(
                    prev.groupMessages,
                    chatDraft,
                    'student',
                    senderName,
                    'دانش‌پذیر دوره VIP'
                ),
            }));
        } else {
            updateAppState((prev) => ({
                ...prev,
                supportMessages: appendChatMessage(
                    prev.supportMessages,
                    chatDraft,
                    'student',
                    senderName,
                    'دانش‌پذیر دوره'
                ),
            }));
        }
        setChatDraft('');
    };

    const openInstructorDirectChat = (itemId: number) => {
        setSelectedItemId(itemId);
        setChatChannel('instructor');
        setActiveTab('mentors_chat');
    };

    const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const finalPrice = course.discount_price ?? course.price;
    const hasDiscount = course.discount_price !== null && course.discount_price !== undefined;
    const instructorName = course.instructor?.user?.name ?? 'تیم آموزشی مرکز رشد';
    const progress = Math.min(100, Math.max(0, enrollment.progress_percent ?? 0));

    const enrollmentAction = enrollment.is_enrolled ? (
        <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-400 to-brand-600 px-6 py-3.5 text-sm font-black text-white shadow-glow transition-all hover:from-brand-300 hover:to-brand-500 active:scale-[0.98]"
        >
            {progress > 0 ? 'ادامه یادگیری' : 'شروع یادگیری'}
            <ArrowLeft className="size-4" aria-hidden />
        </Link>
    ) : (
        <Link
            href={`/courses/${course.slug}/checkout`}
            method="post"
            as="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-400 to-brand-600 px-6 py-3.5 text-sm font-black text-white shadow-glow transition-all hover:from-brand-300 hover:to-brand-500 active:scale-[0.98]"
        >
            <HeartHandshake className="size-4" aria-hidden />
            ثبت‌نام در دوره
        </Link>
    );

    return (
        <div className="course-detail-page bg-cream">
            {/* Breadcrumb */}
            <div className="course-breadcrumb border-b border-navy/5 bg-white pt-24 md:pt-28">
                <div className="container-site py-4">
                    <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-bold text-navy/45" aria-label="مسیر صفحه">
                        <Link href="/" className="transition-colors hover:text-brand-700">خانه</Link>
                        <ChevronLeft className="size-3.5 shrink-0 text-navy/25" aria-hidden />
                        <Link href="/courses" className="transition-colors hover:text-brand-700">دوره‌ها</Link>
                        {course.category && <><ChevronLeft className="size-3.5 shrink-0 text-navy/25" aria-hidden /><span>{course.category}</span></>}
                        <ChevronLeft className="size-3.5 shrink-0 text-navy/25" aria-hidden />
                        <span className="max-w-48 truncate text-navy/75">{course.title}</span>
                    </nav>
                </div>
            </div>

            {/* Reference-style hero card */}
            <section className="course-detail-hero-wrap relative overflow-hidden py-7 md:py-10">
                <div className="course-detail-orb course-detail-orb-one" aria-hidden />
                <div className="course-detail-orb course-detail-orb-two" aria-hidden />
                <div className="container-site relative">
                    <div className="course-detail-hero grid gap-8 p-5 md:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:p-10">
                        <div className="order-2 text-white lg:order-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone="gold">{levelLabels[course.level] ?? course.level}</Badge>
                                {course.is_in_person && <Badge tone="green"><MapPin className="size-3.5" /> دوره حضوری</Badge>}
                                {course.certificate_enabled && <Badge tone="navy"><Award className="size-3.5" /> گواهینامه معتبر</Badge>}
                                {enrollment.is_enrolled && <span className="course-enrolled-badge"><CheckCircle2 className="size-3.5" /> در دوره شما</span>}
                            </div>
                            <h1 className="mt-5 max-w-2xl text-3xl font-black leading-[1.35] md:text-5xl md:leading-[1.3]">{course.title}</h1>
                            {course.subtitle && <p className="mt-4 max-w-2xl text-sm leading-8 text-white/70 md:text-base">{course.subtitle}</p>}
                            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-bold text-white/70 md:text-sm">
                                <span className="flex items-center gap-1.5"><Clock className="size-4 text-brand-300" /> {formatDuration(course.duration_minutes)}</span>
                                <span className="flex items-center gap-1.5"><PlayCircle className="size-4 text-brand-300" /> {formatNumber(totalLessons)} درس</span>
                                <span className="flex items-center gap-1.5"><Users className="size-4 text-brand-300" /> {formatNumber(course.students_count)} دانش‌آموز</span>
                                {course.rating_avg > 0 && <span className="flex items-center gap-1.5 text-gold"><Star className="size-4 fill-gold" /> {formatNumber(course.rating_avg)}</span>}
                            </div>
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('mentors_chat')}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#D6F39A] px-5 py-3 text-sm font-black text-[#123E30] transition-all hover:brightness-105"
                                >
                                    <MessageSquare className="size-4" aria-hidden />
                                    گفتگو با اساتید ۴ آیتم و گروه دوره
                                </button>
                                <Link href="#course-tabs" className="inline-flex items-center gap-2 rounded-2xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">بررسی محتوای دوره <ChevronLeft className="size-4" aria-hidden /></Link>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="course-detail-buy-card">
                                <div className="course-detail-cover relative overflow-hidden">
                                    {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="size-full object-cover" loading="eager" /> : <div className="flex size-full items-center justify-center bg-gradient-to-br from-brand-600 to-deep-green text-brand-200"><GraduationCap className="size-20" /></div>}
                                    <div className="absolute inset-0 bg-gradient-to-t from-deep-green/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs font-black text-white"><span className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md"><PlayCircle className="size-4" /></span>یادگیری گام‌به‌گام</div>
                                </div>
                                <div className="p-5 md:p-6">
                                    <div className="flex items-end justify-between gap-3">
                                        <div><span className="block text-xs font-bold text-navy/45">هزینه دسترسی کامل</span><strong className="mt-1 block text-2xl font-black text-navy">{formatPrice(finalPrice)}</strong></div>
                                        {hasDiscount && <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-black text-gold">ویژه</span>}
                                    </div>
                                    {hasDiscount && <div className="relative mt-2 inline-block text-lg font-bold text-navy/55" aria-label={`قیمت قبلی ${formatPrice(course.price)}`}><span>{formatPrice(course.price)}</span><span className="pointer-events-none absolute inset-x-[-0.25rem] top-1/2 h-0.5 -rotate-12 bg-red-600" aria-hidden="true" /></div>}
                                    <div className="mt-5">{enrollmentAction}</div>
                                    <div className="mt-4 flex items-center justify-between text-[0.68rem] font-bold text-navy/45"><span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-brand-600" /> دسترسی امن و دائمی</span><span>بدون ریسک</span></div>
                                    {enrollment.is_enrolled && <div className="course-progress-box mt-5"><div className="flex items-center justify-between text-xs font-black text-navy/65"><span>پیشرفت شما</span><span className="text-brand-700">{formatNumber(progress)}٪</span></div><div className="course-progress-track mt-2"><span style={{ width: `${progress}%` }} /></div><p className="mt-2 text-[0.68rem] font-bold text-navy/40">{progress === 100 ? 'دوره را کامل کرده‌اید' : 'هر قدم شما را به استقلال نزدیک‌تر می‌کند'}</p></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section id="course-tabs" className="course-tabs-wrap sticky top-[4.7rem] z-20 border-y border-navy/5 bg-white/90 backdrop-blur-xl md:top-[5.4rem]">
                <div className="container-site overflow-x-auto">
                    <div className="flex min-w-max items-center gap-1 py-2" role="tablist" aria-label="محتوای دوره">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.id;
                            return <button key={tab.id} type="button" role="tab" aria-selected={active} aria-controls={`course-panel-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`course-tab ${active ? 'is-active' : ''}`}><Icon className="size-4" aria-hidden />{tab.label}{tab.id === 'reviews' && <span className="course-tab-count">{formatNumber(reviews.length)}</span>}</button>;
                        })}
                    </div>
                </div>
            </section>

            <main className="container-site py-10 md:py-14">
                <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
                    <div className="min-w-0">
                        {activeTab === 'about' && <section id="course-panel-about" role="tabpanel" className="course-tab-panel">
                            <div className="hero-kicker"><span className="hero-kicker-line" /><span>درباره دوره</span></div>
                            <h2 className="mt-3 text-2xl font-black text-navy md:text-3xl">یک قدم روشن برای ساختن آینده</h2>
                            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-navy/65 md:text-base">{course.description || course.subtitle || 'در این دوره، مسیر یادگیری شما با محتوای کاربردی و تمرین‌های قابل اجرا طراحی شده است.'}</p>

                            {/* 4 Specialized Course Items & Dedicated Instructors */}
                            <div className="mt-8 rounded-3xl border border-brand-200/80 bg-white p-6 shadow-soft">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 pb-4">
                                    <div>
                                        <span className="text-xs font-black text-brand-700">ساختار ۴ آیتم تخصصی دوره با اساتید مجزا</span>
                                        <h3 className="mt-1 text-lg font-black text-navy">هر آیتم دوره، مدرس و اتاق گفتگوی اختصاصی دارد</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('mentors_chat')}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-black text-white transition hover:bg-brand-700"
                                    >
                                        <MessageSquare className="size-4" />
                                        ورود به اتاق گفتگو و گروه دوره
                                    </button>
                                </div>
                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    {defaultCourseItemsWithInstructors.map((item) => (
                                        <div key={item.itemId} className="flex flex-col justify-between rounded-2xl border border-navy/10 bg-[#fafbf7] p-4">
                                            <div>
                                                <div className="flex items-center justify-between gap-2 text-xs font-bold text-navy/55">
                                                    <span>{item.deliveryMode}</span>
                                                    <span>{formatNumber(item.lessonsCount)} جلسه · {item.duration}</span>
                                                </div>
                                                <h4 className="mt-2 text-sm font-black text-navy">{item.itemTitle}</h4>
                                                <p className="mt-1 text-xs leading-6 text-navy/65">{item.itemSubtitle}</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy/10 pt-3">
                                                <div className="min-w-0">
                                                    <div className="text-xs font-black text-brand-800">{item.instructorName}</div>
                                                    <div className="truncate text-[0.7rem] text-navy/55">{item.instructorRole}</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => openInstructorDirectChat(item.itemId)}
                                                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-xs font-black text-brand-700 transition hover:bg-brand-100"
                                                >
                                                    <MessageCircle className="size-3.5" />
                                                    گفتگو با مدرس
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {course.is_in_person && (
                                <div className="mt-8 rounded-3xl border border-brand-200 bg-brand-50/50 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="flex size-10 items-center justify-center rounded-2xl bg-brand-600 text-white"><MapPin className="size-5" /></span>
                                        <div>
                                            <h3 className="text-base font-black text-navy">دوره حضوری</h3>
                                            <p className="text-xs font-bold text-navy/50">اطلاعات محل و زمان برگزاری</p>
                                        </div>
                                    </div>
                                    
                                    {course.location && (
                                        <div className="flex items-start gap-3 mb-4 p-3 rounded-2xl bg-white/70">
                                            <MapPin className="size-4 mt-0.5 text-brand-600" />
                                            <div>
                                                <p className="text-xs font-black text-navy/70">محل برگزاری</p>
                                                <p className="text-sm font-bold text-navy">{course.location}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {course.in_person_description && (
                                        <div className="mb-4 p-3 rounded-2xl bg-white/70">
                                            <p className="text-xs font-black text-navy/70 mb-1">توضیحات</p>
                                            <p className="text-sm leading-7 text-navy/70">{course.in_person_description}</p>
                                        </div>
                                    )}
                                    
                                    {course.schedule && course.schedule.length > 0 && (
                                        <div className="p-3 rounded-2xl bg-white/70">
                                            <p className="text-xs font-black text-navy/70 mb-3">زمان‌بندی کلاس‌ها</p>
                                            <div className="flex flex-col gap-2">
                                                {course.schedule.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <span className="flex size-8 items-center justify-center rounded-xl bg-brand-100 text-brand-700 text-xs font-black">{index + 1}</span>
                                                        <div className="flex-1">
                                                            <span className="text-sm font-bold text-navy">{item.day}</span>
                                                            <span className="mr-2 text-xs text-navy/50">{item.time}</span>
                                                            {item.label && <span className="mr-2 text-xs text-navy/40">— {item.label}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {course.max_students && (
                                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-navy/60">
                                            <Users className="size-4" />
                                            <span>حداکثر ظرفیت: {course.max_students} نفر</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                {[
                                    { icon: CheckCircle2, title: 'محتوای کاربردی', text: 'یادگیری مرحله‌به‌مرحله برای استفاده در زندگی واقعی' },
                                    { icon: PlayCircle, title: 'دسترسی به تمام درس‌ها', text: `${formatNumber(totalLessons)} درس و ${formatDuration(course.duration_minutes)} محتوای آموزشی` },
                                    { icon: HeartHandshake, title: 'همراهی در مسیر', text: 'ساختار آموزشی روشن برای اینکه هیچ مرحله‌ای را گم نکنید' },
                                    { icon: BadgeCheck, title: course.certificate_enabled ? 'گواهینامه پایان دوره' : 'تمرین و ارزیابی', text: course.certificate_enabled ? 'پس از تکمیل دوره گواهینامه دریافت می‌کنید' : 'تمرین‌های هدفمند برای تثبیت یادگیری' },
                                ].map((item) => <div key={item.title} className="liquid-card flex gap-3 p-5"><span className="liquid-blob blob-a" aria-hidden /><span className="glass-tile"><item.icon className="size-5" aria-hidden /></span><div><h3 className="text-sm font-black text-navy">{item.title}</h3><p className="mt-1 text-xs leading-6 text-navy/55">{item.text}</p></div></div>)}
                            </div>
                            {course.faqs && course.faqs.length > 0 && <div className="mt-10"><div className="hero-kicker"><span className="hero-kicker-line" /><span>سوالات متداول</span></div><div className="mt-5 flex flex-col gap-3">{course.faqs.map((faq) => { const open = openFaq === faq.id; return <div key={faq.id} className="liquid-card overflow-hidden"><button type="button" onClick={() => setOpenFaq(open ? null : faq.id)} className="flex w-full items-center gap-3 p-4 text-right text-sm font-black text-navy" aria-expanded={open}><span className="flex-1">{faq.question}</span><ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <p className="border-t border-navy/5 px-4 pb-4 pt-3 text-sm leading-7 text-navy/60">{faq.answer}</p>}</div>; })}</div></div>}
                        </section>}

                        {activeTab === 'curriculum' && <section id="course-panel-curriculum" role="tabpanel" className="course-tab-panel">
                            <div className="hero-kicker"><span className="hero-kicker-line" /><span>نقشه یادگیری</span></div>
                            <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="mt-3 text-2xl font-black text-navy md:text-3xl">سرفصل‌های دوره و اساتید هر آیتم</h2><span className="text-xs font-bold text-navy/45">{formatNumber(course.modules.length)} فصل · {formatNumber(totalLessons)} درس</span></div>
                            <div className="mt-7 flex flex-col gap-4">{course.modules.map((module, index) => { const open = openModule === module.id; const assignedItem = defaultCourseItemsWithInstructors[index % defaultCourseItemsWithInstructors.length]; return <div key={module.id} className="liquid-card overflow-hidden"><span className="liquid-blob blob-b" aria-hidden /><div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-5"><button type="button" onClick={() => setOpenModule(open ? null : module.id)} className="flex flex-1 items-center gap-4 text-right" aria-expanded={open}><span className="glass-tile text-sm font-black">{formatNumber(index + 1)}</span><span className="flex-1"><span className="block text-sm font-black text-navy">{module.title}</span><span className="mt-1 block text-xs text-navy/50">{formatNumber(module.lessons.length)} درس · مدرس آیتم: {assignedItem.instructorName}</span></span><ChevronDown className={`size-5 text-navy/40 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden /></button><button type="button" onClick={() => openInstructorDirectChat(assignedItem.itemId)} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-xs font-black text-brand-700 hover:bg-brand-100"><MessageCircle className="size-3.5" /> چت با {assignedItem.instructorName}</button></div>{open && <ul className="relative z-10 border-t border-navy/5 px-5 pb-4 pt-2">{module.lessons.map((lesson, lessonIndex) => <li key={lesson.id} className="flex items-center gap-3 border-b border-navy/5 py-3 last:border-0"><span className="flex size-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><PlayCircle className="size-4" aria-hidden /></span><span className="flex-1 text-sm font-bold text-navy/75">{lesson.is_free ? <Link href={`/dashboard/courses/${course.slug}/learn/${lesson.id}`} className="hover:text-brand-700">{lesson.title}</Link> : lesson.title}</span>{lesson.is_free && <Badge tone="green">رایگان</Badge>}<span className="text-xs text-navy/40">{lesson.duration_minutes ? formatDuration(lesson.duration_minutes) : formatNumber(lessonIndex + 1)}</span></li>)}</ul>}</div>; })}</div>
                        </section>}

                        {activeTab === 'mentors_chat' && (
                            <section id="course-panel-mentors-chat" role="tabpanel" className="course-tab-panel space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="hero-kicker"><span className="hero-kicker-line" /><span>ارتباط مستقیم آموزشی</span></div>
                                        <h2 className="mt-2 text-2xl font-black text-navy md:text-3xl">گفتگو با اساتید ۴ آیتم، گروه دوره و پشتیبانی</h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setGroupChatEnabled((v) => !v)}
                                        className="rounded-xl border border-navy/15 bg-white px-3.5 py-2 text-xs font-bold text-navy/75 hover:bg-navy/5"
                                    >
                                        وضعیت چت گروهی: {groupChatEnabled ? 'فعال برای دانش‌پذیران' : 'قفل توسط ادمین'}
                                    </button>
                                </div>

                                {/* 3-Channel Selector */}
                                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-1.5 shadow-soft border border-navy/10">
                                    <button
                                        type="button"
                                        onClick={() => setChatChannel('instructor')}
                                        className={`rounded-xl py-2.5 text-xs font-black transition ${
                                            chatChannel === 'instructor'
                                                ? 'bg-[#123E30] text-[#D6F39A] shadow-sm'
                                                : 'text-navy/65 hover:text-navy'
                                        }`}
                                    >
                                        گفتگو با مدرس آیتم (۴ استاد)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setChatChannel('group')}
                                        className={`rounded-xl py-2.5 text-xs font-black transition ${
                                            chatChannel === 'group'
                                                ? 'bg-[#123E30] text-[#D6F39A] shadow-sm'
                                                : 'text-navy/65 hover:text-navy'
                                        }`}
                                    >
                                        گروه دوره {groupChatEnabled ? '' : '(قفل)'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setChatChannel('support')}
                                        className={`rounded-xl py-2.5 text-xs font-black transition ${
                                            chatChannel === 'support'
                                                ? 'bg-[#123E30] text-[#D6F39A] shadow-sm'
                                                : 'text-navy/65 hover:text-navy'
                                        }`}
                                    >
                                        پشتیبانی کلی دوره
                                    </button>
                                </div>

                                {/* Instructor Selector when in 'instructor' mode */}
                                {chatChannel === 'instructor' && (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {defaultCourseItemsWithInstructors.map((item) => {
                                            const selected = item.itemId === activeCourseItem.itemId;
                                            return (
                                                <button
                                                    key={item.itemId}
                                                    type="button"
                                                    onClick={() => setSelectedItemId(item.itemId)}
                                                    className={`flex items-center justify-between rounded-2xl border p-4 text-right transition ${
                                                        selected
                                                            ? 'border-brand-600 bg-brand-50/70 shadow-sm'
                                                            : 'border-navy/10 bg-white hover:border-brand-300'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="text-xs font-black text-brand-700">{item.instructorName}</div>
                                                        <div className="mt-0.5 text-xs font-bold text-navy">{item.itemTitle}</div>
                                                        <div className="mt-1 text-[0.7rem] text-navy/55">{item.instructorStatus}</div>
                                                    </div>
                                                    <MessageCircle className={`size-5 shrink-0 ${selected ? 'text-brand-700' : 'text-navy/30'}`} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Chat Messages Box */}
                                <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-soft">
                                    <div className="flex items-center justify-between border-b border-navy/10 bg-[#123E30] px-5 py-4 text-white">
                                        <div>
                                            <div className="text-sm font-black">
                                                {chatChannel === 'instructor'
                                                    ? `${activeCourseItem.instructorName} · ${activeCourseItem.itemTitle}`
                                                    : chatChannel === 'group'
                                                    ? 'گروه رسمی دوره طراحی آینده نوجوان (اساتید و دانش‌پذیران)'
                                                    : 'پشتیبانی جامع دوره (خانم سعیدی)'}
                                            </div>
                                            <div className="mt-0.5 text-xs text-[#D6F39A]">
                                                {chatChannel === 'instructor'
                                                    ? activeCourseItem.instructorStatus
                                                    : chatChannel === 'group'
                                                    ? groupChatEnabled
                                                        ? 'گفتگوی گروهی فعال است'
                                                        : 'فقط مشاهده اطلاعیه‌ها و پیام‌های اساتید'
                                                    : 'پاسخگویی به امور اجرایی، جلسات و دسترسی‌ها'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="max-h-96 space-y-3 overflow-y-auto p-5 bg-[#fafbf7]">
                                        {currentChatMessages.map((msg) => {
                                            const isStudent = msg.sender === 'student';
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex flex-col ${isStudent ? 'items-start' : 'items-end'}`}
                                                >
                                                    <div
                                                        className={`max-w-xl rounded-2xl p-4 text-xs leading-6 ${
                                                            isStudent
                                                                ? 'bg-[#123E30] text-white'
                                                                : 'border border-navy/10 bg-white text-navy'
                                                        }`}
                                                    >
                                                        <div className="mb-1 flex items-center justify-between gap-4 font-black">
                                                            <span>{msg.senderName}</span>
                                                            <span className="text-[0.68rem] opacity-65">{msg.time}</span>
                                                        </div>
                                                        <p>{msg.text}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-navy/10 bg-white p-4">
                                        {!sendPermission.allowed ? (
                                            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">
                                                <Lock className="size-4 shrink-0" />
                                                <span>{sendPermission.reason}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={chatDraft}
                                                    onChange={(e) => setChatDraft(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSendChatMessage();
                                                    }}
                                                    placeholder="پیام یا پرسش خود را بنویسید..."
                                                    aria-label="متن پیام گفتگو"
                                                    className="flex-1 rounded-xl border border-navy/15 bg-[#fafbf7] px-4 py-3 text-xs text-navy outline-none focus:border-brand-600"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleSendChatMessage}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#123E30] px-5 py-3 text-xs font-black text-[#D6F39A] transition hover:brightness-110"
                                                >
                                                    <Send className="size-4" />
                                                    ارسال پیام
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'instructor' && <section id="course-panel-instructor" role="tabpanel" className="course-tab-panel space-y-6">
                            <div>
                                <div className="hero-kicker"><span className="hero-kicker-line" /><span>راهبر اصلی و تیم اساتید</span></div>
                                <h2 className="mt-3 text-2xl font-black text-navy md:text-3xl">راهبر دوره و ۴ استاد تخصصی آیتم‌ها</h2>
                            </div>
                            <div className="liquid-card relative overflow-hidden p-6 md:p-8"><span className="liquid-blob blob-a" aria-hidden /><div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start"><Avatar name={instructorName} avatar={course.instructor?.user?.avatar} large /><div className="flex-1"><h3 className="text-xl font-black text-navy">{instructorName}</h3><p className="mt-1 text-sm font-bold text-brand-700">{course.instructor?.specialty || 'راهبر اصلی دوره و مؤسس مرکز رشد و کارآفرینی'}</p><div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-navy/50">{course.instructor?.experience_years ? <span className="rounded-full bg-soft-gray px-3 py-1.5">{formatNumber(course.instructor.experience_years)} سال تجربه</span> : null}<span className="rounded-full bg-soft-gray px-3 py-1.5">{formatNumber(course.students_count)} دانش‌آموز همراه</span></div></div></div>{course.instructor?.bio && <p className="relative z-10 mt-6 border-t border-navy/5 pt-5 text-sm leading-8 text-navy/60">{course.instructor.bio}</p>}</div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {defaultCourseItemsWithInstructors.map((item) => (
                                    <div key={item.itemId} className="rounded-3xl border border-navy/10 bg-white p-5 shadow-soft flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs font-black text-brand-700">{item.itemTitle}</span>
                                            <h3 className="mt-1 text-base font-black text-navy">{item.instructorName}</h3>
                                            <p className="mt-1 text-xs font-bold text-navy/60">{item.instructorRole}</p>
                                            <p className="mt-2 text-xs text-navy/55">{item.itemSubtitle}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => openInstructorDirectChat(item.itemId)}
                                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#123E30] px-4 py-2.5 text-xs font-black text-[#D6F39A] transition hover:brightness-110"
                                        >
                                            <MessageCircle className="size-4" />
                                            گفتگوی مستقیم با {item.instructorName}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>}

                        {activeTab === 'reviews' && <section id="course-panel-reviews" role="tabpanel" className="course-tab-panel">
                            <div className="hero-kicker"><span className="hero-kicker-line" /><span>تجربه یادگیرندگان</span></div>
                            <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="mt-3 text-2xl font-black text-navy md:text-3xl">نظرات دانش‌آموزان</h2><p className="mt-1 text-xs font-bold text-navy/40">{formatNumber(review_summary.count)} نظر ثبت‌شده</p></div>{review_summary.average > 0 && <div className="flex items-center gap-2 text-gold"><Star className="size-5 fill-gold" /><strong className="text-xl">{formatNumber(review_summary.average)}</strong><span className="text-xs font-bold text-navy/40">از ۵</span></div>}</div>
                            <div className="mt-7"><ReviewComposer action={`/courses/${course.slug}/reviews`} canReview={can_review} isAuthenticated={Boolean(auth?.user)} existingReview={my_review} subjectLabel="این دوره" /></div>
                            {reviews.length > 0 ? <div className="mt-7 grid gap-4">{reviews.map((review) => <article key={review.id} className="liquid-card p-5"><span className="liquid-blob blob-b" aria-hidden /><div className="relative z-10 flex items-center gap-3"><Avatar name={review.name} avatar={review.avatar} /><div><h3 className="text-sm font-black text-navy">{review.name}</h3><div className="mt-1 flex items-center gap-1 text-gold">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`size-3.5 ${index < review.rating ? 'fill-gold' : 'text-navy/15'}`} aria-hidden />)}<span className="mr-1 text-[0.68rem] font-bold text-navy/40">{formatDate(review.created_at)}</span></div></div></div>{review.title && <h4 className="relative z-10 mt-4 text-sm font-black text-navy">{review.title}</h4>}{review.body && <p className="relative z-10 mt-2 text-sm leading-7 text-navy/60">{review.body}</p>}</article>)}</div> : <div className="liquid-card mt-7 flex flex-col items-center p-10 text-center"><span className="glass-tile glass-tile-lg"><MessageCircle className="size-6" /></span><h3 className="mt-4 text-base font-black text-navy">هنوز نظری ثبت نشده است</h3><p className="mt-2 text-sm text-navy/50">اولین تجربه این دوره را شما ثبت کنید.</p></div>}
                        </section>}
                    </div>

                    <aside className="hidden lg:block"><div className="course-detail-side-card sticky top-32"><div className="flex items-center gap-3"><span className="glass-tile"><HeartHandshake className="size-5" /></span><div><p className="text-xs font-bold text-navy/45">آماده شروع هستید؟</p><h3 className="text-sm font-black text-navy">مسیر رشد شما از اینجا شروع می‌شود</h3></div></div><div className="mt-5">{enrollmentAction}</div>{enrollment.is_enrolled && <div className="mt-5"><div className="flex justify-between text-xs font-black text-navy/55"><span>پیشرفت دوره</span><span className="text-brand-700">{formatNumber(progress)}٪</span></div><div className="course-progress-track mt-2"><span style={{ width: `${progress}%` }} /></div></div>}                            <div className="mt-5 space-y-3 border-t border-navy/5 pt-5 text-xs font-bold text-navy/50"><div className="flex items-center gap-2"><ShieldCheck className="size-4 text-brand-600" /> دسترسی مادام‌العمر به دوره</div><div className="flex items-center gap-2"><Award className="size-4 text-gold" /> {course.certificate_enabled ? 'گواهینامه پایان دوره' : 'تمرین‌های کاربردی'}</div><div className="flex items-center gap-2"><HeartHandshake className="size-4 text-brand-600" /> همراهی در مسیر یادگیری</div>{course.is_in_person && <div className="flex items-center gap-2"><MapPin className="size-4 text-brand-600" /> برگزاری حضوری</div>}</div></div></aside>
                </div>
            </main>

            {related.length > 0 && <section className="relative overflow-hidden bg-soft-gray py-12 md:py-16"><div className="ambient ambient-teal ambient-a" aria-hidden /><div className="container-site relative"><div className="flex items-end justify-between gap-4"><div><div className="hero-kicker"><span className="hero-kicker-line" /><span>دوره‌های مشابه</span></div><h2 className="mt-3 text-2xl font-black text-navy">ادامه مسیر یادگیری</h2></div><Link href="/courses" className="text-sm font-bold text-brand-700 hover:text-brand-800">همه دوره‌ها ←</Link></div><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <CourseCard key={item.id} course={item} />)}</div></div></section>}
        </div>
    );
}

CourseShow.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;
