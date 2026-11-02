export const mockSite = {
    name: 'مرکز رشد و کارآفرینی دکتر بیدی',
    tagline: 'آکادمی آموزش، کوچینگ، محصولات رشد فردی و استعدادیابی',
    description: 'همراه شما در مسیر استعدادیابی، توسعه فردی، مهارت‌آموزی و کوچینگ حرفه‌ای.',
    logo: '/images/brand-logo.png',
    phone: '۰۲۱-۸۸۹۹۰۰۱۱',
    email: 'info@markazbidi.ir',
    address: 'تهران، خیابان ولیعصر، مرکز رشد و نوآوری دکتر بیدی',
    instagram: 'https://instagram.com/markazbidi',
    eitaa: 'https://eitaa.com/markazbidi',
};

export const mockMenus = {
    header: [
        { id: 1, title: 'صفحه اصلی', url: '/web' },
        { id: 2, title: 'دوره‌های آموزشی', url: '/courses' },
        { id: 3, title: 'فروشگاه', url: '/shop' },
        { id: 4, title: 'کوچینگ', url: '/coaching' },
        { id: 5, title: 'وبلاگ', url: '/blog' },
        { id: 6, title: 'درباره ما', url: '/about' },
        { id: 7, title: 'تماس با ما', url: '/contact' },
    ],
    footer: [
        { id: 1, title: 'دوره‌های استعدادیابی', url: '/courses' },
        { id: 2, title: 'رزرو وقت کوچینگ', url: '/coaching' },
        { id: 3, title: 'فروشگاه کتاب و ابزار رشد', url: '/shop' },
        { id: 4, title: 'پیش‌نمایش اپلیکیشن موبایل', url: '/' },
    ],
};

export const mockStats = [
    { label: 'دانشجوی فعال', value: 12500, suffix: '+' },
    { label: 'ساعت آموزش تخصصی', value: 480, suffix: '+' },
    { label: 'جلسه کوچینگ موفق', value: 3200, suffix: '+' },
    { label: 'رضایت شرکت‌کنندگان', value: 98, suffix: '٪' },
];

export const mockVipFlagshipDefaults = {
    title: 'طراحی آینده نوجوان (دوره جامع پریمیوم VIP)',
    subtitle: 'استعدادیابی، ساخت هویت مستقل، مهارت‌های زندگی و ترسیم نقشه راه آینده (حضوری + مجازی)',
    description:
        'دوره پرچمدار و اختصاصی مرکز رشد ویژه نوجوانان ۱۲ تا ۱۸ سال. این دوره به صورت ترکیبی (کارگاه‌های عملی حضوری + جلسات پشتیبانی و آموزش آنلاین) برگزار می‌شود و هر دانش‌پذیر با مهر اختصاصی VIP تحت منتورینگ مستمر قرار می‌گیرد.',
    price: 6800000,
    discount_price: 5400000,
    capacity: 30,
    enrolled_count: 24,
    in_person_location: 'تهران، مرکز رشد دکتر بیدی — سالن کارگاه VIP طبقه ۲',
    online_platform: 'اتاق اختصاصی آنلاین رشد ( اسکای‌روم / گوگل‌میت )',
    schedule_summary: 'سه‌شنبه‌ها ساعت ۱۷:۰۰ (حضوری) و پنج‌شنبه‌ها ساعت ۱۸:۳۰ (مجازی)',
    auto_sms_reminder: true,
    reminder_lead_minutes: 90,
    features: [
        { id: 1, title: '۱۲ کارگاه حضوری پروژه‌محور و تعاملی', active: true },
        { id: 2, title: '۸ وبینار و کلاس آنلاین تکمیلی و رفع اشکال', active: true },
        { id: 3, title: 'آزمون جامع استعدادیابی و رغبت‌سنجی با گزارش اختصاصی', active: true },
        { id: 4, title: '۴ جلسه کوچینگ فردی نوجوان و والدین با دکتر بیدی', active: true },
        { id: 5, title: 'کارت عضویت و مهر طلایی VIP با اولویت رزرو و پشتیبانی', active: true },
        { id: 6, title: 'سیستم هوشمند حضور و غیاب و گزارش ماهانه به والدین', active: true },
    ],
    sessions: [
        {
            id: 101,
            number: 1,
            title: 'کشف استعدادهای ذاتی و تحلیل نیمرخ روانشناختی نوجوان',
            mode: 'in_person' as 'in_person' | 'online',
            date: 'سه‌شنبه ۲ اردیبهشت ۱۴۰۴',
            time: '۱۷:۰۰ تا ۱۹:۰۰',
            locationOrLink: 'سالن کارگاه VIP مرکز رشد',
            status: 'completed' as 'completed' | 'upcoming',
            reminderSent: true,
        },
        {
            id: 102,
            number: 2,
            title: 'مهارت هدف‌گذاری، برنامه‌ریزی شخصی و مدیریت زمان',
            mode: 'online' as 'in_person' | 'online',
            date: 'پنج‌شنبه ۴ اردیبهشت ۱۴۰۴',
            time: '۱۸:۳۰ تا ۲۰:۰۰',
            locationOrLink: 'لینک مستقیم کلاس آنلاین VIP',
            status: 'completed' as 'completed' | 'upcoming',
            reminderSent: true,
        },
        {
            id: 103,
            number: 3,
            title: 'کارگاه عملی ارتباط مؤثر، عزت‌نفس و تصمیم‌گیری مستقل',
            mode: 'in_person' as 'in_person' | 'online',
            date: 'سه‌شنبه ۹ اردیبهشت ۱۴۰۴',
            time: '۱۷:۰۰ تا ۱۹:۰۰',
            locationOrLink: 'سالن کارگاه VIP مرکز رشد',
            status: 'upcoming' as 'completed' | 'upcoming',
            reminderSent: true,
        },
        {
            id: 104,
            number: 4,
            title: 'سواد مالی نوجوان، کارآفرینی و طراحی پروژه آینده من',
            mode: 'online' as 'in_person' | 'online',
            date: 'پنج‌شنبه ۱۱ اردیبهشت ۱۴۰۴',
            time: '۱۸:۳۰ تا ۲۰:۰۰',
            locationOrLink: 'لینک مستقیم کلاس آنلاین VIP',
            status: 'upcoming' as 'completed' | 'upcoming',
            reminderSent: false,
        },
    ],
    students: [
        {
            id: 1,
            name: 'امیرعلی رضایی',
            grade: 'پایه دهم',
            phone: '۰۹۱۲۳۴۵۱۱aa'.replace('aa', '۲۲'),
            vipCode: 'VIP-1404-101',
            isVip: true,
            attendanceRate: 100,
            status: 'present_in_person' as 'present_in_person' | 'present_online' | 'late' | 'absent',
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
            status: 'present_in_person' as 'present_in_person' | 'present_online' | 'late' | 'absent',
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
            status: 'present_online' as 'present_in_person' | 'present_online' | 'late' | 'absent',
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
            status: 'late' as 'present_in_person' | 'present_online' | 'late' | 'absent',
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
            status: 'absent' as 'present_in_person' | 'present_online' | 'late' | 'absent',
            checkInTime: '—',
        },
    ],
};

