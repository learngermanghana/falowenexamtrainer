import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { fetchNextTask, fetchWeeklySummary } from "../services/coachService";

const CoachPanel = () => {
  const [nextTask, setNextTask] = useState(null);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetchNextTask()
      .then((data) => setNextTask(data))
      .catch(() => setNextTask(null));

    fetchWeeklySummary()
      .then((data) => setSummary(data?.summary || ""))
      .catch(() => setSummary(""));
  }, []);

  return (
    <aside style={{ ...styles.card, position: "sticky", top: 16 }}>
      <h3 style={styles.sectionTitle}>Coach</h3>
      <p style={styles.helperText}>
        Hallo! I’m your AI coach. I’ll keep recommending the next focus based on
        your latest scores.
      </p>

      {nextTask ? (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>{nextTask.title}</div>
          <div style={{ fontSize: 14, color: "#111827", marginTop: 4 }}>
            {nextTask.prompt}
          </div>
          <div style={{ fontSize: 13, color: "#2563eb", marginTop: 6 }}>
            Skill: {nextTask.skill} · Tip: {nextTask.tip}
          </div>
        </div>
      ) : (
        <p style={styles.helperText}>Loading next task …</p>
      )}

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Weekly snapshot</div>
        <div style={{ whiteSpace: "pre-wrap", fontSize: 14, color: "#111827" }}>
          {summary || "You haven’t trained this week. Start a quick attempt!"}
        </div>
      </div>
    </aside>
  );
};

export default CoachPanel;
