import fs from "fs";
import path from "path";
import zlib from "zlib";

const IGNORED = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "tsbuildinfo",
]);

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    if (item.isDirectory()) {
      if (!IGNORED.has(item.name)) {
        results = results.concat(getAllFiles(fullPath, baseDir));
      }
    } else {
      if (!item.name.endsWith(".tsbuildinfo") && !item.name.endsWith(".zip")) {
        results.push({ fullPath, relPath });
      }
    }
  }
  return results;
}

// Simple zip creator
function createZip(files) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  for (const f of files) {
    const nameBuf = Buffer.from(f.relPath, "utf-8");
    const dataBuf = fs.readFileSync(f.fullPath);

    let crc = 0 ^ -1;
    for (let i = 0; i < dataBuf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ dataBuf[i]) & 0xff];
    }
    crc = (crc ^ -1) >>> 0;

    const compressed = zlib.deflateRawSync(dataBuf);
    const uSize = dataBuf.length;
    const cSize = compressed.length;

    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(8, 8);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(cSize, 18);
    lh.writeUInt32LE(uSize, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    nameBuf.copy(lh, 30);

    localHeaders.push(lh, compressed);

    const ch = Buffer.alloc(46 + nameBuf.length);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(8, 10);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(cSize, 20);
    ch.writeUInt32LE(uSize, 24);
    ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt32LE(offset, 42);
    nameBuf.copy(ch, 46);

    centralHeaders.push(ch);
    offset += lh.length + compressed.length;
  }

  const cdSize = centralHeaders.reduce((acc, h) => acc + h.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cdSize, 12);
  eocd.writeUInt32LE(offset, 16);

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

const root = path.resolve(".");
const files = getAllFiles(root);
const zipBuf = createZip(files);
fs.writeFileSync("meb-maarif-lms-kaynak-kodlari.zip", zipBuf);
console.log(`Created zip package: meb-maarif-lms-kaynak-kodlari.zip (${(zipBuf.length / (1024 * 1024)).toFixed(2)} MB, ${files.length} files)`);
