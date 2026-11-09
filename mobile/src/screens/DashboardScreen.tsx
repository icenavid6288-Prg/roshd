import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    ImageBackground,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/client';
import type { DashboardData, EnrollmentPayload } from '../api/types';
import type { TabStackNavigation } from '../navigation/types';
import { Chip, EmptyState, Loading, PrimaryButton, ProgressBar, Screen } from '../components';
import { useTheme } from '../context/ThemeContext';
import { faNum, radius, spacing } from '../theme';

interface MobileAssignmentItem {
    id: string;
    courseSlug: string;
    sessionNumber: number;
    title: string;
    description: string;
    dueDate: string;
    status: 'reviewed' | 'submitted' | 'pending';
    grade?: number;
    feedback?: string;
    submissionText?: string;
}

interface MobileQuizItem {
    id: string;
    courseSlug: string;
    title: string;
    questionsCount: number;
    durationMinutes: number;
    minPassScore: number;
    status: 'completed' | 'available';
    score?: number;
    completedAt?: string;
}

const DEFAULT_FALLBACK_ENROLLMENTS: EnrollmentPayload[] = [
    {
        id: 101,
        progress: 68,
        enrolled_at: '۱۴۰۴/۰۱/۱۵',
        course: {
            id: 1,
            slug: 'designing-teen-future-vip',
            title: 'طراحی آینده نوجوان (VIP)',
            subtitle: 'استعدادیابی و نقشه راه آینده',
            category: 'VIP',
            level: 'جامع',
            duration: '۴۰ ساعت',
            lessons_count: 20,
            price: 5400000,
            is_featured: true,
            thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
            instructor: {
                id: 1,
                name: 'دکتر محمد بیدی',
                title: 'سرپرست علمی دوره',
            },
        },
    },
    {
        id: 102,
        progress: 45,
        enrolled_at: '۱۴۰۴/۰۲/۰۲',
        course: {
            id: 2,
            slug: 'clifton-strengths-career-mastery',
            title: 'استعدادیابی کلیفتون',
            subtitle: 'کشف ۵ استعداد غالب',
            category: 'تخصصی',
            level: 'کاربردی',
            duration: '۱۸ ساعت',
            lessons_count: 24,
            price: 1890000,
            is_featured: false,
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
            instructor: {
                id: 2,
                name: 'دکتر محمد بیدی',
                title: 'کوچ شغلی',
            },
        },
    },
];

const INITIAL_ASSIGNMENTS: MobileAssignmentItem[] = [
    {
        id: 'm-asg-1',
        courseSlug: 'designing-teen-future-vip',
        sessionNumber: 1,
        title: 'مستندسازی ۵ استعداد برتر کلیفتون',
        description: 'سه موقعیت واقعی از عملکرد برتر خود را بنویسید.',
        dueDate: 'تحویل شده',
        status: 'reviewed',
        grade: 19.5,
        feedback: 'تحلیل بسیار دقیق و عالی.',
    },
    {
        id: 'm-asg-2',
        courseSlug: 'designing-teen-future-vip',
        sessionNumber: 2,
        title: 'بوم چشم‌انداز ۹۰ روزه',
        description: 'تعیین ۱ هدف تحصیلی و ۱ هدف مهارتی.',
        dueDate: 'در بررسی',
        status: 'submitted',
    },
    {
        id: 'm-asg-3',
        courseSlug: 'designing-teen-future-vip',
        sessionNumber: 3,
        title: 'ارائه و دفاع از ایده شخصی',
        description: 'خلاصه دفاع از مسیر آینده خود را ثبت کنید.',
        dueDate: 'پنج‌شنبه',
        status: 'pending',
    },
    {
        id: 'm-asg-4',
        courseSlug: 'clifton-strengths-career-mastery',
        sessionNumber: 1,
        title: 'تحلیل ۳ تیپ غالب هالند',
        description: 'کدهای تیپ شخصیتی خود را ثبت کنید.',
        dueDate: 'تحویل شده',
        status: 'reviewed',
        grade: 18.5,
    },
    {
        id: 'm-asg-5',
        courseSlug: 'clifton-strengths-career-mastery',
        sessionNumber: 2,
        title: 'ماتریس تم‌های استعدادی کلیفتون',
        description: '۵ تم برتر و کاربرد هرکدام را بنویسید.',
        dueDate: 'فردا',
        status: 'pending',
    },
];

