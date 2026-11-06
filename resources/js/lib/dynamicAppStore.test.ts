import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    createInitialDynamicAppState,
    addGoalToState,
    advanceGoalTaskInState,
    addReminderToState,
    createSupportTicketInState,
    replyToSupportTicketInState,
    toggleLessonCompletionInState,
    purchaseWithWalletInState,
    saveCourseInState,
    deleteCourseFromState,
    updateVipConfigInState,
} from './dynamicAppStore';

describe('dynamicAppStore — Unified Dynamic Tools & Website Sync', () => {
    it('adds a new 90-day goal and advances task progress to completion', () => {
        const initial = createInitialDynamicAppState();
        const withNewGoal = addGoalToState(
            initial.goals,
            'طراحی اولین مینی‌پروژه کارآفرینی نوجوان',
            'آیتم ۴: کارآفرینی',
            '۲۰ خرداد ۱۴۰۴',
            2
        );
        assert.equal(withNewGoal.length, initial.goals.length + 1);
        const added = withNewGoal[0];
        assert.equal(added.completedTasks, 0);
        assert.equal(added.status, 'in_progress');

        const step1 = advanceGoalTaskInState(withNewGoal, added.id, 1);
        assert.equal(step1[0].completedTasks, 1);
        assert.equal(step1[0].status, 'in_progress');

        const step2 = advanceGoalTaskInState(step1, added.id, 1);
        assert.equal(step2[0].completedTasks, 2);
        assert.equal(step2[0].status, 'completed');
    });

    it('adds smart reminders and creates/replies to support tickets dynamically', () => {
        const initial = createInitialDynamicAppState();
        const nextReminders = addReminderToState(
            initial.reminders,
            'مرور کارت‌های هدف‌گذاری قبل از خواب',
            '۲۲:۱۵',
            'هر شب',
            'sms'
        );
        assert.equal(nextReminders.length, initial.reminders.length + 1);
        assert.equal(nextReminders[0].enabled, true);

        const nextTickets = createSupportTicketInState(
            initial.supportTickets,
            'درخواست لینک بازپخش وبینار پنج‌شنبه',
            'آموزش و وبینارها',
            'high',
            'لطفاً لینک بازپخش وبینار استعدادیابی را فعال کنید.',
            'نوید محمدی'
        );
        assert.equal(nextTickets.length, initial.supportTickets.length + 1);
        assert.equal(nextTickets[0].status, 'open');

        const answeredTickets = replyToSupportTicketInState(
            nextTickets,
            nextTickets[0].id,
            'لینک بازپخش در بخش وبینارها و اتاق یادگیری فعال شد.',
            'support',
            'پشتیبانی رشد'
        );
        assert.equal(answeredTickets[0].status, 'answered');
        assert.equal(answeredTickets[0].messages.length, 2);
    });

    it('toggles lesson completion and processes wallet purchases with XP reward', () => {
        const initial = createInitialDynamicAppState();
        const toggledLessons = toggleLessonCompletionInState(initial.lessons, 3);
        const lesson3 = toggledLessons.find((l) => l.id === 3);
        assert.equal(lesson3?.completed, true);

        const purchaseRes = purchaseWithWalletInState(
            initial,
            'کارگاه تخصصی فن بیان نوجوان',
            'teen-public-speaking-pro',
            300000,
            'course'
        );
        assert.equal(purchaseRes.success, true);
        assert.equal(
            purchaseRes.nextState.userProfile.walletBalance,
            initial.userProfile.walletBalance - 300000
        );
        assert.ok(
            purchaseRes.nextState.enrolledCourseSlugs.includes('teen-public-speaking-pro')
        );
        assert.equal(
            purchaseRes.nextState.userProfile.xp,
            initial.userProfile.xp + 100
        );
    });

    it('dynamically edits flagship VIP course and syncs courses list and vipConfig bidirectionally', () => {
        const initial = createInitialDynamicAppState();

        // 1. Update VIP course via Admin Course Form (saveCourseInState)
        const updatedViaForm = saveCourseInState(initial, {
            id: 100,
            title: 'طراحی آینده نوجوان — نسخه تابستان ۱۴۰۴ (VIP)',
            price: 7500000,
            discount_price: 5900000,
            location: 'تهران، مرکز نوآوری رشد — تالار اصلی VIP',
            is_vip: true,
        });
        assert.equal(
            updatedViaForm.vipConfig.title,
            'طراحی آینده نوجوان — نسخه تابستان ۱۴۰۴ (VIP)'
        );
        assert.equal(updatedViaForm.vipConfig.price, 7500000);
        assert.equal(updatedViaForm.vipConfig.discountPrice, 5900000);
        assert.equal(
            updatedViaForm.courses.find((c) => c.id === 100)?.title,
            'طراحی آینده نوجوان — نسخه تابستان ۱۴۰۴ (VIP)'
        );

        // 2. Update via updateVipConfigInState and verify course item updates
        const updatedViaConfig = updateVipConfigInState(updatedViaForm, {
            title: 'باشگاه نخبگان آینده نوجوان (VIP)',
            discountPrice: 5200000,
        });
        const vipCourse = updatedViaConfig.courses.find((c) => c.id === 100);
        assert.equal(vipCourse?.title, 'باشگاه نخبگان آینده نوجوان (VIP)');
        assert.equal(vipCourse?.discount_price, 5200000);

        // 3. Create a brand new course and delete it
        const withNewCourse = saveCourseInState(updatedViaConfig, {
            id: 505,
            title: 'کارگاه هوش مصنوعی ویژه نوجوانان',
            slug: 'teen-ai-bootcamp',
            price: 1800000,
        });
        assert.equal(withNewCourse.courses.length, initial.courses.length + 1);

        const afterDelete = deleteCourseFromState(withNewCourse, 505);
        assert.equal(afterDelete.courses.length, initial.courses.length);
    });

    it('verifies PWA and Mobile installed app icons have valid PNG headers, square dimensions, and separate any/maskable manifest entries', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const root = process.cwd();

        const readPngSize = (relPath: string) => {
            const buf = fs.readFileSync(path.join(root, relPath));
            assert.equal(buf[0], 0x89, `${relPath} must be a valid PNG`);
            assert.equal(buf.toString('ascii', 1, 4), 'PNG', `${relPath} must have PNG signature`);
            const width = buf.readUInt32BE(16);
            const height = buf.readUInt32BE(20);
            return { width, height, bytes: buf.length };
        };

        const expectedIcons: Array<[string, number]> = [
            ['public/pwa-192x192.png', 192],
            ['public/pwa-512x512.png', 512],
            ['public/pwa-maskable-512x512.png', 512],
            ['public/apple-touch-icon.png', 180],
            ['public/favicon.png', 64],
            ['public/images/roshd-logo.png', 1024],
            ['public/downloads/roshd-logo.png', 1024],
            ['mobile/assets/icon.png', 1024],
            ['mobile/assets/roshd-logo.png', 1024],
            ['mobile/assets/splash-icon.png', 1024],
            ['mobile/assets/android-icon-foreground.png', 1024],
            ['mobile/assets/android-icon-background.png', 512],
            ['mobile/assets/android-icon-monochrome.png', 432],
            ['mobile/assets/favicon.png', 64],
        ];

        for (const [relPath, size] of expectedIcons) {
            const info = readPngSize(relPath);
            assert.equal(info.width, size, `${relPath} width must be ${size}`);
            assert.equal(info.height, size, `${relPath} height must be ${size}`);
            assert.ok(info.bytes > 500, `${relPath} must not be empty`);
        }

        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/manifest.webmanifest'), 'utf-8'));
        assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 3);
        assert.ok(manifest.icons.some((i: any) => i.purpose === 'any' && i.sizes === '192x192'));
        assert.ok(manifest.icons.some((i: any) => i.purpose === 'any' && i.sizes === '512x512'));
        assert.ok(manifest.icons.some((i: any) => i.purpose === 'maskable' && i.sizes === '512x512'));

        const appJson = JSON.parse(fs.readFileSync(path.join(root, 'mobile/app.json'), 'utf-8'));
        assert.equal(appJson.expo.icon, './assets/icon.png');
        assert.equal(appJson.expo.android.adaptiveIcon.foregroundImage, './assets/android-icon-foreground.png');
        assert.equal(appJson.expo.android.adaptiveIcon.backgroundColor, '#57A33D');
    });
});

