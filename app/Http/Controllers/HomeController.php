<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Course;
use App\Models\Product;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\Setting;
use App\Http\Presenters\CoursePresenter;
use App\Support\Seo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $content = Cache::remember('public.home.content.v2', now()->addSeconds(60), function (): array {
            $courses = Course::published()
                ->with(['instructor.user', 'category'])
                ->featured()
                ->limit(6)
                ->get()
                ->map(fn ($course) => CoursePresenter::payload($course))
                ->values()
                ->all();

            $podcast = Product::active()
                ->ofType('podcast')
                ->with('episodes')
                ->first();

            $liveWebinars = Event::published()
                ->where('type', 'webinar')
                ->whereNotNull('live_url')
                ->where(function ($query): void {
                    $query->whereNull('event_date')
                        ->orWhere('event_date', '>=', now()->subHours(3));
                })
                ->orderByRaw('event_date is null, event_date asc')
                ->limit(3)
                ->get()
                ->map(function (Event $event): array {
                    $startsAt = $event->event_date;
                    $endsAt = $startsAt?->copy()->addMinutes($event->duration_minutes ?: 120);

                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'slug' => $event->slug,
                        'instructor' => $event->speaker,
                        'platform_label' => $event->location ?: 'کلاس آنلاین',
                        'event_date' => $startsAt?->toIso8601String(),
                        'status' => $startsAt && $startsAt->isPast() && (! $endsAt || $endsAt->isFuture()) ? 'live' : 'upcoming',
                        'live_url' => $event->live_url,
                    ];
                })
                ->values()
                ->all();

            return [
                'courses' => $courses,
                'services' => Service::active()->where('is_featured', true)->limit(6)->get()->toArray(),
                'testimonials' => Testimonial::approved()->limit(6)->get()->toArray(),
                'posts' => BlogPost::published()->with('author')->latest('published_at')->limit(3)->get()->toArray(),
                'books' => Product::active()->ofType('book')->latest()->limit(3)->get()->toArray(),
                'podcast' => $podcast?->toArray(),
                'liveWebinars' => $liveWebinars,
            ];
        });

        $siteName = (string) Setting::get('site_name', 'مرکز رشد و کارآفرینی دکتر بیدی');
        $seo = Seo::page(
            $request,
            $siteName,
            (string) Setting::get('meta_description', Setting::get('site_slogan', 'طراحی مسیر آینده نوجوانان')),
            null,
            [
                '@type' => 'WebSite',
                'name' => $siteName,
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => url('/courses').'?q={search_term_string}',
                    'query-input' => 'required name=search_term_string',
                ],
            ],
        );

        return Inertia::render('Home', [
            'seo' => $seo,
            ...$content,
            'stats' => [
                ['value' => (int) Setting::get('stat_students', 2500), 'suffix' => '+', 'label' => 'نوجوان همراه ما'],
                ['value' => (int) Setting::get('stat_sessions', 5000), 'suffix' => '+', 'label' => 'جلسه کوچینگ برگزارشده'],
                ['value' => (int) Setting::get('stat_satisfaction', 97), 'suffix' => '٪', 'label' => 'رضایت والدین'],
                ['value' => (int) Setting::get('stat_experience', 8), 'suffix' => '+', 'label' => 'سال تجربه کاری'],
            ],
        ]);
    }

}
