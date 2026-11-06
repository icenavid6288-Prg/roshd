import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ReviewComposer, type ExistingReviewData } from '@/Components/ReviewComposer';
import {
    ArrowLeft,
    BookOpen,
    Download,
    ExternalLink,
    Eye,
    Headphones,
    Heart,
    Lock,
    Pause,
    Play,
    PlayCircle,
    ShieldCheck,
    ShoppingBag,
    Star,
    Volume2,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { PodcastPlayer } from '@/Components/PodcastPlayer';
import { PageHeader } from '@/Components/ui/PageHeader';
import { formatDate, formatNumber, formatPrice } from '@/lib/format';
import { resolveProductConsumptionMode, type InAppChapterOrEpisode } from '@/lib/mobileAppLogic';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps } from '@/types';

interface ProductData {
    id: number;
    title: string;
    slug: string;
    type: string;
    description?: string | null;
    image?: string | null;
    preview_url?: string | null;
    price: number;
    discount_price?: number | null;
    download_price?: number | null;
    download_discount_price?: number | null;
    has_preview_file?: boolean;
    has_download_edition?: boolean;
    can_view_preview?: boolean;
    can_download?: boolean;
    preview_endpoint?: string | null;
    download_endpoint?: string | null;
    author?: string | null;
    pages?: number | null;
    publisher?: string | null;
    isbn?: string | null;
    audio_duration_seconds?: number | null;
    episodes?: Array<{ id: number; title: string; description?: string | null; audio_url?: string | null; duration_seconds: number | null; is_free: boolean }>;
    reviews?: Array<{ id: number; name: string; avatar?: string | null; rating: number; title?: string | null; body?: string | null; created_at?: string | null }>;
    review_summary?: { count: number; average: number };
    my_review?: ExistingReviewData | null;
    can_review?: boolean;
}

const defaultBookChapters: InAppChapterOrEpisode[] = [
    {
        id: 1,
        number: 1,
        title: 'فصل اول: چرا ۹۰ روز؟ معماری تمرکز و عادت‌های پایدار نوجوان',
        durationOrPages: '۲۴ صفحه',
        isFreeSample: true,
        contentOrTranscript:
            'تغییر واقعی در زندگی نوجوان با برنامه‌های مبهم یک‌ساله اتفاق نمی‌افتد. مغز نوجوان به بازه‌های ملموس ۹۰ روزه (یک فصل کامل) بهترین واکنش را نشان می‌دهد. در این فصل یاد می‌گیریم چگونه ۳ اولویت اصلی فصل را انتخاب کنیم و از تله چندکارگی خارج شویم.',
        keyTakeaway: 'هر فصل فقط ۳ هدف کلیدی؛ تمرکز عمیق روی عادت‌های کوچک روزانه.',
    },
    {
        id: 2,
        number: 2,
        title: 'فصل دوم: قطب‌نمای استعداد و کشف نقاط قوت ذاتی',
        durationOrPages: '۳۲ صفحه',
        isFreeSample: true,
        contentOrTranscript:
            'استعدادیابی یعنی مشاهده دقیق لحظاتی که در آن‌ها گذر زمان را حس نمی‌کنی و عملکردی فراتر از هم‌سالان داری. در این فصل جدول ۳ موقعیت طلایی را تکمیل می‌کنیم تا الگوی تکرارشونده توانمندی‌های تحلیلی، ارتباطی و اجرایی تو مشخص شود.',
        keyTakeaway: 'استعداد، ترکیب رغبت درونی، یادگیری سریع و رضایت عمیق پس از انجام کار است.',
    },
    {
        id: 3,
        number: 3,
        title: 'فصل سوم: تکنیک بلوک‌های زمانی و مدیریت انرژی بعد از مدرسه',
        durationOrPages: '۲۸ صفحه',
        isFreeSample: false,
        contentOrTranscript:
            'بیشتر دانش‌آموزان فکر می‌کنند وقت کم دارند، در حالی که چالش اصلی، مدیریت انرژی بعد از ساعت مدرسه است. با تقسیم عصر به دو بلوک ۴۵ دقیقه‌ای عمیق و یک بازه بازیابی انرژی، کیفیت یادگیری دو برابر می‌شود.',
        keyTakeaway: 'مدیریت انرژی مقدم بر مدیریت زمان است؛ ۲ بلوک ۴۵ دقیقه‌ای تمرکز بدون موبایل.',
    },
];

