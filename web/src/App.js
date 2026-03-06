import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ALLOWED_LEVELS, ExamProvider, useExam } from "./context/ExamContext";
import CourseTab from "./components/CourseTab";
import AuthGate from "./components/AuthGate";
import SignUpPage from "./components/SignUpPage";
import LandingPage from "./components/LandingPage";
import FrenchSignUpPage from "./components/FrenchSignUpPage";
import HealthIndicator from "./components/HealthIndicator";
import AssignmentSubmissionPage from "./components/AssignmentSubmissionPage";
import AccountSettings from "./components/AccountSettings";
import ClassDiscussionPage from "./components/ClassDiscussionPage";
import GrammarQuestionTab from "./components/GrammarQuestionTab";
import SpeechTrainerPage from "./components/SpeechTrainerPage";
import LetterPracticePage from "./components/LetterPracticePage";
import DativeAdjectiveDeclensionPage from "./components/DativeAdjectiveDeclensionPage";
import SpeakingExamIntroPage from "./components/SpeakingExamIntroPage";
import CourseStructurePage from "./components/CourseStructurePage";
import CourseResourceViewerPage from "./components/CourseResourceViewerPage";
import ConjunctionNotesPage from "./components/ConjunctionNotesPage";
import FormingBasicStatementsPage from "./components/FormingBasicStatementsPage";
import GermanNumbersGrammarPage from "./components/GermanNumbersGrammarPage";
import ObjectsAndColorsPage from "./components/ObjectsAndColorsPage";
import TwelveHourClockPage from "./components/TwelveHourClockPage";
import SingularPronounsConjugationPage from "./components/SingularPronounsConjugationPage";
import GermanAlphabetGrammarNotesPage from "./components/GermanAlphabetGrammarNotesPage";
import PersonenBeschreibenGrammarPage from "./components/PersonenBeschreibenGrammarPage";
import ComparingThingsAndPeopleGrammarPage from "./components/ComparingThingsAndPeopleGrammarPage";
import WoTreffenUnsGrammarPage from "./components/WoTreffenUnsGrammarPage";
import VerbotenErlaubtPage from "./components/VerbotenErlaubtPage";
import DirectionsImperativePage from "./components/DirectionsImperativePage";
import TwoCasePrepositionsPage from "./components/TwoCasePrepositionsPage";
import DativeArticlesMitBeiZuPage from "./components/DativeArticlesMitBeiZuPage";
import LetterWritingIntroPage from "./components/LetterWritingIntroPage";
import WeatherPerfektLetterPage from "./components/WeatherPerfektLetterPage";
import HealthBodyPartsPage from "./components/HealthBodyPartsPage";
import A2StarterConjunctionsPage from "./components/A2StarterConjunctionsPage";
import A2Day2SmallTalkWorkbookEnhancedPage from "./components/A2Day2SmallTalkWorkbookEnhancedPage";
import A2Day2PersonenBeschreibenWorkbookPage from "./components/A2Day2PersonenBeschreibenWorkbookPage";
import A2Day3ComparisonsWorkbookPage from "./components/A2Day3ComparisonsWorkbookPage";
import A2Day4WoMoechtenWirUnsTreffenWorkbookPage from "./components/A2Day4WoMoechtenWirUnsTreffenWorkbookPage";
import A2Day5FreizeitWorkbookPage from "./components/A2Day5FreizeitWorkbookPage";
import A2Day5FreizeitSeparableVerbsGrammarPage from "./components/A2Day5FreizeitSeparableVerbsGrammarPage";
import A2Day6MoebelRaeumeWorkbookPage from "./components/A2Day6MoebelRaeumeWorkbookPage";
import A2Day6TwoCasePrepositionsGrammarPage from "./components/A2Day6TwoCasePrepositionsGrammarPage";
import B1Day21LebensformenHeuteWorkbookPage from "./components/B1Day21LebensformenHeuteWorkbookPage";
import B1Day25OnlineShoppingRightsRisksWorkbookPage from "./components/B1Day25OnlineShoppingRightsRisksWorkbookPage";
import A1Day14ModalVerbsWorkbookPage from "./components/A1Day14ModalVerbsWorkbookPage";
import A1Chapter3AskingAboutPricesWorkbookPage from "./components/A1Chapter3AskingAboutPricesWorkbookPage";
import A1Chapter5GermanCasesWorkbookPage from "./components/A1Chapter5GermanCasesWorkbookPage";
import A1Day1GreetingsGrammarPage from "./components/A1Day1GreetingsGrammarPage";
import WritingPage from "./components/WritingPage";
import VocabExamPage from "./components/VocabExamPage";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import { isFirebaseConfigured, listenForForegroundMessages } from "./firebase";
import { styles } from "./styles";
import "./App.css";
import StudentResultsPage from "./components/StudentResultsPage";
import GeneralHome from "./components/GeneralHome";
import SpeakingPage from "./components/SpeakingPage";
import ExamsOverviewPage from "./components/ExamsOverviewPage";
import ExamResources from "./components/ExamResources";
import HorenPage from "./components/HorenPage";
import LesenPage from "./components/LesenPage";
import StudyCalendarPage from "./components/StudyCalendarPage";
import NotificationBell from "./components/NotificationBell";
import SetupCheckpoint from "./components/SetupCheckpoint";
import PaymentComplete from "./components/PaymentComplete";
import MyExamFilePage from "./components/MyExamFilePage";
import SeoLandingPage from "./components/SeoLandingPage";
import OfflineBanner from "./components/OfflineBanner";
import StudyBuddyBar from "./components/StudyBuddyBar";
import PlacementTestPage from "./components/PlacementTestPage";
import { buildPushNotification, persistPushNotification } from "./services/notificationService";
import { toDateMs } from "./lib/dateUtils";
import { hasClearedBalance, normalizePaymentStatus } from "./lib/paymentStatus";
import { persistInterfaceLanguage } from "./i18n";

