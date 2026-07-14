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
import A1Day11DirectWorkbookRoute, {
  A1_DAY11_DIRECT_WORKBOOK_PATH,
} from './components/A1Day11DirectWorkbookRoute';
import A1Day20Chapter123DirectWorkbookRoute, {
  A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH,
} from './components/A1Day20Chapter123DirectWorkbookRoute';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const normalizedPublicPath = window.location.pathname.replace(/\/+$/, '') || '/';
const isFalowenRadioSeoPage = normalizedPublicPath === '/falowen-radio';

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
    <AuthProvider>
      <ToastProvider>
        <RouteScopedAppServices />
        <Routes>
          <Route
            path={A1_DAY11_DIRECT_WORKBOOK_PATH}
            element={<A1Day11DirectWorkbookRoute />}
          />
          <Route
            path={A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH}
            element={<A1Day20Chapter123DirectWorkbookRoute />}
          />
          <Route path="*" element={<App />} />
        </Routes>
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
