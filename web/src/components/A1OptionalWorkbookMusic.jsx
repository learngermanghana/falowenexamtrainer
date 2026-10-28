import React, { useState } from "react";
import WorkbookDayMusic from "./WorkbookDayMusic";

/**
 * Optional enrichment next to A1 teacher and AI videos.
 * The full workbook sections, Radio gate, timers and submission owner stay
 * untouched. Music is fetched only when this card is explicitly expanded.
 */
export default function A1OptionalWorkbookMusic({ day, mode = "tutor" }) {
  const numericDay = Number(day);
  const [open, setOpen] = useState(false);
  if (!Number.isInteger(numericDay) || numericDay < 1 || numericDay > 28) return null;

  return (
    <details
      data-a1-optional-music="true"
      data-a1-music-mode={mode === "self" ? "self" : "tutor"}
      data-a1-music-day={numericDay}
      onToggle={event => setOpen(event.currentTarget.open)}
      style={{
        background: "#f2faf3",
        border: "1px solid #b8ddc3",
        borderRadius: 14,
        padding: "13px 16px",
      }}
    >
      <summary
        style={{
          cursor: "pointer", color: "#175638", fontWeight: 800,
          display: "list-item", lineHeight: 1.6, fontSize: 14,
        }}
      >
        ♫ Music · Optional listening · Day {numericDay}
      </summary>
      <p style={{ margin: "10px 0", color: "#426554", fontSize: 13, lineHeight: 1.7 }}>
        {mode === "self"
          ? "Enjoy today's song after Radio. Music is not a self-learning requirement and will not affect your progress."
          : "A relaxed listening break before your tutor-marked assignment. You can skip this without affecting your submission."}
      </p>
      {open ? (
        <WorkbookDayMusic
          level="A1"
          day={numericDay}
          learningMode={mode === "self" ? "self" : "tutor"}
          hideLegacyNotes
          compact
        />
      ) : null}
    </details>
  );
}
