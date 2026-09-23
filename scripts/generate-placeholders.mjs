#!/usr/bin/env node
/**
 * Gera imagens placeholder (PNG) 100% originais para o catálogo de demonstração.
 * Nenhum arquivo de terceiros é baixado e nenhum escudo/logo oficial é
 * reproduzido — os times são representados por uma ilustração genérica de
 * camisa (nas cores tradicionais do clube) e por um selo com as iniciais,
 * ambos desenhados localmente com SVG e convertidos para PNG com o "sharp".
 *
 * Uso:
 *   node scripts/generate-placeholders.mjs
 *       Gera (ou regenera) todas as imagens de demonstração do projeto.
 *
 *   node scripts/generate-placeholders.mjs --single "PSG Home 25/26" public/products/psg/home-25-26-1.png 800x1000
 *       Gera uma única imagem placeholder (tile de texto) no caminho informado.
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

function isLight(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 200;
}

async function writePng(svg, outPath) {
  const fullPath = path.isAbsolute(outPath) ? outPath : path.join(rootDir, outPath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(fullPath);
  console.log("OK", path.relative(rootDir, fullPath));
}

// ---------------------------------------------------------------------------
// Tile de texto simples — usado para países, favicon e imagem de compartilhamento.
// ---------------------------------------------------------------------------
function textTileSvg({ width, height, label, sublabel }) {
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

async function makeTextTile({ label, sublabel = "", width, height, outPath }) {
  await writePng(textTileSvg({ width, height, label, sublabel }), outPath);
}

// ---------------------------------------------------------------------------
// Selo (badge) genérico de time — nunca reproduz um escudo oficial, só um
// monograma com as cores do clube.
// ---------------------------------------------------------------------------
async function makeTeamBadge({ initials, primary, secondary, width, height, outPath }) {
  const textColor = isLight(primary) ? "#0f172a" : "#ffffff";
  const fontSize = Math.round(width * 0.34);
  const r = Math.round(width * 0.5 - width * 0.06);
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${width / 2}" cy="${height / 2}" r="${r}" fill="${primary}" stroke="${secondary}" stroke-width="${Math.max(3, Math.round(width * 0.045))}"/>
  <circle cx="${width / 2}" cy="${height / 2}" r="${r - width * 0.05}" fill="none" stroke="${secondary}" stroke-width="1" opacity="0.4"/>
  <text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="${textColor}">${escapeXml(initials)}</text>
</svg>`;
  await writePng(svg, outPath);
}

// ---------------------------------------------------------------------------
// "Foto de produto" — ilustração genérica de camisa de futebol (silhueta
// própria, sem molde de nenhuma marca) sobre um fundo neutro de estúdio.
// ---------------------------------------------------------------------------
const JERSEY_PATH =
  "M70,20 L120,20 Q150,42 180,20 L230,20 L285,55 L250,105 L205,78 L205,300 L95,300 L95,78 L50,105 L15,55 Z";

function jerseyGroup({ primary, secondary, stripe, flip }) {
  const collar = `<path d="M120,20 Q150,42 180,20" fill="none" stroke="${secondary}" stroke-width="10" stroke-linecap="round"/>`;
  const cuffLeft = `<line x1="20" y1="58" x2="46" y2="100" stroke="${secondary}" stroke-width="10" stroke-linecap="round"/>`;
  const cuffRight = `<line x1="280" y1="58" x2="254" y2="100" stroke="${secondary}" stroke-width="10" stroke-linecap="round"/>`;
  const chestStripe = stripe ? `<rect x="95" y="150" width="110" height="26" fill="${secondary}" opacity="0.92"/>` : "";
  const backNumber = flip
    ? `<text x="150" y="230" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="110" font-weight="800" fill="${secondary}" opacity="0.9">9</text>`
    : "";

  return `
  <g transform="${flip ? "translate(300,0) scale(-1,1)" : ""}">
    <path d="${JERSEY_PATH}" fill="${primary}" stroke="rgba(255,255,255,0.16)" stroke-width="3"/>
    ${chestStripe}
    ${collar}
    ${cuffLeft}
    ${cuffRight}
  </g>
  ${backNumber}`;
}

async function makeProductPhoto({ primary, secondary, stripe = false, angle = "front", width, height, caption, outPath }) {
  const jw = 300;
  const zoom = angle === "detail" ? 0.85 : 0.62;
  const scale = (width * zoom) / jw;
  const tx = (width - jw * scale) / 2;
  const ty = angle === "detail" ? height * 0.05 : height * 0.1;

  // Estúdio escuro (spotlight) — inspirado em fotografia de lançamento de
  // camisas de marcas esportivas premium, para casar com o tema dark do site.
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="spotlight" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="#1b2333"/>
      <stop offset="55%" stop-color="#0f1420"/>
      <stop offset="100%" stop-color="#05070c"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${secondary}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${secondary}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#spotlight)"/>
  <ellipse cx="${width / 2}" cy="${height * 0.52}" rx="${width * 0.55}" ry="${height * 0.32}" fill="url(#glow)"/>
  <ellipse cx="${width / 2}" cy="${height * 0.86}" rx="${width * 0.26}" ry="${height * 0.026}" fill="rgba(0,0,0,0.55)"/>
  <g transform="translate(${tx}, ${ty}) scale(${scale})">
    ${jerseyGroup({ primary, secondary, stripe, flip: angle === "back" })}
  </g>
  <text x="16" y="${height - 16}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="rgba(255,255,255,0.32)">${escapeXml(caption)}</text>
</svg>`;
  await writePng(svg, outPath);
}

// ---------------------------------------------------------------------------
// Dados de demonstração: cores tradicionais (domínio público) de cada clube,
// usadas só para diferenciar as camisas visualmente — nenhum escudo, brasão
// ou logotipo é desenhado.
// ---------------------------------------------------------------------------
const TEAM_COLORS = {
  "selecao-franca": { primary: "#1c3f94", secondary: "#ed2939" },
  psg: { primary: "#0a1e42", secondary: "#e0132a" },
  marseille: { primary: "#2fa8e0", secondary: "#0c3b6e" },
  lyon: { primary: "#ffffff", secondary: "#0b3d91" },
  barcelona: { primary: "#a1053e", secondary: "#0a4694" },
  "real-madrid": { primary: "#ffffff", secondary: "#f2b90c" },
  "manchester-city": { primary: "#6cabdd", secondary: "#132257" },
  liverpool: { primary: "#c8102e", secondary: "#00a398" },
  arsenal: { primary: "#ef0107", secondary: "#063672" },
};

function variantColors(base, kind) {
  const { primary, secondary } = base;
  if (kind === "away") {
    return isLight(primary) ? { primary: secondary, secondary: primary, stripe: false } : { primary: "#f5f5f4", secondary: primary, stripe: false };
  }
  if (kind === "third") {
    return { primary: "#111827", secondary, stripe: false };
  }
  if (kind === "fourth") {
    return { primary: "#e5e7eb", secondary, stripe: true };
  }
  if (kind === "training") {
    return { primary: "#6b7280", secondary, stripe: false };
  }
  if (kind === "retro") {
    return { primary: secondary, secondary: primary, stripe: true };
  }
  return { primary, secondary, stripe: false };
}

function detectKind(relPath) {
  if (relPath.includes("away")) return "away";
  if (relPath.includes("fourth")) return "fourth";
  if (relPath.includes("third")) return "third";
  if (relPath.includes("retro")) return "retro";
  if (relPath.includes("treino") || relPath.includes("kit-") || relPath.includes("shorts") || relPath.includes("pre-jogo")) return "training";
  return "home";
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

const TEAM_BADGES = [
  ["FRA", "selecao-franca"],
  ["PSG", "psg"],
  ["OM", "marseille"],
  ["OL", "lyon"],
  ["BAR", "barcelona"],
  ["RMA", "real-madrid"],
  ["MCI", "manchester-city"],
  ["LIV", "liverpool"],
  ["ARS", "arsenal"],
];

// [time, temporada/rótulo, caminho, ângulo]
const PRODUCT_IMAGES = [
  ["selecao-franca", "2025/26", "products/selecao-franca/home-25-26-1.png", "front"],
  ["selecao-franca", "2026/27", "products/selecao-franca/home-26-27-1.png", "front"],
  ["selecao-franca", "2026/27", "products/selecao-franca/away-26-27-1.png", "front"],
  ["selecao-franca", "treino", "products/selecao-franca/kit-treino-1.png", "front"],
  ["selecao-franca", "treino", "products/selecao-franca/kit-treino-alt-1.png", "front"],

  ["psg", "2025/26", "products/psg/home-25-26-1.png", "front"],
  ["psg", "verso", "products/psg/home-25-26-2.png", "back"],
  ["psg", "detalhe", "products/psg/home-25-26-3.png", "detail"],
  ["psg", "2025/26", "products/psg/away-25-26-1.png", "front"],
  ["psg", "1994", "products/psg/retro-1994-1.png", "front"],
  ["psg", "2025/26", "products/psg/third-25-26-1.png", "front"],
  ["psg", "2025/26", "products/psg/fourth-25-26-1.png", "front"],
  ["psg", "pré-jogo", "products/psg/pre-jogo-25-26-1.png", "front"],
  ["psg", "2026/27", "products/psg/home-26-27-1.png", "front"],
  ["psg", "2026/27", "products/psg/away-26-27-1.png", "front"],
  ["psg", "2026/27", "products/psg/third-26-27-1.png", "front"],
  ["psg", "jogador", "products/psg/jogador-home-25-26-1.png", "front"],
  ["psg", "infantil", "products/psg/infantil-home-25-26-1.png", "front"],
  ["psg", "treino", "products/psg/kit-treino-1.png", "front"],
  ["psg", "treino", "products/psg/kit-treino-away-1.png", "front"],
  ["psg", "2010", "products/psg/retro-2010-1.png", "front"],
  ["psg", "feminina", "products/psg/feminina-home-25-26-1.png", "front"],
  ["psg", "shorts", "products/psg/shorts-treino-1.png", "front"],

  ["marseille", "2025/26", "products/marseille/home-25-26-1.png", "front"],
  ["marseille", "2025/26", "products/marseille/away-25-26-1.png", "front"],
  ["marseille", "2025/26", "products/marseille/third-25-26-1.png", "front"],
  ["marseille", "treino", "products/marseille/kit-treino-1.png", "front"],
  ["marseille", "jogador", "products/marseille/jogador-home-25-26-1.png", "front"],

  ["lyon", "pré-jogo", "products/lyon/pre-jogo-25-26-1.png", "front"],

  ["barcelona", "2025/26", "products/barcelona/home-25-26-1.png", "front"],
  ["barcelona", "verso", "products/barcelona/home-25-26-2.png", "back"],
  ["barcelona", "2025/26", "products/barcelona/away-25-26-1.png", "front"],
  ["barcelona", "1992", "products/barcelona/retro-1992-1.png", "front"],

  ["real-madrid", "2025/26", "products/real-madrid/home-25-26-1.png", "front"],
  ["real-madrid", "2025/26", "products/real-madrid/away-25-26-1.png", "front"],
  ["real-madrid", "2025/26", "products/real-madrid/infantil-home-25-26-1.png", "front"],

  ["manchester-city", "2025/26", "products/manchester-city/home-25-26-1.png", "front"],
  ["manchester-city", "2025/26", "products/manchester-city/away-25-26-1.png", "front"],
  ["manchester-city", "2025/26", "products/manchester-city/jogador-home-25-26-1.png", "front"],

  ["liverpool", "2025/26", "products/liverpool/home-25-26-1.png", "front"],
  ["liverpool", "2025/26", "products/liverpool/away-25-26-1.png", "front"],
  ["liverpool", "2005", "products/liverpool/retro-2005-1.png", "front"],

  ["arsenal", "2025/26", "products/arsenal/home-25-26-1.png", "front"],
  ["arsenal", "2025/26", "products/arsenal/away-25-26-1.png", "front"],
  ["arsenal", "2025/26", "products/arsenal/feminina-home-25-26-1.png", "front"],
];

async function generateAll() {
  await Promise.all(
    COUNTRY_TILES.map(([code, slug]) =>
      makeTextTile({
        label: code,
        width: 400,
        height: 267,
        outPath: path.join(publicDir, "countries", `${slug}.png`),
      })
    )
  );

  await Promise.all(
    TEAM_BADGES.map(([initials, slug]) =>
      makeTeamBadge({
        initials,
        ...TEAM_COLORS[slug],
        width: 512,
        height: 512,
        outPath: path.join(publicDir, "teams", `${slug}.png`),
      })
    )
  );

  await Promise.all(
    PRODUCT_IMAGES.map(([teamSlug, caption, relPath, angle]) => {
      const kind = detectKind(relPath);
      const colors = variantColors(TEAM_COLORS[teamSlug], kind);
      return makeProductPhoto({
        ...colors,
        angle,
        caption,
        width: 800,
        height: 1000,
        outPath: path.join(publicDir, relPath),
      });
    })
  );

  await makeTextTile({
    label: "Camisas do Mundo",
    sublabel: "Catálogo de camisas de futebol",
    width: 1200,
    height: 630,
    outPath: path.join(publicDir, "og-cover.png"),
  });

  await makeTeamBadge({ initials: "CM", primary: "#0f172a", secondary: "#10b981", width: 32, height: 32, outPath: path.join(publicDir, "favicon-32.png") });
  await makeTeamBadge({ initials: "CM", primary: "#0f172a", secondary: "#10b981", width: 180, height: 180, outPath: path.join(publicDir, "apple-touch-icon.png") });

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
  await makeTextTile({ label, width, height, outPath });
}

const args = process.argv.slice(2);
if (args[0] === "--single") {
  await generateSingle(args);
} else {
  await generateAll();
}
