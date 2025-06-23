import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import PlansScreen from '../screens/PlansScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import type { TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

// Basit icon component (react-native-vector-icons kurulana kadar)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    Plans: '📋',
    Statistics: '📊',
    Profile: '👤',
  };

  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>
      {icons[name]}
    </Text>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E1E5E9',
          height: 60,
          paddingBottom: 18,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Ana Sayfa' }}
      />
      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{ tabBarLabel: 'Planlar' }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ tabBarLabel: 'İstatistik' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}
