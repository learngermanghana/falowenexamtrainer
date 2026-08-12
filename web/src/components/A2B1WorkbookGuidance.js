import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
} from "./StandardWorkbookComponents";

const resolveWorkbookLevel = (level) => {
  const explicit = String(level || "").trim().toUpperCase();
  if (["A2", "B1"].includes(explicit)) return explicit;

  if (typeof window === "undefined") return "";
  const path = `${window.location.pathname || ""} ${window.location.href || ""}`.toUpperCase();
  if (/\bB1\b|B1DAY|\/B1\//.test(path)) return "B1";
  if (/\bA2\b|A2DAY|\/A2\//.test(path)) return "A2";
  return "";
};

export const resolveA2B1WorkbookDayFromLocation = (level, locationValue = "") => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  if (!["A2", "B1"].includes(normalizedLevel)) return null;

  const source = String(locationValue || "");
  const slugMatch = source.match(new RegExp(`${normalizedLevel.toLowerCase()}-day-(\\d+)`, "i"));
  if (slugMatch) return Number(slugMatch[1]);

  const lessonMatch = source.match(new RegExp(`/lesson/${normalizedLevel}/(\\d+)`, "i"));
  if (lessonMatch) return Number(lessonMatch[1]);

  return null;
};

const normalizeTabText = (value = "") =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const REQUIRED_A2_TAB_KEYS = ["teil1", "teil2", "teil3", "teil4", "ref", "submit"];

const FORCE_SHARED_A2_TAB_PATHS = [
  "/campus/course/a2-day-10-tourismus-und-traditionelle-feste-workbook",
  "/campus/course/a2-day-11-unterwegs-verkehrsmittel-vergleichen-workbook",
  "/campus/course/a2-day-12-mein-traumberuf-workbook",
  "/campus/course/a2-day-13-vorstellungsgespraech-workbook",
];

const UNIVERSAL_A2_WORKBOOK_TABS = [
  { key: "grammar", legacyKey: "grammar", match: /\bgrammar\b|grammatik/i },
  { key: "sprechen", legacyKey: "teil1", match: /\bteil\s*1\b|sprechen|speak/i },
  { key: "schreiben", legacyKey: "teil2", match: /\bteil\s*2\b|schreiben|write/i },
  { key: "lesen", legacyKey: "teil3", match: /\bteil\s*3\b|lesen|read/i },
  { key: "hoeren", legacyKey: "teil4", match: /\bteil\s*4\b|h[oö]ren|hoeren|listen/i },
  { key: "references", legacyKey: "ref", match: /\bref\b|reference|answers|antwort/i },
  { key: "submit", legacyKey: "submit", match: /submit|abgeben|send/i },
];

const A2_DAYS_11_TO_15_LEARNING = {
  11: {
    title: "Verkehrsmittel klar vergleichen",
    rule: "Für Unterschiede benutzt du den Komparativ + als. Für Gleichheit benutzt du genauso ... wie. Ergänze einen Grund mit weil.",
    examples: [
      "Der Zug ist schneller als der Bus.",
      "Das Fahrrad ist günstiger als das Auto.",
      "Der Bus ist genauso praktisch wie die Bahn.",
      "Ich fahre gern mit dem Zug, weil er bequem ist.",
    ],
    questions: [
      { stem: "Was passt? Der Zug ist ___ als der Bus.", options: ["schnell", "schneller", "am schnellsten"], answer: 1, explanation: "Zwei Verkehrsmittel werden verglichen: Komparativ + als." },
      { stem: "Was passt bei Gleichheit? Das Fahrrad ist genauso umweltfreundlich ___ der Zug.", options: ["als", "wie", "denn"], answer: 1, explanation: "Gleichheit: genauso ... wie." },
      { stem: "Welcher Satz ist richtig?", options: ["Das Auto ist teuer als der Bus.", "Das Auto ist teurer als der Bus.", "Das Auto ist teurer wie der Bus."], answer: 1, explanation: "Ungleichheit: Komparativ + als." },
      { stem: "Wie gibst du einen Grund?", options: ["Ich fahre Bus, weil er günstig ist.", "Ich fahre Bus, weil ist er günstig.", "Ich fahre Bus, deshalb er günstig ist."], answer: 0, explanation: "Bei weil steht das konjugierte Verb am Ende." },
    ],
    outputPrompt: "Vergleiche zwei Verkehrsmittel in 4–5 Sätzen und sage, welches du bevorzugst.",
    starters: ["Der/Die ... ist ... als ...", "... ist genauso ... wie ...", "Ich bevorzuge ..., weil ..."],
  },
  12: {
    title: "Über deinen Traumberuf sprechen",
    rule: "Für Wünsche und Pläne sind möchte und würde gern besonders nützlich. Nach möchte steht der zweite Infinitiv am Satzende.",
    examples: [
      "Ich möchte Ärztin werden.",
      "Ich würde gern in einem Krankenhaus arbeiten.",
      "Ich möchte Menschen helfen, weil mir Gesundheit wichtig ist.",
      "Später möchte ich eine Weiterbildung machen.",
    ],
    questions: [
      { stem: "Was passt? Ich ___ Ingenieur werden.", options: ["möchte", "bin", "habe"], answer: 0, explanation: "möchte + Infinitiv beschreibt einen Wunsch." },
      { stem: "Welcher Satz ist richtig?", options: ["Ich möchte arbeiten in Berlin.", "Ich möchte in Berlin arbeiten.", "Ich in Berlin möchte arbeiten."], answer: 1, explanation: "Bei möchte steht der Infinitiv am Ende." },
      { stem: "Welche Form klingt höflich für einen Wunsch?", options: ["Ich würde gern ...", "Ich muss gern ...", "Ich war gern ..."], answer: 0, explanation: "Ich würde gern ... ist eine sehr nützliche Wunschform." },
      { stem: "Was passt? Ich möchte Lehrer werden, ___ ich gern mit Menschen arbeite.", options: ["weil", "als", "oder"], answer: 0, explanation: "weil gibt den Grund an." },
    ],
    outputPrompt: "Sprich 4–6 Sätze über deinen Traumberuf: Beruf, Arbeitsort, Aufgaben und Grund.",
    starters: ["Mein Traumberuf ist ...", "Ich möchte ... werden.", "Ich würde gern ... arbeiten.", "Dieser Beruf gefällt mir, weil ..."],
  },
  13: {
    title: "Modalverben im Präteritum im Vorstellungsgespräch",
    rule: "Für frühere Fähigkeiten, Pflichten und Wünsche benutzt du oft konnte, musste und wollte. Der zweite Infinitiv steht am Satzende.",
    examples: [
      "In meinem letzten Job konnte ich viele Kunden beraten.",
      "Ich musste oft selbstständig arbeiten.",
      "Ich wollte neue Erfahrungen sammeln.",
      "Ich konnte gut mit Computern arbeiten.",
    ],
    questions: [
      { stem: "Präteritum von können: Ich ___ gut im Team arbeiten.", options: ["kann", "konnte", "könnte"], answer: 1, explanation: "Vergangenheit von können: konnte." },
      { stem: "Präteritum von müssen: Ich ___ früh anfangen.", options: ["musste", "muss", "möchte"], answer: 0, explanation: "Vergangenheit von müssen: musste." },
      { stem: "Welcher Satz ist richtig?", options: ["Ich konnte Kunden beraten gut.", "Ich konnte gut Kunden beraten.", "Ich konnte beraten gut Kunden."], answer: 1, explanation: "Der zweite Infinitiv steht am Satzende." },
      { stem: "Was passt für ein früheres Ziel? Ich ___ mehr Verantwortung übernehmen.", options: ["wollte", "war", "hatte"], answer: 0, explanation: "wollte beschreibt einen Wunsch oder ein Ziel in der Vergangenheit." },
    ],
    outputPrompt: "Beantworte eine Interviewfrage in 5 Sätzen und nenne mindestens eine frühere Fähigkeit oder Aufgabe.",
    starters: ["Ich habe ... gearbeitet.", "Dort konnte ich ...", "Ich musste ...", "Ich wollte ...", "Jetzt möchte ich ..."],
  },
  14: {
    title: "Berufsziele mit um ... zu ausdrücken",
    rule: "um ... zu zeigt ein Ziel. Das Subjekt bleibt in beiden Satzteilen gleich. Das Verb nach zu steht am Ende.",
    examples: [
      "Ich mache eine Weiterbildung, um meine Chancen zu verbessern.",
      "Ich lerne Deutsch, um in Deutschland zu arbeiten.",
      "Ich spare Geld, um einen Kurs zu machen.",
      "Ich sammle Erfahrung, um später Teamleiter zu werden.",
    ],
    questions: [
      { stem: "Was passt? Ich lerne Deutsch, ___ in Deutschland zu arbeiten.", options: ["um", "weil", "als"], answer: 0, explanation: "um ... zu beschreibt ein Ziel." },
      { stem: "Welcher Satz ist richtig?", options: ["Ich mache einen Kurs, um bessere Chancen haben.", "Ich mache einen Kurs, um bessere Chancen zu haben.", "Ich mache einen Kurs, zu um bessere Chancen haben."], answer: 1, explanation: "um + ... + zu + Infinitiv." },
      { stem: "Was drückt um ... zu aus?", options: ["ein Ziel", "eine Vergangenheit", "einen Vergleich"], answer: 0, explanation: "um ... zu beantwortet: Wozu? Mit welchem Ziel?" },
      { stem: "Was passt? Ich arbeite viel, um Erfahrung ___.", options: ["sammeln", "zu sammeln", "gesammelt"], answer: 1, explanation: "Nach um steht zu + Infinitiv." },
    ],
    outputPrompt: "Nenne drei berufliche Ziele und erkläre jeweils mit um ... zu, warum du etwas tust.",
    starters: ["Ich möchte ...", "Ich mache ..., um ... zu ...", "Ich lerne ..., um ... zu ..."],
  },
  15: {
    title: "Seit + Dativ + Präsens",
    rule: "seit zeigt, dass etwas in der Vergangenheit begonnen hat und bis heute dauert. Im Deutschen benutzt du dafür meistens Präsens: seit + Dativ.",
    examples: [
      "Ich spiele seit zwei Jahren Fußball.",
      "Seit einem Monat gehe ich ins Fitnessstudio.",
      "Ich trainiere seit meiner Schulzeit regelmäßig.",
      "Wir spielen seit drei Wochen zusammen.",
    ],
    questions: [
      { stem: "Was passt? Ich spiele ___ zwei Jahren Tennis.", options: ["seit", "vor", "für"], answer: 0, explanation: "Die Aktivität begann früher und dauert noch an: seit." },
      { stem: "Welche Form ist richtig?", options: ["seit zwei Jahre", "seit zwei Jahren", "seit zwei Jahres"], answer: 1, explanation: "seit verlangt den Dativ: zwei Jahren." },
      { stem: "Was passt? Seit ___ Monat trainiere ich regelmäßig.", options: ["ein", "einen", "einem"], answer: 2, explanation: "der Monat → Dativ: einem Monat." },
      { stem: "Welcher Satz ist natürlich?", options: ["Ich habe seit zwei Jahren Fußball gespielt.", "Ich spiele seit zwei Jahren Fußball.", "Ich spielte seit zwei Jahren Fußball."], answer: 1, explanation: "Wenn es bis heute weitergeht, benutzt man meistens Präsens." },
    ],
    outputPrompt: "Sprich 4–5 Sätze über deinen Sport und sage, seit wann du ihn machst.",
    starters: ["Mein Lieblingssport ist ...", "Ich spiele/mache ... seit ...", "Ich trainiere ...", "Ich mag den Sport, weil ..."],
  },
};

const A2Days11To15QuickLearning = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      `${window.location.pathname || ""}${window.location.search || ""}`,
    );
  }, [workbookLevel]);

  if (workbookLevel !== "A2") return null;
  const lesson = A2_DAYS_11_TO_15_LEARNING[workbookDay];
  if (!lesson) return null;

  return (
    <section data-a2-days11-15-quick-learning="true" style={{ display: "grid", gap: 8 }}>
      <div style={{ color: "#1e3a8a", fontWeight: 800 }}>A2 Day {workbookDay} · Schnell lernen, dann anwenden</div>
      <A2MiniLearningBlock {...lesson} />
    </section>
  );
};

