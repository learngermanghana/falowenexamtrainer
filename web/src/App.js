import React, { useState } from "react";
import { ExamProvider } from "./context/ExamContext";
import SpeakingPage from "./components/SpeakingPage";
import WritingPage from "./components/WritingPage";
import VocabPage from "./components/VocabPage";
import CoachPanel from "./components/CoachPanel";
import HomeActions from "./components/HomeActions";
import PlacementCheck from "./components/PlacementCheck";
import PlanPage from "./components/PlanPage";
import PracticeLab from "./components/PracticeLab";
import ProgressPage from "./components/ProgressPage";
import ResourcePage from "./components/ResourcePage";
import AuthGate from "./components/AuthGate";
import { useAuth } from "./context/AuthContext";
import { styles } from "./styles";
import AccountSettings from "./components/AccountSettings";

function App() {
  const { user, loading: authLoading, logout, enableNotifications, notificationStatus } =
    useAuth();
  const [activePage, setActivePage] = useState("plan");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationError, setNotificationError] = useState("");

  const handleEnableNotifications = async () => {
    setNotificationMessage("");
    setNotificationError("");

    try {
      await enableNotifications();
      setNotificationMessage("Push-Benachrichtigungen wurden aktiviert.");
    } catch (error) {
      setNotificationError(
        error?.message || "Konnte Push-Benachrichtigungen nicht aktivieren."
      );
    }
  };

  const renderMain = () => {
    if (activePage === "plan") return <PlanPage onSelect={setActivePage} />;
    if (activePage === "home") return <HomeActions onSelect={setActivePage} />;
    if (activePage === "speaking") return <SpeakingPage />;
    if (activePage === "writing") return <WritingPage />;
    if (activePage === "vocab") return <VocabPage />;
    if (activePage === "ueben") return <PracticeLab />;
    if (activePage === "progress") return <ProgressPage />;
    if (activePage === "resources") return <ResourcePage />;
    if (activePage === "account") return <AccountSettings />;
    if (activePage === "level-check") return <PlacementCheck />;
    if (activePage === "daily") return <SpeakingPage mode="daily" />;
    if (activePage === "exam") return <SpeakingPage mode="exam" />;
    return <SpeakingPage />;
  };

  if (authLoading) {
    return (
      <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
        <div style={styles.card}>Authentifizierung wird geladen ...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthGate />;
  }

  return (
    <ExamProvider>
      <div style={styles.container}>
        <header
          style={{
            ...styles.header,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={styles.title}>Falowen Exam Coach</h1>
            <p style={styles.subtitle}>
              Wähle deinen nächsten Schritt: Level Check, Daily Trainer oder eine komplette Simulation.
            </p>
          </div>
          <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <div style={{ fontSize: 13, color: "#374151" }}>Eingeloggt als {user.email}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                style={styles.secondaryButton}
                onClick={handleEnableNotifications}
                disabled={notificationStatus === "pending" || notificationStatus === "granted"}
              >
                {notificationStatus === "granted"
                  ? "Push aktiv"
                  : notificationStatus === "pending"
                  ? "Aktiviere ..."
                  : "Push-Benachrichtigungen erlauben"}
              </button>
              <button style={styles.dangerButton} onClick={logout}>
                Logout
              </button>
            </div>
            {notificationMessage && (
              <div style={{ ...styles.helperText, margin: 0 }}>{notificationMessage}</div>
            )}
            {notificationError && (
              <div style={{ ...styles.errorBox, marginTop: 4 }}>{notificationError}</div>
            )}
          </div>
        </header>

        <nav style={{ ...styles.nav, marginBottom: 16 }}>
          {[
            { key: "plan", label: "Home · Plan" },
            { key: "speaking", label: "Sprechen" },
            { key: "writing", label: "Schreiben" },
            { key: "vocab", label: "Vokabeln" },
            { key: "ueben", label: "Üben" },
            { key: "progress", label: "Fortschritt" },
            { key: "resources", label: "Ressourcen" },
            { key: "account", label: "Konto" },
          ].map((item) => (
            <button
              key={item.key}
              style={activePage === item.key ? styles.navButtonActive : styles.navButton}
              onClick={() => setActivePage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <main style={{ minWidth: 0 }}>{renderMain()}</main>
          <CoachPanel />
        </div>
      </div>
    </ExamProvider>
  );
}

export default App;
