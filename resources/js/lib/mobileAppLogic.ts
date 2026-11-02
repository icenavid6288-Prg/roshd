export interface CourseItemInstructor {
    itemId: number;
    itemNumber: number;
    itemTitle: string;
    itemSubtitle: string;
    deliveryMode: 'حضوری' | 'آنلاین' | 'حضوری + آنلاین';
    lessonsCount: number;
    duration: string;
    instructorId: string;
    instructorName: string;
    instructorRole: string;
    instructorAvatar: string;
    instructorStatus: string;
    initialMessages: ChatMessage[];
}

export interface ChatMessage {
    id: string;
    sender: 'student' | 'instructor' | 'support' | 'classmate' | 'system';
    senderName: string;
    senderRole?: string;
    text: string;
    time: string;
}

export type ChatChannelType = 'instructor' | 'group' | 'support';

export interface InAppChapterOrEpisode {
    id: number;
    number: number;
    title: string;
    durationOrPages: string;
    isFreeSample: boolean;
    contentOrTranscript: string;
    keyTakeaway: string;
}

export interface MobileStoreProduct {
    id: number;
    title: string;
    slug: string;
    type: string;
    deliveryType: 'in_app_book' | 'in_app_podcast' | 'physical';
    inAppOnly: boolean;
    author: string;
    price: number;
    discount_price: number;
    image: string;
    posterTag: string;
     posterGradient: string;
    summary: string;
    description: string;
    durationOrVolume: string;
    rating: number;
    highlights: string[];
    chaptersOrEpisodes: InAppChapterOrEpisode[];
}

