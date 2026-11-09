import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkPremiumAccess } from './premiumGuardLogic';

describe('premiumGuardLogic — Role-based & Gated Content Access Evaluation', () => {
    it('authorizes users with VIP roles (vip_student, admin, instructor)', () => {
        const studentResult = checkPremiumAccess({ role: 'vip_student' }, { courseSlug: 'designing-teen-future-vip' });
        assert.equal(studentResult.isAuthorized, true);
        assert.equal(studentResult.redirectScreen, null);

        const adminResult = checkPremiumAccess({ role: 'admin' }, { requireVip: true });
        assert.equal(adminResult.isAuthorized, true);

        const instructorResult = checkPremiumAccess({ role: 'instructor' });
        assert.equal(instructorResult.isAuthorized, true);
    });

    it('authorizes when isVipEnrolled state is active', () => {
        const result = checkPremiumAccess(
            { role: 'regular_user', isVip: false },
            { isVipEnrolled: true, courseSlug: 'designing-teen-future-vip' }
        );
        assert.equal(result.isAuthorized, true);
        assert.equal(result.reason, 'authorized');
        assert.equal(result.redirectScreen, null);
    });

    it('authorizes when user is enrolled in the specific course slug', () => {
        const result = checkPremiumAccess(
            { role: 'regular_user' },
            {
                courseSlug: 'teen-public-speaking-pro',
                enrolledCourseSlugs: ['teen-public-speaking-pro'],
            }
        );
        assert.equal(result.isAuthorized, true);
        assert.equal(result.reason, 'authorized');
        assert.equal(result.redirectScreen, null);
    });

    it('blocks regular unauthorized user from VIP course and redirects to upsell', () => {
        const result = checkPremiumAccess(
            { role: 'regular_user', isVip: false },
            {
                courseSlug: 'designing-teen-future-vip',
                courseIsVip: true,
                isVipEnrolled: false,
                enrolledCourseSlugs: [],
            }
        );
        assert.equal(result.isAuthorized, false);
        assert.equal(result.reason, 'vip_required');
        assert.equal(result.redirectScreen, 'upsell');
        assert.ok(result.message.includes('ویژه اعضای دوره پرچمدار'));
    });

    it('blocks unauthenticated or empty user attempting to access gated content', () => {
        const result = checkPremiumAccess(null, {
            requireVip: true,
        });
        assert.equal(result.isAuthorized, false);
        assert.equal(result.redirectScreen, 'upsell');
    });
});
