import React, { useState } from 'react';
import {
    ArrowRight,
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    Crown,
    FileText,
    Layers,
    LayoutGrid,
    Maximize2,
    MessageSquare,
    Play,
    Send,
    Sparkles,
    Star,
    Video,
    BookOpen,
} from 'lucide-react';
import {
    CourseAssignment,
    CourseQuiz,
    defaultCourseAssignments,
    defaultCourseQuizzes,
    getAssignmentsForCourse,
    getQuizzesForCourse,
    submitAssignmentResponse,
    completeQuizScore,
    calculateCourseAverageGrade,
    calculateCourseQuizAverage,
    resolveDashboardViewMode,
} from '@/lib/growthLogic';
import { toFa } from '@/lib/format';

export interface GrowthCourseItem {
    id: number;
    slug: string;
    title: string;
    instructor: string;
    category: string;
    poster: string;
    thumbnail: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    isVip?: boolean;
}

interface MyGrowthCoursesViewProps {
    enrolledCourses: GrowthCourseItem[];
    onOpenCourseLearning: (slug: string) => void;
    isDark?: boolean;
}

export const MyGrowthCoursesView: React.FC<MyGrowthCoursesViewProps> = ({
    enrolledCourses,
    onOpenCourseLearning,
    isDark = false,
}) => {
    const [forceSingleCourseDemo, setForceSingleCourseDemo] = useState<boolean>(false);

    const activeCourses =
        forceSingleCourseDemo && enrolledCourses.length > 1
            ? [enrolledCourses[0]]
            : enrolledCourses;

    const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);

    const [assignments, setAssignments] = useState<CourseAssignment[]>(defaultCourseAssignments);
    const [quizzes, setQuizzes] = useState<CourseQuiz[]>(defaultCourseQuizzes);
    const [activeTab, setActiveTab] = useState<'assignments' | 'quizzes' | 'sessions' | 'notes'>('assignments');

    const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
    const [submissionInputText, setSubmissionInputText] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const viewMode = resolveDashboardViewMode(activeCourses.length, selectedCourseSlug);

    const currentCourse =
        viewMode === 'single_full_page'
            ? activeCourses[0] || null
            : viewMode === 'course_detail'
              ? activeCourses.find((c) => c.slug === selectedCourseSlug) || null
              : null;

    const currentAssignments = currentCourse
        ? getAssignmentsForCourse(assignments, currentCourse.slug)
        : [];
    const currentQuizzes = currentCourse
        ? getQuizzesForCourse(quizzes, currentCourse.slug)
        : [];
    const avgGrade = currentCourse
        ? calculateCourseAverageGrade(assignments, currentCourse.slug)
        : 18.5;
    const avgQuizScore = currentCourse
        ? calculateCourseQuizAverage(quizzes, currentCourse.slug)
        : 90;

    const handleSendAssignment = (asgId: string) => {
        if (!submissionInputText.trim()) {
            showToast('پاسخ را وارد کنید');
            return;
        }
        setAssignments((prev) => submitAssignmentResponse(prev, asgId, submissionInputText.trim()));
        setSubmittingAssignmentId(null);
        setSubmissionInputText('');
        showToast('ثبت شد');
    };

    const handleTakeQuiz = (quizId: string) => {
        setQuizzes((prev) => completeQuizScore(prev, quizId, 95));
        showToast('۹۵٪ ثبت شد');
    };

    const handleToggleCourseCountMode = () => {
        setForceSingleCourseDemo((prev) => {
            const next = !prev;
            if (next) {
                setSelectedCourseSlug(null);
            }
            return next;
        });
    };

    // =========================================================================
    // VIEW 0: EMPTY STATE (بدون دوره فعال)
    // =========================================================================
    if (viewMode === 'empty') {
        return (
            <div
                className={`rounded-3xl border p-8 text-center space-y-3 ${
                    isDark ? 'bg-[#12231E] border-emerald-800/40 text-white' : 'bg-white border-stone-200'
                }`}
            >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                    <Layers className="w-8 h-8" />
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 1: MULTI-COURSE PURELY MINIMAL GRAPHIC ICON CARDS (ZERO TEXT / DESCRIPTIONS)
    // =========================================================================
    if (viewMode === 'multi_grid' || !currentCourse) {
        return (
            <div className="space-y-3.5" data-testid="growth-multi-course-grid">
                {/* Pure Minimal Icon Bar */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                    </div>

                    {enrolledCourses.length > 1 && (
                        <button
                            type="button"
                            data-testid="toggle-single-course-mode"
                            onClick={handleToggleCourseCountMode}
                            title="نمای تک‌دوره تمام‌صفحه"
                            className="w-10 h-10 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center transition cursor-pointer"
                        >
                            <Maximize2 className="w-4 h-4 text-amber-700" />
                        </button>
                    )}
                </div>

                {/* 2-Column Purely Graphic Icon-Driven Grid (No Text / Descriptions in Cards) */}
                <div className="grid grid-cols-2 gap-3">
                    {activeCourses.map((c) => {
                        return (
                            <div
                                key={c.id}
                                data-testid={`growth-course-card-${c.slug}`}
                                onClick={() => {
                                    setSelectedCourseSlug(c.slug);
                                    setActiveTab('assignments');
                                }}
                                className={`group rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                    isDark
                                        ? 'bg-[#12231E] border-emerald-800/40 hover:border-emerald-500'
                                        : 'bg-white border-stone-200/90 hover:border-emerald-600 shadow-sm'
                                }`}
                            >
                                {/* Cover Image with Icon Overlays */}
                                <div className="relative h-44 w-full bg-stone-900 overflow-hidden flex items-center justify-center">
                                    <img
                                        src={c.poster || c.thumbnail}
                                        alt={c.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#071A12] via-[#071A12]/35 to-black/15" />

                                    {/* Top Floating Large Graphic Icon Badges */}
                                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                                        <span
                                            className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-md ${
                                                c.isVip
                                                    ? 'bg-amber-400 text-amber-950'
                                                    : 'bg-black/50 backdrop-blur-md text-white border border-white/15'
                                            }`}
                                        >
                                            {c.isVip ? (
                                                <Crown className="w-5 h-5" />
                                            ) : (
                                                <Video className="w-5 h-5" />
                                            )}
                                        </span>

                                        <span className="w-9 h-9 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-[#D6F39A] flex items-center justify-center shadow-md">
                                            <Sparkles className="w-5 h-5" />
                                        </span>
                                    </div>

                                    {/* Center Large Graphic Play Icon */}
                                    <div className="relative w-12 h-12 rounded-full bg-[#D6F39A] text-[#0D2E22] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                        <Play className="w-6 h-6 fill-current ml-0.5" />
                                    </div>
                                </div>

                                {/* Pure Graphic Icons Footer Bar (No Text / Descriptions) */}
                                <div className="p-3 flex items-center justify-between gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                                            <Award className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shrink-0">
                                        <ArrowRight className="w-4 h-4 rotate-180" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 2: FULL-SCREEN COURSE WITH ATTRACTIVE BACKGROUND IMAGE
    // =========================================================================
    const isSingleCourseDirectMode = viewMode === 'single_full_page';
    const circleRadius = 38;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset =
        circleCircumference - (Math.min(100, Math.max(0, currentCourse.progress)) / 100) * circleCircumference;

    return (
        <div
            data-testid="growth-single-fullpage-card"
            className="relative min-h-[650px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-800/40 flex flex-col justify-between text-white"
        >
            {/* Full-Screen Attractive Course Background Image */}
            <img
                src={currentCourse.poster || currentCourse.thumbnail}
                alt={currentCourse.title}
                className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-[#071A12]/80 to-[#05120D]/95 backdrop-blur-[2px]" />

            {toastMessage && (
                <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 bg-[#123E30] text-white border border-[#D6F39A]/40 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* 1. Floating Top Glass Bar */}
            <div className="relative z-10 p-4 flex items-center justify-between gap-2">
                {!isSingleCourseDirectMode ? (
                    <button
                        type="button"
                        data-testid="back-to-courses-grid"
                        onClick={() => setSelectedCourseSlug(null)}
                        title="بازگشت به گرید دوره‌ها"
                        className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition cursor-pointer"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                ) : (
                    <span className="px-3 py-1.5 rounded-2xl bg-amber-400 text-amber-950 text-xs font-black inline-flex items-center gap-1.5 shadow-lg">
                        <Crown className="w-4 h-4" />
                        <span>VIP</span>
                    </span>
                )}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onOpenCourseLearning(currentCourse.slug)}
                        className="px-3.5 py-2 rounded-2xl bg-[#D6F39A] hover:bg-[#c8eb82] text-[#0F3528] font-black text-xs inline-flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span>اتاق یادگیری</span>
                    </button>

                    {enrolledCourses.length > 1 && (
                        <button
                            type="button"
                            data-testid="toggle-multi-course-mode"
                            onClick={handleToggleCourseCountMode}
                            title={forceSingleCourseDemo ? 'نمای چند دوره (گرید)' : 'نمای تک‌دوره'}
                            className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D6F39A] transition cursor-pointer"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Center Full-Screen Visual Showcase */}
            <div className="relative z-10 px-4 py-2 flex flex-col items-center text-center space-y-3">
                {/* Glowing Circular Progress Ring */}
                <div
                    onClick={() => onOpenCourseLearning(currentCourse.slug)}
                    className="relative w-24 h-24 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl cursor-pointer group"
                >
                    <svg className="w-22 h-22 -rotate-90" viewBox="0 0 92 92">
                        <circle
                            cx="46"
                            cy="46"
                            r={circleRadius}
                            stroke="rgba(255,255,255,0.18)"
                            strokeWidth="6.5"
                            fill="transparent"
                        />
                        <circle
                            cx="46"
                            cy="46"
                            r={circleRadius}
                            stroke="#D6F39A"
                            strokeWidth="6.5"
                            strokeDasharray={circleCircumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-black text-base text-[#D6F39A]">
                            {toFa(currentCourse.progress)}٪
                        </span>
                    </div>
                </div>

                <h2 className="font-black text-base sm:text-xl leading-snug text-white max-w-md drop-shadow-md">
                    {currentCourse.title}
                </h2>

                {/* 4 Pure Icon Glass KPI Tiles */}
                <div className="grid grid-cols-4 gap-2 w-full">
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-2.5 flex flex-col items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="font-black text-xs text-white">{toFa(avgGrade)}</span>
                    </div>

                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-2.5 flex flex-col items-center justify-center gap-1">
                        <Award className="w-5 h-5 text-[#D6F39A]" />
                        <span className="font-black text-xs text-white">{toFa(avgQuizScore)}٪</span>
                    </div>

                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-2.5 flex flex-col items-center justify-center gap-1">
                        <Video className="w-5 h-5 text-sky-300" />
                        <span className="font-black text-xs text-white">
                            {toFa(currentCourse.completedLessons)}/{toFa(currentCourse.totalLessons)}
                        </span>
                    </div>

                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-2.5 flex flex-col items-center justify-center gap-1">
                        <Calendar className="w-5 h-5 text-pink-300" />
                        <span className="font-black text-xs text-white">{toFa(95)}٪</span>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Glassmorphic Interactive Sheet for Assignments & Quizzes */}
            <div className="relative z-10 m-3 p-3.5 rounded-3xl bg-black/55 backdrop-blur-xl border border-white/15 space-y-3">
                {/* Icon-Only Segmented Navigation Bar */}
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-white/10 border border-white/10">
                    <button
                        type="button"
                        data-testid="tab-assignments"
                        onClick={() => setActiveTab('assignments')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            activeTab === 'assignments'
                                ? 'bg-[#D6F39A] text-[#0D2E22] shadow-sm'
                                : 'text-white/75 hover:text-white'
                        }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span>{toFa(currentAssignments.length)}</span>
                    </button>

                    <button
                        type="button"
                        data-testid="tab-quizzes"
                        onClick={() => setActiveTab('quizzes')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            activeTab === 'quizzes'
                                ? 'bg-[#D6F39A] text-[#0D2E22] shadow-sm'
                                : 'text-white/75 hover:text-white'
                        }`}
                    >
                        <Award className="w-4 h-4" />
                        <span>{toFa(currentQuizzes.length)}</span>
                    </button>

                    <button
                        type="button"
                        data-testid="tab-sessions"
                        onClick={() => setActiveTab('sessions')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            activeTab === 'sessions'
                                ? 'bg-[#D6F39A] text-[#0D2E22] shadow-sm'
                                : 'text-white/75 hover:text-white'
                        }`}
                    >
                        <Calendar className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        data-testid="tab-notes"
                        onClick={() => setActiveTab('notes')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            activeTab === 'notes'
                                ? 'bg-[#D6F39A] text-[#0D2E22] shadow-sm'
                                : 'text-white/75 hover:text-white'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                    </button>
                </div>

                {/* TAB 1: ASSIGNMENTS */}
                {activeTab === 'assignments' && (
                    <div className="space-y-2" data-testid="assignments-panel">
                        {currentAssignments.map((asg) => {
                            const isSubmittingThis = submittingAssignmentId === asg.id;
                            const isExpanded = expandedAssignmentId === asg.id;
                            return (
                                <div
                                    key={asg.id}
                                    className="rounded-2xl bg-white/10 border border-white/15 p-3 transition"
                                >
                                    <div className="flex items-center justify-between gap-2.5">
                                        <div
                                            onClick={() =>
                                                setExpandedAssignmentId(isExpanded ? null : asg.id)
                                            }
                                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                                        >
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                                    asg.status === 'reviewed'
                                                        ? 'bg-[#D6F39A]/20 text-[#D6F39A]'
                                                        : asg.status === 'submitted'
                                                          ? 'bg-amber-400/20 text-amber-300'
                                                          : 'bg-rose-400/20 text-rose-300'
                                                }`}
                                            >
                                                {asg.status === 'reviewed' ? (
                                                    <CheckCircle2 className="w-4 h-4" />
                                                ) : asg.status === 'submitted' ? (
                                                    <Clock className="w-4 h-4" />
                                                ) : (
                                                    <FileText className="w-4 h-4" />
                                                )}
                                            </div>

                                            <h4 className="font-bold text-xs text-white truncate flex-1">
                                                {asg.title}
                                            </h4>
                                        </div>

                                        <div className="shrink-0">
                                            {asg.status === 'reviewed' ? (
                                                <div className="px-2.5 py-1 rounded-xl bg-[#D6F39A] text-[#0D2E22] font-black text-xs inline-flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span>{toFa(asg.grade)}</span>
                                                </div>
                                            ) : asg.status === 'submitted' ? (
                                                <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 inline-flex items-center justify-center">
                                                    <Clock className="w-4 h-4" />
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSubmittingAssignmentId(
                                                            isSubmittingThis ? null : asg.id
                                                        );
                                                        setSubmissionInputText('');
                                                    }}
                                                    className="w-8 h-8 rounded-xl bg-[#D6F39A] text-[#0D2E22] inline-flex items-center justify-center transition cursor-pointer"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {(isExpanded || asg.feedback) && (
                                        <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5">
                                            {isExpanded && (
                                                <p className="text-[11px] text-white/80 leading-relaxed">
                                                    {asg.description}
                                                </p>
                                            )}
                                            {asg.feedback && (
                                                <div className="p-2 rounded-xl bg-white/10 flex items-start gap-2 text-[11px]">
                                                    <MessageSquare className="w-3.5 h-3.5 text-[#D6F39A] shrink-0 mt-0.5" />
                                                    <span className="text-white/90">{asg.feedback}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isSubmittingThis && (
                                        <div className="space-y-2 mt-2.5 pt-2.5 border-t border-white/15">
                                            <textarea
                                                rows={2}
                                                value={submissionInputText}
                                                onChange={(e) => setSubmissionInputText(e.target.value)}
                                                placeholder="پاسخ تمرین..."
                                                className="w-full p-2 rounded-xl border border-white/20 text-xs bg-black/40 text-white focus:outline-none"
                                            />
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSendAssignment(asg.id)}
                                                    className="flex-1 py-2 rounded-xl bg-[#D6F39A] text-[#0D2E22] font-black text-xs flex items-center justify-center gap-1 cursor-pointer"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>ارسال</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* TAB 2: QUIZZES */}
                {activeTab === 'quizzes' && (
                    <div className="space-y-2" data-testid="quizzes-panel">
                        {currentQuizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="rounded-2xl bg-white/10 border border-white/15 p-3 flex items-center justify-between gap-2.5"
                            >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                            quiz.status === 'completed'
                                                ? 'bg-[#D6F39A]/20 text-[#D6F39A]'
                                                : 'bg-amber-400/20 text-amber-300'
                                        }`}
                                    >
                                        <Award className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-bold text-xs text-white truncate flex-1">
                                        {quiz.title}
                                    </h4>
                                </div>

                                <div className="shrink-0">
                                    {quiz.status === 'completed' ? (
                                        <span className="px-2.5 py-1 rounded-xl bg-[#D6F39A] text-[#0D2E22] font-black text-xs inline-flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>{toFa(quiz.score)}٪</span>
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleTakeQuiz(quiz.id)}
                                            className="w-8 h-8 rounded-xl bg-[#D6F39A] text-[#0D2E22] inline-flex items-center justify-center transition cursor-pointer"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB 3: SESSIONS */}
                {activeTab === 'sessions' && (
                    <div className="grid grid-cols-2 gap-2" data-testid="sessions-panel">
                        {[
                            { id: 1, title: 'کارگاه ۱', date: '۱۸ اردیبهشت', attended: true },
                            { id: 2, title: 'کارگاه ۲', date: '۲۵ اردیبهشت', attended: true },
                            { id: 3, title: 'کارگاه ۳', date: '۱ خرداد', attended: false },
                            { id: 4, title: 'دمودی VIP', date: '۸ خرداد', attended: false },
                        ].map((s) => (
                            <div
                                key={s.id}
                                className="rounded-2xl bg-white/10 border border-white/15 p-2.5 flex items-center gap-2"
                            >
                                <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                        s.attended
                                            ? 'bg-[#D6F39A]/20 text-[#D6F39A]'
                                            : 'bg-amber-400/20 text-amber-300'
                                    }`}
                                >
                                    {s.attended ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                        <Calendar className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-white truncate">{s.title}</div>
                                    <div className="text-[10px] text-white/60">{s.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB 4: NOTES */}
                {activeTab === 'notes' && (
                    <div className="space-y-2" data-testid="notes-panel">
                        <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <BookOpen className="w-4 h-4 text-[#D6F39A] shrink-0" />
                                <span className="text-xs font-bold text-white truncate">
                                    استعدادهای برتر: استراتژیست و ایده‌پرداز
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onOpenCourseLearning(currentCourse.slug)}
                                className="w-8 h-8 rounded-xl bg-[#D6F39A] text-[#0D2E22] flex items-center justify-center shrink-0 cursor-pointer"
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
