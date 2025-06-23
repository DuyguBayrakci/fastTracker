# Intermittent Fasting Mobil Uygulaması - Proje Kapsamı

## 📱 Uygulama Genel Bakış

**Uygulama Adı:** FastTracker
**Platform:** React Native + Expo
**Hedef Platformlar:** iOS ve Android
**Geliştirme Dili:** TypeScript

## 🎯 Ana Hedefler

1. Kullanıcıların intermittent fasting programlarını takip etmelerini sağlamak
2. Oruç sürelerini görselleştirmek ve motivasyon sağlamak
3. İlerleme kayıtlarını tutmak ve analiz etmek
4. Kullanıcı dostu ve modern bir arayüz sunmak

## 🏗️ Temel Özellikler

### 1. Timer & Tracking (Zamanlayıcı ve Takip)

- Oruç başlangıç/bitiş zamanlayıcısı
- Real-time countdown timer
- Oruç durumu göstergesi (fasting/eating window)
- Günlük, haftalık, aylık istatistikler

### 2. Fasting Plans (Oruç Planları)

- 16:8 (16 saat oruç, 8 saat yemek)
- 18:6 (18 saat oruç, 6 saat yemek)
- 20:4 (20 saat oruç, 4 saat yemek)
- 24 saat (OMAD - One Meal A Day)
- Custom plan oluşturma

### 3. Progress & Analytics (İlerleme ve Analitik)

- Streak counter (ardışık gün sayısı)
- Haftalık başarı oranı
- Aylık rapor
- Kilo takibi (opsiyonel)
- Grafik ve charts

### 4. Notifications (Bildirimler)

- Oruç başlangıç hatırlatması
- Yemek penceresi açılma bildirimi
- Motivasyon mesajları
- Streak celebration

### 5. Profile & Settings (Profil ve Ayarlar)

- Kullanıcı profili
- Hedef belirleme
- Bildirim ayarları
- Dark/Light mode
- Dil seçimi

## 🛠️ Teknik Gereksinimler

### Frontend

- React Native (Expo SDK 49+)
- TypeScript
- React Navigation 6
- React Native Reanimated
- React Native Gesture Handler
- Expo Notifications
- AsyncStorage
- React Native Charts

### UI/UX Kütüphaneleri

- React Native Elements veya NativeBase
- React Native Vector Icons
- React Native Paper (Material Design)
- Lottie animations

### State Management

- Context API + useReducer
- React Query (veri yönetimi için)

### Local Storage

- AsyncStorage (oruç kayıtları, settings)
- SQLite (geçmiş veriler için)

## 📊 Veri Modeli

### User Profile

```typescript
interface UserProfile {
  id: string;
  name: string;
  fastingPlan: FastingPlan;
  goals: UserGoals;
  createdAt: Date;
  settings: UserSettings;
}
```

### Fasting Session

```typescript
interface FastingSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  planType: string;
  completed: boolean;
  duration: number; // minutes
}
```

## 🎨 UI/UX Tasarım Prensipleri

1. **Minimalist ve Temiz Tasarım**

   - Karmaşık olmayan, odaklanmış arayüz
   - Büyük, okunabilir fontlar
   - Açık renk paleti

2. **Gamification**

   - Streak counter
   - Achievement badges
   - Progress rings/circles
   - Motivasyon animasyonları

3. **Accessibility**
   - Renk körlüğü uyumluluğu
   - Font size ayarları
   - Voice over desteği

## 📅 Geliştirme Fazları

### Faz 1: MVP (2-3 hafta)

- Temel timer functionality
- 16:8 plan desteği
- Basit progress tracking
- Temel UI

### Faz 2: Core Features (2-3 hafta)

- Tüm fasting plans
- Notifications
- Statistics ve charts
- Profile management

### Faz 3: Advanced Features (2-3 hafta)

- Advanced analytics
- Export functionality
- Social features (opsiyonel)
- Premium features

### Faz 4: Polish & Launch (1-2 hafta)

- Bug fixes
- Performance optimization
- App store submission
- Marketing materials

## 🚀 Çıktı Hedefleri

1. **iOS App Store** submission
2. **Google Play Store** submission
3. **Landing page** (web)
4. **User documentation**
5. **Marketing materials**
