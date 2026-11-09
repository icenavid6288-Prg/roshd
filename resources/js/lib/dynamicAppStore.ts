import { useEffect, useState, useCallback } from 'react';
import {
    CourseItemInstructor,
    ChatMessage,
    defaultCourseItemsWithInstructors,
    defaultGroupChatMessages,
    defaultCourseSupportMessages,
} from './mobileAppLogic';
import {
    UserProfileState as UserProfileData,
    WalletOrder as WalletOrderItem,
    TalentDimension,
    EarnedBadge,
    SmartNotificationSettings as NotificationSettings,
    defaultUserProfile,
    defaultWalletOrders,
    defaultTalentDimensions,
    defaultEarnedBadges,
    defaultNotificationSettings,
} from './profileLogic';

export interface DynamicGoalItem {
    id: number;
    title: string;
    category: string;
    dueDate: string;
    totalTasks: number;
    completedTasks: number;
    status: 'in_progress' | 'completed';
}

export interface DynamicReminderItem {
    id: number;
    title: string;
    time: string;
    days: string;
    channel: 'sms' | 'eitaa' | 'in_app';
    enabled: boolean;
}

export interface DynamicReminderLog {
    id: number;
    title: string;
    recipient: string;
    sentAt: string;
    channel: 'sms' | 'eitaa' | 'in_app';
    status: 'delivered';
}

export interface DynamicSupportTicketMessage {
    id: string;
    sender: 'student' | 'support';
    senderName: string;
    text: string;
    time: string;
}

export interface DynamicSupportTicket {
    id: number;
    subject: string;
    department: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'answered' | 'closed';
    createdAt: string;
    messages: DynamicSupportTicketMessage[];
}

export interface DynamicLessonItem {
    id: number;
    courseSlug: string;
    number: number;
    title: string;
    duration: string;
    videoSummary: string;
    completed: boolean;
    note: string;
    is_free?: boolean;
}

export interface DynamicCourseModuleLesson {
    id: number;
    title: string;
    duration: string;
    is_free: boolean;
}

export interface DynamicCourseModule {
    id: number;
    title: string;
    instructorName?: string;
    instructorRole?: string;
    lessons: DynamicCourseModuleLesson[];
}

export interface DynamicCourseItem {
    id: number;
    title: string;
    subtitle?: string;
    slug: string;
    summary: string;
    description: string;
    price: number;
    discount_price: number | null;
    is_free: boolean;
    is_vip: boolean;
    is_published: boolean;
    is_featured: boolean;
    is_in_person: boolean;
    certificate_enabled: boolean;
    delivery_mode: string;
    level: string;
    duration: string;
    duration_minutes: number;
    lessons_count: number;
    students_count: number;
    max_students?: number;
    rating: number;
    category: string;
    location?: string;
    in_person_description?: string;
    schedule_summary?: string;
    online_platform?: string;
    thumbnail: string;
    poster: string;
    posterTag: string;
    posterGradient: string;
    instructors_count: number;
    instructor: {
        id: number;
        name: string;
        title: string;
        avatar: string;
    };
    modules: DynamicCourseModule[];
}

export interface DynamicVipFeature {
    id: number;
    title: string;
    active: boolean;
}

export interface DynamicVipSession {
    id: number;
    number: number;
    title: string;
    mode: 'in_person' | 'online';
    date: string;
    time: string;
    locationOrLink: string;
    status: 'completed' | 'upcoming';
    reminderSent: boolean;
    isLocked?: boolean;
}

export interface DynamicFeatureToggles {
    isVipEnrolled: boolean;
    allowVipRegistration: boolean;
    groupChatEnabled: boolean;
    coachingBookingEnabled: boolean;
    talentAssessmentEnabled: boolean;
    podcastsEnabled: boolean;
    shopEnabled: boolean;
    supportTicketsEnabled: boolean;
    sessionsLockedForNonVip: boolean;
    certificateEnabled: boolean;
    walletEnabled: boolean;
    parentReportCardEnabled: boolean;
}

export interface DynamicVipStudent {
    id: number;
    name: string;
    grade: string;
    phone: string;
    vipCode: string;
    isVip: boolean;
    attendanceRate: number;
    status: 'present_in_person' | 'present_online' | 'late' | 'absent';
    checkInTime: string;
}

export interface DynamicVipConfig {
    title: string;
    subtitle: string;
    description: string;
    inPersonLocation: string;
    onlinePlatform: string;
    scheduleSummary: string;
    autoSmsReminder: boolean;
    reminderLeadMinutes: number;
    price: number;
    discountPrice: number;
    capacity: number;
    posterUrl: string;
    posterBadge: string;
}

export interface DynamicAppState {
    userProfile: UserProfileData;
    walletOrders: WalletOrderItem[];
    talentDimensions: TalentDimension[];
    earnedBadges: EarnedBadge[];
    notifSettings: NotificationSettings;
    courseItems: CourseItemInstructor[];
    groupChatEnabled: boolean;
    groupMessages: ChatMessage[];
    supportMessages: ChatMessage[];
    ownedProductSlugs: string[];
    enrolledCourseSlugs: string[];
    goals: DynamicGoalItem[];
    reminders: DynamicReminderItem[];
    reminderLogs: DynamicReminderLog[];
    supportTickets: DynamicSupportTicket[];
    lessons: DynamicLessonItem[];
    courses: DynamicCourseItem[];
    vipConfig: DynamicVipConfig;
    vipFeatures: DynamicVipFeature[];
    vipSessions: DynamicVipSession[];
    vipStudents: DynamicVipStudent[];
    featureToggles: DynamicFeatureToggles;
}

export const defaultDynamicFeatureToggles: DynamicFeatureToggles = {
    isVipEnrolled: false,
    allowVipRegistration: true,
    groupChatEnabled: true,
    coachingBookingEnabled: true,
    talentAssessmentEnabled: true,
    podcastsEnabled: true,
    shopEnabled: true,
    supportTicketsEnabled: true,
    sessionsLockedForNonVip: true,
    certificateEnabled: false,
    walletEnabled: false,
    parentReportCardEnabled: false,
};

