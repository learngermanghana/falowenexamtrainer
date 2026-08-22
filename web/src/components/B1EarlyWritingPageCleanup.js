import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CLEANUP_STYLE_ID = "b1-early-writing-page-cleanup-style";
const WRITING_VIDEO_SELECTOR = '[data-b1-writing-video-support], [data-b1-day19-writing-video="true"], [data-b1-day21-writing-video="true"]';

const TASK_CONFIG = {
  1: {
    points: [
      "Sagen Sie, ob persönlicher Kontakt im Traumberuf für Sie wichtig ist.",
      "Nennen Sie einen Vorteil oder Nachteil von Homeoffice.",
      "Begründen Sie Ihre Meinung.",
    ],
  },
  2: {
    title: "Schreiben Sie einer Freundin eine E-Mail über einen Freund fürs Leben.",
    points: [
      "Erklären Sie, wie Sie sich kennengelernt haben.",
      "Erklären Sie, warum diese Freundschaft für Sie besonders ist.",
      "Machen Sie einen Vorschlag für ein Treffen.",
    ],
  },
  3: {
    title: "Schreiben Sie eine E-Mail an Ihre Sprachkursleiterin Frau Wolmer.",
    points: [
      "Entschuldigen Sie sich, dass Sie an der Präsentation über Erfolgsgeschichten nicht teilnehmen können.",
      "Erklären Sie den Grund für Ihre Abwesenheit.",
      "Verwenden Sie eine passende Anrede und einen höflichen Gruß.",
    ],
  },
  4: {
    points: [
      "Sagen Sie, welche Methode Sie bei der Wohnungssuche hilfreicher finden.",
      "Vergleichen Sie persönliche Kontakte mit Online-Portalen.",
      "Begründen Sie Ihre Meinung und geben Sie ein konkretes Beispiel.",
    ],
  },
  5: {
    points: [
      "Erklären Sie, dass Sie sich für die Wohnung interessieren.",
      "Fragen Sie nach einem möglichen Besichtigungstermin oder schlagen Sie selbst einen Termin vor.",
      "Bitten Sie um eine Bestätigung und erklären Sie, wie der Vermieter Sie erreichen kann.",
    ],
  },
  6: {
    points: [
      "Vergleichen Sie das Leben in der Stadt mit dem Leben auf dem Land und nennen Sie wichtige Vor- oder Nachteile.",
      "Sagen Sie, wo Sie lieber leben würden.",
      "Begründen Sie Ihre Meinung mit einem konkreten Beispiel.",
    ],
  },
  7: {
    points: [
      "Sagen Sie, ob Fertiggerichte für eine gesunde Ernährung geeignet sind.",
      "Nennen Sie einen Vorteil und einen Nachteil von Fertiggerichten.",
      "Erklären Sie, wie Sie sich im Alltag möglichst gesund ernähren.",
    ],
  },
  8: {
    points: [
      "Sagen Sie, wie wichtig regelmäßiger Sport für ein gesundes Leben ist.",
      "Nennen Sie Vorteile von Bewegung und erklären Sie die Rolle der Ernährung.",
      "Beschreiben Sie, was Sie persönlich für Ihre Gesundheit tun oder verbessern möchten.",
    ],
  },
  9: {
    points: [
      "Erklären Sie einen Vorteil und einen Nachteil moderner Arbeitsmodelle für die Work-Life-Balance.",
      "Beschreiben Sie, welche Rolle flexible Arbeitszeiten oder Homeoffice spielen.",
      "Geben Sie ein Beispiel und formulieren Sie Ihre eigene Meinung.",
    ],
  },
  10: {
    points: [
      "Nennen Sie zwei Vorteile einer digitalen Auszeit.",
      "Erklären Sie eine Schwierigkeit und nennen Sie konkrete Strategien für weniger Bildschirmzeit.",
      "Geben Sie ein persönliches Beispiel und formulieren Sie Ihre eigene Meinung.",
    ],
  },
  11: {
    points: [
      "Nennen Sie zwei Vorteile der Teamkooperation.",
      "Erklären Sie eine Herausforderung und eine mögliche Lösung.",
      "Geben Sie ein Beispiel und begründen Sie Ihre eigene Meinung.",
    ],
  },
  12: {
    points: [
      "Begrüßen Sie Felix und erzählen Sie, welches Abenteuer Sie erlebt haben und wo es war.",
      "Beschreiben Sie wichtige Erlebnisse sowie eine Schwierigkeit und wie Sie sie gelöst haben.",
      "Erklären Sie, warum das Erlebnis besonders war, und beenden Sie den Brief freundlich.",
    ],
  },
  13: {
    points: [
      "Sagen Sie, ob Sie spannende oder ruhige Filme lieber mögen.",
      "Vergleichen Sie beide Filmarten und nennen Sie jeweils einen Vorteil oder Nachteil.",
      "Begründen Sie Ihre Meinung mit einem konkreten Filmbeispiel.",
    ],
  },
  14: {
    title: "Schreiben Sie eine formelle E-Mail an Ihren Chef.",
    points: [
      "Bedanken Sie sich für das Angebot und sagen Sie höflich, dass Sie nicht teilnehmen können.",
      "Erklären Sie den Grund für Ihre Absage.",
      "Bitten Sie um Verständnis und beenden Sie die E-Mail mit einem passenden formellen Gruß.",
    ],
  },
  15: {
    points: [
      "Erklären Sie, wie digitale Medien das Arbeiten im Homeoffice erleichtern können.",
      "Nennen Sie mindestens ein Problem oder Risiko digitaler Medien im Homeoffice.",
      "Schlagen Sie eine Lösung vor und formulieren Sie Ihre eigene Meinung.",
    ],
  },
  16: {
    points: [
      "Sagen Sie, ob man Prüfungsangst mit guter Stressbewältigung reduzieren kann.",
      "Nennen Sie mindestens zwei Strategien gegen Prüfungsangst.",
      "Erklären Sie, warum diese Strategien helfen, und geben Sie ein Beispiel.",
    ],
  },
  17: {
    points: [
      "Nennen Sie zwei Lernmethoden, die für Sie gut funktionieren.",
      "Erklären Sie, warum Ziele, Pausen oder Wiederholung beim Lernen wichtig sind.",
      "Sagen Sie, wie Sie persönlich am besten lernen, und begründen Sie Ihre Meinung.",
    ],
  },
  18: {
    points: [
      "Nennen Sie verschiedene Wege zum Wunschberuf, zum Beispiel Ausbildung, Studium, Praktikum oder Weiterbildung.",
      "Erklären Sie, warum unterschiedliche Menschen unterschiedliche Wege brauchen.",
      "Sagen Sie, welchen Weg Sie sinnvoll finden, und begründen Sie Ihre Meinung.",
    ],
  },
  19: {
    points: [
      "Sagen Sie, ob Vorstellungsgespräche schwierig oder stressig sind, und begründen Sie Ihre Meinung.",
      "Erklären Sie, wie man sich auf ein Vorstellungsgespräch vorbereiten kann.",
      "Nennen Sie, was für ein erfolgreiches Gespräch besonders wichtig ist.",
    ],
  },
  20: {
    points: [
      "Sagen Sie, ob Ausbildung und Qualifikationen für den Beruf wichtig sind.",
      "Vergleichen Sie Ausbildung und praktische Erfahrung und erklären Sie, was für Sie wichtiger ist.",
      "Geben Sie ein konkretes Beispiel und begründen Sie Ihre Meinung.",
    ],
  },
  21: {
    points: [
      "Vergleichen Sie Familie, Wohngemeinschaft und Singleleben und nennen Sie wichtige Vor- oder Nachteile.",
      "Sagen Sie, welche Lebensform für Sie am besten passt.",
      "Begründen Sie Ihre Meinung mit einem persönlichen Beispiel oder der Situation in Ihrem Heimatland.",
    ],
  },
  22: {
    points: [
      "Nennen Sie einen Vorteil und einen Nachteil der Partnersuche im Internet.",
      "Vergleichen Sie Online-Kontakt mit persönlichem Kennenlernen.",
      "Geben Sie ein Beispiel und begründen Sie Ihre eigene Meinung.",
    ],
  },
  23: {
    points: [
      "Sagen Sie, wie wichtig der erste Eindruck bei einem ersten Date sein kann.",
      "Erklären Sie, warum ein erstes Date auch täuschen kann.",
      "Geben Sie ein Beispiel und begründen Sie Ihre eigene Meinung.",
    ],
  },
  24: {
    points: [
      "Erklären Sie, warum nachhaltiger Konsum wichtig sein kann.",
      "Nennen Sie eine Schwierigkeit und konkrete Beispiele für nachhaltigen Konsum.",
      "Begründen Sie Ihre eigene Meinung und formulieren Sie einen klaren Schluss.",
    ],
  },
  25: {
    points: [
      "Erklären Sie, wann Sie das Handy gekauft haben und was bei der Lieferung kaputt war.",
      "Beschreiben Sie, wann und wie Sie das Handy zurückgeschickt haben.",
      "Sagen Sie, welche Lösung Sie erwarten, und bitten Sie höflich um eine schnelle Antwort.",
    ],
  },
  26: {
    title: "Schreiben Sie Max oder Lisa einen informellen Brief über Ihre Reise.",
    points: [
      "Erzählen Sie, wohin Sie gereist sind und wie Sie gereist sind.",
      "Beschreiben Sie ein Reiseproblem, zum Beispiel eine Verspätung, ein geschlossenes Hotel oder verlorenes Gepäck.",
      "Erklären Sie, wie Sie das Problem gelöst haben, und beenden Sie den Brief freundlich.",
    ],
  },
  27: {
    points: [
      "Erklären Sie, warum umweltfreundliches Leben wichtig ist, und nennen Sie Beispiele aus dem Alltag.",
      "Beschreiben Sie eine Schwierigkeit, die umweltfreundliches Verhalten erschweren kann.",
      "Begründen Sie Ihre eigene Meinung und formulieren Sie einen klaren Schluss.",
    ],
  },
  28: {
    points: [
      "Nennen Sie konkrete Möglichkeiten, im Verkehr, beim Einkaufen oder zu Hause klimafreundlicher zu leben.",
      "Beschreiben Sie eine Schwierigkeit, zum Beispiel Geld, Wohnort oder Gewohnheiten.",
      "Sagen Sie, ob jeder Mensch klimafreundlich leben kann, und begründen Sie Ihre Meinung.",
    ],
  },
};

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

