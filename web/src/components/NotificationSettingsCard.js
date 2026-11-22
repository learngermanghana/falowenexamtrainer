import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

const statusTone = {
  granted: "success", pending: "info", blocked: "error",
  stale: "warning", error: "error", idle: "info",
};

// Only show short Firebase error identifiers. Never expose push tokens, auth
// credentials, request payloads, or arbitrary server details in the UI.
const getFirebaseErrorCodes = (error) => {
  const identifiers = [error?.code, error?.details?.code]
    .map((value) => String(value || "").trim())
    .filter((value) => /^[a-z0-9][a-z0-9/-]{1,95}$/i.test(value));
  return [...new Set(identifiers)].join(" · ");
};

const withFirebaseCode = (message, error) => {
  const codes = getFirebaseErrorCodes(error);
  return codes ? `${message} (Firebase: ${codes})` : message;
};

const getPushTestErrorMessage = (error, t) => {
  const code = String(error?.code || "").toLowerCase();
  let key = "notificationUi.testError";
  if (code.includes("unauthenticated")) key = "notificationUi.sessionExpired";
  else if (code.includes("permission-denied")) key = "notificationUi.unlinkedDevice";
  else if (code.includes("failed-precondition")) key = "notificationUi.invalidToken";
  return withFirebaseCode(t(key), error);
};

const getToneStyle = (tone) => {
  if (tone === "success") return { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" };
  if (tone === "warning") return { border: "#fde68a", background: "#fffbeb", color: "#92400e" };
  if (tone === "error") return { border: "#fecaca", background: "#fef2f2", color: "#991b1b" };
  return { border: "#bfdbfe", background: "#eff6ff", color: "#1e40af" };
};

const NotificationSettingsCard = () => {
  const { t } = useTranslation();
  const { enableNotifications, notificationStatus, studentProfile, messagingToken } = useAuth();
  const [isEnabling, setIsEnabling] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [browserPermission, setBrowserPermission] = useState(getBrowserPermission);
  const pushEnvironment = getPushEnvironment();

  const statusKey = Object.prototype.hasOwnProperty.call(statusTone, notificationStatus) ? notificationStatus : "idle";
  const toneStyle = getToneStyle(statusTone[statusKey]);
  const deviceCount = useMemo(() => {
    const tokens = Array.isArray(studentProfile?.messagingTokens) ? studentProfile.messagingTokens : [];
    const unique = new Set(tokens.map((entry) => entry?.token).filter(Boolean));
    if (!tokens.length && studentProfile?.messagingToken) unique.add(studentProfile.messagingToken);
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
          ? t("notificationUi.enabled")
          : t("notificationUi.permissionIncomplete")
      );
    } catch (error) {
      setBrowserPermission(getBrowserPermission());
      setMessage(withFirebaseCode(t("notificationUi.enableError"), error));
    } finally {
      setIsEnabling(false);
    }
  };

  const handleTestPush = async () => {
    setTestMessage("");

    if (notificationStatus !== "granted" || !messagingToken) {
      setTestMessage(t("notificationUi.refreshFirst"));
      return;
    }

    if (!functions) {
      setTestMessage(t("notificationUi.testUnavailable"));
      return;
    }

    setIsTesting(true);
    setTestMessage(
      t("notificationUi.scheduled")
    );

    try {
      const sendTestPush = httpsCallable(functions, "sendPushTestNotification");
      const result = await sendTestPush({ token: messagingToken, delaySeconds: 8 });
      if (!result?.data?.ok) {
        throw new Error(t("notificationUi.unconfirmed"));
      }
      setTestMessage(
        t("notificationUi.testSent")
      );
    } catch (error) {
      console.error("Falowen push test failed", { firebaseCode: getFirebaseErrorCodes(error) || "unavailable" });
      setTestMessage(getPushTestErrorMessage(error, t));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>{t("notificationUi.title")}</h2>
      <p style={styles.helperText}>
        {t("notificationUi.description")}
      </p>

      <div style={{ border: `1px solid ${toneStyle.border}`, background: toneStyle.background, color: toneStyle.color, borderRadius: 12, padding: 12, display: "grid", gap: 6 }}>
        <strong>{t(`notificationUi.status.${statusKey}.label`)}</strong>
        <span>{t(`notificationUi.status.${statusKey}.detail`)}</span>
      </div>

      <div style={{ ...styles.card, margin: "10px 0 0", background: "#f8fafc" }}>
        {pushEnvironment.ios ? (
          <div style={styles.metaRow}>
            <span>{t("notificationUi.homeScreen")}</span>
            <strong>{pushEnvironment.standalone ? t("notificationUi.yes") : t("notificationUi.no")}</strong>
          </div>
        ) : null}
        <div style={styles.metaRow}><span>{t("notificationUi.browserPermission")}</span><strong>{browserPermission}</strong></div>
        <div style={styles.metaRow}><span>{t("notificationUi.savedDevices")}</span><strong>{deviceCount}</strong></div>
        <div style={styles.metaRow}><span>{t("notificationUi.thisAccount")}</span><strong>{studentProfile?.email || studentProfile?.studentCode || t("accountOverview.student")}</strong></div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        <button type="button" style={styles.primaryButton} onClick={handleEnable} disabled={isEnabling || notificationStatus === "pending"}>
          {isEnabling || notificationStatus === "pending" ? t("notificationUi.settingUp") : notificationStatus === "granted" ? t("notificationUi.refreshDevice") : t("notificationUi.enable")}
        </button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={handleTestPush}
          disabled={isTesting || notificationStatus !== "granted" || !messagingToken}
        >
          {isTesting ? t("notificationUi.sendingTest") : t("notificationUi.sendTest")}
        </button>
      </div>

      {message ? <p style={{ ...styles.helperText, marginTop: 8 }}>{message}</p> : null}
      {testMessage ? <p style={{ ...styles.helperText, marginTop: 8 }}><strong>{testMessage}</strong></p> : null}

      <div style={{ display: "grid", gap: 8, marginTop: 12, lineHeight: 1.6 }}>
        <p style={{ margin: 0 }}>{t("notificationUi.androidTip")}</p>
        <p style={{ margin: 0 }}>
          {t("notificationUi.iosTip")}
        </p>
      </div>
    </section>
  );
};

export default NotificationSettingsCard;
