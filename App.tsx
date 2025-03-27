import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import MainScreen from './src/components/MainScreen';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainScreen />
        <StatusBar style='auto' />
      </SafeAreaProvider>
    </Provider>
  );
}
