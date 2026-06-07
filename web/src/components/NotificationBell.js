import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudentNotifications } from "../services/notificationService";
import { getLocalNotificationEvents } from "../services/interactionFeedback";
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

const seenKeyForUser = (uid) => `falowen_notifications_seen_v1:${uid || "guest"}`;

const FILTERS = [
  { key: "unread", label: "Unread" },
  { key: "all", label: "All" },
  { key: "assignments", label: "Assignments" },
  { key: "feedback", label: "Feedback" },
  { key: "account", label: "Account" },
  { key: "classNotes", label: "Class Notes" },
];

const TYPE_STYLES = {
  assignments: { icon: "📤", label: "Assignment", bg: "#ecfeff", color: "#0e7490" },
  feedback: { icon: "📝", label: "Feedback", bg: "#eef2ff", color: "#3730a3" },
  account: { icon: "⚠️", label: "Account", bg: "#fffbeb", color: "#92400e" },
  classNotes: { icon: "📌", label: "Class Notes", bg: "#f0fdf4", color: "#166534" },
  class: { icon: "👥", label: "Class", bg: "#f5f3ff", color: "#6d28d9" },
  update: { icon: "🔔", label: "Update", bg: "#f8fafc", color: "#334155" },
};

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

const safeText = (value = "") => String(value || "").toLowerCase();

const resolveCategory = (item = {}) => {
  const dataType = safeText(item?.data?.type || item?.data?.category || item?.data?.kind || item?.data?.event);
  const haystack = `${safeText(item.type)} ${safeText(item.title)} ${safeText(item.body)} ${dataType}`;

  if (/class\s*notes?|notes?|vocabulary|correction|reminder/.test(haystack)) return "classNotes";
  if (/payment|contract|account|login|password|reactivat|expired|balance|fee/.test(haystack)) return "account";
  if (/feedback|score|result|marked|marking|teacher|tutor|comment|correction/.test(haystack)) return "feedback";
  if (/assignment|submission|submitted|resubmission|draft|homework|task/.test(haystack)) return "assignments";
  if (/attendance|class\s*board|discussion|announcement|zoom|lesson|present|absent/.test(haystack)) return "class";
  return "update";
};

const resolveAction = (item = {}) => {
  const explicitRoute = item?.route || item?.url || item?.data?.route || item?.data?.url || item?.data?.link;
  if (explicitRoute) return { label: "Open", route: explicitRoute };

  const category = resolveCategory(item);
  switch (category) {
    case "assignments":
      return { label: "Open submissions", route: "/campus/submit" };
    case "feedback":
      return { label: "Open results", route: "/campus/results" };
    case "account":
      return { label: "Open account", route: "/campus/account" };
    case "classNotes":
      return { label: "Open course", route: "/campus/course" };
    case "class":
      return { label: "Open class area", route: "/campus/discussion" };
    default:
      return { label: "Open campus", route: "/campus/course" };
  }
};

const isExternalRoute = (route = "") => /^https?:\/\//i.test(String(route || ""));

const FilterButton = ({ active, count, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      border: `1px solid ${active ? "#2563eb" : "#e5e7eb"}`,
      background: active ? "#eff6ff" : "#fff",
      color: active ? "#1d4ed8" : "#374151",
      borderRadius: 999,
      padding: "7px 10px",
      fontSize: 12,
      fontWeight: 800,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      whiteSpace: "nowrap",
    }}
  >
    {children}
    {count ? <span style={{ background: active ? "#dbeafe" : "#f3f4f6", borderRadius: 999, padding: "1px 6px" }}>{count}</span> : null}
  </button>
);

