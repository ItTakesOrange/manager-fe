import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  /*
  css: {
    // 例如需要使用全局预定义变量
    preprocessorOptions: {
      scss: {
        additionalData: `'@import '@/assets/style/base.scss'`
      }
    }
  },
  */
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
