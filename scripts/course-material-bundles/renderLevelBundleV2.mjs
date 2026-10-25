import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createPdfNavigation } from "./pdfNavigation.mjs";
import { addA2RetailCover } from "./a2RetailCover.mjs";
import { a2PrintCss, sanitizeA2PrintDocument, extractA2PrintSnapshot, a2SectionReady, findA2PdfLeaks } from "./a2PdfPrint.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const level = String(process.argv[2] || "").trim().toUpperCase();
const baseUrl = String(process.env.FALOWEN_PDF_BASE_URL || "https://www.falowen.app").replace(/\/$/, "");
const a2EditorialLocal = level === "A2" && process.env.FALOWEN_A2_EDITORIAL_PRINT === "true";
// Never permit an editorial preview against Falowen production, a public
// preview, or a non-loopback host. Print-only access is not a student role.
if (a2EditorialLocal) {
  const target = new URL(baseUrl);
  if (target.protocol !== "http:" ||
    !["127.0.0.1", "localhost"].includes(target.hostname) ||
    target.port !== "4173" || target.username || target.password) {
    throw new Error("A2 editorial print requires a local-only Vite server on http://127.0.0.1:4173.");
  }
}
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

const diagnostics = { level, rendererVersion: 8, startedAt: new Date().toISOString(), lessons: [] };
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
  // The A2 lesson title also appears on intermediate shells and course hubs.
  // Only the actual, visible authenticated workbook tabs establish readiness.
  if (level === "A2") {
    const nav = page.locator("[data-workbook-tab-navigation]").first();
    if (!(await nav.isVisible().catch(() => false))) return false;
    // Count real accessible workbook controls; do not parse translated Teil labels.
    // The old escaped-whitespace regex rejected genuine A2 navigation.
    const tabs = nav.getByRole("tab");
    return (await tabs.count()) >= 2 &&
      (await nav.getByRole("tab", { name: /^Grammar/i }).count()) === 1;
  }
  const title = String(lesson?.title || "").trim();
  if (title && text.toLowerCase().includes(title.toLowerCase())) return true;

  // A2/B1 workbook routes do not all repeat the manifest title in the page
  // heading. Their section tabs are a more stable indication that the
  // authenticated lesson has loaded. Without this check, a valid workbook can
  // be mistaken for a logged-out page and the renderer navigates an already
  // authenticated user to /login, where no login form is rendered.
  if (level === "A2" || level === "B1") {
    const workbookTabs = page.locator('[role="tab"], button').filter({
      hasText: /^\s*(?:Grammar|Teil\s+[1-4])(?:\s*[·:–—-].*)?\s*$/i,
    });
    if (await workbookTabs.count()) return true;
    return /Workbook|Arbeitsbuch|Grammar|Grammatik|Kapitel|Course Book|Übung|Ubung|Aufgabe/i.test(text) && text.length > 500;
  }

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

const getLoginForm = (page) =>
  page.locator("form").filter({ hasText: /Email or student code/i }).first();

const LOGIN_FAILURE_PATTERN =
  /Password mismatch|could not find an account|cannot log in right now|permission denied|too many login attempts|could not connect to the internet|student account cannot log in/i;

