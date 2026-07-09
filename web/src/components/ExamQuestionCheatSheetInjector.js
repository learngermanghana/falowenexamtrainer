import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { getWritingCheatSheet } from "../data/writingCheatSheets";
import { loadPreferredLevel } from "../services/levelStorage";
import { styles } from "../styles";

const BUTTON_HOST_ID = "falowen-exam-question-cheat-sheet-button-host";
const PANEL_HOST_ID = "falowen-exam-question-cheat-sheet-panel-host";
const SUPPORTED_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1"]);

const A1_EXAM_WRITING_CHEAT_SHEET = [
  {
    id: "a1-writing-basics",
    title: "A1 writing basics · Simple message rules",
    items: [
      { phrase: "30 Wörter", meaning: "Write about 30 words. Short correct sentences are better than long wrong sentences." },
      { phrase: "Anrede + Gruß", meaning: "Always add a greeting and a closing." },
      { phrase: "Ich schreibe dir/Ihnen, weil ...", meaning: "Use this to explain why you are writing." },
      { phrase: "Kannst du ...? / Können Sie ...?", meaning: "Use this for a question or request." },
      { phrase: "weil + verb at the end", meaning: "Example: Ich komme nicht, weil ich krank bin." },
      { phrase: "simple word order", meaning: "Statement: Ich habe am Samstag Zeit. Question: Hast du am Samstag Zeit?" },
    ],
  },
  {
    id: "a1-useful-small-phrases",
    title: "A1 useful phrases · Copy and adapt",
    items: [
      { phrase: "Wie geht es dir?", meaning: "How are you?" },
      { phrase: "Ich hoffe, es geht dir gut.", meaning: "I hope you are well." },
      { phrase: "Vielen Dank für deine/Ihre Nachricht.", meaning: "Thank you for your message." },
      { phrase: "Ich habe eine Frage.", meaning: "I have a question." },
      { phrase: "Leider kann ich nicht kommen.", meaning: "Unfortunately I cannot come." },
      { phrase: "Bitte antworte mir bald.", meaning: "Please reply soon." },
    ],
  },
  {
    id: "a1-formal-letter-template",
    title: "A1 FORMAL LETTER · Use this for school, office, course, doctor or official message",
    layout: "template",
    items: [
      { phrase: "Anrede", meaning: "Sehr geehrte Damen und Herren,\nSehr geehrte Frau [Name] / Sehr geehrter Herr [Name]," },
      { phrase: "Start", meaning: "ich schreibe Ihnen, weil [Grund]." },
      { phrase: "Information", meaning: "Ich möchte [Information]. / Ich habe [Problem]." },
      { phrase: "Frage", meaning: "Können Sie mir bitte helfen? / Können Sie mir bitte antworten?" },
      { phrase: "Schluss", meaning: "Vielen Dank.\n\nMit freundlichen Grüßen\n[Ihr Name]" },
    ],
  },
  {
    id: "a1-informal-letter-template",
    title: "A1 INFORMAL LETTER · Use this for friend or family",
    layout: "template",
    items: [
      { phrase: "Anrede", meaning: "Liebe/r [Name],\nHallo [Name]," },
      { phrase: "Start", meaning: "wie geht es dir? Ich hoffe, es geht dir gut." },
      { phrase: "Grund", meaning: "ich schreibe dir, weil [Grund]." },
      { phrase: "Information", meaning: "Ich möchte [Information]. / Ich habe [Problem]." },
      { phrase: "Frage", meaning: "Kannst du mir bitte helfen? / Hast du Zeit?" },
      { phrase: "Schluss", meaning: "Schreib mir bald.\n\nLiebe Grüße\n[Ihr Name]" },
    ],
  },
];

