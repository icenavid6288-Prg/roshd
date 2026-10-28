# مرکز رشد و کارآفرینی دکتر بیدی

پلتفرم آموزش، فروشگاه، کوچینگ و CRM روی Laravel 12 + Inertia + React.

## امکانات فعلی

- وب‌سایت عمومی: دوره‌ها، فروشگاه، بلاگ، خدمات، تیم، کوچینگ
- ثبت‌نام و ورود با شماره موبایل و کد پیامک
- پنل دانش‌آموز، والد (اتصال فرزند)، مدرس (تصحیح تکلیف) و کوچ (هدف، زمان آزاد، جلسه)
- خرید دوره و محصول با درگاه زرین‌پال / آیدی‌پی / زیبال
- کوپن تخفیف و معرفی دوستان
- آزمون، تکلیف، گواهینامه، یادداشت و نشانک درس
- درس رایگان بدون ثبت‌نام کامل
- رزرو جلسه کوچینگ با پرداخت، لغو با بازگشت وجه و تقویم تکرارشونده
- کتابخانه رسانه با نسخه‌بندی و مرکز گزارش CSV/چاپ
- علاقه‌مندی، نظر بلاگ و صفحات CMS عمومی (`/p/{slug}`)
- CRM، بازاریابی پیامکی، نظرسنجی و چت پشتیبانی

## استقرار روی هاست بدون Composer

بستهٔ کامل انتشار را از خروجی workflow «Build deployment package» دریافت کنید. این بسته `vendor` کامل و باندل Laravel در `public/build` را دارد و به Composer یا Node روی هاست نیاز ندارد. کپیِ صرف فایل `vendor/autoload.php` یا پوشهٔ ناقص vendor کافی نیست.

برای به‌روزرسانی سایت موجود، فایل `.env`، کلید `APP_KEY` و داده‌های `storage` را حفظ کنید؛ نصب‌کننده را دوباره اجرا نکنید. برای نصب تازه، `public/install.php` را باز کنید.

ساخت محلی بسته:

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
pnpm install --frozen-lockfile
pnpm run build
```

دستور build، `public/build/manifest.json` موردنیاز Blade را می‌سازد. `pnpm run build:preview` فقط برای پیش‌نمایش مستقل است و خروجی آن جایگزین build لاراول نمی‌شود. نسخه‌های وابستگی‌ها در `composer.lock` و `pnpm-lock.yaml` قفل شده‌اند.

## اجرای محلی

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev
php artisan serve
```

ورود مدیر بعد از seeder: شماره موجود در `AdminUserSeeder`.

## اپ‌ها

- موبایل (Expo): پوشه [`mobile/`](mobile/README.md) — به `/api/v1` وصل می‌شود
- دسکتاپ (Electron): پوشه [`desktop/`](desktop/README.md)

API موبایل فعلاً کاتالوگ، احراز هویت و داشبورد خلاصه را پوشش می‌دهد؛ خرید و پلیر دوره روی وب است.

## امنیت استقرار

- `APP_DEBUG=false` و درگاه واقعی (نه `local`) در production
- پس از نصب، `public/install.php` را حذف کنید
- فایل‌های دانلودی و تکالیف روی دیسک خصوصی ذخیره می‌شوند
- `php artisan schedule:run` را روی cron هاست فعال کنید
