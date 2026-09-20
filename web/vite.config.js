import { createHash } from 'node:crypto';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const getClientEnv = (mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('REACT_APP_') || key === 'PUBLIC_URL')
  );
};

const offlinePrecacheManifest = () => ({
  name: 'falowen-offline-precache-manifest',
  generateBundle(_options, bundle) {
    const assets = Object.values(bundle)
      .map((output) => `/${output.fileName}`)
      .filter((fileName) => fileName.startsWith('/assets/') && /\.(?:js|css)$/.test(fileName))
      .sort();
    const revision = createHash('sha256')
      .update(assets.join('\n'))
      .digest('hex')
      .slice(0, 16);

    this.emitFile({
      type: 'asset',
      fileName: 'offline-build-assets.json',
      source: JSON.stringify({ revision, assets }, null, 2),
    });
  },
});

const APP_LAZY_ROUTE_COMPONENTS = new Set([
  "CourseTab",
  "CourseLessonPage",
  "AssignmentSubmissionPage",
  "AccountSettings",
  "ClassDiscussionPage",
  "GrammarQuestionTab",
  "AttendanceTab",
  "ClassMembersTab",
  "SpeechTrainerPage",
  "LetterPracticePage",
  "CourseStructurePage",
  "CourseResourceViewerPage",
  "FullClassCalendarPage",
  "StudentResultsPage",
  "GeneralHome",
  "SpeakingPage",
  "WritingPage",
  "VocabExamPage",
  "ExamResources",
  "HorenPage",
  "LesenPage",
  "StudyCalendarPage",
  "QuestionOfDayPage",
  "MyExamFilePage",
  "TutorMarkingPage",
]);

const lazyLevelPages = () => ({
  name: 'falowen-lazy-level-pages',
  enforce: 'pre',
  transform(code, id) {
    const normalizedId = id.replace(/\\/g, '/');
    if (!normalizedId.includes('/src/') || normalizedId.includes('/node_modules/')) return null;

    const routeImportPattern = /^import\s+([A-Za-z0-9_]+)\s+from\s+["']([^"']+)["'];\s*$/gm;
    const isAppEntry = normalizedId.endsWith("/src/App.js");
    let converted = 0;
    const transformed = code.replace(routeImportPattern, (match, componentName, sourcePath) => {
      const sourceFile = sourcePath.split('/').pop() || '';
      const isLevelRoute = /^(A1|A2|B1|B2|C1|C2)/i.test(sourceFile)
        && /(?:Page|Course)$/.test(componentName);
      const isAppRoute = isAppEntry && APP_LAZY_ROUTE_COMPONENTS.has(componentName);
      if (!isLevelRoute && !isAppRoute) return match;

      converted += 1;
      return `const ${componentName} = __falowenCreateLazyRoute(() => import("${sourcePath}"), "${componentName}");`;
    });

    if (!converted) return null;

    const helper = `const __falowenCreateLazyRoute = (loader, displayName) => {\n  const LazyComponent = React.lazy(loader);\n  const LazyRoute = (props) => React.createElement(\n    React.Suspense,\n    { fallback: React.createElement("div", { style: { padding: 16 } }, "Loading…") },\n    React.createElement(LazyComponent, props),\n  );\n  LazyRoute.displayName = displayName;\n  return LazyRoute;\n};\n`;
    const hasReactDefaultImport = /^import\s+React(?:\s*,|\s+from)/m.test(transformed);
    const reactImport = hasReactDefaultImport ? '' : 'import React from "react";\n';

    return {
      code: `${reactImport}${helper}${transformed}`,
      map: null,
    };
  },
});

const splitVendorChunk = (id) => {
  const normalizedId = id.replace(/\\/g, '/');
  if (!normalizedId.includes('/node_modules/')) return undefined;

  if (normalizedId.includes('/firebase/') || normalizedId.includes('/@firebase/')) return 'vendor-firebase';
  if (
    normalizedId.includes('/react/') ||
    normalizedId.includes('/react-dom/') ||
    normalizedId.includes('/react-router/') ||
    normalizedId.includes('/react-router-dom/') ||
    normalizedId.includes('/scheduler/')
  ) return 'vendor-react';
  if (normalizedId.includes('/i18next/') || normalizedId.includes('/react-i18next/')) return 'vendor-i18n';
  if (normalizedId.includes('/jspdf/')) return 'vendor-pdf';
  if (normalizedId.includes('/axios/')) return 'vendor-network';
  if (normalizedId.includes('/html2canvas/')) return 'vendor-html-canvas';
  if (
    normalizedId.includes('/canvg/') ||
    normalizedId.includes('/svg-pathdata/') ||
    normalizedId.includes('/rgbcolor/') ||
    normalizedId.includes('/stackblur-canvas/') ||
    normalizedId.includes('/raf/')
  ) return 'vendor-canvas-support';
  if (normalizedId.includes('/re2js/')) return 'vendor-regex';
  if (
    normalizedId.includes('/pako/') ||
    normalizedId.includes('/fflate/') ||
    normalizedId.includes('/fast-png/') ||
    normalizedId.includes('/iobuffer/')
  ) return 'vendor-codecs';
  if (normalizedId.includes('/core-js/') || normalizedId.includes('/dompurify/')) return 'vendor-runtime';
  return 'vendor-misc';
};

export default defineConfig(({ mode }) => ({
  plugins: [
    offlinePrecacheManifest(),
    lazyLevelPages(),
    react({
      include: /\.[jt]sx?$/,
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.(js|jsx)$/,
    exclude: [],
    jsx: 'automatic',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: splitVendorChunk,
      },
    },
  },
  define: {
    'process.env': JSON.stringify({
      ...getClientEnv(mode),
      NODE_ENV: mode === 'production' ? 'production' : 'development',
      PUBLIC_URL: '',
    }),
  },
  test: false,
}));
