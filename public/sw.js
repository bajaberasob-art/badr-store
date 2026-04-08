const CACHE_NAME = 'badr-ultimate-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/logo.png'
];

// تثبيت المحرك وحفظ الملفات الأساسية
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// استراتيجية "النت أولاً ثم الذاكرة" لضمان التحديثات
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// استقبال الإشعارات (جاهز للمستقبل)
self.addEventListener('push', (e) => {
  const options = {
    body: e.data ? e.data.text() : 'لديك تحديث جديد من متجر بدر!',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100]
  };
  e.waitUntil(self.registration.showNotification('متجر بدر', options));
});

