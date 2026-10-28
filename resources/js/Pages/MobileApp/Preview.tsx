import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    Smartphone,
    Sun,
    Moon,
    Home,
    BookOpen,
    ShoppingBag,
    LayoutDashboard,
    User,
    Bell,
    Calendar,
    Award,
    MessageSquare,
    Play,
    Pause,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Search,
    Users,
    FileText,
    BarChart3,
    Settings,
    Lock,
    Megaphone,
    Filter,
    ClipboardCheck,
    HelpCircle,
    Layers,
    CreditCard,
    Check,
    Plus,
    RefreshCw,
    ArrowUpRight,
    Briefcase,
    Bookmark,
    Share2,
    Eye,
    Flame,
    Sparkles,
    MoreVertical,
    X,
    Sliders,
    Trash2,
    Edit3,
    DollarSign,
    Tag,
    Palette,
    CheckSquare,
    TrendingUp,
    Zap,
    SendHorizontal,
    PhoneCall,
    Clock,
    AlertCircle,
    Download,
    ShoppingCart,
    Wallet,
    GraduationCap,
    FileCheck,
    Video,
    MessageCircle,
    Star,
    Radio,
    Gift,
    Phone,
    LogOut,
    Key,
    Target,
} from 'lucide-react';

export type ScreenId =
    | 'home'
    | 'dashboard'
    | 'login'
    | 'courses'
    | 'learning'
    | 'quizzes'
    | 'sessions'
    | 'shop'
    | 'wallet'
    | 'support'
    | 'admin'
    | 'settings';

export type AdminSubTab =
    | 'overview'
    | 'courses'
    | 'orders'
    | 'users'
    | 'crm'
    | 'discounts'
    | 'automations'
    | 'tickets'
    | 'site_switches';

export type ThemePalette = 'day' | 'night';

export type LogoStyle = 'lotus' | 'crown' | 'crystal' | 'eagle' | 'star';

