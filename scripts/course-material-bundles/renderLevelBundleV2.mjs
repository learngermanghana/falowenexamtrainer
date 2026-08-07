import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const level = String(process.argv[2] || "").trim().toUpperCase();
const baseUrl = String(process.env.FALOWEN_PDF_BASE_URL || "https://www.falowen.app").replace(/\/$/, "");
const outputDir = path.join(repoRoot, "artifacts", "course-material-bundles", level);
const manifestPath = path.join(outputDir, `Falowen-${level}-Course-Materials-manifest.json`);
const finalPdfPath = path.join(outputDir, `Falowen-${level}-Course-Materials.pdf`);
const renderDir = path.join(outputDir, "rendered-lessons");
const diagnosticsPath = path.join(outputDir, "render-diagnostics.json");

if (!fs.existsSync(manifestPath)) throw new Error(`Manifest not found: ${manifestPath}`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (!manifest.readyForPdfGeneration) throw new Error(`${level} manifest is not ready for PDF generation.`);

fs.rmSync(renderDir, { recursive: true, force: true });
fs.mkdirSync(renderDir, { recursive: true });

const diagnostics = { level, rendererVersion: 2, startedAt: new Date().toISOString(), lessons: [] };
const writeDiagnostics = () => fs.writeFileSync(diagnosticsPath, `${JSON.stringify(diagnostics, null, 2)}\n`, "utf8");

const storageStateFromEnv = () => {
  const encoded = String(process.env.FALOWEN_PDF_AUTH_STATE_B64 || "").trim();
  if (!encoded) return undefined;
  const file = path.join(outputDir, "playwright-storage-state.json");
  fs.writeFileSync(file, Buffer.from(encoded, "base64").toString("utf8"));
  return file;
};

const waitForPage = async (page) => {
  await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
  await page.locator("body").waitFor({ state: "visible", timeout: 10000 });
  await page.waitForFunction(() => (document.body?.innerText || "").trim().length > 120, undefined, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(500);
};

const getBodyText = async (page) => (await page.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ").trim();

const isPublicLanding = async (page) => {
  if (await page.locator(".falowen-public-home").count()) return true;
  const text = await getBodyText(page);
  return /German and French learning in one place|Ready to start learning\?|Create your Falowen account or log in to continue your course/i.test(text);
};

const hasLessonContent = async (page, lesson) => {
  if (await isPublicLanding(page)) return false;
  const text = await getBodyText(page);
  const title = String(lesson?.title || "").trim();
  if (title && text.toLowerCase().includes(title.toLowerCase())) return true;

  if (level === "A1") {
    return /Workbook|Arbeitsbuch|Grammar|Grammatik|Kapitel|Course Book|Übung|Ubung|Aufgabe/i.test(text) && text.length > 500;
  }

  if (level === "B2" || level === "C1") {
    return /\bLearn\b/i.test(text) && /\bSpeak\b/i.test(text) && /\bWrite\b/i.test(text);
  }

  return /Workbook|Grammar|Course Book|Kapitel/i.test(text) && text.length > 500;
};

const credentials = () => {
  const email = String(process.env.FALOWEN_PDF_EMAIL || "").trim();
  const password = String(process.env.FALOWEN_PDF_PASSWORD || "");
  if (!email || !password) throw new Error("Falowen PDF login requires FALOWEN_PDF_EMAIL and FALOWEN_PDF_PASSWORD repository secrets.");
  return { email, password };
};

const openLogin = async (page) => {
  const action = page.getByRole("button", { name: /^(Log in|Login|Anmelden|Se connecter)$/i }).first();
  const link = page.getByRole("link", { name: /^(Log in|Login|Anmelden|Se connecter)$/i }).first();
  if (await action.count()) await action.click({ timeout: 10000 });
  else if (await link.count()) await link.click({ timeout: 10000 });
  else throw new Error("Public Falowen page was shown but the Log in action was not found.");
  await page.locator('input[type="email"]').first().waitFor({ state: "visible", timeout: 15000 });
};

const submitLogin = async (page) => {
  const { email, password } = credentials();
  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  if (!(await emailInput.count()) || !(await passwordInput.count())) throw new Error("Falowen login form fields were not found.");
  await emailInput.fill(email);
  await passwordInput.fill(password);
  const submit = page.locator('button[type="submit"], input[type="submit"]').first();
  if (!(await submit.count())) throw new Error("Falowen login submit button was not found.");
  await submit.click({ timeout: 10000 });
  await page.waitForTimeout(1500);
};

const ensureAuthenticatedLesson = async (page, lesson) => {
  const targetUrl = new URL(lesson.route, baseUrl).toString();
  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForPage(page);
  if (await hasLessonContent(page, lesson)) return;

  if (await isPublicLanding(page)) await openLogin(page);
  else if (!(await page.locator('input[type="email"]').count())) {
    const preview = (await getBodyText(page)).slice(0, 500);
    throw new Error(`Day ${lesson.day} did not show course content or a login form. Preview: ${preview}`);
  }

  await submitLogin(page);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForPage(page);
  if (!(await hasLessonContent(page, lesson))) {
    const preview = (await getBodyText(page)).slice(0, 500);
    throw new Error(`Login completed but Day ${lesson.day} still did not show the real lesson. Preview: ${preview}`);
  }
};

const injectPrintMode = async (page) => {
  await page.emulateMedia({ media: "print" });
  await page.addStyleTag({ content: `
    @page { size: A4; margin: 12mm 10mm 15mm; }
    html, body { background: #fff !important; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    nav, [role="navigation"], .book-print-stamp,
    .book-pdf-download-action, iframe,
    [class*="study-buddy" i], [class*="floating" i],
    [aria-label*="Study Buddy" i], [aria-label*="download" i] { display: none !important; }
    [style*="position: sticky"], [style*="position: fixed"] { position: static !important; }
    section, article, table, pre, blockquote { break-inside: avoid; }
  ` });
};

const saveCurrentPagePdf = async (page, lesson, suffix = "lesson") => {
  await injectPrintMode(page);
  const file = path.join(renderDir, `${String(lesson.day).padStart(2, "0")}-${suffix}.pdf`);
  await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true, timeout: 30000 });
  return { tab: suffix, file };
};

const renderA1Lesson = async (page, lesson) => {
  await ensureAuthenticatedLesson(page, lesson);
  // A1 pages are full workbook/lesson pages. Do not look for B2/C1 Learn/Speak/Write tabs.
  return [await saveCurrentPagePdf(page, lesson, "full")];
};

const clickTab = async (page, names) => {
  for (const name of names) {
    const button = page.getByRole("button", { name: new RegExp(name, "i") }).first();
    if (await button.count()) {
      await button.click({ timeout: 10000 });
      await page.waitForTimeout(350);
      return true;
    }
  }
  return false;
};

const renderTabbedLesson = async (page, lesson) => {
  await ensureAuthenticatedLesson(page, lesson);
  const tabs = [
    { key: "learn", names: ["1. Learn", "Learn"] },
    { key: "speak", names: ["2. Speak", "Speak"] },
    { key: "write", names: ["3. Write", "Write"] },
  ];
  const rendered = [];
  for (const tab of tabs) {
    if (!(await clickTab(page, tab.names))) continue;
    rendered.push(await saveCurrentPagePdf(page, lesson, tab.key));
  }
  if (!rendered.length) throw new Error(`No guided lesson tabs were rendered for Day ${lesson.day}.`);
  return rendered;
};

const renderStandardLesson = async (page, lesson) => {
  await ensureAuthenticatedLesson(page, lesson);
  return [await saveCurrentPagePdf(page, lesson, "full")];
};

const renderLesson = async (page, lesson) => {
  if (level === "A1") return renderA1Lesson(page, lesson);
  if (level === "B2" || level === "C1") return renderTabbedLesson(page, lesson);
  return renderStandardLesson(page, lesson);
};

const addCoverAndContents = async (output, lessons) => {
  const font = await output.embedFont(StandardFonts.Helvetica);
  const bold = await output.embedFont(StandardFonts.HelveticaBold);
  const cover = output.addPage([595.28, 841.89]);
  cover.drawText("FALOWEN", { x: 54, y: 755, size: 28, font: bold, color: rgb(0.08, 0.25, 0.65) });
  cover.drawText(`${level} Course Materials`, { x: 54, y: 670, size: 30, font: bold });
  cover.drawText(level === "A1" ? "Complete lesson and workbook materials" : "Course learning materials", { x: 54, y: 625, size: 15, font, color: rgb(0.28, 0.34, 0.43) });
  cover.drawText(`Curriculum version: ${manifest.generatedAt.slice(0, 10)}`, { x: 54, y: 570, size: 11, font });
  cover.drawText(`Printable lessons: ${manifest.printableLessonCount}`, { x: 54, y: 548, size: 11, font });

  let toc = output.addPage([595.28, 841.89]);
  toc.drawText("Contents", { x: 54, y: 780, size: 24, font: bold });
  let y = 744;
  for (const lesson of lessons) {
    if (y < 80) {
      toc = output.addPage([595.28, 841.89]);
      toc.drawText("Contents continued", { x: 54, y: 800, size: 18, font: bold });
      y = 765;
    }
    toc.drawText(`Day ${lesson.day} · ${lesson.title}`.slice(0, 92), { x: 58, y, size: 10.5, font });
    y -= 21;
  }
};

const mergeBundle = async (renderedLessons) => {
  const output = await PDFDocument.create();
  const lessons = manifest.lessons.filter((lesson) => lesson.printKind !== "excluded");
  await addCoverAndContents(output, lessons);
  for (const lesson of lessons) {
    for (const item of renderedLessons.get(lesson.day) || []) {
      const source = await PDFDocument.load(fs.readFileSync(item.file));
      const pages = await output.copyPages(source, source.getPageIndices());
      pages.forEach((page) => output.addPage(page));
    }
  }
  const font = await output.embedFont(StandardFonts.Helvetica);
  const pages = output.getPages();
  pages.forEach((page, index) => {
    const { width } = page.getSize();
    page.drawText("Falowen Learning Hub", { x: 36, y: 20, size: 8, font, color: rgb(0.45, 0.5, 0.58) });
    page.drawText(`${index + 1} / ${pages.length}`, { x: width - 70, y: 20, size: 8, font, color: rgb(0.45, 0.5, 0.58) });
  });
  fs.writeFileSync(finalPdfPath, await output.save());
};

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1800 }, storageState: storageStateFromEnv() });
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(45000);

