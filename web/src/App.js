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
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";

function App() {
  const { user, loading: authLoading, logout, enableNotifications, notificationStatus } =
    useAuth();
  const [activePage, setActivePage] = useState("plan");
  const [authView, setAuthView] = useState("landing");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationError, setNotificationError] = useState("");

  const handleEnableNotifications = async () => {
    setNotificationMessage("");
    setNotificationError("");

    try {
      await enableNotifications();
      setNotificationMessage("Push notifications are active.");
    } catch (error) {
      setNotificationError(
        error?.message || "Could not enable push notifications."
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
        <div style={styles.card}>Loading authentication ...</div>
      </div>
    );
  }

  if (!user) {
    if (authView === "signup") {
      return <SignUpPage onLogin={() => setAuthView("login")} onBack={() => setAuthView("landing")} />;
    }

    if (authView === "login") {
      return (
        <AuthGate
          initialMode="login"
          onBack={() => setAuthView("landing")}
          onSwitchToSignup={() => setAuthView("signup")}
        />
      );
    }

    return <LandingPage onSignUp={() => setAuthView("signup")} onLogin={() => setAuthView("login")} />;
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
              Choose your next step: Level Check, Daily Trainer, or a full simulation.
            </p>
          </div>
          <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <div style={{ fontSize: 13, color: "#374151" }}>Signed in as {user.email}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                style={styles.secondaryButton}
                onClick={handleEnableNotifications}
                disabled={notificationStatus === "pending" || notificationStatus === "granted"}
              >
                {notificationStatus === "granted"
                  ? "Push ready"
                  : notificationStatus === "pending"
                  ? "Enabling ..."
                  : "Allow push notifications"}
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
            { key: "speaking", label: "Speaking" },
            { key: "writing", label: "Writing" },
            { key: "vocab", label: "Vocabulary" },
            { key: "ueben", label: "Practice" },
            { key: "progress", label: "Progress" },
            { key: "resources", label: "Resources" },
            { key: "account", label: "Account" },
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
