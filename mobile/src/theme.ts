// Design tokens shared across the mobile app — aligned with the web palette
// (Forest Green #0B3B2B + Gold #D4AF37 + Warm Cream #FAFBF7) with Dark Mode support.

export interface ThemeColors {
    bg: string;
    surface: string;
    surfaceAlt: string;
    primary: string;
    primaryDark: string;
    primarySoft: string;
    gold: string;
    goldSoft: string;
    text: string;
    muted: string;
    border: string;
    danger: string;
    dangerSoft: string;
    success: string;
    successSoft: string;
    white: string;
}

export const lightColors: ThemeColors = {
    bg: '#FAFBF7',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F6F1',
    primary: '#166534',
    primaryDark: '#0B3B2B',
    primarySoft: '#DCFCE7',
    gold: '#D4AF37',
    goldSoft: '#FEF9C3',
    text: '#0F172A',
    muted: '#64748B',
    border: '#E2E8F0',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
    success: '#16A34A',
    successSoft: '#DCFCE7',
    white: '#FFFFFF',
};

export const darkColors: ThemeColors = {
    bg: '#061811',
    surface: '#0C261B',
    surfaceAlt: '#123526',
    primary: '#22C55E',
    primaryDark: '#14532D',
    primarySoft: '#133826',
    gold: '#FACC15',
    goldSoft: '#3B2F0C',
    text: '#F8FAFC',
    muted: '#94A3B8',
    border: '#1E3A2F',
    danger: '#F87171',
    dangerSoft: '#3B1818',
    success: '#4ADE80',
    successSoft: '#133826',
    white: '#FFFFFF',
};

// Default static palette for backward compatibility
export const colors: ThemeColors = lightColors;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
} as const;

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
    pill: 999,
} as const;

export const typography = {
    hero: { fontSize: 24, fontWeight: '800' as const, lineHeight: 32 },
    title: { fontSize: 18, fontWeight: '700' as const, lineHeight: 26 },
    subtitle: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
    body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
    small: { fontSize: 12, fontWeight: '500' as const, lineHeight: 18 },
    tiny: { fontSize: 11, fontWeight: '500' as const, lineHeight: 16 },
};

// Format numbers using Persian digits for a native feel.
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function faNum(value: number | string | null | undefined): string {
    if (value === null || value === undefined) return '';
    const num = typeof value === 'number' ? value.toLocaleString('en-US') : String(value);
    return num.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function price(value: number | null | undefined): string {
    if (!value || value <= 0) return 'رایگان';
    return `${faNum(value)} تومان`;
}