export const getEarlyB1WorkbookDay = (pathname = "", search = "") => {
  const normalizedPath = String(pathname || "").replace(/\/+$/, "");
  const dynamicMatch = normalizedPath.match(/^\/campus\/course\/lesson\/B1\/(\d+)$/i);
  if (dynamicMatch) {
    const day = Number(dynamicMatch[1]);
    const isWorkbook = new URLSearchParams(search || "").get("view") === "workbook";
    return isWorkbook && day >= 1 && day <= 28 ? day : null;
  }

  const standaloneMatch = normalizedPath.match(/^\/campus\/course\/b1-day-(\d+)-.*-workbook$/i);
  if (!standaloneMatch) return null;
  const day = Number(standaloneMatch[1]);
  return day >= 1 && day <= 28 ? day : null;
};

export const findTeil2WritingSection = (root = document) =>
  Array.from(root.querySelectorAll("section")).find((section) => {
    const heading = normalizeText(section.querySelector(":scope > h2")?.textContent).toLowerCase();
    return /^teil\s*2\b/.test(heading) && heading.includes("schreiben");
  }) || null;

const findWritingTaskCard = (section) =>
  Array.from(section?.children || []).find((child) =>
    child.matches?.('section[aria-label="Your assignment · Writing"]'),
  ) || null;

