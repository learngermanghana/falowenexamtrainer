import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createPdfNavigation } from "./pdfNavigation.mjs";
import { buildPdfLessonTargetUrl } from "./pdfLessonRoute.mjs";
import { buildA2ReadOnlyPrintHtml } from "./a2PrintableCompanions.mjs";

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
  // A Radio introduction is not the printable workbook, even when its copy mentions exercises.
  if (await page.locator('[data-radio-first-workbook-gate="true"]').count()) return false;
  if (await isPublicLanding(page)) return false;
  // A lesson overview, redirect shell, or Radio preview may mention Grammar
  // without rendering its actual tab navigation. Only the *real* tabbed workbook
  // is acceptable for A2/B1 PDF generation.
  if (level === "A2" || level === "B1") {
    const grammarTab = page.locator('[data-workbook-tab-navigation] [role="tab"][aria-label^="Grammar"]');
    return (await grammarTab.count()) > 0 && await grammarTab.first().isVisible().catch(() => false);
  }

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
      // A2/B1 workbooks may render their React tabs a little after the shell.
      // Do not treat a generic course overview as the final destination.
      if (level !== "A2" && level !== "B1" && !(await isPublicLanding(page))) break;
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
  const targetUrl = buildPdfLessonTargetUrl(lesson.route, baseUrl, level);
  const initiallyLoaded = await openLessonWithAuthHydration(page, lesson, targetUrl);
  if (initiallyLoaded) return;

  const loginFormAlreadyVisible = await getLoginForm(page).isVisible().catch(() => false);
  if (!loginFormAlreadyVisible) {
    await openLogin(page);
  }

  await submitLogin(page);

  if (await openLessonWithAuthHydration(page, lesson, targetUrl)) return;

  const preview = (await getBodyText(page)).slice(0, 700);
  throw new Error(
    `Authentication completed but Day ${lesson.day} still did not show the real lesson after auth hydration retries. Current URL: ${page.url()}. Preview: ${preview}`,
  );
};

const injectPrintMode = async (page) => {
  await page.emulateMedia({ media: "print" });
  return page.addStyleTag({ content: `
    @page { size: A4; margin: 12mm 10mm 15mm; }
    html, body { background: #fff !important; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    nav, [role="navigation"], [role="tablist"], [data-workbook-tab-navigation], .book-print-stamp,
    [data-self-learning-supporting-materials], [data-teacher-lecture-support],
    [data-timed-assignment], section[aria-label="Assessment rules"],
    .book-pdf-download-action, iframe, video, audio, button, input[type="checkbox"],
    [class*="study-buddy" i], [class*="floating" i], [class*="chat" i],
    [class*="video-card" i], [class*="videoCard"], [class*="thumbnail" i],
    [data-pdf-exclude], [aria-label*="Study Buddy" i], [aria-label*="download" i],
    [aria-label*="video" i] { display: none !important; }
    section:has(> iframe), section:has(> video), article:has(> iframe), article:has(> video) { display: none !important; }
    [style*="position: sticky"], [style*="position: fixed"] { position: static !important; }
    section, article { break-inside: auto; }
    table, pre, blockquote { break-inside: avoid; }
    img { max-width: 100% !important; }
    img[src*="images.unsplash.com"] { display: none !important; }
    div:has(> iframe), div:has(> video) { display: none !important; }
    a[href="/campus/course"], a[href="/campus/course/"] { display: none !important; }
    a { color: inherit !important; text-decoration: none !important; }
  ` });
};

// Remove web-only navigation copy before printing and restore every original
// text node immediately afterwards so the live student page is unchanged.
const suppressPdfChromeText = async (page) => page.evaluate(() => {
  const replacements = [
    [/Falowen\s+Radio/gi, "pre-lesson audio"],
    [/Back\s+to\s+Course\s+Book/gi, ""],
    [/Teacher\s+Video/gi, ""],
    [/Study\s+Buddy/gi, ""],
    [/Submit\s+workbook\s+answers/gi, ""],
    [/Reference\s+Answers/gi, ""],
    [/The tabs stay visible at the top of the workbook\.?/gi, ""],
  ];
  const changes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const previous = node.textContent || "";
    let clean = previous;
    for (const [pattern, replacement] of replacements) clean = clean.replace(pattern, replacement);
    if (clean !== previous) { changes.push([node, previous]); node.textContent = clean; }
  }
  window.__falowenPdfChromeChanges = changes;
});

