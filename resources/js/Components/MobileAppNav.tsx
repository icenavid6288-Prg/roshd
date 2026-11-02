import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import type { PageProps } from '@/types';

export interface MobileAppNavItem {
    label: string;
    href?: string;
    icon: LucideIcon;
    onClick?: () => void;
    active?: boolean;
}

interface MobileAppNavProps {
    items: MobileAppNavItem[];
    ariaLabel?: string;
}

export default function MobileAppNav({ items, ariaLabel = 'ناوبری سریع اپلیکیشن' }: MobileAppNavProps) {
    const { url } = usePage<PageProps>();

    const isActive = (item: MobileAppNavItem) => {
        if (typeof item.active === 'boolean') return item.active;
        if (!item.href || item.href.startsWith('#')) return false;
        const cleanUrl = url.split('?')[0];
        if (item.href === '/') return cleanUrl === '/';
        if (item.href === '/web') return cleanUrl === '/web' || cleanUrl === '/home';
        if (item.href === '/dashboard') return cleanUrl === '/dashboard';
        return cleanUrl === item.href || cleanUrl.startsWith(`${item.href}/`);
    };

    return (
        <nav className="mobile-app-nav" aria-label={ariaLabel}>
            <div className="mobile-app-nav-inner">
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    const content = (
                        <>
                            <span className="mobile-app-nav-icon"><Icon className="size-[1.15rem]" strokeWidth={active ? 2.4 : 1.9} aria-hidden /></span>
                            <span className="mobile-app-nav-label">{item.label}</span>
                        </>
                    );

                    if (item.onClick) {
                        return (
                            <button key={item.label} type="button" onClick={item.onClick} className={`mobile-app-nav-item ${active ? 'is-active' : ''}`}>
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link key={item.label} href={item.href ?? '/'} className={`mobile-app-nav-item ${active ? 'is-active' : ''}`}>
                            {content}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