const waitForLoginCompletion = async (page) => {
  await page.waitForFunction(
    () => {
      const bodyText = document.body?.innerText || "";
      const forms = Array.from(document.querySelectorAll("form"));
      const loginFormVisible = forms.some((form) => {
        const text = form.innerText || "";
        const style = window.getComputedStyle(form);
        const rect = form.getBoundingClientRect();
        return (
          /Email or student code/i.test(text) &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });
      const failed =
        /Password mismatch|could not find an account|cannot log in right now|permission denied|too many login attempts|could not connect to the internet|student account cannot log in/i.test(
          bodyText,
        );
      return failed || !loginFormVisible;
    },
    undefined,
    { timeout: 30000 },
  );

  await waitForPage(page);

  const authText = await getBodyText(page);
  if (LOGIN_FAILURE_PATTERN.test(authText)) {
    throw new Error(`Falowen PDF login failed: ${authText.slice(0, 500)}`);
  }

  const loginForm = getLoginForm(page);
  if (await loginForm.isVisible().catch(() => false)) {
    throw new Error(
      "Falowen PDF login did not complete: the login form is still visible after submitting credentials.",
    );
  }

  // Do not interrupt Firebase while it is persisting the newly authenticated
  // user to browser storage. The previous renderer navigated immediately after
  // clicking Log in, which could reload the app before the auth session was
  // durable and send the lesson back to the public landing page.
  await page.waitForTimeout(1200);
};

const openLessonWithAuthHydration = async (page, lesson, targetUrl) => {
  const delays = [0, 1200, 2500];
  for (let attempt = 0; attempt < delays.length; attempt += 1) {
    if (delays[attempt]) await page.waitForTimeout(delays[attempt]);
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await waitForPage(page);

    // Firebase can briefly show the auth-loading/public shell while restoring
    // IndexedDB state after a hard navigation. Give the authenticated lesson a
    // short window to replace that transient screen before deciding it failed.
    for (let check = 0; check < 8; check += 1) {
      if (await hasLessonContent(page, lesson)) return true;
      if (!(await isPublicLanding(page)) && level !== "A2") break;
      // A2 can show the lesson title before React mounts its real workbook nav.
      await page.waitForTimeout(500);
    }

    if (await hasLessonContent(page, lesson)) return true;
  }

  return false;
};

const openLogin = async (page) => {
  const loginUrl = `${baseUrl}/login/`;
  console.log(`Opening Falowen login directly: ${loginUrl}`);
  await page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForPage(page);

  const loginForm = getLoginForm(page);
  await loginForm.waitFor({ state: "visible", timeout: 15000 });

  const identityInput = loginForm.locator('input[type="text"], input[type="email"]').first();
  const passwordInput = loginForm.locator('input[type="password"]').first();
  await identityInput.waitFor({ state: "visible", timeout: 15000 });
  await passwordInput.waitFor({ state: "visible", timeout: 15000 });
};

const submitLogin = async (page) => {
  const { email, password } = credentials();
  const loginForm = getLoginForm(page);
  await loginForm.waitFor({ state: "visible", timeout: 15000 });

  const identityInput = loginForm.locator('input[type="text"], input[type="email"]').first();
  const passwordInput = loginForm.locator('input[type="password"]').first();
  if (!(await identityInput.count()) || !(await passwordInput.count())) {
    throw new Error("Falowen login form fields were not found.");
  }

  await identityInput.fill(email);
  await passwordInput.fill(password);

  const submit = loginForm.getByRole("button", { name: /^Log in$/i }).first();
  if (!(await submit.count())) throw new Error("Falowen login submit button was not found.");
  await submit.click({ timeout: 10000 });
  await waitForLoginCompletion(page);
};

const ensureAuthenticatedLesson = async (page, lesson) => {
  const target = new URL(lesson.route, baseUrl);
  // A2 workbooks are radio-first in the student app. The PDF needs the
  // complete educational workbook, not the Falowen Radio introduction gate.
  // This query param only applies to the private Playwright export session;
  // no student navigation, completion or recorded progress is changed.
  if (level === "A2" && target.searchParams.get("radio") !== "done") {
    target.searchParams.set("radio", "done");
  }
  const targetUrl = target.toString();
  const initiallyLoaded = await openLessonWithAuthHydration(page, lesson, targetUrl);
  if (initiallyLoaded) return;

  const loginFormAlreadyVisible = await getLoginForm(page).isVisible().catch(() => false);
  if (!loginFormAlreadyVisible) {
    await openLogin(page);
  }

  await submitLogin(page);

  if (await openLessonWithAuthHydration(page, lesson, targetUrl)) return;

  if (level === "A2") {
    // Never write student names, course submissions or personalized HTML
    // into a public GitHub Actions log (even on a failed proof).
    const safeState = await page.evaluate(() => {
      const body = document.body?.innerText || "";
      return {
        workbookHeadingPresent: /A2\s*[·:]?\s*Day\s*\d+\s*Workbook/i.test(body),
        loginFormPresent: Boolean(document.querySelector('input[type="password"]')),
        radioGatePresent: Boolean(document.querySelector("[data-radio-first-workbook-gate]")),
        workbookNavPresent: Boolean(document.querySelector("[data-workbook-tab-navigation]")),
        nativeTabCount: document.querySelectorAll('[role="tab"]').length,
        knownAppError: /Unexpected Application Error|permission denied|Missing or insufficient permissions/i.test(body),
      };
    });
    const safePath = new URL(page.url()).pathname;
    throw new Error(
      `A2 Day ${lesson.day}: workbook tabs did not mount after authenticated navigation. ` +
      `Path: ${safePath}; safe UI state: ${JSON.stringify(safeState)}. ` +
      "Check deployed A2 tab rendering and PDF test-account course access before another full build.",
    );
  }
  const preview = (await getBodyText(page)).slice(0, 700);
  throw new Error(
    `Authentication completed but Day ${lesson.day} still did not show the real lesson after auth hydration retries. Current URL: ${page.url()}. Preview: ${preview}`,
  );
};

const injectPrintMode = async (page) => {
  await page.emulateMedia({ media: "print" });
  if (level === "A2") return page.addStyleTag({ content: a2PrintCss });
  return page.addStyleTag({ content: `
    @page { size: A4; margin: 12mm 10mm 15mm; }
    html, body { background: #fff !important; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    nav, [role="navigation"], [role="tablist"], .book-print-stamp,
    .book-pdf-download-action, iframe, video, button, input[type="checkbox"],
    [class*="study-buddy" i], [class*="floating" i], [class*="chat" i],
    [class*="video-card" i], [class*="videoCard"], [class*="thumbnail" i],
    [data-pdf-exclude], [aria-label*="Study Buddy" i], [aria-label*="download" i],
    [aria-label*="video" i] { display: none !important; }
    section:has(> iframe), section:has(> video), article:has(> iframe), article:has(> video) { display: none !important; }
    [style*="position: sticky"], [style*="position: fixed"] { position: static !important; }
    section, article, table, pre, blockquote { break-inside: avoid; }
    img { max-width: 100% !important; }
    a { color: inherit !important; text-decoration: none !important; }
  ` });
};

const waitForA2PrintableSection = async (page, lesson, suffix) => {
  if (level !== "A2") return;
  const section = suffix === "grammar" ? "grammar" : suffix.replace(/^workbook-/, "");
  // React section tabs may finish rehydrating AFTER the navigation click.
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const snapshot = await page.evaluate(extractA2PrintSnapshot);
    if (a2SectionReady(section, snapshot)) return;
    await page.waitForTimeout(500);
  }
  // Never include private learner text in Actions logs.
  throw new Error("A2 Day " + lesson.day + " " + section +
    ": printable content did not hydrate after 4 seconds; route " + lesson.route);
};

