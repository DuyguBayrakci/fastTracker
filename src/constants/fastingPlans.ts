import type { Milestone } from '../types/fasting';

export interface FastingPlan {
  id: string;
  name: string;
  category: 'Yeni Başlayanlar' | 'Deneyimliler' | 'Profesyoneller';
  fastingHours: number;
  eatingHours: number;
  description: string;
  preparation: string[];
  durationSeconds: number;
  milestones?: Milestone[];
}

export const FASTING_PLANS: Record<string, FastingPlan> = {
  '12:12': {
    id: '12:12',
    name: '12:12',
    category: 'Yeni Başlayanlar',
    fastingHours: 12,
    eatingHours: 12,
    description:
      'Sirkadiyen ritim orucu, oruç diyetine başlamanın harika bir yoludur. Vücudunuzun doğal metabolizmasına uyum sağlar, böylece yalnızca tam faaliyet halindeyken yemek yersiniz. Ancak oruç programınızı seçerken ihtiyaçlarınızı ve yaşam tarzınızı göz önünde bulundurun.',
    preparation: [
      'Mevcut yaşam tarzına uyan oruç tipini seç',
      'Başlamadan önce yüksek proteinli bir yemek ye',
      'Su kaybının önüne geçmek için su iç',
      'Oruç boyunca her zamanki aktivitelerine devam et',
    ],
    durationSeconds: 12 * 3600,
    milestones: [
      {
        percentage: 25,
        name: 'Su Hatırlatması',
        icon: '💧',
        description: 'Vücudunu nemli tut! Bir bardak su içmenin tam zamanı.',
        color: '#5DADE2',
      },
      {
        percentage: 50,
        name: 'Yağ Yakımı Başladı',
        icon: '🔥',
        description: 'Harika! Vücudun enerji için yağ yakmaya başladı.',
        color: '#FF6347',
      },
      {
        percentage: 85,
        name: 'Bitişe Yakın',
        icon: '🏁',
        description: 'Neredeyse bitti, harika gidiyorsun!',
        color: '#32CD32',
      },
    ],
  },
  '16:8': {
    id: '16:8',
    name: '16:8',
    category: 'Deneyimliler',
    fastingHours: 16,
    eatingHours: 8,
    description:
      '16:8 metodu, en popüler aralıklı oruç tiplerinden biridir. Esnekliği sayesinde pek çok kişi tarafından kolayca uygulanabilir. Bu planda günün 16 saati oruç tutulur ve 8 saatlik bir yeme penceresi bırakılır.',
    preparation: [
      'Yeme pencerenizi sosyal hayatınıza göre ayarlayın',
      'Oruç sırasında bol su, çay veya kahve tüketin',
      'Yeme penceresinde dengeli ve besleyici öğünler yiyin',
      'Vücudunuzu dinleyin ve gerektiğinde mola verin',
    ],
    durationSeconds: 16 * 3600,
    milestones: [
      {
        percentage: 25,
        name: 'Ketoz',
        icon: '💧',
        description: 'Tebrikler! Vücudunuz yağ yakma moduna geçti.',
        color: '#FF6347',
      },
      {
        percentage: 75,
        name: 'Otofaji',
        icon: '🔥',
        description: 'Hücresel onarım başladı. Vücudunuz kendini yeniliyor.',
        color: '#4682B4',
      },
      {
        percentage: 95,
        name: 'Büyüme Hormonu',
        icon: '🏁',
        description: 'Büyüme hormonu seviyeleriniz zirvede!',
        color: '#32CD32',
      },
    ],
  },
  '20:4': {
    id: '20:4',
    name: '20:4',
    category: 'Profesyoneller',
    fastingHours: 20,
    eatingHours: 4,
    description:
      '"Savaşçı Diyeti" olarak da bilinen bu plan, daha deneyimli kişiler için uygundur. Günün 20 saati oruç tutulur ve 4 saatlik kısa bir yeme penceresi bulunur. Genellikle akşam saatlerinde tek büyük bir öğün yenir.',
    preparation: [
      'Bu plana başlamadan önce daha kısa oruçları denemiş olun',
      'Yeme penceresinde günün tüm besin ihtiyacını karşılayın',
      'Yoğun egzersizleri yeme penceresine yakın yapın',
      'Uzun süreli açlığa karşı hazırlıklı olun',
    ],
    durationSeconds: 20 * 3600,
    milestones: [
      {
        percentage: 25,
        name: 'Su Hatırlatması',
        icon: '💧',
        description: 'Vücudunu nemli tut! Bir bardak su içmenin tam zamanı.',
        color: '#5DADE2',
      },
      {
        percentage: 50,
        name: 'Yağ Yakımı Başladı',
        icon: '🔥',
        description: 'Harika! Vücudun enerji için yağ yakmaya başladı.',
        color: '#FF6347',
      },
      {
        percentage: 85,
        name: 'Bitişe Yakın',
        icon: '🏁',
        description: 'Neredeyse bitti, harika gidiyorsun!',
        color: '#32CD32',
      },
    ],
  },
  '1dk': {
    id: '1dk',
    name: '1 Dakika Test',
    category: 'Yeni Başlayanlar',
    fastingHours: 0.016,
    eatingHours: 0,
    description:
      'Bu plan, uygulama fonksiyonlarını hızlıca test etmek için kullanılır. Sadece 1 dakika sürer.',
    preparation: [
      'Test için kullanılır.',
      'Herhangi bir hazırlık gerektirmez.',
    ],
    durationSeconds: 60,
    milestones: [
      {
        percentage: 25,
        name: 'Su Hatırlatması',
        icon: '💧',
        description: 'Vücudunu nemli tut! Bir bardak su içmenin tam zamanı.',
        color: '#5DADE2',
      },
      {
        percentage: 50,
        name: 'Yağ Yakımı Başladı',
        icon: '🔥',
        description: 'Harika! Vücudun enerji için yağ yakmaya başladı.',
        color: '#FF6347',
      },
      {
        percentage: 85,
        name: 'Bitişe Yakın',
        icon: '🏁',
        description: 'Neredeyse bitti, harika gidiyorsun!',
        color: '#32CD32',
      },
    ],
  },
};
