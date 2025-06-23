import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { PlansScreenProps } from '../types/navigation';
import { useFasting, FASTING_PLANS } from '../context/FastingContext';

const PLAN_DETAILS = {
  '16:8': {
    name: '16:8',
    description: '16 saat oruç, 8 saat yemek',
    benefits: [
      'Başlangıç için ideal',
      'Günlük rutine uygun',
      'Kolay sürdürülebilir',
    ],
    difficulty: 'Kolay',
    popular: true,
  },
  '18:6': {
    name: '18:6',
    description: '18 saat oruç, 6 saat yemek',
    benefits: ['Orta seviye', 'Hızlı sonuçlar', 'Daha az yemek zamanı'],
    difficulty: 'Orta',
    popular: false,
  },
  '20:4': {
    name: '20:4',
    description: '20 saat oruç, 4 saat yemek',
    benefits: ['İleri seviye', 'Güçlü autophagy', 'Maksimum fayda'],
    difficulty: 'Zor',
    popular: false,
  },
  OMAD: {
    name: 'OMAD',
    description: '24 saat oruç, 1 öğün',
    benefits: ['Tek öğün', 'Maksimum oruç', 'Güçlü disiplin'],
    difficulty: 'Çok Zor',
    popular: false,
  },
};

export default function PlansScreen({ navigation }: PlansScreenProps) {
  const { state, changePlan } = useFasting();

  const handleSelectPlan = (planName: string) => {
    changePlan(planName);
    // Ana sayfaya dön
    navigation.navigate('Home');
  };

  const formatDuration = (planName: string) => {
    const hours = FASTING_PLANS[planName as keyof typeof FASTING_PLANS] / 3600;
    return `${hours} saat`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay':
        return '#7ED321';
      case 'Orta':
        return '#F5A623';
      case 'Zor':
        return '#F5A623';
      case 'Çok Zor':
        return '#D0021B';
      default:
        return '#666666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Oruç Planları</Text>
        <Text style={styles.subtitle}>Size uygun planı seçin</Text>
        <Text style={styles.currentPlan}>
          Aktif Plan:{' '}
          <Text style={styles.currentPlanName}>{state.fastingPlan}</Text>
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(PLAN_DETAILS).map(([key, plan]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.planCard,
              state.fastingPlan === key && styles.activePlanCard,
            ]}
            onPress={() => handleSelectPlan(key)}
          >
            <View style={styles.planHeader}>
              <View style={styles.planTitleContainer}>
                <Text
                  style={[
                    styles.planName,
                    state.fastingPlan === key && styles.activePlanName,
                  ]}
                >
                  {plan.name}
                </Text>
                <Text style={styles.planDuration}>{formatDuration(key)}</Text>
              </View>
              <View style={styles.badges}>
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Popüler</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(plan.difficulty) },
                  ]}
                >
                  <Text style={styles.difficultyText}>{plan.difficulty}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.planDescription}>{plan.description}</Text>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Faydalar:</Text>
              {plan.benefits.map((benefit, index) => (
                <Text key={index} style={styles.benefitItem}>
                  • {benefit}
                </Text>
              ))}
            </View>

            {state.fastingPlan === key && (
              <View style={styles.activeIndicator}>
                <Text style={styles.activeText}>✓ Aktif Plan</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
    marginBottom: 8,
  },
  currentPlan: {
    fontSize: 14,
    color: '#666666',
  },
  currentPlanName: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePlanCard: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F7FF',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planTitleContainer: {
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  activePlanName: {
    color: '#2E7CE8',
  },
  planDuration: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  popularBadge: {
    backgroundColor: '#7ED321',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 12,
  },
  benefitsContainer: {
    marginTop: 8,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  benefitItem: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginLeft: 8,
  },
  activeIndicator: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
