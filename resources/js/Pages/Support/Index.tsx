import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    LifeBuoy,
    MessageSquareText,
    Plus,
    Send,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { toFa } from '@/lib/format';
import {
    createSupportTicketInState,
    replyToSupportTicketInState,
    useDynamicAppStore,
} from '@/lib/dynamicAppStore';

const statusMeta: Record<string, { label: string; cls: string }> = {
    open: { label: 'در انتظار پاسخ', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    answered: { label: 'پاسخ داده شده', cls: 'bg-brand-50 text-brand-700 border-brand-200' },
    closed: { label: 'بسته شده', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
};

const priorityMeta: Record<string, { label: string; cls: string }> = {
    low: { label: 'کم', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
    medium: { label: 'متوسط', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    high: { label: 'زیاد', cls: 'bg-red-50 text-red-700 border-red-200' },
};

export default function SupportIndex() {
    const { appState, updateAppState } = useDynamicAppStore();
    const { supportTickets, userProfile } = appState;

    const [selectedTicketId, setSelectedTicketId] = useState<number>(
        supportTickets[0]?.id ?? 201
    );
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [body, setBody] = useState('');
    const [replyDraft, setReplyDraft] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);

    const openCount = supportTickets.filter((t) => t.status === 'open').length;
    const answeredCount = supportTickets.filter((t) => t.status === 'answered').length;
    const closedCount = supportTickets.filter((t) => t.status === 'closed').length;

    const activeTicket =
        supportTickets.find((t) => t.id === selectedTicketId) || supportTickets[0];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !body.trim()) return;
        updateAppState((prev) => {
            const nextTickets = createSupportTicketInState(
                prev.supportTickets,
                subject,
                'پشتیبانی آموزش و دوره VIP',
                priority,
                body,
                prev.userProfile.name
            );
            if (nextTickets[0]) {
                setSelectedTicketId(nextTickets[0].id);
            }
            return { ...prev, supportTickets: nextTickets };
        });
        setSubject('');
        setBody('');
        setFeedback('تیکت جدید شما ثبت شد و با اپلیکیشن همگام گردید.');
        setTimeout(() => setFeedback(null), 3500);
    };

    const handleSendReply = () => {
        if (!activeTicket || !replyDraft.trim()) return;
        updateAppState((prev) => ({
            ...prev,
            supportTickets: replyToSupportTicketInState(
                prev.supportTickets,
                activeTicket.id,
                replyDraft,
                'student',
                userProfile.name
            ),
        }));
        setReplyDraft('');
    };

    return (
        <UserDashboardLayout>
            <Head title="پشتیبانی" />
            <div className="mx-auto flex max-w-7xl flex-col gap-7">
                {feedback && (
                    <div className="flex items-center gap-2 rounded-2xl bg-[#123E30] px-5 py-3 text-xs font-black text-[#D6F39A] shadow-soft">
                        <CheckCircle2 className="size-4" />
                        <span>{feedback}</span>
                    </div>
                )}

                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="dashboard-eyebrow">
                            <span /> پشتیبانی یکپارچه سایت و اپلیکیشن
                        </span>
                        <h2 className="mt-2 text-2xl font-black text-navy">مرکز پشتیبانی</h2>
                        <p className="mt-2 text-sm leading-7 text-navy/50">
                            سؤال درباره سفارش، دوره، پرداخت یا کوچینگ؟ تیکت ثبت کنید یا مستقیماً پاسخ دهید.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {[
                            ['باز', openCount],
                            ['پاسخ‌داده‌شده', answeredCount],
                            ['بسته', closedCount],
                        ].map(([label, count]) => (
                            <span
                                key={label as string}
                                className="rounded-xl border border-white/70 bg-white/75 px-3 py-2 text-xs font-black text-navy/60"
                            >
                                <strong className="text-brand-700">{toFa(count as number)}</strong>{' '}
                                {label}
                            </span>
                        ))}
                    </div>
                </header>

                <section className="grid gap-6 lg:grid-cols-[1fr_24rem]">
                    <div className="flex flex-col gap-4">
                        {supportTickets.length === 0 ? (
                            <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-200 bg-white/55 px-5 py-16 text-center">
                                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                                    <LifeBuoy className="size-7" />
                                </span>
                                <h3 className="mt-4 text-base font-black text-navy">
                                    هنوز تیکتی ثبت نکرده‌اید
                                </h3>
                            </div>
                        ) : (
                            supportTickets.map((ticket) => {
                                const s = statusMeta[ticket.status] ?? statusMeta.open;
                                const p = priorityMeta[ticket.priority] ?? priorityMeta.medium;
                                const isSelected = activeTicket?.id === ticket.id;
                                return (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicketId(ticket.id)}
                                        className={`cursor-pointer rounded-2xl border p-5 shadow-soft transition-all ${
                                            isSelected
                                                ? 'border-brand-500 bg-brand-50/40'
                                                : 'border-white/80 bg-white/85 hover:border-brand-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                                                <MessageSquareText className="size-5" />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-sm font-black text-navy">
                                                        {ticket.subject}
                                                    </h3>
                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-[0.62rem] font-black ${s.cls}`}
                                                    >
                                                        {s.label}
                                                    </span>
                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-[0.62rem] font-black ${p.cls}`}
                                                    >
                                                        اولویت {p.label}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-navy/45">
                                                    <span className="flex items-center gap-1">
                                                        <Clock3 className="size-3.5" />{' '}
                                                        {ticket.createdAt}
                                                    </span>
                                                    <span>
                                                        {toFa(ticket.messages.length)} پیام
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div
                                                className="mt-4 space-y-3 border-t border-navy/10 pt-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {ticket.messages.map((m) => (
                                                        <div
                                                            key={m.id}
                                                            className={`rounded-xl p-3 text-xs ${
                                                                m.sender === 'student'
                                                                    ? 'bg-brand-50 text-navy'
                                                                    : 'bg-[#123E30] text-white'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between font-black text-[11px] mb-1">
                                                                <span>{m.senderName}</span>
                                                                <span className="opacity-70">
                                                                    {m.time}
                                                                </span>
                                                            </div>
                                                            <p className="leading-6">{m.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={replyDraft}
                                                        onChange={(e) =>
                                                            setReplyDraft(e.target.value)
                                                        }
                                                        placeholder="ارسال پاسخ در این تیکت..."
                                                        className="flex-1 rounded-xl border border-navy/15 bg-white px-3.5 py-2 text-xs text-navy outline-none focus:border-brand-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleSendReply}
                                                        className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-black text-white"
                                                    >
                                                        ارسال پاسخ
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <form
                        onSubmit={submit}
                        className="h-fit rounded-2xl border border-white/80 bg-white/85 p-5 shadow-soft"
                    >
                        <div className="flex items-center gap-2 text-sm font-black text-navy">
                            <Plus className="size-4 text-brand-600" /> تیکت جدید
                        </div>
                        <div className="mt-4 flex flex-col gap-4">
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-1.5 block text-xs font-black text-navy/70"
                                >
                                    موضوع
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="مثلاً: دسترسی به دوره خریداری‌شده"
                                    className="w-full rounded-xl border border-navy/10 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-brand-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="priority"
                                    className="mb-1.5 block text-xs font-black text-navy/70"
                                >
                                    اولویت
                                </label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(
                                            e.target.value as 'low' | 'medium' | 'high'
                                        )
                                    }
                                    className="w-full rounded-xl border border-navy/10 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-brand-500"
                                >
                                    <option value="low">کم — سؤال عمومی</option>
                                    <option value="medium">متوسط — نیاز به پیگیری</option>
                                    <option value="high">زیاد — مشکل پرداخت/دسترسی</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="body"
                                    className="mb-1.5 block text-xs font-black text-navy/70"
                                >
                                    شرح درخواست
                                </label>
                                <textarea
                                    id="body"
                                    rows={4}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="توضیحات درخواست خود را بنویسید..."
                                    className="w-full rounded-xl border border-navy/10 bg-white px-4 py-2.5 text-sm leading-7 text-navy outline-none focus:border-brand-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-black text-white shadow-glow transition-colors hover:bg-brand-600"
                            >
                                <Send className="size-4" /> ثبت تیکت
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </UserDashboardLayout>
    );
}

SupportIndex.layout = (page: ReactNode) => page;
