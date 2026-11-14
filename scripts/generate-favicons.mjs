import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const source = join(root, "public/rootfood-icon-src.png");

/** Bounding box of the green logo strokes, ignoring the cream paper background. */
async function logoBounds() {
  const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 3;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (g - r > 30 && g - b > 30) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Logo as green-on-transparent, so it can sit on any tile colour. */
async function logoLayer(bounds) {
  const { data, info } = await sharp(source)
    .extract(bounds)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0; p < info.width * info.height; p++) {
    const [r, g, b] = [data[p * 3], data[p * 3 + 1], data[p * 3 + 2]];
    const greenness = Math.max(0, Math.min(255, ((g - r + (g - b)) / 2 - 8) * 10));
    out.set([0x2d, 0x6a, 0x30, greenness], p * 4);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function tile(logo, size, { radius = 0.22, padding = 0.12 } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const resized = await sharp(logo)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  const r = Math.round(size * radius);
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#ffffff"/></svg>`
  );
  return sharp(bg).composite([{ input: resized, gravity: "center" }]).png().toBuffer();
}

async function generate() {
  const logo = await logoLayer(await logoBounds());

  const targets = [
    { file: "app/icon.png", size: 512 },
    { file: "public/icon-512.png", size: 512 },
    { file: "public/icon-192.png", size: 192 },
    { file: "public/favicon-48x48.png", size: 48, padding: 0.08 },
    { file: "public/favicon-32x32.png", size: 32, padding: 0.04 },
    { file: "public/favicon-16x16.png", size: 16, padding: 0.02 },
    { file: "public/apple-touch-icon.png", size: 180, radius: 0 },
  ];

  for (const { file, size, ...opts } of targets) {
    const out = join(root, file);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, await tile(logo, size, opts));
    console.log(`Created ${file}`);
  }

  // Browsers accept a PNG payload in favicon.ico
  writeFileSync(join(root, "app/favicon.ico"), await tile(logo, 48, { padding: 0.04 }));
  console.log("Created app/favicon.ico");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
