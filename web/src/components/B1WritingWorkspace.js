import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "../data/writingVideoResources";
import { styles } from "../styles";
import WritingPage from "./WritingPage";
import { WritingVideoSupportCard } from "./WritingCheatSheetTabs";

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

export default function B1WritingWorkspace({ writingContext = {} }) {
  const [pointsDraft, setPointsDraft] = useState("");
  const markMyLetterRootRef = useRef(null);
  const supportItems = writingContext.supportStructure?.length
    ? writingContext.supportStructure
    : writingContext.taskPoints || [];
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

  useEffect(() => {
    const placeMarkButtonLast = () => {
      const root = markMyLetterRootRef.current;
      if (!root) return;
      const button = Array.from(root.querySelectorAll("button")).find(
        (item) => String(item.textContent || "").trim() === "Mark My Letter",
      );
      if (!button?.parentElement) return;
      button.parentElement.appendChild(button);
      button.setAttribute("data-b1-mark-my-letter-final-action", "true");
    };

    placeMarkButtonLast();
    const timer = window.setTimeout(placeMarkButtonLast, 250);
    return () => window.clearTimeout(timer);
  }, [writingContext]);

  return (
    <div data-b1-writing-workspace="restored" style={{ display: "grid", gap: 14 }}>
      <section style={cardStyle} aria-label="B1 writing planning points">
        <div>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
            Step 1 · Plan your points
          </span>
          <h3 style={{ margin: "8px 0 4px" }}>Stichpunkte / ideas</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Note the points you must answer before writing the full text. English is okay in this planning box.
          </p>
        </div>
        {writingContext.taskTitle ? (
          <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, background: "#fff" }}>
            <strong>Writing task</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.7 }}>{writingContext.taskTitle}</p>
          </div>
        ) : null}
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

      <section style={cardStyle} aria-label="B1 Mark My Letter">
        <div>
          <span style={{ ...styles.badge, width: "fit-content", background: "#fef3c7", color: "#92400e" }}>
            Step 2 · Write, check and improve
          </span>
          <h3 style={{ margin: "8px 0 4px" }}>Write your letter</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Write your completed Schreiben in the box below. When you finish, use Mark My Letter as the final action at the bottom of this box.
          </p>
        </div>
        <div ref={markMyLetterRootRef} data-b1-mark-my-letter-area="true">
          <WritingPage
            mode="course"
            initialTab="mark"
            enabledTabs={["mark"]}
            hideTabList
            markLabel="Mark My Letter"
            submitLabel="Mark My Letter"
            markDescription="Write your complete German letter in this box, then use the Mark My Letter button at the bottom to check and improve your work."
            draftLabel="Your complete German letter"
            draftPlaceholder="Write your complete German letter here..."
            writingContext={writingContext}
          />
        </div>
      </section>
    </div>
  );
}
