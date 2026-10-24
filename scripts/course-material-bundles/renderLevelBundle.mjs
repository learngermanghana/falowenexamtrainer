import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

const diagnostics = {
  level,
  startedAt: new Date().toISOString(),
  lessons: [],
};

const writeDiagnostics = () => {
  fs.writeFileSync(diagnosticsPath, `${JSON.stringify(diagnostics, null, 2)}\n`, "utf8");
};

const storageStateFromEnv = () => {
  const encoded = String(process.env.FALOWEN_PDF_AUTH_STATE_B64 || "").trim();
  if (!encoded) return undefined;
  const file = path.join(outputDir, "playwright-storage-state.json");
  fs.writeFileSync(file, Buffer.from(encoded, "base64").toString("utf8"));
  return file;
};

const waitForLesson = async (page) => {
  await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
  await page.locator("body").waitFor({ state: "visible", timeout: 10000 });
  await page.waitForFunction(
    () => (document.body?.innerText || "").trim().length > 120,
    undefined,
    { timeout: 10000 },
  ).catch(() => {});
  await page.waitForTimeout(500);
};

const isPublicLanding = async (page) => {
  if (await page.locator(".falowen-public-home").count()) return true;
  const bodyText = await page.locator("body").innerText().catch(() => "");
  return /German and French learning in one place|Ready to start learning\?|Create your Falowen account or log in to continue your course/i.test(bodyText);
};

const hasRealLessonContent = async (page) => {
  if (await isPublicLanding(page)) return false;
  const markers = [
    page.getByRole("button", { name: /(?:^|\b)(?:1\.\s*)?Learn(?:\b|$)/i }).first(),
    page.getByRole("button", { name: /(?:^|\b)(?:2\.\s*)?Speak(?:\b|$)/i }).first(),
    page.getByRole("button", { name: /(?:^|\b)(?:3\.\s*)?Write(?:\b|$)/i }).first(),
    page.getByText(/Back to Course Book/i).first(),
    page.getByText(/Course Book/i).first(),
  ];
  for (const marker of markers) {
    if (await marker.count()) return true;
  }
  return false;
};

const requirePdfCredentials = () => {
  const email = String(process.env.FALOWEN_PDF_EMAIL || "").trim();
  const password = String(process.env.FALOWEN_PDF_PASSWORD || "");
  if (!email || !password) {
    throw new Error("Falowen login is required. Add FALOWEN_PDF_EMAIL and FALOWEN_PDF_PASSWORD repository secrets, or provide a valid FALOWEN_PDF_AUTH_STATE_B64 session.");
  }
  return { email, password };
};

const openLoginFromLanding = async (page) => {
  const loginButton = page.getByRole("button", { name: /^(Log in|Login|Anmelden|Se connecter)$/i }).first();
  const loginLink = page.getByRole("link", { name: /^(Log in|Login|Anmelden|Se connecter)$/i }).first();
  if (await loginButton.count()) {
    await loginButton.click({ timeout: 10000 });
  } else if (await loginLink.count()) {
    await loginLink.click({ timeout: 10000 });
  } else {
    throw new Error("Public Falowen landing page was shown, but its Log in action could not be found.");
  }
  await page.locator('input[type="email"]').first().waitFor({ state: "visible", timeout: 15000 });
};

const submitLoginForm = async (page) => {
  const { email, password } = requirePdfCredentials();
  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  if (!(await emailInput.count()) || !(await passwordInput.count())) {
    throw new Error("Falowen login form did not expose email and password fields.");
  }
  await emailInput.fill(email);
  await passwordInput.fill(password);
  const submit = page.locator('button[type="submit"], input[type="submit"]').first();
  if (!(await submit.count())) throw new Error("Could not find the Falowen login submit button.");
  await submit.click({ timeout: 10000 });
  await page.waitForTimeout(1500);
};

const authenticateIfNeeded = async (page, targetUrl) => {
  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForLesson(page);

  if (await hasRealLessonContent(page)) return;

  const emailInput = page.locator('input[type="email"]').first();
  if (await isPublicLanding(page)) {
    console.log("Public landing fallback detected. Opening Falowen login.");
    await openLoginFromLanding(page);
  } else if (!(await emailInput.count())) {
    throw new Error(`The requested lesson did not render authenticated course content. Current page: ${page.url()}`);
  }

  await submitLoginForm(page);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForLesson(page);

  if (!(await hasRealLessonContent(page))) {
    const bodyText = (await page.locator("body").innerText().catch(() => "")).slice(0, 500).replace(/\s+/g, " ");
    throw new Error(`Falowen PDF login completed, but authenticated lesson content was not available at ${targetUrl}. Page preview: ${bodyText}`);
  }
};

