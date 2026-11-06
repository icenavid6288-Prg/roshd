import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Bell,
    CheckCircle2,
    Compass,
    Crown,
    LockKeyhole,
    Plus,
    Receipt,
    Send,
    ShieldCheck,
    Smartphone,
    UserRound,
    Wallet,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatNumber, formatPrice } from '@/lib/format';
import {
    calculateLevelProgress,
    defaultEarnedBadges,
    defaultNotificationSettings,
    defaultTalentDimensions,
    defaultUserProfile,
    defaultWalletOrders,
    topUpWallet,
    type SmartNotificationSettings,
    type WalletOrder,
} from '@/lib/profileLogic';
import type { PageProps } from '@/types';

import { useDynamicAppStore } from '@/lib/dynamicAppStore';

export default function Edit({ mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { appState, updateAppState } = useDynamicAppStore();
    const {
        userProfile: profileState,
        walletOrders,
        notifSettings,
        talentDimensions,
        earnedBadges,
    } = appState;
    const [toastBanner, setToastBanner] = useState<string | null>(null);

    const levelProgress = calculateLevelProgress(profileState.xp, profileState.nextLevelXp);

    const showFeedback = (msg: string) => {
        setToastBanner(msg);
        setTimeout(() => setToastBanner(null), 3500);
    };

    const handleWalletTopUp = (amount: number) => {
        const result = topUpWallet(profileState.walletBalance, amount, walletOrders);
        updateAppState((prev) => ({
            ...prev,
            userProfile: { ...prev.userProfile, walletBalance: result.balance },
            walletOrders: result.orders,
        }));
        showFeedback(`کیف پول شما به مبلغ ${formatPrice(amount)} با موفقیت شارژ شد و با اپلیکیشن همگام گردید.`);
    };

    const toggleNotif = (key: keyof SmartNotificationSettings) => {
        updateAppState((prev) => ({
            ...prev,
            notifSettings: {
                ...prev.notifSettings,
                [key]: !prev.notifSettings[key],
            },
        }));
        showFeedback('تنظیمات پیامک و اعلان هوشمند ذخیره و با اپلیکیشن همگام شد.');
    };

    const sendParentReportNow = () => {
        const nowLabel = 'هم‌اکنون · ارسال پیامکی به والدین';
        updateAppState((prev) => ({
            ...prev,
            userProfile: { ...prev.userProfile, lastParentReportSentAt: nowLabel },
        }));
        showFeedback(`کارنامه هفتگی و گزارش حضور به شماره والدین (${profileState.parentPhone}) پیامک شد.`);
    };

    return (
        <UserDashboardLayout>
            <Head title="پروفایل جامع رشد و کیف پول" />
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                {toastBanner && (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-[#D6F39A]/50 bg-[#123E30] px-5 py-3.5 text-xs font-black text-white shadow-lift">
                        <CheckCircle2 className="size-4 shrink-0 text-[#D6F39A]" />
                        <span>{toastBanner}</span>
                    </div>
                )}

                {/* ── 1. VIP Growth Identity Header (No QR Code) ── */}
                <section className="profile-hero relative overflow-hidden rounded-[2rem] bg-deep-gradient p-6 text-white shadow-lift md:p-8">
                    <div className="pointer-events-none absolute -left-16 -top-20 size-72 rounded-full bg-brand-400/20 blur-3xl" aria-hidden />
                    <div className="relative flex flex-wrap items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <span className="flex size-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/15 text-2xl font-black text-amber-300 backdrop-blur-md">
                                {profileState.name.slice(0, 1)}
                            </span>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-2xl font-black">{profileState.name}</h2>
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-2.5 py-0.5 text-xs font-black text-[#0D2E22]">
                                        <Crown className="size-3.5" />
                                        {profileState.studentCode}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs font-bold text-brand-200">
                                    {profileState.gradeAndField} · {profileState.city}
                                </p>
                                <p className="mt-1 text-xs text-white/75">{profileState.bio}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <button
                                type="button"
                                onClick={sendParentReportNow}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#D6F39A] px-4 py-2.5 text-xs font-black text-[#123E30] transition hover:brightness-105"
                            >
                                <Send className="size-3.5" />
                                ارسال آنی کارنامه به والدین
                            </button>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-white/20"
                            >
                                <ArrowLeft className="size-4" /> بازگشت به داشبورد
                            </Link>
                        </div>
                    </div>

                    {/* Level & XP Bar */}
                    <div className="relative mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between text-xs font-black">
                            <span className="text-amber-300">
                                سطح {formatNumber(profileState.levelNumber)}: {profileState.levelTitle}
                            </span>
                            <span className="text-white/85">
                                {formatNumber(profileState.xp)} از {formatNumber(profileState.nextLevelXp)} امتیاز رشد ({formatNumber(levelProgress)}٪)
                            </span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/30">
                            <div
                                className="h-full rounded-full bg-gradient-to-l from-amber-400 to-[#D6F39A]"
                                style={{ width: `${levelProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* 3 Key Metrics */}
                    <div className="relative mt-4 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                            <div className="text-lg font-black text-white">{formatNumber(profileState.learningHours)} ساعت</div>
                            <div className="text-[0.7rem] text-white/65">ساعت آموزش</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                            <div className="text-lg font-black text-amber-300">{formatNumber(profileState.attendanceRate)}٪ حضور</div>
                            <div className="text-[0.7rem] text-white/65">نظم کلاس VIP</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                            <div className="text-lg font-black text-[#D6F39A]">{formatNumber(profileState.badgesCount)} دستاورد</div>
                            <div className="text-[0.7rem] text-white/65">نشان و مدرک</div>
                        </div>
                    </div>
                </section>

                {/* ── 2. Teen Talent Assessment Dossier & Earned Badges ── */}
                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="profile-surface rounded-3xl p-6 md:p-7">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="profile-icon"><Compass className="size-5" /></span>
                            <div>
                                <h2 className="text-lg font-black text-navy">پرونده استعدادیابی نوجوان و بازخورد کوچ</h2>
                                <p className="text-xs text-navy/55">ارزیابی ۳ شاخص کلیدی در کارگاه‌های حضوری و آنلاین</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {talentDimensions.map((dim) => (
                                <div key={dim.id} className="rounded-2xl border border-navy/10 bg-[#fafbf7] p-4">
                                    <div className="flex items-center justify-between text-xs font-black text-navy">
                                        <span>{dim.title}</span>
                                        <span className="text-brand-700">{formatNumber(dim.score)}٪</span>
                                    </div>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy/10">
                                        <div className="h-full rounded-full bg-brand-600" style={{ width: `${dim.score}%` }} />
                                    </div>
                                    <p className="mt-2 text-xs text-navy/60">{dim.summary}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="profile-surface rounded-3xl p-6 md:p-7 flex flex-col justify-between">
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <span className="profile-icon profile-icon-gold"><Award className="size-5" /></span>
                                <div>
                                    <h2 className="text-lg font-black text-navy">نشان‌ها و دستاوردهای کسب‌شده</h2>
                                    <p className="text-xs text-navy/55">امتیازهای مسیر رشد و خوش‌قولی در دوره VIP</p>
                                </div>
                            </div>
                            <div className="grid gap-3">
                                {earnedBadges.map((badge) => (
                                    <div key={badge.id} className="flex items-center justify-between rounded-2xl border border-navy/10 bg-[#fafbf7] p-4">
                                        <div>
                                            <div className="text-sm font-black text-navy">{badge.title}</div>
                                            <div className="mt-0.5 text-xs text-navy/60">{badge.subtitle}</div>
                                        </div>
                                        <span className="text-xs font-bold text-brand-700">{badge.earnedDate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Smart Notifications & Parent SMS */}
                        <div className="mt-6 border-t border-navy/10 pt-5">
                            <div className="mb-3 flex items-center gap-2 text-sm font-black text-navy">
                                <Bell className="size-4 text-brand-600" />
                                تنظیمات پیامک هوشمند و گزارش والدین ({profileState.parentPhone})
                            </div>
                            <div className="space-y-2.5 text-xs">
                                {[
                                    { key: 'classSmsTwoHoursBefore' as const, label: 'پیامک یادآوری ۲ ساعت قبل از شروع هر کلاس' },
                                    { key: 'parentAttendanceSms' as const, label: 'ارسال خودکار وضعیت حضور و غیاب به والدین' },
                                    { key: 'dailyGoalAndHomeworkPush' as const, label: 'یادآوری تمرین روزانه و بوم هدف‌گذاری ۹۰ روزه' },
                                ].map((item) => (
                                    <label key={item.key} className="flex cursor-pointer items-center justify-between rounded-xl border border-navy/10 bg-white px-3.5 py-2.5 font-bold text-navy">
                                        <span>{item.label}</span>
                                        <input
                                            type="checkbox"
                                            checked={notifSettings[item.key]}
                                            onChange={() => toggleNotif(item.key)}
                                            className="size-4 rounded text-brand-600 focus:ring-brand-500"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 3. Roshd Wallet, Instant Top-Up & Invoices ── */}
                <section className="profile-surface rounded-3xl p-6 md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 pb-5">
                        <div className="flex items-center gap-3">
                            <span className="profile-icon"><Wallet className="size-5" /></span>
                            <div>
                                <h2 className="text-lg font-black text-navy">کیف پول رشد و سوابق مالی</h2>
                                <p className="text-xs text-navy/55">
                                    موجودی فعلی: <strong className="text-brand-700">{formatPrice(profileState.walletBalance)}</strong> · اعتبار هدیه دعوت دوستان: <strong>{formatPrice(profileState.giftCredit)}</strong>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {[200000, 500000, 1000000].map((amt) => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => handleWalletTopUp(amt)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#123E30] px-4 py-2.5 text-xs font-black text-[#D6F39A] transition hover:brightness-110"
                                >
                                    <Plus className="size-3.5" />
                                    شارژ {formatPrice(amt)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {walletOrders.map((ord) => (
                            <div key={ord.id} className="flex flex-col justify-between rounded-2xl border border-navy/10 bg-[#fafbf7] p-4">
                                <div>
                                    <div className="flex items-center justify-between text-xs font-bold text-navy/50">
                                        <span>{ord.category}</span>
                                        <span className="font-mono">{ord.invoiceCode}</span>
                                    </div>
                                    <h3 className="mt-2 text-xs font-black text-navy">{ord.title}</h3>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-navy/10 pt-3 text-xs font-bold">
                                    <span className="text-navy/55">{ord.date}</span>
                                    <span className="font-black text-brand-700">{formatPrice(ord.amount)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 4. Account Information Form & Security Status ── */}
                <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="profile-surface rounded-3xl p-6 md:p-8">
                        <div className="mb-6 flex items-start gap-3"><span className="profile-icon"><UserRound className="size-5" /></span><div><h2 className="text-lg font-black text-navy">ویرایش اطلاعات حساب</h2><p className="mt-1 text-xs leading-6 text-navy/50">نام و شماره موبایل حساب خود را به‌روز نگه دارید.</p></div></div>
                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                    </div>

                    <aside className="profile-surface rounded-3xl p-6 md:p-8">
                        <div className="mb-6 flex items-start gap-3"><span className="profile-icon profile-icon-gold"><ShieldCheck className="size-5" /></span><div><h2 className="text-lg font-black text-navy">وضعیت حساب</h2><p className="mt-1 text-xs leading-6 text-navy/50">اطلاعات امنیتی و آخرین گزارش والدین</p></div></div>
                        <div className="flex flex-col gap-3">
                            <div className="profile-status-row"><Smartphone className="size-4 text-brand-600" /><span>ورود با شماره موبایل</span><CheckCircle2 className="mr-auto size-4 text-brand-500" /></div>
                            <div className="profile-status-row"><LockKeyhole className="size-4 text-brand-600" /><span>کد یک‌بارمصرف فعال</span><CheckCircle2 className="mr-auto size-4 text-brand-500" /></div>
                            <div className="profile-status-row"><Receipt className="size-4 text-brand-600" /><span>آخرین گزارش والدین: {profileState.lastParentReportSentAt}</span></div>
                        </div>
                        <div className="mt-6 rounded-2xl bg-brand-50 p-4 text-xs leading-6 text-brand-900 dark:bg-brand-950/40 dark:text-brand-100">تمامی اطلاعات پرونده استعدادیابی، کیف پول و پیشرفت دوره‌های شما به صورت یکپارچه بین وب‌سایت و اپلیکیشن همگام‌سازی شده است.</div>
                    </aside>
                </section>

                <section className="profile-danger rounded-3xl p-6 md:p-8">
                    <DeleteUserForm />
                </section>
            </div>
        </UserDashboardLayout>
    );
}

Edit.layout = (page: ReactNode) => page;