export const defaultDynamicVipConfig: DynamicVipConfig = {
    title: 'طراحی آینده نوجوان (دوره جامع پریمیوم VIP)',
    subtitle: 'استعدادیابی، ساخت هویت مستقل، مهارت‌های زندگی و ترسیم نقشه راه آینده (حضوری + مجازی)',
    description:
        'دوره پرچمدار و اختصاصی مرکز رشد ویژه نوجوانان ۱۲ تا ۱۸ سال. این دوره به صورت ترکیبی (کارگاه‌های عملی حضوری + جلسات پشتیبانی و آموزش آنلاین) برگزار می‌شود و هر دانش‌پذیر با مهر اختصاصی VIP تحت منتورینگ مستمر قرار می‌گیرد.',
    inPersonLocation: 'تهران، مرکز رشد دکتر بیدی — سالن کارگاه VIP طبقه ۲',
    onlinePlatform: 'اتاق اختصاصی آنلاین رشد ( اسکای‌روم / گوگل‌میت )',
    scheduleSummary: 'سه‌شنبه‌ها ساعت ۱۷:۰۰ (حضوری) و پنج‌شنبه‌ها ساعت ۱۸:۳۰ (مجازی)',
    autoSmsReminder: true,
    reminderLeadMinutes: 90,
    price: 6800000,
    discountPrice: 5400000,
    capacity: 30,
    posterUrl: '/images/vip-teen-future.svg',
    posterBadge: 'پوستر رسمی دوره VIP',
};

export const defaultDynamicVipFeatures: DynamicVipFeature[] = [
    { id: 1, title: '۱۲ کارگاه حضوری پروژه‌محور و تعاملی', active: true },
    { id: 2, title: '۸ وبینار و کلاس آنلاین تکمیلی و رفع اشکال', active: true },
    { id: 3, title: 'آزمون جامع استعدادیابی و رغبت‌سنجی با گزارش اختصاصی', active: true },
    { id: 4, title: '۴ جلسه کوچینگ فردی نوجوان و والدین با دکتر بیدی', active: true },
    { id: 5, title: 'کارت عضویت و مهر طلایی VIP با اولویت رزرو و پشتیبانی', active: true },
    { id: 6, title: 'سیستم هوشمند حضور و غیاب و گزارش ماهانه به والدین', active: true },
];

export const defaultDynamicVipSessions: DynamicVipSession[] = [
    {
        id: 101,
        number: 1,
        title: 'کشف استعدادهای ذاتی و تحلیل نیمرخ روانشناختی نوجوان',
        mode: 'in_person',
        date: 'سه‌شنبه ۲ اردیبهشت ۱۴۰۴',
        time: '۱۷:۰۰ تا ۱۹:۰۰',
        locationOrLink: 'سالن کارگاه VIP مرکز رشد',
        status: 'completed',
        reminderSent: true,
    },
    {
        id: 102,
        number: 2,
        title: 'مهارت هدف‌گذاری، برنامه‌ریزی شخصی و مدیریت زمان',
        mode: 'online',
        date: 'پنج‌شنبه ۴ اردیبهشت ۱۴۰۴',
        time: '۱۸:۳۰ تا ۲۰:۰۰',
        locationOrLink: 'لینک مستقیم کلاس آنلاین VIP',
        status: 'completed',
        reminderSent: true,
    },
    {
        id: 103,
        number: 3,
        title: 'کارگاه عملی ارتباط مؤثر، عزت‌نفس و تصمیم‌گیری مستقل',
        mode: 'in_person',
        date: 'سه‌شنبه ۹ اردیبهشت ۱۴۰۴',
        time: '۱۷:۰۰ تا ۱۹:۰۰',
        locationOrLink: 'سالن کارگاه VIP مرکز رشد',
        status: 'upcoming',
        reminderSent: true,
    },
    {
        id: 104,
        number: 4,
        title: 'سواد مالی نوجوان، کارآفرینی و طراحی پروژه آینده من',
        mode: 'online',
        date: 'پنج‌شنبه ۱۱ اردیبهشت ۱۴۰۴',
        time: '۱۸:۳۰ تا ۲۰:۰۰',
        locationOrLink: 'لینک مستقیم کلاس آنلاین VIP',
        status: 'upcoming',
        reminderSent: false,
    },
];

export const defaultDynamicVipStudents: DynamicVipStudent[] = [
    {
        id: 1,
        name: 'امیرعلی رضایی',
        grade: 'پایه دهم',
        phone: '۰۹۱۲۳۴۵۱۱۲۲',
        vipCode: 'VIP-1404-101',
        isVip: true,
        attendanceRate: 100,
        status: 'present_in_person',
        checkInTime: '۱۶:۵۵',
    },
    {
        id: 2,
        name: 'سارا محمدی',
        grade: 'پایه نهم',
        phone: '۰۹۱۲۸۸۷۳۳۴۴',
        vipCode: 'VIP-1404-102',
        isVip: true,
        attendanceRate: 95,
        status: 'present_in_person',
        checkInTime: '۱۷:۰۲',
    },
    {
        id: 3,
        name: 'پارسا کریمی',
        grade: 'پایه یازدهم',
        phone: '۰۹۳۵۴۴۱۲۲۱۱',
        vipCode: 'VIP-1404-103',
        isVip: true,
        attendanceRate: 90,
        status: 'present_online',
        checkInTime: '۱۷:۰۵',
    },
    {
        id: 4,
        name: 'هلیا احمدوند',
        grade: 'پایه هشتم',
        phone: '۰۹۱۹۷۶۵۴۳۲۱',
        vipCode: 'VIP-1404-104',
        isVip: true,
        attendanceRate: 85,
        status: 'late',
        checkInTime: '۱۷:۲۰',
    },
    {
        id: 5,
        name: 'ماهان صادقی',
        grade: 'پایه دهم',
        phone: '۰۹۱۲۵۵۵۹۹۸۸',
        vipCode: 'VIP-1404-105',
        isVip: true,
        attendanceRate: 78,
        status: 'absent',
        checkInTime: '—',
    },
];

