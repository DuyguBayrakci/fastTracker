import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

// Ana Tab Navigator için ekran listesi
export type TabParamList = {
  Home: undefined;
  Plans: NavigatorScreenParams<PlanStackParamList>; // Plans tab'ı artık bir Stack Navigator içeriyor
  Statistics: undefined;
  Profile: undefined;
};

// Plan seçimi için Stack Navigator ekran listesi
export type PlanStackParamList = {
  PlanList: undefined;
  PlanDetail: { planId: string };
};

// Ana Stack Navigator için ekran listesi (genel uygulama)
export type AppStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  History: undefined;
  BlogDetail: { blog: any };
  // Buraya modal veya diğer tam ekranlar eklenebilir
};

// Her ekran için Props tipleri
export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  StackScreenProps<AppStackParamList>
>;

export type PlansScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Plans'>,
  StackScreenProps<AppStackParamList>
>;

export type PlanListScreenProps = CompositeScreenProps<
  StackScreenProps<PlanStackParamList, 'PlanList'>,
  BottomTabScreenProps<TabParamList>
>;

export type PlanDetailScreenProps = CompositeScreenProps<
  StackScreenProps<PlanStackParamList, 'PlanDetail'>,
  BottomTabScreenProps<TabParamList>
>;

export type StatisticsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Statistics'>,
  StackScreenProps<AppStackParamList>
>;

export type HistoryScreenProps = StackScreenProps<AppStackParamList, 'History'>;

export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  StackScreenProps<AppStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
