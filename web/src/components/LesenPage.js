import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import A1ReadingPracticeSamples, { A1_READING_PRACTICE_SAMPLES } from "./A1ReadingPracticeSamples";
import A2ReadingPracticeSamples, { A2_READING_PRACTICE_SAMPLES } from "./A2ReadingPracticeSamples";

const lesenLevels = [
  {
    level: "B1",
    description: "Lesen sample PDF.",
    url: "https://drive.google.com/file/d/1Iqho5cIe_2RJKz66JMfA22LGHoYwurfy/view?usp=sharing",
    actionLabel: "Open B1 Lesen sample",
  },
  {
    level: "B2",
    description: "PDF coming soon.",
    url: null,
  },
  {
    level: "C1",
    description: "PDF coming soon.",
    url: null,
  },
];

const sampleMetaForLevel = (level) => {
  const samples = level === "A2" ? A2_READING_PRACTICE_SAMPLES : A1_READING_PRACTICE_SAMPLES;
  const questionCount = level === "A2" ? 20 : 15;
  const partCount = level === "A2" ? 4 : 3;

  return samples.map((sample, index) => ({
    id: sample.id,
    slug: `sample-${index + 1}`,
    label: `Lesen Sample ${index + 1}`,
    detail: `${questionCount} questions · Teil 1–${partCount}`,
  }));
};

const SampleList = ({ level, samples, onOpen }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <div>
      <h2 style={{ margin: 0 }}>{level} Lesen practice</h2>
      <p style={{ margin: "6px 0 0", color: "#4b5563" }}>
        Choose one sample. Each sample opens on its own page.
      </p>
    </div>

    <div style={{ display: "grid", gap: 10 }}>
      {samples.map((sample) => (
        <button
          key={sample.id}
          type="button"
          onClick={() => onOpen(sample)}
          style={{
            ...styles.secondaryButton,
            width: "100%",
            textAlign: "left",
            display: "grid",
            gap: 4,
            padding: "14px 16px",
          }}
        >
          <strong>{sample.label}</strong>
          <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}>{sample.detail}</span>
        </button>
      ))}
    </div>
  </section>
);

const LesenPage = ({ practiceLevel = "", sampleId = "" }) => {
  const navigate = useNavigate();
  const { level } = useExam();
  const profileLevel = String(level || "A1").toUpperCase();
  const routeLevel = String(practiceLevel || "").toUpperCase();
  const normalizedLevel = ["A1", "A2"].includes(routeLevel) ? routeLevel : profileLevel;

  if (normalizedLevel === "A1" || normalizedLevel === "A2") {
    const samples = sampleMetaForLevel(normalizedLevel);
    const selected = sampleId ? samples.find((item) => item.slug === sampleId) : null;

    if (sampleId && !selected) {
      return (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0 }}>{normalizedLevel} Lesen sample not found</h2>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/exams/lesen")}>
            Back to Lesen samples
          </button>
        </section>
      );
    }

    if (!selected) {
      return (
        <SampleList
          level={normalizedLevel}
          samples={samples}
          onOpen={(sample) => navigate(`/exams/lesen/${normalizedLevel.toLowerCase()}/${sample.slug}`)}
        />
      );
    }

    return normalizedLevel === "A2" ? (
      <A2ReadingPracticeSamples initialSampleId={selected.id} standalone />
    ) : (
      <A1ReadingPracticeSamples initialSampleId={selected.id} standalone />
    );
  }

  const resource = lesenLevels.find((item) => item.level === normalizedLevel);

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0 }}>Lesen samples</h2>
        <p style={{ margin: "6px 0 0", color: "#4b5563" }}>
          Reading resources for level <strong>{normalizedLevel}</strong>.
        </p>
      </div>
      {resource ? (
        <div style={{ ...styles.card, margin: 0, display: "grid", gap: 10 }}>
          <div>
            <h3 style={{ margin: 0 }}>{resource.level}</h3>
            <p style={{ margin: "6px 0 0", color: "#4b5563" }}>{resource.description}</p>
          </div>
          {resource.url ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}
            >
              {resource.actionLabel}
            </a>
          ) : (
            <span style={{ fontSize: 14, color: "#9ca3af" }}>Available soon</span>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default LesenPage;
