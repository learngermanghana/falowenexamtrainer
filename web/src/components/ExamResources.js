import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";
import { useExam } from "../context/ExamContext";

const goetheLevelLinks = {
  lesen: [
    {
      level: "A1",
      url: "https://bfu.goethe.de/a1_sd1/lesen.php",
      label: "A1 Lesen practice",
    },
    { level: "A2", url: "https://bfu.goethe.de/a2_mod_2MX5/lesen.php" },
    { level: "B1", url: "https://bfu.goethe.de/b1_mod/lesen.php" },
    { level: "B2", url: "https://bfu.goethe.de/b2_mod_2MX6/lesen.php" },
    { level: "C1", url: "https://bfu.goethe.de/c1mod/#lesen" },
  ],
  horen: [
    { level: "A1", url: "https://bfu.goethe.de/a1_sd1/hoeren.php" },
    { level: "A2", url: "https://bfu.goethe.de/a2_mod_2MX5/hoeren.php" },
    { level: "B1", url: "https://bfu.goethe.de/b1_mod/hoeren.php" },
    { level: "B2", url: "https://bfu.goethe.de/b2_mod_2MX6/hoeren.php" },
    { level: "C1", url: "https://bfu.goethe.de/c1mod/#hoeren" },
  ],
};

const resources = [
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

const ExamResources = () => {
  const { t, i18n } = useTranslation();
  const { level } = useExam();

  const levelLinks = useMemo(
    () => ({
      lesen: goetheLevelLinks.lesen.find((item) => item.level === level),
      horen: goetheLevelLinks.horen.find((item) => item.level === level),
    }),
    [level]
  );

  useEffect(() => {
    updatePageMeta({
      title: t("examResources.meta.title"),
      description: t("examResources.meta.description"),
      lang: i18n.language,
    });
  }, [i18n.language, t]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, margin: "0 0 6px 0" }}>
          Level-aware Goethe links (Lesen & Hören)
        </h3>
        <p style={{ ...styles.helperText, margin: "0 0 12px 0" }}>
          Showing links for level <strong>{level}</strong>. Switch levels in the Exams Room header.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          <div style={{ ...styles.card, margin: 0, boxShadow: "none" }}>
            <h4 style={{ margin: "0 0 6px 0" }}>Lesen</h4>
            {levelLinks.lesen ? (
              <ul style={{ ...styles.checklist, margin: 0 }}>
                <li>
                  <strong>{levelLinks.lesen.level}:</strong>{" "}
                  <a href={levelLinks.lesen.url} target="_blank" rel="noreferrer">
                    {levelLinks.lesen.label ?? "Goethe Lesen practice"}
                  </a>
                </li>
              </ul>
            ) : (
              <p style={{ ...styles.helperText, margin: 0 }}>
                No reading link is available for this level yet.
              </p>
            )}
          </div>

          <div style={{ ...styles.card, margin: 0, boxShadow: "none" }}>
            <h4 style={{ margin: "0 0 6px 0" }}>Hören</h4>
            {levelLinks.horen ? (
              <ul style={{ ...styles.checklist, margin: 0 }}>
                <li>
                  <strong>{levelLinks.horen.level}:</strong>{" "}
                  <a href={levelLinks.horen.url} target="_blank" rel="noreferrer">
                    Goethe Hören practice
                  </a>
                </li>
              </ul>
            ) : (
              <p style={{ ...styles.helperText, margin: 0 }}>
                No listening link is available for this level yet.
              </p>
            )}
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
