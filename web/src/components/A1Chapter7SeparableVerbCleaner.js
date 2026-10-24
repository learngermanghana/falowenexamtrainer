import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const A1_CHAPTER7_TIME_PATH = "/campus/course/the-12-hour-clock-system-in-german-chapter-7";

const PANEL_ATTRIBUTES = {
  time: "data-a1-compact-time-explanation",
  half: "data-a1-compact-half-rule",
  quarter: "data-a1-compact-quarter-rule",
  verbs: "data-a1-compact-separable-verbs",
  summary: "data-a1-compact-summary",
};
const ORIGINAL_ATTRIBUTE = "data-a1-hidden-duplicate-content";
const PREVIOUS_DISPLAY_ATTRIBUTE = "data-a1-previous-display";
const HIDDEN_SECTION_ATTRIBUTE = "data-a1-hidden-duplicate-section";
const HIDDEN_QUESTION_ATTRIBUTE = "data-a1-hidden-duplicate-question";
const ORIGINAL_TEXT_ATTRIBUTE = "data-a1-original-text";
const NAV_ATTRIBUTE = "data-a1-chapter7-navigation";
const HEADER_ATTRIBUTE = "data-a1-chapter7-header";
const EYEBROW_ATTRIBUTE = "data-a1-chapter7-eyebrow";

const TONES = {
  blue: { background: "#eff6ff", border: "#bfdbfe", color: "#1e3a8a" },
  green: { background: "#f0fdf4", border: "#bbf7d0", color: "#14532d" },
  orange: { background: "#fff7ed", border: "#fed7aa", color: "#7c2d12" },
};

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

export const isA1Chapter7TimePath = (pathname = "") => normalizePath(pathname) === A1_CHAPTER7_TIME_PATH;

const findSectionByTitle = (root = document, prefix = "") => {
  const heading = Array.from(root?.querySelectorAll?.("h2") || []).find((element) =>
    normalizeText(element.textContent).startsWith(normalizeText(prefix))
  );
  return heading?.closest("section") || null;
};

export const findSeparableVerbSection = (root = document) => findSectionByTitle(root, "5) separable verbs");

const paragraph = (root, html) => {
  const element = root.createElement("p");
  element.style.margin = "0";
  element.innerHTML = html;
  return element;
};

const callout = (root, title, toneName, content) => {
  const tone = TONES[toneName] || TONES.blue;
  const box = root.createElement("div");
  Object.assign(box.style, {
    ...tone,
    border: `1px solid ${tone.border}`,
    borderRadius: "14px",
    display: "grid",
    gap: "8px",
    lineHeight: "1.65",
    padding: "14px",
  });
  const heading = root.createElement("strong");
  heading.textContent = title;
  box.appendChild(heading);
  content(box);
  return box;
};

const table = (root, headers, rows, minWidth = "620px") => {
  const wrapper = root.createElement("div");
  wrapper.style.overflowX = "auto";
  const element = root.createElement("table");
  Object.assign(element.style, { borderCollapse: "collapse", minWidth, width: "100%" });

  const makeCell = (tag, text, header = false) => {
    const cell = root.createElement(tag);
    cell.textContent = text;
    Object.assign(cell.style, {
      borderBottom: "1px solid #e5e7eb",
      color: header ? "#0f172a" : "#334155",
      fontWeight: header ? "900" : "500",
      lineHeight: "1.55",
      padding: "10px 8px",
      textAlign: "left",
      verticalAlign: "top",
    });
    return cell;
  };

  const head = root.createElement("thead");
  const headRow = root.createElement("tr");
  headers.forEach((label) => headRow.appendChild(makeCell("th", label, true)));
  head.appendChild(headRow);

  const body = root.createElement("tbody");
  rows.forEach((row) => {
    const line = root.createElement("tr");
    row.forEach((value) => line.appendChild(makeCell("td", value)));
    body.appendChild(line);
  });

  element.append(head, body);
  wrapper.appendChild(element);
  return wrapper;
};

const panel = (root, attribute, children) => {
  const element = root.createElement("div");
  element.setAttribute(attribute, "true");
  Object.assign(element.style, { display: "grid", gap: "12px" });
  children.forEach((child) => element.appendChild(child));
  return element;
};

