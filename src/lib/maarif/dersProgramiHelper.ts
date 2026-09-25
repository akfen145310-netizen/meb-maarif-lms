/**
 * Türkiye Yüzyılı Maarif Modeli - Ders Programı ve Günlük Öğrenci Asistanı
 * KURAL:
 * 1. Kayıtlı öğrenciler haftalık kendi okul ders programlarını sisteme girebilmelidir.
 * 2. Sistem o günkü derslere göre öğrenci veya veliye anlık bildirim/form çıkarır:
 *    "Bugünkü Fen Bilimleri dersinde şu kazanım işlendi. Etkinliğini yaptın mı? Tavsiyelerini kontrol ettin mi?"
 * 3. Bu sayede okulda işlenen ile evde yapılan çalışma anında eşleşir.
 */

export interface LessonSlot {
  hour: number;
  timeRange: string;
  subject: string;
  topic: string;
  kazanimKodu: string;
  erdem: string;
  etkinlikAdi: string;
}

export interface DaySchedule {
  dayName: "Pazartesi" | "Salı" | "Çarşamba" | "Perşembe" | "Cuma";
  lessons: LessonSlot[];
}

export type WeeklySchedule = Record<string, LessonSlot[]>;

export interface AssistantCheckinRecord {
  studentId: string;
  dateStr: string;
  dayName: string;
  subject: string;
  kazanimKodu: string;
  etkinlikYapildi: boolean;
  tavsiyelerKontrolEdildi: boolean;
  soruCozumuTamamlandi: boolean;
  tamamlandi: boolean;
  checkedAt: string;
  ogrenciNotu?: string;
}

const STORAGE_SCHEDULE_KEY = "maarif_student_schedule_v2";
const STORAGE_CHECKIN_KEY = "maarif_assistant_checkins_v2";

