export interface MockDataPayload {
    courses: any[];
    services: any[];
    testimonials: any[];
    posts: any[];
    books: any[];
    podcast: any | null;
    stats: any;
    site: any;
    menus: any;
    seo: any;
    auth: {
        user: any;
    };
    flash: {
        success?: string | null;
        error?: string | null;
    };
    pageContent?: any;
    liveWebinar?: any;
    [key: string]: any;
}

export const mockSite = {
    name: 'مرکز رشد و کارآفرینی دکتر بیدی',
    slogan: 'طراحی مسیر آینده و کشف رسالت فردی نوجوانان',
    logo: '/images/brand-logo.png',
    popup: {
        enabled: false,
        title: 'مسیر رشد فرزندتان را آگاهانه شروع کنید',
        message: 'در یک جلسه مشاوره رایگان، اولین قدم مسیر رشد نوجوانتان را با همراهی متخصصان بردارید.',
        cta_label: 'رزرو مشاوره رایگان',
        cta_url: '/contact',
        delay_seconds: 4,
        frequency: 'session',
    },
    contact: {
        address: 'تهران، خیابان ولیعصر، تقاطع فاطمی، پلاک ۱۲، واحد ۴',
        phone: '021-88889999',
        email: 'info@markazbidi.ir',
        eitaa: '@markazbidi',
        website: 'https://markazbidi.ir',
        working_hours: 'شنبه تا چهارشنبه ۹ الی ۱۸ - پنج‌شنبه ۹ الی ۱۴',
    },
    social: {
        instagram: 'https://instagram.com/dr_bidi',
        eitaa: 'https://eitaa.com/dr_bidi',
    },
    enamad: {
        enabled: false,
        title: 'نماد اعتماد الکترونیکی',
        image_url: '',
        link_url: '',
    },
    hero: {
        title: 'مسیر آینده‌ات کجاست؟ طراحی مسیر رشد و استعدادیابی نوجوانان',
        subtitle: 'با متدهای علمی استعدادیابی، کوچینگ و آموزش مهارت‌های کاربردی آینده',
        cta_primary: 'مشاهده دوره‌ها و استعدادیابی',
        cta_secondary: 'مشاوره رایگان',
        background: '',
    },
};

export const mockMenus = {
    header: [
        { title: 'خانه', url: '/', children: [] },
        { title: 'دوره‌ها', url: '/courses', children: [] },
        { title: 'کوچینگ', url: '/coaching', children: [] },
        { title: 'خدمات', url: '/services', children: [] },
        {
            title: 'فروشگاه',
            url: '/shop',
            children: [
                { title: 'کتاب‌ها', url: '/shop?type=book', children: [] },
                { title: 'پادکست', url: '/shop?type=podcast', children: [] },
            ],
        },
        { title: 'بلاگ', url: '/blog', children: [] },
        { title: 'درباره ما', url: '/about', children: [] },
        { title: 'تیم ما', url: '/team', children: [] },
        { title: 'تماس با ما', url: '/contact', children: [] },
    ],
    footer: [
        { title: 'دوره‌ها', url: '/courses', children: [] },
        { title: 'کوچینگ', url: '/coaching', children: [] },
        { title: 'خدمات', url: '/services', children: [] },
        { title: 'فروشگاه', url: '/shop', children: [] },
        { title: 'بلاگ', url: '/blog', children: [] },
        { title: 'درباره ما', url: '/about', children: [] },
        { title: 'تماس با ما', url: '/contact', children: [] },
    ],
};

export const mockStats = [
    { value: 1250, suffix: '+', label: 'دانش‌آموز و مراجع موفق' },
    { value: 14, suffix: '', label: 'دوره تخصصی و کارگاه' },
    { value: 8, suffix: ' نفر', label: 'کوچ و مشاور ارشد' },
    { value: 98, suffix: '٪', label: 'رضایت والدین و دانش‌آموزان' },
];

