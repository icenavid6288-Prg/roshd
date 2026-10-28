import { router } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Boxes,
    CreditCard,
    FileText,
    GraduationCap,
    HeartHandshake,
    LayoutDashboard,
    Mail,
    MessageSquare,
    Search,
    Settings,
    ShieldCheck,
    ShoppingBag,
    Target,
    Ticket,
    User,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';

interface CommandItem {
    id: string;
    title: string;
    subtitle?: string;
    category: 'صفحات' | 'دوره‌ها' | 'کاربران' | 'ابزارها';
    href: string;
    icon: ComponentType<{ className?: string }>;
    keywords?: string;
}

const COMMAND_ITEMS: CommandItem[] = [
    // صفحات
    { id: 'p1', title: 'داشبورد تحلیلی', category: 'صفحات', href: '/admin', icon: LayoutDashboard, keywords: 'dashboard stats آمار' },
    { id: 'p2', title: 'داشبورد CRM و فروش', category: 'صفحات', href: '/admin/crm', icon: Target, keywords: 'crm فروش قیف سرنخ' },
    { id: 'p3', title: 'مدیریت دوره‌ها و کارگاه‌ها', category: 'صفحات', href: '/admin/courses', icon: GraduationCap, keywords: 'course دوره کلاس آموزش' },
    { id: 'p4', title: 'مدیریت کاربران و نقش‌ها', category: 'صفحات', href: '/admin/users', icon: Users, keywords: 'users کاربر دانش آموز مربی' },
    { id: 'p5', title: 'سرنخ‌ها و لیدها (Leads)', category: 'صفحات', href: '/admin/leads', icon: Target, keywords: 'lead لید شماره تماس مشاوره' },
    { id: 'p6', title: 'جلسات مشاوره و کوچینگ', category: 'صفحات', href: '/admin/content/coaching', icon: HeartHandshake, keywords: 'coaching کوچینگ مشاوره هدایت' },
    { id: 'p7', title: 'محصولات و فروشگاه', category: 'صفحات', href: '/admin/content/products', icon: ShoppingBag, keywords: 'shop کتاب پادکست محصول' },
    { id: 'p8', title: 'سفارش‌ها و پرداخت‌ها', category: 'صفحات', href: '/admin/content/orders', icon: CreditCard, keywords: 'order فاکتور پرداخت خرید' },
    { id: 'p9', title: 'مقالات وبلاگ', category: 'صفحات', href: '/admin/content/blog', icon: FileText, keywords: 'blog مقاله بلاگ نوشته' },
    { id: 'p10', title: 'تنظیمات عمومی سایت', category: 'صفحات', href: '/admin/settings', icon: Settings, keywords: 'settings تنظیمات برند نام لوگو' },
    { id: 'p11', title: 'تنظیمات درگاه‌های پرداخت', category: 'صفحات', href: '/admin/settings/payments', icon: CreditCard, keywords: 'زرین پال آیدی پی زیبال درگاه' },
    { id: 'p12', title: 'تنظیمات پنل پیامک و OTP', category: 'صفحات', href: '/admin/settings/sms', icon: MessageSquare, keywords: 'کاوه نگار sms پیامک کد تایید' },
    { id: 'p13', title: 'نقش‌ها و دسترسی‌ها (RBAC)', category: 'صفحات', href: '/admin/access', icon: ShieldCheck, keywords: 'دسترسی نقش پرمیشن مدیر' },
    { id: 'p14', title: 'گواهینامه‌های صادرشده', category: 'صفحات', href: '/admin/certificates', icon: Award, keywords: 'مدرک گواهی سرتیفیکیت' },
    { id: 'p15', title: 'تیکت‌های پشتیبانی', category: 'صفحات', href: '/admin/content/tickets', icon: Ticket, keywords: 'ticket تیکت پشتیبانی سوال' },

    // دوره‌ها
    { id: 'c1', title: 'طراحی مسیر آینده و کشف رسالت فردی', subtitle: 'دوره جامع هدایت تحصیلی', category: 'دوره‌ها', href: '/admin/courses', icon: GraduationCap, keywords: 'آینده رسالت بیدی' },
    { id: 'c2', title: 'کارگاه کوچینگ و ارتباط موثر نوجوان', subtitle: 'فن بیان و هوش هیجانی', category: 'دوره‌ها', href: '/admin/courses', icon: GraduationCap, keywords: 'ارتباط فن بیان نوجوان' },
    { id: 'c3', title: 'مبانی کارآفرینی و سواد مالی نسل نو', subtitle: 'کسب‌وکار نوپا', category: 'دوره‌ها', href: '/admin/courses', icon: GraduationCap, keywords: 'سواد مالی پول بودجه کارآفرینی' },

    // کاربران
    { id: 'u1', title: 'دکتر علیرضا بیدی', subtitle: 'مدیر ارشد و مشاور - admin@markazbidi.ir', category: 'کاربران', href: '/admin/users?search=بیدی', icon: User, keywords: 'بیدی علیرضا مدیر' },
    { id: 'u2', title: 'سارا محمدی', subtitle: 'دانش‌آموز پایه دهم - ۰۹۱۲۳۴۵۶۷۸۹', category: 'کاربران', href: '/admin/users?search=محمدی', icon: User, keywords: 'سارا محمدی تجربی' },
    { id: 'u3', title: 'مهندس حسینی', subtitle: 'مدرس کارآفرینی و کسب‌وکار', category: 'کاربران', href: '/admin/users?search=حسینی', icon: User, keywords: 'حسینی مدرس' },

    // ابزارها
    { id: 't1', title: 'ایجاد دوره آموزشی جدید', category: 'ابزارها', href: '/admin/courses/create', icon: BookOpen, keywords: 'دوره جدید اضافه کردن ساخت' },
    { id: 't2', title: 'ارسال پیامک اطلاع‌رسانی انبوه', category: 'ابزارها', href: '/admin/marketing/bulk-sms', icon: Mail, keywords: 'اس ام اس پیامک کمپین تبلیغات' },
    { id: 't3', title: 'افزودن خدمت مشاوره‌ای جدید', category: 'ابزارها', href: '/admin/content/services', icon: Boxes, keywords: 'مشاوره خدمت پکیج' },
];

