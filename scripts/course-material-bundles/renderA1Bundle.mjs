import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createPdfNavigation } from "./pdfNavigation.mjs";
import { trimPrintedPdfTail } from "./trimPrintedPdfTail.mjs";
import { classifyA1PdfCoursePage, isRetryableA1PdfCoursePage, matchesA1PdfCourseRoute } from "./a1PdfAuthState.mjs";
import { a1PrintCss, isA1PdfReadyText, printableA1TabLabels } from "./a1PrintHelpers.mjs";
import { inspectA1PrintDocument, isA1PrintContentReady } from "./a1PdfContentReadiness.mjs";
import { prepareA1PrintDocument } from "./a1PdfPrintExtras.mjs";
import { sanitizeA1PrintDocument, findA1PrintPrivacyLeaks } from "./a1PdfPrivacy.mjs";

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
const diagnostics = { level: "A1", rendererVersion: 14, startedAt: new Date().toISOString(), lessons: [] };
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

  // Submitting the login form is not proof that Firebase finished signing in.
  // Wait for the authenticated shell, and let Firebase persist its session
  // before the next hard navigation to a protected course route.
  let formDismissed = true;
  try {
    await loginForm.waitFor({ state: "hidden", timeout: 30000 });
  } catch {
    formDismissed = false;
  }
  const authText = await getBodyText(page);
  if (/Password mismatch|could not find an account|cannot log in right now|permission denied|Login blocked|too many login attempts/i.test(authText)) {
    throw new Error("Falowen PDF account login was rejected. Check the dedicated account's access and GitHub credentials.");
  }
  if (!formDismissed) {
    throw new Error("Falowen PDF login form remained visible after signing in; refusing to render public Course Book content.");
  }
  await page.waitForTimeout(1300);
};

const injectPrintMode = async (page, kind) => {
  await page.emulateMedia({ media: "print" });
  return page.addStyleTag({ content: a1PrintCss(kind) });
};

const resetPrintMode = async (page, printStyle) => {
  await printStyle?.evaluate((style) => style.remove()).catch(() => {});
  await page.emulateMedia({ media: "screen" });
};

