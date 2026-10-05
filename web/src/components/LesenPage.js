import React from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import A1ReadingPracticeSamples from "./A1ReadingPracticeSamples";
import A2ReadingPracticeSet from "./A2ReadingPracticeSet";

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

const LesenPage = () => {
  const { level } = useExam();
  const normalizedLevel = String(level || "A1").toUpperCase();

  if (normalizedLevel === "A1") {
    return <A1ReadingPracticeSamples />;
  }

  if (normalizedLevel === "A2") {
    return (
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>A2 Lesen practice</h2>
          <p style={{ margin: "6px 0 0", color: "#4b5563" }}>
            Interactive A2 reading practice with a separate question bank from the Course Book mock.
          </p>
        </div>
        <A2ReadingPracticeSet />
      </section>
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
