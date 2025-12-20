import React from "react";
import { styles } from "../styles";
import ClassCalendarCard from "./ClassCalendarCard";

const GeneralHome = ({ onSelectArea, studentProfile }) => {
  const preferredClass = studentProfile?.className;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <ClassCalendarCard initialClassName={preferredClass} />

      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Welcome back</p>
        <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Choose your learning space</h2>
        <p style={styles.helperText}>
          Pick the area that matches your focus today. All instructions stay in English so you can navigate quickly and spend
          more time practising.
        </p>
      </section>

      <div style={styles.gridTwo}>
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ ...styles.helperText, margin: 0 }}>Campus</p>
              <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Classes, course book, and AI helpers</h3>
            </div>
            <span style={styles.badge}>Daily work</span>
          </div>
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>Course book access, assignment submission, and results.</li>
            <li>Grammar Q&amp;A, Chat Buddy, and the original writing coach.</li>
            <li>Group discussion and your account settings.</li>
          </ul>
          <div>
            <button style={styles.primaryButton} onClick={() => onSelectArea("campus")}>
              Enter Campus
            </button>
          </div>
        </section>

        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ ...styles.helperText, margin: 0 }}>Exams Room</p>
              <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Speaking, Schreiben trainer, resources</h3>
            </div>
            <span style={styles.badge}>Exam mode</span>
          </div>
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>Speaking practice prompts organised by level.</li>
            <li>Schreiben trainer with timed letters and idea generation.</li>
            <li>Goethe Lesen/Hören links and quick exam-day reminders.</li>
          </ul>
          <div>
            <button style={styles.secondaryButton} onClick={() => onSelectArea("exams")}>
              Go to Exams Room
            </button>
          </div>
        </section>
      </div>

      <ClassVideoSpotlight studentProfile={studentProfile} />
    </div>
  );
};

export default GeneralHome;
