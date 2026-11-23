import { courseTrial, TrialCoursePage } from "./components/TrialPractice";
import { MockExamOnlyGate } from "./components/MockExamCommerce";
import { MOCK_EXAM_CATALOG } from "./data/mockExamCatalog";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './index.css';
import './goetheFreeChatMobile.css';
import './i18n';
import App from './App';
import PublicVisitorQuestionHelper from './components/PublicVisitorQuestionHelper';
import AppStartupBoundary from './components/AppStartupBoundary';
import PublicAuthRouteBridge from './components/PublicAuthRouteBridge';
import PublicAuthMobileRecovery from './components/PublicAuthMobileRecovery';
import MockOnlyRouteBoundary from './components/MockOnlyRouteBoundary';
import FalowenRadioSeoPage from './components/FalowenRadioSeoPage';
import RouteScopedAppServices from './components/RouteScopedAppServices';
import RouteScopedBackgroundServices from './components/RouteScopedBackgroundServices';
import SelfLearningLessonDirectNavigationFix from './components/SelfLearningLessonDirectNavigationFix';
import A1CanonicalChapterLessonRoute from './components/A1CanonicalChapterLessonRoute';
import A1ChapterSpecificLessonRouteBoundary from './components/A1ChapterSpecificLessonRouteBoundary';
import A1ChapterResourceHubRoute, {
  A1_CHAPTER_RESOURCE_HUB_PARENT_PATH,
} from './components/A1ChapterResourceHubRoute';
import A1Day13RevisionNumberCleanup from './components/A1Day13RevisionNumberCleanup';
import A1Day5FinalWorkbookOpenFix from './components/A1Day5FinalWorkbookOpenFix';
import A1RadioFirstWorkbookRoutes from './components/A1RadioFirstWorkbookRoutes';
import A1SharedPracticeWorkbookNavigation from './components/A1SharedPracticeWorkbookNavigation';
import RequestedLessonAiVideoHeader from './components/RequestedLessonAiVideoHeader';
import A1Day11DirectWorkbookRoute, {
  A1_DAY11_DIRECT_WORKBOOK_PATH,
} from './components/A1Day11DirectWorkbookRoute';
import A1Day16Chapter9DirectWorkbookRoute, {
  A1_DAY16_CHAPTER9_DIRECT_WORKBOOK_PATH,
} from './components/A1Day16Chapter9DirectWorkbookRoute';
import A1Day20Chapter123DirectWorkbookRoute, {
  A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH,
} from './components/A1Day20Chapter123DirectWorkbookRoute';
import A1SpeakingExamIntroEntryRoute, {
  A1_SPEAKING_EXAM_INTRO_ENTRY_PATH,
} from './components/A1SpeakingExamIntroEntryRoute';
import A2Day27DigitaleKommunikationGrammarPage from './components/A2Day27DigitaleKommunikationGrammarPage';
import { A1_CANONICAL_LESSON_CATALOG } from './data/a1CanonicalLessonCatalog';
import reportWebVitals from './reportWebVitals';
import { getProgramCourseRedirect } from './utils/campusProgram';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const normalizedPublicPath = window.location.pathname.replace(/\/+$/, '') || '/';
const isFalowenRadioSeoPage = normalizedPublicPath === '/falowen-radio';
const A1_DAY0_TUTORIAL_ROUTE = '/campus/course/lesson/A1/0';
const A1_DAY0_WORKBOOK_ROUTE = '/campus/course/a1-day-0-orientation-and-knowledge-test-workbook';
const A2_DAY27_GRAMMAR_ROUTE = '/campus/course/a2-day-27-digitale-kommunikation-dass-grammar';
const A1_SHORT_CHAPTER_LESSON_ROUTES = A1_CANONICAL_LESSON_CATALOG.filter(
  (lesson) => lesson.shortLessonRoute,
);

const AppMountedSignal = () => {
  React.useEffect(() => {
    window.dispatchEvent(new Event('falowen:app-mounted'));
  }, []);

  return null;
};

