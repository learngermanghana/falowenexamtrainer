import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FRENCH_A1_SCHEDULE } from "../data/frenchCourseSchedule";
import { frenchClassCatalog } from "../data/french/classCatalog";
import { computeTuitionStatus } from "../data/levelFees";
import { rememberStudentCodeForEmail } from "../services/submissionService";
import { generateStudentCode } from "../services/studentCode";
import PasswordGuidance from "./PasswordGuidance";
import TuitionStatusCard from "./TuitionStatusCard";
import { formatCurrency } from "../lib/formatters";

const MIN_INITIAL_PAYMENT = 200;
const FRENCH_LEVELS = ["A1"];

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
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const formatMoney = useMemo(
    () => (value) => formatCurrency(value, { locale, maximumFractionDigits: 0 }),
    [locale]
  );
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
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasConsented, setHasConsented] = useState(false);
  const [showConsentDetails, setShowConsentDetails] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedLevel, setSelectedLevel] = useState(FRENCH_LEVELS[0]);
  const [address, setAddress] = useState("");
  const [learningMode, setLearningMode] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [initialPaymentAmount, setInitialPaymentAmount] = useState(`${MIN_INITIAL_PAYMENT}`);

  const scheduleHighlights = useMemo(() => FRENCH_A1_SCHEDULE.slice(0, 6), []);
  const defaultFrenchClass = useMemo(() => Object.keys(frenchClassCatalog)[0], []);
  const tuitionSummary = useMemo(() => {
    const resolvedClass = selectedClass || defaultFrenchClass;
    const tuitionFee = frenchClassCatalog[resolvedClass]?.tuitionFee;
    return computeTuitionStatus({ level: selectedLevel, paidAmount: 0, tuitionFee });
  }, [defaultFrenchClass, selectedClass, selectedLevel]);
  const resolvedClassDetails = useMemo(() => {
    const resolvedClass = selectedClass || defaultFrenchClass;
    return resolvedClass ? frenchClassCatalog[resolvedClass] : null;
  }, [defaultFrenchClass, selectedClass]);
  const examFee = resolvedClassDetails?.examFee;

  const consentHighlights = [
    "We collect your contact details to create and support your account, share class updates, and send payment reminders.",
    "You can switch contract terms or cancel future renewals by contacting support before the next billing date.",
    "Payments are processed securely; tuition balances must be cleared to keep full access to live classes and materials.",
    "We never sell your data and only share it with partners that help us deliver the service (like payments and messaging).",
  ];

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 46 };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleInitialPaymentChange = (event) => {
    const rawValue = event.target.value;
    setInitialPaymentAmount(rawValue);
    clearFieldError("initialPaymentAmount");

    const numericOnlyValue = rawValue.replace(/[^\d.]/g, "");
    if (!numericOnlyValue) return;

    const numericValue = Number(numericOnlyValue);
    if (Number.isNaN(numericValue)) return;

    const sanitizedValue = Math.max(numericValue, 0);
    const cappedValue = Math.min(sanitizedValue, tuitionSummary.tuitionFee || sanitizedValue);
    setInitialPaymentAmount(`${cappedValue}`);
  };

  useEffect(() => {
    const numericAmount = Number(initialPaymentAmount);
    if (initialPaymentAmount === "" || Number.isNaN(numericAmount)) return;

    const cappedAmount = Math.min(
      Math.max(numericAmount, 0),
      tuitionSummary.tuitionFee || numericAmount
    );
    if (`${cappedAmount}` !== `${initialPaymentAmount}`) {
      setInitialPaymentAmount(`${cappedAmount}`);
    }
  }, [initialPaymentAmount, tuitionSummary.tuitionFee]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setMessage("");
    setFieldErrors({});

    const numericInitialPayment = Number(initialPaymentAmount);
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

    if (!address.trim()) {
      validationIssues.address = "Add your address so we can keep accurate records for your enrollment.";
    }

    if (!location.trim()) {
      validationIssues.location = "Add your current location so we can keep accurate enrollment records.";
    }

    if (!learningMode) {
      validationIssues.learningMode = "Choose how you plan to learn so we can match you to the right experience.";
    }

    if (!emergencyContactPhone.trim()) {
      validationIssues.emergencyContactPhone = "Add an emergency contact phone number. This is required for safety.";
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

    if (initialPaymentAmount === "" || Number.isNaN(numericInitialPayment)) {
      validationIssues.initialPaymentAmount = `Enter a number without commas or spaces. You need at least ${formatMoney(
        MIN_INITIAL_PAYMENT
      )} to start a paid account.`;
    }

    if (numericInitialPayment < 0) {
      validationIssues.initialPaymentAmount = "Initial payment cannot be negative. Remove the minus sign and try again.";
    }

    if (!numericInitialPayment || numericInitialPayment < MIN_INITIAL_PAYMENT) {
      validationIssues.initialPaymentAmount = `Enter ${formatMoney(
        MIN_INITIAL_PAYMENT
      )} or more to reserve your class.`;
    }

    if (numericInitialPayment > tuitionSummary.tuitionFee) {
      validationIssues.initialPaymentAmount = "Initial payment cannot exceed the tuition fee for A1.";
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
      const level = selectedLevel;
      const tuitionFee = tuitionSummary.tuitionFee;
      const studentCode = generateStudentCode({ name });
      const paystackLink = tuitionSummary.paystackLink;
      const intendedPaymentAmount = Math.max(Number(numericInitialPayment) || 0, 0);

      await signup(email, password, {
        name,
        level,
        studentCode,
        className: selectedClass,
        phone,
        location,
        learningMode,
        address,
        emergencyContactPhone,
        program: "french",
        initialPaymentAmount: 0,
        tuitionFee,
        balanceDue: tuitionFee,
        paymentStatus: "pending",
        paystackLink,
        paymentIntentAmount: intendedPaymentAmount || null,
        status: "Active",
        contractStart: "",
        contractEnd: "",
        contractTermMonths: 6,
      });

      rememberStudentCodeForEmail(email, studentCode);
      const successMessage =
        `Welcome to French A1! Your student code is ${studentCode}. ` +
        "We will send your class start date and live links by email. " +
        "Open the tuition card in the app to complete your Paystack payment.";
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
            <p style={{ ...styles.helperText, margin: "6px 0 0", maxWidth: 520 }}>
              {t("signup.interfaceNote", { program: t("signup.programs.french") })}
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
            <label htmlFor="french-name" style={styles.label}>
              Name
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
              required
            />
            {fieldErrors.name ? <p style={styles.fieldError}>{fieldErrors.name}</p> : null}
            <p style={{ ...styles.helperText, marginTop: -4 }}>
              Please enter your full name (first and last). We use it to print certificates and transcripts.
            </p>

            <label htmlFor="french-email" style={styles.label}>
              Email
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
              required
            />
            {fieldErrors.email ? <p style={styles.fieldError}>{fieldErrors.email}</p> : null}

            <label htmlFor="french-password" style={styles.label}>
              Password
            </label>
            <input
              id="french-password"
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => {
                clearFieldError("password");
                setPassword(event.target.value);
              }}
              style={inputStyle}
              placeholder="At least 8 characters with letters and numbers"
              required
            />
            {fieldErrors.password ? <p style={styles.fieldError}>{fieldErrors.password}</p> : null}
            <PasswordGuidance password={password} />

            <label htmlFor="french-confirm" style={styles.label}>
              Confirm password
            </label>
            <input
              id="french-confirm"
              type="password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => {
                clearFieldError("confirmPassword");
                setConfirmPassword(event.target.value);
              }}
              style={inputStyle}
              placeholder="Enter password again"
              required
            />
            {fieldErrors.confirmPassword ? <p style={styles.fieldError}>{fieldErrors.confirmPassword}</p> : null}

            <label htmlFor="french-level" style={styles.label}>
              Your current level
            </label>
            <select
              id="french-level"
              value={selectedLevel}
              onChange={(event) => setSelectedLevel(event.target.value)}
              style={styles.select}
              required
            >
              {FRENCH_LEVELS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p style={{ ...styles.helperText, marginTop: -2 }}>
              We load speaking and writing tasks from the sheet that matches your level.
            </p>

            <label htmlFor="french-phone" style={styles.label}>
              Phone number
            </label>
            <input
              id="french-phone"
              type="tel"
              value={phone}
              onChange={(event) => {
                clearFieldError("phone");
                setPhone(event.target.value);
              }}
              style={inputStyle}
              placeholder="+233 20 123 4567"
              required
            />
            {fieldErrors.phone ? <p style={styles.fieldError}>{fieldErrors.phone}</p> : null}
            <p style={{ ...styles.helperText, marginTop: -4 }}>
              We keep your phone number on file to contact you directly when necessary. Your emergency contact is only
              notified in urgent safety situations.
            </p>

            <label htmlFor="french-address" style={styles.label}>
              Address
            </label>
            <input
              id="french-address"
              value={address}
              onChange={(event) => {
                clearFieldError("address");
                setAddress(event.target.value);
              }}
              style={inputStyle}
              placeholder="East Legon, Accra"
              required
            />
            {fieldErrors.address ? <p style={styles.fieldError}>{fieldErrors.address}</p> : null}

            <label htmlFor="french-location" style={styles.label}>
              Location
            </label>
            <input
              id="french-location"
              value={location}
              onChange={(event) => {
                clearFieldError("location");
                setLocation(event.target.value);
              }}
              style={inputStyle}
              placeholder="Accra"
              required
            />
            {fieldErrors.location ? <p style={styles.fieldError}>{fieldErrors.location}</p> : null}

            <label style={styles.label}>Preferred learning mode</label>
            <select
              required
              value={learningMode}
              onChange={(event) => {
                setLearningMode(event.target.value);
                clearFieldError("learningMode");
                setAuthError("");
              }}
              style={styles.select}
            >
              <option value="">Choose one</option>
              <option value="In-person">In-person</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {fieldErrors.learningMode ? <p style={styles.fieldError}>{fieldErrors.learningMode}</p> : null}

            <label style={styles.label}>Emergency contact phone</label>
            <input
              type="tel"
              required
              value={emergencyContactPhone}
              onChange={(event) => {
                setEmergencyContactPhone(event.target.value);
                clearFieldError("emergencyContactPhone");
                setAuthError("");
              }}
              style={inputStyle}
              placeholder="+233 24 987 6543"
            />
            {fieldErrors.emergencyContactPhone ? (
              <p style={styles.fieldError}>{fieldErrors.emergencyContactPhone}</p>
            ) : null}

            <label style={styles.label} htmlFor="initial-payment-amount">Initial payment amount (GHS)</label>
            <input
              id="initial-payment-amount"
              type="number"
              min={MIN_INITIAL_PAYMENT}
              max={tuitionSummary.tuitionFee}
              step="100"
              pattern="[0-9]*"
              inputMode="numeric"
              value={initialPaymentAmount}
              onChange={handleInitialPaymentChange}
              style={inputStyle}
              placeholder={`At least ${formatMoney(MIN_INITIAL_PAYMENT)}`}
              required
            />
            {fieldErrors.initialPaymentAmount ? (
              <p style={styles.fieldError}>{fieldErrors.initialPaymentAmount}</p>
            ) : null}
            <p style={{ ...styles.helperText, marginTop: -2 }}>
              Enter between {formatMoney(MIN_INITIAL_PAYMENT)} and {formatMoney(tuitionSummary.tuitionFee)} for {selectedLevel}. A1: {formatMoney(tuitionSummary.tuitionFee)}
              · A2: {formatMoney(3000)} · B1: {formatMoney(3000)} · B2: {formatMoney(3000)} · C1: {formatMoney(3000)}. You must pay at least{" "}
              {formatMoney(MIN_INITIAL_PAYMENT)} to start your account. We confirm Paystack payments before marking you as paid.
            </p>
            {examFee ? (
              <p style={{ ...styles.helperText, marginTop: -2 }}>
                A1 Paris Class exam fee: {formatMoney(examFee)}.
              </p>
            ) : null}

            <TuitionStatusCard
              level={selectedLevel}
              paidAmount={0}
              balanceDue={tuitionSummary.tuitionFee}
              tuitionFee={tuitionSummary.tuitionFee}
              paystackLink={tuitionSummary.paystackLink}
              showPaymentAction={false}
              title="Tuition summary"
              description={`For ${selectedLevel} we charge ${formatMoney(
                tuitionSummary.tuitionFee
              )}. You'll pay via Paystack after signup (we confirm payment before marking your account as paid).`}
            />

            <label style={styles.label} htmlFor="french-class">Which live class are you joining? (required)</label>
            <select
              id="french-class"
              value={selectedClass}
              onChange={(event) => {
                clearFieldError("class");
                setSelectedClass(event.target.value);
              }}
              style={styles.select}
              required
            >
              <option value="">Decide later (we'll ask again after signup)</option>
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.class ? <p style={styles.fieldError}>{fieldErrors.class}</p> : null}
            <p style={{ ...styles.helperText, marginTop: -2 }}>
              Picking a class is required so we can reserve your spot. If unsure, choose the closest option for now.
            </p>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#111827" }}>
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(event) => {
                  clearFieldError("consent");
                  setHasConsented(event.target.checked);
                  setAuthError("");
                }}
                required
                style={{ width: 18, height: 18 }}
              />
              <span>
                I agree to the{" "}
                <a
                  href="https://register.falowen.app/#terms-of-service"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1d4ed8", fontWeight: 600 }}
                >
                  terms
                </a>{" "}
                and{" "}
                <a
                  href="https://register.falowen.app/#privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1d4ed8", fontWeight: 600 }}
                >
                  privacy policy
                </a>
                .
              </span>
            </label>
            {fieldErrors.consent ? <p style={styles.fieldError}>{fieldErrors.consent}</p> : null}
            <div style={{ marginLeft: 26, marginTop: 6, color: "#4b5563", fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <strong style={{ fontWeight: 600 }}>Key points:</strong>
                <button
                  type="button"
                  onClick={() => setShowConsentDetails(true)}
                  style={{
                    ...styles.secondaryButton,
                    padding: "4px 10px",
                    fontSize: 12,
                    height: "auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  View summary
                </button>
              </div>
              <ul style={{ marginTop: 6, paddingLeft: 18, lineHeight: 1.5 }}>
                {consentHighlights.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p style={{ marginTop: 4 }}>
                Want the full details? Open the summary or the links above without leaving the form.
              </p>
            </div>

            {authError ? <div style={styles.errorBox}>{authError}</div> : null}
            {message ? <div style={styles.successBox}>{message}</div> : null}

            <button type="submit" style={styles.primaryButton} disabled={loading}>
              {loading ? "Creating account..." : "Join French A1"}
            </button>
          </form>

          {showConsentDetails && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                zIndex: 20,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Terms and privacy highlights"
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  maxWidth: 520,
                  width: "100%",
                  boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
                  padding: 20,
                  color: "#111827",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Terms and privacy highlights</h3>
                  <button
                    type="button"
                    onClick={() => setShowConsentDetails(false)}
                    style={{ ...styles.secondaryButton, padding: "6px 12px", fontSize: 12 }}
                  >
                    Close
                  </button>
                </div>
                <p style={{ marginTop: 12, marginBottom: 10 }}>
                  Here is a quick summary of what you are agreeing to when you continue.
                </p>
                <ul style={{ marginTop: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                  {consentHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p style={{ marginTop: 10, color: "#4b5563" }}>
                  Read the full{" "}
                  <a
                    href="https://register.falowen.app/#terms-of-service"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#1d4ed8", fontWeight: 600 }}
                  >
                    terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://register.falowen.app/#privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#1d4ed8", fontWeight: 600 }}
                  >
                    privacy policy
                  </a>{" "}
                  at any time without losing your progress.
                </p>
              </div>
            </div>
          )}

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
