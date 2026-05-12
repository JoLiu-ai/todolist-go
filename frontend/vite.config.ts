import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:8080';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.FRONTEND_PORT || env.VITE_FRONTEND_PORT || 5173),
      proxy: {
        '/api/v1': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/api/v2': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
