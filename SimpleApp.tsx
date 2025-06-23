import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SimpleApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ FastTracker</Text>
      <Text style={styles.subtitle}>Intermittent Fasting Uygulaması</Text>

      <View style={styles.timerCard}>
        <Text style={styles.timerText}>16:00:00</Text>
        <Text style={styles.statusText}>Oruç Devam Ediyor</Text>
      </View>

      <View style={styles.tabsPlaceholder}>
        <Text style={styles.tabText}>🏠 Ana Sayfa</Text>
        <Text style={styles.tabText}>📋 Planlar</Text>
        <Text style={styles.tabText}>📊 İstatistik</Text>
        <Text style={styles.tabText}>👤 Profil</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
  },
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#7ED321',
    fontWeight: '600',
  },
  tabsPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#4A90E2',
    fontWeight: '600',
  },
});
