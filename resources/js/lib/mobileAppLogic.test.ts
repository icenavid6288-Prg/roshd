import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    appendChatMessage,
    canSendMessageInChannel,
    defaultCourseItemsWithInstructors,
    filterCoursesByQueryAndCategory,
    resolveProductConsumptionMode,
} from './mobileAppLogic';

describe('mobileAppLogic — Multi-Instructor Chat, Group Toggle & In-App Media', () => {
    it('defines 4 distinct course items each with its own specialized instructor', () => {
        assert.equal(defaultCourseItemsWithInstructors.length, 4);
        const instructorIds = new Set(
            defaultCourseItemsWithInstructors.map((i) => i.instructorId)
        );
        assert.equal(instructorIds.size, 4);
    });

    it('blocks student messages in course group chat when disabled by admin, while allowing instructor and private/support channels', () => {
        const blockedStudent = canSendMessageInChannel('group', false, 'vip_student');
        assert.equal(blockedStudent.allowed, false);
        assert.ok(blockedStudent.reason?.includes('توسط ادمین غیرفعال'));

        const allowedInstructorInDisabledGroup = canSendMessageInChannel(
            'group',
            false,
            'instructor'
        );
        assert.equal(allowedInstructorInDisabledGroup.allowed, true);

        const allowedPrivateWhenGroupDisabled = canSendMessageInChannel(
            'instructor',
            false,
            'vip_student'
        );
        assert.equal(allowedPrivateWhenGroupDisabled.allowed, true);

        const allowedSupportWhenGroupDisabled = canSendMessageInChannel(
            'support',
            false,
            'vip_student'
        );
        assert.equal(allowedSupportWhenGroupDisabled.allowed, true);
    });

    it('appends trimmed chat messages and ignores blank messages', () => {
        const initial = defaultCourseItemsWithInstructors[0].initialMessages;
        const unchanged = appendChatMessage(initial, '   ', 'student', 'نوید محمدی');
        assert.equal(unchanged.length, initial.length);

        const updated = appendChatMessage(
            initial,
            'سلام استاد، تمرین رو ارسال کردم.',
            'student',
            'نوید محمدی'
        );
        assert.equal(updated.length, initial.length + 1);
        assert.equal(updated[updated.length - 1].text, 'سلام استاد، تمرین رو ارسال کردم.');
    });

    it('filters courses accurately by search query and category', () => {
        const sample = [
            { title: 'طراحی آینده نوجوان', summary: 'دوره VIP', category: 'نوجوانان و والدین' },
            { title: 'هوش مالی و کارآفرینی', summary: 'مدل کسب‌وکار', category: 'کارآفرینی' },
        ];
        assert.equal(filterCoursesByQueryAndCategory(sample, 'نوجوان', 'همه').length, 1);
        assert.equal(filterCoursesByQueryAndCategory(sample, '', 'کارآفرینی').length, 1);
        assert.equal(filterCoursesByQueryAndCategory(sample, 'ناموجود', 'همه').length, 0);
    });

    it('resolves non-downloadable in-app book and podcast modes accurately', () => {
        const bookMode = resolveProductConsumptionMode({
            deliveryType: 'in_app_book',
            inAppOnly: true,
        });
        assert.equal(bookMode.canReadInApp, true);
        assert.equal(bookMode.canListenInApp, false);
        assert.equal(bookMode.isDownloadDisabled, true);

        const podcastMode = resolveProductConsumptionMode({
            deliveryType: 'in_app_podcast',
            inAppOnly: true,
        });
        assert.equal(podcastMode.canReadInApp, false);
        assert.equal(podcastMode.canListenInApp, true);
        assert.equal(podcastMode.isDownloadDisabled, true);
    });
});
