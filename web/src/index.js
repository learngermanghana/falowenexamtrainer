import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './i18n';
import App from './App';
import SubmitPageLevelGuidanceInjector from './components/SubmitPageLevelGuidanceInjector';
import SubmitSuccessScreenInjector from './components/SubmitSuccessScreenInjector';
import MobileHeaderMenuInjector from './components/MobileHeaderMenuInjector';
import LandingPublicLanguageGuard from './components/LandingPublicLanguageGuard';
import PublicAuthRouteBridge from './components/PublicAuthRouteBridge';
import PublicClassSelectInjector from './components/PublicClassSelectInjector';
import CourseBookTerminologyInjector from './components/CourseBookTerminologyInjector';
import LockedSubmissionCardCompactor from './components/LockedSubmissionCardCompactor';
import B1WorkbookWritingCheatSheetInjector from './components/B1WorkbookWritingCheatSheetInjector';
import BookPdfDownloadInjector from './components/BookPdfDownloadInjector';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { registerOfflineServiceWorker } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PublicAuthRouteBridge />
      <AuthProvider>
        <ToastProvider>
          <LandingPublicLanguageGuard />
          <PublicClassSelectInjector />
          <MobileHeaderMenuInjector />
          <SubmitPageLevelGuidanceInjector />
          <SubmitSuccessScreenInjector />
          <CourseBookTerminologyInjector />
          <LockedSubmissionCardCompactor />
          <B1WorkbookWritingCheatSheetInjector />
          <BookPdfDownloadInjector />
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in the app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
registerOfflineServiceWorker();
