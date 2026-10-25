import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const targets = [
  { path: "public/hero.png", maxWidth: 1200, maxSize: 250 * 1024 },
  { path: "public/products", maxWidth: 800, maxSize: 120 * 1024, isDir: true },
];

async function compressFile(filePath, maxWidth, maxSize) {
  let quality = 82;
  let buffer;

  for (let attempt = 0; attempt < 6; attempt++) {
    buffer = await sharp(filePath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer();

    if (buffer.length <= maxSize || quality <= 50) break;
    quality -= 6;
  }

  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(buffer).toFile(webpPath);

  const before = statSync(filePath).size;
  const after = statSync(webpPath).size;
  console.log(`${webpPath}: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB (q=${quality})`);
  return webpPath;
}

async function run() {
  for (const target of targets) {
    const fullPath = join(root, target.path);
    if (target.isDir) {
      for (const file of readdirSync(fullPath)) {
        if (/\.(png|jpe?g)$/i.test(file)) {
          await compressFile(join(fullPath, file), target.maxWidth, target.maxSize);
        }
      }
    } else {
      await compressFile(fullPath, target.maxWidth, target.maxSize);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