export const defaultDynamicCourses: DynamicCourseItem[] = [
    {
        id: 100,
        title: 'طراحی آینده نوجوان (دوره جامع پریمیوم VIP)',
        subtitle: 'استعدادیابی، ساخت هویت مستقل، مهارت‌های زندگی و ترسیم نقشه راه آینده (حضوری + مجازی)',
        slug: 'designing-teen-future-vip',
        summary: 'دوره پرچمدار استعدادیابی، مهارت‌های زندگی و طراحی مسیر آینده نوجوانان (برگزاری ترکیبی حضوری و مجازی با مهر VIP).',
        description:
            'این دوره اصلی‌ترین برنامه تحولی مرکز رشد برای نوجوانان است که شامل ۴ آیتم تخصصی با ۴ مدرس مجرب، کارگاه‌های حضوری، کلاس‌های آنلاین، چت مستقیم با مدرس هر آیتم و گروه اختصاصی دوره می‌باشد.',
        price: 6800000,
        discount_price: 5400000,
        is_free: false,
        is_vip: true,
        is_published: true,
        is_featured: true,
        is_in_person: true,
        certificate_enabled: true,
        delivery_mode: 'حضوری + مجازی (ترکیبی)',
        level: 'پریمیوم VIP',
        duration: '۴۰ ساعت',
        duration_minutes: 2400,
        lessons_count: 20,
        students_count: 24,
        max_students: 30,
        rating: 5.0,
        category: 'نوجوانان و والدین',
        location: 'تهران، مرکز رشد دکتر بیدی — سالن کارگاه VIP طبقه ۲',
        in_person_description: 'برگزاری کارگاه‌های حضوری پروژه‌محور سه‌شنبه‌ها ساعت ۱۷:۰۰ و جلسات آنلاین پنج‌شنبه‌ها ساعت ۱۸:۳۰ به همراه حضور و غیاب هوشمند و گزارش به والدین.',
        schedule_summary: 'سه‌شنبه‌ها ساعت ۱۷:۰۰ (حضوری) و پنج‌شنبه‌ها ساعت ۱۸:۳۰ (مجازی)',
        online_platform: 'اتاق اختصاصی آنلاین رشد ( اسکای‌روم / گوگل‌میت )',
        thumbnail: '/images/vip-teen-future.svg',
        poster: '/images/vip-teen-future.svg',
        posterTag: 'پوستر رسمی دوره VIP',
        posterGradient: 'linear-gradient(145deg, #10382B 0%, #1C5843 55%, #0D2A20 100%)',
        instructors_count: 4,
        instructor: {
            id: 1,
            name: '۴ مدرس تخصصی (دکتر بیدی و اساتید آیتم‌ها)',
            title: 'تیم اساتید خودشناسی، هدف‌گذاری، ارتباطات و کارآفرینی',
            avatar: '/images/brand-logo.png',
        },
        modules: [
            {
                id: 1,
                title: 'آیتم اول: خودشناسی و کشف استعدادهای نوجوان (حضوری + آنلاین)',
                instructorName: 'دکتر محمدرضا صادقی',
                instructorRole: 'متخصص روان‌شناسی نوجوان و استعدادیابی',
                lessons: [
                    { id: 101, title: 'کشف استعدادهای ذاتی و نیمرخ روانشناختی (کارگاه حضوری)', duration: '۱۲۰ دقیقه', is_free: false },
                    { id: 102, title: 'تحلیل آزمون رغبت‌سنجی و نقاط قوت (کلاس آنلاین)', duration: '۹۰ دقیقه', is_free: false },
                ],
            },
            {
                id: 2,
                title: 'آیتم دوم: مهارت هدف‌گذاری ۹۰ روزه و برنامه‌ریزی شخصی',
                instructorName: 'استاد سارا کریمی',
                instructorRole: 'کوچ برنامه‌ریزی و مدیریت زمان',
                lessons: [
                    { id: 103, title: 'طراحی بوم نقشه راه ۹۰ روزه نوجوان (آنلاین)', duration: '۹۰ دقیقه', is_free: false },
                    { id: 104, title: 'ساخت عادت‌های پایدار و تمرکز عمیق (کارگاه)', duration: '۱۲۰ دقیقه', is_free: false },
                ],
            },
            {
                id: 3,
                title: 'آیتم سوم: ارتباط مؤثر، عزت‌نفس و تصمیم‌گیری مستقل',
                instructorName: 'دکتر امیرحسین نادری',
                instructorRole: 'مدرس فن بیان، ارتباطات و رهبری نوجوان',
                lessons: [
                    { id: 105, title: 'کارگاه عملی عزت‌نفس و قاطعیت محترمانه (حضوری)', duration: '۱۲۰ دقیقه', is_free: false },
                ],
            },
            {
                id: 4,
                title: 'آیتم چهارم: سواد مالی نوجوان، کارآفرینی و پروژه آینده',
                instructorName: 'مهندس نیما رحیمی',
                instructorRole: 'منتور کارآفرینی و هوش مالی نوجوان',
                lessons: [
                    { id: 106, title: 'طراحی اولین مینی‌پروژه کارآفرینی من (حضوری + آنلاین)', duration: '۱۲۰ دقیقه', is_free: false },
                ],
            },
        ],
    },
    {
        id: 1,
        title: 'دوره جامع استعدادیابی و طراحی مسیر شغلی (CliftonStrengths)',
        subtitle: 'کشف ۵ استعداد غالب شما و تبدیل آن‌ها به مزیت رقابتی پایدار',
        slug: 'clifton-strengths-career-mastery',
        summary: 'کشف ۵ استعداد غالب شما و تبدیل آن‌ها به مزیت رقابتی پایدار در بازار کار و کسب‌وکار.',
        description: 'در این دوره پروژه‌محور، با استفاده از متدولوژی گالوپ و جلسات کارگاهی، نقشه استعدادهای ذاتی خود را ترسیم کرده و مسیر شغلی ۵ ساله خود را با همراهی اساتید هر سرفصل طراحی می‌کنید.',
        price: 2450000,
        discount_price: 1890000,
        is_free: false,
        is_vip: false,
        is_published: true,
        is_featured: true,
        is_in_person: false,
        certificate_enabled: true,
        delivery_mode: 'آنلاین',
        level: 'مقدماتی تا پیشرفته',
        duration: '۱۸ ساعت',
        duration_minutes: 1080,
        lessons_count: 24,
        students_count: 1420,
        rating: 4.9,
        category: 'استعدادیابی بزرگسالان',
        thumbnail: '/images/growth-editorial.png',
        poster: '/images/growth-editorial.png',
        posterTag: 'پوستر دوره استعدادیابی',
        posterGradient: 'linear-gradient(145deg, #134434 0%, #1F684F 60%, #0E3125 100%)',
        instructors_count: 3,
        instructor: {
            id: 1,
            name: 'دکتر بیدی و ۲ مدرس همکار',
            title: 'مدرس و کوچ ارشد استعدادیابی و کارآفرینی',
            avatar: '/images/brand-logo.png',
        },
        modules: [],
    },
    {
        id: 2,
        title: 'تربیت کوچ حرفه‌ای رشد و تحول فردی (سطح ۱ بین‌المللی)',
        subtitle: 'آموزش مهارت‌های شنیدن فعال و هدایت جلسات کوچینگ طبق استانداردهای ICF',
        slug: 'professional-life-coaching-level-1',
        summary: 'آموزش مهارت‌های شنیدن فعال، پرسشگری قدرتمند و هدایت جلسات کوچینگ طبق استانداردهای ICF.',
        description: 'دوره‌ای عملی همراه با سوپرویژن اختصاصی برای افرادی که می‌خواهند به عنوان کوچ حرفه‌ای فعالیت کنند یا مهارت‌های رهبری خود را ارتقا دهند.',
        price: 4800000,
        discount_price: 3950000,
        is_free: false,
        is_vip: false,
        is_published: true,
        is_featured: true,
        is_in_person: false,
        certificate_enabled: true,
        delivery_mode: 'آنلاین + کارگاه',
        level: 'پیشرفته',
        duration: '۳۲ ساعت',
        duration_minutes: 1920,
        lessons_count: 36,
        students_count: 860,
        rating: 4.95,
        category: 'کوچینگ حرفه‌ای',
        thumbnail: '/images/roshd-logo.png',
        poster: '/images/roshd-logo.png',
        posterTag: 'پوستر دوره کوچینگ ICF',
        posterGradient: 'linear-gradient(145deg, #19382E 0%, #275A48 60%, #112820 100%)',
        instructors_count: 3,
        instructor: {
            id: 2,
            name: 'سارا رادمنش و اساتید سوپرویژن',
            title: 'مستر کوچ بین‌المللی و مدرس ارتباطات',
            avatar: '/images/brand-logo.png',
        },
        modules: [],
    },
    {
        id: 3,
        title: 'هوش مالی، کارآفرینی و ساخت مدل کسب‌وکار شخصی',
        subtitle: 'تبدیل مهارت‌ها و استعدادهای فردی به یک کسب‌وکار پایدار و مقیاس‌پذیر',
        slug: 'financial-intelligence-and-entrepreneurship',
        summary: 'چگونه از مهارت‌ها و استعدادهای فردی خود یک کسب‌وکار پایدار و مقیاس‌پذیر بسازیم؟',
        description: 'آموزش گام‌به‌گام اعتبارسنجی ایده، طراحی بوم مدل کسب‌وکار، قیمت‌گذاری خدمات آموزشی و مدیریت جریان نقدینگی.',
        price: 1950000,
        discount_price: 1490000,
        is_free: false,
        is_vip: false,
        is_published: true,
        is_featured: false,
        is_in_person: false,
        certificate_enabled: true,
        delivery_mode: 'آنلاین',
        level: 'متوسط',
        duration: '۱۴ ساعت',
        duration_minutes: 840,
        lessons_count: 18,
        students_count: 2150,
        rating: 4.85,
        category: 'کارآفرینی',
        thumbnail: '/images/brand-logo.png',
        poster: '/images/brand-logo.png',
        posterTag: 'پوستر دوره کارآفرینی',
        posterGradient: 'linear-gradient(145deg, #1E3A2F 0%, #2B5444 60%, #13261F 100%)',
        instructors_count: 2,
        instructor: {
            id: 1,
            name: 'دکتر بیدی و مهندس رحیمی',
            title: 'اساتید کارآفرینی و مدل کسب‌وکار',
            avatar: '/images/brand-logo.png',
        },
        modules: [],
    },
];