export const mockCourses = [
    {
        id: 1,
        title: 'طراحی مسیر آینده و کشف رسالت فردی نوجوانان',
        subtitle: 'جامع‌ترین دوره هدایت تحصیلی و شغلی',
        slug: 'future-path-design',
        summary: 'دوره جامع استعدادیابی، مهارت‌آموزی و انتخاب رشته هوشمندانه بر اساس الگوهای نوین جهانی',
        description: 'این دوره به نوجوانان کمک می‌کند نقاط قوت، علایق واقعی و مهارت‌های مورد نیاز آینده را بشناسند.',
        price: 2850000,
        discount_price: 2450000,
        thumbnail: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        level: 'beginner',
        duration_minutes: 1440,
        students_count: 342,
        rating_avg: 4.9,
        progress_percent: 60,
        is_in_person: false,
        category: { id: 1, name: 'استعدادیابی و هدایت تحصیلی', slug: 'talent-guidance' },
        instructor: {
            id: 1,
            user: { name: 'دکتر علیرضا بیدی' },
        },
        modules: [
            {
                id: 1,
                title: 'فصل ۱: خودشناسی و هوش‌های چندگانه',
                lessons: [
                    { id: 101, title: 'آشنایی با مدل گاردنر و تست MBTI', duration: '۴۵ دقیقه', is_free: true },
                    { id: 102, title: 'تحلیل تیپ شخصیتی و مهارت‌های پنهان', duration: '۵۰ دقیقه', is_free: false },
                ],
            },
        ],
    },
    {
        id: 2,
        title: 'کارگاه کوچینگ و مهارت‌های ارتباط موثر نوجوان',
        subtitle: 'فن بیان، اعتماد به نفس و هوش هیجانی',
        slug: 'teen-communication-skills',
        summary: 'تقویت فن بیان، اعتماد به نفس و هوش هیجانی (EQ) در روابط با خانواده و همسالان',
        description: 'کارگاه عملی با تمرین‌های تعاملی برای تقویت مهارت‌های کلامی، حل تعارض و مدیریت هیجانات.',
        price: 1950000,
        discount_price: null,
        thumbnail: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        level: 'intermediate',
        duration_minutes: 960,
        students_count: 215,
        rating_avg: 4.8,
        progress_percent: 0,
        is_in_person: true,
        category: { id: 2, name: 'توسعه فردی و کوچینگ', slug: 'coaching' },
        instructor: {
            id: 1,
            user: { name: 'دکتر علیرضا بیدی' },
        },
    },
    {
        id: 3,
        title: 'مبانی کارآفرینی و سواد مالی برای نسل نو',
        subtitle: 'از ایده تا اولین کسب‌وکار',
        slug: 'teen-entrepreneurship-finance',
        summary: 'یادگیری ارزش‌آفرینی، مدیریت بودجه، تفکر نقادانه و راه‌اندازی اولین پروژه‌های درآمدزا',
        description: 'آشنایی کاربردی با درآمد، پس‌انداز، سرمایه‌گذاری و تفکر کارآفرینانه از دوران نوجوانی.',
        price: 2200000,
        discount_price: 1850000,
        thumbnail: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        level: 'beginner',
        duration_minutes: 1200,
        students_count: 180,
        rating_avg: 4.95,
        progress_percent: 0,
        is_in_person: false,
        category: { id: 3, name: 'کارآفرینی و سواد مالی', slug: 'entrepreneurship' },
        instructor: {
            id: 2,
            user: { name: 'مهندس حسینی' },
        },
    },
];

export const mockServices = [
    {
        id: 1,
        title: 'مشاوره اختصاصی هدایت تحصیلی و شغلی',
        slug: 'academic-counseling',
        summary: 'جلسه تحلیل فردی با حضور مشاور ارشد مرکز جهت بررسی کارنامه، آزمون‌های استعداد و ترسیم نقشه راه تحصیلی.',
        icon: 'Compass',
        price: 850000,
        features: ['تحلیل کارنامه و آزمون‌ها', 'برنامه مدون ۶ ماهه', 'جلسه مشترک با والدین', 'پشتیبانی یک‌ماهه'],
    },
    {
        id: 2,
        title: 'بسته جامع استعدادیابی چندبعدی',
        slug: 'talent-assessment',
        summary: 'ارزیابی علمی شامل تست‌های استاندارد هوش، علایق شغلی هالند و تحلیل شخصیت با گزارش تحلیلی کامل.',
        icon: 'Target',
        price: 1400000,
        features: ['تست آنلاین استاندارد', 'گزارش ۲۰ صفحه‌ای مکتوب', 'جلسه ۹۰ دقیقه‌ای تحلیل نتایج'],
    },
    {
        id: 3,
        title: 'کوچینگ فردی رشد و توسعه فردی',
        slug: 'personal-coaching',
        summary: 'همراهی گام‌به‌گام برای رفع اهمال‌کاری، افزایش تمرکز در مطالعه و تقویت انگیزه تحصیلی.',
        icon: 'Sparkles',
        price: 950000,
        features: ['جلسات هفتگی منظم', 'پایش روزانه تکالیف', 'تکنیک‌های مدیریت زمان'],
    },
];

