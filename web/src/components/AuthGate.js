import React, { useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { generateStudentCode } from "../services/studentCode";
import { rememberStudentCodeForEmail } from "../services/submissionService";
import { savePreferredLevel } from "../services/levelStorage";

const AuthGate = ({ onBack, onSwitchToSignup, initialMode = "login" }) => {
  const { signup, login, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("B1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 44 };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setAuthError("");

    try {
      if (mode === "signup") {
        const studentCode = generateStudentCode({ firstName, level: selectedLevel });
        await signup(email, password, {
          firstName,
          level: selectedLevel,
          studentCode,
          location,
          phoneNumber,
          emergencyContact,
        });
        savePreferredLevel(selectedLevel);
        rememberStudentCodeForEmail(email, studentCode);
        setMessage(`Account created! Your student code is ${studentCode}.`);
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
        setMessage(
          credential?.migratedFromLegacy
            ? "We found your old account. Your new password is now saved."
            : "Welcome back!"
        );
      }
    } catch (error) {
      console.error(error);
      setAuthError(
        error?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
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
              Returning student from Firebase? Use your existing email and choose a new password. We'll import your profile automatically.
            </p>
            <p style={{ ...styles.helperText, marginBottom: 0 }}>
              New student? Switch to "Create account" and sign up normally.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          {mode === "signup" && (
            <>
              <label style={styles.label}>First name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
              />

              <label style={styles.label}>Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
                placeholder="Accra, Ghana"
              />

              <label style={styles.label}>Phone number</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={inputStyle}
                placeholder="+233 501 234 567"
              />

              <label style={styles.label}>Emergency contact (name & phone)</label>
              <input
                type="text"
                required
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                style={inputStyle}
                placeholder="Amina Doe – +233 20 000 0000"
              />

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

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