const defaultPodcastEpisodes: InAppChapterOrEpisode[] = [
    {
        id: 101,
        number: 1,
        title: 'اپیزود ۱: چگونه در نوجوانی مسیر آینده خود را طراحی کنیم؟',
        durationOrPages: '۱۸:۴۰ دقیقه',
        isFreeSample: true,
        contentOrTranscript:
            'در این اپیزود از رادیو رشد، دکتر علیرضا بیدی درباره تفاوت انتخاب رشته سنتی با طراحی مسیر آینده صحبت می‌کند و ۳ گام اول خودشناسی نوجوان را با مثال‌های واقعی بررسی می‌کند.',
        keyTakeaway: 'آینده منتظر انتخاب‌های تصادفی نمی‌ماند؛ طراحی مسیر از شناخت نقاط قوت شروع می‌شود.',
    },
    {
        id: 102,
        number: 2,
        title: 'اپیزود ۲: غلبه بر اهمال‌کاری و ساختن نظم شخصی بدون فشار والدین',
        durationOrPages: '۲۲:۱۵ دقیقه',
        isFreeSample: true,
        contentOrTranscript:
            'چرا شروع کردن کارها سخت است؟ در این قسمت مکانیسم دوپامین و قانون ۵ دقیقه برای شروع مطالعه و پروژه‌های مهارتی را یاد می‌گیریم.',
        keyTakeaway: 'انگیزه بعد از حرکت ساخته می‌شود؛ قانون ۵ دقیقه شروع را ساده می‌کند.',
    },
];

