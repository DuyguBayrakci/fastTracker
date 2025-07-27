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
import UserIcon from '../components/common/UserIcon';
const FontAwesome = require('react-native-vector-icons/FontAwesome').default;

const MENU_ITEMS = [
  {
    id: '1',
    title: 'Profil Düzenle',
    icon: <UserIcon size={24} />,
  },
  { id: '2', title: 'Tema', icon: '🌙' },
  { id: '3', title: 'Dil', icon: '🌍' },
  { id: '4', title: 'Hakkında', icon: 'ℹ️' },
];

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { state, toggleNotifications } = useFasting();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State yüklendiğinde loading'i kapat
  React.useEffect(() => {
    if (state) {
      setIsLoading(false);
    }
  }, [state]);

  const handleNotificationToggle = async (value: boolean) => {
    try {
      console.log('🔄 handleNotificationToggle çağrıldı:', value);
      await toggleNotifications(value);

      if (value) {
        Alert.alert(
          'Bildirimler Aktif',
          'Oruç hatırlatmaları ve motivasyon mesajları alacaksınız.',
          [{ text: 'Tamam' }],
        );
      } else {
        Alert.alert(
          'Bildirimler Kapatıldı',
          'Bildirimler devre dışı bırakıldı.',
          [{ text: 'Tamam' }],
        );
      }
    } catch (error) {
      console.error('❌ handleNotificationToggle hatası:', error);

      // Hata durumunda kullanıcıya daha detaylı bilgi ver
      Alert.alert(
        'Bildirim Hatası',
        'Bildirim ayarları değiştirilemedi. Bu durum geçici olabilir. Lütfen tekrar deneyin.',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Tekrar Dene',
            onPress: () => handleNotificationToggle(value),
          },
        ],
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
    // Varsayılan değerler
    const defaultStats = {
      completedSessions: 0,
      totalSessions: 0,
      successRate: 0,
      streak: 0,
    };

    try {
      // State kontrolü - daha sıkı kontrol
      if (!state) {
        return defaultStats;
      }

      // Sessions kontrolü - daha güvenli
      if (!state.sessions || !Array.isArray(state.sessions)) {
        return defaultStats;
      }

      // Güvenli filtreleme - daha sıkı kontrol
      const validSessions = state.sessions.filter(session => {
        return (
          session &&
          typeof session === 'object' &&
          session.status &&
          typeof session.status === 'string'
        );
      });

      if (validSessions.length === 0) {
        return defaultStats;
      }

      const completedSessions = validSessions.filter(
        s => s.status === 'completed',
      ).length;

      const totalSessions = validSessions.length;
      const successRate =
        totalSessions > 0
          ? Math.round((completedSessions / totalSessions) * 100)
          : 0;

      // Basit streak hesaplama - daha güvenli
      let streak = 0;
      try {
        const completedList = validSessions.filter(
          s => s.status === 'completed',
        );

        if (completedList.length === 0) {
          return { completedSessions, totalSessions, successRate, streak: 0 };
        }

        const today = new Date();

        for (let i = 0; i < 7; i++) {
          // Sadece son 7 gün kontrol et
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);

          const dayStart = new Date(
            checkDate.getFullYear(),
            checkDate.getMonth(),
            checkDate.getDate(),
          );
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayEnd.getDate() + 1);

          const hasSessionToday = completedList.some(session => {
            if (!session.startTime) return false;
            try {
              const sessionDate = new Date(session.startTime);
              return sessionDate >= dayStart && sessionDate < dayEnd;
            } catch {
              return false;
            }
          });

          if (hasSessionToday) {
            streak++;
          } else if (i === 0) {
            break; // Bugün yoksa streak bitir
          } else {
            break; // Aradaki gün yoksa streak bitir
          }
        }
      } catch (streakError) {
        console.error('❌ Streak calculation error:', streakError);
        streak = 0;
      }

      return { completedSessions, totalSessions, successRate, streak };
    } catch (error) {
      console.error('❌ getUserStats error:', error);
      return defaultStats;
    }
  };

  const stats = getUserStats();

  // Loading durumunda basit bir ekran göster
  if (isLoading || !state) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.email}>
            Mevcut Plan:{' '}
            {state && state.fastingPlan ? state.fastingPlan : '16:8'}
          </Text>

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
              value={Boolean(state && state.notificationsEnabled)}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#E1E5E9', true: '#ffab91' }}
              thumbColor={
                Boolean(state && state.notificationsEnabled)
                  ? '#ff7043'
                  : '#FFFFFF'
              }
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
        {Boolean(state && state.notificationsEnabled) && (
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>🔔 Aktif Hatırlatmalar</Text>
            <Text style={styles.notificationText}>
              <Text style={styles.notificationDot}>•</Text> Oruç başlama ve
              bitiş hatırlatmaları
            </Text>
            <Text style={styles.notificationText}>
              <Text style={styles.notificationDot}>•</Text> Günlük motivasyon
              mesajları (18:00)
            </Text>
            <Text style={styles.notificationText}>
              <Text style={styles.notificationDot}>•</Text> Su içme hatırlatması
              (12:00)
            </Text>
            <Text style={styles.notificationText}>
              <Text style={styles.notificationDot}>•</Text> İlerleme
              güncellemeleri
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
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    borderColor: '#e1e1e1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#ffffff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff7043',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666666',
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
    color: '#ff7043',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
    color: '#333333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  menuArrow: {
    fontSize: 18,
    color: '#ff7043',
    fontWeight: 'bold',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff7043',
    marginBottom: 8,
  },
  appInfoVersion: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  appInfoDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  notificationInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d4edda',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff7043',
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  notificationDot: {
    color: '#ff7043',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
});
