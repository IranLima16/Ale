#!/usr/bin/env node
/**
 * Gera imagens placeholder (PNG) 100% originais para o catálogo de demonstração.
 * Nenhum arquivo de terceiros é baixado — tudo é desenhado localmente com SVG
 * e depois convertido para PNG com o "sharp".
 *
 * Uso:
 *   node scripts/generate-placeholders.mjs
 *       Gera (ou regenera) todas as imagens de demonstração do projeto.
 *
 *   node scripts/generate-placeholders.mjs --single "PSG Home 25/26" public/products/psg/home-25-26-1.png 800x1000
 *       Gera uma única imagem placeholder no caminho informado.
 *       Use este modo quando adicionar um produto/time novo e ainda não tiver a foto real.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function svgTemplate({ width, height, label, sublabel }) {
  const titleSize = Math.max(18, Math.round(width / 11));
  const subtitleSize = Math.max(12, Math.round(width / 26));
  const titleY = sublabel ? height / 2 - titleSize * 0.35 : height / 2;
  const subtitleY = titleY + titleSize * 0.85;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <path d="M0 ${height * 0.18} L${width} 0 L${width} ${height * 0.06} L0 ${height * 0.3} Z" fill="rgba(255,255,255,0.05)"/>
  <path d="M0 ${height} L${width} ${height * 0.68} L${width} ${height * 0.84} L0 ${height} Z" fill="rgba(16,185,129,0.14)"/>
  <rect x="0" y="${height - 6}" width="${width}" height="6" fill="#10b981"/>
  <text x="50%" y="${titleY}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="700" fill="#ffffff">${escapeXml(label)}</text>
  ${
    sublabel
      ? `<text x="50%" y="${subtitleY}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="${subtitleSize}" font-weight="500" fill="#94a3b8">${escapeXml(sublabel)}</text>`
      : ""
  }
  <text x="16" y="${height - 16}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="rgba(255,255,255,0.4)">Imagem demonstrativa</text>
</svg>`;
}

async function makePlaceholder({ label, sublabel = "", width, height, outPath }) {
  const svg = svgTemplate({ width, height, label, sublabel });
  const fullPath = path.isAbsolute(outPath) ? outPath : path.join(rootDir, outPath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(fullPath);
  console.log("OK", path.relative(rootDir, fullPath));
}

async function makeBrandTile({ label, width, height, outPath }) {
  const size = Math.round(width * 0.42);
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" rx="${Math.round(width * 0.2)}" fill="#0f172a"/>
  <rect width="${width}" height="${height}" rx="${Math.round(width * 0.2)}" fill="none" stroke="#10b981" stroke-width="${Math.max(2, Math.round(width * 0.02))}"/>
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="800" fill="#ffffff">${escapeXml(label)}</text>
</svg>`;
  const fullPath = path.isAbsolute(outPath) ? outPath : path.join(rootDir, outPath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(fullPath);
  console.log("OK", path.relative(rootDir, fullPath));
}

const COUNTRY_TILES = [
  ["BRA", "brasil"],
  ["FRA", "franca"],
  ["ENG", "inglaterra"],
  ["ESP", "espanha"],
  ["ITA", "italia"],
  ["GER", "alemanha"],
  ["ARG", "argentina"],
  ["SEL", "selecoes"],
  ["OUT", "outros"],
];

const TEAM_TILES = [
  ["PSG", "psg", "Paris Saint-Germain"],
  ["OM", "marseille", "Olympique de Marseille"],
  ["BAR", "barcelona", "Barcelona"],
  ["RMA", "real-madrid", "Real Madrid"],
  ["MCI", "manchester-city", "Manchester City"],
  ["LIV", "liverpool", "Liverpool"],
  ["ARS", "arsenal", "Arsenal"],
];

const PRODUCT_IMAGES = [
  ["PSG Home 25/26", "2025/26", "products/psg/home-25-26-1.png"],
  ["PSG Home 25/26", "verso", "products/psg/home-25-26-2.png"],
  ["PSG Home 25/26", "detalhe", "products/psg/home-25-26-3.png"],
  ["PSG Away 25/26", "2025/26", "products/psg/away-25-26-1.png"],
  ["PSG Retrô 1994", "1994", "products/psg/retro-1994-1.png"],

  ["Marseille Home 25/26", "2025/26", "products/marseille/home-25-26-1.png"],
  ["Marseille Away 25/26", "2025/26", "products/marseille/away-25-26-1.png"],
  ["Marseille Third 25/26", "2025/26", "products/marseille/third-25-26-1.png"],

  ["Barcelona Home 25/26", "2025/26", "products/barcelona/home-25-26-1.png"],
  ["Barcelona Home 25/26", "verso", "products/barcelona/home-25-26-2.png"],
  ["Barcelona Away 25/26", "2025/26", "products/barcelona/away-25-26-1.png"],
  ["Barcelona Retrô 1992", "1992", "products/barcelona/retro-1992-1.png"],

  ["Real Madrid Home 25/26", "2025/26", "products/real-madrid/home-25-26-1.png"],
  ["Real Madrid Away 25/26", "2025/26", "products/real-madrid/away-25-26-1.png"],
  ["Real Madrid Infantil Home", "2025/26", "products/real-madrid/infantil-home-25-26-1.png"],

  ["Man City Home 25/26", "2025/26", "products/manchester-city/home-25-26-1.png"],
  ["Man City Away 25/26", "2025/26", "products/manchester-city/away-25-26-1.png"],
  ["Man City Jogador Home", "2025/26", "products/manchester-city/jogador-home-25-26-1.png"],

  ["Liverpool Home 25/26", "2025/26", "products/liverpool/home-25-26-1.png"],
  ["Liverpool Away 25/26", "2025/26", "products/liverpool/away-25-26-1.png"],
  ["Liverpool Retrô 2005", "2005", "products/liverpool/retro-2005-1.png"],

  ["Arsenal Home 25/26", "2025/26", "products/arsenal/home-25-26-1.png"],
  ["Arsenal Away 25/26", "2025/26", "products/arsenal/away-25-26-1.png"],
  ["Arsenal Feminina Home", "2025/26", "products/arsenal/feminina-home-25-26-1.png"],
];

async function generateAll() {
  await Promise.all(
    COUNTRY_TILES.map(([code, slug]) =>
      makePlaceholder({
        label: code,
        width: 400,
        height: 267,
        outPath: path.join(publicDir, "countries", `${slug}.png`),
      })
    )
  );

  await Promise.all(
    TEAM_TILES.map(([code, slug]) =>
      makeBrandTile({
        label: code,
        width: 512,
        height: 512,
        outPath: path.join(publicDir, "teams", `${slug}.png`),
      })
    )
  );

  await Promise.all(
    PRODUCT_IMAGES.map(([label, sublabel, relPath]) =>
      makePlaceholder({
        label,
        sublabel,
        width: 800,
        height: 1000,
        outPath: path.join(publicDir, relPath),
      })
    )
  );

  await makePlaceholder({
    label: "Camisas do Mundo",
    sublabel: "Catálogo de camisas de futebol",
    width: 1200,
    height: 630,
    outPath: path.join(publicDir, "og-cover.png"),
  });

  await makeBrandTile({ label: "CM", width: 32, height: 32, outPath: path.join(publicDir, "favicon-32.png") });
  await makeBrandTile({ label: "CM", width: 180, height: 180, outPath: path.join(publicDir, "apple-touch-icon.png") });

  console.log("\nTodas as imagens de demonstração foram geradas em /public.");
}

async function generateSingle(args) {
  const [, label, outPath, size = "800x1000"] = args;
  const [width, height] = size.split("x").map(Number);
  if (!label || !outPath || !width || !height) {
    console.error(
      'Uso: node scripts/generate-placeholders.mjs --single "Texto" caminho/saida.png LARGURAxALTURA'
    );
    process.exit(1);
  }
  await makePlaceholder({ label, width, height, outPath });
}

const args = process.argv.slice(2);
if (args[0] === "--single") {
  await generateSingle(args);
} else {
  await generateAll();
}
