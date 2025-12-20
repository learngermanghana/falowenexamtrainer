import React, { useEffect, useMemo, useState } from "react";
import { ExamProvider } from "./context/ExamContext";
import CourseTab from "./components/CourseTab";
import AuthGate from "./components/AuthGate";
import SignUpPage from "./components/SignUpPage";
import HealthIndicator from "./components/HealthIndicator";
import AssignmentSubmissionPage from "./components/AssignmentSubmissionPage";
import AccountSettings from "./components/AccountSettings";
import ClassDiscussionPage from "./components/ClassDiscussionPage";
import GrammarQuestionTab from "./components/GrammarQuestionTab";
import ChatBuddyPage from "./components/ChatBuddyPage";
import LetterPracticePage from "./components/LetterPracticePage";
import { useAuth } from "./context/AuthContext";
import { isFirebaseConfigured } from "./firebase";
import { styles } from "./styles";
import "./App.css";
import StudentResultsPage from "./components/StudentResultsPage";

const TAB_STRUCTURE = [
  {
    key: "myCourse",
    label: "My Course",
    sections: [
      { key: "course", label: "Course Book" },
      { key: "submit", label: "Submit Assignment" },
    ],
  },
  {
    key: "falowenAI",
    label: "Falowen A.I",
    sections: [
      { key: "grammar", label: "Ask Grammar Question" },
      { key: "writing", label: "Writing Practice" },
      { key: "buddy", label: "Chat Buddy" },
    ],
  },
  { key: "results", label: "Results", section: "results" },
  { key: "discussion", label: "Group Discussion", section: "discussion" },
  { key: "account", label: "Account", section: "account" },
];

const getMainTabForSection = (section) =>
  TAB_STRUCTURE.find((tab) => tab.section === section || tab.sections?.some((entry) => entry.key === section));

const isTabAvailable = (tab, allowedSections) => {
  if (tab.section) {
    return Boolean(allowedSections[tab.section]);
  }

  return tab.sections.some((entry) => allowedSections[entry.key]);
};

function App() {
  const { user, loading: authLoading, logout, authError, studentProfile } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  const [activeSection, setActiveSection] = useState("submit");
  const [activeMainTab, setActiveMainTab] = useState(null);

  const role = useMemo(() => (studentProfile?.role || "student").toLowerCase(), [studentProfile?.role]);
  const isStaff = role === "admin" || role === "tutor" || studentProfile?.isTutor === true;
  const isEnrolled = isStaff || Boolean(studentProfile?.className || studentProfile?.level);

  const allowedSections = useMemo(
    () => ({
      submit: true,
      course: isEnrolled,
      results: isEnrolled || isStaff,
      grammar: true,
      writing: true,
      buddy: true,
      discussion: isEnrolled || isStaff,
      account: true,
    }),
    [isEnrolled, isStaff]
  );

  const tabStorageKey = user?.uid ? `falowen:last-tab:${user.uid}` : null;

  const availableTabs = useMemo(
    () => TAB_STRUCTURE.filter((tab) => isTabAvailable(tab, allowedSections)),
    [allowedSections]
  );

  const activeMainTabConfig = useMemo(() => TAB_STRUCTURE.find((tab) => tab.key === activeMainTab), [activeMainTab]);

  useEffect(() => {
    if (!tabStorageKey) return;
    const saved = localStorage.getItem(tabStorageKey);
    if (saved && allowedSections[saved]) {
      setActiveSection(saved);
    }
  }, [tabStorageKey, allowedSections]);

  useEffect(() => {
    if (!tabStorageKey) return;
    localStorage.setItem(tabStorageKey, activeSection);
  }, [activeSection, tabStorageKey]);

  useEffect(() => {
    if (allowedSections[activeSection]) return;
    const fallback = Object.keys(allowedSections).find((key) => allowedSections[key]) || "account";
    setActiveSection(fallback);
  }, [activeSection, allowedSections]);

  useEffect(() => {
    const mainTabFromSection = getMainTabForSection(activeSection);
    const fallbackMainTab = availableTabs[0];

    if (mainTabFromSection && isTabAvailable(mainTabFromSection, allowedSections)) {
      setActiveMainTab(mainTabFromSection.key);
    } else if (fallbackMainTab) {
      setActiveMainTab(fallbackMainTab.key);
    }
  }, [activeSection, allowedSections, availableTabs]);

  useEffect(() => {
    if (!activeMainTabConfig) return;

    if (activeMainTabConfig.section && activeMainTabConfig.section !== activeSection) {
      setActiveSection(activeMainTabConfig.section);
      return;
    }

    if (!activeMainTabConfig.sections) return;

    const hasAllowedActiveSection = activeMainTabConfig.sections.some(
      (section) => section.key === activeSection && allowedSections[section.key]
    );

    if (!hasAllowedActiveSection) {
      const firstAllowed = activeMainTabConfig.sections.find((section) => allowedSections[section.key]);
      if (firstAllowed) {
        setActiveSection(firstAllowed.key);
      }
    }
  }, [activeMainTabConfig, activeSection, allowedSections]);

  const handleMainTabClick = (tab) => {
    setActiveMainTab(tab.key);

    if (tab.section) {
      setActiveSection(tab.section);
      return;
    }

    const firstAllowed = tab.sections.find((section) => allowedSections[section.key]);
    if (firstAllowed) {
      setActiveSection(firstAllowed.key);
    }
  };

  const handleSubTabClick = (sectionKey, parentKey) => {
    setActiveMainTab(parentKey);
    setActiveSection(sectionKey);
  };

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
          <div style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 8 }}>
            {availableTabs.map((tab) => (
              <button
                key={tab.key}
                style={activeMainTab === tab.key ? styles.navButtonActive : styles.navButton}
                onClick={() => handleMainTabClick(tab)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeMainTabConfig?.sections ? (
            <div style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 12, marginTop: -4 }}>
              {activeMainTabConfig.sections
                .filter((section) => allowedSections[section.key])
                .map((section) => (
                  <button
                    key={section.key}
                    style={activeSection === section.key ? styles.navButtonActive : styles.navButton}
                    onClick={() => handleSubTabClick(section.key, activeMainTabConfig.key)}
                  >
                    {section.label}
                  </button>
                ))}
            </div>
          ) : null}

          {activeSection === "course" && allowedSections.course ? <CourseTab /> : null}
          {activeSection === "grammar" && allowedSections.grammar ? <GrammarQuestionTab /> : null}
          {activeSection === "writing" && allowedSections.writing ? <LetterPracticePage /> : null}
          {activeSection === "buddy" && allowedSections.buddy ? <ChatBuddyPage /> : null}
          {activeSection === "submit" && allowedSections.submit ? <AssignmentSubmissionPage /> : null}
          {activeSection === "results" && allowedSections.results ? <StudentResultsPage /> : null}
          {activeSection === "discussion" && allowedSections.discussion ? <ClassDiscussionPage /> : null}
          {activeSection === "account" && allowedSections.account ? <AccountSettings /> : null}
        </main>
      </div>
    </ExamProvider>
  );
}

export default App;
