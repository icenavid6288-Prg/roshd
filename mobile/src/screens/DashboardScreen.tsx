import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, RefreshControl, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api, ApiError } from '../api/client';
import type { DashboardData } from '../api/types';
import type { TabStackNavigation } from '../navigation/types';
import { Loading, Screen, EmptyState, PrimaryButton, ProgressBar } from '../components';
import { useTheme } from '../context/ThemeContext';
export function DashboardScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<TabStackNavigation>();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api<DashboardData>('/api/v1/dashboard')); setError(''); }
        catch (e) { setError(e instanceof ApiError ? e.message : 'دریافت اطلاعات انجام نشد.'); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { void load(); }, [load]);
    if (loading && !data) return <Loading />;
    return <Screen><ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', textAlign: 'right' }}>سلام {data?.user?.name || 'همراه مرکز رشد'}</Text>
        {!!error && <><Text accessibilityRole="alert" style={{ color: colors.danger, textAlign: 'right' }}>{error}</Text><PrimaryButton title="تلاش دوباره" onPress={load} /></>}
        {data && <><View style={{ backgroundColor: colors.surface, padding: 20, borderRadius: 18, gap: 12 }}>
            <Text style={{ color: colors.text, textAlign: 'right' }}>دوره‌های من: {data.stats.enrolled_count.toLocaleString('fa-IR')}</Text>
            <Text style={{ color: colors.text, textAlign: 'right' }}>دوره‌های تکمیل‌شده: {data.stats.completed_count.toLocaleString('fa-IR')}</Text>
            <Text style={{ color: colors.text, textAlign: 'right' }}>سفارش‌های اخیر: {data.recent_orders.length.toLocaleString('fa-IR')}</Text>
        </View><Text style={{ color: colors.text, fontSize: 20, textAlign: 'right' }}>ادامه یادگیری</Text>
        {!data.enrollments.length && <EmptyState title="هنوز در دوره‌ای ثبت‌نام نکرده‌اید" />}
        {data.enrollments.map(enrollment => enrollment.course && <View key={enrollment.id} style={{ backgroundColor: colors.surface, padding: 18, borderRadius: 18, gap: 12 }}>
            <Text style={{ color: colors.text, textAlign: 'right' }}>{enrollment.course.title}</Text><ProgressBar value={enrollment.progress} />
            <PrimaryButton title="مشاهده دوره" onPress={() => navigation.navigate('Learning', { slug: enrollment.course!.slug })} />
        </View>)}</>}
        <PrimaryButton title="مشاهده دوره‌ها" onPress={() => navigation.navigate('Courses')} />
        <PrimaryButton title="جلسات من" onPress={() => navigation.navigate('Sessions')} variant="outline" />
        <PrimaryButton title="پشتیبانی" onPress={() => navigation.navigate('Support')} variant="outline" />
    </ScrollView></Screen>;
}
