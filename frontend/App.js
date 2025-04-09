import React from 'react';
import StackNavigator from './src/navigation/StackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
  <SafeAreaProvider>
    <StackNavigator />
  </SafeAreaProvider>
  );
}