const getTabStructure = (program, t) => {
  const isFrenchProgram = program === "french";
  const aiLabel = isFrenchProgram ? t("appNav.tabs.aiFrench") : t("appNav.tabs.ai");
  const grammarLabel = isFrenchProgram ? t("appNav.sections.grammarFrench") : t("appNav.sections.grammar");
  const writingLabel = isFrenchProgram ? t("appNav.sections.writingFrench") : t("appNav.sections.writing");
  const speechLabel = isFrenchProgram ? t("appNav.sections.speechFrench") : t("appNav.sections.speech");
  const vocabLabel = isFrenchProgram ? t("appNav.sections.vocabFrench") : t("appNav.sections.vocab");

  return [
    {
      key: "myCourse",
      label: t("appNav.tabs.course"),
      sections: [
        { key: "course", label: t("appNav.sections.courseBook") },
        { key: "submit", label: t("appNav.sections.submit") },
        { key: "examFile", label: t("appNav.sections.examFile") },
      ],
    },
    {
      key: "falowenAI",
      label: aiLabel,
      sections: [
        { key: "grammar", label: grammarLabel },
        { key: "writing", label: writingLabel },
        { key: "speech", label: speechLabel },
        { key: "vocab", label: vocabLabel },
      ],
    },
    { key: "results", label: t("appNav.tabs.results"), section: "results" },
    { key: "discussion", label: t("appNav.tabs.discussion"), section: "discussion" },
    { key: "account", label: t("appNav.tabs.account"), section: "account" },
  ];
};

const getMainTabForSection = (section, tabStructure) =>
  tabStructure.find((tab) => tab.section === section || tab.sections?.some((entry) => entry.key === section));

const isTabAvailable = (tab, allowedSections) => {
  if (tab.section) {
    return Boolean(allowedSections[tab.section]);
  }

  return tab.sections.some((entry) => allowedSections[entry.key]);
};

