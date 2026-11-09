export interface CourseAssignment {
    id: string;
    courseSlug: string;
    sessionNumber: number;
    title: string;
    description: string;
    dueDate: string;
    status: 'submitted' | 'pending' | 'reviewed';
    grade?: number; // e.g. 19.5
    feedback?: string;
    submissionText?: string;
    submittedAt?: string;
}

export interface CourseQuiz {
    id: string;
    courseSlug: string;
    title: string;
    questionsCount: number;
    durationMinutes: number;
    score?: number; // e.g. 88
    status: 'completed' | 'available' | 'locked';
    minPassScore: number;
    completedAt?: string;
}

export interface CourseGrowthReport {
    courseSlug: string;
    courseTitle: string;
    instructorName: string;
    posterUrl: string;
    isVip: boolean;
    overallProgress: number; // 0 - 100
    totalLessons: number;
    completedLessons: number;
    attendanceRate: number; // e.g. 95
    overallGrade: number; // e.g. 19
    assignments: CourseAssignment[];
    quizzes: CourseQuiz[];
}

export const defaultCourseAssignments: CourseAssignment[] = [
    {
        id: 'asg-vip-1',
        courseSlug: 'designing-teen-future-vip',
        sessionNumber: 1,
        title: 'شناسایی و مستندسازی ۵ استعداد برتر کلیفتون در زندگی روزمره',
        description:
            'سه موقعیت واقعی در مدرسه یا خانواده را که در آن‌ها بدون خستگی بهترین عملکرد را داشتید یادداشت کنید و استعداد غالب مربوط به آن را مشخص نمایید.',
        dueDate: 'گذشته (تحویل به موقع)',
        status: 'reviewed',
        grade: 19.5,
        feedback:
            'تحلیل فوق‌العاده دقیق و کاربردی از نقاط قوت تحلیلی و ایده‌پردازی داشتی نوید جان. نحوه استفاده از استعداد ارتباطی در پروژه تیمی مدرسه عالی بود.',
        submissionText:
            'در جلسه شورای دانش‌آموزی موقع تقسیم وظایف، استعداد تفکر استراتژیک به کارم آمد و سه مسیر کم‌هزینه را پیشنهاد دادم.',
        submittedAt: '۱۴ اردیبهشت',
    },
    {
        id: 'asg-vip-2',
        courseSlug: 'designing-teen-future-vip',
        sessionNumber: 2,
        title: 'طراحی بوم چشم‌انداز ۹۰ روزه و نقشه راه فصلی',
        description:
            'فرم بوم ۹۰ روزه را با تعیین ۱ هدف اصلی تحصیلی و ۱ هدف مهارتی تکمیل کرده و فایل یا خلاصه آن را بارگذاری کنید.',
        dueDate: 'هم‌اکنون در انتظار بررسی استاد',
        status: 'submitted',
        grade: undefined,
        feedback: 'تکلیف توسط مهندس رحیمی دریافت شد و در جلسه سه‌شنبه بازخورد داده می‌شود.',
        submissionText:
            'هدف اصلی: تسلط بر طراحی پروتوتایپ فیگما تا تابستان و مطالعه روزانه ۳۰ دقیقه کتاب قطب‌نمای رشد.',
        submittedAt: 'دیروز ۱۸:۳۰',
    },
    {
        id: 'asg-vip-3',
        courseSlug: 'designing-teen-future-vip',
        sessionNumber: 3,
        title: 'ضبط صوت ۳ دقیقه‌ای شبیه‌سازی سخنرانی و دفاع از ایده',
        description:
            'با استفاده از تکنیک‌های فن بیان و قاطعیت محترمانه، در یک پیام صوتی کوتاه از انتخاب رشته و مسیر آینده خود دفاع کنید.',
        dueDate: 'پنج‌شنبه ساعت ۲۳:۵۹',
        status: 'pending',
    },
    {
        id: 'asg-vip-4',
        courseSlug: 'designing-teen-future-vip',
        sessionNumber: 4,
        title: 'جدول بودجه‌بندی ماهانه و مدیریت سرمایه‌گذاری شخصی',
        description:
            'مدل دخل و خرج یک ماهه فرضی را با قانون ۵۰-۳۰-۲۰ پیاده‌سازی و در قالب یادداشت ثبت کنید.',
        dueDate: 'هفته آینده',
        status: 'pending',
    },
    // Assignments for other courses
    {
        id: 'asg-talent-1',
        courseSlug: 'clifton-strengths-career-mastery',
        sessionNumber: 1,
        title: 'ثبت نتیجه آزمون رغبت‌سنجی هالند و تحلیل ۳ تیپ غالب',
        description:
            'کدهای تیپ شخصیتی خود را در آزمون هالند وارد کنید و علایق شغلی متناظر با آن را بررسی نمایید.',
        dueDate: 'تحویل داده شده',
        status: 'reviewed',
        grade: 18,
        feedback: 'تیپ جستجوگر و سازنده در نمایه شما بسیار برجسته است.',
        submittedAt: 'هفته گذشته',
    },
    {
        id: 'asg-talent-2',
        courseSlug: 'clifton-strengths-career-mastery',
        sessionNumber: 2,
        title: 'طراحی ماتریس ۳۴ تم استعدادی کلیفتون در شغل آینده',
        description:
            '۵ تم برتر را انتخاب کرده و برای هرکدام یک مثال ملموس از کاربرد در محیط کار بنویسید.',
        dueDate: 'فردا ساعت ۲۰:۰۰',
        status: 'pending',
    },
];

