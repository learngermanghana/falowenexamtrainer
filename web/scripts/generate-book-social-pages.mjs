// Give social crawlers route-specific metadata before the React app loads.
// This static copy of the built SPA entrypoint requires no server function or redirect.
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://www.falowen.app";
const webDir = dirname(dirname(fileURLToPath(import.meta.url)));
export const pages = JSON.parse(await readFile(join(webDir, "src/data/bookSharePages.json"), "utf8"));
const escapeHtml = value => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeRegex = value => [...value].map(char => "\\^$.*+?()[]{}|".includes(char) ? "\\" + char : char).join("");

function updateMeta(html, attribute, key, value) {
  const pattern = new RegExp("<meta\\b(?=[^>]*\\b" + attribute + "=[\"']" + escapeRegex(key) + "[\"'])[^>]*>", "i");
  if (!pattern.test(html)) throw Error("Missing expected default metadata: " + key);
  return html.replace(pattern, tag => {
    if (!/\bcontent\s*=/.test(tag)) throw Error("Missing content attribute: " + key);
    return tag.replace(/\bcontent\s*=\s*(["'])[\s\S]*?\1/i, 'content="' + escapeHtml(value) + '"');
  });
}

export function makeBookSocialHtml(entryHtml, page) {
  const BOOK_URL = SITE + page.href;
  const BOOK_IMAGE = SITE + page.thumbnail;
  const BOOK_TITLE = page.href === "/books" ? page.title : page.title + " | Falowen Books";
  const BOOK_DESCRIPTION = page.description;
  let html = entryHtml;
  for (const [key, value] of Object.entries({
    "og:title": BOOK_TITLE,
    "og:description": BOOK_DESCRIPTION,
    "og:type": page.href === "/books" ? "website" : "book",
    "og:url": BOOK_URL,
    "og:image": BOOK_IMAGE,
  })) html = updateMeta(html, "property", key, value);
  for (const [key, value] of Object.entries({
    "description": BOOK_DESCRIPTION,
    "twitter:card": "summary_large_image",
    "twitter:title": BOOK_TITLE,
    "twitter:description": BOOK_DESCRIPTION,
  })) html = updateMeta(html, "name", key, value);
  if (!/<title>[^<]*<\/title>/i.test(html)) throw Error("Missing document title");
  html = html.replace(/<title>[^<]*<\/title>/i, "<title>" + escapeHtml(BOOK_TITLE) + "</title>");
  const extra = [
    '<link rel="canonical" href="' + BOOK_URL + '" />',
    '<meta name="twitter:image" content="' + BOOK_IMAGE + '" />',
    '<meta name="twitter:image:alt" content="' + escapeHtml(page.title) + '" />',
    '<meta property="og:image:type" content="image/jpeg" />',
    '<meta property="og:image:alt" content="' + escapeHtml(page.title) + '" />',
    '<meta name="robots" content="index,follow,max-image-preview:large" />',
  ].join("\n    ");
  if (!html.includes("</head>")) throw Error("Missing head in built SPA entrypoint");
  return html.replace("</head>", "    " + extra + "\n  </head>");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dist = join(webDir, "dist");
  const entryHtml = await readFile(join(dist, "index.html"), "utf8");
  await mkdir(join(dist, "__books"), { recursive: true });
  for (const [id, page] of Object.entries(pages)) {
    await writeFile(join(dist, "__books", id + ".html"), makeBookSocialHtml(entryHtml, page));
  }
}