const saveCurrentPagePdf = async (page, lesson, suffix = "lesson") => {
  await waitForA2PrintableSection(page, lesson, suffix);
  const printStyle = await injectPrintMode(page);
  const file = path.join(renderDir, `${String(lesson.day).padStart(2, "0")}-${suffix}.pdf`);
  try {
    if (level === "A2") {
      await page.evaluate(sanitizeA2PrintDocument, suffix);
      const printed = await page.evaluate(extractA2PrintSnapshot);
      const leaks = findA2PdfLeaks(printed.text);
      if (leaks.length) throw new Error(
        "A2 Day " + lesson.day + " " + suffix + ": private or web-only content remains: " + leaks.join(", "));
    }
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true, timeout: 30000 });
  } finally {
    await printStyle.evaluate((style) => style.remove()).catch(() => {});
    // page.emulateMedia(print) persists after page.pdf(). Without resetting it,
    // @media print keeps WorkbookTabNav hidden and the following Teil tabs
    // appear "unavailable" even though they were rendered correctly.
    if (level === "A2") await page.emulateMedia({ media: "screen" });
  }
  return { tab: suffix, file };
};

const renderA1Lesson = async (page, lesson) => {
  await ensureAuthenticatedLesson(page, lesson);
  return [await saveCurrentPagePdf(page, lesson, "lesson")];
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

const renderGuidedLesson = async (page, lesson) => {
  await ensureAuthenticatedLesson(page, lesson);
  const tabSpecs = [
    { key: "learn", names: ["1. Learn", "Learn", "Grammar"] },
    { key: "speak", names: ["2. Speak", "Speak"] },
    { key: "write", names: ["3. Write", "Write", "Workbook"] },
  ];
  const rendered = [];
  for (const tab of tabSpecs) {
    const clicked = await clickTab(page, tab.names);
    if (!clicked && tab.key !== "learn") continue;
    rendered.push(await saveCurrentPagePdf(page, lesson, tab.key));
  }
  if (!rendered.length) throw new Error(`No guided lesson sections were rendered for Day ${lesson.day}.`);
  return rendered;
};

const clickWorkbookTab = async (page, names) => {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const exactName = new RegExp(`^\\s*${escaped}(?:\\s*[·:–—-].*)?\\s*$`, "i");
    const candidates = [
      page.getByRole("tab", { name: exactName }).first(),
      page.getByRole("button", { name: exactName }).first(),
      page.locator('[role="tab"], button').filter({ hasText: exactName }).first(),
    ];
    for (const tab of candidates) {
      if (!(await tab.count()) || !(await tab.isVisible().catch(() => false))) continue;
      if (level === "A2" && await tab.isDisabled().catch(() => false)) {
        const aria = String(await tab.getAttribute("aria-label") || "");
        const lockedByTimer = /locked until timed work starts/i.test(aria);
        // This is a real learner assessment gate. Never start/submit an
        // attempt or forge Firestore progress merely to create a retail PDF.
        throw new Error(
          "A2 PDF export blocked: " + name +
          (lockedByTimer ? " requires a timed assignment to start." : " is disabled.") +
          " Use a dedicated PDF test account with legitimately completed/reviewed " +
          "lesson access, or implement an authorized read-only print data path. " +
          "No learner timer or submission was changed."
        );
      }
      await tab.click({ timeout: 10000 });
      await page.waitForTimeout(350);
      return true;
    }
  }
  return false;
};