export default function MobileAppPreview() {
    // ----------------------------------------------------
    // DYNAMIC BRANDING & THEME STATE (Persistent - 2 Website Themes: Day & Night)
    // ----------------------------------------------------
    const [appName, setAppName] = useState<string>(() => {
        return localStorage.getItem('mobile_app_name') || 'بهار زندگی';
    });
    const [appTagline, setAppTagline] = useState<string>(() => {
        return localStorage.getItem('mobile_app_tagline') || 'آکادمی رشد و سیستم‌سازی ذهن';
    });
    const [logoStyle, setLogoStyle] = useState<LogoStyle>(() => {
        return (localStorage.getItem('mobile_app_logo') as LogoStyle) || 'lotus';
    });
    const [customMonogram, setCustomMonogram] = useState<string>(() => {
        return localStorage.getItem('mobile_app_monogram') || 'ب';
    });
    const [appDark, setAppDark] = useState<boolean>(() => {
        return localStorage.getItem('mobile_app_dark') === 'true';
    });
    const [themePalette, setThemePalette] = useState<ThemePalette>(() => {
        const saved = localStorage.getItem('mobile_app_theme') as ThemePalette;
        if (saved === 'night' || saved === 'day') return saved;
        return localStorage.getItem('mobile_app_dark') === 'true' ? 'night' : 'day';
    });
    const [brandingSavedNotice, setBrandingSavedNotice] = useState(false);

    const saveBranding = (name: string, tagline: string, logo: LogoStyle, mono: string, theme: ThemePalette) => {
        setAppName(name);
        setAppTagline(tagline);
        setLogoStyle(logo);
        setCustomMonogram(mono);
        setThemePalette(theme);
        setAppDark(theme === 'night');
        localStorage.setItem('mobile_app_name', name);
        localStorage.setItem('mobile_app_tagline', tagline);
        localStorage.setItem('mobile_app_logo', logo);
        localStorage.setItem('mobile_app_monogram', mono);
        localStorage.setItem('mobile_app_theme', theme);
        localStorage.setItem('mobile_app_dark', theme === 'night' ? 'true' : 'false');
        setBrandingSavedNotice(true);
        setTimeout(() => setBrandingSavedNotice(false), 2500);
    };

    // Navigation state
    const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
    const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('overview');

    // ----------------------------------------------------
    // AUTH & STUDENT PROFILE STATE (Phone OTP like Website)
    // ----------------------------------------------------
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
    const [currentUserPhone, setCurrentUserPhone] = useState<string>('۰۹۱۲۳۴۵۶۷۸۹');
    const [currentUserName, setCurrentUserName] = useState<string>('سامان یزدانی');
    const [loginStep, setLoginStep] = useState<'phone' | 'otp'>('phone');
    const [inputPhone, setInputPhone] = useState<string>('۰۹۱۲۳۴۵۶۷۸۹');
    const [otpCode, setOtpCode] = useState<string>('۴۸۲۹');
    const [otpTimer, setOtpTimer] = useState<number>(60);
    const [loginNotice, setLoginNotice] = useState<string | null>(null);

    useEffect(() => {
        if (loginStep !== 'otp' || otpTimer <= 0) return;
        const timer = setInterval(() => {
            setOtpTimer((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [loginStep, otpTimer]);

    // ----------------------------------------------------
    // ACADEMY HIGHLIGHTS / CAPSULES (Finka-inspired Story Capsules)
    // ----------------------------------------------------
    const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null);
    const highlightsData = [
        {
            id: 1,
            title: 'وبینار زنده امشب',
            tag: 'ساعت ۲۱:۰۰',
            icon: Radio,
            iconColor: 'text-rose-500',
            badgeText: 'پخش زنده',
            image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=300&q=80',
            targetScreen: 'sessions' as ScreenId,
            desc: 'وبینار تخصصی ویژه دانشجویان: نقشه راه سیستم‌سازی ذهنی در بحران‌های کسب‌وکار.',
            actionLabel: 'مشاهده جزئیات و لینک ورود',
        },
        {
            id: 2,
            title: 'آزمون هفتگی',
            tag: 'فصل دوم',
            icon: ClipboardCheck,
            iconColor: 'text-indigo-500',
            badgeText: 'آزمون آنلاین',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=300&q=80',
            targetScreen: 'quizzes' as ScreenId,
            desc: 'کوییز ۴ سوالی مبحث هوش هیجانی فعال شد. نمره قبولی در این آزمون ۸۰٪ است.',
            actionLabel: 'شروع آزمون آنلاین',
        },
        {
            id: 3,
            title: 'جلسه ۱ به ۱',
            tag: 'رزرو با منتور',
            icon: Users,
            iconColor: 'text-blue-500',
            badgeText: 'کوچینگ فردی',
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80',
            targetScreen: 'sessions' as ScreenId,
            desc: 'ظرفیت جلسات منتورینگ فردی دکتر بیدی برای هفته آینده بازگشایی شد.',
            actionLabel: 'رزرو وقت جلسه',
        },
        {
            id: 4,
            title: 'ورک‌بوک رایگان',
            tag: 'دانلود PDF',
            icon: Gift,
            iconColor: 'text-amber-500',
            badgeText: 'هدیه آموزشی',
            image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80',
            targetScreen: 'shop' as ScreenId,
            desc: 'فایل PDF چک‌لیست ۹۰ روزه بهره‌وری شخصی در بخش کتابخانه قرار گرفت.',
            actionLabel: 'دریافت رایگان فایل',
        },
        {
            id: 5,
            title: 'کد تخفیف VIP',
            tag: 'BAHAR50',
            icon: Tag,
            iconColor: 'text-purple-500',
            badgeText: 'تخفیف ۵۰٪',
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80',
            targetScreen: 'shop' as ScreenId,
            desc: 'کد تخفیف ۵۰ درصدی برای تهیه کتاب‌ها و دوره‌های جدید با محدودیت ۲۴ ساعت.',
            actionLabel: 'ورود به فروشگاه',
        },
    ];

    // ----------------------------------------------------
    // COURSES & IN-APP LEARNING PLAYER STATE (With Rich Photography)
    // ----------------------------------------------------
    const [selectedCourseId, setSelectedCourseId] = useState(1);
    const [coursesFilter, setCoursesFilter] = useState<'all' | 'my'>('all');
    const [searchCourseQuery, setSearchCourseQuery] = useState('');
    const [playingLesson, setPlayingLesson] = useState(true);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(3);
    const [lessonNoteText, setLessonNoteText] = useState('');
    const [savedNotes, setSavedNotes] = useState<string[]>([
        'نکته جلسه ۲: چرخه بازخورد منفی باید در کمتر از ۴۸ ساعت شکسته شود.',
    ]);
    const [isBookmarked, setIsBookmarked] = useState(true);

    const coursesList = [
        {
            id: 1,
            title: 'معماری ذهن و تصمیم‌گیری استراتژیک',
            category: 'کوچینگ ذهن',
            instructor: 'دکتر مهدی بیدی',
            instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
            duration: '۱۲ ساعت (۸ جلسه)',
            price: '۳,۹۰۰,۰۰۰',
            progress: 65,
            enrolled: true,
            rating: '۴.۹',
            reviewsCount: 142,
            lessonsCount: 6,
            lessons: [
                { id: 1, title: 'جلسه ۱: اصول تفکر مرتبه دوم و تحلیل رویدادها', dur: '۴۵ دقیقه', done: true },
                { id: 2, title: 'جلسه ۲: شناخت سوگیری‌های شناختی در مدیریت', dur: '۵۲ دقیقه', done: true },
                { id: 3, title: 'جلسه ۳: طراحی ماتریس تصمیم‌گیری در شرایط ابهام', dur: '۶۰ دقیقه', done: true },
                { id: 4, title: 'جلسه ۴: سیستم‌سازی بازخوردها و اصلاح مسیر فردی', dur: '۵۵ دقیقه', done: false },
                { id: 5, title: 'جلسه ۵: مهار هیجان‌های مخرب در تصمیم‌گیری‌های پرریسک', dur: '۴۸ دقیقه', done: false },
                { id: 6, title: 'جلسه ۶: تدوین بیانیه مأموریت و چشم‌انداز ۵ ساله', dur: '۶۲ دقیقه', done: false },
            ],
        },
        {
            id: 2,
            title: 'کوچینگ بهره‌وری و سیستم‌سازی شخصی',
            category: 'بهره‌وری',
            instructor: 'دکتر مهدی بیدی',
            instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
            duration: '۹ ساعت (۶ جلسه)',
            price: '۲,۸۵۰,۰۰۰',
            progress: 20,
            enrolled: true,
            rating: '۴.۸',
            reviewsCount: 98,
            lessonsCount: 3,
            lessons: [
                { id: 1, title: 'جلسه ۱: آناتومی زمان و ثبت گزارش وقایع', dur: '۴۰ دقیقه', done: true },
                { id: 2, title: 'جلسه ۲: متدولوژی Time-Blocking پیشرفته', dur: '۵۰ دقیقه', done: false },
                { id: 3, title: 'جلسه ۳: حذف کارهای بی‌ارزش و تفویض اختیار', dur: '۴۵ دقیقه', done: false },
            ],
        },
        {
            id: 3,
            title: 'رهبری استراتژیک خود و تاب‌آوری سازمانی',
            category: 'رهبری',
            instructor: 'دکتر مهدی بیدی',
            instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
            duration: '۱۴ ساعت (۱۰ جلسه)',
            price: '۴,۵۰۰,۰۰۰',
            progress: 0,
            enrolled: false,
            rating: '۵.۰',
            reviewsCount: 64,
            lessonsCount: 2,
            lessons: [
                { id: 1, title: 'جلسه ۱: پارادایم رهبری از درون به بیرون', dur: '۵۰ دقیقه', done: false },
                { id: 2, title: 'جلسه ۲: مدیریت انرژی به جای مدیریت زمان', dur: '۴۵ دقیقه', done: false },
            ],
        },
        {
            id: 4,
            title: 'مسترکلاس تعیین اهداف و سنجش نتایج (OKR)',
            category: 'هدف‌گذاری',
            instructor: 'مهندس رضایی',
            instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
            duration: '۶ ساعت (۴ جلسه)',
            price: '۱,۹۵۰,۰۰۰',
            progress: 0,
            enrolled: false,
            rating: '۴.۷',
            reviewsCount: 39,
            lessonsCount: 2,
            lessons: [
                { id: 1, title: 'جلسه ۱: تفاوت KPI و OKR در زندگی فردی', dur: '۳۵ دقیقه', done: false },
                { id: 2, title: 'جلسه ۲: تدوین ۳ هدف کلیدی ۹۰ روزه', dur: '۴۵ دقیقه', done: false },
            ],
        },
    ];

    const currentCourse = coursesList.find((c) => c.id === selectedCourseId) || coursesList[0];

    // ----------------------------------------------------
    // QUIZZES & ASSIGNMENTS STATE
    // ----------------------------------------------------
    const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState<number | null>(null);

    const quizQuestions = [
        {
            id: 1,
            q: 'تعریف دقیق تفکر سیستمی در مدل ذهنی دکتر بیدی چیست؟',
            options: [
                'واکنش لحظه‌ای به رخدادهای غیرمنتظره روزمره',
                'دیدن الگوها، اتصالات پنهان و حلقه‌های بازخورد علّی',
                'برنامه‌ریزی فشرده ساعت به ساعت بدون تغییر',
                'تکیه صرف بر انگیزه مقطعی و جلسات کوتاه',
            ],
            correct: 1,
        },
        {
            id: 2,
            q: 'کدام گزینه از مهم‌ترین موانع تصمیم‌گیری استراتژیک در شرایط بحرانی است؟',
            options: [
                'سوگیری تأیید و خطای هزینه هدررفته (Sunk Cost)',
                'داشتن استراحت کافی و تغذیه سالم',
                'استفاده از ماتریس اولویت‌بندی آیزنهاور',
                'ثبت جلسات در تقویم کاری',
            ],
            correct: 0,
        },
    ];

    const [assignmentText, setAssignmentText] = useState('');
    const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

    // ----------------------------------------------------
    // COACHING 1-ON-1 SESSIONS & GOALS TRACKER
    // ----------------------------------------------------
    const [bookedSessions, setBookedSessions] = useState([
        {
            id: 101,
            coach: 'دکتر مهدی بیدی',
            role: 'کوچ ارشد سیستم‌سازی',
            date: 'شنبه ۱۸ اردیبهشت',
            time: 'ساعت ۱۷:۰۰ تا ۱۸:۰۰',
            status: 'تایید شده',
            roomLink: 'https://meet.google.com/xyz-bahar',
            topic: 'بازنگری ماتریس تصمیم‌گیری و اصلاح نقشه فصلی',
        },
    ]);
    const [newSessionDate, setNewSessionDate] = useState('دوشنبه ۲۰ اردیبهشت');
    const [newSessionSlot, setNewSessionSlot] = useState('ساعت ۱۶:۰۰');
    const [newSessionTopic, setNewSessionTopic] = useState('سیستم‌سازی فردی و تفویض');
    const [sessionBookingSuccess, setSessionBookingSuccess] = useState(false);

    const [goalsList, setGoalsList] = useState([
        { id: 1, title: 'کاهش زمان هدررفته موبایل به کمتر از ۱ ساعت روزانه', done: true },
        { id: 2, title: 'تدوین جدول ماتریس اولویت‌ها برای پروژه‌های فصلی', done: true },
        { id: 3, title: 'ارائه تکلیف بررسی سوگیری‌های شناختی در جلسه ۴', done: false },
        { id: 4, title: 'حضور منظم در جلسه وبینار زنده و یادداشت‌برداری', done: false },
    ]);

    // ----------------------------------------------------
    // SHOP, PRODUCTS, CART & DOWNLOADS
    // ----------------------------------------------------
    const [shopProducts, setShopProducts] = useState([
        {
            id: 1,
            title: 'کتاب نفیس «معماری ذهن برتر» (جلد سخت)',
            type: 'کتاب فیزیکی',
            price: 480000,
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
            rating: '۴.۹',
        },
        {
            id: 2,
            title: 'ورک‌بوک دانلودی نقشه اقدام ۹۰ روزه (PDF)',
            type: 'فایل دیجیتال',
            price: 195000,
            image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
            rating: '۴.۸',
        },
        {
            id: 3,
            title: 'مجموعه پادکست‌های رادیو کوچینگ ذهن (صوتی)',
            type: 'فایل صوتی',
            price: 290000,
            image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
            rating: '۵.۰',
        },
    ]);

    const [cart, setCart] = useState<{ id: number; qty: number }[]>([
        { id: 2, qty: 1 },
    ]);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
    const [receiptNumber, setReceiptNumber] = useState('');
    const [checkoutComplete, setCheckoutComplete] = useState(false);

    const applyCoupon = () => {
        if (couponCode.trim().toUpperCase() === 'BAHAR50') {
            setCouponDiscount(0.5);
            setCouponFeedback('کد تخفیف ۵۰٪ با موفقیت اعمال شد!');
        } else if (couponCode.trim().toUpperCase() === 'VIP2025') {
            setCouponDiscount(0.3);
            setCouponFeedback('کد تخفیف ۳۰٪ اعمال شد!');
        } else {
            setCouponFeedback('کد تخفیف وارد شده نامعتبر یا منقضی است.');
        }
    };

    // Digital Library Downloads
    const purchasedLibrary = [
        {
            id: 1,
            title: 'ورک‌بوک نقشه اقدام ۹۰ روزه (ویرایش جدید ۱۴۰۴)',
            format: 'PDF • ۱۲ مگابایت',
            code: 'LIB-9941',
        },
        {
            id: 2,
            title: 'چک‌لیست روزانه ردیابی تمرکز و انرژی',
            format: 'PDF • ۳ مگابایت',
            code: 'LIB-8812',
        },
        {
            id: 3,
            title: 'فایل صوتی مدیتیشن آرامش ذهن قبل از تصمیم‌گیری',
            format: 'MP3 • ۲۴ مگابایت',
            code: 'LIB-7703',
        },
    ];

    // ----------------------------------------------------
    // WALLET, CERTIFICATES & ORDERS
    // ----------------------------------------------------
    const [walletBalance, setWalletBalance] = useState(2450000);
    const [walletTransactions, setWalletTransactions] = useState([
        { id: 1, title: 'هدیه ثبت‌نام دوره جامع', amount: '+۵۰۰,۰۰۰ ت', date: '۱۴ اردیبهشت', type: 'credit' },
        { id: 2, title: 'خرید ورک‌بوک نقشه اقدام ۹۰ روزه', amount: '-۱۹۵,۰۰۰ ت', date: '۱۰ اردیبهشت', type: 'debit' },
        { id: 3, title: 'پاداش معرفی دوستان (کد رفرال)', amount: '+۱۵۰,۰۰۰ ت', date: '۰۴ اردیبهشت', type: 'credit' },
    ]);
    const [topUpModal, setTopUpModal] = useState(false);

    const issuedCertificates = [
        {
            id: 'CERT-2025-992',
            title: 'گواهینامه پایان دوره معماری ذهن و تصمیم‌گیری',
            date: 'اردیبهشت ۱۴۰۴',
            issuer: 'آکادمی بهار زندگی با امضای رسمی دکتر بیدی',
            status: 'معتبر و قابل استعلام',
        },
    ];

    // ----------------------------------------------------
    // SUPPORT TICKETS & LIVE CHAT
    // ----------------------------------------------------
    const [supportTab, setSupportTab] = useState<'tickets' | 'chat'>('tickets');
    const [userTickets, setUserTickets] = useState([
        {
            id: 501,
            subject: 'درخواست راهنمایی در مورد تمرین جلسه ۳',
            dept: 'آموزش',
            status: 'پاسخ داده شده',
            messages: [
                { sender: 'user', text: 'سلام، در تکمیل ماتریس دچار ابهام هستم.', time: '۱۰:۲۰' },
                { sender: 'support', text: 'سلام دوست عزیز؛ فایل صوتی راهنما در بخش تکالیف برای شما بارگذاری شد.', time: '۱۰:۴۵' },
            ],
        },
    ]);
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [newTicketDept, setNewTicketDept] = useState('آموزشی');
    const [newTicketMessage, setNewTicketMessage] = useState('');

    const [liveChatMessages, setLiveChatMessages] = useState([
        { sender: 'bot', text: 'سلام! به پشتیبانی هوشمند آکادمی خوش آمدید. چطور می‌توانم کمکتان کنم؟', time: '۰۹:۳۰' },
    ]);
    const [liveChatInput, setLiveChatInput] = useState('');

    const sendLiveChatMessage = () => {
        if (!liveChatInput.trim()) return;
        const msg = liveChatInput;
        setLiveChatMessages((prev) => [
            ...prev,
            { sender: 'user', text: msg, time: 'هم‌اکنون' },
        ]);
        setLiveChatInput('');
        setTimeout(() => {
            setLiveChatMessages((prev) => [
                ...prev,
                { sender: 'support', text: 'پیام شما دریافت شد. همکاران پشتیبان یا دکتر بیدی در اسرع وقت پاسخ خواهند داد.', time: 'هم‌اکنون' },
            ]);
        }, 1000);
    };

    // ----------------------------------------------------
    // FULL IN-APP ADMIN STATE (100% Mobile Access)
    // ----------------------------------------------------
    const [adminCourses, setAdminCourses] = useState([
        { id: 1, title: 'معماری ذهن و تسلط بر هیجان', students: 428, price: '۳,۹۰۰,۰۰۰', published: true, category: 'کوچینگ ذهن' },
        { id: 2, title: 'کوچینگ بهره‌وری و سیستم‌سازی فردی', students: 312, price: '۲,۸۵۰,۰۰۰', published: true, category: 'بهره‌وری' },
        { id: 3, title: 'رهبری خود و تصمیم‌گیری استراتژیک', students: 195, price: '۴,۵۰۰,۰۰۰', published: true, category: 'رهبری' },
        { id: 4, title: 'مسترکلاس هدف‌گذاری OKR فردی', students: 84, price: '۱,۹۵۰,۰۰۰', published: false, category: 'هدف‌گذاری' },
    ]);
    const [newCourseModalOpen, setNewCourseModalOpen] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCoursePrice, setNewCoursePrice] = useState('۲,۵۰۰,۰۰۰');
    const [newCourseCat, setNewCourseCat] = useState('رشد فردی');

    const [pendingInvoices, setPendingInvoices] = useState([
        { id: 'INV-8841', user: 'سامان یزدانی', amount: '۳,۹۰۰,۰۰۰ تومان', method: 'فیش کارت به کارت', status: 'در انتظار تایید' },
        { id: 'INV-8842', user: 'زهرا موسوی', amount: '۱,۹۵۰,۰۰۰ تومان', method: 'انتقال پایا / شبا', status: 'در انتظار تایید' },
    ]);

    const [adminUsers, setAdminUsers] = useState([
        { id: 101, name: 'محمدرضا کاظمی', email: 'm.kazemi@example.com', role: 'مدیر ارشد', status: 'فعال', wallet: '۲,۴۰۰,۰۰۰' },
        { id: 102, name: 'دکتر مهدی بیدی', email: 'dr.bidi@example.com', role: 'استاد و منتور', status: 'فعال', wallet: '۱۵,۸۰۰,۰۰۰' },
        { id: 103, name: 'سارا احمدی', email: 'sara.ahmadi@example.com', role: 'دانش‌پذیر VIP', status: 'فعال', wallet: '۵۰۰,۰۰۰' },
        { id: 104, name: 'امیرحسین رضایی', email: 'amir.rezaei@example.com', role: 'پشتیبان فنی', status: 'فعال', wallet: '۰' },
    ]);
    const [userSearchText, setUserSearchText] = useState('');

    const [leads, setLeads] = useState([
        { id: 1, name: 'علیرضا شمس', phone: '۰۹۱۲۳۴۵۶۷۸۹', course: 'کوچینگ استراتژیک', stage: 'جدید', source: 'وب‌سایت مستقیم', date: 'امروز ۱۰:۳۰' },
        { id: 2, name: 'مریم کمالی', phone: '۰۹۱۸۲۳۴۵۶۷۸', course: 'معماری ذهن', stage: 'در حال پیگیری', source: 'مشاوره تلفنی', date: 'امروز ۰۹:۱۵' },
        { id: 3, name: 'کامران نوری', phone: '۰۹۳۵۱۲۳۴۵۶۷', course: 'رهبری فردی', stage: 'جلسه مشاوره', source: 'فرم سایت', date: 'دیروز' },
    ]);

    const [discountCodes, setDiscountCodes] = useState([
        { id: 1, code: 'BAHAR50', percent: '۵۰٪', count: '۱۲/۵۰', active: true },
        { id: 2, code: 'VIP2025', percent: '۳۰٪', count: '۴۵/۱۰۰', active: true },
    ]);
    const [newCodeName, setNewCodeName] = useState('');
    const [newCodePercent, setNewCodePercent] = useState('۳۰٪');

    const [adminTickets, setAdminTickets] = useState([
        { id: 401, user: 'امیرحسین رضایی', subject: 'مشکل در باز شدن ویدیوی جلسه ۴', dept: 'فنی', status: 'باز', reply: '' },
        { id: 402, user: 'سارا احمدی', subject: 'درخواست صدور مدرک چاپی با هولوگرام', dept: 'مدارک', status: 'در حال بررسی', reply: 'مدرک شما به آدرس پستی ثبت‌شده ارسال خواهد شد.' },
    ]);
    const [selectedAdminTicketId, setSelectedAdminTicketId] = useState<number | null>(401);
    const [adminReplyText, setAdminReplyText] = useState('');

    const [botSwitches, setBotSwitches] = useState({
        smsKavenegar: true,
        perslineWebhook: true,
        maintenanceMode: false,
        openRegistration: true,
        pushNotifications: true,
    });
    const [broadcastText, setBroadcastText] = useState('');
    const [broadcastSent, setBroadcastSent] = useState(false);

    // Theme color helper based on Day and Night themes (100% matched to website branding)
    const getThemeConfig = () => {
        const isNight = appDark || themePalette === 'night';
        if (isNight) {
            return {
                name: 'تم شب آکادمی (دارک مود سایت)',
                headerGrad: 'from-[#020617] via-[#0B231A] to-[#020617]',
                accent: 'text-emerald-400',
                accentBg: 'bg-emerald-500',
                accentBorder: 'border-emerald-400',
                badgeBg: 'bg-emerald-500 text-slate-950 font-black',
                ring: 'ring-emerald-400',
            };
        }
        return {
            name: 'تم روز آکادمی (تم اصلی سایت)',
            headerGrad: 'from-[#062419] via-[#0B3B2B] to-[#0D4D38]',
            accent: 'text-emerald-600',
            accentBg: 'bg-emerald-600',
            accentBorder: 'border-emerald-500',
            badgeBg: 'bg-emerald-600 text-white',
            ring: 'ring-emerald-600',
        };
    };

    const curTheme = getThemeConfig();

    const surfaceCls = appDark
        ? 'bg-slate-900 border-slate-800 text-slate-100'
        : 'bg-white border-slate-200 text-slate-900';
    const mutedCls = appDark ? 'text-slate-400' : 'text-slate-500';
    const pageBgCls = appDark ? 'bg-slate-950 text-slate-100' : 'bg-[#FAFAF9] text-slate-900';

    // Renders the configured app logo
    const renderAppLogo = (size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClasses = {
            sm: 'w-7 h-7 text-xs',
            md: 'w-9 h-9 text-sm',
            lg: 'w-14 h-14 text-xl',
        }[size];

        switch (logoStyle) {
            case 'lotus':
                return (
                    <div className={`${sizeClasses} rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-400 to-emerald-500 text-white flex items-center justify-center font-black shadow-lg shadow-rose-500/20`}>
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                );
            case 'crown':
                return (
                    <div className={`${sizeClasses} rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20`}>
                        <Award className="w-4 h-4 fill-current" />
                    </div>
                );
            case 'crystal':
                return (
                    <div className={`${sizeClasses} rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20`}>
                        <Zap className="w-4 h-4 fill-current" />
                    </div>
                );
            case 'eagle':
                return (
                    <div className={`${sizeClasses} rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-800 text-white flex items-center justify-center font-black shadow-lg shadow-purple-500/20`}>
                        <TrendingUp className="w-4 h-4" />
                    </div>
                );
            case 'star':
            default:
                return (
                    <div className={`${sizeClasses} rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-500/20`}>
                        <span>{customMonogram || 'ب'}</span>
                    </div>
                );
        }
    };

    return (
        <UserDashboardLayout title="سوپر اپلیکیشن اختصاصی آکادمی + دسترسی کامل به کل سایت و پنل مدیریت">
            <Head title="سوپر اپلیکیشن آکادمی بهار زندگی | تمام امکانات سایت در گوشی + پنل مدیریت ۱۰۰٪ درون‌برنامه‌ای" />

            <div className="space-y-6" dir="rtl">
                {/* Top Executive Header */}
                <div className="rounded-3xl bg-gradient-to-l from-slate-950 via-[#0B3B2B] to-slate-900 p-6 text-white shadow-2xl border border-emerald-500/30">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    تمام امکانات وب‌سایت در اپلیکیشن (راحت‌تر، سریع‌تر و زیباتر)
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-300">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                                    دسترسی ۱۰۰٪ به پنل ادمین بدون خروج از برنامه
                                </span>
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                {renderAppLogo('md')}
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                        سوپر اپلیکیشن «{appName}»
                                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                                            نسخه رسمی آکادمی
                                        </span>
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2.5 mt-1">
                                        <span className="text-xs sm:text-sm text-slate-300">
                                            {appTagline} • حالت فعال: <strong className="text-emerald-300">{curTheme.name}</strong>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const next = !appDark;
                                                setAppDark(next);
                                                setThemePalette(next ? 'night' : 'day');
                                                localStorage.setItem('mobile_app_dark', next ? 'true' : 'false');
                                                localStorage.setItem('mobile_app_theme', next ? 'night' : 'day');
                                            }}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition active:scale-95 shadow-sm"
                                        >
                                            {appDark ? (
                                                <>
                                                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                                                    <span>تغییر به تم روز (سایت)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                                                    <span>تغییر به تم شب (دارک سایت)</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Direct Screen Switcher */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                                onClick={() => setActiveScreen('home')}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeScreen === 'home'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                <Home className="w-3.5 h-3.5" />
                                خانه
                            </button>
                            <button
                                onClick={() => setActiveScreen('dashboard')}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeScreen === 'dashboard'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                                داشبورد دانشجو
                            </button>
                            <button
                                onClick={() => setActiveScreen('login')}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeScreen === 'login'
                                        ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/30'
                                        : 'bg-white/10 text-amber-300 border border-amber-400/40 hover:bg-white/20'
                                }`}
                            >
                                <Phone className="w-3.5 h-3.5" />
                                ورود با موبایل
                            </button>
                            <button
                                onClick={() => setActiveScreen('courses')}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeScreen === 'courses' || activeScreen === 'learning'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                دوره‌ها و پلیر
                            </button>
                            <button
                                onClick={() => setActiveScreen('sessions')}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeScreen === 'sessions'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                کوچینگ و اهداف
                            </button>
                            <button
                                onClick={() => setActiveScreen('shop')}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeScreen === 'shop'
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                فروشگاه و کتابخانه
                            </button>
                            <button
                                onClick={() => setActiveScreen('admin')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeScreen === 'admin'
                                        ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/30'
                                        : 'bg-white/10 text-amber-300 border border-amber-400/40 hover:bg-white/20'
                                }`}
                            >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                پنل ادمین موبایل
                            </button>
                            <button
                                onClick={() => setActiveScreen('settings')}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                    activeScreen === 'settings'
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                <Settings className="w-3.5 h-3.5" />
                                تغییر نام و لوگو
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Two-Column Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* RIGHT COLUMN: INTERACTIVE PHONE SIMULATOR (420px Width) */}
                    <div className="xl:col-span-5 flex flex-col items-center">
                        <div className="w-full max-w-[420px] rounded-[48px] p-3.5 bg-slate-900 shadow-2xl border-4 border-slate-800 relative">
                            {/* Phone Speaker Notch */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-30">
                                <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700/60" />
                                <div className="w-12 h-1 bg-slate-800 rounded-full" />
                            </div>

                            {/* Inside Phone Screen */}
                            <div
                                className={`w-full h-[810px] rounded-[38px] overflow-hidden flex flex-col border relative ${
                                    appDark ? 'border-slate-800' : 'border-slate-200'
                                } ${pageBgCls}`}
                            >
                                {/* PHONE TOP STATUS BAR & DYNAMIC HEADER */}
                                <div className={`bg-gradient-to-l ${curTheme.headerGrad} text-white px-3.5 pt-7 pb-3 shadow-xl shrink-0 transition-all duration-500 border-b border-white/10 relative z-20`}>
                                    {/* Top Status Bar: Persian Time, Dynamic Notch Pill & 2-Theme Switcher */}
                                    <div className="flex items-center justify-between text-[11px] text-white/80 mb-2 pb-1.5 border-b border-white/10">
                                        <div className="flex items-center gap-1.5 font-mono font-bold">
                                            <span>۰۹:۴۱</span>
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/15 text-white font-semibold">5G</span>
                                        </div>

                                        {/* Dynamic Island / Notch Pill */}
                                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[9px] text-white/80 shadow-inner">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="font-bold">آکادمی بهار زندگی</span>
                                        </div>

                                        {/* Sleek 2-Theme Day/Night Toggle Pill (Matching Website) */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const next = !appDark;
                                                setAppDark(next);
                                                setThemePalette(next ? 'night' : 'day');
                                                localStorage.setItem('mobile_app_dark', next ? 'true' : 'false');
                                                localStorage.setItem('mobile_app_theme', next ? 'night' : 'day');
                                            }}
                                            className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md text-white flex items-center gap-1 text-[10px] font-bold border border-white/25 transition shadow-sm"
                                            title="سوئیچ بین تم روز و تم شب سایت"
                                        >
                                            {appDark ? (
                                                <>
                                                    <Moon className="w-3 h-3 text-indigo-300" />
                                                    <span>تم شب</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sun className="w-3 h-3 text-amber-300" />
                                                    <span>تم روز</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* App Brand Bar with Verified Badge & Action Elements */}
                                    <div className="flex items-center justify-between gap-1.5">
                                        {/* Brand & Verified Badge */}
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="relative shrink-0">
                                                <div className="absolute -inset-0.5 rounded-2xl bg-emerald-400/30 blur-sm" />
                                                <div className="relative">
                                                    {renderAppLogo('sm')}
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs sm:text-sm font-black tracking-tight leading-tight flex items-center gap-1.5 truncate">
                                                    <span>{appName}</span>
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                                    {activeScreen === 'admin' && (
                                                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-400 text-slate-950 font-black shrink-0 shadow-sm">
                                                            ADMIN
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-white/80 truncate">
                                                    {appTagline}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Frosted Glass Action Elements */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            {/* Profile / Login Button */}
                                            {isLoggedIn ? (
                                                <button
                                                    onClick={() => setActiveScreen('dashboard')}
                                                    className={`relative p-0.5 rounded-full transition border ${
                                                        activeScreen === 'dashboard'
                                                            ? 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-400/20'
                                                            : 'border-white/30 hover:border-white/60 bg-white/15'
                                                    }`}
                                                    title="پروفایل و داشبورد دانشجو"
                                                >
                                                    <img
                                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                                        alt="پروفایل"
                                                        className="w-7 h-7 rounded-full object-cover"
                                                    />
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setActiveScreen('login')}
                                                    className="px-2 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 text-[10px] font-bold shadow-sm transition active:scale-95"
                                                    title="ورود با شماره موبایل"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    <span>ورود</span>
                                                </button>
                                            )}

                                            {/* Quick Search */}
                                            <button
                                                onClick={() => setActiveScreen('courses')}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                                                    activeScreen === 'courses' || activeScreen === 'learning'
                                                        ? 'bg-white text-slate-900 border-white shadow-sm'
                                                        : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                                                }`}
                                                title="کاتالوگ دوره‌ها"
                                            >
                                                <Search className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Wallet */}
                                            <button
                                                onClick={() => setActiveScreen('wallet')}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center relative transition border ${
                                                    activeScreen === 'wallet'
                                                        ? 'bg-white text-slate-900 border-white shadow-sm'
                                                        : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                                                }`}
                                                title="کیف پول و مدارک"
                                            >
                                                <Wallet className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Support */}
                                            <button
                                                onClick={() => setActiveScreen('support')}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                                                    activeScreen === 'support'
                                                        ? 'bg-white text-slate-900 border-white shadow-sm'
                                                        : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                                                }`}
                                                title="پشتیبانی آنلاین"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Settings */}
                                            <button
                                                onClick={() => setActiveScreen('settings')}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                                                    activeScreen === 'settings'
                                                        ? 'bg-white text-slate-900 border-white shadow-sm'
                                                        : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                                                }`}
                                                title="تنظیمات تم و برندینگ"
                                            >
                                                <Sliders className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sub-Header Quick Action Strip */}
                                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
                                        <div className="flex items-center gap-1.5 text-white/90 truncate">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-ping" />
                                            <span className="truncate">کوچینگ ۱ به ۱: شنبه ۱۸ اردیبهشت با دکتر بیدی</span>
                                        </div>
                                        <button
                                            onClick={() => setActiveScreen('sessions')}
                                            className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white font-bold shrink-0 text-[9px] flex items-center gap-0.5 transition"
                                        >
                                            <span>مشاهده</span>
                                            <ChevronLeft className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* SCROLLABLE PHONE BODY CONTENT */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
                                    {/* ========================================================
                                        SCREEN 1: HOME SUPER-HUB (خانه و پیشخوان یکپارچه)
                                    ======================================================== */}
                                    {activeScreen === 'home' && (
                                        <>
                                            {/* Student Greeting & Stats Banner */}
                                            <div className="rounded-2xl bg-gradient-to-l from-slate-900 to-slate-800 text-white p-3.5 shadow-sm space-y-2.5 border border-slate-700/60">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="relative">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                                                alt="دانش‌پذیر VIP"
                                                                className="w-10 h-10 rounded-full object-cover border border-amber-400/80 shadow-sm"
                                                            />
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[8px] border border-slate-900 shadow">
                                                                VIP
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black">سلام، دانش‌پذیر عزیز</div>
                                                            <div className="text-[10px] text-slate-300">عضویت طلایی آکادمی فعال است</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setActiveScreen('admin')}
                                                        className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-sm hover:bg-amber-300 transition"
                                                    >
                                                        <ShieldCheck className="w-3 h-3" />
                                                        پنل ادمین
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center border-t border-slate-700/60">
                                                    <div className="p-1.5 rounded-lg bg-white/5">
                                                        <div className="text-xs font-black text-emerald-400">۲ دوره</div>
                                                        <div className="text-[9px] text-slate-300">در حال یادگیری</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-white/5">
                                                        <div className="text-xs font-black text-amber-300">۱ جلسه</div>
                                                        <div className="text-[9px] text-slate-300">کوچینگ رزرو شده</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-white/5">
                                                        <div className="text-xs font-black text-blue-300">۲,۴۵۰,۰۰۰ ت</div>
                                                        <div className="text-[9px] text-slate-300">موجودی کیف پول</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Finka-inspired Learning Streak Capsule */}
                                            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                                                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                                                            استریک ۵ روز یادگیری مداوم
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                                            ۲ جلسه تا تکمیل نشان طلایی هفته
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/15">
                                                    ۵ / ۷ روز
                                                </span>
                                            </div>

                                            {/* ACADEMY HIGHLIGHTS / CAPSULES (Finka Photo Capsules) */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between px-1">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                        رویدادها و کپسول‌های آکادمی
                                                    </span>
                                                    <span className={`text-[10px] ${mutedCls}`}>اطلاعیه‌های زنده</span>
                                                </div>

                                                <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 no-scrollbar">
                                                    {highlightsData.map((hl) => {
                                                        const HlIcon = hl.icon;
                                                        return (
                                                            <button
                                                                key={hl.id}
                                                                onClick={() => setSelectedHighlight(hl.id)}
                                                                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                                                            >
                                                                <div className="p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-amber-400 to-blue-500 group-hover:scale-105 transition-transform duration-200">
                                                                    <div className="w-13 h-13 rounded-full overflow-hidden bg-slate-900 border-2 border-white dark:border-slate-900 relative">
                                                                        <img
                                                                            src={hl.image}
                                                                            alt={hl.title}
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/25" />
                                                                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 py-0.5 flex items-center justify-center">
                                                                            <HlIcon className={`w-2.5 h-2.5 ${hl.iconColor}`} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[62px]">
                                                                    {hl.title}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* RESUME LEARNING ACTIVE COURSE CARD (With Photo Thumbnail) */}
                                            <div className={`p-3 rounded-2xl border ${surfaceCls} space-y-2.5 shadow-sm`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                        <BookOpen className="w-3 h-3" />
                                                        ادامه یادگیری دوره فعال
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-500">۶۵٪ تکمیل</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                                                        <img
                                                            src={coursesList[0].image}
                                                            alt={coursesList[0].title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
                                                                <Play className="w-3 h-3 fill-current ml-0.5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-xs font-black truncate">
                                                            {coursesList[0].title}
                                                        </div>
                                                        <div className={`text-[10px] ${mutedCls} truncate mt-0.5`}>
                                                            جلسه ۴: سیستم‌سازی بازخوردها و اصلاح مسیر فردی
                                                        </div>
                                                        {/* Progress Bar */}
                                                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1.5">
                                                            <div className="h-full bg-emerald-500 rounded-full w-[65%]" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setSelectedCourseId(1);
                                                        setActiveScreen('learning');
                                                    }}
                                                    className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                                                >
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                    ادامه پخش ویدیو و سرفصل‌ها
                                                </button>
                                            </div>

                                            {/* UPCOMING 1-ON-1 COACHING SESSION */}
                                            <div className={`p-3.5 rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 space-y-2`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        نزدیک‌ترین جلسه منتورینگ فردی
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                                                        تایید شده
                                                    </span>
                                                </div>

                                                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                                                    جلسه بازنگری ماتریس تصمیم‌گیری با دکتر بیدی
                                                </div>
                                                <div className="text-[10px] text-slate-600 dark:text-slate-400">
                                                    زمان: شنبه ۱۸ اردیبهشت — ساعت ۱۷:۰۰ تا ۱۸:۰۰
                                                </div>

                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        onClick={() => setActiveScreen('sessions')}
                                                        className="flex-1 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1"
                                                    >
                                                        <Video className="w-3 h-3" />
                                                        ورود به اتاق جلسه
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveScreen('sessions')}
                                                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                                    >
                                                        اهداف ۹۰ روزه
                                                    </button>
                                                </div>
                                            </div>

                                            {/* QUICK ACCESS GRID (ALL WEBSITE CAPABILITIES) */}
                                            <div className="space-y-1.5">
                                                <div className="text-xs font-black px-1 text-slate-900 dark:text-white">
                                                    دسترسی سریع به تمام امکانات سایت
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'courses' as ScreenId, title: 'کاتالوگ دوره‌ها', sub: 'تمام آموزش‌ها و سرفصل‌ها', icon: BookOpen, color: 'text-emerald-500 bg-emerald-500/10' },
                                                        { id: 'quizzes' as ScreenId, title: 'تکالیف و آزمون‌ها', sub: 'کوییز آنلاین و ارسال تمرین', icon: ClipboardCheck, color: 'text-indigo-500 bg-indigo-500/10' },
                                                        { id: 'sessions' as ScreenId, title: 'جلسات کوچینگ ۱ به ۱', sub: 'رزرو وقت و اهداف فصلی', icon: Calendar, color: 'text-blue-500 bg-blue-500/10' },
                                                        { id: 'shop' as ScreenId, title: 'فروشگاه و کتاب‌ها', sub: 'سبد خرید و کتابخانه PDF', icon: ShoppingBag, color: 'text-purple-500 bg-purple-500/10' },
                                                        { id: 'wallet' as ScreenId, title: 'کیف پول و مدارک', sub: 'موجودی و گواهینامه معتبر', icon: Award, color: 'text-amber-500 bg-amber-500/10' },
                                                        { id: 'support' as ScreenId, title: 'پشتیبانی و تیکت‌ها', sub: 'ارسال تیکت و چت زنده', icon: MessageSquare, color: 'text-rose-500 bg-rose-500/10' },
                                                    ].map((item) => {
                                                        const Icon = item.icon;
                                                        return (
                                                            <button
                                                                key={item.id}
                                                                onClick={() => setActiveScreen(item.id)}
                                                                className={`p-3 rounded-2xl border text-right transition flex items-start gap-2.5 ${surfaceCls} hover:border-emerald-500`}
                                                            >
                                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                                                    <Icon className="w-4 h-4" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-xs font-black truncate">{item.title}</div>
                                                                    <div className={`text-[9px] truncate ${mutedCls}`}>{item.sub}</div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* ========================================================
                                        SCREEN 2: COURSES & IN-APP LEARNING PLAYER
                                    ======================================================== */}
                                    {(activeScreen === 'courses' || activeScreen === 'learning') && (
                                        <div className="space-y-3">
                                            {/* Subtabs: All Courses vs My Enrolled Courses */}
                                            <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                                                <button
                                                    onClick={() => setCoursesFilter('all')}
                                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                                        coursesFilter === 'all'
                                                            ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white'
                                                            : 'text-slate-500'
                                                    }`}
                                                >
                                                    کاتالوگ دوره‌ها ({coursesList.length})
                                                </button>
                                                <button
                                                    onClick={() => setCoursesFilter('my')}
                                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                                        coursesFilter === 'my'
                                                            ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white'
                                                            : 'text-slate-500'
                                                    }`}
                                                >
                                                    دوره‌های من (۲ دوره)
                                                </button>
                                            </div>

                                            {/* IF IN LEARNING PLAYER MODE */}
                                            {activeScreen === 'learning' ? (
                                                <div className="space-y-3">
                                                    {/* Video Player Box */}
                                                    <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg space-y-2">
                                                        <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80"
                                                                alt="Video Poster"
                                                                className="w-full h-full object-cover opacity-75"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                                                            {/* Big Center Play/Pause Button */}
                                                            <button
                                                                onClick={() => setPlayingLesson(!playingLesson)}
                                                                className="absolute w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition"
                                                            >
                                                                {playingLesson ? (
                                                                    <Pause className="w-5 h-5 fill-current" />
                                                                ) : (
                                                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                                                )}
                                                            </button>

                                                            {/* Quality badge */}
                                                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                                                                1080p HD
                                                            </div>
                                                            {/* Bookmark toggle */}
                                                            <button
                                                                onClick={() => setIsBookmarked(!isBookmarked)}
                                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white"
                                                            >
                                                                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
                                                            </button>
                                                        </div>

                                                        {/* Player Controls & Title */}
                                                        <div className="p-3 space-y-2">
                                                            <div className="flex items-center justify-between text-[11px] text-white">
                                                                <span className="font-extrabold truncate max-w-[220px]">
                                                                    {currentCourse.lessons[currentLessonIndex]?.title || currentCourse.title}
                                                                </span>
                                                                <span className="text-[10px] text-emerald-400 font-mono">
                                                                    ۲۴:۳۰ / ۵۵:۰۰
                                                                </span>
                                                            </div>

                                                            {/* Interactive Scrubber */}
                                                            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden cursor-pointer">
                                                                <div className="h-full bg-emerald-500 rounded-full w-[45%]" />
                                                            </div>

                                                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                                                <span>مدرس: {currentCourse.instructor}</span>
                                                                <button
                                                                    onClick={() => setActiveScreen('quizzes')}
                                                                    className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold hover:bg-indigo-500/30"
                                                                >
                                                                    کوییز این جلسه ←
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Lesson Outline Checklist */}
                                                    <div className={`p-3 rounded-2xl border ${surfaceCls} space-y-2`}>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-black">سرفصل‌های دوره</span>
                                                            <span className={`text-[10px] ${mutedCls}`}>
                                                                {currentCourse.lessons.length} درس
                                                            </span>
                                                        </div>

                                                        <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                                                            {currentCourse.lessons.map((ls, idx) => (
                                                                <button
                                                                    key={ls.id}
                                                                    onClick={() => setCurrentLessonIndex(idx)}
                                                                    className={`w-full p-2 rounded-xl text-right text-xs transition flex items-center justify-between ${
                                                                        currentLessonIndex === idx
                                                                            ? 'bg-emerald-500/15 border border-emerald-500/40 font-extrabold text-emerald-700 dark:text-emerald-300'
                                                                            : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2 truncate">
                                                                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                                            {idx + 1}
                                                                        </span>
                                                                        <span className="truncate">{ls.title}</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-400 shrink-0">
                                                                        {ls.dur}
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Interactive Lesson Notes Box */}
                                                    <div className={`p-3 rounded-2xl border ${surfaceCls} space-y-2`}>
                                                        <span className="text-xs font-black flex items-center gap-1.5">
                                                            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                                                            یادداشت‌های شخصی من برای این درس
                                                        </span>

                                                        <div className="flex gap-1.5">
                                                            <input
                                                                type="text"
                                                                value={lessonNoteText}
                                                                onChange={(e) => setLessonNoteText(e.target.value)}
                                                                placeholder="نکته مهم را تایپ و ذخیره کنید..."
                                                                className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    if (!lessonNoteText.trim()) return;
                                                                    setSavedNotes((prev) => [lessonNoteText, ...prev]);
                                                                    setLessonNoteText('');
                                                                }}
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                                                            >
                                                                ثبت
                                                            </button>
                                                        </div>

                                                        {savedNotes.length > 0 && (
                                                            <div className="space-y-1 pt-1">
                                                                {savedNotes.map((nt, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300"
                                                                    >
                                                                        • {nt}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => setActiveScreen('courses')}
                                                        className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                                                    >
                                                        بازگشت به فهرست کامل دوره‌ها
                                                    </button>
                                                </div>
                                            ) : (
                                                /* COURSE LIST VIEW (Finka EdTech Style with Photography) */
                                                <div className="space-y-3">
                                                    {coursesList
                                                        .filter((c) => (coursesFilter === 'my' ? c.enrolled : true))
                                                        .map((c) => (
                                                            <div
                                                                key={c.id}
                                                                className={`rounded-2xl border ${surfaceCls} overflow-hidden shadow-sm hover:shadow-md transition`}
                                                            >
                                                                {/* Course Cover Photo with Badges */}
                                                                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                                                                    <img
                                                                        src={c.image}
                                                                        alt={c.title}
                                                                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                                                                    {/* Category Tag & Rating Pill */}
                                                                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                                                                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                                                                            {c.category}
                                                                        </span>
                                                                        <div className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow">
                                                                            <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                                                                            <span>{c.rating}</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Bottom Duration & Lessons */}
                                                                    <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-white text-[10px]">
                                                                        <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
                                                                            <Clock className="w-3 h-3 text-emerald-400" />
                                                                            {c.duration}
                                                                        </span>
                                                                        <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
                                                                            <BookOpen className="w-3 h-3 text-amber-300" />
                                                                            {c.lessonsCount} درس
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Course Details Content */}
                                                                <div className="p-3 space-y-2.5">
                                                                    <div className="text-xs font-black leading-snug">
                                                                        {c.title}
                                                                    </div>

                                                                    {/* Instructor Row with Avatar */}
                                                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                                                                        <div className="flex items-center gap-2">
                                                                            <img
                                                                                src={c.instructorAvatar}
                                                                                alt={c.instructor}
                                                                                className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                                            />
                                                                            <span className={`text-[11px] font-bold ${mutedCls}`}>
                                                                                {c.instructor}
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                                                            {c.price} ت
                                                                        </span>
                                                                    </div>

                                                                    {c.enrolled ? (
                                                                        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                                                                            <div className="flex justify-between text-[10px] text-slate-500">
                                                                                <span>پیشرفت شما:</span>
                                                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{c.progress}٪</span>
                                                                            </div>
                                                                            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                                                                <div
                                                                                    className="h-full bg-emerald-500 rounded-full"
                                                                                    style={{ width: `${c.progress}%` }}
                                                                                />
                                                                            </div>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedCourseId(c.id);
                                                                                    setActiveScreen('learning');
                                                                                }}
                                                                                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                                                                            >
                                                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                                                ورود به کلاس و تماشای دروس
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                                                                            <span className={`text-[10px] ${mutedCls}`}>پذیرش فعال دوره</span>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedCourseId(c.id);
                                                                                    setActiveScreen('learning');
                                                                                }}
                                                                                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
                                                                            >
                                                                                مشاهده سرفصل و ثبت‌نام
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN 3: QUIZZES & ASSIGNMENTS (آزمون‌ها و تمرینات)
                                    ======================================================== */}
                                    {activeScreen === 'quizzes' && (
                                        <div className="space-y-3">
                                            {/* Header Card */}
                                            <div className="rounded-2xl bg-gradient-to-l from-indigo-900 to-slate-900 text-white p-3.5 space-y-1 border border-indigo-500/30">
                                                <div className="text-xs font-black flex items-center gap-1.5">
                                                    <ClipboardCheck className="w-4 h-4 text-indigo-400" />
                                                    ارزیابی آموخته‌ها: کوییز و تکالیف هفتگی
                                                </div>
                                                <div className="text-[10px] text-indigo-200">
                                                    نمرات مستقیماً در پرونده تحصیلی و صدور گواهینامه نهایی ثبت می‌شود.
                                                </div>
                                            </div>

                                            {/* QUIZ INTERACTIVE BOX */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-3 shadow-sm`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black">کوییز آنلاین فصل دوم (تستی)</span>
                                                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                                                        ۲ سوال • نمره قبولی ۸۰٪
                                                    </span>
                                                </div>

                                                {quizQuestions.map((q, idx) => (
                                                    <div key={q.id} className="space-y-2 pt-1 border-t first:border-t-0 border-slate-200 dark:border-slate-800">
                                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                            {idx + 1}. {q.q}
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            {q.options.map((opt, optIdx) => (
                                                                <button
                                                                    key={optIdx}
                                                                    onClick={() =>
                                                                        setQuizAnswers((prev) => ({
                                                                            ...prev,
                                                                            [q.id]: optIdx,
                                                                        }))
                                                                    }
                                                                    className={`w-full p-2 rounded-xl text-right text-xs transition border ${
                                                                        quizAnswers[q.id] === optIdx
                                                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                                                                            : `${surfaceCls}`
                                                                    }`}
                                                                >
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                                {quizSubmitted ? (
                                                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center space-y-1">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                            <span>نتیجه آزمون: {quizScore}٪ — نمره قبولی را کسب کردید!</span>
                                                        </div>
                                                        <div className="text-[10px]">نمره در کارنامه آکادمی ذخیره شد.</div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            let correctCount = 0;
                                                            quizQuestions.forEach((q) => {
                                                                if (quizAnswers[q.id] === q.correct) correctCount++;
                                                            });
                                                            const score = Math.round((correctCount / quizQuestions.length) * 100);
                                                            setQuizScore(score);
                                                            setQuizSubmitted(true);
                                                        }}
                                                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
                                                    >
                                                        ثبت نهایی پاسخ‌ها و دریافت نتیجه
                                                    </button>
                                                )}
                                            </div>

                                            {/* HOMEWORK SUBMISSION BOX */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2.5 shadow-sm`}>
                                                <div className="text-xs font-black">ارسال تمرین جلسه ۴ (تشریحی)</div>
                                                <p className={`text-[11px] ${mutedCls}`}>
                                                    سوال تمرین: ماتریس تصمیم‌گیری خود را برای یکی از چالش‌های ۳ ماه آینده خود تکمیل کنید.
                                                </p>

                                                <textarea
                                                    value={assignmentText}
                                                    onChange={(e) => setAssignmentText(e.target.value)}
                                                    rows={3}
                                                    placeholder="متن پاسخ و تحلیل تمرین خود را اینجا بنویسید..."
                                                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none"
                                                />

                                                {assignmentSubmitted ? (
                                                    <div className="p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                        <span>تکلیف شما با موفقیت ارسال شد و در نوبت بررسی قرار گرفت.</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (!assignmentText.trim()) return;
                                                            setAssignmentSubmitted(true);
                                                        }}
                                                        className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                                                    >
                                                        ارسال تکلیف برای منتور
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN 4: COACHING 1-ON-1 & GOALS TRACKER
                                    ======================================================== */}
                                    {activeScreen === 'sessions' && (
                                        <div className="space-y-3">
                                            {/* Mentor Profile Header with Real Photograph */}
                                            <div className="rounded-2xl bg-gradient-to-l from-slate-900 to-blue-950 text-white p-3.5 space-y-2 border border-blue-500/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
                                                            alt="دکتر مهدی بیدی"
                                                            className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-slate-900">
                                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black flex items-center gap-1.5 text-white">
                                                            <span>دکتر مهدی بیدی</span>
                                                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-400 text-slate-950 font-black">
                                                                کوچ ارشد
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] text-blue-200 mt-0.5">
                                                            سیستم‌سازی ذهن و بهره‌وری کوانتومی کسب‌وکار
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ACTIVE BOOKED SESSIONS */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2.5 shadow-sm`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black">جلسات رزرو شده شما</span>
                                                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                                        {bookedSessions.length} جلسه فعال
                                                    </span>
                                                </div>

                                                {bookedSessions.map((s) => (
                                                    <div
                                                        key={s.id}
                                                        className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 space-y-2"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="text-xs font-black text-blue-900 dark:text-blue-200">
                                                                {s.topic}
                                                            </div>
                                                            <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-600 text-white font-bold">
                                                                {s.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                                                            زمان: <strong>{s.date}</strong> — {s.time}
                                                        </div>
                                                        <a
                                                            href={s.roomLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                                                        >
                                                            <Video className="w-3.5 h-3.5" />
                                                            ورود به اتاق اختصاصی Google Meet
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* INTERACTIVE BOOK NEW COACHING SESSION */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2.5 shadow-sm`}>
                                                <div className="text-xs font-black">رزرو وقت جلسه کوچینگ جدید</div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500">موضوع تمرکز جلسه</label>
                                                    <input
                                                        type="text"
                                                        value={newSessionTopic}
                                                        onChange={(e) => setNewSessionTopic(e.target.value)}
                                                        className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-500">تاریخ جلسه</label>
                                                        <select
                                                            value={newSessionDate}
                                                            onChange={(e) => setNewSessionDate(e.target.value)}
                                                            className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                        >
                                                            <option value="دوشنبه ۲۰ اردیبهشت">دوشنبه ۲۰ اردیبهشت</option>
                                                            <option value="چهارشنبه ۲۲ اردیبهشت">چهارشنبه ۲۲ اردیبهشت</option>
                                                            <option value="شنبه ۲۵ اردیبهشت">شنبه ۲۵ اردیبهشت</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-500">ساعت پیشنهادی</label>
                                                        <select
                                                            value={newSessionSlot}
                                                            onChange={(e) => setNewSessionSlot(e.target.value)}
                                                            className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                        >
                                                            <option value="ساعت ۱۵:۰۰ تا ۱۶:۰۰">۱۵:۰۰ تا ۱۶:۰۰</option>
                                                            <option value="ساعت ۱۶:۰۰ تا ۱۷:۰۰">۱۶:۰۰ تا ۱۷:۰۰</option>
                                                            <option value="ساعت ۱۸:۰۰ تا ۱۹:۰۰">۱۸:۰۰ تا ۱۹:۰۰</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {sessionBookingSuccess && (
                                                    <div className="p-2 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                        <span>درخواست رزرو شما ثبت شد و تاییدیه پیامک شد.</span>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        setBookedSessions((prev) => [
                                                            {
                                                                id: Date.now(),
                                                                coach: 'دکتر مهدی بیدی',
                                                                role: 'کوچ ارشد',
                                                                date: newSessionDate,
                                                                time: newSessionSlot,
                                                                status: 'تایید شده',
                                                                roomLink: 'https://meet.google.com/xyz-bahar',
                                                                topic: newSessionTopic,
                                                            },
                                                            ...prev,
                                                        ]);
                                                        setSessionBookingSuccess(true);
                                                        setTimeout(() => setSessionBookingSuccess(false), 2500);
                                                    }}
                                                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
                                                >
                                                    تایید و رزرو نهایی جلسه ۱ به ۱
                                                </button>
                                            </div>

                                            {/* 90-DAY GOALS CHECKLIST */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2 shadow-sm`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black">اهداف ۹۰ روزه توسعه فردی من</span>
                                                    <span className={`text-[10px] ${mutedCls}`}>چک‌لیست توافق با کوچ</span>
                                                </div>

                                                <div className="space-y-1.5">
                                                    {goalsList.map((g) => (
                                                        <button
                                                            key={g.id}
                                                            onClick={() =>
                                                                setGoalsList((prev) =>
                                                                    prev.map((item) =>
                                                                        item.id === g.id ? { ...item, done: !item.done } : item
                                                                    )
                                                                )
                                                            }
                                                            className={`w-full p-2.5 rounded-xl text-right text-xs transition flex items-center justify-between border ${
                                                                g.done
                                                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 line-through'
                                                                    : `${surfaceCls}`
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${g.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                                                    {g.done && <Check className="w-3 h-3 stroke-[3]" />}
                                                                </div>
                                                                <span>{g.title}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN 5: SHOP, CART, CHECKOUT & DIGITAL LIBRARY
                                    ======================================================== */}
                                    {activeScreen === 'shop' && (
                                        <div className="space-y-3">
                                            {/* Products Catalog */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between px-1">
                                                    <span className="text-xs font-black">فروشگاه کتاب و بسته‌های آموزشی</span>
                                                    <span className={`text-[10px] ${mutedCls}`}>۳ محصول</span>
                                                </div>

                                                {shopProducts.map((p) => (
                                                    <div
                                                        key={p.id}
                                                        className={`p-3 rounded-2xl border ${surfaceCls} flex items-center justify-between gap-3 shadow-sm`}
                                                    >
                                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400">
                                                                {p.type}
                                                            </span>
                                                            <div className="text-xs font-extrabold truncate">{p.title}</div>
                                                            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                                {p.price.toLocaleString('fa-IR')} تومان
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setCart((prev) => {
                                                                    const exists = prev.find((x) => x.id === p.id);
                                                                    if (exists) {
                                                                        return prev.map((x) =>
                                                                            x.id === p.id ? { ...x, qty: x.qty + 1 } : x
                                                                        );
                                                                    }
                                                                    return [...prev, { id: p.id, qty: 1 }];
                                                                });
                                                            }}
                                                            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shrink-0 shadow-sm"
                                                            title="افزودن به سبد"
                                                        >
                                                            <ShoppingCart className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* SHOPPING CART & CHECKOUT DRAWER */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2.5 shadow-sm`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black flex items-center gap-1.5">
                                                        <ShoppingCart className="w-3.5 h-3.5 text-purple-500" />
                                                        سبد خرید شما ({cart.reduce((a, b) => a + b.qty, 0)} آیتم)
                                                    </span>
                                                    {cart.length > 0 && (
                                                        <button
                                                            onClick={() => setCart([])}
                                                            className="text-[10px] text-rose-500 hover:underline"
                                                        >
                                                            خالی کردن سبد
                                                        </button>
                                                    )}
                                                </div>

                                                {cart.length === 0 ? (
                                                    <div className={`text-center py-4 text-xs ${mutedCls}`}>
                                                        سبد خرید شما در حال حاضر خالی است.
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Cart items list */}
                                                        <div className="space-y-1.5">
                                                            {cart.map((ci) => {
                                                                const prod = shopProducts.find((x) => x.id === ci.id);
                                                                if (!prod) return null;
                                                                return (
                                                                    <div
                                                                        key={ci.id}
                                                                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                                                                    >
                                                                        <span className="font-bold truncate max-w-[170px]">{prod.title}</span>
                                                                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                                                                            {(prod.price * ci.qty).toLocaleString('fa-IR')} ت
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Coupon Code Input */}
                                                        <div className="flex gap-1.5 pt-1">
                                                            <input
                                                                type="text"
                                                                value={couponCode}
                                                                onChange={(e) => setCouponCode(e.target.value)}
                                                                placeholder="کد تخفیف (مثال: BAHAR50)"
                                                                className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                            />
                                                            <button
                                                                onClick={applyCoupon}
                                                                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                                                            >
                                                                اعمال
                                                            </button>
                                                        </div>

                                                        {couponFeedback && (
                                                            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                                                {couponFeedback}
                                                            </div>
                                                        )}

                                                        {/* Price calculation */}
                                                        {(() => {
                                                            const rawTotal = cart.reduce((acc, ci) => {
                                                                const prod = shopProducts.find((x) => x.id === ci.id);
                                                                return acc + (prod ? prod.price * ci.qty : 0);
                                                            }, 0);
                                                            const discountAmount = rawTotal * couponDiscount;
                                                            const finalPay = rawTotal - discountAmount;
                                                            return (
                                                                <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                                                                    <div className="flex justify-between text-slate-500">
                                                                        <span>مجموع اقلام:</span>
                                                                        <span>{rawTotal.toLocaleString('fa-IR')} تومان</span>
                                                                    </div>
                                                                    {couponDiscount > 0 && (
                                                                        <div className="flex justify-between text-rose-500 font-bold">
                                                                            <span>تخفیف ویژه:</span>
                                                                            <span>-{discountAmount.toLocaleString('fa-IR')} تومان</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-200 dark:border-slate-800">
                                                                        <span>مبلغ نهایی قابل پرداخت:</span>
                                                                        <span className="text-emerald-600 dark:text-emerald-400">
                                                                            {finalPay.toLocaleString('fa-IR')} تومان
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}

                                                        {/* Payment Method & Checkout */}
                                                        <div className="space-y-1.5 pt-1">
                                                            <div className="text-[10px] font-bold text-slate-500">
                                                                شماره کارت آکادمی جهت واریز: ۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={receiptNumber}
                                                                onChange={(e) => setReceiptNumber(e.target.value)}
                                                                placeholder="شماره پیگیری فیش کارت به کارت..."
                                                                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                            />

                                                            {checkoutComplete ? (
                                                                <div className="p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5">
                                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                                    <span>سفارش شما ثبت شد و فایل‌ها در کتابخانه فعال گردید!</span>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        setCheckoutComplete(true);
                                                                        setCart([]);
                                                                        setTimeout(() => setCheckoutComplete(false), 3000);
                                                                    }}
                                                                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
                                                                >
                                                                    ثبت نهایی سفارش و دریافت دسترسی
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* DIGITAL LIBRARY DOWNLOADS */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2 shadow-sm`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black flex items-center gap-1.5">
                                                        <Download className="w-3.5 h-3.5 text-blue-500" />
                                                        کتابخانه فایل‌های دانلودی من
                                                    </span>
                                                    <span className={`text-[10px] ${mutedCls}`}>۳ فایل فعال</span>
                                                </div>

                                                <div className="space-y-1.5">
                                                    {purchasedLibrary.map((lib) => (
                                                        <div
                                                            key={lib.id}
                                                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                                                        >
                                                            <div className="min-w-0 pr-1">
                                                                <div className="font-extrabold truncate">{lib.title}</div>
                                                                <div className={`text-[10px] ${mutedCls}`}>{lib.format}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => alert(`دانلود فایل ${lib.title} آغاز شد.`)}
                                                                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                                                                title="دانلود"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN 6: WALLET & VERIFIED CERTIFICATES
                                    ======================================================== */}
                                    {activeScreen === 'wallet' && (
                                        <div className="space-y-3">
                                            {/* Wallet Balance Card */}
                                            <div className="rounded-2xl bg-gradient-to-l from-amber-600 via-amber-500 to-amber-700 text-slate-950 p-4 space-y-3 shadow-md">
                                                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                                    <span>کیف پول اعتباری آکادمی</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black">
                                                        عضو VIP
                                                    </span>
                                                </div>

                                                <div>
                                                    <div className="text-2xl font-black">
                                                        {walletBalance.toLocaleString('fa-IR')}{' '}
                                                        <span className="text-xs font-normal">تومان</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-900/80 mt-0.5">
                                                        قابل استفاده برای پرداخت دوره‌ها، کتاب‌ها و جلسات ۱ به ۱
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setTopUpModal(!topUpModal)}
                                                    className="w-full py-2 rounded-xl bg-slate-950 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                                                >
                                                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                                                    افزایش موجودی کیف پول
                                                </button>
                                            </div>

                                            {topUpModal && (
                                                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/40 space-y-2">
                                                    <div className="text-xs font-black text-amber-900 dark:text-amber-300">
                                                        انتخاب مبلغ شارژ:
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-1.5">
                                                        {[500000, 1000000, 2000000].map((amt) => (
                                                            <button
                                                                key={amt}
                                                                onClick={() => {
                                                                    setWalletBalance((prev) => prev + amt);
                                                                    setWalletTransactions((prev) => [
                                                                        {
                                                                            id: Date.now(),
                                                                            title: 'افزایش موجودی آنلاین',
                                                                            amount: `+${amt.toLocaleString('fa-IR')} ت`,
                                                                            date: 'امروز',
                                                                            type: 'credit',
                                                                        },
                                                                        ...prev,
                                                                    ]);
                                                                    setTopUpModal(false);
                                                                }}
                                                                className="py-1.5 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30 text-xs font-bold"
                                                            >
                                                                +{(amt / 1000).toLocaleString('fa-IR')} هـ.ت
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Transaction History */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2 shadow-sm`}>
                                                <div className="text-xs font-black">گردش حساب و تراکنش‌های اخیر</div>
                                                <div className="space-y-1.5">
                                                    {walletTransactions.map((tx) => (
                                                        <div
                                                            key={tx.id}
                                                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                                                        >
                                                            <div>
                                                                <div className="font-extrabold">{tx.title}</div>
                                                                <div className={`text-[10px] ${mutedCls}`}>{tx.date}</div>
                                                            </div>
                                                            <span
                                                                className={`font-black ${
                                                                    tx.type === 'credit'
                                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-rose-500'
                                                                }`}
                                                            >
                                                                {tx.amount}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Official Certificates */}
                                            <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2.5 shadow-sm`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black flex items-center gap-1.5">
                                                        <Award className="w-4 h-4 text-amber-500" />
                                                        گواهینامه‌های رسمی صادر شده
                                                    </span>
                                                    <span className="text-[10px] text-emerald-600 font-bold">۱ مدرک</span>
                                                </div>

                                                {issuedCertificates.map((cert) => (
                                                    <div
                                                        key={cert.id}
                                                        className="p-3.5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent space-y-2.5 relative overflow-hidden"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                                                                <Award className="w-6 h-6 stroke-[2.2]" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                                                                    {cert.title}
                                                                </div>
                                                                <div className={`text-[10px] ${mutedCls} mt-1`}>
                                                                    شناسه رسمی: <strong className="font-mono text-amber-600 dark:text-amber-400">{cert.id}</strong>
                                                                </div>
                                                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                                                    صادرکننده: {cert.issuer}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 pt-1 border-t border-amber-500/20">
                                                            <button
                                                                onClick={() => alert(`دانلود فایل PDF گواهینامه رسمی ${cert.id} آغاز شد.`)}
                                                                className="flex-1 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                                دانلود PDF با هولوگرام
                                                            </button>
                                                            <button
                                                                onClick={() => alert(`گواهینامه ${cert.id} در سامانه ملی استعلام مدارک تایید شده است.`)}
                                                                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50"
                                                            >
                                                                استعلام آنلاین
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN 7: SUPPORT TICKETS & LIVE CHAT
                                    ======================================================== */}
                                    {activeScreen === 'support' && (
                                        <div className="space-y-3">
                                            {/* Support Subtabs: Tickets vs Live Chat */}
                                            <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                                                <button
                                                    onClick={() => setSupportTab('tickets')}
                                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                                        supportTab === 'tickets'
                                                            ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white'
                                                            : 'text-slate-500'
                                                    }`}
                                                >
                                                    تیکت‌های رسمی ({userTickets.length})
                                                </button>
                                                <button
                                                    onClick={() => setSupportTab('chat')}
                                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                                        supportTab === 'chat'
                                                            ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white'
                                                            : 'text-slate-500'
                                                    }`}
                                                >
                                                    چت زنده و هوشمند
                                                </button>
                                            </div>

                                            {supportTab === 'tickets' ? (
                                                <div className="space-y-3">
                                                    {/* Existing Tickets List */}
                                                    <div className="space-y-2">
                                                        {userTickets.map((tk) => (
                                                            <div
                                                                key={tk.id}
                                                                className={`p-3 rounded-2xl border ${surfaceCls} space-y-1.5`}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div className="text-xs font-black">{tk.subject}</div>
                                                                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/15 text-emerald-600 font-bold">
                                                                        {tk.status}
                                                                    </span>
                                                                </div>
                                                                <div className={`text-[10px] ${mutedCls}`}>
                                                                    واحد: {tk.dept} • شماره تیکت: #{tk.id}
                                                                </div>
                                                                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300">
                                                                    {tk.messages[tk.messages.length - 1]?.text}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Open New Ticket Form */}
                                                    <div className={`p-3.5 rounded-2xl border ${surfaceCls} space-y-2.5 shadow-sm`}>
                                                        <div className="text-xs font-black">ثبت تیکت پشتیبانی جدید</div>
                                                        <input
                                                            type="text"
                                                            value={newTicketSubject}
                                                            onChange={(e) => setNewTicketSubject(e.target.value)}
                                                            placeholder="موضوع تیکت (مثلاً سوال در مورد ویدیو)"
                                                            className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                        />
                                                        <select
                                                            value={newTicketDept}
                                                            onChange={(e) => setNewTicketDept(e.target.value)}
                                                            className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                        >
                                                            <option value="آموزشی">واحد آموزش و اساتید</option>
                                                            <option value="فنی">واحد فنی و وب‌سایت</option>
                                                            <option value="مالی">واحد مالی و فاکتورها</option>
                                                            <option value="کوچینگ">واحد هماهنگی کوچینگ</option>
                                                        </select>
                                                        <textarea
                                                            value={newTicketMessage}
                                                            onChange={(e) => setNewTicketMessage(e.target.value)}
                                                            rows={2}
                                                            placeholder="توضیحات درخواست خود را تایپ کنید..."
                                                            className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;
                                                                setUserTickets((prev) => [
                                                                    {
                                                                        id: Date.now(),
                                                                        subject: newTicketSubject,
                                                                        dept: newTicketDept,
                                                                        status: 'در حال بررسی',
                                                                        messages: [{ sender: 'user', text: newTicketMessage, time: 'هم‌اکنون' }],
                                                                    },
                                                                    ...prev,
                                                                ]);
                                                                setNewTicketSubject('');
                                                                setNewTicketMessage('');
                                                            }}
                                                            className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                                                        >
                                                            ارسال تیکت به کارشناس
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* LIVE CHAT INTERFACE */
                                                <div className={`p-3 rounded-2xl border ${surfaceCls} flex flex-col h-[480px] shadow-sm`}>
                                                    <div className="flex-1 overflow-y-auto space-y-2 p-1">
                                                        {liveChatMessages.map((msg, i) => (
                                                            <div
                                                                key={i}
                                                                className={`flex flex-col ${
                                                                    msg.sender === 'user' ? 'items-end' : 'items-start'
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`max-w-[80%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                                                                        msg.sender === 'user'
                                                                            ? 'bg-emerald-600 text-white rounded-br-none'
                                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                                                                    }`}
                                                                >
                                                                    {msg.text}
                                                                </div>
                                                                <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                                                                    {msg.time}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                                                        <input
                                                            type="text"
                                                            value={liveChatInput}
                                                            onChange={(e) => setLiveChatInput(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && sendLiveChatMessage()}
                                                            placeholder="پیام خود را تایپ کنید..."
                                                            className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                        />
                                                        <button
                                                            onClick={sendLiveChatMessage}
                                                            className="p-2 rounded-xl bg-emerald-600 text-white"
                                                        >
                                                            <SendHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN 8: FULL IN-APP ADMIN PANEL (۱۰۰٪ دسترسی‌های ادمین سایت)
                                    ======================================================== */}
                                    {activeScreen === 'admin' && (
                                        <div className="space-y-3">
                                            {/* Admin In-App Header & Live KPIs */}
                                            <div className="rounded-2xl bg-gradient-to-l from-slate-900 to-[#0B3B2B] text-white p-3.5 border border-amber-400/50 space-y-3 shadow-lg">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black">
                                                        ADMIN CONTROL HUB
                                                    </span>
                                                    <span className="text-[10px] text-emerald-200 font-bold flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                        دسترسی کامل مدیریتی بدون نیاز به سایت
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-4 gap-1.5 text-center">
                                                    <div className="rounded-xl bg-white/10 p-2">
                                                        <div className="text-xs font-black text-amber-300">۱۸۴M</div>
                                                        <div className="text-[9px] text-slate-300">فروش ماه</div>
                                                    </div>
                                                    <div className="rounded-xl bg-white/10 p-2">
                                                        <div className="text-xs font-black text-amber-300">۱,۴۲۰</div>
                                                        <div className="text-[9px] text-slate-300">کاربران</div>
                                                    </div>
                                                    <div className="rounded-xl bg-white/10 p-2">
                                                        <div className="text-xs font-black text-amber-300">۳۴</div>
                                                        <div className="text-[9px] text-slate-300">لید جدید</div>
                                                    </div>
                                                    <div className="rounded-xl bg-white/10 p-2">
                                                        <div className="text-xs font-black text-amber-300">{pendingInvoices.length}</div>
                                                        <div className="text-[9px] text-slate-300">فیش منتظر</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Admin Sub-Tabs Navigation Inside Mobile */}
                                            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                                                {[
                                                    { id: 'overview' as AdminSubTab, label: 'پیشخوان و آمار' },
                                                    { id: 'courses' as AdminSubTab, label: 'مدیریت دوره‌ها' },
                                                    { id: 'orders' as AdminSubTab, label: 'سفارش‌ها و فیش‌ها' },
                                                    { id: 'users' as AdminSubTab, label: 'کاربران و نقش‌ها' },
                                                    { id: 'crm' as AdminSubTab, label: 'پایپ‌لاین CRM' },
                                                    { id: 'discounts' as AdminSubTab, label: 'کدهای تخفیف' },
                                                    { id: 'automations' as AdminSubTab, label: 'ارسال و ربات‌ها' },
                                                    { id: 'tickets' as AdminSubTab, label: 'پاسخ به تیکت‌ها' },
                                                    { id: 'site_switches' as AdminSubTab, label: 'سوئیچ‌های سایت' },
                                                ].map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setAdminSubTab(t.id)}
                                                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
                                                            adminSubTab === t.id
                                                                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                                                                : `${surfaceCls}`
                                                        }`}
                                                    >
                                                        {t.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* SUBTAB 1: OVERVIEW */}
                                            {adminSubTab === 'overview' && (
                                                <div className="space-y-2.5">
                                                    <div className={`rounded-2xl p-3 border ${surfaceCls} space-y-2`}>
                                                        <div className="text-xs font-black flex items-center justify-between">
                                                            <span>نمودار فروش روزانه (۷ روز اخیر)</span>
                                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                                                +۲۴٪ رشد هفتگی
                                                            </span>
                                                        </div>
                                                        <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-1">
                                                            {[
                                                                { day: 'ش', h: '45%' },
                                                                { day: 'ی', h: '60%' },
                                                                { day: 'د', h: '35%' },
                                                                { day: 'س', h: '75%' },
                                                                { day: 'چ', h: '90%' },
                                                                { day: 'پ', h: '80%' },
                                                                { day: 'ج', h: '50%' },
                                                            ].map((b) => (
                                                                <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
                                                                    <div
                                                                        className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-amber-400 transition-all"
                                                                        style={{ height: b.h }}
                                                                    />
                                                                    <span className="text-[9px] text-slate-400">{b.day}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className={`rounded-2xl p-3 border ${surfaceCls} space-y-2`}>
                                                        <div className="text-xs font-black">عملیات پرتکرار ادمین</div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <button
                                                                onClick={() => setAdminSubTab('courses')}
                                                                className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right text-xs font-bold text-emerald-700 dark:text-emerald-400"
                                                            >
                                                                + ثبت دوره جدید
                                                            </button>
                                                            <button
                                                                onClick={() => setAdminSubTab('orders')}
                                                                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right text-xs font-bold text-amber-700 dark:text-amber-400"
                                                            >
                                                                تایید فیش‌های کارت به کارت
                                                            </button>
                                                            <button
                                                                onClick={() => setAdminSubTab('crm')}
                                                                className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-right text-xs font-bold text-blue-700 dark:text-blue-400"
                                                            >
                                                                پیگیری سرنخ‌های جدید
                                                            </button>
                                                            <button
                                                                onClick={() => setAdminSubTab('automations')}
                                                                className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-right text-xs font-bold text-purple-700 dark:text-purple-400"
                                                            >
                                                                ارسال پیامک اطلاع‌رسانی
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* SUBTAB 2: COURSES MANAGEMENT CRUD */}
                                            {adminSubTab === 'courses' && (
                                                <div className="space-y-2.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black">دوره‌های فعال ({adminCourses.length})</span>
                                                        <button
                                                            onClick={() => setNewCourseModalOpen(!newCourseModalOpen)}
                                                            className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                            افزودن دوره
                                                        </button>
                                                    </div>

                                                    {newCourseModalOpen && (
                                                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                                                            <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                                                                فرم ثبت دوره جدید
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={newCourseTitle}
                                                                onChange={(e) => setNewCourseTitle(e.target.value)}
                                                                placeholder="عنوان دوره آموزشی..."
                                                                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                            />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={newCoursePrice}
                                                                    onChange={(e) => setNewCoursePrice(e.target.value)}
                                                                    placeholder="قیمت (تومان)"
                                                                    className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={newCourseCat}
                                                                    onChange={(e) => setNewCourseCat(e.target.value)}
                                                                    placeholder="دسته‌بندی"
                                                                    className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 pt-1">
                                                                <button
                                                                    onClick={() => {
                                                                        if (!newCourseTitle.trim()) return;
                                                                        setAdminCourses((prev) => [
                                                                            {
                                                                                id: Date.now(),
                                                                                title: newCourseTitle,
                                                                                price: newCoursePrice,
                                                                                category: newCourseCat,
                                                                                students: 0,
                                                                                published: true,
                                                                            },
                                                                            ...prev,
                                                                        ]);
                                                                        setNewCourseTitle('');
                                                                        setNewCourseModalOpen(false);
                                                                    }}
                                                                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                                                                >
                                                                    ذخیره و انتشار
                                                                </button>
                                                                <button
                                                                    onClick={() => setNewCourseModalOpen(false)}
                                                                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                                                                >
                                                                    انصراف
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {adminCourses.map((c) => (
                                                        <div key={c.id} className={`p-3 rounded-2xl border ${surfaceCls} space-y-2`}>
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <div className="text-xs font-extrabold">{c.title}</div>
                                                                    <div className={`text-[10px] mt-0.5 ${mutedCls}`}>
                                                                        {c.category} • {c.students} دانش‌پذیر
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() =>
                                                                        setAdminCourses((prev) =>
                                                                            prev.map((item) =>
                                                                                item.id === c.id
                                                                                    ? { ...item, published: !item.published }
                                                                                    : item
                                                                            )
                                                                        )
                                                                    }
                                                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                                        c.published
                                                                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                                                    }`}
                                                                >
                                                                    {c.published ? (
                                                                        <span className="flex items-center gap-1">
                                                                            <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                                                            منتشر شده
                                                                        </span>
                                                                    ) : (
                                                                        'پیش‌نویس'
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-xs">
                                                                <span className="font-black text-emerald-600 dark:text-emerald-400">
                                                                    {c.price} تومان
                                                                </span>
                                                                <button
                                                                    onClick={() => {
                                                                        const p = prompt('قیمت جدید را وارد کنید (تومان):', c.price);
                                                                        if (p) {
                                                                            setAdminCourses((prev) =>
                                                                                prev.map((x) =>
                                                                                    x.id === c.id ? { ...x, price: p } : x
                                                                                )
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                                                                >
                                                                    تغییر قیمت
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* SUBTAB 3: ORDERS & RECEIPTS */}
                                            {adminSubTab === 'orders' && (
                                                <div className="space-y-2.5">
                                                    <div className="text-xs font-black">
                                                        فیش‌های کارت‌به‌کارت در انتظار تایید ({pendingInvoices.length})
                                                    </div>
                                                    {pendingInvoices.length === 0 ? (
                                                        <div className={`text-center py-4 text-xs ${mutedCls}`}>
                                                            هیچ فیش معلقی وجود ندارد. تمام سفارش‌ها تایید شده‌اند.
                                                        </div>
                                                    ) : (
                                                        pendingInvoices.map((inv) => (
                                                            <div key={inv.id} className={`p-3 rounded-2xl border ${surfaceCls} space-y-2`}>
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <div className="text-xs font-extrabold">{inv.user}</div>
                                                                        <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                                            {inv.amount}
                                                                        </div>
                                                                    </div>
                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600">
                                                                        #{inv.id}
                                                                    </span>
                                                                </div>
                                                                <div className={`text-[10px] ${mutedCls}`}>روش: {inv.method}</div>
                                                                <div className="flex gap-2 pt-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            setPendingInvoices((prev) => prev.filter((x) => x.id !== inv.id));
                                                                            alert(`فاکتور ${inv.id} برای ${inv.user} تایید شد و دسترسی دوره بلافاصله باز شد.`);
                                                                        }}
                                                                        className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm"
                                                                    >
                                                                        <Check className="w-3 h-3 stroke-[2.5]" />
                                                                        <span>تایید فیش و بازگشایی دسترسی</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setPendingInvoices((prev) => prev.filter((x) => x.id !== inv.id));
                                                                        }}
                                                                        className="px-3 py-1 rounded-lg bg-rose-500/15 text-rose-600 text-[10px] font-bold"
                                                                    >
                                                                        رد فیش
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}

                                            {/* SUBTAB 4: USERS & RBAC */}
                                            {adminSubTab === 'users' && (
                                                <div className="space-y-2.5">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-black">مدیریت کاربران و نقش‌ها</label>
                                                        <input
                                                            type="text"
                                                            value={userSearchText}
                                                            onChange={(e) => setUserSearchText(e.target.value)}
                                                            placeholder="جستجوی نام یا ایمیل دانش‌پذیر..."
                                                            className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        {adminUsers
                                                            .filter((u) => u.name.includes(userSearchText) || u.email.includes(userSearchText))
                                                            .map((u) => (
                                                                <div key={u.id} className={`p-2.5 rounded-xl border ${surfaceCls} space-y-1`}>
                                                                    <div className="flex items-start justify-between">
                                                                        <div>
                                                                            <div className="text-xs font-bold">{u.name}</div>
                                                                            <div className={`text-[10px] ${mutedCls}`}>{u.email}</div>
                                                                        </div>
                                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400">
                                                                            {u.role}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-[10px]">
                                                                        <span>موجودی کیف: {u.wallet} ت</span>
                                                                        <button
                                                                            onClick={() => {
                                                                                const r = prompt('نقش جدید کاربر (دانش‌پذیر VIP / منتور / مدیر):', u.role);
                                                                                if (r) {
                                                                                    setAdminUsers((prev) =>
                                                                                        prev.map((x) => (x.id === u.id ? { ...x, role: r } : x))
                                                                                    );
                                                                                }
                                                                            }}
                                                                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                                                        >
                                                                            تغییر سطح دسترسی
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* SUBTAB 5: CRM & LEADS PIPELINE */}
                                            {adminSubTab === 'crm' && (
                                                <div className="space-y-2.5">
                                                    <div className="text-xs font-black">پایپ‌لاین سرنخ‌های فروش (CRM)</div>
                                                    <div className="space-y-2">
                                                        {leads.map((l) => (
                                                            <div key={l.id} className={`p-3 rounded-2xl border ${surfaceCls} space-y-1.5`}>
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <div className="text-xs font-extrabold">{l.name}</div>
                                                                        <div className={`text-[10px] ${mutedCls}`}>
                                                                            تلفن: {l.phone} • دوره: {l.course}
                                                                        </div>
                                                                    </div>
                                                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                                                                        {l.stage}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2 pt-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            setLeads((prev) =>
                                                                                prev.map((item) =>
                                                                                    item.id === l.id ? { ...item, stage: 'ثبت‌نام قطعی' } : item
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="flex-1 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold"
                                                                    >
                                                                        انتقال به ثبت‌نام قطعی
                                                                    </button>
                                                                    <a
                                                                        href={`tel:${l.phone}`}
                                                                        className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs flex items-center justify-center"
                                                                        title="تماس"
                                                                    >
                                                                        <PhoneCall className="w-3.5 h-3.5" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* SUBTAB 6: DISCOUNTS & FINANCE */}
                                            {adminSubTab === 'discounts' && (
                                                <div className="space-y-2.5">
                                                    <div className="text-xs font-black">کدهای تخفیف فعال آکادمی</div>

                                                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-500/30 space-y-2">
                                                        <div className="text-xs font-bold text-purple-900 dark:text-purple-300">
                                                            ایجاد کد تخفیف جدید
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <input
                                                                type="text"
                                                                value={newCodeName}
                                                                onChange={(e) => setNewCodeName(e.target.value)}
                                                                placeholder="کد (مثال: NOROOZ)"
                                                                className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={newCodePercent}
                                                                onChange={(e) => setNewCodePercent(e.target.value)}
                                                                placeholder="درصد (مثال: ۴۰٪)"
                                                                className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                if (!newCodeName.trim()) return;
                                                                setDiscountCodes((prev) => [
                                                                    { id: Date.now(), code: newCodeName.toUpperCase(), percent: newCodePercent, count: '۰/۱۰۰', active: true },
                                                                    ...prev,
                                                                ]);
                                                                setNewCodeName('');
                                                            }}
                                                            className="w-full py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                                                        >
                                                            ذخیره و فعال‌سازی کد
                                                        </button>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        {discountCodes.map((dc) => (
                                                            <div key={dc.id} className={`p-2.5 rounded-xl border ${surfaceCls} flex items-center justify-between text-xs`}>
                                                                <div>
                                                                    <span className="font-mono font-black">{dc.code}</span>
                                                                    <span className="text-[10px] text-purple-600 mr-2 font-bold">{dc.percent} تخفیف</span>
                                                                </div>
                                                                <span className="text-[10px] text-slate-400">استفاده: {dc.count}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* SUBTAB 7: AUTOMATIONS & BROADCAST */}
                                            {adminSubTab === 'automations' && (
                                                <div className="space-y-3">
                                                    <div className={`p-3 rounded-2xl border ${surfaceCls} space-y-2`}>
                                                        <div className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                                                            <Megaphone className="w-3.5 h-3.5" />
                                                            ارسال سریع پیامک و اعلان سراسری به دانشجویان
                                                        </div>
                                                        <textarea
                                                            value={broadcastText}
                                                            onChange={(e) => setBroadcastText(e.target.value)}
                                                            rows={2}
                                                            placeholder="متن پیامک اطلاع‌رسانی را تایپ کنید..."
                                                            className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                if (!broadcastText.trim()) return;
                                                                setBroadcastSent(true);
                                                                setTimeout(() => {
                                                                    setBroadcastSent(false);
                                                                    setBroadcastText('');
                                                                }, 2000);
                                                            }}
                                                            className="w-full py-2 rounded-xl bg-[#2481CC] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                                                        >
                                                            {broadcastSent ? (
                                                                <>
                                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                                    <span>پیامک با موفقیت به همه ارسال شد</span>
                                                                </>
                                                            ) : (
                                                                'ارسال انبوه از طریق سامانه کاوه‌نگار'
                                                            )}
                                                        </button>
                                                    </div>

                                                    <div className={`p-3 rounded-2xl border ${surfaceCls} space-y-2`}>
                                                        <div className="text-xs font-black">وضعیت سامانه‌های متصل</div>
                                                        {[
                                                            { key: 'smsKavenegar' as const, label: 'سامانه پیامک خدماتی کاوه‌نگار' },
                                                            { key: 'perslineWebhook' as const, label: 'وب‌هوک فرم پرس‌لاین (تبدیل به لید)' },
                                                        ].map((bot) => (
                                                            <div key={bot.key} className="flex items-center justify-between py-1 border-b last:border-b-0 border-slate-200 dark:border-slate-800">
                                                                <span className="text-xs font-semibold">{bot.label}</span>
                                                                <button
                                                                    onClick={() =>
                                                                        setBotSwitches((prev) => ({
                                                                            ...prev,
                                                                            [bot.key]: !prev[bot.key],
                                                                        }))
                                                                    }
                                                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                                        botSwitches[bot.key]
                                                                            ? 'bg-emerald-600 text-white'
                                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                                                    }`}
                                                                >
                                                                    {botSwitches[bot.key] ? 'فعال' : 'خاموش'}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* SUBTAB 8: TICKETS RESOLUTION */}
                                            {adminSubTab === 'tickets' && (
                                                <div className="space-y-2.5">
                                                    <div className="text-xs font-black">میز پاسخگویی تیکت‌های پشتیبانی</div>
                                                    {adminTickets.map((tk) => (
                                                        <div key={tk.id} className={`p-3 rounded-2xl border ${surfaceCls} space-y-2`}>
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <div className="text-xs font-extrabold">#{tk.id} — {tk.subject}</div>
                                                                    <div className={`text-[10px] ${mutedCls}`}>
                                                                        کاربر: {tk.user} • واحد: {tk.dept}
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                        tk.status === 'باز'
                                                                            ? 'bg-rose-500/15 text-rose-600'
                                                                            : 'bg-emerald-500/15 text-emerald-600'
                                                                    }`}
                                                                >
                                                                    {tk.status}
                                                                </span>
                                                            </div>

                                                            {tk.reply ? (
                                                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300">
                                                                    <strong>پاسخ شما:</strong> {tk.reply}
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
                                                                    <input
                                                                        type="text"
                                                                        value={selectedAdminTicketId === tk.id ? adminReplyText : ''}
                                                                        onChange={(e) => {
                                                                            setSelectedAdminTicketId(tk.id);
                                                                            adminReplyText;
                                                                            setAdminReplyText(e.target.value);
                                                                        }}
                                                                        placeholder="پاسخ مستقیم خود به کاربر را بنویسید..."
                                                                        className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            if (!adminReplyText.trim()) return;
                                                                            setAdminTickets((prev) =>
                                                                                prev.map((item) =>
                                                                                    item.id === tk.id
                                                                                        ? { ...item, status: 'پاسخ داده شد', reply: adminReplyText }
                                                                                        : item
                                                                                )
                                                                            );
                                                                            setAdminReplyText('');
                                                                        }}
                                                                        className="w-full py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold"
                                                                    >
                                                                        ارسال پاسخ مستقیم و بستن تیکت
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* SUBTAB 9: SITE MASTER SWITCHES */}
                                            {adminSubTab === 'site_switches' && (
                                                <div className={`p-3 rounded-2xl border ${surfaceCls} space-y-3`}>
                                                    <div className="text-xs font-black">سوئیچ‌های کلان سرور و پلتفرم وب</div>
                                                    {[
                                                        { key: 'maintenanceMode' as const, label: 'حالت تعمیر و نگهداری سایت', desc: 'مسدودسازی موقت دسترسی کاربران عادی برای ارتقا سرور' },
                                                        { key: 'openRegistration' as const, label: 'پذیرش ثبت‌نام اعضای جدید', desc: 'فعال بودن فرم عضویت و ارسال پیامک کد تایید' },
                                                        { key: 'pushNotifications' as const, label: 'نوتیفیکیشن‌های سراسری موبایل', desc: 'ارسال اعلان فوری به تمام نصب‌کنندگان اپلیکیشن' },
                                                    ].map((sw) => (
                                                        <div key={sw.key} className="flex items-center justify-between py-2 border-b last:border-b-0 border-slate-200 dark:border-slate-800">
                                                            <div className="max-w-[240px]">
                                                                <div className="text-xs font-bold">{sw.label}</div>
                                                                <div className={`text-[10px] ${mutedCls} mt-0.5`}>{sw.desc}</div>
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    setBotSwitches((prev) => ({
                                                                        ...prev,
                                                                        [sw.key]: !prev[sw.key],
                                                                    }))
                                                                }
                                                                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                                                    botSwitches[sw.key]
                                                                        ? 'bg-amber-400 text-slate-950 font-black'
                                                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                                                }`}
                                                            >
                                                                {botSwitches[sw.key] ? 'فعال' : 'غیرفعال'}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN 9: BRANDING & THEME SETTINGS (تنظیمات نام و لوگو)
                                    ======================================================== */}
                                    {activeScreen === 'settings' && (
                                        <div className="space-y-3">
                                            <div className={`p-4 rounded-3xl border ${surfaceCls} space-y-3 shadow-sm`}>
                                                <div className="flex items-center gap-2">
                                                    <Palette className="w-4 h-4 text-purple-500" />
                                                    <span className="text-xs font-black">شخصی‌سازی نام و برندینگ اپلیکیشن</span>
                                                </div>
                                                <p className={`text-[11px] ${mutedCls}`}>
                                                    تغییرات شما بلافاصله در هدر گوشی، لوگو، کارت‌ها و تم سراسر اپلیکیشن اعمال و ذخیره می‌شود.
                                                </p>

                                                {brandingSavedNotice && (
                                                    <div className="p-2 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center animate-bounce flex items-center justify-center gap-1.5">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>نام، لوگو و تم اپلیکیشن با موفقیت به‌روزرسانی شد!</span>
                                                    </div>
                                                )}

                                                {/* App Name Input */}
                                                <div className="space-y-1">
                                                    <label className="text-[11px] font-bold">نام اصلی اپلیکیشن</label>
                                                    <input
                                                        type="text"
                                                        value={appName}
                                                        onChange={(e) => setAppName(e.target.value)}
                                                        placeholder="مثال: بهار زندگی، آکادمی رشد و..."
                                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    />
                                                </div>

                                                {/* App Tagline Input */}
                                                <div className="space-y-1">
                                                    <label className="text-[11px] font-bold">شعار / زیرعنوان اپلیکیشن</label>
                                                    <input
                                                        type="text"
                                                        value={appTagline}
                                                        onChange={(e) => setAppTagline(e.target.value)}
                                                        placeholder="مثال: آکادمی تخصصی کوچینگ و سیستم‌سازی ذهن"
                                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    />
                                                </div>

                                                {/* Logo Style Selector (100% Vector Icons, No Emojis) */}
                                                <div className="space-y-1.5 pt-1">
                                                    <label className="text-[11px] font-bold">انتخاب آیکون و استایل لوگو</label>
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {[
                                                            { id: 'lotus' as LogoStyle, label: 'لوتوس' },
                                                            { id: 'crown' as LogoStyle, label: 'پریمیوم' },
                                                            { id: 'crystal' as LogoStyle, label: 'کریستال' },
                                                            { id: 'eagle' as LogoStyle, label: 'پیشرفت' },
                                                            { id: 'star' as LogoStyle, label: 'مونوگرام' },
                                                        ].map((l) => (
                                                            <button
                                                                key={l.id}
                                                                onClick={() => setLogoStyle(l.id)}
                                                                className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                                                                    logoStyle === l.id
                                                                        ? 'border-purple-500 bg-purple-500/15 ring-2 ring-purple-400'
                                                                        : `${surfaceCls}`
                                                                }`}
                                                            >
                                                                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                                                    {l.id === 'lotus' && <Sparkles className="w-4 h-4 text-rose-500" />}
                                                                    {l.id === 'crown' && <Award className="w-4 h-4 text-amber-500" />}
                                                                    {l.id === 'crystal' && <Zap className="w-4 h-4 text-cyan-500" />}
                                                                    {l.id === 'eagle' && <TrendingUp className="w-4 h-4 text-purple-500" />}
                                                                    {l.id === 'star' && <span className="font-black text-xs text-emerald-600">ب</span>}
                                                                </div>
                                                                <span className="text-[9px] font-bold">{l.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Monogram Letter if Star/Monogram chosen */}
                                                {logoStyle === 'star' && (
                                                    <div className="space-y-1 pt-1">
                                                        <label className="text-[11px] font-bold">حرف مونوگرام روی لوگو</label>
                                                        <input
                                                            type="text"
                                                            maxLength={2}
                                                            value={customMonogram}
                                                            onChange={(e) => setCustomMonogram(e.target.value)}
                                                            className="w-16 text-center text-sm font-black p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                                                        />
                                                    </div>
                                                )}

                                                {/* Theme Selector (Strictly 2 Themes: Day & Night matching website) */}
                                                <div className="space-y-2 pt-1">
                                                    <label className="text-[11px] font-bold block text-slate-800 dark:text-slate-200">
                                                        انتخاب تم سوپر اپلیکیشن (منطبق بر تم وب‌سایت)
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setThemePalette('day');
                                                                setAppDark(false);
                                                            }}
                                                            className={`p-2.5 rounded-2xl border text-right transition flex flex-col justify-between gap-1.5 ${
                                                                !appDark && themePalette === 'day'
                                                                    ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500'
                                                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <Sun className="w-4 h-4 text-amber-500" />
                                                                {!appDark && themePalette === 'day' && (
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-black text-slate-900 dark:text-white">تم روز (تم سایت)</div>
                                                                <div className="text-[10px] text-slate-500 dark:text-slate-400">سبز زمردی و روشن</div>
                                                            </div>
                                                            <div className="h-1.5 rounded-full bg-gradient-to-r from-[#062419] via-[#0B3B2B] to-[#0D4D38]" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setThemePalette('night');
                                                                setAppDark(true);
                                                            }}
                                                            className={`p-2.5 rounded-2xl border text-right transition flex flex-col justify-between gap-1.5 ${
                                                                appDark || themePalette === 'night'
                                                                    ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500'
                                                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <Moon className="w-4 h-4 text-indigo-400" />
                                                                {(appDark || themePalette === 'night') && (
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-black text-slate-900 dark:text-white">تم شب (دارک سایت)</div>
                                                                <div className="text-[10px] text-slate-500 dark:text-slate-400">تاریک، لوکس و آرام</div>
                                                            </div>
                                                            <div className="h-1.5 rounded-full bg-gradient-to-r from-[#020617] via-[#0B231A] to-[#020617]" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Save Button */}
                                                <div className="pt-2 flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            saveBranding(appName, appTagline, logoStyle, customMonogram, themePalette)
                                                        }
                                                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                                                    >
                                                        ذخیره و اعمال در کل اپلیکیشن
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            saveBranding('بهار زندگی', 'آکادمی رشد و سیستم‌سازی ذهن', 'lotus', 'ب', 'day');
                                                        }}
                                                        className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                                                    >
                                                        بازنشانی
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN: MOBILE LOGIN VIA PHONE ONLY (ورود اختصاصی با شماره همراه مشابه سایت)
                                    ======================================================== */}
                                    {activeScreen === 'login' && (
                                        <div className="space-y-4 py-2">
                                            {/* Banner with Logo and Title */}
                                            <div className={`p-4 rounded-3xl border text-center space-y-3 ${surfaceCls}`}>
                                                <div className="flex justify-center">
                                                    {renderAppLogo('lg')}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                                        ورود به سوپر اپلیکیشن «{appName}»
                                                    </h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        جهت دسترسی به دوره‌ها، جلسات و داشبورد، شماره همراه خود را وارد نمایید.
                                                    </p>
                                                </div>

                                                {loginNotice && (
                                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                        <span>{loginNotice}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* STEP 1: ENTER PHONE NUMBER */}
                                            {loginStep === 'phone' ? (
                                                <div className={`p-4 rounded-3xl border space-y-4 ${surfaceCls}`}>
                                                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                                                <Phone className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-xs font-black">مرحله ۱ از ۲: شماره همراه</span>
                                                        </div>
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                                                            پیامک امن OTP
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                                                            شماره تلفن همراه (بدون صفر یا با ۰۹)
                                                        </label>
                                                        <div className="relative flex items-center">
                                                            <input
                                                                type="tel"
                                                                dir="ltr"
                                                                value={inputPhone}
                                                                onChange={(e) => setInputPhone(e.target.value)}
                                                                placeholder="09123456789"
                                                                className="w-full pl-14 pr-10 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-left font-mono font-bold text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                            />
                                                            <div className="absolute right-3 text-slate-400">
                                                                <Phone className="w-4 h-4" />
                                                            </div>
                                                            <div className="absolute left-3 text-xs font-black text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg">
                                                                +۹۸
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Quick Test Demo Button */}
                                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">تست سریع با شماره نمونه:</span>
                                                        <button
                                                            onClick={() => setInputPhone('۰۹۱۲۳۴۵۶۷۸۹')}
                                                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                                        >
                                                            ۰۹۱۲۳۴۵۶۷۸۹
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            if (!inputPhone || inputPhone.trim().length < 10) {
                                                                setLoginNotice('لطفاً شماره همراه معتبر وارد کنید');
                                                                return;
                                                            }
                                                            setLoginStep('otp');
                                                            setOtpTimer(60);
                                                            setLoginNotice('کد تایید ۴ رقمی پیامکی برای شما ارسال شد.');
                                                        }}
                                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
                                                    >
                                                        <SendHorizontal className="w-4 h-4" />
                                                        <span>دریافت کد تایید یکبار مصرف</span>
                                                    </button>

                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                                                        با ورود به سیستم، تمام قوانین و شرایط آکادمی بهار زندگی را می‌پذیرید.
                                                    </p>
                                                </div>
                                            ) : (
                                                /* STEP 2: ENTER OTP CODE */
                                                <div className={`p-4 rounded-3xl border space-y-4 ${surfaceCls}`}>
                                                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                                                                <Key className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-xs font-black">مرحله ۲ از ۲: کد تایید پیامکی</span>
                                                        </div>
                                                        <button
                                                            onClick={() => setLoginStep('phone')}
                                                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                                        >
                                                            ویرایش شماره
                                                        </button>
                                                    </div>

                                                    <div className="text-center space-y-1">
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            کد تایید ۴ رقمی ارسال‌شده به شماره زیر را وارد کنید:
                                                        </div>
                                                        <div className="text-sm font-black font-mono text-slate-900 dark:text-white" dir="ltr">
                                                            {inputPhone}
                                                        </div>
                                                    </div>

                                                    {/* 4 Digit Boxes Display */}
                                                    <div className="flex justify-center gap-2.5" dir="ltr">
                                                        {['۴', '۸', '۲', '۹'].map((digit, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="w-12 h-14 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-mono font-black text-xl flex items-center justify-center shadow-inner"
                                                            >
                                                                {otpCode[idx] || digit}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Quick Fill Test Code */}
                                                    <div className="text-center">
                                                        <button
                                                            onClick={() => setOtpCode('۴۸۲۹')}
                                                            className="text-[11px] text-slate-500 hover:text-emerald-600 font-bold underline"
                                                        >
                                                            درج کد تایید آزمایشی (۴۸۲۹)
                                                        </button>
                                                    </div>

                                                    {/* Countdown Timer */}
                                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                            <Clock className="w-4 h-4 text-slate-400" />
                                                            <span>زمان اعتبار کد:</span>
                                                        </div>
                                                        {otpTimer > 0 ? (
                                                            <span className="font-mono font-black text-xs text-amber-500">
                                                                {otpTimer} ثانیه
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setOtpTimer(60);
                                                                    setLoginNotice('کد مجدد برای شما پیامک شد.');
                                                                }}
                                                                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                                                            >
                                                                <RefreshCw className="w-3.5 h-3.5" />
                                                                <span>ارسال مجدد کد</span>
                                                            </button>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setIsLoggedIn(true);
                                                            setCurrentUserPhone(inputPhone || '۰۹۱۲۳۴۵۶۷۸۹');
                                                            setCurrentUserName('سامان یزدانی');
                                                            setLoginNotice('ورود با موفقیت انجام شد! به داشبورد اختصاصی خوش آمدید.');
                                                            setActiveScreen('dashboard');
                                                        }}
                                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>تایید و ورود به داشبورد دانشجو</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ========================================================
                                        SCREEN: STUDENT DASHBOARD (داشبورد جامع و حرفه‌ای دانشجو)
                                    ======================================================== */}
                                    {activeScreen === 'dashboard' && (
                                        <div className="space-y-3.5">
                                            {!isLoggedIn ? (
                                                <div className={`p-6 rounded-3xl border text-center space-y-4 ${surfaceCls}`}>
                                                    <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center font-black">
                                                        <Lock className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                                            دسترسی به داشبورد نیازمند ورود است
                                                        </h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                                            برای مشاهده وضعیت یادگیری، جلسات کوچینگ، کارنامه و فایل‌های آموزشی لطفاً با شماره موبایل خود وارد شوید.
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setActiveScreen('login')}
                                                        className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                        <span>ورود با شماره موبایل</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* 1. Student Profile Header Card */}
                                                    <div className="rounded-3xl bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white p-4 shadow-xl border border-slate-700/60 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative">
                                                                    <img
                                                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                                                                        alt="عکس دانشجو"
                                                                        className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                                                                    />
                                                                    <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] shadow">
                                                                        VIP
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="text-sm font-black">{currentUserName}</h3>
                                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/40">
                                                                            فعال
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-[11px] text-slate-300 font-mono mt-0.5 flex items-center gap-1" dir="ltr">
                                                                        <Phone className="w-3 h-3 text-slate-400" />
                                                                        <span>{currentUserPhone}</span>
                                                                    </div>
                                                                    <div className="text-[10px] text-amber-300/90 mt-0.5 font-bold">
                                                                        عضو طلایی آکادمی بهار زندگی
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => {
                                                                    setIsLoggedIn(false);
                                                                    setLoginNotice('از حساب کاربری خود خارج شدید.');
                                                                    setActiveScreen('login');
                                                                }}
                                                                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition"
                                                                title="خروج از حساب"
                                                            >
                                                                <LogOut className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                                                            <span className="text-slate-300">موجودی کیف پول:</span>
                                                            <span className="font-black text-amber-400">
                                                                {walletBalance.toLocaleString('fa-IR')} تومان
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* 2. Four Core KPI Analytics (2x2 Grid) */}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className={`p-3 rounded-2xl border space-y-1 ${surfaceCls}`}>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">ساعت مطالعه</span>
                                                                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                </div>
                                                            </div>
                                                            <div className="text-base font-black text-slate-900 dark:text-white">۲۴ ساعت</div>
                                                            <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">+۳ ساعت این هفته</div>
                                                        </div>

                                                        <div className={`p-3 rounded-2xl border space-y-1 ${surfaceCls}`}>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">دوره‌های فعال</span>
                                                                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                                    <BookOpen className="w-3.5 h-3.5" />
                                                                </div>
                                                            </div>
                                                            <div className="text-base font-black text-slate-900 dark:text-white">۲ دوره</div>
                                                            <div className="text-[9px] text-blue-600 dark:text-blue-400 font-bold">۸ جلسه گذرانده</div>
                                                        </div>

                                                        <div className={`p-3 rounded-2xl border space-y-1 ${surfaceCls}`}>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">استمرار یادگیری</span>
                                                                <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                                                    <Flame className="w-3.5 h-3.5" />
                                                                </div>
                                                            </div>
                                                            <div className="text-base font-black text-slate-900 dark:text-white">۵ روز پیاپی</div>
                                                            <div className="text-[9px] text-rose-600 dark:text-rose-400 font-bold">رکورد شخصی فعال</div>
                                                        </div>

                                                        <div className={`p-3 rounded-2xl border space-y-1 ${surfaceCls}`}>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">میانگین آزمون‌ها</span>
                                                                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                                                    <Award className="w-3.5 h-3.5" />
                                                                </div>
                                                            </div>
                                                            <div className="text-base font-black text-slate-900 dark:text-white">۹۲٪</div>
                                                            <div className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">سطح ممتاز طلایی</div>
                                                        </div>
                                                    </div>

                                                    {/* 3. Next Upcoming Coaching Session */}
                                                    <div className={`p-3.5 rounded-3xl border space-y-2.5 ${surfaceCls}`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                                <span className="text-xs font-black text-slate-900 dark:text-white">
                                                                    جلسه آینده کوچینگ ۱ به ۱
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                                                                تایید شده
                                                            </span>
                                                        </div>

                                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="font-bold text-slate-900 dark:text-white">کوچینگ با دکتر مهدی بیدی</span>
                                                                <span className="font-bold text-blue-600 dark:text-blue-400">شنبه ۱۸ اردیبهشت</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                                                موضوع: بازنگری ماتریس تصمیم‌گیری و اصلاح نقشه فصلی
                                                            </div>
                                                            <a
                                                                href="https://meet.google.com/xyz-bahar"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                                                            >
                                                                <Video className="w-3.5 h-3.5" />
                                                                <span>ورود مستقیم به اتاق Google Meet</span>
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* 4. Enrolled Courses Progress */}
                                                    <div className={`p-3.5 rounded-3xl border space-y-2.5 ${surfaceCls}`}>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                                                دوره‌های در حال یادگیری من
                                                            </span>
                                                            <button
                                                                onClick={() => setActiveScreen('courses')}
                                                                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                                            >
                                                                کاتالوگ دوره‌ها ←
                                                            </button>
                                                        </div>

                                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                                                            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                                                                <span>معماری ذهن و تصمیم‌گیری استراتژیک</span>
                                                                <span className="text-emerald-600 dark:text-emerald-400">۶۲٪ تکمیل</span>
                                                            </div>
                                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '62%' }} />
                                                            </div>
                                                            <div className="flex items-center justify-between pt-1">
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                                                    جلسه ۴: سوگیری‌های شناختی در تصمیمات پرریسک
                                                                </span>
                                                                <button
                                                                    onClick={() => setActiveScreen('learning')}
                                                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition"
                                                                >
                                                                    <Play className="w-3 h-3" />
                                                                    ادامه درس
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 5. Talent & Growth Radar Snapshot */}
                                                    <div className={`p-3.5 rounded-3xl border space-y-2.5 ${surfaceCls}`}>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                                                شاخص رشد فردی و سیستم‌سازی
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold">ارزیابی فصل بهار</span>
                                                        </div>

                                                        <div className="space-y-2 text-xs">
                                                            {[
                                                                { skill: 'معماری ذهن و کنترل هیجان', val: 85, color: 'bg-rose-500' },
                                                                { skill: 'مدیریت زمان و اجرای OKR', val: 70, color: 'bg-blue-500' },
                                                                { skill: 'سیستم‌سازی و تفویض اختیار', val: 90, color: 'bg-emerald-500' },
                                                                { skill: 'تاب‌آوری در بحران‌های کسب‌وکار', val: 75, color: 'bg-amber-500' },
                                                            ].map((item, idx) => (
                                                                <div key={idx} className="space-y-1">
                                                                    <div className="flex justify-between text-[11px]">
                                                                        <span className="text-slate-600 dark:text-slate-300">{item.skill}</span>
                                                                        <span className="font-bold text-slate-900 dark:text-white">{item.val}٪</span>
                                                                    </div>
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                                        <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.val}%` }} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* 6. Quick Action Cards */}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => setActiveScreen('quizzes')}
                                                            className={`p-3 rounded-2xl border text-right space-y-1 transition hover:border-emerald-500 ${surfaceCls}`}
                                                        >
                                                            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                                                <ClipboardCheck className="w-4 h-4" />
                                                            </div>
                                                            <div className="text-xs font-black text-slate-900 dark:text-white">آزمون‌ها و تکالیف</div>
                                                            <div className="text-[10px] text-slate-500 dark:text-slate-400">۱ تمرین تایید شده</div>
                                                        </button>

                                                        <button
                                                            onClick={() => setActiveScreen('wallet')}
                                                            className={`p-3 rounded-2xl border text-right space-y-1 transition hover:border-emerald-500 ${surfaceCls}`}
                                                        >
                                                            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                                                <FileCheck className="w-4 h-4" />
                                                            </div>
                                                            <div className="text-xs font-black text-slate-900 dark:text-white">گواهینامه‌های رسمی</div>
                                                            <div className="text-[10px] text-slate-500 dark:text-slate-400">۱ مدرک صادر شده</div>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* PHONE BOTTOM NAVIGATION BAR (ULTRA-REFINED DOCK WITH 5 CORE TABS) */}
                                <div
                                    className={`border-t px-2.5 pt-2 pb-1.5 shrink-0 backdrop-blur-2xl transition-all duration-300 z-30 ${
                                        appDark
                                            ? 'bg-slate-950/95 border-slate-800/80 shadow-[0_-12px_30px_rgba(0,0,0,0.6)]'
                                            : 'bg-white/95 border-slate-200/90 shadow-[0_-10px_25px_rgba(0,0,0,0.06)]'
                                    }`}
                                >
                                    <div className="grid grid-cols-5 items-center gap-1">
                                        {[
                                            { id: 'home' as ScreenId, label: 'خانه', icon: Home, badge: null },
                                            { id: 'courses' as ScreenId, label: 'دوره‌ها', icon: BookOpen, badge: '۲' },
                                            { id: 'dashboard' as ScreenId, label: 'داشبورد', icon: LayoutDashboard, badge: 'VIP', centerHighlight: true },
                                            { id: 'sessions' as ScreenId, label: 'کوچینگ', icon: Calendar, badge: '۱' },
                                            { id: 'admin' as ScreenId, label: 'پنل ادمین', icon: ShieldCheck, adminHighlight: true },
                                        ].map((tab) => {
                                            const Icon = tab.icon;
                                            const active =
                                                activeScreen === tab.id ||
                                                (tab.id === 'courses' && activeScreen === 'learning');
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveScreen(tab.id)}
                                                    className={`group relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 ${
                                                        tab.adminHighlight
                                                            ? active
                                                                ? 'bg-gradient-to-b from-amber-400/20 to-amber-500/10 text-amber-500 font-black ring-1 ring-amber-400/40 shadow-sm'
                                                                : 'text-amber-500/80 hover:text-amber-400 hover:bg-amber-400/10 font-bold'
                                                            : tab.centerHighlight && active
                                                            ? 'bg-gradient-to-b from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 font-black ring-1 ring-emerald-500/30 shadow-sm'
                                                            : active
                                                            ? 'bg-emerald-500/15 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 font-black ring-1 ring-emerald-500/20 shadow-sm'
                                                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                                    }`}
                                                >
                                                    {/* Icon with Micro-Badge */}
                                                    <div className="relative">
                                                        <Icon
                                                            className={`w-4 h-4 transition-transform duration-200 ${
                                                                active ? 'scale-110' : 'group-hover:scale-105'
                                                            }`}
                                                            strokeWidth={active ? 2.5 : 2}
                                                        />
                                                        {tab.badge && !active && (
                                                            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-emerald-500 text-white font-mono font-bold text-[8px] leading-tight shadow-sm">
                                                                {tab.badge}
                                                            </span>
                                                        )}
                                                        {tab.adminHighlight && (
                                                            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 border border-slate-900 shadow-sm animate-pulse" />
                                                        )}
                                                    </div>

                                                    <span className="text-[10px] mt-1 tracking-tight leading-none">
                                                        {tab.label}
                                                    </span>

                                                    {/* Active Glowing Dot Indicator */}
                                                    {active && (
                                                        <span
                                                            className={`w-1 h-1 rounded-full mt-1 ${
                                                                tab.adminHighlight ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                                                            }`}
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Mobile Home Swipe Indicator Bar */}
                                    <div className="w-24 h-1 rounded-full bg-slate-300 dark:bg-slate-700/70 mx-auto mt-1.5" />
                                </div>

                                {/* HIGHLIGHT / CAPSULE DETAIL MODAL */}
                                {selectedHighlight !== null && (
                                    <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                                        {(() => {
                                            const item = highlightsData.find((h) => h.id === selectedHighlight);
                                            if (!item) return null;
                                            const ItemIcon = item.icon;
                                            return (
                                                <div className="w-full rounded-3xl bg-slate-900 border border-emerald-500/40 p-3.5 text-white space-y-3 shadow-2xl overflow-hidden">
                                                    {/* Capsule Cover Photo with Vector Badge */}
                                                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden">
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                                                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-xs font-black">
                                                            <ItemIcon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                                                            <span>{item.badgeText}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedHighlight(null)}
                                                            className="absolute top-2.5 left-2.5 p-1 rounded-full bg-slate-950/80 text-slate-300 hover:text-white"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <div className="text-[10px] font-bold text-amber-400">{item.tag}</div>
                                                        <h4 className="text-sm font-black text-white mt-0.5">{item.title}</h4>
                                                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                                            {item.desc}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setActiveScreen(item.targetScreen);
                                                            setSelectedHighlight(null);
                                                        }}
                                                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
                                                    >
                                                        <span>{item.actionLabel}</span>
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* LEFT COLUMN: INTERACTIVE CONTROL CENTER & ALL WEBSITE MODULES */}
                    <div className="xl:col-span-7 space-y-6">
                        {/* Executive Feature Summary Card */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-emerald-500" />
                                        تمام امکانات وب‌سایت در سوپر اپلیکیشن (ساده، سریع و بدون حواشی)
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        مطابق دستور شما، تمام قابلیت‌های واقعی سایت به صورت روان، شیک و بدون المان‌های اضافی پیاده‌سازی شدند:
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black shrink-0">
                                    ۱۰۰٪ متصل و فعال
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 space-y-2">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs font-black text-slate-900 dark:text-white">
                                        آکادمی، پلیر و آزمون‌ها
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                        مشاهده کاتالوگ دوره‌ها، پخش‌کننده ویدیویی درس با نشانک و یادداشت، آزمون‌های آنلاین با نمره‌دهی آنی و ارسال تمرین.
                                    </p>
                                    <button
                                        onClick={() => setActiveScreen('courses')}
                                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline block pt-1"
                                    >
                                        تست دوره‌ها و پلیر ←
                                    </button>
                                </div>

                                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/30 space-y-2">
                                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs font-black text-slate-900 dark:text-white">
                                        کوچینگ ۱ به ۱ و اهداف ۹۰ روزه
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                        رزرو آنلاین جلسات با دکتر بیدی، لینک مستقیم اتاق Google Meet، ردیاب اهداف فصلی و چک‌لیست عادات رشد فردی.
                                    </p>
                                    <button
                                        onClick={() => setActiveScreen('sessions')}
                                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline block pt-1"
                                    >
                                        تست رزرو جلسات ←
                                    </button>
                                </div>

                                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 space-y-2">
                                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs font-black text-slate-900 dark:text-white">
                                        پنل ادمین ۱۰۰٪ درون‌برنامه‌ای
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                        مدیریت کامل دوره‌ها، تایید فیش‌های کارت‌به‌کارت با یک لمس، کنترل لیدهای CRM، پاسخگویی به تیکت‌ها و سوئیچ‌های سرور.
                                    </p>
                                    <button
                                        onClick={() => setActiveScreen('admin')}
                                        className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline block pt-1"
                                    >
                                        تست پنل ادمین ←
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Direct Screen Switcher Grid */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                        دسترسی سریع به صفحات اپلیکیشن در شبیه‌ساز گوشی
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        روی هر بخش کلیک کنید تا بلافاصله در تلفن همراه نمایش داده شود:
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {[
                                    { id: 'dashboard' as ScreenId, label: 'داشبورد دانشجو', badge: 'تحلیل + کارنامه' },
                                    { id: 'login' as ScreenId, label: 'ورود با شماره موبایل', badge: 'کد پیامکی OTP' },
                                    { id: 'home' as ScreenId, label: 'صفحه اصلی و کپسول‌ها', badge: 'ویترین آکادمی' },
                                    { id: 'courses' as ScreenId, label: 'کاتالوگ دوره‌ها', badge: 'لیست و ثبت‌نام' },
                                    { id: 'learning' as ScreenId, label: 'پخش‌کننده ویدیو و درس', badge: 'نشانک + جزوه' },
                                    { id: 'quizzes' as ScreenId, label: 'آزمون و ارسال تکلیف', badge: 'نمره‌دهی آنی' },
                                    { id: 'sessions' as ScreenId, label: 'کوچینگ ۱ به ۱', badge: 'رزرو + اتاق آنلاین' },
                                    { id: 'shop' as ScreenId, label: 'فروشگاه و سبد خرید', badge: 'کارت به کارت' },
                                    { id: 'wallet' as ScreenId, label: 'کیف پول و مدارک', badge: 'گواهی رسمی' },
                                    { id: 'support' as ScreenId, label: 'پشتیبانی و چت زنده', badge: 'تیکت رسمی' },
                                    { id: 'admin' as ScreenId, label: 'پنل کامل ادمین', badge: '۹ زیربخش' },
                                    { id: 'settings' as ScreenId, label: 'تغییر نام، لوگو و تم', badge: 'برندینگ اختصاصی' },
                                ].map((scr) => {
                                    const isActive = activeScreen === scr.id;
                                    return (
                                        <button
                                            key={scr.id}
                                            onClick={() => setActiveScreen(scr.id)}
                                            className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between gap-1.5 ${
                                                isActive
                                                    ? 'bg-slate-900 text-white border-amber-400 shadow-md ring-1 ring-amber-400'
                                                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black">{scr.label}</span>
                                            </div>
                                            <span
                                                className={`px-2 py-0.5 rounded text-[9px] font-bold self-start ${
                                                    isActive
                                                        ? 'bg-amber-400 text-slate-950 font-black'
                                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                                }`}
                                            >
                                                {scr.badge}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Complete In-App Admin Matrix */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-amber-500" />
                                        دسترسی مستقیم درون‌برنامه‌ای به تمام ماژول‌های ادمین سایت
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        مدیر می‌تواند تمام این امور را بدون نیاز به باز کردن سایت و به راحتی از داخل اپ موبایل انجام دهد:
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveScreen('admin')}
                                    className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shrink-0 hover:bg-amber-500"
                                >
                                    باز کردن پنل ادمین گوشی
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {[
                                    { title: 'مدیریت دوره‌ها و قیمت‌گذاری', tab: 'courses' as AdminSubTab, sub: 'افزودن دوره، سوئیچ انتشار، ویرایش فوری قیمت و تعداد دانشجویان' },
                                    { title: 'تایید فیش‌های کارت‌به‌کارت و سفارش‌ها', tab: 'orders' as AdminSubTab, sub: 'بررسی فیش‌های واریزی دانشجویان و فعال‌سازی آنی دسترسی دوره با ۱ کلیک' },
                                    { title: 'کاربران و سطوح دسترسی (RBAC)', tab: 'users' as AdminSubTab, sub: 'تغییر نقش (مدیر، استاد، VIP)، مسدودسازی و شارژ کیف پول' },
                                    { title: 'خط لوله سرنخ‌ها و فروش (CRM)', tab: 'crm' as AdminSubTab, sub: 'پیگیری لیدها، انتقال مراحل فروش و تماس مستقیم' },
                                    { title: 'تعریف کدهای تخفیف با درصد دلخواه', tab: 'discounts' as AdminSubTab, sub: 'ایجاد کدهای تخفیف زمان‌دار با تعداد استفاده محدود' },
                                    { title: 'ارسال پیامک انبوه و اتوماسیون', tab: 'automations' as AdminSubTab, sub: 'سامانه کاوه‌نگار، وب‌هوک پرس‌لاین و اعلان‌های سراسری' },
                                    { title: 'میز پاسخگویی تیکت‌های پشتیبانی', tab: 'tickets' as AdminSubTab, sub: 'پاسخ مستقیم به تیکت‌های کاربران و بستن تیکت از داخل اپ' },
                                    { title: 'کنترل سوئیچ‌های کلان سایت', tab: 'site_switches' as AdminSubTab, sub: 'حالت تعمیر سایت، پذیرش ثبت‌نام و اعلان‌های فوری' },
                                ].map((mod) => (
                                    <button
                                        key={mod.title}
                                        onClick={() => {
                                            setActiveScreen('admin');
                                            setAdminSubTab(mod.tab);
                                        }}
                                        className="text-right p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-slate-50/70 dark:bg-slate-800/40 transition flex items-center justify-between gap-3 group"
                                    >
                                        <div className="min-w-0">
                                            <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                                                {mod.title}
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                                {mod.sub}
                                            </p>
                                        </div>
                                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-500 shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