export default function ShopShow() {
    const { product, related, auth, wishlisted = false } = usePage<PageProps & { product: ProductData; related: ProductData[]; wishlisted?: boolean }>().props;
    const cartForm = useForm({ quantity: 1, purchase_mode: 'download' });

    const isBook = product.type === 'book';
    const isPodcast = product.type === 'podcast';
    const consumptionMode = resolveProductConsumptionMode({
        deliveryType: isPodcast ? 'in_app_podcast' : 'in_app_book',
        inAppOnly: true,
    });

    const chaptersOrEpisodes = isPodcast ? defaultPodcastEpisodes : defaultBookChapters;
    const [activeChapterId, setActiveChapterId] = useState<number>(chaptersOrEpisodes[0].id);
    const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
    const [readerFontSize, setReaderFontSize] = useState<number>(16);
    const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
    const [playbackRate, setPlaybackRate] = useState<'1x' | '1.25x' | '1.5x'>('1x');
    const [showInAppViewport, setShowInAppViewport] = useState<boolean>(true);

    const activeChapter =
        chaptersOrEpisodes.find((c) => c.id === activeChapterId) ?? chaptersOrEpisodes[0];

    const addToCart = (purchaseMode: 'online' | 'download' = 'online') => {
        cartForm.transform(() => ({ quantity: 1, purchase_mode: purchaseMode }));
        cartForm.post(`/cart/products/${product.id}`);
    };

    const productTypeLabel = isBook ? 'کتاب و ورک‌بوک درون‌برنامه‌ای' : isPodcast ? 'پادکست اختصاصی درون‌برنامه‌ای' : 'محصول آموزشی';
    const finalPrice = product.discount_price ?? product.price;
    const hasDiscount = product.discount_price !== null && product.discount_price !== undefined;

    return (
        <div>
            <PageHeader
                eyebrow="فروشگاه و کتابخانه درون‌برنامه‌ای رشد"
                title={product.title}
                subtitle={product.description}
                actions={
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowInAppViewport(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#D6F39A] px-5 py-3 text-sm font-black text-[#123E30] shadow-glow transition-all hover:brightness-105"
                        >
                            {isPodcast ? <Headphones className="size-4" aria-hidden /> : <BookOpen className="size-4" aria-hidden />}
                            {consumptionMode.primaryCtaLabel}
                        </button>
                        <button
                            type="button"
                            onClick={() => addToCart('online')}
                            disabled={cartForm.processing}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20 disabled:cursor-wait disabled:opacity-60"
                        >
                            <ShoppingBag className="size-4" aria-hidden />
                            {cartForm.processing ? 'در حال ثبت...' : `خرید دسترسی کامل (${formatPrice(finalPrice)})`}
                        </button>
                        <div className="flex flex-col text-right">
                            {hasDiscount && <span className="text-sm text-white/50 line-through">{formatPrice(product.price)}</span>}
                            <span className="text-xl font-black text-white">{formatPrice(finalPrice)}</span>
                        </div>
                    </div>
                }
            />

            <section className="relative overflow-hidden bg-white py-12 md:py-16">
                <div className="ambient ambient-green ambient-a" aria-hidden />
                <div className="ambient ambient-gold ambient-b" aria-hidden />
                <div className="container-site relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    {/* cover */}
                    <div>
                        <div className="liquid-card relative overflow-hidden p-6">
                            <span className="liquid-blob blob-a" aria-hidden />
                            <span className="liquid-blob blob-b" aria-hidden />
                            <div className="shop-detail-cover">
                                {product.image ? (
                                    <img src={product.image} alt={product.title} loading="eager" />
                                ) : isPodcast ? (
                                    <div className="flex flex-col items-center gap-4 p-6 text-center"><Headphones className="size-20" aria-hidden /><span className="text-sm font-black">{product.title}</span></div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 p-6 text-center"><BookOpen className="size-14" aria-hidden /><span className="text-sm font-black">{product.title}</span>{product.author && <span className="text-xs text-white/70">{product.author}</span>}</div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-brand-200 bg-brand-50/70 p-4 text-xs font-bold text-brand-900">
                            <ShieldCheck className="size-5 shrink-0 text-brand-700" />
                            <span>{consumptionMode.badgeLabel} — بدون نیاز به دانلود فایل خام، همیشه در حساب کاربری و اپلیکیشن شما در دسترس است.</span>
                        </div>
                    </div>

                    {/* details */}
                    <div>
                        <div className="hero-kicker">
                            <span className="hero-kicker-line" />
                            <span>{productTypeLabel}</span>
                        </div>
                        <h2 className="mt-3 text-2xl font-black text-navy">مشخصات و مطالعه درون‌برنامه‌ای</h2>

                        <div className="mt-6 flex flex-col gap-3">
                            {product.author && (
                                <div className="liquid-card flex items-center justify-between p-4">
                                    <span className="liquid-blob blob-b" aria-hidden />
                                    <span className="text-sm font-bold text-navy/55">نویسنده / مدرس</span>
                                    <span className="text-sm font-black text-navy">{product.author}</span>
                                </div>
                            )}
                            {product.pages ? (
                                <div className="liquid-card flex items-center justify-between p-4">
                                    <span className="liquid-blob blob-b" aria-hidden />
                                    <span className="text-sm font-bold text-navy/55">تعداد صفحات</span>
                                    <span className="text-sm font-black text-navy">{formatNumber(product.pages)} صفحه</span>
                                </div>
                            ) : null}
                            {product.publisher && (
                                <div className="liquid-card flex items-center justify-between p-4">
                                    <span className="liquid-blob blob-b" aria-hidden />
                                    <span className="text-sm font-bold text-navy/55">ناشر</span>
                                    <span className="text-sm font-black text-navy">{product.publisher}</span>
                                </div>
                            )}
                            {product.episodes && product.episodes.length > 0 && <PodcastPlayer episodes={product.episodes} />}
                        </div>

                        {/* Interactive In-App Book Reader / In-App Podcast Audio Player */}
                        {showInAppViewport && (
                            <div className="mt-8 overflow-hidden rounded-3xl border border-navy/15 shadow-lift">
                                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#123E30] px-5 py-4 text-white">
                                    <div className="flex items-center gap-2.5">
                                        {isPodcast ? <Headphones className="size-5 text-[#D6F39A]" /> : <BookOpen className="size-5 text-[#D6F39A]" />}
                                        <div>
                                            <div className="text-sm font-black">
                                                {isPodcast ? 'پلیر صوتی اختصاصی رشد' : 'کتاب‌خوان درون‌برنامه‌ای رشد'}
                                            </div>
                                            <div className="text-[0.7rem] text-[#D6F39A]">
                                                محافظت‌شده (غیرقابل دانلود بیرونی) · همگام با اپلیکیشن
                                            </div>
                                        </div>
                                    </div>

                                    {!isPodcast ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setReaderFontSize((s) => Math.max(13, s - 1))}
                                                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-black text-white hover:bg-white/20"
                                            >
                                                A-
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setReaderFontSize((s) => Math.min(22, s + 1))}
                                                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-black text-white hover:bg-white/20"
                                            >
                                                A+
                                            </button>
                                            {(['light', 'sepia', 'dark'] as const).map((mode) => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    onClick={() => setReaderTheme(mode)}
                                                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                                                        readerTheme === mode
                                                            ? 'bg-[#D6F39A] text-[#123E30]'
                                                            : 'bg-white/10 text-white/80'
                                                    }`}
                                                >
                                                    {mode === 'light' ? 'روشن' : mode === 'sepia' ? 'کاغذی' : 'تاریک'}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {(['1x', '1.25x', '1.5x'] as const).map((rate) => (
                                                <button
                                                    key={rate}
                                                    type="button"
                                                    onClick={() => setPlaybackRate(rate)}
                                                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                                                        playbackRate === rate
                                                            ? 'bg-[#D6F39A] text-[#123E30]'
                                                            : 'bg-white/10 text-white/80'
                                                    }`}
                                                >
                                                    سرعت {rate}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Chapter / Episode Selector Tabs */}
                                <div className="flex gap-2 overflow-x-auto border-b border-navy/10 bg-[#f4f8f5] p-3">
                                    {chaptersOrEpisodes.map((item) => {
                                        const active = item.id === activeChapter.id;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => setActiveChapterId(item.id)}
                                                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-black transition ${
                                                    active
                                                        ? 'bg-[#123E30] text-[#D6F39A]'
                                                        : 'bg-white text-navy/70 hover:text-navy'
                                                }`}
                                            >
                                                {item.title} ({item.durationOrPages})
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Reader / Player Body */}
                                <div
                                    className={`p-6 transition-colors ${
                                        readerTheme === 'dark'
                                            ? 'bg-[#0c1d16] text-emerald-50'
                                            : readerTheme === 'sepia'
                                            ? 'bg-[#fdf8ee] text-[#2c2216]'
                                            : 'bg-white text-navy'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2 text-xs font-bold opacity-70">
                                        <span>{activeChapter.title}</span>
                                        <span>{activeChapter.durationOrPages}</span>
                                    </div>

                                    {isPodcast && (
                                        <div className="my-4 flex items-center gap-4 rounded-2xl bg-[#123E30] p-4 text-white">
                                            <button
                                                type="button"
                                                onClick={() => setIsPlayingAudio((p) => !p)}
                                                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#D6F39A] text-[#123E30] transition hover:scale-105"
                                                aria-label={isPlayingAudio ? 'توقف پخش' : 'پخش صوت'}
                                            >
                                                {isPlayingAudio ? <Pause className="size-6" /> : <Play className="size-6" />}
                                            </button>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between text-xs font-black">
                                                    <span>{isPlayingAudio ? 'در حال پخش درون‌برنامه‌ای...' : 'آماده پخش'}</span>
                                                    <span>سرعت {playbackRate}</span>
                                                </div>
                                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                                                    <div className={`h-full rounded-full bg-[#D6F39A] transition-all ${isPlayingAudio ? 'w-2/3' : 'w-1/3'}`} />
                                                </div>
                                            </div>
                                            <Volume2 className="size-5 text-[#D6F39A]" />
                                        </div>
                                    )}

                                    <p
                                        className="mt-4 leading-9"
                                        style={{ fontSize: `${readerFontSize}px` }}
                                    >
                                        {activeChapter.contentOrTranscript}
                                    </p>

                                    <div className="mt-5 rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4 text-xs font-bold">
                                        <strong className="block text-brand-700">نکته کلیدی این بخش:</strong>
                                        <span className="mt-1 block">{activeChapter.keyTakeaway}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => addToCart('online')}
                                disabled={cartForm.processing}
                                className="inline-flex items-center gap-2 rounded-2xl bg-deep-green px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-brand-800 active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
                            >
                                <Eye className="size-5" aria-hidden /> خرید دسترسی درون‌برنامه‌ای · {formatPrice(finalPrice)}
                            </button>
                            <span className="inline-flex items-center gap-1.5 rounded-2xl border border-navy/15 bg-navy/5 px-4 py-3.5 text-xs font-bold text-navy/60">
                                <Lock className="size-4 text-brand-700" />
                                دانلود فایل خام غیرفعال است (محافظت کپی‌رایت)
                            </span>
                            <button type="button" onClick={() => router.post('/wishlist', { type: 'product', id: product.id })} className="inline-flex items-center gap-2 rounded-2xl border border-navy/10 px-5 py-3.5 text-sm font-bold text-navy/70">
                                <Heart className={`size-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} /> {wishlisted ? 'در علاقه‌مندی‌ها' : 'علاقه‌مندی'}
                            </button>
                            <Link href="/shop" className="inline-flex items-center gap-2 rounded-2xl border border-navy/10 px-7 py-3.5 text-base font-bold text-navy/70 transition-colors hover:border-brand-300 hover:text-brand-700">
                                <ArrowLeft className="size-5" aria-hidden />
                                بازگشت به فروشگاه
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {product.reviews && product.review_summary && (
                <section className="relative overflow-hidden bg-soft-gray py-12 md:py-16">
                    <div className="ambient ambient-teal ambient-a" aria-hidden />
                    <div className="container-site relative">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div><div className="hero-kicker"><span className="hero-kicker-line" /><span>تجربه خریداران</span></div><h2 className="mt-3 text-2xl font-black text-navy md:text-3xl">نظرات درباره {product.type === 'podcast' ? 'این پادکست' : 'این محصول'}</h2><p className="mt-1 text-xs font-bold text-navy/40">{formatNumber(product.review_summary.count)} نظر ثبت‌شده</p></div>
                            {product.review_summary.average > 0 && <div className="flex items-center gap-2 text-gold"><Star className="size-5 fill-gold" /><strong className="text-xl">{formatNumber(product.review_summary.average)}</strong><span className="text-xs font-bold text-navy/40">از ۵</span></div>}
                        </div>
                        <div className="mt-7"><ReviewComposer action={`/products/${product.slug}/reviews`} canReview={Boolean(product.can_review)} isAuthenticated={Boolean(auth?.user)} existingReview={product.my_review} subjectLabel={product.type === 'podcast' ? 'این پادکست' : 'این محصول'} /></div>
                        {product.reviews.length > 0 ? <div className="mt-7 grid gap-4 md:grid-cols-2">{product.reviews.map((review) => <article key={review.id} className="liquid-card p-5"><span className="liquid-blob blob-b" aria-hidden /><div className="relative z-10 flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-deep-green text-base font-black text-white">{review.name.slice(0, 1)}</span><div><h3 className="text-sm font-black text-navy">{review.name}</h3><div className="mt-1 flex items-center gap-1 text-gold">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`size-3.5 ${index < review.rating ? 'fill-gold' : 'text-navy/15'}`} aria-hidden />)}<span className="mr-1 text-[0.68rem] font-bold text-navy/40">{formatDate(review.created_at)}</span></div></div></div>{review.title && <h4 className="relative z-10 mt-4 text-sm font-black text-navy">{review.title}</h4>}{review.body && <p className="relative z-10 mt-2 text-sm leading-7 text-navy/60">{review.body}</p>}</article>)}</div> : <div className="liquid-card mt-7 p-8 text-center text-sm font-bold text-navy/50">هنوز نظری برای این محصول ثبت نشده است.</div>}
                    </div>
                </section>
            )}

            {related.length > 0 && (
                <section className="relative overflow-hidden bg-soft-gray py-12 md:py-16">
                    <div className="ambient ambient-teal ambient-a" aria-hidden />
                    <div className="container-site relative">
                        <div className="hero-kicker">
                            <span className="hero-kicker-line" />
                            <span>محصولات مرتبط</span>
                        </div>
                        <h2 className="mt-3 text-2xl font-black text-navy">شاید به این‌ها هم علاقه داشته باشید</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => (
                                <Link key={item.id} href={`/shop/${item.slug}`} className="liquid-card group flex gap-5 p-5">
                                    <span className="liquid-blob blob-a" aria-hidden />
                                    <span className="liquid-blob blob-b" aria-hidden />
                                    <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-deep-green text-white">
                                        {item.type === 'book' ? <BookOpen className="size-9" aria-hidden /> : <Headphones className="size-9" aria-hidden />}
                                    </span>
                                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                        <h3 className="line-clamp-2 text-base font-black leading-6 text-navy transition-colors group-hover:text-brand-700">
                                            {item.title}
                                        </h3>
                                        {item.author && <p className="text-xs text-navy/45">{item.author}</p>}
                                        <span className="mt-auto flex items-center gap-1 pt-1 text-sm font-black text-brand-700">
                                            {formatPrice(item.discount_price ?? item.price)}
                                            <Star className="size-3.5 text-gold" aria-hidden />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

ShopShow.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;