const FORMAL_LETTER_STRUCTURE = {
  id: "exam-formal-letter-structure",
  title: "FORMAL LETTER STRUCTURE · Use this for official emails",
  layout: "template",
  items: [
    { phrase: "Betreff", meaning: "Betreff: [kurzes Anliegen]" },
    { phrase: "Anrede", meaning: "Sehr geehrte Damen und Herren,\nSehr geehrte Frau [Name] / Sehr geehrter Herr [Name]," },
    { phrase: "Grund", meaning: "ich schreibe Ihnen, weil [Grund]." },
    { phrase: "Hauptteil", meaning: "Zuerst [Punkt 1]. Außerdem [Punkt 2]. Ich möchte gern wissen, ob/wann/wie [Frage]." },
    { phrase: "Bitte", meaning: "Könnten Sie mir bitte antworten? / Für eine schnelle Antwort wäre ich Ihnen dankbar." },
    { phrase: "Gruß", meaning: "Mit freundlichen Grüßen\n[Ihr Name]" },
  ],
};

const INFORMAL_LETTER_STRUCTURE = {
  id: "exam-informal-letter-structure",
  title: "INFORMAL LETTER STRUCTURE · Use this for friends and family",
  layout: "template",
  items: [
    { phrase: "Anrede", meaning: "Liebe/r [Name],\nHallo [Name]," },
    { phrase: "Start", meaning: "wie geht es dir? Ich hoffe, es geht dir gut." },
    { phrase: "Grund", meaning: "ich schreibe dir, weil [Grund]." },
    { phrase: "Hauptteil", meaning: "Ich möchte dir erzählen, dass [Information]. Außerdem [weitere Information]." },
    { phrase: "Frage", meaning: "Hast du Zeit? / Was meinst du dazu? / Kannst du mir helfen?" },
    { phrase: "Gruß", meaning: "Schreib mir bald.\n\nLiebe Grüße\n[Ihr Name]" },
  ],
};

const normalizeLevel = (value) => {
  const normalized = String(value || "").trim().toUpperCase();
  return SUPPORTED_LEVELS.has(normalized) ? normalized : "A1";
};

const readActiveLevel = () => normalizeLevel(loadPreferredLevel());

const isExamQuestionRoute = (pathname = "") =>
  String(pathname || "").replace(/\/+$/, "") === "/exams/question";

const findExamWarmupSection = () =>
  Array.from(document.querySelectorAll("section")).find((section) =>
    String(section.querySelector("h2")?.textContent || "").trim() === "Exam Warm-up"
  );

const findExamTabBar = (section) => {
  if (!section) return null;
  return Array.from(section.querySelectorAll("div")).find((node) => {
    const labels = Array.from(node.querySelectorAll("button")).map((button) =>
      String(button.textContent || "").trim()
    );
    return labels.includes("Questions") && labels.includes("Teacher Feedback");
  });
};

const buildExamCheatSheet = (level) => {
  const normalizedLevel = normalizeLevel(level);
  const baseSheet = normalizedLevel === "A1" ? A1_EXAM_WRITING_CHEAT_SHEET : getWritingCheatSheet(normalizedLevel, 1);
  const sheet = Array.isArray(baseSheet) ? [...baseSheet] : [];
  const titles = sheet.map((section) => String(section.title || "").toLowerCase());
  const hasFormal = titles.some((title) => title.includes("formal letter"));
  const hasInformal = titles.some((title) => title.includes("informal letter"));

  if (!hasFormal) sheet.push({ ...FORMAL_LETTER_STRUCTURE, id: `${normalizedLevel.toLowerCase()}-${FORMAL_LETTER_STRUCTURE.id}` });
  if (!hasInformal) sheet.push({ ...INFORMAL_LETTER_STRUCTURE, id: `${normalizedLevel.toLowerCase()}-${INFORMAL_LETTER_STRUCTURE.id}` });

  return sheet;
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1rem",
  color: "#1e3a8a",
};

