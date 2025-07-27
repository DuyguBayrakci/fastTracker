/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { FastingProvider } from './src/context/FastingContext';
import ErrorBoundary from './src/components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <FastingProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </FastingProvider>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