const createTimePanel = (root = document) =>
  panel(root, PANEL_ATTRIBUTES.time, [
    callout(root, "How the German 12-hour clock works", "blue", (box) => {
      box.appendChild(
        paragraph(
          root,
          "In everyday speech, German often uses the numbers <strong>1 to 12</strong>. To make the time clear, add a time-of-day word such as <strong>morgens</strong>, <strong>nachmittags</strong> or <strong>abends</strong>."
        )
      );
      const example = root.createElement("div");
      Object.assign(example.style, {
        background: "#ffffff",
        border: "1px solid #dbeafe",
        borderRadius: "10px",
        color: "#0f172a",
        padding: "10px 12px",
      });
      example.innerHTML = "<strong>acht Uhr morgens</strong> = 8:00<br><strong>acht Uhr abends</strong> = 20:00";
      box.appendChild(example);
    }),
    table(
      root,
      ["Time-of-day word", "Meaning", "Example", "24-hour meaning"],
      [
        ["morgens", "in the morning", "sieben Uhr morgens", "07:00"],
        ["vormittags", "before noon / late morning", "zehn Uhr vormittags", "10:00"],
        ["mittags", "at midday", "zwölf Uhr mittags", "12:00"],
        ["nachmittags", "in the afternoon", "drei Uhr nachmittags", "15:00"],
        ["abends", "in the evening", "acht Uhr abends", "20:00"],
        ["nachts", "at night", "ein Uhr nachts", "01:00"],
      ],
      "700px"
    ),
    callout(root, "Two small rules", "orange", (box) => {
      box.appendChild(paragraph(root, "Say <strong>ein Uhr</strong>, not <strong>eins Uhr</strong>."));
      box.appendChild(
        paragraph(root, "Use <strong>um</strong> before a time: <strong>Ich komme um acht Uhr abends.</strong>")
      );
    }),
  ]);

const createHalfPanel = (root = document) =>
  panel(root, PANEL_ATTRIBUTES.half, [
    callout(root, "The one halb rule", "blue", (box) => {
      box.appendChild(
        paragraph(
          root,
          "<strong>halb + hour</strong> means 30 minutes <strong>before</strong> the named hour. The named hour is the hour you are moving toward."
        )
      );
    }),
    table(root, ["German", "Think", "Time"], [
      ["halb sieben", "30 minutes before seven", "6:30"],
      ["halb acht", "30 minutes before eight", "7:30"],
      ["halb zwei", "30 minutes before two", "1:30"],
    ]),
  ]);

const createQuarterPanel = (root = document) =>
  panel(root, PANEL_ATTRIBUTES.quarter, [
    callout(root, "nach = after · vor = before", "blue", (box) => {
      box.appendChild(
        paragraph(root, "<strong>Viertel nach</strong> means quarter past. <strong>Viertel vor</strong> means quarter to.")
      );
    }),
    table(root, ["German", "Meaning", "Time"], [
      ["Viertel nach acht", "quarter past eight", "8:15"],
      ["Viertel vor acht", "quarter to eight", "7:45"],
      ["Viertel nach sechs", "quarter past six", "6:15"],
      ["Viertel vor neun", "quarter to nine", "8:45"],
    ]),
  ]);

