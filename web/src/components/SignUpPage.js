import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { savePreferredLevel } from "../services/levelStorage";
import { rememberStudentCodeForEmail } from "../services/submissionService";
import { generateStudentCode } from "../services/studentCode";
import { classCatalog } from "../data/classCatalog";
import { computeTuitionStatus, paystackLinkForLevel } from "../data/levelFees";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { useToast } from "../context/ToastContext";
import PasswordGuidance from "./PasswordGuidance";
import { formatCurrency } from "../lib/formatters";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import {
  isFullName,
  isLikelyPhoneNumber,
  normalizeEmail,
  normalizePersonName,
  normalizePhone,
  normalizeWhitespace,
} from "../lib/signupDataQuality";

const MIN_INITIAL_PAYMENT = 2000;

const formatClassLabel = (className) => {
  const details = classCatalog[className];
  if (!details) return className;
  if (details.isSelfLearning || details.availability === "always") {
    return `${className} — self-learning (always available)`;
  }

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

const SignUpPage = ({ onLogin, onBack }) => {
  const { signup, authError, setAuthError } = useAuth();
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const formatMoney = useMemo(
    () => (value) => formatCurrency(value, { locale, maximumFractionDigits: 0 }),
    [locale]
  );
  const { showToast } = useToast();
  const paymentsEnabled = isPaymentsEnabled();
  const now = useMemo(() => new Date(), []);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [learningMode, setLearningMode] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [paymentOption, setPaymentOption] = useState("full");
  const [selectedClass, setSelectedClass] = useState(loadPreferredClass() || "");
  const [hasConsented, setHasConsented] = useState(false);
  const [showConsentDetails, setShowConsentDetails] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const fieldRefs = useRef({});

  const consentHighlights = t("signupPage.consent.highlights", { returnObjects: true });

  const classOptions = useMemo(() => {
    return Object.keys(classCatalog)
      .filter((className) => {
        const details = classCatalog[className];
        if (!details) return false;
        if (details.isSelfLearning || details.availability === "always") return true;
        if (!details.startDate) return false;
        const startDate = new Date(`${details.startDate}T00:00:00`);
        return startDate > now;
      })
      .map((className) => ({
        value: className,
        label: formatClassLabel(className),
      }));
  }, [now]);

  useEffect(() => {
    if (!selectedClass) return;
    const availableValues = new Set(classOptions.map((option) => option.value));
    if (!availableValues.has(selectedClass)) {
      setSelectedClass("");
    }
  }, [classOptions, selectedClass]);

  const tuitionFeeForLevel = useMemo(
    () => computeTuitionStatus({ level: selectedLevel, paidAmount: 0 }).tuitionFee,
    [selectedLevel]
  );

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 46 };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const setFieldError = (field, message) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  };

  const focusField = (field) => {
    const element = fieldRefs.current[field];
    if (!element) return;
    element.focus();
    if (typeof element.scrollIntoView === "function") {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const interpretSignupError = (error) => {
    const code = error?.code || "";
    if (code.includes("email-already-in-use")) {
      return {
        field: "email",
        message: "That email is already registered. Try logging in or use a different email address.",
      };
    }

    if (code.includes("invalid-email")) {
      return {
        field: "email",
        message: "This email looks invalid. Check for typos or try another address.",
      };
    }

    if (code.includes("weak-password")) {
      return {
        field: "password",
        message: "Password is too weak. Use at least 8 characters with a mix of letters and numbers.",
      };
    }

    if (code.includes("network-request-failed") || error?.message?.toLowerCase().includes("network")) {
      return {
        field: null,
        message: "We could not reach the signup service. Check your connection and try again.",
      };
    }

    return {
      field: null,
      message:
        "We couldn't create your account right now. Please try again in a moment or contact info@falowen.app for help.",
    };
  };

  const initialPaymentAmount = paymentOption === "part" ? MIN_INITIAL_PAYMENT : tuitionFeeForLevel;

  const tuitionSummary = computeTuitionStatus({
    level: selectedLevel,
    paidAmount: 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setMessage("");
    setFieldErrors({});

    const numericInitialPayment = Number(initialPaymentAmount);
    const cleanedName = normalizePersonName(name);
    const cleanedEmail = normalizeEmail(email);
    const cleanedPhone = normalizePhone(phone);
    const cleanedAddress = normalizeWhitespace(address);
    const cleanedLocation = normalizeWhitespace(location);
    const cleanedEmergencyPhone = normalizePhone(emergencyContactPhone);

    const validationIssues = {};

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

    if (!isFullName(name)) {
      validationIssues.name =
        "Use your full name (first and last). This will appear on certificates and transcripts.";
    }

    if (!selectedClass) {
      validationIssues.selectedClass = "Pick a class to reserve your seat. If unsure, choose the closest option for now.";
    }

    if (!isLikelyPhoneNumber(cleanedPhone)) {
      validationIssues.phone = "Enter a valid contact phone number (7–15 digits) so we can reach you.";
    }

    if (!cleanedAddress) {
      validationIssues.address = "Add your address so we can keep accurate records for your enrollment.";
    }

    if (!cleanedLocation) {
      validationIssues.location = "Add your current location so we can keep accurate enrollment records.";
    }

    if (!isLikelyPhoneNumber(cleanedEmergencyPhone)) {
      validationIssues.emergencyContactPhone =
        "Add a valid emergency contact phone number (7–15 digits). This is required for safety.";
    }

    if (!learningMode) {
      validationIssues.learningMode = "Choose how you plan to learn so we can match you to the right experience.";
    }

    if (password !== confirmPassword) {
      validationIssues.confirmPassword = "Passwords do not match. Re-enter both fields to continue.";
    }

    if (!hasConsented) {
      validationIssues.consent = "Agree to the terms and privacy policy to continue. You can open the summary above first.";
    }

    const validationMessages = Object.values(validationIssues);
    if (validationMessages.length) {
      setFieldErrors(validationIssues);
      const firstInvalidField = Object.keys(validationIssues)[0];
      if (firstInvalidField) {
        focusField(firstInvalidField);
      }
      const summaryMessage = `${validationMessages[0]} Fix the highlighted fields, then submit again.`;
      setAuthError(summaryMessage);
      showToast(summaryMessage, "error");
      triggerInteractionFeedback({ sound: "error", vibratePattern: [120] });
      return;
    }

    setLoading(true);
    try {
      const tuitionFee = tuitionSummary.tuitionFee;
      // IMPORTANT: don't mark money as paid until the Paystack webhook confirms it.
      const intendedPaymentAmount = Math.max(Number(numericInitialPayment) || 0, 0);
      const paidAmount = 0;
      const balanceDue = Math.max(Number(tuitionFee) || 0, 0);
      const paymentStatus = "pending";
      const studentCode = generateStudentCode({ name: cleanedName });
      // Store the base Paystack link, but create the actual checkout URL on-demand
      // via the backend so we can validate amounts and attach clear metadata.
      const paystackLink = paystackLinkForLevel(selectedLevel);

      await signup(cleanedEmail, password, {
        name: cleanedName,
        level: selectedLevel,
        studentCode,
        className: selectedClass,
        phone: cleanedPhone,
        location: cleanedLocation,
        address: cleanedAddress,
        learningMode,
        emergencyContactPhone: cleanedEmergencyPhone,
        program: "german",
        initialPaymentAmount: paidAmount,
        tuitionFee,
        balanceDue,
        paymentStatus,
        paystackLink,
        paymentIntentAmount: intendedPaymentAmount || null,
        status: "Active",
        contractStart: "",
        contractEnd: "",
        contractTermMonths: 0,
      });
      savePreferredLevel(selectedLevel);
      savePreferredClass(selectedClass);
      rememberStudentCodeForEmail(cleanedEmail, studentCode);
      const balanceText = balanceDue > 0 ? ` Balance due: ${formatMoney(balanceDue)}.` : "";
      const amountCopy = intendedPaymentAmount
        ? `You chose to pay ${formatMoney(intendedPaymentAmount)} now.`
        : "Choose how much to pay now inside the app.";
      const accessCopy = `Pay at least ${formatMoney(
        MIN_INITIAL_PAYMENT
      )} to unlock 1-month access, or clear the full balance to unlock 6 months.`;
      const paymentInstruction = paymentsEnabled
        ? "Open the tuition card in the app to start Paystack checkout."
        : "Payments are handled on the web app only. Please sign in online to complete your tuition.";
      const paymentRedirectNote = "You'll always see your student code and tuition status under Account & Billing.";
      const successMessage = `Account created! Your student code is ${studentCode}. ${amountCopy} ${accessCopy} ${paymentInstruction} ${paymentRedirectNote}${balanceText}`;
      setMessage(successMessage);
      showToast(`${successMessage} Finish setup inside the app.`, "success");
      triggerInteractionFeedback({ sound: "success", vibratePattern: [60, 30, 80] });
    } catch (error) {
      console.error(error);
      const friendlyError = interpretSignupError(error);
      if (friendlyError.field) {
        setFieldError(friendlyError.field, friendlyError.message);
      }

      const errorMessage = friendlyError.message;
      const nextStep = friendlyError.field
        ? "Review the highlighted field and try again."
        : "Try again shortly. If it keeps failing, contact info@falowen.app.";
      const combinedMessage = `${errorMessage} ${nextStep}`;
      setAuthError(combinedMessage);
      showToast(combinedMessage, "error");
      triggerInteractionFeedback({ sound: "error", vibratePattern: [120] });
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
          maxWidth: 660,
          position: "relative",
          padding: 20,
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>{t("signupPage.title")}</h2>
          {onBack && (
            <button style={{ ...styles.secondaryButton, padding: "6px 12px" }} onClick={onBack}>
              {t("signupPage.backToOverview")}
            </button>
          )}
        </div>
        <p style={{ ...styles.helperText, marginTop: -2 }}>
          {t("signup.interfaceNote", { program: t("signup.programs.german") })}
        </p>
        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 12,
            border: "1px solid #dbeafe",
            position: "relative",
            minHeight: 170,
            backgroundImage:
              "linear-gradient(120deg, rgba(30,64,175,0.9), rgba(56,189,248,0.82)), url('/learning-space-hero.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div style={{ padding: 16, background: "linear-gradient(0deg, rgba(2,6,23,0.55), rgba(2,6,23,0.05))", width: "100%" }}>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", opacity: 0.95 }}>
              Welcome to Falowen
            </p>
            <h3 style={{ margin: "6px 0 4px", fontSize: 20, lineHeight: 1.25 }}>Start strong. Learn with confidence.</h3>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, opacity: 0.95 }}>
              Create your account to unlock guided exam practice, tutor feedback, and your personalized learning path.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={styles.label}>{t("signupPage.fields.name")}</label>
          <input
            type="text"
            required
            autoComplete="name"
            ref={(element) => {
              fieldRefs.current.name = element;
            }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
              setAuthError("");
            }}
            style={inputStyle}
            placeholder="Abigail Mensah"
          />
          {fieldErrors.name ? <p style={styles.fieldError}>{fieldErrors.name}</p> : null}
          <p style={{ ...styles.helperText, marginTop: -4 }}>
            Please enter your full name (first and last). We use it to print certificates and transcripts.
          </p>

          <label style={styles.label}>{t("signupPage.fields.email")}</label>
          <input
            type="email"
            required
            autoComplete="email"
            ref={(element) => {
              fieldRefs.current.email = element;
            }}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
              setAuthError("");
            }}
            style={inputStyle}
            placeholder="you@example.com"
          />
          {fieldErrors.email ? <p style={styles.fieldError}>{fieldErrors.email}</p> : null}

          <label style={styles.label}>{t("signupPage.fields.password")}</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            ref={(element) => {
              fieldRefs.current.password = element;
            }}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
              setAuthError("");
            }}
            style={inputStyle}
            placeholder="At least 8 characters with letters and numbers"
          />
          {fieldErrors.password ? <p style={styles.fieldError}>{fieldErrors.password}</p> : null}

          <PasswordGuidance password={password} />

          <label style={styles.label}>{t("signupPage.fields.confirmPassword")}</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            ref={(element) => {
              fieldRefs.current.confirmPassword = element;
            }}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearFieldError("confirmPassword");
              setAuthError("");
            }}
            style={inputStyle}
            placeholder="Enter password again"
          />
          {fieldErrors.confirmPassword ? <p style={styles.fieldError}>{fieldErrors.confirmPassword}</p> : null}

          <label style={styles.label}>{t("signupPage.fields.currentLevel")}</label>
          <select
            required
            ref={(element) => {
              fieldRefs.current.selectedLevel = element;
            }}
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
            style={styles.select}
          >
            {ALLOWED_LEVELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            We load speaking and writing tasks from the sheet that matches your level.
          </p>

          <label style={styles.label}>{t("signupPage.fields.phone")}</label>
          <input
            type="tel"
            required
            autoComplete="tel"
            ref={(element) => {
              fieldRefs.current.phone = element;
            }}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearFieldError("phone");
              setAuthError("");
            }}
            style={inputStyle}
            placeholder="0176 12345678"
          />
          {fieldErrors.phone ? <p style={styles.fieldError}>{fieldErrors.phone}</p> : null}

          <p style={{ ...styles.helperText, marginTop: -4 }}>
            We keep your phone number on file to contact you directly when necessary. Your emergency contact is only
            notified in urgent safety situations.
          </p>

          <label style={styles.label}>{t("signupPage.fields.address")}</label>
          <textarea
            required
            autoComplete="street-address"
            ref={(element) => {
              fieldRefs.current.address = element;
            }}
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              clearFieldError("address");
              setAuthError("");
            }}
            style={{ ...styles.textArea, minHeight: 80 }}
            placeholder="House number, street, city, region"
          />
          {fieldErrors.address ? <p style={styles.fieldError}>{fieldErrors.address}</p> : null}

          <label style={styles.label}>{t("signupPage.fields.location")}</label>
          <input
            type="text"
            required
            autoComplete="address-level2"
            ref={(element) => {
              fieldRefs.current.location = element;
            }}
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              clearFieldError("location");
            }}
            style={inputStyle}
            placeholder="Berlin"
          />
          {fieldErrors.location ? <p style={styles.fieldError}>{fieldErrors.location}</p> : null}

          <label style={styles.label}>{t("signupPage.fields.learningMode")}</label>
          <select
            required
            ref={(element) => {
              fieldRefs.current.learningMode = element;
            }}
            value={learningMode}
            onChange={(event) => {
              setLearningMode(event.target.value);
              clearFieldError("learningMode");
              setAuthError("");
            }}
            style={styles.select}
          >
            <option value="">{t("signupPage.options.chooseOne")}</option>
            <option value="In-person">{t("signupPage.options.inPerson")}</option>
            <option value="Online">{t("signupPage.options.online")}</option>
            <option value="Hybrid">{t("signupPage.options.hybrid")}</option>
          </select>
          {fieldErrors.learningMode ? <p style={styles.fieldError}>{fieldErrors.learningMode}</p> : null}

          <label style={styles.label}>{t("signupPage.fields.emergencyContactPhone")}</label>
          <input
            type="tel"
            required
            autoComplete="tel-national"
            ref={(element) => {
              fieldRefs.current.emergencyContactPhone = element;
            }}
            value={emergencyContactPhone}
            onChange={(e) => {
              setEmergencyContactPhone(e.target.value);
              clearFieldError("emergencyContactPhone");
              setAuthError("");
            }}
            style={inputStyle}
            placeholder="0176 98765432"
          />
          {fieldErrors.emergencyContactPhone ? (
            <p style={styles.fieldError}>{fieldErrors.emergencyContactPhone}</p>
          ) : null}

          <label style={styles.label} htmlFor="initial-payment-amount">Payment option</label>
          <select
            id="initial-payment-amount"
            ref={(element) => {
              fieldRefs.current.initialPaymentAmount = element;
            }}
            value={paymentOption}
            onChange={(event) => {
              setPaymentOption(event.target.value);
              clearFieldError("initialPaymentAmount");
              setAuthError("");
            }}
            style={styles.select}
          >
            <option value="full">Full fee — {formatMoney(tuitionFeeForLevel)} (recommended)</option>
            <option value="part">Part payment — {formatMoney(MIN_INITIAL_PAYMENT)}</option>
          </select>
          {fieldErrors.initialPaymentAmount ? (
            <p style={styles.fieldError}>{fieldErrors.initialPaymentAmount}</p>
          ) : null}
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            Full payment is selected by default and unlocks 6 months of access. Part payment unlocks 1 month of access, with the remaining balance due afterward. We confirm Paystack payments before marking you as paid.
          </p>

          <TuitionStatusCard
            level={selectedLevel}
            // This card is a preview only... actual payment is confirmed via Paystack webhook.
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

          <label style={styles.label} htmlFor="class-selection">{t("signupPage.fields.classSelection")}</label>
          <select
            id="class-selection"
            value={selectedClass}
            ref={(element) => {
              fieldRefs.current.selectedClass = element;
            }}
            onChange={(event) => {
              setSelectedClass(event.target.value);
              clearFieldError("selectedClass");
              setAuthError("");
            }}
            style={styles.select}
            required
          >
            <option value="">{t("signupPage.options.chooseClass")}</option>
            {classOptions.map((classOption) => (
              <option key={classOption.value} value={classOption.value}>
                {classOption.label}
              </option>
            ))}
          </select>
          {fieldErrors.selectedClass ? <p style={styles.fieldError}>{fieldErrors.selectedClass}</p> : null}
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            Picking a class is required so we can reserve your spot. If unsure, choose the closest option for now.
          </p>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#111827" }}>
            <input
              type="checkbox"
              checked={hasConsented}
              ref={(element) => {
                fieldRefs.current.consent = element;
              }}
              onChange={(event) => {
                setHasConsented(event.target.checked);
                clearFieldError("consent");
                setAuthError("");
              }}
              required
              style={{ width: 18, height: 18 }}
            />
            <span>
              {t("signupPage.consent.agreePrefix")}
              {" "}
              <a
                href="https://register.falowen.app/#terms-of-service"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#1d4ed8", fontWeight: 600 }}
              >
                terms
              </a>
              {" "}
              {t("signupPage.consent.and")}
              {" "}
              <a
                href="https://register.falowen.app/#privacy-policy"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#1d4ed8", fontWeight: 600 }}
              >
                privacy policy
              </a>
              {t("signupPage.consent.period")}
            </span>
          </label>
          {fieldErrors.consent ? <p style={styles.fieldError}>{fieldErrors.consent}</p> : null}
          <div style={{ marginLeft: 26, marginTop: 6, color: "#4b5563", fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <strong style={{ fontWeight: 600 }}>{t("signupPage.consent.keyPoints")}</strong>
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
                {t("signupPage.consent.viewSummary")}
              </button>
            </div>
            <ul style={{ marginTop: 6, paddingLeft: 18, lineHeight: 1.5 }}>
              {consentHighlights.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p style={{ marginTop: 4 }}>
              {t("signupPage.consent.fullDetails")}
            </p>
          </div>

          <button style={styles.primaryButton} type="submit" disabled={loading}>
            {loading ? t("signupPage.actions.creating") : t("signupPage.actions.signUp")}
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
            aria-label={t("signupPage.consent.dialogAria")}
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
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{t("signupPage.consent.dialogTitle")}</h3>
                <button
                  type="button"
                  onClick={() => setShowConsentDetails(false)}
                  style={{ ...styles.secondaryButton, padding: "6px 12px", fontSize: 12 }}
                >
                  {t("signupPage.actions.close")}
                </button>
              </div>
              <p style={{ marginTop: 12, marginBottom: 10 }}>
                {t("signupPage.consent.dialogIntro")}
              </p>
              <ul style={{ marginTop: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                {consentHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p style={{ marginTop: 10, color: "#4b5563" }}>
                {t("signupPage.consent.readFull")}
                {" "}
                <a
                  href="https://register.falowen.app/#terms-of-service"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1d4ed8", fontWeight: 600 }}
                >
                  terms
                </a>
                {" "}
                {t("signupPage.consent.and")}
                {" "}
                <a
                  href="https://register.falowen.app/#privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1d4ed8", fontWeight: 600 }}
                >
                  privacy policy
                </a>
                {" "}
                {t("signupPage.consent.withoutLosingProgress")}
              </p>
            </div>
          </div>
        )}

        {authError && <div style={styles.errorBox}>{authError}</div>}
        {message && (
          <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#166534", borderColor: "#22c55e" }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 13, color: "#4b5563" }}>
          {t("signupPage.alreadyRegistered")} {" "}
          <button
            type="button"
            onClick={onLogin}
            style={{ ...styles.secondaryButton, padding: "6px 12px" }}
          >
            {t("signupPage.actions.goToLogin")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
