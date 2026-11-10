// Give social crawlers route-specific metadata before the React app loads.
// This is a static copy of the built SPA entrypoint, not a redirect or a server function.
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://www.falowen.app";
const BOOK_PATH = "/books/how-to-unlock-your-german-writing-skills-a1-c2";
const BOOK_URL = SITE + BOOK_PATH;
const BOOK_TITLE = "How to Unlock Your German Writing Skills (A1–C2) | Falowen Books";
const BOOK_DESCRIPTION = "A 68-page German writing guide for A1–C2 learners: sentence structure, connectors, model texts, exercises and self-correction. Explore the digital PDF or printed book.";
// Use an existing, publicly reachable book-specific raster image.
// Social previews should not use the SVG cover: many crawlers do not accept SVG og:image.
const BOOK_IMAGE = SITE + "/books/previews/writing-skills-a1-c2-5.webp";

const escapeHtml = value => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeRegex = value => value.replace(/[.*+?^${'}()|[\]\\]/g, "\\$&");

function updateMeta(html, attribute, key, value) {
  const pattern = new RegExp('<meta\\b(?=[^>]*\\b' + attribute + '=["\\\']' + escapeRegex(key) + '["\\\'])[^>]*>', 'i');
  if (!pattern.test(html)) throw Error("Missing expected default metadata: " + key);
  return html.replace(pattern, tag => {
    if (!/\\bcontent\\s*=/.test(tag)) throw Error("Missing content attribute: " + key);
    return tag.replace(/\\bcontent\\s*=\\s*(["'])(?:.|\\n)*?\\1/i, 'content="' + escapeHtml(value) + '"');
  });
}

export function makeWritingBookSocialHtml(entryHtml) {
  let html = entryHtml;
  for (const [key, value] of Object.entries({
    "og:title": BOOK_TITLE,
    "og:description": BOOK_DESCRIPTION,
    "og:type": "book",
    "og:url": BOOK_URL,
    "og:image": BOOK_IMAGE,
  })) html = updateMeta(html, "property", key, value);
  for (const [key, value] of Object.entries({
    "description": BOOK_DESCRIPTION,
    "twitter:card": "summary_large_image",
    "twitter:title": BOOK_TITLE,
    "twitter:description": BOOK_DESCRIPTION,
  })) html = updateMeta(html, "name", key, value);
  if (!/<title>[^<]*<\\/title>/i.test(html)) throw Error("Missing document title");
  html = html.replace(/<title>[^<]*<\\/title>/i, "<title>" + escapeHtml(BOOK_TITLE) + "</title>");
  const extra = [
    '<link rel="canonical" href="' + BOOK_URL + '" />',
    '<meta name="twitter:image" content="' + BOOK_IMAGE + '" />',
    '<meta name="twitter:image:alt" content="Preview of How to Unlock Your German Writing Skills A1–C2" />',
    '<meta property="og:image:type" content="image/webp" />',
    '<meta property="og:image:alt" content="Preview page from the Falowen German writing guide A1–C2" />',
    '<meta name="robots" content="index,follow,max-image-preview:large" />',
  ].join("\n    ");
  if (!html.includes("</head>")) throw Error("Missing head in built SPA entrypoint");
  return html.replace("</head>", "    " + extra + "\n  </head>");
}

const executable = process.argv[1] && fileURLToPath(import.meta.url) === join(process.cwd(), process.argv[1]).replace(/\\/g, "/");
if (executable) {
  const webDir = dirname(dirname(fileURLToPath(import.meta.url)));
  const dist = join(webDir, "dist");
  const entryHtml = await readFile(join(dist, "index.html"), "utf8");
  const target = join(dist, "__books", "writing-skills-a1-c2.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, makeWritingBookSocialHtml(entryHtml), "utf8");
  console.log("Generated book-specific crawler HTML: " + target);
}
