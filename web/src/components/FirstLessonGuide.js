import React from "react";
import { styles } from "../styles";

export default function FirstLessonGuide() {
  return <details style={styles.card}>
    <summary style={{ cursor: "pointer", fontWeight: 700 }}>How to complete your first lesson</summary>
    <ol style={{ paddingLeft: 22, lineHeight: 1.7 }}>
      <li>Open Course Book and choose your current lesson. Start with Day 0 Orientation if you are new.</li>
      <li>Complete Falowen Radio first when required, then read Learn or Grammar.</li>
      <li>Try the practice tasks. Ask Study Buddy when you need an explanation.</li>
      <li>Use Submit when the workbook provides teacher-marked work. Self-practice does not need submission.</li>
      <li>Check Results for course assignment scores and tutor feedback after marking.</li>
    </ol>
  </details>;
}