// Some German workbook routes mount directly, outside App's normal route guard.
function CourseTrialBoundary({ children }) {
  const { studentProfile, loading } = useAuth();
  const { pathname, state, search } = useLocation();
  const path = pathname.replace(/\/+$/, "");
  const exam = /^\/exams(?:\/|$)/i.test(path) || Object.values(MOCK_EXAM_CATALOG).some(mock => mock.route === path);
  const course = /^\/campus\/course(?:\/|$)/i.test(path);
  if (!course && !exam) return children;
  if (loading) return null;
  const trial = courseTrial(studentProfile);
  if (!trial) return children;
  if (exam) return <MockExamOnlyGate courseTrialState={trial}>{children}</MockExamOnlyGate>;
  if (/\/lesson\//i.test(path) && state) return <Navigate to={pathname + search} replace state={null} />;
  return <TrialCoursePage level={studentProfile.level} path={path} active={trial.active} endsAtMs={trial.endsAtMs}>{children}</TrialCoursePage>;
}

function CourseRouteBoundary({ children }) {
  const { studentProfile, loading } = useAuth();
  const { pathname } = useLocation();
  if (!pathname.startsWith('/campus/course/')) return children;
  if (loading) return null;
  if (!studentProfile) return children;
  const role = String(studentProfile?.role || '').toLowerCase();
  const redirect = getProgramCourseRedirect({ pathname, studentProfile,
    isStaff: ['admin', 'tutor'].includes(role) || studentProfile?.isTutor === true });
  return redirect ? <Navigate to={redirect} replace /> : children;
}

const AuthenticatedAppRoutes = () => (
  <>
    <PublicAuthRouteBridge />
    <PublicAuthMobileRecovery />
    <A1Day13RevisionNumberCleanup />
    <AuthProvider>
      <CourseTrialBoundary><CourseRouteBoundary>
      <ToastProvider>
        <A1ChapterSpecificLessonRouteBoundary>
          <RouteScopedAppServices />
          <SelfLearningLessonDirectNavigationFix />
          <A1RadioFirstWorkbookRoutes />
          <A1Day5FinalWorkbookOpenFix />
          <A1SharedPracticeWorkbookNavigation />
          <RequestedLessonAiVideoHeader />
          <MockOnlyRouteBoundary><Routes>
            <Route path={A1_DAY0_TUTORIAL_ROUTE} element={<Navigate to={A1_DAY0_WORKBOOK_ROUTE} replace />} />
            <Route
              path="/campus/course/lesson/A1/chapter/:chapter"
              element={<A1CanonicalChapterLessonRoute />}
            />
            {A1_SHORT_CHAPTER_LESSON_ROUTES.map((lesson) => (
              <Route
                key={lesson.routeKey}
                path={lesson.shortLessonRoute}
                element={<A1CanonicalChapterLessonRoute chapter={lesson.routeKey} />}
              />
            ))}
            <Route
              path={A1_DAY11_DIRECT_WORKBOOK_PATH}
              element={<A1Day11DirectWorkbookRoute />}
            />
            <Route
              path={A1_DAY16_CHAPTER9_DIRECT_WORKBOOK_PATH}
              element={<A1Day16Chapter9DirectWorkbookRoute />}
            />
            <Route
              path={A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH}
              element={<A1Day20Chapter123DirectWorkbookRoute />}
            />
            <Route
              path={A1_SPEAKING_EXAM_INTRO_ENTRY_PATH}
              element={<A1SpeakingExamIntroEntryRoute workbookElement={<App />} />}
            />
            <Route
              path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}
              element={<A1ChapterResourceHubRoute level="A1" fallback={<App />} />}
            />
            <Route
              path={A2_DAY27_GRAMMAR_ROUTE}
              element={<A2Day27DigitaleKommunikationGrammarPage />}
            />
            <Route path="*" element={<App />} />
          </Routes></MockOnlyRouteBoundary>
        </A1ChapterSpecificLessonRouteBoundary>
      </ToastProvider>
      </CourseRouteBoundary></CourseTrialBoundary>
    </AuthProvider>
  </>
);

const OrganisationEnrolmentPage = React.lazy(() => import('./components/OrganisationEnrolmentPage'));
const PartnershipPage = React.lazy(() => import('./components/PartnershipPage'));

function PublicFormPage({ component: Page }) {
  return <React.Suspense fallback={<p role="status">Loading form…</p>}><Page /></React.Suspense>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppStartupBoundary>
      <BrowserRouter>
        <AppMountedSignal />
        <Routes>
          <Route path="/organisation-enrolment" element={<PublicFormPage component={OrganisationEnrolmentPage} />} />
          <Route path="/partnerships" element={<PublicFormPage component={PartnershipPage} />} />
          <Route path="*" element={<>
            <PublicVisitorQuestionHelper />
            <RouteScopedBackgroundServices />
            {isFalowenRadioSeoPage ? (
              <FalowenRadioSeoPage />
            ) : (
              <AuthenticatedAppRoutes />
            )}
          </>} />
        </Routes>
      </BrowserRouter>
    </AppStartupBoundary>
  </React.StrictMode>
);

reportWebVitals();

export { A1_DAY0_TUTORIAL_ROUTE, A1_DAY0_WORKBOOK_ROUTE, A2_DAY27_GRAMMAR_ROUTE };
