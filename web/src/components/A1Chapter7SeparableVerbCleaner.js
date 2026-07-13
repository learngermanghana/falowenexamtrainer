import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const A1_CHAPTER7_TIME_PATH = "/campus/course/the-12-hour-clock-system-in-german-chapter-7";
const PANEL_ATTRIBUTE = "data-a1-compact-separable-verbs";
const ORIGINAL_ATTRIBUTE = "data-a1-hidden-duplicate-content";
const PREVIOUS_DISPLAY_ATTRIBUTE = "data-a1-previous-display";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

export const isA1Chapter7TimePath = (pathname = "") => normalizePath(pathname) === A1_CHAPTER7_TIME_PATH;

export const findSeparableVerbSection = (root = document) => {
  if (!root?.querySelectorAll) return null;
  const heading = Array.from(root.querySelectorAll("h2")).find((element) =>
    normalizeText(element.textContent).startsWith("5) separable verbs")
  );
  return heading?.closest("section") || null;
};

const createCell = (root, tagName, text, isHeader = false) => {
  const cell = root.createElement(tagName);
  cell.textContent = text;
  Object.assign(cell.style, {
    borderBottom: "1px solid #e5e7eb",
    color: isHeader ? "#0f172a" : "#334155",
    fontWeight: isHeader ? "900" : "500",
    lineHeight: "1.55",
    padding: "10px 8px",
    textAlign: "left",
    verticalAlign: "top",
  });
  return cell;
};

const createVerbTable = (root) => {
  const wrapper = root.createElement("div");
  wrapper.style.overflowX = "auto";

  const table = root.createElement("table");
  Object.assign(table.style, {
    borderCollapse: "collapse",
    minWidth: "620px",
    width: "100%",
  });

  const head = root.createElement("thead");
  const headRow = root.createElement("tr");
  ["Infinitive", "Meaning", "Example sentence"].forEach((label) => {
    headRow.appendChild(createCell(root, "th", label, true));
  });
  head.appendChild(headRow);

  const rows = [
    ["aufstehen", "to get up", "Ich stehe um sechs Uhr auf."],
    ["einkaufen", "to shop", "Wir kaufen am Samstag ein."],
    ["anrufen", "to call", "Ich rufe meine Mutter am Abend an."],
    ["fernsehen", "to watch TV", "Er sieht am Abend fern."],
    ["aufräumen", "to tidy up", "Ich räume am Sonntag mein Zimmer auf."],
    ["anfangen", "to begin", "Der Kurs fängt um acht Uhr an."],
    ["mitbringen", "to bring along", "Ich bringe mein Buch mit."],
  ];

  const body = root.createElement("tbody");
  rows.forEach((row) => {
    const tableRow = root.createElement("tr");
    row.forEach((value) => tableRow.appendChild(createCell(root, "td", value)));
    body.appendChild(tableRow);
  });

  table.append(head, body);
  wrapper.appendChild(table);
  return wrapper;
};

const createCallout = (root, { title, background, border, color, children }) => {
  const box = root.createElement("div");
  Object.assign(box.style, {
    background,
    border: `1px solid ${border}`,
    borderRadius: "14px",
    color,
    display: "grid",
    gap: "8px",
    lineHeight: "1.65",
    padding: "14px",
  });

  const heading = root.createElement("strong");
  heading.textContent = title;
  box.appendChild(heading);
  children(box);
  return box;
};

