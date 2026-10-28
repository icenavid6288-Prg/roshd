import { Link, router, usePage } from '@inertiajs/react';
import BrandLogo from '@/Components/BrandLogo';
import FlashToast from '@/Components/FlashToast';
import ThemeToggle from '@/Components/ThemeToggle';
import PanelHelpGuide from '@/Components/PanelHelpGuide';
import PwaInstallPrompt from '@/Components/PwaInstallPrompt';
import AdminCommandPalette from '@/Components/AdminCommandPalette';
import AdminNotificationsPopover from '@/Components/AdminNotificationsPopover';
import {
    Award,
    BarChart3,
    BellRing,
    Bot,
    BookOpen,
    Boxes,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    ClipboardPen,
    CreditCard,
    FileText,
    FolderTree,
    GraduationCap,
    Headphones,
    Headset,
    HeartHandshake,
    Image,
    LayoutDashboard,
    ListChecks,
    LogOut,
    Mail,
    Megaphone,
    Menu as MenuIcon,
    MessageSquare,
    MessageSquareQuote,
    NotebookPen,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    PanelTop,
    Receipt,
    Search,
    Settings,
    ShieldCheck,
    ShoppingBag,
    Target,
    Ticket,
    UserRound,
    Users,
    UsersRound,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

type NavItem = {
    title: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
    permission?: string;
    exact?: boolean;
    badge?: string;
};

type NavGroup = {
    id: string;
    section: string;
    items: NavItem[];
};

const nav: NavGroup[] = [
    {
        id: 'overview',
        section: 'داشبورد و آمار کلان',
        items: [
            { title: 'داشبورد تحلیلی', href: '/admin', icon: LayoutDashboard, exact: true },
            { title: 'داشبورد CRM و فروش', href: '/admin/crm', icon: Target, permission: 'view leads' },
            { title: 'گزارش‌ها و خروجی آماری', href: '/admin/reports', icon: BarChart3, permission: 'view reports' },
            { title: 'لاگ فعالیت مدیران', href: '/admin/audit-logs', icon: ShieldCheck, permission: 'view reports' },
        ],
    },
    {
        id: 'academy',
        section: 'آموزش و آکادمی',
        items: [
            { title: 'دوره‌ها و کارگاه‌ها', href: '/admin/courses', icon: GraduationCap, permission: 'view courses' },
            { title: 'سرفصل‌ها و درس‌ها', href: '/admin/content/lessons', icon: BookOpen, permission: 'view lessons' },
            { title: 'آزمون‌ها و کوئیزها', href: '/admin/quizzes', icon: ListChecks, permission: 'view lessons' },
            { title: 'تکالیف دانش‌آموزان', href: '/admin/assignments', icon: NotebookPen, permission: 'view lessons' },
            { title: 'گواهینامه‌های پایان دوره', href: '/admin/certificates', icon: Award, permission: 'view certificates' },
        ],
    },
    {
        id: 'coaching',
        section: 'کوچینگ و استعدادیابی',
        items: [
            { title: 'جلسات مشاوره و کوچینگ', href: '/admin/content/coaching', icon: HeartHandshake, permission: 'view coaching' },
            { title: 'خدمات مرکز', href: '/admin/content/services', icon: Boxes, permission: 'view services' },
            { title: 'پرونده نوجوانان و والدین', href: '/admin/content/students', icon: UsersRound, permission: 'view students' },
            { title: 'فرم‌های استعدادیابی (پرسلاین)', href: '/admin/persline', icon: ClipboardPen, permission: 'view surveys' },
            { title: 'نظرسنجی‌های مراجعین', href: '/admin/surveys', icon: ClipboardList, permission: 'view surveys' },
        ],
    },
    {
        id: 'shop',
        section: 'فروشگاه و سفارش‌ها',
        items: [
            { title: 'محصولات و کتاب‌ها', href: '/admin/content/products', icon: ShoppingBag, permission: 'view products' },
            { title: 'پادکست مسیر آینده', href: '/admin/content/podcasts', icon: Headphones, permission: 'view podcasts' },
            { title: 'سفارش‌ها و پرداخت‌ها', href: '/admin/content/orders', icon: Receipt, permission: 'view orders' },
            { title: 'کدهای تخفیف', href: '/admin/content/coupons', icon: Package, permission: 'view coupons' },
        ],
    },
    {
        id: 'content',
        section: 'محتوا و وب‌سایت',
        items: [
            { title: 'مقالات وبلاگ', href: '/admin/content/blog', icon: FileText, permission: 'view blog' },
            { title: 'وبینارها و همایش‌ها', href: '/admin/content/events', icon: PanelTop, permission: 'view events' },
            { title: 'کتابخانه رسانه و فایل‌ها', href: '/admin/media', icon: Image, permission: 'view media' },
            { title: 'نظرات و تجربیات', href: '/admin/content/testimonials', icon: MessageSquareQuote, permission: 'view testimonials' },
            { title: 'مدیریت صفحات سایت', href: '/admin/site-pages', icon: PanelTop, permission: 'view pages' },
            { title: 'بنرهای کمپین', href: '/admin/content/banners', icon: Image, permission: 'view banners' },
            { title: 'دسته‌بندی‌های کلی', href: '/admin/content/categories', icon: FolderTree, permission: 'view categories' },
        ],
    },
    {
        id: 'marketing',
        section: 'بازاریابی و شبکه‌های اجتماعی',
        items: [
            { title: 'سرنخ‌ها و لیدها (Leads)', href: '/admin/leads', icon: Target, permission: 'view leads' },
            { title: 'اتوماسیون اینستاگرام', href: '/admin/instagram', icon: MessageSquare, permission: 'view instagram' },
            { title: 'ربات پیام‌رسان ایتا', href: '/admin/eitaa', icon: Bot, permission: 'view eitaa' },
            { title: 'ارسال پیامک انبوه', href: '/admin/marketing/bulk-sms', icon: Mail, permission: 'create marketing' },
            { title: 'کمپین‌های اتومارکتینگ', href: '/admin/marketing', icon: Megaphone, permission: 'view marketing' },
        ],
    },
    {
        id: 'users',
        section: 'کاربران و پشتیبانی',
        items: [
            { title: 'مدیریت کاربران و نقش‌ها', href: '/admin/users', icon: Users, permission: 'view users' },
            { title: 'مدرسین و کوچ‌ها', href: '/admin/content/team', icon: UserRound, permission: 'view team' },
            { title: 'تیکت‌های پشتیبانی', href: '/admin/content/tickets', icon: Ticket, permission: 'view tickets' },
            { title: 'پشتیبانی زنده', href: '/admin/support-chat', icon: Headset, permission: 'view tickets' },
        ],
    },
    {
        id: 'settings',
        section: 'تنظیمات و زیرساخت',
        items: [
            { title: 'تنظیمات عمومی سایت', href: '/admin/settings', icon: Settings, permission: 'view settings', exact: true },
            { title: 'درگاه‌های پرداخت', href: '/admin/settings/payments', icon: CreditCard, permission: 'view settings' },
            { title: 'پنل پیامک و الگوهای OTP', href: '/admin/settings/sms', icon: MessageSquare, permission: 'view settings' },
            { title: 'اتصال اینستاگرام', href: '/admin/settings/instagram', icon: MessageSquare, permission: 'view settings' },
            { title: 'پیگیری خودکار و وب‌هوک‌ها', href: '/admin/settings/automations', icon: BellRing, permission: 'view settings' },
            { title: 'نقش‌ها و دسترسی‌ها (RBAC)', href: '/admin/access', icon: ShieldCheck, permission: 'view roles' },
        ],
    },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth } = usePage().props as { auth: { user: { name: string; roles: string[]; permissions?: string[] } | null } };
    const currentUrl = usePage().url;
    const [open, setOpen] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [isMiniSidebar, setIsMiniSidebar] = useState(false);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    const permissions = auth.user?.permissions ?? [];
    const pageTitle = title ?? 'پنل مدیریت';
    const isSuper = auth.user?.roles?.includes('super-admin') ?? false;

    // Load sidebar preferences from localStorage
    useEffect(() => {
        try {
            const savedMini = localStorage.getItem('markaz-admin-mini-sidebar');
            if (savedMini === 'true') setIsMiniSidebar(true);

            const savedCollapsed = localStorage.getItem('markaz-admin-collapsed-groups');
            if (savedCollapsed) setCollapsedGroups(JSON.parse(savedCollapsed));
        } catch {
            // Ignore storage errors
        }
    }, []);

    const toggleGroupCollapse = (groupId: string) => {
        setCollapsedGroups((prev) => {
            const next = { ...prev, [groupId]: !prev[groupId] };
            try {
                localStorage.setItem('markaz-admin-collapsed-groups', JSON.stringify(next));
            } catch {
                // Ignore storage errors
            }
            return next;
        });
    };

    const toggleMiniSidebar = () => {
        setIsMiniSidebar((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('markaz-admin-mini-sidebar', String(next));
            } catch {
                // Ignore storage errors
            }
            return next;
        });
    };

    const visibleNav = useMemo(() => nav.map((group) => ({
        ...group,
        items: group.items.filter((item) => !item.permission || isSuper || permissions.includes('manage all') || permissions.includes(item.permission)),
    })).filter((group) => group.items.length > 0), [isSuper, permissions]);

    const logout = () => router.post('/logout');

    const renderNav = (mobile = false) => visibleNav.map((group) => {
        const isCollapsed = !mobile && !isMiniSidebar && !!collapsedGroups[group.id];
        return (
            <div key={group.id} className="mb-3">
                {/* Section Header with accordion toggle */}
                {!isMiniSidebar ? (
                    <button
                        type="button"
                        onClick={() => !mobile && toggleGroupCollapse(group.id)}
                        className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-black tracking-wider text-navy/40 transition-colors hover:text-navy"
                    >
                        <span className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-brand-500/60" />
                            <span>{group.section}</span>
                        </span>
                        {!mobile && (
                            <ChevronDown
                                className={`size-3.5 transition-transform duration-200 ${
                                    isCollapsed ? '-rotate-90 text-navy/30' : 'text-navy/50'
                                }`}
                            />
                        )}
                    </button>
                ) : (
                    <div className="my-2 border-t border-navy/5" />
                )}

                {/* Items container */}
                {(!isCollapsed || isMiniSidebar) && (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                        {group.items.map((item) => {
                            const active = item.exact
                                ? currentUrl === item.href
                                : item.href.includes('?')
                                    ? currentUrl.startsWith(item.href.split('?')[0])
                                    : (item.href === '/admin' ? currentUrl === '/admin' : currentUrl.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={isMiniSidebar ? item.title : undefined}
                                    onClick={mobile ? () => setOpen(false) : undefined}
                                    className={`group relative flex items-center ${
                                        isMiniSidebar ? 'justify-center py-2.5' : 'justify-between px-3 py-2'
                                    } rounded-xl text-xs font-bold transition-all ${
                                        active
                                            ? 'bg-brand-50 text-brand-700 font-black shadow-xs ring-1 ring-brand-500/10'
                                            : 'text-navy/65 hover:bg-soft-gray hover:text-navy'
                                    }`}
                                >
                                    <span className={`flex items-center ${isMiniSidebar ? 'justify-center' : 'gap-2.5'}`}>
                                        <item.icon
                                            className={`size-4 transition-colors ${
                                                active ? 'text-brand-600' : 'text-navy/45 group-hover:text-navy'
                                            }`}
                                            aria-hidden
                                        />
                                        {!isMiniSidebar && <span>{item.title}</span>}
                                    </span>
                                    {!isMiniSidebar && active && (
                                        <span className="size-1.5 rounded-full bg-brand-600" />
                                    )}
                                    {isMiniSidebar && active && (
                                        <span className="absolute right-1 top-2.5 size-1.5 rounded-full bg-brand-600" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    });

    const sidebarWidthClass = isMiniSidebar ? 'w-20' : 'w-72';
    const mainMarginClass = isMiniSidebar ? 'lg:mr-20' : 'lg:mr-72';

    return (
        <div className="admin-panel-shell flex min-h-screen bg-soft-gray" dir="rtl">
            {/* Desktop Sidebar */}
            <aside
                className={`fixed inset-y-0 right-0 z-40 hidden ${sidebarWidthClass} flex-col border-l border-navy/5 bg-white transition-all duration-300 ease-in-out lg:flex`}
            >
                {/* Brand & Mini-toggle Header */}
                <div className={`flex h-16 items-center ${isMiniSidebar ? 'justify-center px-2' : 'justify-between px-4'} border-b border-navy/5`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                        <BrandLogo className="admin-brand-mark" />
                        {!isMiniSidebar && (
                            <div className="leading-tight truncate">
                                <div className="text-xs font-black text-navy truncate">مرکز رشد دکتر بیدی</div>
                                <div className="text-[10px] font-bold text-brand-600">سامانه جامع مدیریت</div>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={toggleMiniSidebar}
                        className="rounded-lg p-1.5 text-navy/40 transition-colors hover:bg-soft-gray hover:text-navy"
                        title={isMiniSidebar ? 'گسترش منو' : 'فشرده‌سازی منو'}
                    >
                        {isMiniSidebar ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
                    </button>
                </div>

                {/* Nav list */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">{renderNav()}</nav>

                {/* Logout Footer */}
                <div className="border-t border-navy/5 p-3">
                    <button
                        type="button"
                        onClick={logout}
                        className={`flex w-full items-center ${
                            isMiniSidebar ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                        } rounded-xl text-xs font-bold text-red-600 transition-colors hover:bg-red-50`}
                        title="خروج از حساب"
                    >
                        <LogOut className="size-4 shrink-0" aria-hidden />
                        {!isMiniSidebar && <span>خروج از حساب</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Drawer */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} aria-hidden />
                    <aside className="absolute inset-y-0 right-0 flex w-80 flex-col bg-white shadow-lift">
                        <div className="flex h-16 items-center justify-between border-b border-navy/5 px-5">
                            <span className="text-sm font-black text-navy">مرکز فرماندهی مدیریت</span>
                            <button type="button" onClick={() => setOpen(false)} aria-label="بستن"><X className="size-5" /></button>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-3 py-4">{renderNav(true)}</nav>
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <div className={`flex min-w-0 flex-1 flex-col ${mainMarginClass} transition-all duration-300 ease-in-out`}>
                <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-navy/5 bg-white/85 px-4 py-2.5 backdrop-blur-md md:px-6">
                    {/* Left: Mobile hamburger & Page title */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="rounded-xl p-2 text-navy lg:hidden"
                            onClick={() => setOpen(true)}
                            aria-label="باز کردن منو"
                        >
                            <MenuIcon className="size-5" />
                        </button>
                        <div className="min-w-0">
                            <div className="text-[10px] font-black text-brand-600">مرکز رشد و کارآفرینی دکتر بیدی</div>
                            <h1 className="truncate text-base font-black text-navy">{pageTitle}</h1>
                        </div>
                    </div>

                    {/* Middle: Global Search (Command Palette Trigger) */}
                    <button
                        type="button"
                        onClick={() => setCommandPaletteOpen(true)}
                        className="hidden sm:flex items-center gap-3 rounded-xl border border-navy/10 bg-soft-gray/60 px-3.5 py-1.5 text-xs font-bold text-navy/50 transition-all hover:border-brand-500/30 hover:bg-white hover:text-navy hover:shadow-xs"
                    >
                        <Search className="size-3.5 text-brand-600" />
                        <span>جستجوی سریع در پنل…</span>
                        <kbd className="flex items-center gap-0.5 rounded-md border border-navy/10 bg-white px-1.5 py-0.5 text-[10px] font-mono text-navy/40 shadow-xs">
                            <span>⌘</span>
                            <span>K</span>
                        </kbd>
                    </button>

                    {/* Right: Actions, Notifications, Theme, User */}
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setCommandPaletteOpen(true)}
                            className="flex size-9 items-center justify-center rounded-xl text-navy/60 transition-colors hover:bg-soft-gray hover:text-navy sm:hidden"
                            aria-label="جستجو"
                        >
                            <Search className="size-4.5" />
                        </button>

                        <AdminNotificationsPopover />
                        <ThemeToggle compact />

                        <Link
                            href="/"
                            className="hidden text-xs font-bold text-navy/50 transition-colors hover:text-brand-700 md:block"
                        >
                            مشاهده سایت
                        </Link>

                        <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-soft-gray px-2.5 py-1.5 sm:px-3 sm:py-2">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-deep-green text-xs font-black text-white shadow-xs">
                                {auth.user?.name?.slice(0, 1) ?? '؟'}
                            </span>
                            <div className="hidden max-w-32 truncate leading-tight md:block">
                                <div className="truncate text-xs font-black text-navy">{auth.user?.name}</div>
                                <div className="truncate text-[10px] text-navy/45">{auth.user?.roles?.join('، ')}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6">
                    <PanelHelpGuide role="admin" />
                    {children}
                </main>
            </div>

            {/* Global Command Palette Modal */}
            <AdminCommandPalette
                isOpen={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
            />

            <PwaInstallPrompt />
            <FlashToast />
        </div>
    );
}
