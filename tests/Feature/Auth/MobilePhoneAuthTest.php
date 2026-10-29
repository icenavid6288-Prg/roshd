<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Services\Sms\SmsSender;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Mockery;
use Tests\TestCase;

class MobilePhoneAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    private function issue(string $phone = '09123456789'): array
    {
        $code = null;
        $sms = Mockery::mock(SmsSender::class);
        $sms->shouldReceive('sendOtp')->once()->with($phone, Mockery::on(function ($value) use (&$code) { $code = $value; return true; }));
        $this->app->instance(SmsSender::class, $sms);
        $response = $this->postJson('/api/v1/auth/otp/request', ['phone' => $phone])->assertOk();
        $response->assertJsonMissingPath('data.code');
        return ['challenge' => $response->json('data.challenge'), 'code' => $code];
    }

    public function test_verified_new_phone_creates_account_only_after_verification(): void
    {
        $credentials = $this->issue();
        $this->assertDatabaseMissing('users', ['phone' => '09123456789']);
        $this->postJson('/api/v1/auth/otp/verify', $credentials)->assertOk()->assertJsonPath('data.user.phone', '09123456789')->assertJsonStructure(['data' => ['token']]);
        $this->assertDatabaseHas('users', ['phone' => '09123456789']);
    }

    public function test_existing_user_logs_into_the_same_account_and_code_is_single_use(): void
    {
        $user = User::factory()->create(['phone' => '09123456789', 'is_active' => true]);
        $credentials = $this->issue();
        $result = $this->postJson('/api/v1/auth/otp/verify', $credentials)->assertOk()->assertJsonPath('data.user.id', $user->id);
        $this->withToken($result->json('data.token'))->getJson('/api/v1/auth/me')->assertOk()->assertJsonPath('data.id', $user->id);
        $this->postJson('/api/v1/auth/otp/verify', $credentials)->assertUnprocessable();
        $this->assertSame(1, User::where('phone', '09123456789')->count());
    }

    public function test_wrong_codes_are_limited_and_do_not_create_a_user(): void
    {
        $credentials = $this->issue();
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/otp/verify', [...$credentials, 'code' => '000000'])->assertUnprocessable();
        }
        $this->postJson('/api/v1/auth/otp/verify', $credentials)->assertStatus(429);
        $this->assertDatabaseMissing('users', ['phone' => '09123456789']);
    }

    public function test_expired_and_superseded_challenges_are_rejected(): void
    {
        $old = $this->issue();
        $this->travel(61)->seconds();
        $fresh = $this->issue();
        $this->postJson('/api/v1/auth/otp/verify', $old)->assertUnprocessable();
        $this->travel(301)->seconds();
        $this->postJson('/api/v1/auth/otp/verify', $fresh)->assertUnprocessable();
    }

    public function test_inactive_user_cannot_log_in(): void
    {
        User::factory()->create(['phone' => '09123456789', 'is_active' => false]);
        $this->postJson('/api/v1/auth/otp/verify', $this->issue())->assertUnprocessable();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_resend_has_a_cooldown(): void
    {
        $this->issue();
        $this->postJson('/api/v1/auth/otp/request', ['phone' => '09123456789'])->assertStatus(429);
    }

    public function test_sms_failure_never_returns_a_code_or_creates_an_account(): void
    {
        $sms = Mockery::mock(SmsSender::class);
        $sms->shouldReceive('sendOtp')->once()->andThrow(new \RuntimeException('SMS unavailable'));
        $this->app->instance(SmsSender::class, $sms);
        $this->postJson('/api/v1/auth/otp/request', ['phone' => '09123456789'])->assertStatus(503)->assertJsonMissingPath('data.challenge');
        $this->assertDatabaseMissing('users', ['phone' => '09123456789']);
    }

    public function test_production_log_driver_cannot_pretend_to_send_an_otp(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        $sms = Mockery::mock(SmsSender::class);
        $sms->shouldNotReceive('sendOtp');
        $this->app->instance(SmsSender::class, $sms);
        $this->postJson('/api/v1/auth/otp/request', ['phone' => '09123456789'])->assertStatus(503);
    }
}
