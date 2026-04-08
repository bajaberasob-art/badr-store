import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { StoreProvider, useStore } from './context/StoreContext';

function PWAInitializer({ children }) {
  const { settings } = useStore();

  useEffect(() => {
    const appName = settings?.storeName || 'Badr Store';
    const defaultLogo = 'https://image2url.com/r2/default/images/1775600663860-f3446e28-5506-4195-93cf-a6bc5e44031d.jpg';
    const appIcon = settings?.appLogo || defaultLogo;
    const themeColor = settings?.primaryColor || '#FF8C00';

    // 🟢 تطوير الـ Manifest ليشمل الاختصارات والملء الكامل
    const myManifest = {
      short_name: appName,
      name: appName,
      description: "أسرع متجر لخدمات الشحن والاتصالات في اليمن",
      icons: [
        { src: appIcon, sizes: "192x192", type: "image/jpeg", purpose: "any maskable" },
        { src: appIcon, sizes: "512x512", type: "image/jpeg" }
      ],
      start_url: "/",
      display: "standalone", // 📱 ملء الشاشة الاحترافي
      orientation: "portrait",
      theme_color: themeColor,
      background_color: "#050505", // 🎨 لون شاشة الإقلاع
      dir: "rtl",
      lang: "ar",
      // ⚡ إضافة الاختصارات السريعة (تظهر عند الضغط المطول على الأيقونة)
      shortcuts: [
        {
          name: "شحن اتصالات",
          short_name: "اتصالات",
          url: "/telecom",
          icons: [{ src: appIcon, sizes: "192x192" }]
        },
        {
          name: "معرض الألعاب",
          short_name: "ألعاب",
          url: "/store",
          icons: [{ src: appIcon, sizes: "192x192" }]
        }
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

    // 🔔 طلب إذن الإشعارات فور دخول الزبون
    if ("Notification" in window) {
      Notification.requestPermission();
    }

  }, [settings]);

  return children;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
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