// 8. Sınıf MEB Maarif Modeli Varsayılan Haftalık Ders Programı (Düzeltildi: MAT.8.1.1 EBOB-EKOK)
export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  Pazartesi: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Matematik", topic: "Çarpanlar ve Katlar / EBOB ve EKOK", kazanimKodu: "MAT.8.1.1", erdem: "Adalet & Mantıksal Çözümleme", etkinlikAdi: "Asal Çarpan Ağacı ve EBOB Modellemesi" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Matematik", topic: "Aralarında Asal Sayılar ve Problemler", kazanimKodu: "MAT.8.1.2", erdem: "Akıl Yürütme", etkinlikAdi: "Günlük Hayat EBOB-EKOK Problemi" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Türkçe", topic: "Fiilimsiler (İsim-Fiil, Sıfat-Fiil)", kazanimKodu: "TÜR.8.3.1", erdem: "Çalışkanlık & Özen", etkinlikAdi: "Cümle İçi Ek Analizi" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Türkçe", topic: "Zarf-Fiiller ve Cümleye Kattığı Anlamlar", kazanimKodu: "TÜR.8.3.1", erdem: "Dil Bilinci", etkinlikAdi: "Metin Tamamlama Alıştırması" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Beden Eğitimi", topic: "Takım İçi İletişim ve Fair-Play", kazanimKodu: "BED.8.1.1", erdem: "Saygı", etkinlikAdi: "Grup Koordinasyon Oyunu" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "İngilizce", topic: "Friendship - Personal Qualities & Invitations", kazanimKodu: "İNG.8.1.2", erdem: "Dürüstlük & Vefa", etkinlikAdi: "Davet ve Mazeret Mektubu" },
  ],
  Salı: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Fen Bilimleri", topic: "Dünya'nın Dönme Ekseni Eğikliği ve Güneş Işınları", kazanimKodu: "FEN.8.1.1", erdem: "Bilimsel Merak & Çevre Bilinci", etkinlikAdi: "Dünya Modeli Işık Açısı Deneyi" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Fen Bilimleri", topic: "Mevsimlerin Oluşumu ve Birim Yüzeye Düşen Enerji", kazanimKodu: "FEN.8.1.1", erdem: "Çevre Bilinci", etkinlikAdi: "Gölge Boyu ve Sıcaklık Grafiği" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Türkçe", topic: "Fiilimsi ile Kalıcı İsim Ayrımı (Kavram Yanılgısı)", kazanimKodu: "TÜR.8.3.1", erdem: "Çalışkanlık", etkinlikAdi: "Hata Analiz Günlüğü" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Din Kültürü", topic: "Kader ve Kaza İnancı: Evrendeki Yasalar", kazanimKodu: "DİN.8.1.1", erdem: "Sabır & Tefekkür", etkinlikAdi: "Fiziksel, Biyolojik ve Toplumsal Yasalar Şeması" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Müzik", topic: "Milli Marşlarımız ve Türkülerimiz", kazanimKodu: "MÜZ.8.1.1", erdem: "Vatanseverlik", etkinlikAdi: "Türkü Tahlili" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Rehberlik", topic: "LGS Hedef Belirleme ve Zaman Yönetimi", kazanimKodu: "REH.8.1.1", erdem: "Çalışkanlık", etkinlikAdi: "Haftalık Çalışma Çizelgesi" },
  ],
  Çarşamba: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Matematik", topic: "EBOB - EKOK Yeni Nesil Modelleme Problemleri", kazanimKodu: "MAT.8.1.1", erdem: "Mantıksal Çözümleme", etkinlikAdi: "LGS Örnek Soru Analiz Formu" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Matematik", topic: "EBOB ve EKOK Özellikleri", kazanimKodu: "MAT.8.1.1", erdem: "Akıl Yürütme", etkinlikAdi: "Dikdörtgen Alan Parçalama Modellemesi" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Fen Bilimleri", topic: "DNA ve Genetik Kodun Yapısı", kazanimKodu: "FEN.8.2.1", erdem: "Merak & Araştırma", etkinlikAdi: "Origami DNA Modeli Hazırlama" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "T.C. İnkılap Tarihi ve Atatürkçülük", topic: "Mustafa Kemal'in Fikir Hayatını Etkileyen Olaylar ve Yazarlar", kazanimKodu: "İNK.8.1.3", erdem: "Vatanseverlik & Liderlik", etkinlikAdi: "Fikir Dünyası Şehirler ve Yazarlar Eşleştirmesi" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "T.C. İnkılap Tarihi ve Atatürkçülük", topic: "Selanik, Manastır, İstanbul ve Şam Şehirleri", kazanimKodu: "İNK.8.1.3", erdem: "Tarihsel Düşünme", etkinlikAdi: "Biyografi Kronolojisi Çıkarma" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "İngilizce", topic: "Accepting and Refusing Invitations Giving Reasons", kazanimKodu: "İNG.8.1.2", erdem: "Nezaket & Dürüstlük", etkinlikAdi: "Diyalog Canlandırma ve Speaking" },
  ],
  Perşembe: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Türkçe", topic: "Paragrafta Anlam ve Fiilimsilerin Metne Katkısı", kazanimKodu: "TÜR.8.3.1", erdem: "Okuryazarlık", etkinlikAdi: "LGS Deneme Soru Çözümü" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Türkçe", topic: "Fiilimsi Tür Eşleştirme ve Soru Taktikleri", kazanimKodu: "TÜR.8.3.1", erdem: "Özen", etkinlikAdi: "Çekimli Fiil Eleme Pratiği" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Matematik", topic: "EBOB-EKOK Soru Tipleri Ayrımı (Kavram Yanılgısı)", kazanimKodu: "MAT.8.1.1", erdem: "Adalet", etkinlikAdi: "Bütünden Parçaya vs Parçadan Bütüne Matrisi" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Fen Bilimleri", topic: "21 Haziran ve 21 Aralık Eksen Eğikliği Simülasyonu", kazanimKodu: "FEN.8.1.1", erdem: "Fen Okuryazarlığı", etkinlikAdi: "Deney Düzeneği ve Raporu" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Fen Bilimleri", topic: "Dünya'nın Güneş'e Mesafesi Yanılgısı Tahlili", kazanimKodu: "FEN.8.1.1", erdem: "Bilimsel Dürüstlük", etkinlikAdi: "Kavram Yanılgısı İncelemesi" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Görsel Sanatlar", topic: "Perspektif ve Işık-Gölge Çizimi", kazanimKodu: "GÖR.8.1.1", erdem: "Estetik", etkinlikAdi: "Natürmort Karakalem Çalışması" },
  ],
  Cuma: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Fen Bilimleri", topic: "Mevsimlerin Oluşumu ve İklim Değişikliği", kazanimKodu: "FEN.8.1.1", erdem: "Çevre ve Merhamet", etkinlikAdi: "Sera Etkisi ve Karbon Ayak İzi Anketi" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Fen Bilimleri", topic: "İklim ve Hava Hareketleri Arasındaki Farklar", kazanimKodu: "FEN.8.1.2", erdem: "Sorumluluk", etkinlikAdi: "Hava Durumu Basınç Grafiği" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "T.C. İnkılap Tarihi ve Atatürkçülük", topic: "Mustafa Kemal'in Kişilik Özellikleri ve Liderliği", kazanimKodu: "İNK.8.1.3", erdem: "Cesaret & Vatanseverlik", etkinlikAdi: "Kişilik Özelliği Eşleştirme Kartları" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "T.C. İnkılap Tarihi ve Atatürkçülük", topic: "Tarihsel Kanıt ve Kaynak Eleştirisi", kazanimKodu: "İNK.8.1.3", erdem: "Tarih Bilinci", etkinlikAdi: "Belge İnceleme Çalışma Yaprağı" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "İngilizce", topic: "Friendship & Personal Traits Review", kazanimKodu: "İNG.8.1.2", erdem: "Dostluk & Vefa", etkinlikAdi: "LGS Soru Bankası Test 3" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Din Kültürü ve Ahlak Bilgisi", topic: "İnsanın İradesi, Özgürlüğü ve Sorumluluğu (Tevekkül)", kazanimKodu: "DİN.8.1.2", erdem: "Sorumluluk & Dürüstlük", etkinlikAdi: "Ahlaki Seçim ve Tevekkül Kompozisyonu" },
  ],
};