const printableLessons = manifest.lessons.filter((lesson) => lesson.printKind !== "excluded");
const renderedLessons = new Map();
try {
  for (const lesson of printableLessons) {
    const startedAt = Date.now();
    console.log(`::group::Rendering ${level} Day ${lesson.day}: ${lesson.title}`);
    try {
      const rendered = await renderLesson(page, lesson);
      renderedLessons.set(lesson.day, rendered);
      const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
      diagnostics.lessons.push({ day: lesson.day, title: lesson.title, status: "rendered", sections: rendered.map((item) => item.tab), durationSeconds });
      console.log(`Rendered ${rendered.length} page source(s) in ${durationSeconds}s.`);
    } catch (error) {
      diagnostics.lessons.push({ day: lesson.day, title: lesson.title, status: "failed", error: error instanceof Error ? error.message : String(error) });
      writeDiagnostics();
      throw error;
    } finally {
      console.log("::endgroup::");
      writeDiagnostics();
    }
  }
} finally {
  await browser.close();
}

await mergeBundle(renderedLessons);
diagnostics.completedAt = new Date().toISOString();
diagnostics.pdfPath = finalPdfPath;
writeDiagnostics();
const stats = fs.statSync(finalPdfPath);
console.log(`Created ${finalPdfPath}`);
console.log(`PDF size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