const NotificationBell = ({ notificationStatus, onEnablePush }) => {
  const { studentProfile, user, saveStudentProfile } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("unread");

  const rootRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mq = window.matchMedia("(max-width: 560px)");
    const apply = () => setIsMobile(Boolean(mq.matches));
    apply();

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

  const needsPushOptIn = useMemo(() => shouldPromptForPush(normalizedStatus), [normalizedStatus]);

  const statusLabel = useMemo(() => getNotificationStatusLabel(normalizedStatus), [normalizedStatus]);

  const statusDescription = useMemo(() => {
    switch (normalizedStatus) {
      case "granted":
        return "Push is active. This inbox keeps your recent updates so you can check them later.";
      case "pending":
        return "Enabling push notifications. Keep this tab open.";
      case "blocked":
        return "Push is blocked by your browser settings, but your in-app updates can still appear here.";
      case "stale":
        return "Push needs a refresh on this device. Re-enable it to reconnect.";
      case "error":
        return "Push hit an error on this device. Try enabling again.";
      default:
        return "Push is off on this device. You can still view updates here.";
    }
  }, [normalizedStatus]);

  const readLocalSeenAt = useCallback(() => {
    try {
      if (typeof window === "undefined") return 0;
      const raw = localStorage.getItem(seenKeyForUser(user?.uid));
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
      const nextValue = Number(value || Date.now());
      localStorage.setItem(seenKeyForUser(user?.uid), String(nextValue));
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

  const sortItems = (list) => [...(list || [])].sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));

  const mergeNotifications = (remote = [], local = []) => {
    const map = new Map();
    [...(remote || []), ...(local || [])].forEach((item) => {
      if (!item) return;
      const key = item.id || `${item.type}-${item.title}-${item.timestamp}`;
      if (!map.has(key)) map.set(key, item);
    });
    return [...map.values()].sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));
  };

  const loadNotifications = useCallback(async () => {
    if (!studentProfile) return;
    setLoading(true);
    setError("");
    try {
      const results = await fetchStudentNotifications(studentProfile);
      const localEvents = getLocalNotificationEvents();
      setItems(mergeNotifications(results || [], localEvents || []));
    } catch (err) {
      console.error("Failed to load notifications", err);
      setError("Could not load notifications.");
      setItems(sortItems(getLocalNotificationEvents()));
    } finally {
      setLoading(false);
    }
  }, [studentProfile]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(() => (items || []).filter((it) => Number(it?.timestamp || 0) > seenAt).length, [items, seenAt]);

  const countsByFilter = useMemo(() => {
    const base = { unread: unreadCount, all: items.length, assignments: 0, feedback: 0, account: 0, classNotes: 0 };
    (items || []).forEach((item) => {
      const category = resolveCategory(item);
      if (base[category] !== undefined) base[category] += 1;
    });
    return base;
  }, [items, unreadCount]);

  const filteredItems = useMemo(() => {
    const sorted = sortItems(items);
    if (activeFilter === "unread") return sorted.filter((item) => Number(item?.timestamp || 0) > seenAt);
    if (activeFilter === "all") return sorted;
    return sorted.filter((item) => resolveCategory(item) === activeFilter);
  }, [activeFilter, items, seenAt]);

  const visibleItems = filteredItems.slice(0, 18);

  const markAllRead = () => {
    const newest = (items?.[0]?.timestamp ? Number(items[0].timestamp) : Date.now()) || Date.now();
    persistSeenAt(newest);
    setItems((prev) => [...prev]);
  };

  const markItemRead = (item) => {
    const timestamp = Number(item?.timestamp || 0);
    if (!timestamp) return;
    persistSeenAt(Math.max(seenAt, timestamp));
  };

  useEffect(() => {
    const handlePush = (event) => {
      const notification = event?.detail?.notification;
      if (!notification) return;
      setItems((prev) => sortItems([notification, ...(prev || [])]));
      setActiveFilter("unread");
    };

    window.addEventListener("falowen:push-notification", handlePush);
    return () => window.removeEventListener("falowen:push-notification", handlePush);
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (!open) return;
    setError("");
    loadNotifications();
  }, [loadNotifications, open]);

  useEffect(() => {
    if (!open) return;
    if (unreadCount > 0) {
      setActiveFilter("unread");
    } else if (activeFilter === "unread") {
      setActiveFilter("all");
    }
  }, [activeFilter, open, unreadCount]);

  const handleOpenAction = (item) => {
    const action = resolveAction(item);
    markItemRead(item);
    setOpen(false);
    if (!action.route) return;
    if (isExternalRoute(action.route)) {
      window.open(action.route, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(action.route);
  };

  const renderNotification = (item) => {
    const isUnread = Number(item?.timestamp || 0) > seenAt;
    const category = resolveCategory(item);
    const typeStyle = TYPE_STYLES[category] || TYPE_STYLES.update;
    const action = resolveAction(item);

    return (
      <article
        key={`${item.id}-${item.timestamp}`}
        style={{
          border: `1px solid ${isUnread ? "#93c5fd" : "#e5e7eb"}`,
          borderRadius: 12,
          padding: 12,
          display: "grid",
          gap: 8,
          background: isUnread ? "#eff6ff" : "#ffffff",
          boxShadow: isUnread ? "0 10px 22px rgba(37, 99, 235, 0.08)" : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
          <span style={{ ...styles.badge, background: typeStyle.bg, color: typeStyle.color }}>
            {typeStyle.icon} {typeStyle.label}
          </span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(item.timestamp)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
          <div style={{ fontWeight: 900, color: "#111827", lineHeight: 1.35 }}>{item.title || "Falowen update"}</div>
          {isUnread ? <span style={{ ...styles.badge, background: "#bae6fd", color: "#0f172a" }}>New</span> : null}
        </div>
        {item.body ? <div style={{ color: "#374151", fontSize: 14, lineHeight: 1.55 }}>{item.body}</div> : null}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" style={{ ...styles.primaryButton, padding: "7px 11px" }} onClick={() => handleOpenAction(item)}>
            {action.label}
          </button>
          {isUnread ? (
            <button type="button" style={{ ...styles.secondaryButton, padding: "7px 11px" }} onClick={() => markItemRead(item)}>
              Mark read
            </button>
          ) : null}
        </div>
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

  useEffect(() => {
    if (!open) return undefined;

    const onDocMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
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
        left: 10,
        right: 10,
        top: 74,
        marginTop: 0,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        boxShadow: "0 18px 42px rgba(0,0,0,0.18)",
        zIndex: 999,
        padding: 12,
        display: "grid",
        gap: 10,
        maxHeight: "calc(100vh - 92px)",
        overflow: "hidden",
      };
    }

    return {
      position: "absolute",
      right: 0,
      marginTop: 6,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      boxShadow: "0 18px 42px rgba(0,0,0,0.16)",
      minWidth: 380,
      maxWidth: 460,
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
        style={{ ...styles.secondaryButton, display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%" }}
        onClick={handleToggle}
      >
        <span role="img" aria-label="Notifications">🔔</span>
        <span style={{ whiteSpace: "nowrap" }}>Notifications</span>
        <NotificationBadge count={unreadCount} />
      </button>

      {open ? (
        <div style={popoverStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 900, color: "#111827" }}>Notifications</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Your feedback inbox for Falowen updates</div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ ...styles.badge, background: "#eef2ff", color: "#312e81" }}>{statusLabel}</span>
              <button type="button" onClick={() => setOpen(false)} style={{ ...styles.secondaryButton, padding: "6px 10px" }}>
                Close
              </button>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>{statusDescription}</div>

          {needsPushOptIn && onEnablePush ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {normalizedStatus === "blocked" ? (
                <>
                  <button type="button" style={styles.primaryButton} onClick={handleOpenSettings}>Open browser settings</button>
                  <span style={{ ...styles.helperText, margin: 0 }}>Notifications are blocked. Enable them in browser settings, then retry here.</span>
                </>
              ) : (
                <button type="button" style={styles.primaryButton} onClick={handleEnablePush}>Enable push alerts</button>
              )}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
            {FILTERS.map((filter) => (
              <FilterButton key={filter.key} active={activeFilter === filter.key} count={countsByFilter[filter.key]} onClick={() => setActiveFilter(filter.key)}>
                {filter.label}
              </FilterButton>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ ...styles.helperText, margin: 0 }}>
              {unreadCount ? `${unreadCount} unread` : "All caught up ✅"}
            </div>
            <button type="button" onClick={markAllRead} style={{ ...styles.secondaryButton, padding: "6px 10px" }} disabled={!items.length} title="Mark everything as read">
              Mark all read
            </button>
          </div>

          {loading ? <div style={{ fontSize: 14 }}>Loading notifications…</div> : null}
          {error ? <div style={{ ...styles.errorBox, margin: 0 }}>{error}</div> : null}

          {!loading && !visibleItems.length && !error ? (
            <div style={{ fontSize: 14, color: "#6b7280", border: "1px dashed #e5e7eb", borderRadius: 12, padding: 12, background: "#f9fafb" }}>
              Nothing in this section yet. Assignment updates, tutor feedback, class notes and account reminders will appear here.
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 8, maxHeight: isMobile ? "calc(100vh - 330px)" : 390, overflow: "auto", paddingRight: 2 }}>
            {visibleItems.map(renderNotification)}
          </div>

          <div style={{ ...styles.helperText, margin: 0 }}>
            Toasts show what just happened. This inbox keeps updates you may need to check later.
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationBell;
