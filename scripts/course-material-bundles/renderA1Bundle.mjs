import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const baseUrl = String(process.env.FALOWEN_PDF_BASE_URL || "https://www.falowen.app").replace(/\/$/, "");
const outputDir = path.join(repoRoot, "artifacts", "course-material-bundles", "A1");
const planPath = path.join(__dirname, "a1RenderPlan.json");
const finalPdfPath = path.join(outputDir, "Falowen-A1-Course-Materials.pdf");
const renderDir = path.join(outputDir, "rendered-lessons");
const diagnosticsPath = path.join(outputDir, "render-diagnostics.json");

fs.rmSync(renderDir, { recursive: true, force: true });
fs.mkdirSync(renderDir, { recursive: true });

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const diagnostics = { level: "A1", rendererVersion: 7, startedAt: new Date().toISOString(), lessons: [] };
const writeDiagnostics = () => fs.writeFileSync(diagnosticsPath, `${JSON.stringify(diagnostics, null, 2)}\n`, "utf8");

const firstLesson = plan.lessons?.[0];
const firstTarget = firstLesson?.targets?.[0];
if (
  Number(firstLesson?.day) !== 1
  || firstTarget?.url !== "/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1"
) {
  throw new Error("A1 render plan must begin with Day 1 Greetings / Chapter 0.1.");
}

const getBodyText = async (page) => {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
    } catch (error) {
      if (!/Execution context was destroyed|navigation/i.test(String(error))) throw error;
      await page.waitForLoadState("domcontentloaded", { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(700);
    }
  }
  return "";
};

const waitForStablePage = async (page) => {
  await page.waitForLoadState("domcontentloaded", { timeout: 30000 }).catch(() => {});
  await page.locator("body").waitFor({ state: "visible", timeout: 15000 });
  await page.waitForTimeout(1000);
};

const isPublicOrLogin = async (page) => {
  const text = await getBodyText(page);
  return /German and French learning in one place|Ready to start learning\?|Create your Falowen account|Connect with your account|Returning Falowen student/i.test(text);
};

const loginOnce = async (page) => {
  const email = String(process.env.FALOWEN_PDF_EMAIL || "").trim();
  const password = String(process.env.FALOWEN_PDF_PASSWORD || "");
  if (!email || !password) throw new Error("Missing FALOWEN_PDF_EMAIL or FALOWEN_PDF_PASSWORD GitHub secret.");

  await page.goto(`${baseUrl}/login/`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForStablePage(page);

  const loginForm = page.locator("form").filter({ hasText: /Email or student code/i }).first();
  await loginForm.waitFor({ state: "visible", timeout: 15000 });
  const emailInput = loginForm.locator('input[type="text"]').first();
  const passwordInput = loginForm.locator('input[type="password"]').first();
  await emailInput.waitFor({ state: "visible", timeout: 15000 });
  await passwordInput.waitFor({ state: "visible", timeout: 15000 });
  await emailInput.fill(email);
  await passwordInput.fill(password);
  const submit = loginForm.getByRole("button", { name: /^Log in$/i }).first();
  await submit.click({ timeout: 10000 });

  await page.waitForFunction(
    () => !document.body?.innerText?.includes("Returning Falowen student"),
    undefined,
    { timeout: 25000 },
  ).catch(() => {});
  await waitForStablePage(page);

  const authText = await getBodyText(page);
  if (/Password mismatch|could not find an account|cannot log in right now|permission denied/i.test(authText)) {
    throw new Error(`Falowen PDF login failed: ${authText.slice(0, 500)}`);
  }
};

const injectPrintMode = async (page) => {
  await page.emulateMedia({ media: "print" });
  await page.addStyleTag({ content: `
    @page { size: A4; margin: 12mm 10mm 15mm; }
    html, body { background: #fff !important; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    nav, [role="navigation"], .book-print-stamp, .book-pdf-download-action,
    iframe, button, input[type="checkbox"],
    [class*="study-buddy" i], [class*="floating" i], [class*="chat" i],
    [aria-label*="Study Buddy" i], [aria-label*="download" i] { display: none !important; }
    [style*="position: sticky"], [style*="position: fixed"] { position: static !important; }
    section, article, table, pre, blockquote { break-inside: avoid; }
  ` });
};

const WORKBOOK_KINDS = new Set(["workbook", "practice", "combined"]);
const getInternalRenderUrl = (target) => {
  const url = new URL(target.url, baseUrl);
  if (WORKBOOK_KINDS.has(target.kind)) {
    // A1 workbook pages normally pass through Falowen Radio first. For an
    // administration PDF we need the workbook itself, so mark Radio complete.
    url.searchParams.set("radio", "done");
  }
  return url.toString();
};

const ensureInternalPage = async (page, target, day) => {
  const url = getInternalRenderUrl(target);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForStablePage(page);

  if (await isPublicOrLogin(page)) {
    throw new Error(`Day ${day} ${target.kind} route is not authenticated: ${url}`);
  }

  const currentUrl = new URL(page.url());
  const expectedUrl = new URL(url);
  const text = await getBodyText(page);
  const fatalShell = /Unexpected Application Error|404 Not Found|Page not found|Loading failed/i.test(text);
  const radioGate = /Falowen Radio/i.test(text) && /continue|workbook|complete/i.test(text);
  const isFalowenCoursePage = currentUrl.origin === expectedUrl.origin && currentUrl.pathname.startsWith("/campus/course/");

  if (!isFalowenCoursePage) {
    throw new Error(`Day ${day} ${target.kind} left the expected Falowen course route: ${page.url()}`);
  }
  if (fatalShell) {
    throw new Error(`Day ${day} ${target.kind} rendered an error page: ${url}`);
  }
  if (WORKBOOK_KINDS.has(target.kind) && radioGate) {
    throw new Error(`Day ${day} ${target.kind} stopped on Falowen Radio instead of workbook content: ${url}`);
  }
  if (!text) {
    throw new Error(`Day ${day} ${target.kind} rendered an empty page: ${url}`);
  }

  return url;
};

const renderInternalTarget = async (page, lesson, target, index) => {
  const url = await ensureInternalPage(page, target, lesson.day);
  await injectPrintMode(page);
  const file = path.join(renderDir, `${String(lesson.day).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}-${target.kind}.pdf`);
  await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true, timeout: 30000 });
  return { kind: target.kind, source: url, file };
};

