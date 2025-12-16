import React, { useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";

const AuthGate = ({ onBack, onSwitchToSignup, initialMode = "login" }) => {
  const { signup, login, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        await signup(email, password);
        setMessage("Account created! You are now signed in.");
      } else {
        await login(email, password);
        setMessage("Welcome back!");
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

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
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
