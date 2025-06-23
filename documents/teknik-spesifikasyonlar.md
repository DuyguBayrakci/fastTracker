# FastTracker - Teknik Spesifikasyonlar

## 🛠️ Teknoloji Stack'i

### Core Framework

```json
{
  "platform": "React Native",
  "framework": "Expo SDK 49+",
  "language": "TypeScript",
  "bundler": "Metro",
  "testing": "Jest + React Native Testing Library"
}
```

### Dependencies (package.json)

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "react-native-reanimated": "^3.5.0",
    "react-native-gesture-handler": "^2.12.0",
    "expo-notifications": "^0.20.0",
    "expo-device": "^5.4.0",
    "expo-constants": "^14.4.0",
    "react-native-vector-icons": "^10.0.0",
    "react-native-svg": "^13.9.0",
    "victory-native": "^36.6.0",
    "date-fns": "^2.30.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.72.0",
    "typescript": "^5.1.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0"
  }
}
```

## 🏗️ Proje Klasör Yapısı

```
src/
├── components/           # Reusable UI components
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   └── Loading.tsx
│   ├── timer/
│   │   ├── CircularTimer.tsx
│   │   ├── TimerControls.tsx
│   │   └── TimerDisplay.tsx
│   └── charts/
│       ├── ProgressChart.tsx
│       └── StatisticsChart.tsx
├── screens/              # Screen components
│   ├── HomeScreen.tsx
│   ├── PlansScreen.tsx
│   ├── StatisticsScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/           # Navigation setup
│   ├── AppNavigator.tsx
│   ├── TabNavigator.tsx
│   └── types.ts
├── context/             # State management
│   ├── FastingContext.tsx
│   ├── UserContext.tsx
│   └── ThemeContext.tsx
├── hooks/               # Custom hooks
│   ├── useTimer.ts
│   ├── useNotifications.ts
│   └── useStorage.ts
├── services/            # External services
│   ├── storage.ts
│   ├── notifications.ts
│   └── analytics.ts
├── utils/               # Utility functions
│   ├── dateUtils.ts
│   ├── timerUtils.ts
│   └── validators.ts
├── types/               # TypeScript definitions
│   ├── index.ts
│   ├── fasting.ts
│   └── navigation.ts
├── constants/           # App constants
│   ├── theme.ts
│   ├── fastingPlans.ts
│   └── config.ts
└── assets/              # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

## 📊 Veri Modelleri (TypeScript)

### Core Types

```typescript
// types/fasting.ts
export interface FastingPlan {
  id: string;
  name: string;
  fastingHours: number;
  eatingHours: number;
  description: string;
  color: string;
  isCustom: boolean;
}

export interface FastingSession {
  id: string;
  planId: string;
  startTime: Date;
  endTime: Date | null;
  actualDuration: number; // minutes
  targetDuration: number; // minutes
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  preferredPlan: FastingPlan;
  goals: UserGoals;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserGoals {
  weeklyFastingDays: number;
  targetWeightLoss?: number;
  streakTarget: number;
  reminderTimes: {
    fastingStart: string; // HH:mm format
    eatingWindow: string; // HH:mm format
  };
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  notifications: {
    enabled: boolean;
    fastingReminders: boolean;
    eatingReminders: boolean;
    motivationalMessages: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReporting: boolean;
  };
}

export interface Statistics {
  totalSessions: number;
  completedSessions: number;
  currentStreak: number;
  longestStreak: number;
  averageFastingTime: number; // minutes
  successRate: number; // percentage
  thisWeek: WeeklyStats;
  thisMonth: MonthlyStats;
}

export interface WeeklyStats {
  sessionsCompleted: number;
  totalFastingTime: number; // minutes
  averageSessionLength: number; // minutes
  streakDays: number;
}

export interface MonthlyStats extends WeeklyStats {
  weightLoss?: number;
  longestSession: number; // minutes
}
```

### Navigation Types

```typescript
// types/navigation.ts
export type TabParamList = {
  Home: undefined;
  Plans: undefined;
  Statistics: undefined;
  Profile: undefined;
};

export type StackParamList = {
  Main: undefined;
  PlanDetails: { planId: string };
  Settings: undefined;
  Onboarding: undefined;
  EditProfile: undefined;
};
```

## 🔄 State Management Architecture

### Zustand Store Structure

