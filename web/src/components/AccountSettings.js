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

  const studentRecord = useMemo(
    () => ({
      studentId: "STU-48219",
      cohort: "Sommer 2024",
      track: "Intensiv Deutsch",
      level: "B1 → B2",
      agreement: "Learning Agreement · signiert",
      contractVersion: "Vertrag v1.3 (gültig)",
      signedAt: "12. März 2024",
      lastSync: "Heute, 09:14",
    }),
    []
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
          <h2 style={styles.sectionTitle}>Kontoübersicht</h2>
          <span style={styles.levelPill}>{studentRecord.track}</span>
        </div>
        <p style={styles.helperText}>
          Hier findest du deine Stammdaten, Vertragsstatus und den letzten Datenabgleich zwischen Campus und
          Prüfungscoach.
        </p>

        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <div style={styles.metaRow}>
              <span>Studenten-ID</span>
              <span style={styles.badge}>{studentRecord.cohort}</span>
            </div>
            <strong style={{ fontSize: 20 }}>{studentRecord.studentId}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>Eindeutige Kennung für Support & Rechnungen.</p>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#fef3c7", border: "1px solid #f59e0b" }}>
            <div style={styles.metaRow}>
              <span>Stufe & Kurs</span>
              <span style={styles.badge}>{studentRecord.level}</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentRecord.agreement}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Vertrag seit {studentRecord.signedAt}. Änderungen an Vereinbarungen werden hier gespiegelt.
            </p>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#ecfdf3", border: "1px solid #34d399" }}>
            <div style={styles.metaRow}>
              <span>Datenabgleich</span>
              <span style={styles.badge}>aktuell</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentRecord.lastSync}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Wir synchronisieren Profil, Verträge und Zahlungsstatus mit dem Campus-Backend.
            </p>
          </div>
        </div>
      </section>

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

      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Vertrag &amp; Zustimmung</h2>
          <span style={styles.badge}>{studentRecord.contractVersion}</span>
        </div>
        <p style={styles.helperText}>
          Prüfe, was du unterschrieben hast. Hier liegen die wichtigsten Vereinbarungen, Datenschutz-Hinweise und
          Einverständnisse.
        </p>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div style={{ ...styles.card, margin: 0, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
            <div style={styles.metaRow}>
              <span>Status</span>
              <span style={styles.levelPill}>gültig</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentRecord.agreement}</strong>
            <ul style={{ ...styles.checklist, marginTop: 10 }}>
              <li>Signiert am {studentRecord.signedAt}</li>
              <li>Datenschutzerklärung bestätigt</li>
              <li>Widerruf jederzeit per Support möglich</li>
            </ul>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button style={styles.secondaryButton} type="button">
                Vertrag anzeigen
              </button>
              <button style={styles.secondaryButton} type="button">
                PDF herunterladen
              </button>
            </div>
          </div>

          <div style={{ ...styles.card, margin: 0 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>Einverständnisse</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={styles.metaRow}>
                <span>Benachrichtigungen</span>
                <strong>{profile.reminder === "none" ? "deaktiviert" : "aktiv"}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Datenweitergabe an Coach</span>
                <strong>erlaubt</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Eltern/Träger informiert</span>
                <strong>per E-Mail bestätigt</strong>
              </div>
            </div>
            <p style={{ ...styles.helperText, margin: "10px 0 0" }}>
              Wenn sich etwas ändert, informiere uns bitte rechtzeitig – wir aktualisieren Vertrag, Rechnungen und
              Erinnerungen automatisch.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Zahlungsdetails &amp; Belege</h2>
          <span style={styles.levelPill}>sicher gespeichert</span>
        </div>
        <p style={styles.helperText}>
          Überblick über dein Zahlungsmittel, die nächste Abbuchung und wo du Rechnungen findest.
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={styles.metaRow}>
            <span>Nächste Zahlung</span>
            <strong>{subscription.renewalDate}</strong>
          </div>
          <div style={styles.metaRow}>
            <span>Zahlungsmittel</span>
            <strong>{subscription.paymentMethod}</strong>
          </div>
          <div style={styles.metaRow}>
            <span>Rechnungs-E-Mail</span>
            <strong>{subscription.invoiceEmail || "(bitte ergänzen)"}</strong>
          </div>
          <div style={styles.metaRow}>
            <span>Letzte Rechnung</span>
            <strong>#INV-2093 · 02. Juni 2024</strong>
          </div>
          <div style={styles.metaRow}>
            <span>SEPA / Kreditkartenmandat</span>
            <strong>gültig – keine Aktion nötig</strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button style={styles.secondaryButton} type="button">
            Rechnung per E-Mail schicken
          </button>
          <button style={styles.secondaryButton} type="button">
            Zahlungsdaten aktualisieren
          </button>
        </div>
      </section>
    </div>
  );
};

export default AccountSettings;
