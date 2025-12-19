import React, { useState } from "react";
import { ExamProvider } from "./context/ExamContext";
import CourseTab from "./components/CourseTab";
import AuthGate from "./components/AuthGate";
import SignUpPage from "./components/SignUpPage";
import HealthIndicator from "./components/HealthIndicator";
import AssignmentSubmissionPage from "./components/AssignmentSubmissionPage";
import AccountSettings from "./components/AccountSettings";
import { useAuth } from "./context/AuthContext";
import { isFirebaseConfigured } from "./firebase";
import { styles } from "./styles";
import "./App.css";

function App() {
  const { user, loading: authLoading, logout, authError } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  const [activeSection, setActiveSection] = useState("submit");

  if (!isFirebaseConfigured) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 12 }}>
        <div style={styles.card}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Falowen Exam Coach</h1>
          <p style={styles.subtitle}>
            The app could not connect to Firebase. Please add your REACT_APP_FIREBASE_* credentials to a .env file and restart
            the app.
          </p>
          <div style={{ ...styles.errorBox, marginTop: 12 }}>
            {authError ||
              "Firebase configuration missing: API key, auth domain, project ID, storage bucket, messaging sender ID, and app ID are required."}
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
        <div style={styles.card}>Loading authentication ...</div>
      </div>
    );
  }

  if (!user) {
    if (authMode === "signup") {
      return <SignUpPage onLogin={() => setAuthMode("login")} onBack={() => setAuthMode("login")} />;
    }

    return (
      <AuthGate
        initialMode="login"
        onBack={() => setAuthMode("login")}
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    );
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
            <p style={styles.subtitle}>Kursbuch (course book)</p>
          </div>
          <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <HealthIndicator />
            <div style={{ fontSize: 13, color: "#374151" }}>Signed in as {user.email}</div>
            <button style={styles.dangerButton} onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <main className="layout-main" style={{ minWidth: 0 }}>
          <div style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 12 }}>
            <button
              style={activeSection === "submit" ? styles.navButtonActive : styles.navButton}
              onClick={() => setActiveSection("submit")}
            >
              Submit Assignment
            </button>
            <button
              style={activeSection === "course" ? styles.navButtonActive : styles.navButton}
              onClick={() => setActiveSection("course")}
            >
              Course Book
            </button>
            <button
              style={activeSection === "account" ? styles.navButtonActive : styles.navButton}
              onClick={() => setActiveSection("account")}
            >
              Account
            </button>
          </div>

          {activeSection === "course" ? <CourseTab /> : null}
          {activeSection === "submit" ? <AssignmentSubmissionPage /> : null}
          {activeSection === "account" ? <AccountSettings /> : null}
        </main>
      </div>
    </ExamProvider>
  );
}

export default App;
