// AuthGate.js
import AppBackButton from "./navigation/AppBackButton";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { generateStudentCode } from "../services/studentCode";
import { rememberStudentCodeForEmail } from "../services/submissionService";
import { savePreferredLevel } from "../services/levelStorage";
import { useToast } from "../context/ToastContext";
import PasswordGuidance from "./PasswordGuidance";
import LegalFooter from "./LegalFooter";
import { changeInterfaceLanguage } from "../i18n";
import { triggerInteractionFeedback } from "../services/interactionFeedback";

const isFullName = (value) => {
  const cleaned = String(value || "").trim();
  if (!cleaned) return false;
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
};

const getDiagnosticValue = (error, key) => {
  const diagnostic = error?.diagnostic || {};
  const profile = diagnostic.profile || {};
  return diagnostic[key] || profile[key] || "";
};

const getRecoveryAction = (error, identifier = "") => {
  const code = String(error?.code || "");
  const reason = String(getDiagnosticValue(error, "reason") || "").toLowerCase();
  const profile = error?.diagnostic?.profile || {};
  const diagnosticEmail = getDiagnosticValue(error, "email");
  const paystackLink = profile?.paystackLink || getDiagnosticValue(error, "paystackLink");
  const enteredEmail = String(identifier || "").includes("@");

  if (["auth/invalid-credential", "auth/wrong-password", "auth/password-mismatch", "auth/too-many-requests"].includes(code)) {
    return {
      kind: "reset",
      title: "Reset your password",
      description: enteredEmail
        ? "Send a reset link to the email address above."
        : diagnosticEmail
          ? `Use the email on this account: ${diagnosticEmail}`
          : "Enter the email address linked to this student account, then request a reset link.",
    };
  }

  if (["auth/payment-status-blocked", "auth/contract-ended"].includes(code) || reason === "payment_status" || reason === "contract_ended") {
    return {
      kind: paystackLink ? "payment" : "support",
      title: code === "auth/contract-ended" ? "Renew your access" : "Continue payment",
      description: paystackLink
        ? "Open the saved Falowen payment link. Your account is only marked paid after Paystack confirms the transaction."
        : "This account needs a payment or renewal update. Contact Falowen support with the details shown below.",
      href: paystackLink || "",
    };
  }

  if (["auth/account-inactive", "auth/user-disabled", "auth/student-access-blocked", "auth/login-diagnostic"].includes(code)) {
    return {
      kind: "support",
      title: "Contact support",
      description: "Falowen found the account, but its current status requires an admin review before login can continue.",
    };
  }

  if (code === "auth/user-not-found") {
    return enteredEmail
      ? {
          kind: "signup",
          title: "No account found",
          description: "Check the email for a typo. If you are new to Falowen, create an account.",
        }
      : {
          kind: "email",
          title: "Try your email address",
          description: "If the student code is not recognized, sign in with the email attached to your Falowen account.",
        };
  }

  if (code === "auth/permission-denied" || code === "permission-denied") {
    return enteredEmail
      ? {
          kind: "email",
          title: "Check your login details",
          description: "We could not find a matching student account. Check your email and password and try again.",
        }
      : {
          kind: "email",
          title: "Try your email address",
          description: "We could not find that student code. Check the code or sign in with the email linked to your account.",
        };
  }

  return null;
};

const formatAuthErrorMessage = (error, mode = "login") => {
  const code = error?.code;
  let message = "";

  if (mode === "login") {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        message = "Password mismatch. The password entered does not match this account.";
        break;
      case "auth/user-not-found":
        message = "We could not find an account with these details. Please check your email/student code or create an account.";
        break;
      case "auth/too-many-requests":
        message = "Too many login attempts were made. Please wait a few minutes and try again, or reset your password.";
        break;
      case "auth/password-mismatch":
        message = error?.message || "Password mismatch. The password entered does not match this account.";
        break;
      case "auth/contract-ended":
      case "auth/account-inactive":
      case "auth/payment-status-blocked":
      case "auth/student-access-blocked":
      case "auth/login-diagnostic":
        message = error?.message || "This student account cannot log in right now. Please contact support.";
        break;
      case "auth/user-disabled":
        message = "This account is currently disabled. Please contact support for help.";
        break;
      case "auth/permission-denied":
      case "permission-denied":
        message = "We could not find a matching account. Check your email or student code and try again.";
        break;
      case "auth/network-request-failed":
        message = "We could not connect to the internet. Please check your connection and try again.";
        break;
      default:
        break;
    }
  }

  if (!message && mode === "signup") {
    switch (code) {
      case "auth/duplicate-review-required":
      case "auth/duplicate-check-unavailable":
        message = error?.message || "Please contact Falowen admissions to verify your account before registering.";
        break;
      case "auth/email-already-in-use":
        message = "This email is already registered. Please log in or reset your password.";
        break;
      case "auth/weak-password":
        message = "Your password is too weak. Please use at least 8 characters, including letters and numbers.";
        break;
      case "auth/invalid-email":
        message = "This email address looks invalid. Please check and try again.";
        break;
      case "auth/network-request-failed":
        message = "We could not connect to the internet. Please check your connection and try again.";
        break;
      default:
        break;
    }
  }

  message = message || error?.message || "Something went wrong. Please try again.";
  return message;
};

