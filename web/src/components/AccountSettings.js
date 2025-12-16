import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const SUBSCRIPTION_FEATURES = [
  "Unbegrenzte Prüfungs-Simulationen für Sprechen & Schreiben",
  "Feedback-Exports für Lehrkräfte",
  "From-my-mistakes Vokabel-Decks",
  "Push-Reminder für tägliche Drills",
];

const AccountSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    goal: "B2 bestehen",
    timezone: "Europe/Berlin",
    reminder: "push+email",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      name: user?.displayName || "", // falls später aus Firebase geladen
      email: user?.email || prev.email,
    }));
  }, [user]);

  const subscription = useMemo(
    () => ({
      plan: "Coach Plus (Monat)",
      renewalDate: "02. Juli 2025",
      status: "Aktiv",
      seats: 1,
      paymentMethod: "Visa •••• 4242",
      invoiceEmail: profile.email || user?.email || "",
    }),
    [profile.email, user?.email]
  );

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    setStatus("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("Änderungen gespeichert (lokal)");
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Kontoeinstellungen</h2>
          <span style={styles.badge}>Profil &amp; Kommunikation</span>
        </div>
        <p style={styles.helperText}>
          Aktualisiere deinen Anzeigenamen und deine Kontaktpräferenzen. Änderungen werden aktuell nur lokal
          gespeichert.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="name">
                Anzeigename
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={handleChange("name")}
                style={{ ...styles.select, padding: "10px 12px" }}
                placeholder="z. B. Alex Müller"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="email">
                Login-E-Mail
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={handleChange("email")}
                style={{ ...styles.select, padding: "10px 12px" }}
                placeholder="name@email.de"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="goal">
                Lernziel
              </label>
              <input
                id="goal"
                type="text"
                value={profile.goal}
                onChange={handleChange("goal")}
                style={{ ...styles.select, padding: "10px 12px" }}
                placeholder="z. B. B1 bestehen"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="timezone">
                Zeitzone für Erinnerungen
              </label>
              <select
                id="timezone"
                value={profile.timezone}
                onChange={handleChange("timezone")}
                style={styles.select}
              >
                <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                <option value="Europe/Vienna">Europe/Vienna</option>
                <option value="Europe/Zurich">Europe/Zurich</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="reminder">
              Benachrichtigungen
            </label>
            <select
              id="reminder"
              value={profile.reminder}
              onChange={handleChange("reminder")}
              style={styles.select}
            >
              <option value="push+email">Push &amp; E-Mail</option>
              <option value="push">Nur Push</option>
              <option value="email">Nur E-Mail</option>
              <option value="none">Keine Erinnerungen</option>
            </select>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Push wird über die Schaltfläche oben rechts aktiviert. E-Mail-Erinnerungen folgen automatisch.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="submit" style={styles.primaryButton}>
              Änderungen speichern
            </button>
          </div>

          {status && <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#065f46", borderColor: "#34d399" }}>{status}</div>}
        </form>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Abo &amp; Rechnungen</h2>
          <span style={styles.levelPill}>{subscription.status}</span>
        </div>
        <p style={styles.helperText}>
          Deine aktuelle Stufe bleibt bis zur nächsten Verlängerung aktiv. Rechnungs-E-Mails gehen an
          {" "}
          <strong>{subscription.invoiceEmail || "deine Adresse"}</strong>.
        </p>

        <div style={styles.gridTwo}>
          <div style={{ ...styles.card, margin: 0 }}>
            <div style={styles.metaRow}>
              <h3 style={{ margin: 0 }}>{subscription.plan}</h3>
              <span style={styles.badge}>Seat: {subscription.seats}</span>
            </div>
            <ul style={styles.checklist}>
              {SUBSCRIPTION_FEATURES.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button style={styles.secondaryButton} type="button">
                Tarif wechseln
              </button>
              <button style={styles.secondaryButton} type="button">
                Rechnungshistorie
              </button>
            </div>
          </div>

          <div style={{ ...styles.card, margin: 0 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>Zahlung &amp; Termine</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={styles.metaRow}>
                <span>Nächste Verlängerung</span>
                <strong>{subscription.renewalDate}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Zahlungsmittel</span>
                <strong>{subscription.paymentMethod}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Konto-E-Mail</span>
                <strong>{subscription.invoiceEmail || "(bitte ergänzen)"}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Kündigungsfrist</span>
                <strong>jederzeit bis 24h vor Verlängerung</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountSettings;
