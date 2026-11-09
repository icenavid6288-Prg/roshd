import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Crown,
    ExternalLink,
    Lock,
    Plus,
    Save,
    Sparkles,
    Trash2,
    UserCheck,
    Users,
    Video,
} from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { toFa } from '@/lib/format';
import {
    saveCourseInState,
    toggleVipActivationInState,
    useDynamicAppStore,
    type DynamicLessonItem,
    type DynamicVipFeature,
    type DynamicVipSession,
} from '@/lib/dynamicAppStore';
import type { CourseItemInstructor } from '@/lib/mobileAppLogic';

export default function CourseForm() {
    const pageUrl = usePage().url || (typeof window !== 'undefined' ? window.location.pathname : '');
    const match = pageUrl.match(/\/admin\/courses\/([^/?#]+)\/edit/);
    const editId = match ? Number(match[1]) : null;

    const { appState, updateAppState } = useDynamicAppStore();
    const {
        courses,
        lessons,
        enrolledCourseSlugs,
        vipConfig,
        courseItems,
        vipFeatures,
        vipSessions,
        groupChatEnabled,
    } = appState;

    const existingCourse =
        editId !== null
            ? courses.find((c) => c.id === editId) || courses[0]
            : null;

    const isEdit = existingCourse !== null;

    const [title, setTitle] = useState(existingCourse?.title ?? '');
    const [subtitle, setSubtitle] = useState(
        existingCourse?.subtitle ?? existingCourse?.summary ?? ''
    );
    const [slug, setSlug] = useState(existingCourse?.slug ?? '');
    const [description, setDescription] = useState(existingCourse?.description ?? '');
    const [category, setCategory] = useState(
        existingCourse?.category ?? 'نوجوانان و والدین'
    );
    const [level, setLevel] = useState(existingCourse?.level ?? 'پریمیوم VIP');
    const [deliveryMode, setDeliveryMode] = useState(
        existingCourse?.delivery_mode ?? 'حضوری + مجازی (ترکیبی)'
    );
    const [instructorName, setInstructorName] = useState(
        existingCourse?.instructor?.name ?? '۴ مدرس تخصصی (دکتر بیدی و اساتید آیتم‌ها)'
    );
    const [instructorTitle, setInstructorTitle] = useState(
        existingCourse?.instructor?.title ??
            'تیم اساتید خودشناسی، هدف‌گذاری، ارتباطات و کارآفرینی'
    );
    const [price, setPrice] = useState<number>(existingCourse?.price ?? 6800000);
    const [discountPrice, setDiscountPrice] = useState<string>(
        existingCourse?.discount_price !== null &&
            existingCourse?.discount_price !== undefined
            ? String(existingCourse.discount_price)
            : ''
    );
    const [durationMinutes, setDurationMinutes] = useState<number>(
        existingCourse?.duration_minutes ?? 2400
    );
    const [thumbnail, setThumbnail] = useState(
        existingCourse?.thumbnail ?? '/images/vip-teen-future.svg'
    );
    const [posterTag, setPosterTag] = useState(
        existingCourse?.posterTag ?? vipConfig.posterBadge ?? 'پوستر رسمی دوره VIP'
    );
    const [isPublished, setIsPublished] = useState<boolean>(
        existingCourse?.is_published ?? true
    );
    const [isFeatured, setIsFeatured] = useState<boolean>(
        existingCourse?.is_featured ?? true
    );
    const [certificateEnabled, setCertificateEnabled] = useState<boolean>(
        existingCourse?.certificate_enabled ?? true
    );
    const [isInPerson, setIsInPerson] = useState<boolean>(
        existingCourse?.is_in_person ?? true
    );
    const [isVip, setIsVip] = useState<boolean>(existingCourse?.is_vip ?? false);
    const [location, setLocation] = useState(
        existingCourse?.location ?? vipConfig.inPersonLocation
    );
    const [onlinePlatform, setOnlinePlatform] = useState(
        existingCourse?.online_platform ?? vipConfig.onlinePlatform
    );
    const [scheduleSummary, setScheduleSummary] = useState(
        existingCourse?.schedule_summary ?? vipConfig.scheduleSummary
    );
    const [maxStudents, setMaxStudents] = useState<number>(
        existingCourse?.max_students ?? vipConfig.capacity ?? 30
    );

    // Local draft of 4 specialized items, VIP features, VIP sessions, and video/audio lessons
    const [itemsDraft, setItemsDraft] = useState<CourseItemInstructor[]>(courseItems);
    const [featuresDraft, setFeaturesDraft] = useState<DynamicVipFeature[]>(vipFeatures);
    const [newFeatureTitle, setNewFeatureTitle] = useState('');
    const [sessionsDraft, setSessionsDraft] = useState<DynamicVipSession[]>(vipSessions);
    const [newSessionTitle, setNewSessionTitle] = useState('');
    const [newSessionMode, setNewSessionMode] = useState<'in_person' | 'online'>('in_person');
    const [newSessionDate, setNewSessionDate] = useState('سه‌شنبه ۱۶ اردیبهشت ۱۴۰۴');
    const [newSessionTime, setNewSessionTime] = useState('۱۷:۰۰ تا ۱۹:۰۰');
    const [lessonsDraft, setLessonsDraft] = useState<DynamicLessonItem[]>(lessons);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [newLessonDuration, setNewLessonDuration] = useState('۴۵ دقیقه');
    const [newLessonSummary, setNewLessonSummary] = useState('');
    const [newLessonFree, setNewLessonFree] = useState(false);
    const [groupChatActive, setGroupChatActive] = useState<boolean>(groupChatEnabled);

    const [savedMessage, setSavedMessage] = useState<string | null>(null);
    const isVipEnrolled = enrolledCourseSlugs.includes('designing-teen-future-vip');

    // Keep form synced if store hydrates after mount
    useEffect(() => {
        if (existingCourse) {
            setTitle(existingCourse.title);
            setSubtitle(existingCourse.subtitle ?? existingCourse.summary ?? '');
            setSlug(existingCourse.slug);
            setDescription(existingCourse.description);
            setCategory(existingCourse.category);
            setLevel(existingCourse.level);
            setDeliveryMode(existingCourse.delivery_mode);
            setInstructorName(existingCourse.instructor?.name ?? '');
            setInstructorTitle(existingCourse.instructor?.title ?? '');
            setPrice(existingCourse.price);
            setDiscountPrice(
                existingCourse.discount_price !== null &&
                    existingCourse.discount_price !== undefined
                    ? String(existingCourse.discount_price)
                    : ''
            );
            setDurationMinutes(existingCourse.duration_minutes ?? 2400);
            setThumbnail(existingCourse.thumbnail);
            setPosterTag(existingCourse.posterTag || vipConfig.posterBadge);
            setIsPublished(existingCourse.is_published);
            setIsFeatured(existingCourse.is_featured);
            setCertificateEnabled(existingCourse.certificate_enabled);
            setIsInPerson(existingCourse.is_in_person);
            setIsVip(existingCourse.is_vip);
            setLocation(existingCourse.location || vipConfig.inPersonLocation);
            setOnlinePlatform(existingCourse.online_platform || vipConfig.onlinePlatform);
            setScheduleSummary(
                existingCourse.schedule_summary || vipConfig.scheduleSummary
            );
            setMaxStudents(existingCourse.max_students ?? vipConfig.capacity ?? 30);
        }
    }, [existingCourse?.id]);

    const handleItemChange = (
        itemId: number,
        field: keyof CourseItemInstructor,
        value: string
    ) => {
        setItemsDraft((prev) =>
            prev.map((it) => (it.itemId === itemId ? { ...it, [field]: value } : it))
        );
    };

    const handleAddFeature = () => {
        if (!newFeatureTitle.trim()) return;
        setFeaturesDraft((prev) => [
            ...prev,
            { id: Date.now(), title: newFeatureTitle.trim(), active: true },
        ]);
        setNewFeatureTitle('');
    };

    const handleToggleFeature = (id: number) => {
        setFeaturesDraft((prev) =>
            prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
        );
    };

    const handleDeleteFeature = (id: number) => {
        setFeaturesDraft((prev) => prev.filter((f) => f.id !== id));
    };

    const handleAddSession = () => {
        if (!newSessionTitle.trim()) return;
        const nextNum = sessionsDraft.length + 1;
        const created: DynamicVipSession = {
            id: Date.now(),
            number: nextNum,
            title: newSessionTitle.trim(),
            mode: newSessionMode,
            date: newSessionDate.trim() || 'هفته آینده',
            time: newSessionTime.trim() || '۱۷:۰۰ تا ۱۹:۰۰',
            locationOrLink:
                newSessionMode === 'in_person' ? location : onlinePlatform,
            status: 'upcoming',
            reminderSent: false,
        };
        setSessionsDraft((prev) => [...prev, created]);
        setNewSessionTitle('');
    };

    const handleDeleteSession = (id: number) => {
        setSessionsDraft((prev) =>
            prev
                .filter((s) => s.id !== id)
                .map((s, idx) => ({ ...s, number: idx + 1 }))
        );
    };

    const handleAddLesson = () => {
        if (!newLessonTitle.trim()) return;
        const nextNum = lessonsDraft.length + 1;
        const created: DynamicLessonItem = {
            id: Date.now(),
            courseSlug: slug.trim() || existingCourse?.slug || 'designing-teen-future-vip',
            number: nextNum,
            title: newLessonTitle.trim(),
            duration: newLessonDuration.trim() || '۴۵ دقیقه',
            videoSummary:
                newLessonSummary.trim() ||
                `محتوای آموزشی و تمرین عملی جلسه ${toFa(nextNum)}: ${newLessonTitle.trim()}`,
            is_free: newLessonFree,
            completed: false,
            note: '',
        };
        setLessonsDraft((prev) => [...prev, created]);
        setNewLessonTitle('');
        setNewLessonSummary('');
        setNewLessonFree(false);
    };

    const handleToggleLessonFree = (id: number) => {
        setLessonsDraft((prev) =>
            prev.map((l) => (l.id === id ? { ...l, is_free: !l.is_free } : l))
        );
    };

    const handleDeleteLesson = (id: number) => {
        setLessonsDraft((prev) =>
            prev
                .filter((l) => l.id !== id)
                .map((l, idx) => ({ ...l, number: idx + 1 }))
        );
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Build updated modules from the 4 specialized items if VIP
        const syncedModules = isVip
            ? itemsDraft.map((it, idx) => ({
                  id: it.itemId,
                  title: it.itemTitle,
                  instructorName: it.instructorName,
                  instructorRole: it.instructorRole,
                  lessons: existingCourse?.modules?.[idx]?.lessons ?? [
                      {
                          id: 100 + it.itemId,
                          title: `کارگاه تخصصی ${it.itemTitle}`,
                          duration: '۱۲۰ دقیقه',
                          is_free: idx === 0,
                      },
                  ],
              }))
            : existingCourse?.modules ?? [];

        updateAppState((prev) => {
            const withSavedCourse = saveCourseInState(prev, {
                id: existingCourse?.id,
                title: title.trim(),
                subtitle: subtitle.trim(),
                summary: subtitle.trim() || title.trim(),
                slug: slug.trim() || existingCourse?.slug || `course-${Date.now()}`,
                description: description.trim(),
                category,
                level,
                delivery_mode: deliveryMode,
                price: Number(price) || 0,
                discount_price:
                    discountPrice === '' ? null : Number(discountPrice),
                duration_minutes: Number(durationMinutes) || 1200,
                duration: `${Math.max(1, Math.round((Number(durationMinutes) || 1200) / 60))} ساعت`,
                thumbnail: thumbnail.trim() || '/images/vip-teen-future.svg',
                poster: thumbnail.trim() || '/images/vip-teen-future.svg',
                posterTag: posterTag.trim() || 'پوستر رسمی دوره VIP',
                is_published: isPublished,
                is_featured: isFeatured,
                certificate_enabled: certificateEnabled,
                is_in_person: isInPerson,
                is_vip: isVip,
                location: location.trim(),
                online_platform: onlinePlatform.trim(),
                schedule_summary: scheduleSummary.trim(),
                max_students: Number(maxStudents) || 30,
                lessons_count: lessonsDraft.length,
                instructors_count: isVip ? itemsDraft.length : 1,
                instructor: {
                    id: existingCourse?.instructor?.id ?? 1,
                    name: instructorName.trim() || 'دکتر علیرضا بیدی',
                    title: instructorTitle.trim() || 'مدرس و راهبر مرکز رشد',
                    avatar: existingCourse?.instructor?.avatar || '/images/brand-logo.png',
                },
                modules: syncedModules,
            });

            if (isVip || existingCourse?.id === 100) {
                return {
                    ...withSavedCourse,
                    lessons: lessonsDraft,
                    courseItems: itemsDraft,
                    vipFeatures: featuresDraft,
                    vipSessions: sessionsDraft,
                    groupChatEnabled: groupChatActive,
                };
            }
            return {
                ...withSavedCourse,
                lessons: lessonsDraft,
            };
        });

        setSavedMessage(
            `تغییرات دوره «${title.trim()}» با موفقیت ذخیره شد و هم‌اکنون در سایت و اپلیکیشن فعال است.`
        );
        setTimeout(() => {
            setSavedMessage(null);
        }, 4500);
    };

    const inputCls =
        'w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200';

    const targetSlug = slug.trim() || existingCourse?.slug || 'designing-teen-future-vip';

    return (
        <form onSubmit={submit} className="flex flex-col gap-6" dir="rtl">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy/5">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/courses"
                        className="inline-flex items-center gap-2 text-sm font-bold text-navy/60 hover:text-brand-700"
                    >
                        <ArrowRight className="size-4" /> بازگشت به لیست دوره‌ها
                    </Link>
                    {isVip && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                            <Crown className="size-3.5" />
                            <span>دوره پرچمدار پریمیوم VIP</span>
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                        href={`/courses/${targetSlug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-navy/10 bg-soft-gray px-3.5 py-2.5 text-xs font-bold text-navy transition hover:bg-brand-50 hover:text-brand-700"
                    >
                        <span>مشاهده در سایت</span>
                        <ExternalLink className="size-3.5" />
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-navy/10 bg-soft-gray px-3.5 py-2.5 text-xs font-bold text-navy transition hover:bg-brand-50 hover:text-brand-700"
                    >
                        <span>مشاهده در اپلیکیشن</span>
                        <ExternalLink className="size-3.5" />
                    </Link>
                    <Button type="submit">
                        <Save className="size-4" aria-hidden />
                        {isEdit ? 'ذخیره تغییرات در سایت و اپ' : 'ایجاد و انتشار دوره'}
                    </Button>
                </div>
            </div>

            {savedMessage && (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-900 px-5 py-3.5 text-xs font-bold text-white shadow-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-[#D6F39A] shrink-0" />
                        <span>{savedMessage}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={`/courses/${targetSlug}`}
                            className="rounded-lg bg-white/15 px-3 py-1.5 text-[11px] font-black text-white hover:bg-white/25"
                        >
                            مشاهده صفحه دوره ←
                        </Link>
                    </div>
                </div>
            )}

            {/* Section 1: Main Course Info */}
            <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                <h2 className="mb-5 flex items-center gap-2 text-sm font-black text-navy">
                    <Sparkles className="size-4 text-brand-600" />
                    <span>اطلاعات اصلی دوره</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            عنوان دوره *
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputCls}
                            required
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            زیرعنوان و خلاصه معرفی دوره
                        </label>
                        <input
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            اسلاگ مسیر سایت (Slug)
                        </label>
                        <input
                            value={slug}
                            dir="ltr"
                            onChange={(e) => setSlug(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            دسته‌بندی دوره
                        </label>
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            سطح دوره
                        </label>
                        <input
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className={inputCls}
                            placeholder="مثلاً: پریمیوم VIP یا پیشرفته"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            نحوه برگزاری
                        </label>
                        <input
                            value={deliveryMode}
                            onChange={(e) => setDeliveryMode(e.target.value)}
                            className={inputCls}
                            placeholder="مثلاً: حضوری + مجازی (ترکیبی)"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            عنوان مدرس / تیم اساتید
                        </label>
                        <input
                            value={instructorName}
                            onChange={(e) => setInstructorName(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            تخصص مدرس / تیم علمی
                        </label>
                        <input
                            value={instructorTitle}
                            onChange={(e) => setInstructorTitle(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            توضیحات کامل دوره
                        </label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Pricing & Poster */}
            <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                <h2 className="mb-5 text-sm font-black text-navy">شهریه، تخفیف و پوستر دوره</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            شهریه اصلی (تومان) *
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            شهریه با تخفیف (تومان)
                        </label>
                        <input
                            type="number"
                            value={discountPrice}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                            className={inputCls}
                            placeholder="در صورت عدم تخفیف خالی بگذارید"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            مدت دوره (دقیقه)
                        </label>
                        <input
                            type="number"
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(Number(e.target.value))}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            برچسب روی پوستر دوره (Poster Badge)
                        </label>
                        <input
                            value={posterTag}
                            onChange={(e) => setPosterTag(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-bold text-navy/70">
                            آدرس تصویر / پوستر دوره (URL)
                        </label>
                        <div className="flex items-center gap-3">
                            {thumbnail && (
                                <img
                                    src={thumbnail}
                                    alt="پوستر دوره"
                                    className="size-14 rounded-xl object-cover border border-navy/10 shrink-0"
                                />
                            )}
                            <input
                                value={thumbnail}
                                dir="ltr"
                                onChange={(e) => setThumbnail(e.target.value)}
                                className={inputCls}
                                placeholder="/images/vip-teen-future.svg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Status Flags */}
            <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                <h2 className="mb-5 text-sm font-black text-navy">وضعیت و نوع دوره</h2>
                <div className="flex flex-wrap gap-6">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-navy/80">
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="size-4 rounded border-navy/20 text-brand-600 focus:ring-brand-500"
                        />
                        منتشرشده در سایت و اپ
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-navy/80">
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="size-4 rounded border-navy/20 text-brand-600 focus:ring-brand-500"
                        />
                        دوره ویژه (نمایش در ویترین)
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-navy/80">
                        <input
                            type="checkbox"
                            checked={certificateEnabled}
                            onChange={(e) => setCertificateEnabled(e.target.checked)}
                            className="size-4 rounded border-navy/20 text-brand-600 focus:ring-brand-500"
                        />
                        صدور گواهینامه پایان دوره
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-navy/80">
                        <input
                            type="checkbox"
                            checked={isInPerson}
                            onChange={(e) => setIsInPerson(e.target.checked)}
                            className="size-4 rounded border-navy/20 text-brand-600 focus:ring-brand-500"
                        />
                        دارای جلسات حضوری
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-black text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                        <input
                            type="checkbox"
                            checked={isVip}
                            onChange={(e) => setIsVip(e.target.checked)}
                            className="size-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                        />
                        <Crown className="size-4 text-amber-600" />
                        <span>دوره پریمیوم VIP (دارای ۴ آیتم تخصصی، چت اساتید و باشگاه VIP)</span>
                    </label>
                </div>
            </section>

            {/* Section 4: In-Person & Schedule Config */}
            {(isInPerson || isVip) && (
                <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                    <h2 className="mb-5 text-sm font-black text-navy">
                        تنظیمات محل برگزاری، پلتفرم آنلاین و زمان‌بندی کلاس‌ها
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-bold text-navy/70">
                                آدرس محل برگزاری جلسات حضوری
                            </label>
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-navy/70">
                                پلتفرم برگزاری جلسات آنلاین
                            </label>
                            <input
                                value={onlinePlatform}
                                onChange={(e) => setOnlinePlatform(e.target.value)}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-navy/70">
                                حداکثر ظرفیت دوره (نفر)
                            </label>
                            <input
                                type="number"
                                value={maxStudents}
                                onChange={(e) => setMaxStudents(Number(e.target.value))}
                                className={inputCls}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-bold text-navy/70">
                                خلاصه برنامه زمانی کلاس‌ها (نمایش در کارت دوره و باشگاه VIP)
                            </label>
                            <input
                                value={scheduleSummary}
                                onChange={(e) => setScheduleSummary(e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Section 5: VIP Course Specialized 4 Items & Instructors, Group Chat, Features & Sessions */}
            {isVip && (
                <>
                    {/* 4 Specialized Course Items & Instructors */}
                    <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-sm font-black text-navy">
                                    <UserCheck className="size-4 text-brand-600" />
                                    <span>مدیریت ۴ آیتم تخصصی دوره و اساتید هر آیتم</span>
                                </h2>
                                <p className="mt-1 text-xs text-navy/55">
                                    هر تغییری در عنوان آیتم‌ها یا نام اساتید، بلافاصله در سرفصل‌های سایت، چت اختصاصی با اساتید و اپلیکیشن اعمال می‌شود.
                                </p>
                            </div>

                            {/* Group Chat Lock Toggle */}
                            <button
                                type="button"
                                onClick={() => setGroupChatActive((prev) => !prev)}
                                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition ${
                                    groupChatActive
                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                        : 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
                                }`}
                            >
                                {groupChatActive ? (
                                    <>
                                        <Users className="size-4" />
                                        <span>گروه گفتگوی دوره: فعال برای دانش‌پذیران</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="size-4" />
                                        <span>گروه گفتگوی دوره: قفل توسط ادمین</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {itemsDraft.map((item, idx) => (
                                <div
                                    key={item.itemId}
                                    className="rounded-2xl border border-navy/10 bg-soft-gray/40 p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-100 px-2.5 py-1 text-xs font-black text-brand-800">
                                            آیتم {toFa(idx + 1)} دوره VIP
                                        </span>
                                        <span className="text-[11px] font-bold text-navy/45">
                                            چت مستقیم استاد فعال
                                        </span>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-bold text-navy/65">
                                            عنوان آیتم تخصصی
                                        </label>
                                        <input
                                            value={item.itemTitle}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    item.itemId,
                                                    'itemTitle',
                                                    e.target.value
                                                )
                                            }
                                            className={inputCls}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold text-navy/65">
                                                نام استاد آیتم
                                            </label>
                                            <input
                                                value={item.instructorName}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        item.itemId,
                                                        'instructorName',
                                                        e.target.value
                                                    )
                                                }
                                                className={inputCls}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold text-navy/65">
                                                تخصص / سمت استاد
                                            </label>
                                            <input
                                                value={item.instructorRole}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        item.itemId,
                                                        'instructorRole',
                                                        e.target.value
                                                    )
                                                }
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-bold text-navy/65">
                                            زیرعنوان و جزئیات این آیتم
                                        </label>
                                        <input
                                            value={item.itemSubtitle}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    item.itemId,
                                                    'itemSubtitle',
                                                    e.target.value
                                                )
                                            }
                                            className={inputCls}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* VIP Features Management */}
                    <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 space-y-4">
                        <h2 className="text-sm font-black text-navy">
                            امکانات و ویژگی‌های اختصاصی دوره VIP ({toFa(featuresDraft.length)} مورد)
                        </h2>
                        <div className="flex gap-2">
                            <input
                                value={newFeatureTitle}
                                onChange={(e) => setNewFeatureTitle(e.target.value)}
                                placeholder="افزودن ویژگی یا خدمت جدید به دوره VIP..."
                                className={inputCls}
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-black text-white hover:bg-brand-700"
                            >
                                + افزودن ویژگی
                            </button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {featuresDraft.map((feat) => (
                                <div
                                    key={feat.id}
                                    className="flex items-center justify-between gap-2 rounded-xl border border-navy/10 bg-soft-gray/40 px-3.5 py-2.5 text-xs"
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFeature(feat.id)}
                                        className={`text-right font-bold flex-1 ${
                                            feat.active
                                                ? 'text-navy'
                                                : 'line-through text-navy/40'
                                        }`}
                                    >
                                        {feat.title}
                                    </button>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleFeature(feat.id)}
                                            className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                                                feat.active
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}
                                        >
                                            {feat.active ? 'فعال' : 'غیرفعال'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteFeature(feat.id)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                                            title="حذف"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* VIP Sessions Calendar Management */}
                    <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 space-y-4">
                        <h2 className="flex items-center gap-2 text-sm font-black text-navy">
                            <Calendar className="size-4 text-brand-600" />
                            <span>تقویم جلسات حضوری و آنلاین دوره VIP ({toFa(sessionsDraft.length)} جلسه)</span>
                        </h2>

                        <div className="grid gap-3 rounded-2xl border border-navy/10 bg-soft-gray/40 p-4 sm:grid-cols-4">
                            <div className="sm:col-span-2">
                                <input
                                    value={newSessionTitle}
                                    onChange={(e) => setNewSessionTitle(e.target.value)}
                                    placeholder="عنوان جلسه جدید (مثلاً: کارگاه تصمیم‌گیری و حل مسئله)"
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <input
                                    value={newSessionDate}
                                    onChange={(e) => setNewSessionDate(e.target.value)}
                                    placeholder="تاریخ برگزاری"
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <input
                                    value={newSessionTime}
                                    onChange={(e) => setNewSessionTime(e.target.value)}
                                    placeholder="ساعت برگزاری"
                                    className={inputCls}
                                />
                            </div>
                            <div className="sm:col-span-4 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewSessionMode('in_person')}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold ${
                                            newSessionMode === 'in_person'
                                                ? 'bg-brand-600 text-white'
                                                : 'bg-white text-navy border border-navy/10'
                                        }`}
                                    >
                                        <Building2 className="size-3.5" />
                                        <span>کلاس حضوری</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewSessionMode('online')}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold ${
                                            newSessionMode === 'online'
                                                ? 'bg-brand-600 text-white'
                                                : 'bg-white text-navy border border-navy/10'
                                        }`}
                                    >
                                        <Video className="size-3.5" />
                                        <span>کلاس آنلاین</span>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSession}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#10382B] px-4 py-2 text-xs font-black text-[#D6F39A]"
                                >
                                    <Plus className="size-4" />
                                    <span>افزودن جلسه به تقویم دوره</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {sessionsDraft.map((sess) => (
                                <div
                                    key={sess.id}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-navy/10 bg-white px-4 py-3 text-xs"
                                >
                                    <div className="space-y-0.5">
                                        <div className="font-black text-navy">
                                            جلسه {toFa(sess.number)}: {sess.title}
                                        </div>
                                        <div className="text-navy/55">
                                            {sess.mode === 'in_person' ? 'حضوری' : 'مجازی'} · {sess.date} · ساعت {sess.time}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                                                sess.mode === 'in_person'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-blue-50 text-blue-700'
                                            }`}
                                        >
                                            {sess.mode === 'in_person' ? 'حضوری' : 'آنلاین'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSession(sess.id)}
                                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                                            title="حذف جلسه"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Course Video/Audio Lessons & VIP Unlock Control */}
                    <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-sm font-black text-navy">
                                    <Video className="size-4 text-brand-600" />
                                    <span>جلسات آموزشی و درس‌های ویدئویی دوره ({toFa(lessonsDraft.length)} درس)</span>
                                </h2>
                                <p className="mt-1 text-xs text-navy/55">
                                    تعیین کنید کدام جلسات در نسخه بتا «پیش‌نمایش رایگان» باشند و کدام جلسات پس از فعال‌سازی دوره پریمیوم باز شوند.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    updateAppState((prev) =>
                                        toggleVipActivationInState(prev)
                                    )
                                }
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                                    isVipEnrolled
                                        ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300'
                                        : 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                                }`}
                            >
                                <Crown className="size-4" />
                                <span>
                                    {isVipEnrolled
                                        ? 'وضعیت دانش‌پذیر در اپ: دوره VIP فعال است (همه جلسات باز)'
                                        : 'وضعیت دانش‌پذیر در اپ: قبل از فعال‌سازی (حالت معرفی بتا)'}
                                </span>
                            </button>
                        </div>

                        <div className="grid gap-3 rounded-2xl border border-navy/10 bg-soft-gray/40 p-4 sm:grid-cols-4">
                            <div className="sm:col-span-2">
                                <input
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                    placeholder="عنوان درس جدید (مثلاً: جلسه ۵ — مذاکره و هوش هیجانی)"
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <input
                                    value={newLessonDuration}
                                    onChange={(e) => setNewLessonDuration(e.target.value)}
                                    placeholder="مدت زمان (مثلاً: ۴۵ دقیقه)"
                                    className={inputCls}
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-navy">
                                    <input
                                        type="checkbox"
                                        checked={newLessonFree}
                                        onChange={(e) => setNewLessonFree(e.target.checked)}
                                        className="size-4 rounded border-navy/20 text-brand-600"
                                    />
                                    <span>پیش‌نمایش رایگان در نسخه بتا</span>
                                </label>
                            </div>
                            <div className="sm:col-span-3">
                                <input
                                    value={newLessonSummary}
                                    onChange={(e) => setNewLessonSummary(e.target.value)}
                                    placeholder="خلاصه محتوای آموزشی و نکات کلیدی این جلسه..."
                                    className={inputCls}
                                />
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={handleAddLesson}
                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-3 text-xs font-black text-white hover:bg-brand-700"
                                >
                                    <Plus className="size-4" />
                                    <span>افزودن درس به دوره</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {lessonsDraft.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-navy/10 bg-white px-4 py-3 text-xs"
                                >
                                    <div className="space-y-0.5 max-w-xl">
                                        <div className="font-black text-navy">
                                            درس {toFa(lesson.number)}: {lesson.title}
                                        </div>
                                        <div className="text-navy/55 line-clamp-1">
                                            مدت: {lesson.duration} · {lesson.videoSummary}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleLessonFree(lesson.id)}
                                            className={`rounded-lg px-2.5 py-1 text-[11px] font-black transition ${
                                                lesson.is_free
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-amber-100 text-amber-900'
                                            }`}
                                        >
                                            {lesson.is_free
                                                ? 'پیش‌نمایش رایگان (باز)'
                                                : '🔒 ویژه اعضای VIP'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                                            title="حذف درس"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {/* Bottom Submit Bar */}
            <div className="flex items-center justify-end gap-3">
                <Link
                    href="/admin/courses"
                    className="rounded-xl border border-navy/10 bg-white px-5 py-3 text-xs font-bold text-navy hover:bg-soft-gray"
                >
                    انصراف
                </Link>
                <Button type="submit">
                    <Save className="size-4" aria-hidden />
                    {isEdit ? 'ذخیره نهایی تغییرات در سایت و اپ' : 'ایجاد و انتشار دوره'}
                </Button>
            </div>
        </form>
    );
}

CourseForm.layout = (page: ReactNode) => (
    <AdminLayout title="ویرایش داینامیک دوره و تنظیمات VIP">{page}</AdminLayout>
);
