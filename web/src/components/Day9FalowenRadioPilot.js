import React, { useState } from "react";
import { styles } from "../styles";
import FalowenRadioTabContent from "./FalowenRadioTabContent";

const Day9FalowenRadioPilot = () => {
  const isPilotPage =
    typeof window !== "undefined" &&
    String(window.location.pathname || "")
      .replace(/\/+$/, "")
      .toLowerCase() === "/campus/course/a2-day-9-urlaub-workbook";
  const [open, setOpen] = useState(isPilotPage);

  if (!isPilotPage) return null;

  return (
    <section aria-label="Falowen Radio pilot tab" style={{ display: "grid", gap: 10 }}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        style={{
          ...styles.secondaryButton,
          width: "fit-content",
          borderColor: open ? "#2563eb" : "#d1d5db",
          background: open ? "#eff6ff" : "#fff",
          color: open ? "#1d4ed8" : "#111827",
          fontWeight: 700,
        }}
      >
        🎙️ Falowen Radio {open ? "▴" : "▾"}
      </button>

      {open && <FalowenRadioTabContent level="A2" day={9} onContinue={() => setOpen(false)} />}
    </section>
  );
};

export default Day9FalowenRadioPilot;
