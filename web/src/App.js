import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { ExamProvider } from "./context/ExamContext";
import CourseTab from "./components/CourseTab";
import AuthGate from "./components/AuthGate";
import SignUpPage from "./components/SignUpPage";
import LandingPage from "./components/LandingPage";
import HealthIndicator from "./components/HealthIndicator";
import AssignmentSubmissionPage from "./components/AssignmentSubmissionPage";
import AccountSettings from "./components/AccountSettings";
import ClassDiscussionPage from "./components/ClassDiscussionPage";
import GrammarQuestionTab from "./components/GrammarQuestionTab";
import SpeechTrainerPage from "./components/SpeechTrainerPage";
import LetterPracticePage from "./components/LetterPracticePage";
import WritingPage from "./components/WritingPage";
import { useAuth } from "./context/AuthContext";
import { isFirebaseConfigured } from "./firebase";
import { styles } from "./styles";
import "./App.css";
import StudentResultsPage from "./components/StudentResultsPage";
import GeneralHome from "./components/GeneralHome";
import SpeakingPage from "./components/SpeakingPage";
import ExamResources from "./components/ExamResources";
import NotificationBell from "./components/NotificationBell";
import SetupCheckpoint from "./components/SetupCheckpoint";
import PaymentComplete from "./components/PaymentComplete";

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
      { key: "speech", label: "Speech Trainer" },
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

const findFirstAllowedSection = (allowedSections) => {
  for (const tab of TAB_STRUCTURE) {
    if (tab.section && allowedSections[tab.section]) {
      return tab.section;
    }

    if (tab.sections) {
      const allowedSection = tab.sections.find((entry) => allowedSections[entry.key]);
      if (allowedSection) {
        return allowedSection.key;
      }
    }
  }

  return "account";
};

const getPreferredSection = (allowedSections, preferred) => {
  if (preferred && allowedSections[preferred]) return preferred;

  return findFirstAllowedSection(allowedSections);
};

function App() {
  const {
    user,
    loading: authLoading,
    logout,
    authError,
    studentProfile,
    enableNotifications,
    notificationStatus,
    saveStudentProfile,
  } = useAuth();
  const [authMode, setAuthMode] = useState("landing");
  const location = useLocation();

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
      speech: true,
      discussion: isEnrolled || isStaff,
      account: true,
    }),
    [isEnrolled, isStaff]
  );

  const tabStorageKey = user?.uid ? `falowen:last-tab:${user.uid}` : null;
  const savedSection = useMemo(() => (tabStorageKey ? localStorage.getItem(tabStorageKey) : null), [tabStorageKey]);

  const availableTabs = useMemo(
    () => TAB_STRUCTURE.filter((tab) => isTabAvailable(tab, allowedSections)),
    [allowedSections]
  );

  const defaultCampusSection = useMemo(
    () => getPreferredSection(allowedSections, savedSection),
    [allowedSections, savedSection]
  );

  const paymentStatus = useMemo(
    () => (studentProfile?.paymentStatus || "pending").toLowerCase(),
    [studentProfile?.paymentStatus]
  );
  const awaitingPayment =
    Boolean(studentProfile) && !isStaff && !["paid", "partial"].includes(paymentStatus);

  if (!isFirebaseConfigured) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 12 }}>
        <div style={styles.card}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Falowen Learning Hub</h1>
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

  if (location.pathname === "/payment-complete") {
    return <PaymentComplete />;
  }

  if (!user) {
    if (authMode === "signup") {
      return <SignUpPage onLogin={() => setAuthMode("login")} onBack={() => setAuthMode("landing")} />;
    }

    if (authMode === "landing") {
      return <LandingPage onSignUp={() => setAuthMode("signup")} onLogin={() => setAuthMode("login")} />;
    }

    return (
      <AuthGate
        initialMode="login"
        onBack={() => setAuthMode("landing")}
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    );
  }

  if (awaitingPayment) {
    return <SetupCheckpoint />;
  }

  return (
    <ExamProvider>
      <AppShell
        allowedSections={allowedSections}
        availableTabs={availableTabs}
        defaultCampusSection={defaultCampusSection}
        enableNotifications={enableNotifications}
        saveStudentProfile={saveStudentProfile}
        logout={logout}
        notificationStatus={notificationStatus}
        studentProfile={studentProfile}
        tabStorageKey={tabStorageKey}
        user={user}
      />
    </ExamProvider>
  );
}

