import { C1StudyMaterialLayout } from "./components/C1StudyPartner";
import { normalizeCourseLevel } from "./utils/levelAccess";
import SwahiliB1Day28Workbook from "./components/SwahiliB1Day28Workbook";
import SwahiliB1Day26Workbook from "./components/SwahiliB1Day26Workbook";
import SwahiliB1Day27Workbook from "./components/SwahiliB1Day27Workbook";
import SwahiliDayFiveWorkbook from "./components/SwahiliDayFiveWorkbook";
import SwahiliCourseBook from "./components/SwahiliCourseBook";
import SwahiliDaySixWorkbook from "./components/SwahiliDaySixWorkbook";
import SwahiliA1PracticeWorkbook from "./components/SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "./data/swahili/a1PracticeUnits";
import { getSwahiliCampusRoute, matchSwahiliPreview } from "./utils/swahiliCourseRoute";
import { SWAHILI_RESOURCE_SECTIONS, getCampusProgram, getProgramCampusTabs, getProgramAllowedSections, getProgramCourseRedirect } from "./utils/campusProgram";
import AccountDeletionBoundary from "./components/AccountDeletion";
import { AssessmentRulesNotice, AssessmentStudySupport } from "./components/AssessmentSupport";
import ExamStudyPartner from "./components/ExamStudyPartner";
import { canShowExamStudyPartner } from "./utils/examStudyPartner";
import { isMockAssessmentRoute } from "./utils/assessmentRestrictions";
import { MOCK_EXAM_CATALOG } from "./data/mockExamCatalog";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ExamProvider, useExam } from "./context/ExamContext";
import { useAccessLock, examLockInfo } from "./components/AccessLockDialog";
import { TrialExam } from "./context/TrialCatalogContext";
import CourseTab from "./components/CourseTab";
import NextLevelPreviewPage from "./components/NextLevelPreviewPage";
import CourseLessonPage from "./components/CourseLessonPage";
import AutoWorkbookStartGuide from "./components/AutoWorkbookStartGuide";
import BookPdfDownloadInjector from "./components/BookPdfDownloadInjector";
import BookStoreCheckout from "./components/BookStoreCheckout";
import ChatGPTConnectPage from "./components/ChatGPTConnectPage";
import CampusMusicPage from "./components/CampusMusicPage";
import CampusBooksPage from "./components/CampusBooksPage";
import ExamGuideComingSoon from "./components/ExamGuideComingSoon";
import AuthGate from "./components/AuthGate";
import SignUpPage from "./components/SignUpPage";
import { MockExamSignupPage, MockExamCheckoutPage, MockExamOnlyGate, PaymentOptionsPage, isMockPortal } from "./components/MockExamCommerce";
import LandingPage from "./components/LandingPage";
import HealthIndicator from "./components/HealthIndicator";
import AssignmentSubmissionPage from "./components/AssignmentSubmissionPage";
import CourseTypeSettings from "./components/CourseTypeSettings";
import AccountSettings from "./components/AccountSettings";
import ClassDiscussionPage from "./components/ClassDiscussionPage";
import GrammarQuestionTab from "./components/GrammarQuestionTab";
import AttendanceTab from "./components/AttendanceTab";
import ClassMembersTab from "./components/ClassMembersTab";
import SpeechTrainerPage from "./components/SpeechTrainerPage";
import LetterPracticePage from "./components/LetterPracticePage";
import A1GoetheReadingMockTeil1Preview from "./components/A1GoetheReadingMockTeil1Preview";
import A1GoetheReadingMockTeil2Preview from "./components/A1GoetheReadingMockTeil2Preview";
import A1GoetheReadingMockTeil3Preview from "./components/A1GoetheReadingMockTeil3Preview";
import A1GoetheListeningMockPreview from "./components/A1GoetheListeningMockPreview";
import A1GoetheWritingMockPreview from "./components/A1GoetheWritingMockPreview";
import A1GoetheSpeakingMockPreview from "./components/A1GoetheSpeakingMockPreview";
import A1FinalMockExamPage from "./components/A1FinalMockExamPage";
import A2GoetheReadingMockPreview from "./components/A2GoetheReadingMockPreview";
import A2GoetheListeningMockTeil1Preview from "./components/A2GoetheListeningMockTeil1Preview";
import A2GoetheListeningMockTeil2Preview from "./components/A2GoetheListeningMockTeil2Preview";
import A2GoetheListeningMockTeil3Preview from "./components/A2GoetheListeningMockTeil3Preview";
import A2GoetheListeningMockTeil4Preview from "./components/A2GoetheListeningMockTeil4Preview";
import A2GoetheWritingMockPreview from "./components/A2GoetheWritingMockPreview";
import A2GoetheSpeakingMockTeil1Preview from "./components/A2GoetheSpeakingMockTeil1Preview";
import A2GoetheSpeakingMockTeil2Preview from "./components/A2GoetheSpeakingMockTeil2Preview";
import A2GoetheSpeakingMockTeil3Preview from "./components/A2GoetheSpeakingMockTeil3Preview";
import A2FinalMockExamPage from "./components/A2FinalMockExamPage";
import A2Mock2Lesen from "./components/A2Mock2Lesen";
import A2Mock2Schreiben from "./components/A2Mock2Schreiben";
import A2Mock2Hoeren from "./components/A2Mock2Hoeren";
import A2Mock3Hoeren from "./components/A2Mock3Hoeren";
import A2Mock3ExamHub from "./components/A2Mock3ExamHub";
import A2Mock2Sprechen from "./components/A2Mock2Sprechen";
import A2Mock2ExamHub from "./components/A2Mock2ExamHub";
import A2KombiMockExamPage from "./components/A2KombiMockExamPage";
import B1FinalMockExamPage from "./components/B1FinalMockExamPage";
import B1Mock2Hoeren from "./components/B1Mock2Hoeren";
import B1Mock3Hoeren from "./components/B1Mock3Hoeren";
import B1Mock4Hoeren from "./components/B1Mock4Hoeren";
import B1Mock4Lesen from "./components/B1Mock4Lesen";
import B1Mock4Schreiben from "./components/B1Mock4Schreiben";
import B1Mock3Schreiben from "./components/B1Mock3Schreiben";
import B1Mock3Speaking from "./components/B1Mock3Speaking";
import B1Mock4Speaking from "./components/B1Mock4Speaking";
import B2FinalMockExamPage from "./components/B2FinalMockExamPage";
import SpeakingExamIntroPage from "./components/SpeakingExamIntroPage";
import CourseStructurePage from "./components/CourseStructurePage";
import A1Day0OrientationKnowledgeTestWorkbookPage from "./components/A1Day0OrientationKnowledgeTestWorkbookPage";
import A2Day0OrientationKnowledgeTestWorkbookPage from "./components/A2Day0OrientationKnowledgeTestWorkbookPage";
import B1Day0OrientationKnowledgeTestWorkbookPage from "./components/B1Day0OrientationKnowledgeTestWorkbookPage";
import B2Day0SelfLearningOrientationWorkbookPage from "./components/B2Day0SelfLearningOrientationWorkbookPage";
import C1Day0ProgressionWorkbookPage from "./components/C1Day0ProgressionWorkbookPage";
import CourseResourceViewerPage from "./components/CourseResourceViewerPage";
import FullClassCalendarPage from "./components/FullClassCalendarPage";
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
import A1Day2UnifiedWorkbookPage from "./components/A1Day2UnifiedWorkbookPage";
import A1Day2UnifiedGrammarPage from "./components/A1Day2UnifiedGrammarPage";
import A1Day3GermanAlphabetReviewingWorkbookPage from "./components/A1Day3GermanAlphabetReviewingWorkbookPage";
import A1Day3SchreibenSprechenKapitel11WorkbookPage, { A1_DAY3_PRACTICE_VIDEOS } from "./components/A1Day3SchreibenSprechenKapitel11WorkbookPage";
import A1Day3Kapitel12WorkbookPage from "./components/A1Day3Kapitel12WorkbookPage";
import A1Day3Kapitel12GrammarNotesPage from "./components/A1Day3Kapitel12GrammarNotesPage";
import A1Day3PronounsIntroducingYourselfWorkbookPage from "./components/A1Day3PronounsIntroducingYourselfWorkbookPage";
import A1Day5IntroducingYourselfArticlesWorkbookPage from "./components/A1Day5IntroducingYourselfArticlesWorkbookPage";
import A1WorkbookRoutePage from "./components/A1WorkbookRoutePage";
import A1PracticeBookLayout from "./components/A1PracticeBookLayout";
import A2StudyMaterialLayout from "./components/A2StudyMaterialLayout";
import B1StudyMaterialLayout from "./components/B1StudyMaterialLayout";
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
import { getLessonRadioResource } from "./data/lessonRadioDictionary";
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
import GoetheExamOrientationPage from "./components/GoetheExamOrientationPage";
import B1Day21LebensformenHeuteWorkbookPage from "./components/B1Day21LebensformenHeuteWorkbookPage";
import B1Day21LebensformenHeuteGrammarNotesPage from "./components/B1Day21LebensformenHeuteGrammarNotesPage";
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
import ExamWritingWorkspace from "./components/ExamWritingWorkspace";
import VocabExamPage from "./components/VocabExamPage";
import { useAuth } from "./context/AuthContext";
import { routeEnrollmentLevel } from "./utils/levelEnrollmentAccess";
import { activeOwnerTestingLevel, isCourseTestingOwner, isOwnerTestingCoursePath, ownerTestingLevels } from "./utils/ownerCourseTesting";
import { useToast } from "./context/ToastContext";
import { announceExamSuccess } from "./services/interactionFeedback";
import { isFirebaseConfigured } from "./firebase";
import { styles } from "./styles";
import "./App.css";
import StudentResultsPage from "./components/StudentResultsPage";
import GeneralHome from "./components/GeneralHome";
import OnboardingChecklist from "./components/OnboardingChecklist";
import SpeakingPage from "./components/SpeakingPage";
import HorenPage from "./components/HorenPage";
import ListeningPracticeSamplePage from "./components/ListeningPracticeSamplePage";
import LesenPage from "./components/LesenPage";
import StudyCalendarPage from "./components/StudyCalendarPage";
import QuestionOfDayPage from "./components/QuestionOfDayPage";
import C1SelfLearningCourse from "./components/C1SelfLearningCourse";
import C1ExamPreparationPage from "./components/C1ExamPreparationPage";
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
import SetupCheckpoint from "./components/SetupCheckpoint";
import PaymentComplete from "./components/PaymentComplete";
import LiveSpeakPage from "./components/LiveSpeakPage";
import MyExamFilePage from "./components/MyExamFilePage";
import SwahiliExamSection from "./components/SwahiliExamSection";
import ExamsOverviewPage from "./components/ExamsOverviewPage";
import PersonalExamCountdown from "./components/PersonalExamCountdown";
import MockExamLibraryPage from "./components/MockExamLibraryPage";
import SeoLandingPage from "./components/SeoLandingPage";
import GermanLevelSeoPage from "./components/GermanLevelSeoPage";
import OfflineBanner from "./components/OfflineBanner";
import StudyBuddyBar from "./components/StudyBuddyBar";
import AttendanceCheckinCard from "./components/AttendanceCheckinCard";
import PlacementTestPage from "./components/PlacementTestPage";
import PublicStudentGuidePage from "./components/PublicStudentGuidePage";
import PublicUpcomingClassesPage from "./components/PublicUpcomingClassesPage";
import PublicExamPracticePage from "./components/PublicExamPracticePage";
import PublicAdmissionsVisitorGuidePage from "./components/PublicAdmissionsVisitorGuidePage";
import TutorMarkingPage from "./pages/TutorMarkingPage";
import { toDateMs } from "./lib/dateUtils";
import { getTrialLifecycleState } from "./lib/trialAccess";
import { isApprovedUniversityStudent, isPendingUniversityStudent } from "./lib/universityInvitations";
import CourseDiscountPage from "./components/CourseDiscountPage";
import { getPartialPaymentAccessEndMs, hasClearedBalance, normalizePaymentStatus } from "./lib/paymentStatus";
import { changeInterfaceLanguage, restoreAccountInterfaceLanguage } from "./i18n";
import { trackAdmissionsEngagement } from "./services/admissionsEngagementService";

