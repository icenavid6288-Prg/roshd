export interface PremiumGuardUser {
    id?: number;
    name?: string;
    role?: 'vip_student' | 'regular_user' | 'instructor' | 'admin' | string;
    isVip?: boolean;
    enrolledCourses?: string[];
    subscriptionActive?: boolean;
}

export interface PremiumAccessOptions {
    courseSlug?: string;
    courseIsVip?: boolean;
    requireVip?: boolean;
    allowFreeTeaser?: boolean;
    enrolledCourseSlugs?: string[];
    isVipEnrolled?: boolean;
}

export interface PremiumAccessResult {
    isAuthorized: boolean;
    reason: 'authorized' | 'not_enrolled' | 'vip_required' | 'unauthenticated' | 'subscription_expired';
    redirectScreen: 'upsell' | null;
    message: string;
}

/**
 * Pure function to evaluate if a user has access to premium / gated content.
 */
export function checkPremiumAccess(
    user: PremiumGuardUser | null | undefined,
    options: PremiumAccessOptions = {}
): PremiumAccessResult {
    const {
        courseSlug,
        courseIsVip = false,
        requireVip = false,
        enrolledCourseSlugs = [],
        isVipEnrolled = false,
    } = options;

    // 1. If explicit VIP status toggle is true, or user has VIP/admin/instructor role, grant access
    const hasVipRole =
        user?.role === 'vip_student' ||
        user?.role === 'admin' ||
        user?.role === 'instructor' ||
        user?.isVip === true;

    // Global VIP status from app state
    if (isVipEnrolled || hasVipRole) {
        return {
            isAuthorized: true,
            reason: 'authorized',
            redirectScreen: null,
            message: 'دسترسی مجاز است (عضویت ویژه VIP)',
        };
    }

    // 2. If the specific course is enrolled in the user's enrolled course slugs
    if (courseSlug) {
        const isEnrolledInCourse =
            enrolledCourseSlugs.includes(courseSlug) ||
            user?.enrolledCourses?.includes(courseSlug);

        if (isEnrolledInCourse) {
            return {
                isAuthorized: true,
                reason: 'authorized',
                redirectScreen: null,
                message: 'دسترسی مجاز است (ثبت‌نام شده در دوره)',
            };
        }
    }

    // 3. If VIP is strictly required or it's a VIP course
    if (requireVip || courseIsVip || courseSlug === 'designing-teen-future-vip') {
        return {
            isAuthorized: false,
            reason: 'vip_required',
            redirectScreen: 'upsell',
            message: 'مشاهده این محتوا ویژه اعضای دوره پرچمدار و اشتراک VIP است.',
        };
    }

    // 4. Default: un-enrolled user attempting to access gated content
    return {
        isAuthorized: false,
        reason: 'not_enrolled',
        redirectScreen: 'upsell',
        message: 'برای دسترسی به این بخش، نیاز به ثبت‌نام یا ارتقای عضویت دارید.',
    };
}
