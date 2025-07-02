import { BaseEntity } from './index';

export interface Milestone {
  percentage: number;
  name: string;
  icon: string; // Emoji or icon name
  description: string;
  color: string;
}

export interface FastingPlan extends BaseEntity {
  name: string;
  fastingHours: number;
  eatingHours: number;
  description: string;
  color: string;
  isCustom: boolean;
  isDefault?: boolean;
  milestones?: Milestone[];
}

export interface FastingSession extends BaseEntity {
  planId: string;
  startTime: Date;
  endTime: Date | null;
  actualDuration: number; // minutes
  targetDuration: number; // minutes
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  notes?: string;
}

export interface UserProfile extends BaseEntity {
  name: string;
  email?: string;
  avatarUrl?: string;
  preferredPlanId: string;
  goals: UserGoals;
  settings: UserSettings;
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

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  targetEndTime: Date | null;
  remainingTime: number; // seconds
  elapsedTime: number; // seconds
}
