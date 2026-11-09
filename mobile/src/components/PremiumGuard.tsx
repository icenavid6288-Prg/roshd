import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export interface PremiumGuardProps {
    isAuthorized?: boolean;
    requireVip?: boolean;
    courseSlug?: string;
    courseTitle?: string;
    featureName?: string;
    onUnauthorized?: () => void;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export function PremiumGuard({
    isAuthorized,
    requireVip = true,
    courseSlug,
    onUnauthorized,
    fallback,
    children,
}: PremiumGuardProps) {
    const { user } = useAuth();

    // Check if user has VIP status or enrollment
    const hasAccess =
        typeof isAuthorized === 'boolean'
            ? isAuthorized
            : (() => {
                  if (!user) return false;
                  // If user has referral or vip status or specific role
                  const isVip = (user as any).is_vip || (user as any).role === 'vip_student';
                  if (isVip) return true;
                  if (courseSlug === 'designing-teen-future-vip' || requireVip) {
                      return false;
                  }
                  return true;
              })();

    useEffect(() => {
        if (!hasAccess && onUnauthorized) {
            onUnauthorized();
        }
    }, [hasAccess, onUnauthorized]);

    if (!hasAccess) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}
export default PremiumGuard;
