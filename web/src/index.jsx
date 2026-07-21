import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import './i18n';
import App from './App';
import AppStartupBoundary from './components/AppStartupBoundary';
import PublicAuthRouteBridge from './components/PublicAuthRouteBridge';
import PublicAuthMobileRecovery from './components/PublicAuthMobileRecovery';
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
import A1RadioFirstWorkbookRoutes from './components/A1RadioFirstWorkbookRoutes';
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
import { A1_CANONICAL_LESSON_CATALOG } from './data/a1CanonicalLessonCatalog';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const normalizedPublicPath = window.location.pathname.replace(/\/+$/, '') || '/';
const isFalowenRadioSeoPage = normalizedPublicPath === '/falowen-radio';
const A1_SHORT_CHAPTER_LESSON_ROUTES = A1_CANONICAL_LESSON_CATALOG.filter(
  (lesson) => lesson.shortLessonRoute,
);

const AppMountedSignal = () => {
  React.useEffect(() => {
    window.dispatchEvent(new Event('falowen:app-mounted'));
  }, []);

  return null;
};

const AuthenticatedAppRoutes = () => (
  <>
    <PublicAuthRouteBridge />
    <PublicAuthMobileRecovery />
    <A1Day13RevisionNumberCleanup />
    <AuthProvider>
      <ToastProvider>
        <A1ChapterSpecificLessonRouteBoundary>
          <RouteScopedAppServices />
          <SelfLearningLessonDirectNavigationFix />
          <A1RadioFirstWorkbookRoutes />
          <RequestedLessonAiVideoHeader />
          <Routes>
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
            <Route path="*" element={<App />} />
          </Routes>
        </A1ChapterSpecificLessonRouteBoundary>
      </ToastProvider>
    </AuthProvider>
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppStartupBoundary>
      <BrowserRouter>
        <AppMountedSignal />
        <RouteScopedBackgroundServices />
        {isFalowenRadioSeoPage ? (
          <FalowenRadioSeoPage />
        ) : (
          <AuthenticatedAppRoutes />
        )}
      </BrowserRouter>
    </AppStartupBoundary>
  </React.StrictMode>
);

reportWebVitals();
