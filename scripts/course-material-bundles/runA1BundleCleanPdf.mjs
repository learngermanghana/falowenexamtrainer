import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rendererPath = path.join(__dirname, "renderA1Bundle.mjs");
let source = fs.readFileSync(rendererPath, "utf8");

source = source.replace(
  'rendererVersion: 8',
  'rendererVersion: 9',
);

const oldStable = `const waitForStablePage = async (page) => {\n  await page.waitForLoadState("domcontentloaded", { timeout: 30000 }).catch(() => {});\n  await page.locator("body").waitFor({ state: "visible", timeout: 15000 });\n  await page.waitForTimeout(1000);\n};`;

const newStable = `const waitForStablePage = async (page) => {\n  await page.waitForLoadState("domcontentloaded", { timeout: 30000 }).catch(() => {});\n  await page.locator("body").waitFor({ state: "visible", timeout: 15000 });\n  await page.waitForFunction(() => {\n    const text = String(document.body?.innerText || "").replace(/\\s+/g, " ").trim();\n    return text && !/^Loading the app[.…]*$/i.test(text);\n  }, undefined, { timeout: 20000 }).catch(() => {});\n  await page.waitForTimeout(1200);\n};`;

if (!source.includes(newStable)) {
  if (!source.includes(oldStable)) throw new Error("Could not locate waitForStablePage in A1 renderer.");
  source = source.replace(oldStable, newStable);
}

const oldInject = `const injectPrintMode = async (page) => {\n  await page.emulateMedia({ media: "print" });\n  await page.addStyleTag({ content: \`\n    @page { size: A4; margin: 12mm 10mm 15mm; }\n    html, body { background: #fff !important; }\n    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }\n    nav, [role="navigation"], .book-print-stamp, .book-pdf-download-action,\n    iframe, button, input[type="checkbox"],\n    [class*="study-buddy" i], [class*="floating" i], [class*="chat" i],\n    [aria-label*="Study Buddy" i], [aria-label*="download" i] { display: none !important; }\n    [style*="position: sticky"], [style*="position: fixed"] { position: static !important; }\n    section, article, table, pre, blockquote { break-inside: avoid; }\n  \` });\n};`;

const newInject = `const injectPrintMode = async (page) => {\n  await page.emulateMedia({ media: "print" });\n  await page.addStyleTag({ content: \`\n    @page { size: A4; margin: 12mm 10mm 15mm; }\n    html, body { background: #fff !important; }\n    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }\n    nav, [role="navigation"], .book-print-stamp, .book-pdf-download-action,\n    iframe, button, input[type="checkbox"],\n    [class*="study-buddy" i], [class*="floating" i], [class*="chat" i],\n    [aria-label*="Study Buddy" i], [aria-label*="download" i] { display: none !important; }\n    [style*="position: sticky"], [style*="position: fixed"] { position: static !important; }\n    section, article, table, pre, blockquote { break-inside: avoid; }\n  \` });\n\n  await page.evaluate(() => {\n    const hideBlockForText = (pattern) => {\n      const nodes = Array.from(document.querySelectorAll("h1,h2,h3,h4,strong,p,span,div"));\n      for (const node of nodes) {\n        const ownText = String(node.textContent || "").replace(/\\s+/g, " ").trim();\n        if (!pattern.test(ownText)) continue;\n        let block = node;\n        for (let depth = 0; depth < 4 && block?.parentElement; depth += 1) {\n          const parent = block.parentElement;\n          const text = String(parent.textContent || "").replace(/\\s+/g, " ").trim();\n          if (text.length > 700) break;\n          block = parent;\n        }\n        if (block?.style) block.style.display = "none";\n      }\n    };\n\n    hideBlockForText(/^Supporting materials$/i);\n    hideBlockForText(/^Grammar book · continue to workbook$/i);\n  });\n};`;

if (!source.includes(newInject)) {
  if (!source.includes(oldInject)) throw new Error("Could not locate injectPrintMode in A1 renderer.");
  source = source.replace(oldInject, newInject);
}

const tempRendererPath = path.join(__dirname, ".renderA1Bundle.clean-pdf.mjs");
fs.writeFileSync(tempRendererPath, source, "utf8");

try {
  await import(`${pathToFileURL(tempRendererPath).href}?v=${Date.now()}`);
} finally {
  fs.rmSync(tempRendererPath, { force: true });
}