export const defaultDynamicGoals: DynamicGoalItem[] = [
    {
        id: 1,
        title: 'تکمیل بوم هدف‌گذاری ۹۰ روزه و پروژه‌های طراحی آینده نوجوان',
        category: 'دوره VIP آینده نوجوان',
        dueDate: '۳۰ خرداد ۱۴۰۴',
        totalTasks: 8,
        completedTasks: 6,
        status: 'in_progress',
    },
    {
        id: 2,
        title: 'مطالعه کامل کتاب قطب‌نمای استعداد و انجام تمرین‌های خودشناسی',
        category: 'کتاب‌خوان درون‌برنامه‌ای',
        dueDate: '۱۵ اردیبهشت ۱۴۰۴',
        totalTasks: 5,
        completedTasks: 4,
        status: 'in_progress',
    },
    {
        id: 3,
        title: 'اجرای ارائه ۳ دقیقه‌ای فن بیان و مذاکره در کارگاه حضوری',
        category: 'آیتم ۳: ارتباط مؤثر',
        dueDate: '۹ اردیبهشت ۱۴۰۴',
        totalTasks: 4,
        completedTasks: 4,
        status: 'completed',
    },
];

export const defaultDynamicReminders: DynamicReminderItem[] = [
    {
        id: 1,
        title: 'کلاس حضوری طراحی آینده نوجوان (سه‌شنبه‌ها)',
        time: '۱۵:۳۰',
        days: '۹۰ دقیقه قبل از کلاس',
        channel: 'sms',
        enabled: true,
    },
    {
        id: 2,
        title: 'کلاس آنلاین طراحی آینده نوجوان (پنج‌شنبه‌ها)',
        time: '۱۷:۰۰',
        days: '۹۰ دقیقه قبل از کلاس',
        channel: 'sms',
        enabled: true,
    },
    {
        id: 3,
        title: 'ثبت ژورنال هدف‌گذاری ۹۰ روزه و مرور هفتگی',
        time: '۲۱:۳۰',
        days: 'شنبه‌ها و چهارشنبه‌ها',
        channel: 'in_app',
        enabled: true,
    },
];

