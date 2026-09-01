import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { getWritingCheatSheet } from "../data/writingCheatSheets";
import { loadPreferredLevel } from "../services/levelStorage";
import { styles } from "../styles";
import {
  A2_FORMAL_LETTER_TEMPLATE,
  A2_INFORMAL_LETTER_TEMPLATE,
} from "./A2WritingWorkspaceSupport";

const TEMPLATE_HOST_ID = "falowen-question-of-day-writing-template-host";
const SUPPORTED_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1"]);

const A1_FORMAL_WRITING_TEMPLATE = `Sehr geehrte Damen und Herren,
Sehr geehrte Frau [Name] / Sehr geehrter Herr [Name],

ich hoffe, es geht Ihnen gut.
Ich schreibe Ihnen, weil [Grund].

[Schreiben Sie einen einfachen deutschen Satz zu Punkt 1.]
[Schreiben Sie einen einfachen deutschen Satz zu Punkt 2.]
[Schreiben Sie einen einfachen deutschen Satz zu Punkt 3.]

Ich möchte wissen, ob [Frage].
Können Sie mir bitte [Bitte]?

Ich freue mich im Voraus auf Ihre Antwort.

Mit freundlichen Grüßen
[Ihr vollständiger Name]`;

const A1_INFORMAL_WRITING_TEMPLATE = `Hallo [Name],
Liebe [Name] / Lieber [Name],

wie geht es dir? Ich hoffe, es geht dir gut.
Ich schreibe dir, weil [Grund].

[Schreibe einen einfachen deutschen Satz zu Punkt 1.]
[Schreibe einen einfachen deutschen Satz zu Punkt 2.]
[Schreibe einen einfachen deutschen Satz zu Punkt 3.]

Ich möchte wissen, ob [Frage].
Kannst du mir bitte [Bitte]?

Ich freue mich im Voraus auf deine Antwort.

Liebe Grüße / Viele Grüße
[Dein Name]`;

const B2_REPORT_TEMPLATE = `Bericht über [Thema]

Einleitung
Der vorliegende Bericht informiert über [Thema/Ziel]. Die Grundlage bilden [Umfrage, Analyse oder Beobachtung].

Durchführung
Zunächst wurde [Methode/Ablauf] durchgeführt. Dabei wurden [Teilnehmer, Zeitraum oder Kriterien] berücksichtigt.

Ergebnisse
Die wichtigsten Ergebnisse zeigen, dass [Ergebnis 1]. Darüber hinaus wurde festgestellt, dass [Ergebnis 2].

Bewertung
Diese Entwicklung ist positiv/negativ zu bewerten, weil [Begründung]. Besonders wichtig ist, dass [Folge oder Bedeutung].

Empfehlung
Daher empfehle ich, [Maßnahme 1] umzusetzen. Außerdem sollte [Maßnahme 2] geprüft werden.

Schluss
Zusammenfassend lässt sich sagen, dass [kurzes Fazit].`;

const C1_ANALYSIS_TEMPLATE = `Analyse: [Thema]

Einleitung und Fragestellung
Die vorliegende Analyse befasst sich mit [Thema] und untersucht insbesondere, inwiefern [Leitfrage].

Ausgangslage
Zunächst ist festzuhalten, dass [Kontext/Ausgangslage]. Dabei spielen sowohl [Aspekt 1] als auch [Aspekt 2] eine zentrale Rolle.

Analyse
Ein wesentlicher Einflussfaktor besteht darin, dass [Argument/Beobachtung 1]. Darüber hinaus zeigt sich, dass [Argument/Beobachtung 2]. Dies hat zur Folge, dass [Konsequenz].

Chancen und Risiken
Einerseits bietet diese Entwicklung die Chance, [Chance]. Andererseits darf nicht übersehen werden, dass [Risiko].

Abwägung
Unter Berücksichtigung beider Seiten ist festzustellen, dass [differenzierte Bewertung].

Handlungsempfehlung
Aus diesem Grund sollten [Akteure] [Maßnahme] umsetzen. Entscheidend wäre dabei, dass [Bedingung].

Fazit
Zusammenfassend lässt sich feststellen, dass [abschließendes Ergebnis/Ausblick].`;

