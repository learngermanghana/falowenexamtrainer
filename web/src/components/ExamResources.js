import React from "react";
import { styles } from "../styles";
import { goetheExamLevels } from "../data/goetheExamSchedule";
import { downloadExamReminder } from "../services/examCalendar";

const goetheLevelLinks = {
  lesen: [
    { level: "A1", url: "https://www.goethe.de/ins/mm/en/spr/prf/gzsd1/ueb.html" },
    { level: "A2", url: "https://www.goethe.de/ins/mm/en/spr/prf/gzsd2/ueb.html" },
    { level: "B1", url: "https://www.goethe.de/ins/mm/en/spr/prf/gzb1/ueb.html" },
    { level: "B2", url: "https://www.goethe.de/ins/mm/en/spr/prf/gzb2/ue9.html" },
    { level: "C1", url: "https://www.goethe.de/ins/be/en/spr/prf/gzc1/u24.html" },
  ],
  horen: [
    { level: "A1", url: "https://www.goethe.de/ins/mm/en/spr/prf/gzsd1/ueb.html" },
    { level: "A2", url: "https://www.goethe.de/ins/mm/en/spr/prf/gzsd2/ueb.html" },
    { level: "B1", url: "https://www.goethe.de/ins/mm/en/spr/prf/gzb1/ueb.html" },
    { level: "B2", url: "https://www.goethe.de/ins/mm/en/spr/prf/gzb2/ue9.html" },
    { level: "C1", url: "https://www.goethe.de/ins/be/en/spr/prf/gzc1/u24.html" },
  ],
};

const resources = [
  {
    title: "Goethe Lesen & Hören practice",
    items: [
      {
        label: "Goethe practice portal",
        url: "https://www.goethe.de/prf/deindex.html",
        note: "Official sample tests and model answers by level.",
      },
      {
        label: "Goethe audio samples",
        url: "https://www.goethe.de/prf/ueb/enindex.htm",
        note: "Play the Hören tracks and take notes like exam day.",
      },
      {
        label: "Lesen strategies",
        url: "https://www.goethe.de/prf/ueb/lv/enindex.htm",
        note: "Scan for keywords first, then read for detail in round two.",
      },
    ],
  },
  {
    title: "Before the exam",
    items: [
      { label: "Pack your passport and pencils the night before.", url: null },
      { label: "Sleep early and drink water; avoid heavy meals.", url: null },
      { label: "Skim one reading text and one listening clip as a warm-up.", url: null },
    ],
  },
  {
    title: "During the exam",
    items: [
      { label: "Underline keywords in the task (Zeit, Ort, Personen, Zahlen).", url: null },
      { label: "For Schreiben: copy the task bullets to your notes, then tick them off.", url: null },
      { label: "For Hören: glance at the options first; predict possible answers.", url: null },
      { label: "If stuck, breathe once, skip, and come back with a clear head.", url: null },
    ],
  },
];

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString();
};

const ExamResources = () => {
  const hasExamDates = goetheExamLevels.some((level) => (level.exams || []).length > 0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Exam calendar</p>
        {!hasExamDates ? (
          <div style={styles.helperText}>Exam dates are not published yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {goetheExamLevels.map((levelInfo) => (
              <div
                key={`exam-reminder-${levelInfo.level}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  background: "#ffffff",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 900, color: "#111827" }}>
                  {levelInfo.level} · {levelInfo.title}
                </div>
                {levelInfo.exams.length === 0 ? (
                  <div style={styles.helperText}>No exam dates listed yet.</div>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {levelInfo.exams.map((exam, index) => (
                      <div
                        key={`${levelInfo.level}-reminder-${exam.date}-${index}`}
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "#f9fafb",
                          borderRadius: 10,
                          padding: "8px 10px",
                          border: "1px solid #f3f4f6",
                        }}
                      >
                        <div style={{ fontSize: 13, color: "#374151" }}>
                          📅 {formatDate(exam.date)} · {levelInfo.location}
                        </div>
                        <button
                          type="button"
                          style={{ ...styles.secondaryButton, padding: "4px 8px", fontSize: 12 }}
                          onClick={() => downloadExamReminder({ levelInfo, exam })}
                        >
                          Add reminder (.ics)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, margin: "0 0 6px 0" }}>Level-aware Goethe links (Lesen & Hören)</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          <div style={{ ...styles.card, margin: 0, boxShadow: "none" }}>
            <h4 style={{ margin: "0 0 6px 0" }}>Lesen</h4>
            <ul style={{ ...styles.checklist, margin: 0 }}>
              {goetheLevelLinks.lesen.map((item) => (
                <li key={`lesen-${item.level}`}>
                  <strong>{item.level}:</strong>{" "}
                  <a href={item.url} target="_blank" rel="noreferrer">
                    Goethe Lesen practice
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ ...styles.card, margin: 0, boxShadow: "none" }}>
            <h4 style={{ margin: "0 0 6px 0" }}>Hören</h4>
            <ul style={{ ...styles.checklist, margin: 0 }}>
              {goetheLevelLinks.horen.map((item) => (
                <li key={`horen-${item.level}`}>
                  <strong>{item.level}:</strong>{" "}
                  <a href={item.url} target="_blank" rel="noreferrer">
                    Goethe Hören practice
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {resources.map((group) => (
        <section key={group.title} style={styles.card}>
          <h3 style={{ ...styles.sectionTitle, margin: "0 0 6px 0" }}>{group.title}</h3>
          <ul style={{ ...styles.checklist, margin: 0 }}>
            {group.items.map((item, idx) => (
              <li key={`${group.title}-${idx}`}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
                {item.note ? <span style={{ marginLeft: 6, color: "#4b5563" }}>— {item.note}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default ExamResources;
