import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  // Version et commit (GIT_SHA fourni par le CI) affichés dans la console
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_COMMIT__: JSON.stringify((process.env.GIT_SHA || 'dev').slice(0, 7)),
  },
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
