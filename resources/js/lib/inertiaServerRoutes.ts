import { getMockPageData } from './mockData.js';

export function resolveInertiaRoute(cleanPath: string): { component: string; props: Record<string, any> } {
    let component = 'MobileApp/Preview';

    if (cleanPath === '/' || cleanPath === '') {
        component = 'MobileApp/Preview';
    } else if (cleanPath === '/web' || cleanPath === '/home') {
        component = 'Home';
    } else if (cleanPath === '/about') {
        component = 'About/Index';
    } else if (cleanPath === '/contact') {
        component = 'Contact/Index';
    } else if (cleanPath === '/courses') {
        component = 'Courses/Index';
    } else if (cleanPath.startsWith('/courses/')) {
        component = 'Courses/Show';
    } else if (cleanPath === '/services') {
        component = 'Services/Index';
    } else if (cleanPath.startsWith('/services/')) {
        component = 'Services/Show';
    } else if (cleanPath === '/shop') {
        component = 'Shop/Index';
    } else if (cleanPath.startsWith('/shop/')) {
        component = 'Shop/Show';
    } else if (cleanPath === '/cart') {
        component = 'Cart/Index';
    } else if (cleanPath === '/checkout') {
        component = 'Checkout/Show';
    } else if (cleanPath === '/blog') {
        component = 'Blog/Index';
    } else if (cleanPath.startsWith('/blog/')) {
        component = 'Blog/Show';
    } else if (cleanPath === '/team') {
        component = 'Team/Index';
    } else if (cleanPath === '/coaching') {
        component = 'Coaching/Index';
    } else if (cleanPath === '/events') {
        component = 'Events/Index';
    } else if (cleanPath.startsWith('/events/')) {
        component = 'Events/Show';
    } else if (cleanPath === '/login') {
        component = 'Auth/Login';
    } else if (cleanPath === '/register') {
        component = 'Auth/Register';
    } else if (cleanPath === '/forgot-password') {
        component = 'Auth/ForgotPassword';
    } else if (cleanPath === '/reset-password') {
        component = 'Auth/ResetPassword';
    } else if (cleanPath === '/dashboard') {
        component = 'Dashboard';
    } else if (cleanPath === '/dashboard/courses') {
        component = 'Dashboard/Courses';
    } else if (cleanPath === '/dashboard/orders') {
        component = 'Dashboard/Orders';
    } else if (cleanPath === '/dashboard/certificates') {
        component = 'Dashboard/Certificates';
    } else if (cleanPath === '/dashboard/goals') {
        component = 'Dashboard/Goals';
    } else if (cleanPath === '/dashboard/sessions') {
        component = 'Dashboard/Sessions';
    } else if (cleanPath === '/dashboard/assignments') {
        component = 'Dashboard/Assignments';
    } else if (cleanPath === '/dashboard/library') {
        component = 'Dashboard/Library';
    } else if (cleanPath === '/dashboard/notifications') {
        component = 'Dashboard/Notifications';
    } else if (cleanPath === '/dashboard/wishlist') {
        component = 'Dashboard/Wishlist';
    } else if (cleanPath === '/dashboard/referrals') {
        component = 'Dashboard/Referrals';
    } else if (cleanPath === '/dashboard/reminders') {
        component = 'Dashboard/Reminders';
    } else if (cleanPath === '/mobile-app' || cleanPath === '/dashboard/mobile-app') {
        component = 'MobileApp/Preview';
    } else if (cleanPath === '/support' || cleanPath === '/dashboard/support') {
        component = 'Support/Index';
    } else if (cleanPath.startsWith('/support/')) {
        component = 'Support/Show';
    } else if (cleanPath === '/onboarding') {
        component = 'Onboarding/Index';
    } else if (cleanPath === '/profile') {
        component = 'Profile/Edit';
    } else if (cleanPath === '/admin' || cleanPath === '/admin/dashboard') {
        component = 'Admin/Dashboard';
    } else if (cleanPath === '/admin/login') {
        component = 'Auth/AdminLogin';
    } else if (cleanPath === '/admin/courses') {
        component = 'Admin/Courses/Index';
    } else if (cleanPath === '/admin/users') {
        component = 'Admin/Users/Index';
    } else if (cleanPath === '/admin/crm') {
        component = 'Admin/Crm/Dashboard';
    } else if (cleanPath.startsWith('/admin/settings')) {
        component = 'Admin/Settings/Index';
    } else if (cleanPath.startsWith('/admin')) {
        component = 'Admin/Dashboard';
    }

    const props = getMockPageData(component, cleanPath);
    return { component, props };
}
