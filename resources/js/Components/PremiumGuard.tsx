import React, { useEffect } from 'react';
import { UpsellScreen } from './UpsellScreen';
import { checkPremiumAccess, type PremiumGuardUser } from '@/lib/premiumGuardLogic';

export interface PremiumGuardProps {
    /**
     * Optional boolean override for authorization. If omitted, access is derived from user & options.
     */
    isAuthorized?: boolean;
    /**
     * Current user data (e.g. profile, role, VIP status)
     */
    user?: PremiumGuardUser | null;
    /**
     * User's active preview or system role
     */
    userRole?: string;
    /**
     * Whether VIP enrollment is required
     */
    requireVip?: boolean;
    /**
     * Slugs of courses currently enrolled by user
     */
    enrolledCourseSlugs?: string[];
    /**
     * Global VIP enrolled status flag from dynamic app state
     */
    isVipEnrolled?: boolean;
    /**
     * Slug of the course being accessed
     */
    courseSlug?: string;
    /**
     * Human-readable title of the course
     */
    courseTitle?: string;
    /**
     * Specific feature or section being gated (e.g. 'اتاق یادگیری', 'چت با اساتید')
     */
    featureName?: string;
    /**
     * 'redirect': fires onRedirect to navigate to the upsell screen.
     * 'inline': replaces the gated content with the UpsellScreen in place.
     */
    mode?: 'redirect' | 'inline';
    /**
     * Callback invoked to redirect unauthorized user to the Upsell screen
     */
    onRedirect?: () => void;
    /**
     * Callback invoked when user clicks upgrade/enroll on the upsell screen
     */
    onUpgrade?: () => void;
    /**
     * Callback invoked when user clicks back
     */
    onBack?: () => void;
    /**
     * Custom fallback element to render instead of the default UpsellScreen
     */
    fallback?: React.ReactNode;
    /**
     * Children to render when user is authorized
     */
    children: React.ReactNode;
    /**
     * Dark theme flag
     */
    isDark?: boolean;
}

export function PremiumGuard({
    isAuthorized,
    user,
    userRole,
    requireVip = true,
    enrolledCourseSlugs = [],
    isVipEnrolled = false,
    courseSlug,
    courseTitle,
    featureName,
    mode = 'redirect',
    onRedirect,
    onUpgrade,
    onBack,
    fallback,
    children,
    isDark = false,
}: PremiumGuardProps) {
    // 1. Evaluate access: use explicit prop if provided, otherwise evaluate with checkPremiumAccess
    const access =
        typeof isAuthorized === 'boolean'
            ? {
                  isAuthorized,
                  reason: isAuthorized ? 'authorized' : 'vip_required',
                  redirectScreen: isAuthorized ? null : ('upsell' as const),
                  message: isAuthorized ? 'مجاز' : 'دسترسی محدود',
              }
            : checkPremiumAccess(
                  user || (userRole ? { role: userRole } : null),
                  {
                      courseSlug,
                      requireVip,
                      enrolledCourseSlugs,
                      isVipEnrolled,
                  }
              );

    // 2. Trigger redirect if unauthorized and mode is 'redirect'
    useEffect(() => {
        if (!access.isAuthorized && mode === 'redirect' && onRedirect) {
            onRedirect();
        }
    }, [access.isAuthorized, mode, onRedirect]);

    // 3. Authorized -> render protected content
    if (access.isAuthorized) {
        return <>{children}</>;
    }

    // 4. Unauthorized -> render custom fallback or default UpsellScreen
    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <UpsellScreen
            courseTitle={courseTitle}
            courseSlug={courseSlug}
            featureName={featureName}
            onUpgrade={onUpgrade}
            onBack={onBack}
            isDark={isDark}
        />
    );
}

export default PremiumGuard;
