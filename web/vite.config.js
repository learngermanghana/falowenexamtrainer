import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const getClientEnv = (mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('REACT_APP_') || key === 'PUBLIC_URL')
  );
};

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    'process.env': JSON.stringify({
      ...getClientEnv(mode),
      NODE_ENV: mode === 'production' ? 'production' : 'development',
      PUBLIC_URL: '',
    }),
  },
  test: false,
}));