export const defaultDynamicReminderLogs: DynamicReminderLog[] = [
    {
        id: 101,
        title: 'یادآوری کارگاه حضوری ارتباط مؤثر و عزت‌نفس (سه‌شنبه ساعت ۱۷:۰۰)',
        recipient: '۰۹۱۲۳۴۵۶۷۸۹ (دانش‌پذیر و والدین)',
        sentAt: 'امروز · ساعت ۱۵:۳۰',
        channel: 'sms',
        status: 'delivered',
    },
    {
        id: 102,
        title: 'ارسال کارنامه هفتگی حضور و پیشرفت دوره طراحی آینده به والدین',
        recipient: '۰۹۱۲۱۱۱۲۲۳۳ (والدین)',
        sentAt: 'دیروز · ساعت ۲۰:۰۰',
        channel: 'sms',
        status: 'delivered',
    },
];

export const defaultDynamicSupportTickets: DynamicSupportTicket[] = [
    {
        id: 201,
        subject: 'هماهنگی حضور در کارگاه سه‌شنبه طراحی آینده نوجوان',
        department: 'آموزش و کارگاه‌های VIP',
        priority: 'medium',
        status: 'answered',
        createdAt: '۱۰ اردیبهشت ۱۴۰۴',
        messages: [
            {
                id: 'tk-m1',
                sender: 'student',
                senderName: 'نوید محمدی',
                text: 'سلام وقت بخیر، برای کارگاه حضوری سه‌شنبه نیاز به همراه داشتن لپ‌تاپ هست یا فقط کتاب کار کافی است؟',
                time: '۱۰ اردیبهشت · ۱۱:۲۰',
            },
            {
                id: 'tk-m2',
                sender: 'support',
                senderName: 'پشتیبانی آموزش (خانم سعیدی)',
                text: 'سلام نوید عزیز! همراه داشتن کتاب کار و بوم ۹۰ روزه کافی است؛ کاربرگ‌های کارگاه در سالن VIP تحویل شما می‌شود.',
                time: '۱۰ اردیبهشت · ۱۱:۴۵',
            },
        ],
    },
    {
        id: 202,
        subject: 'راهنمای استفاده از کتاب‌خوان و پلیر صوتی درون‌برنامه‌ای',
        department: 'پشتیبانی فنی اپلیکیشن',
        priority: 'low',
        status: 'answered',
        createdAt: '۸ اردیبهشت ۱۴۰۴',
        messages: [
            {
                id: 'tk-m3',
                sender: 'student',
                senderName: 'نوید محمدی',
                text: 'چطور می‌تونم فونت کتاب قطب‌نمای استعداد رو توی اپلیکیشن بزرگ‌تر کنم؟',
                time: '۸ اردیبهشت · ۱۸:۱۰',
            },
            {
                id: 'tk-m4',
                sender: 'support',
                senderName: 'پشتیبانی فنی رشد',
                text: 'در بالای صفحه کتاب‌خوان دکمه‌های A- و A+ و همچنین تغییر تم (روشن، کاغذی، شب) قرار دارد که تنظیمات شما را ذخیره می‌کند.',
                time: '۸ اردیبهشت · ۱۸:۲۵',
            },
        ],
    },
];

export const defaultDynamicLessons: DynamicLessonItem[] = [
    {
        id: 1,
        courseSlug: 'designing-teen-future-vip',
        number: 1,
        title: 'آشنایی با مدل استعدادهای کلیفتون و گاردنر',
        duration: '۳۵ دقیقه',
        videoSummary: 'در این جلسه تفاوت استعداد ذاتی، دانش و مهارت را بررسی می‌کنیم و نیمرخ روانشناختی خود را تحلیل می‌کنیم.',
        completed: true,
        note: 'نقاط قوت تحلیلی و استراتژیک من در آزمون اول بالای ۸۵٪ بود.',
    },
    {
        id: 2,
        courseSlug: 'designing-teen-future-vip',
        number: 2,
        title: 'تفاوت استعداد، دانش و مهارت در انتخاب مسیر آینده',
        duration: '۴۲ دقیقه',
        videoSummary: 'چگونه علایق زودگذر را از استعدادهای ریشه‌ای تشخیص دهیم و انرژی خود را روی مهارت‌های کلیدی متمرکز کنیم.',
        completed: true,
        note: '',
    },
    {
        id: 3,
        courseSlug: 'designing-teen-future-vip',
        number: 3,
        title: 'تحلیل ۵ استعداد غالب در محیط واقعی و پروژه‌های نوجوان',
        duration: '۴۸ دقیقه',
        videoSummary: 'بررسی موردی پروژه‌های دانش‌پذیران VIP و نحوه تبدیل استعداد به اولین پروژه عملی.',
        completed: false,
        note: 'برای جلسه سه‌شنبه باید ۳ موقعیت واقعی مدرسه را یادداشت کنم.',
    },
    {
        id: 4,
        courseSlug: 'designing-teen-future-vip',
        number: 4,
        title: 'تدوین برنامه اقدام شخصی (Action Plan) و بوم ۹۰ روزه',
        duration: '۵۰ دقیقه',
        videoSummary: 'گام‌به‌گام تکمیل بوم هدف‌گذاری فصلی و تقسیم اهداف بزرگ به عادت‌های روزانه ۲۰ دقیقه‌ای.',
        completed: false,
        note: '',
    },
];

export function createInitialDynamicAppState(): DynamicAppState {
    return {
        userProfile: defaultUserProfile,
        walletOrders: defaultWalletOrders,
        talentDimensions: defaultTalentDimensions,
        earnedBadges: defaultEarnedBadges,
        notifSettings: defaultNotificationSettings,
        courseItems: defaultCourseItemsWithInstructors,
        groupChatEnabled: true,
        groupMessages: defaultGroupChatMessages,
        supportMessages: defaultCourseSupportMessages,
        ownedProductSlugs: [
            'talent-compass-book',
            'roshd-future-mindset-podcast',
            '90-day-growth-planner',
            'roshd-90-day-planner',
            'comprehensive-talent-package',
        ],
        enrolledCourseSlugs: ['designing-teen-future-vip', 'clifton-strengths-career-mastery'],
        goals: defaultDynamicGoals,
        reminders: defaultDynamicReminders,
        reminderLogs: defaultDynamicReminderLogs,
        supportTickets: defaultDynamicSupportTickets,
        lessons: defaultDynamicLessons,
        courses: defaultDynamicCourses,
        vipConfig: defaultDynamicVipConfig,
        vipFeatures: defaultDynamicVipFeatures,
        vipSessions: defaultDynamicVipSessions,
        vipStudents: defaultDynamicVipStudents,
        featureToggles: defaultDynamicFeatureToggles,
    };
}