export const mockTestimonials = [
    {
        id: 1,
        name: 'سارا محمدی',
        role: 'دانش‌آموز پایه دهم - رشته تجربی',
        content: 'با راهنمایی‌های دکتر بیدی توانستم بدون سردرگمی بین ریاضی و تجربی بهترین تصمیم را بر اساس استعداد واقعی‌ام بگیرم.',
        rating: 5,
    },
    {
        id: 2,
        name: 'مهندس رضایی',
        role: 'ولی دانش‌آموز',
        content: 'رویکرد علمی مرکز و کارگاه‌های مشترک والدین به درک بهتر چالش‌های پسرم کمک بسیار بزرگی کرد. بی‌نهایت سپاسگزارم.',
        rating: 5,
    },
    {
        id: 3,
        name: 'علی احمدی',
        role: 'دانش‌آموز دوره کارآفرینی',
        content: 'دوره سواد مالی دید من را نسبت به آینده تغییر داد و توانستم اولین پروژه کارآفرینی مدرسه‌ام را آغاز کنم.',
        rating: 5,
    },
];

export const mockPosts = [
    {
        id: 1,
        title: 'چگونه استعدادهای واقعی نوجوانان را کشف و هدایت کنیم؟',
        slug: 'how-to-discover-teen-talents',
        summary: 'راهنمای کاربردی برای والدین و مربیان پیرامون نشانه‌های هوش‌های چندگانه و نحوه حمایت سازنده.',
        excerpt: 'راهنمای کاربردی برای والدین و مربیان پیرامون نشانه‌های هوش‌های چندگانه و نحوه حمایت سازنده.',
        published_at: '2024-10-22',
        reading_time: 7,
        cover_image: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        author: { name: 'دکتر علیرضا بیدی' },
    },
    {
        id: 2,
        title: '۱۰ مهارت کلیدی که مدارس به دانش‌آموزان یاد نمی‌دهند',
        slug: 'ten-skills-schools-miss',
        summary: 'از سواد مالی تا حل مسئله و مذاکره؛ مهارت‌هایی که آینده شغلی نسل جدید را شکل می‌دهند.',
        excerpt: 'از سواد مالی تا حل مسئله و مذاکره؛ مهارت‌هایی که آینده شغلی نسل جدید را شکل می‌دهند.',
        published_at: '۱۴۰۳/۰۷/۲۴',
        reading_time: 5,
        cover_image: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        author: { name: 'تیم پژوهش مرکز' },
    },
    {
        id: 3,
        title: 'مدیریت استرس امتحان و روش‌های افزایش تمرکز',
        slug: 'exam-stress-management',
        summary: 'تکنیک‌های علمی پومودورو، فاصله‌گذاری مطالعه و آمادگی روانی برای آزمون‌های مهم.',
        excerpt: 'تکنیک‌های علمی پومودورو، فاصله‌گذاری مطالعه و آمادگی روانی برای آزمون‌های مهم.',
        published_at: '۱۴۰۳/۰۷/۱۵',
        reading_time: 6,
        cover_image: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        author: { name: 'دکتر علیرضا بیدی' },
    },
];

export const mockBooks = [
    {
        id: 1,
        title: 'کتاب راهنمای قطب‌نمای آینده نوجوان',
        slug: 'teen-future-compass-book',
        price: 240000,
        discount_price: 210000,
        type: 'book',
        image: '/images/brand-logo.png',
        author: 'دکتر علیرضا بیدی',
        pages: 180,
        summary: 'راهنمای گام‌به‌گام تمرین‌های خودشناسی، استعدادیابی و هدف‌گذاری برای نوجوانان و جوانان.',
        description: 'راهنمای گام‌به‌گام تمرین‌های خودشناسی، استعدادیابی و هدف‌گذاری برای نوجوانان و جوانان.',
    },
    {
        id: 2,
        title: 'دفترچه تمرین سواد مالی و کارآفرینی نوجوان',
        slug: 'teen-finance-workbook',
        price: 180000,
        discount_price: null,
        type: 'book',
        image: '/images/brand-logo.png',
        author: 'مهندس حسینی',
        pages: 120,
        summary: 'ورک‌بوک عملیاتی شامل جدول بودجه‌بندی، طرح ایده و راه‌اندازی کسب‌وکار نوپا.',
        description: 'ورک‌بوک عملیاتی شامل جدول بودجه‌بندی، طرح ایده و راه‌اندازی کسب‌وکار نوپا.',
    },
];