const restorePdfChromeText = async (page) => page.evaluate(() => {
  for (const [node, original] of window.__falowenPdfChromeChanges || []) {
    if (node.isConnected) node.textContent = original;
  }
  delete window.__falowenPdfChromeChanges;
});
const saveCurrentPagePdf = async (page, lesson, suffix = "lesson") => {
  const printStyle = await injectPrintMode(page);
  if (level === "A2" || level === "B1") await suppressPdfChromeText(page);
  const file = path.join(renderDir, `${String(lesson.day).padStart(2, "0")}-${suffix}.pdf`);
  try {
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true, timeout: 30000 });
  } finally {
    if (level === "A2" || level === "B1") await restorePdfChromeText(page).catch(() => {});
    await printStyle.evaluate((style) => style.remove()).catch(() => {});
    // page.pdf() prints the current section in print media. Restore the
    // interactive workbook before looking for the next Grammar/Teil tab;
    // otherwise the app's @media print CSS hides the tab navigation.
    await page.emulateMedia({ media: "screen" });
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

// Navigation-only diagnostics. Never persist body text, credentials or student data.
const workbookPageSnapshot = async (page) => page.evaluate(() => ({
  path: window.location.pathname,
  view: new URLSearchParams(window.location.search).get("view") || "",
  radioComplete: new URLSearchParams(window.location.search).get("radio") === "done",
  hasRadioGate: Boolean(document.querySelector('[data-radio-first-workbook-gate="true"]')),
  hasWorkbookNav: Boolean(document.querySelector('[data-workbook-tab-navigation]')),
  tabNames: [...document.querySelectorAll('[role="tab"]')].slice(0, 12)
    .map((tab) => (tab.getAttribute("aria-label") || tab.textContent || "").trim().slice(0, 75)),
  hasLoginForm: [...document.querySelectorAll("form")].some((form) =>
    /Email or student code/i.test(form.innerText || "")),
  hasPublicLanding: Boolean(document.querySelector(".falowen-public-home")),
}));

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
      if (!(await tab.isEnabled().catch(() => false))) return false;
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

// Render source-controlled practice in an inert page, without using the student
// application, unlocking timed attempts, or persisting student information.
const renderReadOnlyA2Section = async (page, lesson, part, filename = part) => {
  const content = await buildA2ReadOnlyPrintHtml({ day: lesson.day, part, lesson });
  const file = path.join(renderDir, String(lesson.day).padStart(2, "0") + "-" + filename + ".pdf");
  const printPage = await page.context().newPage();
  try {
    await printPage.setContent(content, { waitUntil: "load" });
    await printPage.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true, timeout: 30000 });
  } finally {
    await printPage.close();
  }
  return { tab: filename, file, origin: "canonical-read-only" };
};

