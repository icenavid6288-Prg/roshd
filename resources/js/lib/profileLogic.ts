export interface UserProfileState {
    name: string;
    studentCode: string;
    gradeAndField: string;
    city: string;
    phone: string;
    parentPhone: string;
    bio: string;
    xp: number;
    nextLevelXp: number;
    levelNumber: number;
    levelTitle: string;
    learningHours: number;
    attendanceRate: number;
    badgesCount: number;
    referralCode: string;
    walletBalance: number;
    giftCredit: number;
    parentWeeklyReportEnabled: boolean;
    lastParentReportSentAt: string;
}

export interface WalletOrder {
    id: string;
    title: string;
    category: 'دوره VIP' | 'کوچینگ' | 'فروشگاه' | 'شارژ کیف پول';
    date: string;
    amount: number;
    invoiceCode: string;
    status: 'paid' | 'pending';
}

export interface TalentDimension {
    id: string;
    title: string;
    score: number;
    summary: string;
}

export interface EarnedBadge {
    id: string;
    title: string;
    subtitle: string;
    earnedDate: string;
    unlocked: boolean;
}

export interface SmartNotificationSettings {
    classSmsTwoHoursBefore: boolean;
    parentAttendanceSms: boolean;
    dailyGoalAndHomeworkPush: boolean;
    coachFeedbackAlert: boolean;
}

export const defaultUserProfile: UserProfileState = {
    name: 'نوید محمدی',
    studentCode: 'VIP-403-892',
    gradeAndField: 'پایه یازدهم · ریاضی و طراحی محصول',
    city: 'تهران',
    phone: '09123456789',
    parentPhone: '09121112233',
    bio: 'عضو دوره طراحی آینده نوجوان؛ متمرکز بر ساخت عادت‌های پایدار و انتخاب مسیر شغلی.',
    xp: 1450,
    nextLevelXp: 2000,
    levelNumber: 4,
    levelTitle: 'معمار آینده',
    learningHours: 42,
    attendanceRate: 95,
    badgesCount: 6,
    referralCode: 'ROSHD-NAVID',
    walletBalance: 480000,
    giftCredit: 150000,
    parentWeeklyReportEnabled: true,
    lastParentReportSentAt: 'جمعه ۱۴ اردیبهشت · ساعت ۲۰:۰۰',
};

export const defaultWalletOrders: WalletOrder[] = [
    {
        id: 'ord-101',
        title: 'ثبت‌نام دوره جامع طراحی آینده نوجوان (VIP)',
        category: 'دوره VIP',
        date: '۱۲ فروردین ۱۴۰۴',
        amount: 3900000,
        invoiceCode: 'INV-404-881',
        status: 'paid',
    },
    {
        id: 'ord-102',
        title: 'جلسه کوچینگ اختصاصی نقشه راه و استعدادیابی',
        category: 'کوچینگ',
        date: '۲۸ فروردین ۱۴۰۴',
        amount: 680000,
        invoiceCode: 'INV-404-904',
        status: 'paid',
    },
    {
        id: 'ord-103',
        title: 'بسته برنامه‌ریزی ۹۰ روزه و ژورنال عملگرایی',
        category: 'فروشگاه',
        date: '۵ اردیبهشت ۱۴۰۴',
        amount: 420000,
        invoiceCode: 'INV-404-942',
        status: 'paid',
    },
];

export const defaultTalentDimensions: TalentDimension[] = [
    {
        id: 'strategic',
        title: 'تفکر استراتژیک و آینده‌نگری',
        score: 88,
        summary: 'توانایی بالا در ترسیم مسیر ۹۰ روزه و اولویت‌بندی پروژه‌های شخصی',
    },
    {
        id: 'leadership',
        title: 'رهبری تیمی و ارتباط موثر',
        score: 84,
        summary: 'مشارکت فعال در کارگاه‌های حضوری و هدایت گفت‌وگوهای گروهی',
    },
    {
        id: 'problem_solving',
        title: 'حل مسئله خلاق و تصمیم‌گیری',
        score: 79,
        summary: 'تحلیل دقیق چالش‌ها و ارائه راهکارهای اجرایی در تمرین‌های هفتگی',
    },
];

