import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { functions, getPushEnvironment, httpsCallable } from "../firebase";
import { styles } from "../styles";

const getBrowserPermission = () => {
  const environment = getPushEnvironment();
  if (!environment.notificationApi) {
    if (environment.ios && !environment.standalone) return "Home Screen app required";
    if (environment.ios && environment.standalone) return "Web Push unavailable";
    return "unsupported";
  }
  return Notification.permission || "default";
};

const statusCopy = {
  granted: {
    label: "Enabled on this device",
    detail: "Browser permission and the Falowen push token are active on this device.",
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
    detail: "Enable notifications to receive score updates, attendance updates and important reminders.",
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
  const { enableNotifications, notificationStatus, studentProfile, messagingToken } = useAuth();
  const [isEnabling, setIsEnabling] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [browserPermission, setBrowserPermission] = useState(getBrowserPermission);
  const pushEnvironment = getPushEnvironment();

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
      setMessage(
        token
          ? "Notifications are enabled for this device."
          : "Notification permission was not completed. On iPhone, open Falowen from the Home Screen app icon first, then tap Enable notifications again."
      );
    } catch (error) {
      setBrowserPermission(getBrowserPermission());
      setMessage(error instanceof Error ? error.message : "Could not enable notifications. Please try again.");
    } finally {
      setIsEnabling(false);
    }
  };

  const handleTestPush = async () => {
    setTestMessage("");

    if (notificationStatus !== "granted" || !messagingToken) {
      setTestMessage("Refresh this device first so Falowen has a current push token.");
      return;
    }

    if (!functions) {
      setTestMessage("Falowen push testing is not available on this deployment.");
      return;
    }

    setIsTesting(true);
    setTestMessage(
      "Test scheduled. Lock your screen now. The notification should arrive in about 8 seconds."
    );

    try {
      const sendTestPush = httpsCallable(functions, "sendPushTestNotification");
      const result = await sendTestPush({ token: messagingToken, delaySeconds: 8 });
      if (!result?.data?.ok) {
        throw new Error("Falowen did not confirm the test push.");
      }
      setTestMessage(
        "Test sent. If the screen was locked, you should receive a normal Falowen phone notification. If nothing appears, check Android notification and battery settings."
      );
    } catch (error) {
      setTestMessage(
        error instanceof Error
          ? error.message
          : "Could not send the background push test. Refresh this device and try again."
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>Notification setup</h2>
      <p style={styles.helperText}>
        Turn this on to receive student questions, score updates, attendance updates and announcements even when Falowen is not open.
      </p>

      <div style={{ border: `1px solid ${toneStyle.border}`, background: toneStyle.background, color: toneStyle.color, borderRadius: 12, padding: 12, display: "grid", gap: 6 }}>
        <strong>{copy.label}</strong>
        <span>{copy.detail}</span>
      </div>

      <div style={{ ...styles.card, margin: "10px 0 0", background: "#f8fafc" }}>
        {pushEnvironment.ios ? (
          <div style={styles.metaRow}>
            <span>Home Screen app</span>
            <strong>{pushEnvironment.standalone ? "Yes" : "No"}</strong>
          </div>
        ) : null}
        <div style={styles.metaRow}><span>Browser permission</span><strong>{browserPermission}</strong></div>
        <div style={styles.metaRow}><span>Saved devices</span><strong>{deviceCount}</strong></div>
        <div style={styles.metaRow}><span>This account</span><strong>{studentProfile?.email || studentProfile?.studentCode || "Student"}</strong></div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        <button type="button" style={styles.primaryButton} onClick={handleEnable} disabled={isEnabling || notificationStatus === "pending"}>
          {isEnabling || notificationStatus === "pending" ? "Setting up..." : notificationStatus === "granted" ? "Refresh this device" : "Enable notifications"}
        </button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={handleTestPush}
          disabled={isTesting || notificationStatus !== "granted" || !messagingToken}
        >
          {isTesting ? "Sending test..." : "Send test notification"}
        </button>
      </div>

      {message ? <p style={{ ...styles.helperText, marginTop: 8 }}>{message}</p> : null}
      {testMessage ? <p style={{ ...styles.helperText, marginTop: 8 }}><strong>{testMessage}</strong></p> : null}

      <div style={{ display: "grid", gap: 8, marginTop: 12, lineHeight: 1.6 }}>
        <p style={{ margin: 0 }}><strong>Android / Chrome:</strong> tap Enable notifications and allow the browser permission.</p>
        <p style={{ margin: 0 }}>
          <strong>iPhone:</strong> open Falowen from the Home Screen icon, then tap Enable notifications. If the row above says “Home Screen app: No” or “Web Push unavailable”, remove the old icon, open <strong>www.falowen.app</strong> in Safari, add it to the Home Screen again, and use the new icon.
        </p>
      </div>
    </section>
  );
};

export default NotificationSettingsCard;
