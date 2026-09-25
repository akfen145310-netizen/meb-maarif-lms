import fs from "fs";
import path from "path";

// Read .env.local if present
function loadEnv() {
  const envPath = path.resolve(".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

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

export async function uploadToGitHub({
  token = process.env.GITHUB_TOKEN,
  repoName = process.env.GITHUB_REPO || "meb-maarif-lms",
  commitMessage = "fix(apk): Tam 14.2 MB Android APK paketi ve indirme düzeltmesi",
  isPrivate = false,
  description = "MEB Maarif LMS - Türkiye Yüzyılı Maarif Modeli Dijital Sınıf Defteri & Portal",
} = {}) {
  if (!token) {
    throw new Error("GitHub token bulunamadı! Lütfen GITHUB_TOKEN çevre değişkenini veya parametresini sağlayın.");
  }

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

  console.log(`📦 '${repoName}' deposu kontrol ediliyor...`);
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
    await new Promise((r) => setTimeout(r, 2000));
  } else if (repoRes.ok) {
    console.log(`ℹ️ '${repoName}' deposu mevcut. Değişiklikler senkronize ediliyor.`);
  }

  // Get current main commit SHA to link as parent
  let parentCommitSha = null;
  const currentRefRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/main`, { headers });
  if (currentRefRes.ok) {
    const currentRefData = await currentRefRes.json();
    parentCommitSha = currentRefData.object.sha;
    console.log(`🔗 Mevcut ana commit: ${parentCommitSha.slice(0, 7)}`);
  }

  const projectRoot = path.resolve(".");
  const files = getAllFiles(projectRoot);
  console.log(`📂 Toplam ${files.length} dosya taranıyor ve GitHub Blobları hazırlanıyor...`);

  const treeItems = [];
  let count = 0;
  for (const f of files) {
    const content = fs.readFileSync(f.fullPath);
    const sizeMb = (content.length / (1024 * 1024)).toFixed(2);
    if (content.length > 5 * 1024 * 1024) {
      console.log(`\n📦 Büyük dosya yükleniyor: ${f.relPath} (${sizeMb} MB)...`);
    }

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
      console.warn(`⚠️ Dosya blob yüklenemedi: ${f.relPath} (${blobRes.status} ${await blobRes.text()})`);
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
  console.log(`\n✅ ${treeItems.length} dosya blob'u GitHub'a aktarıldı.`);

  console.log("🌳 Git Ağacı (Tree) oluşturuluyor...");
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees`, {
    method: "POST",
    headers,
    body: JSON.stringify({ tree: treeItems }),
  });
  if (!treeRes.ok) throw new Error(`Git tree oluşturulamadı: ${await treeRes.text()}`);
  const treeData = await treeRes.json();

  console.log("📌 Git Commit oluşturuluyor...");
  const commitBody = {
    message: commitMessage,
    tree: treeData.sha,
  };
  if (parentCommitSha) {
    commitBody.parents = [parentCommitSha];
  }

  const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/commits`, {
    method: "POST",
    headers,
    body: JSON.stringify(commitBody),
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
  console.log(`\n🎉 TEBRİKLER! Tüm değişiklikler GitHub'a başarıyla aktarıldı: ${repoUrl}`);
  console.log(`📌 Commit SHA: ${commitData.sha}`);
  return { owner, repoName, repoUrl, commitSha: commitData.sha };
}

// CLI direct run
if (process.argv[1] && process.argv[1].endsWith("github_uploader.mjs")) {
  const token = process.argv[2] || process.env.GITHUB_TOKEN;
  const repoName = process.argv[3] || process.env.GITHUB_REPO || "meb-maarif-lms";
  const msg = process.argv[4] || "fix(apk): Tam 14.2 MB Android APK paketi ve indirme düzeltmesi";

  uploadToGitHub({ token, repoName, commitMessage: msg })
    .then((res) => {
      console.log("TAMAMLANDI:", res.repoUrl);
      process.exit(0);
    })
    .catch((err) => {
      console.error("HATA:", err.message);
      process.exit(1);
    });
}
