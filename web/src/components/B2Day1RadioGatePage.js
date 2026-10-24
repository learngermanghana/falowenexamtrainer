import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import B2Day1IdentityPilotLessonPage from "./B2Day1IdentityPilotLessonPage";
import { styles } from "../styles";

export const shouldShowB2Day1RadioIntro = (falowenRadio) => Boolean(falowenRadio);

export default function B2Day1RadioGatePage({ lesson, falowenRadio = null }) {
  const [hasEnteredLesson, setHasEnteredLesson] = useState(
    () => !shouldShowB2Day1RadioIntro(falowenRadio),
  );

  if (hasEnteredLesson) {
    return (
      <B2Day1IdentityPilotLessonPage
        lesson={lesson}
        falowenRadio={null}
      />
    );
  }

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header
        style={{
          ...styles.card,
          display: "grid",
          gap: 10,
          border: "1px solid #bfdbfe",
          borderRadius: 20,
          background: "linear-gradient(135deg, #eff6ff, #f8fafc)",
        }}
      >
        <span
          style={{
            ...styles.badge,
            width: "fit-content",
            background: "#dbeafe",
            color: "#1e3a8a",
          }}
        >
          Start here
        </span>
        <h1 style={{ margin: 0 }}>B2 · Day 1 · Persönliche Identität und Selbstverständnis</h1>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Listen to Falowen Radio first. When you click Continue, the radio closes and the four lesson tabs open: Learn, Speak, Write and Finish.
        </p>
      </header>

      <FalowenRadioTabContent
        level="B2"
        day={1}
        resource={falowenRadio}
        onContinue={() => {
          setHasEnteredLesson(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