const detectTabKey = (text = "") => {
  const normalized = normalizeTabText(text);
  if (/teil\s*1\b|sprechen|speak/.test(normalized)) return "teil1";
  if (/teil\s*2\b|schreiben|write/.test(normalized)) return "teil2";
  if (/teil\s*3\b|lesen|read/.test(normalized)) return "teil3";
  if (/teil\s*4\b|horen|hoeren|listen/.test(normalized)) return "teil4";
  if (/\bref\b|reference|answers|antwort/.test(normalized)) return "ref";
  if (/submit|abgeben|send/.test(normalized)) return "submit";
  return "";
};

const isElementVisible = (element) => {
  if (!element || typeof window === "undefined") return false;
  const style = window.getComputedStyle?.(element);
  if (style && (style.display === "none" || style.visibility === "hidden" || style.opacity === "0")) return false;
  return true;
};

const shouldForceSharedA2Tabs = () => {
  if (typeof window === "undefined") return false;
  const pathname = window.location.pathname || "";
  return FORCE_SHARED_A2_TAB_PATHS.some((path) => pathname.startsWith(path));
};

const hideLegacyWorkbookTabSelectors = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll("div, nav").forEach((container) => {
    if (container.closest("[data-universal-a2-workbook-tabs]")) return;
    if (container.matches("[data-workbook-tab-navigation]") || container.querySelector("[data-workbook-tab-navigation]")) return;

    const directButtons = Array.from(container.children).filter((child) => child.tagName === "BUTTON");
    if (directButtons.length < 4 || directButtons.length > 8) return;

    const foundKeys = new Set();
    directButtons.forEach((button) => {
      const key = detectTabKey(button.textContent || "");
      if (key) foundKeys.add(key);
    });

    const hasWorkbookParts = ["teil1", "teil2", "teil3", "teil4"].every((key) => foundKeys.has(key));
    const hasWorkbookExtras = foundKeys.has("ref") || foundKeys.has("submit");
    if (!hasWorkbookParts || !hasWorkbookExtras) return;

    container.setAttribute("data-hidden-legacy-workbook-tabs", "true");
    container.style.display = "none";
  });
};