export const defaultCourseQuizzes: CourseQuiz[] = [
    {
        id: 'quiz-vip-1',
        courseSlug: 'designing-teen-future-vip',
        title: 'کوییز ۱: مفاهیم پایه خودشناسی و تمایز استعداد از مهارت',
        questionsCount: 10,
        durationMinutes: 15,
        score: 88,
        status: 'completed',
        minPassScore: 70,
        completedAt: '۱۰ اردیبهشت',
    },
    {
        id: 'quiz-vip-2',
        courseSlug: 'designing-teen-future-vip',
        title: 'کوییز ۲: آزمون تستی تکنیک‌های مدیریت زمان و ماتریس آیزنهاور',
        questionsCount: 12,
        durationMinutes: 20,
        score: 95,
        status: 'completed',
        minPassScore: 75,
        completedAt: '۱۶ اردیبهشت',
    },
    {
        id: 'quiz-vip-3',
        courseSlug: 'designing-teen-future-vip',
        title: 'آزمون ۳: شبیه‌سازی تصمیم‌گیری در شرایط تعارض و فشار همسالان',
        questionsCount: 10,
        durationMinutes: 15,
        status: 'available',
        minPassScore: 70,
    },
    {
        id: 'quiz-vip-4',
        courseSlug: 'designing-teen-future-vip',
        title: 'آزمون جامع فاز اول: سنجش سواد مالی، کارآفرینی و هویت مستقل',
        questionsCount: 15,
        durationMinutes: 25,
        status: 'available',
        minPassScore: 75,
    },
    {
        id: 'quiz-talent-1',
        courseSlug: 'clifton-strengths-career-mastery',
        title: 'سنجش شناختی الگوهای ذهنی و خودآگاهی کلیفتون',
        questionsCount: 10,
        durationMinutes: 15,
        score: 85,
        status: 'completed',
        minPassScore: 70,
        completedAt: '۵ اردیبهشت',
    },
    {
        id: 'quiz-talent-2',
        courseSlug: 'clifton-strengths-career-mastery',
        title: 'کوییز ارزیابی مسیر شغلی و استعدادیابی',
        questionsCount: 10,
        durationMinutes: 15,
        status: 'available',
        minPassScore: 70,
    },
];

export function getAssignmentsForCourse(
    assignments: CourseAssignment[],
    courseSlug: string
): CourseAssignment[] {
    return assignments.filter((a) => a.courseSlug === courseSlug);
}

export function getQuizzesForCourse(
    quizzes: CourseQuiz[],
    courseSlug: string
): CourseQuiz[] {
    return quizzes.filter((q) => q.courseSlug === courseSlug);
}

export function submitAssignmentResponse(
    assignments: CourseAssignment[],
    assignmentId: string,
    submissionText: string
): CourseAssignment[] {
    return assignments.map((a) =>
        a.id === assignmentId
            ? {
                  ...a,
                  status: 'submitted',
                  submissionText,
                  submittedAt: 'هم‌اکنون',
              }
            : a
    );
}

export function completeQuizScore(
    quizzes: CourseQuiz[],
    quizId: string,
    score: number
): CourseQuiz[] {
    return quizzes.map((q) =>
        q.id === quizId
            ? {
                  ...q,
                  status: 'completed',
                  score,
                  completedAt: 'هم‌اکنون',
              }
            : q
    );
}

export function calculateCourseAverageGrade(
    assignments: CourseAssignment[],
    courseSlug: string
): number {
    const graded = assignments.filter(
        (a) => a.courseSlug === courseSlug && typeof a.grade === 'number'
    );
    if (graded.length === 0) return 18;
    const sum = graded.reduce((acc, curr) => acc + (curr.grade || 0), 0);
    return Math.round((sum / graded.length) * 10) / 10;
}

export function calculateCourseQuizAverage(
    quizzes: CourseQuiz[],
    courseSlug: string
): number {
    const completed = quizzes.filter(
        (q) => q.courseSlug === courseSlug && typeof q.score === 'number'
    );
    if (completed.length === 0) return 85;
    const sum = completed.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(sum / completed.length);
}

export type DashboardCourseViewMode =
    | 'empty'
    | 'single_full_page'
    | 'multi_grid'
    | 'course_detail';

/**
 * Determines the exact display mode for DashboardScreen / رشد من:
 * - If 0 courses: 'empty'
 * - If 1 course: 'single_full_page' (directly renders the full-page immersive card with assignments & quizzes)
 * - If >1 courses and no course card clicked yet: 'multi_grid' (renders large interactive course cards in a grid; assignments/quizzes hidden until click)
 * - If >1 courses and a course card is clicked: 'course_detail' (renders full-page course details, assignments & quizzes with a back button to grid)
 */
export function resolveDashboardViewMode(
    enrolledCoursesCount: number,
    selectedCourseSlug: string | null
): DashboardCourseViewMode {
    if (enrolledCoursesCount <= 0) {
        return 'empty';
    }
    if (enrolledCoursesCount === 1) {
        return 'single_full_page';
    }
    if (selectedCourseSlug && selectedCourseSlug.trim().length > 0) {
        return 'course_detail';
    }
    return 'multi_grid';
}

