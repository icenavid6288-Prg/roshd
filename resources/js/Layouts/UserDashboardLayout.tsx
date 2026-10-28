import { Link, router, usePage } from '@inertiajs/react';
import {
    Award,
    Bell,
    BookOpen,
    CalendarDays,
    ChevronLeft,
    ClipboardList,
    Gift,
    Globe,
    Headphones,
    Heart,
    LayoutDashboard,
    LifeBuoy,
    LogOut,
    Menu,
    Route,
    Settings,
    ShoppingBag,
    Target,
    UserRound,
    X,
    Sparkles,
    Flame,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import BrandLogo from '@/Components/BrandLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import MobileAppNav from '@/Components/MobileAppNav';
import PwaInstallPrompt from '@/Components/PwaInstallPrompt';
import type { PageProps } from '@/types';

interface NavItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    badge?: string;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

const groups: NavGroup[] = [
    {
        label: 'یادگیری و رسالت',
        items: [
            { label: 'نمای کلی داشبورد', href: '/dashboard', icon: LayoutDashboard },
            { label: 'دوره‌های من', href: '/dashboard/courses', icon: BookOpen, badge: '۱ فعال' },
            { label: 'تکلیف‌ها و بازخورد', href: '/dashboard/assignments', icon: ClipboardList, badge: '۱ منتظر' },
            { label: 'گواهینامه‌های رسمی', href: '/dashboard/certificates', icon: Award },
            { label: 'کتابخانه و ورک‌بوک', href: '/dashboard/library', icon: Headphones },
            { label: 'علاقه‌مندی‌ها', href: '/dashboard/wishlist', icon: Heart },
            { label: 'نقشه سفر رشد', href: '/dashboard/goals', icon: Route },
            { label: 'جلسات با دکتر بیدی', href: '/dashboard/sessions', icon: CalendarDays, badge: '۱ پیش‌رو' },
            { label: 'یادآوری‌های خودکار', href: '/dashboard/reminders', icon: Bell, badge: 'پیامک فعال' },
            { label: 'پیش‌نمایش اپ موبایل', href: '/mobile-app', icon: Globe, badge: 'نسخه جدید' },
        ],
    },
    {
        label: 'حساب و پشتیبانی',
        items: [
            { label: 'سفارش‌ها و فاکتورها', href: '/dashboard/orders', icon: ShoppingBag },
            { label: 'دعوت از دوستان', href: '/dashboard/referrals', icon: Gift },
            { label: 'اعلان‌های سیستم', href: '/dashboard/notifications', icon: Bell },
            { label: 'ارتباط با پشتیبانی', href: '/dashboard/support', icon: LifeBuoy },
        ],
    },
];

export default function UserDashboardLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    const currentUrl = usePage<PageProps>().url.split('?')[0];
    const [open, setOpen] = useState(false);
    const user = auth.user;
    const unread = user?.unread_notifications ?? 0;

    const logout = () => router.post('/logout');

    const isActive = (href: string) =>
        href === '/dashboard' ? currentUrl === '/dashboard' : currentUrl === href || currentUrl.startsWith(`${href}/`);

    const renderLinks = (group: NavGroup) => (
        <div key={group.label} className="flex flex-col gap-1.5">
            <span className="px-3 pt-2 text-[0.65rem] font-black uppercase tracking-wider text-navy/40 dark:text-white/35">
                {group.label}
            </span>
            {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-black transition-all ${
                            active
                                ? 'bg-gradient-to-r from-brand-600 to-emerald-600 text-white shadow-md shadow-brand-600/25'
                                : 'text-navy/70 hover:bg-brand-50 hover:text-brand-800 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                        }`}
                    >
                        <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                active
                                    ? 'bg-white/20 text-white'
                                    : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100 dark:bg-white/10 dark:text-brand-300 dark:group-hover:bg-white/20'
                            }`}
                        >
                            <item.icon className="size-4" aria-hidden />
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && !active && (
                            <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[0.6rem] font-bold text-brand-700 dark:bg-white/10 dark:text-brand-300">
                                {item.badge}
                            </span>
                        )}
                        {item.href === '/dashboard/notifications' && unread > 0 && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[0.6rem] font-black text-white">
                                {unread}
                            </span>
                        )}
                        {!active && !item.badge && (
                            <ChevronLeft className="size-3.5 text-navy/20 transition-transform group-hover:-translate-x-0.5 group-hover:text-brand-500 dark:text-white/25" aria-hidden />
                        )}
                    </Link>
                );
            })}
        </div>
    );

    const renderProfileCard = () => (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c2b21] via-[#092219] to-[#061811] p-4 text-white shadow-soft">
            <div className="pointer-events-none absolute -left-8 -top-10 size-28 rounded-full bg-emerald-400/20 blur-2xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-12 -right-6 size-24 rounded-full bg-amber-400/15 blur-2xl" aria-hidden />
            <div className="relative flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-black text-slate-950 shadow-md">
                    {user?.name?.slice(0, 1) ?? 'ک'}
                </span>
                <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-black text-white">{user?.name}</strong>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[0.68rem] font-bold text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>دانش‌آموز پیشرو · سطح ۲</span>
                    </div>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[0.68rem] text-white/60">
                <span>امتیاز رشد: <strong className="text-amber-300 font-mono">۶۵۰ XP</strong></span>
                <span className="text-emerald-300">🔥 ۳ روز استریک</span>
            </div>
        </div>
    );

    const renderFooter = (mobile: boolean) => (
        <div className="flex flex-col gap-1 border-t border-navy/8 pt-3 dark:border-white/10">
            <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-navy/60 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-white/70 dark:hover:bg-white/10"
            >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-300">
                    <Settings className="size-3.5" aria-hidden />
                </span>
                تنظیمات پروفایل
            </Link>
            <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-navy/60 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-white/70 dark:hover:bg-white/10"
            >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-300">
                    <Globe className="size-3.5" aria-hidden />
                </span>
                مشاهده سایت اصلی
            </Link>
            <button
                type="button"
                onClick={logout}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/15">
                    <LogOut className="size-3.5" aria-hidden />
                </span>
                خروج از حساب
            </button>
        </div>
    );

    return (
        <div className="mobile-app-shell user-dashboard-shell dashboard-panel-shell min-h-screen bg-[#f4f8f5] dark:bg-[#081711]" dir="rtl">
            {/* Desktop Fixed Sidebar */}
            <aside className="fixed inset-y-0 right-0 z-40 hidden w-72 flex-col border-l border-white/70 bg-white/80 px-4 py-5 shadow-soft backdrop-blur-2xl lg:flex dark:border-white/10 dark:bg-[#0c1f17]/90">
                <Link href="/" className="flex items-center gap-3 px-3 pb-5" aria-label="بازگشت به سایت">
                    <BrandLogo className="user-brand-mark" />
                    <span className="leading-tight">
                        <strong className="block text-sm font-black text-navy dark:text-white">مرکز رشد دکتر بیدی</strong>
                        <small className="block text-xs font-bold text-brand-600 dark:text-brand-300">Personal Growth Hub</small>
                    </span>
                </Link>

                {renderProfileCard()}

                <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-behavior-contain pb-2">
                    {groups.map(renderLinks)}
                </div>

                <div className="mt-auto pt-3">{renderFooter(false)}</div>
            </aside>

            {/* Mobile Slide-out Drawer */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden />
                    <aside className="user-drawer absolute inset-y-0 right-0 flex w-[19.5rem] max-w-[90vw] flex-col bg-white p-4 pb-[calc(6.2rem+env(safe-area-inset-bottom))] shadow-lift dark:bg-[#0c1f17]">
                        <div className="mb-4 flex items-center justify-between px-1">
                            <div className="flex items-center gap-2.5">
                                <BrandLogo className="user-brand-mark" />
                                <span className="text-base font-black text-navy dark:text-white">مرکز رشد</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="بستن منو"
                                className="flex size-9 items-center justify-center rounded-xl border border-navy/10 text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
                            >
                                <X className="size-4.5" />
                            </button>
                        </div>

                        {renderProfileCard()}

                        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-behavior-contain pb-2">
                            {groups.map(renderLinks)}
                        </div>

                        <div className="mt-auto pt-2">{renderFooter(true)}</div>
                    </aside>
                </div>
            )}

            {/* Main Area */}
            <div className="lg:mr-72">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy/5 bg-white/70 px-4 backdrop-blur-xl md:px-8 dark:border-white/10 dark:bg-[#0c1f17]/80">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="rounded-xl bg-white p-2 text-navy shadow-sm lg:hidden dark:bg-white/10 dark:text-white"
                            aria-label="باز کردن منو"
                        >
                            <Menu className="size-5" />
                        </button>
                        <div>
                            <span className="block text-[0.68rem] font-bold text-brand-700 dark:text-brand-300">سامانه توسعه فردی و استعدادیابی</span>
                            <h1 className="text-sm font-black text-navy dark:text-white md:text-base">
                                سلام، {user?.name?.split(' ')[0] ?? 'همراه مسیر'} 👋
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle compact />
                        <Link
                            href="/dashboard/sessions"
                            className="hidden items-center gap-2 rounded-xl border border-brand-200 bg-brand-50/70 px-3 py-2 text-xs font-black text-brand-700 transition-colors hover:bg-brand-100 sm:flex dark:border-white/15 dark:bg-white/10 dark:text-brand-300"
                        >
                            <CalendarDays className="size-3.5" />
                            جلسه پیش‌رو (۱۷ آبان)
                        </Link>
                        <Link
                            href="/courses"
                            className="hidden rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-glow transition-colors hover:bg-brand-600 sm:block"
                        >
                            کشف دوره جدید
                        </Link>
                    </div>
                </header>

                <main className="dashboard-content p-4 md:p-8">
                    {children}
                </main>
            </div>

            <PwaInstallPrompt />
            <MobileAppNav
                ariaLabel="ناوبری پنل کاربر موبایل"
                items={[
                    { label: 'نمای کلی', href: '/dashboard', icon: LayoutDashboard },
                    { label: 'دوره‌ها', href: '/dashboard/courses', icon: BookOpen },
                    { label: 'مسیر رشد', href: '/dashboard/goals', icon: Route },
                    { label: 'جلسات', href: '/dashboard/sessions', icon: CalendarDays },
                    { label: 'پروفایل', href: '/profile', icon: UserRound },
                ]}
            />
        </div>
    );
}
