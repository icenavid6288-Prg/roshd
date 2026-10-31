import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Screen, PrimaryButton } from '../components';
import { openSitePage } from '../api/client';
import { useTheme } from '../context/ThemeContext';
export function AdminPanelScreen() {
    const { colors } = useTheme();
    const [error, setError] = useState('');
    return <Screen><View style={{ padding: 24, gap: 20 }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', textAlign: 'right' }}>مدیریت مرکز رشد</Text>
        <Text style={{ color: colors.muted, textAlign: 'right', lineHeight: 28 }}>برای مدیریت اطلاعات واقعی سایت، پنل مدیریت را باز کنید. ورود با حساب مدیر در مرورگر لازم است.</Text>
        <PrimaryButton title="باز کردن پنل مدیریت" onPress={() => { openSitePage('/admin').catch(() => setError('باز کردن پنل انجام نشد.')); }} />
        {!!error && <Text style={{ color: colors.danger }}>{error}</Text>}
    </View></Screen>;
}
