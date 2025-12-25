import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchStudentNotifications } from "../services/notificationService";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";

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

const normalizeStatus = (status) => {
  const s = String(status || "").toLowerCase().trim();
  if (!s) return "off";
  if (s === "granted") return "granted";
  if (s === "pending") return "pending";
  if (s === "stale") return "stale";
  if (s === "blocked") return "blocked";
  if (s === "denied") return "blocked";
  if (s === "default") return "off";
  return s;
};

const NotificationBell = ({ notificationStatus, onEnablePush }) => {
  const { studentProfile, user } = useAuth();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    () => normalizeStatus(notificationStatus),
    [notificationStatus]
  );

  const needsPushOptIn = useMemo(() => {
    // We treat anything other than granted/pending as needing opt-in.
    return normalizedStatus !== "granted" && normalizedStatus !== "pending";
  }, [normalizedStatus]);

  const statusLabel = useMemo(() => {
    if (normalizedStatus === "granted") return "Push on";
    if (normalizedStatus === "pending") return "Enabling push";
    if (normalizedStatus === "blocked") return "Push blocked";
    if (normalizedStatus === "stale") return "Push ready";
    return "Push off";
  }, [normalizedStatus]);

  const readSeenAt = () => {
    try {
      const key = seenKeyForUser(user?.uid);
      const raw = localStorage.getItem(key);
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) ? n : 0;
    } catch (_e) {
      return 0;
    }
  };

  const writeSeenAt = (value) => {
    try {
      const key = seenKeyForUser(user?.uid);
      localStorage.setItem(key, String(value || Date.now()));
    } catch (_e) {}
  };

  const sortItems = (list) =>
    [...(list || [])].sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));

  const loadNotifications = async () => {
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
  };

  // Load on profile change (initial + when class/level updates)
  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentProfile?.studentCode, studentProfile?.studentcode, studentProfile?.email, studentProfile?.className]);

  const unreadCount = useMemo(() => {
    const seenAt = readSeenAt();
    return (items || []).filter((it) => Number(it?.timestamp || 0) > seenAt).length;
  }, [items]);

  const markAllRead = () => {
    const newest = (items?.[0]?.timestamp ? Number(items[0].timestamp) : Date.now()) || Date.now();
    writeSeenAt(newest);
    // Force a state update to refresh badge (no server write)
    setItems((prev) => [...prev]);
  };

  const handleToggle = async () => {
    if (!open) {
      await loadNotifications();
      // When opening, consider everything currently loaded as "seen"
      const newest = (items?.[0]?.timestamp ? Number(items[0].timestamp) : Date.now()) || Date.now();
      writeSeenAt(newest);
    }
    setOpen((prev) => !prev);
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

          <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>
            {needsPushOptIn
              ? "Push is off on this device. You can still view updates here."
              : "Push is active on this device. We also keep recent history here."}
          </div>

          {needsPushOptIn && onEnablePush ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={handleEnablePush}>
                Enable push alerts
              </button>
              {normalizedStatus === "blocked" ? (
                <span style={{ ...styles.helperText, margin: 0 }}>
                  Your browser blocked notifications. Enable them in browser settings (site permissions).
                </span>
              ) : null}
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
            {items.map((item) => {
              const isUnread = Number(item?.timestamp || 0) > readSeenAt();
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
                    <span style={{ ...styles.badge, background: "#e0f2fe", color: "#075985" }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(item.timestamp)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <div style={{ fontWeight: 800, color: "#111827" }}>{item.title}</div>
                    {isUnread ? (
                      <span style={{ ...styles.badge, background: "#bae6fd", color: "#0f172a" }}>New</span>
                    ) : null}
                  </div>
                  <div style={{ color: "#374151", fontSize: 14 }}>{item.body}</div>
                </article>
              );
            })}
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