const hasCompleteVisibleWorkbookTabs = () => {
  if (typeof document === "undefined") return false;

  const sharedNav = document.querySelector("[data-workbook-tab-navigation]");
  if (sharedNav && isElementVisible(sharedNav)) return true;

  const foundKeys = new Set();
  document.querySelectorAll("button, a").forEach((element) => {
    if (element.closest("[data-universal-a2-workbook-tabs]")) return;
    if (!isElementVisible(element)) return;
    const key = detectTabKey(element.textContent || "");
    if (key) foundKeys.add(key);
  });
  return REQUIRED_A2_TAB_KEYS.every((key) => foundKeys.has(key));
};

const clickExistingWorkbookTab = (tab) => {
  if (typeof document === "undefined") return false;
  const candidates = Array.from(document.querySelectorAll("button, a"));
  const target = candidates.find((element) => {
    if (element.closest("[data-universal-a2-workbook-tabs]")) return false;
    return tab.match.test(element.textContent || "");
  });

  if (target) {
    target.click();
    target.scrollIntoView?.({ behavior: "smooth", block: "center" });
    return true;
  }

  const heading = Array.from(document.querySelectorAll("h1,h2,h3,h4,summary,strong")).find((element) => tab.match.test(element.textContent || ""));
  if (heading) {
    heading.scrollIntoView?.({ behavior: "smooth", block: "start" });
    return true;
  }

  return false;
};

