export interface HaftalikDersPlani {
  ders: string;
  hafta: number;
  grade: number; // 5, 6, 7, 8
  konu: string;
  kazanimKodu: string;
  kazanimBasligi: string;
  maarifCiktisi: string;
  erdemDeger: string;
  beceriAlani: string;
  ogretmenTavsiyesi: {
    gorev: string;
    testKitabi: string;
    soruSayisi: number;
    ogretmenNotu: string;
    teslimTarihi: string;
  };
  kavramYanilgisi?: {
    baslik?: string;
    aciklama: string;
    dogrusu: string;
  };
  isLgsKritik?: boolean;
  lgsVurgusu?: {
    onemDerecesi?: "Kritik" | "Çok Yüksek" | "Yüksek";
    soruTipi: string;
    cozumIpuclari: string[];
    ornekSoruAnalizi: string;
  };
}

export const HAFTALIK_MUB_PLANLARI: HaftalikDersPlani[] = [
  // ================= 5. SINIF =================
  // Türkçe 5. Sınıf
  {
    grade: 5,
    ders: "Türkçe",
    hafta: 4,
    konu: "Sözcükte Anlam, Deyimler ve Atasözlerinde Anlam İncelikleri",
    kazanimKodu: "TÜR.5.1.4",
    kazanimBasligi: "Metindeki deyim ve atasözlerinin anlama olan katkısını açıklar.",
    maarifCiktisi: "Kültürel miras ögesi olan deyim ve atasözlerini günlük dilde yerinde ve dürüstlük ilkesiyle kullanır.",
    erdemDeger: "Dürüstlük & Kültürel Miras",
    beceriAlani: "Okuryazarlık (Dil Becerisi)",
    ogretmenTavsiyesi: {
      gorev: "Türkçe Maarif Defteri'ne içinde 'sözünün eri olmak' deyimi geçen kısa bir hikaye yazımı.",
      testKitabi: "MEB 5. Sınıf Türkçe Beceri Temelli Testler Kitabı Sayfa 28-32 (Test 4)",
      soruSayisi: 20,
      ogretmenNotu: "Deyimlerin mecaz anlamlarını sözlükten kontrol ederek cümle içinde kullanmaya özen gösterin.",
      teslimTarihi: "28 Eylül 2026",
    },
  },
  {
    grade: 5,
    ders: "Türkçe",
    hafta: 3,
    konu: "Gerçek ve Mecaz Anlamlı Kelimeler",
    kazanimKodu: "TÜR.5.1.2",
    kazanimBasligi: "Kelimelerin gerçek ve mecaz anlamlarını ayırt eder.",
    maarifCiktisi: "Okuduğu metindeki kelimelerin bağlamsal anlamını kavrar.",
    erdemDeger: "Dürüstlük",
    beceriAlani: "Kavramsal Beceri",
    ogretmenTavsiyesi: {
      gorev: "Kelime kartları hazırlama ve zıt anlamlılarla eşleştirme.",
      testKitabi: "MEB 5. Sınıf Türkçe Çalışma Fasikülü Sayfa 15-18",
      soruSayisi: 15,
      ogretmenNotu: "Günlük okuma saatinde altını çizdiğiniz kelimelerle pratik yapın.",
      teslimTarihi: "21 Eylül 2026",
    },
  },
  {
    grade: 5,
    ders: "Türkçe",
    hafta: 5,
    konu: "Cümlede Anlam: Neden-Sonuç ve Amaç-Sonuç İlişkileri",
    kazanimKodu: "TÜR.5.2.1",
    kazanimBasligi: "Cümleler arasındaki anlam ilişkilerini tespit eder.",
    maarifCiktisi: "Düşüncelerini mantıksal gerekçelerle temellendirerek ifade eder.",
    erdemDeger: "Sorumluluk",
    beceriAlani: "Kavramsal Akıl Yürütme",
    ogretmenTavsiyesi: {
      gorev: "Neden-sonuç ve amaç-sonuç cümlelerini renklendirerek deftere not alma.",
      testKitabi: "MEB 5. Sınıf Türkçe Çalışma Kitabı Sayfa 35-39",
      soruSayisi: 25,
      ogretmenNotu: "Cümledeki 'için, amacıyla, nedeniyle' eklerine dikkat edin.",
      teslimTarihi: "5 Ekim 2026",
    },
  },

  // Matematik 5. Sınıf
  {
    grade: 5,
    ders: "Matematik",
    hafta: 4,
    konu: "Milyonlu Doğal Sayıların Okunması ve Basamak Değeri İlişkileri",
    kazanimKodu: "MAT.5.1.1",
    kazanimBasligi: "En çok dokuz basamaklı doğal sayıları okur, yazar ve basamak değerlerini belirtir.",
    maarifCiktisi: "Büyük sayıları gerçek hayat verileriyle (nüfus, mesafe) ilişkilendirerek akıl yürütür ve modeller.",
    erdemDeger: "Adalet & Doğruluk",
    beceriAlani: "Kavramsal Beceri (Sayı Hissi)",
    ogretmenTavsiyesi: {
      gorev: "Türkiye'nin ve komşu ülkelerin nüfuslarını basamak tablosuna yerleştirip basamak değerlerini hesaplama.",
      testKitabi: "MEB Maarif Modeli Matematik 5 Çalışma Kitabı Sayfa 22-26 (Test 3)",
      soruSayisi: 25,
      ogretmenNotu: "Bölük kavramını karıştırmamak için sayıları sağdan sola üçerli gruplara ayırmayı unutmayın.",
      teslimTarihi: "29 Eylül 2026",
    },
    kavramYanilgisi: {
      baslik: "⚠️ Sayı Değeri ile Basamak Değeri Yanılgısı",
      aciklama: "Öğrenciler 45.820.103 sayısında 8 rakamının basamak değeri sorulduğunda sadece '8' veya 'yüzler' yanıtını verebilmektedir.",
      dogrusu: "Sayı değeri rakamın kendi değeridir (8). Basamak değeri ise bulunduğu basamakla (100.000) çarpımıdır: 8 × 100.000 = 800.000'dir."
    }
  },
  {
    grade: 5,
    ders: "Matematik",
    hafta: 3,
    konu: "Doğal Sayılarla Örüntüler",
    kazanimKodu: "MAT.5.1.2",
    kazanimBasligi: "Kuralı verilen sayı ve şekil örüntülerinin istenen adımlarını bulur.",
    maarifCiktisi: "Düzenlilikleri ve kuralları keşfederek genelleme yapar.",
    erdemDeger: "Çalışkanlık",
    beceriAlani: "Kavramsal Akıl Yürütme",
    ogretmenTavsiyesi: {
      gorev: "Geometrik şekillerle örüntü tablosu hazırlama.",
      testKitabi: "MEB 5. Sınıf Matematik Alıştırma Fasikülü Sayfa 12-16",
      soruSayisi: 20,
      ogretmenNotu: "Artış miktarını bularak formüle edin.",
      teslimTarihi: "22 Eylül 2026",
    },
  },

  // Fen Bilimleri 5. Sınıf
  {
    grade: 5,
    ders: "Fen Bilimleri",
    hafta: 4,
    konu: "Güneş, Dünya ve Ay'ın Geometrik Yapısı ve Hareketleri",
    kazanimKodu: "FEN.5.1.2",
    kazanimBasligi: "Ay'ın dönme ve dolanma hareketlerini açıklar; evrelerini modeller.",
    maarifCiktisi: "Gözlem verilerini kullanarak Ay'ın evrelerini bilimsel merak ve gözlem disipliniyle inceler.",
    erdemDeger: "Merhamet & Evren Düzeni",
    beceriAlani: "Okuryazarlık (Fen Okuryazarlığı)",
    ogretmenTavsiyesi: {
      gorev: "1 hafta boyunca akşamları Ay'ın gökyüzündeki şeklini çizerek gözlem günlüğü oluşturma.",
      testKitabi: "MEB Fen Bilimleri 5 Beceri Temelli Sorular Sayfa 19-24",
      soruSayisi: 18,
      ogretmenNotu: "Ay'ın ana ve ara evrelerini sıralamasıyla öğreniniz.",
      teslimTarihi: "30 Eylül 2026",
    },
    kavramYanilgisi: {
      baslik: "⚠️ Ay'ın Işık Kaynağı Sanılması Yanılgısı",
      aciklama: "Öğrenciler geceleri Ay'ın parlamasından dolayı Ay'ı Güneş gibi kendiliğinden ışık saçan doğal bir ışık kaynağı sanmaktadır.",
      dogrusu: "Ay bir ışık kaynağı DEĞİLDİR; opak bir gökcismidir ve sadece Güneş'ten aldığı ışığı yansıtır. Evreler de Ay'ın aydınlanan yüzünün Dünya'dan farklı açılarda görünmesidir."
    }
  },

  // İngilizce 5. Sınıf
  {
    grade: 5,
    ders: "İngilizce",
    hafta: 4,
    konu: "Unit 1: Hello! - School Subjects, Nationalities & Timetables",
    kazanimKodu: "İNG.5.1.1",
    kazanimBasligi: "Students will be able to talk about school subjects and express likes/dislikes.",
    maarifCiktisi: "Farklı kültürlerden akranlarıyla saygı ve nezaket çerçevesinde kendini tanıtır ve ders programını anlatır.",
    erdemDeger: "Saygı & Nezaket",
    beceriAlani: "Sosyo-Duygusal İletişim",
    ogretmenTavsiyesi: {
      gorev: "Kendi haftalık ders programını İngilizce hazırlayıp odasına asma.",
      testKitabi: "MEB 5th Grade English Activity Book Page 14-18",
      soruSayisi: 15,
      ogretmenNotu: "'I like Science but I don't like History' kalıplarıyla 5 cümle kurunuz.",
      teslimTarihi: "29 Eylül 2026",
    },
  },

  // Din Kültürü 5. Sınıf
  {
    grade: 5,
    ders: "Din Kültürü ve Ahlak Bilgisi",
    hafta: 4,
    konu: "Allah İnancı: Rahman ve Rahim Olan Allah",
    kazanimKodu: "DİN.5.1.2",
    kazanimBasligi: "Allah'ın (c.c.) her şeyi yaratan, yaşatan ve esirgeyen olduğunu ayetlerle kavrar.",
    maarifCiktisi: "Evrendeki kusursuz dengeyi fark ederek canlılara karşı merhamet ve sevgi bilinci geliştirir.",
    erdemDeger: "Merhamet & Şükür",
    beceriAlani: "Sosyo-Duygusal Beceriler",
    ogretmenTavsiyesi: {
      gorev: "Çevremizdeki canlıları (sokak hayvanları, bitkiler) korumaya yönelik 1 iyilik davranışı yapıp not etme.",
      testKitabi: "MEB Din Kültürü 5 Çalışma Kitabı Sayfa 16-20",
      soruSayisi: 15,
      ogretmenNotu: "İhlas suresinin anlamını öğreniniz.",
      teslimTarihi: "28 Eylül 2026",
    },
  },

  // Sosyal Bilgiler 5. Sınıf
  {
    grade: 5,
    ders: "Sosyal Bilgiler",
    hafta: 4,
    konu: "Birey ve Toplum: Haklarımız, Sorumluluklarımız ve Çocuk Hakları",
    kazanimKodu: "SOS.5.1.3",
    kazanimBasligi: "İçinde bulunduğu gruplarda aldığı roller ile rollerin gerektirdiği hak ve sorumlulukları ilişkilendirir.",
    maarifCiktisi: "Toplumsal yaşamda kendi haklarını savunurken başkalarının haklarına saygı duyar, adaleti gözetir.",
    erdemDeger: "Adalet & Sorumluluk",
    beceriAlani: "Sosyo-Duygusal & Vatandaşlık",
    ogretmenTavsiyesi: {
      gorev: "Evde, okulda ve arkadaş çevresinde sahip olduğu 3 hak ve 3 sorumluluğu gösteren afiş hazırlama.",
      testKitabi: "MEB Sosyal Bilgiler 5 Beceri Temelli Sorular Sayfa 20-25",
      soruSayisi: 20,
      ogretmenNotu: "Çocuk Hakları Sözleşmesi maddelerini gözden geçiriniz.",
      teslimTarihi: "1 Ekim 2026",
    },
  },

  // ================= 6. SINIF =================
  // Türkçe 6. Sınıf
  {
    grade: 6,
    ders: "Türkçe",
    hafta: 4,
    konu: "Sözcükte Yapı: Kökler (İsim ve Fiil Kökü), Yapım ve Çekim Ekleri",
    kazanimKodu: "TÜR.6.1.4",
    kazanimBasligi: "Kelimelerin kök ve eklerini ayırt eder; yapım eklerinin kelimeye kazandırdığı yeni anlamları kavrar.",
    maarifCiktisi: "Kelimelerin morfolojik yapısını analiz ederek Türkçenin türetme zenginliğini dil bilinciyle kavrar.",
    erdemDeger: "Özen & Dil Bilinci",
    beceriAlani: "Okuryazarlık (Dil Bilgisi & Morfoloji)",
    ogretmenTavsiyesi: {
      gorev: "Günlük hayatta en sık kullandığınız 15 sözcüğü kök ve eklerine ayırıp ek şeması tablosu oluşturunuz.",
      testKitabi: "MEB 6. Sınıf Türkçe Beceri Temelli Sorular Sayfa 24-28 (Kazanım Testi 4)",
      soruSayisi: 20,
      ogretmenNotu: "İsim kökü ile fiil kökünü ayırt etmek için -mak/-mek mastar ekini kullanınız.",
      teslimTarihi: "28 Eylül 2026",
    },
  },
  // Matematik 6. Sınıf
  {
    grade: 6,
    ders: "Matematik",
    hafta: 4,
    konu: "Doğal Sayılarla İşlemler: Üslü İfadeler ve İşlem Önceliği",
    kazanimKodu: "MAT.6.1.1",
    kazanimBasligi: "Bir doğal sayının kendisiyle tekrarlı çarpımını üslü ifade olarak yazar ve değerini hesaplar; işlem önceliğini uygular.",
    maarifCiktisi: "İşlem adımlarını mantıksal sıralama ve kural disipliniyle çözerek matematiksel akıl yürütür.",
    erdemDeger: "Sabır & Mantıksal Disiplin",
    beceriAlani: "Kavramsal Akıl Yürütme",
    ogretmenTavsiyesi: {
      gorev: "İşlem önceliği basamaklarını (Üs, Parantez, Çarpma/Bölme, Toplama/Çıkarma) gösteren renkli poster hazırlama.",
      testKitabi: "MEB Maarif Modeli Matematik 6 Çalışma Kitabı Sayfa 18-24",
      soruSayisi: 25,
      ogretmenNotu: "Parantez içi işlemlerin her zaman öncelikli olduğunu unutmayınız.",
      teslimTarihi: "29 Eylül 2026",
    },
  },
  // Fen Bilimleri 6. Sınıf
  {
    grade: 6,
    ders: "Fen Bilimleri",
    hafta: 4,
    konu: "Güneş Sistemi ve Gezegenlerin Özellikleri (İç ve Dış Gezegenler)",
    kazanimKodu: "FEN.6.1.1",
    kazanimBasligi: "Güneş sistemindeki gezegenleri Güneş'e olan yakınlıklarına ve özelliklerine göre sıralar ve karşılaştırır.",
    maarifCiktisi: "Evrendeki gök cisimlerinin büyüklük ve mesafelerini modelleyerek bilimsel gözlem farkındalığı kazanır.",
    erdemDeger: "Evren Düzenine Saygı",
    beceriAlani: "Fen Okuryazarlığı & Modelleme",
    ogretmenTavsiyesi: {
      gorev: "Güneş sistemindeki 8 gezegenin özelliklerini içeren karşılaştırma infografiği hazırlama.",
      testKitabi: "MEB 6. Sınıf Fen Bilimleri Beceri Soruları Sayfa 15-20",
      soruSayisi: 20,
      ogretmenNotu: "Karasal ve gazsal gezegen ayrımına dikkat ediniz.",
      teslimTarihi: "30 Eylül 2026",
    },
  },
  // Sosyal Bilgiler 6. Sınıf
  {
    grade: 6,
    ders: "Sosyal Bilgiler",
    hafta: 4,
    konu: "Biz ve Değerlerimiz: Toplumsal Yardımlaşma, Dayanışma ve Sadaka Taşı Geleneği",
    kazanimKodu: "SOS.6.1.2",
    kazanimBasligi: "Toplumsal yardımlaşma ve dayanışmanın toplum huzuruna ve birlikteliğe katkısını değerlendirir.",
    maarifCiktisi: "Tarihten günümüze vakıf ve yardımlaşma kültürünü analiz ederek cömertlik ve empati erdemlerini benimser.",
    erdemDeger: "Yardımlaşma & Dayanışma",
    beceriAlani: "Sosyo-Duygusal Beceriler",
    ogretmenTavsiyesi: {
      gorev: "Osmanlı'daki 'Sadaka Taşı' veya 'Zimem Defteri' geleneğini anlatan 1 sayfalık araştırma yazısı.",
      testKitabi: "MEB 6. Sınıf Sosyal Bilgiler Çalışma Fasikülü Sayfa 22-26",
      soruSayisi: 15,
      ogretmenNotu: "Yakın çevrenizdeki bir yardımlaşma derneğinin faaliyetlerini inceleyebilirsiniz.",
      teslimTarihi: "1 Ekim 2026",
    },
  },
  // İngilizce 6. Sınıf
  {
    grade: 6,
    ders: "İngilizce",
    hafta: 4,
    konu: "Unit 1: Life - Describing Daily Routines, Habits & Simple Present Tense",
    kazanimKodu: "İNG.6.1.2",
    kazanimBasligi: "Students will be able to talk about repeated actions and daily routines.",
    maarifCiktisi: "Zaman yönetimi ve planlı yaşam bilinciyle günlük programını İngilizce olarak ifade eder.",
    erdemDeger: "Zaman Yönetimi & Sorumluluk",
    beceriAlani: "İletişim & Dil Becerisi",
    ogretmenTavsiyesi: {
      gorev: "Bir iş günündeki 6 temel rutininizi saatleriyle birlikte Simple Present Tense ile yazınız.",
      testKitabi: "MEB 6th Grade English Workbook Page 12-16",
      soruSayisi: 20,
      ogretmenNotu: "'He/She/It' öznelerinde fiile '-s/-es' takısı getirmeyi unutmayınız.",
      teslimTarihi: "29 Eylül 2026",
    },
  },
  // Din Kültürü 6. Sınıf
  {
    grade: 6,
    ders: "Din Kültürü ve Ahlak Bilgisi",
    hafta: 4,
    konu: "Peygamber ve İlahi Kitap İnancı: Peygamberlerin Nitelikleri (Sıdk, Emanet, İsmet, Fetanet, Tebliğ)",
    kazanimKodu: "DİN.6.1.2",
    kazanimBasligi: "Peygamberlerin sıfatlarını açıklar ve bu sıfatların insanlık için önemini yorumlar.",
    maarifCiktisi: "Doğruluk, dürüstlük ve emanete riayet erdemlerini peygamberlerin hayatından ilhamla davranışa dönüştürür.",
    erdemDeger: "Doğruluk & Emanet",
    beceriAlani: "Ahlaki Muhakeme",
    ogretmenTavsiyesi: {
      gorev: "5 peygamber sıfatını tanımlarıyla birlikte kavram haritasına yerleştirme.",
      testKitabi: "MEB 6. Sınıf Din Kültürü Kazanım Testleri Sayfa 14-18",
      soruSayisi: 15,
      ogretmenNotu: "Sıdk (doğruluk) ve Emanet (güvenilirlik) kavramlarının günlük hayatımızdaki karşılıklarını düşününüz.",
      teslimTarihi: "28 Eylül 2026",
    },
  },

  // ================= 7. SINIF =================
  // Türkçe 7. Sınıf
  {
    grade: 7,
    ders: "Türkçe",
    hafta: 4,
    konu: "Fiillerde Anlam (İş, Oluş, Durum Fiilleri) ve Fiil Çekimi",
    kazanimKodu: "TÜR.7.3.1",
    kazanimBasligi: "Fiillerin anlam özelliklerini ayırt eder ve haber/dilek kipleriyle çekimler.",
    maarifCiktisi: "Eylemlerin ifade ettiği durumları anlam incelikleriyle fark ederek estetik ve zengin bir dille aktarır.",
    erdemDeger: "Estetik Duyarlık",
    beceriAlani: "Okuryazarlık (Dil Becerisi)",
    ogretmenTavsiyesi: {
      gorev: "Okuduğunuz kitaptan 5 iş, 5 oluş, 5 durum fiili bularak cümle içinde kullanınız.",
      testKitabi: "MEB 7. Sınıf Türkçe Beceri Temelli Testler Sayfa 28-34",
      soruSayisi: 25,
      ogretmenNotu: "İş fiillerinin başına 'onu' kelimesinin geldiğini anımsayınız (onu okudu vb.).",
      teslimTarihi: "28 Eylül 2026",
    },
  },
  // Matematik 7. Sınıf
  {
    grade: 7,
    ders: "Matematik",
    hafta: 4,
    konu: "Tam Sayılarla İşlemler: Tam Sayılarla Çarpma ve Bölme İşlemleri ve Sayı Doğrusunda Gösterim",
    kazanimKodu: "MAT.7.1.1",
    kazanimBasligi: "Tam sayılarla çarpma ve bölme işlemlerini yapar; ilgili problemleri modeller.",
    maarifCiktisi: "Negatif ve pozitif değer ilişkilerini borç-alacak, sıcaklık gibi hayat pratikleriyle adalet ve denge ekseninde yorumlar.",
    erdemDeger: "Adalet & Denge",
    beceriAlani: "Kavramsal Akıl Yürütme",
    ogretmenTavsiyesi: {
      gorev: "İşaret kurallarını (+ ile - çarpımı vb.) modelleyen sayı pulları alıştırmaları yapınız.",
      testKitabi: "MEB Maarif Modeli Matematik 7 Çalışma Fasikülü Sayfa 20-26",
      soruSayisi: 30,
      ogretmenNotu: "Aynı işaretli sayıların çarpımının pozitif, zıt işaretli sayıların negatif olduğunu ezberlemek yerine pullarla kavrayınız.",
      teslimTarihi: "29 Eylül 2026",
    },
  },
  // Fen Bilimleri 7. Sınıf
  {
    grade: 7,
    ders: "Fen Bilimleri",
    hafta: 4,
    konu: "Güneş Sistemi ve Ötesi: Uzay Araştırmaları, Yapay Uydular ve Türkiye'nin Uzay Misyonu",
    kazanimKodu: "FEN.7.1.1",
    kazanimBasligi: "Uzay araştırmalarında kullanılan teknolojileri ve Türkiye'nin yerli uydularını açıklar.",
    maarifCiktisi: "Milli teknoloji hamlesi vizyonuyla Türkiye'nin uzay çalışmalarını (Türksat, İmece) araştırarak vatanseverlik bilinci geliştirir.",
    erdemDeger: "Vatanseverlik & Bilimsel Merak",
    beceriAlani: "Fen ve Teknoloji Okuryazarlığı",
    ogretmenTavsiyesi: {
      gorev: "Türkiye'nin ilk yerli gözlem uydusu İMECE'nin görev alanlarını özetleyen araştırma kartı hazırlama.",
      testKitabi: "MEB 7. Sınıf Fen Bilimleri Beceri Soruları Sayfa 14-20",
      soruSayisi: 20,
      ogretmenNotu: "Uzay kirliliğinin gelecekte yaratacağı tehlikeleri de not ediniz.",
      teslimTarihi: "30 Eylül 2026",
    },
  },
  // Sosyal Bilgiler 7. Sınıf
  {
    grade: 7,
    ders: "Sosyal Bilgiler",
    hafta: 4,
    konu: "İletişim ve İnsan İlişkileri: Sen Dili - Ben Dili, Empati ve Etkili Dinleme",
    kazanimKodu: "SOS.7.1.1",
    kazanimBasligi: "İletişimi olumlu ve olumsuz etkileyen tutum ve davranışları fark ederek kendi iletişim dilini geliştirir.",
    maarifCiktisi: "Karşısındakini yargılamadan dinleme, 'ben dili' kullanma ve erdemli iletişimle çatışmaları çözme becerisi kazanır.",
    erdemDeger: "Empati & Nezaket",
    beceriAlani: "Sosyo-Duygusal İletişim",
    ogretmenTavsiyesi: {
      gorev: "Ailenizle veya bir arkadaşınızla iletişiminizde 3 kez 'sen dili' yerine 'ben dili' kullanarak sonucu günlüğünüze yazınız.",
      testKitabi: "MEB 7. Sınıf Sosyal Bilgiler Çalışma Kitabı Sayfa 18-24",
      soruSayisi: 20,
      ogretmenNotu: "'Sen hep geç kalıyorsun' yerine 'Geç kaldığında endişeleniyorum' yaklaşımını deneyimleyiniz.",
      teslimTarihi: "1 Ekim 2026",
    },
  },
  // İngilizce 7. Sınıf
  {
    grade: 7,
    ders: "İngilizce",
    hafta: 4,
    konu: "Unit 1: Appearance and Personality - Describing People & Comparative Adjectives",
    kazanimKodu: "İNG.7.1.2",
    kazanimBasligi: "Students will be able to describe characters and physical appearances using comparatives.",
    maarifCiktisi: "İnsanların farklı özelliklerine saygı göstererek hoşgörü ve dürüstlük ilkeleriyle betimleme yapar.",
    erdemDeger: "Hoşgörü & Saygı",
    beceriAlani: "İletişim ve Kişilerarası Beceriler",
    ogretmenTavsiyesi: {
      gorev: "En sevdiğiniz iki edebi veya tarihi şahsiyetin kişilik özelliklerini İngilizce comparative kalıplarıyla karşılaştırınız.",
      testKitabi: "MEB 7th Grade English Practice Book Page 16-22",
      soruSayisi: 20,
      ogretmenNotu: "'more generous than', 'kinder than' yapılarına dikkat ediniz.",
      teslimTarihi: "29 Eylül 2026",
    },
  },
  // Din Kültürü 7. Sınıf
  {
    grade: 7,
    ders: "Din Kültürü ve Ahlak Bilgisi",
    hafta: 4,
    konu: "Melek ve Ahiret İnancı: Görünmeyen Âleme İman ve Meleklerin Görevleri",
    kazanimKodu: "DİN.7.1.2",
    kazanimBasligi: "Meleklerin özelliklerini ve görevlerini ayet ve hadisler ışığında açıklar.",
    maarifCiktisi: "Kiramen Kâtibin meleklerinin varlığı bilinciyle günlük davranışlarında sorumluluk, adalet ve dürüstlük gözetir.",
    erdemDeger: "Sorumluluk & Özdenetim",
    beceriAlani: "Ahlaki Muhakeme",
    ogretmenTavsiyesi: {
      gorev: "Dört büyük meleğin isimlerini ve vazifelerini şematik olarak hazırlayınız.",
      testKitabi: "MEB 7. Sınıf Din Kültürü Çalışma Kitabı Sayfa 16-22",
      soruSayisi: 15,
      ogretmenNotu: "Özdenetim sahibi olmanın insan vicdanına sağladığı iç huzuru düşününüz.",
      teslimTarihi: "28 Eylül 2026",
    },
  },

  // ================= 8. SINIF =================
  // Türkçe 8. Sınıf
  {
    grade: 8,
    ders: "Türkçe",
    hafta: 4,
    konu: "Fiilimsiler (Eylemsiler) - İsim-Fiil, Sıfat-Fiil ve Zarf-Fiil Ayrımı",
    kazanimKodu: "TÜR.8.3.1",
    kazanimBasligi: "Fiilimsilerin cümledeki işlevlerini fark eder ve türlerini ayırt eder.",
    maarifCiktisi: "Metinlerdeki dil bilgisi yapılarını analiz ederek düşüncesini zengin ve akıcı bir üslupla ifade eder.",
    erdemDeger: "Çalışkanlık & Özen",
    beceriAlani: "Okuryazarlık (Dil Bilgisi)",
    ogretmenTavsiyesi: {
      gorev: "LGS denemesinde çıkan fiilimsi sorularını analiz edip hatalı soruları soru defterine yapıştırma.",
      testKitabi: "MEB 8. Sınıf LGS Türkçe Çalışma Fasikülü Sayfa 30-36 (Kazanım Testi 5)",
      soruSayisi: 30,
      ogretmenNotu: "Kalıplaşmış isimlerle sıfat-fiil eklerini (-acak, -miş, -ar) karıştırmayınız.",
      teslimTarihi: "28 Eylül 2026",
    },
    isLgsKritik: true,
    kavramYanilgisi: {
      baslik: "⚠️ Fiilimsi ve Kalıplaşmış İsim Yanılgısı",
      aciklama: "Öğrenciler 'Dolmuş durağı', 'Yemek masası' veya 'Dondurma külahı' gibi sözcüklerdeki ekleri fiilimsi eki sanarak işaretlemektedir.",
      dogrusu: "Eğer sözcük bir eylemi değil de somut bir varlığı/kavramı karşılıyorsa kalıplaşmış kalıcı isimdir; olumsuzu (-me/-ma ekiyle) yapılamaz! (Örn: 'dondurma' -> 'dondurmama' diyemezsiniz)."
    },
    lgsVurgusu: {
      onemDerecesi: "Kritik",
      soruTipi: "Cümle Analizi & Paragrafta Fiilimsi Tür Eşleştirme",
      cozumIpuclari: [
        "1. Kural: Cümledeki çekimli fiilleri (yüklemleri) hemen eleyin; fiilimsiler çekim eki (zaman/şahıs) almaz.",
        "2. Kural: 'An-ası-mez-ar-dik-ecek-miş' sıfat-fiil eklerinin nitelediği ismi bulun.",
        "3. Kural: '-ken, -alı, -esiye, -meden, -ince, -ip, -arak, -dıkça' eklerinin cümleye zaman mı durum mu kattığını kontrol edin."
      ],
      ornekSoruAnalizi: "MEB LGS'de son 5 yılın 4'ünde doğrudan fiilimsi türü veya fiilimsi sayısı sorulmuştur. En sık çeldirici sıfat-fiil ile geçmiş zaman kipi (-dı/-miş) benzerliğidir."
    }
  },

  // Matematik 8. Sınıf
  {
    grade: 8,
    ders: "Matematik",
    hafta: 4,
    konu: "Çarpanlar ve Katlar: EBOB - EKOK Problemleri ve Modelleme",
    kazanimKodu: "MAT.8.1.1",
    kazanimBasligi: "İki doğal sayının en büyük ortak bölenini (EBOB) ve en küçük ortak katını (EKOK) hesaplar; ilgili problemleri çözer.",
    maarifCiktisi: "Parçalardan bütüne veya bütünden parçaya akıl yürütme stratejileri geliştirerek problem çözer.",
    erdemDeger: "Adalet & Mantıksal Çözümleme",
    beceriAlani: "Kavramsal Akıl Yürütme",
    ogretmenTavsiyesi: {
      gorev: "LGS çıkmış EBOB-EKOK sorularından 15 yeni nesil problem çözümü.",
      testKitabi: "MEB LGS Matematik Örnek Sorular Kitapçığı Sayfa 14-22",
      soruSayisi: 25,
      ogretmenNotu: "Bölme/parçalama sorularında EBOB, birleştirme/kat sorularında EKOK kullanıldığını hatırlayınız.",
      teslimTarihi: "29 Eylül 2026",
    },
    isLgsKritik: true,
    kavramYanilgisi: {
      baslik: "⚠️ EBOB ile EKOK Soru Tiplerinin Karıştırılması",
      aciklama: "Öğrenciler soru metninde 'en az' kelimesini görünce hemen EKOK, 'en çok' görünce EBOB uygulamaktadır. Bu yöntem tamamen YANLIŞTIR!",
      dogrusu: "Kural: Bütünden parçaya gidiliyorsa (büyük çuvallar eşit poşetlere, tarla parsellere ayrılıyorsa) EBOB; küçük parçalardan büyük bir bütün oluşturuluyorsa (fayanslar kareye, nöbet günleri ortak zamana) EKOK kullanılır!"
    },
    lgsVurgusu: {
      onemDerecesi: "Kritik",
      soruTipi: "Yeni Nesil Senaryolu Modelleme & Şekilli Alan Problemleri",
      cozumIpuclari: [
        "1. Kural: Dikdörtgen şeklindeki levhaların kenar uzunlukları ortak bölen (EBOB) üzerinden test edilmelidir.",
        "2. Kural: Soruda 'Aralarında asal' şartı verildiyse sayıların 1 dışında ortak böleni olmadığını doğrulayın.",
        "3. Kural: EBOB(a, b) × EKOK(a, b) = a × b kuralını cebirsel ilişkilerde doğrudan kullanın."
      ],
      ornekSoruAnalizi: "LGS Matematik testinin 1. veya 2. sorusu her yıl istisnasız EBOB-EKOK veya Asal Çarpanlar modellemesidir. 2024 LGS'de kenar uzunlukları cm cinsinden tam sayı olan kartonların çakıştırılması sorulmuştur."
    }
  },

  // Fen Bilimleri 8. Sınıf
  {
    grade: 8,
    ders: "Fen Bilimleri",
    hafta: 4,
    konu: "Mevsimler ve İklim: Dünya'nın Dönme Ekseni Eğikliği ve Güneş Işınlarının Geliş Açısı",
    kazanimKodu: "FEN.8.1.1",
    kazanimBasligi: "Mevsimlerin oluşumuna yönelik tahminlerde bulunur.",
    maarifCiktisi: "Güneş ışınlarının dik ve eğik açıyla gelmesinin birim yüzeye düşen enerjiye etkisini modeller.",
    erdemDeger: "Bilimsel Merak & Çevre Bilinci",
    beceriAlani: "Okuryazarlık (Fen & Çevre)",
    ogretmenTavsiyesi: {
      gorev: "El feneri ve küre modeliyle 21 Haziran ve 21 Aralık tarihlerindeki ışık yoğunluğu deneyini yapma.",
      testKitabi: "MEB 8. Sınıf Fen Bilimleri Beceri Temelli Sorular Sayfa 12-18",
      soruSayisi: 25,
      ogretmenNotu: "Güneş'e olan mesafenin mevsimlerin oluşumuyla ilgisi olmadığını unutmayınız.",
      teslimTarihi: "30 Eylül 2026",
    },
    isLgsKritik: true,
    kavramYanilgisi: {
      baslik: "⚠️ Kritik Yanılgı: Dünya'nın Güneş'e Olan Mesafesi",
      aciklama: "Öğrencilerin büyük kısmı Dünya Güneş'e yaklaştığında havaların ısınıp yaz olduğunu sanmaktadır.",
      dogrusu: "Mevsimlerin oluşumunun Dünya'nın Güneş'e olan mesafesiyle HİÇBİR İLGİSİ YOKTUR! Nitekim Kuzey Yarımküre'de kış yaşanırken (3 Ocak), Dünya Güneş'e en yakın (147 milyon km) konumdadır! Asıl etken: 23° 27' eksen eğikliği ve Güneş ışınlarının geliş açısıdır."
    },
    lgsVurgusu: {
      onemDerecesi: "Kritik",
      soruTipi: "Deney Düzeneği, Işık Yoğunluğu & Gölge Boyu Grafiği",
      cozumIpuclari: [
        "1. Kural: Işın dik açıyla (90°) gelirse birim alana düşen ısı enerjisi en fazladır (Yaz mevsimi).",
        "2. Kural: Öğle vakti dik açıyla gelen ışınlarda gölge boyu minimum (veya sıfır), eğik gelen kış ışınlarında gölge boyu maksimumdur.",
        "3. Kural: 21 Mart ve 23 Eylül Ekinoks tarihlerinde tüm dünyada gece-gündüz eşitliği (12 saat) yaşanır."
      ],
      ornekSoruAnalizi: "LGS Fen Bilimleri 1. sorusu daima Mevsimler ve İklim konusundan gelir. MEB, farklı yarımkürelerdeki şehirlerin gölge boyu grafiklerini veya gece-gündüz süre değişim tablolarını eşleştirmeyi çok sever."
    }
  },

  // İngilizce 8. Sınıf
  {
    grade: 8,
    ders: "İngilizce",
    hafta: 4,
    konu: "Unit 1: Friendship - Personal Qualities, Making Invitations & Excuses",
    kazanimKodu: "İNG.8.1.2",
    kazanimBasligi: "Students will be able to accept and refuse invitations giving reasons.",
    maarifCiktisi: "Dürüstlük ve güvenilirlik değerleri üzerinden dostluk ilişkilerini ifade eder, nezaketle davetleri yanıtlar.",
    erdemDeger: "Dürüstlük & Vefa",
    beceriAlani: "Sosyo-Duygusal Beceriler",
    ogretmenTavsiyesi: {
      gorev: "Bir arkadaşına hafta sonu için sinema daveti ve mazeret mektubu yazma (İngilizce diyalog).",
      testKitabi: "MEB 8th Grade English LGS Master Test Page 18-24",
      soruSayisi: 20,
      ogretmenNotu: "'I'd love to, but I can't because...' kalıbına dikkat ediniz.",
      teslimTarihi: "29 Eylül 2026",
    },
    isLgsKritik: true,
    kavramYanilgisi: {
      baslik: "⚠️ 'Refuse without excuse' Çeldiricisi",
      aciklama: "Öğrenciler sorularda 'reddetme' (refuse) ile 'mazeret bildirme' (give an excuse) ifadelerini karıştırır.",
      dogrusu: "'No, thanks' sadece reddetmektir. 'I'd love to, but I have to study' hem reddetme hem de geçerli bir mazerettir. Soru köküne dikkat edilmelidir."
    },
    lgsVurgusu: {
      onemDerecesi: "Çok Yüksek",
      soruTipi: "Diyalog Tamamlama & Davetiye Kartı / Anket Tablosu Okuma",
      cozumIpuclari: [
        "1. Kural: Soru kökünde 'Which of the following is NOT mentioned' veya 'Who refuses the offer with an excuse' ifadelerinin altını çizin.",
        "2. Kural: 'Count on, depend on, rely on' fiillerinin 'trust' (güvenmek) anlamına geldiğini unutmayın.",
        "3. Kural: 'Awesome, cool, great' ifadeleri kabul (accept), 'busy, full, dentist' mazeret (excuse) habercisidir."
      ],
      ornekSoruAnalizi: "Friendship ünitesinden LGS'de banko 1 veya 2 soru gelmektedir. Genelde 4 arkadaşın WhatsApp mesajlaşması veya piknik davetiyesine verdikleri cevaplar üzerinden kurgulanır."
    }
  },

  // Din Kültürü 8. Sınıf
  {
    grade: 8,
    ders: "Din Kültürü ve Ahlak Bilgisi",
    hafta: 4,
    konu: "Kader ve Kaza İnancı: İnsanın İradesi, Özgürlüğü ve Sorumluluğu",
    kazanimKodu: "DİN.8.1.2",
    kazanimBasligi: "İnsanın ilmi, iradesi, sorumluluğu ile kader arasında ilişki kurar.",
    maarifCiktisi: "Kendi eylemlerinin sorumluluğunu üstlenerek kaderi bahane etmeden çalışkan ve dürüst olmayı ilke edinir.",
    erdemDeger: "Sorumluluk & Dürüstlük",
    beceriAlani: "Kavramsal ve Ahlaki Muhakeme",
    ogretmenTavsiyesi: {
      gorev: "Tevekkül ve sorumluluk kavramları arasındaki farkı açıklayan 1 sayfalık kompozisyon.",
      testKitabi: "MEB 8. Sınıf Din Kültürü LGS Hazırlık Testi Sayfa 15-20",
      soruSayisi: 20,
      ogretmenNotu: "Cüzi irade ile külli irade arasındaki farkı iyi kavrayınız.",
      teslimTarihi: "28 Eylül 2026",
    },
    isLgsKritik: true,
    kavramYanilgisi: {
      baslik: "⚠️ Tevekkül ile Tembelliğin Karıştırılması",
      aciklama: "Kader inancında insanın hiçbir sorumluluğu olmadığı ve her şeyin önceden yazıldığı için çaba göstermeye gerek olmadığı zannedilir.",
      dogrusu: "İslam'da tevekkül: 'Gerekli tüm tedbirleri alıp üzerine düşen gayreti gösterdikten sonra sonucu Allah'a bırakmak'tır. Deveyi bağlamadan 'kaderim böyleymiş' demek yanlış kader anlayışıdır."
    },
    lgsVurgusu: {
      onemDerecesi: "Çok Yüksek",
      soruTipi: "Ayet ve Hadis Yorumlama / Örnek Olay Değerlendirmesi",
      cozumIpuclari: [
        "1. Kural: Cüzi irade (insanın tercih hakkı ve sorumluluğu), Külli irade (Allah'ın mutlak ve sınırsız iradesi) ayrımını yapın.",
        "2. Kural: Fiziksel yasalar (suyun kaynaması), Biyolojik yasalar (canlıların üremesi), Toplumsal yasalar (adalet ve göç) yasalarını ayırt edin.",
        "3. Kural: Ayet metninde sebep-sonuç ilişkisine odaklanın."
      ],
      ornekSoruAnalizi: "Kader ve Evrenin Yasaları (Sünnetullah) LGS Din Kültürü sınavının en yüksek ağırlıklı konusudur. Her yıl 2 soru doğrudan bu kazanımdan sorulmaktadır."
    }
  },

  // 8. Sınıflar için Sosyal yerine gelen T.C. İnkılap Tarihi ve Atatürkçülük!
  {
    grade: 8,
    ders: "T.C. İnkılap Tarihi ve Atatürkçülük",
    hafta: 4,
    konu: "Bir Kahraman Doğuyor: Mustafa Kemal'in Fikir Hayatını Etkileyen Olaylar ve Yazarlar",
    kazanimKodu: "İNK.8.1.3",
    kazanimBasligi: "Mustafa Kemal'in çocukluk ve öğrenim hayatından hareketle onun kişilik özelliklerinin oluşumunu analiz eder.",
    maarifCiktisi: "Tarihsel şahsiyetlerin liderlik ve vatanseverlik vasıflarını kendi karakter gelişimine rehber edinir.",
    erdemDeger: "Vatanseverlik & Liderlik",
    beceriAlani: "Tarihsel Düşünme & Erdem",
    ogretmenTavsiyesi: {
      gorev: "Mustafa Kemal'i etkileyen Manastır Askeri İdadisi dönemi ve Namık Kemal, Ziya Gökalp okumaları üzerine özet tablo çıkarma.",
      testKitabi: "MEB 8. Sınıf İnkılap Tarihi LGS Testleri Sayfa 22-28 (Kazanım Testi 3)",
      soruSayisi: 25,
      ogretmenNotu: "Manastır, Selanik ve Şam şehirlerinin Mustafa Kemal'in fikir dünyasına katkılarını eşleştiriniz.",
      teslimTarihi: "1 Ekim 2026",
    },
    isLgsKritik: true,
    kavramYanilgisi: {
      baslik: "⚠️ Şehirlerin Fikir Dünyasına Etkilerinin Karıştırılması",
      aciklama: "Selanik, Manastır, İstanbul ve Şam şehirlerinin Mustafa Kemal'e kazandırdığı nitelikler birbirine karıştırılabilmektedir.",
      dogrusu: "Selanik: Çok uluslu yapı ve Batı'ya açılan liman. Manastır: Tarih bilinci ve milliyetçilik/edebiyat (Namık Kemal, Mehmet Emin). İstanbul: Ülke siyaseti ve padişah yönetimi. Şam: İlk görev yeri ve Vatan ve Hürriyet Cemiyeti (liderlik)."
    },
    lgsVurgusu: {
      onemDerecesi: "Kritik",
      soruTipi: "Kişilik Özelliği Eşleştirme & Harita/Metin Yorumlama",
      cozumIpuclari: [
        "1. Kural: 'Askeri dehası, ileri görüşlülüğü, teşkilatçılığı, vatanseverliği' kavramlarını metindeki davranışlarla eşleştirin.",
        "2. Kural: Türk yazarlarından (Namık Kemal, Ziya Gökalp) milliyetçilik ve bağımsızlık; yabancı yazarlardan (Montesquieu, Rousseau) cumhuriyet ve eşitlik fikirlerini almıştır.",
        "3. Kural: Tarihsel haritada Selanik'in demir yolu ve liman bağlantısının kültürel etkileşimi hızlandırdığını unutmayın."
      ],
      ornekSoruAnalizi: "LGS İnkılap Tarihi testinde 1. soru daima Mustafa Kemal'in çocukluğu, öğrenim hayatı veya kişilik özelliklerinden gelir. 2024 LGS'de Manastır'daki Türk-Yunan Savaşı'nın Atatürk'ün vatanseverlik duygusuna etkisi sorulmuştur."
    }
  },
];
