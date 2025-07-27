import { Platform } from 'react-native';

// Web'de expo-notifications import etmeyelim
let Notifications: any = null;
let Device: any = null;

// Sadece native platformlarda import et
if (Platform.OS !== 'web') {
  try {
    Notifications = require('expo-notifications');
    Device = require('expo-device');

    // Notification handler'ı ayarla
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.log('Notifications not available on this platform');
  }
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private isInitialized: boolean = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Platform kontrolü - Web'de bildirimler devre dışı
  private isNotificationSupported(): boolean {
    return Platform.OS !== 'web' && Device && Device.isDevice && Notifications;
  }

  // Push notification token'ı al
  async registerForPushNotificationsAsync(): Promise<string | null> {
    if (this.isInitialized) {
      return this.expoPushToken;
    }

    if (!this.isNotificationSupported()) {
      console.log('Notifications not supported on this platform');
      this.isInitialized = true;
      return null;
    }

    let token = null;

    try {
      // Step 1: Check and request permissions first
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        try {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        } catch (permissionError) {
          console.error('❌ Permission request error:', permissionError);
          finalStatus = 'denied';
        }
      }

      // Step 2: Only proceed if permission is granted
      if (finalStatus !== 'granted') {
        console.log(
          '❌ Notification permission denied. Cannot proceed with setup.',
        );
        this.isInitialized = true;
        return null;
      }

      // Step 3: Create notification channels (Android only)
      if (Platform.OS === 'android') {
        try {
          // Ana notification channel
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4A90E2',
            sound: 'default',
          });

          await Notifications.setNotificationChannelAsync('fasting-reminders', {
            name: 'Fasting Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4A90E2',
            sound: 'default',
          });

          await Notifications.setNotificationChannelAsync('motivation', {
            name: 'Motivation',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4A90E2',
            sound: 'default',
          });

          await Notifications.setNotificationChannelAsync('hydration', {
            name: 'Hydration',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4A90E2',
            sound: 'default',
          });

          console.log('✅ Notification channels created successfully');
        } catch (channelError) {
          console.error(
            '❌ Notification channel creation error:',
            channelError,
          );
          // Don't fail completely if channel creation fails
        }
      }

      // Step 4: Get appropriate token based on environment
      try {
        // Development (Expo Go) için Expo token
        if (__DEV__) {
          const pushToken = await Notifications.getExpoPushTokenAsync({
            projectId: 'd2721b6a-d20c-48bf-8d82-8cb5dc6469b1',
          });
          token = pushToken.data;
          console.log('✅ Expo push token obtained (development)');
        } else {
          // Production için sadece local notification'lar kullan
          // getDevicePushTokenAsync() production'da çalışmaz
          console.log('✅ Production mode - using local notifications only');
          token = 'local-notifications-only';
        }

        this.expoPushToken = token;
      } catch (tokenError) {
        console.error('❌ Push token error:', tokenError);
        // Token failure shouldn't prevent the app from working
        // Production'da local notification'lar çalışmaya devam eder
        this.expoPushToken = 'local-notifications-only';
      }
    } catch (error) {
      console.error('❌ General notification setup error:', error);
    }

    this.isInitialized = true;
    return token;
  }

  // Push token'ı al
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Local notification gönder
  async sendLocalNotification(
    notification: NotificationData,
  ): Promise<string | null> {
    if (!this.isNotificationSupported()) {
      console.log(
        '📱 Mock notification:',
        notification.title,
        '-',
        notification.body,
      );
      return null;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
          channelId: 'default', // Android için channel ID
        },
        trigger: null,
      });

      console.log('✅ Local notification sent:', id);
      return id;
    } catch (error) {
      console.error('❌ Local notification hatası:', error);
      return null;
    }
  }

  // Zamanlanmış notification
  async scheduleNotification(
    notification: NotificationData,
    triggerDate: Date,
  ): Promise<string | null> {
    if (!this.isNotificationSupported()) {
      console.log(
        '⏰ Mock scheduled notification:',
        notification.title,
        'for',
        triggerDate,
      );
      return null;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
          channelId: 'fasting-reminders', // Android için channel ID
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });

      return id;
    } catch (error) {
      console.error('❌ Zamanlanmış notification hatası:', error);
      return null;
    }
  }

  // Tekrarlanan notification (günlük hatırlatma)
  async scheduleRepeatingNotification(
    notification: NotificationData,
    hour: number,
    minute: number = 0,
  ): Promise<string | null> {
    if (!this.isNotificationSupported()) {
      console.log(
        '🔄 Mock repeating notification:',
        notification.title,
        `at ${hour}:${minute}`,
      );
      return null;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
          channelId: 'motivation', // Android için channel ID
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute,
          repeats: true,
        },
      });

      return id;
    } catch (error) {
      console.error('❌ Tekrarlanan notification hatası:', error);
      return null;
    }
  }

  // Notification iptal et
  async cancelNotification(notificationId: string): Promise<void> {
    if (!this.isNotificationSupported()) {
      console.log('❌ Mock cancel notification:', notificationId);
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('❌ Notification iptal hatası:', error);
    }
  }

  // Tüm notification'ları iptal et
  async cancelAllNotifications(): Promise<void> {
    if (!this.isNotificationSupported()) {
      console.log('❌ Mock cancel all notifications');
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('❌ Tüm notification iptal hatası:', error);
    }
  }

  // Zamanlanmış notification'ları listele
  async getScheduledNotifications(): Promise<any[]> {
    if (!this.isNotificationSupported()) {
      return [];
    }

    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('❌ Notification listesi hatası:', error);
      return [];
    }
  }

  // Oruç başlangıç hatırlatması
  async scheduleFastingStartReminder(
    fastingPlan: string,
    startTime: Date,
  ): Promise<string | null> {
    const notification: NotificationData = {
      id: `fasting-start-${Date.now()}`,
      title: '🍽️ Oruç Başlıyor!',
      body: `${fastingPlan} planınız başlıyor. Bol şans!`,
      data: { type: 'fasting-start', plan: fastingPlan },
    };

    return this.scheduleNotification(notification, startTime);
  }

  // Oruç bitiş hatırlatması
  async scheduleFastingEndReminder(
    fastingPlan: string,
    endTime: Date,
  ): Promise<string | null> {
    const notification: NotificationData = {
      id: `fasting-end-${Date.now()}`,
      title: '🎉 Oruç Tamamlandı!',
      body: `Tebrikler! ${fastingPlan} planınızı başarıyla tamamladınız.`,
      data: { type: 'fasting-end', plan: fastingPlan },
    };

    return this.scheduleNotification(notification, endTime);
  }

  // Motivasyon hatırlatması
  async scheduleMotivationalReminder(): Promise<string | null> {
    const motivationalMessages = [
      'Harika gidiyorsun! 💪',
      'Hedefine yaklaşıyorsun! 🎯',
      'Sen yapabilirsin! ⭐',
      'Disiplin özgürlüktür! 🔥',
      'Her adım bir başarı! 👏',
    ];

    const randomMessage =
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ];

    const notification: NotificationData = {
      id: `motivation-${Date.now()}`,
      title: '🌟 Motivasyon',
      body: randomMessage,
      data: { type: 'motivation' },
    };

    return this.scheduleRepeatingNotification(notification, 18, 0);
  }

  // Su içme hatırlatması
  async scheduleHydrationReminder(): Promise<string | null> {
    const notification: NotificationData = {
      id: `hydration-${Date.now()}`,
      title: '💧 Su İçmeyi Unutma!',
      body: 'Oruç sırasında bol su içmeyi unutma. Sağlığın önemli!',
      data: { type: 'hydration' },
    };

    return this.scheduleRepeatingNotification(notification, 12, 0);
  }
}

export default NotificationService.getInstance();
