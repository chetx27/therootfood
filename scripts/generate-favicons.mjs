import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
/** Same file the navbar shows beside the TheRootFood wordmark. */
const source = join(root, "public/rootfood-mark.webp");

async function tile(size, padding = 0.1) {
  const inner = Math.round(size * (1 - padding * 2));
  const mark = await sharp(source)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
}

async function generate() {
  const targets = [
    { file: "app/icon.png", size: 512 },
    { file: "public/icon-512.png", size: 512 },
    { file: "public/icon-192.png", size: 192 },
    { file: "public/favicon-48x48.png", size: 48, padding: 0.06 },
    { file: "public/favicon-32x32.png", size: 32, padding: 0.04 },
    { file: "public/favicon-16x16.png", size: 16, padding: 0.02 },
    { file: "public/apple-touch-icon.png", size: 180, padding: 0.12 },
  ];

  for (const { file, size, padding } of targets) {
    const out = join(root, file);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, await tile(size, padding));
    console.log(`Created ${file}`);
  }

  writeFileSync(join(root, "app/favicon.ico"), await tile(48, 0.06));
  console.log("Created app/favicon.ico");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
