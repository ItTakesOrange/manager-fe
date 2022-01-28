import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9050,
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  },
  plugins: [vue()]
})
