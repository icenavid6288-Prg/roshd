import '../css/app.css';
import './bootstrap';
import './lib/route';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { vibrate } from '@/lib/haptics';
import { getMockPageData, mockSite, mockMenus, mockStats } from './lib/mockData';

// بازخورد لمسی خفیف روی دکمه‌ها/لینک‌ها برای دستگاه‌های لمسی (موبایل).
if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    document.addEventListener(
        'touchstart',
        (event) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest('button, a')) vibrate(8);
        },
        { passive: true },
    );
}

const appName = import.meta.env.VITE_APP_NAME || 'مرکز رشد و کارآفرینی دکتر بیدی';

// Apply the stored theme before Inertia mounts so dark pages do not flash white.
if (typeof window !== 'undefined') {
    const savedTheme = window.localStorage.getItem('markaz-theme');
    const shouldUseDark = savedTheme === 'dark' || (savedTheme !== 'light' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', shouldUseDark);
    document.documentElement.style.colorScheme = shouldUseDark ? 'dark' : 'light';

    if ('serviceWorker' in navigator && import.meta.env.PROD) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => registration.update())
                .catch(() => undefined);
        });
    }
}

// Fallback & resolution for Inertia initial page
function getInitialPage() {
    let pageData: any = null;
    const path = typeof window !== 'undefined'
        ? (window.location.pathname.replace(/\/$/, '') || '/')
        : '/';

    if (typeof document !== 'undefined') {
        const appEl = document.getElementById('app');
        if (appEl && appEl.dataset.page) {
            try {
                pageData = JSON.parse(appEl.dataset.page);
            } catch {
                pageData = null;
            }
        }
    }

    let component = pageData?.component || 'MobileApp/Preview';
    if (path === '/' || path === '') {
        component = 'MobileApp/Preview';
    } else if (path === '/web' || path === '/home') {
        component = 'Home';
    } else if (!pageData) {
        if (path === '/courses') component = 'Courses/Index';
        else if (path.startsWith('/courses/')) component = 'Courses/Show';
        else if (path === '/shop') component = 'Shop/Index';
        else if (path.startsWith('/shop/')) component = 'Shop/Show';
        else if (path === '/about') component = 'About/Index';
        else if (path === '/contact') component = 'Contact/Index';
        else if (path === '/services') component = 'Services/Index';
        else if (path === '/blog') component = 'Blog/Index';
        else if (path === '/login') component = 'Auth/Login';
        else if (path === '/register') component = 'Auth/Register';
        else if (path === '/cart') component = 'Cart/Index';
        else if (path === '/mobile-app' || path === '/dashboard/mobile-app') component = 'MobileApp/Preview';
        else if (path === '/dashboard/reminders') component = 'Dashboard/Reminders';
        else if (path.startsWith('/dashboard')) component = 'Dashboard';
        else if (path === '/admin' || path === '/admin/dashboard') component = 'Admin/Dashboard';
        else if (path === '/admin/courses') component = 'Admin/Courses/Index';
        else if (path === '/admin/users') component = 'Admin/Users/Index';
        else if (path === '/admin/crm') component = 'Admin/Crm/Dashboard';
        else if (path.startsWith('/admin/settings')) component = 'Admin/Settings/Index';
        else if (path.startsWith('/admin')) component = 'Admin/Dashboard';
    }

    const fallbackProps = getMockPageData(component, path);

    const isStatsArray = Array.isArray(fallbackProps.stats);
    const safeStats = isStatsArray
        ? (Array.isArray(pageData?.props?.stats) && pageData.props.stats.length > 0 ? pageData.props.stats : mockStats)
        : { ...(fallbackProps.stats || {}), ...(pageData?.props?.stats && !Array.isArray(pageData.props.stats) ? pageData.props.stats : {}) };

    const safeProps = {
        ...fallbackProps,
        ...(pageData?.props || {}),
        site: { ...mockSite, ...(pageData?.props?.site || {}) },
        menus: { ...mockMenus, ...(pageData?.props?.menus || {}) },
        stats: safeStats,
    };

    const result = {
        component,
        props: safeProps,
        url: typeof window !== 'undefined' ? window.location.pathname : '/',
        version: '1.0',
    };

    if (typeof document !== 'undefined') {
        const appEl = document.getElementById('app');
        if (appEl) {
            appEl.dataset.page = JSON.stringify(result);
        }
    }

    return result;
}

const initialPage = getInitialPage();
const pages = import.meta.glob('./Pages/**/*.tsx');

createInertiaApp({
    id: 'app',
    page: initialPage,
    nonce: typeof document !== 'undefined'
        ? document.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')?.content
        : undefined,
    title: (title) => title || appName,
    resolve: async (name) => {
        const pageLoader = pages[`./Pages/${name}.tsx`];
        if (!pageLoader) {
            console.warn(`Page not found: ${name}, falling back to Home`);
            const fallback = pages['./Pages/Home.tsx'];
            return fallback ? await fallback() : null;
        }
        return await pageLoader();
    },
    setup({ el, App, props }) {
        const targetEl = el || document.getElementById('app');
        if (!targetEl) {
            console.error('Target element #app not found');
            return;
        }
        const root = createRoot(targetEl);
        root.render(<App {...props} />);
    },
});
