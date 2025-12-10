import React, { useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";

const AuthGate = () => {
  const { signup, login, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState("login");
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
        setMessage("Account erstellt! Du bist jetzt eingeloggt.");
      } else {
        await login(email, password);
        setMessage("Willkommen zurück!");
      }
    } catch (error) {
      console.error(error);
      setAuthError(
        error?.message || "Login fehlgeschlagen. Bitte probiere es erneut."
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
      <div style={{ ...styles.card, maxWidth: 420, width: "100%" }}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>
          {mode === "login" ? "Login" : "Account erstellen"}
        </h2>
        <p style={styles.helperText}>
          Verbinde dich mit deinem Account, um deine Prüfungsfortschritte zu
          speichern.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={styles.label}>E-Mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={styles.label}>Passwort</label>
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
              ? "Bitte warten ..."
              : mode === "login"
              ? "Einloggen"
              : "Registrieren"}
          </button>
        </form>

        {authError && <div style={styles.errorBox}>{authError}</div>}
        {message && (
          <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#166534", borderColor: "#22c55e" }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 13, color: "#4b5563" }}>
          {mode === "login" ? "Neu hier?" : "Schon registriert?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            style={{ ...styles.secondaryButton, padding: "6px 12px" }}
          >
            {mode === "login" ? "Account anlegen" : "Zum Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