// 5. Sınıf MEB Maarif Modeli Haftalık Ders Programı
export const GRADE_5_WEEKLY_SCHEDULE: WeeklySchedule = {
  Pazartesi: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Türkçe", topic: "Sözcükte Anlam, Deyimler ve Atasözlerinde Anlam İncelikleri", kazanimKodu: "TÜR.5.1.4", erdem: "Dürüstlük & Kültürel Miras", etkinlikAdi: "Deyimler Çalışma Yaprağı" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Türkçe", topic: "Gerçek ve Mecaz Anlamlı Kelimeler", kazanimKodu: "TÜR.5.1.2", erdem: "Dürüstlük & Doğruluk", etkinlikAdi: "Kelime Eşleştirme Kartları" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Matematik", topic: "Milyonlu Doğal Sayıların Okunması ve Basamak Değeri İlişkileri", kazanimKodu: "MAT.5.1.1", erdem: "Adalet & Doğruluk", etkinlikAdi: "Basamak Tablosu Modellemesi" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Fen Bilimleri", topic: "Güneş, Dünya ve Ay'ın Geometrik Yapısı ve Hareketleri", kazanimKodu: "FEN.5.1.2", erdem: "Merhamet & Evren Düzeni", etkinlikAdi: "Ay Evreleri Modeli" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Sosyal Bilgiler", topic: "Birey ve Toplum: Haklarımız, Sorumluluklarımız ve Çocuk Hakları", kazanimKodu: "SOS.5.1.3", erdem: "Adalet & Sorumluluk", etkinlikAdi: "Hak-Sorumluluk Afişi" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "İngilizce", topic: "Hello! - School Subjects, Timetables & Expressing Likes", kazanimKodu: "İNG.5.1.1", erdem: "Saygı & Nezaket", etkinlikAdi: "Haftalık Ders Programı Hazırlama" },
  ],
  Salı: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Matematik", topic: "Büyük Sayılarda Basamak Değerleri Hesaplama", kazanimKodu: "MAT.5.1.1", erdem: "Adalet", etkinlikAdi: "Nüfus Verileri Modellemesi" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Fen Bilimleri", topic: "Ay'ın Evreleri ve Gözlem Günlüğü", kazanimKodu: "FEN.5.1.2", erdem: "Evren Düzeni", etkinlikAdi: "Gözlem Çizimi" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Türkçe", topic: "Cümlede Anlam: Neden-Sonuç ve Amaç-Sonuç İlişkileri", kazanimKodu: "TÜR.5.2.1", erdem: "Sorumluluk", etkinlikAdi: "Cümle Analiz Çalışması" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Din Kültürü ve Ahlak Bilgisi", topic: "Allah İnancı: Rahman ve Rahim Olan Allah", kazanimKodu: "DİN.5.1.2", erdem: "Merhamet & Şükür", etkinlikAdi: "İyilik Davranışı Günlüğü" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Müzik", topic: "Müzik Kültürümüz ve Ritim", kazanimKodu: "MÜZ.5.1.1", erdem: "Vatanseverlik", etkinlikAdi: "Ritim Çalışması" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Rehberlik", topic: "Okula Uyum ve Verimli Çalışma", kazanimKodu: "REH.5.1.1", erdem: "Çalışkanlık", etkinlikAdi: "Çalışma Planı Hazırlama" },
  ],
  Çarşamba: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Türkçe", topic: "Metindeki Deyim ve Atasözleri ile Hikaye Yazımı", kazanimKodu: "TÜR.5.1.4", erdem: "Kültürel Miras", etkinlikAdi: "Maarif Hikaye Yazımı" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Matematik", topic: "Doğal Sayılarla Problem Çözme", kazanimKodu: "MAT.5.1.1", erdem: "Akıl Yürütme", etkinlikAdi: "Problem Çözme Kartları" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Sosyal Bilgiler", topic: "Çocuk Hakları Sözleşmesi Maddeleri", kazanimKodu: "SOS.5.1.3", erdem: "Adalet", etkinlikAdi: "Haklar Vaka İncelemesi" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "İngilizce", topic: "Expressing Likes & Dislikes in School", kazanimKodu: "İNG.5.1.1", erdem: "Nezaket", etkinlikAdi: "Speaking Alıştırması" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Bilişim Teknolojileri", topic: "Güvenli İnternet ve Dijital Ayak İzi", kazanimKodu: "BİL.5.1.1", erdem: "Dürüstlük", etkinlikAdi: "Dijital Güvenlik Posteri" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Görsel Sanatlar", topic: "Renkler ve Şekiller", kazanimKodu: "GÖR.5.1.1", erdem: "Estetik", etkinlikAdi: "Resim Çalışması" },
  ],
  Perşembe: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Fen Bilimleri", topic: "Güneş ve Dünya Hareketleri", kazanimKodu: "FEN.5.1.2", erdem: "Evren Düzeni", etkinlikAdi: "Model Deneyi" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Fen Bilimleri", topic: "Ay'ın Dönme ve Dolanma Hareketi", kazanimKodu: "FEN.5.1.2", erdem: "Evren Düzeni", etkinlikAdi: "Ay Modeli Sunumu" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Türkçe", topic: "Metin İçi Anlam Çözümlemesi", kazanimKodu: "TÜR.5.1.2", erdem: "Dürüstlük", etkinlikAdi: "Metin Okuma Tahlili" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Matematik", topic: "Büyük Sayıların Basamak Değerleri", kazanimKodu: "MAT.5.1.1", erdem: "Adalet", etkinlikAdi: "Problem Çözme Kartları" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Sosyal Bilgiler", topic: "Rollerimiz ve Haklarımız", kazanimKodu: "SOS.5.1.3", erdem: "Sorumluluk", etkinlikAdi: "Rol Canlandırma" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Beden Eğitimi", topic: "İş Birliği ve Spor Ahlakı", kazanimKodu: "BED.5.1.1", erdem: "Saygı", etkinlikAdi: "Grup Oyunu" },
  ],
  Cuma: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Türkçe", topic: "Neden-Sonuç ve Amaç-Sonuç Cümleleri", kazanimKodu: "TÜR.5.2.1", erdem: "Sorumluluk", etkinlikAdi: "Cümle Ayrıştırma" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Matematik", topic: "Günlük Hayatta Büyük Sayılar", kazanimKodu: "MAT.5.1.1", erdem: "Doğruluk", etkinlikAdi: "Nüfus Verileri Modellemesi" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Din Kültürü ve Ahlak Bilgisi", topic: "Canlılara Karşı Merhamet ve Sevgi", kazanimKodu: "DİN.5.1.2", erdem: "Merhamet", etkinlikAdi: "İyilik Davranışı Not Etme" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "İngilizce", topic: "Weekly Timetable & Talking About Lessons", kazanimKodu: "İNG.5.1.1", erdem: "Nezaket", etkinlikAdi: "Haftalık Takvim Hazırlama" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Fen Bilimleri", topic: "Güneş, Dünya ve Ay Sistemi", kazanimKodu: "FEN.5.1.2", erdem: "Bilimsel Merak", etkinlikAdi: "Gözlem Raporu" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Sosyal Bilgiler", topic: "Toplumsal Rollerimiz ve Sorumluluk", kazanimKodu: "SOS.5.1.3", erdem: "Sorumluluk", etkinlikAdi: "Değerlendirme Testi" },
  ],
};

