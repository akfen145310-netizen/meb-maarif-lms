async function test() {
  try {
    const res = await fetch("http://localhost:3000/downloads/maarif-lms-v2026.apk");
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));
    const arrayBuffer = await res.arrayBuffer();
    console.log("Received byte length:", arrayBuffer.byteLength);
    if (res.status === 200 && arrayBuffer.byteLength > 0) {
      console.log("SUCCESS: APK file is successfully served and downloadable!");
    } else {
      console.error("FAIL: APK download response invalid.");
    }
  } catch (err) {
    console.error("Error fetching APK:", err);
  }
}
test();
