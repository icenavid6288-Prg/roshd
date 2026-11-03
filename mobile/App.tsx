import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

const PREVIEW_URL = 'https://saradars.ir/mobile-app';

export default function App() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <WebView
        source={{ uri: PREVIEW_URL }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#2f9e44" />
          </View>
        )}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f7f8f4' },
  webview: { flex: 1, backgroundColor: '#f7f8f4' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f8f4' },
});
