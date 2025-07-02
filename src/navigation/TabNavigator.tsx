import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import PlansScreen from '../screens/PlansScreen';
import PlanDetailScreen from '../screens/PlanDetailScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import type { TabParamList, PlanStackParamList } from '../types/navigation';
import {
  HomeIcon,
  PlansIcon,
  StatisticsIcon,
  ProfileIcon,
} from '../components/common/TabBarIcons';

const Tab = createBottomTabNavigator<TabParamList>();
const PlanStack = createStackNavigator<PlanStackParamList>();

// Planlar için Stack Navigator
function PlanStackNavigator() {
  return (
    <PlanStack.Navigator screenOptions={{ headerShown: false }}>
      <PlanStack.Screen name="PlanList" component={PlansScreen} />
      <PlanStack.Screen name="PlanDetail" component={PlanDetailScreen} />
    </PlanStack.Navigator>
  );
}

// Basit icon component (react-native-vector-icons kurulana kadar)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const color = focused ? '#FF7043' : '#B0B0B0';
  switch (name) {
    case 'Home':
      return <HomeIcon color={color} />;
    case 'Plans':
      return <PlansIcon color={color} />;
    case 'Statistics':
      return <StatisticsIcon color={color} />;
    case 'Profile':
      return <ProfileIcon color={color} />;
    default:
      return null;
  }
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconContainer}>
            <TabIcon name={route.name} focused={focused} />
          </View>
        ),
        tabBarActiveTintColor: '#FF7043',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E1E5E9',
          height: 90,
          paddingBottom: 25,
          paddingTop: 10,
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
        component={PlanStackNavigator}
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

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: -5,
  },
});