// 6. Sınıf MEB Maarif Modeli Haftalık Ders Programı
export const GRADE_6_WEEKLY_SCHEDULE: WeeklySchedule = {
  Pazartesi: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Türkçe", topic: "Kökler (İsim ve Fiil Kökü), Yapım ve Çekim Ekleri", kazanimKodu: "TÜR.6.1.4", erdem: "Özen & Dil Bilinci", etkinlikAdi: "Ek-Kök Çözümleme Tablosu" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Türkçe", topic: "Yapım Eklerinin Türetme Gücü", kazanimKodu: "TÜR.6.1.4", erdem: "Dil Bilinci", etkinlikAdi: "Yeni Kelime Türetme Alıştırması" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Matematik", topic: "Üslü İfadeler ve Tekrarlı Çarpım", kazanimKodu: "MAT.6.1.1", erdem: "Sabır & Mantıksal Disiplin", etkinlikAdi: "Üslü Sayı Kartları" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Matematik", topic: "İşlem Önceliği Kuralları", kazanimKodu: "MAT.6.1.1", erdem: "Mantıksal Disiplin", etkinlikAdi: "İşlem Basamakları Posteri" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Beden Eğitimi", topic: "Takım İçi Yardımlaşma ve Fair-Play", kazanimKodu: "BED.6.1.1", erdem: "Saygı", etkinlikAdi: "Koordinasyon Oyunu" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "İngilizce", topic: "Unit 1: Life - Describing Daily Routines", kazanimKodu: "İNG.6.1.2", erdem: "Zaman Yönetimi & Sorumluluk", etkinlikAdi: "Günlük Rutin Yazma" },
  ],
  Salı: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Fen Bilimleri", topic: "Güneş Sistemi ve Gezegenlerin Özellikleri (İç ve Dış Gezegenler)", kazanimKodu: "FEN.6.1.1", erdem: "Evren Düzenine Saygı", etkinlikAdi: "Gezegen Karşılaştırma Matrisi" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Fen Bilimleri", topic: "Karasal ve Gazsal Gezegenlerin Karşılaştırılması", kazanimKodu: "FEN.6.1.1", erdem: "Evren Düzenine Saygı", etkinlikAdi: "Gezegen Modeli Çizimi" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Türkçe", topic: "Ek-Kök Ayrımı ve Türkçenin Zenginliği", kazanimKodu: "TÜR.6.1.4", erdem: "Dil Bilinci", etkinlikAdi: "Tanılayıcı Dallanmış Ağaç" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Din Kültürü ve Ahlak Bilgisi", topic: "Peygamberlerin Nitelikleri (Sıdk, Emanet, İsmet, Fetanet, Tebliğ)", kazanimKodu: "DİN.6.1.2", erdem: "Doğruluk & Emanet", etkinlikAdi: "Kavram Haritası" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Müzik", topic: "Makamlarımız ve Ritim Kalıpları", kazanimKodu: "MÜZ.6.1.1", erdem: "Vatanseverlik", etkinlikAdi: "Eser Analizi" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Rehberlik", topic: "Zamanı Yönetme ve Hedef Koyma", kazanimKodu: "REH.6.1.1", erdem: "Çalışkanlık", etkinlikAdi: "Haftalık Çizelge" },
  ],
  Çarşamba: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Matematik", topic: "İşlem Önceliği ve Parantezli İşlemler", kazanimKodu: "MAT.6.1.1", erdem: "Akıl Yürütme", etkinlikAdi: "Mantık Bulmacası" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Türkçe", topic: "Kök ve Gövde Analizi Alıştırmaları", kazanimKodu: "TÜR.6.1.4", erdem: "Özen", etkinlikAdi: "Sözcük Şeması Çıkarma" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Sosyal Bilgiler", topic: "Toplumsal Yardımlaşma, Dayanışma ve Sadaka Taşı Geleneği", kazanimKodu: "SOS.6.1.2", erdem: "Yardımlaşma & Dayanışma", etkinlikAdi: "Vakıf Kültürü Araştırması" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "İngilizce", topic: "Simple Present Tense & Habits", kazanimKodu: "İNG.6.1.2", erdem: "Sorumluluk", etkinlikAdi: "Zaman Çizelgesi Alıştırması" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Bilişim Teknolojileri", topic: "Problem Çözme ve Blok Tabanlı Kodlama", kazanimKodu: "BİL.6.1.1", erdem: "Akıl Yürütme", etkinlikAdi: "Algoritma Akış Şeması" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Görsel Sanatlar", topic: "Perspektif ve Kompozisyon", kazanimKodu: "GÖR.6.1.1", erdem: "Estetik", etkinlikAdi: "Karakalem Çizim" },
  ],
  Perşembe: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Fen Bilimleri", topic: "Gezegenlerin Güneş'e Uzaklık Sıralaması", kazanimKodu: "FEN.6.1.1", erdem: "Fen Okuryazarlığı", etkinlikAdi: "İnfografik Hazırlama" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Fen Bilimleri", topic: "Güneş Sistemi Modeli", kazanimKodu: "FEN.6.1.1", erdem: "Bilimsel Merak", etkinlikAdi: "Model Sunumu" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Türkçe", topic: "Sözcükte Yapı Alıştırmaları", kazanimKodu: "TÜR.6.1.4", erdem: "Dil Bilinci", etkinlikAdi: "Kazanım Testi Çözümü" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Matematik", topic: "Üslü İfadelerle Problem Çözme", kazanimKodu: "MAT.6.1.1", erdem: "Mantıksal Disiplin", etkinlikAdi: "Problemler Fasikülü" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Sosyal Bilgiler", topic: "Zimem Defteri ve Sadaka Taşı Geleneği", kazanimKodu: "SOS.6.1.2", erdem: "Yardımlaşma", etkinlikAdi: "Araştırma Raporu" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Beden Eğitimi", topic: "Spor Kültürü ve Sağlıklı Yaşam", kazanimKodu: "BED.6.1.1", erdem: "Sorumluluk", etkinlikAdi: "Kondisyon Parkuru" },
  ],
  Cuma: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Sosyal Bilgiler", topic: "Biz ve Değerlerimiz: Birlik ve Beraberlik", kazanimKodu: "SOS.6.1.2", erdem: "Dayanışma", etkinlikAdi: "Örnek Olay İncelemesi" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Matematik", topic: "Dört İşlem ve İşlem Önceliği Uygulamaları", kazanimKodu: "MAT.6.1.1", erdem: "Sabır", etkinlikAdi: "Alıştırma Çözümü" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Din Kültürü ve Ahlak Bilgisi", topic: "Peygamberlerin Tebliğ ve Fetanet Sıfatları", kazanimKodu: "DİN.6.1.2", erdem: "Doğruluk", etkinlikAdi: "Ahlaki İkilem Tartışması" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "İngilizce", topic: "Talking About Repeated Actions", kazanimKodu: "İNG.6.1.2", erdem: "Zaman Yönetimi", etkinlikAdi: "Speaking Activity" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Türkçe", topic: "Haftalık Okuma ve Söz Varlığı Değerlendirmesi", kazanimKodu: "TÜR.6.1.4", erdem: "Özen", etkinlikAdi: "Kelime Defteri Kontrolü" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Fen Bilimleri", topic: "Güneş Sisteminde Cüce Gezegenler ve Asteroitler", kazanimKodu: "FEN.6.1.1", erdem: "Merak", etkinlikAdi: "Bilgi Kartları" },
  ],
};

