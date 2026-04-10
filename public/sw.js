const CACHE_NAME = 'badr-store-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.json'
];

// 🟢 1. تثبيت المحرك وحفظ الملفات الأساسية (Offline Support)
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 🟢 2. تنظيف الذاكرة القديمة عند التحديث
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// 🟢 3. استراتيجية جلب البيانات (سريع ومحدث)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// 🟢 4. محرك استقبال الإشعارات الاحترافي
self.addEventListener('push', (e) => {
  let data = {
    title: 'متجر بدر الشامل 💎',
    body: 'لديك تحديث جديد بخصوص طلبك!',
    icon: '/logo.png',
    url: '/history'
  };

  if (e.data) {
    try {
      // إذا كانت البيانات JSON (الوضع المتقدم)
      const payload = e.data.json();
      data = { ...data, ...payload };
    } catch (err) {
      // إذا كان نص عادي
      data.body = e.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: '/logo.png', // الأيقونة الصغيرة في شريط التنبيهات
    vibrate: [200, 100, 200], // نمط الاهتزاز
    tag: 'order-update', // لمنع تكرار الإشعارات المزعجة
    renotify: true,
    data: { url: data.url || '/' }, // حفظ الرابط لفتحه عند الضغط
    actions: [
      { action: 'open', title: 'عرض التفاصيل 👁️' },
      { action: 'close', title: 'إغلاق ❌' }
    ]
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 🟢 5. التفاعل عند ضغط الزبون على الإشعار
self.addEventListener('notificationclick', (e) => {
  const notif = e.notification;
  const action = e.action;
  const targetUrl = notif.data.url;

  notif.close(); // إغلاق الإشعار فوراً

  if (action !== 'close') {
    e.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        // إذا كان المتجر مفتوح أصلاً، نركز عليه ونوجهه للرابط
        for (let client of windowClients) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        // إذا المتجر مغلق، نفتح نافذة جديدة
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
  }
});

