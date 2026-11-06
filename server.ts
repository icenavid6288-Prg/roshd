import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { resolveInertiaRoute } from './resources/js/lib/inertiaServerRoutes';
import { createInitialDynamicAppState, DynamicAppState } from './resources/js/lib/dynamicAppStore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store for persistent interactions during runtime
const memoryStore = {
    leads: [] as any[],
    contacts: [] as any[],
    tickets: [] as any[],
    cart: [] as any[],
    currentUser: {
        id: 1,
        name: 'نوید محمدی',
        phone: '09123456789',
        email: 'navid@roshd.ir',
        role: 'student',
    },
    appState: createInitialDynamicAppState() as DynamicAppState,
};

function getResolvedPage(urlPath: string) {
    const cleanPath = urlPath.split('?')[0].replace(/\/$/, '') || '/';
    const resolved = resolveInertiaRoute(cleanPath);
    resolved.props.dynamicAppState = memoryStore.appState;
    return resolved;
}

// Unified App & Website Dynamic State API
app.get('/api/app-state', (_req: Request, res: Response) => {
    res.json(memoryStore.appState);
});

app.post('/api/app-state', (req: Request, res: Response) => {
    if (req.body && typeof req.body === 'object') {
        memoryStore.appState = {
            ...memoryStore.appState,
            ...req.body,
            userProfile: {
                ...memoryStore.appState.userProfile,
                ...(req.body.userProfile || {}),
            },
            notifSettings: {
                ...memoryStore.appState.notifSettings,
                ...(req.body.notifSettings || {}),
            },
        };
    }
    res.json({ success: true, appState: memoryStore.appState });
});

// API Routes
app.post('/api/contact', (req: Request, res: Response) => {
    memoryStore.contacts.push({ ...req.body, created_at: new Date().toISOString() });
    res.json({ success: true, message: 'پیام شما با موفقیت ثبت شد.' });
});

app.post('/api/leads', (req: Request, res: Response) => {
    memoryStore.leads.push({ ...req.body, created_at: new Date().toISOString() });
    res.json({ success: true, message: 'اطلاعات با موفقیت ثبت گردید.' });
});

app.post('/api/login', (req: Request, res: Response) => {
    res.json({ success: true, user: memoryStore.currentUser });
});

app.post('/logout', (req: Request, res: Response) => {
    if (req.headers['x-inertia']) {
        res.setHeader('X-Inertia-Location', '/');
        return res.status(409).end();
    }
    res.redirect('/');
});

let vite: any = null;
let viteReadyPromise: Promise<void> | null = null;
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
    viteReadyPromise = (async () => {
        const { createServer } = await import('vite');
        vite = await createServer({
            server: {
                middlewareMode: true,
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
            optimizeDeps: {
                entries: ['resources/js/app.tsx'],
            },
            appType: 'custom',
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, 'resources/js'),
                    'ziggy-js': path.resolve(__dirname, 'resources/js/lib/route.ts'),
                },
            },
        });
    })();

    app.use(async (req, res, next) => {
        if (viteReadyPromise) {
            await viteReadyPromise;
        }
        if (vite) {
            return vite.middlewares(req, res, next);
        }
        next();
    });
} else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
}

// Public static assets fallback
app.use(express.static(path.resolve(__dirname, 'public')));

// Dedicated routes for dynamic Laravel icon/manifest URLs
app.get('/app-icon', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.sendFile(path.resolve(__dirname, 'public/pwa-512x512.png'));
});

app.get('/site-logo', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.sendFile(path.resolve(__dirname, 'public/images/brand-logo.png'));
});

app.get('/app-manifest.webmanifest', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.sendFile(path.resolve(__dirname, 'public/manifest.webmanifest'));
});

// Universal Inertia & Page Handler
app.use(async (req: Request, res: Response, next) => {
    if (viteReadyPromise) {
        await viteReadyPromise;
    }

    const url = req.originalUrl;

    // Skip internal/vite assets
    if (url.startsWith('/@') || url.startsWith('/resources/') || url.startsWith('/node_modules/')) {
        return next();
    }

    const resolved = getResolvedPage(url);
    const pageData = {
        component: resolved.component,
        props: resolved.props,
        url,
        version: '1.0',
    };

    // Inertia AJAX request
    if (req.headers['x-inertia']) {
        res.setHeader('X-Inertia', 'true');
        res.setHeader('Vary', 'Accept');
        return res.json(pageData);
    }

    // Full HTML request
    try {
        let template: string;
        if (!isProd && vite) {
            template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
            template = await vite.transformIndexHtml(url, template);
        } else {
            template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
        }

        // Inject data-page into #app
        const pageJson = JSON.stringify(pageData).replace(/"/g, '&quot;');
        const html = template.replace(
            /<div id="app".*?><\/div>/,
            `<div id="app" data-page="${pageJson}"></div>`
        );

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
        if (vite) vite.ssrFixStacktrace(e);
        console.error(e);
        res.status(500).end(e.stack || e.message);
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
});

