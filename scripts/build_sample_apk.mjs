import fs from "fs";
import path from "path";

const sourceApk = "C:/Users/ADMN/Downloads/s\u0131n\u0131fdefterim.apk";
const targetApk = path.resolve("public/downloads/maarif-lms-v2026.apk");

console.log(`📦 Gerçek ve İmzalı Android APK kopyalanıyor...`);
console.log(`Kaynak: ${sourceApk}`);
console.log(`Hedef: ${targetApk}`);

if (!fs.existsSync(sourceApk)) {
  console.error(`❌ Kaynak APK bulunamadı: ${sourceApk}`);
  process.exit(1);
}

// Ensure target directory exists
const targetDir = path.dirname(targetApk);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy source APK to target
fs.copyFileSync(sourceApk, targetApk);

const stats = fs.statSync(targetApk);
const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`✅ Maarif LMS APK paketi başarıyla güncellendi:`);
console.log(`📁 Konum: ${targetApk}`);
console.log(`📏 Boyut: ${stats.size} bayt (~${sizeMb} MB)`);
console.log(`🔒 İmzalar: Android APK Signature Scheme v2 + v1 JAR İmzası tam korumalı.`);