// React route, Firebase authentication, and profile hydration complete at
// different times. Do not confuse the transient public/home shell with a lesson.
const waitForAuthenticatedCoursePage = async (page, url, timeout = 16000) => {
  const expected = new URL(url);
  try {
    await page.waitForFunction(({ origin, pathname }) => {
      const normalizePath = (value) => String(value || "/").replace(/\/+$/, "") || "/";
      const current = new URL(window.location.href);
      const intended = new URL(origin);
      const allowed = new Set(["falowen.app", "www.falowen.app"]);
      const sameOrigin = current.origin === intended.origin;
      const sameCanonicalApp = current.protocol === "https:"
        && intended.protocol === "https:"
        && allowed.has(current.hostname)
        && allowed.has(intended.hostname);
      const body = String(document.body?.innerText || "").replace(/\s+/g, " ").trim();
      const main = String(document.querySelector("main")?.innerText || "").replace(/\s+/g, " ").trim();
      const publicShell = /German and French learning in one place|Ready to start learning\?|Create your Falowen account|Connect with your account|Returning Falowen student|Email or student code/i;
      const badScreen = /Unexpected Application Error|404 Not Found|Page not found|Loading failed/i;
      return (sameOrigin || sameCanonicalApp)
        && normalizePath(current.pathname) === normalizePath(pathname)
        && main.length >= 120
        && !/^Loading the app[.…]*/i.test(main)
        && !publicShell.test(body)
        && !badScreen.test(body);
    }, { origin: expected.origin, pathname: expected.pathname }, { timeout });
    // Node-side route classifier independently checks origin + path.
    return matchesA1PdfCourseRoute(page.url(), url);
  } catch {
    return false;
  }
};
const waitForCourseHydration = async (page, day, kind) => {
  // For tab changes, we are already on an authenticated page. Confirm that
  // a panel still has readable content; the route opener checks authentication.
  try {
    await page.waitForFunction(() => {
      const text = String(document.querySelector("main")?.innerText || "").replace(/\s+/g, " ").trim();
      return text.length >= 120 && !/^Loading the app[.…]*/i.test(text);
    }, undefined, { timeout: 20000 });
  } catch {
    throw new Error("A1 Day " + day + " " + kind + " has not hydrated to readable course content");
  }
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

const hideA1WebOnlyControls = async (page) => {
  await page.evaluate(() => {
    const hide = (node) => node?.style?.setProperty("display", "none", "important");
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();

    // These are navigation/actions for Falowen's website, not book content.
    for (const node of document.querySelectorAll("a, button")) {
      const label = normalize(node.textContent);
      if (/^(?:←\s*)?Back to Course Book$/i.test(label)
        || /^Back to workbook\s*›?$/i.test(label)
        || /^Watch teacher video$/i.test(label)
        || /^Watch AI video$/i.test(label)
        || /^Download this grammar book as PDF$/i.test(label)) hide(node);
    }

    // Hide the whole "Supporting materials" widget, not just its heading.
    // Never hide a large enclosing grammar lesson or its exercises.
    for (const node of document.querySelectorAll("h1,h2,h3,h4,strong")) {
      if (normalize(node.textContent) !== "Supporting materials") continue;
      let parent = node;
      let candidate = null;
      for (let depth = 0; depth < 5 && parent; depth++, parent = parent.parentElement) {
        const contents = normalize(parent.textContent);
        if (contents.length > 1600) break;
        if (/Watch teacher video|Watch AI video|Download this grammar book as PDF/i.test(contents)) {
          candidate = parent;
        }
      }
      hide(candidate || node);
    }
  });
};

const waitForA1PrintableContent = async (page, day, kind) => {
  let inspection = { unresolved: [], textLength: 0, sectionHeadings: 0 };
  // The authenticated course shell often displays a full lesson header while
  // React.lazy's actual grammar/workbook panel still says "Loading…".
  // Poll for the *visible section content*, not just a minimum main text length.
  for (let round = 0; round < 24; round++) {
    inspection = await page.evaluate(inspectA1PrintDocument);
    if (isA1PrintContentReady(inspection)) {
      await page.waitForTimeout(450);
      const settled = await page.evaluate(inspectA1PrintDocument);
      if (isA1PrintContentReady(settled)) return;
      inspection = settled;
    }
    await page.waitForTimeout(800);
  }
  throw new Error("A1 PDF content did not hydrate for Day " + day + " " + kind +
    "; unresolved placeholders: " + (inspection.unresolved.join(" | ") || "none") +
    "; visible characters: " + inspection.textLength +
    "; visible headings: " + inspection.sectionHeadings);
};

const printA1Page = async (page, file, day, kind, lessonUrl) => {
  const printStyle = await injectPrintMode(page, kind);
  try {
    // Remove private, asynchronous UI before the content-ready check. A live
    // saved speaking session must never block or enter a printable snapshot.
    await page.evaluate(sanitizeA1PrintDocument);
    await waitForA1PrintableContent(page, day, kind);
    await hideA1WebOnlyControls(page);
    await page.evaluate(sanitizeA1PrintDocument);
    // Never embed short-lived R2 tokens: QR points to the authenticated lesson.
    const audioCount = await page.locator("main audio").count();
    const companionUrl = new URL(lessonUrl);
    companionUrl.searchParams.delete("radio");
    const qrDataUrl = audioCount ? await QRCode.toDataURL(companionUrl.toString(), { width: 132, margin: 1 }) : "";
    await page.evaluate(prepareA1PrintDocument, { lessonUrl: companionUrl.toString(), qrDataUrl });
    const visibleText = await page.locator("main").first().innerText().catch(() => "");
    const leaked = findA1PrintPrivacyLeaks(visibleText);
    if (leaked.length) {
      // Fail closed; a PDF should never include other students' work.
      throw new Error("A1 Day " + day + " " + kind +
        " print privacy check failed: " + leaked.join(", "));
    }
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
    await trimPrintedPdfTail(file, { description: "Day " + day + " " + kind });
  } finally {
    await resetPrintMode(page, printStyle);
  }
};

const captureA1WorkbookSections = async (page, lesson, index, source) => {
  const plan = await getA1WorkbookCapturePlan(page);
  const base = String(lesson.day).padStart(2, "0") + "-" + String(index + 1).padStart(2, "0") + "-workbook";
  const finalFile = path.join(renderDir, base + ".pdf");
  if (plan.mode !== "click-tabs") {
    await printA1Page(page, finalFile, lesson.day, "workbook", source);
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
    await printA1Page(page, partFile, lesson.day, label, source);
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
  let lastState = "loading";
  let lastPath = "";

  // A hard navigation can temporarily show the public shell while IndexedDB
  // restores Firebase authentication. Wait for actual lesson content and retry
  // a bounded number of times rather than rejecting the first public frame.
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.locator("body").waitFor({ state: "visible", timeout: 15000 });

    const ready = await waitForAuthenticatedCoursePage(page, url, attempt === 1 ? 16000 : 11000);
    const bodyText = await getBodyText(page);
    const mainText = await page.locator("main").first().innerText().catch(() => "");
    const state = classifyA1PdfCoursePage({
      url: page.url(), expectedUrl: url, text: bodyText, mainText,
    });
    lastState = state;
    lastPath = new URL(page.url()).pathname;

    if (ready && state === "ready") {
      if (target.kind === "workbook" && await hasVisibleRadioGate(page)) {
        throw new Error("A1 Day " + day + " workbook stopped on the Falowen Radio gate.");
      }
      return url;
    }

    if (!isRetryableA1PdfCoursePage(state)) {
      throw new Error("A1 Day " + day + " " + target.kind + " course route cannot render: " +
        state + " (requested " + new URL(url).origin + new URL(url).pathname +
        ", resolved " + new URL(page.url()).origin + lastPath + ")");
    }

    // If a login form is still actually visible, re-authenticate only once.
    // Otherwise allow Firebase's restored session to hydrate on a fresh visit.
    if (attempt === 2) {
      const form = page.locator("form").filter({ hasText: /Email or student code/i }).first();
      if (await form.isVisible().catch(() => false)) {
        console.warn("A1 Day " + day + ": login screen still visible; renewing dedicated PDF session once.");
        await loginOnce(page);
      }
    }
    console.warn("A1 Day " + day + " " + target.kind + ": auth/content state " +
      lastState + " on attempt " + attempt + "/3; retrying protected route.");
  }

  throw new Error("A1 Day " + day + " " + target.kind +
    " never reached authenticated course content after 3 checks (" + lastState +
    ", last path " + lastPath + "). Verify PDF account access and session persistence.");
};
const renderInternalTarget = async (page, lesson, target, index) => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const url = await ensureInternalPage(page, target, lesson.day);
    try {
      if (target.kind === "workbook") return await captureA1WorkbookSections(page, lesson, index, url);
      const file = path.join(renderDir, String(lesson.day).padStart(2, "0") + "-" +
        String(index + 1).padStart(2, "0") + "-" + target.kind + ".pdf");
      await printA1Page(page, file, lesson.day, target.kind, url);
      return { kind: target.kind, source: url, file, captureMode: "single-page" };
    } catch (error) {
      // A lazy lesson chunk may succeed after a new authenticated navigation.
      // Never downgrade this to a successful PDF with a loading placeholder.
      if (!/A1 PDF content did not hydrate/.test(String(error)) || attempt === 3) throw error;
      console.warn("A1 Day " + lesson.day + " " + target.kind +
        " did not hydrate: retrying authenticated lesson (attempt " + (attempt + 1) + "/3)");
    }
  }
  throw new Error("A1 printable lesson was not rendered");
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
