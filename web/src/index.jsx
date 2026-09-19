import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './i18n';
import AppStartupBoundary from './components/AppStartupBoundary';
import reportWebVitals from './reportWebVitals';

const normalizedPublicPath = window.location.pathname.replace(/\/+$/, '') || '/';
const isPlacementTestPage = normalizedPublicPath === '/placement-test';

const PlacementTestPage = React.lazy(() => import('./components/PlacementTestPage'));
const AuthenticatedAppRoot = React.lazy(() => import('./AuthenticatedAppRoot'));

const A1_DAY0_TUTORIAL_ROUTE = '/campus/course/lesson/A1/0';
const A1_DAY0_WORKBOOK_ROUTE = '/campus/course/a1-day-0-orientation-and-knowledge-test-workbook';
const A2_DAY27_GRAMMAR_ROUTE = '/campus/course/a2-day-27-digitale-kommunikation-dass-grammar';

const InitialRouteLoader = () => (
  <main
    aria-live="polite"
    style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      boxSizing: 'border-box',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <strong>{isPlacementTestPage ? 'Opening placement test…' : 'Opening Falowen…'}</strong>
      <div style={{ marginTop: 8, fontSize: 14, color: '#64748b' }}>Loading only what this page needs.</div>
    </div>
  </main>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppStartupBoundary>
      <BrowserRouter>
        <Suspense fallback={<InitialRouteLoader />}>
          {isPlacementTestPage ? <PlacementTestPage /> : <AuthenticatedAppRoot />}
        </Suspense>
      </BrowserRouter>
    </AppStartupBoundary>
  </React.StrictMode>,
);

reportWebVitals();

export { A1_DAY0_TUTORIAL_ROUTE, A1_DAY0_WORKBOOK_ROUTE, A2_DAY27_GRAMMAR_ROUTE };
