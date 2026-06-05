import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const getBrowserPermission = () => {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission || "default";
};

const statusCopy = {
  granted: {
    label: "Enabled on this device",
    detail: "This device can receive Falowen push notifications.",
    tone: "success",
  },
  pending: {
    label: "Setting up...",
    detail: "Falowen is requesting or refreshing your notification token.",
    tone: "info",
  },
  blocked: {
    label: "Blocked in browser settings",
    detail: "Notifications are blocked. Open your browser/site settings and allow notifications for Falowen.",
    tone: "error",
  },
  stale: {
    label: "Needs refresh",
    detail: "This device had a saved token before, but the browser permission needs to be refreshed.",
    tone: "warning",
  },
  error: {
    label: "Setup failed",
    detail: "Something went wrong while enabling notifications. Try again or contact support.",
    tone: "error",
  },
  idle: {
    label: "Not enabled yet",
    detail: "Enable notifications to receive class notes, score updates and important reminders.",
    tone: "info",
  },
};

const getToneStyle = (tone) => {
  if (tone === "success") return { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" };
  if (tone === "warning") return { border: "#fde68a", background: "#fffbeb", color: "#92400e" };
  if (tone === "error") return { border: "#fecaca", background: "#fef2f2", color: "#991b1b" };
  return { border: "#bfdbfe", background: "#eff6ff", color: "#1e40af" };
};

const NotificationSettingsCard = () => {
  const { enableNotifications, notificationStatus, studentProfile } = useAuth();
  const [isEnabling, setIsEnabling] = useState(false);
  const [message, setMessage] = useState("");
  const [browserPermission, setBrowserPermission] = useState(getBrowserPermission);

  const copy = statusCopy[notificationStatus] || statusCopy.idle;
  const toneStyle = getToneStyle(copy.tone);
  const deviceCount = useMemo(() => {
    const tokens = Array.isArray(studentProfile?.messagingTokens) ? studentProfile.messagingTokens : [];
    const unique = new Set(tokens.map((entry) => entry?.token).filter(Boolean));
    if (studentProfile?.messagingToken) unique.add(studentProfile.messagingToken);
    return unique.size;
  }, [studentProfile?.messagingToken, studentProfile?.messagingTokens]);

  const handleEnable = async () => {
    setIsEnabling(true);
    setMessage("");
    try {
      const token = await enableNotifications();
      setBrowserPermission(getBrowserPermission());
      setMessage(token ? "Notifications are enabled for this device." : "Notification permission was not completed. Check your browser settings and try again.");
    } catch (error) {
      setBrowserPermission(getBrowserPermission());
      setMessage(error instanceof Error ? error.message : "Could not enable notifications. Please try again.");
    } finally {
      setIsEnabling(false);
    }
  };

  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>Notification setup</h2>
      <p style={styles.helperText}>
        Turn this on to receive class notes, student questions, score updates, attendance updates and announcements even when Falowen is not open.
      </p>

      <div style={{ border: `1px solid ${toneStyle.border}`, background: toneStyle.background, color: toneStyle.color, borderRadius: 12, padding: 12, display: "grid", gap: 6 }}>
        <strong>{copy.label}</strong>
        <span>{copy.detail}</span>
      </div>

      <div style={{ ...styles.card, margin: "10px 0 0", background: "#f8fafc" }}>
        <div style={styles.metaRow}><span>Browser permission</span><strong>{browserPermission}</strong></div>
        <div style={styles.metaRow}><span>Saved devices</span><strong>{deviceCount}</strong></div>
        <div style={styles.metaRow}><span>This account</span><strong>{studentProfile?.email || studentProfile?.studentCode || "Student"}</strong></div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        <button type="button" style={styles.primaryButton} onClick={handleEnable} disabled={isEnabling || notificationStatus === "pending"}>
          {isEnabling || notificationStatus === "pending" ? "Setting up..." : notificationStatus === "granted" ? "Refresh this device" : "Enable notifications"}
        </button>
      </div>

      {message ? <p style={{ ...styles.helperText, marginTop: 8 }}>{message}</p> : null}

      <div style={{ display: "grid", gap: 8, marginTop: 12, lineHeight: 1.6 }}>
        <p style={{ margin: 0 }}><strong>Android / Chrome:</strong> tap Enable notifications and allow the browser permission.</p>
        <p style={{ margin: 0 }}><strong>iPhone:</strong> add Falowen to your Home Screen first, open it from the Home Screen icon, then enable notifications.</p>
        <p style={{ margin: 0 }}><strong>Screen off:</strong> once enabled, notifications are sent by the backend, so they can arrive even when the app is closed or the screen is off.</p>
      </div>
    </section>
  );
};

export default NotificationSettingsCard;
