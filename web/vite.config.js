import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const getClientEnv = (mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('REACT_APP_') || key === 'PUBLIC_URL')
  );
};

const sanitizeChunkName = (value) =>
  String(value || '')
    .replace(/^@/, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const packageChunkName = (id) => {
  const marker = '/node_modules/';
  const markerIndex = id.lastIndexOf(marker);
  if (markerIndex < 0) return undefined;

  const packagePath = id.slice(markerIndex + marker.length);
  const parts = packagePath.split('/').filter(Boolean);
  if (!parts.length) return undefined;
  const packageName = parts[0].startsWith('@') && parts[1]
    ? `${parts[0]}-${parts[1]}`
    : parts[0];
  return `vendor-${sanitizeChunkName(packageName)}`;
};

const levelDayChunk = (id) => {
  const componentMarker = '/src/components/';
  const markerIndex = id.indexOf(componentMarker);
  if (markerIndex < 0) return undefined;

  const relative = id.slice(markerIndex + componentMarker.length);
  const fileName = relative.split('/').pop() || '';
  const levelMatch = fileName.match(/^(A1|A2|B1|B2|C1|C2)(?:Day)?(\d{1,2})?/i);
  if (!levelMatch) return undefined;

  const level = levelMatch[1].toLowerCase();
  const day = Number(levelMatch[2]);
  if (!Number.isFinite(day) || day < 1 || day > 31) return `course-${level}-shared`;

  const rangeStart = Math.floor((day - 1) / 7) * 7 + 1;
  const rangeEnd = Math.min(rangeStart + 6, 31);
  return `course-${level}-days-${rangeStart}-${rangeEnd}`;
};

const genericComponentChunk = (id) => {
  if (!id.includes('/src/components/')) return undefined;
  if (id.includes('/src/components/selfLearning/')) return 'feature-self-learning';

  const fileName = id.split('/').pop() || '';
  if (/Exam|Goethe|Readiness/i.test(fileName)) return 'feature-exams';
  if (/Speaking|Speech|Pronunciation|Recorder/i.test(fileName)) return 'feature-speaking';
  if (/Writing|Letter|Essay/i.test(fileName)) return 'feature-writing';
  if (/Workbook|Course|Lesson|Campus/i.test(fileName)) return 'feature-learning-shell';

  const first = fileName.charAt(0).toLowerCase();
  if (first >= 'a' && first <= 'f') return 'components-a-f';
  if (first >= 'g' && first <= 'l') return 'components-g-l';
  if (first >= 'm' && first <= 'r') return 'components-m-r';
  return 'components-s-z';
};

const splitAppChunk = (id) => {
  const normalizedId = id.replace(/\\/g, '/');

  if (normalizedId.includes('/node_modules/')) {
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
    return packageChunkName(normalizedId);
  }

  // Keep this module owned by its dynamic import so opening Grammar creates a real lazy chunk.
  if (normalizedId.endsWith('/src/components/A2B1WorkbookGrammarNotesContent.js')) return undefined;

  const courseChunk = levelDayChunk(normalizedId);
  if (courseChunk) return courseChunk;

  const componentChunk = genericComponentChunk(normalizedId);
  if (componentChunk) return componentChunk;

  if (normalizedId.includes('/src/data/')) {
    const dataFile = normalizedId.split('/').pop() || '';
    const level = dataFile.match(/^(a1|a2|b1|b2|c1|c2)/i)?.[1]?.toLowerCase();
    return level ? `data-${level}` : 'data-core';
  }
  if (normalizedId.includes('/src/services/')) return 'app-services';
  if (normalizedId.includes('/src/context/')) return 'app-context';
  if (normalizedId.includes('/src/lib/') || normalizedId.includes('/src/utils/')) return 'app-utils';

  return undefined;
};

export default defineConfig(({ mode }) => ({
  plugins: [
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
        manualChunks: splitAppChunk,
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
