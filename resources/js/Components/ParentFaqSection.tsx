import { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, HeartHandshake } from 'lucide-react';
import { vibrate } from '@/lib/haptics';

interface FaqItem {
    question: string;
    answer: string;
}

const FAQS: FaqItem[] = [
    {
        question: 'آزمون‌های استعدادیابی شما چقدر علمی و معتبر هستند؟',
        answer: 'ما از تلفیق تست‌های معتبر بین‌المللی شامل مدل هوش‌های چندگانه هاوارد گاردنر (Gardner Multiple Intelligences)، مدل شخصیت‌شناسی هالند (Holland Occupational Themes) و MBTI نوجوانان استفاده می‌کنیم. علاوه بر آزمون آنلاین، گزارش توسط دکتر بیدی و روانشناسان ارشد تحلیل و در جلسه حضوری یا آنلاین با خانواده بررسی می‌شود.',
    },
    {
        question: 'جلسات ارزیابی و کوچینگ به چه صورت برگزار می‌شوند؟',
        answer: 'برای ساکنین تهران امکان برگزاری جلسات به صورت حضوری در دفتر ولیعصر وجود دارد. همچنین برای داوطلبان سراسر کشور و خارج از کشور، جلسات آنلاین تصویری با بالاترین کیفیت و همان استاندارد و پروتکل برگزار می‌شود.',
    },
    {
        question: 'نقش ما به عنوان والدین در طول دوره چگونه است؟',
        answer: 'رشد نوجوان نیازمند یک محیط امن و حامی در خانه است. بنابراین در تمام پکیج‌های ما، حداقل یک جلسه اختصاصی با والدین برگزار می‌شود تا سبک ارتباطی صحیح، نحوه کاهش استرس در منزل و حمایت از استعدادهای واقعی فرزند آموزش داده شود.',
    },
    {
        question: 'اگر نوجوانم انگیزه‌اش را از دست داده باشد یا همکاری نکند چه کنیم؟',
        answer: 'این یکی از شایع‌ترین نگرانی‌های والدین است. متد ما تحکمی یا سرزنش‌آمیز نیست؛ جلسات ما بر پایه کوچینگ همدلانه طراحی شده تا ابتدا مقاومت ذهنی نوجوان شکسته شود، احساس شنیده شدن پیدا کند و خودش مالک تصمیمات آینده‌اش شود.',
    },
    {
        question: 'تفاوت مرکز دکتر بیدی با مشاوره‌های سنتی تحصیلی چیست؟',
        answer: 'مشاوره‌های سنتی فقط به نمره، کارنامه و رتبه آزمون آزمایشی نگاه می‌کنند؛ اما ما مسیر ۳۶۰ درجه زندگی را می‌سازیم: کشف استعداد ذاتی، توسعه هوش هیجانی، تقویت فن بیان، مهارت‌های ثروت‌آفرین و انتخاب رشته بر اساس آینده مشاغل در عصر هوش مصنوعی.',
    },
    {
        question: 'اگر از جلسه ارزیابی اولیه رضایت نداشتیم چه می‌شود؟',
        answer: 'ما به اثربخشی خدمات خود اطمینان صددرصدی داریم. اگر پس از جلسه اول ارزیابی احساس کردید برنامه ارائه شده برای فرزندتان کارآمد نبوده، هزینه واریزی شما بدون هیچ‌گونه قید و شرطی بازگردانده خواهد شد.',
    },
];

export default function ParentFaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        vibrate();
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="parent-faqs" className="relative overflow-hidden bg-white py-16 text-navy dark:bg-[#061811] dark:text-white md:py-24">
            <div className="container-site relative z-10">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-50 px-4 py-1.5 text-xs font-black text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">
                        <HelpCircle className="size-3.5" />
                        پرسش‌های پرتکرار خانواده‌ها
                    </div>
                    <h2 className="mt-4 text-2xl font-black text-navy dark:text-white md:text-4xl">
                        پاسخ شفاف به مهم‌ترین دغدغه‌های والدین
                    </h2>
                    <p className="mt-3 text-xs leading-7 text-navy/65 dark:text-white/60 md:text-sm">
                        اگر پاسخ سوال خود را پیدا نکردید، کارشناسان مشاوره آماده پاسخگویی صمیمانه به شما هستند.
                    </p>
                </div>

                <div className="mx-auto mt-10 max-w-3xl space-y-3">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                                    isOpen
                                        ? 'border-brand-500/50 bg-brand-50/40 shadow-soft dark:border-emerald-400/40 dark:bg-white/[0.06] dark:shadow-lg dark:shadow-emerald-950/40'
                                        : 'border-navy/10 bg-[#f8fbf9] hover:border-brand-300 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.04]'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(index)}
                                    className="flex w-full items-center justify-between gap-4 p-5 text-right font-black text-navy dark:text-white md:text-base"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-sm md:text-base">{faq.question}</span>
                                    <span
                                        className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 ${
                                            isOpen
                                                ? 'rotate-180 bg-brand-600 text-white font-black dark:bg-emerald-500 dark:text-slate-950'
                                                : 'bg-navy/5 text-navy dark:bg-white/10 dark:text-white'
                                        }`}
                                    >
                                        <ChevronDown className="size-4" />
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="border-t border-navy/10 px-5 pb-5 pt-3 text-xs leading-7 text-navy/75 dark:border-white/10 dark:text-emerald-100/75 md:text-sm md:leading-8">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center gap-3 rounded-3xl border border-navy/10 bg-[#f8fbf9] p-6 text-center shadow-xs dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-xs font-bold text-navy/75 dark:text-white/70">
                        هنوز ابهامی در مورد آزمون‌ها یا دوره‌های مرکز دارید؟
                    </p>
                    <a
                        href="#home-consultation"
                        onClick={() => vibrate()}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-black text-white shadow-md transition-colors hover:bg-brand-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                    >
                        <PhoneCall className="size-3.5" />
                        گفتگوی تلفنی با مشاور ارشد مرکز
                    </a>
                </div>
            </div>
        </section>
    );
}
