import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    Bell,
    BookOpen,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    ChevronLeft,
    ClipboardCheck,
    Clock,
    Compass,
    Copy,
    CreditCard,
    Crown,
    Edit3,
    ExternalLink,
    FileText,
    Flag,
    Flame,
    Gift,
    GraduationCap,
    Headphones,
    Home,
    Image,
    Leaf,
    Lock,
    MapPin,
    MessageCircle,
    MessageSquare,
    Moon,
    Pause,
    Phone,
    Play,
    Plus,
    Receipt,
    Search,
    Send,
    Settings,
    ShieldCheck,
    ShoppingBag,
    SlidersHorizontal,
    Sparkles,
    Star,
    Sun,
    TrendingUp,
    User,
    UserCheck,
    Users,
    Video,
    Volume2,
    Wallet,
    X,
} from 'lucide-react';
import { mockCourses, mockProducts, mockVipFlagshipDefaults } from '@/lib/mockData';
import {
    calculateLevelProgress,
    defaultEarnedBadges,
    defaultNotificationSettings,
    defaultTalentDimensions,
    defaultUserProfile,
    defaultWalletOrders,
    topUpWallet,
    validateAndUpdateProfile,
} from '@/lib/profileLogic';
import {
    appendChatMessage,
    canSendMessageInChannel,
    ChatChannelType,
    CourseItemInstructor,
    filterCoursesByQueryAndCategory,
    resolveProductConsumptionMode,
} from '@/lib/mobileAppLogic';
import {
    addGoalToState,
    addReminderToState,
    advanceGoalTaskInState,
    createSupportTicketInState,
    DynamicGoalItem,
    DynamicLessonItem,
    DynamicReminderItem,
    DynamicSupportTicket,
    purchaseWithWalletInState,
    replyToSupportTicketInState,
    toggleLessonCompletionInState,
    updateLessonNoteInState,
    updateVipConfigInState,
    useDynamicAppStore,
    type DynamicVipConfig,
    type DynamicVipFeature,
    type DynamicVipSession,
    type DynamicVipStudent,
} from '@/lib/dynamicAppStore';

type ScreenId =
    | 'home'
    | 'courses'
    | 'chat'
    | 'shop'
    | 'productDetail'
    | 'inAppReader'
    | 'inAppAudioPlayer'
    | 'dashboard'
    | 'profile'
    | 'sessions'
    | 'goals'
    | 'reminders'
    | 'support'
    | 'courseDetail'
    | 'learning'
    | 'admin'
    | 'vipClub'
    | 'vipManage';

type PreviewRole = 'vip_student' | 'regular_user' | 'instructor';
type AttendanceStatus = 'present_in_person' | 'present_online' | 'late' | 'absent';

const faNum = (value: number | string) => {
    const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(value).replace(/\d/g, (d) => map[Number(d)] ?? d);
};