const C1_PROPOSAL_TEMPLATE = `Projektvorschlag: [Projekttitel]

Ausgangslage
Der vorliegende Vorschlag verfolgt das Ziel, [Problem/Ziel] nachhaltig zu bearbeiten.

Zielsetzung
Das Projekt soll [Hauptziel] erreichen. Darüber hinaus wird angestrebt, [Nebenziel].

Beteiligte und Aufgaben
An dem Projekt sind [Partner/Akteure] beteiligt. [Partner 1] übernimmt [Aufgabe], während [Partner 2] für [Aufgabe] zuständig ist.

Umsetzung
Die Umsetzung erfolgt in folgenden Schritten: Zunächst [Schritt 1]. Anschließend [Schritt 2]. Abschließend [Schritt 3].

Ressourcen und Finanzierung
Für die Durchführung werden [Ressourcen] benötigt. Die Finanzierung soll durch [Finanzierungsquelle] gesichert werden.

Erfolgskontrolle
Der Erfolg wird daran gemessen, ob [Kriterium 1] und [Kriterium 2] erreicht werden.

Fazit
Zusammenfassend bietet das Projekt die Möglichkeit, [Nutzen]. Daher empfehle ich eine zeitnahe Umsetzung.`;

const C1_SPEECH_TEMPLATE = `Rede zum Thema [Thema]

Anrede
Sehr geehrte Damen und Herren,
liebe Teilnehmerinnen und Teilnehmer,

Einleitung
ich freue mich, heute über [Thema] sprechen zu dürfen. Dieses Thema ist besonders relevant, weil [Begründung].

Hauptpunkt 1
Zunächst möchte ich hervorheben, dass [Argument 1]. Ein Beispiel dafür ist [Beispiel].

Hauptpunkt 2
Darüber hinaus darf nicht übersehen werden, dass [Argument 2]. Dies zeigt sich insbesondere daran, dass [Beispiel/Folge].

Gegenposition und Bewertung
Kritiker führen an, dass [Gegenargument]. Diese Position ist nachvollziehbar, greift jedoch zu kurz, weil [Entkräftung].

Appell / Ausblick
Aus diesem Grund sollten wir [konkreter Appell oder Maßnahme]. Entscheidend ist, dass [Bedingung].

Schluss
Ich danke Ihnen für Ihre Aufmerksamkeit und freue mich auf die anschließende Diskussion.`;

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

const findWritingAnswerTextarea = (section) => {
  if (!section) return null;
  return (
    section.querySelector('textarea[placeholder="Write your Goethe-style answer here..."]') ||
    Array.from(section.querySelectorAll("textarea")).find((textarea) =>
      /Goethe-style answer|Schreiben answer/i.test(
        `${textarea.getAttribute("placeholder") || ""} ${textarea.getAttribute("aria-label") || ""}`
      )
    ) ||
    null
  );
};

const readWritingPromptText = (section) => {
  if (!section) return "";
  const schreibenHeading = Array.from(section.querySelectorAll("h3")).find(
    (heading) => String(heading.textContent || "").trim() === "Schreiben"
  );
  const questionPanel = schreibenHeading?.closest("div");
  return String(questionPanel?.textContent || section.textContent || "").trim();
};

const templateSectionToDraft = (section) =>
  (section?.items || [])
    .map((item) => String(item?.meaning || "").trim())
    .filter(Boolean)
    .join("\n\n");

const templateKindFromSection = (section) => {
  const text = `${section?.id || ""} ${section?.title || ""}`.toLowerCase();
  if (text.includes("informal")) return "informal";
  if (text.includes("formal")) return "formal";
  if (/opinion|meinung|stellungnahme|erörterung|eroerterung/.test(text)) return "opinion";
  return "writing";
};

const labelForTemplateSection = (section) => {
  const kind = templateKindFromSection(section);
  if (kind === "formal") return "Formal letter/email";
  if (kind === "informal") return "Informal letter/email";
  if (kind === "opinion") return "Opinion text";
  return section?.title || "Writing template";
};