const mergeRenderedSections = async (items, outputFile) => {
  const output = await PDFDocument.create();
  for (const item of items) {
    const source = await PDFDocument.load(fs.readFileSync(item.file));
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }
  fs.writeFileSync(outputFile, await output.save());
  return outputFile;
};

const renderA2B1Lesson = async (page, lesson) => {
  await ensureAuthenticatedLesson(page, lesson);

  const grammarClicked = await clickWorkbookTab(page, ["Grammar"]);
  if (!grammarClicked) {
    // Log only structural boolean flags and known section labels, never
    // potentially private body text, learner names or form contents.
    const structure = await page.evaluate(() => {
      const visible = el => Boolean(el.getClientRects().length) &&
        getComputedStyle(el).display !== "none";
      const labels = [...document.querySelectorAll('[role="tab"],button')]
        .filter(visible)
        .map(el => (el.getAttribute("aria-label") || el.textContent || "").trim())
        .filter(label => /^(Grammar|Grammatik|Teil\\s*[1-4]|Continue|Weiter|Enter workbook|Open workbook)/i.test(label))
        .slice(0, 12).map(label => label.slice(0, 32));
      return {
        radioGate: Boolean(document.querySelector("[data-radio-first-workbook-gate]")),
        workbookNav: Boolean(document.querySelector("[data-workbook-tab-navigation]")),
        grammarPanel: Boolean(document.querySelector("[data-a2-focused-grammar]")),
        nativeTabCount: document.querySelectorAll('[role="tab"]').length,
        recognizedActions: labels,
      };
    });
    const routePath = new URL(page.url()).pathname;
    throw new Error(`${level} Day ${lesson.day}: Grammar section was not available. ` +
      `Route: ${routePath}; structure: ${JSON.stringify(structure)}.`);
  }
  const grammar = await saveCurrentPagePdf(page, lesson, "grammar");

  // The student workbook is tabbed in the live app, but the downloadable
  // course PDF should expose a single Workbook section. Collect the available
  // exercise tabs internally, exclude Ref/Submit, then merge them into one
  // workbook PDF behind the lesson's Grammar section.
  const workbookTabSpecs = [
    { key: "teil-1", names: ["Teil 1"] },
    { key: "teil-2", names: ["Teil 2"] },
    { key: "teil-3", names: ["Teil 3"] },
    { key: "teil-4", names: ["Teil 4"] },
  ];
  const workbookParts = [];
  for (const tabSpec of workbookTabSpecs) {
    const clicked = await clickWorkbookTab(page, tabSpec.names);
    if (!clicked) {
      if (level === "A2" && await page.getByRole("tab", { name: new RegExp(tabSpec.names[0], "i") }).count()) {
        throw new Error("A2 Day " + lesson.day + ": required visible workbook tab " +
          tabSpec.names[0] + " could not be opened (possibly locked or still loading).");
      }
      console.warn(`${level} Day ${lesson.day}: optional workbook tab ${tabSpec.names[0]} not present.`);
      continue;
    }
    workbookParts.push(await saveCurrentPagePdf(page, lesson, `workbook-${tabSpec.key}`));
  }

  if (!workbookParts.length) {
    throw new Error(`No workbook exercises were rendered for ${level} Day ${lesson.day}.`);
  }

  const workbookFile = path.join(
    renderDir,
    `${String(lesson.day).padStart(2, "0")}-workbook.pdf`,
  );
  await mergeRenderedSections(workbookParts, workbookFile);
  workbookParts.forEach(({ file }) => fs.rmSync(file, { force: true }));

  return [grammar, { tab: "workbook", file: workbookFile }];
};

