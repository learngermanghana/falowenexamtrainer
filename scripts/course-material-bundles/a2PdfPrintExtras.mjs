// A2 PDF-only companion, modeled on A1's print-only cleanup. It executes
// inside the authenticated Playwright tab, never inside the student website.
export const getA2PdfLessonCompanionUrl = (route, baseUrl = "https://www.falowen.app") => {
  const url = new URL(route, baseUrl);
  // Same policy as A1: an authenticated lesson URL, never a short-lived
  // signed R2 URL, R2 object path, token, or an assessment bypass.
  if (url.protocol !== "https:" || url.hostname !== new URL(baseUrl).hostname
      || !url.pathname.startsWith("/campus/course/")) {
    throw new Error("A2 PDF audio QR must point to an authenticated Falowen course lesson");
  }
  url.search = "";
  url.hash = "";
  return url.toString();
};

export const prepareA2PrintDocument = ({ section, lessonUrl, qrDataUrl }) => {
  const root = document.querySelector("main") || document.body;
  const marked = [];
  const normalize = (s) => String(s || "").replace(/\s+/g, " ").trim();
  const hide = (node, reason) => {
    if (!node || node === root || node === document.body || node.hasAttribute("data-a2-pdf-hide")) return;
    if (node.querySelector("input[type=radio], textarea, fieldset")) return; // preserve exercises
    node.setAttribute("data-a2-pdf-hide", reason);
    marked.push(node);
  };

  // The authenticated site's real masthead is `header.app-header` in
  // web/src/App.js. It contains an h1, notification button and account controls,
  // so the text-only heuristic below deliberately misses it. Exclude it by its
  // stable application-shell component class before printing (never in the app).
  for (const header of document.querySelectorAll("header.app-header, .app-shell > .app-header")) {
    hide(header, "authenticated-site-masthead");
  }

  // A1-style masthead cleanup: website logo, notification count and account
  // badge are never lesson content. Search the entire document because the
  // global site header normally lives OUTSIDE the workbook's <main>.
  for (const candidate of document.querySelectorAll("header,nav,aside,section,div")) {
    if (candidate === root || candidate === document.body) continue;
    const text = normalize(candidate.textContent);
    if (text.length > 115 || !/\bFalowen\b/i.test(text) || !/\bFA\b/.test(text)) continue;
    if (/\b(?:Workbook|Grammar Notes|Kapitel|Assignment|Day\s*\d+)\b/i.test(text)) continue;
    if (candidate.querySelector("h1,h2,h3,input,textarea,fieldset,[role=tablist]")) continue;
    const box = candidate.getBoundingClientRect?.();
    if (box && (box.height < 10 || box.height > 170)) continue;
    hide(candidate, "site-masthead");
  }

  // The chapter divider already provides the printed lesson title. The
  // authenticated workbook card with Back, h1, and sticky tabs is navigation,
  // not a second educational heading. Do not hide any nearby h2 exercises.
  for (const title of document.querySelectorAll("h1")) {
    if (!/^A2\s*[·•-]\s*Day\s*\d+\s+Workbook\b/i.test(normalize(title.textContent))) continue;
    let node = title.parentElement;
    for (let depth = 0; depth < 3 && node && node !== root; depth++, node = node.parentElement) {
      if (node.querySelector("h2,h3,textarea,fieldset,input[type=radio]")) break;
      const text = normalize(node.textContent);
      if (text.length < 1600 && /A2\s*[·•-]\s*Day\s*\d+\s+Workbook/i.test(text)) {
        hide(node, "redundant-workbook-header");
        break;
      }
    }
  }

  // Timers, writing analyser action buttons and status notices are live-site
  // controls; keep the mind maps, writing instructions and MCQ option buttons.
  for (const timer of document.querySelectorAll(
    '[data-compact-speaking-timer], [aria-label="Teil 1 speaking timer"], .speaking-compact-timer'
  )) hide(timer, "speaking-timer");
  for (const control of document.querySelectorAll("button,a")) {
    const label = normalize(control.textContent);
    if (/^(?:Analyse my text|Analyze my text|Start speaking timer|Reset speaking timer|Pause speaking timer)$/i.test(label)) {
      hide(control, "interactive-writing-or-timer-control");
    }
  }
  for (const el of document.querySelectorAll("p,span,small,strong,div,aside")) {
    const label = normalize(el.textContent);
    if (label.length > 160 || !/^Speaking help is open by default\s+so you do not miss it\.?$/i.test(label)) continue;
    if (el.querySelector("h1,h2,h3,textarea,fieldset,input[type=radio]")) continue;
    if ([...el.children].some(child => /^Speaking help is open by default/i.test(normalize(child.textContent)))) continue;
    hide(el, "online-speaking-help-notice");
  }
  for (const node of document.querySelectorAll("details,section,aside,div")) {
    const heading = node.querySelector("summary,h2,h3,strong");
    if (!heading || node === root || node === document.body) continue;
    const title = normalize(heading.textContent);
    if (!(/^\s*A2 workbook navigation\s*$/i.test(title) ||
          /^Day\s*\d+\s*[·•-]\s*A2 workbook\s*[·•-]\s*how to complete this workbook$/i.test(title))) continue;
    if (normalize(node.textContent).length > 1300 ||
        node.querySelector("textarea,fieldset,input[type=radio],h1")) continue;
    hide(node, "online-workbook-instructions");
  }

  // Prefer component attributes where available (similar to A1 CSS). Some
  // legacy A2 lesson-resource cards lack markers, so identify their *small*
  // self-contained card using two resource labels without touching exercises.
  root.querySelectorAll(
    '[data-pdf-exclude], [data-self-learning-supporting-materials], [data-teacher-lecture-support],' +
    '[data-timed-assignment], section[aria-label="Assessment rules"],' +
    '[data-a2-day16-teacher-lecture], [data-a2-day17-teacher-lecture]'
  ).forEach(node => hide(node, "resource-or-assessment-ui"));

  // Deployed web builds may not yet carry data-pdf-exclude attributes.
  // Find only the stand-alone WorkbookStartGuide resource section. Its heading
  // and navigation links distinguish it from any academic lesson section.
  for (const title of document.querySelectorAll("h2,h3")) {
    if (normalize(title.textContent) !== "Supporting materials") continue;
    const section = title.closest("section");
    if (!section || section === root || section === document.body) continue;
    const body = normalize(section.textContent);
    if (body.length > 2100 || !/You are already in the/i.test(body) ||
        !/(?:Open grammar book|Open workbook|Watch teacher video|Watch AI video)/i.test(body)) continue;
    hide(section, "workbook-start-guide-resources");
  }

  // The older workbook theme sometimes wraps the title inside an anonymous
  // div. Anchor by the *specific* resource link, never a lesson heading.
  for (const link of document.querySelectorAll("a,button")) {
    if (!/^(?:Open grammar book|Open workbook)$/.test(normalize(link.textContent))) continue;
    const section = link.closest("section");
    if (!section || section === root || section === document.body) continue;
    const body = normalize(section.textContent);
    if (body.length < 2100 && /You are already in the/i.test(body) &&
        /(Teacher lecture video|AI lecture|Supporting materials)/i.test(body)) {
      hide(section, "workbook-resource-links");
    }
  }

  // A completion checkbox is not a choice in a reading or listening question.
  // Exclude its entire label rather than only its text; do not hide radios.
  for (const label of document.querySelectorAll("label")) {
    if (/^I prepared this part\.?$/i.test(normalize(label.textContent)) &&
        label.querySelector('input[type="checkbox"]') &&
        !label.querySelector('input[type="radio"]')) {
      hide(label, "online-completion-checkbox");
    }
  }

  // Answer-count status may have sibling spans ("0" + "of 5" +
  // "answered"), appear inside a button, or include other status copy.
  // Find the smallest input-free container, never a question / choice.
  const answerCounter = /\b\d+\s+of\s+\d+\s+answered\b/i;
  for (const el of document.querySelectorAll("small,span,p,strong,label,button,aside,div")) {
    const text = normalize(el.textContent);
    if (text.length > 180 || !answerCounter.test(text)) continue;
    if (el.querySelector("input[type=radio],textarea,fieldset,select,h1,h2,h3")) continue;
    const smallerMatch = [...el.children].some(child =>
      answerCounter.test(normalize(child.textContent)) &&
      !child.querySelector("input[type=radio],textarea,fieldset,select,h1,h2,h3"));
    if (smallerMatch) continue;
    hide(el, "online-answer-progress");
  }

  for (const leaf of root.querySelectorAll("p,span,small,strong")) {
    if (leaf.children.length) continue;
    const txt = normalize(leaf.textContent);
    if (!/You are already in the workbook Kapitel/i.test(txt)) continue;
    let candidate = leaf.parentElement;
    while (candidate && candidate !== root) {
      const label = normalize(candidate.textContent);
      if (label.length > 1300 || candidate.querySelector("h1,textarea,fieldset,input[type=radio]")) break;
      if (/Teacher lecture video/i.test(label) && /Grammar book/i.test(label)) hide(candidate, "teacher-resource-card");
      candidate = candidate.parentElement;
    }
  }
  // Workbook heading + tab navigation is website scaffolding. Remove the
  // enclosing *header card*, not the adjacent Grammar/Teil question card.
  for (const nav of root.querySelectorAll("[data-workbook-tab-navigation]")) {
    let parent = nav.parentElement;
    while (parent && parent !== root) {
      if (parent.querySelector("h1") && normalize(parent.textContent).length < 2400
          && !parent.querySelector("h2,input[type=radio],textarea")) {
        hide(parent, "workbook-website-heading");
        break;
      }
      parent = parent.parentElement;
    }
  }

  // Export lesson educational content, never live speaking chat, playback
  // controls, submission states, empty chat cards or assessment input areas.
  root.querySelectorAll(
    '[data-course-inline-practice="speaking"], [data-timed-assignment],' +
    '[data-live-class-response-mount], [data-live-class-response], ' +
    'section[aria-label="Assessment rules"]'
  ).forEach(node => hide(node, "interactive-online-only"));
  const onlinePhrases = [
    /^(?:I prepared this part\.?|Collapse speaking help|Expand speaking help)$/i,
    /^Answer directly in the workbook\./i,
    /^Select Grammar, Teil 1/i,
    /^Click an answer option/i,
    /^Choose one answer for each question/i,
    /^\d+\s+of\s+\d+\s+answered$/i,
    /^Click an answer option\.?/i,
    /^Loading(?:…|\.{3})?$/i,
  ];
  for (const el of root.querySelectorAll("button,small,span,p,strong,div,label")) {
    if (el.children.length || el.querySelector("input,textarea,fieldset")) continue;
    const label = normalize(el.textContent);
    if (onlinePhrases.some(rx => rx.test(label))) hide(el, "online-only-instruction");
  }
  for (const node of root.querySelectorAll('a')) {
    if (/^(?:Open in YouTube|Open listening audio|Open Hören audio in Google Drive)$/i.test(normalize(node.textContent))) {
      hide(node, "replaced-by-audio-qr");
    }
  }
  // Cover any remaining UI chat components even when the wrapper has no
  // helpful data attribute. Never hide a large question-containing section.
  for (const leaf of root.querySelectorAll("h2,h3,strong")) {
    if (leaf.children.length || !/Goethe Free Sprechen Chat/i.test(normalize(leaf.textContent))) continue;
    let parent = leaf.parentElement;
    while (parent && parent !== root) {
      if (parent.querySelector("textarea,input[type=radio],fieldset")) break;
      if (parent.matches("article,section,[data-course-inline-practice]")) {
        hide(parent, "speaking-ai-chat");
        break;
      }
      parent = parent.parentElement;
    }
  }

  // One QR for every Hören tab (including YouTube and R2-backed audio).
  // The QR resolves to the lesson, where the student can select Hören and
  // authenticate. Never embed or reveal temporary Cloudflare URLs in paper.
  let qrCallout = null;
  if (section === "workbook-teil-4") {
    const heading = [...root.querySelectorAll("h2,h3,strong")].find(node =>
      /^Teil\s*4\s*[·:–-]\s*Hören/i.test(normalize(node.textContent)));
    if (!heading) throw new Error("A2 Hören QR requires a visible Teil 4 heading");
    if (!qrDataUrl || !lessonUrl) throw new Error("A2 Hören QR has no stable authenticated lesson link");
    const container = heading.closest("section") || heading.parentElement;
    qrCallout = document.createElement("aside");
    qrCallout.setAttribute("data-a2-pdf-audio-companion", "true");
    qrCallout.style.cssText = "display:flex;gap:12px;align-items:center;padding:12px;border:1px solid #bfd3eb;background:#eff6ff;border-radius:8px;break-inside:avoid;margin:8px 0";
    const qr = document.createElement("img");
    qr.src = qrDataUrl;
    qr.alt = "A2 Hören · QR code to authenticated Falowen lesson";
    qr.style.cssText = "width:86px;height:86px;object-fit:contain";
    const copy = document.createElement("div");
    copy.innerHTML = "<strong>Hören · Audio im Falowen Course Book</strong><p style='margin:4px 0;font-size:12px'>Scan the QR code, sign in to Falowen and open Teil 4 · Hören.</p>";
    const url = document.createElement("a");
    url.href = lessonUrl;
    url.textContent = lessonUrl;
    url.style.cssText = "font-size:10px;overflow-wrap:anywhere";
    copy.append(url);
    qrCallout.append(qr, copy);
    heading.insertAdjacentElement("afterend", qrCallout);
  }
  window.__a2PdfExtras = { marked, qrCallout };
  return { hidden: marked.length, qr: Boolean(qrCallout) };
};

export const restoreA2PrintDocument = () => {
  for (const node of window.__a2PdfExtras?.marked || []) node.removeAttribute("data-a2-pdf-hide");
  window.__a2PdfExtras?.qrCallout?.remove();
  delete window.__a2PdfExtras;
};
