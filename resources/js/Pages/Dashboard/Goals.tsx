import { Link } from '@inertiajs/react';
import { ArrowLeft, Check, ClipboardCheck, Plus, Route, Target } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatNumber } from '@/lib/format';
import {
    addGoalToState,
    advanceGoalTaskInState,
    useDynamicAppStore,
} from '@/lib/dynamicAppStore';

export default function DashboardGoals() {
    const { appState, updateAppState } = useDynamicAppStore();
    const { goals } = appState;
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('دوره VIP آینده نوجوان');
    const [newDueDate, setNewDueDate] = useState('۳۰ خرداد ۱۴۰۴');
    const [newTotalTasks, setNewTotalTasks] = useState(5);

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        updateAppState((prev) => ({
            ...prev,
            goals: addGoalToState(
                prev.goals,
                newTitle,
                newCategory,
                newDueDate,
                newTotalTasks
            ),
        }));
        setNewTitle('');
    };

    return (
        <UserDashboardLayout>
            <div className="mx-auto flex max-w-5xl flex-col gap-7">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="dashboard-eyebrow">
                            <span /> هدف‌گذاری ۹۰ روزه (همگام با اپلیکیشن)
                        </span>
                        <h2 className="mt-2 text-2xl font-black text-navy">
                            بوم هدف‌گذاری و مسیر رشد من
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-navy/50">
                            هدف‌های خود را تعریف کنید، گام‌های انجام‌شده را ثبت کنید و امتیاز رشد (XP) بگیرید.
                        </p>
                    </div>
                    <Link
                        href="/mobile-app?screen=goals"
                        className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-xs font-black text-brand-700 hover:bg-brand-50"
                    >
                        مشاهده در اپلیکیشن <ArrowLeft className="size-4" />
                    </Link>
                </header>

                <section className="relative overflow-hidden rounded-[2rem] bg-deep-gradient p-7 text-white shadow-lift">
                    <div className="pointer-events-none absolute -left-16 -top-20 size-60 rounded-full bg-brand-400/20" />
                    <div className="relative flex items-center gap-4">
                        <span className="panel-inline-icon text-brand-300">
                            <Route className="size-8" />
                        </span>
                        <div>
                            <span className="text-xs font-bold text-brand-200">
                                نقشه مسیر ۹۰ روزه
                            </span>
                            <h3 className="mt-1 text-xl font-black">
                                هر گام تکمیل‌شده در اینجا و در اپلیکیشن به‌صورت آنی ذخیره می‌شود.
                            </h3>
                        </div>
                    </div>
                </section>

                {/* Add New Goal Form */}
                <form
                    onSubmit={handleAddGoal}
                    className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-soft space-y-4"
                >
                    <div className="flex items-center gap-2 text-sm font-black text-navy">
                        <Plus className="size-4 text-brand-600" />
                        <span>افزودن هدف جدید به بوم ۹۰ روزه</span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="عنوان هدف (مثلاً: تکمیل تمرین‌های آیتم ۲)..."
                            className="md:col-span-2 rounded-xl border border-navy/10 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-brand-500"
                        />
                        <input
                            type="text"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            placeholder="مهلت (مثلاً: ۳۱ خرداد ۱۴۰۴)"
                            className="rounded-xl border border-navy/10 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-brand-500"
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-navy/70">
                            <span>تعداد گام‌ها:</span>
                            {[3, 5, 8, 10].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setNewTotalTasks(num)}
                                    className={`rounded-lg px-3 py-1.5 font-black transition ${
                                        newTotalTasks === num
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-navy/5 text-navy'
                                    }`}
                                >
                                    {formatNumber(num)} گام
                                </button>
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-black text-white shadow-soft hover:bg-brand-700"
                        >
                            <Plus className="size-4" />
                            <span>ثبت هدف</span>
                        </button>
                    </div>
                </form>

                <section className="flex flex-col gap-4">
                    {goals.length > 0 ? (
                        goals.map((goal) => {
                            const percent = goal.totalTasks
                                ? Math.round((goal.completedTasks / goal.totalTasks) * 100)
                                : 0;
                            return (
                                <article
                                    key={goal.id}
                                    className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-soft"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <span className="inline-block rounded-lg bg-brand-50 px-2.5 py-0.5 text-[0.68rem] font-black text-brand-700 mb-1">
                                                {goal.category}
                                            </span>
                                            <h3 className="text-base font-black text-navy">
                                                {goal.title}
                                            </h3>
                                        </div>
                                        <span
                                            className={`rounded-lg px-2.5 py-1 text-xs font-black ${
                                                goal.status === 'completed'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-amber-50 text-amber-700'
                                            }`}
                                        >
                                            {goal.status === 'completed'
                                                ? 'تکمیل شده ✓'
                                                : 'در حال اجرا'}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-navy/5">
                                            <span
                                                className="block h-full rounded-full bg-gradient-to-l from-brand-500 to-brand-300 transition-all"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <strong className="text-xs font-black text-brand-700">
                                            {formatNumber(percent)}٪
                                        </strong>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-navy/55">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <ClipboardCheck className="size-3.5" />{' '}
                                                {formatNumber(goal.completedTasks)} از{' '}
                                                {formatNumber(goal.totalTasks)} گام انجام شده
                                            </span>
                                            <span>مهلت: {goal.dueDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                disabled={goal.completedTasks >= goal.totalTasks}
                                                onClick={() =>
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
                                                    }))
                                                }
                                                className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3.5 py-1.5 text-xs font-black text-white disabled:opacity-40"
                                            >
                                                <Check className="size-3.5" />
                                                <span>+۱ گام انجام شد</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-dashed border-brand-200 bg-white/55 px-5 py-14 text-center">
                            <Target className="mx-auto size-8 text-brand-500" />
                            <p className="mt-3 text-sm font-bold text-navy/50">
                                هنوز هدف فعالی ثبت نشده است.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </UserDashboardLayout>
    );
}

DashboardGoals.layout = (page: ReactNode) => page;