const injectPrintMode = async (page) => {
  await page.addStyleTag({ content: `
    @page { size: A4; margin: 14mm 12mm 16mm; }
    html, body { background: #fff !important; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    nav, header > button, [role="navigation"], .book-print-stamp,
    button:not([data-pdf-keep]), input[type="checkbox"], iframe,
    [class*="study-buddy" i], [class*="floating" i], [class*="chat" i],
    [aria-label*="Study Buddy" i], [aria-label*="download" i] { display: none !important; }
    [style*="position: sticky"], [style*="position: fixed"] { position: static !important; }
    section, article, table, pre, blockquote { break-inside: avoid; }
    a { color: inherit !important; text-decoration: none !important; }
  ` });
  await page.emulateMedia({ media: "print" });
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

const assertLessonStillAuthenticated = async (page, lesson) => {
  if (!(await hasRealLessonContent(page))) {
    throw new Error(`Day ${lesson.day} did not render real authenticated course content. Refusing to create a PDF from the public landing page.`);
  }
};

const renderLessonTabs = async (page, lesson) => {
  const routeUrl = new URL(lesson.route, baseUrl).toString();
  await page.goto(routeUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForLesson(page);
  await assertLessonStillAuthenticated(page, lesson);

  const tabSpecs = [
    { key: "learn", names: ["1. Learn", "Learn", "Grammar"] },
    { key: "speak", names: ["2. Speak", "Speak"] },
    { key: "write", names: ["3. Write", "Write", "Workbook"] },
  ];
  const rendered = [];

  for (const tab of tabSpecs) {
    const clicked = await clickTab(page, tab.names);
    if (!clicked && tab.key !== "learn") continue;
    await assertLessonStillAuthenticated(page, lesson);
    await injectPrintMode(page);
    const file = path.join(renderDir, `${String(lesson.day).padStart(2, "0")}-${tab.key}.pdf`);
    await page.pdf({
      path: file,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "10mm", right: "10mm", bottom: "14mm", left: "10mm" },
      timeout: 30000,
    });
    rendered.push({ tab: tab.key, file });
  }

  if (!rendered.length) throw new Error(`No printable content was rendered for Day ${lesson.day}.`);
  return rendered;
};

const addCoverAndContents = async (output, printableLessons) => {
  const font = await output.embedFont(StandardFonts.Helvetica);
  const bold = await output.embedFont(StandardFonts.HelveticaBold);
  const page = output.addPage([595.28, 841.89]);
  page.drawText("FALOWEN", { x: 54, y: 755, size: 28, font: bold, color: rgb(0.08, 0.25, 0.65) });
  page.drawText(`${level} Course Materials`, { x: 54, y: 670, size: 30, font: bold, color: rgb(0.05, 0.09, 0.16) });
  page.drawText("Grammar, speaking and writing practice", { x: 54, y: 625, size: 15, font, color: rgb(0.28, 0.34, 0.43) });
  page.drawText(`Curriculum version: ${manifest.generatedAt.slice(0, 10)}`, { x: 54, y: 570, size: 11, font });
  page.drawText(`Printable lessons: ${manifest.printableLessonCount}`, { x: 54, y: 548, size: 11, font });
  page.drawText("Generated for administration", { x: 54, y: 110, size: 11, font, color: rgb(0.38, 0.43, 0.5) });

  let toc = output.addPage([595.28, 841.89]);
  toc.drawText("Contents", { x: 54, y: 780, size: 24, font: bold });
  let y = 744;
  for (const lesson of printableLessons) {
    const label = `Day ${lesson.day} · ${lesson.title}`;
    const lines = label.length > 78 ? [label.slice(0, 78), label.slice(78)] : [label];
    for (const line of lines) {
      toc.drawText(line, { x: 58, y, size: 10.5, font, color: rgb(0.12, 0.17, 0.25) });
      y -= 16;
    }
    y -= 4;
    if (y < 70) {
      toc = output.addPage([595.28, 841.89]);
      toc.drawText("Contents continued", { x: 54, y: 810, size: 18, font: bold });
      y = 780;
    }
  }
};

const mergeBundle = async (renderedLessons) => {
  const output = await PDFDocument.create();
  const printableLessons = manifest.lessons.filter((lesson) => lesson.printKind !== "excluded");
  await addCoverAndContents(output, printableLessons);

  for (const lesson of printableLessons) {
    const files = renderedLessons.get(lesson.day) || [];
    for (const item of files) {
      const source = await PDFDocument.load(fs.readFileSync(item.file));
      const pages = await output.copyPages(source, source.getPageIndices());
      pages.forEach((page) => output.addPage(page));
    }
  }

  const font = await output.embedFont(StandardFonts.Helvetica);
  const pages = output.getPages();
  pages.forEach((page, index) => {
    const { width } = page.getSize();
    page.drawText("Falowen Learning Hub", { x: 36, y: 20, size: 8, font, color: rgb(0.45, 0.5, 0.58), opacity: 0.75 });
    page.drawText(`${index + 1} / ${pages.length}`, { x: width - 70, y: 20, size: 8, font, color: rgb(0.45, 0.5, 0.58) });
  });

  fs.writeFileSync(finalPdfPath, await output.save());
};

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1800 },
  storageState: storageStateFromEnv(),
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(45000);
const printableLessons = manifest.lessons.filter((lesson) => lesson.printKind !== "excluded");
await authenticateIfNeeded(page, new URL(printableLessons[0].route, baseUrl).toString());

const renderedLessons = new Map();
try {
  for (const lesson of printableLessons) {
    const startedAt = Date.now();
    console.log(`::group::Rendering ${level} Day ${lesson.day}: ${lesson.title}`);
    try {
      const rendered = await renderLessonTabs(page, lesson);
      renderedLessons.set(lesson.day, rendered);
      const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
      diagnostics.lessons.push({ day: lesson.day, title: lesson.title, status: "rendered", tabs: rendered.map((item) => item.tab), durationSeconds });
      console.log(`Rendered ${rendered.length} section(s) in ${durationSeconds}s.`);
    } catch (error) {
      const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
      diagnostics.lessons.push({ day: lesson.day, title: lesson.title, status: "failed", durationSeconds, error: error instanceof Error ? error.message : String(error) });
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