const driveIdFromUrl = (url) => String(url).match(/\/d\/([^/]+)/)?.[1] || "";

const downloadExternalPdf = async (lesson, target, index) => {
  const id = driveIdFromUrl(target.url);
  if (!id) throw new Error(`Could not parse Google Drive file id for Day ${lesson.day}.`);
  const downloadUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`;
  const response = await fetch(downloadUrl, { redirect: "follow" });
  if (!response.ok) throw new Error(`Day ${lesson.day} external PDF download failed with ${response.status}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.subarray(0, 4).equals(Buffer.from("%PDF"))) {
    throw new Error(`Day ${lesson.day} Google Drive resource did not return a PDF.`);
  }
  const file = path.join(renderDir, `${String(lesson.day).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}-external.pdf`);
  fs.writeFileSync(file, bytes);
  return { kind: target.kind, source: target.url, file };
};

const addCoverAndContents = async (output) => {
  const font = await output.embedFont(StandardFonts.Helvetica);
  const bold = await output.embedFont(StandardFonts.HelveticaBold);
  const cover = output.addPage([595.28, 841.89]);
  cover.drawText("FALOWEN", { x: 54, y: 755, size: 28, font: bold, color: rgb(0.08, 0.25, 0.65) });
  cover.drawText("A1 Course Materials", { x: 54, y: 670, size: 30, font: bold });
  cover.drawText("Grammar notes and workbook practice", { x: 54, y: 625, size: 15, font });
  cover.drawText("Generated for administration", { x: 54, y: 110, size: 11, font });

  let toc = output.addPage([595.28, 841.89]);
  toc.drawText("Contents", { x: 54, y: 780, size: 24, font: bold });
  let y = 744;
  for (const lesson of plan.lessons) {
    const label = `Day ${lesson.day} · ${lesson.title}`;
    toc.drawText(label.slice(0, 82), { x: 58, y, size: 10.5, font });
    y -= 19;
    if (y < 70) {
      toc = output.addPage([595.28, 841.89]);
      toc.drawText("Contents continued", { x: 54, y: 810, size: 18, font: bold });
      y = 780;
    }
  }
};

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1800 } });
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(45000);

const rendered = new Map();
try {
  await loginOnce(page);
  for (const lesson of plan.lessons) {
    const started = Date.now();
    console.log(`::group::Rendering A1 Day ${lesson.day}: ${lesson.title}`);
    const outputs = [];
    try {
      for (let index = 0; index < lesson.targets.length; index += 1) {
        const target = lesson.targets[index];
        const result = target.kind === "external-pdf"
          ? await downloadExternalPdf(lesson, target, index)
          : await renderInternalTarget(page, lesson, target, index);
        outputs.push(result);
      }
      rendered.set(lesson.day, outputs);
      diagnostics.lessons.push({
        day: lesson.day,
        title: lesson.title,
        status: "rendered",
        targets: outputs.map(({ kind, source }) => ({ kind, source })),
        durationSeconds: Math.round((Date.now() - started) / 1000),
      });
    } catch (error) {
      diagnostics.lessons.push({ day: lesson.day, title: lesson.title, status: "failed", error: error instanceof Error ? error.message : String(error) });
      writeDiagnostics();
      throw error;
    } finally {
      writeDiagnostics();
      console.log("::endgroup::");
    }
  }
} finally {
  await browser.close();
}

const output = await PDFDocument.create();
await addCoverAndContents(output);
for (const lesson of plan.lessons) {
  for (const item of rendered.get(lesson.day) || []) {
    const source = await PDFDocument.load(fs.readFileSync(item.file));
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((p) => output.addPage(p));
  }
}

const footerFont = await output.embedFont(StandardFonts.Helvetica);
const pages = output.getPages();
pages.forEach((p, index) => {
  const { width } = p.getSize();
  p.drawText("Falowen Learning Hub", { x: 36, y: 20, size: 8, font: footerFont, color: rgb(0.45, 0.5, 0.58) });
  p.drawText(`${index + 1} / ${pages.length}`, { x: width - 70, y: 20, size: 8, font: footerFont, color: rgb(0.45, 0.5, 0.58) });
});

fs.writeFileSync(finalPdfPath, await output.save());
diagnostics.completedAt = new Date().toISOString();
diagnostics.pdfPath = finalPdfPath;
writeDiagnostics();
console.log(`Created ${finalPdfPath}`);
