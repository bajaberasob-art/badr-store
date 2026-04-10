import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { StoreProvider, useStore } from './context/StoreContext';

function PWAInitializer({ children }) {
  const { settings } = useStore();

  useEffect(() => {
    // جلب الإعدادات (مع دعم الأسماء الاحتياطية)
    const appName = settings?.storeName || settings?.appName || 'متجر بدر';
    const defaultLogo = 'https://image2url.com/r2/default/images/1775600663860-f3446e28-5506-4195-93cf-a6bc5e44031d.jpg';
    const appIcon = settings?.appLogo || defaultLogo;
    const themeColor = settings?.primaryColor || '#FF8C00';

    // 🎨 1. تلوين شريط المتصفح العلوي ليتطابق مع ثيم المتجر
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;

    // 📱 2. بناء ملف التطبيق (Manifest)
    const myManifest = {
      short_name: appName,
      name: appName,
      description: "أسرع متجر لخدمات الشحن والاتصالات في اليمن",
      icons: [
        { src: appIcon, sizes: "192x192", type: "image/jpeg", purpose: "any maskable" },
        { src: appIcon, sizes: "512x512", type: "image/jpeg" }
      ],
      start_url: "/",
      display: "standalone",
      orientation: "portrait",
      theme_color: themeColor,
      background_color: "#050505",
      dir: "rtl",
      lang: "ar",
      shortcuts: [
        { name: "شحن اتصالات", short_name: "اتصالات", url: "/telecom", icons: [{ src: appIcon, sizes: "192x192" }] },
        { name: "معرض الألعاب", short_name: "ألعاب", url: "/store", icons: [{ src: appIcon, sizes: "192x192" }] }
      ]
    };

    const stringManifest = JSON.stringify(myManifest);
    const blob = new Blob([stringManifest], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(blob);

    let linkManifest = document.querySelector('link[rel="manifest"]');
    if (!linkManifest) {
      linkManifest = document.createElement('link');
      linkManifest.rel = 'manifest';
      document.head.appendChild(linkManifest);
    }
    linkManifest.href = manifestURL;

    // 🔔 3. طلب إذن الإشعارات بشكل آمن وذكي
    try {
      if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    } catch (e) {
      console.log("إشعارات PWA محظورة في هذا المتصفح");
    }

    // 🧹 4. الأهم: تنظيف الذاكرة لعدم تعليق الجوال!
    return () => URL.revokeObjectURL(manifestURL);

  }, [settings]);

  return children;
}

// 🌐 تسجيل الـ Service Worker لتشغيل الموقع أوفلاين وللإشعارات
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW Registered ✅'))
      .catch(err => console.log('SW Registration Failed ❌', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <PWAInitializer>
        <App />
      </PWAInitializer>
    </StoreProvider>
  </React.StrictMode>
);