const UniversalA2WorkbookTabs = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      `${window.location.pathname || ""}${window.location.search || ""}`,
    );
  }, [workbookLevel]);
  const [activeTab, setActiveTab] = useState("sprechen");
  const [showFallbackTabs, setShowFallbackTabs] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const submitRef = useRef(null);

  useEffect(() => {
    if (workbookLevel !== "A2") {
      setShowFallbackTabs(false);
      return undefined;
    }

    const checkTabs = () => {
      if (shouldForceSharedA2Tabs()) {
        hideLegacyWorkbookTabSelectors();
        setShowFallbackTabs(true);
        return;
      }

      setShowFallbackTabs(!hasCompleteVisibleWorkbookTabs());
    };

    const timeoutId = window.setTimeout(checkTabs, 50);
    const secondTimeoutId = window.setTimeout(checkTabs, 500);
    const observer = new MutationObserver(checkTabs);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(secondTimeoutId);
      observer.disconnect();
    };
  }, [workbookLevel]);

  if (workbookLevel !== "A2" || !showFallbackTabs) return null;

  const handleTabClick = (tabKey) => {
    const tab = UNIVERSAL_A2_WORKBOOK_TABS.find((item) => item.key === tabKey);
    if (!tab) return;

    setActiveTab(tab.key);
    if (tab.key === "grammar") {
      setShowSubmit(false);
      return;
    }

    if (tab.key === "submit") {
      setShowSubmit(true);
      window.setTimeout(() => submitRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }), 0);
      return;
    }

    setShowSubmit(false);
    clickExistingWorkbookTab(tab);
  };

  return (
    <section
      data-universal-a2-workbook-tabs="true"
      style={{
        ...styles.card,
        margin: 0,
        display: "grid",
        gap: 12,
        border: "1px solid #bfdbfe",
        background: "#f8fbff",
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <strong>A2 workbook navigation</strong>
        <span style={{ color: "#475569", fontSize: 13 }}>
          Use the shared workbook tabs below: Grammar, Teil 1, Teil 2, Teil 3, Teil 4, Ref and Submit.
        </span>
      </div>

      <WorkbookTabNav
        activeTab={activeTab}
        onChange={handleTabClick}
        tabs={STANDARD_WORKBOOK_TABS}
        ariaLabel={workbookDay ? `A2 Day ${workbookDay} workbook sections` : "A2 workbook sections"}
      />

      {showSubmit ? (
        <div ref={submitRef} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 10, background: "#fff" }}>
          <h3 style={{ margin: "0 0 8px" }}>Submit workbook</h3>
          <p style={{ margin: "0 0 10px", color: "#475569", lineHeight: 1.6 }}>
            Submit only your final answers here. Include Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören where required.
          </p>
          <AssignmentSubmissionPage />
        </div>
      ) : null}
    </section>
  );
};

