import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ALLOWED_LEVELS, ExamProvider, useExam } from "./context/ExamContext";
import CourseTab from "./components/CourseTab";
import CourseLessonPage from "./components/CourseLessonPage";
import AutoWorkbookStartGuide from "./components/AutoWorkbookStartGuide";
import AuthGate from "./components/AuthGate";
import SignUpPage from "./components/SignUpPage";
import LandingPage from "./components/LandingPage";
import FrenchSignUpPage from "./components/FrenchSignUpPage";
import HealthIndicator from "./components/HealthIndicator";
import AssignmentSubmissionPage from "./components/AssignmentSubmissionPage";
import AccountSettings from "./components/AccountSettings";
import ClassDiscussionPage from "./components/ClassDiscussionPage";
import GrammarQuestionTab from "./components/GrammarQuestionTab";
import AttendanceTab from "./components/AttendanceTab";
import SpeechTrainerPage from "./components/SpeechTrainerPage";
import LetterPracticePage from "./components/LetterPracticePage";
import DativeAdjectiveDeclensionPage from "./components/DativeAdjectiveDeclensionPage";
import SpeakingExamIntroPage from "./components/SpeakingExamIntroPage";
import CourseStructurePage from "./components/CourseStructurePage";
import A1Day0OrientationKnowledgeTestWorkbookPage from "./components/A1Day0OrientationKnowledgeTestWorkbookPage";
import A2Day0OrientationKnowledgeTestWorkbookPage from "./components/A2Day0OrientationKnowledgeTestWorkbookPage";
import B1Day0OrientationKnowledgeTestWorkbookPage from "./components/B1Day0OrientationKnowledgeTestWorkbookPage";
import B2Day0SelfLearningOrientationWorkbookPage from "./components/B2Day0SelfLearningOrientationWorkbookPage";
import C1Day0ProgressionWorkbookPage from "./components/C1Day0ProgressionWorkbookPage";
import CourseResourceViewerPage from "./components/CourseResourceViewerPage";
import FullClassCalendarPage from "./components/FullClassCalendarPage";
import ConjunctionNotesPage from "./components/ConjunctionNotesPage";
import FormingBasicStatementsPage from "./components/FormingBasicStatementsPage";
import GermanNumbersGrammarPage from "./components/GermanNumbersGrammarPage";
import ObjectsAndColorsPage from "./components/ObjectsAndColorsPage";
import TwelveHourClockPage from "./components/TwelveHourClockPage";
import A1Day12TwentyFourHourClockDatesPage from "./components/A1Day12TwentyFourHourClockDatesPage";
import SingularPronounsConjugationPage from "./components/SingularPronounsConjugationPage";
import GermanAlphabetGrammarNotesPage from "./components/GermanAlphabetGrammarNotesPage";
import A2Day2Kapitel12GrammarNotesPage from "./components/A2Day2Kapitel12GrammarNotesPage";
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
import A1Day1GreetingsWorkbookPage from "./components/A1Day1GreetingsWorkbookPage";
import A1Day2Kapitel11WorkbookPage from "./components/A1Day2Kapitel11WorkbookPage";
import A1Day3GermanAlphabetReviewingWorkbookPage from "./components/A1Day3GermanAlphabetReviewingWorkbookPage";
import A1Day3SchreibenSprechenKapitel11WorkbookPage from "./components/A1Day3SchreibenSprechenKapitel11WorkbookPage";
import A1Day3Kapitel12WorkbookPage from "./components/A1Day3Kapitel12WorkbookPage";
import A1Day3Kapitel12GrammarNotesPage from "./components/A1Day3Kapitel12GrammarNotesPage";
import A1Day3PronounsIntroducingYourselfWorkbookPage from "./components/A1Day3PronounsIntroducingYourselfWorkbookPage";
import A1Day5IntroducingYourselfArticlesWorkbookPage from "./components/A1Day5IntroducingYourselfArticlesWorkbookPage";
import A1Day6FamilyAndHobbiesWorkbookPage from "./components/A1Day6FamilyAndHobbiesWorkbookPage";
import A1Day12TwentyFourHourClockAndDatesWorkbookPage from "./components/A1Day12TwentyFourHourClockAndDatesWorkbookPage";
import A1Day13RevisionNumbersTimePricesWorkbookPage from "./components/A1Day13RevisionNumbersTimePricesWorkbookPage";
import A2Day2SmallTalkWorkbookEnhancedPage from "./components/A2Day2SmallTalkWorkbookEnhancedPage";
import A2Day2PersonenBeschreibenWorkbookPage from "./components/A2Day2PersonenBeschreibenWorkbookPage";
import A2Day3ComparisonsWorkbookPage from "./components/A2Day3ComparisonsWorkbookPage";
import A2Day4WoMoechtenWirUnsTreffenWorkbookPage from "./components/A2Day4WoMoechtenWirUnsTreffenWorkbookPage";
import B1Day4WohnungSuchenWorkbookPage from "./components/B1Day4WohnungSuchenWorkbookPage";
import A2Day5FreizeitWorkbookPage from "./components/A2Day5FreizeitWorkbookPage";
import A2Day5FreizeitSeparableVerbsGrammarPage from "./components/A2Day5FreizeitSeparableVerbsGrammarPage";
import A2Day6MoebelRaeumeWorkbookPage from "./components/A2Day6MoebelRaeumeWorkbookPage";
import A2Day6TwoCasePrepositionsGrammarPage from "./components/A2Day6TwoCasePrepositionsGrammarPage";
import A2Day7RelativeClausesWohnungGrammarPage from "./components/A2Day7RelativeClausesWohnungGrammarPage";
import A2Day7WohnungSuchenWorkbookPage from "./components/A2Day7WohnungSuchenWorkbookPage";
import A2Day8ImperativeGrammarPage from "./components/A2Day8ImperativeGrammarPage";
import A2Day9PerfektGrammarPage from "./components/A2Day9PerfektGrammarPage";
import A2Day10PraeteritumGrammarPage from "./components/A2Day10PraeteritumGrammarPage";
import A2Day11ComparativeFormsGrammarPage from "./components/A2Day11ComparativeFormsGrammarPage";
import A2Day12MeinTraumberufGrammarPage from "./components/A2Day12MeinTraumberufGrammarPage";
import A2Day13VorstellungsgespraechModalverbenPraeteritumGrammarPage from "./components/A2Day13VorstellungsgespraechModalverbenPraeteritumGrammarPage";
import A2Day14BerufUndKarriereUmZuGrammarPage from "./components/A2Day14BerufUndKarriereUmZuGrammarPage";
import A2Day15MeinLieblingssportSeitDativGrammarPage from "./components/A2Day15MeinLieblingssportSeitDativGrammarPage";
import A2Day16WohlbefindenReflexiveVerbenGrammarPage from "./components/A2Day16WohlbefindenReflexiveVerbenGrammarPage";
import A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage from "./components/A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage";
import A2Day19EinkaufenOderDennGrammarPage from "./components/A2Day19EinkaufenOderDennGrammarPage";
import A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage from "./components/A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage";
import A2Day21EinWochenendePlanenWennObFallsGrammarPage from "./components/A2Day21EinWochenendePlanenWennObFallsGrammarPage";
import A2Day22DieWochePlanungGrammarPage from "./components/A2Day22DieWochePlanungGrammarPage";
import A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage from "./components/A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage";
import A2Day24EinenUrlaubPlanenGrammarPage from "./components/A2Day24EinenUrlaubPlanenGrammarPage";
import A2Day8RezepteUndEssenWorkbookPage from "./components/A2Day8RezepteUndEssenWorkbookPage";
import A2Day9UrlaubWorkbookPage from "./components/A2Day9UrlaubWorkbookPage";
import RadioFirstWorkbookGate from "./components/RadioFirstWorkbookGate";
import A2Day10TourismusTraditionelleFesteWorkbookPage from "./components/A2Day10TourismusTraditionelleFesteWorkbookPage";
import A2Day11UnterwegsVerkehrsmittelWorkbookPage from "./components/A2Day11UnterwegsVerkehrsmittelWorkbookPage";
import A2Day12MeinTraumberufWorkbookPage from "./components/A2Day12MeinTraumberufWorkbookPage";
import A2Day13VorstellungsgespraechWorkbookPage from "./components/A2Day13VorstellungsgespraechWorkbookPage";
import A2Day14BerufUndKarriereWorkbookPage from "./components/A2Day14BerufUndKarriereWorkbookPage";
import A2Day15MeinLieblingssportWorkbookPage from "./components/A2Day15MeinLieblingssportWorkbookPage";
import A2Day16WohlbefindenUndEntspannungWorkbookPage from "./components/A2Day16WohlbefindenUndEntspannungWorkbookPage";
import A2Day17InDieApothekeGehenWorkbookPage from "./components/A2Day17InDieApothekeGehenWorkbookPage";
import A2Day18DieBankAnrufenWorkbookPage from "./components/A2Day18DieBankAnrufenWorkbookPage";
import A2Day19EinkaufenWoUndWieWorkbookPage from "./components/A2Day19EinkaufenWoUndWieWorkbookPage";
import A2Day20TypischeReklamationssituationenWorkbookPage from "./components/A2Day20TypischeReklamationssituationenWorkbookPage";
import A2Day21EinWochenendePlanenWorkbookPage from "./components/A2Day21EinWochenendePlanenWorkbookPage";
import A2Day22DieWochePlanungWorkbookPage from "./components/A2Day22DieWochePlanungWorkbookPage";
import A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage from "./components/A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage";
import A2Day24EinenUrlaubPlanenWorkbookPage from "./components/A2Day24EinenUrlaubPlanenWorkbookPage";
import A2Day25TagesablaufWorkbookPage from "./components/A2Day25TagesablaufWorkbookPage";
import A2Day26GefuehleInVerschiedenenSituationenWorkbookPage from "./components/A2Day26GefuehleInVerschiedenenSituationenWorkbookPage";
import A2Day27DigitaleKommunikationWorkbookPage from "./components/A2Day27DigitaleKommunikationWorkbookPage";
import A2Day28UeberDieZukunftSprechenWorkbookPage from "./components/A2Day28UeberDieZukunftSprechenWorkbookPage";
import A2Day28UeberDieZukunftSprechenGrammarPage from "./components/A2Day28UeberDieZukunftSprechenGrammarPage";
import B1Day20WieWirdManWorkbookPage from "./components/B1Day20WieWirdManWorkbookPage";
import B1Day21LebensformenHeuteWorkbookPage from "./components/B1Day21LebensformenHeuteWorkbookPage";
import B1Day22BeziehungWichtigWorkbookPage from "./components/B1Day22BeziehungWichtigWorkbookPage";
import B1Day23ErstesDateWorkbookPage from "./components/B1Day23ErstesDateWorkbookPage";
import B1Day24KonsumNachhaltigkeitWorkbookPage from "./components/B1Day24KonsumNachhaltigkeitWorkbookPage";
import B1Day25OnlineShoppingRightsRisksWorkbookPage from "./components/B1Day25OnlineShoppingRightsRisksWorkbookPage";
import B1Day26ReiseproblemeUndLoesungenWorkbookPage from "./components/B1Day26ReiseproblemeUndLoesungenWorkbookPage";
import B1Day27UmweltfreundlichImAlltagWorkbookPage from "./components/B1Day27UmweltfreundlichImAlltagWorkbookPage";
import B1Day28KlimafreundlichLebenWorkbookPage from "./components/B1Day28KlimafreundlichLebenWorkbookPage";
import A1Day14ModalVerbsWorkbookPage from "./components/A1Day14ModalVerbsWorkbookPage";
import A1Day16FoodAndNegationGrammarPage from "./components/A1Day16FoodAndNegationGrammarPage";
import A1Day16FoodAndDailyLifeWorkbookPage from "./components/A1Day16FoodAndDailyLifeWorkbookPage";
import A1Day16FoodAndNegationKapitel10WorkbookPage from "./components/A1Day16FoodAndNegationKapitel10WorkbookPage";
import A1Day17InstructionsDirectionsKapitel11WorkbookPage from "./components/A1Day17InstructionsDirectionsKapitel11WorkbookPage";
import A1Day21WeatherWorkbookPage from "./components/A1Day21WeatherWorkbookPage";
import A1Day22HealthBodyPartsWorkbookPage from "./components/A1Day22HealthBodyPartsWorkbookPage";
import A1Day4NumbersForBeginnersWorkbookPage from "./components/A1Day4NumbersForBeginnersWorkbookPage";
import A1Chapter3AskingAboutPricesWorkbookPage from "./components/A1Chapter3AskingAboutPricesWorkbookPage";
import A1Chapter5GermanCasesWorkbookPage from "./components/A1Chapter5GermanCasesWorkbookPage";
import A1Day1GreetingsGrammarPage from "./components/A1Day1GreetingsGrammarPage";
import A1Day7PricesPreferencesGrammarPage from "./components/A1Day7PricesPreferencesGrammarPage";
import A1Day9NominativeAccusativeGrammarPage from "./components/A1Day9NominativeAccusativeGrammarPage";
import A1Day11UnderstandingTimeWorkbookPage from "./components/A1Day11UnderstandingTimeWorkbookPage";
import A1Day10ObjectsColorsPossessiveArticlesWorkbookPage from "./components/A1Day10ObjectsColorsPossessiveArticlesWorkbookPage";
import A1Day8CountriesAndLanguagesWorkbookPage from "./components/A1Day8CountriesAndLanguagesWorkbookPage";
import WritingPage from "./components/WritingPage";
import VocabExamPage from "./components/VocabExamPage";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import { isFirebaseConfigured, listenForForegroundMessages } from "./firebase";
import { styles } from "./styles";
import "./App.css";
import StudentResultsPage from "./components/StudentResultsPage";
import GeneralHome from "./components/GeneralHome";
import OnboardingChecklist from "./components/OnboardingChecklist";
import SpeakingPage from "./components/SpeakingPage";
import ExamResources from "./components/ExamResources";
import HorenPage from "./components/HorenPage";
import LesenPage from "./components/LesenPage";
import StudyCalendarPage from "./components/StudyCalendarPage";
import QuestionOfDayPage from "./components/QuestionOfDayPage";
import C1SelfLearningCourse from "./components/C1SelfLearningCourse";
import C1Day1WillkommenSelbstlernstartWorkbookPage from "./components/C1Day1WillkommenSelbstlernstartWorkbookPage";
import C1Day10IntegrationUndGesellschaftGrammarNotesPage from "./components/C1Day10IntegrationUndGesellschaftGrammarNotesPage";
import C1Day10IntegrationUndGesellschaftWorkbookPage from "./components/C1Day10IntegrationUndGesellschaftWorkbookPage";
import C1Day11EngagementUndEhrenamtGrammarNotesPage from "./components/C1Day11EngagementUndEhrenamtGrammarNotesPage";
import C1Day11EngagementUndEhrenamtWorkbookPage from "./components/C1Day11EngagementUndEhrenamtWorkbookPage";
import C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage from "./components/C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage";
import C1Day12FreizeitUndKulturWorkbookPage from "./components/C1Day12FreizeitUndKulturWorkbookPage";
import C1Day13MehrsprachigkeitGrammarNotesPage from "./components/C1Day13MehrsprachigkeitGrammarNotesPage";
import C1Day13MehrsprachigkeitWorkbookPage from "./components/C1Day13MehrsprachigkeitWorkbookPage";
import C1Day14InnovationUndZukunftGrammarNotesPage from "./components/C1Day14InnovationUndZukunftGrammarNotesPage";
import C1Day14InnovationUndZukunftWorkbookPage from "./components/C1Day14InnovationUndZukunftWorkbookPage";
import C1Day15BildungUndLebenslangesLernenGrammarNotesPage from "./components/C1Day15BildungUndLebenslangesLernenGrammarNotesPage";
import C1Day15BildungUndLebenslangesLernenWorkbookPage from "./components/C1Day15BildungUndLebenslangesLernenWorkbookPage";
import C1Day16TechnologieImAlltagGrammarNotesPage from "./components/C1Day16TechnologieImAlltagGrammarNotesPage";
import C1Day16TechnologieImAlltagWorkbookPage from "./components/C1Day16TechnologieImAlltagWorkbookPage";
import B2Day1PersoenlicheIdentitaetGrammarNotesPage from "./components/B2Day1PersoenlicheIdentitaetGrammarNotesPage";
import B2Day1PersoenlicheIdentitaetWorkbookPage from "./components/B2Day1PersoenlicheIdentitaetWorkbookPage";
import NotificationBell from "./components/NotificationBell";
import SetupCheckpoint from "./components/SetupCheckpoint";
import PaymentComplete from "./components/PaymentComplete";
import MyExamFilePage from "./components/MyExamFilePage";
import SeoLandingPage from "./components/SeoLandingPage";
import OfflineBanner from "./components/OfflineBanner";
import StudyBuddyBar from "./components/StudyBuddyBar";
import AttendanceCheckinCard from "./components/AttendanceCheckinCard";
import PlacementTestPage from "./components/PlacementTestPage";
import PublicStudentGuidePage from "./components/PublicStudentGuidePage";
import TutorMarkingPage from "./pages/TutorMarkingPage";
import { buildPushNotification, persistPushNotification } from "./services/notificationService";
import { toDateMs } from "./lib/dateUtils";
import { hasClearedBalance, normalizePaymentStatus } from "./lib/paymentStatus";
import { persistInterfaceLanguage } from "./i18n";

