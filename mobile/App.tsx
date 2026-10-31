import React from 'react';
import { I18nManager, StyleSheet, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RoshdTabBar } from './src/navigation/RoshdTabBar';

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
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator tabBar={(props) => <RoshdTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
                tabBarStyle: [
                    styles.tabBar,
                    { backgroundColor: colors.surface, borderTopColor: colors.border, height: 66 + insets.bottom, paddingBottom: Math.max(insets.bottom, 8) },
                ],
                tabBarLabelStyle: styles.tabLabel,
                tabBarItemStyle: styles.tabItem,
                tabBarActiveBackgroundColor: colors.primarySoft,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                tabBarIconStyle: styles.tabIcon,
                tabBarLabelPosition: 'below-icon',
                tabBarBackground: () => <View style={[StyleSheet.absoluteFill, styles.tabBarBackground, { backgroundColor: colors.surface }]} />,
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
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'پروفایل', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} /> }} />
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
    const [fontsLoaded] = useFonts({
        Vazirmatn: require('./assets/fonts/Vazirmatn-Regular.ttf'),
        VazirmatnBold: require('./assets/fonts/Vazirmatn-Bold.ttf'),
        VazirmatnBlack: require('./assets/fonts/Vazirmatn-Black.ttf'),
    });
    if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#F7F8F4' }} />;
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
        width: '100%', maxWidth: 760, alignSelf: 'center', minHeight: 0,
        ...(Platform.OS === 'web' ? { height: '100dvh' as unknown as number, overflow: 'hidden' as const } : {}),
    },
    tabBar: {
        height: 78,
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        elevation: 12,
        shadowColor: '#0b3b2b',
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: -5 },
    },
    tabBarBackground: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    tabItem: { borderRadius: 16, marginHorizontal: 2, marginVertical: 3, paddingTop: 2 },
    tabIcon: { marginTop: 1 },
    tabLabel: { fontSize: 10, fontWeight: '700', marginTop: 2 },
});