const buildQuestionOfDayWritingTemplates = (level) => {
  const normalizedLevel = normalizeLevel(level);

  if (normalizedLevel === "A1") {
    return [
      {
        id: "a1-informal",
        kind: "informal",
        label: "A1 informal letter",
        useFor: "Friend, family member or personal message. Use short, simple phrases for each task point.",
        template: A1_INFORMAL_WRITING_TEMPLATE,
      },
      {
        id: "a1-formal",
        kind: "formal",
        label: "A1 formal letter",
        useFor: "School, office, hotel, doctor, company or an unknown person. Use one simple phrase for each point.",
        template: A1_FORMAL_WRITING_TEMPLATE,
      },
    ];
  }

  if (normalizedLevel === "A2") {
    return [
      {
        id: "a2-informal",
        kind: "informal",
        label: "A2 informal letter",
        useFor: "Friend, family member, neighbour or personal message.",
        template: A2_INFORMAL_LETTER_TEMPLATE,
      },
      {
        id: "a2-formal",
        kind: "formal",
        label: "A2 formal letter",
        useFor: "Company, school, landlord, office, course provider or an unknown person.",
        template: A2_FORMAL_LETTER_TEMPLATE,
      },
    ];
  }

  const existingTemplates = getWritingCheatSheet(normalizedLevel, 1)
    .filter((section) => section?.layout === "template")
    .map((section) => {
      const kind = templateKindFromSection(section);
      return {
        id: section.id,
        kind,
        label: labelForTemplateSection(section),
        useFor:
          kind === "formal"
            ? "Official emails, complaints, enquiries, applications or formal requests."
            : kind === "informal"
              ? "Friends, family and personal messages."
              : "Opinion, forum, discussion, Stellungnahme or argument tasks.",
        template: templateSectionToDraft(section),
      };
    });

  if (normalizedLevel === "B2") {
    existingTemplates.push({
      id: "b2-report",
      kind: "report",
      label: "B2 report",
      useFor: "Reports about analyses, surveys, project results or recommendations.",
      template: B2_REPORT_TEMPLATE,
    });
  }

  if (normalizedLevel === "C1") {
    existingTemplates.push(
      {
        id: "c1-analysis",
        kind: "analysis",
        label: "C1 analysis / report",
        useFor: "Analyses, expert reports, evaluations and balanced recommendations.",
        template: C1_ANALYSIS_TEMPLATE,
      },
      {
        id: "c1-proposal",
        kind: "proposal",
        label: "C1 project proposal",
        useFor: "Project proposals, cooperation plans and structured recommendations.",
        template: C1_PROPOSAL_TEMPLATE,
      },
      {
        id: "c1-speech",
        kind: "speech",
        label: "C1 speech / conference contribution",
        useFor: "Speeches, conference contributions and formal presentations.",
        template: C1_SPEECH_TEMPLATE,
      }
    );
  }

  return existingTemplates.filter((template) => template.template);
};

const inferRecommendedTemplateId = (
  level,
  promptText,
  templates = buildQuestionOfDayWritingTemplates(level)
) => {
  const text = String(promptText || "").toLowerCase();
  const findKind = (...kinds) => templates.find((template) => kinds.includes(template.kind))?.id || "";

  if (/rede|konferenz|vortrag|ansprache/.test(text)) return findKind("speech", "opinion", "formal");
  if (/projektvorschlag|projekt vorschlag|kooperation|konzept/.test(text)) {
    return findKind("proposal", "analysis", "report", "formal");
  }
  if (/analyse|gutachten|bericht|marktanalyse|kundenumfrage|ergebnisse/.test(text)) {
    return findKind("analysis", "report", "opinion", "formal");
  }
  if (/meinung|stellungnahme|kommentar|forum|leserbrief|erörterung|eroerterung|diskussion|artikel|blogbeitrag/.test(text)) {
    return findKind("opinion", "analysis", "report", "formal");
  }
  if (/freund|freundin|bruder|schwester|familie|mutter|vater|partner|partnerin|persönliche nachricht|persoenliche nachricht/.test(text)) {
    return findKind("informal", "formal");
  }
  return findKind("formal", "opinion", "report", "analysis", "informal");
};

const setNativeTextareaValue = (textarea, value) => {
  if (!textarea) return false;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  if (setter) setter.call(textarea, value);
  else textarea.value = value;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.dispatchEvent(new Event("change", { bubbles: true }));
  textarea.focus();
  return true;
};

const selectSubmissionRegister = (kind) => {
  const register = kind === "informal" ? "informal" : "formal";
  const radio = document.querySelector(`input[name="letterType"][value="${register}"]`);
  radio?.click();
};

