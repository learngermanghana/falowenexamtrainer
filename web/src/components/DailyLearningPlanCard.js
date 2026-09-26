import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchLearnerSupportState } from "../services/learnerSupportService";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { styles } from "../styles";
import { PillBadge, PrimaryActionBar } from "./ui";

const CATEGORY_LABELS = {
  access: "Access",
  repair: "Needs attention",
  course: "Course",
  review: "Review",
  attendance: "Attendance",
  transition: "Next stage",
};

const DailyLearningPlanCard = () => {
  const navigate = useNavigate();
  const { idToken } = useAuth();
  const [state, setState] = useState({ loading: Boolean(idToken), data: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    if (!idToken) {
      setState({ loading: false, data: null, error: "" });
      return undefined;
    }

    setState((current) => ({ ...current, loading: true, error: "" }));
    fetchLearnerSupportState({ idToken })
      .then((response) => {
        if (!cancelled) setState({ loading: false, data: response || null, error: "" });
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            loading: false,
            data: null,
            error: error?.message || "Could not load your learning plan.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [idToken]);

  const plan = state.data?.learningPlan || null;
  const items = useMemo(
    () => (Array.isArray(plan?.items) ? plan.items.filter((item) => item?.title).slice(0, 3) : []),
    [plan?.items],
  );

  if (!idToken || state.loading || state.error || !plan || !items.length) return null;

  const openItem = (item) => {
    if (!item?.url) return;
    triggerInteractionFeedback({ sound: "open" });
    navigate(item.url);
  };

  return (
    <section
      data-daily-learning-plan="true"
      style={{
        ...styles.card,
        display: "grid",
        gap: 14,
        border: "2px solid #2563eb",
        background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 74%)",
        boxShadow: "0 16px 34px rgba(37, 99, 235, 0.14)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "start" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <p style={{ ...styles.helperText, margin: 0, color: "#1d4ed8", fontWeight: 800 }}>
            Smart learning plan
          </p>
          <h2 style={{ margin: 0, fontSize: 21 }}>{plan.title || "Your learning plan today"}</h2>
          {plan.summary ? (
            <p style={{ ...styles.helperText, margin: 0, color: "#475569" }}>{plan.summary}</p>
          ) : null}
        </div>
        <PillBadge tone="info">Updates with your progress</PillBadge>
      </div>

      <div style={{ display: "grid", gap: 9 }}>
        {items.map((item, index) => (
          <div
            key={item.id || `plan-${index}`}
            data-learning-plan-item={item.id || undefined}
            style={{
              display: "grid",
              gridTemplateColumns: "32px minmax(0, 1fr) auto",
              gap: 10,
              alignItems: "center",
              border: "1px solid #dbeafe",
              borderRadius: 14,
              padding: 11,
              background: index === 0 ? "#ffffff" : "#f8fafc",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: index === 0 ? "#2563eb" : "#e2e8f0",
                color: index === 0 ? "#ffffff" : "#334155",
                fontWeight: 900,
              }}
            >
              {index + 1}
            </div>

            <div style={{ minWidth: 0, display: "grid", gap: 3 }}>
              <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                <strong>{item.title}</strong>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    borderRadius: 999,
                    padding: "3px 7px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                  }}
                >
                  {CATEGORY_LABELS[item.category] || "Learning"}
                </span>
              </div>
              {item.helper ? (
                <span style={{ fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{item.helper}</span>
              ) : null}
            </div>

            {item.url ? (
              <PrimaryActionBar align="flex-end">
                <button
                  type="button"
                  data-learning-plan-action={item.id || undefined}
                  style={index === 0 ? styles.primaryButton : styles.secondaryButton}
                  onClick={() => openItem(item)}
                >
                  {item.actionLabel || "Open"}
                </button>
              </PrimaryActionBar>
            ) : null}
          </div>
        ))}
      </div>

      {Number.isFinite(Number(plan.inactivityDays)) && Number(plan.inactivityDays) >= 3 ? (
        <p style={{ ...styles.helperText, margin: 0, color: "#92400e" }}>
          Returning after {plan.inactivityDays} days? Falowen has added a short review step before you continue.
        </p>
      ) : null}
    </section>
  );
};

export default DailyLearningPlanCard;