const findFirstAllowedSection = (allowedSections, tabStructure) => {
  for (const tab of tabStructure) {
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

const getPreferredSection = (allowedSections, preferred, tabStructure) => {
  if (preferred && allowedSections[preferred]) return preferred;

  return findFirstAllowedSection(allowedSections, tabStructure);
};

function App() {
  const { t } = useTranslation();
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
  const programStorageKey = "falowen:signup-program";
  const [signupProgram, setSignupProgram] = useState(() => {
    if (typeof window === "undefined") return "german";
    return localStorage.getItem(programStorageKey) || "german";
  });
  const location = useLocation();

  const role = useMemo(() => (studentProfile?.role || "student").toLowerCase(), [studentProfile?.role]);
  const isStaff = role === "admin" || role === "tutor" || studentProfile?.isTutor === true;
  const isEnrolled = isStaff || Boolean(studentProfile?.className || studentProfile?.level);
  const tabStructure = useMemo(
    () => getTabStructure(studentProfile?.program, t),
    [studentProfile?.program, t]
  );

  const allowedSections = useMemo(
    () => ({
      submit: true,
      course: isEnrolled,
      examFile: isEnrolled || isStaff,
      results: isEnrolled || isStaff,
      grammar: true,
      writing: true,
      speech: true,
      vocab: true,
      discussion: isEnrolled || isStaff,
      account: true,
    }),
    [isEnrolled, isStaff]
  );

  const tabStorageKey = user?.uid ? `falowen:last-tab:${user.uid}` : null;
  const savedSection = useMemo(() => (tabStorageKey ? localStorage.getItem(tabStorageKey) : null), [tabStorageKey]);

  useEffect(() => {
    localStorage.setItem(programStorageKey, signupProgram);
  }, [programStorageKey, signupProgram]);

  const availableTabs = useMemo(
    () => tabStructure.filter((tab) => isTabAvailable(tab, allowedSections)),
    [allowedSections, tabStructure]
  );

  const defaultCampusSection = useMemo(
    () => getPreferredSection(allowedSections, savedSection, tabStructure),
    [allowedSections, savedSection, tabStructure]
  );

  const paymentStatus = useMemo(
    () => normalizePaymentStatus(studentProfile?.paymentStatus),
    [studentProfile?.paymentStatus]
  );
  const contractEndMs = useMemo(() => {
    if (!studentProfile?.contractEnd) return NaN;
    const parsed = toDateMs(studentProfile.contractEnd);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [studentProfile?.contractEnd]);
  const upgradeCarryoverMs = useMemo(() => {
    if (!studentProfile?.upgradeCarryoverUntil) return NaN;
    const parsed = toDateMs(studentProfile.upgradeCarryoverUntil);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [studentProfile?.upgradeCarryoverUntil]);
  const balanceCleared = useMemo(
    () => hasClearedBalance(studentProfile?.balanceDue),
    [studentProfile?.balanceDue]
  );

  const hasActiveContract = Number.isFinite(contractEndMs) && contractEndMs > Date.now();
  const hasQueuedUpgradeAccess =
    String(studentProfile?.contractMergeMode || "").toLowerCase() === "append_after_active_contract" &&
    Number.isFinite(upgradeCarryoverMs) &&
    upgradeCarryoverMs > Date.now();
  const canAccessLegacy =
    !Number.isFinite(contractEndMs) && (["paid", "partial"].includes(paymentStatus) || balanceCleared);
  const awaitingPayment =
    Boolean(studentProfile) &&
    !isStaff &&
    !(hasActiveContract || hasQueuedUpgradeAccess || canAccessLegacy || balanceCleared);

  if (!isFirebaseConfigured) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 12 }}>
        <div style={styles.card}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Falowen Learning Hub</h1>
          <p style={styles.subtitle}>
            {t("appStatus.firebase.subtitle")}
          </p>
          <div style={{ ...styles.errorBox, marginTop: 12 }}>
            {authError ||
              t("appStatus.firebase.error")}
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
        <div style={styles.card}>{t("appStatus.authLoading")}</div>
      </div>
    );
  }

  if (location.pathname === "/payment-complete") {
    return <PaymentComplete />;
  }

  if (location.pathname === "/learn-german-ghana") {
    return (
      <SeoLandingPage
        onSignUp={() => {
          setSignupProgram("german");
          setAuthMode("signup");
        }}
        onLogin={() => setAuthMode("login")}
      />
    );
  }

  if (location.pathname === "/placement-test") {
    return <PlacementTestPage />;
  }


  if (!user) {
    if (authMode === "signup") {
      if (signupProgram === "french") {
        return <FrenchSignUpPage onLogin={() => setAuthMode("login")} onBack={() => setAuthMode("landing")} />;
      }

      return <SignUpPage onLogin={() => setAuthMode("login")} onBack={() => setAuthMode("landing")} />;
    }

    if (authMode === "landing") {
      return (
        <LandingPage
          program={signupProgram}
          onProgramSelect={setSignupProgram}
          onSignUp={(program) => {
            setSignupProgram(program || "german");
            setAuthMode("signup");
          }}
          onLogin={() => setAuthMode("login")}
        />
      );
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
        tabStructure={tabStructure}
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
  tabStructure,
  tabStorageKey,
  user,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { i18n, t } = useTranslation();
  const resolvedInterfaceLanguage = i18n.resolvedLanguage || i18n.language;
  const interfaceLanguageOptions = useMemo(
    () => [
      { value: "en", label: t("interfaceLanguages.en") },
      { value: "de", label: t("interfaceLanguages.de") },
      { value: "fr", label: t("interfaceLanguages.fr") },
    ],
    [t]
  );

  const subtitle = useMemo(() => {
    if (location.pathname.startsWith("/campus")) {
      return t("appNav.subtitle.campus");
    }

    if (location.pathname.startsWith("/exams")) {
      return t("appNav.subtitle.exams");
    }

    return t("appNav.subtitle.default");
  }, [location.pathname, t]);

  const goHome = () => navigate("/");

  const handleAreaSelect = (area) => {
    if (area === "campus") {
      navigate(`/campus/${defaultCampusSection}`);
      return;
    }

    if (area === "exams") {
      navigate("/exams/overview");
    }
  };

  const handleInterfaceLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    i18n.changeLanguage(nextLanguage);
    persistInterfaceLanguage(nextLanguage);
  };

  useEffect(() => {
    if (!user || !studentProfile) return undefined;
    let unsubscribe = () => {};
    let isMounted = true;

    listenForForegroundMessages(async (payload) => {
      if (!isMounted || !payload) return;
      const normalized = buildPushNotification(payload);
      if (!normalized) return;
      if (normalized.title || normalized.body) {
        showToast(`${normalized.title}${normalized.body ? ` — ${normalized.body}` : ""}`, "info");
      }

      try {
        await persistPushNotification({ studentId: studentProfile.id, payload, notification: normalized });
      } catch (error) {
        console.error("Failed to persist push notification", error);
      }

      try {
        window.dispatchEvent(
          new CustomEvent("falowen:push-notification", { detail: { notification: normalized } })
        );
      } catch (error) {
        console.error("Failed to dispatch push notification event", error);
      }
    }).then((off) => {
      if (typeof off === "function") {
        unsubscribe = off;
      }
    }).catch((error) => {
      console.error("Failed to listen for foreground messages", error);
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [showToast, studentProfile, user]);

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
          <h1 style={styles.title}>{t("appNav.title")}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
        <div className="app-header-meta" style={{ display: "grid", gap: 6, justifyItems: "end" }}>
          <HealthIndicator />
          <div style={{ fontSize: 13, color: "#374151" }}>
            {t("appNav.signedInAs", { email: user.email })}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <NotificationBell
              notificationStatus={notificationStatus}
              onEnablePush={enableNotifications}
            />
            <label style={{ display: "grid", gap: 4, fontSize: 12, color: "#374151" }}>
              {t("interfaceLanguage.shortLabel")}
              <select
                value={resolvedInterfaceLanguage}
                onChange={handleInterfaceLanguageChange}
                aria-label={t("interfaceLanguage.ariaLabel")}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12 }}
              >
                {interfaceLanguageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button style={styles.dangerButton} onClick={logout}>
              {t("appNav.logout")}
            </button>
          </div>
        </div>
      </header>
      <OfflineBanner />

      {location.pathname.startsWith("/campus/course/") ? (
        <CampusQuickNavigation
          allowedSections={allowedSections}
          availableTabs={availableTabs}
          tabStructure={tabStructure}
        />
      ) : null}

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
          <Route path="/placement-test" element={<PlacementTestPage />} />

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
                tabStructure={tabStructure}
                tabStorageKey={tabStorageKey}
              />
            }
          />
          <Route path="/campus/course/speaking-exams-intro-4-7" element={<SpeakingExamIntroPage />} />
          <Route
            path="/campus/course/dative-and-accusative-verbs-14-2"
            element={<DativeAdjectiveDeclensionPage />}
          />
          <Route
            path="/campus/course/dative-verbs-adjective-declension-14-2"
            element={<DativeAdjectiveDeclensionPage />}
          />
          <Route path="/campus/course/verboten-erlaubt-5-9" element={<VerbotenErlaubtPage />} />
          <Route path="/campus/course/directions-imperative-11" element={<DirectionsImperativePage />} />
          <Route
            path="/campus/course/two-case-prepositions-wechselpraepositionen-day-18"
            element={<TwoCasePrepositionsPage />}
          />
          <Route
            path="/campus/course/a1-12-2-dative-articles-mit-bei-zu"
            element={<DativeArticlesMitBeiZuPage />}
          />
          <Route path="/campus/course/letter-writing-intro-12-3" element={<LetterWritingIntroPage />} />
          <Route
            path="/campus/course/letter-writing-intro-german-a1-day-12-3"
            element={<LetterWritingIntroPage />}
          />
          <Route path="/campus/course/conjunctions-5-10" element={<ConjunctionNotesPage />} />
          <Route path="/campus/course/a2-starter-conjunctions-day-1" element={<A2StarterConjunctionsPage />} />
          <Route path="/campus/course/a2-day-2-small-talk-workbook" element={<A2Day2SmallTalkWorkbookEnhancedPage />} />
          <Route path="/campus/course/a2-day-2-personen-beschreiben-workbook" element={<A2Day2PersonenBeschreibenWorkbookPage />} />
          <Route path="/campus/course/a2-day-3-dinge-und-personen-vergleichen-workbook" element={<A2Day3ComparisonsWorkbookPage />} />
          <Route path="/campus/course/a2-day-4-wo-moechten-wir-uns-treffen-workbook" element={<A2Day4WoMoechtenWirUnsTreffenWorkbookPage />} />
          <Route path="/campus/course/a2-day-5-freizeit-workbook" element={<A2Day5FreizeitWorkbookPage />} />
          <Route path="/campus/course/a2-day-6-moebel-und-raeume-workbook" element={<A2Day6MoebelRaeumeWorkbookPage />} />
          <Route path="/campus/course/b1-day-21-lebensformen-heute-workbook" element={<B1Day21LebensformenHeuteWorkbookPage />} />
          <Route
            path="/campus/course/b1-day-25-online-einkaufen-rechte-und-risiken-workbook"
            element={<B1Day25OnlineShoppingRightsRisksWorkbookPage />}
          />
          <Route path="/campus/course/weather-perfekt-letter-13" element={<WeatherPerfektLetterPage />} />
          <Route path="/campus/course/health-and-body-parts-14-1" element={<HealthBodyPartsPage />} />
          <Route path="/campus/course/forming-basic-statements-german-a1-day-8" element={<FormingBasicStatementsPage />} />
          <Route path="/campus/course/german-numbers-1-10-with-pronunciation" element={<GermanNumbersGrammarPage />} />
          <Route path="/campus/course/objects-and-colors-chapter-6" element={<ObjectsAndColorsPage />} />
          <Route path="/campus/course/the-12-hour-clock-system-in-german-chapter-7" element={<TwelveHourClockPage />} />
          <Route path="/campus/course/modal-verbs-day-14-3-6" element={<A1Day14ModalVerbsWorkbookPage />} />
          <Route
            path="/campus/course/a1-chapter-3-asking-about-prices-workbook"
            element={<A1Chapter3AskingAboutPricesWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-chapter-5-german-cases-workbook"
            element={<A1Chapter5GermanCasesWorkbookPage />}
          />
          <Route
            path="/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1"
            element={<A1Day1GreetingsGrammarPage />}
          />
          <Route
            path="/campus/course/german-alphabet-grammar-notes-day-2"
            element={<GermanAlphabetGrammarNotesPage />}
          />
          <Route
            path="/campus/course/singular-pronouns-verb-conjugation-day-2"
            element={<SingularPronounsConjugationPage />}
          />
          <Route
            path="/campus/course/personen-beschreiben-1-2-grammar-notes"
            element={<PersonenBeschreibenGrammarPage />}
          />
          <Route
            path="/campus/course/dinge-und-personen-vergleichen-1-3-grammar-notes"
            element={<ComparingThingsAndPeopleGrammarPage />}
          />
          <Route
            path="/campus/course/wo-moechten-wir-uns-treffen-2-4-grammar-notes"
            element={<WoTreffenUnsGrammarPage />}
          />
          <Route
            path="/campus/course/was-machst-du-in-deiner-freizeit-2-5-grammar-notes"
            element={<A2Day5FreizeitSeparableVerbsGrammarPage />}
          />
          <Route
            path="/campus/course/moebel-und-raeume-3-6-grammar-notes"
            element={<A2Day6TwoCasePrepositionsGrammarPage />}
          />
          <Route path="/campus/course/course-structure" element={<CourseStructurePage />} />
          <Route path="/campus/course/resource-viewer" element={<CourseResourceViewerPage />} />

          <Route path="/exams" element={<Navigate to="/exams/overview" replace />} />
          <Route path="/exams/:section" element={<ExamArea onBack={goHome} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <StudyBuddyBar studentProfile={studentProfile} />
    </div>
  );
};


const CampusQuickNavigation = ({ allowedSections, availableTabs, tabStructure }) => {
  const navigate = useNavigate();

  const activeMainTabConfig = useMemo(
    () => getMainTabForSection("course", tabStructure),
    [tabStructure]
  );

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

  return (
    <>
      <div className="nav-row" style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 8 }}>
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
                style={subTab.key === "course" ? styles.navButtonActive : styles.navButton}
                onClick={() => navigate(`/campus/${subTab.key}`)}
              >
                {subTab.label}
              </button>
            ))}
        </div>
      ) : null}
    </>
  );
};

