import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import type {
    CertificatePayload,
    CoachingSessionPayload,
    CoursePayload,
    DashboardData,
    GoalPayload,
    HomeData,
    LearningData,
    LessonNotePayload,
    Paginated,
    ProductPayload,
    ReminderSettingsPayload,
    SupportTicketPayload,
    UserPayload,
} from './types';

// Default base URL — override via EXPO_PUBLIC_API_URL at build time or from the
// in-app Settings screen (stored in AsyncStorage).
const DEFAULT_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'markaz_auth_token';
const BASE_URL_KEY = 'markaz_api_base_url';
const OFFLINE_STATE_KEY = 'markaz_offline_demo_state_v1';

let cachedToken: string | null | undefined;
let cachedBaseUrl: string | null | undefined;

export async function getBaseUrl(): Promise<string> {
    if (cachedBaseUrl === undefined) {
        cachedBaseUrl = (await AsyncStorage.getItem(BASE_URL_KEY)) || DEFAULT_BASE_URL;
    }
    return cachedBaseUrl.replace(/\/+$/, '');
}

export async function setBaseUrl(url: string): Promise<void> {
    const clean = url.trim().replace(/\/+$/, '');
    cachedBaseUrl = clean || DEFAULT_BASE_URL;
    await AsyncStorage.setItem(BASE_URL_KEY, cachedBaseUrl);
}

export async function getToken(): Promise<string | null> {
    if (cachedToken === undefined) {
        cachedToken = (await AsyncStorage.getItem(TOKEN_KEY)) || 'demo-mobile-token';
    }
    return cachedToken;
}

export async function setToken(token: string | null): Promise<void> {
    cachedToken = token;
    if (token) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
        await AsyncStorage.removeItem(TOKEN_KEY);
    }
}

export class ApiError extends Error {
    status: number;
    details?: unknown;
    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, unknown>;
    query?: Record<string, string | number | undefined>;
    auth?: boolean;
}

