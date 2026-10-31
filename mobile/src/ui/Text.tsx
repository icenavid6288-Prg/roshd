import React, { forwardRef } from 'react';
import { Text as NativeText, TextInput as NativeInput, StyleSheet, type TextProps, type TextInputProps } from 'react-native';

export const Text = forwardRef<NativeText, TextProps>(({ style, ...props }, ref) => {
    const flat = StyleSheet.flatten(style) || {};
    const weight = String(flat.fontWeight || '400');
    const family = ['800', '900'].includes(weight) ? 'VazirmatnBlack' : ['bold', '600', '700'].includes(weight) ? 'VazirmatnBold' : 'Vazirmatn';
    return <NativeText ref={ref} {...props} style={[{ textAlign: 'right', fontSize: 14, lineHeight: 24 }, style, { fontFamily: family, fontWeight: 'normal' }]} />;
});
export const TextInput = forwardRef<NativeInput, TextInputProps>(({ style, ...props }, ref) => <NativeInput ref={ref} {...props} style={[{ fontFamily: 'Vazirmatn', fontSize: 15 }, style]} />);