const CampusArea = ({
  allowedSections,
  availableTabs,
  defaultSection,
  onBack,
  studentProfile,
  tabStructure,
  tabStorageKey,
}) => {
  const campusStudentProfile = studentProfile || {};
  const { t } = useTranslation();
  const { section } = useParams();
  const navigate = useNavigate();

  const resolvedSection = useMemo(() => getPreferredSection(allowedSections, section || defaultSection), [
    allowedSections,
    defaultSection,
    section,
  ]);

  const activeMainTabConfig = useMemo(
    () => getMainTabForSection(resolvedSection, tabStructure),
    [resolvedSection, tabStructure]
  );

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
          {t("appNav.backHome")}
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
          program={campusStudentProfile?.program}
        />
      ) : null}
      {resolvedSection === "examFile" && allowedSections.examFile ? <MyExamFilePage /> : null}
      {resolvedSection === "grammar" && allowedSections.grammar ? <GrammarQuestionTab /> : null}
      {resolvedSection === "writing" && allowedSections.writing ? <LetterPracticePage mode="campus" /> : null}
      {resolvedSection === "speech" && allowedSections.speech ? <SpeechTrainerPage /> : null}
      {resolvedSection === "vocab" && allowedSections.vocab ? <VocabExamPage /> : null}
      {resolvedSection === "submit" && allowedSections.submit ? <AssignmentSubmissionPage /> : null}
      {resolvedSection === "results" && allowedSections.results ? <StudentResultsPage /> : null}
      {resolvedSection === "discussion" && allowedSections.discussion ? <ClassDiscussionPage /> : null}
      {resolvedSection === "account" && allowedSections.account ? <AccountSettings /> : null}
    </>
  );
};

