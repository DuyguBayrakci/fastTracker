import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { PlanListScreenProps } from '../types/navigation';
import { useFasting } from '../context/FastingContext';
import { FASTING_PLANS, FastingPlan } from '../constants/fastingPlans';

// Kategori sırasını belirle
const CATEGORY_ORDER = ['Yeni Başlayanlar', 'Deneyimliler', 'Profesyoneller'];

const CheckIcon = () => (
  <View style={styles.checkIcon}>
    <Text style={styles.checkIconText}>✓</Text>
  </View>
);

const PlanCard = ({
  plan,
  isActive,
  onPress,
}: {
  plan: FastingPlan;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.planCard} onPress={onPress}>
    <View>
      <Text style={styles.planName}>{plan.name}</Text>
      <View style={styles.planDetails}>
        <Text style={styles.planDetailText}>
          • {plan.fastingHours} saat oruç
        </Text>
        <Text style={styles.planDetailText}>
          • {plan.eatingHours} saat yeme
        </Text>
      </View>
    </View>
    {isActive ? <CheckIcon /> : <Text style={styles.arrowIcon}>›</Text>}
  </TouchableOpacity>
);

export default function PlansScreen({ navigation }: PlanListScreenProps) {
  const { state } = useFasting();

  const handleSelectPlan = (planId: string) => {
    // Plan detay ekranına yönlendir
    navigation.navigate('PlanDetail', { planId });
  };

  const plansByCategory = Object.values(FASTING_PLANS).reduce(
    (acc, plan) => {
      if (!acc[plan.category]) {
        acc[plan.category] = [];
      }
      acc[plan.category].push(plan);
      return acc;
    },
    {} as Record<string, FastingPlan[]>,
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oruç Planları</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Oruç Tipini Değiştir</Text>

        {CATEGORY_ORDER.map(category => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
            {plansByCategory[category]?.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={state.fastingPlan === plan.id}
                onPress={() => handleSelectPlan(plan.id)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8A8E',
    marginBottom: 10,
    marginLeft: 5,
  },
  planCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planDetails: {
    flexDirection: 'row',
    gap: 15,
  },
  planDetailText: {
    color: '#3C3C43',
    opacity: 0.6,
  },
  arrowIcon: {
    fontSize: 24,
    color: '#3C3C43',
    opacity: 0.3,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF7043',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ff7043',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSpacer: {
    width: 60, // backButton genişliği kadar
  },
});
