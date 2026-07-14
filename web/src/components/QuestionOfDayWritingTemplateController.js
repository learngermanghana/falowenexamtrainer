import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { loadPreferredLevel } from "../services/levelStorage";
import { styles } from "../styles";
import { __TESTING__ as templateLibrary } from "./QuestionOfDayWritingTemplateInjector";

const TEMPLATE_HOST_ID = "falowen-question-of-day-writing-template-host";
const SUPPORTED_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1"]);
const {
  buildQuestionOfDayWritingTemplates,
  findWritingAnswerTextarea,
} = templateLibrary;

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

const readWritingPromptText = (section) => {
  if (!section) return "";
  const heading = Array.from(section.querySelectorAll("h3")).find(
    (node) => String(node.textContent || "").trim() === "Schreiben"
  );
  const questionPanel = heading?.closest("div");
  return String(questionPanel?.textContent || section.textContent || "").trim();
};

export const inferQuestionOfDayTemplateId = (
  level,
  promptText,
  templates = buildQuestionOfDayWritingTemplates(level)
) => {
  const text = String(promptText || "").toLowerCase();
  const findKind = (...kinds) => {
    for (const kind of kinds) {
      const match = templates.find((template) => template.kind === kind);
      if (match) return match.id;
    }
    return "";
  };

  if (/rede|konferenz|vortrag|ansprache/.test(text)) {
    return findKind("speech", "opinion", "formal");
  }
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
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;
  if (setter) setter.call(textarea, value);
  else textarea.value = value;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.dispatchEvent(new Event("change", { bubbles: true }));
  textarea.focus();
  return true;
};

const selectSubmissionRegister = (kind) => {
  const register = kind === "informal" ? "informal" : "formal";
  document
    .querySelector(`input[name="letterType"][value="${register}"]`)
    ?.click();
};

const TemplatePanel = ({ level, promptText }) => {
  const templates = useMemo(
    () => buildQuestionOfDayWritingTemplates(level),
    [level]
  );
  const recommendedId = useMemo(
    () => inferQuestionOfDayTemplateId(level, promptText, templates),
    [level, promptText, templates]
  );
  const [message, setMessage] = useState("");

  useEffect(() => setMessage(""), [level, promptText]);

  const orderedTemplates = useMemo(() => {
    const recommended = templates.find((template) => template.id === recommendedId);
    return recommended
      ? [recommended, ...templates.filter((template) => template.id !== recommendedId)]
      : templates;
  }, [recommendedId, templates]);

  const insertTemplate = (template) => {
    const textarea = findWritingAnswerTextarea(findExamWarmupSection());
    if (!textarea) {
      setMessage("Open the Submit tab before inserting a template.");
      return;
    }

    const current = String(textarea.value || "").trim();
    const knownTemplate = templates.some(
      (item) => current === String(item.template || "").trim()
    );
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
    setMessage(
      `${template.label} inserted. Replace every [bracket] with your own information.`
    );
  };

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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: 8,
        }}
      >
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
              <span>
                {recommended ? "Recommended · " : ""}
                {template.label}
              </span>
              <small style={{ fontWeight: 500, lineHeight: 1.35 }}>
                {template.useFor}
              </small>
            </button>
          );
        })}
      </div>

      <p style={{ ...styles.helperText, margin: 0 }}>
        Formal register is selected automatically for opinion, report, analysis, proposal and speech tasks; informal is selected for personal letters.
      </p>
      {message ? (
        <p role="status" style={{ margin: 0, color: "#166534", fontWeight: 700 }}>
          {message}
        </p>
      ) : null}
    </section>
  );
};

export default function QuestionOfDayWritingTemplateController() {
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
      setPromptText((current) =>
        current === nextPromptText ? current : nextPromptText
      );
      setTarget((current) => (current === host ? current : host));
      return Boolean(host);
    };

    install();
    const timers = [100, 350, 900, 1800].map((delay) =>
      window.setTimeout(install, delay)
    );
    const observer = new MutationObserver(install);
    observer.observe(document.body, { childList: true, subtree: true });
    const levelTimer = window.setInterval(
      () => setLevel(readActiveLevel()),
      800
    );

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
    <TemplatePanel level={level} promptText={promptText} />,
    target
  );
}

export const __TESTING__ = {
  inferQuestionOfDayTemplateId,
  isExamQuestionRoute,
  readWritingPromptText,
};
