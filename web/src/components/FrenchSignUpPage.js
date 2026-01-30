import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FRENCH_A1_SCHEDULE } from "../data/frenchCourseSchedule";
import { frenchClassCatalog } from "../data/french/classCatalog";

const isFullName = (value) => {
  const cleaned = String(value || "").trim();
  if (!cleaned) return false;
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
};

const formatClassLabel = (className) => {
  const details = frenchClassCatalog[className];
  if (!details) return className;

  const startLabel = details.startDate
    ? new Date(details.startDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Schedule";

  const timeLabel = Array.isArray(details.schedule)
    ? details.schedule
        .map(({ day, startTime, endTime }) =>
          [day, startTime && ` ${startTime}`, endTime && `-${endTime}`]
            .filter(Boolean)
            .join("")
        )
        .join(" · ")
    : "";

  return timeLabel
    ? `${className} — starts ${startLabel} — ${timeLabel}`
    : `${className} — starts ${startLabel}`;
};

const FrenchSignUpPage = ({ onLogin, onBack }) => {
  const { signup, authError, setAuthError } = useAuth();
  const { showToast } = useToast();
  const classOptions = useMemo(
    () =>
      Object.keys(frenchClassCatalog)
        .map((className) => ({
          value: className,
          label: formatClassLabel(className),
        })),
    []
  );
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedClass, setSelectedClass] = useState(() => classOptions[0]?.value || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasConsented, setHasConsented] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const scheduleHighlights = useMemo(() => FRENCH_A1_SCHEDULE.slice(0, 6), []);

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 46 };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setMessage("");
    setFieldErrors({});

    const validationIssues = {};

    if (!isFullName(name)) {
      validationIssues.name = "Use your full name (first and last) so we can prepare your French profile.";
    }

    if (!email.trim() || !email.includes("@")) {
      validationIssues.email = "Enter a valid email address so we can send your class links.";
    }

    if (!phone.trim()) {
      validationIssues.phone = "Add a contact phone number so we can reach you.";
    }

    if (!selectedClass) {
      validationIssues.class = "Choose the French class you want to join.";
    }

    if (!password || password.length < 8) {
      validationIssues.password = "Create a password with at least 8 characters.";
    }

    if (password !== confirmPassword) {
      validationIssues.confirmPassword = "Passwords do not match. Re-enter both fields to continue.";
    }

    if (!hasConsented) {
      validationIssues.consent = "Agree to the terms and privacy policy to continue.";
    }

    const validationMessages = Object.values(validationIssues);
    if (validationMessages.length) {
      setFieldErrors(validationIssues);
      const summaryMessage = `${validationMessages[0]} Fix the highlighted fields, then submit again.`;
      setAuthError(summaryMessage);
      showToast(summaryMessage, "error");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, {
        name,
        level: "A1",
        className: selectedClass,
        phone,
        location,
        learningMode: "Live classes",
        program: "french",
        initialPaymentAmount: 0,
        tuitionFee: 0,
        balanceDue: 0,
        paymentStatus: "paid",
        paystackLink: "",
        paymentIntentAmount: null,
        status: "Active",
        contractStart: "",
        contractEnd: "",
        contractTermMonths: 6,
      });

      const successMessage =
        "Welcome to French A1! Your account is ready. We will send your class start date and live links by email.";
      setMessage(successMessage);
      showToast(successMessage, "success");
    } catch (error) {
      console.error(error);
      const errorMessage =
        "We couldn't create your French account right now. Please try again or contact support@falowen.com.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div
        style={{
          ...styles.card,
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gap: 18,
          padding: "28px 24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ ...styles.badge, marginBottom: 8, background: "#fef3c7", color: "#92400e" }}>
              French Program
            </p>
            <h1 style={{ ...styles.title, marginBottom: 8 }}>Sign up for French A1 in Ghana</h1>
            <p style={{ ...styles.helperText, margin: 0, maxWidth: 520 }}>
              Start with survival French, daily speaking practice, and guided routines tailored for beginners.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <button type="button" onClick={onBack} style={styles.secondaryButton}>
              ← Back to landing
            </button>
            <button type="button" onClick={onLogin} style={styles.secondaryButton}>
              Log in
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: 14,
              padding: 16,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
            }}
          >
            <div>
              <label htmlFor="french-name" style={styles.formLabel}>
                Full name
              </label>
              <input
                id="french-name"
                value={name}
                onChange={(event) => {
                  clearFieldError("name");
                  setName(event.target.value);
                }}
                style={inputStyle}
                placeholder="Ama Owusu"
              />
              {fieldErrors.name ? <p style={styles.fieldError}>{fieldErrors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="french-email" style={styles.formLabel}>
                Email address
              </label>
              <input
                id="french-email"
                type="email"
                value={email}
                onChange={(event) => {
                  clearFieldError("email");
                  setEmail(event.target.value);
                }}
                style={inputStyle}
                placeholder="ama@example.com"
              />
              {fieldErrors.email ? <p style={styles.fieldError}>{fieldErrors.email}</p> : null}
            </div>

            <div>
              <label htmlFor="french-phone" style={styles.formLabel}>
                Phone number
              </label>
              <input
                id="french-phone"
                value={phone}
                onChange={(event) => {
                  clearFieldError("phone");
                  setPhone(event.target.value);
                }}
                style={inputStyle}
                placeholder="+233 20 123 4567"
              />
              {fieldErrors.phone ? <p style={styles.fieldError}>{fieldErrors.phone}</p> : null}
            </div>

            <div>
              <label htmlFor="french-class" style={styles.formLabel}>
                Choose your class
              </label>
              <select
                id="french-class"
                value={selectedClass}
                onChange={(event) => {
                  clearFieldError("class");
                  setSelectedClass(event.target.value);
                }}
                style={styles.select}
              >
                {classOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.class ? <p style={styles.fieldError}>{fieldErrors.class}</p> : null}
            </div>

            <div>
              <label htmlFor="french-location" style={styles.formLabel}>
                City / Location (optional)
              </label>
              <input
                id="french-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                style={inputStyle}
                placeholder="Accra"
              />
            </div>

            <div>
              <label htmlFor="french-password" style={styles.formLabel}>
                Create password
              </label>
              <input
                id="french-password"
                type="password"
                value={password}
                onChange={(event) => {
                  clearFieldError("password");
                  setPassword(event.target.value);
                }}
                style={inputStyle}
                placeholder="Minimum 8 characters"
              />
              {fieldErrors.password ? <p style={styles.fieldError}>{fieldErrors.password}</p> : null}
            </div>

            <div>
              <label htmlFor="french-confirm" style={styles.formLabel}>
                Confirm password
              </label>
              <input
                id="french-confirm"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  clearFieldError("confirmPassword");
                  setConfirmPassword(event.target.value);
                }}
                style={inputStyle}
                placeholder="Repeat password"
              />
              {fieldErrors.confirmPassword ? <p style={styles.fieldError}>{fieldErrors.confirmPassword}</p> : null}
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151" }}>
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(event) => {
                  clearFieldError("consent");
                  setHasConsented(event.target.checked);
                }}
              />
              <span>
                I agree to the Falowen terms and privacy policy for communication about my French cohort.
              </span>
            </label>
            {fieldErrors.consent ? <p style={styles.fieldError}>{fieldErrors.consent}</p> : null}

            {authError ? <div style={styles.errorBox}>{authError}</div> : null}
            {message ? <div style={styles.successBox}>{message}</div> : null}

            <button type="submit" style={styles.primaryButton} disabled={loading}>
              {loading ? "Creating account..." : "Join French A1"}
            </button>
          </form>

          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ ...styles.card, border: "1px solid #fde68a", background: "#fffbeb" }}>
              <h3 style={{ ...styles.sectionTitle, marginTop: 0 }}>What you will cover first</h3>
              <ul style={{ ...styles.checklist, margin: 0, lineHeight: 1.6 }}>
                {scheduleHighlights.map((item) => (
                  <li key={item.day}>
                    Day {item.day}: {item.topic}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ ...styles.card, border: "1px solid #e5e7eb" }}>
              <h3 style={{ ...styles.sectionTitle, marginTop: 0 }}>What happens next</h3>
              <ul style={{ ...styles.checklist, margin: 0, lineHeight: 1.6 }}>
                <li>We confirm your start date and class schedule by email.</li>
                <li>You receive WhatsApp onboarding tips for daily practice.</li>
                <li>Live French sessions run in small groups with tutor feedback.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrenchSignUpPage;