export const defaultCourseItemsWithInstructors: CourseItemInstructor[] = [
    {
        itemId: 1,
        itemNumber: 1,
        itemTitle: 'آیتم ۱: خودشناسی و کشف استعدادهای ذاتی نوجوان',
        itemSubtitle: 'تحلیل نیمرخ روانشناختی، رغبت‌سنجی و شناسایی ۵ استعداد غالب',
        deliveryMode: 'حضوری + آنلاین',
        lessonsCount: 5,
        duration: '۱۰ ساعت',
        instructorId: 'inst-sadeghi',
        instructorName: 'دکتر محمدرضا صادقی',
        instructorRole: 'مدرس آیتم خودشناسی و روان‌شناسی استعداد',
        instructorAvatar: '/images/brand-logo.png',
        instructorStatus: 'پاسخگویی مستقیم به تمرین‌های آیتم ۱',
        initialMessages: [
            {
                id: 'm-inst-1',
                sender: 'instructor',
                senderName: 'دکتر محمدرضا صادقی',
                senderRole: 'مدرس آیتم ۱ (خودشناسی و استعدادیابی)',
                text: 'سلام نوید جان! نتیجه کارگاه اول و نمودار استعدادهای تحلیلی تو رو بررسی کردم. در بخش تفکر استراتژیک امتیاز عالی ۸۸ رو گرفتی. هر سوالی درباره تحلیل تست رغبت‌سنجی داری همین‌جا بپرس.',
                time: 'دیروز · ۱۸:۴۰',
            },
            {
                id: 'm-inst-2',
                sender: 'student',
                senderName: 'نوید محمدی',
                text: 'سلام آقای دکتر، ممنون! برای تمرین جدول نقاط قوت، باید ۳ موقعیت واقعی مدرسه رو بنویسیم؟',
                time: 'دیروز · ۱۹:۰۵',
            },
            {
                id: 'm-inst-3',
                sender: 'instructor',
                senderName: 'دکتر محمدرضا صادقی',
                senderRole: 'مدرس آیتم ۱ (خودشناسی و استعدادیابی)',
                text: 'بله دقیقاً؛ ۳ موقعیت که در اون‌ها بدون خستگی بهترین عملکرد رو داشتی یادداشت کن تا جلسه سه‌شنبه با هم تحلیلش کنیم.',
                time: 'دیروز · ۱۹:۱۲',
            },
        ],
    },
    {
        itemId: 2,
        itemNumber: 2,
        itemTitle: 'آیتم ۲: هدف‌گذاری ۹۰ روزه، برنامه‌ریزی و مدیریت زمان',
        itemSubtitle: 'طراحی بوم نقشه راه فصلی، ساخت عادت‌های پایدار و تمرکز عمیق',
        deliveryMode: 'آنلاین',
        lessonsCount: 5,
        duration: '۱۰ ساعت',
        instructorId: 'inst-karimi',
        instructorName: 'استاد سارا کریمی',
        instructorRole: 'مدرس آیتم هدف‌گذاری و کوچ برنامه‌ریزی',
        instructorAvatar: '/images/brand-logo.png',
        instructorStatus: 'بررسی بوم ۹۰ روزه و ژورنال هفتگی',
        initialMessages: [
            {
                id: 'm-karimi-1',
                sender: 'instructor',
                senderName: 'استاد سارا کریمی',
                senderRole: 'مدرس آیتم ۲ (هدف‌گذاری و برنامه‌ریزی)',
                text: 'سلام نوید عزیز! بوم هدف‌گذاری ۹۰ روزه‌ات خیلی دقیق تنظیم شده. فقط برای هدف سوم (مطالعه روزانه)، زمان مشخص بعد از ساعت مدرسه رو هم داخل جدول اضافه کن.',
                time: 'امروز · ۱۰:۱۵',
            },
        ],
    },
    {
        itemId: 3,
        itemNumber: 3,
        itemTitle: 'آیتم ۳: ارتباط مؤثر، عزت‌نفس و تصمیم‌گیری مستقل',
        itemSubtitle: 'کارگاه عملی فن بیان، قاطعیت محترمانه، کار تیمی و رهبری',
        deliveryMode: 'حضوری',
        lessonsCount: 5,
        duration: '۱۰ ساعت',
        instructorId: 'inst-naderi',
        instructorName: 'دکتر امیرحسین نادری',
        instructorRole: 'مدرس آیتم ارتباطات، فن بیان و عزت‌نفس',
        instructorAvatar: '/images/brand-logo.png',
        instructorStatus: 'پاسخگویی به تمرین‌های کارگاه ارتباط مؤثر',
        initialMessages: [
            {
                id: 'm-naderi-1',
                sender: 'instructor',
                senderName: 'دکتر امیرحسین نادری',
                senderRole: 'مدرس آیتم ۳ (ارتباط مؤثر و عزت‌نفس)',
                text: 'درود نوید جان. برای کارگاه حضوری سه‌شنبه، سناریوی مذاکره ۳ دقیقه‌ای که در کلاس تمرین کردیم رو آماده داشته باش.',
                time: '۲ روز پیش · ۱۶:۲۰',
            },
        ],
    },
    {
        itemId: 4,
        itemNumber: 4,
        itemTitle: 'آیتم ۴: سواد مالی نوجوان، کارآفرینی و پروژه آینده من',
        itemSubtitle: 'مدیریت بودجه شخصی، ایده‌پردازی استارتاپی و ساخت اولین مینی‌پروژه',
        deliveryMode: 'حضوری + آنلاین',
        lessonsCount: 5,
        duration: '۱۰ ساعت',
        instructorId: 'inst-rahimi',
        instructorName: 'مهندس نیما رحیمی',
        instructorRole: 'مدرس آیتم سواد مالی و کارآفرینی نوجوان',
        instructorAvatar: '/images/brand-logo.png',
        instructorStatus: 'منتورینگ پروژه عملی کارآفرینی',
        initialMessages: [
            {
                id: 'm-rahimi-1',
                sender: 'instructor',
                senderName: 'مهندس نیما رحیمی',
                senderRole: 'مدرس آیتم ۴ (سواد مالی و کارآفرینی)',
                text: 'سلام نوید! ایده‌ای که برای طراحی ابزار برنامه‌ریزی دانش‌آموزی دادی پتانسیل خیلی خوبی داره. توی این چت می‌تونیم بوم مدل کسب‌وکارت رو قدم‌به‌قدم تکمیل کنیم.',
                time: 'دیروز · ۲۱:۰۰',
            },
        ],
    },
];

export const defaultGroupChatMessages: ChatMessage[] = [
    {
        id: 'grp-1',
        sender: 'system',
        senderName: 'اطلاعیه رسمی دوره',
        text: 'کارگاه حضوری آیتم ۳ (ارتباط مؤثر و عزت‌نفس) روز سه‌شنبه ساعت ۱۷:۰۰ در سالن VIP طبقه ۲ برگزار می‌شود.',
        time: 'امروز · ۰۹:۰۰',
    },
    {
        id: 'grp-2',
        sender: 'instructor',
        senderName: 'دکتر محمدرضا صادقی',
        senderRole: 'مدرس آیتم ۱',
        text: 'بچه‌ها خسته نباشید! فایل کاربرگ تحلیل استعدادها در بخش سرفصل‌ها قرار گرفت. قبل از جلسه بعدی حتماً مرور کنید.',
        time: 'امروز · ۱۱:۲۰',
    },
    {
        id: 'grp-3',
        sender: 'classmate',
        senderName: 'امیرعلی رضایی',
        senderRole: 'دانش‌پذیر دوره VIP',
        text: 'سلام استاد، من کاربرگ رو کامل کردم و توی چت خصوصی آیتم ۱ براتون فرستادم.',
        time: 'امروز · ۱۱:۴۵',
    },
    {
        id: 'grp-4',
        sender: 'classmate',
        senderName: 'سارا محمدی',
        senderRole: 'دانش‌پذیر دوره VIP',
        text: 'بچه‌ها برای پروژه گروهی آیتم ۴ (کارآفرینی) کسی هست هم‌تیمی بشیم؟',
        time: 'امروز · ۱۲:۱۰',
    },
];

