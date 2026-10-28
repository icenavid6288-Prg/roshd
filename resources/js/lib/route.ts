// Ziggy route fallback
type RouteParams = Record<string, any> | string | number;

const routes: Record<string, string> = {
    'home': '/',
    'welcome': '/',
    'login': '/login',
    'login.store': '/login',
    'login.verify.store': '/login/verify',
    'register': '/register',
    'register.store': '/register',
    'register.verify.store': '/register/verify',
    'logout': '/logout',
    'password.request': '/forgot-password',
    'password.email': '/forgot-password',
    'password.reset': '/reset-password',
    'password.store': '/reset-password',
    'password.confirm': '/confirm-password',
    'verification.send': '/email/verification-notification',
    'dashboard': '/dashboard',
    'dashboard.orders': '/dashboard/orders',
    'dashboard.courses': '/dashboard/courses',
    'dashboard.certificates': '/dashboard/certificates',
    'dashboard.goals': '/dashboard/goals',
    'dashboard.sessions': '/dashboard/sessions',
    'dashboard.assignments': '/dashboard/assignments',
    'dashboard.library': '/dashboard/library',
    'dashboard.notifications': '/dashboard/notifications',
    'dashboard.notifications.read': '/dashboard/notifications/read',
    'dashboard.notifications.read-all': '/dashboard/notifications/read-all',
    'dashboard.wishlist': '/dashboard/wishlist',
    'dashboard.referrals': '/dashboard/referrals',
    'dashboard.support.index': '/support',
    'dashboard.support.store': '/support',
    'dashboard.support.show': '/support',
    'dashboard.support.reply': '/support/reply',
    'dashboard.onboarding.store': '/onboarding',
    'profile.edit': '/profile',
    'profile.update': '/profile',
    'profile.destroy': '/profile',
    'courses.index': '/courses',
    'courses.show': '/courses',
    'shop.index': '/shop',
    'shop.show': '/shop',
    'cart.index': '/cart',
    'checkout.show': '/checkout',
    'blog.index': '/blog',
    'blog.show': '/blog',
    'about.index': '/about',
    'contact.index': '/contact',
    'services.index': '/services',
    'services.show': '/services',
    'team.index': '/team',
    'coaching.index': '/coaching',
    'events.index': '/events',
    'admin.dashboard': '/admin',
    'admin.login': '/admin/login',
    'admin.login.store': '/admin/login',
    'admin.courses.index': '/admin/courses',
    'admin.users.index': '/admin/users',
    'admin.content.index': '/admin/content',
    'admin.content.tickets.reply': '/admin/tickets/reply',
    'admin.crm.dashboard': '/admin/crm',
};

export function route(name?: string, params?: RouteParams): string {
    if (!name) return typeof window !== 'undefined' ? window.location.pathname : '/';
    let url = routes[name] || '/' + name.replace(/\./g, '/');
    if (params !== undefined) {
        if (typeof params === 'object' && params !== null) {
            const q: string[] = [];
            for (const [k, v] of Object.entries(params)) {
                if (url.includes(`:${k}`)) url = url.replace(`:${k}`, String(v));
                else q.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
            }
            if (q.length > 0) url += (url.includes('?') ? '&' : '?') + q.join('&');
        } else {
            url += `/${params}`;
        }
    }
    return url;
}

if (typeof window !== 'undefined') {
    (window as any).route = route;
    (window as any).Ziggy = { routes, url: window.location.origin, defaults: {} };
}

export default route;
