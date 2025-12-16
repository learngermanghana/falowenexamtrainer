import React, { useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";

const SignUpPage = ({ onLogin, onBack }) => {
  const { signup, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 46 };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setMessage("");

    if (password !== confirmPassword) {
      setAuthError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      setMessage("Account erstellt! Wir haben dich direkt eingeloggt.");
    } catch (error) {
      console.error(error);
      setAuthError(error?.message || "Registrierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, width: "100%", maxWidth: 520, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>Account erstellen</h2>
          {onBack && (
            <button style={{ ...styles.secondaryButton, padding: "6px 12px" }} onClick={onBack}>
              Zur Übersicht
            </button>
          )}
        </div>
        <p style={styles.helperText}>
          Sichere dir Zugriff auf den Daily Plan, Prüfungssimulationen und Push-Erinnerungen. Dein Fortschritt wird in der
          Cloud gespeichert.
        </p>

        <div style={{ ...styles.uploadCard, background: "#f8fafc", marginBottom: 12 }}>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            Mit deiner Registrierung verknüpfen wir dein Profil mit Firebase (gehostet auf Vercel). Du kannst den gleichen
            Login für Web und Mobile verwenden.
          </p>
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>Push-Reminder und Wochenziele aktivierbar.</li>
            <li>Speicherung deiner Level-Checks und Mock-Tests.</li>
            <li>Direkter Zugriff auf Speaking & Writing Sessions.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={styles.label}>E-Mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="du@example.com"
          />

          <label style={styles.label}>Passwort</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="Mindestens 6 Zeichen"
          />

          <label style={styles.label}>Passwort bestätigen</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            placeholder="Passwort erneut eingeben"
          />

          <button style={styles.primaryButton} type="submit" disabled={loading}>
            {loading ? "Wird erstellt ..." : "Jetzt registrieren"}
          </button>
        </form>

        {authError && <div style={styles.errorBox}>{authError}</div>}
        {message && (
          <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#166534", borderColor: "#22c55e" }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 13, color: "#4b5563" }}>
          Bereits registriert?{" "}
          <button
            type="button"
            onClick={onLogin}
            style={{ ...styles.secondaryButton, padding: "6px 12px" }}
          >
            Zum Login wechseln
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
