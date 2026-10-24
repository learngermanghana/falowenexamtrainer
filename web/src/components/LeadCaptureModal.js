import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { leadLevelOptions, leadModeOptions, leadStartOptions } from "../lib/leadCapture";

const buildInitialState = (initialValues) => ({
  name: initialValues?.name || "",
  phone: initialValues?.phone || "",
  email: initialValues?.email || "",
  levelInterest: initialValues?.levelInterest || "",
  preferredMode: initialValues?.preferredMode || "",
  startTimeline: initialValues?.startTimeline || "",
});

const LeadCaptureModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Talk to us",
  subtitle = "Share a few details and our team will follow up with the best next step.",
  submitLabel = "Send details",
  closeOnSubmit = false,
  initialValues,
}) => {
  const [formState, setFormState] = useState(buildInitialState(initialValues));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormState(buildInitialState(initialValues));
      setSubmitted(false);
    }
  }, [initialValues, isOpen]);

  const canSubmit = useMemo(() => {
    return (
      formState.name.trim() &&
      formState.phone.trim() &&
      formState.email.trim() &&
      formState.levelInterest &&
      formState.preferredMode &&
      formState.startTimeline
    );
  }, [formState]);

  if (!isOpen) return null;

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit?.({
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      email: formState.email.trim(),
      levelInterest: formState.levelInterest,
      preferredMode: formState.preferredMode,
      startTimeline: formState.startTimeline,
    });
    if (closeOnSubmit) {
      onClose?.();
      return;
    }
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          ...styles.card,
          width: "100%",
          maxWidth: 520,
          background: "#ffffff",
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p style={{ margin: 0, color: "#4b5563", fontSize: 14 }}>{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
            <span>Full name</span>
            <input
              type="text"
              value={formState.name}
              onChange={handleChange("name")}
              placeholder="e.g. Alex Schmidt"
              autoComplete="name"
              required
              style={{ ...styles.input, borderColor: "#d1d5db" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
            <span>Phone number</span>
            <input
              type="tel"
              value={formState.phone}
              onChange={handleChange("phone")}
              placeholder="+233 20 123 4567"
              autoComplete="tel"
              required
              style={{ ...styles.input, borderColor: "#d1d5db" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
            <span>Email address</span>
            <input
              type="email"
              value={formState.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={{ ...styles.input, borderColor: "#d1d5db" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
            <span>Level of interest</span>
            <select
              value={formState.levelInterest}
              onChange={handleChange("levelInterest")}
              required
              style={{ ...styles.input, borderColor: "#d1d5db" }}
            >
              <option value="" disabled>
                Select a level
              </option>
              {leadLevelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
            <span>Preferred mode</span>
            <select
              value={formState.preferredMode}
              onChange={handleChange("preferredMode")}
              required
              style={{ ...styles.input, borderColor: "#d1d5db" }}
            >
              <option value="" disabled>
                Select a mode
              </option>
              {leadModeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
            <span>Preferred start</span>
            <select
              value={formState.startTimeline}
              onChange={handleChange("startTimeline")}
              required
              style={{ ...styles.input, borderColor: "#d1d5db" }}
            >
              <option value="" disabled>
                Select a timeframe
              </option>
              {leadStartOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button type="submit" style={styles.buttonPrimary} disabled={!canSubmit}>
              {submitLabel}
            </button>
            {submitted ? <span style={{ fontSize: 13, color: "#16a34a" }}>Saved — thanks!</span> : null}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