// 7. Sınıf MEB Maarif Modeli Haftalık Ders Programı
export const GRADE_7_WEEKLY_SCHEDULE: WeeklySchedule = {
  Pazartesi: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Türkçe", topic: "İş, Oluş ve Durum Fiilleri ile Haber/Dilek Kipleri", kazanimKodu: "TÜR.7.3.1", erdem: "Estetik Duyarlık", etkinlikAdi: "Fiil Sınıflandırma Tablosu" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Türkçe", topic: "Fiillerde Anlam Özellikleri ve Kip Çekimleri", kazanimKodu: "TÜR.7.3.1", erdem: "Dil Bilinci", etkinlikAdi: "Kip Çekim Tablosu" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Matematik", topic: "Tam Sayılarla Çarpma ve Bölme İşlemleri ve Sayı Doğrusunda Modelleme", kazanimKodu: "MAT.7.1.1", erdem: "Adalet & Denge", etkinlikAdi: "Sayı Pulları Modellemesi" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Matematik", topic: "Tam Sayı Problemleri ve Sayı Doğrusu", kazanimKodu: "MAT.7.1.1", erdem: "Kavramsal Akıl Yürütme", etkinlikAdi: "Sayı Doğrusu Çözümleri" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Beden Eğitimi", topic: "Takım Ruhu ve Adil Oyun", kazanimKodu: "BED.7.1.1", erdem: "Adalet", etkinlikAdi: "Müsabaka Kuralları" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "İngilizce", topic: "Unit 1: Appearance and Personality - Describing People & Comparatives", kazanimKodu: "İNG.7.1.2", erdem: "Hoşgörü & Saygı", etkinlikAdi: "Comparative Adjectives Alıştırması" },
  ],
  Salı: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Fen Bilimleri", topic: "Uzay Araştırmaları, Yapay Uydular ve Türkiye'nin Uzay Misyonu", kazanimKodu: "FEN.7.1.1", erdem: "Vatanseverlik & Bilimsel Merak", etkinlikAdi: "Milli Uydu Araştırma Kartı" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Fen Bilimleri", topic: "Türkiye'nin Uzay Misyonu (Türksat, İmece)", kazanimKodu: "FEN.7.1.1", erdem: "Vatanseverlik", etkinlikAdi: "İMECE ve Uzay Ajansı Sunumu" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Türkçe", topic: "Fiillerde Anlam Özellikleri ve Cümle Analizi", kazanimKodu: "TÜR.7.3.1", erdem: "Estetik Duyarlık", etkinlikAdi: "Metin İçi Fiil Tahlili" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Din Kültürü ve Ahlak Bilgisi", topic: "Melek ve Ahiret İnancı: Görünmeyen Âleme İman ve Meleklerin Görevleri", kazanimKodu: "DİN.7.1.2", erdem: "Sorumluluk & Özdenetim", etkinlikAdi: "Dört Büyük Melek Şeması" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Müzik", topic: "Milli Ezgilerimiz ve Çalgılarımız", kazanimKodu: "MÜZ.7.1.1", erdem: "Vatanseverlik", etkinlikAdi: "Enstrüman İncelemesi" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Rehberlik", topic: "Özdenetim ve Akran İletişimi", kazanimKodu: "REH.7.1.1", erdem: "Özdenetim", etkinlikAdi: "Gelişim Çizelgesi" },
  ],
  Çarşamba: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Matematik", topic: "İşaret Kuralları ve Sayı Pulları Alıştırmaları", kazanimKodu: "MAT.7.1.1", erdem: "Adalet & Denge", etkinlikAdi: "İşaret Tablosu Pratiği" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Türkçe", topic: "Fiillerde Kişi ve Kip Ekleri", kazanimKodu: "TÜR.7.3.1", erdem: "Dil Bilinci", etkinlikAdi: "Cümle Çözümleme" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Sosyal Bilgiler", topic: "Sen Dili - Ben Dili, Empati ve Etkili Dinleme", kazanimKodu: "SOS.7.1.1", erdem: "Empati & Nezaket", etkinlikAdi: "Empati Günlüğü Yazımı" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "İngilizce", topic: "Describing People & Character Traits", kazanimKodu: "İNG.7.1.2", erdem: "Hoşgörü", etkinlikAdi: "Kişilik Profili Posteri" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Teknoloji ve Tasarım", topic: "Tasarım Odaklı Düşünme", kazanimKodu: "TEK.7.1.1", erdem: "Yaratıcılık", etkinlikAdi: "Prototip Çizimi" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Görsel Sanatlar", topic: "Işık ve Gölge Uygulamaları", kazanimKodu: "GÖR.7.1.1", erdem: "Estetik", etkinlikAdi: "Ton Değerleri Tablosu" },
  ],
  Perşembe: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Fen Bilimleri", topic: "Uzay Kirliliği ve Gelecekteki Tehlikeler", kazanimKodu: "FEN.7.1.1", erdem: "Çevre Bilinci", etkinlikAdi: "Uzay Çöpü Raporu" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Fen Bilimleri", topic: "Teleskop Çeşitleri ve Rasathaneler", kazanimKodu: "FEN.7.1.1", erdem: "Bilimsel Merak", etkinlikAdi: "Teleskop Şeması" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Türkçe", topic: "Fiillerde Anlam Kayması", kazanimKodu: "TÜR.7.3.1", erdem: "Dil Bilinci", etkinlikAdi: "Örnek Cümle Analizi" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "Matematik", topic: "Tam Sayılarla Günlük Hayat Problemleri", kazanimKodu: "MAT.7.1.1", erdem: "Denge", etkinlikAdi: "Sıcaklık ve Bütçe Problemleri" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Sosyal Bilgiler", topic: "İletişimi Olumlu ve Olumsuz Etkileyen Tutumlar", kazanimKodu: "SOS.7.1.1", erdem: "Nezaket", etkinlikAdi: "Rol Canlandırma" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Beden Eğitimi", topic: "Koordinasyon ve Esneklik", kazanimKodu: "BED.7.1.1", erdem: "Sağlık", etkinlikAdi: "Bireysel Antrenman" },
  ],
  Cuma: [
    { hour: 1, timeRange: "08:30 - 09:10", subject: "Sosyal Bilgiler", topic: "Çatışma Çözme ve Ben Dili Yaklaşımı", kazanimKodu: "SOS.7.1.1", erdem: "Empati", etkinlikAdi: "İletişim Vaka Analizi" },
    { hour: 2, timeRange: "09:20 - 10:00", subject: "Matematik", topic: "Tam Sayılarda Kuvvet ve Üs Kavramı", kazanimKodu: "MAT.7.1.1", erdem: "Akıl Yürütme", etkinlikAdi: "Test 4 Çözümü" },
    { hour: 3, timeRange: "10:10 - 10:50", subject: "Din Kültürü ve Ahlak Bilgisi", topic: "Kiramen Kâtibin ve Ahiret İnancı", kazanimKodu: "DİN.7.1.2", erdem: "Sorumluluk", etkinlikAdi: "Öz Değerlendirme Kağıdı" },
    { hour: 4, timeRange: "11:00 - 11:40", subject: "İngilizce", topic: "Comparing Personalities (Kinder than, More generous)", kazanimKodu: "İNG.7.1.2", erdem: "Hoşgörü", etkinlikAdi: "Speaking Practice" },
    { hour: 5, timeRange: "11:50 - 12:30", subject: "Türkçe", topic: "Metin Üzerinde Eylem Analizi", kazanimKodu: "TÜR.7.3.1", erdem: "Özen", etkinlikAdi: "Paragraf Çalışması" },
    { hour: 6, timeRange: "13:15 - 13:55", subject: "Rehberlik", topic: "Haftalık Değerlendirme ve Planlama", kazanimKodu: "REH.7.1.1", erdem: "Çalışkanlık", etkinlikAdi: "Öz Değerlendirme" },
  ],
};

