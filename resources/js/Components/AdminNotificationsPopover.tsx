import { Link } from '@inertiajs/react';
import {
    Bell,
    CheckCheck,
    CreditCard,
    MessageSquare,
    ShieldCheck,
    Sparkles,
    Target,
    Ticket,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'lead' | 'order' | 'system' | 'ticket';
    read: boolean;
    href?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'n1',
        title: 'سرنخ جدید: رزرو مشاوره هدایت تحصیلی',
        description: 'علی احمدی (پایه دهم) فرم ارزیابی مسیر آینده را تکمیل کرد.',
        time: '۵ دقیقه پیش',
        type: 'lead',
        read: false,
        href: '/admin/leads',
    },
    {
        id: 'n2',
        title: 'سفارش موفق: دوره طراحی مسیر آینده',
        description: 'پرداخت ۲,۴۵۰,۰۰۰ تومان توسط خانم حسینی از درگاه زرین‌پال تأیید شد.',
        time: '۲۸ دقیقه پیش',
        type: 'order',
        read: false,
        href: '/admin/content/orders',
    },
    {
        id: 'n3',
        title: 'سلامت زیرساخت و سرویس‌ها',
        description: 'ارتباط وب‌سرویس پیامک کاوه‌نگار با میانگین تاخیر ۰.۴ ثانیه پایدار است.',
        time: '۲ ساعت پیش',
        type: 'system',
        read: false,
        href: '/admin/settings/sms',
    },
    {
        id: 'n4',
        title: 'تیکت پشتیبانی جدید',
        description: 'سارا محمدی: سوال پیرامون نحوه دریافت گواهینامه پایان دوره کارآفرینی.',
        time: '۴ ساعت پیش',
        type: 'ticket',
        read: true,
        href: '/admin/content/tickets',
    },
];

export default function AdminNotificationsPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
    const [tab, setTab] = useState<'all' | 'unread'>('all');
    const popoverRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const displayed = tab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

    const getIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'lead':
                return <Target className="size-4 text-sky-600" />;
            case 'order':
                return <CreditCard className="size-4 text-emerald-600" />;
            case 'ticket':
                return <Ticket className="size-4 text-amber-600" />;
            case 'system':
            default:
                return <ShieldCheck className="size-4 text-brand-600" />;
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-xl p-2 text-navy/60 transition-colors hover:bg-soft-gray hover:text-navy"
                aria-label="اعلان‌ها"
            >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    className="absolute left-0 top-full z-50 mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-navy/10"
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-navy/5 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-black text-navy">مرکز اعلان‌های زنده</h3>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                    {unreadCount} خوانده نشده
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-800"
                            >
                                <CheckCheck className="size-3.5" />
                                خواندن همه
                            </button>
                        )}
                    </div>

                    {/* Filter tabs */}
                    <div className="flex border-b border-navy/5 bg-soft-gray/40 px-3 py-1.5 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setTab('all')}
                            className={`rounded-lg px-2.5 py-1 transition-colors ${
                                tab === 'all' ? 'bg-white text-navy font-black shadow-xs' : 'text-navy/55 hover:text-navy'
                            }`}
                        >
                            همه اعلان‌ها ({notifications.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('unread')}
                            className={`rounded-lg px-2.5 py-1 transition-colors ${
                                tab === 'unread' ? 'bg-white text-navy font-black shadow-xs' : 'text-navy/55 hover:text-navy'
                            }`}
                        >
                            فقط جدیدها ({unreadCount})
                        </button>
                    </div>

                    {/* Notification list */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-navy/5">
                        {displayed.length === 0 ? (
                            <div className="py-8 text-center text-xs font-bold text-navy/40">
                                اعلان جدیدی وجود ندارد.
                            </div>
                        ) : (
                            displayed.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href || '#'}
                                    onClick={() => {
                                        markAsRead(item.id);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-start gap-3 p-3.5 transition-colors hover:bg-soft-gray/60 ${
                                        !item.read ? 'bg-brand-50/40' : ''
                                    }`}
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs ring-1 ring-navy/5">
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className={`truncate text-xs ${!item.read ? 'font-black text-navy' : 'font-bold text-navy/75'}`}>
                                                {item.title}
                                            </div>
                                            {!item.read && <span className="size-2 shrink-0 rounded-full bg-brand-600" />}
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-navy/60">
                                            {item.description}
                                        </p>
                                        <div className="mt-1.5 text-[10px] font-bold text-navy/40">
                                            {item.time}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
