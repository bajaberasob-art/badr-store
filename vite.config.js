import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 🟢 يسمح بالاتصال من أي شبكة محلية
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
})