const getWorkbookTabAvailability = async (page, name) => {
  const tab = page.getByRole("tab", { name: new RegExp("^\\s*" + name + "(?:\\s*[·:–—-].*)?\\s*$", "i") }).first();
  if (!(await tab.count())) return "absent";
  if (!(await tab.isVisible().catch(() => false))) return "hidden";
  return (await tab.isEnabled().catch(() => false)) ? "available" : "locked";
};
const renderA2B1Lesson = async (page, lesson) => {
  // A2 Day 22 is a graded interactive speaking mock, not a tabbed lesson.
  // Print only offline preparation from canonical speaking prompts.
  if (level === "A2" && Number(lesson.day) === 22) {
    const grammar = await renderReadOnlyA2Section(page, lesson, "grammar", "grammar");
    const workbook = await renderReadOnlyA2Section(page, lesson, "workbook", "workbook");
    return [grammar, workbook];
  }
  await ensureAuthenticatedLesson(page, lesson);

  const grammarClicked = await clickWorkbookTab(page, ["Grammar"]);
  if (!grammarClicked) {
    const snapshot = await workbookPageSnapshot(page);
    console.error("PDF workbook navigation diagnostic:", JSON.stringify(snapshot));
    throw new Error(`${level} Day ${lesson.day}: Grammar section was not available. Navigation: ${JSON.stringify(snapshot)}`);
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
    const availability = await getWorkbookTabAvailability(page, tabSpec.names[0]);
    if (availability === "absent") {
      console.log(`${level} Day ${lesson.day}: ${tabSpec.names[0]} not present in lesson tab profile.`);
      continue;
    }
    if (availability === "hidden")
      throw new Error(`${level} Day ${lesson.day}: ${tabSpec.names[0]} unexpectedly hidden.`);
    if (availability === "locked") {
      if (level !== "A2") throw new Error(`${level} Day ${lesson.day}: locked ${tabSpec.names[0]} has no print companion.`);
      const printable = await renderReadOnlyA2Section(page, lesson, tabSpec.key, `workbook-${tabSpec.key}`);
      workbookParts.push(printable);
      console.log(`A2 Day ${lesson.day}: printed locked ${tabSpec.names[0]} read-only from canonical data.`);
      continue;
    }
    const clicked = await clickWorkbookTab(page, tabSpec.names);
    if (!clicked) throw new Error(`${level} Day ${lesson.day}: ${tabSpec.names[0]} became unclickable.`);
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

  return [grammar, { tab: "workbook", file: workbookFile, origin: workbookParts.some(item => item.origin === "canonical-read-only") ? "mixed-live-and-read-only" : "live-workbook" }];
};

const renderLesson = async (page, lesson) => {
  if (level === "A1") return renderA1Lesson(page, lesson);
  if (level === "A2" || level === "B1") return renderA2B1Lesson(page, lesson);
  if (level === "B2" || level === "C1" || level === "C2") return renderGuidedLesson(page, lesson);
  await ensureAuthenticatedLesson(page, lesson);
  return [await saveCurrentPagePdf(page, lesson, "lesson")];
};

const addCover = async (output) => {
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
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(45000);
const printableLessons = manifest.lessons.filter((lesson) => lesson.printKind !== "excluded");
const renderedLessons = new Map();

// Only navigation timeouts are retried. Incorrect or incomplete lesson content
// must fail immediately; this job never starts assessment attempts or writes to Firestore.
const renderWithTransientNavigationRetry = async (page, lesson) => {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await renderLesson(page, lesson);
    } catch (error) {
      const transient = error?.name === "TimeoutError" ||
        /net::ERR_|Navigation timeout|Timeout \d+ms exceeded/i.test(String(error?.message || ""));
      if (!transient || attempt === 3) throw error;
      console.warn(`${level} Day ${lesson.day}: transient navigation timeout (attempt ${attempt}/3); reopening lesson.`);
      await page.goto("about:blank", { waitUntil: "domcontentloaded" }).catch(() => {});
      await page.waitForTimeout(1000 * attempt);
    }
  }
};

try {
  for (const lesson of printableLessons) {
    const startedAt = Date.now();
    console.log(`::group::Rendering ${level} Day ${lesson.day}: ${lesson.title}`);
    try {
      const rendered = await renderWithTransientNavigationRetry(page, lesson);
      renderedLessons.set(lesson.day, rendered);
      diagnostics.lessons.push({
        day: lesson.day,
        title: lesson.title,
        status: "rendered",
        sections: rendered.map((item) => item.tab),
        origins: rendered.map((item) => item.origin || "live-workbook"),
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
      });
    } catch (error) {
      diagnostics.lessons.push({
        day: lesson.day,
        title: lesson.title,
        status: "failed",
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
        error: error instanceof Error ? error.message : String(error),
        ...(level === "A2" || level === "B1" ? { navigation: await workbookPageSnapshot(page).catch(() => null) } : {}),
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
