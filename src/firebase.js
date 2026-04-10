import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";

// 🔐 إعدادات الربط السحابي لمتجر بدر
const firebaseConfig = {
  apiKey: "AIzaSyBkudX7Hk-jlsAA4V7KArlnvu88B6lEYek",
  authDomain: "badr-store-8360c.firebaseapp.com",
  projectId: "badr-store-8360c",
  storageBucket: "badr-store-8360c.firebasestorage.app",
  messagingSenderId: "59012637023",
  appId: "1:59012637023:web:eb8a8639037cffb8d596ea"
};

// 🟢 1. تشغيل المحرك الرئيسي
const app = initializeApp(firebaseConfig);

// 🟢 2. تشغيل قاعدة البيانات (Firestore)
export const db = getFirestore(app);

// 🟢 3. تشغيل نظام الإشعارات (Messaging)
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// 🟢 4. تشغيل نظام الملفات (Storage)
export const storage = getStorage(app);

// 🟢 5. تفعيل ميزة العمل "بدون إنترنت" (Offline Mode)
// هذي تخلي المتجر يفتح طيارة حتى لو النت ضعيف!
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('تنبيه: تعدد التبويبات يمنع العمل بدون إنترنت في وقت واحد.');
    } else if (err.code === 'unimplemented') {
      console.warn('تنبيه: هذا المتصفح لا يدعم ميزة العمل بدون إنترنت.');
    }
  });
}

export default app;

