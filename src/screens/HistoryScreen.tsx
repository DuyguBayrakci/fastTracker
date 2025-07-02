import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useFasting } from '../context/FastingContext';
import type { HistoryScreenProps } from '../types/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FASTING_PLANS } from '../constants/fastingPlans';
import { FastingSession } from '../types/fasting';

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { state } = useFasting();

  const sortedSessions = [...state.sessions]
    .filter(s => s.status === 'completed' || s.status === 'cancelled')
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const getPlanName = (planId: string) => {
    const plan = Object.values(FASTING_PLANS).find(p => p.id === planId);
    return plan ? plan.name : planId;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 1) {
      const seconds = Math.round(minutes * 60);
      return `${seconds} sn`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours > 0 ? `${hours} sa ` : ''}${mins > 0 ? `${mins} dk` : ''}`.trim();
  };

  const renderItem: ListRenderItem<FastingSession> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemPlanName}>{getPlanName(item.planId)}</Text>
        <Text style={styles.itemDate}>
          {format(new Date(item.createdAt), 'd MMMM yyyy, HH:mm', {
            locale: tr,
          })}
        </Text>
      </View>
      <View style={styles.itemStatus}>
        <Text
          style={[
            styles.itemDuration,
            { color: item.status === 'completed' ? '#4CAF50' : '#E65100' },
          ]}
        >
          {formatDuration(item.actualDuration)}
        </Text>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor:
                item.status === 'completed' ? '#4CAF50' : '#FFC107',
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{'< Geri'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Geçmiş Oruçlar</Text>
        <View style={{ width: 50 }} />
      </View>
      <FlatList
        data={sortedSessions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Geçmiş oruç bulunamadı.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemPlanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  itemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDuration: {
    fontSize: 15,
    fontWeight: '500',
    marginRight: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
