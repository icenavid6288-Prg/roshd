import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Crown,
    ExternalLink,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Trash2,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Badge } from '@/Components/ui/Badge';
import { formatPrice, toFa } from '@/lib/format';
import {
    deleteCourseFromState,
    saveCourseInState,
    useDynamicAppStore,
    type DynamicCourseItem,
} from '@/lib/dynamicAppStore';

export default function CoursesIndex() {
    const { appState, updateAppState } = useDynamicAppStore();
    const { courses, vipConfig, courseItems, vipSessions, vipStudents } = appState;

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    const notify = (msg: string) => {
        setToast(msg);
        setTimeout(() => {
            setToast((prev) => (prev === msg ? null : prev));
        }, 3200);
    };

    const vipCourse =
        courses.find(
            (c) => c.is_vip || c.id === 100 || c.slug === 'designing-teen-future-vip'
        ) || courses[0];

    const filteredCourses = courses.filter((course) => {
        const q = search.trim().toLowerCase();
        const matchesQuery =
            !q ||
            course.title.toLowerCase().includes(q) ||
            course.slug.toLowerCase().includes(q) ||
            (course.category || '').toLowerCase().includes(q) ||
            (course.instructor?.name || '').toLowerCase().includes(q);

        const matchesStatus =
            !status ||
            (status === 'published' && course.is_published) ||
            (status === 'draft' && !course.is_published) ||
            (status === 'vip' && course.is_vip);

        return matchesQuery && matchesStatus;
    });

    const togglePublished = (course: DynamicCourseItem) => {
        updateAppState((prev) =>
            saveCourseInState(prev, {
                ...course,
                is_published: !course.is_published,
            })
        );
        notify(
            !course.is_published
                ? `دوره «${course.title}» منتشر شد و در سایت و اپ فعال گردید.`
                : `دوره «${course.title}» به حالت پیش‌نویس تغییر یافت.`
        );
    };

    const destroy = (course: DynamicCourseItem) => {
        updateAppState((prev) => deleteCourseFromState(prev, course.id));
        notify(`دوره «${course.title}» از لیست دوره‌ها حذف شد.`);
    };

    return (
        <div className="flex flex-col gap-6" dir="rtl">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-900 px-4 py-3 text-xs font-bold text-white shadow-lg">
                    <CheckCircle2 className="size-4 text-emerald-300 shrink-0" />
                    <span>{toast}</span>
                </div>
            )}

            {/* Flagship VIP Course Command Card */}
            {vipCourse && (
                <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-l from-[#10382B] via-[#164A39] to-[#0D2A20] p-6 text-white shadow-lift">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2.5 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-[11px] font-black text-amber-300">
                                    <Crown className="size-3.5" />
                                    <span>دوره پرچمدار پریمیوم VIP (داینامیک و همگام با سایت و اپ)</span>
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
                                    <Sparkles className="size-3" />
                                    <span>{toFa(courseItems.length)} آیتم تخصصی و مدرس</span>
                                </span>
                            </div>

                            <h2 className="text-xl font-black md:text-2xl">
                                {vipConfig.title || vipCourse.title}
                            </h2>
                            <p className="text-xs leading-6 text-white/80">
                                {vipConfig.subtitle || vipCourse.summary}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold text-emerald-200">
                                <span>
                                    شهریه نهایی:{' '}
                                    <strong className="text-white">
                                        {formatPrice(vipCourse.discount_price ?? vipCourse.price)}
                                    </strong>
                                </span>
                                <span>•</span>
                                <span>
                                    اعضای VIP: <strong className="text-white">{toFa(vipStudents.length)} نفر فعال</strong> (ظرفیت {toFa(vipConfig.capacity)} نفر)
                                </span>
                                <span>•</span>
                                <span>
                                    جلسات تقویم: <strong className="text-white">{toFa(vipSessions.length)} جلسه</strong>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            <Link
                                href={`/admin/courses/${vipCourse.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#D6F39A] px-4 py-3 text-xs font-black text-[#10382B] shadow-md transition hover:opacity-95"
                            >
                                <Pencil className="size-4" />
                                <span>ویرایش کامل دوره VIP و ۴ آیتم</span>
                            </Link>
                            <Link
                                href={`/courses/${vipCourse.slug}`}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-3 text-xs font-bold text-white transition hover:bg-white/20"
                            >
                                <span>مشاهده در سایت</span>
                                <ExternalLink className="size-3.5" />
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-3 text-xs font-bold text-white transition hover:bg-white/20"
                            >
                                <Users className="size-3.5" />
                                <span>مشاهده در اپلیکیشن</span>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Search, Filter & New Course Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-navy/35" aria-hidden />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجوی عنوان، اسلاگ یا مدرس..."
                            className="w-64 rounded-xl border border-navy/10 bg-white py-2.5 pl-3 pr-9 text-sm text-navy outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy outline-none"
                    >
                        <option value="">همه دوره‌ها ({toFa(courses.length)})</option>
                        <option value="vip">دوره پریمیوم VIP</option>
                        <option value="published">منتشرشده</option>
                        <option value="draft">پیش‌نویس</option>
                    </select>
                </div>
                <Link
                    href="/admin/courses/create"
                    className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition-all hover:from-brand-700 hover:to-brand-600"
                >
                    <Plus className="size-4" aria-hidden /> ایجاد دوره جدید
                </Link>
            </div>

            {/* Courses Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy/5">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px] text-right">
                        <thead>
                            <tr className="border-b border-navy/5 bg-soft-gray/60 text-xs font-black text-navy/50">
                                <th className="px-5 py-3.5">دوره آموزشی</th>
                                <th className="px-5 py-3.5">دسته‌بندی</th>
                                <th className="px-5 py-3.5">مدرس / راهبر</th>
                                <th className="px-5 py-3.5">سطح و نوع</th>
                                <th className="px-5 py-3.5">شهریه</th>
                                <th className="px-5 py-3.5">دانش‌پذیران</th>
                                <th className="px-5 py-3.5">وضعیت انتشار</th>
                                <th className="px-5 py-3.5">عملیات مدیریت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course) => (
                                <tr
                                    key={course.id}
                                    className={`border-b border-navy/5 text-sm transition-colors last:border-0 hover:bg-soft-gray/50 ${
                                        course.is_vip ? 'bg-amber-50/35' : ''
                                    }`}
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-navy">{course.title}</span>
                                            {course.is_vip && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                                                    <Crown className="size-3" />
                                                    VIP
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-0.5 text-xs text-navy/40" dir="ltr">
                                            /courses/{course.slug}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-xs font-bold text-navy/65">
                                        {course.category || 'نوجوانان و والدین'}
                                    </td>
                                    <td className="px-5 py-4 text-xs font-bold text-navy/65">
                                        {course.instructor?.name ?? 'دکتر علیرضا بیدی'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <Badge tone="navy">{course.level}</Badge>
                                            <span className="text-[11px] text-navy/50">{course.delivery_mode}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-black text-brand-700">
                                            {formatPrice(course.discount_price ?? course.price)}
                                        </div>
                                        {course.discount_price && course.discount_price < course.price && (
                                            <div className="text-xs text-navy/35 line-through">
                                                {formatPrice(course.price)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-xs font-black text-navy/70">
                                        {toFa(course.students_count)} نفر
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            <button
                                                type="button"
                                                onClick={() => togglePublished(course)}
                                                className="cursor-pointer"
                                                title="کلیک برای تغییر وضعیت انتشار"
                                            >
                                                {course.is_published ? (
                                                    <Badge tone="green">منتشرشده</Badge>
                                                ) : (
                                                    <Badge tone="gray">پیش‌نویس</Badge>
                                                )}
                                            </button>
                                            {course.is_featured && <Badge tone="gold">ویژه</Badge>}
                                            {course.is_in_person && <Badge tone="navy">حضوری</Badge>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Link
                                                href={`/admin/courses/${course.id}/edit`}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700 transition-colors hover:bg-brand-100"
                                                aria-label="ویرایش"
                                            >
                                                <Pencil className="size-3.5" />
                                                <span>ویرایش</span>
                                            </Link>
                                            <Link
                                                href={`/courses/${course.slug}`}
                                                className="flex size-8 items-center justify-center rounded-lg bg-soft-gray text-navy/60 transition-colors hover:bg-brand-100 hover:text-brand-700"
                                                title="مشاهده در سایت"
                                            >
                                                <ExternalLink className="size-3.5" />
                                            </Link>
                                            {!course.is_vip && (
                                                <button
                                                    type="button"
                                                    onClick={() => destroy(course)}
                                                    className="flex size-8 items-center justify-center rounded-lg bg-soft-gray text-navy/60 transition-colors hover:bg-red-50 hover:text-red-600"
                                                    aria-label="حذف"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCourses.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-navy/45">
                                        دوره‌ای با این مشخصات یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

CoursesIndex.layout = (page: ReactNode) => <AdminLayout title="مدیریت دوره‌ها و دوره پریمیوم VIP">{page}</AdminLayout>;