const createCompactPanel = (root = document) => {
  const panel = root.createElement("div");
  panel.setAttribute(PANEL_ATTRIBUTE, "true");
  Object.assign(panel.style, {
    display: "grid",
    gap: "12px",
  });

  panel.appendChild(
    createCallout(root, {
      title: "Main rule",
      background: "#eff6ff",
      border: "#bfdbfe",
      color: "#1e3a8a",
      children: (box) => {
        const rule = root.createElement("p");
        rule.style.margin = "0";
        rule.innerHTML =
          "In a simple present-tense sentence, the <strong>conjugated verb is in position 2</strong> and the <strong>separable prefix goes to the end</strong>.";

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
        box.append(rule, pattern);
      },
    })
  );

  panel.appendChild(createVerbTable(root));

  panel.appendChild(
    createCallout(root, {
      title: "Most useful prefixes",
      background: "#f0fdf4",
      border: "#bbf7d0",
      color: "#14532d",
      children: (box) => {
        const text = root.createElement("p");
        text.style.margin = "0";
        text.innerHTML =
          "Learn these first: <strong>an-</strong>, <strong>auf-</strong>, <strong>ein-</strong>, <strong>mit-</strong>, <strong>fern-</strong> and <strong>zu-</strong>. Always learn the complete verb, for example <strong>aufstehen</strong> or <strong>anrufen</strong>.";
        box.appendChild(text);
      },
    })
  );

  panel.appendChild(
    createCallout(root, {
      title: "See how the verb splits",
      background: "#fff7ed",
      border: "#fed7aa",
      color: "#7c2d12",
      children: (box) => {
        const example = root.createElement("div");
        Object.assign(example.style, {
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
        });
        example.innerHTML =
          '<strong>aufstehen</strong> → <span style="background:#eff6ff;border:1px solid #60a5fa;border-radius:999px;color:#1d4ed8;font-weight:900;padding:4px 9px">Ich stehe</span><span>um sechs Uhr</span><span style="background:#fffbeb;border:1px solid #f59e0b;border-radius:999px;color:#92400e;font-weight:900;padding:4px 9px">auf</span>';
        box.appendChild(example);
      },
    })
  );

  panel.appendChild(
    createCallout(root, {
      title: "Questions with separable verbs",
      background: "#f0fdf4",
      border: "#bbf7d0",
      color: "#14532d",
      children: (box) => {
        const text = root.createElement("p");
        text.style.margin = "0";
        text.innerHTML =
          "In a yes/no question, the conjugated verb comes first and the prefix still goes to the end: <strong>Stehst du um sechs Uhr auf?</strong> / <strong>Kommst du am Freitag mit?</strong>";
        box.appendChild(text);
      },
    })
  );

  return panel;
};

const hideOriginalDuplicateContent = (section) => {
  const headingContainer = section.querySelector("h2")?.parentElement;
  Array.from(section.children).forEach((child) => {
    if (child === headingContainer || child.hasAttribute(PANEL_ATTRIBUTE)) return;
    if (!child.hasAttribute(ORIGINAL_ATTRIBUTE)) {
      child.setAttribute(ORIGINAL_ATTRIBUTE, "true");
      child.setAttribute(PREVIOUS_DISPLAY_ATTRIBUTE, child.style.display || "");
    }
    child.style.display = "none";
    child.setAttribute("aria-hidden", "true");
  });
};

export const applyA1Chapter7SeparableVerbCleanup = (root = document, pathname = window.location?.pathname) => {
  if (!isA1Chapter7TimePath(pathname)) return false;
  const section = findSeparableVerbSection(root);
  if (!section) return false;

  hideOriginalDuplicateContent(section);
  if (!section.querySelector(`[${PANEL_ATTRIBUTE}]`)) {
    section.appendChild(createCompactPanel(root));
  }
  return true;
};

export const restoreA1Chapter7SeparableVerbContent = (root = document) => {
  root.querySelectorAll(`[${PANEL_ATTRIBUTE}]`).forEach((element) => element.remove());
  root.querySelectorAll(`[${ORIGINAL_ATTRIBUTE}]`).forEach((element) => {
    element.style.display = element.getAttribute(PREVIOUS_DISPLAY_ATTRIBUTE) || "";
    element.removeAttribute("aria-hidden");
    element.removeAttribute(ORIGINAL_ATTRIBUTE);
    element.removeAttribute(PREVIOUS_DISPLAY_ATTRIBUTE);
  });
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
  createCompactPanel,
  hideOriginalDuplicateContent,
};
