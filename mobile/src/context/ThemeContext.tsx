import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, type ThemeColors } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
    mode: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => Promise<void>;
    setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const THEME_STORAGE_KEY = 'markaz_mobile_theme';

const ThemeContext = createContext<ThemeContextValue>({
    mode: 'light',
    isDark: false,
    colors: lightColors,
    toggleTheme: async () => {},
    setThemeMode: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('light');

    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY)
            .then((saved) => {
                if (saved === 'dark' || saved === 'light') {
                    setMode(saved);
                }
            })
            .catch(() => undefined);
    }, []);

    const setThemeMode = useCallback(async (nextMode: ThemeMode) => {
        setMode(nextMode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
        } catch {
            // Ignore storage write errors
        }
    }, []);

    const toggleTheme = useCallback(async () => {
        const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
        await setThemeMode(next);
    }, [mode, setThemeMode]);

    const value = useMemo<ThemeContextValue>(
        () => ({
            mode,
            isDark: mode === 'dark',
            colors: mode === 'dark' ? darkColors : lightColors,
            toggleTheme,
            setThemeMode,
        }),
        [mode, toggleTheme, setThemeMode],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
    return useContext(ThemeContext);
}
