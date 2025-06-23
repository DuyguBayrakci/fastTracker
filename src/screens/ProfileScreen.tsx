import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import type { ProfileScreenProps } from '../types/navigation';
import { useFasting } from '../context/FastingContext';

const MENU_ITEMS = [
  { id: '1', title: 'Profil Düzenle', icon: '👤' },
  { id: '2', title: 'Tema', icon: '🌙' },
  { id: '3', title: 'Dil', icon: '🌍' },
  { id: '4', title: 'Hakkında', icon: 'ℹ️' },
];

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { state, toggleNotifications } = useFasting();
  const [darkMode, setDarkMode] = useState(false);

  const handleNotificationToggle = async (value: boolean) => {
    try {
      await toggleNotifications(value);
      if (value) {
        Alert.alert(
          'Bildirimler Aktif',
          'Oruç hatırlatmaları ve motivasyon mesajları alacaksınız.',
          [{ text: 'Tamam' }],
        );
      }
    } catch (error) {
      Alert.alert(
        'Hata',
        'Bildirim ayarları değiştirilemedi. Lütfen uygulama ayarlarından bildirimlerin açık olduğundan emin olun.',
        [{ text: 'Tamam' }],
      );
    }
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    Alert.alert('Tema Değişikliği', 'Dark mode özelliği yakında gelecek!', [
      { text: 'Tamam' },
    ]);
  };

  const showAbout = () => {
    Alert.alert(
      'FastTracker Hakkında',
      'FastTracker - Aralıklı oruç takip uygulaması\n\nSürüm: 1.0.0\nGeliştirici: FastTracker Team\n\nBu uygulama aralıklı oruç yapanlar için tasarlanmış modern bir takip aracıdır.',
      [{ text: 'Tamam' }],
    );
  };

  const showLanguageOptions = () => {
    Alert.alert(
      'Dil Seçeneği',
      'Şu anda sadece Türkçe desteklenmektedir. Gelecek sürümlerde daha fazla dil seçeneği eklenecek.',
      [{ text: 'Tamam' }],
    );
  };

  const getUserStats = () => {
    const completedSessions = state.sessions.filter(
      s => s.status === 'completed',
    ).length;
    const totalSessions = state.sessions.length;
    const successRate =
      totalSessions > 0
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0;

    // Günlük seri (streak)
    const completedList = state.sessions.filter(s => s.status === 'completed');
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
      const daySession = completedList.find(
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

    return { completedSessions, totalSessions, successRate, streak };
  };

  const stats = getUserStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>FastTracker Kullanıcısı</Text>
          <Text style={styles.email}>Mevcut Plan: {state.fastingPlan}</Text>

          {/* User Stats */}
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completedSessions}</Text>
              <Text style={styles.statLabel}>Başarılı Oruç</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.successRate}%</Text>
              <Text style={styles.statLabel}>Başarı Oranı</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Günlük Seri</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          {/* Notification Settings */}
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Bildirimler</Text>
              <Text style={styles.menuSubtitle}>
                Oruç hatırlatmaları ve motivasyon
              </Text>
            </View>
            <Switch
              value={state.notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#E1E5E9', true: '#4A90E2' }}
              thumbColor={state.notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🌙</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Koyu Tema</Text>
              <Text style={styles.menuSubtitle}>Yakında gelecek</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#E1E5E9', true: '#4A90E2' }}
              thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
              disabled={true}
            />
          </View>

          {/* Language */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={showLanguageOptions}
          >
            <Text style={styles.menuIcon}>🌍</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Dil</Text>
              <Text style={styles.menuSubtitle}>Türkçe</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity style={styles.menuItem} onPress={showAbout}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Hakkında</Text>
              <Text style={styles.menuSubtitle}>Uygulama bilgileri</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Status */}
        {state.notificationsEnabled && (
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>🔔 Aktif Hatırlatmalar</Text>
            <Text style={styles.notificationText}>
              • Oruç başlama ve bitiş hatırlatmaları
            </Text>
            <Text style={styles.notificationText}>
              • Günlük motivasyon mesajları (18:00)
            </Text>
            <Text style={styles.notificationText}>
              • Su içme hatırlatması (12:00)
            </Text>
            <Text style={styles.notificationText}>
              • İlerleme güncellemeleri
            </Text>
          </View>
        )}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>FastTracker</Text>
          <Text style={styles.appInfoVersion}>Sürüm 1.0.0</Text>
          <Text style={styles.appInfoDescription}>
            Aralıklı oruç takip uygulaması
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#64b5f6',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#64b5f6',
    marginBottom: 20,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#64b5f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  menuArrow: {
    fontSize: 18,
    color: '#64b5f6',
    fontWeight: 'bold',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#64b5f6',
    marginBottom: 8,
  },
  appInfoVersion: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  appInfoDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  notificationInfo: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2d5016',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#81c784',
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 4,
  },
});
