import React from "react";
import { styles } from "../styles";

const lesenLevels = [
  {
    level: "A1",
    description: "Lesen sample PDF.",
    url: "https://drive.google.com/file/d/1fCqzyTSkzaJIg7MBDhDtW_WOn6SWIV4r/view?usp=sharing",
    actionLabel: "Open A1 Lesen sample",
  },
  {
    level: "A2",
    description: "Lesen sample PDF.",
    url: "https://drive.google.com/file/d/1YMjpi2aJ6o3TkLOR3ld81SfNzdZQxMQB/view?usp=sharing",
    actionLabel: "Open A2 Lesen sample",
  },
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
  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0 }}>Lesen samples</h2>
        <p style={{ margin: "6px 0 0", color: "#4b5563" }}>
          Download the official PDFs and practice with a timer just like the exam day.
        </p>
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {lesenLevels.map((level) => (
          <div key={level.level} style={{ ...styles.card, margin: 0, display: "grid", gap: 10 }}>
            <div>
              <h3 style={{ margin: 0 }}>{level.level}</h3>
              <p style={{ margin: "6px 0 0", color: "#4b5563" }}>{level.description}</p>
            </div>
            {level.url ? (
              <a
                href={level.url}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}
              >
                {level.actionLabel}
              </a>
            ) : (
              <span style={{ fontSize: 14, color: "#9ca3af" }}>Available soon</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LesenPage;