const CheatSheetContent = ({ level }) => {
  const cheatSheet = useMemo(() => buildExamCheatSheet(level), [level]);

  return (
    <div style={{ ...styles.card, margin: "10px 0", background: "#f8fbff", border: "2px solid #bfdbfe", display: "grid", gap: 14 }}>
      <div>
        <h3 style={{ margin: "0 0 4px" }}>Cheat Sheet · {level} Schreiben reference</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Use this as a quick reference before you write. Choose formal or informal depending on the question.
        </p>
      </div>

      {cheatSheet.map((section) => {
        const isTemplate = section.layout === "template";
        return (
          <section key={section.id} style={{ display: "grid", gap: 10 }}>
            <h4 style={sectionTitleStyle}>{section.title}</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isTemplate ? "1fr" : "repeat(auto-fit,minmax(min(100%,260px),1fr))",
                gap: 8,
              }}
            >
              {section.items.map((item) => (
                <div
                  key={`${section.id}-${item.phrase}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isTemplate ? "minmax(90px,170px) minmax(0,1fr)" : "1fr",
                    gap: 10,
                    alignItems: "start",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: 12,
                    background: "#ffffff",
                    overflowWrap: "anywhere",
                  }}
                >
                  <strong style={{ color: "#0f172a" }}>{item.phrase}</strong>
                  <span style={{ color: "#475569", whiteSpace: "pre-line", lineHeight: 1.7 }}>{item.meaning}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default function ExamQuestionCheatSheetInjector() {
  const location = useLocation();
  const [targets, setTargets] = useState({ button: null, panel: null });
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(readActiveLevel);
  const enabled = isExamQuestionRoute(location.pathname);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      if (typeof document !== "undefined") {
        document.getElementById(BUTTON_HOST_ID)?.remove();
        document.getElementById(PANEL_HOST_ID)?.remove();
      }
      setTargets({ button: null, panel: null });
      setOpen(false);
      return undefined;
    }

    const install = () => {
      const section = findExamWarmupSection();
      const tabBar = findExamTabBar(section);
      if (!tabBar) return false;

      let buttonHost = document.getElementById(BUTTON_HOST_ID);
      if (!buttonHost) {
        buttonHost = document.createElement("span");
        buttonHost.id = BUTTON_HOST_ID;
        buttonHost.style.display = "contents";
        tabBar.appendChild(buttonHost);
      }

      let panelHost = document.getElementById(PANEL_HOST_ID);
      if (!panelHost) {
        panelHost = document.createElement("div");
        panelHost.id = PANEL_HOST_ID;
        tabBar.parentNode?.insertBefore(panelHost, tabBar.nextSibling);
      }

      setTargets({ button: buttonHost, panel: panelHost });
      return true;
    };

    install();
    const timers = [100, 350, 900, 1800].map((delay) => window.setTimeout(install, delay));
    const observer = new MutationObserver(() => install());
    observer.observe(document.body, { childList: true, subtree: true });

    const closeOnExistingTabClick = (event) => {
      const button = event.target?.closest?.("button");
      if (!button || button.dataset.examCheatSheetTab === "true") return;
      const section = findExamWarmupSection();
      const tabBar = findExamTabBar(section);
      if (tabBar?.contains(button)) setOpen(false);
    };
    document.addEventListener("click", closeOnExistingTabClick, true);

    const levelTimer = window.setInterval(() => setLevel(readActiveLevel()), 800);

    return () => {
      document.removeEventListener("click", closeOnExistingTabClick, true);
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(levelTimer);
      document.getElementById(BUTTON_HOST_ID)?.remove();
      document.getElementById(PANEL_HOST_ID)?.remove();
      setTargets({ button: null, panel: null });
    };
  }, [enabled]);

  if (!enabled || !targets.button || !targets.panel) return null;

  return (
    <>
      {createPortal(
        <button
          type="button"
          data-exam-cheat-sheet-tab="true"
          style={open ? styles.navButtonActive : styles.secondaryButton}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls={PANEL_HOST_ID}
        >
          Cheat Sheet
        </button>,
        targets.button
      )}
      {open ? createPortal(<CheatSheetContent level={level} />, targets.panel) : null}
    </>
  );
}

export const __TESTING__ = {
  A1_EXAM_WRITING_CHEAT_SHEET,
  buildExamCheatSheet,
  findExamTabBar,
  isExamQuestionRoute,
};
