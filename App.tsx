import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import MainScreen from './src/components/MainScreen';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <MainScreen />
        <StatusBar style='auto' />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
