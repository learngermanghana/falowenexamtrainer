import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './i18n';
import App from './App';
import AppStartupBoundary from './components/AppStartupBoundary';
import PublicAuthRouteBridge from './components/PublicAuthRouteBridge';
import PublicAuthMobileRecovery from './components/PublicAuthMobileRecovery';
import FalowenRadioSeoPage from './components/FalowenRadioSeoPage';
import RouteScopedAppServices from './components/RouteScopedAppServices';
import RouteScopedBackgroundServices from './components/RouteScopedBackgroundServices';
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
          <>
            <PublicAuthRouteBridge />
            <PublicAuthMobileRecovery />
            <AuthProvider>
              <ToastProvider>
                <RouteScopedAppServices />
                <App />
              </ToastProvider>
            </AuthProvider>
          </>
        )}
      </BrowserRouter>
    </AppStartupBoundary>
  </React.StrictMode>
);

reportWebVitals();