// ============================================================================
// Rich Persian Offline / Demo Fallback Data & State
// ============================================================================
const DEMO_COURSES: CoursePayload[] = [
    {
        id: 1,
        slug: 'strategic-leadership-mastery',
        title: 'رهبری استراتژیک و معماری کسب‌وکار',
        subtitle: 'نقشه راه عملیاتی ساخت سازمان‌های مقیاس‌پذیر و تیم‌های پیشرو',
        summary: 'در این دوره جامع، چارچوب‌های تصمیم‌گیری استراتژیک، سیستم‌سازی و رهبری تیم‌های چابک را گام‌به‌گام پیاده‌سازی می‌کنید.',
        description:
            'این دوره حاصل بیش از ۱۵ سال تجربه اجرایی و کوچینگ مدیران ارشد در مرکز رشد دکتر بیدی است. در طول ۶ سرفصل کاربردی، از طراحی مدل کسب‌وکار تا مدیریت بحران و ساخت فرهنگ سازمانی نتیجه‌گرا را با کارگاه‌های عملی تجربه خواهید کرد.',
        category: 'رهبری و مدیریت',
        delivery_mode: 'آنلاین + کارگاه عملی',
        level: 'پیشرفته',
        duration: '۲۴ ساعت',
        lessons_count: 18,
        students_count: 1420,
        price: 4800000,
        discount_price: 3650000,
        is_free: false,
        is_featured: true,
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
        rating: 4.9,
        instructor: {
            id: 1,
            name: 'دکتر محمد بیدی',
            title: 'مؤسس مرکز رشد و کوچ ارشد کسب‌وکار',
            bio: 'مشاور استراتژیک مدیران عامل و مدرس دوره‌های رهبری و تحول سازمانی.',
        },
        modules: [
            {
                id: 101,
                title: 'فصل اول: ذهنیت رهبر استراتژیک',
                lessons: [
                    {
                        id: 1001,
                        title: 'تفاوت مدیریت اجرایی و رهبری استراتژیک در عمل',
                        duration: '۲۸ دقیقه',
                        is_free: true,
                        description: 'بررسی ۵ تله ذهنی مدیران در رشد کسب‌وکار و نحوه عبور از روزمرگی.',
                    },
                    {
                        id: 1002,
                        title: 'طراحی قطب‌نمای استراتژیک و OKRهای فصلی',
                        duration: '۳۵ دقیقه',
                        is_free: false,
                        description: 'نحوه تبدیل چشم‌انداز ۳ ساله به اهداف قابل اندازه‌گیری ۹۰ روزه.',
                    },
                    {
                        id: 1003,
                        title: 'معماری تصمیم‌گیری در شرایط عدم قطعیت',
                        duration: '۴۲ دقیقه',
                        is_free: false,
                        description: 'ماتریس تحلیل ریسک و تصمیم‌گیری سریع برای مدیران ارشد.',
                    },
                ],
            },
            {
                id: 102,
                title: 'فصل دوم: تیم‌سازی و تفویض اختیار هوشمند',
                lessons: [
                    {
                        id: 1004,
                        title: 'جذب و نگهداشت استعدادهای کلیدی (A-Players)',
                        duration: '۳۲ دقیقه',
                        is_free: false,
                        description: 'چارچوب مصاحبه ساختاریافته و ارزیابی تناسب فرهنگی.',
                    },
                    {
                        id: 1005,
                        title: 'سیستم تفویض اختیار ۵ سطحی بدون افت کیفیت',
                        duration: '۳۸ دقیقه',
                        is_free: false,
                        description: 'چگونه مسئولیت‌ها را واگذار کنیم و گزارش‌گیری دقیق داشته باشیم.',
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        slug: 'entrepreneurship-launchpad',
        title: 'کارگاه جامع راه‌اندازی و مقیاس‌پذیری استارتاپ',
        subtitle: 'از اعتبارسنجی ایده و ساخت MVP تا جذب مشتری و سرمایه‌گذار',
        summary: 'مسیر صفر تا صد کارآفرینی با کمترین خطا و بیشترین بازدهی مالی در بازار ایران.',
        description:
            'اگر ایده‌ای برای راه‌اندازی کسب‌وکار دارید یا کسب‌وکار فعلی شما به سقف درآمدی خورده است، در این دوره با متدولوژی ناب (Lean) محصول خود را اعتبارسنجی و موتور فروش آن را روشن می‌کنید.',
        category: 'کارآفرینی',
        delivery_mode: 'آنلاین تعاملی',
        level: 'متوسط',
        duration: '۱۸ ساعت',
        lessons_count: 14,
        students_count: 980,
        price: 3400000,
        discount_price: 2750000,
        is_free: false,
        is_featured: true,
        thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
        rating: 4.8,
        instructor: {
            id: 1,
            name: 'دکتر محمد بیدی',
            title: 'مؤسس مرکز رشد و کوچ ارشد کسب‌وکار',
        },
        modules: [
            {
                id: 201,
                title: 'فصل اول: اعتبارسنجی بازار و کشف مسئله',
                lessons: [
                    {
                        id: 2001,
                        title: 'تست مامان و مصاحبه عمیق با مشتریان هدف',
                        duration: '۲۵ دقیقه',
                        is_free: true,
                        description: 'چطور بفهمیم مشتریان واقعاً حاضرند برای راه‌حل ما پول بپردازند؟',
                    },
                    {
                        id: 2002,
                        title: 'طراحی بوم ناب و ارزش پیشنهادی متمایز',
                        duration: '۳۴ دقیقه',
                        is_free: false,
                        description: 'تکمیل گام‌به‌گام بوم کسب‌وکار روی ۳ مطالعه موردی واقعی.',
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        slug: 'executive-coaching-fundamentals',
        title: 'اصول کوچینگ فردی و رشد بهره‌وری مدیران',
        subtitle: 'مدیریت انرژی، تمرکز عمیق و غلبه بر اهمال‌کاری استراتژیک',
        summary: 'ساخت عادت‌های طلایی عملکرد بالا برای کارآفرینان و متخصصان پرمشغله.',
        description:
            'در این دوره یاد می‌گیرید چگونه بدون فرسودگی شغلی، خروجی روزانه خود را دو برابر کنید و تعادل پایداری بین رشد حرفه‌ای و آرامش فردی بسازید.',
        category: 'توسعه فردی',
        delivery_mode: 'ویدیویی + کاربرگ',
        level: 'مقدماتی تا پیشرفته',
        duration: '۱۲ ساعت',
        lessons_count: 10,
        students_count: 2150,
        price: 1950000,
        discount_price: 1490000,
        is_free: false,
        is_featured: true,
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        rating: 4.9,
        instructor: {
            id: 2,
            name: 'سارا شریفی',
            title: 'کوچ توسعه فردی و بهره‌وری',
        },
        modules: [
            {
                id: 301,
                title: 'فصل اول: مهندسی تمرکز و زمان',
                lessons: [
                    {
                        id: 3001,
                        title: 'بلوک‌بندی زمان به روش Deep Work',
                        duration: '۲۲ دقیقه',
                        is_free: true,
                        description: 'حذف عوامل حواس‌پرتی و طراحی تقویم هفتگی ایده‌آل.',
                    },
                    {
                        id: 3002,
                        title: 'مدیریت انرژی چهارگانه (جسمی، ذهنی، هیجانی، معنایی)',
                        duration: '۳۰ دقیقه',
                        is_free: false,
                        description: 'چرا مدیریت انرژی مهم‌تر از مدیریت زمان است؟',
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        slug: 'negotiation-and-b2b-sales',
        title: 'مهارت‌های مذاکره حرفه‌ای و فروش سازمانی (B2B)',
        subtitle: 'تکنیک‌های روانشناسی اقناع، مدیریت اعتراض و بستن قراردادهای کلان',
        summary: 'افزایش نرخ تبدیل جلسات فروش و مذاکرات تجاری با چارچوب برد-برد.',
        description:
            'آموزش سناریوهای واقعی مذاکره، قیمت‌گذاری ارزشی و نحوه تعامل با تصمیم‌گیرندگان سازمانی.',
        category: 'فروش و مذاکره',
        delivery_mode: 'آنلاین + ایفای نقش',
        level: 'پیشرفته',
        duration: '۱۶ ساعت',
        lessons_count: 12,
        students_count: 840,
        price: 2900000,
        discount_price: 2350000,
        is_free: false,
        is_featured: false,
        thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
        rating: 4.7,
        instructor: {
            id: 1,
            name: 'دکتر محمد بیدی',
            title: 'مؤسس مرکز رشد و کوچ ارشد کسب‌وکار',
        },
    },
];

const DEMO_PRODUCTS: ProductPayload[] = [
    {
        id: 1,
        slug: 'strategic-mindset-book',
        title: 'کتاب معمار استراتژی: راهنمای عملی رهبران فردا',
        author: 'دکتر محمد بیدی',
        type: 'book',
        category: 'کتاب چاپی',
        price: 420000,
        discount_price: 345000,
        stock: 25,
        is_digital: false,
        is_featured: true,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
        description:
            'کتابی کاربردی شامل ۴۰ ابزار و بوم تصمیم‌گیری برای مدیران و کارآفرینانی که می‌خواهند کسب‌وکار خود را از وابستگی به شخص رها کنند.',
        pages: 312,
        publisher: 'انتشارات مرکز رشد',
        isbn: '978-622-00-1234-5',
        rating: 4.9,
    },
    {
        id: 2,
        slug: 'okr-planner-toolkit',
        title: 'جعبه ابزار و پلنر ۹۰ روزه برنامه‌ریزی استراتژیک (OKR)',
        author: 'تیم علمی مرکز رشد',
        type: 'toolkit',
        category: 'ابزار برنامه‌ریزی',
        price: 680000,
        discount_price: 550000,
        stock: 18,
        is_digital: false,
        is_featured: true,
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=700&q=80',
        description:
            'پلنر فیزیکی لوکس به همراه چک‌لیست‌های ارزیابی هفتگی، بوم هدف‌گذاری فصلی و راهنمای پیاده‌سازی OKR برای مدیران و تیم‌ها.',
        pages: 196,
        publisher: 'مرکز رشد دکتر بیدی',
        rating: 4.8,
    },
    {
        id: 3,
        slug: 'startup-financial-templates',
        title: 'پکیج مدل‌های مالی و ارزش‌گذاری استارتاپ (اکسل + راهنما)',
        author: 'دکتر محمد بیدی',
        type: 'digital',
        category: 'محصول دیجیتال',
        price: 890000,
        discount_price: 690000,
        stock: 999,
        is_digital: true,
        is_featured: true,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80',
        description:
            'شامل ۱۲ فایل اکسل فرمول‌نویسی‌شده برای پیش‌بینی جریان نقدینگی، محاسبه CAC/LTV، نقطه سربه‌سر و ارائه به سرمایه‌گذار.',
        publisher: 'مرکز رشد دکتر بیدی',
        rating: 4.9,
    },
    {
        id: 4,
        slug: 'coaching-cards-deck',
        title: 'کارت‌های پرسشگری کوچینگ (۷۵ کارت گفتگو و خودآگاهی)',
        author: 'سارا شریفی',
        type: 'toolkit',
        category: 'ابزار برنامه‌ریزی',
        price: 490000,
        discount_price: 390000,
        stock: 14,
        is_digital: false,
        is_featured: false,
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80',
        description:
            'مجموعه‌ای از ۷۵ پرسش عمیق و تحول‌آفرین برای جلسات کوچینگ فردی، جلسات بازخورد تیمی و ژورنال‌نویسی روزانه.',
        publisher: 'مرکز رشد دکتر بیدی',
        rating: 4.7,
    },
];

interface OfflineDemoState {
    user: UserPayload;
    completedLessons: Record<string, number[]>;
    lessonNotes: Record<string, LessonNotePayload[]>;
    reminders: ReminderSettingsPayload;
    sessions: CoachingSessionPayload[];
    goals: GoalPayload[];
    certificates: CertificatePayload[];
    tickets: SupportTicketPayload[];
}

const DEFAULT_OFFLINE_STATE: OfflineDemoState = {
    user: {
        id: 1,
        name: 'امیرحسین رضایی',
        email: 'amir@markazbidi.ir',
        phone: '09123456789',
        city: 'تهران',
        job_title: 'بنیان‌گذار و مدیر محصول',
        bio: 'علاقه‌مند به رهبری استراتژیک، سیستم‌سازی و رشد پایدار کسب‌وکار.',
        referral_code: 'BIDI-AMIR78',
    },
    completedLessons: {
        'strategic-leadership-mastery': [1001, 1002],
        'entrepreneurship-launchpad': [2001],
    },
    lessonNotes: {
        'strategic-leadership-mastery': [
            {
                id: 1,
                lesson_id: 1001,
                lesson_title: 'تفاوت مدیریت اجرایی و رهبری استراتژیک در عمل',
                content: 'نکته کلیدی: حداقل ۳۰٪ از زمان هفتگی باید روی کارهای استراتژیک غیرفوری اما مهم متمرکز شود.',
                created_at: '۱۴۰۴/۰۲/۱۰ - ساعت ۱۸:۳۰',
            },
        ],
    },
    reminders: {
        enabled: true,
        incomplete_courses: true,
        course_frequency: 'daily',
        course_preferred_time: '20:00',
        coaching_sessions: true,
        session_lead_times: ['24h', '1h'],
        channels: {
            push: true,
            sms: true,
            telegram: true,
            email: false,
        },
        quiet_hours_enabled: true,
        quiet_hours_start: '23:00',
        quiet_hours_end: '08:00',
        recent_logs: [
            {
                id: 1,
                title: 'یادآوری ادامه دوره «رهبری استراتژیک» (درس ۳)',
                channel: 'پوش نوتیفیکیشن + تلگرام',
                sent_at: 'امروز ساعت ۲۰:۰۰',
                status: 'delivered',
            },
            {
                id: 2,
                title: 'یادآوری جلسه کوچینگ فردا با دکتر محمد بیدی',
                channel: 'پیامک + پوش نوتیفیکیشن',
                sent_at: 'دیروز ساعت ۱۷:۰۰',
                status: 'delivered',
            },
        ],
    },
    sessions: [
        {
            id: 1,
            title: 'جلسه کوچینگ استراتژی رشد و OKR فصلی',
            coach_name: 'دکتر محمد بیدی',
            coach_title: 'کوچ ارشد کسب‌وکار و استراتژی',
            date_label: 'سه‌شنبه ۲۳ اردیبهشت ۱۴۰۴',
            time_label: 'ساعت ۱۷:۰۰ تا ۱۸:۰۰',
            duration_minutes: 60,
            status: 'upcoming',
            meeting_url: 'https://meet.google.com/abc-defg-hij',
            notes: 'لطفاً فایل پیش‌نویس اهداف سه ماهه دوم را قبل از جلسه آماده داشته باشید.',
        },
        {
            id: 2,
            title: 'بررسی گلوگاه‌های تیم فروش و تفویض اختیار',
            coach_name: 'سارا شریفی',
            coach_title: 'کوچ بهره‌وری و توسعه فردی',
            date_label: 'چهارشنبه ۱۰ اردیبهشت ۱۴۰۴',
            time_label: 'ساعت ۱۶:۰۰ تا ۱۷:۰۰',
            duration_minutes: 60,
            status: 'completed',
            notes: 'چک‌لیست مصاحبه و شرح وظایف مدیر فروش نهایی شد.',
        },
    ],
    goals: [
        {
            id: 1,
            title: 'تکمیل ۱۰۰٪ دوره رهبری استراتژیک و پیاده‌سازی OKR',
            category: 'آموزش و مهارت',
            target_date: '۱۴۰۴/۰۳/۱۵',
            progress: 68,
            completed: false,
        },
        {
            id: 2,
            title: 'تدوین چارت سازمانی جدید و تفویض ۳ فرآیند اجرایی',
            category: 'سیستم‌سازی',
            target_date: '۱۴۰۴/۰۳/۳۰',
            progress: 45,
            completed: false,
        },
        {
            id: 3,
            title: 'مطالعه کامل کتاب معمار استراتژی و خلاصه‌نویسی',
            category: 'مطالعه فردی',
            target_date: '۱۴۰۴/۰۲/۰۵',
            progress: 100,
            completed: true,
        },
    ],
    certificates: [
        {
            id: 1,
            code: 'CERT-BIDI-1404-892',
            course_title: 'اصول کوچینگ فردی و رشد بهره‌وری مدیران',
            issued_at: '۱۴۰۴/۰۱/۲۸',
            grade: 'عالی (۹۶ از ۱۰۰)',
            download_url: '/verify?code=CERT-BIDI-1404-892',
        },
    ],
    tickets: [
        {
            id: 104,
            subject: 'درخواست فایل کاربرگ قابل ویرایش فصل دوم دوره رهبری',
            department: 'پشتیبانی آموزشی',
            status: 'answered',
            updated_at: '۲ ساعت پیش',
            last_message: 'سلام امیرحسین عزیز، فایل اکسل و PDF قابل ویرایش به بخش پیوست‌های درس اضافه شد.',
        },
    ],
};

async function getOfflineState(): Promise<OfflineDemoState> {
    try {
        const raw = await AsyncStorage.getItem(OFFLINE_STATE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_OFFLINE_STATE, ...parsed };
        }
    } catch {
        // Fallback to default
    }
    return DEFAULT_OFFLINE_STATE;
}

async function saveOfflineState(state: OfflineDemoState): Promise<void> {
    try {
        await AsyncStorage.setItem(OFFLINE_STATE_KEY, JSON.stringify(state));
    } catch {
        // Ignore storage write errors
    }
}

async function resolveOfflineApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const state = await getOfflineState();
    const cleanPath = path.replace(/\?.*$/, '');
    const method = options.method || 'GET';

    // Auth endpoints
    if (cleanPath === '/api/v1/auth/login' && method === 'POST') {
        const identifier = String(options.body?.identifier || state.user.email);
        const updatedUser: UserPayload = {
            ...state.user,
            email: identifier.includes('@') ? identifier : state.user.email,
            phone: !identifier.includes('@') ? identifier : state.user.phone,
        };
        state.user = updatedUser;
        await saveOfflineState(state);
        return { token: 'demo-mobile-token', user: updatedUser } as unknown as T;
    }

    if (cleanPath === '/api/v1/auth/register' && method === 'POST') {
        const updatedUser: UserPayload = {
            ...state.user,
            name: String(options.body?.name || state.user.name),
            email: String(options.body?.email || state.user.email),
            phone: String(options.body?.phone || state.user.phone),
        };
        state.user = updatedUser;
        await saveOfflineState(state);
        return { token: 'demo-mobile-token', user: updatedUser } as unknown as T;
    }

    if (cleanPath === '/api/v1/auth/logout') {
        return { ok: true } as unknown as T;
    }

    if (cleanPath === '/api/v1/auth/me') {
        if (method === 'PUT' || method === 'POST') {
            state.user = {
                ...state.user,
                name: String(options.body?.name ?? state.user.name),
                phone: String(options.body?.phone ?? state.user.phone),
                city: String(options.body?.city ?? state.user.city),
                job_title: String(options.body?.job_title ?? state.user.job_title),
                bio: String(options.body?.bio ?? state.user.bio),
            };
            await saveOfflineState(state);
        }
        return state.user as unknown as T;
    }

    // Home endpoint
    if (cleanPath === '/api/v1/home') {
        const homeData: HomeData = {
            site: {
                name: 'مرکز رشد و کارآفرینی دکتر بیدی',
                tagline: 'همراه استراتژیک مدیران، کارآفرینان و رهبران کسب‌وکار',
                hero_title: 'مسیر رشد استراتژیک کسب‌وکار و مهارت‌های رهبری شما',
                hero_subtitle:
                    'با دوره‌های اجرایی، جلسات کوچینگ اختصاصی و سیستم یادآوری هوشمند، برنامه‌های رشد فردی و سازمانی خود را به نتیجه برسانید.',
                phone: '۰۲۱-۲۸۴۲۱۲۳۴',
                email: 'info@markazbidi.ir',
            },
            stats: [
                { id: 1, label: 'دانش‌پذیر و مدیر فعال', value: '+۴,۸۰۰' },
                { id: 2, label: 'ساعت کوچینگ تخصصی', value: '+۳,۲۰۰' },
                { id: 3, label: 'نرخ تکمیل دوره‌ها', value: '۸۹٪' },
            ],
            featured_courses: DEMO_COURSES.slice(0, 3),
            featured_products: DEMO_PRODUCTS.slice(0, 4),
            testimonials: [
                {
                    id: 1,
                    name: 'مهندس کاوه تهرانی',
                    role: 'مدیرعامل شرکت فین‌تک پیشرو',
                    content:
                        'پیاده‌سازی سیستم OKR و تفویض اختیار که در دوره رهبری استراتژیک یاد گرفتم، باعث شد در ۶ ماه گذشته درگیری اجرایی من نصف شود و فروش تیم ۴۰٪ رشد کند.',
                    rating: 5,
                },
                {
                    id: 2,
                    name: 'دکتر نازنین فرهمند',
                    role: 'بنیان‌گذار استارتاپ سلامت دیجیتال',
                    content:
                        'یادآوری‌های هوشمند و جلسات کوچینگ منظم مرکز رشد باعث شد برخلاف دوره‌های قبلی، این بار تمام تمرین‌ها را تا انتها انجام دهم.',
                    rating: 5,
                },
            ],
            continue_lesson: {
                course_slug: 'strategic-leadership-mastery',
                course_title: 'رهبری استراتژیک و معماری کسب‌وکار',
                lesson_id: 1003,
                lesson_title: 'معماری تصمیم‌گیری در شرایط عدم قطعیت',
                progress: 68,
                remaining_minutes: 18,
            },
        };
        return homeData as unknown as T;
    }

    // Courses list & detail
    if (cleanPath === '/api/v1/courses') {
        const q = String(options.query?.q || '').trim();
        const category = String(options.query?.category || '').trim();
        let filtered = [...DEMO_COURSES];
        if (q) {
            filtered = filtered.filter(
                (c) =>
                    c.title.includes(q) ||
                    (c.subtitle && c.subtitle.includes(q)) ||
                    (c.category && c.category.includes(q)),
            );
        }
        if (category && category !== 'همه') {
            filtered = filtered.filter((c) => c.category === category);
        }
        const paginated: Paginated<CoursePayload> = {
            data: filtered,
            current_page: 1,
            last_page: 1,
            per_page: 12,
            total: filtered.length,
        };
        return paginated as unknown as T;
    }

    if (cleanPath.startsWith('/api/v1/courses/')) {
        const slug = cleanPath.replace('/api/v1/courses/', '');
        const found = DEMO_COURSES.find((c) => c.slug === slug) || DEMO_COURSES[0];
        return found as unknown as T;
    }

    // Products list & detail
    if (cleanPath === '/api/v1/products') {
        const q = String(options.query?.q || '').trim();
        const category = String(options.query?.category || '').trim();
        let filtered = [...DEMO_PRODUCTS];
        if (q) {
            filtered = filtered.filter(
                (p) =>
                    p.title.includes(q) ||
                    (p.author && p.author.includes(q)) ||
                    (p.category && p.category.includes(q)),
            );
        }
        if (category && category !== 'همه') {
            filtered = filtered.filter((p) => p.category === category);
        }
        const paginated: Paginated<ProductPayload> = {
            data: filtered,
            current_page: 1,
            last_page: 1,
            per_page: 12,
            total: filtered.length,
        };
        return paginated as unknown as T;
    }

    if (cleanPath.startsWith('/api/v1/products/')) {
        const slug = cleanPath.replace('/api/v1/products/', '');
        const found = DEMO_PRODUCTS.find((p) => p.slug === slug) || DEMO_PRODUCTS[0];
        return found as unknown as T;
    }

    // Dashboard
    if (cleanPath === '/api/v1/dashboard') {
        const dashboardData: DashboardData = {
            user: state.user,
            stats: {
                enrolled_count: 3,
                completed_count: 1,
                in_progress_count: 2,
                orders_count: 2,
                certificates_count: state.certificates.length,
            },
            gamification: {
                streak_days: 7,
                xp: 1450,
                level: 4,
                level_title: 'رهبر پیشرو',
                next_level_xp: 2000,
                weekly_goal_minutes: 180,
                weekly_studied_minutes: 135,
            },
            enrollments: [
                {
                    id: 1,
                    progress: 68,
                    enrolled_at: '۱۴۰۴/۰۱/۱۵',
                    course: DEMO_COURSES[0],
                },
                {
                    id: 2,
                    progress: 35,
                    enrolled_at: '۱۴۰۴/۰۲/۰۲',
                    course: DEMO_COURSES[1],
                },
                {
                    id: 3,
                    progress: 100,
                    completed_at: '۱۴۰۴/۰۱/۲۸',
                    enrolled_at: '۱۴۰۳/۱۲/۱۰',
                    course: DEMO_COURSES[2],
                },
            ],
            recent_orders: [
                {
                    id: 101,
                    order_number: 'MB-1404-2891',
                    total: 3650000,
                    status: 'تکمیل شده',
                    payment_status: 'paid',
                    created_at: '۱۴۰۴/۰۱/۱۵',
                    items: [
                        {
                            id: 1,
                            title: 'رهبری استراتژیک و معماری کسب‌وکار',
                            item_type: 'course',
                            quantity: 1,
                            unit_price: 3650000,
                            total_price: 3650000,
                        },
                    ],
                },
                {
                    id: 102,
                    order_number: 'MB-1404-3014',
                    total: 895000,
                    status: 'ارسال شده',
                    payment_status: 'paid',
                    created_at: '۱۴۰۴/۰۲/۰۴',
                    items: [
                        {
                            id: 2,
                            title: 'کتاب معمار استراتژی + پلنر ۹۰ روزه OKR',
                            item_type: 'product',
                            quantity: 2,
                            unit_price: 447500,
                            total_price: 895000,
                        },
                    ],
                },
            ],
        };
        return dashboardData as unknown as T;
    }

    // Learning screen endpoints
    if (cleanPath.startsWith('/api/v1/learning/')) {
        const parts = cleanPath.replace('/api/v1/learning/', '').split('/');
        const slug = parts[0];
        const subAction = parts[1];
        const course = DEMO_COURSES.find((c) => c.slug === slug) || DEMO_COURSES[0];
        const completedIds = state.completedLessons[course.slug] || [];
        const notes = state.lessonNotes[course.slug] || [];

        const totalLessons =
            course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 1;

        if (subAction === 'toggle-lesson' && method === 'POST') {
            const lessonId = Number(options.body?.lesson_id);
            const exists = completedIds.includes(lessonId);
            const nextIds = exists
                ? completedIds.filter((id) => id !== lessonId)
                : [...completedIds, lessonId];
            state.completedLessons[course.slug] = nextIds;
            await saveOfflineState(state);
            const nextProgress = Math.min(100, Math.round((nextIds.length / totalLessons) * 100));
            return {
                completed_lesson_ids: nextIds,
                progress: nextProgress,
            } as unknown as T;
        }

        if (subAction === 'notes' && method === 'POST') {
            const newNote: LessonNotePayload = {
                id: Date.now(),
                lesson_id: Number(options.body?.lesson_id || 1001),
                lesson_title: String(options.body?.lesson_title || 'یادداشت درس'),
                content: String(options.body?.content || ''),
                created_at: 'همین الان',
            };
            const nextNotes = [newNote, ...notes];
            state.lessonNotes[course.slug] = nextNotes;
            await saveOfflineState(state);
            return newNote as unknown as T;
        }

        const progress = Math.min(100, Math.max(20, Math.round((completedIds.length / totalLessons) * 100)));
        const learningData: LearningData = {
            course,
            enrollment: {
                progress,
            },
            completed_lesson_ids: completedIds,
            saved_notes: notes,
        };
        return learningData as unknown as T;
    }

    // Reminders endpoints
    if (cleanPath === '/api/v1/reminders') {
        if (method === 'POST' || method === 'PUT') {
            state.reminders = {
                ...state.reminders,
                ...(options.body as Partial<ReminderSettingsPayload>),
            };
            await saveOfflineState(state);
        }
        return state.reminders as unknown as T;
    }

    if (cleanPath === '/api/v1/reminders/test' && method === 'POST') {
        const activeChannels: string[] = [];
        if (state.reminders.channels.push) activeChannels.push('پوش نوتیفیکیشن');
        if (state.reminders.channels.sms) activeChannels.push('پیامک');
        if (state.reminders.channels.telegram) activeChannels.push('تلگرام');
        if (state.reminders.channels.email) activeChannels.push('ایمیل');

        const newLog = {
            id: Date.now(),
            title: 'یادآوری آزمایشی: ادامه دوره «رهبری استراتژیک» و جلسه کوچینگ پیش‌رو',
            channel: activeChannels.join(' + ') || 'پوش نوتیفیکیشن',
            sent_at: 'همین الان',
            status: 'delivered' as const,
        };
        state.reminders.recent_logs = [newLog, ...state.reminders.recent_logs.slice(0, 7)];
        await saveOfflineState(state);
        return {
            ok: true,
            message: `یادآوری آزمایشی از طریق (${newLog.channel}) با موفقیت ارسال شد.`,
            reminders: state.reminders,
        } as unknown as T;
    }

    // Coaching Sessions endpoints
    if (cleanPath === '/api/v1/sessions') {
        if (method === 'POST') {
            const newSession: CoachingSessionPayload = {
                id: Date.now(),
                title: String(options.body?.title || 'جلسه کوچینگ استراتژیک اختصاصی'),
                coach_name: String(options.body?.coach_name || 'دکتر محمد بیدی'),
                coach_title: 'کوچ ارشد کسب‌وکار',
                date_label: String(options.body?.date_label || 'دوشنبه ۲۹ اردیبهشت ۱۴۰۴'),
                time_label: String(options.body?.time_label || 'ساعت ۱۸:۰۰ تا ۱۹:۰۰'),
                duration_minutes: 60,
                status: 'upcoming',
                meeting_url: 'https://meet.google.com/bidi-growth-session',
                notes: String(options.body?.notes || 'رزرو شده از طریق اپلیکیشن موبایل'),
            };
            state.sessions = [newSession, ...state.sessions];
            await saveOfflineState(state);
        }
        return state.sessions as unknown as T;
    }

    // Goals & Certificates endpoints
    if (cleanPath === '/api/v1/goals') {
        if (method === 'POST') {
            if (options.body?.action === 'toggle') {
                const goalId = Number(options.body?.id);
                state.goals = state.goals.map((g) =>
                    g.id === goalId
                        ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : 50 }
                        : g,
                );
            } else {
                const newGoal: GoalPayload = {
                    id: Date.now(),
                    title: String(options.body?.title || 'هدف جدید رشد فردی'),
                    category: String(options.body?.category || 'آموزش و مهارت'),
                    target_date: String(options.body?.target_date || '۱۴۰۴/۰۴/۳۰'),
                    progress: 15,
                    completed: false,
                };
                state.goals = [newGoal, ...state.goals];
            }
            await saveOfflineState(state);
        }
        return {
            goals: state.goals,
            certificates: state.certificates,
        } as unknown as T;
    }

    // Support Tickets endpoints
    if (cleanPath === '/api/v1/support') {
        if (method === 'POST') {
            const newTicket: SupportTicketPayload = {
                id: Math.floor(105 + Math.random() * 900),
                subject: String(options.body?.subject || 'سؤال درباره دوره'),
                department: String(options.body?.department || 'پشتیبانی آموزشی'),
                status: 'pending',
                updated_at: 'همین الان',
                last_message: String(options.body?.message || ''),
            };
            state.tickets = [newTicket, ...state.tickets];
            await saveOfflineState(state);
        }
        return state.tickets as unknown as T;
    }

    return {} as unknown as T;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const base = await getBaseUrl();
    const url = new URL(path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`);

    if (options.query) {
        Object.entries(options.query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                url.searchParams.set(key, String(value));
            }
        });
    }

    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    if (options.auth !== false) {
        const token = await getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
        response = await fetch(url.toString(), {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
    } catch {
        // Automatic offline/demo mode fallback when server is not reachable
        return resolveOfflineApi<T>(path, options);
    }

    const text = await response.text();
    let payload: unknown = null;
    if (text) {
        try {
            payload = JSON.parse(text);
        } catch {
            // If server returned HTML or non-JSON, fallback to offline data seamlessly
            return resolveOfflineApi<T>(path, options);
        }
    }

    if (!response.ok) {
        // For custom mobile endpoints that might 404 on older servers, resolve from offline state
        if (response.status === 404) {
            return resolveOfflineApi<T>(path, options);
        }
        const message =
            (payload && typeof payload === 'object' && 'message' in payload && typeof (payload as { message: unknown }).message === 'string'
                ? (payload as { message: string }).message
                : null) || `خطای سرور (${response.status})`;
        throw new ApiError(message, response.status, payload);
    }

    return payload as T;
}

export async function resolveAssetUrl(asset: string | null | undefined): Promise<string | null> {
    if (!asset) return null;
    if (/^https?:\/\//i.test(asset)) return asset;
    const base = await getBaseUrl();
    return `${base}${asset.startsWith('/') ? '' : '/'}${asset}`;
}

export async function openSitePage(relativePath: string): Promise<void> {
    const base = await getBaseUrl();
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    const targetUrl = /^https?:\/\//i.test(relativePath) ? relativePath : `${base}${cleanPath}`;

    const supported = await Linking.canOpenURL(targetUrl);
    if (!supported) {
        throw new ApiError('امکان باز کردن این صفحه در مرورگر دستگاه وجود ندارد.', 0);
    }
    await Linking.openURL(targetUrl);
}