export const A2B1WorkbookGuidance = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const workbookLabel = workbookLevel ? `${workbookLevel} workbook` : "workbook";
  const levelPrefix = workbookLevel || "A2/B1";

  return (
    <>
      <UniversalA2WorkbookTabs level={workbookLevel} />
      <A2Days11To15QuickLearning level={workbookLevel} />
      <details
        style={{
          ...styles.card,
          margin: 0,
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          color: "#1e3a8a",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            padding: 14,
            fontWeight: 800,
            fontSize: "1.02rem",
            listStylePosition: "inside",
          }}
        >
          How this workbook works · open guide
        </summary>

        <div style={{ display: "grid", gap: 10, padding: "0 14px 14px", lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            Use <strong>Grammar</strong> first when you need the lesson notes, then move through the four workbook parts of this {workbookLabel}. Use <strong>Ref</strong> for reflection and the <strong>Submit</strong> tab in the Course Book when your final answers are ready.
          </p>
          <p style={{ margin: 0 }}>
            <strong>{levelPrefix} · Teil 1 · Sprechen:</strong> prepare for class and practise with the AI speaking coach. Teil 1 is not submitted.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören:</strong> complete the tasks and send only your final answers through the <strong>Submit</strong> tab.
          </p>
        </div>
      </details>
    </>
  );
};

export const WorkbookSubmissionReminder = () => {
  const reminderRef = useRef(null);
  const [showDay20Submission, setShowDay20Submission] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDay20Workbook = window.location.pathname.includes(
      "/campus/course/a2-day-20-typische-reklamationssituationen-workbook"
    );
    const sectionTitle = reminderRef.current
      ?.closest("section")
      ?.querySelector("h2")
      ?.textContent?.trim()
      ?.toLowerCase();

    setShowDay20Submission(Boolean(isDay20Workbook && sectionTitle?.startsWith("submit workbook")));
  }, []);

  if (showDay20Submission) {
    return (
      <div
        ref={reminderRef}
        className="a2-day20-inline-submission"
        style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
      >
        <style>{`.a2-day20-inline-submission > div > section:first-child { display: none !important; }
        .a2-day20-inline-submission select { display: none !important; }
        .a2-day20-inline-submission ~ a[href="/campus/course?submitWork=1"] { display: none !important; }`}</style>
        <AssignmentSubmissionPage />
      </div>
    );
  }

  return (
    <div
      ref={reminderRef}
      role="note"
      style={{
        border: "1px solid #bfdbfe",
        borderRadius: 10,
        padding: "10px 12px",
        background: "#eff6ff",
        color: "#1e40af",
        fontWeight: 600,
        lineHeight: 1.5,
      }}
    >
      Reminder: Practise here, then submit only your final answers through the Submit tab.
    </div>
  );
};