export const mockPodcast = {
    id: 1,
    title: 'پادکست رادیو مسیر آینده',
    slug: 'future-path-podcast',
    type: 'podcast',
    image: '/images/brand-logo.png',
    price: 0,
    author: 'مرکز رشد دکتر بیدی',
    episodes: [
        { id: 1, title: 'قسمت ۱: چرا اکثر افراد در شغل اشتباه هستند؟', duration_seconds: 1500, is_free: true },
        { id: 2, title: 'قسمت ۲: راز انتخاب رشته موفق بدون پشیمانی', duration_seconds: 1800, is_free: true },
    ],
};

export const mockAdminUser = {
    id: 1,
    name: 'دکتر علیرضا بیدی',
    phone: '09123456789',
    email: 'admin@markazbidi.ir',
    avatar: '/images/brand-logo.png',
    roles: ['super-admin', 'admin'],
    permissions: [
        'manage all',
        'view settings',
        'view users',
        'view leads',
        'view courses',
        'view orders',
        'view tickets',
        'view instagram',
        'view eitaa',
        'view certificates',
        'view coaching',
        'view roles',
        'view marketing',
        'view students',
    ],
    unread_notifications: 3,
    enrollments_count: 5,
    orders_count: 8,
    is_active: true,
    created_at: '2023-01-15',
};

export const mockUser = {
    id: 2,
    name: 'کاربر آزمایشی',
    phone: '09123456789',
    email: 'user@markazbidi.ir',
    avatar: '/images/brand-logo.png',
    roles: ['student'],
    permissions: [],
    unread_notifications: 0,
    enrollments_count: 2,
    orders_count: 1,
    is_active: true,
    created_at: '2024-05-10',
};

