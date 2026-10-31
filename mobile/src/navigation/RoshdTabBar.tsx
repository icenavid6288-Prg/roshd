import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { useTheme } from '../context/ThemeContext';

const tabs: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; active: keyof typeof Ionicons.glyphMap }> = {
 Home: { label: 'خانه', icon: 'home-outline', active: 'home' },
 Courses: { label: 'یادگیری', icon: 'school-outline', active: 'school' },
 Shop: { label: 'فروشگاه', icon: 'bag-handle-outline', active: 'bag-handle' },
 Dashboard: { label: 'رشد من', icon: 'leaf-outline', active: 'leaf' },
 ProfileTab: { label: 'حساب من', icon: 'person-outline', active: 'person' },
};
export function RoshdTabBar({ state, navigation }: BottomTabBarProps) {
 const { colors } = useTheme();
 const insets = useSafeAreaInsets();
 return <View style={[s.bar, { backgroundColor: colors.surface, borderColor: colors.border, paddingBottom: Math.max(insets.bottom, 10) }, Platform.OS === 'web' && { paddingBottom: 'max(10px, env(safe-area-inset-bottom))' as unknown as number }]}>
   {state.routes.map((route, index) => { const active = state.index === index; const item = tabs[route.name]; return <Pressable key={route.key} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: active }} onPress={() => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!active && !event.defaultPrevented) navigation.navigate(route.name); }} style={({pressed}) => [s.item, pressed && {opacity:0.65}]}>
    <View style={[s.icon, {backgroundColor:active ? colors.primarySoft : 'transparent'}]}><Ionicons name={active ? item.active : item.icon} size={22} color={active ? colors.primary : colors.muted}/></View>
    <Text style={{fontSize:11,lineHeight:20,fontWeight:active?'700':'400',color:active?colors.primary:colors.muted,textAlign:'center'}}>{item.label}</Text>
   </Pressable>; })}
 </View>;
}
const s = StyleSheet.create({bar:{flexDirection:'row-reverse',flexShrink:0,borderTopWidth:1,paddingTop:8,paddingHorizontal:8},item:{flex:1,minWidth:0,minHeight:58,alignItems:'center',justifyContent:'center',gap:2},icon:{width:48,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'}});
