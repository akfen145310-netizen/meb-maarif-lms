# 🚀 Vercel Canlı Dağıtım (Deployment) & Mobil Kurulum Kılavuzu

Bu kılavuz, **MEB Maarif LMS** projesini Vercel üzerinde tek tıkla veya CLI ile canlıya alma ve Android/iOS mobil kurulum adımlarını açıklar.

---

## 🌟 1. YÖNTEM: GitHub ile Vercel Dashboard Üzerinden Dağıtım (Önerilen)

En kolay, en kararlı ve otomatik güncellenen yöntemdir:

1. **Projeyi GitHub'a Yükleyin:**
   ```bash
   git init
   git add .
   git commit -m "feat: Maarif LMS v2026.2 - Vercel & APK Mobil Hazır"
   git branch -M main
   git remote add origin https://github.com/<KULLANICI-ADINIZ>/<DEPO-ADINIZ>.git
   git push -u origin main
   ```

2. **Vercel'e Bağlayın:**
   - [vercel.com](https://vercel.com) adresine gidin ve oturum açın.
   - **"Add New..."** butonuna tıklayıp **"Project"** seçin.
   - GitHub deponuzu seçin (**"Import"**).
   - Framework Preset otomatik olarak **Next.js** olarak algılanacaktır.
   - **"Deploy"** butonuna basın.

3. **Sonuç:**
   - Vercel Linux sunucularında `npm run build` komutunu çalıştıracak ve yaklaşık 45 saniyede size özel bir `https://projeniz.vercel.app` bağlantısı üretecektir.

---

## ⚡ 2. YÖNTEM: Vercel CLI ile Komut Satırından Dağıtım

Bilgisayarınızda terminal üzerinden doğrudan canlıya almak için:

1. **Vercel'e Giriş Yapın:**
   ```bash
   npx vercel login
   ```
   *(E-posta adresinize gelen doğrulama bağlantısına tıklayın.)*

2. **Projeyi Canlıya Alın:**
   ```bash
   npx vercel --prod
   ```
   - Çıkan sorulara varsayılan (`Y` / Enter) yanıtları verin:
     - Set up and deploy? **Y**
     - Which scope? **(Kendi hesabınız)**
     - Link to existing project? **N**
     - What's your project's name? **meb-maarif-lms**
     - In which directory is your code located? **./**
   
3. Dağıtım tamamlandığında size canlı üretim bağlantısı (`https://meb-maarif-lms.vercel.app`) verilecektir.

---

## 🔐 İsteğe Bağlı: Firebase Çevre Değişkenleri (Environment Variables)

Projede varsayılan olarak **JSON tabanlı sahte veri motoru** çalıştığı için veritabanı olmadan tüm özellikler (yıllık planlar, 6 branş öğretmeni, sınıf defteri, yoklama, tavsiyeler) eksiksiz çalışır.

Firebase ile senkronizasyon isterseniz Vercel Dashboard > Settings > Environment Variables bölümüne ekleyebilirsiniz:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 📱 Sitede Bulunan Mobil & APK Özellikleri

Proje mobil uyumlu (responsive) ve mobil uygulama (APK & PWA) standartlarına tam uygun hale getirilmiştir:

1. **Android APK İndirme Bağlantısı (`/downloads/maarif-lms-v2026.apk`):**
   - Header üzerinde yer alan **"📱 Mobil APK"** butonundan,
   - Sayfa başındaki **Mobil Duyuru Kartı** üzerindeki **"Hızlı APK İndir"** butonundan,
   - Mobil cihazlarda ekranın altında sabit duran **"📲 Mobil APK"** butonundan doğrudan indirilebilir.
   - APK indirme isteğine Vercel üzerinden `application/vnd.android.package-archive` MIME tipi ve attachment başlığı verilmiştir.

2. **Mobil Uyumluluk (Responsive Viewport):**
   - iPhone, Android telefonlar ve tabletlerde çentik (notch) ve ev çubuğu (home indicator) için `safe-area-inset-bottom` koruması eklenmiştir.
   - Yazı boyutları, butonlar ve tablolar mobilde dokunmatik standartlarına (en az 42px dokunma hedefi) getirilmiştir.
   - Alt gezinme çubuğu (Mobile Bottom Bar) ile tek elle kullanım kolaylığı sağlanmıştır.

3. **PWA (Progressive Web App):**
   - Android Chrome'da *"Ana Ekrana Ekle / Uygulamayı Kur"*,
   - iOS Safari'de *"Paylaş > Ana Ekrana Ekle"* ile mağazasız doğrudan telefon menüsüne uygulama olarak kurulabilir.
   - İnternet bağlantısı kesildiğinde yerel önbellekten çalışmaya devam eder.