const getTabStructure = (program, t) => {
  const isFrenchProgram = program === "french";
  const vocabLabel = isFrenchProgram ? t("appNav.sections.vocabFrench") : t("appNav.sections.vocab");

  return [
    {
      key: "myCourse",
      label: t("appNav.tabs.course"),
      sections: [
        { key: "course", label: t("appNav.sections.courseBook") },
        { key: "submit", label: t("appNav.sections.submit") },
        { key: "examFile", label: t("appNav.sections.examFile") },
        { key: "attendance", label: t("appNav.sections.attendance") },
      ],
    },
    {
      key: "vocab",
      label: vocabLabel,
      section: "vocab",
    },
    { key: "results", label: t("appNav.tabs.results"), section: "results" },
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

const getPreferredSection = (allowedSections, preferred, tabStructure, { allowHidden = false } = {}) => {
  const isVisibleSection = Boolean(preferred && getMainTabForSection(preferred, tabStructure));
  if (preferred && allowedSections[preferred] && (allowHidden || isVisibleSection)) return preferred;

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
  const [authMode, setAuthMode] = useState(() => {
    if (typeof window === "undefined") return "landing";
    if (window.location.pathname.startsWith("/signup")) return "signup";
    if (window.location.pathname.startsWith("/login")) return "login";
    return "landing";
  });
  const programStorageKey = "falowen:signup-program";
  const [signupProgram, setSignupProgram] = useState(() => {
    if (typeof window === "undefined") return "german";
    return localStorage.getItem(programStorageKey) || "german";
  });
  const location = useLocation();
  const navigate = useNavigate();

  const role = useMemo(() => (studentProfile?.role || "student").toLowerCase(), [studentProfile?.role]);
  const isStaff = role === "admin" || role === "tutor" || studentProfile?.isTutor === true;
  const isEnrolled = isStaff || Boolean(studentProfile?.className || studentProfile?.level);
  const levelToken = String(studentProfile?.level || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] || "";
  const isSelfLearningTrack = !isStaff && ["B2", "C1"].includes(levelToken);
  const tabStructure = useMemo(
    () => getTabStructure(studentProfile?.program, t),
    [studentProfile?.program, t]
  );

  const allowedSections = useMemo(
    () => ({
      submit: !isSelfLearningTrack,
      course: true,
      examFile: (isEnrolled || isStaff) && !isSelfLearningTrack,
      attendance: (isEnrolled || isStaff) && !isSelfLearningTrack,
      results: isEnrolled || isStaff,
      vocab: true,
      discussion: (isEnrolled || isStaff) && !isSelfLearningTrack,
      account: true,
      "tutor-marking": isStaff,
    }),
    [isEnrolled, isSelfLearningTrack, isStaff]
  );

  const tabStorageKey = user?.uid ? `falowen:last-tab:${user.uid}` : null;
  const savedSection = useMemo(() => (tabStorageKey ? localStorage.getItem(tabStorageKey) : null), [tabStorageKey]);

  useEffect(() => {
    localStorage.setItem(programStorageKey, signupProgram);
  }, [programStorageKey, signupProgram]);

  useEffect(() => {
    if (location.pathname.startsWith("/signup")) {
      const program = new URLSearchParams(location.search).get("program");
      if (["german", "french"].includes(program)) setSignupProgram(program);
      setAuthMode("signup");
    } else if (location.pathname.startsWith("/login")) {
      setAuthMode("login");
    } else if (location.pathname.startsWith("/classes")) {
      setAuthMode("landing");
      window.setTimeout(() => document.getElementById("upcoming-classes")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  }, [location.pathname, location.search]);

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
          navigate("/signup?program=german");
        }}
        onLogin={() => {
          setAuthMode("login");
          navigate("/login/");
        }}
      />
    );
  }

  if (location.pathname === "/placement-test") {
    return <PlacementTestPage />;
  }

  if (location.pathname === "/learn-german-ghana/falowen-guide") {
    return <PublicStudentGuidePage />;
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
            const nextProgram = program || "german";
            setSignupProgram(nextProgram);
            setAuthMode("signup");
            navigate(`/signup?program=${encodeURIComponent(nextProgram)}`);
          }}
          onLogin={() => {
            setAuthMode("login");
            navigate("/login/");
          }}
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
  const isOnboarding = location.pathname === "/onboarding";
  const onboardingRole = String(studentProfile?.role || "student").toLowerCase();
  const requiresOnboarding =
    !["admin", "tutor"].includes(onboardingRole) &&
    !Boolean(studentProfile?.isTutor) &&
    !Boolean(studentProfile?.onboardingCompleted);
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

  if (requiresOnboarding && !isOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requiresOnboarding && isOnboarding) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className={isOnboarding ? "onboarding-shell" : "app-shell"}
      style={isOnboarding ? undefined : styles.container}
    >
      {!isOnboarding ? (
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
      ) : null}
      {!isOnboarding ? <OfflineBanner /> : null}

      {location.pathname.startsWith("/campus/course/") ? (
        <CampusQuickNavigation
          allowedSections={allowedSections}
          availableTabs={availableTabs}
          tabStructure={tabStructure}
        />
      ) : null}

      <main className="layout-main" style={{ minWidth: 0 }}>
        {!isOnboarding ? <AutoWorkbookStartGuide /> : null}
        <Routes>
          <Route
            path="/onboarding"
            element={
              <OnboardingChecklist
                studentProfile={studentProfile}
                onSaveOnboarding={() => saveStudentProfile({ onboardingCompleted: true })}
              />
            }
          />
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
          <Route path="/tutor-marking" element={<Navigate to="/campus/tutor-marking" replace />} />

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
          <Route path="/campus/course/lesson/:level/:day" element={<CourseLessonPage />} />
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
          <Route path="/campus/course/a1-day-1-greetings-workbook" element={<A1Day1GreetingsWorkbookPage />} />
          <Route path="/campus/course/a1-day-2-kapitel-1-1-workbook" element={<A1Day2Kapitel11WorkbookPage />} />
          <Route
            path="/campus/course/a1-day-12-24-hour-clock-and-dates-workbook"
            element={<A1Day12TwentyFourHourClockAndDatesWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook"
            element={<A1Day13RevisionNumbersTimePricesWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-2-german-alphabet-reviewing-workbook"
            element={<A1Day3GermanAlphabetReviewingWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-3-german-alphabet-reviewing-workbook"
            element={<A1Day3GermanAlphabetReviewingWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook"
            element={<A1Day3SchreibenSprechenKapitel11WorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-3-kapitel-1-2-workbook"
            element={<A1Day3Kapitel12WorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-3-pronouns-introducing-yourself-workbook"
            element={<A1Day3PronounsIntroducingYourselfWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-5-introducing-yourself-and-articles-workbook"
            element={<A1Day5IntroducingYourselfArticlesWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-6-family-and-hobbies-workbook"
            element={<A1Day6FamilyAndHobbiesWorkbookPage />}
          />
          <Route path="/campus/course/a2-day-2-small-talk-workbook" element={<A2Day2SmallTalkWorkbookEnhancedPage />} />
          <Route path="/campus/course/a2-day-2-personen-beschreiben-workbook" element={<A2Day2PersonenBeschreibenWorkbookPage />} />
          <Route path="/campus/course/a2-day-3-dinge-und-personen-vergleichen-workbook" element={<A2Day3ComparisonsWorkbookPage />} />
          <Route path="/campus/course/a2-day-4-wo-moechten-wir-uns-treffen-workbook" element={<A2Day4WoMoechtenWirUnsTreffenWorkbookPage />} />
          <Route path="/campus/course/b1-day-4-wohnung-suchen-workbook" element={<B1Day4WohnungSuchenWorkbookPage />} />
          <Route path="/campus/course/a2-day-5-freizeit-workbook" element={<A2Day5FreizeitWorkbookPage />} />
          <Route path="/campus/course/a2-day-6-moebel-und-raeume-workbook" element={<A2Day6MoebelRaeumeWorkbookPage />} />
          <Route path="/campus/course/a2-day-7-eine-wohnung-suchen-workbook" element={<A2Day7WohnungSuchenWorkbookPage />} />
          <Route path="/campus/course/a2-day-8-rezepte-und-essen-workbook" element={<A2Day8RezepteUndEssenWorkbookPage />} />
          <Route path="/campus/course/a2-day-9-urlaub-workbook" element={<RadioFirstWorkbookGate level="A2" day={9}><A2Day9UrlaubWorkbookPage /></RadioFirstWorkbookGate>} />
          <Route
            path="/campus/course/a2-day-10-tourismus-und-traditionelle-feste-workbook"
            element={<RadioFirstWorkbookGate level="A2" day={10}><A2Day10TourismusTraditionelleFesteWorkbookPage /></RadioFirstWorkbookGate>}
          />
          <Route
            path="/campus/course/a2-day-11-unterwegs-verkehrsmittel-vergleichen-workbook"
            element={<RadioFirstWorkbookGate level="A2" day={11}><A2Day11UnterwegsVerkehrsmittelWorkbookPage /></RadioFirstWorkbookGate>}
          />
          <Route
            path="/campus/course/a2-day-12-mein-traumberuf-workbook"
            element={<A2Day12MeinTraumberufWorkbookPage />}
          />
          <Route
            path="/campus/course/a2-day-13-vorstellungsgespraech-workbook"
            element={<A2Day13VorstellungsgespraechWorkbookPage />}
          />
          <Route
            path="/campus/course/a2-day-14-beruf-und-karriere-workbook"
            element={<A2Day14BerufUndKarriereWorkbookPage />}
          />
          <Route
            path="/campus/course/a2-day-15-mein-lieblingssport-workbook"
            element={<RadioFirstWorkbookGate level="A2" day={15}><A2Day15MeinLieblingssportWorkbookPage /></RadioFirstWorkbookGate>}
          />
          <Route
            path="/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook"
            element={<RadioFirstWorkbookGate level="A2" day={16}><A2Day16WohlbefindenUndEntspannungWorkbookPage /></RadioFirstWorkbookGate>}
          />
          <Route
            path="/campus/course/a2-day-17-in-die-apotheke-gehen-workbook"
            element={<A2Day17InDieApothekeGehenWorkbookPage />}
          />
          <Route path="/campus/course/a2-day-18-die-bank-anrufen-workbook" element={<A2Day18DieBankAnrufenWorkbookPage />} />
          <Route path="/campus/course/a2-day-19-einkaufen-wo-und-wie-workbook" element={<A2Day19EinkaufenWoUndWieWorkbookPage />} />
          <Route path="/campus/course/a2-day-20-typische-reklamationssituationen-workbook" element={<A2Day20TypischeReklamationssituationenWorkbookPage />} />
          <Route path="/campus/course/a2-day-21-ein-wochenende-planen-workbook" element={<A2Day21EinWochenendePlanenWorkbookPage />} />
          <Route path="/campus/course/a2-day-22-die-woche-planung-workbook" element={<A2Day22DieWochePlanungWorkbookPage />} />
          <Route path="/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook" element={<A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage />} />
          <Route path="/campus/course/a2-day-24-einen-urlaub-planen-workbook" element={<A2Day24EinenUrlaubPlanenWorkbookPage />} />
          <Route path="/campus/course/a2-day-25-tagesablauf-workbook" element={<A2Day25TagesablaufWorkbookPage />} />
          <Route path="/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook" element={<RadioFirstWorkbookGate level="A2" day={26}><A2Day26GefuehleInVerschiedenenSituationenWorkbookPage /></RadioFirstWorkbookGate>} />
          <Route path="/campus/course/a2-day-27-digitale-kommunikation-workbook" element={<RadioFirstWorkbookGate level="A2" day={27}><A2Day27DigitaleKommunikationWorkbookPage /></RadioFirstWorkbookGate>} />
          <Route path="/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook" element={<A2Day28UeberDieZukunftSprechenWorkbookPage />} />
          <Route path="/campus/course/c1-self-learning" element={<C1SelfLearningCourse />} />
          <Route path="/campus/course/c1-self-learning/day-:dayId" element={<C1SelfLearningCourse />} />
          <Route path="/campus/course/c1-day-1-willkommen-selbstlernstart-workbook" element={<RadioFirstWorkbookGate level="C1" day={1}><C1Day1WillkommenSelbstlernstartWorkbookPage /></RadioFirstWorkbookGate>} />
          <Route path="/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-grammar-notes" element={<B2Day1PersoenlicheIdentitaetGrammarNotesPage />} />
          <Route path="/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-workbook" element={<RadioFirstWorkbookGate level="B2" day={1}><B2Day1PersoenlicheIdentitaetWorkbookPage /></RadioFirstWorkbookGate>} />
                    <Route path="/campus/course/c1-day-10-integration-und-gesellschaft-grammar-notes" element={<C1Day10IntegrationUndGesellschaftGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-10-migration-und-integration-grammar-notes" element={<C1Day10IntegrationUndGesellschaftGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-10-integration-und-gesellschaft-workbook" element={<C1Day10IntegrationUndGesellschaftWorkbookPage />} />
          <Route path="/campus/course/c1-day-11-engagement-und-ehrenamt-grammar-notes" element={<C1Day11EngagementUndEhrenamtGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-11-engagement-und-ehrenamt-workbook" element={<C1Day11EngagementUndEhrenamtWorkbookPage />} />
          <Route path="/campus/course/c1-day-12-freizeit-und-kultur-erweiterte-vergleichsformen-grammar-notes" element={<C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-12-freizeit-und-kultur-grammar-notes" element={<C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-12-freizeit-und-kultur-workbook" element={<C1Day12FreizeitUndKulturWorkbookPage />} />
          <Route path="/campus/course/c1-day-13-mehrsprachigkeit-grammar-notes" element={<C1Day13MehrsprachigkeitGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-13-mehrsprachigkeit-workbook" element={<C1Day13MehrsprachigkeitWorkbookPage />} />
          <Route path="/campus/course/c1-day-14-innovation-und-zukunft-grammar-notes" element={<C1Day14InnovationUndZukunftGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-14-innovation-und-zukunft-workbook" element={<C1Day14InnovationUndZukunftWorkbookPage />} />
          <Route path="/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-grammar-notes" element={<C1Day15BildungUndLebenslangesLernenGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-workbook" element={<C1Day15BildungUndLebenslangesLernenWorkbookPage />} />
          <Route path="/campus/course/c1-day-16-technologie-im-alltag-grammar-notes" element={<C1Day16TechnologieImAlltagGrammarNotesPage />} />
          <Route path="/campus/course/c1-day-16-technologie-im-alltag-workbook" element={<C1Day16TechnologieImAlltagWorkbookPage />} />
          <Route path="/campus/course/b1-day-20-wie-wird-man-ausbildung-und-qualifikationen-workbook" element={<B1Day20WieWirdManWorkbookPage />} />
          <Route path="/campus/course/b1-day-21-lebensformen-heute-workbook" element={<B1Day21LebensformenHeuteWorkbookPage />} />
          <Route path="/campus/course/b1-day-22-was-ist-dir-in-einer-beziehung-wichtig-workbook" element={<B1Day22BeziehungWichtigWorkbookPage />} />
          <Route path="/campus/course/b1-day-23-erstes-date-typische-situationen-workbook" element={<B1Day23ErstesDateWorkbookPage />} />
          <Route path="/campus/course/b1-day-24-konsum-und-nachhaltigkeit-workbook" element={<B1Day24KonsumNachhaltigkeitWorkbookPage />} />
          <Route
            path="/campus/course/b1-day-25-online-einkaufen-rechte-und-risiken-workbook"
            element={<B1Day25OnlineShoppingRightsRisksWorkbookPage />}
          />
          <Route
            path="/campus/course/b1-day-26-reiseprobleme-und-loesungen-workbook"
            element={<B1Day26ReiseproblemeUndLoesungenWorkbookPage />}
          />
          <Route
            path="/campus/course/b1-day-27-umweltfreundlich-im-alltag-workbook"
            element={<B1Day27UmweltfreundlichImAlltagWorkbookPage />}
          />
          <Route
            path="/campus/course/b1-day-28-klimafreundlich-leben-workbook"
            element={<B1Day28KlimafreundlichLebenWorkbookPage />}
          />
          <Route path="/campus/course/weather-perfekt-letter-13" element={<WeatherPerfektLetterPage />} />
          <Route path="/campus/course/health-and-body-parts-14-1" element={<HealthBodyPartsPage />} />
          <Route path="/campus/course/a1-day-7-asking-about-prices-and-preferences" element={<A1Day7PricesPreferencesGrammarPage />} />
          <Route path="/campus/course/a1-day-8-countries-and-languages-workbook" element={<A1Day8CountriesAndLanguagesWorkbookPage />} />
          <Route path="/campus/course/forming-basic-statements-german-a1-day-8" element={<FormingBasicStatementsPage />} />
          <Route path="/campus/course/a1-day-9-nominative-and-accusative-cases" element={<A1Day9NominativeAccusativeGrammarPage />} />
          <Route path="/campus/course/german-numbers-1-10-with-pronunciation" element={<GermanNumbersGrammarPage />} />
          <Route path="/campus/course/objects-and-colors-chapter-6" element={<ObjectsAndColorsPage />} />
          <Route path="/campus/course/the-12-hour-clock-system-in-german-chapter-7" element={<TwelveHourClockPage />} />
          <Route
            path="/campus/course/a1-day-12-the-24-hour-clock-and-dates"
            element={<A1Day12TwentyFourHourClockDatesPage />}
          />
          <Route path="/campus/course/modal-verbs-day-14-3-6" element={<A1Day14ModalVerbsWorkbookPage />} />
          <Route path="/campus/course/food-and-negation-day-16-9-10" element={<A1Day16FoodAndNegationGrammarPage />} />
          <Route
            path="/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook"
            element={<A1Day16FoodAndDailyLifeWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook"
            element={<A1Day16FoodAndNegationKapitel10WorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook"
            element={<A1Day17InstructionsDirectionsKapitel11WorkbookPage />}
          />
          <Route path="/campus/course/a1-day-21-weather-workbook" element={<A1Day21WeatherWorkbookPage />} />
          <Route path="/campus/course/a1-day-22-health-and-body-parts-workbook" element={<A1Day22HealthBodyPartsWorkbookPage />} />
          <Route
            path="/campus/course/a1-day-4-numbers-for-beginners-workbook"
            element={<A1Day4NumbersForBeginnersWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-chapter-3-asking-about-prices-workbook"
            element={<A1Chapter3AskingAboutPricesWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-chapter-5-german-cases-workbook"
            element={<A1Chapter5GermanCasesWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-10-objects-colors-possessive-articles-workbook"
            element={<A1Day10ObjectsColorsPossessiveArticlesWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-11-understanding-time-workbook"
            element={<A1Day11UnderstandingTimeWorkbookPage />}
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
            path="/campus/course/a1-day-3-kapitel-1-2-grammar-notes"
            element={<A1Day3Kapitel12GrammarNotesPage />}
          />
          <Route
            path="/campus/course/personen-beschreiben-1-2-grammar-notes"
            element={<A2Day2Kapitel12GrammarNotesPage />}
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
          <Route
            path="/campus/course/relativsaetze-die-der-das-wohnung-suchen-3-7-notes"
            element={<A2Day7RelativeClausesWohnungGrammarPage />}
          />
          <Route
            path="/campus/course/imperativ-rezepte-und-essen-3-8-grammar-notes"
            element={<A2Day8ImperativeGrammarPage />}
          />
          <Route
            path="/campus/course/perfekt-urlaub-4-9-grammar-notes"
            element={<A2Day9PerfektGrammarPage />}
          />
          <Route
            path="/campus/course/praeteritum-tourismus-und-traditionelle-feste-4-10-grammar-notes"
            element={<A2Day10PraeteritumGrammarPage />}
          />
          <Route
            path="/campus/course/unterwegs-verkehrsmittel-vergleichen-4-11-grammar-notes"
            element={<A2Day11ComparativeFormsGrammarPage />}
          />
          <Route
            path="/campus/course/mein-traumberuf-5-12-grammar-notes"
            element={<A2Day12MeinTraumberufGrammarPage />}
          />
          <Route
            path="/campus/course/modalverben-im-praeteritum-vorstellungsgespraech-5-13-grammar-notes"
            element={<A2Day13VorstellungsgespraechModalverbenPraeteritumGrammarPage />}
          />
          <Route
            path="/campus/course/beruf-und-karriere-5-14-um-zu-grammar-notes"
            element={<A2Day14BerufUndKarriereUmZuGrammarPage />}
          />
          <Route
            path="/campus/course/mein-lieblingssport-6-15-seit-dativ-praesens-grammar-notes"
            element={<A2Day15MeinLieblingssportSeitDativGrammarPage />}
          />
          <Route
            path="/campus/course/wohlbefinden-und-entspannung-6-16-reflexive-verben-grammar-notes"
            element={<A2Day16WohlbefindenReflexiveVerbenGrammarPage />}
          />
          <Route
            path="/campus/course/die-bank-anrufen-7-18-hoefliche-fragen-und-bitten-grammar-notes"
            element={<A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage />}
          />
          <Route
            path="/campus/course/einkaufen-wo-und-wie-7-19-oder-denn-grammar-notes"
            element={<A2Day19EinkaufenOderDennGrammarPage />}
          />
          <Route
            path="/campus/course/typische-reklamationssituationen-7-20-hoefliche-bitten-und-begruendungen-grammar-notes"
            element={<A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage />}
          />
          <Route
            path="/campus/course/ein-wochenende-planen-8-21-wenn-ob-falls-grammar-notes"
            element={<A2Day21EinWochenendePlanenWennObFallsGrammarPage />}
          />
          <Route
            path="/campus/course/die-woche-planung-8-22-praesens-future-time-phrases-modalverben-grammar-notes"
            element={<A2Day22DieWochePlanungGrammarPage />}
          />
          <Route
            path="/campus/course/wie-kommst-du-zur-schule-zur-arbeit-9-23-praepositionen-mit-verkehrsmitteln-grammar-notes"
            element={<A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage />}
          />
          <Route
            path="/campus/course/einen-urlaub-planen-9-24-final-a2-grammar-notes"
            element={<A2Day24EinenUrlaubPlanenGrammarPage />}
          />
          <Route
            path="/campus/course/ueber-die-zukunft-sprechen-10-28-final-a2-grammar-notes"
            element={<A2Day28UeberDieZukunftSprechenGrammarPage />}
          />
          <Route path="/campus/course/a1-day-0-orientation-and-knowledge-test-workbook" element={<A1Day0OrientationKnowledgeTestWorkbookPage />} />
          <Route path="/campus/course/a2-day-0-orientation-and-knowledge-test-workbook" element={<A2Day0OrientationKnowledgeTestWorkbookPage />} />
          <Route path="/campus/course/b1-day-0-orientation-and-knowledge-test-workbook" element={<B1Day0OrientationKnowledgeTestWorkbookPage />} />
          <Route path="/campus/course/b2-day-0-self-learning-orientation-workbook" element={<B2Day0SelfLearningOrientationWorkbookPage />} />
          <Route path="/campus/course/c1-day-0-progression-workbook" element={<C1Day0ProgressionWorkbookPage />} />
          <Route path="/campus/course/course-structure" element={<CourseStructurePage />} />
          <Route path="/campus/course/resource-viewer" element={<CourseResourceViewerPage />} />
          <Route path="/campus/course/full-class-calendar/:className" element={<FullClassCalendarPage />} />
          <Route path="/attendance/:className" element={<LegacyAttendanceRedirect />} />

          <Route path="/exams" element={<Navigate to="/exams/overview" replace />} />
          <Route path="/exams/:section" element={<ExamArea onBack={goHome} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isOnboarding ? <StudyBuddyBar studentProfile={studentProfile} /> : null}
    </div>
  );
};

const LegacyAttendanceRedirect = () => {
  const { className = "" } = useParams();
  return <Navigate to={`/campus/course/full-class-calendar/${encodeURIComponent(className)}`} replace />;
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

  const resolvedSection = useMemo(
    () =>
      getPreferredSection(allowedSections, section || defaultSection, tabStructure, {
        allowHidden: Boolean(section),
      }),
    [allowedSections, defaultSection, section, tabStructure]
  );

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
    if (!tabStorageKey || !getMainTabForSection(resolvedSection, tabStructure)) return;
    localStorage.setItem(tabStorageKey, resolvedSection);
  }, [resolvedSection, tabStorageKey, tabStructure]);

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

  const campusHeroSections = new Set(["speech", "account"]);
  const showCampusHero = campusHeroSections.has(resolvedSection);
  const campusHeroTitle =
    resolvedSection === "speech" ? t("appNav.campusTabs.speech") : resolvedSection === "account" ? t("appNav.campusTabs.account") : "";

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

      {showCampusHero ? (
        <section
          style={{
            ...styles.card,
            margin: "0 0 12px",
            minHeight: 160,
            display: "grid",
            alignContent: "end",
            gap: 4,
            color: "#ffffff",
            backgroundImage:
              "linear-gradient(115deg, rgba(15, 23, 42, 0.76), rgba(30, 64, 175, 0.5)), url('/learning-space-hero.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label={`${campusHeroTitle} hero banner`}
        >
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", opacity: 0.92 }}>
            Falowen Campus
          </p>
          <h2 style={{ margin: 0 }}>{campusHeroTitle}</h2>
        </section>
      ) : null}

      {resolvedSection === "course" && allowedSections.course ? (
        <CourseTab
          defaultLevel={campusStudentProfile?.level}
          defaultClassName={campusStudentProfile?.className}
          program={campusStudentProfile?.program}
        />
      ) : null}
      {resolvedSection === "examFile" && allowedSections.examFile ? <MyExamFilePage /> : null}
      {resolvedSection === "attendance" && allowedSections.attendance ? <AttendanceTab /> : null}
      {resolvedSection === "grammar" && allowedSections.grammar ? <GrammarQuestionTab /> : null}
      {resolvedSection === "writing" && allowedSections.writing ? <LetterPracticePage mode="campus" /> : null}
      {resolvedSection === "speech" && allowedSections.speech ? <SpeechTrainerPage /> : null}
      {resolvedSection === "vocab" && allowedSections.vocab ? <VocabExamPage /> : null}
      {resolvedSection === "submit" && allowedSections.submit ? <AssignmentSubmissionPage /> : null}
      {resolvedSection === "results" && allowedSections.results ? <StudentResultsPage /> : null}
      {resolvedSection === "discussion" && allowedSections.discussion ? <ClassDiscussionPage /> : null}
      {resolvedSection === "account" && allowedSections.account ? <AccountSettings /> : null}
      <AttendanceCheckinCard />
      {resolvedSection === "tutor-marking" && allowedSections["tutor-marking"] ? <TutorMarkingPage /> : null}
    </>
  );
};

const ExamArea = ({ onBack }) => {
  const { t } = useTranslation();
  const { section } = useParams();
  const navigate = useNavigate();
  const { level, setLevel } = useExam();
  const { studentProfile } = useAuth();

  const lastVisitStorageKey = "falowen_exam_last_visit";
  const lastSectionStorageKey = "falowen_exam_last_section";

  const examSection = useMemo(() => {
    if (
      [
        "question",
        "speaking",
        "writing",
        "resources",
        "file",
        "vocab",
        "horen",
        "lesen",
      ].includes(section)
    ) {
      return section;
    }
    return "question";
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


  const profileExamLevel = useMemo(() => {
    const normalized = String(studentProfile?.level || "").toUpperCase();
    return ALLOWED_LEVELS.includes(normalized) ? normalized : "";
  }, [studentProfile?.level]);

  useEffect(() => {
    if (profileExamLevel && profileExamLevel !== level) {
      setLevel(profileExamLevel);
    }
  }, [level, profileExamLevel, setLevel]);

  const tabs = [
    { key: "question", label: t("appNav.examTabs.question") },
    { key: "lesen", label: t("appNav.examTabs.lesen") },
    { key: "speaking", label: t("appNav.examTabs.speaking") },
    { key: "writing", label: t("appNav.examTabs.writing") },
    { key: "vocab", label: t("appNav.examTabs.vocab") },
    { key: "horen", label: t("appNav.examTabs.horen") },
    { key: "resources", label: t("appNav.examTabs.resources") },
    { key: "file", label: t("appNav.examTabs.file") },
  ];

  const examHeroConfig = {
    question: {
      label: t("appNav.examTabs.question"),
      image: "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
    lesen: {
      label: t("appNav.examTabs.lesen"),
      image: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
    speaking: {
      label: t("appNav.examTabs.speaking"),
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
    writing: {
      label: t("appNav.examTabs.writing"),
      image: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
    vocab: {
      label: t("appNav.examTabs.vocab"),
      image: "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
    horen: {
      label: t("appNav.examTabs.horen"),
      image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
    resources: {
      label: t("appNav.examTabs.resources"),
      image: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
    file: {
      label: t("appNav.examTabs.file"),
      image: "https://images.pexels.com/photos/1005324/pexels-photo-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
  };
  const activeExamHero = examHeroConfig[examSection];

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
              Exam level is selected automatically from your student profile
            </label>
            <select
              id="exam-level-selector"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              disabled={Boolean(profileExamLevel)}
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

        {activeExamHero ? (
          <section
            style={{
              ...styles.card,
              margin: 0,
              minHeight: 180,
              display: "grid",
              alignContent: "end",
              gap: 4,
              color: "#ffffff",
              backgroundImage:
                `linear-gradient(115deg, rgba(15, 23, 42, 0.8), rgba(29, 78, 216, 0.56)), url(${activeExamHero.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            role="img"
            aria-label={`${activeExamHero.label} hero banner`}
          >
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", opacity: 0.92 }}>
              Falowen Exam Coach
            </p>
            <h2 style={{ margin: 0 }}>{activeExamHero.label}</h2>
          </section>
        ) : null}
      </div>

      {examSection === "question" ? <QuestionOfDayPage /> : null}
      {examSection === "speaking" ? <SpeakingPage /> : null}
      {examSection === "writing" ? <WritingPage mode="exam" /> : null}
      {examSection === "vocab" ? <VocabExamPage /> : null}
      {examSection === "horen" ? <HorenPage /> : null}
      {examSection === "lesen" ? <LesenPage /> : null}
      {examSection === "resources" ? <ExamResources /> : null}
      {examSection === "file" ? <MyExamFilePage /> : null}
    </>
  );
};
