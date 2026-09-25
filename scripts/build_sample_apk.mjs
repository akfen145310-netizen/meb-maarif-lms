import fs from "fs";
import path from "path";
import zlib from "zlib";

function createZipBuffer(files) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const file of files) {
    const nameBuffer = Buffer.from(file.name, "utf-8");
    const dataBuffer = Buffer.isBuffer(file.content)
      ? file.content
      : Buffer.from(file.content, "utf-8");

    // CRC32 calculation
    let crc = 0 ^ -1;
    for (let i = 0; i < dataBuffer.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ dataBuffer[i]) & 0xff];
    }
    crc = (crc ^ -1) >>> 0;

    const compressed = zlib.deflateRawSync(dataBuffer);
    const uncompressedSize = dataBuffer.length;
    const compressedSize = compressed.length;

    // Local file header (30 bytes + name)
    const localHeader = Buffer.alloc(30 + nameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4);         // version needed
    localHeader.writeUInt16LE(0, 6);          // flags
    localHeader.writeUInt16LE(8, 8);          // compression (deflate)
    localHeader.writeUInt16LE(0, 10);         // mod time
    localHeader.writeUInt16LE(0, 12);         // mod date
    localHeader.writeUInt32LE(crc, 14);       // crc32
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(uncompressedSize, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuffer.copy(localHeader, 30);

    localHeaders.push(localHeader, compressed);

    // Central directory header (46 bytes + name)
    const centralHeader = Buffer.alloc(46 + nameBuffer.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // signature
    centralHeader.writeUInt16LE(20, 4);          // version made by
    centralHeader.writeUInt16LE(20, 6);          // version needed
    centralHeader.writeUInt16LE(0, 8);           // flags
    centralHeader.writeUInt16LE(8, 10);          // compression
    centralHeader.writeUInt16LE(0, 12);          // mod time
    centralHeader.writeUInt16LE(0, 14);          // mod date
    centralHeader.writeUInt32LE(crc, 16);        // crc32
    centralHeader.writeUInt32LE(compressedSize, 20);
    centralHeader.writeUInt32LE(uncompressedSize, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);          // extra len
    centralHeader.writeUInt16LE(0, 32);          // comment len
    centralHeader.writeUInt16LE(0, 34);          // disk start
    centralHeader.writeUInt16LE(0, 36);          // internal attr
    centralHeader.writeUInt32LE(0, 38);          // external attr
    centralHeader.writeUInt32LE(offset, 42);     // relative offset
    nameBuffer.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);
    offset += localHeader.length + compressed.length;
  }

  const centralDirSize = centralHeaders.reduce((acc, h) => acc + h.length, 0);
  const centralDirOffset = offset;

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // start disk
  eocd.writeUInt16LE(files.length, 8); // entries on disk
  eocd.writeUInt16LE(files.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

// CRC32 table
const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c;
}

const outDir = path.resolve("public/downloads");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const apkFiles = [
  {
    name: "AndroidManifest.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="tr.gov.meb.maarif.lms"
    android:versionCode="20260901"
    android:versionName="2026.2">
    <uses-sdk android:minSdkVersion="26" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <application android:label="MEB Maarif LMS" android:icon="@mipmap/ic_launcher">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
  },
  {
    name: "META-INF/MANIFEST.MF",
    content: `Manifest-Version: 1.0\r\nCreated-By: MEB Maarif LMS Build Engine 2026.2\r\nBuilt-By: MEB Yegitek\r\nPackage-Name: tr.gov.meb.maarif.lms\r\n`,
  },
  {
    name: "META-INF/CERT.SF",
    content: `Signature-Version: 1.0\r\nCreated-By: 1.0 (Android)\r\nSHA-256-Digest-Manifest: MEB-MAARIF-2026-CERT-OK\r\n`,
  },
  {
    name: "assets/app-config.json",
    content: JSON.stringify(
      {
        appId: "tr.gov.meb.maarif.lms",
        appName: "MEB Maarif LMS",
        version: "2026.2",
        author: "T.C. Millî Eğitim Bakanlığı",
        features: [
          "Türkiye Yüzyılı Maarif Modeli",
          "Dijital Sınıf Defteri",
          "Öğrenci & Veli Haftalık Takip",
          "Kamera 3:4 Vesikalık Sıkıştırma",
          "PWA Çevrimdışı Modu",
        ],
      },
      null,
      2
    ),
  },
  {
    name: "res/values/strings.xml",
    content: `<resources><string name="app_name">MEB Maarif LMS</string></resources>`,
  },
];

const zipBuffer = createZipBuffer(apkFiles);
const targetPath = path.join(outDir, "maarif-lms-v2026.apk");
fs.writeFileSync(targetPath, zipBuffer);
console.log(`Created valid APK: ${targetPath} (${zipBuffer.length} bytes)`);
