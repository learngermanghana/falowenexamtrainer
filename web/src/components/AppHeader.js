import React from "react";
import { styles } from "../styles";

const AppHeader = ({
  userEmail,
  notificationStatus,
  notificationMessage,
  notificationError,
  onEnableNotifications,
  onLogout,
}) => {
  const isNotificationPending = notificationStatus === "pending";
  const isNotificationGranted = notificationStatus === "granted";

  return (
    <header
      style={{
        ...styles.header,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1 style={styles.title}>Falowen Exam Coach</h1>
        <p style={styles.subtitle}>
          Choose your next step: Level Check, Daily Trainer, or a full simulation.
        </p>
      </div>

      <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
        <div style={{ fontSize: 13, color: "#374151" }}>Signed in as {userEmail}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            style={styles.secondaryButton}
            onClick={onEnableNotifications}
            disabled={isNotificationPending || isNotificationGranted}
          >
            {isNotificationGranted
              ? "Push ready"
              : isNotificationPending
              ? "Enabling ..."
              : "Allow push notifications"}
          </button>
          <button style={styles.dangerButton} onClick={onLogout}>
            Logout
          </button>
        </div>
        {notificationMessage && (
          <div style={{ ...styles.helperText, margin: 0 }}>{notificationMessage}</div>
        )}
        {notificationError && (
          <div style={{ ...styles.errorBox, marginTop: 4 }}>{notificationError}</div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
