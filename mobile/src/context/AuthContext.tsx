import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api/client';
import type { AuthData, UserPayload } from '../api/types';

interface AuthContextValue {
    user: UserPayload | null;
    token: string | null;
    loading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateProfile: (payload: Partial<UserPayload>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserPayload | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const profile = await api<UserPayload>('/api/v1/auth/me');
            setUser(profile);
        } catch {
            await setToken(null);
            setTokenState(null);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const existing = await getToken();
            if (!mounted) return;
            if (existing) {
                setTokenState(existing);
                await refreshUser();
            }
            if (mounted) setLoading(false);
        })();
        return () => {
            mounted = false;
        };
    }, [refreshUser]);

    const login = useCallback(async (identifier: string, password: string) => {
        const result = await api<AuthData>('/api/v1/auth/login', {
            method: 'POST',
            auth: false,
            body: { [identifier.includes('@') ? 'email' : 'phone']: identifier, password, device_name: 'markaz-mobile' },
        });
        await setToken(result.token);
        setTokenState(result.token);
        setUser(result.user);
    }, []);

    const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
        const result = await api<AuthData>('/api/v1/auth/register', {
            method: 'POST',
            auth: false,
            body: {
                name,
                email,
                phone,
                password,
                password_confirmation: password,
                device_name: 'markaz-mobile',
            },
        });
        await setToken(result.token);
        setTokenState(result.token);
        setUser(result.user);
    }, []);

    const updateProfile = useCallback(async (payload: Partial<UserPayload>) => {
        const updated = await api<UserPayload>('/api/v1/auth/me', {
            method: 'PUT',
            body: payload as Record<string, unknown>,
        });
        setUser(updated);
    }, []);

    const logout = useCallback(async () => {
        try {
            await api('/api/v1/auth/logout', { method: 'POST' });
        } catch {
            // Ignore network errors when logging out.
        }
        await setToken(null);
        setTokenState(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