const INITIAL_QUIZZES: MobileQuizItem[] = [
    {
        id: 'm-quiz-1',
        courseSlug: 'designing-teen-future-vip',
        title: 'کوییز ۱: خودشناسی و استعداد',
        questionsCount: 10,
        durationMinutes: 15,
        minPassScore: 70,
        status: 'completed',
        score: 88,
        completedAt: '۱۰ اردیبهشت',
    },
    {
        id: 'm-quiz-2',
        courseSlug: 'designing-teen-future-vip',
        title: 'کوییز ۲: مدیریت زمان',
        questionsCount: 12,
        durationMinutes: 20,
        minPassScore: 75,
        status: 'completed',
        score: 95,
        completedAt: '۱۶ اردیبهشت',
    },
    {
        id: 'm-quiz-3',
        courseSlug: 'designing-teen-future-vip',
        title: 'آزمون ۳: تصمیم‌گیری',
        questionsCount: 10,
        durationMinutes: 15,
        minPassScore: 70,
        status: 'available',
    },
    {
        id: 'm-quiz-4',
        courseSlug: 'clifton-strengths-career-mastery',
        title: 'سنجش الگوهای ذهنی کلیفتون',
        questionsCount: 10,
        durationMinutes: 15,
        minPassScore: 70,
        status: 'completed',
        score: 85,
        completedAt: '۵ اردیبهشت',
    },
    {
        id: 'm-quiz-5',
        courseSlug: 'clifton-strengths-career-mastery',
        title: 'ارزیابی مسیر شغلی',
        questionsCount: 10,
        durationMinutes: 15,
        minPassScore: 70,
        status: 'available',
    },
];

