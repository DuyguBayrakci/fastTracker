import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Tab Navigator için param listesi
export type TabParamList = {
  Home: undefined;
  Plans: undefined;
  Statistics: undefined;
  Profile: undefined;
};

// Stack Navigator için param listesi
export type StackParamList = {
  Main: undefined;
  PlanDetails: { planId: string };
  Settings: undefined;
  Onboarding: undefined;
  EditProfile: undefined;
  CreateCustomPlan: undefined;
  SessionHistory: undefined;
};

// Navigation prop types
export type HomeScreenProps = BottomTabScreenProps<TabParamList, 'Home'>;
export type PlansScreenProps = BottomTabScreenProps<TabParamList, 'Plans'>;
export type StatisticsScreenProps = BottomTabScreenProps<
  TabParamList,
  'Statistics'
>;
export type ProfileScreenProps = BottomTabScreenProps<TabParamList, 'Profile'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}
