import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { resolveInertiaRoute } from './resources/js/lib/inertiaServerRoutes';

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
        name: 'کاربر آزمایشی',
        phone: '09123456789',
        email: 'user@markazbidi.ir',
        role: 'student',
    },
};

function getResolvedPage(urlPath: string) {
    const cleanPath = urlPath.split('?')[0].replace(/\/$/, '') || '/';
    return resolveInertiaRoute(cleanPath);
}

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

async function startServer() {
    const isProd = process.env.NODE_ENV === 'production';
    let vite: any;

    if (!isProd) {
        const { createServer } = await import('vite');
        vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static(path.resolve(__dirname, 'dist')));
    }

    // Public static assets fallback
    app.use(express.static(path.resolve(__dirname, 'public')));

    // Universal Inertia & Page Handler
    app.use('*', async (req: Request, res: Response, next) => {
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
}

startServer();