const AuthGate = ({ onBack, onSwitchToSignup, initialMode = "login" }) => {
  const { signup, login, loginWithGoogle, authError, setAuthError, resetPassword } = useAuth();
  const { showToast } = useToast();
  const { i18n, t } = useTranslation();

  const [mode, setMode] = useState(initialMode);

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // signup-only fields
  const [name, setName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState(""); // ✅ NEW
  const [learningMode, setLearningMode] = useState("Online"); // Online | In-person | Hybrid
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [className, setClassName] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [recoveryAction, setRecoveryAction] = useState(null);

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 44 };
  const resolvedInterfaceLanguage = i18n.resolvedLanguage || i18n.language;
  const interfaceLanguageOptions = useMemo(
    () => [
      { value: "en", label: t("interfaceLanguages.en") },
      { value: "de", label: t("interfaceLanguages.de") },
      { value: "fr", label: t("interfaceLanguages.fr") },
      { value: "sw", label: t("interfaceLanguages.sw") },
    ],
    [t]
  );

  const handleInterfaceLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    void changeInterfaceLanguage(nextLanguage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setAuthError("");
    setRecoveryAction(null);

    try {
      if (mode === "signup") {
        if (!isFullName(name)) {
          const errorMessage =
            "Please enter your full name (first and last). It will be used on certificates and transcripts.";
          setAuthError(errorMessage);
          showToast(errorMessage, "error");
          triggerInteractionFeedback({
            sound: "error",
            vibratePattern: [120],
          });
          setLoading(false);
          return;
        }

        const studentCode = generateStudentCode({ name });

        await signup(email, password, {
          name,
          level: selectedLevel,
          studentCode,
          phone,
          location,
          address, // ✅ NEW
          learningMode,
          emergencyContactPhone,
          className,
          contractTermMonths: 6,
        });

        savePreferredLevel(selectedLevel);
        rememberStudentCodeForEmail(email, studentCode);

        const successMessage = `Account created! Your student code is ${studentCode}.`;
        setMessage(successMessage);
        showToast(`${successMessage} Finish setup inside the app.`, "success");
        triggerInteractionFeedback({
          sound: "success",
          vibratePattern: [60, 30, 80],
        });
      } else {
        const loginResult = await login(email, password);
        const credential = loginResult?.credential || loginResult;
        const profile = loginResult?.profile || credential?.user?.profile || {};

        const studentCode = profile?.studentCode || profile?.studentcode;
        const level = profile?.level;

        if (studentCode) rememberStudentCodeForEmail(profile?.email || email, studentCode);
        if (level) savePreferredLevel(level);

        const loginMessage = loginResult?.migratedFromLegacy || credential?.migratedFromLegacy
          ? "We found your old account. Your new password is now saved."
          : "Welcome back!";

        setMessage(loginMessage);
        showToast(loginMessage, "success");
        triggerInteractionFeedback({
          sound: "success",
          vibratePattern: [60],
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage = formatAuthErrorMessage(error, mode);
      setAuthError(errorMessage);
      if (mode === "login") {
        setRecoveryAction(getRecoveryAction(error, email));
      }
      if (mode !== "login") showToast(errorMessage, "error");
      triggerInteractionFeedback({
        sound: "error",
        vibratePattern: [120],
      });
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.includes("@")) {
      const resetMessage = "Enter your email address to reset your password.";
      setAuthError(resetMessage);
      showToast(resetMessage, "error");
      triggerInteractionFeedback({
        sound: "error",
        vibratePattern: [120],
      });
      return;
    }
    setResetting(true);
    setMessage("");
    setAuthError("");
    setRecoveryAction(null);

    try {
      await resetPassword(email);
      const resetMessage = "Password reset email sent. Please check your inbox and spam folder.";
      setMessage(resetMessage);
      showToast(resetMessage, "info");
      triggerInteractionFeedback({
        sound: "info",
        vibratePattern: [45],
      });
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.code === "auth/user-not-found"
          ? "We could not find an account with that email address."
          : error?.code === "auth/invalid-email"
            ? "That email address looks invalid. Please check and try again."
            : error?.message || "Could not send password reset email.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
      triggerInteractionFeedback({
        sound: "error",
        vibratePattern: [120],
      });
    } finally {
      setResetting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage("");
    setAuthError("");
    setRecoveryAction(null);

    try {
      const result = await loginWithGoogle();
      const profile = result?.profile;
      if (profile?.studentCode) {
        rememberStudentCodeForEmail(profile.email, profile.studentCode);
      }
      if (profile?.level) {
        savePreferredLevel(profile.level);
      }
      const successMessage = "Welcome back! Your student profile is ready.";
      setMessage(successMessage);
      showToast(successMessage, "success");
      triggerInteractionFeedback({
        sound: "success",
        vibratePattern: [60],
      });
    } catch (error) {
      console.error(error);
      const errorMessage = formatAuthErrorMessage(error, "login");
      setAuthError(errorMessage);
      setRecoveryAction(getRecoveryAction(error, email));
      triggerInteractionFeedback({
        sound: "error",
        vibratePattern: [120],
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setAuthError("");
    setMessage("");
    setRecoveryAction(null);
    triggerInteractionFeedback({
      sound: "open",
      vibratePattern: [35],
    });
  };

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, maxWidth: 420, width: "100%", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>
            {mode === "login" ? t("authUi.login") : t("authUi.create")}
          </h2>

          <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <label style={{ display: "grid", gap: 4, fontSize: 12, color: "#374151" }}>
              {t("interfaceLanguage.shortLabel")}
              <select
                value={resolvedInterfaceLanguage}
                onChange={handleInterfaceLanguageChange}
                aria-label={t("interfaceLanguage.ariaLabel")}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12 }}
              >
                {interfaceLanguageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {onBack && (
              <AppBackButton label={t("signupPage.backToOverview")} fallbackPath="/" onBack={onBack} />
            )}
          </div>
        </div>

        <p style={styles.helperText}>
          {t("authUi.helper")}
        </p>

        {mode === "login" && (
          <div style={{ ...styles.uploadCard, background: "#f8fafc", marginBottom: 12 }}>
            <strong style={{ display: "block", marginBottom: 4 }}>{t("authUi.welcome")}</strong>
            <p style={{ ...styles.helperText, marginBottom: 0 }}>
              {t("authUi.welcomeDesc")}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          {mode === "signup" && (
            <>
              <label style={styles.label}>{t("signupPage.fields.name")}</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              <p style={{ ...styles.helperText, marginTop: -4 }}>
                {t("authUi.nameHint")}
              </p>

              <label style={styles.label}>{t("authUi.phone")}</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

              <label style={styles.label}>{t("authUi.location")}</label>
              <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

              <label style={styles.label}>{t("authUi.address")}</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={inputStyle}
                placeholder={t("authUi.addressHint")}
              />

              <label style={styles.label}>{t("authUi.learningMode")}</label>
              <select
                required
                value={learningMode}
                onChange={(e) => setLearningMode(e.target.value)}
                style={{ ...styles.select, height: 44 }}
              >
                <option value="Online">{t("signupPage.options.online")}</option>
                <option value="In-person">{t("signupPage.options.inPerson")}</option>
                <option value="Hybrid">{t("signupPage.options.hybrid")}</option>
              </select>
            </>
          )}

          <label style={styles.label}>{mode === "login" ? t("authUi.emailOrCode") : t("signupPage.fields.email")}</label>
          <input
            type={mode === "login" ? "text" : "email"}
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError("");
              setRecoveryAction(null);
            }}
            style={inputStyle}
            placeholder={mode === "login" ? t("authUi.emailOrCodeHint") : undefined}
          />

          <label style={styles.label}>{t("signupPage.fields.password")}</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, width: "100%", paddingRight: 72 }}
              placeholder={mode === "signup" ? t("authUi.passwordHint") : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-pressed={showPassword}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", color: "#1d4ed8", fontWeight: 700, cursor: "pointer", padding: "6px 8px" }}
            >
              {showPassword ? t("authUi.hide") : t("authUi.show")}
            </button>
          </div>

          {mode === "signup" && <PasswordGuidance password={password} />}

          {mode === "login" && (
            <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280", textAlign: "right" }}>
                {t("authUi.forgotHint")}
              </p>
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={resetting || loading}
                style={{ ...styles.secondaryButton, padding: "6px 10px", fontSize: 13, marginTop: 2 }}
              >
                {resetting ? t("authUi.sendingReset") : t("authUi.forgot")}
              </button>
            </div>
          )}

          {mode === "signup" && (
            <>
              <label style={styles.label}>{t("signupPage.fields.currentLevel")}</label>
              <select
                required
                value={selectedLevel}
                onChange={(event) => setSelectedLevel(event.target.value)}
                style={{ ...styles.select, height: 44 }}
              >
                {ALLOWED_LEVELS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label style={styles.label}>{t("authUi.emergency")}</label>
              <input
                type="tel"
                required
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                style={inputStyle}
              />

              <label style={styles.label}>{t("authUi.className")}</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                style={inputStyle}
                placeholder="A1 Morning"
              />
            </>
          )}

          <button style={styles.primaryButton} type="submit" disabled={loading || googleLoading}>
            {loading ? t("authUi.pleaseWait") : mode === "login" ? t("authUi.login") : t("uiLanguageFlow.createTrial")}
          </button>
        </form>

        {mode === "login" && (
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <div style={{ display: "grid", placeItems: "center", color: "#6b7280", fontSize: 12 }}>
              {t("authUi.or")}
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              style={{
                ...styles.secondaryButton,
                width: "100%",
                justifyContent: "center",
                padding: "10px 12px",
                fontWeight: 600,
              }}
            >
              {googleLoading ? t("authUi.connectingGoogle") : t("authUi.signInGoogle")}
            </button>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280", textAlign: "center" }}>
              {t("authUi.googleLimit")}
            </p>
          </div>
        )}

        {authError && <div style={{ ...styles.errorBox, whiteSpace: "pre-line" }}>{authError}</div>}

        {mode === "login" && recoveryAction ? (
          <section
            aria-label={t("authUi.recovery")}
            style={{
              ...styles.card,
              marginTop: 10,
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              display: "grid",
              gap: 9,
            }}
          >
            <strong>{recoveryAction.title}</strong>
            <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.55 }}>{recoveryAction.description}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {recoveryAction.kind === "reset" ? (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={resetting || loading}
                  style={styles.secondaryButton}
                >
                  {resetting ? t("authUi.sendingReset") : t("authUi.reset")}
                </button>
              ) : null}

              {recoveryAction.kind === "email" ? (
                <button
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                    setAuthError("");
                    setRecoveryAction(null);
                  }}
                  style={styles.secondaryButton}
                >
                  {t("authUi.useEmail")}
                </button>
              ) : null}

              {recoveryAction.kind === "payment" && recoveryAction.href ? (
                <a
                  href={recoveryAction.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...styles.primaryButton, display: "inline-flex", textDecoration: "none" }}
                >
                  {t("authUi.continuePayment")}
                </a>
              ) : null}

              {recoveryAction.kind === "signup" ? (
                <button
                  type="button"
                  onClick={onSwitchToSignup ? onSwitchToSignup : toggleMode}
                  style={styles.secondaryButton}
                >
                  {t("authUi.create")}
                </button>
              ) : null}

              {recoveryAction.kind === "support" ? (
                <a
                  href="mailto:info@falowen.app?subject=Falowen%20login%20support"
                  style={{ ...styles.secondaryButton, display: "inline-flex", textDecoration: "none" }}
                >
                  {t("authUi.contact")}
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        {message && (
          <div
            style={{
              ...styles.errorBox,
              background: "#ecfdf3",
              color: "#166534",
              borderColor: "#22c55e",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 13, color: "#4b5563" }}>
          {mode === "login" ? t("authUi.newHere") : t("authUi.registered")}{" "}
          <button
            type="button"
            onClick={onSwitchToSignup ? onSwitchToSignup : toggleMode}
            style={{ ...styles.secondaryButton, padding: "6px 12px" }}
          >
            {mode === "login" ? t("authUi.create") : t("signupPage.actions.goToLogin")}
          </button>
        </div>
        <LegalFooter compact />
      </div>
    </div>
  );
};

export default AuthGate;
