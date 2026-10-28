import { useState } from 'react';
import {
    BellRing,
    Calendar,
    CheckCircle2,
    Clock,
    Flame,
    PhoneCall,
    Send,
    Settings,
    ShieldCheck,
    Smartphone,
    Sparkles,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { vibrate } from '@/lib/haptics';

export interface ReminderSettingsState {
    smsEnabled: boolean;
    eitaaEnabled: boolean;
    inAppEnabled: boolean;
    incompleteCourseReminders: boolean;
    courseFrequency: 'every_2_days' | 'every_3_days' | 'weekends';
    courseTime: string;
    coachingReminders: boolean;
    coaching24h: boolean;
    coaching1h: boolean;
    coaching15m: boolean;
    notifyParent: boolean;
}

export default function AutomatedRemindersWidget() {
    const [settings, setSettings] = useState<ReminderSettingsState>({
        smsEnabled: true,
        eitaaEnabled: true,
        inAppEnabled: true,
        incompleteCourseReminders: true,
        courseFrequency: 'every_2_days',
        courseTime: '18:00',
        coachingReminders: true,
        coaching24h: true,
        coaching1h: true,
        coaching15m: true,
        notifyParent: true,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [savedToast, setSavedToast] = useState(false);
    const [testSmsSent, setTestSmsSent] = useState(false);
    const [activeTab, setActiveTab] = useState<'triggers' | 'settings'>('triggers');

    const handleToggle = (key: keyof ReminderSettingsState) => {
        vibrate();
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = () => {
        vibrate();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSavedToast(true);
            setTimeout(() => setSavedToast(false), 3500);
        }, 500);
    };

    const handleSendTestSms = () => {
        vibrate();
        setTestSmsSent(true);
        setTimeout(() => setTestSmsSent(false), 5000);
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-[#0f241a]/90">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/5 pb-5 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 font-black text-slate-950 shadow-md shadow-amber-500/25">
                        <BellRing className="size-5 animate-pulse" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-black text-navy dark:text-white md:text-lg">
                                یادآوری‌های خودکار دوره‌ها و جلسات کوچینگ
                            </h2>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.68rem] font-black text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/30">
                                فعال · نرخ تکمیل +۶۴٪
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-navy/50 dark:text-white/50">
                            ارسال هوشمند پیامک و اعلان برای دوره‌های ناتمام و جلسات رزروشده تا هیچ فرصت رشدی از دست نرود.
                        </p>
                    </div>
                </div>

                {/* Tabs Switcher */}
                <div className="flex rounded-xl bg-navy/5 p-1 text-xs font-bold dark:bg-white/10">
                    <button
                        type="button"
                        onClick={() => {
                            vibrate();
                            setActiveTab('triggers');
                        }}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            activeTab === 'triggers'
                                ? 'bg-white font-black text-navy shadow-sm dark:bg-emerald-500 dark:text-slate-950'
                                : 'text-navy/60 hover:text-navy dark:text-white/70 dark:hover:text-white'
                        }`}
                    >
                        صف یادآوری‌های برنامه‌ریزی‌شده
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            vibrate();
                            setActiveTab('settings');
                        }}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            activeTab === 'settings'
                                ? 'bg-white font-black text-navy shadow-sm dark:bg-emerald-500 dark:text-slate-950'
                                : 'text-navy/60 hover:text-navy dark:text-white/70 dark:hover:text-white'
                        }`}
                    >
                        تنظیمات زمان و کانال‌ها
                    </button>
                </div>
            </div>

            {/* Success Toast */}
            {savedToast && (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-400/40 bg-emerald-500/15 p-4 text-xs font-black text-emerald-800 dark:text-emerald-200">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <span>تنظیمات یادآوری خودکار با موفقیت ذخیره شد.</span>
                    </div>
                    <span className="text-[0.68rem] opacity-75">همگام‌سازی با سامانه پیامکی کاوانگار</span>
                </div>
            )}

            {testSmsSent && (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-400/40 bg-amber-500/15 p-4 text-xs font-black text-amber-900 dark:text-amber-200">
                    <div className="flex items-center gap-2">
                        <Send className="size-4 text-amber-500" />
                        <span>یک پیامک آزمایشی با الگوی یادآوری به شماره ۰۹۱۲۳۴۵۶۷۸۹ ارسال شد.</span>
                    </div>
                    <span className="text-[0.68rem] opacity-75">تحویل به مخابرات</span>
                </div>
            )}

            {/* TAB 1: Scheduled Queue & Value Banner */}
            {activeTab === 'triggers' && (
                <div className="mt-6 space-y-6">
                    {/* Value Proposition Stat Bar */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-white/10 dark:bg-white/5">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                                <TrendingUp className="size-5" />
                            </span>
                            <div>
                                <span className="text-[0.68rem] font-bold text-emerald-800 dark:text-emerald-300">افزایش نرخ پایان دوره</span>
                                <strong className="mt-0.5 block text-lg font-black text-navy dark:text-white">+۶۴٪ رشد</strong>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-white/10 dark:bg-white/5">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                                <Calendar className="size-5" />
                            </span>
                            <div>
                                <span className="text-[0.68rem] font-bold text-amber-800 dark:text-amber-300">حضور به‌موقع در جلسات</span>
                                <strong className="mt-0.5 block text-lg font-black text-navy dark:text-white">۹۸٪ بدون غیبت</strong>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-brand-200/60 bg-brand-50/40 p-4 dark:border-white/10 dark:bg-white/5">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
                                <Flame className="size-5" />
                            </span>
                            <div>
                                <span className="text-[0.68rem] font-bold text-brand-800 dark:text-brand-300">حفظ استریک یادگیری</span>
                                <strong className="mt-0.5 block text-lg font-black text-navy dark:text-white">۳ روز متوالی 🔥</strong>
                            </div>
                        </div>
                    </div>

                    {/* Active Queue List */}
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-black text-navy dark:text-white">
                                نوبت‌های خودکار در صف ارسال (Active Reminder Queue):
                            </span>
                            <button
                                type="button"
                                onClick={handleSendTestSms}
                                className="inline-flex items-center gap-1.5 text-xs font-black text-brand-700 hover:underline dark:text-brand-300"
                            >
                                <Smartphone className="size-3.5" />
                                تست ارسال فوری پیامک آزمایشی
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Trigger 1: Incomplete Course */}
                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy/5 bg-soft-gray/60 p-4 transition-all hover:bg-white hover:shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-white/10 dark:text-brand-300">
                                        <Clock className="size-5" />
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <strong className="text-xs font-black text-navy dark:text-white">
                                                یادآوری استمرار دوره ناتمام: «طراحی مسیر آینده»
                                            </strong>
                                            <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[0.62rem] font-bold text-brand-800 dark:bg-white/10 dark:text-brand-300">
                                                ۴۰٪ باقیمانده
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[0.68rem] text-navy/50 dark:text-white/50">
                                            متن پیامک: «سلام سجاد عزیز، درس جدید هوش‌های چندگانه منتظر شماست. فقط ۱۵ دقیقه تا پایان فصل اول.»
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-navy/60 dark:text-white/60">
                                        زمان ارسال: <strong className="text-navy dark:text-white">فردا ساعت ۱۸:۰۰</strong>
                                    </span>
                                    <span className="rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-black text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300">
                                        پیامک + ایتا
                                    </span>
                                </div>
                            </div>

                            {/* Trigger 2: Coaching Session */}
                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy/5 bg-soft-gray/60 p-4 transition-all hover:bg-white hover:shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-white/10 dark:text-amber-300">
                                        <Calendar className="size-5" />
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <strong className="text-xs font-black text-navy dark:text-white">
                                                یادآوری جلسه آنلاین کوچینگ با دکتر علیرضا بیدی
                                            </strong>
                                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[0.62rem] font-bold text-amber-800 dark:bg-white/10 dark:text-amber-300">
                                                ۱ ساعت قبل
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[0.68rem] text-navy/50 dark:text-white/50">
                                            متن پیامک: «جلسه استعدادیابی شما امروز ساعت ۱۶:۰۰ برگزار می‌شود. لینک ورود مستقیم به اتاق تصویری: https://markazbidi.ir/meet»
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-navy/60 dark:text-white/60">
                                        زمان ارسال: <strong className="text-navy dark:text-white">پنج‌شنبه ساعت ۱۵:۰۰</strong>
                                    </span>
                                    <span className="rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1 text-[0.65rem] font-black text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300">
                                        دانش‌آموز + والد
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Detailed Configurations */}
            {activeTab === 'settings' && (
                <div className="mt-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Section A: Incomplete Course Automation */}
                        <div className="rounded-2xl border border-navy/5 bg-soft-gray/40 p-5 dark:border-white/5 dark:bg-white/[0.02]">
                            <div className="flex items-center justify-between border-b border-navy/5 pb-3 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-brand-600 dark:text-brand-300" />
                                    <strong className="text-xs font-black text-navy dark:text-white">
                                        یادآوری دوره‌ها و درس‌های ناتمام
                                    </strong>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('incompleteCourseReminders')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        settings.incompleteCourseReminders ? 'bg-brand-600' : 'bg-navy/20 dark:bg-white/20'
                                    }`}
                                >
                                    <span
                                        className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                                            settings.incompleteCourseReminders ? 'translate-x-1' : 'translate-x-6'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs">
                                <div>
                                    <label className="mb-1 block font-bold text-navy/70 dark:text-white/70">
                                        فاصله زمانی ارسال در صورت عدم ورود:
                                    </label>
                                    <select
                                        value={settings.courseFrequency}
                                        onChange={(e) => setSettings({ ...settings, courseFrequency: e.target.value as any })}
                                        className="w-full rounded-xl border border-navy/10 bg-white p-2.5 font-bold text-navy outline-none dark:border-white/10 dark:bg-[#0c1f17] dark:text-white"
                                    >
                                        <option value="every_2_days">هر ۲ روز یک‌بار (پیشنهادی جهت حفظ تمرکز)</option>
                                        <option value="every_3_days">هر ۳ روز یک‌بار</option>
                                        <option value="weekends">فقط آخر هفته‌ها (پنج‌شنبه و جمعه)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block font-bold text-navy/70 dark:text-white/70">
                                        ساعت ترجیحی ارسال پیامک:
                                    </label>
                                    <select
                                        value={settings.courseTime}
                                        onChange={(e) => setSettings({ ...settings, courseTime: e.target.value })}
                                        className="w-full rounded-xl border border-navy/10 bg-white p-2.5 font-bold text-navy outline-none dark:border-white/10 dark:bg-[#0c1f17] dark:text-white"
                                    >
                                        <option value="16:00">عصر ساعت ۱۶:۰۰ (بعد از مدرسه)</option>
                                        <option value="18:00">عصر ساعت ۱۸:۰۰ (ساعت مطالعه خانگی)</option>
                                        <option value="20:00">شب ساعت ۲۰:۰۰</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section B: Coaching Session Automation */}
                        <div className="rounded-2xl border border-navy/5 bg-soft-gray/40 p-5 dark:border-white/5 dark:bg-white/[0.02]">
                            <div className="flex items-center justify-between border-b border-navy/5 pb-3 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4 text-amber-600 dark:text-amber-300" />
                                    <strong className="text-xs font-black text-navy dark:text-white">
                                        یادآوری جلسات کوچینگ و مشاوره
                                    </strong>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('coachingReminders')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        settings.coachingReminders ? 'bg-amber-500' : 'bg-navy/20 dark:bg-white/20'
                                    }`}
                                >
                                    <span
                                        className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                                            settings.coachingReminders ? 'translate-x-1' : 'translate-x-6'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="mt-4 space-y-2.5 text-xs">
                                <label className="flex items-center justify-between rounded-xl bg-white p-2.5 font-bold text-navy dark:bg-white/5 dark:text-white">
                                    <span>ارسال یادآوری ۲۴ ساعت قبل از جلسه</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.coaching24h}
                                        onChange={() => handleToggle('coaching24h')}
                                        className="size-4 rounded text-amber-500 focus:ring-amber-400"
                                    />
                                </label>

                                <label className="flex items-center justify-between rounded-xl bg-white p-2.5 font-bold text-navy dark:bg-white/5 dark:text-white">
                                    <span>ارسال لینک ورود ۱ ساعت قبل از جلسه</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.coaching1h}
                                        onChange={() => handleToggle('coaching1h')}
                                        className="size-4 rounded text-amber-500 focus:ring-amber-400"
                                    />
                                </label>

                                <label className="flex items-center justify-between rounded-xl bg-white p-2.5 font-bold text-navy dark:bg-white/5 dark:text-white">
                                    <span>ارسال پیامک اضطراری ۱۵ دقیقه قبل</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.coaching15m}
                                        onChange={() => handleToggle('coaching15m')}
                                        className="size-4 rounded text-amber-500 focus:ring-amber-400"
                                    />
                                </label>

                                <label className="flex items-center justify-between rounded-xl bg-white p-2.5 font-bold text-navy dark:bg-white/5 dark:text-white">
                                    <span>ارسال نسخه همزمان به شماره سرپرست (والد)</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifyParent}
                                        onChange={() => handleToggle('notifyParent')}
                                        className="size-4 rounded text-amber-500 focus:ring-amber-400"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Channels & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-navy/5 pt-4 dark:border-white/10">
                        <div className="flex items-center gap-4 text-xs font-bold text-navy/70 dark:text-white/70">
                            <span>کانال‌های دریافت:</span>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.smsEnabled}
                                    onChange={() => handleToggle('smsEnabled')}
                                    className="size-4 rounded text-brand-600 focus:ring-brand-500"
                                />
                                <span>پیامک مخابراتی (فوری)</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.eitaaEnabled}
                                    onChange={() => handleToggle('eitaaEnabled')}
                                    className="size-4 rounded text-brand-600 focus:ring-brand-500"
                                />
                                <span>پیام‌رسان ایتا</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-brand-600/25 transition-all hover:bg-brand-500 active:scale-[0.98]"
                            >
                                <CheckCircle2 className="size-4" />
                                {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات یادآوری'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
