import React from "react";
import { styles } from "../styles";
import { useOfflineStatus } from "../hooks/useOfflineStatus";

function OfflineBanner() {
  const { isOffline } = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div
      style={{
        ...styles.card,
        marginTop: 12,
        marginBottom: 20,
        borderColor: "#f59e0b",
        background: "#fffbeb",
        color: "#92400e",
        display: "grid",
        gap: 6,
      }}
      role="status"
      aria-live="polite"
    >
      <strong style={{ fontSize: 14 }}>Offline mode enabled</strong>
      <span style={{ fontSize: 13, color: "#78350f" }}>
        You can keep practicing with cached lessons and saved drafts. Live feedback, submissions, and sync will resume once
        you reconnect.
      </span>
    </div>
  );
}

export default OfflineBanner;
