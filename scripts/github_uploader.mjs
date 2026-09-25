import fs from "fs";
import path from "path";

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "tsbuildinfo",
]);

const IGNORED_FILES = new Set([
  ".env.local",
  "tsconfig.tsbuildinfo",
]);

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    if (item.isDirectory()) {
      if (!IGNORED_DIRS.has(item.name)) {
        results = results.concat(getAllFiles(fullPath, baseDir));
      }
    } else {
      if (!IGNORED_FILES.has(item.name) && !item.name.endsWith(".tsbuildinfo")) {
        results.push({ fullPath, relPath });
      }
    }
  }
  return results;
}

export async function uploadToGitHub({ token, repoName, isPrivate = false, description = "MEB Maarif LMS - Türkiye Yüzyılı Maarif Modeli Dijital Sınıf Defteri & Portal" }) {
  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "MaarifLMS-Uploader",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  console.log("🔍 GitHub kullanıcısı doğrulanıyor...");
  const userRes = await fetch("https://api.github.com/user", { headers });
  if (!userRes.ok) {
    const err = await userRes.text();
    throw new Error(`GitHub token geçersiz veya yetkisiz (${userRes.status}): ${err}`);
  }
  const user = await userRes.json();
  const owner = user.login;
  console.log(`✅ Doğrulandı: @${owner} (${user.name || owner})`);

  console.log(`📦 '${repoName}' deposu kontrol ediliyor / oluşturuluyor...`);
  let repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers });
  if (repoRes.status === 404) {
    const createRes = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: repoName,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });
    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Depo oluşturulamadı: ${err}`);
    }
    console.log(`✅ Depo başarıyla oluşturuldu: https://github.com/${owner}/${repoName}`);
    // Wait 2s for GitHub to initialize
    await new Promise((r) => setTimeout(r, 2000));
  } else if (repoRes.ok) {
    console.log(`ℹ️ '${repoName}' deposu zaten mevcut, mevcut depoya yükleme yapılacak.`);
  }

  const projectRoot = path.resolve(".");
  const files = getAllFiles(projectRoot);
  console.log(`📂 Toplam ${files.length} proje dosyası taranıyor ve GitHub Blobları hazırlanıyor...`);

  const treeItems = [];
  let count = 0;
  for (const f of files) {
    const content = fs.readFileSync(f.fullPath);
    const base64 = content.toString("base64");

    const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        content: base64,
        encoding: "base64",
      }),
    });

    if (!blobRes.ok) {
      console.warn(`⚠️ Dosya blob yüklenemedi: ${f.relPath}`);
      continue;
    }

    const blobData = await blobRes.json();
    treeItems.push({
      path: f.relPath,
      mode: "100644",
      type: "blob",
      sha: blobData.sha,
    });
    count++;
    if (count % 15 === 0 || count === files.length) {
      process.stdout.write(`⏳ İlerleme: ${count}/${files.length} dosya yüklendi...\r`);
    }
  }
  console.log(`\n✅ ${treeItems.length} dosya blob'u GitHub'a başarıyla aktarıldı.`);

  console.log("🌳 Git Ağacı (Tree) oluşturuluyor...");
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees`, {
    method: "POST",
    headers,
    body: JSON.stringify({ tree: treeItems }),
  });
  if (!treeRes.ok) throw new Error(`Git tree oluşturulamadı: ${await treeRes.text()}`);
  const treeData = await treeRes.json();

  console.log("📌 Git Commit oluşturuluyor...");
  const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/commits`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message: "feat: MEB Maarif LMS v2026.2 - Vercel & APK Mobil Hazır İlk Sürüm",
      tree: treeData.sha,
    }),
  });
  if (!commitRes.ok) throw new Error(`Git commit oluşturulamadı: ${await commitRes.text()}`);
  const commitData = await commitRes.json();

  console.log("🚀 'main' dalı (branch) güncelleniyor...");
  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/main`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      sha: commitData.sha,
      force: true,
    }),
  });

  if (!refRes.ok) {
    // If ref doesn't exist, create it
    const createRefRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/refs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ref: "refs/heads/main",
        sha: commitData.sha,
      }),
    });
    if (!createRefRes.ok) throw new Error(`Branch güncellenemedi: ${await createRefRes.text()}`);
  }

  const repoUrl = `https://github.com/${owner}/${repoName}`;
  console.log(`\n🎉 TEBRİKLER! Proje GitHub'a başarıyla yüklendi: ${repoUrl}`);
  return { owner, repoName, repoUrl };
}

// CLI direct run
if (process.argv[1] && process.argv[1].endsWith("github_uploader.mjs") && process.argv[2]) {
  const token = process.argv[2];
  const repoName = process.argv[3] || "meb-maarif-lms";
  uploadToGitHub({ token, repoName })
    .then((res) => {
      console.log("TAMAMLANDI:", res);
      process.exit(0);
    })
    .catch((err) => {
      console.error("HATA:", err.message);
      process.exit(1);
    });
}