const createCompactVerbPanel = (root = document) =>
  panel(root, PANEL_ATTRIBUTES.verbs, [
    callout(root, "Main rule", "blue", (box) => {
      box.appendChild(
        paragraph(
          root,
          "In a simple present-tense sentence, the <strong>conjugated verb is in position 2</strong> and the <strong>separable prefix goes to the end</strong>."
        )
      );
      const pattern = root.createElement("div");
      Object.assign(pattern.style, {
        background: "#ffffff",
        border: "1px solid #dbeafe",
        borderRadius: "10px",
        color: "#0f172a",
        padding: "10px 12px",
      });
      pattern.innerHTML =
        "<strong>Pattern:</strong> Subject + conjugated verb + information + prefix<br><strong>Example:</strong> Ich stehe um sechs Uhr <strong>auf</strong>.";
      box.appendChild(pattern);
    }),
    table(root, ["Infinitive", "Meaning", "Example sentence"], [
      ["aufstehen", "to get up", "Ich stehe um sechs Uhr auf."],
      ["einkaufen", "to shop", "Wir kaufen am Samstag ein."],
      ["anrufen", "to call", "Ich rufe meine Mutter am Abend an."],
      ["fernsehen", "to watch TV", "Er sieht am Abend fern."],
      ["aufräumen", "to tidy up", "Ich räume am Sonntag mein Zimmer auf."],
      ["anfangen", "to begin", "Der Kurs fängt um acht Uhr an."],
      ["mitbringen", "to bring along", "Ich bringe mein Buch mit."],
    ]),
    callout(root, "Most useful prefixes", "green", (box) => {
      box.appendChild(
        paragraph(
          root,
          "Learn these first: <strong>an-</strong>, <strong>auf-</strong>, <strong>ein-</strong>, <strong>mit-</strong>, <strong>fern-</strong> and <strong>zu-</strong>. Learn the complete verb, for example <strong>aufstehen</strong> or <strong>anrufen</strong>."
        )
      );
    }),
    callout(root, "See how the verb splits", "orange", (box) => {
      const example = root.createElement("div");
      Object.assign(example.style, { alignItems: "center", display: "flex", flexWrap: "wrap", gap: "6px" });
      example.innerHTML =
        '<strong>aufstehen</strong> → <span style="background:#eff6ff;border:1px solid #60a5fa;border-radius:999px;color:#1d4ed8;font-weight:900;padding:4px 9px">Ich stehe</span><span>um sechs Uhr</span><span style="background:#fffbeb;border:1px solid #f59e0b;border-radius:999px;color:#92400e;font-weight:900;padding:4px 9px">auf</span>';
      box.appendChild(example);
    }),
    callout(root, "Questions with separable verbs", "green", (box) => {
      box.appendChild(
        paragraph(
          root,
          "In a yes/no question, the conjugated verb comes first and the prefix still goes to the end: <strong>Stehst du um sechs Uhr auf?</strong> / <strong>Kommst du am Freitag mit?</strong>"
        )
      );
    }),
  ]);

const createSummaryPanel = (root = document) =>
  panel(root, PANEL_ATTRIBUTES.summary, [
    callout(root, "Remember these six points", "green", (box) => {
      const list = root.createElement("ul");
      Object.assign(list.style, { margin: "0", paddingLeft: "20px", lineHeight: "1.8" });
      [
        "Use am with days: am Montag.",
        "Use um with time: um sieben Uhr.",
        "Use morgens, nachmittags, abends or nachts to clarify a 12-hour time.",
        "halb sieben = 6:30, and halb acht = 7:30.",
        "Viertel nach = quarter past; Viertel vor = quarter to.",
        "A separable prefix goes to the end: Ich stehe um sechs Uhr auf.",
      ].forEach((text) => {
        const item = root.createElement("li");
        item.textContent = text;
        list.appendChild(item);
      });
      box.appendChild(list);
    }),
  ]);

const hideOriginalDuplicateContent = (section, activePanelAttribute) => {
  const headingContainer = section.querySelector("h2")?.parentElement;
  Array.from(section.children).forEach((child) => {
    if (child === headingContainer || child.hasAttribute(activePanelAttribute)) return;
    if (!child.hasAttribute(ORIGINAL_ATTRIBUTE)) {
      child.setAttribute(ORIGINAL_ATTRIBUTE, "true");
      child.setAttribute(PREVIOUS_DISPLAY_ATTRIBUTE, child.style.display || "");
    }
    child.style.display = "none";
    child.setAttribute("aria-hidden", "true");
  });
};

const replaceSectionContent = (root, section, panelAttribute, createContent) => {
  if (!section) return false;
  hideOriginalDuplicateContent(section, panelAttribute);
  if (!section.querySelector(`[${panelAttribute}]`)) section.appendChild(createContent(root));
  return true;
};

const hideMiniPractice = (root = document) => {
  const section = findSectionByTitle(root, "7) mini practice");
  if (!section) return false;
  if (!section.hasAttribute(HIDDEN_SECTION_ATTRIBUTE)) {
    section.setAttribute(HIDDEN_SECTION_ATTRIBUTE, "true");
    section.setAttribute(PREVIOUS_DISPLAY_ATTRIBUTE, section.style.display || "");
  }
  section.style.display = "none";
  section.setAttribute("aria-hidden", "true");
  return true;
};

