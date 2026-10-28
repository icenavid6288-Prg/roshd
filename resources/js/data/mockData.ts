export interface MockDataPayload {
    courses: any[];
    services: any[];
    testimonials: any[];
    posts: any[];
    books: any[];
    podcast?: any;
    auth: {
        user: any;
    };
    flash: {
        success?: string | null;
        error?: string | null;
    };
    [key: string]: any;
}

export const mockCourses = [
    {
        id: 1,
        title: 'طراحی مسیر آینده و کشف رسالت فردی نوجوانان',
        slug: 'future-path-design',
        summary: 'دوره جامع استعدادیابی، مهارت‌آموزی و انتخاب رشته هوشمندانه بر اساس الگوهای نوین جهانی',
        description: 'این دوره به نوجوانان کمک می‌کند نقاط قوت، علایق واقعی و مهارت‌های مورد نیاز آینده را بشناسند و بهترین مسیر تحصیلی و شغلی را انتخاب کنند.',
        price: 2850000,
        original_price: 3600000,
        thumbnail: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        level: 'مقدماتی تا پیشرفته',
        duration: '۲۴ ساعت',
        duration_minutes: 1440,
        students_count: 342,
        rating: 4.9,
        reviews_count: 89,
        is_featured: true,
        is_published: true,
        category: { id: 1, name: 'استعدادیابی و هدایت تحصیلی', slug: 'talent-guidance' },
        instructor: {
            id: 1,
            name: 'دکتر علیرضا بیدی',
            title: 'مشاور ارشد تحصیلی و مدرس توسعه فردی',
            avatar: '/images/brand-logo.png',
            user: { name: 'دکتر علیرضا بیدی' }
        },
        modules: [
            {
                id: 1,
                title: 'فصل ۱: خودشناسی و هوش‌های چندگانه',
                lessons: [
                    { id: 101, title: 'آشنایی با مدل گاردنر و تست MBTI', duration: '۴۵ دقیقه', is_free: true },
                    { id: 102, title: 'تحلیل تیپ شخصیتی و مهارت‌های پنهان', duration: '۵۰ دقیقه', is_free: false },
                ]
            },
            {
                id: 2,
                title: 'فصل ۲: تحلیل بازار کار و مشاغل آینده',
                lessons: [
                    { id: 201, title: 'مشاغل پرتقاضای دهه آینده و هوش مصنوعی', duration: '۶۰ دقیقه', is_free: false },
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'کارگاه کوچینگ و مهارت‌های ارتباط موثر نوجوان',
        slug: 'teen-communication-skills',
        summary: 'تقویت فن بیان، اعتماد به نفس و هوش هیجانی (EQ) در روابط با خانواده و همسالان',
        description: 'کارگاه عملی با تمرین‌های تعاملی برای تقویت مهارت‌های کلامی، حل تعارض و مدیریت هیجانات.',
        price: 1950000,
        original_price: 2400000,
        thumbnail: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        level: 'متوسط',
        duration: '۱۶ ساعت',
        duration_minutes: 960,
        students_count: 215,
        rating: 4.8,
        reviews_count: 64,
        is_featured: true,
        is_published: true,
        category: { id: 2, name: 'توسعه فردی و کوچینگ', slug: 'coaching' },
        instructor: {
            id: 1,
            name: 'دکتر علیرضا بیدی',
            title: 'مشاور ارشد تحصیلی و مدرس توسعه فردی',
            avatar: '/images/brand-logo.png',
            user: { name: 'دکتر علیرضا بیدی' }
        }
    },
    {
        id: 3,
        title: 'مبانی کارآفرینی و سواد مالی برای نسل نو',
        slug: 'teen-entrepreneurship-finance',
        summary: 'یادگیری ارزش‌آفرینی، مدیریت بودجه، تفکر نقادانه و راه‌اندازی اولین پروژه‌های درآمدزا',
        description: 'آشنایی کاربردی با درآمد، پس‌انداز، سرمایه‌گذاری و تفکر کارآفرینانه از دوران نوجوانی.',
        price: 2200000,
        original_price: 2800000,
        thumbnail: '/images/brand-logo.png',
        image: '/images/brand-logo.png',
        level: 'مقدماتی',
        duration: '۲۰ ساعت',
        duration_minutes: 1200,
        students_count: 180,
        rating: 4.95,
        reviews_count: 42,
        is_featured: true,
        is_published: true,
        category: { id: 3, name: 'کارآفرینی و سواد مالی', slug: 'entrepreneurship' },
        instructor: {
            id: 2,
            name: 'مهندس حسینی',
            title: 'مربی کسب‌وکار و کارآفرین',
            avatar: '/images/brand-logo.png',
            user: { name: 'مهندس حسینی' }
        }
    }
];

export const mockServices = [
    {
        id: 1,
        title: 'مشاوره اختصاصی هدایت تحصیلی و شغلی',
        slug: 'academic-counseling',
        summary: 'جلسه تحلیل فردی با حضور مشاور ارشد مرکز جهت بررسی کارنامه، آزمون‌های استعداد و ترسیم نقشه راه تحصیلی.',
        icon: 'Compass',
        price: 850000,
        features: ['تحلیل کارنامه و آزمون‌ها', 'برنامه مدون ۶ ماهه', 'جلسه مشترک با والدین', 'پشتیبانی یک‌ماهه']
    },
    {
        id: 2,
        title: 'بسته جامع استعدادیابی چندبعدی',
        slug: 'talent-assessment',
        summary: 'ارزیابی علمی شامل تست‌های استاندارد هوش، علایق شغلی هالند و تحلیل شخصیت با گزارش تحلیلی کامل.',
        icon: 'Target',
        price: 1400000,
        features: ['تست آنلاین استاندارد', 'گزارش ۲۰ صفحه‌ای مکتوب', 'جلسه ۹۰ دقیقه‌ای تحلیل نتایج']
    },
    {
        id: 3,
        title: 'کوچینگ فردی رشد و توسعه فردی',
        slug: 'personal-coaching',
        summary: 'همراهی گام‌به‌گام برای رفع اهمال‌کاری، افزایش تمرکز در مطالعه و تقویت انگیزه تحصیلی.',
        icon: 'Sparkles',
        price: 950000,
        features: ['جلسات هفتگی منظم', 'پایش روزانه تکالیف', 'تکنیک‌های مدیریت زمان']
    }
];

export const mockTestimonials = [
    {
        id: 1,
        name: 'سارا محمدی',
        role: 'دانش‌آموز پایه دهم - رشته تجربی',
        content: 'با راهنمایی‌های دکتر بیدی توانستم بدون سردرگمی بین ریاضی و تجربی بهترین تصمیم را بر اساس استعداد واقعی‌ام بگیرم.',
        rating: 5
    },
    {
        id: 2,
        name: 'مهندس رضایی',
        role: 'ولی دانش‌آموز',
        content: 'رویکرد علمی مرکز و کارگاه‌های مشترک والدین به درک بهتر چالش‌های پسرم کمک بسیار بزرگی کرد. بی‌نهایت سپاسگزارم.',
        rating: 5
    },
    {
        id: 3,
        name: 'علی احمدی',
        role: 'دانش‌آموز دوره کارآفرینی',
        content: 'دوره سواد مالی دید من را نسبت به آینده تغییر داد و توانستم اولین پروژه کارآفرینی مدرسه‌ام را آغاز کنم.',
        rating: 5
    }
];

export const mockPosts = [
    {
        id: 1,
        title: 'چگونه استعدادهای واقعی نوجوانان را کشف و هدایت کنیم؟',
        slug: 'how-to-discover-teen-talents',
        summary: 'راهنمای کاربردی برای والدین و مربیان پیرامون نشانه‌های هوش‌های چندگانه و نحوه حمایت سازنده.',
        published_at: '۱۴۰۳/۰۸/۰۱',
        reading_time: '۷ دقیقه',
        image: '/images/brand-logo.png',
        author: { name: 'دکتر علیرضا بیدی' }
    },
    {
        id: 2,
        title: '۱۰ مهارت کلیدی که مدارس به دانش‌آموزان یاد نمی‌دهند',
        slug: 'ten-skills-schools-miss',
        summary: 'از سواد مالی تا حل مسئله و مذاکره؛ مهارت‌هایی که آینده شغلی نسل جدید را شکل می‌دهند.',
        published_at: '۱۴۰۳/۰۷/۲۴',
        reading_time: '۵ دقیقه',
        image: '/images/brand-logo.png',
        author: { name: 'تیم پژوهش مرکز' }
    },
    {
        id: 3,
        title: 'مدیریت استرس امتحان و روش‌های افزایش تمرکز',
        slug: 'exam-stress-management',
        summary: 'تکنیک‌های علمی پومودورو، فاصله‌گذاری مطالعه و آمادگی روانی برای آزمون‌های مهم.',
        published_at: '۱۴۰۳/۰۷/۱۵',
        reading_time: '۶ دقیقه',
        image: '/images/brand-logo.png',
        author: { name: 'دکتر علیرضا بیدی' }
    }
];

export const mockBooks = [
    {
        id: 1,
        title: 'کتاب راهنمای قطب‌نمای آینده نوجوان',
        slug: 'teen-future-compass-book',
        price: 240000,
        type: 'book',
        cover_image: '/images/brand-logo.png',
        summary: 'راهنمای گام‌به‌گام تمرین‌های خودشناسی، استعدادیابی و هدف‌گذاری برای نوجوانان و جوانان.'
    },
    {
        id: 2,
        title: 'دفترچه تمرین سواد مالی و کارآفرینی نوجوان',
        slug: 'teen-finance-workbook',
        price: 180000,
        type: 'book',
        cover_image: '/images/brand-logo.png',
        summary: 'ورک‌بوک عملیاتی شامل جدول بودجه‌بندی، طرح ایده و راه‌اندازی کسب‌وکار نوپا.'
    }
];

export const mockUser = {
    id: 1,
    name: 'کاربر آزمایشی',
    phone: '09123456789',
    email: 'user@markazbidi.ir',
    role: 'student',
    created_at: '1403/01/01'
};

export function getMockPageData(component: string, url: string): MockDataPayload {
    const base: MockDataPayload = {
        auth: { user: mockUser },
        flash: { success: null, error: null },
        siteName: 'مرکز رشد و کارآفرینی دکتر بیدی',
        courses: mockCourses,
        services: mockServices,
        testimonials: mockTestimonials,
        posts: mockPosts,
        books: mockBooks,
        stats: {
            students: 1250,
            courses: 14,
            coaches: 8,
            satisfaction: 98
        }
    };

    if (component === 'Home') {
        return {
            ...base,
            featuredCourses: mockCourses,
            podcast: {
                id: 1,
                title: 'پادکست رادیو مسیر آینده',
                episodes: [
                    { id: 1, title: 'قسمت ۱: چرا اکثر افراد در شغل اشتباه هستند؟', duration: '۲۵:۰۰' },
                    { id: 2, title: 'قسمت ۲: راز انتخاب رشته موفق بدون پشیمانی', duration: '۳۰:۰۰' }
                ]
            }
        };
    }

    if (component.startsWith('Courses/')) {
        return {
            ...base,
            courses: { data: mockCourses, links: [] },
            course: mockCourses[0],
            categories: [
                { id: 1, name: 'همه دسته‌ها', slug: 'all' },
                { id: 2, name: 'استعدادیابی', slug: 'talent' },
                { id: 3, name: 'توسعه فردی', slug: 'coaching' },
                { id: 4, name: 'سواد مالی', slug: 'finance' }
            ],
            filters: { category: null, search: '' }
        };
    }

    if (component.startsWith('Shop/')) {
        return {
            ...base,
            products: { data: mockBooks, links: [] },
            product: mockBooks[0]
        };
    }

    if (component.startsWith('Dashboard')) {
        return {
            ...base,
            user: mockUser,
            enrollments: mockCourses.slice(0, 2),
            orders: [
                { id: 101, code: 'ORD-9821', total: 2850000, status: 'completed', date: '۱۴۰۳/۰۸/۱۰' }
            ],
            certificates: [
                { id: 1, title: 'گواهی پایان دوره طراحی مسیر آینده', date: '۱۴۰۳/۰۷/۱۵', code: 'CERT-BID-2024-08' }
            ],
            notifications: [
                { id: 1, title: 'وبینار رفع اشکال استعدادیابی', created_at: 'امروز', read: false }
            ]
        };
    }

    return base;
}
