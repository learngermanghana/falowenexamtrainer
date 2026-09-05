import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const getClientEnv = (mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('REACT_APP_') || key === 'PUBLIC_URL')
  );
};

const splitVendorChunk = (id) => {
  if (!id.includes('node_modules')) return undefined;
  if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'vendor-firebase';
  if (
    id.includes('/react/') ||
    id.includes('/react-dom/') ||
    id.includes('/react-router/') ||
    id.includes('/react-router-dom/') ||
    id.includes('/scheduler/')
  ) return 'vendor-react';
  if (id.includes('/i18next/') || id.includes('/react-i18next/')) return 'vendor-i18n';
  if (id.includes('/jspdf/')) return 'vendor-pdf';
  if (id.includes('/axios/')) return 'vendor-network';
  return 'vendor';
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
