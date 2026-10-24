import React from "react";
import { useNavigate } from "react-router-dom";
import { announceExamSuccess } from "../services/interactionFeedback";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import A1ReadingPracticeSamples, { A1_READING_PRACTICE_SAMPLES } from "./A1ReadingPracticeSamples";
import A2ReadingPracticeSamples, { A2_READING_PRACTICE_SAMPLES } from "./A2ReadingPracticeSamples";
import B1ReadingPracticeSamples from "./B1ReadingPracticeSamples";
import { B1_READING_PRACTICE_SAMPLES } from "../data/b1ReadingPracticeSamples";
import C1FinalMockExamPage from "./C1FinalMockExamPage";
import { READING_LEVELS } from "./ReadingPracticeShell";
import "./ReadingPracticeShell.css";

const lesenLevels = [
  {
    level: "B2",
    description: "PDF coming soon.",
    url: null,
  },

];

const C1_READING_PRACTICE_SAMPLES = Object.freeze([
  {
    id: "c1-reading-01",
    slug: "sample-1",
    label: "C1 Lesen Sample 1",
    detail: "30 questions · Teil 1–4",
  },
]);

const sampleMetaForLevel = (level) => {
  const samples = level === "B1" ? B1_READING_PRACTICE_SAMPLES :
    level === "A2" ? A2_READING_PRACTICE_SAMPLES : A1_READING_PRACTICE_SAMPLES;
  const questionCount = level === "B1" ? 30 : level === "A2" ? 20 : 15;
  const partCount = level === "B1" ? 5 : level === "A2" ? 4 : 3;

  return samples.map((sample, index) => ({
    id: sample.id,
    slug: `sample-${index + 1}`,
    label: `Lesen Sample ${index + 1}`,
    detail: `${questionCount} questions · Teil 1–${partCount}`,
  }));
};

const SampleList = ({ level, samples, onOpen, onLevelChange }) => (
  <main className="reading-unified-landing">
    <header>
      <p style={{ fontWeight: 800, fontSize: 12, letterSpacing: ".08em", color: "#64748b", marginBottom: 4 }}>FALOWEN · EXAMS ROOM</p>
      <h1>Lesen Practice</h1>
      <p style={{ color: "#526579", margin: "8px 0 0" }}>Choose your level, open a reading sample, and continue your progress.</p>
    </header>
    <nav aria-label="Lesen level selector" className="reading-unified-levels">
      {Object.keys(READING_LEVELS).map((item) => <button type="button" key={item}
        aria-pressed={level === item}
        onClick={() => onLevelChange(item)}>{item}</button>)}
    </nav>
    <section aria-labelledby="lesen-sample-heading">
      <h2 id="lesen-sample-heading" style={{ marginBottom: 6 }}>{level} Reading Samples</h2>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        {READING_LEVELS[level].samples
          ? `${READING_LEVELS[level].questions} questions · ${READING_LEVELS[level].parts} Teile · ${READING_LEVELS[level].minutes} minutes`
          : "Interactive samples are not yet published at this level."}
      </p>
      <div className="reading-unified-samples">
        {samples.map((sample, i) => <button type="button" className="reading-unified-sample"
          key={sample.id} onClick={() => onOpen(sample)}>
          <span style={{ fontSize: 12, color: "#64748b" }}>SAMPLE {i + 1}</span>
          <strong>{sample.label}</strong>
          <small>{sample.detail}</small>
          <span style={{ fontWeight: 800, color: "#23455e" }}>Open practice →</span>
        </button>)}
        {!samples.length ? <section role="status" style={{ padding: 22, background: "#fff", border: "1px solid #dbe3ed", borderRadius: 15 }}>
          <strong>Reading samples coming soon</strong>
          <p style={{ marginBottom: 0, color: "#64748b" }}>No interactive sample is published for {level} yet. You can choose another level above.</p>
        </section> : null}
      </div>
    </section>
  </main>
);

const LesenPage = ({ practiceLevel = "", sampleId = "" }) => {
  const navigate = useNavigate();
  const openReadingSample = (route, message = "Lesen practice opened successfully.") => {
    announceExamSuccess(message);
    navigate(route);
  };
  const { level } = useExam();
  const profileLevel = String(level || "A1").toUpperCase();
  const routeLevel = String(practiceLevel || "").toUpperCase();
  const normalizedLevel = ["A1", "A2", "B1", "B2", "C1", "C2"].includes(routeLevel)
    ? routeLevel
    : profileLevel;

  const changeLevel = (nextLevel) => navigate(`/exams/lesen/${nextLevel.toLowerCase()}`);

  if (normalizedLevel === "C1") {
    const samples = C1_READING_PRACTICE_SAMPLES;
    const selected = sampleId ? samples.find((item) => item.slug === sampleId) : null;

    if (sampleId && !selected) {
      return (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0 }}>C1 Lesen sample not found</h2>
          <button type="button" style={styles.secondaryButton} onClick={() => openReadingSample("/exams/lesen", "Lesen samples opened successfully.")}>
            Back to Lesen samples
          </button>
        </section>
      );
    }

    if (!selected) {
      return (
        <SampleList
          level="C1"
          samples={samples}
          onLevelChange={changeLevel}
          onOpen={(sample) => openReadingSample(`/exams/lesen/c1/${sample.slug}`, `${sample.label} opened successfully.`)}
        />
      );
    }

    return <C1FinalMockExamPage />;
  }

  if (["A1", "A2", "B1"].includes(normalizedLevel)) {
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
          onLevelChange={changeLevel}
          onOpen={(sample) => openReadingSample(`/exams/lesen/${normalizedLevel.toLowerCase()}/${sample.slug}`, `${sample.label} opened successfully.`)}
        />
      );
    }

    return normalizedLevel === "B1" ? (
      <B1ReadingPracticeSamples initialSampleId={selected.id} standalone />
    ) : normalizedLevel === "A2" ? (
      <A2ReadingPracticeSamples initialSampleId={selected.id} standalone />
    ) : (
      <A1ReadingPracticeSamples initialSampleId={selected.id} standalone />
    );
  }

  // Keep unavailable B2/C2 visible in the same progression, without
  // inventing samples or silently routing students to a different level.
  return <SampleList level={normalizedLevel} samples={[]} onLevelChange={changeLevel}
    onOpen={() => {}} />;
};

export default LesenPage;