export default function AdminCommandPalette({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) onClose();
                else setSelectedIndex(0);
            }
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return COMMAND_ITEMS;
        return COMMAND_ITEMS.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.subtitle?.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q) ||
                item.keywords?.toLowerCase().includes(q)
        );
    }, [query]);

    const handleSelect = (item: CommandItem) => {
        onClose();
        router.visit(item.href);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[selectedIndex]) {
                handleSelect(filtered[selectedIndex]);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24" dir="rtl">
            <div
                className="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-navy/10">
                {/* Search Header */}
                <div className="flex items-center gap-3 border-b border-navy/10 px-4 py-3.5">
                    <Search className="size-5 text-brand-600" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleInputKeyDown}
                        placeholder="جستجو در پنل، دوره‌ها، کاربران، سفارش‌ها یا دستورات… (مثال: بیدی، پیامک، دوره)"
                        className="flex-1 bg-transparent text-sm font-bold text-navy placeholder:text-navy/40 focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                        <kbd className="hidden rounded-lg bg-soft-gray px-2 py-0.5 text-[10px] font-bold text-navy/50 sm:inline-block">ESC</kbd>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1 text-navy/40 hover:bg-soft-gray hover:text-navy"
                            aria-label="بستن"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Results list */}
                <div className="max-h-80 overflow-y-auto p-2">
                    {filtered.length === 0 ? (
                        <div className="py-12 text-center text-xs font-bold text-navy/45">
                            موردی با عنوان «{query}» یافت نشد.
                        </div>
                    ) : (
                        filtered.map((item, index) => {
                            const isSelected = index === selectedIndex;
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors ${
                                        isSelected ? 'bg-brand-50 text-brand-800' : 'text-navy hover:bg-soft-gray'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                                isSelected ? 'bg-brand-600 text-white' : 'bg-soft-gray text-navy/60'
                                            }`}
                                        >
                                            <Icon className="size-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate text-xs font-black">{item.title}</div>
                                            {item.subtitle && (
                                                <div className="truncate text-[10px] text-navy/50">{item.subtitle}</div>
                                            )}
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                                            isSelected ? 'bg-brand-200/60 text-brand-900' : 'bg-navy/5 text-navy/50'
                                        }`}
                                    >
                                        {item.category}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer hints */}
                <div className="flex items-center justify-between border-t border-navy/5 bg-soft-gray/50 px-4 py-2.5 text-[11px] font-bold text-navy/50">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] shadow-sm">↑</kbd>
                            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] shadow-sm">↓</kbd>
                            پیمایش
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] shadow-sm">Enter</kbd>
                            انتخاب
                        </span>
                    </div>
                    <span>{filtered.length} نتیجه</span>
                </div>
            </div>
        </div>
    );
}
