import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Tabs: undefined;
    CourseDetail: { slug: string };
    Learning: { slug: string; lessonId?: number };
    ProductDetail: { slug: string };
    Settings: undefined;
    Reminders: undefined;
    Sessions: undefined;
    Goals: undefined;
    Support: undefined;
    AdminPanel: undefined;
};

export type TabsParamList = {
    Home: undefined;
    Courses: undefined;
    Shop: undefined;
    Dashboard: undefined;
    ProfileTab: undefined;
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

export type TabStackNavigation = CompositeNavigationProp<
    BottomTabNavigationProp<TabsParamList>,
    NativeStackNavigationProp<RootStackParamList>
>;