const getTabStructure = (t) => {
  return [
    { key: "course", label: t("appNav.sections.courseBook"), section: "course" },
    { key: "music", label: "Music", section: "music" },
    { key: "books", label: "Books", section: "books" },
    { key: "attendance", label: t("appNav.sections.attendance"), section: "attendance" },
    { key: "results", label: t("appNav.tabs.results"), section: "results" },
    { key: "vocab", label: t("appNav.sections.vocab"), section: "vocab" },
    { key: "classMembers", label: t("appNav.sections.classMembers"), section: "classMembers" },
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

const withA1PracticeBook = (day, chapter, title, overview, workbookPage, aiVideo = null) => (
  <A1PracticeBookLayout day={day} chapter={chapter} title={title} overview={overview} aiVideo={aiVideo}>
    {workbookPage}
  </A1PracticeBookLayout>
);

const withRadioWorkbookGate = (level, day, workbookPage) =>
  getLessonRadioResource(level, day) ? (
    <RadioFirstWorkbookGate level={level} day={day}>{workbookPage}</RadioFirstWorkbookGate>
  ) : (
    workbookPage
  );

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
    return "german";
  });
  const location = useLocation();
  const navigate = useNavigate();

  const role = useMemo(() => (studentProfile?.role || "student").toLowerCase(), [studentProfile?.role]);
  const isStaff = role === "admin" || role === "tutor" || studentProfile?.isTutor === true;
  const campusProgram = getCampusProgram(studentProfile);
  const isEnrolled = isStaff || Boolean(studentProfile?.className || studentProfile?.level);
  const levelToken = String(studentProfile?.level || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] || "";
  const isSelfLearningTrack = !isStaff && ["B2", "C1"].includes(levelToken);
  const tabStructure = useMemo(
    () => getProgramCampusTabs(getTabStructure(t), studentProfile),
    [t, campusProgram]
  );

  const allowedSections = useMemo(
    () => getProgramAllowedSections({
      submit: isStaff,
      course: true,
      music: true,
      books: true,
      vocab: true,
      attendance: (isEnrolled || isStaff) && !isSelfLearningTrack,
      results: isEnrolled || isStaff,
      discussion: (isEnrolled || isStaff) && !isSelfLearningTrack,
      classMembers: (isEnrolled || isStaff) && !isSelfLearningTrack,
      account: true,
      "tutor-marking": isStaff,
    }, studentProfile),
    [isEnrolled, isSelfLearningTrack, isStaff, campusProgram]
  );

  const tabStorageKey = user?.uid ? `falowen:last-tab:${user.uid}` : null;
  const savedSection = useMemo(() => (tabStorageKey ? localStorage.getItem(tabStorageKey) : null), [tabStorageKey]);

  useEffect(() => {
    localStorage.setItem(programStorageKey, signupProgram);
  }, [programStorageKey, signupProgram]);

  useEffect(() => {
    if (location.pathname.startsWith("/signup")) {
      const params = new URLSearchParams(location.search);
      setSignupProgram("german");
      setAuthMode("signup");

      const engagementRef = String(params.get("ref") || "").trim();
      if (engagementRef) {
        trackAdmissionsEngagement({
          ref: engagementRef,
          event: "registration_click",
          classSlug: String(params.get("class") || "").trim(),
          source: String(params.get("source") || "signup"),
          path: location.pathname,
        });
      }
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
    () => studentProfile?.program === "swahili" ? "course" : getPreferredSection(allowedSections, savedSection, tabStructure),
    [allowedSections, savedSection, tabStructure, studentProfile?.program]
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
  const trialLifecycle = useMemo(
    () => getTrialLifecycleState(studentProfile),
    [studentProfile]
  );
  const upgradeCarryoverMs = useMemo(() => {
    if (!studentProfile?.upgradeCarryoverUntil) return NaN;
    const parsed = toDateMs(studentProfile.upgradeCarryoverUntil);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [studentProfile?.upgradeCarryoverUntil]);
  const balanceCleared = useMemo(
    () => hasClearedBalance(studentProfile?.balanceDue),
    [studentProfile?.balanceDue]
  );
  const partialPaymentAccessEndMs = useMemo(
    () => getPartialPaymentAccessEndMs(studentProfile),
    [studentProfile]
  );

  const hasActiveContract = Number.isFinite(contractEndMs) && contractEndMs > Date.now();
  const hasActivePartialPaymentAccess =
    paymentStatus === "partial" &&
    Number.isFinite(partialPaymentAccessEndMs) &&
    partialPaymentAccessEndMs > Date.now();
  const hasActiveTrial = trialLifecycle.active;
  const universityApproved = isApprovedUniversityStudent(studentProfile);
  const universityPending = isPendingUniversityStudent(studentProfile);
  const universityContractEnded = universityApproved && Number.isFinite(contractEndMs) && !hasActiveContract;
  const hasComplimentaryUniversityAccess = universityApproved && !universityContractEnded;
  const hasQueuedUpgradeAccess =
    String(studentProfile?.contractMergeMode || "").toLowerCase() === "append_after_active_contract" &&
    Number.isFinite(upgradeCarryoverMs) &&
    upgradeCarryoverMs > Date.now();
  const canAccessLegacy =
    !Number.isFinite(contractEndMs) && (["paid", "partial"].includes(paymentStatus) || balanceCleared);
  const awaitingPayment =
    Boolean(studentProfile) &&
    !isStaff &&
    (universityPending || universityContractEnded ||
      !(hasActiveContract || hasActivePartialPaymentAccess || hasActiveTrial || hasQueuedUpgradeAccess || canAccessLegacy || balanceCleared || hasComplimentaryUniversityAccess));

  // Visitors can preview Kiswahili; signed-in learners follow their Campus programme.
  const swahiliPreview = matchSwahiliPreview(location.pathname);
  if (swahiliPreview) {
    // Wait for Firebase to resolve the session so signed-in students never
    // briefly see the public preview or lose their personal course progress.
    if (isFirebaseConfigured && authLoading) {
      return (
        <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
          <div style={styles.card}>{t("appStatus.authLoading")}</div>
        </div>
      );
    }

    const campusRoute = getSwahiliCampusRoute({
      pathname: location.pathname,
      search: location.search,
      user,
      studentProfile,
    });
    if (campusRoute) return <Navigate to={campusRoute} replace />;

    if (user && studentProfile && !isStaff) return <Navigate to="/campus/course" replace />;

    if (swahiliPreview[1] === "day-5") return <SwahiliDayFiveWorkbook preview />;
    if (swahiliPreview[1] === "day-6") return <SwahiliDaySixWorkbook basePath="/swahili" preview />;
    const practiceLesson = SWAHILI_A1_PRACTICE_UNITS[swahiliPreview[1]?.slice(4)];
    if (practiceLesson) return <SwahiliA1PracticeWorkbook key={practiceLesson.day} lesson={practiceLesson} preview />;
    return <SwahiliCourseBook day={swahiliPreview[1] === "day-1" ? 1 : null} basePath="/swahili" preview />;
  }

  if (location.pathname === "/visitor-guide" || location.pathname === "/visitor-guide/") {
    return <Navigate to={`/about-us${location.search}${location.hash}`} replace />;
  }
  if (location.pathname === "/about-us" || location.pathname === "/about-us/") {
    return <PublicAdmissionsVisitorGuidePage />;
  }

  const publicExamPracticeMatch = location.pathname.match(/^\/exam-practice(?:\/(a1|a2|b1|b2|c1|c2))?\/?$/i);
  if (publicExamPracticeMatch) {
    return <PublicExamPracticePage level={String(publicExamPracticeMatch[1] || "").toUpperCase()} />;
  }

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

  const signupParams = new URLSearchParams(location.search);
  const discountCode = signupParams.get("discount") || "";
  if (!signupParams.has("invite") && /^\/(signup|login)\/?$/.test(location.pathname) && /^[a-f0-9]{24}$/.test(discountCode)) {
    return <CourseDiscountPage key={discountCode} code={discountCode} user={user} student={studentProfile}
      renderSignup={(quote, onLogin, onBack) => <SignUpPage courseDiscount={quote} onLogin={onLogin} onBack={onBack} />}
      renderLogin={(onSignup, onBack) => <AuthGate initialMode="login" onBack={onBack} onSwitchToSignup={onSignup} />}
      onExit={() => { setAuthMode("landing"); navigate("/", { replace: true }); }} />;
  }

  if (/^\/chatgpt\/connect\/?$/.test(location.pathname)) {
    return user
      ? <ChatGPTConnectPage user={user} studentProfile={studentProfile} />
      : <AuthGate initialMode="login" onBack={() => navigate("/")} onSwitchToSignup={() => navigate("/signup")} />;
  }

  if (location.pathname === "/books" || location.pathname === "/books/") return <BookStoreCheckout catalogOnly />;
  if (location.pathname === "/books/deutsch-a1-course-workbook" || location.pathname === "/books/deutsch-a1-course-workbook/") return <BookStoreCheckout detailBook="a1" />;
  if (location.pathname === "/books/how-to-unlock-your-german-writing-skills-a1-c2" || location.pathname === "/books/how-to-unlock-your-german-writing-skills-a1-c2/") return <BookStoreCheckout detailBook="writing" />;
  if (location.pathname === "/books/deutsch-a2-course-workbook" || location.pathname === "/books/deutsch-a2-course-workbook/") return <BookStoreCheckout slug="deutsch-a2-course-workbook" />;
  if (location.pathname === "/books/deutsch-b1-course-workbook" || location.pathname === "/books/deutsch-b1-course-workbook/") return <BookStoreCheckout slug="deutsch-b1-course-workbook" />;
  if (location.pathname === "/books/german-a1-exam-preparation" || location.pathname === "/books/german-a1-exam-preparation/") return <BookStoreCheckout slug="german-a1-exam-preparation" />;
  const bookCheckout = location.pathname.match(/^\/books\/([^/]+)\/checkout\/?$/);
  if (bookCheckout) return <BookStoreCheckout slug={bookCheckout[1]} checkout />;
  if (location.pathname === "/books/complete") return <BookStoreCheckout completed />;
  const examGuide = location.pathname.match(/^\/books\/(goethe-a1-writing-model-exams|goethe-a2-four-skills-exam-guide|goethe-b1-four-skills-exam-guide)\/?$/);
  if (examGuide) return <ExamGuideComingSoon slug={examGuide[1]} />;

  if (location.pathname === "/payment-complete") {
    return <PaymentComplete />;
  }

  const seoMarkets = {
    "/learn-german-ghana": "Ghana",
    "/learn-german-nigeria": "Nigeria",
    "/learn-german-sierra-leone": "Sierra Leone",
    "/learn-german-africa": "Africa",
  };

  const germanLevelSeoMatch = location.pathname.match(/^\/learn-german-(a1|a2|b1|b2|c1|c2)\/?$/i);
  const germanExamSeoMatch = location.pathname.match(/^\/goethe-(a1|a2|b1|b2|c1|c2)-preparation\/?$/i);

  if (germanLevelSeoMatch || germanExamSeoMatch) {
    const seoLevel = String((germanLevelSeoMatch || germanExamSeoMatch)?.[1] || "a1").toUpperCase();
    const seoMode = germanExamSeoMatch ? "exam" : "course";
    return (
      <GermanLevelSeoPage
        level={seoLevel}
        mode={seoMode}
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

  if (seoMarkets[location.pathname]) {
    return (
      <SeoLandingPage
        market={seoMarkets[location.pathname]}
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
    return <Navigate to="/help" replace />;
  }

  if (location.pathname === "/help" || location.pathname === "/help/") {
    return <PublicStudentGuidePage />;
  }

  if (location.pathname === "/classes" || location.pathname === "/classes/") {
    return <PublicUpcomingClassesPage />;
  }

  if (location.pathname === "/learn-german-ghana/upcoming-classes") {
    return <PublicUpcomingClassesPage />;
  }

  if (location.pathname === "/mock/free-hoeren") return <ListeningPracticeSamplePage level="A1" sampleId="sample-1" freeTrial />;
  if (location.pathname === "/mock/payment") return <PaymentOptionsPage />;
  if (location.pathname === "/mock/account") return <CourseTypeSettings />;
  if (location.pathname === "/mock/register") return <MockExamSignupPage />;
  if (location.pathname === "/mock/checkout" || location.pathname === "/mock/complete") {
    return <MockExamCheckoutPage paymentReturn={location.pathname === "/mock/complete"} />;
  }

  if (!user) {
    // Keep a direct protected mock URL intact through sign-in so the learner
    // arrives at the exam they selected instead of returning to the homepage.
    if (location.pathname.startsWith("/campus/course/") || location.pathname.startsWith("/exams/")) {
      return <AuthGate initialMode="login" onBack={() => navigate("/")} onSwitchToSignup={() => isMockPortal() ? window.location.assign("https://www.falowen.app/signup") : setAuthMode("signup")} />;
    }
    if (authMode === "signup" && isMockPortal()) return <MockExamSignupPage />;
    if (authMode === "signup") {
      return <SignUpPage onLogin={() => setAuthMode("login")} onBack={() => setAuthMode("landing")} />;
    }

    if (authMode === "landing" && isMockPortal()) return <Navigate to="/login/" replace />;
    if (authMode === "landing") {
      return (
        <LandingPage
          onSignUp={() => navigate("/signup")}
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

  const isExamOnlyAccount = studentProfile?.accountType === "exam_only";
  if (isExamOnlyAccount) {
    return <MockExamOnlyGate>{(entitledLevels) => <ExamProvider entitledLevels={entitledLevels}><AppShell
      isStaff={isStaff}
      allowedSections={{ course: true, account: true, attendance: false, discussion: false, classMembers: false, submit: false }}
      availableTabs={tabStructure.filter(tab => isTabAvailable(tab, { course: true, account: true }))} defaultCampusSection="course" enableNotifications={enableNotifications}
      saveStudentProfile={saveStudentProfile} logout={logout} notificationStatus={notificationStatus}
      studentProfile={studentProfile} tabStructure={tabStructure} tabStorageKey={tabStorageKey} user={user}
    /></ExamProvider>}</MockExamOnlyGate>;
  }

  if (awaitingPayment && campusProgram === "german" && !universityPending && !universityContractEnded && ["expired_retained", "retention_ending_soon", "purge_due"].includes(trialLifecycle.key)) {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const browseSections = { course: true, account: true, results: true };
    const examPath = /^\/exams(?:\/|$)/.test(path) || Object.values(MOCK_EXAM_CATALOG).some(mock => mock.route === path);
    if (!examPath && !["/", "/campus", "/campus/course", "/campus/account", "/campus/results"].includes(path)) return <Navigate to="/campus/course" replace />;
    return <ExamProvider><AppShell browseOnly isStaff={false} allowedSections={browseSections}
      availableTabs={tabStructure.filter(tab => isTabAvailable(tab, browseSections))} defaultCampusSection="course"
      enableNotifications={enableNotifications} saveStudentProfile={saveStudentProfile} logout={logout}
      notificationStatus={notificationStatus} studentProfile={studentProfile} tabStructure={tabStructure}
      tabStorageKey={tabStorageKey} user={user} /></ExamProvider>;
  }

  if (awaitingPayment && !studentProfile?.managedEnrollmentLevels?.length) {
    if (universityPending || universityContractEnded) {
      return (
        <div style={{ ...styles.container, display: "grid", placeItems: "center", minHeight: "65vh" }}>
          <section style={{ ...styles.card, maxWidth: 560, width: "100%", display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>University of Hamburg · Kiswahili A1</h2>
            <strong>{universityContractEnded ? "Complimentary contract ended" : "Registration received · Awaiting instructor verification"}</strong>
            <p style={{ margin: 0 }}>{universityContractEnded
              ? "Contact your course coordinator if you need continued access."
              : "Your account is linked to Ruth's course. Once your enrolment is verified, you can use Falowen with complimentary access. No payment is required."}</p>
            <p style={{ margin: 0 }}>Student code: {studentProfile?.studentCode || studentProfile?.studentcode || "—"}</p>
            <button type="button" style={styles.secondaryButton} onClick={() => window.location.reload()}>Check access again</button>
          </section>
        </div>
      );
    }
    return <SetupCheckpoint />;
  }

  const programmeRedirect = getProgramCourseRedirect({
    pathname: location.pathname,
    studentProfile,
    isStaff,
  });
  if (programmeRedirect) return <Navigate to={programmeRedirect} replace />;

  // All logins on the exams subdomain enter the shared Exams Room, not the Course Book.
  if (isMockPortal() && (campusProgram !== "swahili" || isStaff) && !location.pathname.startsWith("/exams/") &&
      !Object.values(MOCK_EXAM_CATALOG).some(mock => mock.route === location.pathname && mock.status === "ready")) {
    return <Navigate to="/exams/overview" replace />;
  }

  return (
    <ExamProvider>
      <AppShell
        isStaff={isStaff}
        allowedSections={allowedSections}
        availableTabs={availableTabs}
        defaultCampusSection={defaultCampusSection}
        hasActiveTrial={hasActiveTrial}
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

export default function AccountProtectedApp() { return <AccountDeletionBoundary><App /></AccountDeletionBoundary>; }

const AppShell = ({
  isStaff,
  allowedSections,
  availableTabs,
  defaultCampusSection,
  hasActiveTrial = false,
  browseOnly = false,
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
  const { courseOptions, selectCourse } = useAuth();
  const isSwahiliCampus = getCampusProgram(studentProfile) === "swahili";
  const testingProgram = getCampusProgram(studentProfile);
  const [testingSelection,setTestingSelection] = useState(null);
  const testingOwner = isCourseTestingOwner(user) && Boolean(studentProfile) && !browseOnly && studentProfile?.accountType !== "exam_only";
  const testingLevel = activeOwnerTestingLevel({user,program:testingProgram,selection:testingSelection,studentProfile,browseOnly});
  const testingCoursePath = isOwnerTestingCoursePath(location.pathname,testingLevel,testingProgram);
  useEffect(()=>{setTestingSelection(null);},[user?.uid,testingProgram]);
  const changeTestingLevel = level => {
    if(!testingOwner)return;
    setTestingSelection(ownerTestingLevels(testingProgram).includes(level)?{uid:user.uid,program:testingProgram,level}:null);
    navigate("/campus/course",{replace:true});
  };
  const isOnboarding = location.pathname === "/onboarding";
  const mockAssessment = isMockAssessmentRoute(location.pathname);
  const onboardingRole = String(studentProfile?.role || "student").toLowerCase();
  const directSwahiliTrial = isSwahiliCampus && hasActiveTrial;
  const requiresOnboarding =
    studentProfile?.accountType !== "exam_only" &&
    !browseOnly &&
    !directSwahiliTrial &&
    !["admin", "tutor"].includes(onboardingRole) &&
    !Boolean(studentProfile?.isTutor) &&
    !Boolean(studentProfile?.onboardingCompleted);
  const interfaceLanguageOptions = useMemo(
    () => [
      { value: "en", label: t("interfaceLanguages.en") },
      { value: "de", label: t("interfaceLanguages.de") },
      { value: "fr", label: t("interfaceLanguages.fr") },
      { value: "sw", label: t("interfaceLanguages.sw") },
    ],
    [t]
  );

  const courseSelector = courseOptions?.length > 1 && (
    <label className="profile-menu__language">
      {t("uiLanguageFlow.courseLabel")}
      <select
        value={getCampusProgram(studentProfile)}
        aria-label={t("uiLanguageFlow.courseLabel")}
        onChange={(event) => {
          if (!courseOptions.includes(event.target.value)) return;
          selectCourse(event.target.value);
          navigate("/campus/course", { replace: true });
        }}
        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12 }}
      >
        {courseOptions.includes("german") && <option value="german">{t("signup.programs.german")}</option>}
        {courseOptions.includes("swahili") && <option value="swahili">{t("signup.programs.swahili")}</option>}
      </select>
    </label>
  );

  const subtitle = useMemo(() => {
    if (location.pathname.startsWith("/campus")) {
      return isSwahiliCampus ? "Kitabu cha Kiswahili · Tutor-guided learning" : t("appNav.subtitle.campus");
    }

    if (location.pathname.startsWith("/exams")) {
      return t("appNav.subtitle.exams");
    }

    return isSwahiliCampus ? t("uiLanguageFlow.swahiliSubtitle") : t("appNav.subtitle.default");
  }, [location.pathname, isSwahiliCampus, t]);

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

  const restoredLanguageForUid = useRef("");
  useEffect(() => {
    // Wait for the server's student profile: restoring from a shared-device
    // setting before the profile arrives would ignore the saved account choice.
    if (!user?.uid || !studentProfile || restoredLanguageForUid.current === user.uid) return;
    restoredLanguageForUid.current = user.uid;
    void restoreAccountInterfaceLanguage(user.uid, studentProfile.preferredInterfaceLanguage);
  }, [user?.uid, studentProfile, studentProfile?.preferredInterfaceLanguage]);

  const handleInterfaceLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    void changeInterfaceLanguage(nextLanguage, user?.uid);
    // Persist only deliberate changes. The login restore must never write on
    // every render or switch a student's German/Swahili course.
    if (user?.uid && studentProfile?.preferredInterfaceLanguage !== nextLanguage) {
      void saveStudentProfile({ preferredInterfaceLanguage: nextLanguage })
        .catch(() => showToast(t("interfaceLanguage.saveFailed"), "error"));
    }
  };

  if (directSwahiliTrial && (isOnboarding || /^\/signup(?:\/|$)/.test(location.pathname))) {
    return <Navigate to="/campus/course/swahili/day-1" replace />;
  }

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
          <h1 style={styles.title}>{isSwahiliCampus ? "Falowen · Kiswahili" : t("appNav.title")}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
        <div className="app-header-meta" style={{ display: "grid", gap: 6, justifyItems: "end" }}>
          <HealthIndicator />
          <div style={{ fontSize: 13, color: "#374151" }}>
            {t("appNav.signedInAs", { email: user.email })}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {courseSelector}
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
      {testingOwner && !isOnboarding && (testingLevel || location.pathname === "/campus/course" || location.pathname === "/campus/account") && <section aria-label="Developer testing access" style={{border:"1px solid #cbd5e1",borderRadius:12,padding:12,margin:"0 0 12px",display:"grid",gap:6}}>
        <strong>Developer testing access · {testingProgram==="swahili"?"Kiswahili":"German"}</strong>
        <label>Testing level <select aria-label="Developer testing level" value={testingLevel} onChange={event=>changeTestingLevel(event.target.value)}><option value="">Off · actual enrollment</option>{ownerTestingLevels(testingProgram).map(level=><option key={level} value={level}>{level}</option>)}</select></label>
        {testingLevel?<p role="status" style={{margin:0}}>Testing {testingLevel}. No enrollment or billing changes. This is live content, not a submission sandbox; avoid submitting test work. <button type="button" onClick={()=>changeTestingLevel("")}>Exit testing</button></p>:<small>Choose a level to inspect its Course Book. Switch language using the existing course menu. Resets when you reload or change language.</small>}
      </section>}

      {location.pathname.startsWith("/campus/course/") ? (
        <CampusQuickNavigation
          allowedSections={allowedSections}
          availableTabs={availableTabs}
          tabStructure={tabStructure}
        />
      ) : null}

      <main className="layout-main" style={{ minWidth: 0 }}>
        {!isOnboarding ? <AutoWorkbookStartGuide /> : null}
        {!isOnboarding ? <BookPdfDownloadInjector /> : null}
        <AssessmentRulesNotice restricted={mockAssessment} />
        {!isStaff && studentProfile?.blockedEnrollmentLevels?.length > 0 && <div role="status" style={{padding:12,marginBottom:12,border:"1px solid #f59e0b",borderRadius:8}}>Access paused for {studentProfile.blockedEnrollmentLevels.join(", ")}. Clear the outstanding balance or contact Falowen to confirm your contract. <Link to="/campus/account">View account</Link>.</div>}
        {!isStaff && (studentProfile?.levelEnrollmentCheckPending||studentProfile?.levelEnrollmentCheckError) && /^\/(?:campus\/course|exams)(?:\/|$)/.test(location.pathname) ? <p>{studentProfile?.levelEnrollmentCheckError?"Unable to verify enrollment. Refresh or contact support.":"Checking your enrollment access…"}</p> : !isStaff && !testingCoursePath && studentProfile?.blockedEnrollmentLevels?.includes(routeEnrollmentLevel(location.pathname,location.search,studentProfile)) ? <div role="alert"><h2>Course access paused</h2><p>This level has an overdue payment or ended contract. Your other levels and records are not deleted.</p><Link to="/campus/account">View account</Link> · <Link to="/campus/course">Back to courses</Link></div> : <Routes>
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
                browseOnly={browseOnly}
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
            path="/campus/:section/*"
            element={
              <CampusArea
                allowedSections={allowedSections}
                availableTabs={availableTabs}
                defaultSection={defaultCampusSection}
                onBack={goHome}
                studentProfile={studentProfile}
                tabStructure={tabStructure}
                tabStorageKey={tabStorageKey}
                testingLevel={testingLevel}
              />
            }
          />
          <Route path="/campus/examFile" element={<Navigate to="/exams/file" replace />} />
          <Route path="/campus/live-speak" element={<LiveSpeakPage />} />
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
                testingLevel={testingLevel}
              />
            }
          />
          <Route path="/campus/course/preview/:level" element={<NextLevelPreviewPage />} />
          <Route path="/campus/course/swahili/b1/day-26" element={
            isStaff || (testingCoursePath && testingProgram==="swahili" && testingLevel==="B1") || ["B1", "B2", "C1", "C2"].includes(normalizeCourseLevel(studentProfile?.level) || normalizeCourseLevel(studentProfile?.className))
              ? <SwahiliB1Day26Workbook key={user?.uid} uid={user?.uid} /> : <Navigate to="/campus/course" replace />
          } />
          <Route path="/campus/course/swahili/b1/day-27" element={
            isStaff || (testingCoursePath && testingProgram==="swahili" && testingLevel==="B1") || ["B1", "B2", "C1", "C2"].includes(normalizeCourseLevel(studentProfile?.level) || normalizeCourseLevel(studentProfile?.className))
              ? <SwahiliB1Day27Workbook key={user?.uid} uid={user?.uid} /> : <Navigate to="/campus/course" replace />
          } />
          <Route path="/campus/course/swahili/b1/day-28" element={
            isStaff || (testingCoursePath && testingProgram==="swahili" && testingLevel==="B1") || ["B1", "B2", "C1", "C2"].includes(normalizeCourseLevel(studentProfile?.level) || normalizeCourseLevel(studentProfile?.className))
              ? <SwahiliB1Day28Workbook key={user?.uid} uid={user?.uid} /> : <Navigate to="/campus/course" replace />
          } />
          <Route path="/campus/course/swahili/day-1" element={<SwahiliCourseBook day={1} basePath="/campus/course/swahili" />} />
          <Route path="/campus/course/swahili/day-5" element={<SwahiliDayFiveWorkbook />} />
          <Route path="/campus/course/swahili/day-6" element={<SwahiliDaySixWorkbook basePath="/campus/course/swahili" />} />
          {Object.values(SWAHILI_A1_PRACTICE_UNITS).map((lesson) => (
            <Route key={lesson.day} path={`/campus/course/swahili/day-${lesson.day}`}
              element={<SwahiliA1PracticeWorkbook key={lesson.day} lesson={lesson} />} />
          ))}
          <Route path="/campus/course/lesson/:level/:day" element={<CourseLessonPage />} />
          <Route path="/campus/course/speaking-exams-intro-4-7" element={<SpeakingExamIntroPage />} />
          <Route
            path="/campus/course/a1-mock-lesen-teil-1-preview"
            element={<A1GoetheReadingMockTeil1Preview />}
          />
          <Route
            path="/campus/course/a1-mock-lesen-teil-2-preview"
            element={<A1GoetheReadingMockTeil2Preview />}
          />
          <Route
            path="/campus/course/a1-mock-lesen-teil-3-preview"
            element={<A1GoetheReadingMockTeil3Preview />}
          />
          <Route
            path="/campus/course/a1-mock-hoeren-preview"
            element={<A1GoetheListeningMockPreview />}
          />
          <Route
            path="/campus/course/a1-mock-schreiben-preview"
            element={<A1GoetheWritingMockPreview />}
          />
          <Route
            path="/campus/course/a1-mock-sprechen-preview"
            element={<A1GoetheSpeakingMockPreview />}
          />
          <Route
            path="/campus/course/a1-final-mock-exam"
            element={<A1FinalMockExamPage key="a1-mock-01" />}
          />
          <Route
            path="/campus/course/a1-final-mock-2"
            element={<A1FinalMockExamPage key="a1-mock-02" mockId="a1-mock-02" />}
          />
          <Route
            path="/campus/course/a1-final-mock-3"
            element={<A1FinalMockExamPage key="a1-mock-03" mockId="a1-mock-03" />}
          />
          <Route
            path="/campus/course/a1-final-mock-4"
            element={<A1FinalMockExamPage key="a1-mock-04" mockId="a1-mock-04" />}
          />
          <Route
            path="/campus/course/a1-final-mock-5"
            element={<A1FinalMockExamPage key="a1-mock-05" mockId="a1-mock-05" />}
          />
          <Route
            path="/campus/course/a1-final-mock-6"
            element={<A1FinalMockExamPage key="a1-mock-06" mockId="a1-mock-06" />}
          />
          <Route
            path="/campus/course/a1-final-mock-7"
            element={<A1FinalMockExamPage key="a1-mock-07" mockId="a1-mock-07" />}
          />
          <Route
            path="/campus/course/a1-final-mock-8"
            element={<A1FinalMockExamPage key="a1-mock-08" mockId="a1-mock-08" />}
          />
          <Route
            path="/campus/course/a1-final-mock-3-hoeren"
            element={<A1FinalMockExamPage key="a1-mock-03" mockId="a1-mock-03" />}
          />
          <Route
            path="/campus/course/a2-mock-lesen-preview"
            element={<A2GoetheReadingMockPreview />}
          />
          <Route
            path="/campus/course/a2-mock-hoeren-teil-1-preview"
            element={<A2GoetheListeningMockTeil1Preview />}
          />
          <Route
            path="/campus/course/a2-mock-hoeren-teil-2-preview"
            element={<A2GoetheListeningMockTeil2Preview />}
          />
          <Route
            path="/campus/course/a2-mock-hoeren-teil-3-preview"
            element={<A2GoetheListeningMockTeil3Preview />}
          />
          <Route
            path="/campus/course/a2-mock-hoeren-teil-4-preview"
            element={<A2GoetheListeningMockTeil4Preview />}
          />
          <Route
            path="/campus/course/a2-mock-schreiben-preview"
            element={<A2GoetheWritingMockPreview />}
          />
          <Route
            path="/campus/course/a2-mock-sprechen-teil-1-preview"
            element={<A2GoetheSpeakingMockTeil1Preview />}
          />
          <Route
            path="/campus/course/a2-mock-sprechen-teil-2-preview"
            element={<A2GoetheSpeakingMockTeil2Preview />}
          />
          <Route
            path="/campus/course/a2-mock-sprechen-teil-3-preview"
            element={<A2GoetheSpeakingMockTeil3Preview />}
          />
          <Route
            path="/campus/course/a1-day-23-writing-workshop-14-2"
            element={<Navigate to="/exams/writing" replace />}
          />
          <Route
            path="/campus/course/dative-and-accusative-verbs-14-2"
            element={<Navigate to="/exams/writing" replace />}
          />
          <Route
            path="/campus/course/dative-verbs-adjective-declension-14-2"
            element={<Navigate to="/exams/writing" replace />}
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
          <Route path="/campus/course/conjunctions-5-10" element={<A1FinalMockExamPage />} />
          <Route path="/campus/course/a2-starter-conjunctions-day-1" element={<A2StudyMaterialLayout day={1}><A2StarterConjunctionsPage /></A2StudyMaterialLayout>} />
          <Route path="/campus/course/a1-day-1-greetings-workbook" element={<A1Day1GreetingsWorkbookPage />} />
          <Route path="/campus/course/a1-day-2-foundations-workbook" element={<A1Day2UnifiedWorkbookPage />} />
          <Route path="/campus/course/a1-day-2-kapitel-1-1-workbook" element={<A1Day2Kapitel11WorkbookPage />} />
          <Route
            path="/campus/course/a1-day-12-24-hour-clock-and-dates-workbook"
            element={<A1Day12TwentyFourHourClockAndDatesWorkbookPage />}
          />
          <Route
            path="/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook"
            element={withA1PracticeBook(13, "3.5", "Revision: Numbers, Time and Prices", "Check numbers, days, time and prices, then learn to form German statements.", <A1Day13RevisionNumbersTimePricesWorkbookPage />)}
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
            element={withA1PracticeBook(3, "1.1", "Personal Information and Questions", "Practise introductions, personal information and basic German questions.", <A1Day3SchreibenSprechenKapitel11WorkbookPage hidePracticeMedia />, A1_DAY3_PRACTICE_VIDEOS[0])}
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
            element={withA1PracticeBook(5, "1.2", "Personal Information, Articles and W-Questions", "Practise personal information, German articles, adjectives and W-questions.", <A1Day5IntroducingYourselfArticlesWorkbookPage />)}
          />
          <Route
            path="/campus/course/a1-day-6-family-and-hobbies-workbook"
            element={withA1PracticeBook(6, "2.3", "Family and Hobbies", "Practise family vocabulary, languages, questions and hobbies.", <A1WorkbookRoutePage />)}
          />
          <Route
            path="/campus/course/a2-day-1-small-talk-workbook"
            element={withRadioWorkbookGate("A2", 1, <A2Day2SmallTalkWorkbookEnhancedPage />)}
          />
          {/* Legacy alias kept so old bookmarks continue to work. */}
          <Route
            path="/campus/course/a2-day-2-small-talk-workbook"
            element={withRadioWorkbookGate("A2", 1, <A2Day2SmallTalkWorkbookEnhancedPage />)}
          />
          <Route path="/campus/course/a2-day-2-personen-beschreiben-workbook" element={withRadioWorkbookGate("A2", 2, <A2Day2PersonenBeschreibenWorkbookPage />)} />
          <Route path="/campus/course/a2-day-3-dinge-und-personen-vergleichen-workbook" element={withRadioWorkbookGate("A2", 3, <A2Day3ComparisonsWorkbookPage />)} />
          <Route path="/campus/course/a2-day-4-wo-moechten-wir-uns-treffen-workbook" element={withRadioWorkbookGate("A2", 4, <A2Day4WoMoechtenWirUnsTreffenWorkbookPage />)} />
          <Route path="/campus/course/b1-day-4-wohnung-suchen-workbook" element={withRadioWorkbookGate("B1", 4, <B1Day4WohnungSuchenWorkbookPage />)} />
          <Route path="/campus/course/b1-day-21-lebensformen-heute-workbook" element={<B1Day21LebensformenHeuteWorkbookPage />} />
          <Route path="/campus/course/a2-day-5-freizeit-workbook" element={withRadioWorkbookGate("A2", 5, <A2Day5FreizeitWorkbookPage />)} />
          <Route path="/campus/course/a2-day-6-moebel-und-raeume-workbook" element={withRadioWorkbookGate("A2", 6, <A2Day6MoebelRaeumeWorkbookPage />)} />
          <Route path="/campus/course/a2-day-7-eine-wohnung-suchen-workbook" element={withRadioWorkbookGate("A2", 7, <A2Day7WohnungSuchenWorkbookPage />)} />
          <Route path="/campus/course/a2-day-8-rezepte-und-essen-workbook" element={withRadioWorkbookGate("A2", 8, <A2Day8RezepteUndEssenWorkbookPage />)} />
          <Route path="/campus/course/a2-day-9-urlaub-workbook" element={withRadioWorkbookGate("A2", 9, <A2Day9UrlaubWorkbookPage />)} />
          <Route
            path="/campus/course/a2-day-10-tourismus-und-traditionelle-feste-workbook"
            element={withRadioWorkbookGate("A2", 10, <A2Day10TourismusTraditionelleFesteWorkbookPage />)}
          />
          <Route
            path="/campus/course/a2-day-11-unterwegs-verkehrsmittel-vergleichen-workbook"
            element={withRadioWorkbookGate("A2", 11, <A2Day11UnterwegsVerkehrsmittelWorkbookPage />)}
          />
          <Route
            path="/campus/course/a2-day-12-mein-traumberuf-workbook"
            element={withRadioWorkbookGate("A2", 12, <A2Day12MeinTraumberufWorkbookPage />)}
          />
          <Route
            path="/campus/course/a2-day-13-vorstellungsgespraech-workbook"
            element={withRadioWorkbookGate("A2", 13, <A2Day13VorstellungsgespraechWorkbookPage />)}
          />
          <Route
            path="/campus/course/a2-day-14-beruf-und-karriere-workbook"
            element={withRadioWorkbookGate("A2", 14, <A2Day14BerufUndKarriereWorkbookPage />)}
          />
          <Route
            path="/campus/course/a2-day-15-mein-lieblingssport-workbook"
            element={withRadioWorkbookGate("A2", 15, <A2Day15MeinLieblingssportWorkbookPage />)}
          />
          <Route
            path="/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook"
            element={withRadioWorkbookGate("A2", 16, <A2Day16WohlbefindenUndEntspannungWorkbookPage />)}
          />
          <Route
            path="/campus/course/a2-day-17-in-die-apotheke-gehen-workbook"
            element={withRadioWorkbookGate("A2", 17, <A2Day17InDieApothekeGehenWorkbookPage />)}
          />
          <Route path="/campus/course/a2-day-18-die-bank-anrufen-workbook" element={withRadioWorkbookGate("A2", 18, <A2Day18DieBankAnrufenWorkbookPage />)} />
          <Route path="/campus/course/a2-day-19-einkaufen-wo-und-wie-workbook" element={withRadioWorkbookGate("A2", 19, <A2Day19EinkaufenWoUndWieWorkbookPage />)} />
          <Route path="/campus/course/a2-day-20-typische-reklamationssituationen-workbook" element={withRadioWorkbookGate("A2", 20, <A2Day20TypischeReklamationssituationenWorkbookPage />)} />
          <Route path="/campus/course/a2-day-21-ein-wochenende-planen-workbook" element={withRadioWorkbookGate("A2", 21, <A2Day21EinWochenendePlanenWorkbookPage />)} />
          <Route path="/campus/course/a2-day-22-die-woche-planung-workbook" element={withRadioWorkbookGate("A2", 22, <A2Day22DieWochePlanungWorkbookPage />)} />
          <Route path="/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook" element={withRadioWorkbookGate("A2", 23, <A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage />)} />
          <Route path="/campus/course/a2-day-24-einen-urlaub-planen-workbook" element={withRadioWorkbookGate("A2", 24, <A2Day24EinenUrlaubPlanenWorkbookPage />)} />
          <Route path="/campus/course/a2-day-25-tagesablauf-workbook" element={withRadioWorkbookGate("A2", 25, <A2Day25TagesablaufWorkbookPage />)} />
          <Route path="/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook" element={withRadioWorkbookGate("A2", 26, <A2Day26GefuehleInVerschiedenenSituationenWorkbookPage />)} />
          <Route path="/campus/course/a2-day-27-digitale-kommunikation-workbook" element={withRadioWorkbookGate("A2", 27, <A2Day27DigitaleKommunikationWorkbookPage />)} />
          <Route path="/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook" element={withRadioWorkbookGate("A2", 28, <A2Day28UeberDieZukunftSprechenWorkbookPage />)} />
          <Route path="/campus/course/a2-mock-practice-preview" element={<A2FinalMockExamPage />} />
          <Route path="/campus/course/a2-final-mock-exam" element={<A2FinalMockExamPage />} />
          <Route path="/campus/course/a2-mock-2-lesen" element={<A2Mock2Lesen />} />
          <Route path="/campus/course/a2-mock-2-schreiben" element={<A2Mock2Schreiben />} />
          <Route path="/campus/course/a2-mock-2-hoeren" element={<A2Mock2Hoeren />} />
          <Route path="/campus/course/a2-mock-3-hoeren" element={<A2Mock3Hoeren />} />
          <Route path="/campus/course/a2-mock-3" element={<A2Mock3ExamHub />} />
          <Route path="/campus/course/a2-mock-2-sprechen" element={<A2Mock2Sprechen />} />
          <Route path="/campus/course/a2-mock-2" element={<A2Mock2ExamHub />} />
          {[4,5,6,7,8].map(number=><Route key={number}
            path={`/campus/course/a2-kombi-mock-${number}`}
            element={<A2KombiMockExamPage key={number} mockNumber={number}/>}/>)}
          <Route path="/campus/course/a2-day-29-goethe-exam-orientation" element={<A2FinalMockExamPage />} />
          <Route path="/campus/course/a1-day-25-goethe-exam-orientation" element={<Navigate to="/exams/overview" replace />} />
          <Route path="/campus/course/b1-mock-practice-preview" element={<B1FinalMockExamPage />} />
          <Route path="/campus/course/b1-final-mock-exam" element={<B1FinalMockExamPage />} />
          <Route path="/campus/course/b1-mock-2" element={<B1FinalMockExamPage key="b1-mock-02" mockId="b1-mock-02" />} />
          <Route path="/campus/course/b1-mock-3" element={<B1FinalMockExamPage key="b1-mock-03" mockId="b1-mock-03" />} />
          <Route path="/campus/course/b1-mock-2-hoeren" element={<B1Mock2Hoeren />} />
          <Route path="/campus/course/b1-mock-3-hoeren" element={<B1Mock3Hoeren />} />
          <Route path="/campus/course/b1-mock-4" element={<B1FinalMockExamPage key="b1-mock-04" mockId="b1-mock-04" />} />
          <Route path="/campus/course/b1-mock-4-hoeren" element={<B1Mock4Hoeren />} />
          <Route path="/campus/course/b1-mock-4-lesen" element={<B1Mock4Lesen />} />
          <Route path="/campus/course/b1-mock-4-schreiben" element={<B1Mock4Schreiben />} />
          <Route path="/campus/course/b1-mock-3-schreiben" element={<B1Mock3Schreiben />} />
          <Route path="/campus/course/b1-mock-3-sprechen" element={<B1Mock3Speaking />} />
          <Route path="/campus/course/b1-mock-4-sprechen" element={<B1Mock4Speaking />} />
          <Route path="/campus/course/b2-mock-practice-preview" element={<B2FinalMockExamPage />} />
          <Route path="/campus/course/b2-final-mock-exam" element={<B2FinalMockExamPage />} />
          <Route path="/campus/course/b1-day-29-goethe-exam-orientation" element={<B1FinalMockExamPage />} />
          <Route path="/campus/course/c1-self-learning" element={<C1SelfLearningCourse />} />
          <Route path="/campus/course/c1-self-learning/exam-preparation" element={<C1ExamPreparationPage />} />
          <Route path="/campus/course/c1-self-learning/day-:dayId" element={<C1SelfLearningCourse />} />
          <Route path="/campus/course/c1-day-1-willkommen-selbstlernstart-workbook" element={withRadioWorkbookGate("C1", 1, <C1Day1WillkommenSelbstlernstartWorkbookPage />)} />
          <Route path="/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-grammar-notes" element={<B2Day1PersoenlicheIdentitaetGrammarNotesPage />} />
          <Route path="/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-workbook" element={withRadioWorkbookGate("B2", 1, <B2Day1PersoenlicheIdentitaetWorkbookPage />)} />
                    <Route path="/campus/course/c1-day-10-integration-und-gesellschaft-grammar-notes" element={<C1StudyMaterialLayout day={10}><C1Day10IntegrationUndGesellschaftGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-10-migration-und-integration-grammar-notes" element={<C1StudyMaterialLayout day={10}><C1Day10IntegrationUndGesellschaftGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-10-integration-und-gesellschaft-workbook" element={<C1Day10IntegrationUndGesellschaftWorkbookPage />} />
          <Route path="/campus/course/c1-day-11-engagement-und-ehrenamt-grammar-notes" element={<C1StudyMaterialLayout day={11}><C1Day11EngagementUndEhrenamtGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-11-engagement-und-ehrenamt-workbook" element={<C1Day11EngagementUndEhrenamtWorkbookPage />} />
          <Route path="/campus/course/c1-day-12-freizeit-und-kultur-erweiterte-vergleichsformen-grammar-notes" element={<C1StudyMaterialLayout day={12}><C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-12-freizeit-und-kultur-grammar-notes" element={<C1StudyMaterialLayout day={12}><C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-12-freizeit-und-kultur-workbook" element={<C1Day12FreizeitUndKulturWorkbookPage />} />
          <Route path="/campus/course/c1-day-13-mehrsprachigkeit-grammar-notes" element={<C1StudyMaterialLayout day={13}><C1Day13MehrsprachigkeitGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-13-mehrsprachigkeit-workbook" element={<C1Day13MehrsprachigkeitWorkbookPage />} />
          <Route path="/campus/course/c1-day-14-innovation-und-zukunft-grammar-notes" element={<C1StudyMaterialLayout day={14}><C1Day14InnovationUndZukunftGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-14-innovation-und-zukunft-workbook" element={<C1Day14InnovationUndZukunftWorkbookPage />} />
          <Route path="/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-grammar-notes" element={<C1StudyMaterialLayout day={15}><C1Day15BildungUndLebenslangesLernenGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-workbook" element={<C1Day15BildungUndLebenslangesLernenWorkbookPage />} />
          <Route path="/campus/course/c1-day-16-technologie-im-alltag-grammar-notes" element={<C1StudyMaterialLayout day={16}><C1Day16TechnologieImAlltagGrammarNotesPage /></C1StudyMaterialLayout>} />
          <Route path="/campus/course/c1-day-16-technologie-im-alltag-workbook" element={<C1Day16TechnologieImAlltagWorkbookPage />} />
          <Route path="/campus/course/b1-day-21-lebensformen-heute-grammar-notes" element={<B1StudyMaterialLayout day={21}><B1Day21LebensformenHeuteGrammarNotesPage /></B1StudyMaterialLayout>} />
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
          <Route path="/campus/course/modal-verbs-day-14-3-6" element={withA1PracticeBook(14, "3.6", "Modal Verbs with Separable Verbs", "Review modal verbs and complete the existing examples, exercises and knowledge checks.", <A1Day14ModalVerbsWorkbookPage />)} />
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
          <Route path="/campus/course/a1-day-2-unified-grammar" element={<A1Day2UnifiedGrammarPage />} />
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
            element={<A2StudyMaterialLayout day={2}><A2Day2Kapitel12GrammarNotesPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/dinge-und-personen-vergleichen-1-3-grammar-notes"
            element={<A2StudyMaterialLayout day={3}><ComparingThingsAndPeopleGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/wo-moechten-wir-uns-treffen-2-4-grammar-notes"
            element={<A2StudyMaterialLayout day={4}><WoTreffenUnsGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/was-machst-du-in-deiner-freizeit-2-5-grammar-notes"
            element={<A2StudyMaterialLayout day={5}><A2Day5FreizeitSeparableVerbsGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/moebel-und-raeume-3-6-grammar-notes"
            element={<A2StudyMaterialLayout day={6}><A2Day6TwoCasePrepositionsGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/relativsaetze-die-der-das-wohnung-suchen-3-7-notes"
            element={<A2StudyMaterialLayout day={7}><A2Day7RelativeClausesWohnungGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/imperativ-rezepte-und-essen-3-8-grammar-notes"
            element={<A2StudyMaterialLayout day={8}><A2Day8ImperativeGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/perfekt-urlaub-4-9-grammar-notes"
            element={<A2StudyMaterialLayout day={9}><A2Day9PerfektGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/praeteritum-tourismus-und-traditionelle-feste-4-10-grammar-notes"
            element={<A2StudyMaterialLayout day={10}><A2Day10PraeteritumGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/unterwegs-verkehrsmittel-vergleichen-4-11-grammar-notes"
            element={<A2StudyMaterialLayout day={11}><A2Day11ComparativeFormsGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/mein-traumberuf-5-12-grammar-notes"
            element={<A2StudyMaterialLayout day={12}><A2Day12MeinTraumberufGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/modalverben-im-praeteritum-vorstellungsgespraech-5-13-grammar-notes"
            element={<A2StudyMaterialLayout day={13}><A2Day13VorstellungsgespraechModalverbenPraeteritumGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/beruf-und-karriere-5-14-um-zu-grammar-notes"
            element={<A2StudyMaterialLayout day={14}><A2Day14BerufUndKarriereUmZuGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/mein-lieblingssport-6-15-seit-dativ-praesens-grammar-notes"
            element={<A2StudyMaterialLayout day={15}><A2Day15MeinLieblingssportSeitDativGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/wohlbefinden-und-entspannung-6-16-reflexive-verben-grammar-notes"
            element={<A2StudyMaterialLayout day={16}><A2Day16WohlbefindenReflexiveVerbenGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/die-bank-anrufen-7-18-hoefliche-fragen-und-bitten-grammar-notes"
            element={<A2StudyMaterialLayout day={18}><A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/einkaufen-wo-und-wie-7-19-oder-denn-grammar-notes"
            element={<A2StudyMaterialLayout day={19}><A2Day19EinkaufenOderDennGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/typische-reklamationssituationen-7-20-hoefliche-bitten-und-begruendungen-grammar-notes"
            element={<A2StudyMaterialLayout day={20}><A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/ein-wochenende-planen-8-21-wenn-ob-falls-grammar-notes"
            element={<A2StudyMaterialLayout day={21}><A2Day21EinWochenendePlanenWennObFallsGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/die-woche-planung-8-22-praesens-future-time-phrases-modalverben-grammar-notes"
            element={<A2StudyMaterialLayout day={22}><A2Day22DieWochePlanungGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/wie-kommst-du-zur-schule-zur-arbeit-9-23-praepositionen-mit-verkehrsmitteln-grammar-notes"
            element={<A2StudyMaterialLayout day={23}><A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/einen-urlaub-planen-9-24-final-a2-grammar-notes"
            element={<A2StudyMaterialLayout day={24}><A2Day24EinenUrlaubPlanenGrammarPage /></A2StudyMaterialLayout>}
          />
          <Route
            path="/campus/course/ueber-die-zukunft-sprechen-10-28-final-a2-grammar-notes"
            element={<A2StudyMaterialLayout day={28}><A2Day28UeberDieZukunftSprechenGrammarPage /></A2StudyMaterialLayout>}
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
          <Route path="/exams/:section/:practiceLevel/:sampleId" element={<ExamArea onBack={goHome} />} />
          <Route path="/exams/:section" element={<ExamArea onBack={goHome} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>}
      </main>
      {!isOnboarding ? <AssessmentStudySupport restricted={mockAssessment}><StudyBuddyBar studentProfile={studentProfile} /></AssessmentStudySupport> : null}
    </div>
  );
};

const LegacyAttendanceRedirect = () => {
  const { className = "" } = useParams();
  return <Navigate to={`/campus/course/full-class-calendar/${encodeURIComponent(className)}`} replace />;
};


const CampusQuickNavigation = ({ allowedSections, availableTabs, tabStructure }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeMainTabConfig = useMemo(
    () => getMainTabForSection("course", tabStructure),
    [tabStructure]
  );

  const handleMainTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route);
      return;
    }
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
        <button type="button" style={styles.navButton} onClick={() => navigate("/")}>Falowen Home</button>
      </div>

      {activeMainTabConfig?.sections ? (
        <div
          className="nav-row"
          style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 12, marginTop: -4 }}
        >
          {activeMainTabConfig.sections
            .filter((subTab) => allowedSections[subTab.key])
            .map((subTab) => {
              const searchParams = new URLSearchParams(location.search || "");
              const isClassMembersActive = searchParams.get("classMembers") === "1";
              const isActive = subTab.key === "classMembers" ? isClassMembersActive : subTab.key === "course" && !isClassMembersActive;
              return (
                <button
                  key={subTab.key}
                  style={isActive ? styles.navButtonActive : styles.navButton}
                  onClick={() => navigate(subTab.key === "submit" ? "/campus/course?submitWork=1" : subTab.key === "classMembers" ? "/campus/course?classMembers=1" : `/campus/${subTab.key}`)}
                >
                  {subTab.label}
                </button>
              );
            })}
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
  testingLevel = "",
}) => {
  const campusStudentProfile = studentProfile || {};
  const { t } = useTranslation();
  const { section } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (section === "submit" && !allowedSections.submit) {
      navigate(`/campus/course?submitWork=1&legacySubmitRedirect=1${location.search ? `&${location.search.slice(1)}` : ""}`, { replace: true });
      return;
    }
    if (!section || section !== resolvedSection) {
      navigate(`/campus/${resolvedSection}`, { replace: true });
    }
  }, [allowedSections.submit, location.search, navigate, resolvedSection, section]);

  useEffect(() => {
    if (!tabStorageKey || !getMainTabForSection(resolvedSection, tabStructure)) return;
    localStorage.setItem(tabStorageKey, resolvedSection);
  }, [resolvedSection, tabStorageKey, tabStructure]);

  const handleMainTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route);
      return;
    }
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
    if (sectionKey === "submit") {
      navigate("/campus/course?submitWork=1");
      return;
    }
    if (sectionKey === "classMembers") {
      navigate("/campus/course?classMembers=1");
      return;
    }
    navigate(`/campus/${sectionKey}`);
  };

  const campusHeroSections = new Set(["speech", "account"]);
  const showCampusHero = campusHeroSections.has(resolvedSection);
  const campusHeroTitle =
    resolvedSection === "speech" ? t("appNav.campusTabs.speech") : resolvedSection === "account" ? t("appNav.campusTabs.account") : "";

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <button type="button" style={styles.backTextLink} onClick={onBack}>
          <span aria-hidden="true">←</span> {t("appNav.backHome")}
        </button>
      </div>
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
        <button type="button" style={styles.navButton} onClick={() => navigate("/")}>Falowen Home</button>
      </div>

      {activeMainTabConfig?.sections ? (
        <div
          className="nav-row"
          style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 12, marginTop: -4 }}
        >
          {activeMainTabConfig.sections
            .filter((subTab) => allowedSections[subTab.key])
            .map((subTab) => {
              const searchParams = new URLSearchParams(location.search || "");
              const isClassMembersActive = resolvedSection === "course" && searchParams.get("classMembers") === "1";
              const isActive = subTab.key === "classMembers" ? isClassMembersActive : resolvedSection === subTab.key && !isClassMembersActive;
              return (
                <button
                  key={subTab.key}
                  style={isActive ? styles.navButtonActive : styles.navButton}
                  onClick={() => handleSubTabClick(subTab.key)}
                >
                  {subTab.label}
                </button>
              );
            })}
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

      {resolvedSection === "music" && allowedSections.music ? <CampusMusicPage program={getCampusProgram(campusStudentProfile)} /> : null}
      {getCampusProgram(campusStudentProfile) === "swahili" && resolvedSection !== "music" &&
        SWAHILI_RESOURCE_SECTIONS.includes(resolvedSection) && ["vocab", "discussion"].includes(resolvedSection) ? (
          <section style={styles.card}><p>Swahili content for this section is coming soon.</p></section>
        ) : null}
      {resolvedSection === "books" && allowedSections.books ? <CampusBooksPage program={getCampusProgram(campusStudentProfile)} /> : null}
      {resolvedSection === "course" && allowedSections.course ? (
        String(campusStudentProfile?.program || "").toLowerCase() === "swahili" ? (
          <SwahiliCourseBook basePath="/campus/course/swahili" testingLevel={testingLevel} />
        ) : (
          <CourseTab
            defaultLevel={campusStudentProfile?.level}
            defaultClassName={campusStudentProfile?.className}
            program={campusStudentProfile?.program}
            testingLevel={testingLevel}
          />
        )
      ) : null}
      {resolvedSection === "vocab" && allowedSections.vocab && getCampusProgram(campusStudentProfile) !== "swahili" ? <VocabExamPage context="campus" /> : null}
      {resolvedSection === "attendance" && allowedSections.attendance ? <AttendanceTab /> : null}
      {resolvedSection === "classMembers" && allowedSections.classMembers ? <ClassMembersTab /> : null}
      {resolvedSection === "grammar" && allowedSections.grammar ? <GrammarQuestionTab /> : null}
      {resolvedSection === "writing" && allowedSections.writing ? <LetterPracticePage mode="campus" /> : null}
      {resolvedSection === "speech" && allowedSections.speech ? <SpeechTrainerPage /> : null}
      {resolvedSection === "submit" && allowedSections.submit ? <AssignmentSubmissionPage /> : null}
      {resolvedSection === "results" && allowedSections.results ? <StudentResultsPage /> : null}
      {resolvedSection === "discussion" && allowedSections.discussion && getCampusProgram(campusStudentProfile) !== "swahili" ? <ClassDiscussionPage /> : null}
      {resolvedSection === "account" && allowedSections.account ? <AccountSettings /> : null}
      {allowedSections.attendance && getCampusProgram(campusStudentProfile) !== "swahili" && <AttendanceCheckinCard />}
      {resolvedSection === "tutor-marking" && allowedSections["tutor-marking"] ? <TutorMarkingPage /> : null}
    </>
  );
};

const ExamArea = ({ onBack }) => {
  const { t } = useTranslation();
  const { section, practiceLevel = "", sampleId = "" } = useParams();
  const navigate = useNavigate();
  const { level: germanLevel, setLevel: setGermanLevel, accessibleLevels } = useExam();
  const { studentProfile, user } = useAuth();
  const isSwahili = getCampusProgram(studentProfile) === "swahili";
  const swahiliLevelOrder = ["A1","A2","B1"];
  const assignedSwahiliLevel = normalizeCourseLevel(studentProfile?.level);
  const swahiliLevels = swahiliLevelOrder.filter((option,index) => index <= swahiliLevelOrder.indexOf(assignedSwahiliLevel) && !studentProfile?.blockedEnrollmentLevels?.includes(option));
  const [swahiliChoice, setSwahiliChoice] = useState(null);
  const level = isSwahili
    ? (swahiliChoice?.uid === user?.uid && swahiliLevels.includes(swahiliChoice?.level) ? swahiliChoice.level : swahiliLevels.at(-1))
    : germanLevel;
  const setLevel = React.useCallback(option => {
    if (isSwahili) setSwahiliChoice({uid:user?.uid,level:option});
    else setGermanLevel(option);
  }, [isSwahili, user?.uid, setGermanLevel]);
  const trialExam = React.useContext(TrialExam);
  const { openLock, lockDialog } = useAccessLock();
  const examOnlyView = Boolean(trialExam) || studentProfile?.accountType === "exam_only";
  const visibleLevels = isSwahili ? swahiliLevels : trialExam
    ? accessibleLevels.filter((option) => option === String(trialExam.level || studentProfile?.level || "A1").toUpperCase())
    : accessibleLevels;
  useEffect(() => {
    if (!isSwahili && trialExam && visibleLevels.length && level !== visibleLevels[0]) setLevel(visibleLevels[0]);
  }, [isSwahili, trialExam, level, visibleLevels[0], setLevel]);

  const lastVisitStorageKey = "falowen_exam_last_visit";
  const lastSectionStorageKey = "falowen_exam_last_section";

  const examSection = useMemo(() => {
    if (isSwahili) return ["overview","mocks","lesen","horen","writing","speaking","file"].includes(section) ? section : "overview";
    if (section === "resources") return "file";
    if (
      [
        "overview",
        "mocks",
        "question",
        "speaking",
        "writing",
        "file",
        "vocab",
        "horen",
        "lesen",
      ].includes(section)
    ) {
      return section;
    }
    return "overview";
  }, [section, isSwahili]);

  useEffect(() => {
    if (section !== examSection || (isSwahili && sampleId)) {
      navigate(`/exams/${examSection}`, { replace: true });
    }
  }, [examSection, navigate, section, isSwahili, sampleId]);

  useEffect(() => {
    if (isSwahili) return;
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
  }, [examSection, lastSectionStorageKey, lastVisitStorageKey, isSwahili]);


  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "mocks", label: "Mock Exams" },
    { key: "lesen", label: t("appNav.examTabs.lesen") },
    { key: "horen", label: t("appNav.examTabs.horen") },
    { key: "writing", label: t("appNav.examTabs.writing") },
    { key: "speaking", label: t("appNav.examTabs.speaking") },
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
    file: {
      label: t("appNav.examTabs.file"),
      image: "https://images.pexels.com/photos/1005324/pexels-photo-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000",
    },
  };
  const activeExamHero = examHeroConfig[examSection];
  const allowExamStudyPartner = canShowExamStudyPartner({ level, section: examSection, sampleId, trial: Boolean(trialExam), isSwahili, allowed: visibleLevels.includes(level) });
  const sampleReviewLevel = String(practiceLevel || level || "").toUpperCase();
  const allowExamMistakeReview = Boolean(sampleId && canShowExamStudyPartner({ level: sampleReviewLevel, section: examSection, trial: Boolean(trialExam), isSwahili, allowed: visibleLevels.includes(sampleReviewLevel) }));
  const tabLocked = key => Boolean(!isSwahili && trialExam && !["overview", "mocks"].includes(key));


  const openExamSection = (tab, event) => {
    if (tabLocked(tab.key)) { openLock(examLockInfo({ title: tab.label, trialExam, level, examOnly: studentProfile?.accountType === "exam_only" }), event); return; }
    if (examSection === tab.key && !sampleId) return;
    announceExamSuccess(`${tab.label} opened successfully.`);
    navigate(`/exams/${tab.key}`);
  };

  return (
    <>
      {lockDialog}
      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <div className="nav-row exam-nav-row" style={{ ...styles.nav, justifyContent: "flex-start", marginBottom: 0 }}>
          <button style={styles.secondaryButton} onClick={() => { announceExamSuccess("Home opened successfully."); onBack(); }}>
            {t("appNav.backHome")}
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              style={examSection === tab.key ? styles.navButtonActive : styles.navButton}
              onClick={event => openExamSection(tab, event)}
            >
              {tabLocked(tab.key) && "🔒 "}{tab.label}
            </button>
          ))}
        </div>
        {examOnlyView && <Link to="/mock/account">Manage course type</Link>}
        <details className="mobile-exam-menu" key={examSection}>
          <summary aria-label="Open Exam Room Menu and other exam pages">
            <span aria-hidden="true">☰</span> <span>Exam Room Menu</span>
            <strong>{tabs.find((tab) => tab.key === examSection)?.label || "Overview"}</strong>
            <span aria-hidden="true" className="mobile-exam-menu__chevron">⌄</span>
          </summary>
          <nav className="mobile-exam-menu__links" aria-label="Exam Room sections">
            <button type="button" onClick={() => { announceExamSuccess("Home opened successfully."); onBack(); }}>← {t("appNav.backHome")}</button>
            {tabs.map((tab) => (
              <button key={tab.key} type="button" aria-current={examSection === tab.key ? "page" : undefined}
                onClick={event => openExamSection(tab, event)}>
                {tabLocked(tab.key) && "🔒 "}{tab.label}
              </button>
            ))}
          </nav>
        </details>
        <div
          className={examSection === "speaking" ? "exam-room-level-picker exam-room-level-picker--speaking" : "exam-room-level-picker"}
          style={{
            ...styles.card,
            margin: 0,
            padding: "10px 14px",
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <strong style={{ fontSize: 13 }}>Exam level</strong>
            <small style={{ ...styles.helperText, margin: 0 }}>
              Your Course Book level stays unchanged.
            </small>
          </div>
          <div className="exam-room-date-picker-row">
          <div role="group" aria-label="Choose exam practice level" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {visibleLevels.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={level === option}
                onClick={() => {
                  if (option === level) return;
                  setLevel(option);
                  announceExamSuccess(`${option} exam level selected successfully.`);
                  // A sample URL contains its original CEFR level; leave it before switching.
                  if (sampleId) navigate(`/exams/${examSection}`);
                }}
                style={{
                  ...(level === option ? styles.navButtonActive : styles.navButton),
                  minWidth: 58,
                  textAlign: "center",
                  padding: "8px 14px",
                }}
              >
                {option}
              </button>
            ))}
          </div>
            {!isSwahili && examSection === "overview" && user?.uid && <PersonalExamCountdown key={user.uid + ":" + level} uid={user.uid} level={level} compact />}
          </div>
          <small style={{ ...styles.helperText, margin: 0 }}>
            Practise at your current level or any lower level.
          </small>
        </div>

        {allowExamStudyPartner && ["lesen", "horen"].includes(examSection) && <ExamStudyPartner key={`${level}:${examSection}`} level={level} section={examSection} />}

        {!isSwahili && activeExamHero && examSection !== "speaking" ? (
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

      {isSwahili ? <SwahiliExamSection level={level} section={examSection} /> : <>
      {examSection === "overview" ? <ExamsOverviewPage dateInLevelPicker allowExamStudyPartner={allowExamStudyPartner} /> : null}
      {examSection === "mocks" ? <MockExamLibraryPage /> : null}
      {examSection === "question" ? <QuestionOfDayPage /> : null}
      {examSection === "speaking" ? <SpeakingPage allowExamStudyPartner={allowExamStudyPartner} /> : null}
      {examSection === "writing" ? <ExamWritingWorkspace allowExamStudyPartner={allowExamStudyPartner} /> : null}
      {examSection === "vocab" ? <VocabExamPage /> : null}
      {examSection === "horen" ? <HorenPage practiceLevel={practiceLevel} sampleId={sampleId} allowExamMistakeReview={allowExamMistakeReview} /> : null}
      {examSection === "lesen" ? <LesenPage practiceLevel={practiceLevel} sampleId={sampleId} allowExamMistakeReview={allowExamMistakeReview} /> : null}
      {examSection === "file" ? <MyExamFilePage /> : null}
      </>}
    </>
  );
};