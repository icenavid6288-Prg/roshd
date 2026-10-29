<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Sms\SmsSender;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PhoneAuthController extends Controller
{
    public function requestCode(Request $request, SmsSender $sms): JsonResponse
    {
        $data = $request->validate(['phone' => ['required', 'string', 'regex:/^09[0-9]{9}$/']]);
        $phone = $data['phone'];
        $key = 'mobile-otp-request:'.hash('sha256', $phone);
        $ipKey = 'mobile-otp-request-ip:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 3) || RateLimiter::tooManyAttempts($ipKey, 20)) {
            return response()->json(['message' => 'درخواست‌های زیادی ثبت شده است. چند دقیقه دیگر تلاش کنید.'], 429);
        }
        return Cache::lock($key.':lock', 10)->block(3, function () use ($phone, $key, $ipKey, $sms) {
            $currentKey = 'mobile-otp-current:'.hash('sha256', $phone);
            $previous = Cache::get($currentKey);
            $pending = $previous ? Cache::get('mobile-otp:'.$previous) : null;
            if ($pending && $pending['sent_at'] > now()->subSeconds(60)->timestamp) {
                return response()->json(['message' => 'برای ارسال مجدد یک دقیقه صبر کنید.'], 429);
            }
            RateLimiter::hit($key, 300);
            RateLimiter::hit($ipKey, 300);
            $challenge = Str::random(64);
            $code = (string) random_int(100000, 999999);
            try {
                $sms->sendOtp($phone, $code);
            } catch (\Throwable $exception) {
                report($exception);
                return response()->json(['message' => 'ارسال پیامک انجام نشد. کمی بعد دوباره تلاش کنید.'], 503);
            }
            Cache::put('mobile-otp:'.$challenge, ['phone' => $phone, 'hash' => Hash::make($code), 'sent_at' => now()->timestamp], 300);
            Cache::put($currentKey, $challenge, 300);
            if ($previous) Cache::forget('mobile-otp:'.$previous);
            return response()->json(['data' => ['challenge' => $challenge, 'expires_in' => 300, 'retry_after' => 60]]);
        });
    }

    public function verify(Request $request): JsonResponse
    {
        $data = $request->validate([
            'challenge' => ['required', 'string', 'size:64'],
            'code' => ['required', 'string', 'regex:/^[0-9]{6}$/'],
        ]);
        return Cache::lock('mobile-otp-verify:'.$data['challenge'], 10)->block(3, function () use ($data, $request) {
            $cacheKey = 'mobile-otp:'.$data['challenge'];
            $pending = Cache::get($cacheKey);
            if (! $pending || Cache::get('mobile-otp-current:'.hash('sha256', $pending['phone'])) !== $data['challenge']) {
                throw ValidationException::withMessages(['code' => 'کد منقضی شده است. دوباره کد بگیرید.']);
            }
            $attemptKey = 'mobile-otp-attempt:'.hash('sha256', $pending['phone']);
            if (RateLimiter::tooManyAttempts($attemptKey, 5)) {
                return response()->json(['message' => 'تعداد تلاش‌ها بیش از حد مجاز است. پنج دقیقه دیگر تلاش کنید.'], 429);
            }
            if (! Hash::check($data['code'], $pending['hash'])) {
                RateLimiter::hit($attemptKey, 300);
                throw ValidationException::withMessages(['code' => 'کد تأیید صحیح نیست.']);
            }
            $result = DB::transaction(function () use ($pending) {
                $user = User::firstOrCreate(['phone' => $pending['phone']], [
                    'name' => 'همراه رشد', 'password' => Hash::make(Str::random(48)), 'is_active' => true,
                ]);
                if (! $user->is_active) {
                    throw ValidationException::withMessages(['phone' => 'امکان ورود به این حساب وجود ندارد. با پشتیبانی تماس بگیرید.']);
                }
                $user->assignDefaultCustomerRole();
                return ['token' => $user->createToken('Roshd mobile')->plainTextToken, 'user' => $user->only(['id', 'name', 'email', 'phone', 'avatar', 'bio'])];
            });
            Cache::forget($cacheKey);
            Cache::forget('mobile-otp-current:'.hash('sha256', $pending['phone']));
            RateLimiter::clear($attemptKey);
            return response()->json(['data' => $result]);
        });
    }
}