// Kademelere göre MEB Haftalık Program Şablon Haritası
export const GRADE_WEEKLY_SCHEDULES: Record<number, WeeklySchedule> = {
  5: GRADE_5_WEEKLY_SCHEDULE,
  6: GRADE_6_WEEKLY_SCHEDULE,
  7: GRADE_7_WEEKLY_SCHEDULE,
  8: DEFAULT_WEEKLY_SCHEDULE,
};

export function getStudentSchedule(studentId: string, grade: number = 8): WeeklySchedule {
  const fallbackSchedule = GRADE_WEEKLY_SCHEDULES[grade] || DEFAULT_WEEKLY_SCHEDULE;
  if (typeof window === "undefined") return fallbackSchedule;
  try {
    const raw = localStorage.getItem(`${STORAGE_SCHEDULE_KEY}_${studentId}`);
    if (!raw) {
      localStorage.setItem(`${STORAGE_SCHEDULE_KEY}_${studentId}`, JSON.stringify(fallbackSchedule));
      return fallbackSchedule;
    }
    const parsed = JSON.parse(raw);
    // Eğer eski hatalı MAT.8.1.1 veya eksik gün varsa düzelt
    if (parsed?.Pazartesi?.[0]?.topic === "Önermeler ve Doğruluk Tabloları") {
      localStorage.setItem(`${STORAGE_SCHEDULE_KEY}_${studentId}`, JSON.stringify(fallbackSchedule));
      return fallbackSchedule;
    }
    return parsed;
  } catch {
    return fallbackSchedule;
  }
}