export const mockCourses = [
    {
        id: 100,
        title: 'طراحی آینده نوجوان (دوره جامع پریمیوم VIP)',
        slug: 'designing-teen-future-vip',
        summary: 'دوره پرچمدار استعدادیابی، مهارت‌های زندگی و طراحی مسیر آینده نوجوانان (برگزاری ترکیبی حضوری و مجازی با مهر VIP).',
        description:
            'این دوره اصلی‌ترین برنامه تحولی مرکز رشد برای نوجوانان است که شامل ۴ آیتم تخصصی با ۴ مدرس مجرب، کارگاه‌های حضوری، کلاس‌های آنلاین، چت مستقیم با مدرس هر آیتم و گروه اختصاصی دوره می‌باشد.',
        price: 6800000,
        discount_price: 5400000,
        is_free: false,
        is_vip: true,
        delivery_mode: 'حضوری + مجازی (ترکیبی)',
        level: 'پریمیوم VIP',
        duration: '۴۰ ساعت',
        lessons_count: 20,
        students_count: 24,
        rating: 5.0,
        category: 'نوجوانان و والدین',
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
        slug: 'clifton-strengths-career-mastery',
        summary: 'کشف ۵ استعداد غالب شما و تبدیل آن‌ها به مزیت رقابتی پایدار در بازار کار و کسب‌وکار.',
        description: 'در این دوره پروژه‌محور، با استفاده از متدولوژی گالوپ و جلسات کارگاهی، نقشه استعدادهای ذاتی خود را ترسیم کرده و مسیر شغلی ۵ ساله خود را با همراهی اساتید هر سرفصل طراحی می‌کنید.',
        price: 2450000,
        discount_price: 1890000,
        is_free: false,
        is_vip: false,
        delivery_mode: 'آنلاین',
        level: 'مقدماتی تا پیشرفته',
        duration: '۱۸ ساعت',
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
        slug: 'professional-life-coaching-level-1',
        summary: 'آموزش مهارت‌های شنیدن فعال، پرسشگری قدرتمند و هدایت جلسات کوچینگ طبق استانداردهای ICF.',
        description: 'دوره‌ای عملی همراه با سوپرویژن اختصاصی برای افرادی که می‌خواهند به عنوان کوچ حرفه‌ای فعالیت کنند یا مهارت‌های رهبری خود را ارتقا دهند.',
        price: 4800000,
        discount_price: 3950000,
        is_free: false,
        is_vip: false,
        delivery_mode: 'آنلاین + کارگاه',
        level: 'پیشرفته',
        duration: '۳۲ ساعت',
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
        slug: 'financial-intelligence-and-entrepreneurship',
        summary: 'چگونه از مهارت‌ها و استعدادهای فردی خود یک کسب‌وکار پایدار و مقیاس‌پذیر بسازیم؟',
        description: 'آموزش گام‌به‌گام اعتبارسنجی ایده، طراحی بوم مدل کسب‌وکار، قیمت‌گذاری خدمات آموزشی و مدیریت جریان نقدینگی.',
        price: 1950000,
        discount_price: 1490000,
        is_free: false,
        is_vip: false,
        delivery_mode: 'آنلاین',
        level: 'متوسط',
        duration: '۱۴ ساعت',
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

export const mockProducts = [
    {
        id: 1,
        title: 'کتاب قطب‌نمای استعداد و کارآفرینی نوجوان',
        slug: 'talent-compass-book',
        type: 'کتاب درون‌برنامه‌ای (بدون دانلود بیرونی)',
        deliveryType: 'in_app_book' as 'in_app_book' | 'in_app_podcast' | 'physical',
        inAppOnly: true,
        author: 'دکتر بیدی و تیم علمی رشد',
        price: 420000,
        discount_price: 340000,
        image: '/images/growth-editorial.png',
        posterTag: 'کتاب‌خوان درون‌برنامه‌ای',
        posterGradient: 'linear-gradient(145deg, #123E30 0%, #1D5E48 100%)',
        durationOrVolume: '۱۸۴ صفحه · ۶ فصل تعاملی',
        rating: 4.9,
        summary: 'راهنمای جامع شناسایی نقاط قوت فردی و تبدیل آن به مسیر شغلی معنادار (قابل مطالعه مستقیم داخل اپلیکیشن).',
        description:
            'این کتاب به صورت نسخه دیجیتال امن و اختصاصی درون‌برنامه‌ای ارائه می‌شود تا دانش‌پذیر در هر زمان بدون نیاز به دانلود فایل حجیم بیرونی، فصل‌های کتاب و تمرین‌های خودشناسی را با قابلیت تنظیم فونت و حالت شب در اپلیکیشن مطالعه کند.',
        highlights: [
            'مطالعه مستقیم در کتاب‌خوان درون‌برنامه‌ای (غیرقابل دانلود خارج از اپ)',
            'همراه با نمونه رایگان فصل اول برای پیش‌نمایش قبل از خرید',
            'قابلیت تنظیم سایز متن، حالت مطالعه شب و کاغذی (Sepia)',
            'جدول‌های عملی کشف ۵ استعداد برتر در پایان هر فصل',
        ],
        chaptersOrEpisodes: [
            {
                id: 101,
                number: 1,
                title: 'فصل اول: چرا شناخت استعداد ذاتی مهم‌تر از تلاش کورکورانه است؟',
                durationOrPages: '۲۸ صفحه · نمونه رایگان',
                isFreeSample: true,
                contentOrTranscript:
                    'هر نوجوانی با الگوی منحصربه‌فردی از سیم‌کشی ذهنی، علایق طبیعی و استعدادهای ذاتی متولد می‌شود. زمانی که شما استعداد طبیعی خود را کشف می‌کنید و روی آن سرمایه‌گذاری منظم انجام می‌دهید، سرعت یادگیری شما تا ۳ برابر افزایش می‌یابد.\n\nدر این فصل یاد می‌گیریم چگونه ۳ نشانه اصلی استعداد ذاتی یعنی: ۱) اشتیاق درونی پیش از شروع کار، ۲) غرقگی و گذر سریع زمان هنگام انجام فعالیت، و ۳) یادگیری سریع‌تر نسبت به همسالان را در زندگی روزمره خود رصد و ثبت کنیم.',
                keyTakeaway: 'فرمول طلایی رشد: استعداد ذاتی × تمرین هدفمند = مهارت ممتاز.',
            },
            {
                id: 102,
                number: 2,
                title: 'فصل دوم: نقشه ۴ قلمرو استعداد (اجرایی، اثرگذاری، ارتباطی، تفکر استراتژیک)',
                durationOrPages: '۳۴ صفحه · نسخه کامل درون‌برنامه‌ای',
                isFreeSample: false,
                contentOrTranscript:
                    'بر اساس پژوهش‌های بنیاد گالوپ، ۳۴ استعداد انسان در ۴ قلمرو کلیدی دسته‌بندی می‌شوند. برخی نوجوانان در قلمرو «تفکر استراتژیک» می‌درخشند؛ آن‌ها عاشق تحلیل آینده، پرسیدن «چرا» و طراحی مسیر هستند. گروهی دیگر در قلمرو «ارتباط‌سازی» یا «اثرگذاری» انرژی می‌گیرند و توانایی فوق‌العاده‌ای در همراه‌سازی تیم دارند.\n\nدر جدول انتهای این فصل، ۵ موقعیت اخیر خود در مدرسه و کارگاه را بررسی کنید تا قلمرو غالب خودتان مشخص شود.',
                keyTakeaway: 'نقطه قوت واقعی شما جایی است که استعداد طبیعی با هدف ۹۰ روزه تلاقی می‌کند.',
            },
            {
                id: 103,
                number: 3,
                title: 'فصل سوم: تبدیل استعداد به اولین پروژه کارآفرینی و ارزش‌آفرینی',
                durationOrPages: '۴۰ صفحه · نسخه کامل درون‌برنامه‌ای',
                isFreeSample: false,
                contentOrTranscript:
                    'شناخت استعداد بدون اقدام عملی تنها یک آگاهی تئوری است. در این فصل یاد می‌گیرید چگونه از ترکیب ۲ استعداد برتر خود، یک چالش واقعی در محیط اطراف (مدرسه، خانواده یا جامعه آنلاین) را حل کنید و اولین مینی‌پروژه شخصی خود را بسازید.',
                keyTakeaway: 'هر پروژه کوچک موفق، اعتمادبه‌نفس شما را برای تصمیم‌های بزرگ‌تر ۱۰ برابر می‌کند.',
            },
        ],
    },
    {
        id: 2,
        title: 'پادکست اختصاصی رادیو رشد: طراحی آینده و ذهنیت برنده (۱۰ اپیزود)',
        slug: 'roshd-future-mindset-podcast',
        type: 'پادکست صوتی درون‌برنامه‌ای',
        deliveryType: 'in_app_podcast' as 'in_app_book' | 'in_app_podcast' | 'physical',
        inAppOnly: true,
        author: 'دکتر بیدی و اساتید دوره VIP',
        price: 290000,
        discount_price: 220000,
        image: '/images/vip-teen-future.svg',
        posterTag: 'پلیر صوتی درون‌برنامه‌ای',
        posterGradient: 'linear-gradient(145deg, #173F35 0%, #0E2922 100%)',
        durationOrVolume: '۱۰ اپیزود صوتی · ۴ ساعت و ۲۰ دقیقه',
        rating: 4.95,
        summary: 'مجموعه صوتی اختصاصی مهارت‌های تمرکز، غلبه بر اهمال‌کاری و گفتگو با نوجوانان کارآفرین (پخش فقط درون اپلیکیشن).',
        description:
            'این مجموعه پادکست ویژه دانش‌پذیران آکادمی رشد تولید شده و به صورت استریم درون‌برنامه‌ای (غیرقابل دانلود به صورت فایل MP3 بیرونی) در پلیر اختصاصی اپلیکیشن با قابلیت تنظیم سرعت پخش و یادداشت‌برداری باز می‌شود.',
        highlights: [
            'پخش اختصاصی در پلیر صوتی درون‌برنامه‌ای (بدون امکان دانلود فایل خام)',
            'اپیزود اول به صورت نمونه صوتی رایگان قابل شنیدن است',
            'تنظیم سرعت پخش (1x تا 2x) و خلاصه نکات کلیدی هر اپیزود',
            'مناسب گوش دادن در مسیر رفت‌وآمد یا پیش از شروع مطالعه روزانه',
        ],
        chaptersOrEpisodes: [
            {
                id: 201,
                number: 1,
                title: 'اپیزود ۱: راز قانون ۵ ثانیه برای غلبه بر اهمال‌کاری در نوجوانی',
                durationOrPages: '۲۴ دقیقه · نمونه صوتی رایگان',
                isFreeSample: true,
                contentOrTranscript:
                    'در این اپیزود صوتی بررسی می‌کنیم چرا مغز ما در برابر کارهای مهم مقاومت می‌کند و چطور با تکنیک شمارش معکوس ۵ ثانیه‌ای و قانون ۲ دقیقه، زنجیره تعلل را بشکنیم و بلافاصله وارد عمل شویم.',
                keyTakeaway: 'انگیزه بعد از شروع حرکت ساخته می‌شود، نه قبل از آن!',
            },
            {
                id: 202,
                number: 2,
                title: 'اپیزود ۲: چطور در عصر شبکه‌های اجتماعی تمرکز عمیق ۹۰ دقیقه‌ای بسازیم؟',
                durationOrPages: '۲۸ دقیقه · ویژه اعضای دوره',
                isFreeSample: false,
                contentOrTranscript:
                    'گفتگوی دکتر محمدرضا صادقی و استاد سارا کریمی درباره مدیریت دوپامین، طراحی میز مطالعه بدون حواس‌پرتی و بلوک‌های زمانی طلایی برای نوجوانان.',
                keyTakeaway: 'هر ۳۰ دقیقه تمرکز بدون گوشی معادل ۲ ساعت مطالعه پراکنده بازدهی دارد.',
            },
            {
                id: 203,
                number: 3,
                title: 'اپیزود ۳: داستان واقعی ۳ نوجوان ایرانی که از مهارت خود درآمد ساختند',
                durationOrPages: '۳۲ دقیقه · ویژه اعضای دوره',
                isFreeSample: false,
                contentOrTranscript:
                    'در این اپیزود مهندس نیما رحیمی مسیر واقعی سه نوجوان ۱۵ تا ۱۷ ساله مرکز رشد را تحلیل می‌کند که از طراحی گرافیک، برنامه‌نویسی و تولید محتوا اولین درآمد مستقل خود را کسب کردند.',
                keyTakeaway: 'کارآفرینی از حل یک نیاز ساده برای ۱۰ نفر اول شروع می‌شود.',
            },
        ],
    },
    {
        id: 3,
        title: 'دفتر برنامه‌ریزی ۹۰ روزه رشد (ژورنال هدف‌گذاری + راهنمای درون‌برنامه‌ای)',
        slug: '90-day-growth-planner',
        type: 'ابزار برنامه‌ریزی + راهنمای اپ',
        deliveryType: 'in_app_book' as 'in_app_book' | 'in_app_podcast' | 'physical',
        inAppOnly: true,
        author: 'تیم علمی مرکز رشد',
        price: 380000,
        discount_price: 295000,
        image: '/images/brand-logo.png',
        posterTag: 'ژورنال + کتاب‌خوان اپ',
        posterGradient: 'linear-gradient(145deg, #1E4638 0%, #122E24 100%)',
        durationOrVolume: '۱۲۰ صفحه تمرینی + قالب‌های ۹۰ روزه',
        rating: 4.85,
        summary: 'سیستم گام‌به‌گام پایش عادت‌ها، مرور هفتگی و تمرکز عمیق بر ۳ هدف کلیدی فصل.',
        description:
            'همراه با نسخه فیزیکی، راهنمای کامل تکمیل بوم ۹۰ روزه و چک‌لیست‌های مرور هفتگی به صورت درون‌برنامه‌ای در کتاب‌خوان اپلیکیشن باز می‌شود.',
        highlights: [
            'دسترسی آنی به راهنمای تکمیل ژورنال در کتاب‌خوان درون‌برنامه‌ای',
            'قالب هدف‌گذاری ۹۰ روزه منطبق با آیتم ۲ دوره طراحی آینده نوجوان',
            'جدول پیگیری عادت‌های ۲۱ روزه و بازنگری جمعه شب',
        ],
        chaptersOrEpisodes: [
            {
                id: 301,
                number: 1,
                title: 'بخش اول: نحوه انتخاب ۳ هدف ستاره قطبی در یک فصل ۹۰ روزه',
                durationOrPages: '۱۸ صفحه · پیش‌نمایش رایگان',
                isFreeSample: true,
                contentOrTranscript:
                    'بزرگ‌ترین اشتباه در برنامه‌ریزی، نوشتن ۲۰ هدف هم‌زمان برای یک سال است. در سیستم ۹۰ روزه رشد، شما تنها ۳ هدف اصلی (یک هدف تحصیلی/مهارتی، یک هدف عادت فردی و یک هدف پروژه‌ای) انتخاب می‌کنید و هر هفته آن را به گام‌های اجرایی خرد می‌کنید.',
                keyTakeaway: 'کمتر اما عمیق‌تر: ۳ هدف ۹۰ روزه زندگی شما را متحول می‌کند.',
            },
            {
                id: 302,
                number: 2,
                title: 'بخش دوم: آیین مرور هفتگی جمعه‌شب و اصلاح مسیر',
                durationOrPages: '۲۲ صفحه · نسخه کامل درون‌برنامه‌ای',
                isFreeSample: false,
                contentOrTranscript:
                    'هر جمعه شب تنها ۱۵ دقیقه زمان بگذارید و به ۳ سوال پاسخ دهید: ۱) این هفته چه دستاوردی داشتم؟ ۲) کجا زمانم هدر رفت؟ ۳) سه اولویت اصلی هفته آینده من چیست؟',
                keyTakeaway: 'برنامه‌ای که هر هفته مرور نشود، در هفته سوم فراموش می‌شود.',
            },
        ],
    },
    {
        id: 4,
        title: 'بسته کارت‌های کوچینگ و خودشناسی (۸۰ کارت تمرینی)',
        slug: 'coaching-discovery-cards',
        type: 'محصول فیزیکی + پیش‌نمایش در اپ',
        deliveryType: 'physical' as 'in_app_book' | 'in_app_podcast' | 'physical',
        inAppOnly: false,
        author: 'تیم پژوهشی مرکز رشد',
        price: 540000,
        discount_price: 450000,
        image: '/images/brand-logo.png',
        posterTag: '۸۰ کارت خودشناسی',
        posterGradient: 'linear-gradient(145deg, #2D4A3E 0%, #172B23 100%)',
        durationOrVolume: '۸۰ کارت گلاسه + دفترچه راهنما',
        rating: 4.9,
        summary: '۸۰ کارت تعاملی به همراه دفترچه راهنما برای اجرای تمرین‌های خودشناسی فردی و خانوادگی.',
        description:
            'این بسته شامل ۸۰ کارت پرسش عمیق کوچینگ در ۴ دسته «ارزش‌ها»، «استعدادها»، «چشم‌انداز آینده» و «تصمیم‌گیری» است که در کارگاه‌های حضوری و گفتگوهای خانوادگی استفاده می‌شود.',
        highlights: [
            'پیش‌نمایش نمونه کارت‌های تمرینی در همین صفحه محصول',
            'مناسب تمرین دونفره نوجوان و والدین یا جلسات کوچینگ',
            'ارسال پستی ویژه اعضای آکادمی رشد',
        ],
        chaptersOrEpisodes: [
            {
                id: 401,
                number: 1,
                title: 'نمونه کارت‌های دسته «کشف استعداد و اشتیاق» (کارت ۱ تا ۵)',
                durationOrPages: '۵ کارت نمونه رایگان',
                isFreeSample: true,
                contentOrTranscript:
                    'کارت شماره ۱: اگر قرار باشد یک مهارت را به دوستانت آموزش دهی که در آن از همه روان‌تر هستی، آن چه مهارتی است؟\nکارت شماره ۲: آخرین باری که آن‌قدر غرق یک کار شدی که متوجه گذر زمان نشدی، مشغول چه کاری بودی؟',
                keyTakeaway: 'پرسش درست، نیمی از مسیر خودشناسی است.',
            },
        ],
    },
];

export const mockBlogPosts = [
    {
        id: 1,
        title: 'تفاوت استعداد ذاتی با مهارت اکتسابی؛ چرا تلاش بدون شناخت استعداد کافی نیست؟',
        slug: 'innate-talent-vs-acquired-skill',
        category: 'استعدادیابی',
        read_time: '۶ دقیقه مطالعه',
        published_at: '۱۴۰۴/۰۱/۲۰',
        image: '/images/brand-logo.png',
        excerpt: 'بسیاری از افراد سال‌ها در مسیری تلاش می‌کنند که با ساختار شناختی و استعدادهای طبیعی آن‌ها همخوانی ندارد...',
    },
    {
        id: 2,
        title: '۷ پرسش قدرتمند کوچینگ که در مواقع سردرگمی مسیر شما را روشن می‌کند',
        slug: '7-powerful-coaching-questions',
        category: 'کوچینگ',
        read_time: '۵ دقیقه مطالعه',
        published_at: '۱۴۰۴/۰۱/۱۵',
        image: '/images/brand-logo.png',
        excerpt: 'در جلسات کوچینگ به جای دادن راه‌حل آماده، با پرسش‌های عمیق به مراجع کمک می‌کنیم پاسخ درونی خود را بیابد...',
    },
];

export const mockEvents = [
    {
        id: 1,
        slug: 'teen-future-talent-live-webinar',
        title: 'وبینار زنده کشف استعداد و نقشه راه آینده نوجوان (اسکای‌روم)',
        type: 'webinar',
        platform: 'skyroom',
        platformLabel: 'اسکای‌روم (Skyroom)',
        roomCode: 'ROSHD-VIP-104',
        accessHint: 'ورود با شماره موبایل ثبت‌نامی یا گزینه ورود مهمان',
        status: 'live',
        participantsCount: 48,
        isVipOnly: true,
        summary: 'نشست آنلاین استعدادیابی علمی بر اساس مدل گاردنر و هالند همراه با پرسش و پاسخ زنده با دکتر علیرضا بیدی.',
        description: 'در این وبینار زنده که از طریق اسکای‌روم برگزار می‌شود، با ۳ نشانه اصلی استعداد ذاتی نوجوان و نحوه انتخاب رشته هوشمندانه آشنا می‌شوید.',
        poster: '/images/vip-teen-future.svg',
        live_url: 'https://www.skyroom.online/ch/roshd-academy/teen-future-vip',
        event_date: 'امروز · پنج‌شنبه ۱۱ اردیبهشت ساعت ۱۷:۰۰',
        duration_minutes: 90,
        location: 'اسکای‌روم (Skyroom) · اتاق VIP رشد',
        speaker: 'دکتر علیرضا بیدی · راهبر اصلی دوره',
        price: 0,
        discount_price: 0,
    },
    {
        id: 2,
        slug: 'systemic-decision-making-google-meet',
        title: 'کلاس آنلاین کارگاه تصمیم‌گیری و هدف‌گذاری ۹۰ روزه (گوگل میت)',
        type: 'webinar',
        platform: 'google_meet',
        platformLabel: 'گوگل میت (Google Meet)',
        roomCode: 'rsh-daca-vip',
        accessHint: 'ورود مستقیم از مرورگر بدون نیاز به نصب برنامه',
        status: 'upcoming',
        participantsCount: 34,
        isVipOnly: true,
        summary: 'کارگاه تعاملی ویژه آیتم ۲ دوره طراحی آینده نوجوان با تدریس استاد سارا کریمی.',
        description: 'آموزش عملی بوم هدف‌گذاری ۹۰ روزه، مدیریت زمان و حل مسئله به صورت آنلاین در بستر گوگل میت.',
        poster: '/images/growth-editorial.png',
        live_url: 'https://meet.google.com/rsh-daca-vip',
        event_date: 'یکشنبه ۱۴ اردیبهشت ساعت ۱۸:۰۰',
        duration_minutes: 90,
        location: 'گوگل میت (Google Meet)',
        speaker: 'استاد سارا کریمی · مدرس آیتم ۲',
        price: 0,
        discount_price: 0,
    },
    {
        id: 3,
        slug: 'parents-club-live-qa-skyroom',
        title: 'نشست آنلاین پرسش و پاسخ والدین با تیم کوچینگ رشد (اسکای‌روم)',
        type: 'webinar',
        platform: 'skyroom',
        platformLabel: 'اسکای‌روم (Skyroom)',
        roomCode: 'PARENTS-1404',
        accessHint: 'ورود آزاد برای والدین و دانش‌پذیران آکادمی رشد',
        status: 'upcoming',
        participantsCount: 72,
        isVipOnly: false,
        summary: 'نشست تخصصی ویژه والدین برای بررسی کارنامه استعدادیابی، مدیریت چالش‌های انگیزشی و همراهی موثر در منزل.',
        description: 'در این نشست آنلاین در بستر اسکای‌روم، دکتر محمدرضا صادقی به سوالات والدین درباره هدایت تحصیلی و ارتباط بدون تنش با نوجوان پاسخ می‌دهد.',
        poster: '/images/vip-teen-future.svg',
        live_url: 'https://www.skyroom.online/ch/roshd-academy/parents-club',
        event_date: 'چهارشنبه ۱۷ اردیبهشت ساعت ۲۰:۰۰',
        duration_minutes: 75,
        location: 'اسکای‌روم (Skyroom) · تالار والدین رشد',
        speaker: 'دکتر محمدرضا صادقی · متخصص روان‌شناسی نوجوان',
        price: 0,
        discount_price: 0,
    },
    {
        id: 4,
        slug: 'teen-identity-and-parenting-seminar',
        title: 'سمینار و کارگاه فن بیان، مذاکره و ارتباط موثر نوجوان (ادوبی کانکت)',
        type: 'seminar',
        platform: 'adobe_connect',
        platformLabel: 'ادوبی کانکت (Adobe Connect)',
        roomCode: 'COMM-302',
        accessHint: 'قابلیت مشاهده در مرورگر، اپلیکیشن موبایل و ادوبی کانکت',
        status: 'recorded',
        participantsCount: 115,
        isVipOnly: false,
        summary: 'همایش تخصصی ویژه والدین و نوجوانان در سالن همایش مرکز رشد دکتر بیدی به همراه پخش زنده و بازپخش در ادوبی کانکت.',
        description: 'بررسی مهارت‌های ارتباط مؤثر، فن بیان، قاطعیت محترمانه و تقویت عزت‌نفس نوجوان با تدریس دکتر امیرحسین نادری.',
        poster: '/images/roshd-logo.png',
        live_url: 'https://live.roshdacademy.ir/communication-workshop',
        event_date: 'پنج‌شنبه ۱۸ اردیبهشت · دارای بازپخش',
        duration_minutes: 120,
        location: 'تهران، سالن VIP مرکز رشد + ادوبی کانکت',
        speaker: 'دکتر امیرحسین نادری · مدرس آیتم ۳',
        price: 350000,
        discount_price: 0,
    },
];

export const mockServicesList = [
    {
        id: 1,
        title: 'بسته جامع استعدادیابی علمی (گاردنر، هالند و کلیفتون)',
        slug: 'talent-assessment',
        summary: 'ارزیابی چندبعدی هوش‌های هشت‌گانه، رغبت‌سنجی شغلی و نیمرخ شخصیتی همراه با گزارش تحلیلی ۳۰ صفحه‌ای.',
        description: 'کشف دقیق نقاط قوت پنهان نوجوان و ترسیم نقشه راه ۵ ساله تحصیلی و مهارتی.',
        icon: 'Compass',
        price: 1400000,
        features: ['آزمون استاندارد گاردنر و MBTI', 'کارنامه تحلیلی ۳۰ صفحه‌ای', 'جلسه تفسیر اختصاصی با خانواده'],
        cta_text: 'مشاهده و رزرو ارزیابی',
    },
    {
        id: 2,
        title: 'مشاوره اختصاصی هدایت تحصیلی و انتخاب رشته (نهم به دهم و کنکور)',
        slug: 'academic-counseling',
        summary: 'پایان سردرگمی بین تجربی، ریاضی، انسانی و هنرستان با تحلیل دقیق استعداد و آینده شغلی.',
        description: 'جلسه تخصصی با حضور مشاور ارشد مرکز جهت بررسی کارنامه، آزمون‌های استعداد و انتخاب رشته مطمئن.',
        icon: 'Target',
        price: 850000,
        features: ['تحلیل تطبیقی رشته‌ها و بازار کار آینده', 'جلسه مشترک نوجوان و والدین', 'پشتیبانی یک‌ماهه انتخاب رشته'],
        cta_text: 'رزرو وقت مشاوره',
    },
    {
        id: 3,
        title: 'کوچینگ فردی ۱ به ۱ رشد، تمرکز و رفع اهمال‌کاری',
        slug: 'personal-coaching',
        summary: 'همراهی هفتگی منتور اختصاصی برای ساخت عادت‌های مطالعه، هدف‌گذاری ۹۰ روزه و تقویت اعتمادبه‌نفس.',
        description: 'برگزاری جلسات منظم حضوری یا آنلاین به همراه گزارش پیشرفت منظم برای والدین.',
        icon: 'Sparkles',
        price: 950000,
        features: ['جلسات هفتگی ۱ به ۱ با کوچ ارشد', 'پایش بوم هدف‌گذاری ۹۰ روزه', 'گزارش پیامکی و ماهانه به والدین'],
        cta_text: 'شروع مسیر کوچینگ',
    },
];

export const mockCoachesList = [
    {
        id: 1,
        user_id: 1,
        name: 'دکتر علیرضا بیدی',
        specialty: 'مشاور ارشد استعدادیابی، هدایت تحصیلی و راهبر دوره VIP',
        bio: 'بیش از ۱۲ سال تجربه در استعدادیابی نوجوانان، طراحی مسیر شغلی و کوچینگ تحول فردی.',
        experience_years: 12,
        hourly_rate: 950000,
        rating: 4.95,
        is_featured: true,
    },
    {
        id: 2,
        user_id: 2,
        name: 'دکتر محمدرضا صادقی',
        specialty: 'متخصص روان‌شناسی نوجوان و مدرس آیتم خودشناسی',
        bio: 'روان‌شناس تربیتی و ارزیاب تخصصی آزمون‌های هوش چندگانه گاردنر و رغبت‌سنجی هالند.',
        experience_years: 9,
        hourly_rate: 780000,
        rating: 4.9,
        is_featured: true,
    },
    {
        id: 3,
        user_id: 3,
        name: 'استاد سارا کریمی',
        specialty: 'کوچ برنامه‌ریزی ۹۰ روزه و مدیریت زمان نوجوان',
        bio: 'همراه دانش‌پذیران در طراحی بوم هدف‌گذاری، رفع اهمال‌کاری و ساخت عادت‌های پایدار.',
        experience_years: 7,
        hourly_rate: 690000,
        rating: 4.88,
        is_featured: false,
    },
    {
        id: 4,
        user_id: 4,
        name: 'مهندس نیما رحیمی',
        specialty: 'منتور کارآفرینی، سواد مالی و پروژه‌های نوجوانان',
        bio: 'مربی راه‌اندازی اولین پروژه‌های ارزش‌آفرین و مهارت‌های مالی ویژه نسل نو.',
        experience_years: 8,
        hourly_rate: 750000,
        rating: 4.92,
        is_featured: true,
    },
];

export const mockTestimonialsList = [
    {
        id: 1,
        name: 'سارا محمدی',
        role: 'دانش‌پذیر دوره VIP طراحی آینده نوجوان · پایه دهم',
        content: 'با کارگاه‌های حضوری، کلاس‌های آنلاین اسکای‌روم و راهنمایی‌های مستقیم اساتید هر آیتم، توانستم مسیر واقعی خودم را پیدا کنم.',
        rating: 5,
    },
    {
        id: 2,
        name: 'مهندس رضایی',
        role: 'ولی دانش‌آموز دوره VIP',
        content: 'گزارش‌های منظم به والدین، چت اختصاصی با مدرس هر سرفصل و جلسات کوچینگ فردی آرامش خاطر بی‌نظیری به خانواده ما داد.',
        rating: 5,
    },
    {
        id: 3,
        name: 'پارسا کریمی',
        role: 'دانش‌پذیر آیتم کارآفرینی و سواد مالی',
        content: 'کتاب قطب‌نمای استعداد و پادکست‌های رادیو رشد داخل اپلیکیشن دید من را به آینده و مهارت‌آموزی کاملاً متحول کرد.',
        rating: 5,
    },
];

export function getMockPageData(component: string, cleanPath = '/'): Record<string, any> {
    const base = {
        site: mockSite,
        menus: mockMenus,
        liveWebinar: {
            slug: mockEvents[0].slug,
            title: mockEvents[0].title,
            event_date: 'امروز ساعت ۱۷:۰۰',
            url: '/events/teen-future-talent-live-webinar',
        },
        auth: {
            user: {
                id: 1,
                name: 'نوید محمدی',
                email: 'navid@roshd.ir',
                phone: '09123456789',
                role: 'admin',
                unread_notifications: 2,
            },
        },
        flash: {},
    };

    const podcastProduct = mockProducts.find((p) => p.deliveryType === 'in_app_podcast') || mockProducts[1];
    const bookProducts = mockProducts.filter((p) => p.deliveryType !== 'in_app_podcast');

    if (component === 'Courses/Index') {
        return {
            ...base,
            courses: {
                data: mockCourses,
                current_page: 1,
                last_page: 1,
                per_page: 12,
                total: mockCourses.length,
                links: [],
            },
            categories: [
                { id: 1, name: 'نوجوانان و والدین', slug: 'teens-parents' },
                { id: 2, name: 'استعدادیابی بزرگسالان', slug: 'talent-adults' },
                { id: 3, name: 'کوچینگ حرفه‌ای', slug: 'coaching' },
                { id: 4, name: 'کارآفرینی', slug: 'entrepreneurship' },
            ],
            filters: { q: '', level: '', category: '', sort: 'latest', in_person: false },
        };
    }

    if (component === 'Courses/Show') {
        const slug = cleanPath.replace('/courses/', '');
        const rawCourse = mockCourses.find((c) => c.slug === slug) || mockCourses[0];
        const normalizedModules = (rawCourse.modules && rawCourse.modules.length > 0
            ? rawCourse.modules
            : mockCourses[0].modules
        ).map((m: any) => ({
            id: m.id,
            title: m.title,
            lessons: (m.lessons || []).map((l: any) => ({
                id: l.id,
                title: l.title,
                duration_minutes: 90,
                is_free: Boolean(l.is_free),
            })),
        }));
        return {
            ...base,
            course: {
                ...rawCourse,
                certificate_enabled: true,
                is_in_person: Boolean(rawCourse.is_vip),
                location: mockVipFlagshipDefaults.in_person_location,
                instructor: {
                    id: rawCourse.instructor?.id ?? 1,
                    specialty: rawCourse.instructor?.title ?? 'تیم اساتید مرکز رشد دکتر بیدی',
                    bio: 'تیم اساتید تخصصی خودشناسی، هدف‌گذاری ۹۰ روزه، ارتباط مؤثر و سواد مالی نوجوانان.',
                    experience_years: 12,
                    user: {
                        name: rawCourse.instructor?.name ?? 'دکتر علیرضا بیدی',
                        avatar: rawCourse.instructor?.avatar ?? '/images/brand-logo.png',
                    },
                },
                modules: normalizedModules,
                faqs: [
                    {
                        id: 1,
                        question: 'آیا جلسات آنلاین دوره در اسکای‌روم و گوگل میت ضبط می‌شوند؟',
                        answer: 'بله، لینک مستقیم کلاس‌های آنلاین در بخش وبینارهای اپلیکیشن و پنل کاربری قرار می‌گیرد و بازپخش آن نیز فعال است.',
                    },
                    {
                        id: 2,
                        question: 'نحوه ارتباط با مدرس هر آیتم چگونه است؟',
                        answer: 'در اپلیکیشن و پنل رشد، برای هر یک از ۴ آیتم تخصصی چت خصوصی با مدرس همان آیتم، گروه دوره و پشتیبانی کلی فعال است.',
                    },
                ],
            },
            related: mockCourses.filter((c) => c.id !== rawCourse.id),
            relatedCourses: mockCourses.filter((c) => c.id !== rawCourse.id),
            reviews: mockTestimonialsList.map((t) => ({
                id: t.id,
                name: t.name,
                rating: t.rating,
                title: t.role,
                body: t.content,
                created_at: '۱۴۰۴/۰۲/۰۱',
            })),
            review_summary: { count: 48, average: 4.95 },
            can_review: true,
            enrollment: {
                is_enrolled: true,
                status: 'active',
                progress_percent: 68,
            },
        };
    }

    if (component === 'Shop/Index') {
        const mappedProducts = mockProducts.map((p) => ({
            ...p,
            type: p.deliveryType === 'in_app_podcast' ? 'podcast' : p.deliveryType === 'in_app_book' ? 'book' : 'digital',
            pages: p.deliveryType === 'in_app_book' ? 184 : null,
            episodes:
                p.deliveryType === 'in_app_podcast'
                    ? p.chaptersOrEpisodes.map((ep) => ({
                          id: ep.id,
                          title: ep.title,
                          duration_seconds: 1500,
                          is_free: ep.isFreeSample,
                      }))
                    : [],
        }));
        return {
            ...base,
            products: {
                data: mappedProducts,
                current_page: 1,
                last_page: 1,
                per_page: 12,
                total: mappedProducts.length,
                links: [],
            },
            categories: [
                { id: 1, name: 'کتاب‌خوان درون‌برنامه‌ای', slug: 'books' },
                { id: 2, name: 'پادکست‌های رادیو رشد', slug: 'podcasts' },
                { id: 3, name: 'ابزارهای برنامه‌ریزی و کوچینگ', slug: 'tools' },
            ],
            featured: mappedProducts.slice(0, 3),
            filters: { q: '', type: '', category: '', sort: 'latest' },
        };
    }

    if (component === 'Shop/Show') {
        const slug = cleanPath.replace('/shop/', '');
        const rawProduct = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
        const isPod = rawProduct.deliveryType === 'in_app_podcast';
        const mappedProduct = {
            ...rawProduct,
            type: isPod ? 'podcast' : 'book',
            has_preview_file: true,
            has_download_edition: !rawProduct.inAppOnly,
            can_view_preview: true,
            can_download: !rawProduct.inAppOnly,
            pages: isPod ? null : 184,
            publisher: 'انتشارات مرکز رشد دکتر بیدی',
            episodes: isPod
                ? rawProduct.chaptersOrEpisodes.map((ep) => ({
                      id: ep.id,
                      title: ep.title,
                      description: ep.contentOrTranscript,
                      duration_seconds: 1500,
                      is_free: ep.isFreeSample,
                  }))
                : [],
            reviews: mockTestimonialsList.map((t) => ({
                id: t.id,
                name: t.name,
                rating: t.rating,
                title: t.role,
                body: t.content,
                created_at: '۱۴۰۴/۰۲/۰۱',
            })),
            review_summary: { count: 32, average: rawProduct.rating },
            can_review: true,
        };
        return {
            ...base,
            product: mappedProduct,
            related: mockProducts.filter((p) => p.id !== rawProduct.id),
            relatedProducts: mockProducts.filter((p) => p.id !== rawProduct.id),
            wishlisted: false,
        };
    }

    if (component === 'Events/Index') {
        return {
            ...base,
            events: {
                data: mockEvents,
                links: [],
                total: mockEvents.length,
            },
            filters: { type: '' },
        };
    }

    if (component === 'Events/Show') {
        const slug = cleanPath.replace('/events/', '');
        const event = mockEvents.find((e) => e.slug === slug) || mockEvents[0];
        return {
            ...base,
            event,
            has_access: true,
        };
    }

    if (component === 'Coaching/Index') {
        return {
            ...base,
            coaches: mockCoachesList,
            availability: [
                { id: 1, coach_id: 1, coach_name: 'دکتر علیرضا بیدی', date: 'پنج‌شنبه ۱۱ اردیبهشت', start_time: '۱۶:۰۰', end_time: '۱۷:۰۰' },
                { id: 2, coach_id: 2, coach_name: 'دکتر محمدرضا صادقی', date: 'یکشنبه ۱۴ اردیبهشت', start_time: '۱۷:۳۰', end_time: '۱۸:۳۰' },
            ],
            services: mockServicesList,
            testimonials: mockTestimonialsList,
        };
    }

    if (component === 'Services/Index' || component === 'Services/Show') {
        const slug = cleanPath.replace('/services/', '');
        const service = mockServicesList.find((s) => s.slug === slug) || mockServicesList[0];
        return {
            ...base,
            services: mockServicesList,
            service,
        };
    }

    if (component === 'Blog/Index' || component === 'Blog/Show') {
        const mappedPosts = mockBlogPosts.map((p) => ({
            ...p,
            cover_image: p.image,
            reading_time: 6,
            author: { name: 'دکتر علیرضا بیدی' },
            category: { name: p.category, slug: 'talent' },
        }));
        return {
            ...base,
            posts: {
                data: mappedPosts,
                current_page: 1,
                last_page: 1,
                per_page: 12,
                total: mappedPosts.length,
                links: [],
            },
            featured: mappedPosts[0],
            post: mappedPosts[0],
            categories: [
                { id: 1, name: 'استعدادیابی', slug: 'talent' },
                { id: 2, name: 'کوچینگ نوجوان', slug: 'coaching' },
            ],
            filters: { q: '', category: '', sort: 'latest' },
        };
    }

    if (component === 'Dashboard' || component.startsWith('Dashboard/')) {
        return {
            ...base,
            onboarding_incomplete: false,
            profile: { name: 'نوید محمدی', avatar: '/images/roshd-logo.png', role: 'دانش‌پذیر VIP دوره طراحی آینده نوجوان · پایه یازدهم' },
            stats: {
                courses_count: 4,
                average_progress: 68,
                active_goals: 3,
                upcoming_sessions: 3,
                pending: 1,
                graded: 4,
                average_score: 95,
            },
            courses: mockCourses.map((c, idx) => ({
                id: c.id,
                title: c.title,
                slug: c.slug,
                thumbnail: c.thumbnail,
                duration_minutes: 1200,
                progress_percent: idx === 0 ? 75 : 60,
                status: 'active',
                is_in_person: Boolean(c.is_vip),
                location: c.is_vip ? mockVipFlagshipDefaults.in_person_location : null,
            })),
            sessions: [
                {
                    id: 101,
                    title: 'وبینار زنده کشف استعداد و نقشه راه آینده نوجوان',
                    scheduled_at: 'امروز · پنج‌شنبه ۱۱ اردیبهشت ساعت ۱۷:۰۰',
                    duration_minutes: 90,
                    status: 'confirmed',
                    coach: 'دکتر علیرضا بیدی · راهبر اصلی دوره VIP',
                    platform_label: 'اسکای‌روم (Skyroom)',
                    room_code: 'ROSHD-VIP-104',
                    meeting_link: 'https://www.skyroom.online/ch/roshd-academy/teen-future-vip',
                },
                {
                    id: 102,
                    title: 'کلاس آنلاین کارگاه تصمیم‌گیری و هدف‌گذاری ۹۰ روزه (آیتم ۲)',
                    scheduled_at: 'یکشنبه ۱۴ اردیبهشت ساعت ۱۸:۰۰',
                    duration_minutes: 90,
                    status: 'confirmed',
                    coach: 'استاد سارا کریمی · مدرس آیتم ۲',
                    platform_label: 'گوگل میت (Google Meet)',
                    room_code: 'rsh-daca-vip',
                    meeting_link: 'https://meet.google.com/rsh-daca-vip',
                },
                {
                    id: 103,
                    title: 'نشست آنلاین پرسش و پاسخ والدین با تیم کوچینگ رشد',
                    scheduled_at: 'چهارشنبه ۱۷ اردیبهشت ساعت ۲۰:۰۰',
                    duration_minutes: 75,
                    status: 'confirmed',
                    coach: 'دکتر محمدرضا صادقی · متخصص روان‌شناسی نوجوان',
                    platform_label: 'اسکای‌روم (Skyroom)',
                    room_code: 'PARENTS-1404',
                    meeting_link: 'https://www.skyroom.online/ch/roshd-academy/parents-club',
                },
            ],
            goals: [
                { id: 1, title: 'تکمیل بوم هدف‌گذاری ۹۰ روزه و نیمرخ استعدادیابی گاردنر', description: 'همگام با آیتم ۱ و ۲ دوره طراحی آینده نوجوان', status: 'in_progress', due_date: '1404-02-25', total_tasks: 5, completed_tasks: 4 },
                { id: 2, title: 'مطالعه فصل دوم کتاب قطب‌نمای استعداد در کتاب‌خوان اپ', description: 'شناسایی ۴ قلمرو استعداد و ثبت در ژورنال', status: 'in_progress', due_date: '1404-02-20', total_tasks: 3, completed_tasks: 2 },
                { id: 3, title: 'طراحی اولین مینی‌پروژه کارآفرینی (آیتم ۴)', description: 'با منتورینگ مستقیم مهندس نیما رحیمی', status: 'in_progress', due_date: '1404-03-10', total_tasks: 4, completed_tasks: 2 },
            ],
            certificates: [
                {
                    id: 1,
                    certificate_number: 'ROSHD-VIP-1404',
                    issued_at: '۱۴۰۴/۰۱/۲۵',
                    course: { id: 100, title: mockCourses[0].title },
                    url: '/dashboard/certificates',
                    download_url: '/dashboard/certificates',
                },
            ],
            assignments: [
                { id: 1, title: 'تحلیل ۵ استعداد برتر شخصی و طراحی مینی‌پروژه', course: mockCourses[0].title, course_slug: mockCourses[0].slug, status: 'graded', score: 96, max_score: 100, feedback: 'تحلیل بسیار دقیق و عالی از نقاط قوت استراتژیک شما در کارگاه VIP.', submitted_at: '1404-02-02', url: '/dashboard/assignments' },
                { id: 2, title: 'تکمیل جدول ۳ هدف ستاره قطبی در بوم ۹۰ روزه', course: mockCourses[0].title, course_slug: mockCourses[0].slug, status: 'pending', score: null, max_score: 100, feedback: null, submitted_at: '1404-02-09', url: '/dashboard/assignments' },
            ],
            assignment_stats: { pending: 1, graded: 4, average_score: 95 },
            orders: [
                { id: 1, order_number: 'INV-404-881', first_item: 'ثبت‌نام دوره جامع طراحی آینده نوجوان (VIP)', status: 'paid', total: 3900000, created_at: '1404-01-12', items_count: 1 },
                { id: 2, order_number: 'INV-404-904', first_item: 'جلسه کوچینگ اختصاصی نقشه راه و استعدادیابی', status: 'paid', total: 680000, created_at: '1404-01-28', items_count: 1 },
                { id: 3, order_number: 'INV-404-942', first_item: 'بسته برنامه‌ریزی ۹۰ روزه و کتاب قطب‌نمای استعداد', status: 'paid', total: 420000, created_at: '1404-02-05', items_count: 2 },
            ],
            podcasts: [
                {
                    id: podcastProduct.id,
                    title: podcastProduct.title,
                    slug: podcastProduct.slug,
                    description: podcastProduct.summary,
                    image: podcastProduct.image,
                    episodes: podcastProduct.chaptersOrEpisodes.map((ep) => ({
                        id: ep.id,
                        title: ep.title,
                        description: ep.contentOrTranscript,
                        duration_seconds: 1500,
                        is_free: true,
                        audio_url: '',
                    })),
                },
            ],
            downloads: bookProducts.map((b) => ({
                id: b.id,
                title: b.title,
                slug: b.slug,
                type: 'book' as const,
                description: b.summary,
                image: b.image,
                has_preview: true,
                preview_url: `/mobile-app?screen=inAppReader&product=${b.slug}`,
                has_file: false,
                download_url: null,
            })),
            items: [
                { id: 1, type: 'course' as const, title: mockCourses[0].title, url: `/courses/${mockCourses[0].slug}`, image: mockCourses[0].thumbnail },
                { id: 2, type: 'product' as const, title: mockProducts[0].title, url: `/shop/${mockProducts[0].slug}`, image: mockProducts[0].image },
            ],
            code: 'ROSHD-NAVID',
            invite_url: 'https://markazbidi.ir/invite/ROSHD-NAVID',
            count: 3,
            reward_percent: 15,
            referrals: [
                { id: 1, name: 'امیرعلی رضایی', created_at: '1404-01-20', coupon_code: 'VIP-GIFT-15', rewarded: true },
                { id: 2, name: 'سارا محمدی', created_at: '1404-02-03', coupon_code: 'VIP-GIFT-15', rewarded: true },
            ],
            notifications: {
                data: [
                    {
                        id: 'notif-1',
                        title: 'وبینار زنده کشف استعداد در اسکای‌روم فعال شد',
                        message: 'کلاس آنلاین امروز ساعت ۱۷:۰۰ در اتاق VIP اسکای‌روم (کد ROSHD-VIP-104) برگزار می‌شود.',
                        url: '/events/teen-future-talent-live-webinar',
                        read_at: null,
                        created_at: '1404-02-11',
                    },
                    {
                        id: 'notif-2',
                        title: 'بازخورد جدید دکتر محمدرضا صادقی در چت آیتم ۱',
                        message: 'نتیجه کارگاه اول و نمودار استعدادهای تحلیلی شما بررسی شد و امتیاز ۸۸ ثبت گردید.',
                        url: '/mobile-app?screen=chat',
                        read_at: null,
                        created_at: '1404-02-10',
                    },
                ],
                links: [],
            },
            recommendations: mockCourses.slice(1).map((c) => ({ ...c, type: 'course' as const })),
        };
    }

    return {
        ...base,
        stats: mockStats,
        featuredCourses: mockCourses,
        courses: mockCourses,
        services: mockServicesList,
        testimonials: mockTestimonialsList,
        events: mockEvents,
        books: bookProducts.map((b) => ({
            id: b.id,
            title: b.title,
            slug: b.slug,
            type: 'book',
            image: b.image,
            price: b.price,
            discount_price: b.discount_price,
            author: b.author,
            pages: 184,
        })),
        podcast: {
            id: podcastProduct.id,
            title: podcastProduct.title,
            slug: podcastProduct.slug,
            type: 'podcast',
            image: podcastProduct.image,
            price: podcastProduct.price,
            discount_price: podcastProduct.discount_price,
            author: podcastProduct.author,
            episodes: podcastProduct.chaptersOrEpisodes.map((ep) => ({
                id: ep.id,
                title: ep.title,
                duration_seconds: 1480,
                is_free: ep.isFreeSample,
            })),
        },
        featuredProducts: mockProducts,
        products: mockProducts,
        posts: mockBlogPosts,
        latestPosts: mockBlogPosts,
    };
}