const trimKnowledgeTest = (root = document) => {
  const section = findSectionByTitle(root, "8) knowledge test");
  if (!section) return false;

  const headingContainer = section.querySelector("h2")?.parentElement;
  const subtitle = headingContainer?.querySelector("p");
  if (subtitle) {
    if (!subtitle.hasAttribute(ORIGINAL_TEXT_ATTRIBUTE)) subtitle.setAttribute(ORIGINAL_TEXT_ATTRIBUTE, subtitle.textContent || "");
    subtitle.textContent = "Complete eight focused questions. Each question checks a different rule.";
  }

  const questionContainer = Array.from(section.children).find((child) => child !== headingContainer);
  const cards = Array.from(questionContainer?.children || []);
  const keepIndices = new Set([0, 1, 2, 4, 5, 6, 8, 11]);
  let visibleNumber = 0;

  cards.forEach((card, index) => {
    const prompt = card.querySelector("strong");
    if (!keepIndices.has(index)) {
      if (!card.hasAttribute(HIDDEN_QUESTION_ATTRIBUTE)) {
        card.setAttribute(HIDDEN_QUESTION_ATTRIBUTE, "true");
        card.setAttribute(PREVIOUS_DISPLAY_ATTRIBUTE, card.style.display || "");
      }
      card.style.display = "none";
      card.setAttribute("aria-hidden", "true");
      return;
    }

    visibleNumber += 1;
    if (prompt) {
      if (!prompt.hasAttribute(ORIGINAL_TEXT_ATTRIBUTE)) prompt.setAttribute(ORIGINAL_TEXT_ATTRIBUTE, prompt.textContent || "");
      const original = prompt.getAttribute(ORIGINAL_TEXT_ATTRIBUTE) || prompt.textContent || "";
      prompt.textContent = original.replace(/^\s*\d+\)\s*/, `${visibleNumber}) `);
    }
  });

  return true;
};

const styleHeaderAndSections = (root = document) => {
  const main = root.querySelector("main");
  const title = main?.querySelector("h1");
  const header = title?.parentElement || null;
  if (!main || !header) return null;

  header.setAttribute(HEADER_ATTRIBUTE, "true");
  Object.assign(header.style, {
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 60%, #f0fdf4 100%)",
    border: "1px solid #bfdbfe",
    borderRadius: "24px",
    boxShadow: "0 18px 38px rgba(37, 99, 235, 0.12)",
    padding: "clamp(16px, 3vw, 24px)",
  });

  if (!header.querySelector(`[${EYEBROW_ATTRIBUTE}]`)) {
    const eyebrow = root.createElement("p");
    eyebrow.setAttribute(EYEBROW_ATTRIBUTE, "true");
    eyebrow.textContent = "A1 · Kapitel 7 · Grammar Book";
    Object.assign(eyebrow.style, {
      color: "#1d4ed8",
      fontSize: "12px",
      fontWeight: "900",
      letterSpacing: ".08em",
      margin: "0",
      textTransform: "uppercase",
    });
    header.insertBefore(eyebrow, title);
  }

  main.querySelectorAll("section").forEach((section) => {
    section.style.scrollMarginTop = "92px";
    section.style.borderRadius = "18px";
  });
  return { main, header };
};

const createNavigation = (root, main, header) => {
  if (!main || !header || main.querySelector(`[${NAV_ATTRIBUTE}]`)) return;
  const entries = [
    ["1) days of the week", "Days"],
    ["2) the 12-hour clock", "12-hour clock"],
    ["3) the clear halb rule", "halb"],
    ["4) viertel nach", "Viertel"],
    ["5) separable verbs", "Verbs"],
    ["6) put everything together", "Sentences"],
    ["8) knowledge test", "Test"],
    ["9) final summary", "Summary"],
  ]
    .map(([prefix, label]) => ({ section: findSectionByTitle(root, prefix), label }))
    .filter(({ section }) => Boolean(section));

  const navigation = root.createElement("nav");
  navigation.setAttribute(NAV_ATTRIBUTE, "true");
  navigation.setAttribute("aria-label", "Chapter 7 sections");
  Object.assign(navigation.style, {
    alignItems: "center",
    background: "rgba(255,255,255,.96)",
    border: "1px solid #bfdbfe",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15,23,42,.10)",
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    padding: "10px",
    position: "sticky",
    top: "8px",
    zIndex: "24",
  });

  entries.forEach(({ section, label }) => {
    const button = root.createElement("button");
    button.type = "button";
    button.textContent = label;
    Object.assign(button.style, {
      background: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "999px",
      color: "#334155",
      cursor: "pointer",
      flex: "0 0 auto",
      font: "inherit",
      fontSize: "13px",
      fontWeight: "800",
      minHeight: "40px",
      padding: "8px 13px",
    });
    button.addEventListener("click", () => section.scrollIntoView({ behavior: "smooth", block: "start" }));
    navigation.appendChild(button);
  });

  header.insertAdjacentElement("afterend", navigation);
};