const renderLesson = async (page, lesson) => {
  if (level === "A1") return renderA1Lesson(page, lesson);
  if (level === "A2" || level === "B1") return renderA2B1Lesson(page, lesson);
  if (level === "B2" || level === "C1" || level === "C2") return renderGuidedLesson(page, lesson);
  await ensureAuthenticatedLesson(page, lesson);
  return [await saveCurrentPagePdf(page, lesson, "lesson")];
};

const addCover = async (output) => {
  if (level === "A2") return addA2RetailCover(output);
  const font = await output.embedFont(StandardFonts.Helvetica);
  const bold = await output.embedFont(StandardFonts.HelveticaBold);
  const cover = output.addPage([595.28, 841.89]);
  cover.drawText("FALOWEN", { x: 54, y: 755, size: 28, font: bold, color: rgb(0.08, 0.25, 0.65) });
  cover.drawText(`${level} Course Materials`, { x: 54, y: 670, size: 30, font: bold });
  cover.drawText(["A1", "A2", "B1"].includes(level) ? "Grammar Notes & Workbook" : "Course materials", { x: 54, y: 625, size: 15, font });
  cover.drawText(`Curriculum version: ${manifest.generatedAt.slice(0, 10)}`, { x: 54, y: 570, size: 11, font });
  cover.drawText(`Printable lessons: ${manifest.printableLessonCount}`, { x: 54, y: 548, size: 11, font });
};

