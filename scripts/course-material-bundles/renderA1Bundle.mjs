import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createPdfNavigation } from "./pdfNavigation.mjs";
import { a1PrintCss, isA1PdfReadyText, printableA1TabLabels } from "./a1PrintHelpers.mjs";

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
const diagnostics = { level: "A1", rendererVersion: 11, startedAt: new Date().toISOString(), lessons: [] };
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

const injectPrintMode = async (page, kind) => {
  await page.emulateMedia({ media: "print" });
  return page.addStyleTag({ content: a1PrintCss(kind) });
};

const resetPrintMode = async (page, printStyle) => {
  await printStyle?.evaluate((style) => style.remove()).catch(() => {});
  await page.emulateMedia({ media: "screen" });
};

const waitForCourseHydration = async (page, day, kind) => {
  // DOMContentLoaded can precede React/Firebase hydration. Never print loaders.
  try {
    await page.waitForFunction(() => {
      const text = String(document.querySelector("main")?.innerText || document.body?.innerText || "")
        .replace(/\s+/g, " ").trim();
      return text.length >= 120 && !/^Loading the app[.…]*/i.test(text);
    }, undefined, { timeout: 30000 });
  } catch {
    throw new Error("A1 Day " + day + " " + kind +
      " did not hydrate to readable content: " + (await getBodyText(page)).slice(0, 250));
  }
  await page.waitForTimeout(400);
};

const A1_TAB_SELECTORS = [
  '[data-a1-unified-tutor-workbook-nav] [role="tablist"] button',
  '[aria-label="A1 shared self-practice sections"] button',
  '[data-a1-teil-navigation="true"] button',
];

const getA1WorkbookCapturePlan = async (page) => {
  const native = page.locator("[data-a1-shared-workbook]").first();
  if (await native.count()) {
    const parts = await native.locator('[data-workbook-panel^="teil-"], [data-workbook-panel^="section-"]').count();
    if (parts > 0) return { mode: "native-panels", count: parts };
  }
  for (const selector of A1_TAB_SELECTORS) {
    const labels = await page.locator(selector).allTextContents();
    const printable = printableA1TabLabels(labels);
    if (printable.length) return { mode: "click-tabs", selector, labels: printable };
  }
  return { mode: "single-page", count: 1 };
};

const printA1Page = async (page, file, day, kind) => {
  const printStyle = await injectPrintMode(page, kind);
  try {
    const mainText = String(await page.locator("main").first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    if (!isA1PdfReadyText(mainText)) {
      throw new Error("A1 Day " + day + " " + kind + " has no printable lesson body: " + mainText.slice(0, 180));
    }
    if (kind === "workbook") {
      const nativeSections = await page.evaluate(() => {
        const root = document.querySelector("[data-a1-shared-workbook]");
        if (!root) return null;
        const panels = [...root.querySelectorAll('[data-workbook-panel^="teil-"], [data-workbook-panel^="section-"]')];
        return { total: panels.length, visible: panels.filter((panel) =>
          panel.getClientRects().length > 0 && getComputedStyle(panel).display !== "none").length };
      });
      if (nativeSections?.total && nativeSections.visible !== nativeSections.total) {
        throw new Error("A1 Day " + day + " PDF would omit " +
          (nativeSections.total - nativeSections.visible) + " native workbook exercise panel(s)");
      }
    }
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true, timeout: 30000 });
  } finally {
    await resetPrintMode(page, printStyle);
  }
};

const captureA1WorkbookSections = async (page, lesson, index, source) => {
  const plan = await getA1WorkbookCapturePlan(page);
  const base = String(lesson.day).padStart(2, "0") + "-" + String(index + 1).padStart(2, "0") + "-workbook";
  const finalFile = path.join(renderDir, base + ".pdf");
  if (plan.mode !== "click-tabs") {
    await printA1Page(page, finalFile, lesson.day, "workbook");
    return { kind: "workbook", source, file: finalFile, captureMode: plan.mode, sections: plan.count };
  }

  const parts = [];
  for (const [tabIndex, label] of plan.labels.entries()) {
    const exact = new RegExp("^\\s*" + label.replace(/[^a-z0-9\s-]/gi, "\\$&") + "\\s*$", "i");
    const candidate = page.locator(plan.selector).filter({ hasText: exact }).first();
    if (!(await candidate.count())) throw new Error("A1 Day " + lesson.day + " missing workbook tab: " + label);
    await candidate.click({ timeout: 15000 });
    if (await candidate.getAttribute("role") === "tab" ||
        await candidate.getAttribute("aria-selected") !== null ||
        await candidate.getAttribute("data-active") !== null) {
      await page.waitForFunction(({ selector, label }) => {
        const normalize = (text) => String(text || "").replace(/\s+/g, " ").trim();
        return [...document.querySelectorAll(selector)].some((item) =>
          normalize(item.textContent) === label &&
          (item.getAttribute("aria-selected") === "true" || item.getAttribute("data-active") === "true"));
      }, { selector: plan.selector, label }, { timeout: 10000 });
    }
    await waitForCourseHydration(page, lesson.day, label);
    const partFile = path.join(renderDir, base + "-section-" + (tabIndex + 1) + ".pdf");
    await printA1Page(page, partFile, lesson.day, label);
    parts.push(partFile);
  }
  const output = await PDFDocument.create();
  for (const part of parts) {
    const sourcePdf = await PDFDocument.load(fs.readFileSync(part));
    const pages = await output.copyPages(sourcePdf, sourcePdf.getPageIndices());
    pages.forEach((item) => output.addPage(item));
  }
  fs.writeFileSync(finalFile, await output.save());
  parts.forEach((part) => fs.rmSync(part, { force: true }));
  return { kind: "workbook", source, file: finalFile, captureMode: plan.mode, sections: plan.labels };
};