// Pure State Mutators (Testable with node:test)
export function toggleFeatureInState(
    state: DynamicAppState,
    featureKey: keyof DynamicFeatureToggles,
    forcedValue?: boolean
): DynamicAppState {
    const nextVal =
        forcedValue !== undefined ? forcedValue : !state.featureToggles[featureKey];
    return {
        ...state,
        featureToggles: {
            ...state.featureToggles,
            [featureKey]: nextVal,
        },
        groupChatEnabled:
            featureKey === 'groupChatEnabled' ? nextVal : state.groupChatEnabled,
    };
}

export function toggleSessionLockInState(
    sessions: DynamicVipSession[],
    sessionId: number
): DynamicVipSession[] {
    return sessions.map((s) =>
        s.id === sessionId ? { ...s, isLocked: !s.isLocked } : s
    );
}

export function toggleVipActivationInState(state: DynamicAppState): DynamicAppState {
    const vipSlug = 'designing-teen-future-vip';
    const isEnrolled = state.enrolledCourseSlugs.includes(vipSlug);
    const nextEnrolledSlugs = isEnrolled
        ? state.enrolledCourseSlugs.filter((s) => s !== vipSlug)
        : [...state.enrolledCourseSlugs, vipSlug];
    const nextEnrolled = !isEnrolled;
    return {
        ...state,
        enrolledCourseSlugs: nextEnrolledSlugs,
        featureToggles: {
            ...state.featureToggles,
            isVipEnrolled: nextEnrolled,
        },
    };
}

export function updateVipConfigInState(
    state: DynamicAppState,
    partialConfig: Partial<DynamicVipConfig>
): DynamicAppState {
    const nextVipConfig: DynamicVipConfig = {
        ...state.vipConfig,
        ...partialConfig,
    };
    const nextCourses = state.courses.map((c) => {
        if (!c.is_vip && c.id !== 100 && c.slug !== 'designing-teen-future-vip') {
            return c;
        }
        return {
            ...c,
            title: nextVipConfig.title,
            subtitle: nextVipConfig.subtitle,
            summary: nextVipConfig.subtitle || c.summary,
            description: nextVipConfig.description,
            price: nextVipConfig.price,
            discount_price: nextVipConfig.discountPrice,
            max_students: nextVipConfig.capacity,
            location: nextVipConfig.inPersonLocation,
            online_platform: nextVipConfig.onlinePlatform,
            schedule_summary: nextVipConfig.scheduleSummary,
            thumbnail: nextVipConfig.posterUrl || c.thumbnail,
            poster: nextVipConfig.posterUrl || c.poster,
            posterTag: nextVipConfig.posterBadge || c.posterTag,
        };
    });
    return {
        ...state,
        vipConfig: nextVipConfig,
        courses: nextCourses,
    };
}

export function saveCourseInState(
    state: DynamicAppState,
    courseInput: Partial<DynamicCourseItem> & { title: string }
): DynamicAppState {
    const cleanTitle = courseInput.title.trim();
    if (!cleanTitle) return state;

    const existing = courseInput.id
        ? state.courses.find((c) => c.id === courseInput.id)
        : undefined;

    const slug =
        (courseInput.slug && courseInput.slug.trim()) ||
        existing?.slug ||
        `course-${Date.now()}`;

    const isVip =
        courseInput.is_vip !== undefined
            ? Boolean(courseInput.is_vip)
            : existing?.is_vip ?? false;

    const price = Number(courseInput.price ?? existing?.price ?? 0);
    const discountPrice =
        courseInput.discount_price === null || courseInput.discount_price === undefined
            ? existing?.discount_price ?? null
            : Number(courseInput.discount_price) || null;

    const durationMins = Number(
        courseInput.duration_minutes ?? existing?.duration_minutes ?? 600
    );
    const durationHours = Math.max(1, Math.round(durationMins / 60));

    const updatedCourse: DynamicCourseItem = {
        id: existing?.id ?? courseInput.id ?? Date.now(),
        title: cleanTitle,
        subtitle: courseInput.subtitle ?? existing?.subtitle ?? '',
        slug,
        summary:
            courseInput.summary ??
            courseInput.subtitle ??
            existing?.summary ??
            cleanTitle,
        description:
            courseInput.description ?? existing?.description ?? cleanTitle,
        price,
        discount_price: discountPrice,
        is_free: price <= 0,
        is_vip: isVip,
        is_published:
            courseInput.is_published !== undefined
                ? Boolean(courseInput.is_published)
                : existing?.is_published ?? true,
        is_featured:
            courseInput.is_featured !== undefined
                ? Boolean(courseInput.is_featured)
                : existing?.is_featured ?? false,
        is_in_person:
            courseInput.is_in_person !== undefined
                ? Boolean(courseInput.is_in_person)
                : existing?.is_in_person ?? isVip,
        certificate_enabled:
            courseInput.certificate_enabled !== undefined
                ? Boolean(courseInput.certificate_enabled)
                : existing?.certificate_enabled ?? true,
        delivery_mode:
            courseInput.delivery_mode ??
            existing?.delivery_mode ??
            (courseInput.is_in_person ? 'حضوری + مجازی (ترکیبی)' : 'آنلاین'),
        level: courseInput.level ?? existing?.level ?? (isVip ? 'پریمیوم VIP' : 'مقدماتی'),
        duration: courseInput.duration ?? existing?.duration ?? `${durationHours} ساعت`,
        duration_minutes: durationMins,
        lessons_count: courseInput.lessons_count ?? existing?.lessons_count ?? 16,
        students_count: courseInput.students_count ?? existing?.students_count ?? 12,
        max_students:
            courseInput.max_students ?? existing?.max_students ?? (isVip ? 30 : 100),
        rating: courseInput.rating ?? existing?.rating ?? 4.95,
        category: courseInput.category ?? existing?.category ?? 'نوجوانان و والدین',
        location:
            courseInput.location ??
            existing?.location ??
            state.vipConfig.inPersonLocation,
        in_person_description:
            courseInput.in_person_description ??
            existing?.in_person_description ??
            '',
        schedule_summary:
            courseInput.schedule_summary ??
            existing?.schedule_summary ??
            state.vipConfig.scheduleSummary,
        online_platform:
            courseInput.online_platform ??
            existing?.online_platform ??
            state.vipConfig.onlinePlatform,
        thumbnail:
            courseInput.thumbnail ||
            existing?.thumbnail ||
            '/images/vip-teen-future.svg',
        poster:
            courseInput.poster ||
            courseInput.thumbnail ||
            existing?.poster ||
            '/images/vip-teen-future.svg',
        posterTag:
            courseInput.posterTag ||
            existing?.posterTag ||
            (isVip ? 'پوستر رسمی دوره VIP' : 'پوستر دوره آموزشی'),
        posterGradient:
            courseInput.posterGradient ||
            existing?.posterGradient ||
            'linear-gradient(145deg, #10382B 0%, #1C5843 55%, #0D2A20 100%)',
        instructors_count:
            courseInput.instructors_count ?? existing?.instructors_count ?? 1,
        instructor: courseInput.instructor ??
            existing?.instructor ?? {
                id: 1,
                name: 'دکتر علیرضا بیدی',
                title: 'مدرس و راهبر مرکز رشد',
                avatar: '/images/brand-logo.png',
            },
        modules: courseInput.modules ?? existing?.modules ?? [],
    };

    const nextCourses = existing
        ? state.courses.map((c) => (c.id === existing.id ? updatedCourse : c))
        : [updatedCourse, ...state.courses];

    let nextVipConfig = state.vipConfig;
    if (
        updatedCourse.is_vip ||
        updatedCourse.id === 100 ||
        updatedCourse.slug === 'designing-teen-future-vip'
    ) {
        nextVipConfig = {
            ...state.vipConfig,
            title: updatedCourse.title,
            subtitle: updatedCourse.subtitle || state.vipConfig.subtitle,
            description: updatedCourse.description || state.vipConfig.description,
            price: updatedCourse.price,
            discountPrice:
                updatedCourse.discount_price ?? updatedCourse.price,
            capacity: updatedCourse.max_students ?? state.vipConfig.capacity,
            inPersonLocation:
                updatedCourse.location || state.vipConfig.inPersonLocation,
            onlinePlatform:
                updatedCourse.online_platform || state.vipConfig.onlinePlatform,
            scheduleSummary:
                updatedCourse.schedule_summary || state.vipConfig.scheduleSummary,
            posterUrl: updatedCourse.thumbnail || state.vipConfig.posterUrl,
            posterBadge: updatedCourse.posterTag || state.vipConfig.posterBadge,
        };
    }

    return {
        ...state,
        courses: nextCourses,
        vipConfig: nextVipConfig,
    };
}

