import { useState, useRef } from 'react';
import { Play, Pause, Headphones, Radio, Volume2, Sparkles, Clock, Share2 } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { vibrate } from '@/lib/haptics';

interface Episode {
    id: number;
    title: string;
    duration_seconds: number | null;
    is_free: boolean;
}

interface PodcastProps {
    podcast: {
        id: number;
        title: string;
        author?: string | null;
        image?: string | null;
        episodes?: Episode[];
    } | null;
}

export default function FutureRadioPlayer({ podcast }: PodcastProps) {
    const episodes = podcast?.episodes && podcast.episodes.length > 0 ? podcast.episodes : [
        { id: 1, title: 'قسمت ۱: چرا ۸۰٪ دانش‌آموزان در انتخاب رشته اشتباه می‌کنند؟', duration_seconds: 1540, is_free: true },
        { id: 2, title: 'قسمت ۲: هوش هیجانی (EQ) و نقش پنهان آن در موفقیت کنکور', duration_seconds: 1820, is_free: true },
        { id: 3, title: 'قسمت ۳: گفتگوی صمیمانه با رتبه برترهای هدایت‌شده توسط دکتر بیدی', duration_seconds: 2100, is_free: true },
    ];

    const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSeconds, setPlaybackSeconds] = useState(32);

    const activeEpisode = episodes[activeEpisodeIndex] || episodes[0];

    const togglePlay = () => {
        vibrate();
        setIsPlaying(!isPlaying);
    };

    const formatDuration = (seconds?: number | null) => {
        if (!seconds) return '۲۵ دقیقه';
        const mins = Math.floor(seconds / 60);
        return `${formatNumber(mins)} دقیقه`;
    };

    return (
        <section className="relative overflow-hidden bg-white py-16 dark:bg-[#061811]">
            <div className="container-site relative z-10">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-br from-[#0c261e] via-[#071913] to-[#04100c] p-8 text-white shadow-2xl md:p-12">
                    {/* Decorative glow */}
                    <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-emerald-500/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-amber-500/10 blur-3xl" />

                    <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
                        {/* Left/Main Player Box (7 cols) */}
                        <div className="flex flex-col gap-5 lg:col-span-7">
                            <div className="flex items-center gap-2">
                                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                                    <Radio className="size-4 animate-pulse text-emerald-400" />
                                </span>
                                <span className="text-xs font-black tracking-wider text-emerald-300">
                                    رادیو اختصاصی مسیر آینده · همراه والدین و نوجوانان
                                </span>
                            </div>

                            <h3 className="text-2xl font-black leading-snug text-white md:text-3xl">
                                پادکست صوتی: شنیدن تجربیات طلایی کشف رسالت فردی
                            </h3>

                            <p className="text-xs leading-6 text-white/60 md:text-sm md:leading-7">
                                هر هفته یک اپیزود تخصصی شامل تحلیل چالش‌های انتخاب رشته، کنترل اضطراب تحصیلی و تکنیک‌های هدایت شغلی با کلام دکتر بیدی.
                            </p>

                            {/* Active Player Card */}
                            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={togglePlay}
                                            className="flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 hover:scale-105"
                                            aria-label={isPlaying ? 'توقف' : 'پخش'}
                                        >
                                            {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current translate-x-[-1px]" />}
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[0.62rem] font-black text-amber-300">
                                                    در حال پخش
                                                </span>
                                                <span className="text-xs font-bold text-white/40">
                                                    {formatDuration(activeEpisode.duration_seconds)}
                                                </span>
                                            </div>
                                            <h4 className="mt-1 text-sm font-black text-white md:text-base">
                                                {activeEpisode.title}
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated Sound Wave Bars */}
                                <div className="mt-5 flex items-center gap-1">
                                    {Array.from({ length: 36 }).map((_, i) => {
                                        const heights = [14, 28, 42, 20, 36, 48, 22, 16, 32, 44, 26, 18];
                                        const h = isPlaying ? heights[i % heights.length] : 8;
                                        return (
                                            <span
                                                key={i}
                                                style={{ height: `${h}px` }}
                                                className={`w-1 rounded-full transition-all duration-300 ${
                                                    i < 12 ? 'bg-emerald-400' : 'bg-white/20'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right/Episode Playlist (5 cols) */}
                        <div className="flex flex-col gap-2.5 rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl lg:col-span-5">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                                <span className="font-black text-white/90">قسمت‌های پرطرفدار</span>
                                <span className="text-white/40">{episodes.length} قسمت در دسترس</span>
                            </div>

                            <div className="mt-2 flex flex-col gap-2">
                                {episodes.map((ep, idx) => {
                                    const isSelected = activeEpisodeIndex === idx;
                                    return (
                                        <button
                                            key={ep.id}
                                            type="button"
                                            onClick={() => {
                                                vibrate();
                                                setActiveEpisodeIndex(idx);
                                                setIsPlaying(true);
                                            }}
                                            className={`flex items-center justify-between gap-3 rounded-xl p-3 text-right transition-all ${
                                                isSelected
                                                    ? 'border border-emerald-400/30 bg-emerald-500/10 text-white'
                                                    : 'border border-transparent bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                                    isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-white/50'
                                                }`}>
                                                    {formatNumber(idx + 1)}
                                                </span>
                                                <span className="truncate text-xs font-bold leading-5">
                                                    {ep.title}
                                                </span>
                                            </div>
                                            <span className="shrink-0 text-[0.68rem] text-white/40">
                                                {formatDuration(ep.duration_seconds)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <a
                                href="/podcast"
                                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-white/10"
                            >
                                <Headphones className="size-3.5" />
                                آرشیو کامل رادیو مسیر آینده در کست‌باکس و شنوتو
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