const WORKBOOK_KINDS = new Set(["workbook"]);
const getInternalRenderUrl = (target) => {
  const url = new URL(target.url, baseUrl);
  if (WORKBOOK_KINDS.has(target.kind)) {
    // A1 workbook pages normally pass through Falowen Radio first. For an
    // administration PDF we need the workbook itself, so mark Radio complete.
    url.searchParams.set("radio", "done");
  }
  return url.toString();
};

const hasVisibleRadioGate = async (page) => {
  const gate = page.locator('[data-a1-radio-first-workbook-route="true"]');
  if (!(await gate.count())) return false;
  return gate.first().isVisible().catch(() => false);
};

const ensureInternalPage = async (page, target, day) => {
  const url = getInternalRenderUrl(target);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForStablePage(page);
  await waitForCourseHydration(page, day, target.kind);

  if (await isPublicOrLogin(page)) {
    throw new Error(`Day ${day} ${target.kind} route is not authenticated: ${url}`);
  }

  const currentUrl = new URL(page.url());
  const expectedUrl = new URL(url);
  const text = await getBodyText(page);
  const fatalShell = /Unexpected Application Error|404 Not Found|Page not found|Loading failed/i.test(text);
  const radioGate = WORKBOOK_KINDS.has(target.kind) ? await hasVisibleRadioGate(page) : false;
  const isFalowenCoursePage = currentUrl.origin === expectedUrl.origin && currentUrl.pathname.startsWith("/campus/course/");

  if (!isFalowenCoursePage) {
    throw new Error(`Day ${day} ${target.kind} left the expected Falowen course route: ${page.url()}`);
  }
  if (fatalShell) {
    throw new Error(`Day ${day} ${target.kind} rendered an error page: ${url}`);
  }
  if (radioGate) {
    throw new Error(`Day ${day} ${target.kind} stopped on the visible Falowen Radio gate instead of workbook content: ${url}`);
  }
  if (!isA1PdfReadyText(text)) {
    throw new Error(`Day ${day} ${target.kind} rendered an empty or loading page: ${url}`);
  }

  return url;
};

const renderInternalTarget = async (page, lesson, target, index) => {
  const url = await ensureInternalPage(page, target, lesson.day);
  if (target.kind === "workbook") return captureA1WorkbookSections(page, lesson, index, url);
  const file = path.join(renderDir, String(lesson.day).padStart(2, "0") + "-" +
    String(index + 1).padStart(2, "0") + "-" + target.kind + ".pdf");
  await printA1Page(page, file, lesson.day, target.kind);
  return { kind: target.kind, source: url, file, captureMode: "single-page" };
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

const addCover = async (output) => {
  const font = await output.embedFont(StandardFonts.Helvetica);
  const bold = await output.embedFont(StandardFonts.HelveticaBold);
  const cover = output.addPage([595.28, 841.89]);
  cover.drawText("FALOWEN", { x: 54, y: 755, size: 28, font: bold, color: rgb(0.08, 0.25, 0.65) });
  cover.drawText("A1 Grammar Notes & Workbook", { x: 54, y: 670, size: 28, font: bold });
  cover.drawText("Grammar notes and workbook practice", { x: 54, y: 625, size: 15, font });
  cover.drawText("Generated for administration", { x: 54, y: 110, size: 11, font });
};

const appendPdfFile = async (output, file) => {
  const source = await PDFDocument.load(fs.readFileSync(file));
  const pages = await output.copyPages(source, source.getPageIndices());
  pages.forEach((page) => output.addPage(page));
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
        const result = target.sourceType === "external-pdf"
          ? await downloadExternalPdf(lesson, target, index)
          : await renderInternalTarget(page, lesson, target, index);
        outputs.push(result);
      }
      rendered.set(lesson.day, outputs);
      diagnostics.lessons.push({
        day: lesson.day,
        title: lesson.title,
        status: "rendered",
        targets: outputs.map(({ kind, source, captureMode, sections }) => ({ kind, source, captureMode, sections })),
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
await addCover(output);
const pdfNavigation = await createPdfNavigation(output, { level: "A1" });
const navigation = [];

for (const lesson of plan.lessons) {
  const lessonOutputs = rendered.get(lesson.day) || [];
  const sections = [];

  for (const kind of ["grammar", "workbook"]) {
    const items = lessonOutputs.filter((item) => item.kind === kind);
    if (!items.length) continue;

    const label = kind === "grammar" ? "Grammar" : "Workbook";
    const dividerPage = pdfNavigation.addSectionDivider({ lesson, sectionLabel: label });
    sections.push({ label, page: dividerPage });
    for (const item of items) await appendPdfFile(output, item.file);
  }

  if (!sections.length) {
    throw new Error(`A1 Day ${lesson.day}: no Grammar or Workbook section was available for the final PDF.`);
  }

  navigation.push({ day: lesson.day, title: lesson.title, sections });
}

pdfNavigation.finalize(navigation);

const footerFont = await output.embedFont(StandardFonts.Helvetica);
const pages = output.getPages();
pages.forEach((page, index) => {
  const { width } = page.getSize();
  page.drawText("Falowen Learning Hub", { x: 36, y: 20, size: 8, font: footerFont, color: rgb(0.45, 0.5, 0.58) });
  page.drawText(`${index + 1} / ${pages.length}`, { x: width - 70, y: 20, size: 8, font: footerFont, color: rgb(0.45, 0.5, 0.58) });
});

fs.writeFileSync(finalPdfPath, await output.save());
diagnostics.completedAt = new Date().toISOString();
diagnostics.pdfPath = finalPdfPath;
writeDiagnostics();
console.log(`Created ${finalPdfPath}`);
