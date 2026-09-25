import fs from "fs";
import path from "path";

const issues = [];
const recommendations = [];

// 1. Check for forbidden word "ödev" (MEB Maarif kuralı gereği kesinlikle "tavsiye" kullanılmalı)
function checkOdevForbidden(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && f.name !== "node_modules" && f.name !== ".next") {
      checkOdevForbidden(full);
    } else if (f.isFile() && (f.name.endsWith(".tsx") || f.name.endsWith(".ts"))) {
      const content = fs.readFileSync(full, "utf-8");
      // Match "ödev", "ödevi", "ödevler", "ödevin" ignoring comments or mock var names if any, but checking user facing strings
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        // Look for string literals containing ödev
        const match = line.match(/(['"`>])[^'"`<]*\b(ödev|ödevi|ödevler|ödevleri|ödevin|ödevinizi|ödevlendirme)\b[^'"`<]*(['"`<])/i);
        if (match && !line.includes("//") && !line.includes("MOCK_ODEV") && !line.includes("odev yerine")) {
          issues.push({
            type: "KURAL İHLALİ: 'Ödev' Kelimesi Yasağı",
            file: path.relative(".", full),
            line: idx + 1,
            detail: `MEB Maarif Modelinde 'Ödev' kelimesi yasaktır, yerine 'Tavsiye' kullanılmalıdır. Bulunan satır: "${line.trim()}"`,
          });
        }
      });
    }
  }
}

checkOdevForbidden("src");

// 2. Check Role Switching & Initial State in MaarifHeader and page.tsx
const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");
const headerContent = fs.readFileSync("src/components/maarif/MaarifHeader.tsx", "utf-8");

// 3. Inspect DigitalDefterView for Branch Switching coherence
const defterContent = fs.readFileSync("src/components/maarif/DigitalDefterView.tsx", "utf-8");
if (!defterContent.includes("activeTeacher")) {
  issues.push({
    type: "ÖĞRETMEN DEĞİŞİMİ EKSİKLİĞİ",
    file: "src/components/maarif/DigitalDefterView.tsx",
    detail: "Dijital Sınıf Defteri aktif öğretmene göre branşı otomatik değiştirmeli.",
  });
}

// 4. Check if Class list in Defter matches middle school classes
if (defterContent.includes("9-A") && !defterContent.includes("8-A")) {
  issues.push({
    type: "KADEME UYUMSUZLUĞU",
    file: "src/components/maarif/DigitalDefterView.tsx",
    detail: "Ortaokul kademesi (5, 6, 7, 8) öncelikli olmalı, lise sınıfları yerine 8-A, 7-A, 6-A, 5-A sınıfları gelmelidir.",
  });
}

// 5. Check GunlukOgrenciAsistani integration
const asistanContent = fs.readFileSync("src/components/maarif/GunlukOgrenciAsistani.tsx", "utf-8");
if (asistanContent.includes("ödev")) {
  issues.push({
    type: "ASİSTAN KURAL İHLALİ",
    file: "src/components/maarif/GunlukOgrenciAsistani.tsx",
    detail: "Günlük Öğrenci Asistanı'nda 'ödev' kelimesi geçmemeli.",
  });
}

// 6. Check VeliView integration and child syncing
const veliContent = fs.readFileSync("src/components/maarif/VeliView.tsx", "utf-8");
if (!veliContent.includes("childGrade")) {
  recommendations.push({
    type: "VELİ-ÖĞRENCİ SINIF SENKRONİZASYONU",
    file: "src/components/maarif/VeliView.tsx",
    detail: "Veli ekranında seçilen çocuğun kademesine (5, 6, 7, 8) göre derslerin ve tavsiyelerin dinamik yenilenmesi güçlendirilmeli.",
  });
}

// 7. Check OgrenciView student switcher
const ogrenciContent = fs.readFileSync("src/components/maarif/OgrenciView.tsx", "utf-8");

// 8. Check browser-image-compression integration
const photoContent = fs.readFileSync("src/components/maarif/DigitalDefterView.tsx", "utf-8");
if (!photoContent.includes("browser-image-compression") && !photoContent.includes("imageCompression")) {
  issues.push({
    type: "FOTOĞRAF SIKIŞTIRMA KÜTÜPHANESİ",
    file: "src/components/maarif/DigitalDefterView.tsx",
    detail: "'browser-image-compression' doğrudan kullanılmalıdır.",
  });
}

// 9. Check 8th grade Social Studies MEB rule
const haftalikContent = fs.readFileSync("src/components/maarif/HaftalikTakipEkrani.tsx", "utf-8");
if (!haftalikContent.includes("İnkılap Tarihi")) {
  issues.push({
    type: "MEB 8. SINIF MÜFREDAT KURALI",
    file: "src/components/maarif/HaftalikTakipEkrani.tsx",
    detail: "8. Sınıflarda 'Sosyal Bilgiler' yerine 'T.C. İnkılap Tarihi ve Atatürkçülük' yer almalıdır.",
  });
}

console.log(`\nBulunan Kritik Hatalar / Kural İhlalleri: ${issues.length}`);
issues.forEach((iss, i) => {
  console.log(`\n[HATA ${i + 1}] ${iss.type}`);
  console.log(`Dosya: ${iss.file} ${iss.line ? `(Satır ${iss.line})` : ""}`);
  console.log(`Detay: ${iss.detail}`);
});

console.log(`\nİyileştirme Önerileri / Eksik Noktalar: ${recommendations.length}`);
recommendations.forEach((rec, i) => {
  console.log(`\n[ÖNERİ ${i + 1}] ${rec.type}`);
  console.log(`Dosya: ${rec.file}`);
  console.log(`Detay: ${rec.detail}`);
});
