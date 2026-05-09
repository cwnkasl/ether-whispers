import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/coze-api': {
        target: 'https://95gjh3spy5.coze.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze-api/, ''),
      },
    },
  },
})
