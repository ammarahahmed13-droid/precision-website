import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";

const INPUT = "./originals";
const OUTPUT = "./optimized";

// Logo display heights from CSS (desktop is largest):
// Base: 44px, foodpanda/daraz: 58px, bazaar: 62px, growthmentor: 34px, star-rapid: 32px
// We resize to 2x the max display height for retina
const logos = [
  { file: "logo-delivery-hero-scaled.png", height: 88 },    // 44px * 2
  { file: "logo-growthmentor.png",         height: 68 },    // 34px * 2
  { file: "logo-alibaba-group.png",        height: 88 },    // 44px * 2
  { file: "logo-petal.png",               height: 88 },    // 44px * 2
  { file: "logo-instagopher.png",         height: 88 },    // 44px * 2
  { file: "logo-talabat-scaled.png",      height: 88 },    // 44px * 2
  { file: "logo-bazaar.png",             height: 124 },   // 62px * 2
  { file: "logo-rask-scaled.png",         height: 88 },    // 44px * 2
  { file: "logo-daraz.png",              height: 116 },   // 58px * 2
  { file: "logo-foodpanda.png",           height: 116 },   // 58px * 2
  { file: "logo-weave-social-scaled.png",  height: 88 },    // 44px * 2
  { file: "logo-snapp-express-scaled.png", height: 88 },    // 44px * 2
  { file: "logo-star-rapid-v2.png",       height: 64 },    // 32px * 2
];

async function getSize(filepath) {
  const s = await stat(filepath);
  return s.size;
}

async function processLogo(logo) {
  const input = path.join(INPUT, logo.file);
  const outName = logo.file.replace(/-scaled/g, "").replace(/\.png$/, ".webp");
  const output = path.join(OUTPUT, outName);

  const origSize = await getSize(input);
  const meta = await sharp(input).metadata();

  await sharp(input)
    .resize({ height: logo.height, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(output);

  const newSize = await getSize(output);
  const savings = ((1 - newSize / origSize) * 100).toFixed(1);

  console.log(
    `${logo.file.padEnd(35)} ${meta.width}x${meta.height} -> h:${logo.height} | ` +
    `${(origSize/1024).toFixed(0)} KiB -> ${(newSize/1024).toFixed(1)} KiB (${savings}% smaller) -> ${outName}`
  );

  return { origSize, newSize };
}

async function processHero() {
  const input = path.join(INPUT, "hero-dashboard-v2.png");
  const output = path.join(OUTPUT, "hero-dashboard-v2.webp");

  const origSize = await getSize(input);
  const meta = await sharp(input).metadata();

  // Hero displayed at max 560px wide (1200px+ viewport), 2x = 1120px
  await sharp(input)
    .resize({ width: 1120, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(output);

  const newSize = await getSize(output);
  const savings = ((1 - newSize / origSize) * 100).toFixed(1);

  console.log(
    `hero-dashboard-v2.png              ${meta.width}x${meta.height} -> w:1120 | ` +
    `${(origSize/1024).toFixed(0)} KiB -> ${(newSize/1024).toFixed(1)} KiB (${savings}% smaller)`
  );

  // Also get the new dimensions for width/height attributes
  const newMeta = await sharp(output).metadata();
  console.log(`  -> New dimensions: ${newMeta.width}x${newMeta.height}`);

  return { origSize, newSize };
}

async function processCaseStudy(filename) {
  const input = path.join(INPUT, filename);
  const output = path.join(OUTPUT, filename); // already .webp

  const origSize = await getSize(input);
  const meta = await sharp(input).metadata();

  // Case studies displayed at 426x426, 2x = 852x852
  await sharp(input)
    .resize({ width: 852, height: 852, fit: "cover" })
    .webp({ quality: 82 })
    .toFile(output);

  const newSize = await getSize(output);
  const savings = ((1 - newSize / origSize) * 100).toFixed(1);

  console.log(
    `${filename.padEnd(35)} ${meta.width}x${meta.height} -> 852x852 | ` +
    `${(origSize/1024).toFixed(0)} KiB -> ${(newSize/1024).toFixed(1)} KiB (${savings}% smaller)`
  );

  return { origSize, newSize };
}

// Run all
console.log("=== LOGO OPTIMIZATION ===");
let totalOrig = 0, totalNew = 0;

for (const logo of logos) {
  const { origSize, newSize } = await processLogo(logo);
  totalOrig += origSize;
  totalNew += newSize;
}

console.log("\n=== HERO IMAGE ===");
const hero = await processHero();
totalOrig += hero.origSize;
totalNew += hero.newSize;

console.log("\n=== CASE STUDY IMAGES ===");
for (const cs of ["case-study-value-proposition.webp", "case-study-scaling-revenue.webp"]) {
  const { origSize, newSize } = await processCaseStudy(cs);
  totalOrig += origSize;
  totalNew += newSize;
}

console.log("\n=== TOTAL ===");
console.log(`Original: ${(totalOrig/1024).toFixed(0)} KiB (${(totalOrig/1024/1024).toFixed(1)} MiB)`);
console.log(`Optimized: ${(totalNew/1024).toFixed(0)} KiB (${(totalNew/1024/1024).toFixed(1)} MiB)`);
console.log(`Savings: ${((totalOrig-totalNew)/1024).toFixed(0)} KiB (${((1-totalNew/totalOrig)*100).toFixed(1)}%)`);