export const defaultCourseSupportMessages: ChatMessage[] = [
    {
        id: 'sup-1',
        sender: 'support',
        senderName: 'پشتیبانی جامع دوره (خانم سعیدی)',
        senderRole: 'مسئول هماهنگی و پشتیبانی آموزشی',
        text: 'سلام نوید عزیز! به بخش پشتیبانی کلی دوره خوش آمدی. هرگونه سوال اجرایی، هماهنگی جلسات حضوری و آنلاین، امور مالی یا دسترسی به محتوای دوره رو می‌تونی اینجا مطرح کنی.',
        time: 'امروز · ۰۸:۳۰',
    },
    {
        id: 'sup-2',
        sender: 'student',
        senderName: 'نوید محمدی',
        text: 'سلام وقت بخیر، لینک ضبط‌شده وبینار پنج‌شنبه ساعت چند داخل پنل قرار می‌گیره؟',
        time: 'امروز · ۱۳:۱۵',
    },
    {
        id: 'sup-3',
        sender: 'support',
        senderName: 'پشتیبانی جامع دوره (خانم سعیدی)',
        senderRole: 'مسئول هماهنگی و پشتیبانی آموزشی',
        text: 'ویدئوی کامل جلسه به همراه جزوه خلاصه، حداکثر ۳ ساعت پس از پایان کلاس در تب «رشد من» و صفحه دوره فعال می‌شود.',
        time: 'امروز · ۱۳:۲۲',
    },
];

export function canSendMessageInChannel(
    channel: ChatChannelType,
    groupChatEnabled: boolean,
    role: 'vip_student' | 'regular_user' | 'instructor'
): { allowed: boolean; reason?: string } {
    if (channel === 'group' && !groupChatEnabled && role !== 'instructor') {
        return {
            allowed: false,
            reason: 'ارسال پیام در گروه دوره توسط ادمین غیرفعال شده است (فقط مشاهده پیام‌های مدرسین و اطلاعیه‌ها).',
        };
    }
    return { allowed: true };
}

export function appendChatMessage(
    messages: ChatMessage[],
    text: string,
    sender: ChatMessage['sender'],
    senderName: string,
    senderRole?: string,
    timeLabel = 'هم‌اکنون'
): ChatMessage[] {
    const clean = text.trim();
    if (!clean) return messages;
    const nextMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender,
        senderName,
        senderRole,
        text: clean,
        time: timeLabel,
    };
    return [...messages, nextMsg];
}

export function filterCoursesByQueryAndCategory<
    T extends { title: string; summary: string; category: string }
>(courses: T[], query: string, category: string): T[] {
    const normalizedQuery = query.trim();
    return courses.filter((course) => {
        const matchesCat = category === 'همه' || course.category === category;
        const matchesSearch =
            !normalizedQuery ||
            course.title.includes(normalizedQuery) ||
            course.summary.includes(normalizedQuery) ||
            course.category.includes(normalizedQuery);
        return matchesCat && matchesSearch;
    });
}

export function resolveProductConsumptionMode(product: {
    deliveryType: 'in_app_book' | 'in_app_podcast' | 'physical';
    inAppOnly: boolean;
}): {
    canReadInApp: boolean;
    canListenInApp: boolean;
    isDownloadDisabled: boolean;
    badgeLabel: string;
    primaryCtaLabel: string;
} {
    if (product.deliveryType === 'in_app_book') {
        return {
            canReadInApp: true,
            canListenInApp: false,
            isDownloadDisabled: product.inAppOnly,
            badgeLabel: 'نسخه درون‌برنامه‌ای (غیرقابل دانلود بیرونی)',
            primaryCtaLabel: 'مطالعه در کتاب‌خوان اپلیکیشن',
        };
    }
    if (product.deliveryType === 'in_app_podcast') {
        return {
            canReadInApp: false,
            canListenInApp: true,
            isDownloadDisabled: product.inAppOnly,
            badgeLabel: 'پادکست درون‌برنامه‌ای (پخش اختصاصی در اپ)',
            primaryCtaLabel: 'پخش در پلیر صوتی اپلیکیشن',
        };
    }
    return {
        canReadInApp: false,
        canListenInApp: false,
        isDownloadDisabled: false,
        badgeLabel: 'محصول فیزیکی + پیش‌نمایش دیجیتال',
        primaryCtaLabel: 'ثبت سفارش و افزودن به سبد خرید',
    };
}