const formatPrice = (amount: number) => {
    if (!amount || amount <= 0) return 'رایگان';
    const formatted = Math.round(amount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
    return `${faNum(formatted)} تومان`;
};

export default function MobileAppPreview() {
    const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
    const [previewRole, setPreviewRole] = useState<PreviewRole>('vip_student');
    const [isDark, setIsDark] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('همه');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourseSlug, setSelectedCourseSlug] = useState(mockCourses[0].slug);

    // Unified Dynamic State Store (Synced with Website & Server API)
    const { appState, updateAppState } = useDynamicAppStore();
    const {
        userProfile,
        walletOrders,
        talentDimensions,
        earnedBadges,
        notifSettings,
        courseItems,
        groupChatEnabled,
        groupMessages,
        supportMessages,
        ownedProductSlugs,
        goals,
        reminders,
        reminderLogs,
        supportTickets,
        lessons,
        courses: dynamicCourses,
        vipConfig,
        vipFeatures,
        vipSessions,
        vipStudents,
    } = appState;

    const allCourses = dynamicCourses && dynamicCourses.length > 0 ? dynamicCourses : mockCourses;

    const [newFeatureText, setNewFeatureText] = useState('');
    const [selectedSessionId, setSelectedSessionId] = useState<number>(103);
    const [newSessionTitle, setNewSessionTitle] = useState('');
    const [newSessionMode, setNewSessionMode] = useState<'in_person' | 'online'>('in_person');
    const [newSessionDate, setNewSessionDate] = useState('سه‌شنبه ۱۶ اردیبهشت ۱۴۰۴');
    const [newSessionTime, setNewSessionTime] = useState('۱۷:۰۰ تا ۱۹:۰۰');
    const [vipManageTab, setVipManageTab] = useState<'attendance' | 'settings' | 'sessions'>('attendance');
    const [vipClubTab, setVipClubTab] = useState<'schedule' | 'items' | 'attendance'>('schedule');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const setVipConfig = (
        updater:
            | DynamicVipConfig
            | ((prev: DynamicVipConfig) => DynamicVipConfig)
    ) => {
        updateAppState((prev) => {
            const nextCfg =
                typeof updater === 'function' ? updater(prev.vipConfig) : updater;
            return updateVipConfigInState(prev, nextCfg);
        });
    };

    const setVipFeatures = (
        updater:
            | DynamicVipFeature[]
            | ((prev: DynamicVipFeature[]) => DynamicVipFeature[])
    ) => {
        updateAppState((prev) => ({
            ...prev,
            vipFeatures:
                typeof updater === 'function' ? updater(prev.vipFeatures) : updater,
        }));
    };

    const setVipSessions = (
        updater:
            | DynamicVipSession[]
            | ((prev: DynamicVipSession[]) => DynamicVipSession[])
    ) => {
        updateAppState((prev) => ({
            ...prev,
            vipSessions:
                typeof updater === 'function' ? updater(prev.vipSessions) : updater,
        }));
    };

    const setVipStudents = (
        updater:
            | DynamicVipStudent[]
            | ((prev: DynamicVipStudent[]) => DynamicVipStudent[])
    ) => {
        updateAppState((prev) => ({
            ...prev,
            vipStudents:
                typeof updater === 'function' ? updater(prev.vipStudents) : updater,
        }));
    };

    const setCourseItems = (
        updater:
            | CourseItemInstructor[]
            | ((prev: CourseItemInstructor[]) => CourseItemInstructor[])
    ) => {
        updateAppState((prev) => ({
            ...prev,
            courseItems:
                typeof updater === 'function' ? updater(prev.courseItems) : updater,
        }));
    };

    const setGroupChatEnabled = (
        updater: boolean | ((prev: boolean) => boolean)
    ) => {
        updateAppState((prev) => ({
            ...prev,
            groupChatEnabled:
                typeof updater === 'function'
                    ? updater(prev.groupChatEnabled)
                    : updater,
        }));
    };

    const setGroupMessages = (
        updater:
            | typeof groupMessages
            | ((prev: typeof groupMessages) => typeof groupMessages)
    ) => {
        updateAppState((prev) => ({
            ...prev,
            groupMessages:
                typeof updater === 'function' ? updater(prev.groupMessages) : updater,
        }));
    };

    const setSupportMessages = (
        updater:
            | typeof supportMessages
            | ((prev: typeof supportMessages) => typeof supportMessages)
    ) => {
        updateAppState((prev) => ({
            ...prev,
            supportMessages:
                typeof updater === 'function'
                    ? updater(prev.supportMessages)
                    : updater,
        }));
    };

    const setOwnedProductSlugs = (
        updater: string[] | ((prev: string[]) => string[])
    ) => {
        updateAppState((prev) => ({
            ...prev,
            ownedProductSlugs:
                typeof updater === 'function'
                    ? updater(prev.ownedProductSlugs)
                    : updater,
        }));
    };

    const setReminders = (
        updater:
            | DynamicReminderItem[]
            | ((prev: DynamicReminderItem[]) => DynamicReminderItem[])
    ) => {
        updateAppState((prev) => ({
            ...prev,
            reminders:
                typeof updater === 'function' ? updater(prev.reminders) : updater,
        }));
    };

    const setUserProfile = (
        updater:
            | typeof userProfile
            | ((prev: typeof userProfile) => typeof userProfile)
    ) => {
        updateAppState((prev) => ({
            ...prev,
            userProfile:
                typeof updater === 'function' ? updater(prev.userProfile) : updater,
        }));
    };

    const setWalletOrders = (
        updater:
            | typeof walletOrders
            | ((prev: typeof walletOrders) => typeof walletOrders)
    ) => {
        updateAppState((prev) => ({
            ...prev,
            walletOrders:
                typeof updater === 'function' ? updater(prev.walletOrders) : updater,
        }));
    };

    const setNotifSettings = (
        updater:
            | typeof notifSettings
            | ((prev: typeof notifSettings) => typeof notifSettings)
    ) => {
        updateAppState((prev) => ({
            ...prev,
            notifSettings:
                typeof updater === 'function'
                    ? updater(prev.notifSettings)
                    : updater,
        }));
    };

    // Multi-Instructor Per-Item Chat, Course Group Chat (with Admin Toggle), and Course Support State
    const [chatChannel, setChatChannel] = useState<ChatChannelType>('instructor');
    const [selectedItemId, setSelectedItemId] = useState<number>(1);
    const [chatDraft, setChatDraft] = useState('');

    // Store Product Preview + Non-Downloadable In-App Book Reader & Podcast Audio Player State
    const [selectedProductSlug, setSelectedProductSlug] = useState<string>(mockProducts[0].slug);
    const [selectedChapterId, setSelectedChapterId] = useState<number>(101);
    const [readerFontSize, setReaderFontSize] = useState<'sm' | 'md' | 'lg'>('md');
    const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
    const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
    const [audioSpeed, setAudioSpeed] = useState<1 | 1.25 | 1.5 | 2>(1);
    const [audioProgress, setAudioProgress] = useState<number>(38);

    // Interactive Learning Room State
    const [selectedLessonId, setSelectedLessonId] = useState<number>(3);
    const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
    const [videoProgress, setVideoProgress] = useState<number>(42);

    // Interactive Goal Builder State
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalCategory, setNewGoalCategory] = useState('دوره VIP آینده نوجوان');
    const [newGoalDueDate, setNewGoalDueDate] = useState('۳۰ خرداد ۱۴۰۴');
    const [newGoalTasks, setNewGoalTasks] = useState<number>(5);

    // Interactive Smart Reminder Builder State
    const [newReminderTitle, setNewReminderTitle] = useState('');
    const [newReminderTime, setNewReminderTime] = useState('۱۸:۳۰');
    const [newReminderDays, setNewReminderDays] = useState('هر روز · ۶۰ دقیقه قبل');
    const [newReminderChannel, setNewReminderChannel] = useState<'sms' | 'eitaa' | 'in_app'>('sms');

    // Interactive Support Ticket State
    const [selectedTicketId, setSelectedTicketId] = useState<number>(201);
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [newTicketDept, setNewTicketDept] = useState('آموزش و کارگاه‌های VIP');
    const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [newTicketBody, setNewTicketBody] = useState('');
    const [ticketReplyDraft, setTicketReplyDraft] = useState('');

    // Comprehensive My Account ("حساب من") Local Form State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileDraft, setProfileDraft] = useState({
        name: userProfile.name,
        gradeAndField: userProfile.gradeAndField,
        city: userProfile.city,
        phone: userProfile.phone,
        parentPhone: userProfile.parentPhone,
        bio: userProfile.bio,
    });
    const [profileError, setProfileError] = useState<string | null>(null);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [copiedReferral, setCopiedReferral] = useState(false);
    const [showCertPreviewModal, setShowCertPreviewModal] = useState(false);

    // Online Webinars & Live Classes Hub (Skyroom, Google Meet, Adobe Connect, BigBlueButton)
    const [onlineWebinars, setOnlineWebinars] = useState([
        {
            id: 1,
            title: 'وبینار زنده کشف استعداد و نقشه راه آینده نوجوان',
            instructor: 'دکتر علیرضا بیدی · راهبر اصلی دوره',
            platform: 'skyroom' as 'skyroom' | 'google_meet' | 'adobe_connect' | 'bigbluebutton',
            platformLabel: 'اسکای‌روم (Skyroom)',
            link: 'https://www.skyroom.online/ch/roshd-academy/teen-future-vip',
            roomCode: 'ROSHD-VIP-104',
            accessHint: 'ورود با شماره موبایل ثبت‌نامی یا گزینه ورود مهمان',
            date: 'امروز · پنج‌شنبه ۱۱ اردیبهشت',
            time: '۱۷:۰۰ تا ۱۸:۳۰',
            status: 'live' as 'live' | 'upcoming' | 'recorded',
            participantsCount: 48,
            isVipOnly: true,
        },
        {
            id: 2,
            title: 'کلاس آنلاین کارگاه تصمیم‌گیری و هدف‌گذاری ۹۰ روزه (آیتم ۲)',
            instructor: 'استاد سارا کریمی · مدرس برنامه‌ریزی و هدف‌گذاری',
            platform: 'google_meet' as 'skyroom' | 'google_meet' | 'adobe_connect' | 'bigbluebutton',
            platformLabel: 'گوگل میت (Google Meet)',
            link: 'https://meet.google.com/rsh-daca-vip',
            roomCode: 'rsh-daca-vip',
            accessHint: 'ورود مستقیم از مرورگر موبایل بدون نیاز به نصب برنامه',
            date: 'یکشنبه ۱۴ اردیبهشت',
            time: '۱۸:۰۰ تا ۱۹:۳۰',
            status: 'upcoming' as 'live' | 'upcoming' | 'recorded',
            participantsCount: 34,
            isVipOnly: true,
        },
        {
            id: 3,
            title: 'نشست آنلاین پرسش و پاسخ والدین با تیم کوچینگ رشد',
            instructor: 'دکتر محمدرضا صادقی · منتور خودشناسی و استعدادیابی',
            platform: 'skyroom' as 'skyroom' | 'google_meet' | 'adobe_connect' | 'bigbluebutton',
            platformLabel: 'اسکای‌روم (Skyroom)',
            link: 'https://www.skyroom.online/ch/roshd-academy/parents-club',
            roomCode: 'PARENTS-1404',
            accessHint: 'ورود آزاد برای والدین و دانش‌پذیران آکادمی رشد',
            date: 'چهارشنبه ۱۷ اردیبهشت',
            time: '۲۰:۰۰ تا ۲۱:۱۵',
            status: 'upcoming' as 'live' | 'upcoming' | 'recorded',
            participantsCount: 72,
            isVipOnly: false,
        },
        {
            id: 4,
            title: 'کارگاه آنلاین فن بیان، مذاکره و ارتباط موثر نوجوان',
            instructor: 'دکتر امیرحسین نادری · مدرس فن بیان و ارتباط موثر',
            platform: 'adobe_connect' as 'skyroom' | 'google_meet' | 'adobe_connect' | 'bigbluebutton',
            platformLabel: 'ادوبی کانکت (Adobe Connect)',
            link: 'https://live.roshdacademy.ir/communication-workshop',
            roomCode: 'COMM-302',
            accessHint: 'قابلیت مشاهده در مرورگر یا اپلیکیشن Adobe Connect',
            date: 'برگزار شده · دارای بازپخش',
            time: 'مدت زمان: ۹۰ دقیقه',
            status: 'recorded' as 'live' | 'upcoming' | 'recorded',
            participantsCount: 115,
            isVipOnly: false,
        },
    ]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const requestedScreen = params.get('screen') as ScreenId | null;
        const validScreens: ScreenId[] = [
            'home',
            'courses',
            'chat',
            'shop',
            'productDetail',
            'inAppReader',
            'inAppAudioPlayer',
            'dashboard',
            'profile',
            'sessions',
            'goals',
            'reminders',
            'support',
            'courseDetail',
            'learning',
            'admin',
            'vipClub',
            'vipManage',
        ];
        if (requestedScreen && validScreens.includes(requestedScreen)) {
            setActiveScreen(requestedScreen);
        }
    }, []);
    const [webinarFilter, setWebinarFilter] = useState<'all' | 'live' | 'skyroom' | 'google_meet' | 'other'>('all');
    const [activeWebinarGatewayId, setActiveWebinarGatewayId] = useState<number | null>(null);
    const [copiedWebinarId, setCopiedWebinarId] = useState<number | null>(null);
    const [newWebinarTitle, setNewWebinarTitle] = useState('');
    const [newWebinarInstructor, setNewWebinarInstructor] = useState('');
    const [newWebinarPlatform, setNewWebinarPlatform] = useState<'skyroom' | 'google_meet' | 'adobe_connect' | 'bigbluebutton'>('skyroom');
    const [newWebinarLink, setNewWebinarLink] = useState('');
    const [newWebinarDateTime, setNewWebinarDateTime] = useState('پنج‌شنبه ۱۸ اردیبهشت · ساعت ۱۸:۰۰');

    // Enrolled status is true for VIP Student and Instructor/Admin preview roles
    const isVipEnrolled = previewRole !== 'regular_user';

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage((prev) => (prev === msg ? null : prev));
        }, 3200);
    };

    const handleCopyWebinarLink = (webinarId: number, link: string, title: string) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(link).catch(() => {});
        }
        setCopiedWebinarId(webinarId);
        showToast(`لینک ورود به «${title}» کپی شد.`);
        setTimeout(() => {
            setCopiedWebinarId((prev) => (prev === webinarId ? null : prev));
        }, 2500);
    };

    const handleAddWebinar = () => {
        const cleanTitle = newWebinarTitle.trim();
        const cleanLink = newWebinarLink.trim();
        if (!cleanTitle) {
            showToast('لطفاً عنوان وبینار یا کلاس آنلاین را وارد کنید.');
            return;
        }
        const platformLabels: Record<'skyroom' | 'google_meet' | 'adobe_connect' | 'bigbluebutton', string> = {
            skyroom: 'اسکای‌روم (Skyroom)',
            google_meet: 'گوگل میت (Google Meet)',
            adobe_connect: 'ادوبی کانکت (Adobe Connect)',
            bigbluebutton: 'بیگ‌بلوباتن (BigBlueButton)',
        };
        const defaultLinks: Record<'skyroom' | 'google_meet' | 'adobe_connect' | 'bigbluebutton', string> = {
            skyroom: 'https://www.skyroom.online/ch/roshd-academy/live-class',
            google_meet: 'https://meet.google.com/rsh-live-class',
            adobe_connect: 'https://live.roshdacademy.ir/online-session',
            bigbluebutton: 'https://bbb.roshdacademy.ir/b/roshd-room',
        };
        const created = {
            id: Date.now(),
            title: cleanTitle,
            instructor: newWebinarInstructor.trim() || 'مدرس دوره آکادمی رشد',
            platform: newWebinarPlatform,
            platformLabel: platformLabels[newWebinarPlatform],
            link: cleanLink || defaultLinks[newWebinarPlatform],
            roomCode: `ROSHD-${onlineWebinars.length + 105}`,
            accessHint: 'ورود مستقیم با کلیک روی دکمه ورود به اتاق کلاس',
            date: newWebinarDateTime.split('·')[0]?.trim() || 'هفته آینده',
            time: newWebinarDateTime.split('·')[1]?.trim() || '۱۸:۰۰ تا ۱۹:۳۰',
            status: 'upcoming' as const,
            participantsCount: 24,
            isVipOnly: false,
        };
        setOnlineWebinars((prev) => [created, ...prev]);
        setNewWebinarTitle('');
        setNewWebinarInstructor('');
        setNewWebinarLink('');
        showToast(`کلاس آنلاین «${cleanTitle}» در ${platformLabels[newWebinarPlatform]} ثبت شد.`);
    };


    const openCourse = (slug: string) => {
        setSelectedCourseSlug(slug);
        setActiveScreen('courseDetail');
    };

    const openProductDetail = (slug: string) => {
        const prod = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
        setSelectedProductSlug(prod.slug);
        if (prod.chaptersOrEpisodes && prod.chaptersOrEpisodes.length > 0) {
            setSelectedChapterId(prod.chaptersOrEpisodes[0].id);
        }
        setActiveScreen('productDetail');
    };

    const openInAppContent = (slug: string, chapterId?: number) => {
        const prod = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
        setSelectedProductSlug(prod.slug);
        const firstId =
            chapterId ||
            (prod.chaptersOrEpisodes && prod.chaptersOrEpisodes[0]?.id) ||
            101;
        setSelectedChapterId(firstId);
        if (prod.deliveryType === 'in_app_podcast') {
            setAudioPlaying(true);
            setActiveScreen('inAppAudioPlayer');
        } else {
            setActiveScreen('inAppReader');
        }
    };

    const openItemInstructorChat = (itemId: number) => {
        setSelectedItemId(itemId);
        setChatChannel('instructor');
        setActiveScreen('chat');
    };

    const openCourseGroupChat = () => {
        setChatChannel('group');
        setActiveScreen('chat');
    };

    const openCourseSupportChat = () => {
        setChatChannel('support');
        setActiveScreen('chat');
    };

    const handleSendChatMessage = () => {
        const text = chatDraft.trim();
        if (!text) return;

        const permission = canSendMessageInChannel(
            chatChannel,
            groupChatEnabled,
            previewRole
        );
        if (!permission.allowed) {
            showToast(permission.reason || 'ارسال پیام در این بخش غیرفعال است.');
            return;
        }

        const senderType = previewRole === 'instructor' ? 'instructor' : 'student';
        const senderName =
            previewRole === 'instructor' ? 'مدرس / ادمین دوره' : userProfile.name;

        if (chatChannel === 'instructor') {
            setCourseItems((prev) =>
                prev.map((item) =>
                    item.itemId === selectedItemId
                        ? {
                              ...item,
                              initialMessages: appendChatMessage(
                                  item.initialMessages,
                                  text,
                                  senderType,
                                  senderName
                              ),
                          }
                        : item
                )
            );
            setChatDraft('');
            const currentItem =
                courseItems.find((i) => i.itemId === selectedItemId) || courseItems[0];
            showToast(`پیام خصوصی برای «${currentItem.instructorName}» ارسال شد.`);
        } else if (chatChannel === 'group') {
            setGroupMessages((prev) =>
                appendChatMessage(
                    prev,
                    text,
                    senderType === 'instructor' ? 'instructor' : 'student',
                    senderName,
                    senderType === 'instructor' ? 'مدرس / ادمین' : 'دانش‌پذیر دوره VIP'
                )
            );
            setChatDraft('');
        } else {
            setSupportMessages((prev) =>
                appendChatMessage(prev, text, 'student', senderName)
            );
            setChatDraft('');
            showToast('پیام شما برای پشتیبانی کلی دوره ثبت شد.');
        }
    };

    const colors = isDark
        ? {
              bg: '#0E1713',
              surface: '#16231D',
              surfaceAlt: '#1F3028',
              primary: '#52B788',
              primaryDark: '#123E30',
              primarySoft: '#1D352B',
              gold: '#F59E0B',
              goldSoft: '#3B2F13',
              text: '#F3F6F4',
              muted: '#95A89E',
              border: '#26382F',
          }
        : {
              bg: '#FAFBF7',
              surface: '#FFFFFF',
              surfaceAlt: '#F1F4EC',
              primary: '#153F31',
              primaryDark: '#0F2E24',
              primarySoft: '#E6F1EC',
              gold: '#D97706',
              goldSoft: '#FEF3C7',
              text: '#13241D',
              muted: '#63736A',
              border: '#E4EAE2',
          };

    const selectedCourse =
        allCourses.find((c) => c.slug === selectedCourseSlug) || allCourses[0];

    const selectedProduct =
        mockProducts.find((p) => p.slug === selectedProductSlug) || mockProducts[0];

    const activeChapterOrEpisode =
        selectedProduct.chaptersOrEpisodes?.find((ch) => ch.id === selectedChapterId) ||
        selectedProduct.chaptersOrEpisodes?.[0];

    const selectedCourseItem =
        courseItems.find((item) => item.itemId === selectedItemId) || courseItems[0];

    const filteredCourses = filterCoursesByQueryAndCategory(
        allCourses.filter((c) => (c as { is_published?: boolean }).is_published !== false),
        searchQuery,
        selectedCategory
    );

    const toggleReminder = (id: number) => {
        setReminders((prev) =>
            prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
        );
    };

    const updateStudentAttendance = (studentId: number, status: AttendanceStatus) => {
        const nowStr = '۱۷:۰۵';
        setVipStudents((prev) =>
            prev.map((st) =>
                st.id === studentId
                    ? {
                          ...st,
                          status,
                          checkInTime: status === 'absent' ? '—' : nowStr,
                      }
                    : st
            )
        );
        const stName = vipStudents.find((s) => s.id === studentId)?.name || 'دانش‌پذیر';
        const statusLabel =
            status === 'present_in_person'
                ? 'حاضر (حضوری)'
                : status === 'present_online'
                ? 'حاضر (آنلاین)'
                : status === 'late'
                ? 'با تاخیر'
                : 'غایب';
        showToast(`وضعیت «${stName}» به «${statusLabel}» تغییر یافت.`);
    };

    const toggleStudentVipStamp = (studentId: number) => {
        setVipStudents((prev) =>
            prev.map((st) => (st.id === studentId ? { ...st, isVip: !st.isVip } : st))
        );
    };

    const addVipFeature = () => {
        if (!newFeatureText.trim()) return;
        setVipFeatures((prev) => [
            ...prev,
            { id: Date.now(), title: newFeatureText.trim(), active: true },
        ]);
        setNewFeatureText('');
        showToast('قابلیت جدید به دوره طراحی آینده نوجوان اضافه شد.');
    };

    const toggleVipFeature = (id: number) => {
        setVipFeatures((prev) =>
            prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
        );
    };

    const addVipSession = () => {
        if (!newSessionTitle.trim()) return;
        const nextNum = vipSessions.length + 1;
        const created = {
            id: Date.now(),
            number: nextNum,
            title: newSessionTitle.trim(),
            mode: newSessionMode,
            date: newSessionDate,
            time: newSessionTime,
            locationOrLink:
                newSessionMode === 'in_person'
                    ? vipConfig.inPersonLocation
                    : vipConfig.onlinePlatform,
            status: 'upcoming' as const,
            reminderSent: false,
        };
        setVipSessions((prev) => [...prev, created]);
        setNewSessionTitle('');
        showToast(`جلسه ${faNum(nextNum)} (${newSessionMode === 'in_person' ? 'حضوری' : 'مجازی'}) ثبت شد.`);
    };

    const sendSessionReminderToAll = (sessionId: number) => {
        setVipSessions((prev) =>
            prev.map((s) => (s.id === sessionId ? { ...s, reminderSent: true } : s))
        );
        showToast('پیامک و نوتیفیکیشن یادآوری کلاس برای ۲۴ عضو VIP ارسال شد.');
    };

    const handleSaveProfile = () => {
        const res = validateAndUpdateProfile(userProfile, profileDraft);
        if (!res.valid) {
            setProfileError(res.error || 'خطا در اعتبارسنجی اطلاعات');
            return;
        }
        setUserProfile(res.profile);
        setProfileError(null);
        setIsEditingProfile(false);
        showToast('مشخصات حساب کاربری و پرونده شما با موفقیت ذخیره شد.');
    };

    const handleWalletTopUp = (amount: number) => {
        const res = topUpWallet(userProfile.walletBalance, amount, walletOrders);
        setUserProfile((prev) => ({ ...prev, walletBalance: res.balance }));
        setWalletOrders(res.orders);
        showToast(`کیف پول شما به مبلغ ${formatPrice(amount)} با موفقیت شارژ شد.`);
    };

    const handleSendParentReport = () => {
        const nowLabel = 'هم‌اکنون · ارسال پیامکی به والدین';
        setUserProfile((prev) => ({
            ...prev,
            lastParentReportSentAt: nowLabel,
        }));
        showToast(`کارنامه هفتگی و گزارش حضور به شماره والدین (${faNum(userProfile.parentPhone)}) ارسال شد.`);
    };

    const handleCopyReferral = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(userProfile.referralCode).catch(() => {});
        }
        setCopiedReferral(true);
        showToast(`کد معرف «${userProfile.referralCode}» کپی شد.`);
        setTimeout(() => setCopiedReferral(false), 2500);
    };

    const levelProgressPercent = calculateLevelProgress(
        userProfile.xp,
        userProfile.nextLevelXp
    );

    const activeSession =
        vipSessions.find((s) => s.id === selectedSessionId) || vipSessions[0];
    const nextUpcomingVipSession =
        vipSessions.find((s) => s.status === 'upcoming') || vipSessions[0];

    const activeTab: ScreenId =
        activeScreen === 'courseDetail' || activeScreen === 'learning'
            ? 'courses'
            : activeScreen === 'productDetail' ||
              activeScreen === 'inAppReader' ||
              activeScreen === 'inAppAudioPlayer'
            ? 'shop'
            : activeScreen === 'support'
            ? 'chat'
            : activeScreen === 'sessions' ||
              activeScreen === 'goals' ||
              activeScreen === 'reminders' ||
              activeScreen === 'vipClub'
            ? 'dashboard'
            : activeScreen === 'admin' || activeScreen === 'vipManage'
            ? 'profile'
            : activeScreen;

    return (
        <>
            <Head title="Roshd 1.3.0 — اپلیکیشن آموزش، استعدادیابی و کوچینگ رشد" />

            <div
                dir="rtl"
                className="min-h-screen w-full flex flex-col font-sans"
                style={{ backgroundColor: colors.bg }}
            >
                {/* Main Responsive App Container */}
                <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between relative">
                    {/* Live Toast Banner */}
                    {toastMessage && (
                        <div className="fixed top-4 inset-x-4 max-w-lg mx-auto z-50 bg-[#123E30] text-white border border-[#D6F39A]/40 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-[#D6F39A] shrink-0" />
                            <span className="font-bold">{toastMessage}</span>
                        </div>
                    )}

                    {/* Main Screen Content */}
                    <div className="flex-1 px-4 sm:px-6 pt-5 pb-24 space-y-5">
                        {/* ==================== SUPER-APP HOME SCREEN ==================== */}
                        {activeScreen === 'home' && (
                            <div className="space-y-3.5">
                                {/* 1. Compact Profile & Brand Header */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="relative shrink-0">
                                            <img
                                                src="/images/roshd-logo.png"
                                                alt="Roshd"
                                                className="w-10 h-10 rounded-[14px] object-cover shadow-sm"
                                            />
                                            {isVipEnrolled && (
                                                <span className=" -bottom-1 -left-1 w-4 h-4 rounded-full bg-amber-400 text-[#0D2E22] flex items-center justify-center shadow ring-2 ring-white dark:ring-[#0E1713] absolute">
                                                    <Crown className="w-2.5 h-2.5" />
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="font-black text-[15px] truncate"
                                                    style={{ color: colors.text }}
                                                >
                                                    سلام نوید عزیز
                                                </span>
                                                {isVipEnrolled ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold shrink-0">
                                                        <Crown className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                                                        <span>VIP</span>
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                                        style={{
                                                            backgroundColor: colors.primarySoft,
                                                            color: colors.primary,
                                                        }}
                                                    >
                                                        سطح نقره‌ای
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className="text-[11px] truncate"
                                                style={{ color: colors.muted }}
                                            >
                                                {isVipEnrolled
                                                    ? 'عضو باشگاه طراحی آینده نوجوان • ۱۴۵۰ امتیاز'
                                                    : 'آکادمی رشد • هر روز یک قدم جلوتر'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setIsDark(!isDark)}
                                            className="w-9 h-9 rounded-[12px] flex items-center justify-center border transition hover:opacity-80"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                            title="تغییر تم روشن/تاریک"
                                        >
                                            {isDark ? (
                                                <Sun className="w-4 h-4" style={{ color: colors.text }} />
                                            ) : (
                                                <Moon className="w-4 h-4" style={{ color: colors.text }} />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('reminders')}
                                            className="w-9 h-9 rounded-[12px] flex items-center justify-center border transition hover:opacity-80 relative"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                            title="یادآوری‌های من"
                                        >
                                            <Bell className="w-4 h-4" style={{ color: colors.text }} />
                                            <span className="w-2 h-2 rounded-full bg-[#D6F39A] absolute top-2 right-2"></span>
                                        </button>
                                    </div>
                                </div>

                                {/* Compact Search Bar */}
                                <button
                                    type="button"
                                    onClick={() => setActiveScreen('courses')}
                                    className="w-full h-[44px] px-3.5 rounded-[15px] border flex items-center justify-between transition hover:opacity-90"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Search className="w-4 h-4" style={{ color: colors.primary }} />
                                        <span className="text-[12px]" style={{ color: colors.muted }}>
                                            جستجوی دوره، مدرس آیتم، کتاب یا پادکست...
                                        </span>
                                    </div>
                                    <div
                                        className="w-7 h-7 rounded-[9px] flex items-center justify-center"
                                        style={{ backgroundColor: colors.surfaceAlt }}
                                    >
                                        <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: colors.muted }} />
                                    </div>
                                </button>

                                {/* Slim Live Status Bar (Without QR Code — Direct Access to Class & Group Chat) */}
                                {isVipEnrolled ? (
                                    <div className="bg-gradient-to-l from-[#123E30] via-[#164A39] to-[#0E3126] text-white rounded-[18px] p-3 border border-amber-400/35 shadow-sm flex items-center justify-between gap-2">
                                        <div
                                            onClick={() => {
                                                setVipClubTab('schedule');
                                                setActiveScreen('vipClub');
                                            }}
                                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                                        >
                                            <div className="w-9 h-9 rounded-[12px] bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                                                {nextUpcomingVipSession.mode === 'in_person' ? (
                                                    <Building2 className="w-4 h-4 text-amber-300" />
                                                ) : (
                                                    <Video className="w-4 h-4 text-amber-300" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6F39A]"></span>
                                                    <span className="text-[10px] font-bold text-[#D6F39A] truncate">
                                                        کلاس بعدی طراحی آینده نوجوان (
                                                        {nextUpcomingVipSession.mode === 'in_person'
                                                            ? 'حضوری'
                                                            : 'آنلاین'}
                                                        )
                                                    </span>
                                                </div>
                                                <div className="font-bold text-[12px] text-white truncate mt-0.5">
                                                    {nextUpcomingVipSession.title}
                                                </div>
                                                <div className="text-[10px] text-[#C5D7CA] truncate">
                                                    {nextUpcomingVipSession.date} • ساعت{' '}
                                                    {nextUpcomingVipSession.time}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                type="button"
                                                onClick={openCourseGroupChat}
                                                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-[12px] bg-amber-400 text-[#0D2E22] font-black text-[11px] shadow-sm hover:opacity-95 active:scale-95 transition"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>گروه دوره</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVipClubTab('schedule');
                                                    setActiveScreen('vipClub');
                                                }}
                                                className="w-8 h-8 rounded-[12px] bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                                                title="برنامه کلاس‌ها"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => openCourse('designing-teen-future-vip')}
                                        className="cursor-pointer bg-gradient-to-l from-[#123E30] to-[#1A5240] text-white rounded-[18px] p-3 border border-amber-400/35 flex items-center justify-between gap-2.5 transition hover:opacity-95"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-9 h-9 rounded-[12px] bg-amber-400 text-[#0D2E22] flex items-center justify-center shrink-0">
                                                <Crown className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-bold text-amber-300">
                                                    دوره پرچمدار حضوری + مجازی
                                                </div>
                                                <div className="font-bold text-[12px] truncate">
                                                    {vipConfig.title} (با مهر VIP)
                                                </div>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1.5 rounded-[11px] bg-[#D6F39A] text-[#123E30] font-black text-[11px] shrink-0 inline-flex items-center gap-1">
                                            <span>معرفی دوره</span>
                                            <ArrowLeft className="w-3 h-3" />
                                        </span>
                                    </div>
                                )}

                                {/* 2. Super-App Quick Access Service Desk (2x2 Glassmorphic Bento Cards + 4 Quick Shortcuts) */}
                                <div
                                    className="rounded-[26px] p-3.5 border backdrop-blur-xl relative overflow-hidden"
                                    style={{
                                        background: isDark
                                            ? 'linear-gradient(145deg, rgba(20, 48, 39, 0.86) 0%, rgba(11, 27, 22, 0.94) 55%, rgba(14, 35, 32, 0.90) 100%)'
                                            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.94) 0%, rgba(242, 250, 245, 0.96) 100%)',
                                        borderColor: isDark
                                            ? 'rgba(163, 230, 53, 0.28)'
                                            : 'rgba(18, 62, 48, 0.12)',
                                        boxShadow: isDark
                                            ? '0 18px 36px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.16)'
                                            : '0 14px 28px -12px rgba(18, 62, 48, 0.10), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)',
                                    }}
                                >
                                    {/* Ambient Glassmorphism Glow Orbs */}
                                    <div
                                        className="w-44 h-44 rounded-full pointer-events-none -top-16 -right-12 blur-2xl absolute"
                                        style={{
                                            background: isDark
                                                ? 'radial-gradient(circle, rgba(163, 230, 53, 0.22) 0%, rgba(52, 211, 153, 0.08) 50%, transparent 72%)'
                                                : 'radial-gradient(circle, rgba(154, 217, 105, 0.28) 0%, transparent 70%)',
                                        }}
                                    />
                                    <div
                                        className="w-40 h-40 rounded-full pointer-events-none -bottom-16 -left-12 blur-2xl absolute"
                                        style={{
                                            background: isDark
                                                ? 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(192, 132, 252, 0.08) 50%, transparent 72%)'
                                                : 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 70%)',
                                        }}
                                    />

                                    {/* Box Header */}
                                    <div className="flex items-center justify-between px-0.5 pb-3 relative z-10">
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className="w-8 h-8 rounded-xl flex items-center justify-center border backdrop-blur-md shrink-0"
                                                style={{
                                                    background: isDark
                                                        ? 'linear-gradient(135deg, rgba(163, 230, 53, 0.26) 0%, rgba(16, 185, 129, 0.16) 100%)'
                                                        : 'linear-gradient(135deg, #E6F4EA 0%, #D1FAE5 100%)',
                                                    borderColor: isDark
                                                        ? 'rgba(190, 242, 100, 0.42)'
                                                        : '#B7E4C7',
                                                    color: isDark ? '#D9F99D' : '#123E30',
                                                    boxShadow: isDark
                                                        ? '0 4px 12px rgba(154, 217, 105, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.22)'
                                                        : 'none',
                                                }}
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </span>
                                            <div>
                                                <div
                                                    className="font-black text-[13.5px] leading-tight tracking-tight"
                                                    style={{
                                                        color: isDark ? '#FFFFFF' : '#0F291E',
                                                    }}
                                                >
                                                    میز خدمات سریع رشد
                                                </div>
                                                <div
                                                    className="text-[10.5px] font-semibold mt-0.5"
                                                    style={{
                                                        color: isDark ? '#D1E8DF' : '#476759',
                                                    }}
                                                >
                                                    همگام با خدمات استعدادیابی و کوچینگ مرکز دکتر بیدی
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl border backdrop-blur-md inline-flex items-center gap-1.5"
                                            style={{
                                                background: isDark
                                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)'
                                                    : 'rgba(237, 247, 240, 0.9)',
                                                borderColor: isDark
                                                    ? 'rgba(190, 242, 100, 0.34)'
                                                    : '#CBE8D4',
                                                color: isDark ? '#ECFCCB' : '#123E30',
                                                boxShadow: isDark
                                                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.16)'
                                                    : 'none',
                                            }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span>۴ سرویس آنلاین</span>
                                        </span>
                                    </div>

                                    {/* 2x2 Bento Primary Service Cards (Glassmorphism + Soft Gradients) */}
                                    <div className="grid grid-cols-2 gap-2.5 relative z-10">
                                        {[
                                            {
                                                title: 'باشگاه VIP آینده',
                                                subtitle: isVipEnrolled
                                                    ? '۴ آیتم حضوری و مجازی'
                                                    : 'ثبت‌نام دوره پرچمدار',
                                                badge: 'ویژه',
                                                Icon: Crown,
                                                cardBgDark:
                                                    'linear-gradient(135deg, rgba(251, 191, 36, 0.24) 0%, rgba(245, 158, 11, 0.10) 48%, rgba(255, 255, 255, 0.05) 100%)',
                                                cardBgLight:
                                                    'linear-gradient(135deg, rgba(255, 251, 235, 0.95) 0%, rgba(254, 243, 199, 0.85) 100%)',
                                                borderDark: 'rgba(253, 224, 71, 0.42)',
                                                borderLight: '#FCD34D',
                                                glowDark: 'rgba(251, 191, 36, 0.25)',
                                                iconBoxDark:
                                                    'linear-gradient(135deg, rgba(251, 191, 36, 0.32) 0%, rgba(245, 158, 11, 0.18) 100%)',
                                                iconBoxLight: '#FEF08A',
                                                iconBorderDark: 'rgba(254, 240, 138, 0.45)',
                                                iconColorDark: '#FEF08A',
                                                iconColorLight: '#B45309',
                                                badgeBgDark: 'rgba(251, 191, 36, 0.28)',
                                                badgeBgLight: '#D97706',
                                                badgeBorderDark: 'rgba(254, 240, 138, 0.4)',
                                                badgeTextDark: '#FEF9C3',
                                                badgeTextLight: '#FFFFFF',
                                                onClick: () =>
                                                    isVipEnrolled
                                                        ? setActiveScreen('vipClub')
                                                        : openCourse('designing-teen-future-vip'),
                                            },
                                            {
                                                title: 'چت با مدرسین',
                                                subtitle: '۴ استاد آیتم‌ها آنلاین',
                                                badge: 'آنلاین',
                                                Icon: MessageSquare,
                                                cardBgDark:
                                                    'linear-gradient(135deg, rgba(56, 189, 248, 0.24) 0%, rgba(14, 165, 233, 0.10) 48%, rgba(255, 255, 255, 0.05) 100%)',
                                                cardBgLight:
                                                    'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(224, 242, 254, 0.85) 100%)',
                                                borderDark: 'rgba(125, 211, 252, 0.42)',
                                                borderLight: '#7DD3FC',
                                                glowDark: 'rgba(56, 189, 248, 0.25)',
                                                iconBoxDark:
                                                    'linear-gradient(135deg, rgba(56, 189, 248, 0.32) 0%, rgba(2, 132, 199, 0.18) 100%)',
                                                iconBoxLight: '#BAE6FD',
                                                iconBorderDark: 'rgba(186, 230, 253, 0.45)',
                                                iconColorDark: '#E0F2FE',
                                                iconColorLight: '#0369A1',
                                                badgeBgDark: 'rgba(56, 189, 248, 0.28)',
                                                badgeBgLight: '#0284C7',
                                                badgeBorderDark: 'rgba(186, 230, 253, 0.4)',
                                                badgeTextDark: '#E0F2FE',
                                                badgeTextLight: '#FFFFFF',
                                                onClick: () => {
                                                    setChatChannel('instructor');
                                                    setActiveScreen('chat');
                                                },
                                            },
                                            {
                                                title: 'کتاب‌خوان اپ',
                                                subtitle: 'قطب‌نمای استعداد و ژورنال',
                                                badge: '۲ کتاب',
                                                Icon: BookOpen,
                                                cardBgDark:
                                                    'linear-gradient(135deg, rgba(251, 146, 60, 0.24) 0%, rgba(234, 88, 12, 0.10) 48%, rgba(255, 255, 255, 0.05) 100%)',
                                                cardBgLight:
                                                    'linear-gradient(135deg, rgba(255, 247, 237, 0.95) 0%, rgba(255, 237, 213, 0.85) 100%)',
                                                borderDark: 'rgba(253, 186, 116, 0.42)',
                                                borderLight: '#FDBA74',
                                                glowDark: 'rgba(251, 146, 60, 0.25)',
                                                iconBoxDark:
                                                    'linear-gradient(135deg, rgba(251, 146, 60, 0.32) 0%, rgba(234, 88, 12, 0.18) 100%)',
                                                iconBoxLight: '#FED7AA',
                                                iconBorderDark: 'rgba(254, 215, 170, 0.45)',
                                                iconColorDark: '#FFEDD5',
                                                iconColorLight: '#C2410C',
                                                badgeBgDark: 'rgba(251, 146, 60, 0.28)',
                                                badgeBgLight: '#EA580C',
                                                badgeBorderDark: 'rgba(254, 215, 170, 0.4)',
                                                badgeTextDark: '#FFEDD5',
                                                badgeTextLight: '#FFFFFF',
                                                onClick: () =>
                                                    openInAppContent('talent-compass-book', 101),
                                            },
                                            {
                                                title: 'پشتیبانی و کوچینگ',
                                                subtitle: 'هدایت تحصیلی و منتور ۱:۱',
                                                badge: 'فعال',
                                                Icon: MessageCircle,
                                                cardBgDark:
                                                    'linear-gradient(135deg, rgba(192, 132, 252, 0.24) 0%, rgba(147, 51, 234, 0.10) 48%, rgba(255, 255, 255, 0.05) 100%)',
                                                cardBgLight:
                                                    'linear-gradient(135deg, rgba(250, 245, 255, 0.95) 0%, rgba(243, 232, 255, 0.85) 100%)',
                                                borderDark: 'rgba(216, 180, 254, 0.42)',
                                                borderLight: '#D8B4FE',
                                                glowDark: 'rgba(192, 132, 252, 0.25)',
                                                iconBoxDark:
                                                    'linear-gradient(135deg, rgba(192, 132, 252, 0.32) 0%, rgba(126, 34, 206, 0.18) 100%)',
                                                iconBoxLight: '#E9D5FF',
                                                iconBorderDark: 'rgba(233, 213, 255, 0.45)',
                                                iconColorDark: '#F3E8FF',
                                                iconColorLight: '#6D28D9',
                                                badgeBgDark: 'rgba(192, 132, 252, 0.28)',
                                                badgeBgLight: '#7C3AED',
                                                badgeBorderDark: 'rgba(233, 213, 255, 0.4)',
                                                badgeTextDark: '#F3E8FF',
                                                badgeTextLight: '#FFFFFF',
                                                onClick: openCourseSupportChat,
                                            },
                                        ].map((srv) => {
                                            const IconComp = srv.Icon;
                                            return (
                                                <button
                                                    key={srv.title}
                                                    type="button"
                                                    onClick={srv.onClick}
                                                    className="group p-3 rounded-[20px] border backdrop-blur-md text-right flex flex-col justify-between gap-2.5 transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] cursor-pointer relative overflow-hidden"
                                                    style={{
                                                        background: isDark
                                                            ? srv.cardBgDark
                                                            : srv.cardBgLight,
                                                        borderColor: isDark
                                                            ? srv.borderDark
                                                            : srv.borderLight,
                                                        boxShadow: isDark
                                                            ? '0 8px 20px -6px rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.20)'
                                                            : '0 6px 16px -8px rgba(18, 62, 48, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.85)',
                                                    }}
                                                >
                                                    {/* Soft top-right corner radial highlight for glass depth */}
                                                    {isDark && (
                                                        <span
                                                            className="w-20 h-20 rounded-full pointer-events-none -top-8 -right-8 blur-xl absolute transition-opacity duration-300 group-hover:opacity-100 opacity-75"
                                                            style={{
                                                                background: srv.glowDark,
                                                            }}
                                                        />
                                                    )}

                                                    <div className="flex items-center justify-between w-full relative z-10">
                                                        <div
                                                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                                                            style={{
                                                                background: isDark
                                                                    ? srv.iconBoxDark
                                                                    : srv.iconBoxLight,
                                                                borderColor: isDark
                                                                    ? srv.iconBorderDark
                                                                    : 'rgba(255, 255, 255, 0.7)',
                                                                boxShadow: isDark
                                                                    ? `0 4px 12px -2px ${srv.glowDark}, inset 0 1px 0 rgba(255, 255, 255, 0.25)`
                                                                    : 'none',
                                                            }}
                                                        >
                                                            <IconComp
                                                                className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-105"
                                                                style={{
                                                                    color: isDark
                                                                        ? srv.iconColorDark
                                                                        : srv.iconColorLight,
                                                                }}
                                                            />
                                                        </div>
                                                        <span
                                                            className="px-2 py-0.5 rounded-lg text-[9.5px] font-black border transition-transform duration-200 group-hover:scale-105"
                                                            style={{
                                                                backgroundColor: isDark
                                                                    ? srv.badgeBgDark
                                                                    : srv.badgeBgLight,
                                                                borderColor: isDark
                                                                    ? srv.badgeBorderDark
                                                                    : 'transparent',
                                                                color: isDark
                                                                    ? srv.badgeTextDark
                                                                    : srv.badgeTextLight,
                                                            }}
                                                        >
                                                            {srv.badge}
                                                        </span>
                                                    </div>

                                                    <div className="w-full relative z-10">
                                                        <div
                                                            className="font-black text-[12.5px] leading-tight truncate transition-colors duration-200"
                                                            style={{
                                                                color: isDark
                                                                    ? '#FFFFFF'
                                                                    : '#0F291E',
                                                            }}
                                                        >
                                                            {srv.title}
                                                        </div>
                                                        <div
                                                            className="text-[10.5px] font-semibold mt-0.5 truncate"
                                                            style={{
                                                                color: isDark
                                                                    ? '#E2F3EC'
                                                                    : '#3B5E50',
                                                            }}
                                                        >
                                                            {srv.subtitle}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Live Webinar, Seminar & Online Classes Gateway Strip (Skyroom, Google Meet, Adobe Connect) */}
                                    <div
                                        onClick={() => setActiveScreen('sessions')}
                                        className="group mt-2.5 p-3 rounded-[20px] border backdrop-blur-md flex items-center justify-between gap-2.5 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99] relative z-10 overflow-hidden"
                                        style={{
                                            background: isDark
                                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.26) 0%, rgba(6, 182, 212, 0.22) 55%, rgba(255, 255, 255, 0.06) 100%)'
                                                : 'linear-gradient(135deg, #ECFDF5 0%, #E0F2FE 100%)',
                                            borderColor: isDark
                                                ? 'rgba(110, 231, 183, 0.45)'
                                                : '#6EE7B7',
                                            boxShadow: isDark
                                                ? '0 8px 20px -6px rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.20)'
                                                : '0 6px 16px -8px rgba(16, 185, 129, 0.12)',
                                        }}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative border transition-transform duration-300 group-hover:scale-110"
                                                style={{
                                                    background: isDark
                                                        ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.34) 0%, rgba(6, 182, 212, 0.22) 100%)'
                                                        : '#D1FAE5',
                                                    borderColor: isDark
                                                        ? 'rgba(167, 243, 208, 0.5)'
                                                        : '#A7F3D0',
                                                }}
                                            >
                                                <Video
                                                    className="w-[18px] h-[18px]"
                                                    style={{
                                                        color: isDark ? '#ECFDF5' : '#047857',
                                                    }}
                                                />
                                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0F261E] -top-0.5 -right-0.5 absolute animate-pulse" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className="font-black text-[12px] truncate"
                                                        style={{
                                                            color: isDark ? '#FFFFFF' : '#0F291E',
                                                        }}
                                                    >
                                                        وبینارها، سمینارها و کلاس‌های آنلاین
                                                    </span>
                                                    <span
                                                        className="px-1.5 py-0.5 rounded-md text-[9.5px] font-black shrink-0 border transition-transform duration-200 group-hover:scale-105"
                                                        style={{
                                                            backgroundColor: isDark
                                                                ? 'rgba(244, 63, 94, 0.30)'
                                                                : '#FFE4E6',
                                                            borderColor: isDark
                                                                ? 'rgba(253, 164, 175, 0.45)'
                                                                : 'transparent',
                                                            color: isDark ? '#FFE4E6' : '#BE123C',
                                                        }}
                                                    >
                                                        ۱ وبینار زنده
                                                    </span>
                                                </div>
                                                <div
                                                    className="text-[10.5px] font-semibold truncate mt-0.5"
                                                    style={{
                                                        color: isDark ? '#E2F3EC' : '#3B5E50',
                                                    }}
                                                >
                                                    اسکای‌روم، گوگل میت و ادوبی کانکت (همگام با سایت)
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className="px-2.5 py-1.5 rounded-xl text-[10px] font-black shrink-0 inline-flex items-center gap-1 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                                            style={{
                                                background: isDark
                                                    ? 'linear-gradient(135deg, #6EE7B7 0%, #34D399 100%)'
                                                    : '#123E30',
                                                color: isDark ? '#062016' : '#D6F39A',
                                            }}
                                        >
                                            <span>لینک کلاس‌ها</span>
                                            <ExternalLink className="w-3 h-3 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                        </span>
                                    </div>

                                    {/* Complementary 4 Quick Shortcuts Strip */}
                                    <div
                                        className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t relative z-10"
                                        style={{
                                            borderColor: isDark
                                                ? 'rgba(255, 255, 255, 0.12)'
                                                : '#DCECE2',
                                        }}
                                    >
                                        {[
                                            {
                                                title: 'دوره‌ها',
                                                Icon: GraduationCap,
                                                colorDark: '#86EFAC',
                                                colorLight: '#15803D',
                                                bgDark: 'linear-gradient(135deg, rgba(74, 222, 128, 0.26) 0%, rgba(22, 163, 74, 0.14) 100%)',
                                                bgLight: '#E6F4EA',
                                                borderDark: 'rgba(134, 239, 172, 0.36)',
                                                onClick: () => setActiveScreen('courses'),
                                            },
                                            {
                                                title: groupChatEnabled ? 'گروه دوره' : 'گروه (قفل)',
                                                Icon: Users,
                                                colorDark: '#DDD6FE',
                                                colorLight: '#6D28D9',
                                                bgDark: 'linear-gradient(135deg, rgba(167, 139, 250, 0.26) 0%, rgba(124, 58, 237, 0.14) 100%)',
                                                bgLight: '#EDE9FE',
                                                borderDark: 'rgba(196, 181, 253, 0.36)',
                                                onClick: openCourseGroupChat,
                                            },
                                            {
                                                title: 'رادیو رشد',
                                                Icon: Headphones,
                                                colorDark: '#D9F99D',
                                                colorLight: '#4D7C0F',
                                                bgDark: 'linear-gradient(135deg, rgba(163, 230, 53, 0.26) 0%, rgba(101, 163, 13, 0.14) 100%)',
                                                bgLight: '#ECFCCB',
                                                borderDark: 'rgba(217, 249, 157, 0.36)',
                                                onClick: () =>
                                                    openInAppContent(
                                                        'roshd-future-mindset-podcast',
                                                        201
                                                    ),
                                            },
                                            {
                                                title: 'فروشگاه',
                                                Icon: ShoppingBag,
                                                colorDark: '#FBCFE8',
                                                colorLight: '#BE185D',
                                                bgDark: 'linear-gradient(135deg, rgba(244, 114, 182, 0.26) 0%, rgba(219, 39, 119, 0.14) 100%)',
                                                bgLight: '#FCE7F3',
                                                borderDark: 'rgba(249, 168, 212, 0.36)',
                                                onClick: () => setActiveScreen('shop'),
                                            },
                                        ].map((quick) => {
                                            const QuickIcon = quick.Icon;
                                            return (
                                                <button
                                                    key={quick.title}
                                                    type="button"
                                                    onClick={quick.onClick}
                                                    className="group flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-2xl border backdrop-blur-md cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                                                    style={{
                                                        background: isDark
                                                            ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.04) 100%)'
                                                            : '#FFFFFF',
                                                        borderColor: isDark
                                                            ? 'rgba(255, 255, 255, 0.16)'
                                                            : '#E2EFE7',
                                                        boxShadow: isDark
                                                            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.14)'
                                                            : '0 2px 6px rgba(18, 62, 48, 0.04)',
                                                    }}
                                                >
                                                    <span
                                                        className="w-7 h-7 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-110"
                                                        style={{
                                                            background: isDark
                                                                ? quick.bgDark
                                                                : quick.bgLight,
                                                            borderColor: isDark
                                                                ? quick.borderDark
                                                                : 'transparent',
                                                        }}
                                                    >
                                                        <QuickIcon
                                                            className="w-3.5 h-3.5"
                                                            style={{
                                                                color: isDark
                                                                    ? quick.colorDark
                                                                    : quick.colorLight,
                                                            }}
                                                        />
                                                    </span>
                                                    <span
                                                        className="font-extrabold text-[10px] leading-tight truncate max-w-full"
                                                        style={{
                                                            color: isDark ? '#F8FAFC' : '#0F291E',
                                                        }}
                                                    >
                                                        {quick.title}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Synchronized Website Pillars Strip (Talent Compass, 1:1 Coaching, Parent Report) */}
                                    <div
                                        className="grid grid-cols-3 gap-1.5 pt-2.5 mt-2.5 border-t relative z-10"
                                        style={{
                                            borderColor: isDark
                                                ? 'rgba(255, 255, 255, 0.10)'
                                                : '#E2EFE7',
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('profile')}
                                            className="px-2 py-1.5 rounded-xl border backdrop-blur-md flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
                                            style={{
                                                background: isDark
                                                    ? 'rgba(163, 230, 53, 0.12)'
                                                    : '#F0FDF4',
                                                borderColor: isDark
                                                    ? 'rgba(190, 242, 100, 0.30)'
                                                    : '#BBF7D0',
                                                color: isDark ? '#ECFCCB' : '#14532D',
                                            }}
                                        >
                                            <Compass className="w-3.5 h-3.5 shrink-0" />
                                            <span className="text-[9.5px] font-extrabold truncate">
                                                قطب‌نمای استعداد
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('goals')}
                                            className="px-2 py-1.5 rounded-xl border backdrop-blur-md flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
                                            style={{
                                                background: isDark
                                                    ? 'rgba(56, 189, 248, 0.12)'
                                                    : '#F0F9FF',
                                                borderColor: isDark
                                                    ? 'rgba(125, 211, 252, 0.30)'
                                                    : '#BAE6FD',
                                                color: isDark ? '#E0F2FE' : '#0C4A6E',
                                            }}
                                        >
                                            <Flag className="w-3.5 h-3.5 shrink-0" />
                                            <span className="text-[9.5px] font-extrabold truncate">
                                                بوم ۹۰ روزه
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSendParentReport}
                                            className="px-2 py-1.5 rounded-xl border backdrop-blur-md flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
                                            style={{
                                                background: isDark
                                                    ? 'rgba(251, 191, 36, 0.12)'
                                                    : '#FFFBEB',
                                                borderColor: isDark
                                                    ? 'rgba(253, 224, 71, 0.30)'
                                                    : '#FDE68A',
                                                color: isDark ? '#FEF9C3' : '#78350F',
                                            }}
                                        >
                                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                            <span className="text-[9.5px] font-extrabold truncate">
                                                کارنامه والدین
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* 3. Side-by-Side Twin Live Widgets */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div
                                        onClick={() =>
                                            isVipEnrolled
                                                ? setActiveScreen('vipClub')
                                                : setActiveScreen('sessions')
                                        }
                                        className="cursor-pointer rounded-[18px] p-3 border flex flex-col justify-between transition hover:shadow-xs"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[10px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    {isVipEnrolled ? 'وضعیت حضور VIP' : 'جلسات کوچینگ'}
                                                </span>
                                                <span
                                                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: colors.primarySoft,
                                                        color: colors.primary,
                                                    }}
                                                >
                                                    <Calendar className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                            <div
                                                className="font-black text-[13px] mt-1.5 truncate"
                                                style={{ color: colors.text }}
                                            >
                                                {isVipEnrolled
                                                    ? `${faNum(95)}٪ حضور منظم`
                                                    : '۱ جلسه پیش‌رو'}
                                            </div>
                                            <div
                                                className="text-[10px] mt-0.5 truncate"
                                                style={{ color: colors.muted }}
                                            >
                                                {isVipEnrolled
                                                    ? '۴ آیتم تخصصی با ۴ مدرس'
                                                    : 'چهارشنبه ساعت ۱۸:۰۰'}
                                            </div>
                                        </div>

                                        <div className="mt-2.5 space-y-1">
                                            <div
                                                className="h-1.5 rounded-full overflow-hidden"
                                                style={{ backgroundColor: colors.surfaceAlt }}
                                            >
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: isVipEnrolled ? '95%' : '60%',
                                                        backgroundColor: colors.primary,
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className="flex items-center justify-between text-[10px] font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                <span>
                                                    {isVipEnrolled ? 'برنامه کلاس‌ها' : 'مدیریت جلسات'}
                                                </span>
                                                <ArrowLeft className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setActiveScreen('dashboard')}
                                        className="cursor-pointer rounded-[18px] p-3 border flex flex-col justify-between transition hover:shadow-xs"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[10px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    رشد من و تکالیف
                                                </span>
                                                <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center">
                                                    <Flame className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                            <div
                                                className="font-black text-[13px] mt-1.5 truncate"
                                                style={{ color: colors.text }}
                                            >
                                                {faNum(3)} هدف و ۲ کتاب اپ
                                            </div>
                                            <div
                                                className="text-[10px] mt-0.5 truncate"
                                                style={{ color: colors.muted }}
                                            >
                                                میانگین پیشرفت: {faNum(68)}٪
                                            </div>
                                        </div>

                                        <div className="mt-2.5 space-y-1">
                                            <div
                                                className="h-1.5 rounded-full overflow-hidden"
                                                style={{ backgroundColor: colors.surfaceAlt }}
                                            >
                                                <div
                                                    className="h-full rounded-full bg-amber-500"
                                                    style={{ width: '68%' }}
                                                />
                                            </div>
                                            <div
                                                className="flex items-center justify-between text-[10px] font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                <span>ورود به رشد من</span>
                                                <ArrowLeft className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Horizontal Compact Slider: Featured Courses with Poster Frame */}
                                <div className="space-y-2 pt-0.5">
                                    <div className="flex items-center justify-between">
                                        <h2
                                            className="font-extrabold text-[15px]"
                                            style={{ color: colors.text }}
                                        >
                                            دوره‌های منتخب آکادمی
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('courses')}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            <span>مشاهده همه</span>
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                                        {allCourses.filter((c: any) => c.is_published !== false).map((course) => {
                                            const isUserEnrolledInThisCourse =
                                                course.is_vip && isVipEnrolled;
                                            return (
                                                <div
                                                    key={course.id}
                                                    onClick={() => openCourse(course.slug)}
                                                    className="w-[225px] shrink-0 rounded-[18px] border overflow-hidden cursor-pointer transition hover:shadow-sm"
                                                    style={{
                                                        backgroundColor: colors.surface,
                                                        borderColor: course.is_vip
                                                            ? '#F59E0B'
                                                            : colors.border,
                                                    }}
                                                >
                                                    <div
                                                        className="h-28 p-3 flex flex-col justify-between relative overflow-hidden"
                                                        style={{
                                                            background:
                                                                course.posterGradient ||
                                                                '#123E30',
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                course.is_vip
                                                                    ? vipConfig.posterUrl
                                                                    : course.poster ||
                                                                      course.thumbnail
                                                            }
                                                            alt=""
                                                            className="w-full h-full object-cover inset-0 opacity-40 pointer-events-none absolute"
                                                        />
                                                        <div className="flex items-center justify-between z-10">
                                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/35 text-[#D6F39A]">
                                                                {course.is_vip
                                                                    ? vipConfig.posterBadge
                                                                    : course.posterTag}
                                                            </span>
                                                            {course.is_vip && (
                                                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-[#0D2E22] inline-flex items-center gap-1">
                                                                    <Crown className="w-2.5 h-2.5" />
                                                                    <span>VIP</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-white font-bold text-[11px] line-clamp-1 z-10">
                                                            {course.is_vip
                                                                ? vipConfig.title
                                                                : course.title}
                                                        </div>
                                                    </div>
                                                    <div className="p-2.5 space-y-1.5">
                                                        <div
                                                            className="flex items-center justify-between text-[10px]"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            <span className="truncate">
                                                                {course.instructor.name}
                                                            </span>
                                                            <span>
                                                                {faNum(course.lessons_count)} جلسه
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="pt-1.5 border-t flex items-center justify-between"
                                                            style={{ borderColor: colors.border }}
                                                        >
                                                            {isUserEnrolledInThisCourse ? (
                                                                <span
                                                                    className="font-extrabold text-[11px] inline-flex items-center gap-1"
                                                                    style={{ color: colors.primary }}
                                                                >
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    <span>ثبت‌نام‌شده • مشاهده سرفصل‌ها</span>
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className="font-extrabold text-[11px]"
                                                                    style={{ color: colors.primary }}
                                                                >
                                                                    {course.is_free
                                                                        ? 'رایگان'
                                                                        : formatPrice(
                                                                              course.discount_price ||
                                                                                  course.price
                                                                          )}
                                                                </span>
                                                            )}
                                                            <ArrowLeft
                                                                className="w-3.5 h-3.5"
                                                                style={{ color: colors.primary }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 5. Horizontal Compact Slider: Store & In-App Books/Podcasts */}
                                <div className="space-y-2 pt-0.5">
                                    <div className="flex items-center justify-between">
                                        <h2
                                            className="font-extrabold text-[15px]"
                                            style={{ color: colors.text }}
                                        >
                                            فروشگاه، کتاب‌خوان و پادکست اپ
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('shop')}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            <span>فروشگاه</span>
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                                        {mockProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => openProductDetail(product.slug)}
                                                className="w-[170px] shrink-0 rounded-[18px] border p-2.5 flex flex-col justify-between cursor-pointer transition hover:shadow-xs"
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                                                            style={{
                                                                backgroundColor: colors.primarySoft,
                                                                color: colors.primary,
                                                            }}
                                                        >
                                                            {product.posterTag}
                                                        </span>
                                                        {product.inAppOnly && (
                                                            <Lock
                                                                className="w-3 h-3"
                                                                style={{ color: colors.gold }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div
                                                        className="font-bold text-[11px] line-clamp-2 leading-4"
                                                        style={{ color: colors.text }}
                                                    >
                                                        {product.title}
                                                    </div>
                                                    <div
                                                        className="text-[9px] truncate"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        {product.author}
                                                    </div>
                                                </div>
                                                <div
                                                    className="font-extrabold text-[10px] mt-2 pt-1.5 border-t flex items-center justify-between"
                                                    style={{
                                                        color: colors.primary,
                                                        borderColor: colors.border,
                                                    }}
                                                >
                                                    <span>پیش‌نمایش محصول</span>
                                                    <ArrowLeft className="w-3 h-3" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ==================== VIP TEEN FUTURE PORTAL (No QR Code — Schedule, Multi-Instructor Items & Attendance) ==================== */}
                        {activeScreen === 'vipClub' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('dashboard')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold"
                                        style={{ color: colors.primary }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        <span>بازگشت به رشد من</span>
                                    </button>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-[#0D2E22] font-black text-[11px]">
                                        <Crown className="w-3.5 h-3.5" />
                                        <span>دانش‌پذیر رسمی VIP</span>
                                    </span>
                                </div>

                                {/* Enrolled Student Header Banner with Course Poster */}
                                <div className="rounded-[26px] overflow-hidden bg-[#123E30] text-white border border-amber-400/50 shadow-md">
                                    <div className="p-4 flex items-center gap-3.5">
                                        <div className="w-20 h-26 rounded-2xl overflow-hidden border border-amber-400/50 shrink-0 relative bg-[#0B281F]">
                                            <img
                                                src={vipConfig.posterUrl}
                                                alt={vipConfig.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="bottom-1 inset-x-1 text-[8px] font-black text-center bg-amber-400 text-[#0D2E22] rounded py-0.5 absolute">
                                                پوستر دوره
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 min-w-0 flex-1">
                                            <div className="text-[11px] text-[#D6F39A] font-bold">
                                                کد عضویت اختصاصی: VIP-1404-101
                                            </div>
                                            <h1 className="font-black text-sm leading-6">
                                                {vipConfig.title}
                                            </h1>
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={openCourseGroupChat}
                                                    className="px-2.5 py-1 rounded-xl bg-amber-400 text-[#0D2E22] font-black text-[10px] inline-flex items-center gap-1"
                                                >
                                                    <Users className="w-3 h-3" />
                                                    <span>گروه تخصصی دوره</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={openCourseSupportChat}
                                                    className="px-2.5 py-1 rounded-xl bg-white/15 text-white font-bold text-[10px] inline-flex items-center gap-1"
                                                >
                                                    <MessageCircle className="w-3 h-3" />
                                                    <span>پشتیبانی کلی دوره</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3 Operational Tabs for Enrolled VIP Member (Schedule / Course Items & Instructors / Attendance) */}
                                <div
                                    className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl border"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    {[
                                        { id: 'schedule' as const, label: 'برنامه کلاس‌ها' },
                                        { id: 'items' as const, label: 'آیتم‌ها و مدرسین' },
                                        { id: 'attendance' as const, label: 'حضور و غیاب من' },
                                    ].map((t) => {
                                        const active = vipClubTab === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setVipClubTab(t.id)}
                                                className="py-2 rounded-xl text-xs font-bold transition"
                                                style={{
                                                    backgroundColor: active
                                                        ? colors.primary
                                                        : 'transparent',
                                                    color: active ? '#FFFFFF' : colors.text,
                                                }}
                                            >
                                                {t.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Tab 1: Hybrid Class Schedule */}
                                {vipClubTab === 'schedule' && (
                                    <div className="space-y-3">
                                        <div
                                            className="rounded-2xl border p-3.5 text-xs space-y-1.5"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div className="flex items-center gap-2 font-bold" style={{ color: colors.text }}>
                                                <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
                                                <span>آدرس کلاس حضوری: {vipConfig.inPersonLocation}</span>
                                            </div>
                                            <div className="flex items-center gap-2" style={{ color: colors.muted }}>
                                                <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                                                <span>{vipConfig.scheduleSummary}</span>
                                            </div>
                                        </div>

                                        {vipSessions.map((sess, idx) => {
                                            const isInPerson = sess.mode === 'in_person';
                                            const matchingItem =
                                                courseItems[idx % courseItems.length];
                                            return (
                                                <div
                                                    key={sess.id}
                                                    className="rounded-[22px] border p-4 space-y-2.5"
                                                    style={{
                                                        backgroundColor: colors.surface,
                                                        borderColor: colors.border,
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span
                                                            className="font-bold inline-flex items-center gap-1.5"
                                                            style={{
                                                                color: isInPerson
                                                                    ? '#B45309'
                                                                    : colors.primary,
                                                            }}
                                                        >
                                                            {isInPerson ? (
                                                                <Building2 className="w-4 h-4" />
                                                            ) : (
                                                                <Video className="w-4 h-4" />
                                                            )}
                                                            <span>
                                                                جلسه {faNum(sess.number)} ·{' '}
                                                                {isInPerson ? 'کلاس حضوری' : 'کلاس آنلاین'}
                                                            </span>
                                                        </span>
                                                        <span
                                                            className="text-[11px] font-bold"
                                                            style={{
                                                                color:
                                                                    sess.status === 'completed'
                                                                        ? colors.primary
                                                                        : '#D97706',
                                                            }}
                                                        >
                                                            {sess.status === 'completed'
                                                                ? 'برگزار شده (حاضر)'
                                                                : 'در پیش رو'}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="font-bold text-sm"
                                                        style={{ color: colors.text }}
                                                    >
                                                        {sess.title}
                                                    </div>

                                                    <div
                                                        className="text-xs flex items-center justify-between"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        <span>
                                                            {sess.date} · ساعت {sess.time}
                                                        </span>
                                                        <span className="font-bold" style={{ color: colors.primary }}>
                                                            مدرس: {matchingItem.instructorName}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="pt-2.5 border-t flex items-center justify-between text-xs gap-2"
                                                        style={{ borderColor: colors.border }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openItemInstructorChat(
                                                                    matchingItem.itemId
                                                                )
                                                            }
                                                            className="px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                                                            style={{
                                                                backgroundColor: colors.primarySoft,
                                                                color: colors.primary,
                                                            }}
                                                        >
                                                            <MessageSquare className="w-3.5 h-3.5" />
                                                            <span>چت خصوصی با مدرس این آیتم</span>
                                                        </button>
                                                        {!isInPerson && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    showToast('در حال ورود به کلاس آنلاین...')
                                                                }
                                                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                                                                style={{
                                                                    backgroundColor: colors.primary,
                                                                }}
                                                            >
                                                                ورود به کلاس آنلاین
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Tab 2: Multi-Instructor Course Items & Direct Private Chat */}
                                {vipClubTab === 'items' && (
                                    <div className="space-y-3">
                                        {courseItems.map((item) => (
                                            <div
                                                key={item.itemId}
                                                className="rounded-[22px] border p-4 space-y-2.5"
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span
                                                        className="px-2.5 py-0.5 rounded-full font-bold"
                                                        style={{
                                                            backgroundColor: colors.primarySoft,
                                                            color: colors.primary,
                                                        }}
                                                    >
                                                        {item.deliveryMode} · {faNum(item.lessonsCount)} جلسه
                                                    </span>
                                                    <span style={{ color: colors.muted }}>
                                                        {item.duration}
                                                    </span>
                                                </div>
                                                <div
                                                    className="font-black text-sm"
                                                    style={{ color: colors.text }}
                                                >
                                                    {item.itemTitle}
                                                </div>
                                                <p
                                                    className="text-xs leading-5"
                                                    style={{ color: colors.muted }}
                                                >
                                                    {item.itemSubtitle}
                                                </p>
                                                <div
                                                    className="pt-2.5 border-t flex items-center justify-between gap-2"
                                                    style={{ borderColor: colors.border }}
                                                >
                                                    <div className="min-w-0">
                                                        <div
                                                            className="font-bold text-xs"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {item.instructorName}
                                                        </div>
                                                        <div
                                                            className="text-[10px]"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {item.instructorRole}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openItemInstructorChat(item.itemId)
                                                        }
                                                        className="px-3 py-1.5 rounded-xl bg-[#153F31] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5 text-[#D6F39A]" />
                                                        <span>چت خصوصی با مدرس</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tab 3: Student Attendance History */}
                                {vipClubTab === 'attendance' && (
                                    <div
                                        className="rounded-[22px] border p-4 space-y-3"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="font-bold text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                وضعیت حضور و غیاب ثبت‌شده توسط مدرس
                                            </span>
                                            <span
                                                className="text-xs font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                {faNum(95)}٪ حضور
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {vipSessions.map((sess) => (
                                                <div
                                                    key={sess.id}
                                                    className="p-3 rounded-xl flex items-center justify-between text-xs"
                                                    style={{ backgroundColor: colors.surfaceAlt }}
                                                >
                                                    <div>
                                                        <div
                                                            className="font-bold"
                                                            style={{ color: colors.text }}
                                                        >
                                                            جلسه {faNum(sess.number)} ({sess.mode === 'in_person' ? 'حضوری' : 'مجازی'})
                                                        </div>
                                                        <div
                                                            className="text-[11px] mt-0.5"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {sess.date}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="font-bold"
                                                        style={{
                                                            color:
                                                                sess.status === 'completed'
                                                                    ? colors.primary
                                                                    : colors.muted,
                                                        }}
                                                    >
                                                        {sess.status === 'completed'
                                                            ? sess.mode === 'in_person'
                                                                ? 'حاضر (حضوری)'
                                                                : 'حاضر (آنلاین)'
                                                            : 'برگزار نشده'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ==================== COURSES SCREEN (یادگیری) ==================== */}
                        {activeScreen === 'courses' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1
                                            className="font-black text-xl"
                                            style={{ color: colors.text }}
                                        >
                                            آکادمی و یادگیری
                                        </h1>
                                        <p
                                            className="text-xs mt-1"
                                            style={{ color: colors.muted }}
                                        >
                                            دوره‌های تخصصی با پوستر رسمی و اساتید هر آیتم
                                        </p>
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: colors.primarySoft }}
                                    >
                                        <GraduationCap className="w-6 h-6" style={{ color: colors.primary }} />
                                    </div>
                                </div>

                                {/* Search Input with Fixed Background/Text Color */}
                                <div
                                    className="w-full rounded-2xl px-3.5 py-2.5 border flex items-center gap-2.5"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <Search className="w-4 h-4 shrink-0" style={{ color: colors.muted }} />
                                    <input
                                        type="text"
                                        aria-label="جستجوی دوره"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="جستجوی دوره..."
                                        className="roshd-app-input roshd-search-input w-full text-sm bg-transparent outline-none border-0 p-0 focus:ring-0"
                                        style={{
                                            color: colors.text,
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            aria-label="پاک کردن جستجو"
                                            onClick={() => setSearchQuery('')}
                                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                color: colors.muted,
                                            }}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {[
                                        'همه',
                                        'نوجوانان و والدین',
                                        'استعدادیابی بزرگسالان',
                                        'کوچینگ حرفه‌ای',
                                        'کارآفرینی',
                                    ].map((cat) => {
                                        const active = selectedCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border transition"
                                                style={{
                                                    backgroundColor: active
                                                        ? colors.primary
                                                        : colors.surface,
                                                    color: active ? '#FFFFFF' : colors.text,
                                                    borderColor: active
                                                        ? colors.primary
                                                        : colors.border,
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="space-y-3">
                                    {filteredCourses.map((course) => {
                                        const isUserEnrolledInThisCourse =
                                            course.is_vip && isVipEnrolled;
                                        return (
                                            <div
                                                key={course.id}
                                                onClick={() => openCourse(course.slug)}
                                                className="rounded-[22px] border p-3.5 space-y-2.5 cursor-pointer transition hover:shadow-md"
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: course.is_vip
                                                        ? '#F59E0B'
                                                        : colors.border,
                                                }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Course Poster Frame (matching website poster slot) */}
                                                    <div
                                                        className="w-20 h-26 rounded-2xl overflow-hidden border shrink-0 relative bg-[#123E30]"
                                                        style={{
                                                            borderColor: course.is_vip
                                                                ? '#F59E0B'
                                                                : colors.border,
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                course.is_vip
                                                                    ? vipConfig.posterUrl
                                                                    : course.poster ||
                                                                      course.thumbnail
                                                            }
                                                            alt={course.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <span className="absolute bottom-1 inset-x-1 text-[8px] font-black text-center py-0.5 rounded bg-black/75 text-[#D6F39A] truncate px-1">
                                                            {course.is_vip
                                                                ? vipConfig.posterBadge
                                                                : course.posterTag ||
                                                                  'پوستر دوره'}
                                                        </span>
                                                    </div>

                                                    <div className="flex-1 min-w-0 space-y-1.5">
                                                        <div className="flex items-center justify-between text-[10px]">
                                                            <span
                                                                className="font-bold truncate"
                                                                style={{ color: colors.primary }}
                                                            >
                                                                {course.category}
                                                                {course.is_vip ? ' · VIP' : ''}
                                                            </span>
                                                            <span
                                                                className="flex items-center gap-1 shrink-0"
                                                                style={{ color: colors.muted }}
                                                            >
                                                                <Clock className="w-3 h-3" />
                                                                <span>{course.duration}</span>
                                                            </span>
                                                        </div>
                                                        <h3
                                                            className="font-black text-xs leading-5"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {course.is_vip
                                                                ? vipConfig.title
                                                                : course.title}
                                                        </h3>
                                                        <p
                                                            className="text-[11px] leading-4 line-clamp-2"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {course.is_vip
                                                                ? vipConfig.subtitle
                                                                : course.summary}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 pt-0.5 text-[10px] font-bold">
                                                            <span
                                                                className="px-2 py-0.5 rounded-md"
                                                                style={{
                                                                    backgroundColor:
                                                                        colors.primarySoft,
                                                                    color: colors.primary,
                                                                }}
                                                            >
                                                                {faNum(
                                                                    course.instructors_count || 1
                                                                )}{' '}
                                                                مدرس تخصصی
                                                            </span>
                                                            <span
                                                                style={{ color: colors.muted }}
                                                            >
                                                                • {faNum(course.lessons_count)} جلسه
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className="pt-2.5 border-t flex items-center justify-between"
                                                    style={{ borderColor: colors.border }}
                                                >
                                                    <span
                                                        className="text-[11px] flex items-center gap-1.5"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        <img
                                                            src={course.instructor.avatar}
                                                            alt={course.instructor.name}
                                                            className="w-5 h-5 rounded-full object-cover"
                                                        />
                                                        <span>
                                                            سرپرست علمی: {course.instructor.name}
                                                        </span>
                                                    </span>
                                                    {isUserEnrolledInThisCourse ? (
                                                        <span
                                                            className="font-extrabold text-[11px] inline-flex items-center gap-1"
                                                            style={{ color: colors.primary }}
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span>ثبت‌نام‌شده • مشاهده آیتم‌ها</span>
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="font-extrabold text-xs"
                                                            style={{ color: colors.primary }}
                                                        >
                                                            {course.is_free
                                                                ? 'رایگان'
                                                                : formatPrice(
                                                                      course.discount_price ||
                                                                          course.price
                                                                  )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ==================== COURSE DETAIL SCREEN (With Official Poster, Per-Item Instructors & Chat Shortcuts) ==================== */}
                        {activeScreen === 'courseDetail' && (
                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveScreen('courses')}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold"
                                    style={{ color: colors.primary }}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    <span>بازگشت به آکادمی</span>
                                </button>

                                {/* Official Course Poster & Hero Card */}
                                <div className="rounded-[26px] overflow-hidden bg-[#123E30] text-white border border-amber-400/50">
                                    <div className="p-4 flex items-start gap-3.5 border-b border-white/10">
                                        <div className="w-24 h-32 rounded-2xl overflow-hidden border-2 border-amber-300/70 shrink-0 relative shadow-lg bg-[#0A261D]">
                                            <img
                                                src={
                                                    selectedCourse.is_vip
                                                        ? vipConfig.posterUrl
                                                        : selectedCourse.poster ||
                                                          selectedCourse.thumbnail
                                                }
                                                alt={selectedCourse.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute bottom-1 inset-x-1 bg-black/75 text-[#D6F39A] text-[8px] font-black text-center py-0.5 rounded">
                                                {selectedCourse.is_vip
                                                    ? vipConfig.posterBadge
                                                    : selectedCourse.posterTag || 'پوستر رسمی'}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 min-w-0 flex-1">
                                            <div className="text-[10px] text-[#D6F39A] font-bold">
                                                {selectedCourse.category} ·{' '}
                                                {faNum(selectedCourse.instructors_count || 4)} مدرس تخصصی
                                            </div>
                                            <h1 className="font-black text-sm leading-6">
                                                {selectedCourse.is_vip
                                                    ? vipConfig.title
                                                    : selectedCourse.title}
                                            </h1>
                                            <p className="text-[11px] text-[#C5D7CA] leading-5">
                                                {selectedCourse.is_vip
                                                    ? vipConfig.description
                                                    : selectedCourse.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick Course Group & General Support Bar */}
                                    <div className="p-3 bg-black/20 grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={openCourseGroupChat}
                                            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold flex items-center justify-center gap-1.5"
                                        >
                                            <Users className="w-3.5 h-3.5 text-amber-300" />
                                            <span>گروه تخصصی دوره</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={openCourseSupportChat}
                                            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold flex items-center justify-center gap-1.5"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5 text-[#D6F39A]" />
                                            <span>پشتیبانی کلی دوره</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Per-Item Specialized Instructors List with Direct Private Chat */}
                                <div
                                    className="rounded-[22px] border p-4 space-y-3"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3
                                                className="font-black text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                آیتم‌های آموزشی و اساتید اختصاصی هر بخش
                                            </h3>
                                            <p
                                                className="text-[11px]"
                                                style={{ color: colors.muted }}
                                            >
                                                برای هر آیتم می‌توانید مستقیماً با مدرس همان آیتم چت خصوصی داشته باشید
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        {courseItems.map((item) => (
                                            <div
                                                key={item.itemId}
                                                className="p-3 rounded-2xl border space-y-2"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span
                                                        className="font-black"
                                                        style={{ color: colors.primary }}
                                                    >
                                                        {item.itemTitle}
                                                    </span>
                                                    <span style={{ color: colors.muted }}>
                                                        {faNum(item.lessonsCount)} جلسه
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-[11px] leading-5"
                                                    style={{ color: colors.muted }}
                                                >
                                                    {item.itemSubtitle}
                                                </p>
                                                <div
                                                    className="pt-2 border-t flex items-center justify-between gap-2"
                                                    style={{ borderColor: colors.border }}
                                                >
                                                    <div className="min-w-0">
                                                        <div
                                                            className="font-bold text-xs"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {item.instructorName}
                                                        </div>
                                                        <div
                                                            className="text-[10px]"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {item.instructorRole}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openItemInstructorChat(item.itemId)
                                                        }
                                                        className="px-3 py-1.5 rounded-xl bg-[#153F31] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5 text-[#D6F39A]" />
                                                        <span>چت با مدرس آیتم</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedCourse.slug === 'designing-teen-future-vip' ? (
                                    <>
                                        {/* Location & Schedule Info */}
                                        <div
                                            className="rounded-[22px] border p-4 space-y-2 text-xs"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div className="font-bold text-sm mb-1" style={{ color: colors.text }}>
                                                شرایط و زمان‌بندی کلاس‌ها
                                            </div>
                                            <div style={{ color: colors.muted }}>
                                                محل برگزاری حضوری: {vipConfig.inPersonLocation}
                                            </div>
                                            <div style={{ color: colors.muted }}>
                                                زمان‌بندی هفتگی: {vipConfig.scheduleSummary}
                                            </div>
                                            <div
                                                className="pt-2 border-t flex items-center justify-between"
                                                style={{ borderColor: colors.border }}
                                            >
                                                <span style={{ color: colors.muted }}>شهریه دوره:</span>
                                                <span
                                                    className="font-black text-sm"
                                                    style={{ color: colors.primary }}
                                                >
                                                    {formatPrice(vipConfig.discountPrice)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewRole('vip_student');
                                                setActiveScreen('vipClub');
                                                showToast('ورود به باشگاه و برنامه کلاس‌های دوره VIP');
                                            }}
                                            className="w-full py-3.5 rounded-2xl bg-[#D6F39A] text-[#153F32] font-black text-sm shadow-sm inline-flex items-center justify-center gap-2"
                                        >
                                            <Crown className="w-4 h-4" />
                                            <span>
                                                {isVipEnrolled
                                                    ? 'ورود به باشگاه و تقویم جلسات VIP'
                                                    : 'ثبت‌نام در دوره و دریافت مهر VIP'}
                                            </span>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('learning')}
                                        className="w-full py-3.5 rounded-2xl bg-[#D6F39A] text-[#153F32] font-black text-sm shadow-sm inline-flex items-center justify-center gap-2"
                                    >
                                        <span>ورود به اتاق یادگیری دوره</span>
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ==================== LEARNING ROOM SCREEN (اتاق یادگیری تعاملی دوره) ==================== */}
                        {activeScreen === 'learning' && (() => {
                            const activeLesson =
                                lessons.find((l) => l.id === selectedLessonId) || lessons[0];
                            const completedCount = lessons.filter((l) => l.completed).length;
                            const completionPct = Math.round(
                                (completedCount / Math.max(1, lessons.length)) * 100
                            );
                            return (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('courseDetail')}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                            <span>بازگشت به دوره</span>
                                        </button>
                                        <span className="px-3 py-1 rounded-full text-xs font-black bg-[#123E30] text-[#D6F39A]">
                                            پیشرفت جلسات: {faNum(completionPct)}٪ ({faNum(completedCount)} از {faNum(lessons.length)})
                                        </span>
                                    </div>

                                    <div className="bg-[#123E30] rounded-[24px] p-5 text-white space-y-4 border border-emerald-400/20 shadow-lg">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[#D6F39A] font-bold flex items-center gap-1.5">
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                <span>
                                                    جلسه {faNum(activeLesson.number)} · {activeLesson.duration}
                                                </span>
                                            </span>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                                    activeLesson.completed
                                                        ? 'bg-emerald-500/25 text-[#D6F39A]'
                                                        : 'bg-white/10 text-white/80'
                                                }`}
                                            >
                                                {activeLesson.completed ? 'تکمیل شده ✓' : 'در حال مشاهده'}
                                            </span>
                                        </div>

                                        <h2 className="font-black text-base leading-7">
                                            {activeLesson.title}
                                        </h2>
                                        <p className="text-xs text-emerald-100/85 leading-6">
                                            {activeLesson.videoSummary}
                                        </p>

                                        <div className="h-48 rounded-2xl bg-black/45 flex flex-col items-center justify-center border border-white/10 relative overflow-hidden p-4">
                                            <img
                                                src="/images/growth-editorial.png"
                                                alt=""
                                                className="w-36 h-36 object-contain opacity-20 absolute"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setVideoPlaying((v) => !v)}
                                                className="w-14 h-14 rounded-full bg-[#D6F39A] text-[#123E30] flex items-center justify-center shadow-lg relative z-10 transition hover:scale-105"
                                            >
                                                {videoPlaying ? (
                                                    <Pause className="w-6 h-6 fill-current" />
                                                ) : (
                                                    <Play className="w-6 h-6 fill-current" />
                                                )}
                                            </button>
                                            <span className="text-[11px] font-bold text-[#D6F39A] mt-2 relative z-10">
                                                {videoPlaying
                                                    ? 'در حال پخش ویدئوی آموزشی...'
                                                    : 'کلیک جهت پخش ویدئوی جلسه'}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <input
                                                type="range"
                                                aria-label="نوار زمان ویدئو"
                                                min={0}
                                                max={100}
                                                value={videoProgress}
                                                onChange={(e) =>
                                                    setVideoProgress(Number(e.target.value))
                                                }
                                                className="w-full accent-[#D6F39A] cursor-pointer"
                                            />
                                            <div className="flex items-center justify-between text-[11px] text-emerald-100/80">
                                                <span>{faNum(videoProgress)}٪ مشاهده‌شده</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const wasCompleted = activeLesson.completed;
                                                        updateAppState((prev) => ({
                                                            ...prev,
                                                            lessons: toggleLessonCompletionInState(
                                                                prev.lessons,
                                                                activeLesson.id
                                                            ),
                                                            userProfile: {
                                                                ...prev.userProfile,
                                                                xp: wasCompleted
                                                                    ? prev.userProfile.xp
                                                                    : prev.userProfile.xp + 50,
                                                            },
                                                        }));
                                                        showToast(
                                                            wasCompleted
                                                                ? 'وضعیت جلسه به «در حال مطالعه» تغییر یافت.'
                                                                : 'جلسه با موفقیت تکمیل شد (+۵۰ امتیاز رشد)!'
                                                        );
                                                    }}
                                                    className="px-3 py-1 rounded-xl bg-[#D6F39A] text-[#123E30] font-black text-xs inline-flex items-center gap-1"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span>
                                                        {activeLesson.completed
                                                            ? 'تکمیل شده (لغو تکمیل)'
                                                            : 'ثبت تکمیل این جلسه (+۵۰ XP)'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interactive Lesson Notes */}
                                    <div
                                        className="rounded-[22px] border p-4 space-y-2.5"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="font-black text-xs"
                                                style={{ color: colors.text }}
                                            >
                                                یادداشت و خلاصه‌نویسی من از این جلسه:
                                            </span>
                                            <span
                                                className="text-[10px] font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                ذخیره خودکار در پرونده رشد
                                            </span>
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={activeLesson.note}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                updateAppState((prev) => ({
                                                    ...prev,
                                                    lessons: updateLessonNoteInState(
                                                        prev.lessons,
                                                        activeLesson.id,
                                                        val
                                                    ),
                                                }));
                                            }}
                                            placeholder="نکات کلیدی یا تمرین‌های خود از این جلسه را اینجا یادداشت کنید..."
                                            className="w-full rounded-xl border p-3 text-xs leading-6 outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />
                                    </div>

                                    {/* Interactive Curriculum Selector */}
                                    <div
                                        className="rounded-[22px] border p-4 space-y-2.5"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div
                                            className="font-bold text-sm"
                                            style={{ color: colors.text }}
                                        >
                                            سرفصل‌ها و جلسات دوره (کلیک برای پخش)
                                        </div>
                                        {lessons.map((item) => {
                                            const isSelected = item.id === activeLesson.id;
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => {
                                                        setSelectedLessonId(item.id);
                                                        setVideoPlaying(true);
                                                    }}
                                                    className="p-3 rounded-xl text-xs flex items-center justify-between cursor-pointer transition border"
                                                    style={{
                                                        backgroundColor: isSelected
                                                            ? colors.primarySoft
                                                            : colors.surfaceAlt,
                                                        borderColor: isSelected
                                                            ? colors.primary
                                                            : 'transparent',
                                                        color: colors.text,
                                                    }}
                                                >
                                                    <div className="space-y-0.5">
                                                        <div className="font-bold">
                                                            {faNum(item.number)}. {item.title}
                                                        </div>
                                                        <div
                                                            className="text-[10px]"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            مدت زمان: {item.duration}
                                                            {item.note ? ' · دارای یادداشت شخصی' : ''}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {item.completed ? (
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-[10px] font-black inline-flex items-center gap-1">
                                                                <Check className="w-3 h-3" />
                                                                <span>تکمیل</span>
                                                            </span>
                                                        ) : (
                                                            <Play
                                                                className="w-4 h-4 fill-current"
                                                                style={{ color: colors.primary }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ==================== DEDICATED CHAT HUB SCREEN (گفتگو: چت خصوصی مدرس هر آیتم + گروه دوره + پشتیبانی کلی) ==================== */}
                        {activeScreen === 'chat' && (
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1
                                            className="font-black text-lg"
                                            style={{ color: colors.text }}
                                        >
                                            مرکز گفتگو و ارتباطات دوره
                                        </h1>
                                        <p
                                            className="text-[11px] mt-0.5"
                                            style={{ color: colors.muted }}
                                        >
                                            چت خصوصی با مدرس هر آیتم، گروه تخصصی دوره و پشتیبانی کلی
                                        </p>
                                    </div>
                                    <div
                                        className="w-10 h-10 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: colors.primarySoft }}
                                    >
                                        <MessageSquare
                                            className="w-5 h-5"
                                            style={{ color: colors.primary }}
                                        />
                                    </div>
                                </div>

                                {/* 3 Channel Switcher Tabs */}
                                <div
                                    className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl border"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    {[
                                        {
                                            id: 'instructor' as const,
                                            label: 'چت با مدرس آیتم',
                                            Icon: UserCheck,
                                        },
                                        {
                                            id: 'group' as const,
                                            label: 'گروه تخصصی دوره',
                                            Icon: Users,
                                        },
                                        {
                                            id: 'support' as const,
                                            label: 'پشتیبانی کلی',
                                            Icon: MessageCircle,
                                        },
                                    ].map((ch) => {
                                        const active = chatChannel === ch.id;
                                        const ChIcon = ch.Icon;
                                        return (
                                            <button
                                                key={ch.id}
                                                type="button"
                                                onClick={() => setChatChannel(ch.id)}
                                                className="py-2 px-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition"
                                                style={{
                                                    backgroundColor: active
                                                        ? colors.primary
                                                        : 'transparent',
                                                    color: active ? '#FFFFFF' : colors.text,
                                                }}
                                            >
                                                <ChIcon className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{ch.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* CHANNEL 1: Per-Item Instructor Selector */}
                                {chatChannel === 'instructor' && (
                                    <div
                                        className="rounded-[22px] border p-3.5 space-y-2.5"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-xs font-black"
                                                style={{ color: colors.text }}
                                            >
                                                انتخاب آیتم دوره و مدرس مربوطه:
                                            </span>
                                            <span
                                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                style={{
                                                    backgroundColor: colors.primarySoft,
                                                    color: colors.primary,
                                                }}
                                            >
                                                {faNum(courseItems.length)} مدرس تخصصی
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1.5">
                                            {courseItems.map((item) => {
                                                const active = item.itemId === selectedItemId;
                                                return (
                                                    <button
                                                        key={item.itemId}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedItemId(item.itemId)
                                                        }
                                                        className="p-2.5 rounded-xl border text-right space-y-0.5 transition"
                                                        style={{
                                                            backgroundColor: active
                                                                ? '#123E30'
                                                                : colors.surfaceAlt,
                                                            borderColor: active
                                                                ? '#F59E0B'
                                                                : colors.border,
                                                            color: active
                                                                ? '#FFFFFF'
                                                                : colors.text,
                                                        }}
                                                    >
                                                        <div className="text-[10px] font-black truncate">
                                                            {item.itemTitle}
                                                        </div>
                                                        <div
                                                            className="text-[10px] truncate"
                                                            style={{
                                                                color: active
                                                                    ? '#D6F39A'
                                                                    : colors.muted,
                                                            }}
                                                        >
                                                            {item.instructorName}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Selected Item Instructor Profile Banner */}
                                        <div className="p-3 rounded-2xl bg-[#123E30] text-white flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="text-[10px] text-[#D6F39A] font-bold">
                                                    چت خصوصی اختصاصی · {selectedCourseItem.itemTitle}
                                                </div>
                                                <div className="font-black text-xs mt-0.5">
                                                    {selectedCourseItem.instructorName}
                                                </div>
                                                <div className="text-[10px] text-emerald-100/80">
                                                    {selectedCourseItem.instructorRole} · {selectedCourseItem.instructorStatus}
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#D6F39A] text-[10px] font-bold shrink-0">
                                                آنلاین
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* CHANNEL 2: Course Group Header + Admin Enable/Disable Control */}
                                {chatChannel === 'group' && (
                                    <div
                                        className="rounded-[22px] border p-3.5 space-y-2.5"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: groupChatEnabled
                                                ? colors.border
                                                : '#F59E0B',
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <h2
                                                        className="font-black text-xs"
                                                        style={{ color: colors.text }}
                                                    >
                                                        گروه تخصصی دانش‌پذیران «طراحی آینده نوجوان»
                                                    </h2>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                                            groupChatEnabled
                                                                ? 'bg-emerald-500/15 text-emerald-700'
                                                                : 'bg-amber-500/20 text-amber-700'
                                                        }`}
                                                    >
                                                        {groupChatEnabled
                                                            ? 'فعال برای اعضا'
                                                            : 'قفل‌شده توسط ادمین'}
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-[10px] mt-0.5"
                                                    style={{ color: colors.muted }}
                                                >
                                                    ۲۴ عضو VIP و ۴ مدرس آیتم‌های دوره در این گروه حضور دارند
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                aria-label="تغییر وضعیت فعال بودن گروه دوره توسط ادمین"
                                                onClick={() => {
                                                    setGroupChatEnabled((prev) => !prev);
                                                    showToast(
                                                        !groupChatEnabled
                                                            ? 'ارسال پیام دانش‌پذیران در گروه تخصصی دوره توسط ادمین فعال شد.'
                                                            : 'ارسال پیام دانش‌پذیران در گروه تخصصی دوره توسط ادمین غیرفعال شد.'
                                                    );
                                                }}
                                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black shrink-0 transition ${
                                                    groupChatEnabled
                                                        ? 'bg-amber-500/20 text-amber-800'
                                                        : 'bg-[#153F31] text-white'
                                                }`}
                                            >
                                                {groupChatEnabled
                                                    ? 'قفل گروه (ادمین)'
                                                    : 'فعال‌سازی گروه'}
                                            </button>
                                        </div>

                                        {!groupChatEnabled && (
                                            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-800 flex items-center gap-2">
                                                <Lock className="w-4 h-4 shrink-0" />
                                                <span>
                                                    ارسال پیام در گروه تخصصی دوره موقتاً توسط مدیر دوره غیرفعال شده است (فقط مشاهده اطلاعیه‌ها).
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* CHANNEL 3: General Course Support Header */}
                                {chatChannel === 'support' && (
                                    <div className="rounded-[22px] bg-[#123E30] text-white p-3.5 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] text-[#D6F39A] font-bold">
                                                پشتیبانی کلی دوره (امور اجرایی، اقلام و جلسات)
                                            </div>
                                            <div className="font-black text-xs mt-0.5">
                                                واحد آموزش و هماهنگی آکادمی رشد
                                            </div>
                                            <div className="text-[10px] text-emerald-100/80 mt-0.5">
                                                پاسخگویی سریع به سوالات ثبت‌نام، زمان‌بندی کلاس‌ها و بسته‌های آموزشی
                                            </div>
                                        </div>
                                        <MessageCircle className="w-6 h-6 text-[#D6F39A] shrink-0" />
                                    </div>
                                )}

                                {/* Messages Thread */}
                                <div
                                    className="rounded-[22px] border p-3.5 space-y-2.5 max-h-[300px] overflow-y-auto"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    {(chatChannel === 'instructor'
                                        ? selectedCourseItem.initialMessages
                                        : chatChannel === 'group'
                                        ? groupMessages
                                        : supportMessages
                                    ).map((msg) => {
                                        const isMe = msg.sender === 'student';
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`p-3 rounded-2xl space-y-1 text-xs ${
                                                    isMe ? 'mr-4' : 'ml-4'
                                                }`}
                                                style={{
                                                    backgroundColor: isMe
                                                        ? colors.primarySoft
                                                        : colors.surfaceAlt,
                                                    color: colors.text,
                                                }}
                                            >
                                                <div className="flex items-center justify-between text-[10px]">
                                                    <span
                                                        className="font-black"
                                                        style={{
                                                            color: isMe
                                                                ? colors.primary
                                                                : '#B45309',
                                                        }}
                                                    >
                                                        {msg.senderName}
                                                        {msg.senderRole ? ` · ${msg.senderRole}` : ''}
                                                    </span>
                                                    <span style={{ color: colors.muted }}>
                                                        {msg.time}
                                                    </span>
                                                </div>
                                                <p className="leading-5 text-xs">{msg.text}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Message Composer */}
                                <div
                                    className="rounded-2xl border p-2 flex items-center gap-2"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <input
                                        type="text"
                                        aria-label="متن پیام گفتگو"
                                        disabled={
                                            chatChannel === 'group' &&
                                            !groupChatEnabled &&
                                            previewRole !== 'instructor'
                                        }
                                        value={chatDraft}
                                        onChange={(e) => setChatDraft(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSendChatMessage();
                                        }}
                                        placeholder={
                                            chatChannel === 'group' &&
                                            !groupChatEnabled &&
                                            previewRole !== 'instructor'
                                                ? 'گروه توسط ادمین غیرفعال شده است...'
                                                : chatChannel === 'instructor'
                                                ? `پیام خصوصی به ${selectedCourseItem.instructorName}...`
                                                : chatChannel === 'group'
                                                ? 'ارسال پیام در گروه تخصصی دوره...'
                                                : 'پیام به پشتیبانی کلی دوره...'
                                        }
                                        className="roshd-app-input flex-1 text-xs bg-transparent outline-none border-0 px-2 py-1.5"
                                        style={{
                                            color: colors.text,
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendChatMessage}
                                        disabled={
                                            chatChannel === 'group' &&
                                            !groupChatEnabled &&
                                            previewRole !== 'instructor'
                                        }
                                        className="px-3.5 py-2 rounded-xl bg-[#153F31] text-white text-xs font-black inline-flex items-center gap-1.5 disabled:opacity-40 shrink-0"
                                    >
                                        <Send className="w-3.5 h-3.5 text-[#D6F39A]" />
                                        <span>ارسال</span>
                                    </button>
                                </div>
                            </div>
                        )}


                        {/* ==================== SHOP SCREEN (فروشگاه) ==================== */}
                        {activeScreen === 'shop' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1
                                            className="font-black text-xl"
                                            style={{ color: colors.text }}
                                        >
                                            فروشگاه و محصولات رشد
                                        </h1>
                                        <p
                                            className="text-xs mt-1"
                                            style={{ color: colors.muted }}
                                        >
                                            کتاب‌ها و پادکست‌های درون‌برنامه‌ای، بسته‌های ارزیابی و کتاب کار
                                        </p>
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: colors.primarySoft }}
                                    >
                                        <ShoppingBag className="w-6 h-6" style={{ color: colors.primary }} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {mockProducts.map((product) => {
                                        const isOwned = ownedProductSlugs.includes(product.slug);
                                        const mode = resolveProductConsumptionMode(product);
                                        return (
                                            <div
                                                key={product.id}
                                                onClick={() => openProductDetail(product.slug)}
                                                className="rounded-[22px] border p-3.5 space-y-2.5 cursor-pointer transition hover:shadow-md"
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span
                                                        className="font-bold px-2 py-0.5 rounded-full"
                                                        style={{
                                                            backgroundColor: colors.primarySoft,
                                                            color: colors.primary,
                                                        }}
                                                    >
                                                        {product.type}
                                                    </span>
                                                    <span
                                                        className="text-[10px] font-bold"
                                                        style={{
                                                            color: mode.isDownloadDisabled
                                                                ? '#B45309'
                                                                : colors.muted,
                                                        }}
                                                    >
                                                        {mode.badgeLabel}
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-3 pt-0.5">
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-16 h-20 rounded-2xl object-cover shrink-0 border"
                                                        style={{ borderColor: colors.border }}
                                                    />
                                                    <div className="space-y-1 min-w-0 flex-1">
                                                        <h3
                                                            className="font-black text-xs leading-5"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {product.title}
                                                        </h3>
                                                        <p
                                                            className="text-[11px] leading-4 line-clamp-2"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {product.summary}
                                                        </p>
                                                        <div
                                                            className="text-[10px] pt-0.5"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            اثر: {product.author}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className="pt-2.5 border-t flex items-center justify-between"
                                                    style={{ borderColor: colors.border }}
                                                >
                                                    <span
                                                        className="font-extrabold text-xs"
                                                        style={{ color: colors.primary }}
                                                    >
                                                        {isOwned
                                                            ? 'موجود در کتابخانه من'
                                                            : formatPrice(
                                                                  product.discount_price ||
                                                                      product.price
                                                              )}
                                                    </span>
                                                    <span
                                                        className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white inline-flex items-center gap-1.5"
                                                        style={{ backgroundColor: colors.primary }}
                                                    >
                                                        {product.deliveryType ===
                                                        'in_app_podcast' ? (
                                                            <Headphones className="w-3.5 h-3.5 text-[#D6F39A]" />
                                                        ) : product.deliveryType ===
                                                          'in_app_book' ? (
                                                            <BookOpen className="w-3.5 h-3.5 text-[#D6F39A]" />
                                                        ) : (
                                                            <ShoppingBag className="w-3.5 h-3.5 text-[#D6F39A]" />
                                                        )}
                                                        <span>معرفی و پیش‌نمایش محصول</span>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ==================== PRODUCT DETAIL & PREVIEW SCREEN (صفحه معرفی و پیش‌نمایش محصول) ==================== */}
                        {activeScreen === 'productDetail' && (
                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveScreen('shop')}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold"
                                    style={{ color: colors.primary }}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    <span>بازگشت به فروشگاه</span>
                                </button>

                                {/* Product Poster & Header Card */}
                                <div className="rounded-[26px] overflow-hidden bg-[#123E30] text-white border border-amber-400/40 p-4 space-y-3">
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-24 h-32 rounded-2xl overflow-hidden border-2 border-[#D6F39A]/60 shrink-0 bg-[#0A261D] shadow-lg">
                                            <img
                                                src={selectedProduct.image}
                                                alt={selectedProduct.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-1.5 min-w-0 flex-1">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black">
                                                {
                                                    resolveProductConsumptionMode(
                                                        selectedProduct
                                                    ).badgeLabel
                                                }
                                            </span>
                                            <h1 className="font-black text-sm leading-6">
                                                {selectedProduct.title}
                                            </h1>
                                            <div className="text-[11px] text-[#D6F39A] font-bold">
                                                {selectedProduct.author}
                                            </div>
                                            <div className="text-[10px] text-emerald-100/85">
                                                {selectedProduct.durationOrVolume} · امتیاز{' '}
                                                {faNum(selectedProduct.rating || '4.9')}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedProduct.inAppOnly && (
                                        <div className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-300/30 text-[11px] text-amber-200 flex items-center gap-2">
                                            <Lock className="w-4 h-4 shrink-0 text-amber-300" />
                                            <span>
                                                این محصول غیردانلودی است و صرفاً در کتاب‌خوان / پخش‌کننده امن درون اپلیکیشن باز می‌شود.
                                            </span>
                                        </div>
                                    )}

                                    <p className="text-xs text-emerald-100/90 leading-6">
                                        {selectedProduct.description || selectedProduct.summary}
                                    </p>

                                    {/* Action Buttons: Open In-App Reader/Player or Free Sample */}
                                    <div className="grid grid-cols-1 gap-2 pt-1">
                                        {selectedProduct.inAppOnly ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openInAppContent(selectedProduct.slug)
                                                }
                                                className="w-full py-3 rounded-2xl bg-[#D6F39A] text-[#123E30] font-black text-xs flex items-center justify-center gap-2 shadow"
                                            >
                                                {selectedProduct.deliveryType ===
                                                'in_app_podcast' ? (
                                                    <Headphones className="w-4 h-4" />
                                                ) : (
                                                    <BookOpen className="w-4 h-4" />
                                                )}
                                                <span>
                                                    {
                                                        resolveProductConsumptionMode(
                                                            selectedProduct
                                                        ).primaryCtaLabel
                                                    }
                                                </span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        !ownedProductSlugs.includes(
                                                            selectedProduct.slug
                                                        )
                                                    ) {
                                                        setOwnedProductSlugs((prev) => [
                                                            ...prev,
                                                            selectedProduct.slug,
                                                        ]);
                                                    }
                                                    showToast(
                                                        `سفارش «${selectedProduct.title}» ثبت شد.`
                                                    );
                                                }}
                                                className="w-full py-3 rounded-2xl bg-[#D6F39A] text-[#123E30] font-black text-xs flex items-center justify-center gap-2 shadow"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                <span>
                                                    ثبت سفارش نسخه چاپی (
                                                    {formatPrice(
                                                        selectedProduct.discount_price ||
                                                            selectedProduct.price
                                                    )}
                                                    )
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Product Features / Highlights */}
                                {selectedProduct.highlights && (
                                    <div
                                        className="rounded-[22px] border p-4 space-y-2.5"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <h3
                                            className="font-black text-xs"
                                            style={{ color: colors.text }}
                                        >
                                            ویژگی‌ها و امکانات این محصول در اپلیکیشن
                                        </h3>
                                        <div className="space-y-1.5">
                                            {selectedProduct.highlights.map((hl: string) => (
                                                <div
                                                    key={hl}
                                                    className="flex items-center gap-2 text-xs p-2 rounded-xl"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        color: colors.text,
                                                    }}
                                                >
                                                    <CheckCircle2
                                                        className="w-4 h-4 shrink-0"
                                                        style={{ color: colors.primary }}
                                                    />
                                                    <span>{hl}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Chapters / Episodes Preview List */}
                                {selectedProduct.chaptersOrEpisodes && (
                                    <div
                                        className="rounded-[22px] border p-4 space-y-2.5"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3
                                                className="font-black text-xs"
                                                style={{ color: colors.text }}
                                            >
                                                {selectedProduct.deliveryType === 'in_app_podcast'
                                                    ? 'فهرست اپیزودهای پادکست (پخش درون‌برنامه‌ای)'
                                                    : 'فهرست فصل‌های کتاب (مطالعه درون‌برنامه‌ای)'}
                                            </h3>
                                            <span
                                                className="text-[10px] font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                {faNum(
                                                    selectedProduct.chaptersOrEpisodes.length
                                                )}{' '}
                                                بخش
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {selectedProduct.chaptersOrEpisodes.map(
                                                (ch: any) => (
                                                    <div
                                                        key={ch.id}
                                                        className="p-3 rounded-2xl border flex items-center justify-between gap-2"
                                                        style={{
                                                            backgroundColor: colors.surfaceAlt,
                                                            borderColor: colors.border,
                                                        }}
                                                    >
                                                        <div className="min-w-0">
                                                            <div
                                                                className="font-bold text-xs truncate"
                                                                style={{ color: colors.text }}
                                                            >
                                                                {ch.title}
                                                            </div>
                                                            <div
                                                                className="text-[10px] mt-0.5 flex items-center gap-2"
                                                                style={{ color: colors.muted }}
                                                            >
                                                                <span>
                                                                    {ch.durationOrPages}
                                                                </span>
                                                                {ch.isFreeSample && (
                                                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 font-bold">
                                                                        پیش‌نمایش رایگان
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openInAppContent(
                                                                    selectedProduct.slug,
                                                                    ch.id
                                                                )
                                                            }
                                                            className="px-3 py-1.5 rounded-xl bg-[#153F31] text-white text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                                                        >
                                                            {selectedProduct.deliveryType ===
                                                            'in_app_podcast' ? (
                                                                <Play className="w-3 h-3 fill-current text-[#D6F39A]" />
                                                            ) : (
                                                                <BookOpen className="w-3 h-3 text-[#D6F39A]" />
                                                            )}
                                                            <span>باز کردن در اپ</span>
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ==================== IN-APP BOOK READER SCREEN (کتاب‌خوان درون‌برنامه‌ای غیردانلودی) ==================== */}
                        {activeScreen === 'inAppReader' && (
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('productDetail')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold"
                                        style={{ color: colors.primary }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        <span>بازگشت به معرفی کتاب</span>
                                    </button>
                                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 text-[10px] font-black inline-flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        <span>نسخه غیردانلودی · فقط مطالعه در اپ</span>
                                    </span>
                                </div>

                                {/* Reader Controls Bar */}
                                <div
                                    className="rounded-2xl border p-3 flex items-center justify-between gap-2"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className="text-[11px] font-bold"
                                            style={{ color: colors.muted }}
                                        >
                                            اندازه قلم:
                                        </span>
                                        {(['sm', 'md', 'lg'] as const).map((sz) => (
                                            <button
                                                key={sz}
                                                type="button"
                                                onClick={() => setReaderFontSize(sz)}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${
                                                    readerFontSize === sz
                                                        ? 'bg-[#153F31] text-white'
                                                        : 'bg-stone-200/70 text-stone-700'
                                                }`}
                                            >
                                                {sz === 'sm'
                                                    ? 'کوچک'
                                                    : sz === 'md'
                                                    ? 'متوسط'
                                                    : 'بزرگ'}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {(
                                            [
                                                { id: 'light', label: 'روشن' },
                                                { id: 'sepia', label: 'کاغذی' },
                                                { id: 'dark', label: 'شب' },
                                            ] as const
                                        ).map((th) => (
                                            <button
                                                key={th.id}
                                                type="button"
                                                onClick={() => setReaderTheme(th.id)}
                                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                                                    readerTheme === th.id
                                                        ? 'border-[#153F31] font-black'
                                                        : 'border-transparent opacity-70'
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        th.id === 'sepia'
                                                            ? '#F6EFE2'
                                                            : th.id === 'dark'
                                                            ? '#18221D'
                                                            : '#FFFFFF',
                                                    color:
                                                        th.id === 'dark' ? '#F3F6F4' : '#13241D',
                                                }}
                                            >
                                                {th.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chapter Selector */}
                                {selectedProduct.chaptersOrEpisodes && (
                                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                                        {selectedProduct.chaptersOrEpisodes.map((ch: any) => {
                                            const active =
                                                (activeChapterOrEpisode?.id || 101) === ch.id;
                                            return (
                                                <button
                                                    key={ch.id}
                                                    type="button"
                                                    onClick={() => setSelectedChapterId(ch.id)}
                                                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 border transition"
                                                    style={{
                                                        backgroundColor: active
                                                            ? colors.primary
                                                            : colors.surface,
                                                        color: active
                                                            ? '#FFFFFF'
                                                            : colors.text,
                                                        borderColor: active
                                                            ? colors.primary
                                                            : colors.border,
                                                    }}
                                                >
                                                    {ch.title}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Reading Canvas */}
                                <div
                                    className="rounded-[26px] border p-5 space-y-3 shadow-inner"
                                    style={{
                                        backgroundColor:
                                            readerTheme === 'sepia'
                                                ? '#F8F1E3'
                                                : readerTheme === 'dark'
                                                ? '#14201B'
                                                : '#FFFFFF',
                                        borderColor: colors.border,
                                        color:
                                            readerTheme === 'dark' ? '#E8F0EC' : '#1F2924',
                                    }}
                                >
                                    <div className="flex items-center justify-between border-b pb-2.5 border-stone-300/40">
                                        <div>
                                            <div className="text-[10px] font-bold opacity-75">
                                                {selectedProduct.title}
                                            </div>
                                            <h2 className="font-black text-sm mt-0.5">
                                                {activeChapterOrEpisode?.title ||
                                                    'فصل اول: تفاوت علاقه زودگذر با استعداد ذاتی'}
                                            </h2>
                                        </div>
                                        <span className="text-[10px] font-bold opacity-75">
                                            {activeChapterOrEpisode?.durationOrPages ||
                                                '۳۴ صفحه'}
                                        </span>
                                    </div>

                                    <p
                                        className={`leading-8 text-justify ${
                                            readerFontSize === 'sm'
                                                ? 'text-xs'
                                                : readerFontSize === 'lg'
                                                ? 'text-base'
                                                : 'text-sm'
                                        }`}
                                    >
                                        {activeChapterOrEpisode?.contentOrTranscript ||
                                            selectedProduct.description}
                                    </p>

                                    <p
                                        className={`leading-8 text-justify ${
                                            readerFontSize === 'sm'
                                                ? 'text-xs'
                                                : readerFontSize === 'lg'
                                                ? 'text-base'
                                                : 'text-sm'
                                        }`}
                                    >
                                        در ارزیابی‌های کارگاه «طراحی آینده نوجوان»، ما به جای تمرکز صرف بر نمره درسی، سه لایه اصلی یعنی «استعدادهای شناختی»، «انگیزش درونی» و «مهارت‌های اجرایی» را در موقعیت‌های واقعی می‌سنجیم. هر نوجوان زمانی که در مسیر استعداد طبیعی خود قرار می‌گیرد، یادگیری را با انرژی مضاعف تجربه می‌کند.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ==================== IN-APP PODCAST AUDIO PLAYER SCREEN (پخش‌کننده صوتی درون‌برنامه‌ای غیردانلودی) ==================== */}
                        {activeScreen === 'inAppAudioPlayer' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('productDetail')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold"
                                        style={{ color: colors.primary }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        <span>بازگشت به معرفی پادکست</span>
                                    </button>
                                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 text-[10px] font-black inline-flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        <span>پخش امن درون‌برنامه‌ای (غیردانلودی)</span>
                                    </span>
                                </div>

                                <div className="rounded-[28px] bg-gradient-to-br from-[#10382B] via-[#153F31] to-[#0B231B] text-white p-5 space-y-4 border border-amber-400/40 shadow-xl">
                                    <div className="flex items-center gap-3.5">
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.title}
                                            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D6F39A]/60 shrink-0"
                                        />
                                        <div className="space-y-1 min-w-0">
                                            <span className="text-[10px] text-[#D6F39A] font-bold">
                                                پادکست اختصاصی آکادمی رشد
                                            </span>
                                            <h2 className="font-black text-sm leading-6">
                                                {activeChapterOrEpisode?.title ||
                                                    selectedProduct.title}
                                            </h2>
                                            <div className="text-[11px] text-emerald-100/80">
                                                {selectedProduct.author} ·{' '}
                                                {activeChapterOrEpisode?.durationOrPages ||
                                                    '۲۸ دقیقه'}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-emerald-100/90 leading-6 bg-black/20 p-3 rounded-2xl">
                                        {activeChapterOrEpisode?.contentOrTranscript ||
                                            selectedProduct.summary}
                                    </p>

                                    {/* Audio Progress Bar */}
                                    <div className="space-y-1.5">
                                        <input
                                            type="range"
                                            aria-label="نوار زمان پادکست"
                                            min={0}
                                            max={100}
                                            value={audioProgress}
                                            onChange={(e) =>
                                                setAudioProgress(Number(e.target.value))
                                            }
                                            className="w-full accent-[#D6F39A] cursor-pointer"
                                        />
                                        <div className="flex items-center justify-between text-[10px] text-emerald-100/80">
                                            <span>{faNum(audioProgress)}٪ پخش‌شده</span>
                                            <span>
                                                {activeChapterOrEpisode?.durationOrPages ||
                                                    '۲۸ دقیقه'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Play/Pause & Speed Controls */}
                                    <div className="flex items-center justify-between pt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextSpeed =
                                                    audioSpeed === 1
                                                        ? 1.25
                                                        : audioSpeed === 1.25
                                                        ? 1.5
                                                        : audioSpeed === 1.5
                                                        ? 2
                                                        : 1;
                                                setAudioSpeed(nextSpeed);
                                            }}
                                            className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-black text-[#D6F39A]"
                                        >
                                            سرعت {faNum(audioSpeed)}x
                                        </button>

                                        <button
                                            type="button"
                                            aria-label={
                                                audioPlaying ? 'توقف پادکست' : 'پخش پادکست'
                                            }
                                            onClick={() => setAudioPlaying((prev) => !prev)}
                                            className="w-14 h-14 rounded-full bg-[#D6F39A] text-[#123E30] flex items-center justify-center shadow-lg"
                                        >
                                            {audioPlaying ? (
                                                <Pause className="w-6 h-6 fill-current" />
                                            ) : (
                                                <Play className="w-6 h-6 fill-current" />
                                            )}
                                        </button>

                                        <span className="text-[11px] text-emerald-100/85 inline-flex items-center gap-1">
                                            <Volume2 className="w-4 h-4 text-[#D6F39A]" />
                                            <span>کیفیت بالا</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Other Episodes List */}
                                {selectedProduct.chaptersOrEpisodes && (
                                    <div
                                        className="rounded-[22px] border p-4 space-y-2"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div
                                            className="font-black text-xs mb-1"
                                            style={{ color: colors.text }}
                                        >
                                            سایر اپیزودهای این مجموعه
                                        </div>
                                        {selectedProduct.chaptersOrEpisodes.map((ep: any) => {
                                            const active =
                                                (activeChapterOrEpisode?.id || 201) === ep.id;
                                            return (
                                                <button
                                                    key={ep.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedChapterId(ep.id);
                                                        setAudioPlaying(true);
                                                    }}
                                                    className="w-full p-3 rounded-xl border flex items-center justify-between text-right text-xs transition"
                                                    style={{
                                                        backgroundColor: active
                                                            ? colors.primarySoft
                                                            : colors.surfaceAlt,
                                                        borderColor: active
                                                            ? colors.primary
                                                            : colors.border,
                                                        color: colors.text,
                                                    }}
                                                >
                                                    <span className="font-bold truncate">
                                                        {ep.title}
                                                    </span>
                                                    <span
                                                        className="text-[10px] shrink-0"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        {ep.durationOrPages}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* ==================== DASHBOARD SCREEN (رشد من — مرکز دوره‌ها، آیتم‌های مدرسین، گفتگوها و کتابخانه درون‌برنامه‌ای) ==================== */}
                        {activeScreen === 'dashboard' && (
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div
                                            className="text-[12px] font-bold"
                                            style={{ color: colors.muted }}
                                        >
                                            میز کار آموزشی و رشد تو
                                        </div>
                                        <h1
                                            className="font-black text-[20px]"
                                            style={{ color: colors.text }}
                                        >
                                            رشد من · {userProfile.name}
                                        </h1>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('profile')}
                                        className="px-3 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                            color: colors.text,
                                        }}
                                    >
                                        <User className="w-4 h-4" style={{ color: colors.primary }} />
                                        <span>کارنامه و حساب من</span>
                                    </button>
                                </div>

                                {/* 1. ACTIVE COURSE HERO + POSTER & PROGRESS */}
                                <div className="rounded-[26px] bg-gradient-to-br from-[#0F382A] via-[#154534] to-[#1D5944] p-4 text-white space-y-3.5 border border-emerald-500/25">
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-20 h-26 rounded-2xl overflow-hidden border border-white/20 shrink-0 relative bg-[#0B291F]">
                                            <img
                                                src={mockCourses[0].poster || mockCourses[0].thumbnail}
                                                alt={vipConfig.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute bottom-1 right-1 left-1 text-center px-1 py-0.5 rounded bg-amber-400 text-[#0D2E22] text-[8px] font-black truncate">
                                                پوستر دوره
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1.5">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-[#0D2E22] text-[10px] font-black">
                                                    دوره فعال VIP
                                                </span>
                                                <span className="text-[11px] text-[#D4F095] font-bold">
                                                    {faNum(courseItems.length)} آیتم و مدرس تخصصی
                                                </span>
                                            </div>
                                            <h2 className="font-black text-sm leading-6 text-white">
                                                {vipConfig.title}
                                            </h2>
                                            <p className="text-[11px] text-emerald-100/85">
                                                کلاس بعدی: سه‌شنبه ۱۷:۰۰ · کارگاه عملی تصمیم‌گیری
                                            </p>
                                            <div className="pt-1 flex items-center gap-2 flex-wrap">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveScreen('vipClub')}
                                                    className="px-3 py-1.5 rounded-xl bg-[#D4F095] text-[#103F32] font-black text-[11px] inline-flex items-center gap-1"
                                                >
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                    <span>ورود به باشگاه دوره</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openCourse(mockCourses[0].slug)}
                                                    className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-[11px]"
                                                >
                                                    سرفصل‌ها
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/15 pt-3 flex items-center justify-between gap-3">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between text-[11px] text-emerald-100">
                                                <span>پیشرفت کل آیتم‌های دوره</span>
                                                <span className="font-black text-[#D4F095]">
                                                    {faNum(64)}٪ ({faNum(145)} دقیقه این هفته)
                                                </span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
                                                <div
                                                    className="h-full bg-[#D4F095] rounded-full"
                                                    style={{ width: '64%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 1.5. ONLINE WEBINARS & LIVE CLASSES HUB IN MY GROWTH (ورود مستقیم به اسکای‌روم، گوگل میت و ادوبی کانکت) */}
                                <div
                                    className="rounded-[24px] border p-4 space-y-3"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-8 h-8 rounded-xl flex items-center justify-center relative"
                                                style={{
                                                    backgroundColor: isDark
                                                        ? 'rgba(52, 211, 153, 0.16)'
                                                        : '#D1FAE5',
                                                    color: isDark ? '#34D399' : '#047857',
                                                }}
                                            >
                                                <Video className="w-4 h-4" />
                                                <span className="w-2 h-2 rounded-full bg-rose-500 -top-0.5 -right-0.5 absolute" />
                                            </span>
                                            <div>
                                                <h3
                                                    className="font-black text-sm"
                                                    style={{ color: colors.text }}
                                                >
                                                    وبینارها و کلاس‌های آنلاین
                                                </h3>
                                                <p
                                                    className="text-[10px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    ورود مستقیم به اسکای‌روم، گوگل میت و ادوبی کانکت
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('sessions')}
                                            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1"
                                            style={{
                                                backgroundColor: colors.primarySoft,
                                                color: colors.primary,
                                            }}
                                        >
                                            <span>همه لینک‌ها ({faNum(onlineWebinars.length)})</span>
                                            <ArrowLeft className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="space-y-2.5">
                                        {onlineWebinars.slice(0, 2).map((wb) => {
                                            const isSkyroom = wb.platform === 'skyroom';
                                            const isLive = wb.status === 'live';
                                            return (
                                                <div
                                                    key={wb.id}
                                                    className="p-3 rounded-2xl border space-y-2"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: isLive
                                                            ? isDark
                                                                ? 'rgba(52, 211, 153, 0.45)'
                                                                : '#6EE7B7'
                                                            : colors.border,
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span
                                                            className="px-2 py-0.5 rounded-lg text-[10px] font-black"
                                                            style={{
                                                                backgroundColor: isSkyroom
                                                                    ? isDark
                                                                        ? 'rgba(56, 189, 248, 0.20)'
                                                                        : '#E0F2FE'
                                                                    : isDark
                                                                    ? 'rgba(52, 211, 153, 0.20)'
                                                                    : '#DCFCE7',
                                                                color: isSkyroom
                                                                    ? isDark
                                                                        ? '#7DD3FC'
                                                                        : '#0369A1'
                                                                    : isDark
                                                                    ? '#6EE7B7'
                                                                    : '#15803D',
                                                            }}
                                                        >
                                                            {wb.platformLabel}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-[9px] font-black inline-flex items-center gap-1 ${
                                                                isLive
                                                                    ? 'bg-rose-500/15 text-rose-500'
                                                                    : 'bg-amber-500/15 text-amber-600'
                                                            }`}
                                                        >
                                                            {isLive && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                            )}
                                                            <span>
                                                                {isLive
                                                                    ? `در حال برگزاری · ${faNum(wb.participantsCount)} حاضر`
                                                                    : 'کلاس پیش‌رو'}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <div
                                                            className="font-black text-xs leading-5"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {wb.title}
                                                        </div>
                                                        <div
                                                            className="text-[10px] mt-0.5"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {wb.instructor} · {wb.date} ({wb.time})
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveWebinarGatewayId(wb.id);
                                                                setActiveScreen('sessions');
                                                            }}
                                                            className="flex-1 py-2 rounded-xl bg-[#153F31] text-white text-[11px] font-black inline-flex items-center justify-center gap-1.5"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5 text-[#D4F095]" />
                                                            <span>
                                                                ورود به {isSkyroom ? 'اسکای‌روم' : 'کلاس آنلاین'}
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCopyWebinarLink(
                                                                    wb.id,
                                                                    wb.link,
                                                                    wb.title
                                                                )
                                                            }
                                                            className="px-3 py-2 rounded-xl border text-[11px] font-bold inline-flex items-center gap-1"
                                                            style={{
                                                                backgroundColor: colors.surface,
                                                                borderColor: colors.border,
                                                                color: colors.text,
                                                            }}
                                                        >
                                                            {copiedWebinarId === wb.id ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                                    <span>کپی شد</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                    <span>کپی لینک</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2. QUICK COMMUNICATION HUB (گروه تخصصی دوره، چت مدرسین آیتم‌ها، پشتیبانی کلی) */}
                                <div
                                    className="rounded-[24px] border p-4 space-y-3"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare
                                                className="w-4 h-4"
                                                style={{ color: colors.primary }}
                                            />
                                            <h3
                                                className="font-black text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                مرکز گفتگو و ارتباطات دوره
                                            </h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('chat')}
                                            className="text-[11px] font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            مشاهده همه چت‌ها
                                        </button>
                                    </div>

                                    {/* Group & Support Row */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => openCourseGroupChat()}
                                            className="p-3 rounded-2xl border text-right space-y-1 transition hover:opacity-95"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <Users
                                                    className="w-4 h-4"
                                                    style={{ color: colors.primary }}
                                                />
                                                <span
                                                    className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                                                        groupChatEnabled
                                                            ? 'bg-emerald-500/15 text-emerald-600'
                                                            : 'bg-amber-500/15 text-amber-600'
                                                    }`}
                                                >
                                                    {groupChatEnabled ? 'گروه فعال' : 'قفل توسط ادمین'}
                                                </span>
                                            </div>
                                            <div
                                                className="font-black text-xs pt-0.5"
                                                style={{ color: colors.text }}
                                            >
                                                گروه تخصصی دوره
                                            </div>
                                            <div
                                                className="text-[10px] truncate"
                                                style={{ color: colors.muted }}
                                            >
                                                گفتگوی تمام اعضای دوره
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openCourseSupportChat()}
                                            className="p-3 rounded-2xl border text-right space-y-1 transition hover:opacity-95"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <Headphones
                                                    className="w-4 h-4"
                                                    style={{ color: colors.primary }}
                                                />
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-sky-500/15 text-sky-600">
                                                    پاسخگویی سریع
                                                </span>
                                            </div>
                                            <div
                                                className="font-black text-xs pt-0.5"
                                                style={{ color: colors.text }}
                                            >
                                                پشتیبانی کلی دوره
                                            </div>
                                            <div
                                                className="text-[10px] truncate"
                                                style={{ color: colors.muted }}
                                            >
                                                هماهنگی کلاس‌ها و امور اجرایی
                                            </div>
                                        </button>
                                    </div>

                                    {/* Per-Item Instructor Private Chats */}
                                    <div className="pt-1 space-y-2">
                                        <div
                                            className="text-[11px] font-bold"
                                            style={{ color: colors.muted }}
                                        >
                                            چت خصوصی با مدرس هر آیتم دوره ({faNum(courseItems.length)} مدرس):
                                        </div>
                                        <div className="space-y-2">
                                            {courseItems.map((item) => (
                                                <div
                                                    key={item.itemId}
                                                    className="p-2.5 rounded-2xl border flex items-center justify-between gap-2"
                                                    style={{
                                                        backgroundColor: colors.bg,
                                                        borderColor: colors.border,
                                                    }}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span
                                                                className="px-1.5 py-0.5 rounded text-[9px] font-black"
                                                                style={{
                                                                    backgroundColor: colors.primarySoft,
                                                                    color: colors.primary,
                                                                }}
                                                            >
                                                                {item.deliveryMode}
                                                            </span>
                                                            <span
                                                                className="font-black text-xs truncate"
                                                                style={{ color: colors.text }}
                                                            >
                                                                {item.itemTitle}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="text-[11px] mt-0.5 truncate"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {item.instructorName} · {item.instructorRole}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => openItemInstructorChat(item.itemId)}
                                                        className="px-2.5 py-1.5 rounded-xl bg-[#153F31] text-white text-[10px] font-bold inline-flex items-center gap-1 shrink-0"
                                                    >
                                                        <MessageSquare className="w-3 h-3 text-[#D4F095]" />
                                                        <span>چت با مدرس</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. IN-APP LIBRARY (کتابخانه و پادکست‌های درون‌برنامه‌ای من — غیردانلودی) */}
                                <div
                                    className="rounded-[24px] border p-4 space-y-3"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BookOpen
                                                className="w-4 h-4"
                                                style={{ color: colors.primary }}
                                            />
                                            <h3
                                                className="font-black text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                کتابخانه و پادکست‌های درون‌برنامه‌ای من
                                            </h3>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600">
                                            پخش در اپلیکیشن
                                        </span>
                                    </div>
                                    <p
                                        className="text-[11px] leading-5"
                                        style={{ color: colors.muted }}
                                    >
                                        این کتاب‌ها و پادکست‌ها غیردانلودی هستند و مستقیماً داخل کتاب‌خوان و پخش‌کننده صوتی اپلیکیشن باز می‌شوند:
                                    </p>

                                    <div className="space-y-2.5">
                                        {mockProducts
                                            .filter((p) => p.inAppOnly)
                                            .map((prod) => {
                                                const isBook = prod.deliveryType === 'in_app_book';
                                                return (
                                                    <div
                                                        key={prod.slug}
                                                        className="p-3 rounded-2xl border flex items-center justify-between gap-3"
                                                        style={{
                                                            backgroundColor: colors.surfaceAlt,
                                                            borderColor: colors.border,
                                                        }}
                                                    >
                                                        <div
                                                            onClick={() => openProductDetail(prod.slug)}
                                                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                                                        >
                                                            <img
                                                                src={prod.image}
                                                                alt={prod.title}
                                                                className="w-11 h-14 rounded-xl object-cover shrink-0 border"
                                                                style={{ borderColor: colors.border }}
                                                            />
                                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                                <span className="text-[10px] font-bold text-amber-600 block">
                                                                    {isBook
                                                                        ? 'کتاب دیجیتال درون‌برنامه‌ای'
                                                                        : 'پادکست صوتی درون‌برنامه‌ای'}
                                                                </span>
                                                                <div
                                                                    className="font-black text-xs truncate"
                                                                    style={{ color: colors.text }}
                                                                >
                                                                    {prod.title}
                                                                </div>
                                                                <div
                                                                    className="text-[10px] truncate"
                                                                    style={{ color: colors.muted }}
                                                                >
                                                                    {prod.author} · {prod.durationOrVolume}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5 shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openInAppContent(prod.slug)
                                                                }
                                                                className="px-2.5 py-1.5 rounded-xl bg-[#153F31] text-white text-[10px] font-bold inline-flex items-center gap-1"
                                                            >
                                                                {isBook ? (
                                                                    <>
                                                                        <BookOpen className="w-3 h-3 text-[#D4F095]" />
                                                                        <span>مطالعه در اپ</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Headphones className="w-3 h-3 text-[#D4F095]" />
                                                                        <span>پخش در اپ</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openProductDetail(prod.slug)}
                                                                className="text-[10px] font-bold text-center"
                                                                style={{ color: colors.primary }}
                                                            >
                                                                صفحه معرفی
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>

                                {/* 4. GOALS & COMPANION TOOLS */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('goals')}
                                        className="p-3.5 rounded-[20px] border text-right space-y-1 transition hover:opacity-95"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <Flag className="w-5 h-5" style={{ color: colors.primary }} />
                                        <div
                                            className="font-black text-xs pt-1"
                                            style={{ color: colors.text }}
                                        >
                                            اهداف ۹۰ روزه و تمرین‌ها
                                        </div>
                                        <div
                                            className="text-[11px]"
                                            style={{ color: colors.muted }}
                                        >
                                            {faNum(75)}٪ پیشرفت پروژه‌ها
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('reminders')}
                                        className="p-3.5 rounded-[20px] border text-right space-y-1 transition hover:opacity-95"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <Bell className="w-5 h-5" style={{ color: colors.primary }} />
                                        <div
                                            className="font-black text-xs pt-1"
                                            style={{ color: colors.text }}
                                        >
                                            یادآور کلاس‌ها
                                        </div>
                                        <div
                                            className="text-[11px]"
                                            style={{ color: colors.muted }}
                                        >
                                            تنظیم هشدارهای برنامه
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ==================== ONLINE WEBINARS & LIVE CLASSES HUB (وبینارها و کلاس‌های آنلاین — اسکای‌روم، گوگل میت، ادوبی کانکت) ==================== */}
                        {activeScreen === 'sessions' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('dashboard')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold"
                                        style={{ color: colors.primary }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        <span>بازگشت به رشد من</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('home')}
                                        className="text-[11px] font-bold"
                                        style={{ color: colors.muted }}
                                    >
                                        صفحه خانه
                                    </button>
                                </div>

                                {/* Hero Banner for Online Webinars & Classes */}
                                <div
                                    className="rounded-[26px] p-4 text-white space-y-3 border relative overflow-hidden"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #0D3327 0%, #144937 55%, #0F3847 100%)',
                                        borderColor: 'rgba(154, 217, 105, 0.30)',
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/25 border border-rose-400/40 text-rose-200 text-[10px] font-black">
                                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                                <span>درگاه مستقیم کلاس‌های آنلاین و وبینارها</span>
                                            </div>
                                            <h1 className="font-black text-base text-white pt-0.5">
                                                وبینارها و کلاس‌های آنلاین رشد
                                            </h1>
                                            <p className="text-[11px] text-emerald-100/85 leading-5">
                                                از این بخش می‌توانید مستقیماً وارد اتاق‌های اسکای‌روم (Skyroom)، گوگل میت (Google Meet) و ادوبی کانکت شوید یا لینک هر جلسه را کپی کنید.
                                            </p>
                                        </div>
                                        <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                            <Video className="w-5 h-5 text-[#D6F39A]" />
                                        </div>
                                    </div>

                                    {/* Supported Platforms Quick Badges */}
                                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                        {[
                                            { label: 'Skyroom · اسکای‌روم', color: '#7DD3FC' },
                                            { label: 'Google Meet · گوگل میت', color: '#6EE7B7' },
                                            { label: 'Adobe Connect · ادوبی کانکت', color: '#FCD34D' },
                                            { label: 'BigBlueButton · بیگ‌بلوباتن', color: '#C4B5FD' },
                                        ].map((pl) => (
                                            <span
                                                key={pl.label}
                                                className="px-2 py-1 rounded-lg bg-black/25 border border-white/10 text-[9px] font-bold"
                                                style={{ color: pl.color }}
                                            >
                                                {pl.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Platform & Status Filter Tabs */}
                                <div className="flex gap-1.5 overflow-x-auto pb-1">
                                    {(
                                        [
                                            { id: 'all', label: `همه (${faNum(onlineWebinars.length)})` },
                                            { id: 'live', label: 'در حال برگزاری' },
                                            { id: 'skyroom', label: 'اسکای‌روم (Skyroom)' },
                                            { id: 'google_meet', label: 'گوگل میت' },
                                            { id: 'other', label: 'ادوبی کانکت و سایر' },
                                        ] as const
                                    ).map((tab) => {
                                        const active = webinarFilter === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setWebinarFilter(tab.id)}
                                                className="px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 border transition"
                                                style={{
                                                    backgroundColor: active
                                                        ? colors.primary
                                                        : colors.surface,
                                                    color: active ? '#FFFFFF' : colors.text,
                                                    borderColor: active
                                                        ? colors.primary
                                                        : colors.border,
                                                }}
                                            >
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Active In-App Gateway / Room Launcher Modal Card (When user clicks a webinar) */}
                                {activeWebinarGatewayId !== null && (() => {
                                    const selectedWb =
                                        onlineWebinars.find((w) => w.id === activeWebinarGatewayId) ||
                                        onlineWebinars[0];
                                    return (
                                        <div
                                            className="rounded-[24px] p-4 border-2 space-y-3 relative"
                                            style={{
                                                background: isDark
                                                    ? 'linear-gradient(145deg, #102B22 0%, #0D2129 100%)'
                                                    : 'linear-gradient(145deg, #F0FDF4 0%, #E0F2FE 100%)',
                                                borderColor: isDark ? '#34D399' : '#10B981',
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black">
                                                        درگاه اتصال به {selectedWb.platformLabel}
                                                    </span>
                                                    <h3
                                                        className="font-black text-sm mt-1"
                                                        style={{ color: colors.text }}
                                                    >
                                                        {selectedWb.title}
                                                    </h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveWebinarGatewayId(null)}
                                                    className="p-1 rounded-lg border"
                                                    style={{
                                                        backgroundColor: colors.surface,
                                                        borderColor: colors.border,
                                                        color: colors.muted,
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div
                                                className="p-3 rounded-2xl border space-y-2 text-xs"
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span style={{ color: colors.muted }}>
                                                        نام کاربری پیشنهادی ورود:
                                                    </span>
                                                    <span
                                                        className="font-black"
                                                        style={{ color: colors.text }}
                                                    >
                                                        {userProfile.name} ({faNum(userProfile.phone)})
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span style={{ color: colors.muted }}>
                                                        کد اتاق / شناسه جلسه:
                                                    </span>
                                                    <span
                                                        className="font-mono font-black px-2 py-0.5 rounded bg-amber-500/15 text-amber-600"
                                                    >
                                                        {selectedWb.roomCode}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 pt-1 border-t" style={{ borderColor: colors.border }}>
                                                    <span className="text-[10px] truncate" dir="ltr" style={{ color: colors.muted }}>
                                                        {selectedWb.link}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCopyWebinarLink(
                                                                selectedWb.id,
                                                                selectedWb.link,
                                                                selectedWb.title
                                                            )
                                                        }
                                                        className="text-[10px] font-black shrink-0"
                                                        style={{ color: colors.primary }}
                                                    >
                                                        کپی آدرس
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <a
                                                    href={selectedWb.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        showToast(
                                                            `در حال باز کردن ${selectedWb.platformLabel} برای «${selectedWb.title}»...`
                                                        );
                                                    }}
                                                    className="py-2.5 px-3 rounded-xl bg-[#153F31] text-[#D6F39A] font-black text-xs inline-flex items-center justify-center gap-1.5"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    <span>ورود مستقیم به لینک</span>
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopyWebinarLink(
                                                            selectedWb.id,
                                                            selectedWb.link,
                                                            selectedWb.title
                                                        )
                                                    }
                                                    className="py-2.5 px-3 rounded-xl border font-bold text-xs inline-flex items-center justify-center gap-1.5"
                                                    style={{
                                                        backgroundColor: colors.surface,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>کپی لینک برای مرورگر</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Webinars & Online Classes List */}
                                <div className="space-y-3">
                                    {onlineWebinars
                                        .filter((wb) => {
                                            if (webinarFilter === 'live') return wb.status === 'live';
                                            if (webinarFilter === 'skyroom') return wb.platform === 'skyroom';
                                            if (webinarFilter === 'google_meet')
                                                return wb.platform === 'google_meet';
                                            if (webinarFilter === 'other')
                                                return (
                                                    wb.platform === 'adobe_connect' ||
                                                    wb.platform === 'bigbluebutton'
                                                );
                                            return true;
                                        })
                                        .map((wb) => {
                                            const isSkyroom = wb.platform === 'skyroom';
                                            const isMeet = wb.platform === 'google_meet';
                                            const isLive = wb.status === 'live';
                                            return (
                                                <div
                                                    key={wb.id}
                                                    className="rounded-[22px] border p-4 space-y-3 transition"
                                                    style={{
                                                        backgroundColor: colors.surface,
                                                        borderColor: isLive
                                                            ? isDark
                                                                ? 'rgba(52, 211, 153, 0.45)'
                                                                : '#34D399'
                                                            : colors.border,
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                                        <div className="flex items-center gap-1.5">
                                                            <span
                                                                className="px-2.5 py-1 rounded-xl text-[10px] font-black"
                                                                style={{
                                                                    backgroundColor: isSkyroom
                                                                        ? isDark
                                                                            ? 'rgba(56, 189, 248, 0.18)'
                                                                            : '#E0F2FE'
                                                                        : isMeet
                                                                        ? isDark
                                                                            ? 'rgba(52, 211, 153, 0.18)'
                                                                            : '#DCFCE7'
                                                                        : isDark
                                                                        ? 'rgba(251, 191, 36, 0.18)'
                                                                        : '#FEF3C7',
                                                                    color: isSkyroom
                                                                        ? isDark
                                                                            ? '#38BDF8'
                                                                            : '#0369A1'
                                                                        : isMeet
                                                                        ? isDark
                                                                            ? '#34D399'
                                                                            : '#15803D'
                                                                        : isDark
                                                                        ? '#FBBF24'
                                                                        : '#B45309',
                                                                }}
                                                            >
                                                                {wb.platformLabel}
                                                            </span>
                                                            {wb.isVipOnly && (
                                                                <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-500 text-[9px] font-black inline-flex items-center gap-1">
                                                                    <Crown className="w-2.5 h-2.5" />
                                                                    <span>ویژه دوره VIP</span>
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span
                                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${
                                                                isLive
                                                                    ? 'bg-rose-500/15 text-rose-500'
                                                                    : wb.status === 'upcoming'
                                                                    ? 'bg-emerald-500/15 text-emerald-600'
                                                                    : 'bg-stone-500/15 text-stone-500'
                                                            }`}
                                                        >
                                                            {isLive && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                            )}
                                                            <span>
                                                                {isLive
                                                                    ? `زنده · ${faNum(wb.participantsCount)} نفر آنلاین`
                                                                    : wb.status === 'upcoming'
                                                                    ? 'در انتظار برگزاری'
                                                                    : 'ضبط‌شده (بازپخش)'}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h2
                                                            className="font-black text-sm leading-6"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {wb.title}
                                                        </h2>
                                                        <div
                                                            className="text-xs font-medium"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {wb.instructor}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="p-2.5 rounded-2xl border space-y-1.5 text-[11px]"
                                                        style={{
                                                            backgroundColor: colors.surfaceAlt,
                                                            borderColor: colors.border,
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span
                                                                className="inline-flex items-center gap-1 font-bold"
                                                                style={{ color: colors.text }}
                                                            >
                                                                <Calendar className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                                                                <span>{wb.date}</span>
                                                            </span>
                                                            <span
                                                                className="inline-flex items-center gap-1 font-bold"
                                                                style={{ color: colors.muted }}
                                                            >
                                                                <Clock className="w-3.5 h-3.5" />
                                                                <span>{wb.time}</span>
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="text-[10px] pt-1 border-t flex items-center justify-between gap-2"
                                                            style={{
                                                                borderColor: colors.border,
                                                                color: colors.muted,
                                                            }}
                                                        >
                                                            <span>{wb.accessHint}</span>
                                                            <span className="font-mono font-bold text-[10px]" style={{ color: colors.primary }}>
                                                                {wb.roomCode}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Link Preview & Direct Entry Buttons */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveWebinarGatewayId(wb.id);
                                                                showToast(
                                                                    `درگاه ورود به «${wb.platformLabel}» آماده شد.`
                                                                );
                                                            }}
                                                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#153F31] text-white font-black text-xs inline-flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99] transition"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5 text-[#D6F39A]" />
                                                            <span>
                                                                ورود به {isSkyroom ? 'اسکای‌روم' : isMeet ? 'گوگل میت' : 'اتاق آنلاین'}
                                                            </span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCopyWebinarLink(
                                                                    wb.id,
                                                                    wb.link,
                                                                    wb.title
                                                                )
                                                            }
                                                            className="py-2.5 px-3 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
                                                            style={{
                                                                backgroundColor: colors.surfaceAlt,
                                                                borderColor: colors.border,
                                                                color: colors.text,
                                                            }}
                                                        >
                                                            {copiedWebinarId === wb.id ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                                    <span>کپی شد</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                    <span>کپی لینک</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                {/* Add New Online Class / Webinar Link Box (For Instructor / Admin or Testing) */}
                                <div
                                    className="rounded-[24px] border p-4 space-y-3"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" style={{ color: colors.primary }} />
                                            <h3
                                                className="font-black text-xs"
                                                style={{ color: colors.text }}
                                            >
                                                افزودن لینک وبینار یا کلاس آنلاین جدید (پنل مدرس / ادمین)
                                            </h3>
                                        </div>
                                        <span
                                            className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                                            style={{
                                                backgroundColor: colors.primarySoft,
                                                color: colors.primary,
                                            }}
                                        >
                                            اسکای‌روم و سایر پلتفرم‌ها
                                        </span>
                                    </div>

                                    <div className="space-y-2.5">
                                        <input
                                            type="text"
                                            value={newWebinarTitle}
                                            onChange={(e) => setNewWebinarTitle(e.target.value)}
                                            placeholder="عنوان وبینار یا کلاس آنلاین (مثلاً: کارگاه آنلاین اسکای‌روم فصل ۳)..."
                                            className="w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />

                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                value={newWebinarPlatform}
                                                onChange={(e) =>
                                                    setNewWebinarPlatform(
                                                        e.target.value as
                                                            | 'skyroom'
                                                            | 'google_meet'
                                                            | 'adobe_connect'
                                                            | 'bigbluebutton'
                                                    )
                                                }
                                                className="rounded-xl border px-2.5 py-2 text-xs font-bold outline-none"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            >
                                                <option value="skyroom">اسکای‌روم (Skyroom)</option>
                                                <option value="google_meet">گوگل میت (Google Meet)</option>
                                                <option value="adobe_connect">ادوبی کانکت (Adobe Connect)</option>
                                                <option value="bigbluebutton">بیگ‌بلوباتن (BigBlueButton)</option>
                                            </select>

                                            <input
                                                type="text"
                                                value={newWebinarInstructor}
                                                onChange={(e) => setNewWebinarInstructor(e.target.value)}
                                                placeholder="نام مدرس وبینار..."
                                                className="rounded-xl border px-3 py-2 text-xs font-bold outline-none"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            />
                                        </div>

                                        <input
                                            type="url"
                                            dir="ltr"
                                            value={newWebinarLink}
                                            onChange={(e) => setNewWebinarLink(e.target.value)}
                                            placeholder="https://www.skyroom.online/ch/roshd-academy/..."
                                            className="w-full rounded-xl border px-3 py-2 text-xs outline-none text-left"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />

                                        <input
                                            type="text"
                                            value={newWebinarDateTime}
                                            onChange={(e) => setNewWebinarDateTime(e.target.value)}
                                            placeholder="زمان برگزاری (مثلاً: پنج‌شنبه ۱۸ اردیبهشت · ساعت ۱۸:۰۰)"
                                            className="w-full rounded-xl border px-3 py-2 text-xs outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={handleAddWebinar}
                                            className="w-full py-2.5 rounded-xl bg-[#153F31] text-[#D6F39A] font-black text-xs inline-flex items-center justify-center gap-1.5"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>ثبت و انتشار لینک کلاس آنلاین</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeScreen === 'goals' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('dashboard')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold"
                                        style={{ color: colors.primary }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        <span>بازگشت به رشد من</span>
                                    </button>
                                    <Link
                                        href="/dashboard/goals"
                                        className="text-xs font-bold underline"
                                        style={{ color: colors.primary }}
                                    >
                                        مشاهده در پنل وب‌سایت
                                    </Link>
                                </div>

                                <div>
                                    <h1
                                        className="font-black text-xl"
                                        style={{ color: colors.text }}
                                    >
                                        بوم هدف‌گذاری ۹۰ روزه و گواهینامه‌ها
                                    </h1>
                                    <p
                                        className="text-xs mt-1"
                                        style={{ color: colors.muted }}
                                    >
                                        هدف‌های فصلی خود را ثبت کنید، گام‌های انجام‌شده را تیک بزنید و امتیاز رشد بگیرید
                                    </p>
                                </div>

                                {/* Add New Goal Interactive Form */}
                                <div
                                    className="rounded-[22px] border p-4 space-y-3"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center gap-2 font-black text-xs" style={{ color: colors.text }}>
                                        <Plus className="w-4 h-4" style={{ color: colors.primary }} />
                                        <span>تعریف هدف جدید در بوم ۹۰ روزه</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <input
                                            type="text"
                                            value={newGoalTitle}
                                            onChange={(e) => setNewGoalTitle(e.target.value)}
                                            placeholder="عنوان هدف (مثلاً: مطالعه روزانه ۲۰ دقیقه کتاب)..."
                                            className="sm:col-span-2 rounded-xl border px-3 py-2 text-xs outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={newGoalDueDate}
                                            onChange={(e) => setNewGoalDueDate(e.target.value)}
                                            placeholder="مهلت (مثلاً: ۳۱ خرداد ۱۴۰۴)"
                                            className="rounded-xl border px-3 py-2 text-xs outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span style={{ color: colors.muted }}>تعداد گام‌های اجرایی:</span>
                                            {[3, 5, 8, 10].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setNewGoalTasks(num)}
                                                    className="px-2.5 py-1 rounded-lg font-bold text-xs border"
                                                    style={{
                                                        backgroundColor:
                                                            newGoalTasks === num
                                                                ? colors.primary
                                                                : colors.surfaceAlt,
                                                        color:
                                                            newGoalTasks === num
                                                                ? '#FFFFFF'
                                                                : colors.text,
                                                        borderColor: colors.border,
                                                    }}
                                                >
                                                    {faNum(num)} گام
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!newGoalTitle.trim()) {
                                                    showToast('لطفاً عنوان هدف را وارد کنید.');
                                                    return;
                                                }
                                                updateAppState((prev) => ({
                                                    ...prev,
                                                    goals: addGoalToState(
                                                        prev.goals,
                                                        newGoalTitle,
                                                        newGoalCategory,
                                                        newGoalDueDate,
                                                        newGoalTasks
                                                    ),
                                                }));
                                                setNewGoalTitle('');
                                                showToast('هدف جدید به بوم ۹۰ روزه اضافه شد و با پنل سایت همگام گردید.');
                                            }}
                                            className="px-4 py-2 rounded-xl bg-[#153F31] text-white text-xs font-black inline-flex items-center gap-1.5"
                                        >
                                            <Plus className="w-3.5 h-3.5 text-[#D6F39A]" />
                                            <span>ثبت هدف جدید</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Goals List */}
                                <div className="space-y-3">
                                    {goals.map((goal) => {
                                        const pct = Math.round(
                                            (goal.completedTasks / Math.max(1, goal.totalTasks)) * 100
                                        );
                                        return (
                                            <div
                                                key={goal.id}
                                                className="rounded-[22px] border p-4 space-y-3"
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span
                                                                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                                                style={{
                                                                    backgroundColor: colors.primarySoft,
                                                                    color: colors.primary,
                                                                }}
                                                            >
                                                                {goal.category}
                                                            </span>
                                                            <span
                                                                className="text-[11px]"
                                                                style={{ color: colors.muted }}
                                                            >
                                                                مهلت: {goal.dueDate}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="font-black text-sm"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {goal.title}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                                                            goal.status === 'completed'
                                                                ? 'bg-emerald-500/15 text-emerald-700'
                                                                : 'bg-amber-500/15 text-amber-700'
                                                        }`}
                                                    >
                                                        {goal.status === 'completed'
                                                            ? 'تکمیل شده ✓'
                                                            : `${faNum(pct)}٪ پیشرفت`}
                                                    </span>
                                                </div>

                                                <div
                                                    className="h-2 rounded-full overflow-hidden"
                                                    style={{ backgroundColor: colors.surfaceAlt }}
                                                >
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${pct}%`,
                                                            backgroundColor: colors.primary,
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between gap-2 pt-1">
                                                    <span
                                                        className="text-xs font-bold"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        {faNum(goal.completedTasks)} از {faNum(goal.totalTasks)} گام انجام شده
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            disabled={goal.completedTasks >= goal.totalTasks}
                                                            onClick={() => {
                                                                updateAppState((prev) => ({
                                                                    ...prev,
                                                                    goals: advanceGoalTaskInState(
                                                                        prev.goals,
                                                                        goal.id,
                                                                        1
                                                                    ),
                                                                    userProfile: {
                                                                        ...prev.userProfile,
                                                                        xp: prev.userProfile.xp + 25,
                                                                    },
                                                                }));
                                                                showToast('یک گام از هدف تکمیل شد (+۲۵ امتیاز رشد)!');
                                                            }}
                                                            className="px-3 py-1.5 rounded-xl bg-[#153F31] text-white text-[11px] font-black disabled:opacity-40 inline-flex items-center gap-1"
                                                        >
                                                            <Check className="w-3.5 h-3.5 text-[#D6F39A]" />
                                                            <span>+۱ گام انجام شد</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                updateAppState((prev) => ({
                                                                    ...prev,
                                                                    goals: prev.goals.filter(
                                                                        (g) => g.id !== goal.id
                                                                    ),
                                                                }));
                                                                showToast('هدف از لیست حذف شد.');
                                                            }}
                                                            className="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold"
                                                            style={{
                                                                borderColor: colors.border,
                                                                color: colors.muted,
                                                            }}
                                                        >
                                                            حذف
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeScreen === 'reminders' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('dashboard')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold"
                                        style={{ color: colors.primary }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        <span>بازگشت به رشد من</span>
                                    </button>
                                    <Link
                                        href="/dashboard/reminders"
                                        className="text-xs font-bold underline"
                                        style={{ color: colors.primary }}
                                    >
                                        مشاهده در پنل وب‌سایت
                                    </Link>
                                </div>

                                <div>
                                    <h1
                                        className="font-black text-xl"
                                        style={{ color: colors.text }}
                                    >
                                        یادآوری‌های هوشمند کلاس‌ها و پیامک
                                    </h1>
                                    <p
                                        className="text-xs mt-1"
                                        style={{ color: colors.muted }}
                                    >
                                        تنظیم یادآورهای پیامکی و درون‌برنامه‌ای برای کلاس‌ها، وبینارها و تمرین‌های روزانه
                                    </p>
                                </div>

                                {/* Add New Smart Reminder Form */}
                                <div
                                    className="rounded-[22px] border p-4 space-y-3"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="font-black text-xs flex items-center gap-1.5"
                                            style={{ color: colors.text }}
                                        >
                                            <Bell className="w-4 h-4" style={{ color: colors.primary }} />
                                            <span>افزودن یادآور هوشمند جدید</span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const logItem = {
                                                    id: Date.now(),
                                                    title: 'پیامک تست یادآوری جلسه و برنامه هفتگی رشد',
                                                    recipient: `${faNum(userProfile.phone)} و والدین (${faNum(userProfile.parentPhone)})`,
                                                    sentAt: 'هم‌اکنون · تحویل فوری',
                                                    channel: 'sms' as const,
                                                    status: 'delivered' as const,
                                                };
                                                updateAppState((prev) => ({
                                                    ...prev,
                                                    reminderLogs: [logItem, ...prev.reminderLogs],
                                                }));
                                                showToast('پیامک تست یادآوری با موفقیت ارسال و در تاریخچه ثبت شد.');
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-800 text-[11px] font-black"
                                        >
                                            ارسال پیامک تست آنی
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <input
                                            type="text"
                                            value={newReminderTitle}
                                            onChange={(e) => setNewReminderTitle(e.target.value)}
                                            placeholder="عنوان یادآوری (مثلاً: مرور بوم هدف‌گذاری)..."
                                            className="sm:col-span-2 rounded-xl border px-3 py-2 text-xs outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={newReminderTime}
                                            onChange={(e) => setNewReminderTime(e.target.value)}
                                            placeholder="ساعت (مثلاً: ۱۹:۳۰)"
                                            className="rounded-xl border px-3 py-2 text-xs outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <input
                                            type="text"
                                            value={newReminderDays}
                                            onChange={(e) => setNewReminderDays(e.target.value)}
                                            placeholder="روزها (مثلاً: شنبه‌ها و سه‌شنبه‌ها)"
                                            className="flex-1 min-w-[180px] rounded-xl border px-3 py-1.5 text-xs outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!newReminderTitle.trim()) {
                                                    showToast('لطفاً عنوان یادآوری را وارد کنید.');
                                                    return;
                                                }
                                                updateAppState((prev) => ({
                                                    ...prev,
                                                    reminders: addReminderToState(
                                                        prev.reminders,
                                                        newReminderTitle,
                                                        newReminderTime,
                                                        newReminderDays,
                                                        newReminderChannel
                                                    ),
                                                }));
                                                setNewReminderTitle('');
                                                showToast('یادآوری جدید ثبت و فعال شد.');
                                            }}
                                            className="px-4 py-2 rounded-xl bg-[#153F31] text-white text-xs font-black inline-flex items-center gap-1.5"
                                        >
                                            <Plus className="w-3.5 h-3.5 text-[#D6F39A]" />
                                            <span>افزودن یادآور</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    {reminders.map((r) => (
                                        <div
                                            key={r.id}
                                            className="rounded-[22px] border p-4 flex items-center justify-between gap-3"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div
                                                onClick={() => toggleReminder(r.id)}
                                                className="flex items-center gap-3 cursor-pointer flex-1"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: colors.primarySoft }}
                                                >
                                                    <Bell
                                                        className="w-4 h-4"
                                                        style={{ color: colors.primary }}
                                                    />
                                                </div>
                                                <div>
                                                    <div
                                                        className="font-bold text-sm"
                                                        style={{ color: colors.text }}
                                                    >
                                                        {r.title}
                                                    </div>
                                                    <div
                                                        className="text-xs mt-1"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        ساعت {r.time} · {r.days}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleReminder(r.id)}
                                                    className="px-3 py-1 rounded-full text-xs font-bold"
                                                    style={{
                                                        backgroundColor: r.enabled
                                                            ? colors.primarySoft
                                                            : colors.surfaceAlt,
                                                        color: r.enabled
                                                            ? colors.primary
                                                            : colors.muted,
                                                    }}
                                                >
                                                    {r.enabled ? 'فعال' : 'غیرفعال'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReminders((prev) =>
                                                            prev.filter((item) => item.id !== r.id)
                                                        );
                                                        showToast('یادآوری حذف شد.');
                                                    }}
                                                    className="p-1.5 rounded-lg text-xs"
                                                    style={{ color: colors.muted }}
                                                    title="حذف یادآور"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Sent SMS & Reminder Logs */}
                                <div
                                    className="rounded-[22px] border p-4 space-y-2.5"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="font-black text-xs" style={{ color: colors.text }}>
                                        تاریخچه پیامک‌ها و اعلان‌های ارسال‌شده اخیر
                                    </div>
                                    {reminderLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="p-3 rounded-xl flex items-center justify-between gap-2 text-xs"
                                            style={{ backgroundColor: colors.surfaceAlt }}
                                        >
                                            <div className="space-y-0.5">
                                                <div className="font-bold" style={{ color: colors.text }}>
                                                    {log.title}
                                                </div>
                                                <div className="text-[11px]" style={{ color: colors.muted }}>
                                                    گیرنده: {log.recipient} · {log.sentAt}
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-[10px] font-black shrink-0">
                                                ارسال موفق ✓
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeScreen === 'support' && (() => {
                            const activeTicket =
                                supportTickets.find((t) => t.id === selectedTicketId) ||
                                supportTickets[0];
                            return (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('dashboard')}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                            <span>بازگشت به رشد من</span>
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => openCourseSupportChat()}
                                                className="text-xs font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                چت زنده پشتیبانی
                                            </button>
                                            <Link
                                                href="/support"
                                                className="text-xs font-bold underline"
                                                style={{ color: colors.primary }}
                                            >
                                                مرکز تیکت وب‌سایت
                                            </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <h1
                                            className="font-black text-xl"
                                            style={{ color: colors.text }}
                                        >
                                            تیکت‌ها و پشتیبانی هوشمند
                                        </h1>
                                        <p
                                            className="text-xs mt-1"
                                            style={{ color: colors.muted }}
                                        >
                                            ثبت تیکت جدید، پیگیری درخواست‌های آموزشی و گفتگو با واحد پشتیبانی
                                        </p>
                                    </div>

                                    {/* Submit New Ticket Form */}
                                    <div
                                        className="rounded-[22px] border p-4 space-y-3"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div
                                            className="font-black text-xs flex items-center gap-1.5"
                                            style={{ color: colors.text }}
                                        >
                                            <Plus className="w-4 h-4" style={{ color: colors.primary }} />
                                            <span>ثبت تیکت پشتیبانی جدید</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <input
                                                type="text"
                                                value={newTicketSubject}
                                                onChange={(e) => setNewTicketSubject(e.target.value)}
                                                placeholder="موضوع تیکت (مثلاً: هماهنگی جلسه کوچینگ فردی)..."
                                                className="sm:col-span-2 rounded-xl border px-3 py-2 text-xs outline-none"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            />
                                            <select
                                                value={newTicketPriority}
                                                onChange={(e) =>
                                                    setNewTicketPriority(
                                                        e.target.value as 'low' | 'medium' | 'high'
                                                    )
                                                }
                                                className="rounded-xl border px-3 py-2 text-xs outline-none"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            >
                                                <option value="low">اولویت عادی</option>
                                                <option value="medium">اولویت متوسط</option>
                                                <option value="high">اولویت فوری</option>
                                            </select>
                                        </div>
                                        <textarea
                                            rows={2}
                                            value={newTicketBody}
                                            onChange={(e) => setNewTicketBody(e.target.value)}
                                            placeholder="شرح درخواست یا سؤال خود را بنویسید..."
                                            className="w-full rounded-xl border p-3 text-xs outline-none"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!newTicketSubject.trim() || !newTicketBody.trim()) {
                                                        showToast('لطفاً موضوع و متن تیکت را وارد کنید.');
                                                        return;
                                                    }
                                                    updateAppState((prev) => {
                                                        const updated = createSupportTicketInState(
                                                            prev.supportTickets,
                                                            newTicketSubject,
                                                            newTicketDept,
                                                            newTicketPriority,
                                                            newTicketBody,
                                                            prev.userProfile.name
                                                        );
                                                        if (updated[0]) {
                                                            setSelectedTicketId(updated[0].id);
                                                        }
                                                        return {
                                                            ...prev,
                                                            supportTickets: updated,
                                                        };
                                                    });
                                                    setNewTicketSubject('');
                                                    setNewTicketBody('');
                                                    showToast('تیکت شما ثبت شد و در پنل پشتیبانی سایت نیز قابل مشاهده است.');
                                                }}
                                                className="px-4 py-2 rounded-xl bg-[#153F31] text-white text-xs font-black inline-flex items-center gap-1.5"
                                            >
                                                <Send className="w-3.5 h-3.5 text-[#D6F39A]" />
                                                <span>ارسال و ثبت تیکت</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tickets List & Active Thread */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            {supportTickets.map((tk) => {
                                                const isSelected = activeTicket?.id === tk.id;
                                                return (
                                                    <div
                                                        key={tk.id}
                                                        onClick={() => setSelectedTicketId(tk.id)}
                                                        className="rounded-2xl border p-3.5 cursor-pointer transition space-y-1.5"
                                                        style={{
                                                            backgroundColor: isSelected
                                                                ? colors.primarySoft
                                                                : colors.surface,
                                                            borderColor: isSelected
                                                                ? colors.primary
                                                                : colors.border,
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span
                                                                className="font-black text-xs"
                                                                style={{ color: colors.text }}
                                                            >
                                                                {tk.subject}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                                                    tk.status === 'answered'
                                                                        ? 'bg-emerald-500/15 text-emerald-700'
                                                                        : 'bg-amber-500/15 text-amber-700'
                                                                }`}
                                                            >
                                                                {tk.status === 'answered'
                                                                    ? 'پاسخ داده شده'
                                                                    : 'در انتظار پاسخ'}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="text-[11px] flex items-center justify-between"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            <span>{tk.department}</span>
                                                            <span>
                                                                {faNum(tk.messages.length)} پیام · {tk.createdAt}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {activeTicket && (
                                            <div
                                                className="rounded-2xl border p-4 flex flex-col justify-between space-y-3"
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <div className="space-y-2">
                                                    <div
                                                        className="font-black text-xs border-b pb-2"
                                                        style={{
                                                            color: colors.text,
                                                            borderColor: colors.border,
                                                        }}
                                                    >
                                                        گفتگوی تیکت: {activeTicket.subject}
                                                    </div>
                                                    <div className="space-y-2 max-h-56 overflow-y-auto">
                                                        {activeTicket.messages.map((m) => (
                                                            <div
                                                                key={m.id}
                                                                className="p-2.5 rounded-xl text-xs space-y-1"
                                                                style={{
                                                                    backgroundColor:
                                                                        m.sender === 'student'
                                                                            ? colors.primarySoft
                                                                            : colors.surfaceAlt,
                                                                    color: colors.text,
                                                                }}
                                                            >
                                                                <div className="flex items-center justify-between text-[10px] font-bold">
                                                                    <span style={{ color: colors.primary }}>
                                                                        {m.senderName}
                                                                    </span>
                                                                    <span style={{ color: colors.muted }}>
                                                                        {m.time}
                                                                    </span>
                                                                </div>
                                                                <p className="leading-5">{m.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: colors.border }}>
                                                    <input
                                                        type="text"
                                                        value={ticketReplyDraft}
                                                        onChange={(e) => setTicketReplyDraft(e.target.value)}
                                                        placeholder={
                                                            previewRole === 'instructor'
                                                                ? 'پاسخ پشتیبان / ادمین به تیکت...'
                                                                : 'ارسال پیام تکمیلی در این تیکت...'
                                                        }
                                                        className="flex-1 rounded-xl border px-3 py-2 text-xs outline-none"
                                                        style={{
                                                            backgroundColor: colors.surfaceAlt,
                                                            borderColor: colors.border,
                                                            color: colors.text,
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (!ticketReplyDraft.trim()) return;
                                                            const isSup = previewRole === 'instructor';
                                                            updateAppState((prev) => ({
                                                                ...prev,
                                                                supportTickets: replyToSupportTicketInState(
                                                                    prev.supportTickets,
                                                                    activeTicket.id,
                                                                    ticketReplyDraft,
                                                                    isSup ? 'support' : 'student',
                                                                    isSup
                                                                        ? 'پشتیبانی آموزش (ادمین)'
                                                                        : prev.userProfile.name
                                                                ),
                                                            }));
                                                            setTicketReplyDraft('');
                                                            showToast('پاسخ شما در تیکت ثبت شد.');
                                                        }}
                                                        className="px-3 py-2 rounded-xl bg-[#153F31] text-white text-xs font-bold shrink-0"
                                                    >
                                                        ارسال
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ==================== PROFILE SCREEN (حساب من — کارنامه شخصی، پرونده استعدادیابی، تنظیمات و شخصی‌سازی) ==================== */}
                        {activeScreen === 'profile' && (
                            <div className="space-y-4">
                                {/* 1. PERSONAL IDENTITY CARD, LEVEL PROGRESS, 3 KEY STATS & EDIT CONTROLS (بدون QR) */}
                                <div
                                    className="rounded-[26px] p-5 text-white relative overflow-hidden border"
                                    style={{
                                        background: isVipEnrolled
                                            ? 'linear-gradient(135deg, #10382B 0%, #174938 60%, #1F5B46 100%)'
                                            : 'linear-gradient(135deg, #153F31 0%, #1E5240 100%)',
                                        borderColor: isVipEnrolled ? '#F59E0B' : colors.border,
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="relative shrink-0">
                                                <img
                                                    src="/images/roshd-logo.png"
                                                    alt={userProfile.name}
                                                    className="w-15 h-15 rounded-2xl object-cover border-2"
                                                    style={{
                                                        borderColor: isVipEnrolled
                                                            ? '#FBBF24'
                                                            : 'rgba(255,255,255,0.25)',
                                                    }}
                                                />
                                                {isVipEnrolled && (
                                                    <span
                                                        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-[#0D2E22] flex items-center justify-center shadow"
                                                        title="عضو رسمی VIP"
                                                    >
                                                        <Crown className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h1 className="font-black text-base text-white truncate">
                                                        {userProfile.name}
                                                    </h1>
                                                    <span className="text-[11px] text-[#D6F39A] font-bold">
                                                        {isVipEnrolled
                                                            ? `کد دانش‌پذیری: ${userProfile.studentCode}`
                                                            : 'کاربر آکادمی رشد'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-emerald-100/90 mt-0.5 truncate">
                                                    {userProfile.gradeAndField} · {userProfile.city}
                                                </p>
                                                <p className="text-[11px] text-amber-300/95 font-bold mt-1">
                                                    کارنامه رشد شخصی، تنظیمات و شخصی‌سازی حساب
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick Action Button: Profile Edit */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                type="button"
                                                aria-label="ویرایش مشخصات"
                                                onClick={() => {
                                                    setProfileDraft({
                                                        name: userProfile.name,
                                                        gradeAndField: userProfile.gradeAndField,
                                                        city: userProfile.city,
                                                        phone: userProfile.phone,
                                                        parentPhone: userProfile.parentPhone,
                                                        bio: userProfile.bio,
                                                    });
                                                    setProfileError(null);
                                                    setIsEditingProfile((prev) => !prev);
                                                }}
                                                className="px-3 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1.5 transition"
                                            >
                                                {isEditingProfile ? (
                                                    <>
                                                        <X className="w-3.5 h-3.5" />
                                                        <span>بستن</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                        <span>ویرایش</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Level & XP Progress Bar */}
                                    <div className="mt-4 pt-3.5 border-t border-white/15">
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="font-black text-[#D6F39A] inline-flex items-center gap-1.5">
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                <span>
                                                    سطح {faNum(userProfile.levelNumber)}: {userProfile.levelTitle}
                                                </span>
                                            </span>
                                            <span className="text-[11px] text-emerald-100">
                                                {faNum(userProfile.xp)} از {faNum(userProfile.nextLevelXp)} امتیاز رشد ({faNum(levelProgressPercent)}٪)
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-black/25 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-l from-amber-400 to-[#D6F39A] transition-all duration-300"
                                                style={{ width: `${levelProgressPercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* 3 Key Metrics */}
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center">
                                            <div className="font-black text-sm text-white">
                                                {faNum(userProfile.learningHours)} ساعت
                                            </div>
                                            <div className="text-[10px] text-emerald-100/80 mt-0.5">
                                                ساعت آموزش
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center">
                                            <div className="font-black text-sm text-amber-300">
                                                {faNum(userProfile.attendanceRate)}٪ حضور
                                            </div>
                                            <div className="text-[10px] text-emerald-100/80 mt-0.5">
                                                نظم کلاس VIP
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center">
                                            <div className="font-black text-sm text-[#D6F39A]">
                                                {faNum(userProfile.badgesCount)} دستاورد
                                            </div>
                                            <div className="text-[10px] text-emerald-100/80 mt-0.5">
                                                نشان و گواهینامه
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PERSONALIZATION & APPEARANCE BAR (شخصی‌سازی ظاهر و دسترسی سریع به رشد من) */}
                                <div
                                    className="rounded-[22px] border p-3.5 flex items-center justify-between gap-2"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                            style={{
                                                backgroundColor: colors.primarySoft,
                                                color: colors.primary,
                                            }}
                                        >
                                            {isDark ? (
                                                <Moon className="w-4 h-4" />
                                            ) : (
                                                <Sun className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div
                                                className="font-black text-xs"
                                                style={{ color: colors.text }}
                                            >
                                                شخصی‌سازی پوسته اپلیکیشن
                                            </div>
                                            <div
                                                className="text-[10px]"
                                                style={{ color: colors.muted }}
                                            >
                                                حالت فعلی: {isDark ? 'پوسته تیره (شب)' : 'پوسته روشن (روز)'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setIsDark((d) => !d)}
                                            className="px-3 py-1.5 rounded-xl border text-[11px] font-bold"
                                            style={{
                                                backgroundColor: colors.surfaceAlt,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        >
                                            تغییر به {isDark ? 'روشن' : 'تیره'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('dashboard')}
                                            className="px-2.5 py-1.5 rounded-xl bg-[#153F31] text-white text-[11px] font-bold"
                                        >
                                            رشد من
                                        </button>
                                    </div>
                                </div>

                                {/* INLINE PROFILE EDITOR FORM */}
                                {isEditingProfile && (
                                    <div
                                        className="rounded-[24px] border p-4 space-y-3"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2
                                                className="font-black text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                ویرایش مشخصات فردی و پرونده نوجوان
                                            </h2>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingProfile(false)}
                                                className="text-xs font-bold"
                                                style={{ color: colors.muted }}
                                            >
                                                انصراف
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <label className="block space-y-1">
                                                <span
                                                    className="text-[11px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    نام و نام خانوادگی
                                                </span>
                                                <input
                                                    type="text"
                                                    value={profileDraft.name}
                                                    onChange={(e) =>
                                                        setProfileDraft((p) => ({
                                                            ...p,
                                                            name: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </label>
                                            <label className="block space-y-1">
                                                <span
                                                    className="text-[11px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    پایه تحصیلی و گرایش
                                                </span>
                                                <input
                                                    type="text"
                                                    value={profileDraft.gradeAndField}
                                                    onChange={(e) =>
                                                        setProfileDraft((p) => ({
                                                            ...p,
                                                            gradeAndField: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </label>
                                            <label className="block space-y-1">
                                                <span
                                                    className="text-[11px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    شهر محل سکونت
                                                </span>
                                                <input
                                                    type="text"
                                                    value={profileDraft.city}
                                                    onChange={(e) =>
                                                        setProfileDraft((p) => ({
                                                            ...p,
                                                            city: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </label>
                                            <label className="block space-y-1">
                                                <span
                                                    className="text-[11px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    شماره موبایل دانش‌پذیر
                                                </span>
                                                <input
                                                    type="tel"
                                                    value={profileDraft.phone}
                                                    onChange={(e) =>
                                                        setProfileDraft((p) => ({
                                                            ...p,
                                                            phone: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <label className="block space-y-1">
                                            <span
                                                className="text-[11px] font-bold"
                                                style={{ color: colors.muted }}
                                            >
                                                شماره همراه والدین (جهت دریافت پیامک حضور و کارنامه هفتگی)
                                            </span>
                                            <input
                                                type="tel"
                                                value={profileDraft.parentPhone}
                                                onChange={(e) =>
                                                    setProfileDraft((p) => ({
                                                        ...p,
                                                        parentPhone: e.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            />
                                        </label>

                                        <label className="block space-y-1">
                                            <span
                                                className="text-[11px] font-bold"
                                                style={{ color: colors.muted }}
                                            >
                                                هدف و معرفی کوتاه من
                                            </span>
                                            <textarea
                                                rows={2}
                                                value={profileDraft.bio}
                                                onChange={(e) =>
                                                    setProfileDraft((p) => ({
                                                        ...p,
                                                        bio: e.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-xl border px-3 py-2 text-xs outline-none resize-none"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            />
                                        </label>

                                        {profileError && (
                                            <div className="text-xs font-bold text-red-600">
                                                {profileError}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleSaveProfile}
                                            className="w-full py-2.5 rounded-xl bg-[#153F31] text-white font-black text-xs hover:opacity-95 transition"
                                        >
                                            ذخیره تغییرات پروفایل
                                        </button>
                                    </div>
                                )}

                                {/* 2. TEEN TALENT DOSSIER, COACH FEEDBACK & PARENT REPORT PANEL */}
                                <div
                                    className="rounded-[24px] border p-4 space-y-4"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-8 h-8 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: colors.primarySoft }}
                                            >
                                                <Compass
                                                    className="w-4 h-4"
                                                    style={{ color: colors.primary }}
                                                />
                                            </span>
                                            <div>
                                                <h2
                                                    className="font-black text-sm"
                                                    style={{ color: colors.text }}
                                                >
                                                    پرونده استعدادیابی نوجوان و بازخورد کوچ
                                                </h2>
                                                <p
                                                    className="text-[11px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    ارزیابی اختصاصی کارگاه‌های طراحی آینده نوجوان
                                                </p>
                                            </div>
                                        </div>
                                        {isVipEnrolled && (
                                            <button
                                                type="button"
                                                onClick={() => setActiveScreen('vipClub')}
                                                className="text-[11px] font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                برنامه کلاس‌ها
                                            </button>
                                        )}
                                    </div>

                                    {/* 3 Talent Dimensions */}
                                    <div className="space-y-2.5">
                                        {talentDimensions.map((dim) => (
                                            <div key={dim.id} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span
                                                        className="font-bold"
                                                        style={{ color: colors.text }}
                                                    >
                                                        {dim.title}
                                                    </span>
                                                    <span
                                                        className="font-black"
                                                        style={{ color: colors.primary }}
                                                    >
                                                        {faNum(dim.score)}٪
                                                    </span>
                                                </div>
                                                <div
                                                    className="w-full h-1.5 rounded-full overflow-hidden"
                                                    style={{ backgroundColor: colors.surfaceAlt }}
                                                >
                                                    <div
                                                        className="h-full rounded-full bg-[#153F31]"
                                                        style={{ width: `${dim.score}%` }}
                                                    />
                                                </div>
                                                <p
                                                    className="text-[11px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    {dim.summary}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Latest Coach Feedback Box */}
                                    <div
                                        className="rounded-2xl p-3.5 space-y-1.5"
                                        style={{ backgroundColor: colors.surfaceAlt }}
                                    >
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span
                                                className="font-black"
                                                style={{ color: colors.primary }}
                                            >
                                                آخرین بازخورد اختصاصی مدرس دوره
                                            </span>
                                            <span style={{ color: colors.muted }}>
                                                استاد سارا درس · کارگاه چهارم
                                            </span>
                                        </div>
                                        <p
                                            className="text-xs leading-relaxed"
                                            style={{ color: colors.text }}
                                        >
                                            «{userProfile.name} در کارگاه ترسیم بوم نقشه راه ۹۰ روزه تمرکز و قدرت تحلیل بسیار خوبی نشان داد. پیشنهاد می‌کنم تمرین گفت‌وگو با خانواده درباره هدف‌های تابستان را این هفته تکمیل کند.»
                                        </p>
                                    </div>

                                    {/* Parent Coordination & Weekly Report Status */}
                                    <div
                                        className="pt-3 border-t space-y-2.5"
                                        style={{ borderColor: colors.border }}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <div
                                                    className="font-bold text-xs flex items-center gap-1.5"
                                                    style={{ color: colors.text }}
                                                >
                                                    <Phone
                                                        className="w-3.5 h-3.5"
                                                        style={{ color: colors.primary }}
                                                    />
                                                    <span>گزارش هفتگی والدین ({faNum(userProfile.parentPhone)})</span>
                                                </div>
                                                <div
                                                    className="text-[11px] mt-0.5"
                                                    style={{ color: colors.muted }}
                                                >
                                                    آخرین ارسال: {userProfile.lastParentReportSentAt}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                aria-label="ارسال خودکار گزارش هفتگی به والدین"
                                                onClick={() => {
                                                    setUserProfile((prev) => ({
                                                        ...prev,
                                                        parentWeeklyReportEnabled:
                                                            !prev.parentWeeklyReportEnabled,
                                                    }));
                                                    showToast(
                                                        !userProfile.parentWeeklyReportEnabled
                                                            ? 'ارسال خودکار کارنامه هفتگی به والدین فعال شد.'
                                                            : 'ارسال خودکار کارنامه هفتگی به والدین متوقف شد.'
                                                    );
                                                }}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                                    userProfile.parentWeeklyReportEnabled
                                                        ? 'bg-emerald-700 text-white'
                                                        : 'bg-stone-200 text-stone-700'
                                                }`}
                                            >
                                                {userProfile.parentWeeklyReportEnabled
                                                    ? 'ارسال خودکار: فعال'
                                                    : 'ارسال خودکار: غیرفعال'}
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleSendParentReport}
                                            className="w-full py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition hover:opacity-85"
                                            style={{
                                                borderColor: colors.border,
                                                color: colors.primary,
                                                backgroundColor: colors.primarySoft,
                                            }}
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>ارسال کارنامه این هفته به والدین</span>
                                        </button>
                                    </div>
                                </div>

                                {/* 3. DIGITAL WALLET, ORDERS & INVOICES */}
                                <div
                                    className="rounded-[24px] border p-4 space-y-4"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-8 h-8 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: colors.primarySoft }}
                                            >
                                                <Wallet
                                                    className="w-4 h-4"
                                                    style={{ color: colors.primary }}
                                                />
                                            </span>
                                            <div>
                                                <h2
                                                    className="font-black text-sm"
                                                    style={{ color: colors.text }}
                                                >
                                                    کیف پول دیجیتال و تاریخچه سفارش‌ها
                                                </h2>
                                                <p
                                                    className="text-[11px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    اعتبار هدیه باشگاه: {formatPrice(userProfile.giftCredit)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <div
                                                className="font-black text-sm"
                                                style={{ color: colors.primary }}
                                            >
                                                {formatPrice(userProfile.walletBalance)}
                                            </div>
                                            <div
                                                className="text-[10px]"
                                                style={{ color: colors.muted }}
                                            >
                                                موجودی قابل استفاده
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Top-Up Buttons */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleWalletTopUp(200000)}
                                            className="py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition hover:opacity-85"
                                            style={{
                                                borderColor: colors.border,
                                                backgroundColor: colors.surfaceAlt,
                                                color: colors.text,
                                            }}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>شارژ ۲۰۰٬۰۰۰ تومان</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleWalletTopUp(500000)}
                                            className="py-2 px-3 rounded-xl bg-[#153F31] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition hover:opacity-90"
                                        >
                                            <CreditCard className="w-3.5 h-3.5" />
                                            <span>شارژ ۵۰۰٬۰۰۰ تومان</span>
                                        </button>
                                    </div>

                                    {/* Orders & Invoices List */}
                                    <div
                                        className="pt-3 border-t space-y-2.5"
                                        style={{ borderColor: colors.border }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="font-bold text-xs flex items-center gap-1.5"
                                                style={{ color: colors.text }}
                                            >
                                                <Receipt
                                                    className="w-3.5 h-3.5"
                                                    style={{ color: colors.primary }}
                                                />
                                                <span>سفارش‌ها و فاکتورهای من ({faNum(walletOrders.length)})</span>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowAllOrders((prev) => !prev)}
                                                className="text-[11px] font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                {showAllOrders ? 'نمایش خلاصه' : 'مشاهده همه فاکتورها'}
                                            </button>
                                        </div>

                                        <div className="divide-y" style={{ borderColor: colors.border }}>
                                            {(showAllOrders
                                                ? walletOrders
                                                : walletOrders.slice(0, 2)
                                            ).map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="py-2.5 flex items-center justify-between gap-2"
                                                >
                                                    <div className="min-w-0">
                                                        <div
                                                            className="font-bold text-xs truncate"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {order.title}
                                                        </div>
                                                        <div
                                                            className="text-[11px] mt-0.5"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {order.category} · {order.date} · {order.invoiceCode}
                                                        </div>
                                                    </div>
                                                    <div className="text-left shrink-0">
                                                        <div
                                                            className="font-black text-xs"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {formatPrice(order.amount)}
                                                        </div>
                                                        <div className="text-[10px] text-emerald-700 font-bold">
                                                            پرداخت موفق
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 4. CERTIFICATES SHOWCASE, BADGES & GROWTH REPORT CARD */}
                                <div
                                    className="rounded-[24px] border p-4 space-y-4"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-8 h-8 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: colors.primarySoft }}
                                            >
                                                <Award
                                                    className="w-4 h-4"
                                                    style={{ color: colors.primary }}
                                                />
                                            </span>
                                            <div>
                                                <h2
                                                    className="font-black text-sm"
                                                    style={{ color: colors.text }}
                                                >
                                                    ویترین گواهینامه‌ها، نشان‌های افتخار و کارنامه
                                                </h2>
                                                <p
                                                    className="text-[11px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    دستاوردهای ثبت‌شده در مسیر رشد نوجوان
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('dashboard')}
                                            className="text-[11px] font-bold inline-flex items-center gap-1"
                                            style={{ color: colors.primary }}
                                        >
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span>کارنامه رشد</span>
                                        </button>
                                    </div>

                                    {/* Badges Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {earnedBadges.map((badge, idx) => {
                                            const BadgeIcon =
                                                idx === 0 ? Crown : idx === 1 ? Compass : Flame;
                                            return (
                                                <div
                                                    key={badge.id}
                                                    className="rounded-2xl p-2.5 text-center space-y-1"
                                                    style={{ backgroundColor: colors.surfaceAlt }}
                                                >
                                                    <div
                                                        className="w-8 h-8 rounded-xl mx-auto flex items-center justify-center"
                                                        style={{ backgroundColor: colors.primarySoft }}
                                                    >
                                                        <BadgeIcon
                                                            className="w-4 h-4"
                                                            style={{ color: colors.primary }}
                                                        />
                                                    </div>
                                                    <div
                                                        className="font-black text-[11px] leading-tight"
                                                        style={{ color: colors.text }}
                                                    >
                                                        {badge.title}
                                                    </div>
                                                    <div
                                                        className="text-[10px] leading-tight"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        {badge.earnedDate}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Official Certificate Item */}
                                    <div
                                        className="rounded-2xl p-3.5 flex items-center justify-between gap-3"
                                        style={{ backgroundColor: colors.surfaceAlt }}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div
                                                    className="font-bold text-xs truncate"
                                                    style={{ color: colors.text }}
                                                >
                                                    گواهینامه مرحله اول طراحی آینده نوجوان
                                                </div>
                                                <div
                                                    className="text-[11px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    صادرشده با مهر رسمی آکادمی رشد · کد ثبت ۴۰۴۱۲
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCertPreviewModal((prev) => !prev)
                                            }
                                            className="px-3 py-1.5 rounded-xl bg-[#153F31] text-white text-[11px] font-bold shrink-0"
                                        >
                                            {showCertPreviewModal ? 'بستن گواهی' : 'مشاهده گواهی'}
                                        </button>
                                    </div>

                                    {showCertPreviewModal && (
                                        <div className="rounded-2xl border-2 border-amber-400/70 bg-[#FAF7EE] p-4 text-center space-y-2 text-[#13241D]">
                                            <div className="inline-flex items-center gap-1.5 text-amber-700 font-black text-xs">
                                                <Award className="w-4 h-4" />
                                                <span>گواهینامه رسمی آکادمی رشد</span>
                                            </div>
                                            <div className="font-black text-sm">
                                                بدین‌وسیله گواهی می‌شود دانش‌پذیر گرامی «{userProfile.name}»
                                            </div>
                                            <p className="text-xs text-stone-600 leading-relaxed">
                                                فاز نخست کارگاه‌های عملی «طراحی آینده نوجوان» (خودشناسی، استعدادیابی و هدف‌گذاری ۹۰ روزه) را با موفقیت و نظم حضور {faNum(userProfile.attendanceRate)}٪ به پایان رسانده است.
                                            </p>
                                            <div className="text-[11px] font-bold text-emerald-800 pt-1">
                                                شماره گواهینامه: ROSHD-CERT-40412 · تاییدشده توسط استاد سارا درس
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 5. SMART SMS REMINDER SETTINGS & REFERRAL CLUB */}
                                <div
                                    className="rounded-[24px] border p-4 space-y-4"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-8 h-8 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: colors.primarySoft }}
                                            >
                                                <Bell
                                                    className="w-4 h-4"
                                                    style={{ color: colors.primary }}
                                                />
                                            </span>
                                            <div>
                                                <h2
                                                    className="font-black text-sm"
                                                    style={{ color: colors.text }}
                                                >
                                                    تنظیمات پیامک یادآور کلاس‌ها و اعلان‌ها
                                                </h2>
                                                <p
                                                    className="text-[11px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    هماهنگی خودکار کارگاه‌های حضوری و جلسات آنلاین
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('reminders')}
                                            className="text-[11px] font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            زمان‌بندی دقیق
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {[
                                            {
                                                key: 'classSmsTwoHoursBefore' as const,
                                                label: 'پیامک یادآور ۲ ساعت قبل از کلاس حضوری و آنلاین',
                                                sub: `ارسال به شماره ${faNum(userProfile.phone)}`,
                                            },
                                            {
                                                key: 'parentAttendanceSms' as const,
                                                label: 'ارسال پیامک ثبت حضور و غیاب کارگاه به والدین',
                                                sub: `ارسال به شماره ${faNum(userProfile.parentPhone)}`,
                                            },
                                            {
                                                key: 'dailyGoalAndHomeworkPush' as const,
                                                label: 'یادآور تمرین‌های هفتگی و ژورنال هدف‌گذاری',
                                                sub: 'اعلان هوشمند درون‌برنامه‌ای ساعت ۲۱:۰۰',
                                            },
                                        ].map((item) => {
                                            const active = notifSettings[item.key];
                                            return (
                                                <div
                                                    key={item.key}
                                                    className="flex items-center justify-between gap-3 py-2"
                                                >
                                                    <div className="min-w-0">
                                                        <div
                                                            className="font-bold text-xs"
                                                            style={{ color: colors.text }}
                                                        >
                                                            {item.label}
                                                        </div>
                                                        <div
                                                            className="text-[11px]"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {item.sub}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={active}
                                                        onClick={() => {
                                                            setNotifSettings((prev) => ({
                                                                ...prev,
                                                                [item.key]: !prev[item.key],
                                                            }));
                                                            showToast('تنظیمات پیامک و اعلان به‌روزرسانی شد.');
                                                        }}
                                                        className={`w-11 h-6 rounded-full p-0.5 transition flex items-center shrink-0 ${
                                                            active
                                                                ? 'bg-[#153F31] justify-start'
                                                                : 'bg-stone-300 justify-end'
                                                        }`}
                                                    >
                                                        <span className="w-5 h-5 rounded-full bg-white shadow" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Referral Club Card */}
                                    <div
                                        className="rounded-2xl p-3.5 flex items-center justify-between gap-3"
                                        style={{ backgroundColor: '#E8F2D5' }}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-[#153F31] text-[#D6F39A] flex items-center justify-center shrink-0">
                                                <Gift className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-black text-xs text-[#153F31]">
                                                    باشگاه دعوت دوستان · ۱۵۰٬۰۰۰ تومان هدیه
                                                </div>
                                                <div className="text-[11px] text-[#355E4B] truncate">
                                                    کد اختصاصی: {userProfile.referralCode}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCopyReferral}
                                            className="px-3 py-1.5 rounded-xl bg-[#153F31] text-white text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>{copiedReferral ? 'کپی شد' : 'کپی کد'}</span>
                                        </button>
                                    </div>

                                    {/* Support Quick Button */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('support')}
                                        className="w-full py-2.5 px-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition hover:opacity-85"
                                        style={{
                                            borderColor: colors.border,
                                            color: colors.text,
                                            backgroundColor: colors.surfaceAlt,
                                        }}
                                    >
                                        <span className="flex items-center gap-2">
                                            <MessageCircle
                                                className="w-4 h-4"
                                                style={{ color: colors.primary }}
                                            />
                                            <span>گفت‌وگو با پشتیبانی و هماهنگی کلاس‌ها</span>
                                        </span>
                                        <ChevronLeft
                                            className="w-4 h-4"
                                            style={{ color: colors.muted }}
                                        />
                                    </button>
                                </div>

                                {/* 6. DISTINCT SEPARATED INSTRUCTOR & ADMIN ACCESS BOX AT THE BOTTOM */}
                                <div
                                    className="rounded-[24px] border-2 border-dashed p-4 space-y-3"
                                    style={{
                                        backgroundColor: isDark ? '#131F1A' : '#F4F6F0',
                                        borderColor: isDark ? '#2E473B' : '#C9D6C8',
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 rounded-lg bg-[#123E30] text-[#D6F39A] flex items-center justify-center">
                                                <ShieldCheck className="w-4 h-4" />
                                            </span>
                                            <div>
                                                <h3
                                                    className="font-black text-xs"
                                                    style={{ color: colors.text }}
                                                >
                                                    دسترسی ویژه کادر آموزشی و مدیریت
                                                </h3>
                                                <p
                                                    className="text-[10px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    مجزا از محیط دانش‌پذیر · ویژه مدرس دوره و مدیر سایت
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('vipManage')}
                                            className="w-full px-3.5 py-3 rounded-2xl bg-[#123E30] text-white flex items-center justify-between text-right text-xs font-bold transition hover:opacity-95"
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <UserCheck className="w-4 h-4 text-[#D6F39A]" />
                                                <span>پنل مدرس: حضور و غیاب و تنظیمات دوره VIP</span>
                                            </span>
                                            <ChevronLeft className="w-4 h-4 text-[#D6F39A]" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('admin')}
                                            className="w-full px-3.5 py-2.5 rounded-2xl border flex items-center justify-between text-right text-xs font-bold transition hover:opacity-85"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <Settings
                                                    className="w-4 h-4"
                                                    style={{ color: colors.primary }}
                                                />
                                                <span>پنل مدیریت کل سایت (Admin)</span>
                                            </span>
                                            <ChevronLeft
                                                className="w-4 h-4"
                                                style={{ color: colors.muted }}
                                            />
                                        </button>

                                        <Link
                                            href="/admin/courses/100/edit"
                                            className="w-full px-3.5 py-2.5 rounded-2xl border flex items-center justify-between text-right text-xs font-bold transition hover:opacity-85"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                                color: colors.primary,
                                            }}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <Crown className="w-4 h-4 text-amber-500" />
                                                <span>ویرایش دوره پریمیوم VIP در پنل مدیریت سایت</span>
                                            </span>
                                            <ChevronLeft
                                                className="w-4 h-4"
                                                style={{ color: colors.muted }}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ==================== VIP INSTRUCTOR & COURSE MANAGEMENT (Inside Profile / Admin) ==================== */}
                        {activeScreen === 'vipManage' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScreen('profile')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold"
                                        style={{ color: colors.primary }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        <span>بازگشت به حساب من</span>
                                    </button>
                                    <span className="px-2.5 py-1 rounded-full bg-[#123E30] text-[#D6F39A] text-[11px] font-bold">
                                        پنل مدرس و مدیریت VIP
                                    </span>
                                </div>

                                <div>
                                    <h1
                                        className="font-black text-lg"
                                        style={{ color: colors.text }}
                                    >
                                        مدیریت دوره «طراحی آینده نوجوان»
                                    </h1>
                                    <p
                                        className="text-xs mt-0.5"
                                        style={{ color: colors.muted }}
                                    >
                                        حضور و غیاب (حضوری/مجازی)، ارسال یادآور کلاس و تنظیمات معرفی دوره
                                    </p>
                                </div>

                                {/* 3 Management Tabs */}
                                <div
                                    className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl border"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    }}
                                >
                                    {[
                                        { id: 'attendance' as const, label: 'حضور و غیاب' },
                                        { id: 'sessions' as const, label: 'جلسات و یادآور' },
                                        { id: 'settings' as const, label: 'تنظیمات دوره' },
                                    ].map((t) => {
                                        const active = vipManageTab === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setVipManageTab(t.id)}
                                                className="py-2 rounded-xl text-xs font-bold transition"
                                                style={{
                                                    backgroundColor: active
                                                        ? colors.primary
                                                        : 'transparent',
                                                    color: active ? '#FFFFFF' : colors.text,
                                                }}
                                            >
                                                {t.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* TAB 1: LIVE INSTRUCTOR ROLL-CALL & VIP STAMP */}
                                {vipManageTab === 'attendance' && (
                                    <div className="space-y-3.5">
                                        <div
                                            className="rounded-[22px] border p-3.5 space-y-2.5"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <label
                                                className="block text-xs font-bold"
                                                style={{ color: colors.text }}
                                            >
                                                انتخاب جلسه برای ثبت حضور و غیاب:
                                            </label>
                                            <select
                                                value={selectedSessionId}
                                                onChange={(e) =>
                                                    setSelectedSessionId(Number(e.target.value))
                                                }
                                                className="w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            >
                                                {vipSessions.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        جلسه {faNum(s.number)} ({s.mode === 'in_person' ? 'حضوری' : 'مجازی'}) — {s.date}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="flex items-center justify-between pt-1">
                                                <span
                                                    className="text-[11px]"
                                                    style={{ color: colors.muted }}
                                                >
                                                    ساعت کلاس: {activeSession.time}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        sendSessionReminderToAll(activeSession.id)
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-[#0D2E22] font-black text-[11px]"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                    <span>ارسال یادآور کلاس به همه</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Summary Counts */}
                                        <div className="grid grid-cols-4 gap-2 text-center">
                                            {[
                                                {
                                                    label: 'حاضر حضوری',
                                                    count: vipStudents.filter(
                                                        (s) => s.status === 'present_in_person'
                                                    ).length,
                                                    tone: '#153F31',
                                                },
                                                {
                                                    label: 'حاضر آنلاین',
                                                    count: vipStudents.filter(
                                                        (s) => s.status === 'present_online'
                                                    ).length,
                                                    tone: '#0284C7',
                                                },
                                                {
                                                    label: 'با تاخیر',
                                                    count: vipStudents.filter(
                                                        (s) => s.status === 'late'
                                                    ).length,
                                                    tone: '#D97706',
                                                },
                                                {
                                                    label: 'غایب',
                                                    count: vipStudents.filter(
                                                        (s) => s.status === 'absent'
                                                    ).length,
                                                    tone: '#DC2626',
                                                },
                                            ].map((st) => (
                                                <div
                                                    key={st.label}
                                                    className="rounded-2xl border p-2"
                                                    style={{
                                                        backgroundColor: colors.surface,
                                                        borderColor: colors.border,
                                                    }}
                                                >
                                                    <div
                                                        className="font-black text-base"
                                                        style={{ color: st.tone }}
                                                    >
                                                        {faNum(st.count)}
                                                    </div>
                                                    <div
                                                        className="text-[10px]"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        {st.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Student Roster Cards */}
                                        <div className="space-y-2.5">
                                            {vipStudents.map((st) => (
                                                <div
                                                    key={st.id}
                                                    className="rounded-[20px] border p-3.5 space-y-2.5"
                                                    style={{
                                                        backgroundColor: colors.surface,
                                                        borderColor: st.isVip
                                                            ? '#F59E0B'
                                                            : colors.border,
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2.5">
                                                            <div
                                                                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                                                                style={{
                                                                    backgroundColor:
                                                                        colors.primarySoft,
                                                                    color: colors.primary,
                                                                }}
                                                            >
                                                                {st.name.slice(0, 1)}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span
                                                                        className="font-bold text-xs"
                                                                        style={{
                                                                            color: colors.text,
                                                                        }}
                                                                    >
                                                                        {st.name}
                                                                    </span>
                                                                    {st.isVip && (
                                                                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-400 text-[#0D2E22] font-black text-[9px]">
                                                                            <Crown className="w-2.5 h-2.5" />
                                                                            <span>VIP</span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className="text-[11px]"
                                                                    style={{
                                                                        color: colors.muted,
                                                                    }}
                                                                >
                                                                    {st.grade} · ثبت ورود: {st.checkInTime}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleStudentVipStamp(st.id)
                                                            }
                                                            className="text-[10px] font-bold px-2 py-1 rounded-lg border"
                                                            style={{
                                                                borderColor: colors.border,
                                                                color: st.isVip
                                                                    ? '#B45309'
                                                                    : colors.muted,
                                                            }}
                                                        >
                                                            {st.isVip ? 'مهر VIP فعال' : 'اعطای VIP'}
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                                                        {[
                                                            {
                                                                key: 'present_in_person' as const,
                                                                label: 'حاضر حضوری',
                                                                activeBg: '#153F31',
                                                            },
                                                            {
                                                                key: 'present_online' as const,
                                                                label: 'حاضر آنلاین',
                                                                activeBg: '#0284C7',
                                                            },
                                                            {
                                                                key: 'late' as const,
                                                                label: 'تاخیر',
                                                                activeBg: '#D97706',
                                                            },
                                                            {
                                                                key: 'absent' as const,
                                                                label: 'غایب',
                                                                activeBg: '#DC2626',
                                                            },
                                                        ].map((opt) => {
                                                            const active = st.status === opt.key;
                                                            return (
                                                                <button
                                                                    key={opt.key}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateStudentAttendance(
                                                                            st.id,
                                                                            opt.key
                                                                        )
                                                                    }
                                                                    className="py-1.5 rounded-xl text-[10px] font-bold transition"
                                                                    style={{
                                                                        backgroundColor: active
                                                                            ? opt.activeBg
                                                                            : colors.surfaceAlt,
                                                                        color: active
                                                                            ? '#FFFFFF'
                                                                            : colors.text,
                                                                    }}
                                                                >
                                                                    {opt.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: HYBRID SESSIONS & REMINDERS MANAGER */}
                                {vipManageTab === 'sessions' && (
                                    <div className="space-y-3.5">
                                        <div
                                            className="rounded-[22px] border p-4 space-y-3"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div
                                                className="font-bold text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                تعریف جلسه جدید (حضوری یا مجازی)
                                            </div>
                                            <input
                                                type="text"
                                                value={newSessionTitle}
                                                onChange={(e) =>
                                                    setNewSessionTitle(e.target.value)
                                                }
                                                placeholder="عنوان جلسه (مثلاً: کارگاه تصمیم‌گیری و حل مسئله)"
                                                className="w-full rounded-xl border px-3 py-2 text-xs outline-none"
                                                style={{
                                                    backgroundColor: colors.surfaceAlt,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setNewSessionMode('in_person')}
                                                    className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5"
                                                    style={{
                                                        backgroundColor:
                                                            newSessionMode === 'in_person'
                                                                ? colors.primary
                                                                : colors.surfaceAlt,
                                                        color:
                                                            newSessionMode === 'in_person'
                                                                ? '#FFFFFF'
                                                                : colors.text,
                                                        borderColor: colors.border,
                                                    }}
                                                >
                                                    <Building2 className="w-3.5 h-3.5" />
                                                    <span>کلاس حضوری</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewSessionMode('online')}
                                                    className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5"
                                                    style={{
                                                        backgroundColor:
                                                            newSessionMode === 'online'
                                                                ? colors.primary
                                                                : colors.surfaceAlt,
                                                        color:
                                                            newSessionMode === 'online'
                                                                ? '#FFFFFF'
                                                                : colors.text,
                                                        borderColor: colors.border,
                                                    }}
                                                >
                                                    <Video className="w-3.5 h-3.5" />
                                                    <span>کلاس مجازی</span>
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={newSessionDate}
                                                    onChange={(e) =>
                                                        setNewSessionDate(e.target.value)
                                                    }
                                                    placeholder="تاریخ جلسه"
                                                    className="rounded-xl border px-3 py-2 text-xs outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={newSessionTime}
                                                    onChange={(e) =>
                                                        setNewSessionTime(e.target.value)
                                                    }
                                                    placeholder="ساعت برگزاری"
                                                    className="rounded-xl border px-3 py-2 text-xs outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addVipSession}
                                                className="w-full py-2.5 rounded-xl text-xs font-bold text-white inline-flex items-center justify-center gap-1.5"
                                                style={{ backgroundColor: colors.primary }}
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>افزودن جلسه به تقویم دوره</span>
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {vipSessions.map((sess) => (
                                                <div
                                                    key={sess.id}
                                                    className="rounded-[20px] border p-3.5 flex items-center justify-between gap-2"
                                                    style={{
                                                        backgroundColor: colors.surface,
                                                        borderColor: colors.border,
                                                    }}
                                                >
                                                    <div className="space-y-1">
                                                        <div
                                                            className="font-bold text-xs"
                                                            style={{ color: colors.text }}
                                                        >
                                                            جلسه {faNum(sess.number)}: {sess.title}
                                                        </div>
                                                        <div
                                                            className="text-[11px]"
                                                            style={{ color: colors.muted }}
                                                        >
                                                            {sess.mode === 'in_person'
                                                                ? 'حضوری'
                                                                : 'مجازی'}{' '}
                                                            · {sess.date} · ساعت {sess.time}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            sendSessionReminderToAll(sess.id)
                                                        }
                                                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0"
                                                        style={{
                                                            backgroundColor: sess.reminderSent
                                                                ? colors.primarySoft
                                                                : '#FEF3C7',
                                                            color: sess.reminderSent
                                                                ? colors.primary
                                                                : '#92400E',
                                                        }}
                                                    >
                                                        {sess.reminderSent
                                                            ? 'یادآور ارسال شد'
                                                            : 'ارسال یادآور'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: COURSE DESCRIPTION, ITEMS, GROUP CHAT & POSTER SETTINGS */}
                                {vipManageTab === 'settings' && (
                                    <div className="space-y-3.5">
                                        {/* Admin Group Chat Enable/Disable & Course Poster Control */}
                                        <div
                                            className="rounded-[22px] border p-4 space-y-3"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="space-y-0.5">
                                                    <div
                                                        className="font-black text-xs flex items-center gap-1.5"
                                                        style={{ color: colors.text }}
                                                    >
                                                        <Users
                                                            className="w-4 h-4"
                                                            style={{ color: colors.primary }}
                                                        />
                                                        <span>گروه تخصصی گفتگوی اعضای دوره</span>
                                                    </div>
                                                    <div
                                                        className="text-[11px]"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        {groupChatEnabled
                                                            ? 'دانش‌پذیران می‌توانند در گروه دوره پیام ارسال کنند'
                                                            : 'ارسال پیام توسط دانش‌پذیران غیرفعال شده است (قفل ادمین)'}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setGroupChatEnabled((prev) => !prev);
                                                        showToast(
                                                            !groupChatEnabled
                                                                ? 'ارسال پیام در گروه تخصصی دوره فعال شد.'
                                                                : 'ارسال پیام در گروه تخصصی دوره توسط ادمین غیرفعال شد.'
                                                        );
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black shrink-0 inline-flex items-center gap-1 ${
                                                        groupChatEnabled
                                                            ? 'bg-emerald-500/15 text-emerald-600'
                                                            : 'bg-amber-500/15 text-amber-600'
                                                    }`}
                                                >
                                                    {groupChatEnabled ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span>فعال (امکان چت)</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="w-3.5 h-3.5" />
                                                            <span>غیرفعال توسط ادمین</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <div
                                                className="pt-3 border-t flex items-center gap-3"
                                                style={{ borderColor: colors.border }}
                                            >
                                                <img
                                                    src={vipConfig.posterUrl}
                                                    alt="پوستر دوره"
                                                    className="w-12 h-16 rounded-xl object-cover border shrink-0"
                                                    style={{ borderColor: colors.border }}
                                                />
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <label
                                                        className="text-[11px] font-bold block"
                                                        style={{ color: colors.muted }}
                                                    >
                                                        برچسب روی پوستر دوره (مشابه سایت):
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={vipConfig.posterBadge}
                                                        onChange={(e) =>
                                                            setVipConfig({
                                                                ...vipConfig,
                                                                posterBadge: e.target.value,
                                                            })
                                                        }
                                                        className="roshd-app-input w-full rounded-xl border px-3 py-1.5 text-xs outline-none"
                                                        style={{
                                                            backgroundColor: colors.surfaceAlt,
                                                            borderColor: colors.border,
                                                            color: colors.text,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="rounded-[22px] border p-4 space-y-3"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div
                                                className="font-bold text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                تنظیمات معرفی و توضیحات دوره
                                            </div>
                                            <div className="space-y-1">
                                                <label
                                                    className="text-[11px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    عنوان دوره پرچمدار:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={vipConfig.title}
                                                    onChange={(e) =>
                                                        setVipConfig({
                                                            ...vipConfig,
                                                            title: e.target.value,
                                                        })
                                                    }
                                                    className="roshd-app-input w-full rounded-xl border px-3 py-2 text-xs outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label
                                                    className="text-[11px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    توضیحات معرفی دوره:
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={vipConfig.description}
                                                    onChange={(e) =>
                                                        setVipConfig({
                                                            ...vipConfig,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    className="roshd-app-input w-full rounded-xl border px-3 py-2 text-xs outline-none leading-5"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label
                                                    className="text-[11px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    محل برگزاری کلاس‌های حضوری:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={vipConfig.inPersonLocation}
                                                    onChange={(e) =>
                                                        setVipConfig({
                                                            ...vipConfig,
                                                            inPersonLocation: e.target.value,
                                                        })
                                                    }
                                                    className="roshd-app-input w-full rounded-xl border px-3 py-2 text-xs outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label
                                                    className="text-[11px] font-bold"
                                                    style={{ color: colors.muted }}
                                                >
                                                    برنامه زمانی کلاس‌ها (حضوری و مجازی):
                                                </label>
                                                <input
                                                    type="text"
                                                    value={vipConfig.scheduleSummary}
                                                    onChange={(e) =>
                                                        setVipConfig({
                                                            ...vipConfig,
                                                            scheduleSummary: e.target.value,
                                                        })
                                                    }
                                                    className="roshd-app-input w-full rounded-xl border px-3 py-2 text-xs outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    showToast('تنظیمات دوره طراحی آینده نوجوان ذخیره شد.')
                                                }
                                                className="w-full py-2.5 rounded-xl text-xs font-bold text-white"
                                                style={{ backgroundColor: colors.primary }}
                                            >
                                                ذخیره تغییرات معرفی دوره
                                            </button>
                                        </div>

                                        {/* Manage Course Items & Capabilities */}
                                        <div
                                            className="rounded-[22px] border p-4 space-y-3"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <div
                                                className="font-bold text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                مدیریت آیتم‌ها و قابلیت‌های دوره VIP
                                            </div>

                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newFeatureText}
                                                    onChange={(e) =>
                                                        setNewFeatureText(e.target.value)
                                                    }
                                                    placeholder="آیتم یا قابلیت جدید دوره..."
                                                    className="roshd-app-input flex-1 rounded-xl border px-3 py-2 text-xs outline-none"
                                                    style={{
                                                        backgroundColor: colors.surfaceAlt,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addVipFeature}
                                                    className="px-3 py-2 rounded-xl text-xs font-bold text-white shrink-0"
                                                    style={{ backgroundColor: colors.primary }}
                                                >
                                                    افزودن
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {vipFeatures.map((feat) => (
                                                    <div
                                                        key={feat.id}
                                                        onClick={() => toggleVipFeature(feat.id)}
                                                        className="p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer"
                                                        style={{
                                                            backgroundColor: colors.surfaceAlt,
                                                            borderColor: colors.border,
                                                            color: colors.text,
                                                        }}
                                                    >
                                                        <span
                                                            className={
                                                                feat.active
                                                                    ? 'font-medium'
                                                                    : 'line-through opacity-50'
                                                            }
                                                        >
                                                            {feat.title}
                                                        </span>
                                                        <span
                                                            className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                                                            style={{
                                                                backgroundColor: feat.active
                                                                    ? colors.primarySoft
                                                                    : colors.border,
                                                                color: feat.active
                                                                    ? colors.primary
                                                                    : colors.muted,
                                                            }}
                                                        >
                                                            {feat.active ? 'فعال' : 'غیرفعال'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ==================== ADMIN SCREEN (پنل مدیریت داینامیک سایت و اپلیکیشن) ==================== */}
                        {activeScreen === 'admin' && (() => {
                            const presentCount = vipStudents.filter(
                                (s) => s.status !== 'absent'
                            ).length;
                            const attendanceAvg = Math.round(
                                (presentCount / Math.max(1, vipStudents.length)) * 100
                            );
                            const openTicketsCount = supportTickets.filter(
                                (t) => t.status === 'open'
                            ).length;
                            const totalWalletVolume = walletOrders.reduce(
                                (acc, o) => acc + o.amount,
                                0
                            );
                            return (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('profile')}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                            <span>بازگشت به حساب من</span>
                                        </button>
                                        <Link
                                            href="/admin/dashboard"
                                            className="px-3 py-1.5 rounded-xl bg-[#123E30] text-[#D6F39A] text-xs font-bold"
                                        >
                                            پنل مدیریت کامل وب‌سایت
                                        </Link>
                                    </div>

                                    <h1
                                        className="font-black text-xl"
                                        style={{ color: colors.text }}
                                    >
                                        پنل مدیریت یکپارچه سایت و اپلیکیشن (Admin)
                                    </h1>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            {
                                                label: 'اعضای فعال دوره VIP',
                                                value: `${faNum(vipStudents.length)} نفر`,
                                            },
                                            {
                                                label: 'حضور لحظه‌ای در کلاس',
                                                value: `${faNum(attendanceAvg)}٪`,
                                            },
                                            {
                                                label: 'گردش کیف پول و سفارش‌ها',
                                                value: formatPrice(totalWalletVolume),
                                            },
                                            {
                                                label: 'تیکت‌های منتظر پاسخ',
                                                value: `${faNum(openTicketsCount)} مورد`,
                                            },
                                        ].map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="rounded-2xl border p-4"
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <div
                                                    className="text-xs"
                                                    style={{ color: colors.muted }}
                                                >
                                                    {stat.label}
                                                </div>
                                                <div
                                                    className="font-black text-base mt-1"
                                                    style={{ color: colors.primary }}
                                                >
                                                    {stat.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dynamic Coach Evaluation Editor (Directly updates Student Profile & Website /profile) */}
                                    <div
                                        className="rounded-[22px] border p-4 space-y-3"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="font-black text-xs"
                                                style={{ color: colors.text }}
                                            >
                                                ویرایش نمرات استعدادیابی دانش‌پذیر ({userProfile.name})
                                            </span>
                                            <span
                                                className="text-[10px] font-bold"
                                                style={{ color: colors.primary }}
                                            >
                                                همگام با صفحه پروفایل سایت
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {talentDimensions.map((dim) => (
                                                <div key={dim.id} className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs font-bold">
                                                        <span style={{ color: colors.text }}>
                                                            {dim.title}
                                                        </span>
                                                        <span style={{ color: colors.primary }}>
                                                            {faNum(dim.score)}٪
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={40}
                                                        max={100}
                                                        value={dim.score}
                                                        onChange={(e) => {
                                                            const nextScore = Number(e.target.value);
                                                            updateAppState((prev) => ({
                                                                ...prev,
                                                                talentDimensions:
                                                                    prev.talentDimensions.map((d) =>
                                                                        d.id === dim.id
                                                                            ? { ...d, score: nextScore }
                                                                            : d
                                                                    ),
                                                            }));
                                                        }}
                                                        className="w-full accent-[#153F31] cursor-pointer"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('vipManage')}
                                            className="w-full py-3.5 rounded-2xl bg-[#123E30] text-[#D6F39A] font-black text-xs inline-flex items-center justify-center gap-2"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>مدیریت حضور و غیاب و جلسات دوره VIP</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScreen('support')}
                                            className="w-full py-3.5 rounded-2xl border font-black text-xs inline-flex items-center justify-center gap-2"
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            }}
                                        >
                                            <MessageCircle className="w-4 h-4" style={{ color: colors.primary }} />
                                            <span>پاسخگویی به تیکت‌های پشتیبانی ({faNum(supportTickets.length)})</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Sticky Bottom RoshdTabBar (6 Tabs including گفتگو) */}
                    <div
                        className="sticky bottom-0 z-40 border-t px-2 pt-2 pb-3 flex items-center justify-around shrink-0 shadow-lg"
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        }}
                    >
                        <div className="w-full max-w-3xl mx-auto flex items-center justify-around">
                            {[
                                { id: 'home' as ScreenId, label: 'خانه', Icon: Home },
                                { id: 'courses' as ScreenId, label: 'دوره‌ها', Icon: GraduationCap },
                                { id: 'chat' as ScreenId, label: 'گفتگو', Icon: MessageSquare },
                                { id: 'shop' as ScreenId, label: 'فروشگاه', Icon: ShoppingBag },
                                { id: 'dashboard' as ScreenId, label: 'رشد من', Icon: Leaf },
                                { id: 'profile' as ScreenId, label: 'حساب من', Icon: User },
                            ].map((tab) => {
                                const active = activeTab === tab.id;
                                const TabIcon = tab.Icon;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveScreen(tab.id)}
                                        className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[52px]"
                                    >
                                        <div
                                            className="w-12 h-[30px] rounded-[15px] flex items-center justify-center transition relative"
                                            style={{
                                                backgroundColor: active
                                                    ? colors.primarySoft
                                                    : 'transparent',
                                            }}
                                        >
                                            <TabIcon
                                                className="w-4.5 h-4.5"
                                                style={{
                                                    color: active ? colors.primary : colors.muted,
                                                }}
                                            />
                                        </div>
                                        <span
                                            className="text-[11px]"
                                            style={{
                                                fontWeight: active ? 700 : 400,
                                                color: active ? colors.primary : colors.muted,
                                            }}
                                        >
                                            {tab.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