export const applyA1Chapter7SeparableVerbCleanup = (root = document, pathname = window.location?.pathname) => {
  if (!isA1Chapter7TimePath(pathname)) return false;

  const changed = [
    replaceSectionContent(root, findSectionByTitle(root, "2) the 12-hour clock"), PANEL_ATTRIBUTES.time, createTimePanel),
    replaceSectionContent(root, findSectionByTitle(root, "3) the clear halb rule"), PANEL_ATTRIBUTES.half, createHalfPanel),
    replaceSectionContent(root, findSectionByTitle(root, "4) viertel nach"), PANEL_ATTRIBUTES.quarter, createQuarterPanel),
    replaceSectionContent(root, findSeparableVerbSection(root), PANEL_ATTRIBUTES.verbs, createCompactVerbPanel),
    replaceSectionContent(root, findSectionByTitle(root, "9) final summary"), PANEL_ATTRIBUTES.summary, createSummaryPanel),
    hideMiniPractice(root),
    trimKnowledgeTest(root),
  ].some(Boolean);

  const styled = styleHeaderAndSections(root);
  createNavigation(root, styled?.main, styled?.header);
  return changed;
};

export const restoreA1Chapter7SeparableVerbContent = (root = document) => {
  Object.values(PANEL_ATTRIBUTES).forEach((attribute) => {
    root.querySelectorAll(`[${attribute}]`).forEach((element) => element.remove());
  });
  root.querySelectorAll(`[${NAV_ATTRIBUTE}], [${EYEBROW_ATTRIBUTE}]`).forEach((element) => element.remove());

  root.querySelectorAll(`[${ORIGINAL_ATTRIBUTE}]`).forEach((element) => {
    element.style.display = element.getAttribute(PREVIOUS_DISPLAY_ATTRIBUTE) || "";
    element.removeAttribute("aria-hidden");
    element.removeAttribute(ORIGINAL_ATTRIBUTE);
    element.removeAttribute(PREVIOUS_DISPLAY_ATTRIBUTE);
  });

  root.querySelectorAll(`[${HIDDEN_SECTION_ATTRIBUTE}], [${HIDDEN_QUESTION_ATTRIBUTE}]`).forEach((element) => {
    element.style.display = element.getAttribute(PREVIOUS_DISPLAY_ATTRIBUTE) || "";
    element.removeAttribute("aria-hidden");
    element.removeAttribute(HIDDEN_SECTION_ATTRIBUTE);
    element.removeAttribute(HIDDEN_QUESTION_ATTRIBUTE);
    element.removeAttribute(PREVIOUS_DISPLAY_ATTRIBUTE);
  });

  root.querySelectorAll(`[${ORIGINAL_TEXT_ATTRIBUTE}]`).forEach((element) => {
    element.textContent = element.getAttribute(ORIGINAL_TEXT_ATTRIBUTE) || "";
    element.removeAttribute(ORIGINAL_TEXT_ATTRIBUTE);
  });
  root.querySelectorAll(`[${HEADER_ATTRIBUTE}]`).forEach((element) => element.removeAttribute(HEADER_ATTRIBUTE));
};

export default function A1Chapter7SeparableVerbCleaner() {
  const location = useLocation();

  useEffect(() => {
    if (!isA1Chapter7TimePath(location.pathname)) return undefined;
    let scheduled = false;
    const applyCleanup = () => {
      scheduled = false;
      applyA1Chapter7SeparableVerbCleanup(document, location.pathname);
    };
    const scheduleCleanup = () => {
      if (scheduled) return;
      scheduled = true;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      schedule(applyCleanup);
    };

    scheduleCleanup();
    const observer = new MutationObserver(scheduleCleanup);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      restoreA1Chapter7SeparableVerbContent(document);
    };
  }, [location.pathname]);

  return null;
}

export const __TESTING__ = {
  normalizePath,
  normalizeText,
  findSectionByTitle,
  createTimePanel,
  createHalfPanel,
  createQuarterPanel,
  createCompactVerbPanel,
  createSummaryPanel,
  hideOriginalDuplicateContent,
  hideMiniPractice,
  trimKnowledgeTest,
};
