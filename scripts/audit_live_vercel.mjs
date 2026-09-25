async function auditLive() {
  console.log("======================================================");
  console.log("🔍 CANLI VERCEL DENETİMİ (https://okultakip.vercel.app/)");
  console.log("======================================================");

  const baseUrl = "https://okultakip.vercel.app";
  const issues = [];
  const passed = [];

  // 1. Ana Sayfa Erişilebilirliği
  try {
    const t0 = Date.now();
    const res = await fetch(baseUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
    const elapsed = Date.now() - t0;
    const html = await res.text();

    if (res.status === 200) {
      passed.push(`✅ Ana sayfa erişilebilir (HTTP 200, Yanıt Süresi: ${elapsed}ms)`);
    } else {
      issues.push(`❌ Ana sayfa HTTP ${res.status} hatası verdi!`);
    }

    // Başlık ve Meta Kontrolü
    if (html.includes("MEB Maarif LMS") && html.includes("Türkiye Yüzyılı Maarif Modeli")) {
      passed.push("✅ SEO & Başlık etiketleri doğru tanımlı");
    } else {
      issues.push("⚠️ Başlık veya meta açıklamasında eksiklik var");
    }

    // Rol ve Komponent Varlığı
    const requiredRoles = ["Öğretmen", "Veli", "Öğrenci", "Misafir", "Yönetici"];
    for (const r of requiredRoles) {
      if (html.includes(r)) {
        passed.push(`✅ Rol yapısı mevcut: ${r}`);
      } else {
        issues.push(`⚠️ Rol başlığı HTML çıktısında doğrudan görünmüyor: ${r}`);
      }
    }

    // Branş Öğretmenleri
    const teachers = ["Ahmet Yılmaz", "Canan Şahin", "Sevgi Can", "Zeynep Kaya", "Kemal Arslan", "Mustafa Koç"];
    for (const t of teachers) {
      if (html.includes(t)) {
        passed.push(`✅ Branş öğretmeni mevcut: ${t}`);
      } else {
        issues.push(`⚠️ Branş öğretmeni HTML çıktısında eksik: ${t}`);
      }
    }

  } catch (err) {
    issues.push(`❌ Ana sayfa bağlantı hatası: ${err.message}`);
  }

  // 2. APK İndirme Uç Noktası
  try {
    const apkUrl = `${baseUrl}/downloads/maarif-lms-v2026.apk`;
    const res = await fetch(apkUrl, { method: "HEAD" });
    const cl = res.headers.get("content-length");
    const ct = res.headers.get("content-type");
    console.log(`\n📦 APK HEAD Yanıtı: Status ${res.status}, Type: ${ct}, Length: ${cl}`);

    if (res.status === 200) {
      const bytes = parseInt(cl || "0", 10);
      const mb = (bytes / (1024 * 1024)).toFixed(2);
      if (bytes < 1000000) {
        issues.push(`❌ KRİTİK HATA: Canlı Vercel'deki APK dosyası yalnızca ${bytes} bayt (~${(bytes/1024).toFixed(1)} KB)! Sitede 14.2 MB yazmasına rağmen dosya henüz Vercel'e deploy olmamış veya eski sürüm kalmış.`);
      } else {
        passed.push(`✅ APK dosyası tam boyutunda yayında: ${mb} MB (${bytes} bayt)`);
      }
    } else {
      issues.push(`❌ APK indirme bağlantısı HTTP ${res.status} hatası döndürüyor: ${apkUrl}`);
    }
  } catch (err) {
    issues.push(`❌ APK indirme bağlantısına erişilemedi: ${err.message}`);
  }

  // 3. Manifest.json Kontrolü
  try {
    const mRes = await fetch(`${baseUrl}/manifest.json`);
    if (mRes.status === 200) {
      const mJson = await mRes.json();
      if (mJson.display === "standalone" && mJson.name) {
        passed.push("✅ PWA manifest.json geçerli ve yayında");
      } else {
        issues.push("⚠️ manifest.json içeriği eksik");
      }
    } else {
      issues.push(`❌ manifest.json HTTP ${mRes.status} döndürdü`);
    }
  } catch (err) {
    issues.push(`❌ manifest.json erişim hatası: ${err.message}`);
  }

  console.log("\n=================== BAŞARILI ADIMLAR ===================");
  passed.forEach(p => console.log(p));

  console.log("\n=================== TESPİT EDİLEN HATALAR VE SORUNLAR ===================");
  if (issues.length === 0) {
    console.log("🎉 Canlı sistemde hiçbir hata bulunamadı!");
  } else {
    issues.forEach(i => console.log(i));
  }
}

auditLive().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
