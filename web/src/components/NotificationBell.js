import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchStudentNotifications } from "../services/notificationService";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import {
  getNotificationStatusLabel,
  normalizeNotificationStatus,
  shouldPromptForPush,
} from "../utils/notificationStatus";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

// Local storage key per user to remember last "seen" time.
const seenKeyForUser = (uid) => `falowen_notifications_seen_v1:${uid || "guest"}`;

const NotificationBadge = ({ count }) => {
  if (!count) return null;
  return (
    <span
      style={{
        background: "#ef4444",
        color: "#fff",
        borderRadius: 999,
        padding: "2px 6px",
        fontSize: 11,
        marginLeft: 6,
        lineHeight: 1.2,
        fontWeight: 800,
      }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

const NotificationBell = ({ notificationStatus, onEnablePush }) => {
  const { studentProfile, user, saveStudentProfile } = useAuth();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPrevious, setShowPrevious] = useState(false);
  const [markedSeenThisSession, setMarkedSeenThisSession] = useState(false);

  const rootRef = useRef(null);

  // ✅ Responsive: on small phones, popover becomes a fixed drawer
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mq = window.matchMedia("(max-width: 420px)");
    const apply = () => setIsMobile(Boolean(mq.matches));
    apply();

    // Safari fallback
    if (mq.addEventListener) {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  const normalizedStatus = useMemo(
    () => normalizeNotificationStatus(notificationStatus),
    [notificationStatus]
  );

  const needsPushOptIn = useMemo(() => {
    return shouldPromptForPush(normalizedStatus);
  }, [normalizedStatus]);

  const statusLabel = useMemo(
    () => getNotificationStatusLabel(normalizedStatus),
    [normalizedStatus]
  );

  const statusDescription = useMemo(() => {
    switch (normalizedStatus) {
      case "granted":
        return "Push is active on this device. We also keep recent history here.";
      case "pending":
        return "Enabling push notifications. Keep this tab open.";
      case "blocked":
        return "Push is blocked by your browser settings.";
      case "stale":
        return "Push needs a refresh on this device. Re-enable to reconnect.";
      case "error":
        return "Push hit an error on this device. Try enabling again.";
      default:
        return "Push is off on this device. You can still view updates here.";
    }
  }, [normalizedStatus]);

  const readLocalSeenAt = useCallback(() => {
    try {
      if (typeof window === "undefined") return 0;
      const key = seenKeyForUser(user?.uid);
      const raw = localStorage.getItem(key);
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) ? n : 0;
    } catch (_e) {
      return 0;
    }
  }, [user?.uid]);

  const [localSeenAt, setLocalSeenAt] = useState(0);
  const lastSeenWriteRef = useRef(0);

  useEffect(() => {
    setLocalSeenAt(readLocalSeenAt());
  }, [readLocalSeenAt]);

  const writeLocalSeenAt = useCallback((value) => {
    try {
      const key = seenKeyForUser(user?.uid);
      const nextValue = Number(value || Date.now());
      localStorage.setItem(key, String(nextValue));
      setLocalSeenAt(nextValue);
    } catch (_e) {}
  }, [user?.uid]);

  const persistSeenAt = useCallback(
    async (value) => {
      const nextValue = Number(value || Date.now());
      writeLocalSeenAt(nextValue);
      if (!studentProfile?.id || !saveStudentProfile) return;
      const profileSeenAt = Number(studentProfile?.notificationsLastSeenAt || 0);
      if (nextValue <= profileSeenAt || nextValue === lastSeenWriteRef.current) return;
      lastSeenWriteRef.current = nextValue;
      try {
        await saveStudentProfile({ notificationsLastSeenAt: nextValue });
      } catch (err) {
        console.error("Failed to persist notification seen timestamp", err);
      }
    },
    [saveStudentProfile, studentProfile?.id, studentProfile?.notificationsLastSeenAt, writeLocalSeenAt]
  );

  const profileSeenAt = Number(studentProfile?.notificationsLastSeenAt || 0);
  const seenAt = useMemo(() => Math.max(profileSeenAt, localSeenAt), [profileSeenAt, localSeenAt]);

  useEffect(() => {
    if (!studentProfile?.id) return;
    if (localSeenAt > profileSeenAt) {
      persistSeenAt(localSeenAt);
      return;
    }
    if (profileSeenAt > localSeenAt) {
      writeLocalSeenAt(profileSeenAt);
    }
  }, [localSeenAt, persistSeenAt, profileSeenAt, studentProfile?.id, writeLocalSeenAt]);

  const sortItems = (list) =>
    [...(list || [])].sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));

  const { recentItems, previousItems } = useMemo(() => {
    const sorted = sortItems(items);
    return {
      recentItems: sorted.slice(0, 7),
      previousItems: sorted.slice(7),
    };
  }, [items]);

  const loadNotifications = useCallback(async () => {
    if (!studentProfile) return;
    setLoading(true);
    setError("");
    try {
      const results = await fetchStudentNotifications(studentProfile);
      setItems(sortItems(results || []));
    } catch (err) {
      console.error("Failed to load notifications", err);
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, [studentProfile]);

  // Load on profile change (initial + when class/level updates)
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(() => {
    return (items || []).filter((it) => Number(it?.timestamp || 0) > seenAt).length;
  }, [items, seenAt]);

  const markAllRead = () => {
    const newest = (items?.[0]?.timestamp ? Number(items[0].timestamp) : Date.now()) || Date.now();
    persistSeenAt(newest);
    // Force a state update to refresh badge
    setItems((prev) => [...prev]);
  };

  useEffect(() => {
    const handlePush = (event) => {
      const notification = event?.detail?.notification;
      if (!notification) return;
      setItems((prev) => sortItems([notification, ...(prev || [])]));
    };

    window.addEventListener("falowen:push-notification", handlePush);
    return () => window.removeEventListener("falowen:push-notification", handlePush);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) {
      setShowPrevious(false);
      setMarkedSeenThisSession(false);
      return;
    }
    setError("");
    loadNotifications();
  }, [loadNotifications, open]);

  useEffect(() => {
    if (!open || markedSeenThisSession) return;
    const newest = (items?.[0]?.timestamp ? Number(items[0].timestamp) : Date.now()) || Date.now();
    persistSeenAt(newest);
    setMarkedSeenThisSession(true);
  }, [open, items, markedSeenThisSession, persistSeenAt]);

  const renderNotification = (item) => {
    const isUnread = Number(item?.timestamp || 0) > seenAt;
    return (
      <article
        key={`${item.id}-${item.timestamp}`}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 10,
          display: "grid",
          gap: 4,
          background: isUnread ? "#ecfeff" : "#f9fafb",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
          <span style={{ ...styles.badge, background: "#e0f2fe", color: "#075985" }}>{item.type}</span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(item.timestamp)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
          <div style={{ fontWeight: 800, color: "#111827" }}>{item.title}</div>
          {isUnread ? <span style={{ ...styles.badge, background: "#bae6fd", color: "#0f172a" }}>New</span> : null}
        </div>
        <div style={{ color: "#374151", fontSize: 14 }}>{item.body}</div>
      </article>
    );
  };

  const handleEnablePush = async () => {
    if (!onEnablePush) return;
    try {
      await onEnablePush();
    } catch (e) {
      console.error("Enable push failed", e);
      setError("Could not enable push notifications. Please try again.");
    }
  };

  const handleOpenSettings = () => {
    const settingsUrl = "https://support.google.com/chrome/answer/3220216";
    window.open(settingsUrl, "_blank", "noopener,noreferrer");
  };

  // Click outside to close + ESC
  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const popoverStyle = useMemo(() => {
    if (isMobile) {
      return {
        position: "fixed",
        left: 12,
        right: 12,
        top: 84, // below header area
        marginTop: 0,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
        zIndex: 999,
        padding: 12,
        display: "grid",
        gap: 10,
        maxHeight: "calc(100vh - 110px)",
        overflow: "hidden",
      };
    }

    return {
      position: "absolute",
      right: 0,
      marginTop: 6,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
      minWidth: 340,
      maxWidth: 420,
      zIndex: 50,
      padding: 12,
      display: "grid",
      gap: 10,
    };
  }, [isMobile]);

  return (
    <div ref={rootRef} style={{ position: "relative", maxWidth: "100%" }}>
      <button
        type="button"
        style={{
          ...styles.secondaryButton,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          maxWidth: "100%",
        }}
        onClick={handleToggle}
      >
        <span role="img" aria-label="Notifications">
          🔔
        </span>
        <span style={{ whiteSpace: "nowrap" }}>Notifications</span>
        <NotificationBadge count={unreadCount} />
      </button>

      {open ? (
        <div style={popoverStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: "#111827" }}>Student notifications</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Scores, attendance, and class updates</div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ ...styles.badge, background: "#eef2ff", color: "#312e81" }}>{statusLabel}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ ...styles.secondaryButton, padding: "6px 10px" }}
              >
                Close
              </button>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>{statusDescription}</div>

          {needsPushOptIn && onEnablePush ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {normalizedStatus === "blocked" ? (
                <>
                  <button type="button" style={styles.primaryButton} onClick={handleOpenSettings}>
                    Open browser settings
                  </button>
                  <span style={{ ...styles.helperText, margin: 0 }}>
                    Notifications are blocked. Enable them in browser settings, then retry here.
                  </span>
                </>
              ) : (
                <button type="button" style={styles.primaryButton} onClick={handleEnablePush}>
                  Enable push alerts
                </button>
              )}
            </div>
          ) : null}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ ...styles.helperText, margin: 0 }}>
              {unreadCount ? `${unreadCount} unread` : "All caught up ✅"}
            </div>
            <button
              type="button"
              onClick={markAllRead}
              style={{ ...styles.secondaryButton, padding: "6px 10px" }}
              disabled={!items.length}
              title="Mark everything as read"
            >
              Mark all read
            </button>
          </div>

          {loading ? <div style={{ fontSize: 14 }}>Loading notifications…</div> : null}
          {error ? <div style={{ ...styles.errorBox, margin: 0 }}>{error}</div> : null}

          {!loading && !items.length && !error ? (
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              Nothing new yet. Scores, attendance, and class posts will appear here.
            </div>
          ) : null}

          {/* ✅ Scroll area (important for mobile drawer) */}
          <div style={{ display: "grid", gap: 8, maxHeight: isMobile ? "calc(100vh - 300px)" : 380, overflow: "auto", paddingRight: 2 }}>
            {recentItems.map(renderNotification)}

            {previousItems.length ? (
              <div style={{ display: "grid", gap: 8 }}>
                <button
                  type="button"
                  style={{
                    ...styles.secondaryButton,
                    width: "100%",
                    justifyContent: "center",
                    background: "#f3f4f6",
                    color: "#111827",
                    fontWeight: 700,
                  }}
                  onClick={() => setShowPrevious((prev) => !prev)}
                >
                  {showPrevious
                    ? "Hide previous activity"
                    : `See previous activity (${previousItems.length})`}
                </button>
                {showPrevious ? previousItems.map(renderNotification) : null}
              </div>
            ) : null}
          </div>

          <div style={{ ...styles.helperText, margin: 0 }}>
            Tip: opening this drawer marks notifications as “read” (badge resets automatically).
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationBell;