export function getMockPageData(component: string, url: string): MockDataPayload {
    const base: MockDataPayload = {
        site: mockSite,
        menus: mockMenus,
        stats: mockStats,
        courses: mockCourses,
        services: mockServices,
        testimonials: mockTestimonials,
        posts: mockPosts,
        books: mockBooks,
        podcast: mockPodcast,
        auth: { user: mockUser },
        flash: { success: null, error: null },
        pageContent: { fields: {} },
        liveWebinar: null,
        seo: {
            title: 'مرکز رشد و کارآفرینی دکتر بیدی',
            description: 'طراحی مسیر آینده و کشف رسالت فردی نوجوانان',
            canonical: typeof window !== 'undefined' ? window.location.href : '/',
            schema: {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'مرکز رشد و کارآفرینی دکتر بیدی',
            },
        },
    };

    if (component === 'Home') {
        return {
            ...base,
            featuredCourses: mockCourses,
        };
    }

    if (component.startsWith('About/')) {
        return {
            ...base,
            founder: {
                name: 'دکتر علیرضا بیدی',
                role: 'موسس و مدیر مرکز',
                specialty: 'هدایت تحصیلی و استعدادیابی',
                bio: 'بیش از ۱۵ سال سابقه مشاوره تخصصی و تدریس مهارت‌های آینده',
                experience_years: 15,
                rating: 5,
                avatar: '/images/brand-logo.png',
            },
            instructors: [
                {
                    id: 1,
                    name: 'دکتر علیرضا بیدی',
                    role: 'مدرس ارشد',
                    specialty: 'استعدادیابی و هدایت تحصیلی',
                    bio: 'مدرس دوره‌های توسعه فردی و هدایت تحصیلی',
                    experience_years: 15,
                    avatar: '/images/brand-logo.png',
                    is_featured: true,
                },
                {
                    id: 2,
                    name: 'مهندس حسینی',
                    role: 'مدرس کارآفرینی',
                    specialty: 'سواد مالی و کسب‌وکار',
                    bio: 'مربی کسب‌وکارهای نوپا',
                    experience_years: 10,
                    avatar: '/images/brand-logo.png',
                    is_featured: true,
                },
            ],
            coaches: [
                {
                    id: 1,
                    name: 'دکتر علیرضا بیدی',
                    role: 'کوچ ارشد',
                    specialty: 'کوچینگ استعدادیابی',
                    experience_years: 15,
                    rating: 5,
                    avatar: '/images/brand-logo.png',
                    is_featured: true,
                },
            ],
            course_count: 14,
        };
    }

    if (component.startsWith('Courses/')) {
        return {
            ...base,
            courses: {
                data: mockCourses,
                links: [],
                current_page: 1,
                last_page: 1,
                per_page: 12,
                total: mockCourses.length,
            },
            course: mockCourses[0],
            categories: [
                { id: 1, name: 'همه دسته‌ها', slug: 'all' },
                { id: 2, name: 'استعدادیابی و هدایت تحصیلی', slug: 'talent-guidance' },
                { id: 3, name: 'توسعه فردی و کوچینگ', slug: 'coaching' },
                { id: 4, name: 'کارآفرینی و سواد مالی', slug: 'entrepreneurship' },
            ],
            filters: { category: '', search: '', sort: 'latest' },
        };
    }

    if (component.startsWith('Shop/')) {
        return {
            ...base,
            products: {
                data: mockBooks,
                links: [],
                current_page: 1,
                last_page: 1,
                per_page: 12,
                total: mockBooks.length,
            },
            featured: mockBooks,
            product: mockBooks[0],
            categories: [
                { id: 1, name: 'کتاب‌ها', slug: 'book' },
                { id: 2, name: 'پادکست‌ها', slug: 'podcast' },
            ],
            filters: { q: '', type: '', category: '', sort: 'latest' },
        };
    }

    if (component.startsWith('Blog/')) {
        return {
            ...base,
            posts: {
                data: mockPosts,
                links: [],
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: mockPosts.length,
            },
            featured: mockPosts[0],
            categories: [
                { id: 1, name: 'استعدادیابی', slug: 'talent' },
                { id: 2, name: 'توسعه فردی', slug: 'growth' },
            ],
            filters: { q: '', category: '', sort: 'latest' },
        };
    }

    if (component.startsWith('Dashboard')) {
        const dashboardCourses = [
            {
                id: 1,
                title: 'طراحی مسیر آینده و کشف رسالت فردی نوجوانان',
                slug: 'future-path-design',
                thumbnail: '/images/brand-logo.png',
                duration_minutes: 1440,
                progress_percent: 60,
                status: 'active',
            },
        ];
        const dashboardSessions = [
            {
                id: 1,
                scheduled_at: 'پنج‌شنبه ۱۷ آبان ساعت ۱۶:۰۰',
                duration_minutes: 60,
                status: 'confirmed',
                coach: 'دکتر علیرضا بیدی',
            },
        ];
        const dashboardGoals = [
            {
                id: 1,
                title: 'تکمیل آزمون استعدادیابی گاردنر',
                status: 'completed',
                total_tasks: 4,
                completed_tasks: 4,
            },
        ];
        const dashboardOrders = [
            {
                id: 101,
                order_number: 'ORD-9821',
                status: 'paid',
                total: 2850000,
                created_at: '۱۴۰۳/۰۸/۱۰',
                items_count: 1,
            },
        ];
        const dashboardCertificates = [
            {
                id: 1,
                certificate_number: 'CERT-BID-2024-08',
                issued_at: '۱۴۰۳/۰۷/۱۵',
                course: { id: 1, title: 'طراحی مسیر آینده' },
                url: '#',
            },
        ];
        const dashboardAssignments = [
            {
                id: 1,
                title: 'تمرین تحلیل ارزش‌های فردی',
                course: 'طراحی مسیر آینده',
                status: 'submitted',
                score: 95,
                max_score: 100,
                feedback: 'تحلیل دقیق و جامعی ارائه کردید.',
            },
        ];

        return {
            ...base,
            onboarding_incomplete: false,
            profile: { name: 'کاربر آزمایشی', role: 'student', avatar: '/images/brand-logo.png' },
            stats: {
                courses_count: 1,
                average_progress: 60,
                active_goals: 1,
                upcoming_sessions: 1,
            },
            courses: dashboardCourses,
            sessions: dashboardSessions,
            goals: dashboardGoals,
            orders: dashboardOrders,
            certificates: dashboardCertificates,
            assignments: dashboardAssignments,
            assignment_stats: { pending: 0, graded: 1, average_score: 95 },
            recommendations: [],
            user: mockUser,
            enrollments: mockCourses.slice(0, 1),
            notifications: [
                { id: 1, title: 'وبینار رفع اشکال استعدادیابی', created_at: 'امروز', read: false },
            ],
        };
    }

    if (component.startsWith('Admin/')) {
        const adminBase = {
            ...base,
            auth: { user: mockAdminUser },
        };

        if (component === 'Admin/Dashboard') {
            return {
                ...adminBase,
                stats: {
                    users: 1420,
                    students: 1180,
                    instructors: 12,
                    coaches: 8,
                    courses: 14,
                    products: 6,
                    leads: 285,
                    sessions: 94,
                    revenue: 148500000,
                    orders: 312,
                    activeUsers: 840,
                    newLeads: 24,
                },
                revenueSeries: [
                    { date: 'فروردین', value: 8500000 },
                    { date: 'اردیبهشت', value: 12000000 },
                    { date: 'خرداد', value: 16500000 },
                    { date: 'تیر', value: 21000000 },
                    { date: 'مرداد', value: 28000000 },
                    { date: 'شهریور', value: 34500000 },
                    { date: 'مهر', value: 28000000 },
                ],
                registrationsSeries: [
                    { date: 'فروردین', value: 45 },
                    { date: 'اردیبهشت', value: 72 },
                    { date: 'خرداد', value: 98 },
                    { date: 'تیر', value: 130 },
                    { date: 'مرداد', value: 165 },
                    { date: 'شهریور', value: 210 },
                    { date: 'مهر', value: 185 },
                ],
                leadFunnel: [
                    { status: 'new', count: 95 },
                    { status: 'contacted', count: 70 },
                    { status: 'consultation', count: 48 },
                    { status: 'registered', count: 32 },
                    { status: 'customer', count: 28 },
                ],
            };
        }

        if (component.includes('Courses')) {
            return {
                ...adminBase,
                courses: {
                    data: mockCourses,
                    links: [],
                    total: mockCourses.length,
                },
                filters: { search: '', status: '' },
            };
        }

        if (component.includes('Users')) {
            return {
                ...adminBase,
                users: {
                    data: [mockAdminUser, mockUser],
                    links: [],
                    total: 2,
                },
                filters: { search: '', role: '', status: '' },
                roleOptions: ['super-admin', 'admin', 'instructor', 'coach', 'student', 'parent'],
                summary: { total: 2, active: 2, staff: 1, blocked: 0 },
            };
        }

        if (component.includes('Crm')) {
            return {
                ...adminBase,
                stats: {
                    total: 285,
                    new_this_week: 24,
                    customers: 28,
                    registered: 32,
                    linked: 48,
                    conversion_rate: 18,
                    registration_rate: 12,
                    to_customer_rate: 10,
                },
                funnel: [
                    { key: 'new', count: 95, percent_of_total: 100, conversion_from_previous: null },
                    { key: 'contacted', count: 70, percent_of_total: 73, conversion_from_previous: 73 },
                    { key: 'consultation', count: 48, percent_of_total: 50, conversion_from_previous: 68 },
                    { key: 'registered', count: 32, percent_of_total: 33, conversion_from_previous: 66 },
                    { key: 'customer', count: 28, percent_of_total: 29, conversion_from_previous: 87 },
                ],
                campaigns: [],
                attention: { stale: [], follow_up: [], consultation: [] },
                trend: [
                    { label: 'شنبه', new: 12, customers: 3 },
                    { label: 'یکشنبه', new: 15, customers: 4 },
                    { label: 'دوشنبه', new: 18, customers: 5 },
                    { label: 'سه‌شنبه', new: 14, customers: 6 },
                    { label: 'چهارشنبه', new: 22, customers: 8 },
                ],
                trend_totals: { new: 81, customers: 26 },
                activities: [],
            };
        }

        if (component.includes('AuditLogs')) {
            return {
                ...adminBase,
                logs: {
                    data: [
                        {
                            id: 1,
                            action: 'ویرایش مشخصات کاربر',
                            route: '/admin/users/2',
                            method: 'PUT',
                            ip_address: '192.168.1.45',
                            status: 200,
                            created_at: '2025-02-20T10:15:00Z',
                            user: { name: 'دکتر علیرضا بیدی', phone: '09123456789' },
                        },
                        {
                            id: 2,
                            action: 'ثبت دوره آموزشی جدید',
                            route: '/admin/courses',
                            method: 'POST',
                            ip_address: '192.168.1.45',
                            status: 201,
                            created_at: '2025-02-19T14:30:00Z',
                            user: { name: 'دکتر علیرضا بیدی', phone: '09123456789' },
                        },
                        {
                            id: 3,
                            action: 'تغییر وضعیت سرنخ به مشاوره',
                            route: '/admin/content/leads/4',
                            method: 'PATCH',
                            ip_address: '192.168.1.12',
                            status: 200,
                            created_at: '2025-02-18T18:05:00Z',
                            user: { name: 'دکتر علیرضا بیدی', phone: '09123456789' },
                        },
                    ],
                    links: [],
                    total: 3,
                },
                filters: { search: '' },
            };
        }

        if (component.includes('Leads')) {
            return {
                ...adminBase,
                leads: {
                    data: [
                        {
                            id: 1,
                            name: 'سارا رضایی',
                            phone: '09129876543',
                            email: 'sara@example.com',
                            need: 'هدایت تحصیلی نهم به دهم',
                            child_age: '۱۵',
                            grade: 'نهم',
                            service_type: 'استعدادیابی',
                            source: 'instagram',
                            status: 'new',
                            created_at: '۱۴۰۳/۱۱/۳۰',
                            lead_score: 85,
                            lead_score_breakdown: { source: 25, onboarding: 20, pricing: 20, age: 20 },
                            user: null,
                            activities: [
                                { id: 1, type: 'registration', description: 'ثبت فرم اولیه درخواست استعدادیابی', created_at: '۱۴۰۳/۱۱/۳۰' },
                            ],
                        },
                        {
                            id: 2,
                            name: 'محمد حسینی',
                            phone: '09351234567',
                            email: 'mohammad@example.com',
                            need: 'کوچینگ اعتماد به نفس و انگیزه فردی',
                            child_age: '۱۷',
                            grade: 'یازدهم',
                            service_type: 'کوچینگ فردی',
                            source: 'website',
                            status: 'consultation',
                            created_at: '۱۴۰۳/۱۱/۲۸',
                            lead_score: 92,
                            lead_score_breakdown: { source: 30, onboarding: 25, pricing: 20, age: 17 },
                            user: null,
                            activities: [
                                { id: 2, type: 'call', description: 'تماس اولیه و هماهنگی جلسه ارزیابی', created_at: '۱۴۰۳/۱۱/۲۸' },
                            ],
                        },
                    ],
                    links: [],
                    total: 2,
                },
                stats: {
                    total: 285,
                    new: 24,
                    contacted: 70,
                    interested: 45,
                    consultation: 48,
                    registered: 32,
                    customers: 28,
                    linked: 48,
                },
                filters: { search: '', status: '', sort: 'score' },
                canUpdate: true,
                canDelete: true,
                conversionFunnel: [
                    { key: 'visits', label: 'بازدید لندینگ', hint: 'ترافیک کل', count: 1200, percent_of_first: 100, conversion_from_previous: 100, overall: 2.3 },
                    { key: 'leads', label: 'سرنخ‌های ثبت‌شده', hint: 'فرم اولیه', count: 285, percent_of_first: 24, conversion_from_previous: 24 },
                    { key: 'registrations', label: 'جلسه مشاوره', hint: 'تعیین وقت', count: 48, percent_of_first: 4, conversion_from_previous: 17 },
                    { key: 'purchases', label: 'ثبت‌نام نهایی', hint: 'خرید دوره/کوچینگ', count: 28, percent_of_first: 2, conversion_from_previous: 58 },
                ],
                funnelRange: 30,
            };
        }

        if (component.includes('Reports')) {
            return {
                ...adminBase,
                summary: {
                    orders: 312,
                    paid_orders: 298,
                    refunded_orders: 4,
                    pending_refunds: 0,
                    revenue: 148500000,
                    refunded_amount: 5400000,
                    enrollments: 420,
                    sessions: 94,
                    users: 1420,
                },
                exports: [
                    { key: 'orders', title: 'سفارش‌ها', href: '#' },
                    { key: 'users', title: 'کاربران', href: '#' },
                    { key: 'leads', title: 'سرنخ‌ها', href: '#' },
                ],
                pending_refunds: [],
            };
        }

        if (component.includes('Marketing')) {
            return {
                ...adminBase,
                campaigns: {
                    data: [
                        {
                            id: 1,
                            name: 'اطلاع‌رسانی وبینار استعدادیابی',
                            channel: 'sms',
                            trigger: 'manual',
                            audience: 'leads',
                            message: 'سلام {name} عزیز، وبینار رایگان استعدادیابی دکتر بیدی فردا ساعت ۱۸ برگزار می‌شود.',
                            status: 'active',
                            total_recipients: 285,
                            sent_count: 285,
                            failed_count: 0,
                        },
                    ],
                    links: [],
                    total: 1,
                },
                stats: { total: 6, active: 4, running: 1, sent: 1240, runs: 18 },
                audienceCounts: { all_users: 1420, leads: 285, students: 1180, parents: 240, customers: 312, inactive_users: 150 },
                options: {
                    channels: { sms: 'پیامک', email: 'ایمیل', in_app: 'داخل پنل' },
                    triggers: { manual: 'اجرای دستی', lead_created: 'ثبت لید جدید', course_purchased: 'خرید دوره', inactive_user: 'کاربر غیرفعال' },
                    audiences: { all_users: 'همه کاربران', leads: 'لیدها', students: 'دانش‌آموزان', parents: 'والدین', customers: 'مشتریان', inactive_users: 'کاربران غیرفعال' },
                    statuses: { draft: 'پیش‌نویس', active: 'فعال', paused: 'متوقف', running: 'در حال اجرا' },
                },
            };
        }

        if (component.includes('Access')) {
            return {
                ...adminBase,
                roles: [
                    { id: 1, name: 'super-admin', label: 'مدیر ارشد', description: 'دسترسی کامل به تمامی بخش‌های سامانه', users_count: 1, permissions: ['manage all'] },
                    { id: 2, name: 'admin', label: 'مدیر اجرایی', description: 'مدیریت عملیات و پشتیبانی', users_count: 2, permissions: ['view users', 'view courses'] },
                ],
                permissionGroups: {
                    users: [{ id: 1, name: 'view users', label: 'مشاهده کاربران' }, { id: 2, name: 'create users', label: 'ایجاد کاربر' }],
                    courses: [{ id: 3, name: 'view courses', label: 'مشاهده دوره‌ها' }],
                },
                userOptions: [{ id: 1, name: 'دکتر علیرضا بیدی', email: 'admin@markazbidi.ir' }],
                canUpdate: true,
            };
        }

        if (component.includes('Instagram')) {
            return {
                ...adminBase,
                conversations: { data: [], links: [], total: 0 },
                filters: {},
                stats: { total: 0, open: 0, unread: 0, messages: 0, configured: false },
            };
        }

        if (component.includes('Eitaa')) {
            return {
                ...adminBase,
                stats: { total_messages: 1420, sent_today: 85, active_bots: 2, campaigns: 3 },
                bots: [],
                campaigns: [],
                conversations: [],
                logs: [],
            };
        }

        if (component.includes('Content')) {
            return {
                ...adminBase,
                resource: 'products',
                resourceTitle: 'محصولات و سفارش‌ها',
                singularTitle: 'محصول',
                fields: [
                    { name: 'title', label: 'عنوان', type: 'text' },
                    { name: 'price', label: 'قیمت', type: 'number' },
                    { name: 'status', label: 'وضعیت', type: 'select' },
                ],
                items: {
                    data: [
                        { id: 1, title: 'کتاب جامع طراحی مسیر آینده نوجوانان', price: 295000, status: 'published' },
                        { id: 2, title: 'ورک‌بوک عملیاتی کشف رسالت فردی', price: 180000, status: 'published' },
                    ],
                    links: [],
                    total: 2,
                },
                filters: { search: '' },
                filterFields: [],
                canCreate: true,
                canUpdate: true,
                canDelete: true,
            };
        }

        if (component.includes('Settings')) {
            return {
                ...adminBase,
                settings: [
                    { key: 'site_name', value: 'مرکز رشد و کارآفرینی دکتر بیدی' },
                    { key: 'site_slogan', value: 'طراحی مسیر آینده و کشف رسالت فردی نوجوانان' },
                    { key: 'phone', value: '021-88889999' },
                    { key: 'address', value: 'تهران، خیابان ولیعصر، تقاطع فاطمی' },
                    { key: 'email', value: 'info@markazbidi.ir' },
                    { key: 'eitaa', value: '@markazbidi' },
                    { key: 'payment_enabled', value: '1' },
                    { key: 'payment_gateway', value: 'zarinpal' },
                ],
            };
        }

        return adminBase;
    }

    return base;
}
