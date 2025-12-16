import React, { useState } from "react";
import { ExamProvider } from "./context/ExamContext";
import CoachPanel from "./components/CoachPanel";
import AuthGate from "./components/AuthGate";
import { useAuth } from "./context/AuthContext";
import { styles } from "./styles";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";
import LevelOnboarding from "./components/LevelOnboarding";

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
        <AppHeader
          userEmail={user.email}
          notificationStatus={notificationStatus}
          notificationMessage={notificationMessage}
          notificationError={notificationError}
          onEnableNotifications={handleEnableNotifications}
          onLogout={logout}
        />

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

        <LevelOnboarding />

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <main style={{ minWidth: 0 }}>
            <PageRouter activePage={activePage} onSelectPage={setActivePage} />
          </main>
          <CoachPanel />
        </div>
      </div>
    </ExamProvider>
  );
}

export default App;