export function saveStudentSchedule(studentId: string, schedule: WeeklySchedule): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_SCHEDULE_KEY}_${studentId}`, JSON.stringify(schedule));
    window.dispatchEvent(
      new CustomEvent("student-schedule-updated", {
        detail: { studentId, schedule },
      })
    );
  } catch (e) {
    console.error("Ders programı kaydedilemedi:", e);
  }
}

export function getTodayDayName(): "Pazartesi" | "Salı" | "Çarşamba" | "Perşembe" | "Cuma" {
  const days: ("Pazartesi" | "Salı" | "Çarşamba" | "Perşembe" | "Cuma")[] = [
    "Cuma", // Pazar -> varsayılan Cuma (haftalık özet)
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cuma", // Cumartesi -> Cuma
  ];
  const dayIndex = new Date().getDay();
  return days[dayIndex] || "Cuma";
}

export function getTodayClasses(studentId: string, dayName?: string, grade: number = 8): LessonSlot[] {
  const schedule = getStudentSchedule(studentId, grade);
  const targetDay = dayName || getTodayDayName();
  return schedule[targetDay] || schedule["Cuma"] || [];
}

export function getAssistantCheckin(studentId: string, dateStr: string): AssistantCheckinRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_CHECKIN_KEY}_${studentId}_${dateStr}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAssistantCheckin(
  studentId: string,
  record: AssistantCheckinRecord
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${STORAGE_CHECKIN_KEY}_${studentId}_${record.dateStr}`,
      JSON.stringify(record)
    );
    window.dispatchEvent(
      new CustomEvent("assistant-checkin-updated", {
        detail: { studentId, record },
      })
    );
  } catch (e) {
    console.error("Asistan durumu kaydedilemedi:", e);
  }
}
