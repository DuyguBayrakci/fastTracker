import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import type { HomeScreenProps } from '../types/navigation';
import { useFasting, FASTING_PLANS } from '../context/FastingContext';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const {
    state,
    startTimer,
    pauseTimer,
    resetTimer,
    changePlan,
    initializeNotifications,
  } = useFasting();

  // Initialize notifications on component mount
  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (state.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleChangePlan = () => {
    const plans = Object.keys(FASTING_PLANS);
    const currentIndex = plans.indexOf(state.fastingPlan);
    const nextIndex = (currentIndex + 1) % plans.length;
    changePlan(plans[nextIndex]);
  };

  // Notification setup is handled automatically in FastingContext

  const getStatusMessage = () => {
    if (state.timeLeft === 0) {
      return '🎉 Oruç Tamamlandı!';
    }
    if (state.isRunning) {
      return '⏰ Oruç Devam Ediyor';
    }
    return '⏸️ Oruç Duraklatıldı';
  };

  const getProgressPercentage = () => {
    const totalTime =
      FASTING_PLANS[state.fastingPlan as keyof typeof FASTING_PLANS];
    return ((totalTime - state.timeLeft) / totalTime) * 100;
  };

  // Günlük seri hesaplama fonksiyonu
  const calculateStreak = () => {
    const completedSessions = state.sessions.filter(
      session => session.status === 'completed',
    );
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const daySession = completedSessions.find(
        session =>
          new Date(session.startTime) >= dayStart &&
          new Date(session.startTime) < dayEnd,
      );
      if (daySession) {
        streak++;
      } else if (i === 0) {
        break;
      } else {
        break;
      }
    }
    return streak;
  };
  const streak = calculateStreak();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>⏱️</Text>
        <Text style={styles.title}>FastTracker</Text>

        <View style={styles.planContainer}>
          <TouchableOpacity
            onPress={handleChangePlan}
            style={styles.planButton}
          >
            <Text style={styles.planText}>Plan: {state.fastingPlan}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${getProgressPercentage()}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(getProgressPercentage())}% Tamamlandı
            </Text>
          </View>

          <Text style={styles.timeText}>{formatTime(state.timeLeft)}</Text>
          <Text style={styles.statusText}>{getStatusMessage()}</Text>

          {/* Notifications Status */}
          {state.notificationsEnabled && (
            <View style={styles.notificationStatus}>
              <Text style={styles.notificationText}>
                🔔 Hatırlatmalar Aktif
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={toggleTimer}
            style={[styles.button, styles.primaryButton]}
          >
            <Text style={styles.buttonText}>
              {state.isRunning ? '⏸️ Duraklat' : '▶️ Başlat'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={resetTimer}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={styles.buttonTextSecondary}>🔄 Sıfırla</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Günlük Seri</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.sessions.length}</Text>
            <Text style={styles.statLabel}>Toplam Oruç</Text>
          </View>
        </View>

        <Text style={styles.footerText}>Aralıklı Oruç Takip Uygulaması</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 32,
    textAlign: 'center',
  },
  planContainer: {
    marginBottom: 32,
  },
  planButton: {
    backgroundColor: '#16213e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  planText: {
    fontSize: 18,
    color: '#64b5f6',
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 48,
    backgroundColor: '#16213e',
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
    width: '100%',
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#0f3460',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#64b5f6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#64b5f6',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  statusText: {
    fontSize: 16,
    color: '#b3b3b3',
    fontWeight: '500',
    marginBottom: 12,
  },
  notificationStatus: {
    backgroundColor: '#2d5016',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  notificationText: {
    fontSize: 12,
    color: '#81c784',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4caf50',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#64b5f6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64b5f6',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#64b5f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#b3b3b3',
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#7d7d7d',
    textAlign: 'center',
  },
  notificationStatusContainer: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 15,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2d5016',
    alignItems: 'center',
  },
  notificationStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#81c784',
    textAlign: 'center',
    marginBottom: 8,
  },
  notificationStatusText: {
    fontSize: 13,
    color: '#b3b3b3',
    textAlign: 'center',
    lineHeight: 18,
  },
});
