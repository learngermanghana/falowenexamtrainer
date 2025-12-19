import React, { useRef, useState } from "react";
import { ExamProvider } from "./context/ExamContext";
import SpeakingPage from "./components/SpeakingPage";
import WritingPage from "./components/WritingPage";
import VocabPage from "./components/VocabPage";
import HomeActions from "./components/HomeActions";
import PlacementCheck from "./components/PlacementCheck";
import PlanPage from "./components/PlanPage";
import PracticeLab from "./components/PracticeLab";
import ProgressPage from "./components/ProgressPage";
import ResourcePage from "./components/ResourcePage";
import CourseTab from "./components/CourseTab";
import ExamRoom from "./components/ExamRoom";
import AuthGate from "./components/AuthGate";
import HealthIndicator from "./components/HealthIndicator";
import { useAuth } from "./context/AuthContext";
import { isFirebaseConfigured } from "./firebase";
import { styles } from "./styles";
import AccountSettings from "./components/AccountSettings";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";
import LevelOnboarding from "./components/LevelOnboarding";
import ClassDiscussionPage from "./components/ClassDiscussionPage";
import "./App.css";

function App() {
  const {
    user,
    loading: authLoading,
    logout,
    enableNotifications,
    notificationStatus,
    messagingToken,
    authError,
  } = useAuth();
  const [activePage, setActivePage] = useState("plan");
  const [authView, setAuthView] = useState("landing");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationError, setNotificationError] = useState("");
  const classCalendarRef = useRef(null);

  const notificationLabel = () => {
    switch (notificationStatus) {
      case "granted":
        return "Push ready";
      case "pending":
        return "Enabling ...";
      case "stale":
        return "Refresh push token";
      case "blocked":
        return "Push blocked";
      case "error":
        return "Retry push setup";
      default:
        return "Allow push notifications";
    }
  };

  const notificationHelper = () => {
    if (notificationStatus === "blocked") {
      return "Browser blocked push notifications. Update site permissions and try again.";
    }
    if (notificationStatus === "stale") {
      return "We found an old push token on your profile. Refresh to keep notifications working.";
    }
    if (notificationStatus === "error") {
      return notificationError || "Could not enable push notifications.";
    }
    if (notificationMessage) return notificationMessage;
    if (notificationError) return notificationError;
    if (messagingToken) {
      return `Push token synced (${messagingToken.slice(0, 8)}…)`;
    }
    return "";
  };

  const isFocusedView = activePage === "course" || activePage === "exam";
  const generalNavItems = [
    { key: "plan", label: "Home · Plan (Start / dashboard)" },
    { key: "course", label: "Kursbuch (course book)" },
    { key: "exam", label: "Prüfungen (exam room)" },
    { key: "account", label: "Konto (account)" },
    { key: "discussion", label: "Klassenforum (class forum)" },
  ];
  const focusNavItems = [
    { key: "course", label: "Campus Course · Kursbuch" },
    { key: "exam", label: "Exam Room · Prüfungsraum" },
    { key: "plan", label: "Back to dashboard · Zurück" },
  ];

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

  const handleConfirmClass = () => {
    setActivePage("plan");
    window.requestAnimationFrame(() => {
      if (classCalendarRef.current) {
        classCalendarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        classCalendarRef.current.focus?.();
      }
    });
  };

  if (!isFirebaseConfigured) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 12 }}>
        <div style={styles.card}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Falowen Exam Coach</h1>
          <p style={styles.subtitle}>
            The app could not connect to Firebase. Please add your REACT_APP_FIREBASE_* credentials to a .env file
            and restart the app.
          </p>
          <div style={{ ...styles.errorBox, marginTop: 12 }}>
            {authError || "Firebase configuration missing: API key, auth domain, project ID, storage bucket, messaging sender ID, and app ID are required."}
          </div>
        </div>
        <div style={{ ...styles.card, background: "#f9fafb" }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Quick setup checklist</h2>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#1f2937" }}>
            <li>Create a .env file in the web/ directory.</li>
            <li>Add REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, REACT_APP_FIREBASE_PROJECT_ID, REACT_APP_FIREBASE_STORAGE_BUCKET, REACT_APP_FIREBASE_MESSAGING_SENDER_ID, REACT_APP_FIREBASE_APP_ID, and REACT_APP_FIREBASE_VAPID_KEY.</li>
            <li>Restart the development server after saving the file.</li>
          </ul>
        </div>
      </div>
    );
  }

    const renderMain = () => {
      if (activePage === "plan") return <PlanPage onSelect={setActivePage} classCalendarRef={classCalendarRef} />;
    if (activePage === "course") return <CourseTab />;
    if (activePage === "home") return <HomeActions onSelect={setActivePage} />;
    if (activePage === "speaking") return <SpeakingPage />;
    if (activePage === "writing") return <WritingPage />;
    if (activePage === "vocab") return <VocabPage />;
    if (activePage === "ueben") return <PracticeLab />;
    if (activePage === "progress") return <ProgressPage />;
    if (activePage === "resources") return <ResourcePage />;
    if (activePage === "account") return <AccountSettings />;
    if (activePage === "discussion") return <ClassDiscussionPage />;
    if (activePage === "level-check") return <PlacementCheck />;
    if (activePage === "daily") return <SpeakingPage mode="daily" />;
    if (activePage === "exam") return <ExamRoom />;
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
      <div className="app-shell" style={styles.container}>
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
            <p style={styles.subtitle}>Wähle aus, ob du heute ins Kursbuch oder direkt in die Prüfung gehst.</p>
          </div>
          <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <HealthIndicator />
            <div style={{ fontSize: 13, color: "#374151" }}>Signed in as {user.email}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                style={styles.secondaryButton}
                onClick={handleEnableNotifications}
                disabled={
                  notificationStatus === "pending" || notificationStatus === "granted" || notificationStatus === "blocked"
                }
              >
                {notificationLabel()}
              </button>
              <button style={styles.dangerButton} onClick={logout}>
                Logout
              </button>
            </div>
            {notificationHelper() && (
              <div
                style={
                  notificationStatus === "error"
                    ? { ...styles.errorBox, marginTop: 4 }
                    : { ...styles.helperText, margin: 0 }
                }
              >
                {notificationHelper()}
              </div>
            )}
          </div>
        </header>

        <nav style={{ ...styles.nav, marginBottom: 8 }}>
          {(isFocusedView ? focusNavItems : generalNavItems).map((item) => (
            <button
              key={item.key}
              style={activePage === item.key ? styles.navButtonActive : styles.navButton}
              onClick={() => setActivePage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {isFocusedView ? (
          <div style={styles.focusNotice}>
            General tabs are hidden while you work in the campus course or exam rooms. Use this strip to move between
            Course and Exam or jump back to the dashboard.
          </div>
        ) : null}

        <div>
          <LevelOnboarding />
        </div>

        <main className="layout-main" style={{ minWidth: 0 }}>
          {activePage === "plan" ? (
            <PlanPage onSelect={setActivePage} classCalendarRef={classCalendarRef} />
          ) : (
            renderMain()
          )}
        </main>
      </div>
    </ExamProvider>
  );
}

export default App;
