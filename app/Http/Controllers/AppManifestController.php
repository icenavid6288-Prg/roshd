<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class AppManifestController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $name = (string) Setting::get('site_name', 'مرکز رشد و کارآفرینی دکتر بیدی');
        $shortName = mb_substr($name, 0, 24);

        return response()->json([
            'id' => '/',
            'name' => $name,
            'short_name' => $shortName,
            'lang' => 'fa-IR',
            'dir' => 'rtl',
            'start_url' => '/',
            'scope' => '/',
            'display' => 'standalone',
            'display_override' => ['window-controls-overlay', 'standalone'],
            'orientation' => 'portrait-primary',
            'background_color' => '#f5faf7',
            'theme_color' => '#087f52',
            'description' => (string) Setting::get('site_slogan', 'اکوسیستم آموزش، کوچینگ و طراحی مسیر رشد نوجوانان'),
            'categories' => ['education', 'lifestyle'],
            'prefer_related_applications' => false,
            'icons' => [
                ['src' => url('/pwa-192x192.png'), 'sizes' => '192x192', 'type' => 'image/png', 'purpose' => 'any'],
                ['src' => url('/pwa-512x512.png'), 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'any'],
                ['src' => url('/pwa-maskable-512x512.png'), 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'maskable'],
            ],
            'shortcuts' => [
                ['name' => 'دوره‌ها', 'short_name' => 'دوره‌ها', 'url' => '/courses', 'icons' => [['src' => url('/pwa-192x192.png'), 'sizes' => '192x192', 'type' => 'image/png']]],
                ['name' => 'فروشگاه', 'short_name' => 'فروشگاه', 'url' => '/shop', 'icons' => [['src' => url('/pwa-192x192.png'), 'sizes' => '192x192', 'type' => 'image/png']]],
                ['name' => 'پنل کاربری', 'short_name' => 'پنل کاربری', 'url' => '/dashboard', 'icons' => [['src' => url('/pwa-192x192.png'), 'sizes' => '192x192', 'type' => 'image/png']]],
            ],
        ])->header('Cache-Control', 'no-cache, must-revalidate');
    }
}