const addLegacyContents = async (output, printableLessons) => {
  const font = await output.embedFont(StandardFonts.Helvetica);
  const bold = await output.embedFont(StandardFonts.HelveticaBold);
  let toc = output.addPage([595.28, 841.89]);
  toc.drawText("Contents", { x: 54, y: 780, size: 24, font: bold });
  let y = 744;
  for (const lesson of printableLessons) {
    const label = `Day ${lesson.day} · ${lesson.title}`;
    const lines = label.length > 78 ? [label.slice(0, 78), label.slice(78)] : [label];
    for (const line of lines) {
      toc.drawText(line, { x: 58, y, size: 10.5, font });
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

const appendPdfFile = async (output, file) => {
  const source = await PDFDocument.load(fs.readFileSync(file));
  const pages = await output.copyPages(source, source.getPageIndices());
  pages.forEach((page) => output.addPage(page));
};

const mergeBundle = async (renderedLessons) => {
  const output = await PDFDocument.create();
  const printableLessons = manifest.lessons.filter((lesson) => lesson.printKind !== "excluded");
  await addCover(output);

  if (level === "A2" || level === "B1") {
    const pdfNavigation = await createPdfNavigation(output, { level });
    const navigation = [];

    for (const lesson of printableLessons) {
      const files = renderedLessons.get(lesson.day) || [];
      const sections = [];
      for (const item of files) {
        if (item.tab !== "grammar" && item.tab !== "workbook") continue;
        const label = item.tab === "grammar" ? "Grammar" : "Workbook";
        const dividerPage = pdfNavigation.addSectionDivider({ lesson, sectionLabel: label });
        sections.push({ label, page: dividerPage });
        await appendPdfFile(output, item.file);
      }

      if (sections.length !== 2 || sections[0]?.label !== "Grammar" || sections[1]?.label !== "Workbook") {
        throw new Error(
          `${level} Day ${lesson.day}: expected exactly Grammar then Workbook in the final PDF, received ${sections.map((section) => section.label).join(", ") || "nothing"}.`,
        );
      }

      navigation.push({ day: lesson.day, title: lesson.title, sections });
    }

    pdfNavigation.finalize(navigation);
  } else {
    await addLegacyContents(output, printableLessons);
    for (const lesson of printableLessons) {
      const files = renderedLessons.get(lesson.day) || [];
      for (const item of files) await appendPdfFile(output, item.file);
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
if (a2EditorialLocal) {
  // Enforce read-only access at the browser network layer too: do not let
  // incidental React effects write assessment records to Firestore.
  await context.route(/https:\/\/firestore\.googleapis\.com\/.*(?:Firestore\/Write\/channel|documents:commit|documents:batchWrite)/i,
    async route => route.abort("blockedbyclient"));
}
const page = await context.newPage();
if (a2EditorialLocal) {
  // This flag exists only inside this private local browser context.
  // The A2 React component also requires Vite DEV and loopback hostname.
  await page.addInitScript(() => {
    Object.defineProperty(window, "__FALOWEN_A2_PDF_EDITORIAL__", {
      value: true, writable: false, configurable: false,
    });
  });
}
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
      diagnostics.lessons.push({
        day: lesson.day,
        title: lesson.title,
        status: "rendered",
        sections: rendered.map((item) => item.tab),
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
      });
    } catch (error) {
      diagnostics.lessons.push({
        day: lesson.day,
        title: lesson.title,
        status: "failed",
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
        error: error instanceof Error ? error.message : String(error),
      });
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

await mergeBundle(renderedLessons);
diagnostics.completedAt = new Date().toISOString();
diagnostics.pdfPath = finalPdfPath;
writeDiagnostics();
const stats = fs.statSync(finalPdfPath);
console.log(`Created ${finalPdfPath}`);
console.log(`PDF size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
