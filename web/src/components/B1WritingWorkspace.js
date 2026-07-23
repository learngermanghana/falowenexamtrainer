import React, { useMemo, useState } from "react";
import { B1_WRITING_CHEAT_SHEET } from "../data/writingCheatSheets";
import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "../data/writingVideoResources";
import { styles } from "../styles";
import WritingPage from "./WritingPage";
import { WritingVideoSupportCard } from "./WritingCheatSheetTabs";

const templateIds = {
  opinion: "b1-opinion-text-template",
  formal: "b1-formal-letter-template",
  informal: "b1-informal-letter-template",
};

const templateLabels = {
  opinion: "Opinion / Forum",
  formal: "Formal letter",
  informal: "Informal letter",
};

const templateHelpers = {
  opinion: "Use this for Meinung, Forum, Diskussion, Vorteile und Nachteile.",
  formal: "Use this for Vermieter, Schule, Firma, Amt or another official email.",
  informal: "Use this for friends, family or personal messages.",
};

const buildTemplateText = (key) => {
  const section = B1_WRITING_CHEAT_SHEET.find((item) => item.id === templateIds[key]);
  return (section?.items || []).map((item) => item.meaning).join("\n\n");
};

const templateText = Object.freeze({
  opinion: buildTemplateText("opinion"),
  formal: buildTemplateText("formal"),
  informal: buildTemplateText("informal"),
});

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  background: "#fff",
  color: "#111827",
  font: "inherit",
  lineHeight: 1.7,
  padding: 12,
  resize: "vertical",
};

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #bfdbfe",
  background: "#f8fafc",
  boxShadow: "none",
};

const wordCount = (value = "") => String(value || "").trim().split(/\s+/).filter(Boolean).length;

export default function B1WritingWorkspace({ writingContext = {} }) {
  const [pointsDraft, setPointsDraft] = useState("");
  const [draft, setDraft] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("opinion");
  const [copyStatus, setCopyStatus] = useState("");
  const supportItems = writingContext.supportStructure?.length
    ? writingContext.supportStructure
    : writingContext.taskPoints || [];
  const selectedTemplate = templateText[activeTemplate] || templateText.opinion;
  const writingVideo = getWritingVideoResource(
    writingContext.level || writingContext.courseLevel || "B1",
    writingContext.day,
  );
  const writingVideoEmbed = getYouTubeEmbedUrl(writingVideo?.url);

  const planningPlaceholder = useMemo(() => {
    if (!supportItems.length) {
      return "Write your Stichpunkte here before you start.\n1. ...\n2. ...\n3. ...";
    }
    return supportItems.map((item, index) => `${index + 1}. ${item} → ...`).join("\n");
  }, [supportItems]);

  const insertTemplate = () => {
    setDraft((current) => {
      if (!String(current || "").trim()) return selectedTemplate;
      return `${current.trim()}\n\n${selectedTemplate}`;
    });
  };

  const copyDraft = async () => {
    if (!draft.trim()) return;
    try {
      await navigator.clipboard?.writeText?.(draft);
      setCopyStatus("Draft copied. Paste it into Mark My Letter below.");
    } catch (_error) {
      setCopyStatus("Select your draft and copy it, then paste it into Mark My Letter below.");
    }
  };

  return (
    <div data-b1-writing-workspace="restored" style={{ display: "grid", gap: 14 }}>
      <section style={cardStyle} aria-label="B1 writing planning points">
        <div>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
            Step 1 · Plan your points
          </span>
          <h3 style={{ margin: "8px 0 4px" }}>Stichpunkte / ideas</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Note the points you must answer before writing the full text.
          </p>
        </div>
        {supportItems.length ? (
          <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.7 }}>
            {supportItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
          </ul>
        ) : null}
        <textarea
          aria-label="B1 planning points"
          value={pointsDraft}
          onChange={(event) => setPointsDraft(event.target.value)}
          placeholder={planningPlaceholder}
          style={{ ...textareaStyle, minHeight: 150 }}
        />
      </section>

      {writingVideo?.url ? (
        <WritingVideoSupportCard writingVideo={writingVideo} writingVideoEmbed={writingVideoEmbed} />
      ) : null}

      <section style={cardStyle} aria-label="B1 fast writing templates">
        <div>
          <span style={{ ...styles.badge, width: "fit-content", background: "#ede9fe", color: "#5b21b6" }}>
            Step 2 · Choose a template
          </span>
          <h3 style={{ margin: "8px 0 4px" }}>Fast writing structure</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Choose the writing type and insert the structure into your Schreiben box.
          </p>
        </div>
        <div role="tablist" aria-label="Choose B1 writing template" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.keys(templateIds).map((key) => {
            const selected = activeTemplate === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTemplate(key)}
                style={{
                  ...(selected ? styles.primaryButton : styles.secondaryButton),
                  borderRadius: 999,
                }}
              >
                {templateLabels[key]}
              </button>
            );
          })}
        </div>
        <p style={{ margin: 0, color: "#475569" }}>{templateHelpers[activeTemplate]}</p>
        <div
          data-b1-template-preview={activeTemplate}
          style={{
            whiteSpace: "pre-line",
            border: "1px solid #dbeafe",
            borderRadius: 12,
            padding: 12,
            background: "#fff",
            lineHeight: 1.7,
          }}
        >
          {selectedTemplate}
        </div>
        <button type="button" onClick={insertTemplate} style={{ ...styles.secondaryButton, width: "fit-content" }}>
          Insert {templateLabels[activeTemplate]} template into Schreiben
        </button>
      </section>

      <section style={cardStyle} aria-label="B1 Schreiben draft">
        <div>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dcfce7", color: "#166534" }}>
            Step 3 · Write
          </span>
          <h3 style={{ margin: "8px 0 4px" }}>Your Schreiben</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Write the complete answer here first. B1 target: about 80–120 words.
          </p>
        </div>
        <textarea
          aria-label="B1 writing draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write your complete B1 text here..."
          style={{ ...textareaStyle, minHeight: 280 }}
        />
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <strong>{wordCount(draft)} words</strong>
          <button type="button" onClick={copyDraft} disabled={!draft.trim()} style={styles.secondaryButton}>
            Copy Schreiben for Mark My Letter
          </button>
          {copyStatus ? <span role="status" style={{ color: "#475569" }}>{copyStatus}</span> : null}
        </div>
      </section>

      <section style={cardStyle} aria-label="B1 Mark My Letter">
        <div>
          <span style={{ ...styles.badge, width: "fit-content", background: "#fef3c7", color: "#92400e" }}>
            Step 4 · Check and improve
          </span>
          <h3 style={{ margin: "8px 0 4px" }}>Mark My Letter</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Paste your completed Schreiben below. Falowen will mark it, explain corrections and show an improved version.
          </p>
        </div>
        <WritingPage
          mode="course"
          initialTab="mark"
          enabledTabs={["mark"]}
          hideTabList
          markLabel="Mark My Letter"
          submitLabel="Mark My Letter"
          writingContext={writingContext}
        />
      </section>
    </div>
  );
}

export const __TESTING__ = { templateText, wordCount };
