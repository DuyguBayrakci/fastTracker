import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { PlanDetailScreenProps } from '../types/navigation';
import { useFasting } from '../context/FastingContext';
import { FASTING_PLANS } from '../constants/fastingPlans';

// Hazırlık adımları için ikonlar
const PREP_ICONS: Record<number, string> = {
  0: '🕖',
  1: '🥗',
  2: '💧',
  3: '🏃‍♂️',
};

export default function PlanDetailScreen({
  route,
  navigation,
}: PlanDetailScreenProps) {
  const { planId } = route.params;
  const plan = FASTING_PLANS[planId];
  const { changePlan } = useFasting();

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Plan bulunamadı!</Text>
      </SafeAreaView>
    );
  }

  const handleSelectPlan = () => {
    changePlan(plan.id);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{plan.name}</Text>
        <Text style={styles.description}>{plan.description}</Text>

        <View style={styles.prepContainer}>
          <Text style={styles.prepTitle}>HAZIRLANIŞ</Text>
          {plan.preparation.map((step, index) => (
            <View key={index} style={styles.prepStep}>
              <Text style={styles.prepIcon}>{PREP_ICONS[index] ?? '✅'}</Text>
              <Text style={styles.prepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={handleSelectPlan}
        >
          <Text style={styles.selectButtonText}>SEÇ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Footer için boşluk
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3C3C43',
    textAlign: 'left',
    marginBottom: 30,
  },
  prepContainer: {
    marginBottom: 20,
  },
  prepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8A8E',
    marginBottom: 15,
  },
  prepStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  prepIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  prepText: {
    flex: 1,
    fontSize: 16,
    color: '#3C3C43',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40, // for safe area
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  selectButton: {
    backgroundColor: '#FF7043', // Kırmızı tonu
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
