import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    host: '0.0.0.0',
    watch: {
      usePolling: true, // ✅ จำเป็นมากสำหรับ Docker บน Windows/macOS เพื่อให้ Hot Reload ทำงาน 
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // ✅ ชี้ไปที่ localhost เพราะรัน concurrently ใน container เดียวกัน 
        changeOrigin: true
      }
    }
  }
})