const replaceTaskBodyWithPoints = (taskCard, points) => {
  if (!taskCard || !points?.length) return false;
  const directDivs = Array.from(taskCard.children).filter((child) => child.tagName === "DIV");
  const body = directDivs[0];
  if (!body) return false;

  const currentPoints = Array.from(body.querySelectorAll(":scope > ol > li"), (item) => normalizeText(item.textContent));
  if (currentPoints.length === points.length && currentPoints.every((item, index) => item === points[index])) {
    return false;
  }

  const list = document.createElement("ol");
  Object.assign(list.style, { margin: "0", paddingLeft: "22px", lineHeight: "1.75" });
  points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    list.appendChild(item);
  });
  body.replaceChildren(list);
  return true;
};

const getDirectChild = (section, element) => {
  let current = element;
  while (current && current.parentElement && current.parentElement !== section) {
    current = current.parentElement;
  }
  return current?.parentElement === section ? current : null;
};

const getWritingVideoChild = (section) =>
  getDirectChild(section, section?.querySelector(WRITING_VIDEO_SELECTOR));

const removeWritingScaffoldingBeforeWorkspace = (section, taskCard) => {
  const workspace = section?.querySelector('[data-a2-b1-writing-workspace="standard"]');
  const workspaceChild = getDirectChild(section, workspace);
  if (!section || !taskCard || !workspaceChild) return false;

  const videoChild = getWritingVideoChild(section);
  let changed = false;
  let current = taskCard.nextElementSibling;

  while (current && current !== workspaceChild) {
    const next = current.nextElementSibling;
    if (current !== videoChild) {
      current.remove();
      changed = true;
    }
    current = next;
  }

  return changed;
};

