<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CatalogController;
use App\Http\Controllers\Api\V1\CommerceController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\LearningController;
use App\Http\Controllers\InstagramWebhookController;
use App\Models\Assignment;
use App\Models\CoachingSession;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/instagram/webhook', [InstagramWebhookController::class, 'verify'])->name('instagram.webhook.verify');
Route::post('/instagram/webhook', [InstagramWebhookController::class, 'receive'])->name('instagram.webhook.receive');

// Reserved for a future official Eitaa inbound API; answers 501 with an explanation today.
Route::post('/eitaa/webhook/{bot}', [\App\Http\Controllers\EitaaWebhookController::class, 'receive'])->name('eitaa.webhook.receive');

Route::prefix('v1')->middleware('throttle:60,1')->group(function (): void {
    Route::get('/home', [HomeController::class, 'index'])->name('api.v1.home');

    Route::get('/courses', [CatalogController::class, 'courses'])->name('api.v1.courses.index');
    Route::get('/courses/{course:slug}', [CatalogController::class, 'course'])->name('api.v1.courses.show');
    Route::get('/products', [CatalogController::class, 'products'])->name('api.v1.products.index');
    Route::get('/products/{product:slug}', [CatalogController::class, 'product'])->name('api.v1.products.show');

    // Dynamic Coaching & VIP Workshop Sessions (Managed in /admin/content/coaching)
    Route::get('/sessions', function () {
        $sessions = CoachingSession::with('coach')->latest('scheduled_at')->limit(20)->get()->map(fn (CoachingSession $s) => [
            'id' => $s->id,
            'title' => $s->notes ?: 'جلسه کوچینگ و کارگاه دوره پریمیوم',
            'coach_name' => $s->coach?->name ?? 'دکتر علیرضا بیدی',
            'coach_title' => 'مدرس و کوچ ارشد مرکز رشد',
            'date_label' => optional($s->scheduled_at)->format('Y/m/d') ?? 'به‌زودی',
            'time_label' => optional($s->scheduled_at)->format('H:i') ?? '۱۷:۰۰',
            'duration_minutes' => $s->duration_minutes ?? 90,
            'status' => $s->status === 'completed' ? 'completed' : ($s->status === 'cancelled' ? 'cancelled' : 'upcoming'),
            'meeting_url' => $s->meeting_link,
            'notes' => $s->report ?: $s->notes,
        ]);
        return response()->json(['data' => $sessions]);
    })->name('api.v1.sessions.index');

    // Dynamic Goals & Assignments (Managed in /admin/assignments)
    Route::get('/goals', function () {
        $goals = Assignment::with('course')->latest()->limit(20)->get()->map(fn (Assignment $a) => [
            'id' => $a->id,
            'title' => $a->title,
            'category' => $a->course?->title ?? 'مسیر رشد ۹۰ روزه',
            'target_date' => optional($a->due_at)->format('Y/m/d') ?? 'فصل جاری',
            'progress' => 50,
            'completed' => false,
        ]);
        return response()->json(['data' => $goals]);
    })->name('api.v1.goals.index');

    // Dynamic Support Tickets (Managed in /admin/content/tickets)
    Route::get('/support', function (Request $request) {
        $user = $request->user('sanctum');
        $query = Ticket::query()->latest();
        if ($user) {
            $query->where('user_id', $user->id);
        }
        $tickets = $query->limit(20)->get()->map(fn (Ticket $t) => [
            'id' => $t->id,
            'subject' => $t->subject,
            'department' => $t->department ?? 'پشتیبانی آموزش و دوره VIP',
            'status' => $t->status === 'answered' ? 'answered' : ($t->status === 'closed' ? 'closed' : 'pending'),
            'updated_at' => optional($t->updated_at)->diffForHumans() ?? 'هم‌اکنون',
            'last_message' => $t->message ?? '',
        ]);
        return response()->json(['data' => $tickets]);
    })->name('api.v1.support.index');

    Route::prefix('auth')->name('auth.')->group(function (): void {
        Route::post('/register', [\App\Http\Controllers\Api\V1\PhoneAuthController::class, 'requestCode'])->middleware('throttle:5,1')->name('register');
        Route::post('/login', [\App\Http\Controllers\Api\V1\PhoneAuthController::class, 'requestCode'])->middleware('throttle:5,1')->name('login');
        Route::post('/otp/request', [\App\Http\Controllers\Api\V1\PhoneAuthController::class, 'requestCode'])->middleware('throttle:5,1');
        Route::post('/otp/verify', [\App\Http\Controllers\Api\V1\PhoneAuthController::class, 'verify'])->middleware('throttle:20,1');
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum')->name('me');
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
    });

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('auth:sanctum')
        ->name('api.v1.dashboard');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/courses/{course:slug}/checkout', [CommerceController::class, 'checkoutCourse'])->middleware('throttle:10,1')->name('api.v1.courses.checkout');
        Route::post('/courses/{course:slug}/activate', function (Request $request, Course $course) {
            $enrollment = Enrollment::updateOrCreate(
                ['user_id' => $request->user()->id, 'course_id' => $course->id],
                ['status' => 'active', 'enrolled_at' => now()]
            );
            return response()->json(['data' => $enrollment, 'message' => 'دوره پریمیوم با موفقیت فعال شد و تمام جلسات باز شدند.']);
        })->name('api.v1.courses.activate');
        Route::post('/cart/products/{product}', [CommerceController::class, 'addToCart'])->name('api.v1.cart.store');
        Route::post('/wishlist', [CommerceController::class, 'toggleWishlist'])->name('api.v1.wishlist.toggle');
        Route::get('/learning/{course:slug}/{lesson?}', [LearningController::class, 'show'])->name('api.v1.learning.show');
        Route::post('/learning/{course:slug}/lessons/{lesson}/progress', [LearningController::class, 'progress'])->name('api.v1.learning.progress');
        Route::post('/learning/{course:slug}/lessons/{lesson}/notes', [LearningController::class, 'note'])->name('api.v1.learning.notes');
        Route::post('/learning/{course:slug}/lessons/{lesson}/bookmark', [LearningController::class, 'bookmark'])->name('api.v1.learning.bookmark');
    });
});
