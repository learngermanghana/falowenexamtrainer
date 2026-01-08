// AuthGate.js
import React, { useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { generateStudentCode } from "../services/studentCode";
import { rememberStudentCodeForEmail } from "../services/submissionService";
import { savePreferredLevel } from "../services/levelStorage";
import { useToast } from "../context/ToastContext";
import PasswordGuidance from "./PasswordGuidance";

const isFullName = (value) => {
  const cleaned = String(value || "").trim();
  if (!cleaned) return false;
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
};

const AuthGate = ({ onBack, onSwitchToSignup, initialMode = "login" }) => {
  const { signup, login, loginWithGoogle, authError, setAuthError, resetPassword } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState(initialMode);

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup-only fields
  const [name, setName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("B1");
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

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 44 };

  const getAuthErrorMessage = (error, intent) => {
    const code = error?.code || "";

    if (code === "auth/email-not-verified" || code === "auth/email-verification-required") {
      return "Please verify your email address before logging in.";
    }

    if (intent === "login") {
      switch (code) {
        case "auth/user-not-found":
        case "auth/invalid-credential":
          return "No account found for this email and password.";
        case "auth/wrong-password":
          return "The password you entered is incorrect.";
        case "auth/invalid-email":
          return "That email address doesn't look right. Please check and try again.";
        case "auth/too-many-requests":
          return "Too many failed attempts. Please wait a moment and try again.";
        case "auth/network-request-failed":
          return "Network error. Check your connection and try again.";
        default:
          break;
      }
    }

    if (intent === "signup") {
      switch (code) {
        case "auth/email-already-in-use":
          return "An account with this email already exists. Try logging in instead.";
        case "auth/invalid-email":
          return "That email address doesn't look right. Please check and try again.";
        default:
          break;
      }
    }

    return error?.message || "Login failed. Please try again.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setAuthError("");

    try {
      if (mode === "signup") {
        if (!isFullName(name)) {
          const errorMessage =
            "Please enter your full name (first and last). It will be used on certificates and transcripts.";
          setAuthError(errorMessage);
          showToast(errorMessage, "error");
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
      } else {
        const loginResult = await login(email, password);
        const credential = loginResult?.credential || loginResult;

        const studentCode = credential?.user?.profile?.studentCode;
        const level = credential?.user?.profile?.level;

        if (studentCode) rememberStudentCodeForEmail(email, studentCode);
        if (level) savePreferredLevel(level);

        const loginMessage = credential?.migratedFromLegacy
          ? "We found your old account. Your new password is now saved."
          : "Welcome back!";

        setMessage(loginMessage);
        showToast(loginMessage, "success");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || "Login failed. Please try again.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
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
      return;
    }
    setResetting(true);
    setMessage("");
    setAuthError("");

    try {
      await resetPassword(email);
      const resetMessage = "Password reset email sent. Please check your inbox.";
      setMessage(resetMessage);
      showToast(resetMessage, "info");
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || "Could not send password reset email.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setResetting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage("");
    setAuthError("");

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
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || "Google sign-in failed. Please try again.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setAuthError("");
    setMessage("");
  };

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, maxWidth: 420, width: "100%", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>
            {mode === "login" ? "Login" : "Create account"}
          </h2>

          {onBack && (
            <button style={{ ...styles.secondaryButton, padding: "6px 12px" }} onClick={onBack}>
              Back to overview
            </button>
          )}
        </div>

        <p style={styles.helperText}>
          Connect with your account so we can save your exam progress.
        </p>

        {mode === "login" && (
          <div style={{ ...styles.uploadCard, background: "#f8fafc", marginBottom: 12 }}>
            <p style={{ ...styles.helperText, marginBottom: 4 }}>
              Returning Falowen student? Use your existing email and choose a new password. We'll import your profile automatically.
            </p>
            <p style={{ ...styles.helperText, marginBottom: 0 }}>
              New student? Switch to "Create account" and sign up normally.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          {mode === "signup" && (
            <>
              <label style={styles.label}>Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              <p style={{ ...styles.helperText, marginTop: -4 }}>
                Use your full name (first and last). This is printed on certificates and transcripts.
              </p>

              <label style={styles.label}>Phone number</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

              <label style={styles.label}>Location</label>
              <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

              <label style={styles.label}>Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Madina, Accra (street/area)"
              />

              <label style={styles.label}>Learning mode</label>
              <select
                required
                value={learningMode}
                onChange={(e) => setLearningMode(e.target.value)}
                style={{ ...styles.select, height: 44 }}
              >
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </>
          )}

          <label style={styles.label}>{mode === "login" ? "Email or student code" : "Email"}</label>
          <input
            type={mode === "login" ? "text" : "email"}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder={mode === "login" ? "you@email.com or STU12345" : undefined}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder={mode === "signup" ? "At least 8 characters with letters and numbers" : undefined}
          />

          {mode === "signup" && <PasswordGuidance password={password} />}

          {mode === "login" && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={resetting || loading}
                style={{ ...styles.secondaryButton, padding: "6px 10px", fontSize: 13, marginTop: 2 }}
              >
                {resetting ? "Sending reset email ..." : "Forgot password?"}
              </button>
            </div>
          )}

          {mode === "signup" && (
            <>
              <label style={styles.label}>Your current level</label>
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

              <label style={styles.label}>Emergency contact (phone)</label>
              <input
                type="tel"
                required
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                style={inputStyle}
              />

              <label style={styles.label}>Class name</label>
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
            {loading ? "Please wait ..." : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        {mode === "login" && (
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <div style={{ display: "grid", placeItems: "center", color: "#6b7280", fontSize: 12 }}>
              or
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
              {googleLoading ? "Connecting to Google ..." : "Sign in with Google"}
            </button>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280", textAlign: "center" }}>
              Google sign-in is available only for students already listed in our records.
            </p>
          </div>
        )}

        {authError && <div style={styles.errorBox}>{authError}</div>}

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
          {mode === "login" ? "New here?" : "Already registered?"}{" "}
          <button
            type="button"
            onClick={onSwitchToSignup ? onSwitchToSignup : toggleMode}
            style={{ ...styles.secondaryButton, padding: "6px 12px" }}
          >
            {mode === "login" ? "Create account" : "Go to login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
