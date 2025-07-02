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
import type { Milestone } from '../types/fasting';

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

const DEFAULT_PLAN = '16:8';

export function FastingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FastingState>({
    isRunning: false,
    timeLeft: FASTING_PLANS[DEFAULT_PLAN].durationSeconds,
    fastingPlan: DEFAULT_PLAN,
    startTime: null,
    endTime: null,
    sessions: [],
    notificationsEnabled: false,
  });

  const scheduledNotificationIdsRef = useRef<string[]>([]);
  const lastNotifiedMilestoneRef = useRef<Milestone | null>(null);
  const notificationService = NotificationService;

  // 💾 State persistence - AsyncStorage'dan yükle
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const persistedState = await AsyncStorage.getItem('fastingState');
        if (persistedState) {
          const parsed = JSON.parse(persistedState);

          // Eğer kaydedilmiş plan artık geçerli değilse varsayılana dön
          if (!FASTING_PLANS[parsed.fastingPlan]) {
            console.warn(
              `WARN: Kayıtlı plan '${parsed.fastingPlan}' artık geçerli değil. Varsayılan plana dönülüyor.`,
            );
            parsed.fastingPlan = DEFAULT_PLAN;
            parsed.timeLeft = FASTING_PLANS[DEFAULT_PLAN].durationSeconds;
            parsed.isRunning = false;
            parsed.startTime = null;
            parsed.endTime = null;
          }

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
      console.log('✅ Oturum tamamlandı, completeSession tetikleniyor...');
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

  // Bu yeni useEffect, SADECE dönüm noktası bildirimlerini yönetir.
  useEffect(() => {
    if (!state.isRunning || !state.notificationsEnabled) {
      if (!state.isRunning) {
        // Oruç durduysa, son bildirim gönderilen milestone'u sıfırla.
        lastNotifiedMilestoneRef.current = null;
      }
      return;
    }

    const plan = FASTING_PLANS[state.fastingPlan];
    if (!plan || !plan.milestones || plan.milestones.length === 0) return;

    const totalTime = plan.durationSeconds;
    if (totalTime === 0) return;

    const elapsed = totalTime - state.timeLeft;
    const progressPercent = (elapsed / totalTime) * 100;

    const currentMilestone = [...plan.milestones]
      .reverse()
      .find(m => progressPercent >= m.percentage);

    if (
      currentMilestone &&
      currentMilestone.name !== lastNotifiedMilestoneRef.current?.name
    ) {
      console.log(
        `🔔 Dönüm noktasına ulaşıldı: ${currentMilestone.name}. Bildirim gönderiliyor...`,
      );
      notificationService.sendLocalNotification({
        id: `milestone-${currentMilestone.name}-${Date.now()}`,
        title: `${currentMilestone.icon} ${currentMilestone.name}`,
        body: currentMilestone.description,
        data: { type: 'milestone-reached', milestone: currentMilestone.name },
      });
      lastNotifiedMilestoneRef.current = currentMilestone;
    }
  }, [
    state.timeLeft,
    state.isRunning,
    state.fastingPlan,
    state.notificationsEnabled,
  ]);

  const scheduleNotificationsForSession = useCallback(
    async (startTime: Date, plan: string): Promise<string[]> => {
      const notificationIds: string[] = [];
      const planDetails = FASTING_PLANS[plan];
      if (!planDetails) return [];

      const duration = planDetails.durationSeconds;
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

  // Prensip 5: State değişikliklerini yöneten merkezi fonksiyonlar (Reducer alternatifi)
  const startTimer = () => {
    console.log('🚀 startTimer çağrıldı (sadece state günceller)');
    const now = new Date();
    const planDuration =
      FASTING_PLANS[state.fastingPlan as keyof typeof FASTING_PLANS]
        .durationSeconds;
    const endTime = new Date(now.getTime() + planDuration * 1000);

    console.log('📅 Start time:', now.toISOString());
    console.log('📅 End time:', endTime.toISOString());
    console.log('⏱️ Duration:', planDuration, 'seconds');

    setState(prev => ({
      ...prev,
      isRunning: true,
      startTime: now,
      endTime: endTime,
      timeLeft: planDuration, // Timer'ı tam süreden başlat
    }));
  };

  const pauseTimer = () => {
    console.log('⏸️ pauseTimer çağrıldı');
    setState(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    console.log('🔄 resetTimer çağrıldı (sadece state günceller)');
    setState(prev => {
      const planDuration =
        FASTING_PLANS[prev.fastingPlan as keyof typeof FASTING_PLANS]
          .durationSeconds;
      return {
        ...prev,
        isRunning: false,
        startTime: null,
        endTime: null,
        timeLeft: planDuration,
      };
    });
  };

  const changePlan = (plan: string) => {
    console.log(`🔄 Plan değiştirildi: ${plan}`);
    setState(prevState => {
      // Eğer oruç çalışıyorsa, uyarı ver ve sıfırla
      if (prevState.isRunning) {
        console.warn(
          'WARN: Oruç sırasında plan değiştirildi. Aktif oruç sıfırlandı.',
        );
        // Mevcut oturumu iptal etmeye veya kaydetmeye karar verebilirsiniz.
        // Şimdilik sadece sıfırlıyoruz.
        const newPlanDetails = FASTING_PLANS[plan];
        return {
          ...prevState,
          isRunning: false,
          timeLeft: newPlanDetails.durationSeconds,
          fastingPlan: plan,
          startTime: null,
          endTime: null,
        };
      }

      // Oruç çalışmıyorsa basitçe planı değiştir
      const newPlanDetails = FASTING_PLANS[plan];
      if (!newPlanDetails) {
        console.error(`❌ Geçersiz plan ID'si: ${plan}`);
        return prevState;
      }
      console.log(`🔄 Plan değiştirildi: ${plan}`);
      return {
        ...prevState,
        fastingPlan: plan,
        timeLeft: newPlanDetails.durationSeconds,
      };
    });
  };

  const completeSession = () => {
    console.log('✅ completeSession çağrıldı');
    setState(prev => {
      if (!prev.startTime) {
        console.error('❌ Oturum tamamlandı ama başlangıç zamanı yok!');
        return prev;
      }
      const now = new Date();
      const newSession: FastingSession = {
        id: prev.startTime.getTime().toString(),
        planId: prev.fastingPlan,
        startTime: prev.startTime,
        endTime: now,
        status: 'completed',
        targetDuration:
          FASTING_PLANS[prev.fastingPlan as keyof typeof FASTING_PLANS]
            .durationSeconds / 60, // dakika olarak
        actualDuration:
          (now.getTime() - prev.startTime.getTime()) / (1000 * 60), // dakika olarak
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...prev,
        isRunning: false,
        sessions: [...prev.sessions, newSession],
        timeLeft:
          FASTING_PLANS[prev.fastingPlan as keyof typeof FASTING_PLANS]
            .durationSeconds,
      };
    });
  };

  const toggleNotifications = async (enabled: boolean) => {
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
  };

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