export default App;

const AppShell = ({
  allowedSections,
  availableTabs,
  defaultCampusSection,
  enableNotifications,
  saveStudentProfile,
  logout,
  notificationStatus,
  studentProfile,
  tabStorageKey,
  user,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationError, setNotificationError] = useState("");

  const subtitle = useMemo(() => {
    if (location.pathname.startsWith("/campus")) {
      return "Campus: course book, submissions, community";
    }

    if (location.pathname.startsWith("/exams")) {
      return "Exams Room: speaking, Schreiben trainer, resources";
    }

    return "Choose Campus or the Exams Room";
  }, [location.pathname]);

  const goHome = () => navigate("/");

  const handleEnableNotifications = async () => {
    setNotificationError("");
    try {
      await enableNotifications();
    } catch (err) {
      console.error("Failed to enable notifications", err);
      setNotificationError("Could not enable push notifications. Please try again.");
    }
  };

  const handleAreaSelect = (area) => {
    if (area === "campus") {
      navigate(`/campus/${defaultCampusSection}`);
      return;
    }

    if (area === "exams") {
      navigate("/exams/speaking");
    }
  };

  return (
    <div className="app-shell" style={styles.container}>
      <header
        className="app-header"
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
          <h1 style={styles.title}>Falowen Learning Hub</h1>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
        <div className="app-header-meta" style={{ display: "grid", gap: 6, justifyItems: "end" }}>
          <HealthIndicator />
          <div style={{ fontSize: 13, color: "#374151" }}>Signed in as {user.email}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <NotificationBell notificationStatus={notificationStatus} />
            <button
              style={notificationStatus === "granted" ? styles.secondaryButton : styles.primaryButton}
              onClick={handleEnableNotifications}
              disabled={notificationStatus === "pending" || notificationStatus === "granted"}
            >
              {notificationStatus === "granted"
                ? "Push enabled"
                : notificationStatus === "pending"
                ? "Enabling..."
                : notificationStatus === "blocked"
                ? "Unblock notifications"
                : "Enable push alerts"}
            </button>
            <button style={styles.dangerButton} onClick={logout}>
              Logout
            </button>
          </div>
          {notificationError ? (
            <div style={{ ...styles.errorBox, marginTop: 4 }}>{notificationError}</div>
          ) : notificationStatus === "blocked" ? (
            <div style={{ fontSize: 12, color: "#b91c1c" }}>
              Notifications are blocked in your browser settings.
            </div>
          ) : notificationStatus !== "granted" ? (
            <div style={{ fontSize: 12, color: "#1f2937" }}>
              Tip: click “Enable push alerts” once per browser after signing in so new scores and attendance can reach this
              device.
            </div>
          ) : null}
        </div>
      </header>

      <main className="layout-main" style={{ minWidth: 0 }}>
        <Routes>
          <Route
            path="/"
            element={
              <GeneralHome
                onSelectArea={handleAreaSelect}
                studentProfile={studentProfile}
                notificationStatus={notificationStatus}
                onEnableNotifications={enableNotifications}
                onSaveOnboarding={() => saveStudentProfile({ onboardingCompleted: true })}
              />
            }
          />

          <Route path="/campus" element={<Navigate to={`/campus/${defaultCampusSection}`} replace />} />
          <Route
            path="/campus/:section"
            element={
              <CampusArea
                allowedSections={allowedSections}
                availableTabs={availableTabs}
                defaultSection={defaultCampusSection}
                onBack={goHome}
                studentProfile={studentProfile}
                tabStorageKey={tabStorageKey}
              />
            }
          />

          <Route path="/exams" element={<Navigate to="/exams/speaking" replace />} />
          <Route path="/exams/:section" element={<ExamArea onBack={goHome} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const CampusArea = ({
  allowedSections,
  availableTabs,
  defaultSection,
  onBack,
  studentProfile,
  tabStorageKey,
}) => {
  const campusStudentProfile = studentProfile || {};
  const { section } = useParams();
  const navigate = useNavigate();

  const resolvedSection = useMemo(() => getPreferredSection(allowedSections, section || defaultSection), [
    allowedSections,
    defaultSection,
    section,
  ]);

  const activeMainTabConfig = useMemo(() => getMainTabForSection(resolvedSection), [resolvedSection]);

  useEffect(() => {
    if (!section || section !== resolvedSection) {
      navigate(`/campus/${resolvedSection}`, { replace: true });
    }
  }, [navigate, resolvedSection, section]);

  useEffect(() => {
    if (!tabStorageKey) return;
    localStorage.setItem(tabStorageKey, resolvedSection);
  }, [resolvedSection, tabStorageKey]);

  const handleMainTabClick = (tab) => {
    if (tab.section) {
      navigate(`/campus/${tab.section}`);
      return;
    }

    const firstAllowed = tab.sections.find((entry) => allowedSections[entry.key]);
    if (firstAllowed) {
      navigate(`/campus/${firstAllowed.key}`);
    }
  };

  const handleSubTabClick = (sectionKey) => {
    navigate(`/campus/${sectionKey}`);
  };

  return (
    <>
      <div className="nav-row" style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 8 }}>
        <button style={styles.secondaryButton} onClick={onBack}>
          Back to general home
        </button>
        {availableTabs.map((tab) => {
          const activeMainTab = activeMainTabConfig?.key;
          return (
            <button
              key={tab.key}
              style={activeMainTab === tab.key ? styles.navButtonActive : styles.navButton}
              onClick={() => handleMainTabClick(tab)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeMainTabConfig?.sections ? (
        <div
          className="nav-row"
          style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 12, marginTop: -4 }}
        >
          {activeMainTabConfig.sections
            .filter((subTab) => allowedSections[subTab.key])
            .map((subTab) => (
              <button
                key={subTab.key}
                style={resolvedSection === subTab.key ? styles.navButtonActive : styles.navButton}
                onClick={() => handleSubTabClick(subTab.key)}
              >
                {subTab.label}
              </button>
            ))}
        </div>
      ) : null}

      {resolvedSection === "course" && allowedSections.course ? (
        <CourseTab
          defaultLevel={campusStudentProfile?.level}
          defaultClassName={campusStudentProfile?.className}
        />
      ) : null}
      {resolvedSection === "grammar" && allowedSections.grammar ? <GrammarQuestionTab /> : null}
      {resolvedSection === "writing" && allowedSections.writing ? <LetterPracticePage mode="campus" /> : null}
      {resolvedSection === "speech" && allowedSections.speech ? <SpeechTrainerPage /> : null}
      {resolvedSection === "submit" && allowedSections.submit ? <AssignmentSubmissionPage /> : null}
      {resolvedSection === "results" && allowedSections.results ? <StudentResultsPage /> : null}
      {resolvedSection === "discussion" && allowedSections.discussion ? <ClassDiscussionPage /> : null}
      {resolvedSection === "account" && allowedSections.account ? <AccountSettings /> : null}
    </>
  );
};

const ExamArea = ({ onBack }) => {
  const { section } = useParams();
  const navigate = useNavigate();

  const examSection = useMemo(() => {
    if (["speaking", "writing", "resources"].includes(section)) {
      return section;
    }
    return "speaking";
  }, [section]);

  useEffect(() => {
    if (section !== examSection) {
      navigate(`/exams/${examSection}`, { replace: true });
    }
  }, [examSection, navigate, section]);

  const tabs = [
    { key: "speaking", label: "Speaking" },
    { key: "writing", label: "Schreiben trainer" },
    { key: "resources", label: "Resources" },
  ];

  return (
    <>
      <div className="nav-row" style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 12 }}>
        <button style={styles.secondaryButton} onClick={onBack}>
          Back to general home
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={examSection === tab.key ? styles.navButtonActive : styles.navButton}
            onClick={() => navigate(`/exams/${tab.key}`)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {examSection === "speaking" ? <SpeakingPage /> : null}
      {examSection === "writing" ? <WritingPage mode="exam" /> : null}
      {examSection === "resources" ? <ExamResources /> : null}
    </>
  );
};
