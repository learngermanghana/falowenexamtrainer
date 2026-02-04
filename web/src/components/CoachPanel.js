import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { fetchNextTask } from "../services/coachService";
import { useAuth } from "../context/AuthContext";

const CoachPanel = ({ className = "" }) => {
  const [nextTask, setNextTask] = useState(null);
  const { user, idToken } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;

    fetchNextTask({ userId, idToken })
      .then((data) => setNextTask(data))
      .catch(() => setNextTask(null));
  }, [userId, idToken]);

  return (
    <aside className={`coach-panel ${className}`.trim()} style={{ ...styles.card }}>
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

    </aside>
  );
};

export default CoachPanel;
