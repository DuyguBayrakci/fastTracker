import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import type { StatisticsScreenProps } from '../types/navigation';
import { useFasting } from '../context/FastingContext';

export default function StatisticsScreen({
  navigation,
}: StatisticsScreenProps) {
  const { state } = useFasting();

  // İstatistikleri hesapla
  const calculateStats = () => {
    const completedSessions = state.sessions.filter(
      session => session.status === 'completed',
    );
    const cancelledSessions = state.sessions.filter(
      session => session.status === 'cancelled',
    );
    const totalSessions = state.sessions.length;

    // Günlük seri hesapla (son günlerden itibaren)
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
        // Bugün tamamlanmış oruç yoksa
        break;
      } else {
        break;
      }
    }

    // Başarı oranı
    const successRate =
      totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;

    // Ortalama süre (dakika cinsinden, saat olarak göster)
    const averageDuration =
      completedSessions.length > 0
        ? completedSessions.reduce(
            (sum, session) => sum + session.actualDuration,
            0,
          ) /
          completedSessions.length /
          60
        : 0;

    return {
      streak,
      totalCompleted: completedSessions.length,
      totalCancelled: cancelledSessions.length,
      successRate: Math.round(successRate),
      averageDuration: averageDuration.toFixed(1),
      cancelledSessions,
      completedSessions,
    };
  };

  const stats = calculateStats();

  // Haftalık ilerleme (son 7 gün)
  const getWeeklyProgress = () => {
    const days: { date: string; completed: number; cancelled: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const completed = state.sessions.filter(
        s =>
          s.status === 'completed' &&
          new Date(s.startTime) >= dayStart &&
          new Date(s.startTime) < dayEnd,
      ).length;
      const cancelled = state.sessions.filter(
        s =>
          s.status === 'cancelled' &&
          new Date(s.startTime) >= dayStart &&
          new Date(s.startTime) < dayEnd,
      ).length;
      days.push({
        date: dayStart.toLocaleDateString('tr-TR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
        }),
        completed,
        cancelled,
      });
    }
    return days;
  };
  const weeklyProgress = getWeeklyProgress();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Mevcut oruç durumu
  const getCurrentStatus = () => {
    if (state.isRunning) {
      const elapsed = state.startTime
        ? Math.floor((new Date().getTime() - state.startTime.getTime()) / 1000)
        : 0;
      return {
        status: 'Aktif Oruç',
        time: formatTime(elapsed),
        remaining: formatTime(state.timeLeft),
      };
    }
    return null;
  };

  const currentStatus = getCurrentStatus();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>İstatistikler</Text>
        <Text style={styles.subtitle}>İlerlemenizi takip edin</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Mevcut durum */}
        {currentStatus && (
          <View style={styles.currentStatusCard}>
            <Text style={styles.currentStatusTitle}>
              {currentStatus.status}
            </Text>
            <Text style={styles.currentStatusTime}>
              Geçen: {currentStatus.time}
            </Text>
            <Text style={styles.currentStatusRemaining}>
              Kalan: {currentStatus.remaining}
            </Text>
          </View>
        )}

        {/* İstatistik kartları */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Günlük Seri</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalCompleted}</Text>
            <Text style={styles.statLabel}>Tamamlanan Oruç</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{state.sessions.length}</Text>
            <Text style={styles.statLabel}>Toplam Oruç</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.successRate}%</Text>
            <Text style={styles.statLabel}>Başarı Oranı</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.averageDuration}h</Text>
            <Text style={styles.statLabel}>Ortalama Süre</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalCancelled}</Text>
            <Text style={styles.statLabel}>Bozulan Oruç</Text>
          </View>
        </View>

        {/* Son oruçlar */}
        <View style={styles.recentSessionsCard}>
          <Text style={styles.sectionTitle}>Son Oruçlar</Text>
          {state.sessions.length > 0 ? (
            state.sessions
              .slice(-5)
              .reverse()
              .map((session, index) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionPlan}>{session.planId}</Text>
                    <Text style={styles.sessionDate}>
                      {new Date(session.startTime).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <View style={styles.sessionStatus}>
                    <Text
                      style={[
                        styles.sessionStatusText,
                        session.status === 'completed'
                          ? styles.completedText
                          : session.status === 'cancelled'
                            ? styles.incompleteText
                            : styles.incompleteText,
                      ]}
                    >
                      {session.status === 'completed'
                        ? '✅ Tamamlandı'
                        : session.status === 'cancelled'
                          ? '😈 Şeytana uydum, orucu bozdum!'
                          : '❌ Yarıda Kaldı'}
                    </Text>
                  </View>
                </View>
              ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Henüz oruç kaydı yok</Text>
              <Text style={styles.emptyStateSubtext}>
                İlk orucunuzu başlatarak istatistik görmeye başlayın!
              </Text>
            </View>
          )}
        </View>

        {/* Bozulan Oruçlar */}
        {stats.totalCancelled > 0 && (
          <View style={styles.recentSessionsCard}>
            <Text style={styles.sectionTitle}>Bozulan Oruçlar Serisi</Text>
            {stats.cancelledSessions
              .slice(-5)
              .reverse()
              .map((session, index) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionPlan}>{session.planId}</Text>
                    <Text style={styles.sessionDate}>
                      {new Date(session.startTime).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <View style={styles.sessionStatus}>
                    <Text
                      style={[styles.sessionStatusText, styles.incompleteText]}
                    >
                      😈 Şeytana uydum, orucu bozdum!
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Haftalık ilerleme */}
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>📊 Haftalık İlerleme</Text>
          {weeklyProgress.map((day, idx) => (
            <Text key={idx} style={styles.chartSubtext}>
              {day.date}: ✅ {day.completed} 😈 {day.cancelled}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  currentStatusCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  currentStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  currentStatusTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  currentStatusRemaining: {
    fontSize: 16,
    color: '#E8F4FD',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  recentSessionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionPlan: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  sessionDate: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  sessionStatus: {
    alignItems: 'flex-end',
  },
  sessionStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  completedText: {
    color: '#7ED321',
  },
  incompleteText: {
    color: '#D0021B',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  chartPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartText: {
    fontSize: 24,
    marginBottom: 8,
  },
  chartSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
