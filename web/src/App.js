import React, { useState } from "react";
import { ExamProvider } from "./context/ExamContext";
import CoachPanel from "./components/CoachPanel";
import AuthGate from "./components/AuthGate";
import { useAuth } from "./context/AuthContext";
import { styles } from "./styles";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";
import AppHeader from "./components/AppHeader";
import AppNavigation from "./components/AppNavigation";
import PageRouter from "./components/PageRouter";

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

        <AppNavigation activePage={activePage} onSelectPage={setActivePage} />

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