const WritingTemplateInsertPanel = ({ level, promptText }) => {
  const templates = useMemo(() => buildQuestionOfDayWritingTemplates(level), [level]);
  const recommendedId = useMemo(
    () => inferRecommendedTemplateId(level, promptText, templates),
    [level, promptText, templates]
  );
  const [message, setMessage] = useState("");

  useEffect(() => setMessage(""), [level, promptText]);

  const insertTemplate = (template) => {
    const textarea = findWritingAnswerTextarea(findExamWarmupSection());
    if (!textarea) {
      setMessage("Open the Submit tab before inserting a template.");
      return;
    }

    const current = String(textarea.value || "").trim();
    const knownTemplate = templates.some((item) => current === String(item.template || "").trim());
    if (current && !knownTemplate && current !== String(template.template || "").trim()) {
      const shouldReplace = window.confirm(
        "This will replace your current Question of the Day answer with the selected template. Continue?"
      );
      if (!shouldReplace) return;
    }

    if (!setNativeTextareaValue(textarea, template.template)) {
      setMessage("The answer box could not be updated. Please try again.");
      return;
    }

    selectSubmissionRegister(template.kind);
    setMessage(`${template.label} inserted. Replace every [bracket] with your own information.`);
  };

  const orderedTemplates = [...templates].sort(
    (left, right) => Number(right.id === recommendedId) - Number(left.id === recommendedId)
  );

  if (!orderedTemplates.length) return null;

  return (
    <section
      data-question-of-day-writing-templates="true"
      style={{
        border: "1px solid #a5b4fc",
        borderRadius: 14,
        padding: 12,
        background: "linear-gradient(135deg,#eef2ff,#ffffff)",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <strong style={{ color: "#312e81" }}>Insert a writing template</strong>
        <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>
          Choose the structure that matches today’s question. The recommended option appears first. Replace every bracket and keep only the sentences you need.
        </p>
        {level === "A1" ? (
          <p style={{ margin: 0, color: "#1e3a8a", lineHeight: 1.6 }}>
            <strong>A1:</strong> use short, simple German phrases in the body. The template already gives you the introduction and conclusion.
          </p>
        ) : null}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 8 }}>
        {orderedTemplates.map((template) => {
          const recommended = template.id === recommendedId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => insertTemplate(template)}
              style={{
                ...(recommended ? styles.primaryButton : styles.secondaryButton),
                minHeight: 72,
                textAlign: "left",
                display: "grid",
                gap: 4,
                alignContent: "center",
              }}
              title={template.useFor}
            >
              <span>{recommended ? "Recommended · " : ""}{template.label}</span>
              <small style={{ fontWeight: 500, lineHeight: 1.35 }}>{template.useFor}</small>
            </button>
          );
        })}
      </div>

      <p style={{ ...styles.helperText, margin: 0 }}>
        Formal register is selected automatically for opinion, report, analysis, proposal and speech tasks; informal is selected for personal letters.
      </p>
      {message ? <p role="status" style={{ margin: 0, color: "#166534", fontWeight: 700 }}>{message}</p> : null}
    </section>
  );
};

export default function QuestionOfDayWritingTemplateInjector() {
  const location = useLocation();
  const [target, setTarget] = useState(null);
  const [level, setLevel] = useState(readActiveLevel);
  const [promptText, setPromptText] = useState("");
  const enabled = isExamQuestionRoute(location.pathname);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      if (typeof document !== "undefined") {
        document.getElementById(TEMPLATE_HOST_ID)?.remove();
      }
      setTarget(null);
      setPromptText("");
      return undefined;
    }

    const install = () => {
      const section = findExamWarmupSection();
      const textarea = findWritingAnswerTextarea(section);
      let host = document.getElementById(TEMPLATE_HOST_ID);

      if (textarea && !host) {
        host = document.createElement("div");
        host.id = TEMPLATE_HOST_ID;
        textarea.parentNode?.insertBefore(host, textarea);
      }

      if (!textarea && host) {
        host.remove();
        host = null;
      }

      const nextPromptText = readWritingPromptText(section);
      setPromptText((current) => current === nextPromptText ? current : nextPromptText);
      setTarget((current) => current === host ? current : host);
      return Boolean(host);
    };

    install();
    const timers = [100, 350, 900, 1800].map((delay) => window.setTimeout(install, delay));
    const observer = new MutationObserver(install);
    observer.observe(document.body, { childList: true, subtree: true });
    const levelTimer = window.setInterval(() => setLevel(readActiveLevel()), 800);

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(levelTimer);
      document.getElementById(TEMPLATE_HOST_ID)?.remove();
      setTarget(null);
    };
  }, [enabled]);

  if (!enabled || !target) return null;

  return createPortal(
    <WritingTemplateInsertPanel level={level} promptText={promptText} />,
    target
  );
}

export const __TESTING__ = {
  A1_FORMAL_WRITING_TEMPLATE,
  A1_INFORMAL_WRITING_TEMPLATE,
  buildQuestionOfDayWritingTemplates,
  findWritingAnswerTextarea,
  inferRecommendedTemplateId,
  isExamQuestionRoute,
  templateSectionToDraft,
};
