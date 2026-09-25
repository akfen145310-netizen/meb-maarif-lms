# 🇹🇷 MEB Maarif LMS - Türkiye Yüzyılı Maarif Modeli Dijital Sınıf Defteri & İletişim Portalı

MEB Yıllık Planlarına ve **Türkiye Yüzyılı Maarif Modeli**'ne tam entegre; öğretmen, veli ve öğrencileri bir araya getiren interaktif dijital sınıf defteri, ders/kazanım takip ve iletişim web uygulaması.

---

## 🏛️ Mimari & Kapasite Özellikleri

- **Ölçeklenebilirlik**: 154 Öğretmen, 40 Sınıf ve 1.580+ Öğrencinin aynı anda (eşzamanlı yük) sıfır gecikmeyle çalışabileceği Cloud Firestore partisyonlama ve IndexedDB yerel önbellek mimarisi.
- **Tasarım Standartları**: Material Design standartlarında, **Lacivert (`#122646`)** ve **Krem/Fildişi (`#f9f7f2`)** ağırlıklı pastel tonlar.
- **PWA (Progressive Web App)**: Mobil uyumlu, ana ekrana eklenebilir ve çevrimdışı (offline) defter doldurma özellikli.
- **Çoklu Rol Desteği**:
  - 👨‍🏫 **Öğretmen**: Sınıf defteri doldurma, interaktif yoklama alma, Maarif Modeli kazanım/öğrenme çıktısı seçimi, ödev verme ve E-İmzalama.
  - 👨‍👩‍👧 **Veli**: Çocuğun günlük ders defteri akışını izleme, devamsızlık takibi ve bireysel erdem-beceri karnesi.
  - 🎓 **Öğrenci**: Günlük ödevler, işlenen ders konuları ve süreç odaklı gelişim göstergeleri.
  - 🏛️ **Okul İdaresi**: 40 sınıfın defter doluluk oranları, okul geneli yoklama izleme ve tek tıkla e-imza onay masası.

---

## 🚀 Çalıştırma

```bash
# Geliştirme sunucusu
npm run dev

# Üretim derlemesi
npm run build
npm run start
```
Uygulama **[http://localhost:3000](http://localhost:3000)** adresinde çalışmaktadır.

---

## 📁 Proje Dosya Yapısı

- `src/types/maarif.ts`: MaarifKazanimi, DefterKaydi, YoklamaRecord, Student, ClassRoom ve Announcement veri modelleri.
- `src/lib/maarif/seedData.ts`: Türkiye Yüzyılı Maarif Modeli müfredat planları, 40 sınıf, 150+ öğretmen ve öğrenci veri seti.
- `src/lib/maarif/maarifService.ts`: Firestore defter kayıt, yoklama ve duyuru servisleri.
- `src/components/maarif/`:
  - `MaarifHeader.tsx`: MEB kurumsal başlık, rol değiştirici ve PWA durum göstergesi.
  - `DigitalDefterView.tsx`: Dijital sınıf defteri, interaktif yoklama tablosu ve kazanım seçici.
  - `KazanimTakipView.tsx`: Erdem-Değer-Eylem dağılımı ve yıllık plan kazanım kataloğu.
  - `IletisimHubView.tsx`: Veliye özel mesajlaşma ve okul duyuru panosu.
  - `OgrenciGelisimView.tsx`: Veli ve öğrenci için günlük ders akışı ve gelişim karnesi.
  - `YonetimStatsView.tsx`: Okul idaresi 40 sınıf denetimi ve 1500+ öğrenci kapasite paneli.
- `src/app/globals.css`: Material Design standartlarında Lacivert ve Krem pastel renk paleti.
- `public/manifest.json`: Mobil ve tablet PWA manifest yapılandırması.
