import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import BrandLogo from '@/Components/BrandLogo';
import '../../css/pwa-install.css';
const KEY = 'markaz-native-download-dismissed-until';
export default function PwaInstallPrompt() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        let until = 0;
        try { until = Number(localStorage.getItem(KEY) || 0); } catch {}
        const timer = setTimeout(() => setVisible(until < Date.now() && !location.pathname.startsWith('/download-app')), 2500);
        return () => clearTimeout(timer);
    }, []);
    const dismiss = () => {
        try { localStorage.setItem(KEY, String(Date.now() + 7 * 86400000)); } catch {}
        setVisible(false);
    };
    if (!visible) return null;
    return <aside className="pwa-prompt" dir="rtl" aria-label="دانلود اپلیکیشن مرکز رشد">
        <div className="pwa-prompt-icon"><BrandLogo src="/app-icon" alt="" className="size-full rounded-xl object-contain" /></div>
        <div className="min-w-0 flex-1">
            <strong className="block text-sm font-black text-navy">اپلیکیشن مرکز رشد را دانلود کنید</strong>
            <p className="mt-1 text-xs leading-5 text-navy/60">اپلیکیشن اندروید را روی گوشی نصب کنید و به دوره‌ها و پنل خود دسترسی داشته باشید.</p>
            <div className="mt-3 flex flex-wrap gap-2">
                <a href="/download-app/" className="pwa-prompt-primary"><Download className="size-4" /> دریافت اپلیکیشن</a>
                <button type="button" onClick={dismiss} className="pwa-prompt-dismiss">بعداً</button>
            </div>
        </div>
        <button type="button" onClick={dismiss} className="pwa-prompt-close" aria-label="بستن پیام دانلود"><X className="size-4" /></button>
    </aside>;
}
