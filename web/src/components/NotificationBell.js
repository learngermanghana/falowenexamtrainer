import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudentNotifications } from "../services/notificationService";
import { getLocalNotificationEvents } from "../services/interactionFeedback";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const safeText = (value = "") => String(value || "").toLowerCase();

const resolveCategory = (item = {}) => {
  const dataType = safeText(item?.data?.type || item?.data?.category || item?.data?.kind || item?.data?.event);
  const haystack = `${safeText(item.type)} ${safeText(item.title)} ${safeText(item.body)} ${dataType}`;

  if (/payment|contract|account|login|password|reactivat|expired|balance|\bfee\b/.test(haystack)) return "account";
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
      return { label: "Open Course Book", route: "/campus/course?submitWork=1" };
    case "feedback":
      return { label: "Open results", route: "/campus/results" };
    case "account":
      return { label: "Open account", route: "/campus/account" };
    case "class":
      return { label: "Open class area", route: "/campus/discussion" };
    default:
      return { label: "Open campus", route: "/campus/course" };
  }
};

const isExternalRoute = (route = "") => /^https?:\/\//i.test(String(route || ""));

const pickLatest = (items) => items.reduce((latest, item) => {
  if (!item) return latest;
  return !latest || Number(item.timestamp || 0) > Number(latest.timestamp || 0) ? item : latest;
}, null);

const NotificationBell = () => {
  const { studentProfile } = useAuth();
  const navigate = useNavigate();
  const headingId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const profileRef = useRef(studentProfile);

  useEffect(() => {
    profileRef.current = studentProfile;
  }, [studentProfile]);

  const studentId = studentProfile?.id;
  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLatest(pickLatest(getLocalNotificationEvents()));
    setError("");
    setLoading(Boolean(studentId));
    if (studentId) {
      fetchStudentNotifications(profileRef.current)
        .then((items) => {
          if (active) setLatest((current) => pickLatest([...items, current]));
        })
        .catch((err) => {
          if (!active) return;
          console.error("Failed to load notifications", err);
          setError("Could not load notifications.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    const handlePush = (event) => {
      setLatest((current) => pickLatest([event.detail?.notification, current]));
    };
    window.addEventListener("falowen:push-notification", handlePush);
    return () => {
      active = false;
      window.removeEventListener("falowen:push-notification", handlePush);
    };
  }, [open, studentId]);

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
        overflow: "auto",
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
      width: 380,
      maxWidth: "calc(100vw - 24px)",
      zIndex: 50,
      padding: 12,
      display: "grid",
      gap: 10,
    };
  }, [isMobile]);

  const action = latest ? resolveAction(latest) : null;
  const handleOpenAction = () => {
    setOpen(false);
    if (isExternalRoute(action.route)) {
      window.open(action.route, "_blank", "noopener,noreferrer");
    } else {
      navigate(action.route);
    }
  };

  return (
    <div ref={rootRef} style={{ position: "relative", maxWidth: "100%" }}>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        style={styles.secondaryButton}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span aria-hidden="true">🔔</span>
      </button>
      {open ? (
        <section aria-labelledby={headingId} style={popoverStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <h2 id={headingId} style={{ margin: 0, fontSize: 16 }}>Latest notification</h2>
            <button type="button" onClick={() => setOpen(false)} style={{ ...styles.secondaryButton, padding: "6px 10px" }}>
              Close
            </button>
          </div>
          {loading ? <div role="status">Loading notification…</div> : null}
          {error ? <div role="alert" style={styles.errorBox}>{error}</div> : null}
          {!loading && !error && !latest ? <div>No notifications yet.</div> : null}
          {latest ? (
            <article style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
              <div style={{ fontWeight: 800 }}>{latest.title || "Falowen update"}</div>
              {latest.timestamp ? <div style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(latest.timestamp)}</div> : null}
              {latest.body ? <div style={{ fontSize: 14, lineHeight: 1.5 }}>{latest.body}</div> : null}
              <div>
                <button type="button" style={{ ...styles.primaryButton, padding: "7px 11px" }} onClick={handleOpenAction}>
                  {action.label}
                </button>
              </div>
            </article>
          ) : null}
        </section>
      ) : null}
    </div>
  );
};

export default NotificationBell;
