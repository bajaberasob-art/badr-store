import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 🟢 يسمح بالاتصال من أي شبكة محلية
    port: 5173, // تثبيت البورت
  },
  build: {
    chunkSizeWarningLimit: 1500, // إخفاء تحذيرات الحجم المزعجة وقت الرفع
    rollupOptions: {
      output: {
        // 🚀 نظام تقسيم الأكواد لتسريع تحميل المتجر عند الزبائن
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-icons';
            return 'vendor'; // باقي المكتبات
          }
        }
      }
    }
  }
})