export const defaultEarnedBadges: EarnedBadge[] = [
    {
        id: 'badge-punctual',
        title: 'خوش‌قول‌ترین عضو VIP',
        subtitle: 'حضور به‌موقع در ۶ کارگاه متوالی',
        earnedDate: 'اردیبهشت ۱۴۰۴',
        unlocked: true,
    },
    {
        id: 'badge-architect',
        title: 'معمار هدف ۹۰ روزه',
        subtitle: 'تدوین کامل بوم نقشه راه شخصی',
        earnedDate: 'فروردین ۱۴۰۴',
        unlocked: true,
    },
    {
        id: 'badge-streak',
        title: 'پیوستگی ۲۱ روزه',
        subtitle: 'ثبت مستمر گزارش تمرین روزانه',
        earnedDate: 'فروردین ۱۴۰۴',
        unlocked: true,
    },
];

export const defaultNotificationSettings: SmartNotificationSettings = {
    classSmsTwoHoursBefore: true,
    parentAttendanceSms: true,
    dailyGoalAndHomeworkPush: true,
    coachFeedbackAlert: true,
};

export function calculateLevelProgress(xp: number, nextLevelXp: number): number {
    if (nextLevelXp <= 0) return 0;
    const raw = Math.round((Math.max(0, xp) / nextLevelXp) * 100);
    return Math.min(100, Math.max(0, raw));
}

export function topUpWallet(
    currentBalance: number,
    amount: number,
    existingOrders: WalletOrder[],
    dateLabel = 'امروز · درگاه آنلاین'
): { balance: number; orders: WalletOrder[] } {
    if (amount <= 0 || !Number.isFinite(amount)) {
        return { balance: currentBalance, orders: existingOrders };
    }
    const nextBalance = currentBalance + amount;
    const invoiceNum = 950 + existingOrders.length;
    const newOrder: WalletOrder = {
        id: `ord-${Date.now()}`,
        title: 'افزایش موجودی کیف پول رشد',
        category: 'شارژ کیف پول',
        date: dateLabel,
        amount,
        invoiceCode: `INV-404-${invoiceNum}`,
        status: 'paid',
    };
    return {
        balance: nextBalance,
        orders: [newOrder, ...existingOrders],
    };
}

export function validateAndUpdateProfile(
    current: UserProfileState,
    draft: Partial<UserProfileState>
): { valid: boolean; error?: string; profile: UserProfileState } {
    const trimmedName = (draft.name ?? current.name).trim();
    if (!trimmedName || trimmedName.length < 2) {
        return {
            valid: false,
            error: 'لطفاً نام و نام خانوادگی معتبر وارد کنید.',
            profile: current,
        };
    }

    const trimmedPhone = (draft.phone ?? current.phone).trim();
    if (!trimmedPhone || trimmedPhone.length < 10) {
        return {
            valid: false,
            error: 'شماره موبایل دانش‌پذیر باید حداقل ۱۰ رقم باشد.',
            profile: current,
        };
    }

    const trimmedParentPhone = (draft.parentPhone ?? current.parentPhone).trim();
    if (!trimmedParentPhone || trimmedParentPhone.length < 10) {
        return {
            valid: false,
            error: 'شماره تماس والدین برای ارسال گزارش هفتگی معتبر نیست.',
            profile: current,
        };
    }

    const updated: UserProfileState = {
        ...current,
        ...draft,
        name: trimmedName,
        phone: trimmedPhone,
        parentPhone: trimmedParentPhone,
        gradeAndField: (draft.gradeAndField ?? current.gradeAndField).trim() || current.gradeAndField,
        city: (draft.city ?? current.city).trim() || current.city,
        bio: (draft.bio ?? current.bio).trim() || current.bio,
    };

    return {
        valid: true,
        profile: updated,
    };
}