const keepWritingVideoBeforeWorkspace = (section) => {
  const workspace = section?.querySelector('[data-a2-b1-writing-workspace="standard"]');
  const videoChild = getWritingVideoChild(section);
  const workspaceChild = getDirectChild(section, workspace);
  if (!videoChild || !workspaceChild || videoChild.nextElementSibling === workspaceChild) return false;
  section.insertBefore(videoChild, workspaceChild);
  return true;
};

export const cleanEarlyB1WritingSection = (section, day) => {
  if (!section || !day) return false;
  let changed = false;
  const taskCard = findWritingTaskCard(section);
  const config = TASK_CONFIG[day];

  if (taskCard && config?.title) {
    const title = taskCard.querySelector(":scope > h3");
    if (title && normalizeText(title.textContent) !== config.title) {
      title.textContent = config.title;
      changed = true;
    }
  }
  if (taskCard && config?.points) {
    changed = replaceTaskBodyWithPoints(taskCard, config.points) || changed;
  }

  changed = removeWritingScaffoldingBeforeWorkspace(section, taskCard) || changed;
  changed = keepWritingVideoBeforeWorkspace(section) || changed;
  return changed;
};

const ensureCleanupStyle = () => {
  if (typeof document === "undefined") return null;
  let style = document.getElementById(CLEANUP_STYLE_ID);
  if (style) return style;

  style = document.createElement("style");
  style.id = CLEANUP_STYLE_ID;
  style.textContent = `
    [data-b1-day4-writing-cheat-sheet="true"],
    [data-b1-day5-writing-cheat-sheet="true"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
  return style;
};

export default function B1EarlyWritingPageCleanup() {
  const location = useLocation();

  useEffect(() => {
    const day = getEarlyB1WorkbookDay(location.pathname, location.search);
    if (!day || typeof document === "undefined") return undefined;

    const style = ensureCleanupStyle();
    const root = document.getElementById("root") || document.body;
    let scheduled = false;

    const clean = () => {
      scheduled = false;
      const section = findTeil2WritingSection(root);
      if (section) cleanEarlyB1WritingSection(section, day);
    };

    const scheduleClean = () => {
      if (scheduled) return;
      scheduled = true;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      schedule(clean);
    };

    clean();
    const observer = new MutationObserver(scheduleClean);
    observer.observe(root, { childList: true, subtree: true });
    const timers = [100, 400, 1200].map((delay) => window.setTimeout(clean, delay));

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      style?.remove();
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __TESTING__ = {
  TASK_CONFIG,
  CLEANUP_STYLE_ID,
  WRITING_VIDEO_SELECTOR,
  findWritingTaskCard,
  replaceTaskBodyWithPoints,
  removeWritingScaffoldingBeforeWorkspace,
  keepWritingVideoBeforeWorkspace,
};
