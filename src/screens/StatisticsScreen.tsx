import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFasting } from '../context/FastingContext';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addDays,
  subDays,
  isSameDay,
  isSameWeek,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import type { StatisticsScreenProps } from '../types/navigation';
import type { FastingSession } from '../types/fasting';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CHART_CARD_WIDTH = width * 0.9;
const BAR_WIDTH = (CHART_CARD_WIDTH - 80) / 7;

// Türkçe gün isimleri için kısa bir dizi
const dayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'];

export default function StatisticsScreen({
  navigation,
}: StatisticsScreenProps) {
  const { state } = useFasting();
  const [currentDate, setCurrentDate] = useState(new Date());

  const weeklyStats = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start, end });

    const weekSessions = state.sessions.filter(s => {
      const sessionDate = new Date(s.createdAt);
      return sessionDate >= start && sessionDate <= end;
    });

    let totalDuration = 0;
    let sessionCount = 0;

    const chartData = weekDays.map((day, index) => {
      const daySessions = weekSessions.filter(s =>
        isSameDay(new Date(s.createdAt), day),
      );

      const mostSignificantSession = daySessions.reduce(
        (acc: FastingSession | null, session: FastingSession) => {
          return !acc || session.actualDuration > acc.actualDuration
            ? session
            : acc;
        },
        null,
      );

      if (mostSignificantSession && mostSignificantSession.actualDuration > 0) {
        totalDuration += mostSignificantSession.actualDuration;
        sessionCount++;
      }

      return {
        label: dayLabels[index],
        duration: mostSignificantSession?.actualDuration ?? 0,
        status: mostSignificantSession?.status ?? 'none',
      };
    });

    const maxDuration = Math.max(...chartData.map(d => d.duration), 1);
    const averageDuration = sessionCount > 0 ? totalDuration / sessionCount : 0;

    return { chartData, maxDuration, averageDuration };
  }, [currentDate, state.sessions]);

  const formatAverageDuration = (minutes: number) => {
    if (minutes === 0) return 'Veri yok';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0 && mins === 0) return 'Veri yok';
    return `${hours > 0 ? `${hours} sa` : ''} ${mins > 0 ? `${mins} dk` : ''}`.trim();
  };

  const formatWeekTitle = (date: Date) => {
    if (isSameWeek(new Date(), date, { weekStartsOn: 1 })) {
      return 'Bu hafta';
    }
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(start, 'd MMM', { locale: tr })} - ${format(end, 'd MMM', { locale: tr })}`;
  };

  const handlePrevWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Haftalık istatistikler</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('History')}
          style={styles.historyButton}
        >
          <Text style={styles.linkText}>Geçmişi Görüntüle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.weekNavigator}>
          <TouchableOpacity onPress={handlePrevWeek} style={styles.arrowButton}>
            <Feather name="chevron-left" size={18} color="#555" />
          </TouchableOpacity>
          <View style={styles.weekInfo}>
            <Text style={styles.weekTitle}>{formatWeekTitle(currentDate)}</Text>
            <Text style={styles.weekAverage}>
              Ortalama Oruç:{' '}
              {formatAverageDuration(weeklyStats.averageDuration)}
            </Text>
          </View>
          <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
            <Feather name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.chartContainer}>
          {weeklyStats.chartData.map((day, index) => (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (day.duration / weeklyStats.maxDuration) * 120 || 3,
                    backgroundColor:
                      day.status === 'completed'
                        ? '#4A90E2'
                        : day.status === 'cancelled'
                          ? '#FFC107'
                          : '#f0f0f0',
                  },
                ]}
              />
              <Text style={styles.barLabel}>{day.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
            <Text style={styles.legendText}>Ulaşılan hedef</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>Ulaşılmayan hedef</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  linkText: {
    fontSize: 15,
    color: '#FF7043',
    fontWeight: '600',
  },
  historyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#ffe3d5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 25,
  },
  weekNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrowButton: {
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  weekAverage: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  barWrapper: {
    alignItems: 'center',
    width: BAR_WIDTH,
  },
  bar: {
    width: '60%',
    borderRadius: 6,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#888',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
  },
});
