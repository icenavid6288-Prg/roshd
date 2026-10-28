import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { resolveInertiaRoute } from './resources/js/lib/inertiaServerRoutes';

function inertiaDevPlugin(): Plugin {
    return {
        name: 'inertia-dev-server',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = req.url || '/';
                const cleanPath = url.split('?')[0].replace(/\/$/, '') || '/';

                // Skip Vite internals and assets
                if (
                    url.startsWith('/@') ||
                    url.startsWith('/resources/') ||
                    url.startsWith('/node_modules/') ||
                    url.includes('.ts') ||
                    url.includes('.tsx') ||
                    url.includes('.css') ||
                    url.includes('.woff2') ||
                    url.includes('.ico') ||
                    url.includes('.png') ||
                    url.includes('.svg')
                ) {
                    return next();
                }

                // Health check API status endpoints
                if (cleanPath === '/admin/settings/sms/status') {
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({
                        kavenegar: { state: 'ok', message: 'سرویس اصلی کاوه‌نگار متصل است (تاخیر ۰.۴ ثانیه)' },
                        smsir: { state: 'ok', message: 'سرویس پشتیبان SMS.ir آماده سوییچ خودکار (Failover)' },
                        melipayamak: { state: 'not_configured', message: 'تنظیم نشده' },
                    }));
                }
                if (cleanPath === '/admin/settings/payment/status') {
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({
                        zarinpal: { state: 'ok', message: 'درگاه زرین‌پال متصل است' },
                    }));
                }

                // Handle Inertia POST requests (forms/actions)
                if (req.method === 'POST') {
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('X-Inertia', 'true');
                    res.setHeader('Vary', 'Accept');

                    const pageData = resolveInertiaRoute(cleanPath);
                    return res.end(
                        JSON.stringify({
                            component: pageData.component,
                            props: pageData.props,
                            url,
                            version: '1.0',
                        })
                    );
                }

                // Handle Inertia AJAX GET requests
                if (req.headers['x-inertia']) {
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('X-Inertia', 'true');
                    res.setHeader('Vary', 'Accept');

                    const pageData = resolveInertiaRoute(cleanPath);
                    return res.end(
                        JSON.stringify({
                            component: pageData.component,
                            props: pageData.props,
                            url,
                            version: '1.0',
                        })
                    );
                }

                next();
            });
        },
        transformIndexHtml(html, ctx) {
            const cleanPath = (ctx.originalUrl || '/').split('?')[0].replace(/\/$/, '') || '/';
            const pageData = resolveInertiaRoute(cleanPath);
            const pageJson = JSON.stringify({
                component: pageData.component,
                props: pageData.props,
                url: ctx.originalUrl || '/',
                version: '1.0',
            }).replace(/"/g, '&quot;');

            return html.replace(
                /<div id="app".*?><\/div>/,
                `<div id="app" data-page="${pageJson}"></div>`
            );
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        inertiaDevPlugin(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(process.cwd(), './resources/js'),
            'ziggy-js': path.resolve(process.cwd(), './resources/js/lib/route.ts'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        allowedHosts: true,
    },
    build: {
        rollupOptions: {
            output: {
                chunkFileNames: (chunkInfo) => {
                    const safeName = (chunkInfo.name || 'chunk').replace(/error/gi, 'status-page');
                    return `assets/${safeName}-[hash].js`;
                },
            },
        },
    },
});