```typescript
// context/stores/fastingStore.ts
interface FastingState {
  // Current state
  currentSession: FastingSession | null;
  activeTimer: {
    isRunning: boolean;
    startTime: Date | null;
    targetEndTime: Date | null;
    remainingTime: number; // seconds
  };

  // User data
  userProfile: UserProfile | null;
  fastingHistory: FastingSession[];
  statistics: Statistics;

  // Actions
  startFasting: (planId: string) => void;
  stopFasting: () => void;
  pauseFasting: () => void;
  resumeFasting: () => void;
  completeFasting: () => void;

  // Data management
  loadUserData: () => Promise<void>;
  saveSession: (session: FastingSession) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  calculateStatistics: () => void;
}
```

## 📱 Ekran Spesifikasyonları

### Home Screen

```typescript
interface HomeScreenProps {
  navigation: NavigationProp<TabParamList, 'Home'>;
}

// Components:
// - CurrentTimerCard
// - QuickActionsRow
// - TodayProgressCard
// - StreakCounter
// - RecentSessionsList
```

### Plans Screen

```typescript
interface PlansScreenProps {
  navigation: NavigationProp<TabParamList, 'Plans'>;
}

// Components:
// - PlanSelector
// - PlanComparisonCard
// - CustomPlanCreator
// - RecommendedPlans
```

### Statistics Screen

```typescript
interface StatisticsScreenProps {
  navigation: NavigationProp<TabParamList, 'Statistics'>;
}

// Components:
// - StatsOverview
// - ProgressChart
// - CalendarView
// - AchievementsBadges
// - ExportButton
```

## 🔔 Notifications System

### Notification Types

```typescript
export interface NotificationConfig {
  id: string;
  type: 'fasting_start' | 'eating_window' | 'motivation' | 'streak';
  title: string;
  body: string;
  scheduledTime: Date;
  isRecurring: boolean;
  data?: Record<string, any>;
}

// Service methods
export class NotificationService {
  static async scheduleNotification(config: NotificationConfig): Promise<void>;
  static async cancelNotification(id: string): Promise<void>;
  static async cancelAllNotifications(): Promise<void>;
  static async requestPermissions(): Promise<boolean>;
  static async handleNotificationResponse(response: any): Promise<void>;
}
```

## 💾 Data Persistence

### AsyncStorage Keys

```typescript
const STORAGE_KEYS = {
  USER_PROFILE: '@fasttracker_user_profile',
  FASTING_SESSIONS: '@fasttracker_sessions',
  CURRENT_SESSION: '@fasttracker_current_session',
  USER_SETTINGS: '@fasttracker_settings',
  STATISTICS: '@fasttracker_statistics',
  ONBOARDING_COMPLETED: '@fasttracker_onboarding',
} as const;
```

### Storage Service

```typescript
export class StorageService {
  static async save<T>(key: string, data: T): Promise<void>;
  static async load<T>(key: string): Promise<T | null>;
  static async remove(key: string): Promise<void>;
  static async clear(): Promise<void>;
  static async getAllKeys(): Promise<string[]>;
}
```

## 🎨 Theme System

### Theme Configuration

```typescript
// constants/theme.ts
export const lightTheme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#7ED321',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#333333',
    textSecondary: '#666666',
    border: '#E1E5E9',
    error: '#D0021B',
    warning: '#F5A623',
    success: '#7ED321',
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 12, fontWeight: 'normal' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 999,
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#5BA7F7',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
  },
};
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// __tests__/utils/timerUtils.test.ts
describe('Timer Utils', () => {
  test('calculateRemainingTime should return correct time', () => {
    // Test implementation
  });

  test('formatTime should format correctly', () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// __tests__/screens/HomeScreen.test.tsx
describe('HomeScreen', () => {
  test('should display timer when fasting is active', () => {
    // Test implementation
  });
});
```

## 🚀 Performance Optimizations

### Bundle Optimization

- Code splitting with React.lazy()
- Image optimization
- Font subsetting
- Tree shaking

### Runtime Performance

- React.memo for expensive components
- useCallback for event handlers
- FlatList for large lists
- Image caching

### Memory Management

- Proper cleanup in useEffect
- Timer cleanup
- Event listener removal
- Cache management

## 🔐 Security Considerations

### Data Protection

- Local data encryption
- Secure storage for sensitive data
- Input validation
- XSS prevention

### Privacy

- No personal data collection
- Local-only storage
- Optional analytics
- GDPR compliance

## 📊 Analytics & Monitoring

### Performance Metrics

- App startup time
- Screen transition time
- Memory usage
- Crash rates

### User Behavior

- Feature usage
- Session duration
- Retention rates
- User flows

### Error Tracking

- Crash reporting
- Error boundaries
- Network failures
- Performance issues
