import React, { useEffect, useMemo, useState } from "react";
import { fetchStudentNotifications } from "../services/notificationService";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
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
      }}
    >
      {count}
    </span>
  );
};

const NotificationBell = ({ notificationStatus }) => {
  const { studentProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const needsPushOptIn = useMemo(
    () => notificationStatus !== "granted" && notificationStatus !== "pending",
    [notificationStatus]
  );

  const loadNotifications = async () => {
    if (!studentProfile) return;
    setLoading(true);
    setError("");
    try {
      const results = await fetchStudentNotifications(studentProfile);
      setItems(results);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // refresh when profile changes
  }, [studentProfile]);

  useEffect(() => {
    const updateDeviceSize = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };

    updateDeviceSize();
    window?.addEventListener("resize", updateDeviceSize);
    return () => window?.removeEventListener("resize", updateDeviceSize);
  }, []);

  const statusLabel = useMemo(() => {
    if (notificationStatus === "granted") return "Push on";
    if (notificationStatus === "pending") return "Enabling push";
    if (notificationStatus === "blocked") return "Push blocked";
    if (notificationStatus === "stale") return "Push ready";
    return "Push off";
  }, [notificationStatus]);

  const handleToggle = () => {
    if (!open) {
      loadNotifications();
    }
    setOpen((prev) => !prev);
  };

  const drawerStyle = useMemo(
    () => ({
      position: "absolute",
      top: "calc(100% + 8px)",
      right: isMobile ? "auto" : 0,
      left: isMobile ? 0 : "auto",
      width: isMobile ? "calc(100vw - 32px)" : 360,
      maxWidth: isMobile ? "calc(100vw - 16px)" : 420,
      minWidth: isMobile ? "auto" : 320,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
      zIndex: 20,
      padding: isMobile ? 14 : 12,
      display: "grid",
      gap: isMobile ? 10 : 8,
      boxSizing: "border-box",
      maxHeight: "70vh",
      overflowY: "auto",
    }),
    [isMobile]
  );

  return (
    <div style={{ position: "relative", width: isMobile ? "100%" : "auto" }}>
      <button
        style={{ ...styles.secondaryButton, display: "inline-flex", alignItems: "center", gap: 6 }}
        onClick={handleToggle}
      >
        <span role="img" aria-label="Notifications">
          🔔
        </span>
        <span>Notifications</span>
        <NotificationBadge count={items.length} />
      </button>
      {open ? (
        <div style={drawerStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#111827" }}>Student notifications</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Scores, attendance, and class board updates</div>
            </div>
            <span style={{ ...styles.badge, background: "#eef2ff", color: "#312e81" }}>{statusLabel}</span>
          </div>

          <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>
            {needsPushOptIn
              ? "Click “Enable push alerts” above once per device to save your messaging token. We’ll still list updates here if push isn’t on yet."
              : "Push is active on this device. We’ll also keep a recent history in this drawer."}
          </div>

          {loading ? <div style={{ fontSize: 14 }}>Loading notifications…</div> : null}
          {error ? <div style={{ ...styles.errorBox, margin: 0 }}>{error}</div> : null}

          {!loading && !items.length && !error ? (
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              Nothing new yet. Scores, attendance, and class posts will appear here.
            </div>
          ) : null}

          {items.map((item) => (
            <article
              key={`${item.id}-${item.timestamp}`}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 10,
                display: "grid",
                gap: 4,
                background: "#f9fafb",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                <span style={{ ...styles.badge, background: "#e0f2fe", color: "#075985" }}>{item.type}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(item.timestamp)}</span>
              </div>
              <div style={{ fontWeight: 700, color: "#111827" }}>{item.title}</div>
              <div style={{ color: "#374151", fontSize: 14 }}>{item.body}</div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default NotificationBell;
