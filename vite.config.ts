import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const isLaravel = mode === 'laravel';

    return {
        plugins: [
            ...(isLaravel
                ? [
                      laravel({
                          input: ['resources/css/app.css', 'resources/js/app.tsx'],
                          refresh: true,
                      }),
                  ]
                : []),
            tailwindcss(),
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/js'),
                'ziggy-js': path.resolve(__dirname, 'resources/js/lib/route.ts'),
            },
        },
        optimizeDeps: {
            entries: ['resources/js/app.tsx'],
        },
        build: {
            target: 'es2020',
            cssMinify: true,
            sourcemap: false,
            emptyOutDir: true,
        },
        server: {
            host: '0.0.0.0',
            port: 3000,
            hmr: false,
            watch: {
                ignored: [
                    '**/vendor/**',
                    '**/storage/**',
                    '**/desktop/**',
                    '**/public/build/**',
                    '**/bootstrap/**',
                    '**/tests/**',
                ],
            },
        },
    };
});
