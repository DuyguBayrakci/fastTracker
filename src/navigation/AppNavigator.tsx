import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TabNavigator from './TabNavigator';
import type { StackParamList } from '../types/navigation';

const Stack = createStackNavigator<StackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}