export function deleteCourseFromState(
    state: DynamicAppState,
    courseId: number
): DynamicAppState {
    return {
        ...state,
        courses: state.courses.filter((c) => c.id !== courseId),
    };
}

export function addGoalToState(
    goals: DynamicGoalItem[],
    title: string,
    category: string,
    dueDate: string,
    totalTasks = 5
): DynamicGoalItem[] {
    const cleanTitle = title.trim();
    if (!cleanTitle) return goals;
    const boundedTotal = Math.max(1, Number(totalTasks) || 5);
    const created: DynamicGoalItem = {
        id: Date.now(),
        title: cleanTitle,
        category: category.trim() || 'مسیر رشد شخصی',
        dueDate: dueDate.trim() || 'تابستان ۱۴۰۴',
        totalTasks: boundedTotal,
        completedTasks: 0,
        status: 'in_progress',
    };
    return [created, ...goals];
}

export function advanceGoalTaskInState(
    goals: DynamicGoalItem[],
    goalId: number,
    delta = 1
): DynamicGoalItem[] {
    return goals.map((g) => {
        if (g.id !== goalId) return g;
        const nextCompleted = Math.min(g.totalTasks, Math.max(0, g.completedTasks + delta));
        return {
            ...g,
            completedTasks: nextCompleted,
            status: nextCompleted >= g.totalTasks ? 'completed' : 'in_progress',
        };
    });
}

export function addReminderToState(
    reminders: DynamicReminderItem[],
    title: string,
    time: string,
    days: string,
    channel: 'sms' | 'eitaa' | 'in_app' = 'sms'
): DynamicReminderItem[] {
    const cleanTitle = title.trim();
    if (!cleanTitle) return reminders;
    const created: DynamicReminderItem = {
        id: Date.now(),
        title: cleanTitle,
        time: time.trim() || '۱۸:۰۰',
        days: days.trim() || 'هر روز',
        channel,
        enabled: true,
    };
    return [created, ...reminders];
}

export function createSupportTicketInState(
    tickets: DynamicSupportTicket[],
    subject: string,
    department: string,
    priority: 'low' | 'medium' | 'high',
    body: string,
    senderName: string
): DynamicSupportTicket[] {
    const cleanSubject = subject.trim();
    const cleanBody = body.trim();
    if (!cleanSubject || !cleanBody) return tickets;
    const created: DynamicSupportTicket = {
        id: Date.now(),
        subject: cleanSubject,
        department: department.trim() || 'پشتیبانی آموزش',
        priority,
        status: 'open',
        createdAt: 'هم‌اکنون',
        messages: [
            {
                id: `tk-${Date.now()}`,
                sender: 'student',
                senderName,
                text: cleanBody,
                time: 'هم‌اکنون',
            },
        ],
    };
    return [created, ...tickets];
}

export function replyToSupportTicketInState(
    tickets: DynamicSupportTicket[],
    ticketId: number,
    text: string,
    sender: 'student' | 'support',
    senderName: string
): DynamicSupportTicket[] {
    const cleanText = text.trim();
    if (!cleanText) return tickets;
    return tickets.map((tk) => {
        if (tk.id !== ticketId) return tk;
        return {
            ...tk,
            status: sender === 'support' ? 'answered' : 'open',
            messages: [
                ...tk.messages,
                {
                    id: `tk-msg-${Date.now()}`,
                    sender,
                    senderName,
                    text: cleanText,
                    time: 'هم‌اکنون',
                },
            ],
        };
    });
}

