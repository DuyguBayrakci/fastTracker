import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../services/NotificationService';
import { FastingSession } from '../types';
import { FASTING_PLANS, FastingPlan } from '../constants/fastingPlans';

interface FastingState {
  isRunning: boolean;
  timeLeft: number;
  fastingPlan: string;
  startTime: Date | null;
  endTime: Date | null; // Bitiş zamanını absolute olarak sakla
  sessions: FastingSession[];
  notificationsEnabled: boolean;
}

interface FastingContextType {
  state: FastingState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  changePlan: (plan: string) => void;
  completeSession: () => void;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  initializeNotifications: () => Promise<void>;
}

const FastingContext = createContext<FastingContextType | undefined>(undefined);

export function FastingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FastingState>({
    isRunning: false,
    timeLeft: FASTING_PLANS['16:8'],
    fastingPlan: '16:8',
    startTime: null,
    endTime: null,
    sessions: [],
    notificationsEnabled: false,
  });

  const scheduledNotificationIdsRef = useRef<string[]>([]);
  const notificationService = NotificationService;

  // 💾 State persistence - AsyncStorage'dan yükle
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const persistedState = await AsyncStorage.getItem('fastingState');
        if (persistedState) {
          const parsed = JSON.parse(persistedState);
          // Date objelerini restore et
          if (parsed.startTime) parsed.startTime = new Date(parsed.startTime);
          if (parsed.endTime) parsed.endTime = new Date(parsed.endTime);

          setState(parsed);
          console.log('📱 Persisted state yüklendi:', parsed);
        }
      } catch (error) {
        console.error('❌ State yükleme hatası:', error);
      }
    };

    loadPersistedState();
  }, []);

  // 💾 State'i AsyncStorage'a kaydet
  const saveState = async (currentState: FastingState) => {
    try {
      await AsyncStorage.setItem('fastingState', JSON.stringify(currentState));
    } catch (error) {
      console.error('❌ State kaydetme hatası:', error);
    }
  };

  // Prensip 1: Bu useEffect SADECE oruç durumuna göre setInterval'ı yönetir.
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning && state.timeLeft > 0) {
      console.log('⏰ Timer Aktif. Arayüz güncellenmeye başlıyor...');
      interval = setInterval(() => {
        // Her saniye, sadece timeLeft'i bir azalt. Hesaplamayı AppState yapar.
        setState(prev => {
          if (prev.timeLeft <= 1) {
            // completeSession(); // DOĞRUDAN ÇAĞIRMA! Bu döngüye neden olabilir.
            // Bunun yerine, sadece timer'ı durdur. completeSession'ı başka bir useEffect yönetecek.
            return {
              ...prev,
              isRunning: false,
              timeLeft: 0,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    // Cleanup: isRunning false olduğunda veya component unmount olduğunda timer'ı temizle
    return () => {
      if (interval) {
        console.log('🧹 Timer Temizlendi.');
        clearInterval(interval);
      }
    };
  }, [state.isRunning]); // Sadece ve sadece isRunning'e bağlı!

  // Prensip 2: Bu useEffect SADECE AppState değişikliklerini dinler.
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('📱 Uygulama ön plana geldi. Zaman senkronize ediliyor...');
        setState(prev => {
          // Sadece oruç çalışıyorsa senkronize et
          if (!prev.isRunning || !prev.endTime) {
            return prev;
          }

          const remainingSeconds = Math.floor(
            (prev.endTime.getTime() - Date.now()) / 1000,
          );

          const newTimeLeft = remainingSeconds > 0 ? remainingSeconds : 0;

          // Eğer zaman farklıysa (arka planda zaman geçmişse), tek seferlik güncelle.
          if (prev.timeLeft !== newTimeLeft) {
            console.log(
              `SYNC: Kalan zaman güncellendi: ${prev.timeLeft}s -> ${newTimeLeft}s`,
            );
            return { ...prev, timeLeft: newTimeLeft };
          }

          return prev;
        });
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []); // Boş dependency array: Sadece bir kez çalışır.

  // Prensip 3: Bu useEffect, oruç oturumunun tamamlanmasını yönetir.
  const prevIsRunning = useRef(state.isRunning);
  useEffect(() => {
    // Timer'ın durumu true -> false olarak değiştiyse VE süre dolduğu için durduysa
    if (prevIsRunning.current && !state.isRunning && state.timeLeft === 0) {
      console.log('🏁 Oturum tamamlandı, completeSession tetikleniyor...');
      completeSession();
    }
    // Her render'da bir önceki isRunning durumunu güncelle
    prevIsRunning.current = state.isRunning;
  }, [state.isRunning, state.timeLeft]); // isRunning veya timeLeft değiştiğinde kontrol et.

  // Prensip 4: Bu useEffect, bildirimleri oruç durumuna göre yönetir.
  useEffect(() => {
    // Helper function to handle notification logic
    const manageNotifications = () => {
      // Oruç yeni başladıysa bildirimleri ayarla
      if (state.isRunning && state.startTime) {
        console.log(
          '🔔 Oruç başladı, bildirimler ayarlanıyor (non-blocking)...',
        );

        // Anlık başlangıç bildirimi (fire-and-forget)
        notificationService
          .sendLocalNotification({
            id: `start-${Date.now()}`,
            title: '🚀 Oruç Başladı!',
            body: `${state.fastingPlan} orucunuz başladı. Başarılar!`,
            data: { type: 'fasting-started', plan: state.fastingPlan },
          })
          .catch(error =>
            console.error('❌ Başlangıç bildirimi hatası:', error),
          );

        // Zamanlanmış bildirimleri ayarla (fire-and-forget)
        scheduleNotificationsForSession(state.startTime, state.fastingPlan)
          .then(notificationIds => {
            console.log(
              "🔔 Zamanlanmış bildirimler ref'e kaydedildi:",
              notificationIds,
            );
            scheduledNotificationIdsRef.current = notificationIds;
          })
          .catch(error => {
            console.error('❌ Bildirim schedule hatası:', error);
          });
      }
      // Oruç durduysa (pause, reset, complete) bildirimleri iptal et
      else if (!state.isRunning) {
        const idsToCancel = [...scheduledNotificationIdsRef.current];
        if (idsToCancel.length > 0) {
          console.log(
            '🚫 Oruç durdu, zamanlanmış bildirimler iptal ediliyor...',
          );
          idsToCancel.forEach(id => {
            notificationService.cancelNotification(id);
          });
          scheduledNotificationIdsRef.current = [];
        }
      }
    };

    if (state.notificationsEnabled) {
      manageNotifications();
    }
  }, [state.isRunning, state.startTime, state.notificationsEnabled]);

  const scheduleNotificationsForSession = useCallback(
    async (startTime: Date, plan: string): Promise<string[]> => {
      const notificationIds: string[] = [];
      const duration = FASTING_PLANS[plan as FastingPlan];
      const endTime = new Date(startTime.getTime() + duration * 1000);

      // Oruç bitiş hatırlatması
      const endNotificationId =
        await notificationService.scheduleFastingEndReminder(plan, endTime);
      if (endNotificationId) notificationIds.push(endNotificationId);

      // Motivasyon hatırlatmaları (orucun ortasında)
      const midPoint = new Date(startTime.getTime() + (duration * 1000) / 2);
      const motivationId = await notificationService.scheduleNotification(
        {
          id: `motivation-${Date.now()}`,
          title: '💪 Yarı Yoldasınız!',
          body: `${plan} orucunuzun yarısını tamamladınız! Devam edin!`,
          data: { type: 'motivation', plan },
        },
        midPoint,
      );
      if (motivationId) notificationIds.push(motivationId);

      return notificationIds;
    },
    [],
  );

  const startTimer = useCallback(() => {
    console.log('🚀 startTimer çağrıldı (sadece state günceller)');

    const now = new Date();

    setState(prev => {
      const duration = FASTING_PLANS[prev.fastingPlan as FastingPlan] * 1000;
      const endTime = new Date(now.getTime() + duration);

      console.log('📅 Start time:', now);
      console.log('📅 End time:', endTime);
      console.log('⏱️ Duration:', duration / 1000, 'seconds');

      const newState: FastingState = {
        ...prev,
        isRunning: true,
        startTime: now,
        endTime: endTime,
        timeLeft: Math.floor(duration / 1000),
      };
      saveState(newState); // Yeni state'i kaydet
      return newState;
    });

    console.log('✅ Timer state güncellendi, useEffect tetiklenecek.');
  }, []);

  const pauseTimer = useCallback(() => {
    console.log('⏸️ pauseTimer çağrıldı');

    setState(prev => {
      // Eğer aktif bir oruç varsa ve duraklatılıyorsa, cancelled session olarak kaydet
      let sessions = prev.sessions;
      if (prev.isRunning && prev.startTime) {
        const cancelledSession = {
          id: Date.now().toString(),
          planId: prev.fastingPlan,
          startTime: prev.startTime,
          endTime: new Date(),
          actualDuration: Math.round(
            (new Date().getTime() - prev.startTime.getTime()) / 60000,
          ),
          targetDuration: FASTING_PLANS[prev.fastingPlan as FastingPlan] / 60,
          status: 'cancelled' as const,
          createdAt: prev.startTime,
          updatedAt: new Date(),
        };
        sessions = [...prev.sessions, cancelledSession];
      }
      // Bildirim gönder (fire-and-forget)
      if (prev.notificationsEnabled) {
        notificationService
          .sendLocalNotification({
            id: `pause-${Date.now()}`,
            title: '⏸️ Oruç Duraklatıldı',
            body: `${prev.fastingPlan} orucunuz duraklatıldı.`,
            data: { type: 'fasting-paused', plan: prev.fastingPlan },
          })
          .catch(error => {
            console.error('❌ Duraklatma bildirimi hatası:', error);
          });
      }
      const newState = {
        ...prev,
        isRunning: false,
        endTime: null, // Pause edilince end time'ı sıfırla
        sessions,
      };
      saveState(newState);
      return newState;
    });

    console.log('✅ Timer durduruldu, useEffect tetiklenecek.');
  }, []); // Bağımlılığı yok

  const resetTimer = useCallback(() => {
    console.log('🔄 resetTimer çağrıldı (sadece state günceller)');

    setState(prev => {
      // Eğer aktif bir oruç varsa ve sıfırlanıyorsa, cancelled session olarak kaydet
      let sessions = prev.sessions;
      if (prev.isRunning && prev.startTime) {
        const cancelledSession = {
          id: Date.now().toString(),
          planId: prev.fastingPlan,
          startTime: prev.startTime,
          endTime: new Date(),
          actualDuration: Math.round(
            (new Date().getTime() - prev.startTime.getTime()) / 60000,
          ),
          targetDuration: FASTING_PLANS[prev.fastingPlan as FastingPlan] / 60,
          status: 'cancelled' as const,
          createdAt: prev.startTime,
          updatedAt: new Date(),
        };
        sessions = [...prev.sessions, cancelledSession];
      }
      // Bildirim gönder (fire-and-forget)
      if (prev.notificationsEnabled) {
        notificationService
          .sendLocalNotification({
            id: `reset-${Date.now()}`,
            title: '🔄 Oruç Sıfırlandı',
            body: `${prev.fastingPlan} orucunuz sıfırlandı.`,
            data: { type: 'fasting-reset', plan: prev.fastingPlan },
          })
          .catch(error => {
            console.error('❌ Sıfırlama bildirimi hatası:', error);
          });
      }
      const newState = {
        ...prev,
        isRunning: false,
        timeLeft: FASTING_PLANS[prev.fastingPlan as FastingPlan],
        startTime: null,
        endTime: null,
        sessions,
      };
      saveState(newState);
      return newState;
    });

    console.log('✅ Timer sıfırlandı, useEffect tetiklenecek.');
  }, []); // Bağımlılığı yok

  const changePlan = useCallback((newPlan: string) => {
    if (newPlan in FASTING_PLANS) {
      setState(prev => {
        const newState = {
          ...prev,
          fastingPlan: newPlan,
          timeLeft: FASTING_PLANS[newPlan as FastingPlan],
          isRunning: false,
          startTime: null,
          endTime: null,
        };
        saveState(newState);
        return newState;
      });
    }
  }, []);

  const completeSession = useCallback(() => {
    // Bu fonksiyon artık sadece session objesini oluşturup state'i günceller.
    // Tetikleme mekanizması yukarıdaki useEffect'e taşındı.
    if (state.startTime) {
      console.log('📦 Yeni oturum oluşturuluyor ve kaydediliyor...');
      const session: FastingSession = {
        id: Date.now().toString(),
        planId: state.fastingPlan,
        startTime: state.startTime,
        endTime: new Date(),
        actualDuration: Math.round(
          (new Date().getTime() - state.startTime.getTime()) / 60000,
        ), // dakika
        targetDuration: FASTING_PLANS[state.fastingPlan as FastingPlan] / 60, // dakika
        status: 'completed',
        createdAt: state.startTime,
        updatedAt: new Date(),
      };

      setState(prev => {
        const newState = {
          ...prev,
          isRunning: false,
          timeLeft: FASTING_PLANS[prev.fastingPlan as FastingPlan],
          startTime: null,
          endTime: null,
          sessions: [...prev.sessions, session],
        };
        saveState(newState);
        return newState;
      });
    }
  }, [state.startTime, state.fastingPlan]);

  const toggleNotifications = useCallback(async (enabled: boolean) => {
    setState(prev => ({ ...prev, notificationsEnabled: enabled }));

    if (enabled) {
      // Request permission and setup recurring reminders
      const token =
        await notificationService.registerForPushNotificationsAsync();
      if (token) {
        // Schedule daily motivational reminders
        await notificationService.scheduleMotivationalReminder();
        await notificationService.scheduleHydrationReminder();
      }
    } else {
      // Cancel all notifications
      await notificationService.cancelAllNotifications();
      scheduledNotificationIdsRef.current = [];
    }
  }, []);

  const initializeNotifications = useCallback(async () => {
    try {
      const token =
        await notificationService.registerForPushNotificationsAsync();
      setState(prev => ({ ...prev, notificationsEnabled: !!token }));
    } catch (error) {
      console.error('❌ Notification başlatma hatası:', error);
    }
  }, []);

  const contextValue: FastingContextType = {
    state,
    startTimer,
    pauseTimer,
    resetTimer,
    changePlan,
    completeSession,
    toggleNotifications,
    initializeNotifications,
  };

  return (
    <FastingContext.Provider value={contextValue}>
      {children}
    </FastingContext.Provider>
  );
}

export function useFasting() {
  const context = useContext(FastingContext);
  if (context === undefined) {
    throw new Error('useFasting must be used within a FastingProvider');
  }
  return context;
}

export { FASTING_PLANS };
export type { FastingPlan, FastingSession, FastingState };
