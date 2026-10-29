import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Loading } from './src/components';
import type { RootStackParamList } from './src/navigation/types';

import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CoursesScreen } from './src/screens/CoursesScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { CourseDetailScreen } from './src/screens/CourseDetailScreen';
import { LearningScreen } from './src/screens/LearningScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { RemindersScreen } from './src/screens/RemindersScreen';
import { SessionsScreen } from './src/screens/SessionsScreen';
import { GoalsScreen } from './src/screens/GoalsScreen';
import { SupportScreen } from './src/screens/SupportScreen';
import { AdminPanelScreen } from './src/screens/AdminPanelScreen';

// Prepare the app for right-to-left Persian layout.
I18nManager.allowRTL(true);

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
    const { colors } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
                tabBarStyle: [
                    styles.tabBar,
                    { backgroundColor: colors.surface, borderTopColor: colors.border },
                ],
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'خانه',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Courses"
                component={CoursesScreen}
                options={{
                    title: 'آکادمی',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'school' : 'school-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Shop"
                component={ShopScreen}
                options={{
                    title: 'فروشگاه',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    title: 'داشبورد',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    title: 'پروفایل',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function RootNavigator() {
    const { token, loading } = useAuth();
    const { colors, isDark } = useTheme();

    if (loading) {
        return <Loading label="در حال آماده‌سازی…" />;
    }

    return (
        <View style={[styles.root, { backgroundColor: colors.bg }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: colors.surface },
                    headerTitleStyle: { color: colors.text, fontWeight: '700' },
                    headerTintColor: colors.primary,
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: colors.bg },
                }}
            >
                {token ? (
                    <>
                        <Stack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'جزئیات دوره' }} />
                        <Stack.Screen name="Learning" component={LearningScreen} options={{ title: 'اتاق یادگیری' }} />
                        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'معرفی محصول' }} />
                        <Stack.Screen name="Reminders" component={RemindersScreen} options={{ title: 'یادآوری‌های هوشمند' }} />
                        <Stack.Screen name="Sessions" component={SessionsScreen} options={{ title: 'جلسات کوچینگ' }} />
                        <Stack.Screen name="Goals" component={GoalsScreen} options={{ title: 'آزمون‌ها و گواهینامه‌ها' }} />
                        <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'تیکت و پشتیبانی' }} />
                        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ title: 'پنل مدیریت کل سایت (Admin)' }} />
                        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'تنظیمات اتصال' }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </View>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <NavigationContainer>
                        <RootNavigator />
                    </NavigationContainer>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        // Force right-to-left layout for the Persian interface.
        direction: 'rtl',
    },
    tabBar: {
        height: 64,
        paddingBottom: 8,
        paddingTop: 6,
    },
    tabLabel: { fontSize: 11, fontWeight: '600' },
});