export function DashboardScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<TabStackNavigation>();

    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    // Conditional state for 1 course vs multiple courses
    const [singleCourseDemoMode, setSingleCourseDemoMode] = useState<boolean>(false);
    const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
    const [activeSectionTab, setActiveSectionTab] = useState<'assignments' | 'quizzes'>('assignments');
    const [assignments, setAssignments] = useState<MobileAssignmentItem[]>(INITIAL_ASSIGNMENTS);
    const [quizzes, setQuizzes] = useState<MobileQuizItem[]>(INITIAL_QUIZZES);
    const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
    const [submissionText, setSubmissionText] = useState('');
    const [bannerNotice, setBannerNotice] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api<DashboardData>('/api/v1/dashboard');
            setData(res);
        } catch {
            // fallback enrollments used
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const showNotice = (msg: string) => {
        setBannerNotice(msg);
        setTimeout(() => setBannerNotice(null), 3000);
    };

    const allEnrolledCourses = useMemo(() => {
        const apiCourses = (data?.enrollments ?? []).filter((item) => item.course);
        return apiCourses.length > 0 ? apiCourses : DEFAULT_FALLBACK_ENROLLMENTS;
    }, [data]);

    const enrolledCourses = useMemo(() => {
        if (singleCourseDemoMode) {
            return allEnrolledCourses.slice(0, 1);
        }
        return allEnrolledCourses;
    }, [allEnrolledCourses, singleCourseDemoMode]);

    // Conditional logic:
    // - Single active course -> Full-screen view with background image of that course
    // - Multiple active courses -> Purely graphic icon-driven 2-column Grid (Zero text / descriptions inside cards)
    const isSingleCourseMember = enrolledCourses.length === 1;
    const activeEnrollment = useMemo(() => {
        if (isSingleCourseMember) {
            return enrolledCourses[0];
        }
        if (selectedCourseSlug) {
            return enrolledCourses.find((item) => item.course?.slug === selectedCourseSlug) || null;
        }
        return null;
    }, [enrolledCourses, isSingleCourseMember, selectedCourseSlug]);

    if (loading && !data && allEnrolledCourses.length === 0) {
        return <Loading />;
    }

    const handleSubmitAssignment = (assignmentId: string) => {
        if (!submissionText.trim()) return;
        setAssignments((prev) =>
            prev.map((a) =>
                a.id === assignmentId
                    ? { ...a, status: 'submitted', submissionText: submissionText.trim(), dueDate: 'هم‌اکنون' }
                    : a
            )
        );
        setSubmittingAssignmentId(null);
        setSubmissionText('');
        showNotice('ثبت شد');
    };

    const handleStartQuiz = (quizId: string) => {
        setQuizzes((prev) =>
            prev.map((q) =>
                q.id === quizId
                    ? { ...q, status: 'completed', score: 94, completedAt: 'هم‌اکنون' }
                    : q
            )
        );
        showNotice('۹۴٪ ثبت شد');
    };

    // =========================================================================
    // CASE 0: EMPTY STATE
    // =========================================================================
    if (enrolledCourses.length === 0) {
        return (
            <Screen>
                <View style={s.emptyWrap}>
                    <EmptyState icon="school-outline" title="دوره فعالی ندارید" />
                    <PrimaryButton
                        title="مشاهده دوره‌ها"
                        icon="grid-outline"
                        onPress={() => navigation.navigate('Courses')}
                    />
                </View>
            </Screen>
        );
    }

    // =========================================================================
    // CASE 1: MULTIPLE COURSES -> PURELY MINIMAL GRAPHIC ICON CARDS (ZERO TEXT / DESCRIPTIONS)
    // =========================================================================
    if (!isSingleCourseMember && !activeEnrollment) {
        return (
            <Screen>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={s.gridPage}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
                >
                    {/* Minimal Top Icon Navigation */}
                    <View style={s.topIconHeader}>
                        <View style={s.headerBadgeWrap}>
                            <View style={[s.headerIconBox, { backgroundColor: colors.primarySoft }]}>
                                <Ionicons name="grid" size={20} color={colors.primary} />
                            </View>
                        </View>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="نمای تک‌دوره تمام‌صفحه"
                            onPress={() => {
                                setSingleCourseDemoMode(true);
                                setSelectedCourseSlug(null);
                            }}
                            style={[s.iconModeSwitch, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <Ionicons name="expand-outline" size={18} color={colors.primary} />
                        </Pressable>
                    </View>

                    {/* 2-Column Purely Graphic Icon-Driven Grid (No Text / Descriptions in Cards) */}
                    <View style={s.iconGrid}>
                        {enrolledCourses.map((enrollment) => {
                            const course = enrollment.course!;
                            const isVip = course.slug === 'designing-teen-future-vip' || course.is_featured;

                            return (
                                <Pressable
                                    key={enrollment.id}
                                    accessibilityRole="button"
                                    accessibilityLabel={course.title}
                                    onPress={() => {
                                        setSelectedCourseSlug(course.slug);
                                        setActiveSectionTab('assignments');
                                    }}
                                    style={({ pressed }) => [
                                        s.gridTile,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: isVip ? '#F59E0B' : colors.border,
                                        },
                                        pressed && s.pressed,
                                    ]}
                                >
                                    {/* Cover Image with Large Minimal Graphic Icons Overlay */}
                                    <View style={s.tileCoverWrap}>
                                        {course.thumbnail ? (
                                            <Image
                                                source={{ uri: course.thumbnail }}
                                                style={s.tileCover}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={[s.tileCover, { backgroundColor: '#123E30' }]} />
                                        )}
                                        <View style={s.tileShade} />

                                        <View style={s.tileTopIcons}>
                                            <View
                                                style={[
                                                    s.tileVipCircle,
                                                    { backgroundColor: isVip ? '#FBBF24' : 'rgba(0,0,0,0.55)' },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={isVip ? 'ribbon' : 'school-outline'}
                                                    size={18}
                                                    color={isVip ? '#0D2E22' : '#FFFFFF'}
                                                />
                                            </View>

                                            <View style={s.tileProgressIconCircle}>
                                                <Ionicons name="pie-chart" size={16} color="#D6F39A" />
                                            </View>
                                        </View>

                                        <View style={s.tileCenterIconWrap}>
                                            <View style={s.tileCenterPlayBtn}>
                                                <Ionicons name="play" size={24} color="#0D2E22" />
                                            </View>
                                        </View>
                                    </View>

                                    {/* Pure Graphic Icons Footer Bar (Zero Text / Descriptions) */}
                                    <View style={s.tileIconBar}>
                                        <View style={s.tileMiniStats}>
                                            <View style={[s.miniIconBox, { backgroundColor: colors.surfaceAlt }]}>
                                                <Ionicons name="videocam-outline" size={16} color={colors.primary} />
                                            </View>
                                            <View style={[s.miniIconBox, { backgroundColor: colors.primarySoft }]}>
                                                <Ionicons name="document-text-outline" size={16} color={colors.primary} />
                                            </View>
                                            <View style={[s.miniIconBox, { backgroundColor: colors.goldSoft }]}>
                                                <Ionicons name="ribbon-outline" size={16} color="#92400E" />
                                            </View>
                                        </View>

                                        <View style={[s.tileEnterBtn, { backgroundColor: colors.primary }]}>
                                            <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>
            </Screen>
        );
    }

    // =========================================================================
    // CASE 2: SINGLE ACTIVE COURSE -> FULL-SCREEN BACKGROUND IMAGE EXPERIENCE
    // =========================================================================
    const currentEnrollment = activeEnrollment || enrolledCourses[0];
    const currentCourse = currentEnrollment.course!;
    const currentAssignments = assignments.filter((a) => a.courseSlug === currentCourse.slug);
    const currentQuizzes = quizzes.filter((q) => q.courseSlug === currentCourse.slug);
    const completedQuizzesCount = currentQuizzes.filter((q) => q.status === 'completed').length;
    const totalLessonsCount = currentCourse.lessons_count || 20;
    const completedLessonsCount = Math.round((currentEnrollment.progress / 100) * totalLessonsCount);

    const gradedAssignments = currentAssignments.filter((a) => typeof a.grade === 'number');
    const averageGrade =
        gradedAssignments.length > 0
            ? Math.round(
                  (gradedAssignments.reduce((acc, c) => acc + (c.grade || 0), 0) / gradedAssignments.length) * 10
              ) / 10
            : 19.0;

    return (
        <Screen style={s.fullScreenRoot}>
            <ImageBackground
                source={{
                    uri:
                        currentCourse.thumbnail ||
                        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
                }}
                style={s.fullScreenBg}
                resizeMode="cover"
            >
                <View style={s.fullScreenBackdrop}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={s.fullScreenScroll}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#D6F39A" />}
                    >
                        {/* Floating Top Icon Controls */}
                        <View style={s.floatingTopBar}>
                            {!isSingleCourseMember ? (
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => setSelectedCourseSlug(null)}
                                    style={s.glassCircleBtn}
                                >
                                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                                </Pressable>
                            ) : (
                                <View style={s.glassVipPill}>
                                    <Ionicons name="ribbon" size={15} color="#D6F39A" />
                                    <Text style={s.glassVipText}>VIP</Text>
                                </View>
                            )}

                            <View style={s.floatingActionsRight}>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => navigation.navigate('CourseDetail', { slug: currentCourse.slug })}
                                    style={s.glassCircleBtn}
                                >
                                    <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" />
                                </Pressable>

                                {allEnrolledCourses.length > 1 && (
                                    <Pressable
                                        accessibilityRole="button"
                                        onPress={() => {
                                            setSingleCourseDemoMode((prev) => !prev);
                                            setSelectedCourseSlug(null);
                                        }}
                                        style={s.glassCircleBtn}
                                    >
                                        <Ionicons
                                            name={isSingleCourseMember ? 'grid-outline' : 'expand-outline'}
                                            size={18}
                                            color="#D6F39A"
                                        />
                                    </Pressable>
                                )}
                            </View>
                        </View>

                        {bannerNotice ? (
                            <View style={s.noticeBanner}>
                                <Ionicons name="checkmark-circle" size={18} color="#D4F095" />
                                <Text style={s.noticeBannerText}>{bannerNotice}</Text>
                            </View>
                        ) : null}

                        {/* Full-Screen Hero Centerpiece over Course Background Image */}
                        <View style={s.fullScreenHeroCenter}>
                            <Pressable
                                accessibilityRole="button"
                                onPress={() => navigation.navigate('Learning', { slug: currentCourse.slug })}
                                style={({ pressed }) => [s.heroPlayRing, pressed && s.pressed]}
                            >
                                <View style={s.heroPlayInner}>
                                    <Ionicons name="play" size={30} color="#0D2E22" />
                                </View>
                                <View style={s.heroProgressBadge}>
                                    <Text style={s.heroProgressBadgeText}>
                                        {faNum(Math.round(currentEnrollment.progress))}٪
                                    </Text>
                                </View>
                            </Pressable>

                            <Text style={s.fullScreenCourseTitle} numberOfLines={2}>
                                {currentCourse.title}
                            </Text>

                            <View style={s.fullScreenProgressWrap}>
                                <ProgressBar value={currentEnrollment.progress} />
                            </View>

                            {/* 4 Pure Icon Glass KPI Tiles */}
                            <View style={s.glassKpiDock}>
                                <View style={s.glassKpiTile}>
                                    <Ionicons name="star" size={20} color="#FBBF24" />
                                    <Text style={s.glassKpiVal}>{faNum(averageGrade)}</Text>
                                </View>
                                <View style={s.glassKpiTile}>
                                    <Ionicons name="videocam" size={20} color="#D6F39A" />
                                    <Text style={s.glassKpiVal}>
                                        {faNum(completedLessonsCount)}/{faNum(totalLessonsCount)}
                                    </Text>
                                </View>
                                <View style={s.glassKpiTile}>
                                    <Ionicons name="document-text" size={20} color="#38BDF8" />
                                    <Text style={s.glassKpiVal}>{faNum(currentAssignments.length)}</Text>
                                </View>
                                <View style={s.glassKpiTile}>
                                    <Ionicons name="ribbon" size={20} color="#F472B6" />
                                    <Text style={s.glassKpiVal}>
                                        {faNum(completedQuizzesCount)}/{faNum(currentQuizzes.length)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Glassmorphic Interactive Sheet for Assignments & Quizzes */}
                        <View style={s.glassSheet}>
                            <View style={s.sheetTabs}>
                                {[
                                    {
                                        id: 'assignments' as const,
                                        count: currentAssignments.length,
                                        icon: 'document-text-outline' as const,
                                    },
                                    {
                                        id: 'quizzes' as const,
                                        count: currentQuizzes.length,
                                        icon: 'ribbon-outline' as const,
                                    },
                                ].map((tab) => {
                                    const active = activeSectionTab === tab.id;
                                    return (
                                        <Pressable
                                            key={tab.id}
                                            accessibilityRole="button"
                                            onPress={() => setActiveSectionTab(tab.id)}
                                            style={[s.sheetTabBtn, active && s.sheetTabBtnActive]}
                                        >
                                            <Ionicons
                                                name={tab.icon}
                                                size={18}
                                                color={active ? '#0D2E22' : '#FFFFFF'}
                                            />
                                            <Text
                                                style={[
                                                    s.sheetTabCount,
                                                    { color: active ? '#0D2E22' : '#D6F39A' },
                                                ]}
                                            >
                                                {faNum(tab.count)}
                                            </Text>
                                        </Pressable>
                                    );
                                })}

                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => navigation.navigate('Learning', { slug: currentCourse.slug })}
                                    style={s.sheetPlayBtn}
                                >
                                    <Ionicons name="play-circle" size={20} color="#D6F39A" />
                                </Pressable>
                            </View>

                            {activeSectionTab === 'assignments' && (
                                <View style={s.tabSectionList}>
                                    {currentAssignments.map((asg) => {
                                        const isEditing = submittingAssignmentId === asg.id;
                                        return (
                                            <View key={asg.id} style={s.glassItemCard}>
                                                <View style={s.itemCardHeader}>
                                                    <View style={s.itemHeaderRight}>
                                                        <View style={s.glassIconCircle}>
                                                            <Ionicons
                                                                name={
                                                                    asg.status === 'reviewed'
                                                                        ? 'checkmark-circle'
                                                                        : asg.status === 'submitted'
                                                                          ? 'time'
                                                                          : 'document-text-outline'
                                                                }
                                                                size={20}
                                                                color={
                                                                    asg.status === 'reviewed'
                                                                        ? '#D6F39A'
                                                                        : asg.status === 'submitted'
                                                                          ? '#FBBF24'
                                                                          : '#F87171'
                                                                }
                                                            />
                                                        </View>
                                                        <Text style={s.glassItemTitle} numberOfLines={1}>
                                                            {asg.title}
                                                        </Text>
                                                    </View>

                                                    {asg.status === 'reviewed' ? (
                                                        <View style={s.scorePill}>
                                                            <Ionicons name="star" size={12} color="#0D2E22" />
                                                            <Text style={s.scorePillText}>
                                                                {faNum(asg.grade || 19)}
                                                            </Text>
                                                        </View>
                                                    ) : asg.status === 'submitted' ? (
                                                        <Ionicons name="hourglass-outline" size={18} color="#FBBF24" />
                                                    ) : (
                                                        <Pressable
                                                            onPress={() => {
                                                                setSubmittingAssignmentId(
                                                                    isEditing ? null : asg.id
                                                                );
                                                                setSubmissionText('');
                                                            }}
                                                            style={s.sendIconBtn}
                                                        >
                                                            <Ionicons name="send" size={14} color="#0D2E22" />
                                                        </Pressable>
                                                    )}
                                                </View>

                                                {isEditing ? (
                                                    <View style={s.submitFormWrap}>
                                                        <TextInput
                                                            value={submissionText}
                                                            onChangeText={setSubmissionText}
                                                            placeholder="پاسخ تمرین…"
                                                            placeholderTextColor="rgba(255,255,255,0.5)"
                                                            multiline
                                                            style={s.glassInput}
                                                        />
                                                        <View style={s.submitActionsRow}>
                                                            <View style={s.flex}>
                                                                <PrimaryButton
                                                                    title="ارسال"
                                                                    icon="checkmark-circle-outline"
                                                                    variant="gold"
                                                                    onPress={() => handleSubmitAssignment(asg.id)}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                ) : null}
                                            </View>
                                        );
                                    })}
                                </View>
                            )}

                            {activeSectionTab === 'quizzes' && (
                                <View style={s.tabSectionList}>
                                    {currentQuizzes.map((quiz) => (
                                        <View key={quiz.id} style={s.glassItemCard}>
                                            <View style={s.itemCardHeader}>
                                                <View style={s.itemHeaderRight}>
                                                    <View style={s.glassIconCircle}>
                                                        <Ionicons
                                                            name="ribbon"
                                                            size={20}
                                                            color={
                                                                quiz.status === 'completed'
                                                                    ? '#D6F39A'
                                                                    : '#FBBF24'
                                                            }
                                                        />
                                                    </View>
                                                    <Text style={s.glassItemTitle} numberOfLines={1}>
                                                        {quiz.title}
                                                    </Text>
                                                </View>

                                                {quiz.status === 'completed' ? (
                                                    <View style={s.scorePill}>
                                                        <Ionicons name="checkmark-circle" size={13} color="#0D2E22" />
                                                        <Text style={s.scorePillText}>
                                                            {faNum(quiz.score || 90)}٪
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <Pressable
                                                        onPress={() => handleStartQuiz(quiz.id)}
                                                        style={s.sendIconBtn}
                                                    >
                                                        <Ionicons name="play" size={14} color="#0D2E22" />
                                                    </Pressable>
                                                )}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        </Screen>
    );
}

const s = StyleSheet.create({
    emptyWrap: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.md,
    },
    gridPage: {
        padding: 16,
        paddingBottom: 36,
        gap: 14,
        maxWidth: 920,
        width: '100%',
        alignSelf: 'center',
    },
    topIconHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerBadgeWrap: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
    },
    headerIconBox: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconModeSwitch: {
        width: 42,
        height: 42,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconGrid: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    gridTile: {
        width: '48%',
        borderRadius: 22,
        borderWidth: 1.5,
        overflow: 'hidden',
    },
    tileCoverWrap: {
        position: 'relative',
        height: 140,
        width: '100%',
        backgroundColor: '#0D2E22',
    },
    tileCover: {
        width: '100%',
        height: '100%',
    },
    tileShade: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(8, 28, 20, 0.45)',
    },
    tileTopIcons: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tileVipCircle: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileProgressIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: 'rgba(12, 40, 30, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileCenterIconWrap: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileCenterPlayBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#D6F39A',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    tileIconBar: {
        padding: 10,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
    },
    tileMiniStats: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    miniIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileEnterBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreenRoot: {
        flex: 1,
        backgroundColor: '#071B14',
    },
    fullScreenBg: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fullScreenBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(7, 25, 18, 0.78)',
    },
    fullScreenScroll: {
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: 18,
        paddingBottom: 32,
        gap: 18,
        maxWidth: 820,
        width: '100%',
        alignSelf: 'center',
    },
    floatingTopBar: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    floatingActionsRight: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
    },
    glassCircleBtn: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glassVipPill: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(214, 243, 154, 0.18)',
        borderWidth: 1,
        borderColor: 'rgba(214, 243, 154, 0.4)',
    },
    glassVipText: {
        fontFamily: 'VazirmatnBlack',
        fontSize: 12,
        color: '#D6F39A',
    },
    noticeBanner: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#123E30',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#D4F095',
    },
    noticeBannerText: {
        fontFamily: 'VazirmatnBold',
        fontSize: 12,
        color: '#FFFFFF',
    },
    fullScreenHeroCenter: {
        alignItems: 'center',
        gap: 14,
        paddingVertical: 10,
    },
    heroPlayRing: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(214, 243, 154, 0.22)',
        borderWidth: 2,
        borderColor: '#D6F39A',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    heroPlayInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#D6F39A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroProgressBadge: {
        position: 'absolute',
        bottom: -8,
        backgroundColor: '#0D2E22',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D6F39A',
    },
    heroProgressBadgeText: {
        fontFamily: 'VazirmatnBlack',
        fontSize: 11,
        color: '#D6F39A',
    },
    fullScreenCourseTitle: {
        fontFamily: 'VazirmatnBlack',
        fontSize: 20,
        lineHeight: 32,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    fullScreenProgressWrap: {
        width: '100%',
        maxWidth: 320,
    },
    glassKpiDock: {
        flexDirection: 'row-reverse',
        gap: 10,
        width: '100%',
    },
    glassKpiTile: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        borderRadius: 18,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    glassKpiVal: {
        fontFamily: 'VazirmatnBlack',
        fontSize: 13,
        color: '#FFFFFF',
    },
    glassSheet: {
        backgroundColor: 'rgba(10, 34, 25, 0.88)',
        borderRadius: 26,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(214, 243, 154, 0.25)',
        gap: 12,
    },
    sheetTabs: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
    },
    sheetTabBtn: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    sheetTabBtnActive: {
        backgroundColor: '#D6F39A',
    },
    sheetTabCount: {
        fontFamily: 'VazirmatnBlack',
        fontSize: 13,
    },
    sheetPlayBtn: {
        width: 44,
        height: 42,
        borderRadius: 14,
        backgroundColor: 'rgba(214, 243, 154, 0.16)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabSectionList: {
        gap: 8,
    },
    glassItemCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        gap: 8,
    },
    itemCardHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    itemHeaderRight: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
    },
    glassIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glassItemTitle: {
        flex: 1,
        fontFamily: 'VazirmatnBold',
        fontSize: 13,
        color: '#FFFFFF',
        textAlign: 'right',
    },
    scorePill: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#D6F39A',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    scorePillText: {
        fontFamily: 'VazirmatnBlack',
        fontSize: 12,
        color: '#0D2E22',
    },
    sendIconBtn: {
        width: 34,
        height: 34,
        borderRadius: 11,
        backgroundColor: '#D6F39A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitFormWrap: {
        gap: 8,
        paddingTop: 6,
    },
    glassInput: {
        minHeight: 68,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(0,0,0,0.25)',
        padding: 10,
        color: '#FFFFFF',
        textAlign: 'right',
        fontFamily: 'Vazirmatn',
        fontSize: 12,
    },
    submitActionsRow: {
        flexDirection: 'row-reverse',
        gap: 8,
    },
    flex: {
        flex: 1,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
});