export function toggleLessonCompletionInState(
    lessons: DynamicLessonItem[],
    lessonId: number
): DynamicLessonItem[] {
    return lessons.map((ls) =>
        ls.id === lessonId ? { ...ls, completed: !ls.completed } : ls
    );
}

export function updateLessonNoteInState(
    lessons: DynamicLessonItem[],
    lessonId: number,
    note: string
): DynamicLessonItem[] {
    return lessons.map((ls) => (ls.id === lessonId ? { ...ls, note } : ls));
}

export function purchaseWithWalletInState(
    state: DynamicAppState,
    itemTitle: string,
    itemSlug: string,
    price: number,
    itemType: 'product' | 'course'
): {
    success: boolean;
    message: string;
    nextState: DynamicAppState;
} {
    if (itemType === 'product' && state.ownedProductSlugs.includes(itemSlug)) {
        return {
            success: true,
            message: 'این محصول قبلاً در کتابخانه شما فعال شده است.',
            nextState: state,
        };
    }
    if (itemType === 'course' && state.enrolledCourseSlugs.includes(itemSlug)) {
        return {
            success: true,
            message: 'شما قبلاً در این دوره ثبت‌نام کرده‌اید.',
            nextState: state,
        };
    }
    if (state.userProfile.walletBalance < price) {
        return {
            success: false,
            message: 'موجودی کیف پول کافی نیست؛ ابتدا کیف پول خود را شارژ کنید.',
            nextState: state,
        };
    }
    const invCode = `INV-404-${Math.floor(100 + Math.random() * 899)}`;
    const newOrder: WalletOrderItem = {
        id: invCode,
        title: itemTitle,
        category: itemType === 'course' ? 'دوره VIP' : 'فروشگاه',
        invoiceCode: invCode,
        date: 'هم‌اکنون · پرداخت از کیف پول رشد',
        amount: price,
        status: 'paid',
    };
    const nextState: DynamicAppState = {
        ...state,
        userProfile: {
            ...state.userProfile,
            walletBalance: state.userProfile.walletBalance - price,
            xp: state.userProfile.xp + 100,
        },
        walletOrders: [newOrder, ...state.walletOrders],
        ownedProductSlugs:
            itemType === 'product'
                ? [...state.ownedProductSlugs, itemSlug]
                : state.ownedProductSlugs,
        enrolledCourseSlugs:
            itemType === 'course'
                ? [...state.enrolledCourseSlugs, itemSlug]
                : state.enrolledCourseSlugs,
    };
    return {
        success: true,
        message: `«${itemTitle}» با موفقیت از کیف پول خریداری و فعال شد (+۱۰۰ امتیاز رشد).`,
        nextState,
    };
}

// Client + Server Sync Hook
const STORAGE_KEY = 'roshd_unified_app_state_v1';
const SYNC_EVENT = 'roshd-unified-state-sync';

export function loadDynamicAppState(): DynamicAppState {
    const fallback = createInitialDynamicAppState();
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return {
            ...fallback,
            ...parsed,
            userProfile: { ...fallback.userProfile, ...(parsed.userProfile || {}) },
            notifSettings: { ...fallback.notifSettings, ...(parsed.notifSettings || {}) },
            vipConfig: { ...fallback.vipConfig, ...(parsed.vipConfig || {}) },
            courses: Array.isArray(parsed.courses) && parsed.courses.length > 0 ? parsed.courses : fallback.courses,
            vipFeatures: Array.isArray(parsed.vipFeatures) && parsed.vipFeatures.length > 0 ? parsed.vipFeatures : fallback.vipFeatures,
            vipSessions: Array.isArray(parsed.vipSessions) && parsed.vipSessions.length > 0 ? parsed.vipSessions : fallback.vipSessions,
            vipStudents: Array.isArray(parsed.vipStudents) && parsed.vipStudents.length > 0 ? parsed.vipStudents : fallback.vipStudents,
            featureToggles: { ...fallback.featureToggles, ...(parsed.featureToggles || {}) },
        };
    } catch {
        return fallback;
    }
}

export function saveDynamicAppState(next: DynamicAppState, syncServer = true): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
        if (syncServer) {
            fetch('/api/app-state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(next),
            }).catch(() => {});
        }
    } catch {}
}

export function useDynamicAppStore() {
    const [appState, setAppStateInternal] = useState<DynamicAppState>(() =>
        loadDynamicAppState()
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Fetch latest server state on mount if localStorage wasn't initialized yet
        const hasLocal = Boolean(window.localStorage.getItem(STORAGE_KEY));
        if (!hasLocal) {
            fetch('/api/app-state')
                .then((r) => (r.ok ? r.json() : null))
                .then((data) => {
                    if (data && data.userProfile) {
                        const fallback = createInitialDynamicAppState();
                        const merged: DynamicAppState = {
                            ...fallback,
                            ...data,
                            userProfile: { ...fallback.userProfile, ...(data.userProfile || {}) },
                            notifSettings: { ...fallback.notifSettings, ...(data.notifSettings || {}) },
                            vipConfig: { ...fallback.vipConfig, ...(data.vipConfig || {}) },
                            featureToggles: { ...fallback.featureToggles, ...(data.featureToggles || {}) },
                        };
                        setAppStateInternal(merged);
                        saveDynamicAppState(merged, false);
                    }
                })
                .catch(() => {});
        }

        const handleSync = (e: Event) => {
            const custom = e as CustomEvent<DynamicAppState>;
            if (custom.detail) {
                setAppStateInternal(custom.detail);
            } else {
                setAppStateInternal(loadDynamicAppState());
            }
        };

        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setAppStateInternal(loadDynamicAppState());
            }
        };

        window.addEventListener(SYNC_EVENT, handleSync);
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener(SYNC_EVENT, handleSync);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    const updateAppState = useCallback(
        (updater: DynamicAppState | ((prev: DynamicAppState) => DynamicAppState)) => {
            setAppStateInternal((prev) => {
                const next = typeof updater === 'function' ? updater(prev) : updater;
                saveDynamicAppState(next, true);
                return next;
            });
        },
        []
    );

    return { appState, updateAppState };
}
