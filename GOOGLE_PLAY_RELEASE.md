# Google Play Console Release Guide

## Uygulama Bilgileri

- **Uygulama Adı**: Temporo
- **Paket Adı**: com.duygubayrakci.temporo
- **Versiyon**: 1.0.0
- **Build Type**: AAB (Android App Bundle)

## Google Play Console Adımları

### 1. Uygulama Oluşturma

1. [Google Play Console](https://play.google.com/console) adresine gidin
2. "Uygulama oluştur" butonuna tıklayın
3. Uygulama adı: "Temporo"
4. Varsayılan dil: Türkçe
5. Uygulama türü: Uygulama
6. Ücretsiz veya ücretli: Ücretsiz

### 2. Uygulama Bilgileri

- **Kısa açıklama**: Aralıklı oruç takip uygulaması
- **Tam açıklama**:

```
Temporo, aralıklı oruç planlarınızı takip etmenizi sağlayan kullanıcı dostu bir uygulamadır.

Özellikler:
• Farklı aralıklı oruç planları (16:8, 18:6, 20:4, vb.)
• Gerçek zamanlı oruç zamanlayıcısı
• İstatistikler ve ilerleme takibi
• Bildirimler ve hatırlatıcılar
• Kişiselleştirilebilir hedefler
• Detaylı geçmiş kayıtları

Sağlıklı yaşam hedeflerinize ulaşmanıza yardımcı olmak için tasarlanmıştır.
```

### 3. Gerekli Dosyalar

- **Uygulama İkonu**: 512x512 PNG
- **Öne Çıkan Grafik**: 1024x500 PNG
- **Ekran Görüntüleri**: En az 2 adet (farklı cihaz boyutları için)
- **AAB Dosyası**: EAS build'den alınacak

### 4. İçerik Derecelendirmesi

- **Yaş Grubu**: 3+ (Herkes)
- **İçerik**: Sağlık ve fitness uygulaması

### 5. Gizlilik Politikası

- Uygulama kişisel veri toplamaz
- Sadece yerel cihazda veri saklanır
- Üçüncü taraf servisler kullanılmaz

### 6. Yayınlama

1. Tüm bilgileri doldurun
2. AAB dosyasını yükleyin
3. İçerik derecelendirmesini tamamlayın
4. Fiyatlandırma ve dağıtım ayarlarını yapın
5. İnceleme için gönderin

## Build Komutu

```bash
eas build --platform android --profile production
```

## Build Durumu Kontrolü

```bash
eas build:list
```

## Son Başarılı Build

- **Build ID**: 2d0d44bf-9161-403b-ae2f-4a71d25813f5
- **AAB Link**: https://expo.dev/artifacts/eas/6yEzwMc9fKK4FCGW1ztCsZ.aab
- **Versiyon**: 1.0.0 (6)
- **Paket Adı**: com.duygubayrakci.temporo

## Build İndirme

Build tamamlandıktan sonra AAB dosyasını indirin ve Google Play Console'a yükleyin.