const ExamArea = ({ onBack }) => {
  const { t } = useTranslation();
  const { section } = useParams();
  const navigate = useNavigate();
  const { level, setLevel } = useExam();

  const lastVisitStorageKey = "falowen_exam_last_visit";
  const lastSectionStorageKey = "falowen_exam_last_section";

  const examSection = useMemo(() => {
    if (
      [
        "overview",
        "speaking",
        "writing",
        "resources",
        "study",
        "file",
        "vocab",
        "horen",
        "lesen",
      ].includes(section)
    ) {
      return section;
    }
    return "overview";
  }, [section]);

  useEffect(() => {
    if (section !== examSection) {
      navigate(`/exams/${examSection}`, { replace: true });
    }
  }, [examSection, navigate, section]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(lastVisitStorageKey);
      const parsed = stored ? JSON.parse(stored) : {};
      const next = {
        ...parsed,
        [examSection]: new Date().toISOString(),
      };
      localStorage.setItem(lastVisitStorageKey, JSON.stringify(next));
      localStorage.setItem(lastSectionStorageKey, examSection);
    } catch (error) {
      console.warn("Failed to store exam last visit metadata", error);
    }
  }, [examSection, lastSectionStorageKey, lastVisitStorageKey]);

  const tabs = [
    { key: "overview", label: t("appNav.examTabs.overview") },
    { key: "lesen", label: t("appNav.examTabs.lesen") },
    { key: "speaking", label: t("appNav.examTabs.speaking") },
    { key: "writing", label: t("appNav.examTabs.writing") },
    { key: "vocab", label: t("appNav.examTabs.vocab") },
    { key: "horen", label: t("appNav.examTabs.horen") },
    { key: "resources", label: t("appNav.examTabs.resources") },
    { key: "study", label: t("appNav.examTabs.study") },
    { key: "file", label: t("appNav.examTabs.file") },
  ];

  return (
    <>
      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <div className="nav-row" style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 0 }}>
          <button style={styles.secondaryButton} onClick={onBack}>
            {t("appNav.backHome")}
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
        <div
          style={{
            ...styles.card,
            margin: 0,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ minWidth: 160 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>Exam level</p>
            <strong style={{ fontSize: 16 }}>{level}</strong>
          </div>
          <div style={{ display: "grid", gap: 6, minWidth: 200 }}>
            <label htmlFor="exam-level-selector" style={styles.helperText}>
              Switch level for all tabs
            </label>
            <select
              id="exam-level-selector"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            >
              {ALLOWED_LEVELS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {examSection === "overview" ? <ExamsOverviewPage /> : null}
      {examSection === "speaking" ? <SpeakingPage /> : null}
      {examSection === "writing" ? <WritingPage mode="exam" /> : null}
      {examSection === "vocab" ? <VocabExamPage /> : null}
      {examSection === "horen" ? <HorenPage /> : null}
      {examSection === "lesen" ? <LesenPage /> : null}
      {examSection === "resources" ? <ExamResources /> : null}
      {examSection === "study" ? <StudyCalendarPage /> : null}
      {examSection === "file" ? <MyExamFilePage /> : null}
    </>
  );
};
