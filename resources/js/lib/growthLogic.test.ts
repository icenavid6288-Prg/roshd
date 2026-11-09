import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
    defaultCourseAssignments,
    defaultCourseQuizzes,
    getAssignmentsForCourse,
    getQuizzesForCourse,
    submitAssignmentResponse,
    completeQuizScore,
    calculateCourseAverageGrade,
    calculateCourseQuizAverage,
    resolveDashboardViewMode,
} from './growthLogic';

describe('growthLogic — Course Specific Growth, Assignments & Quizzes', () => {
    test('filters assignments and quizzes correctly for specific course slug', () => {
        const vipAssignments = getAssignmentsForCourse(
            defaultCourseAssignments,
            'designing-teen-future-vip'
        );
        assert.equal(vipAssignments.length, 4);
        assert.equal(vipAssignments[0].sessionNumber, 1);

        const vipQuizzes = getQuizzesForCourse(
            defaultCourseQuizzes,
            'designing-teen-future-vip'
        );
        assert.equal(vipQuizzes.length, 4);

        const otherAssignments = getAssignmentsForCourse(
            defaultCourseAssignments,
            'clifton-strengths-career-mastery'
        );
        assert.equal(otherAssignments.length, 2);
    });

    test('submits an assignment response and updates its status', () => {
        const updated = submitAssignmentResponse(
            defaultCourseAssignments,
            'asg-vip-3',
            'پاسخ صوتی و فایل خلاصه من بارگذاری شد.'
        );
        const target = updated.find((a) => a.id === 'asg-vip-3');
        assert.ok(target);
        assert.equal(target?.status, 'submitted');
        assert.equal(target?.submissionText, 'پاسخ صوتی و فایل خلاصه من بارگذاری شد.');
        assert.equal(target?.submittedAt, 'هم‌اکنون');
    });

    test('completes a quiz with a score and marks it completed', () => {
        const updated = completeQuizScore(
            defaultCourseQuizzes,
            'quiz-vip-3',
            90
        );
        const target = updated.find((q) => q.id === 'quiz-vip-3');
        assert.ok(target);
        assert.equal(target?.status, 'completed');
        assert.equal(target?.score, 90);
        assert.equal(target?.completedAt, 'هم‌اکنون');
    });

    test('calculates course average grade and quiz average accurately', () => {
        const avg = calculateCourseAverageGrade(
            defaultCourseAssignments,
            'designing-teen-future-vip'
        );
        assert.equal(avg, 19.5);

        const quizAvg = calculateCourseQuizAverage(
            defaultCourseQuizzes,
            'designing-teen-future-vip'
        );
        assert.equal(quizAvg, 92);
    });

    test('resolves DashboardScreen conditional view mode for single vs multiple courses', () => {
        assert.equal(resolveDashboardViewMode(0, null), 'empty');
        assert.equal(resolveDashboardViewMode(1, null), 'single_full_page');
        assert.equal(resolveDashboardViewMode(1, 'designing-teen-future-vip'), 'single_full_page');
        assert.equal(resolveDashboardViewMode(2, null), 'multi_grid');
        assert.equal(resolveDashboardViewMode(3, ''), 'multi_grid');
        assert.equal(
            resolveDashboardViewMode(2, 'clifton-strengths-career-mastery'),
            'course_detail'
        );
    });
});

