import React, { useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { generateStudentCode } from "../services/studentCode";
import { rememberStudentCodeForEmail } from "../services/submissionService";
import { savePreferredLevel } from "../services/levelStorage";
import { useToast } from "../context/ToastContext";
import PasswordGuidance from "./PasswordGuidance";

const AuthGate = ({ onBack, onSwitchToSignup, initialMode = "login" }) => {
  const { signup, login, authError, setAuthError, resetPassword } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("B1");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");
  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 44 };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setAuthError("");

    try {
      if (mode === "signup") {
        const studentCode = generateStudentCode({ name });
        const result = await signup(email, password, {
          name,
          level: selectedLevel,
          studentCode,
          phone,
          location,
          emergencyContactPhone,
          className,
        });
        savePreferredLevel(selectedLevel);
        rememberStudentCodeForEmail(email, studentCode);
        const successMessage =
          `Account created! Your student code is ${studentCode}. Please verify your email to log in.`;
        setMessage(successMessage);
        showToast(
          `${successMessage} Check your inbox for a verification link from Falowen.`,
          "success"
        );
        if (result?.verificationRequired) {
          setMode("login");
        }
      } else {
        const credential = await login(email, password);
        const studentCode = credential?.user?.profile?.studentCode;
        const level = credential?.user?.profile?.level;
        if (studentCode) {
          rememberStudentCodeForEmail(email, studentCode);
        }
        if (level) {
          savePreferredLevel(level);
        }
        const loginMessage = credential?.migratedFromLegacy
          ? "We found your old account. Your new password is now saved."
          : "Welcome back!";
        setMessage(loginMessage);
        showToast(loginMessage, "success");
      }
    } catch (error) {
      console.error(error);
      if (
        error?.code === "auth/email-not-verified" ||
        error?.code === "auth/email-verification-required"
      ) {
        setAuthError("");
        const verificationMessage =
          error.message || "Please verify your email address.";
        setMessage(verificationMessage);
        showToast(
          `${verificationMessage} Check your inbox for the Falowen verification email.`,
          "info"
        );
        if (error?.code === "auth/email-verification-required") {
          setMode("login");
        }
      } else {
        const errorMessage = error?.message || "Login failed. Please try again.";
        setAuthError(errorMessage);
        showToast(errorMessage, "error");
        setMessage("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
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
      const errorMessage =
        error?.message || "Could not send password reset email.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setResetting(false);
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
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
              <label style={styles.label}>Phone number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
              <label style={styles.label}>Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
              />
            </>
          )}

          <label style={styles.label}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder={
              mode === "signup"
                ? "At least 8 characters with letters and numbers"
                : undefined
            }
          />

          {mode === "signup" && <PasswordGuidance password={password} />}

          {mode === "login" && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={resetting || loading}
                style={{
                  ...styles.secondaryButton,
                  padding: "6px 10px",
                  fontSize: 13,
                  marginTop: 2,
                }}
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

          <button style={styles.primaryButton} type="submit" disabled={loading}>
            {loading
              ? "Please wait ..."
              : mode === "login"
              ? "Log in"
              : "Sign up"}
          </button>
        </form>

        {authError && <div style={styles.errorBox}>{authError}</div>}
        {message && (
          <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#166534", borderColor: "#22c55e" }}>
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
