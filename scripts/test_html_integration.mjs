async function run() {
  try {
    const res = await fetch("http://localhost:3000");
    const html = await res.text();
    const hasApk = html.includes("maarif-lms-v2026.apk");
    const hasMobilApkBtn = html.includes("Mobil APK");
    const hasManifest = html.includes("manifest.json");

    console.log("Status:", res.status);
    console.log("Has APK link:", hasApk);
    console.log("Has Mobil APK button:", hasMobilApkBtn);
    console.log("Has Manifest link:", hasManifest);

    if (res.status === 200 && hasApk && hasMobilApkBtn && hasManifest) {
      console.log("ALL TESTS PASSED: HTML contains all APK and mobile integration elements!");
    } else {
      console.error("FAIL: Missing elements in HTML");
      process.exit(1);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    process.exit(1);
  }
}
run();
