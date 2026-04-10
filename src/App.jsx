import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MessageCircle, Construction, Clock, LogOut } from 'lucide-react';
import { useStore } from './context/StoreContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import NotificationCenter from './NotificationCenter'; // 🟢 استيراد مركز الإشعارات
import InstallPrompt from './components/InstallPrompt';

export default function App() {
  const { currentUser, settings, logout } = useStore();

  // 🟢 استدعاء الإعدادات مع قيم افتراضية
  const isStoreOpen = settings?.isStoreOpen !== false;
  const whatsappNumber = settings?.whatsapp || "967736724105";

  // دالة مساعدة لمعرفة هل المستخدم "إدارة" (مدير أو مساعد)
  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'assistant';

  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 relative font-sans">
        <InstallPrompt />

        {/* 💬 زر الواتساب العائم */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-6 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          <MessageCircle size={28} fill="currentColor" />
          <span className="absolute right-full mr-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">تواصل مع الدعم</span>
        </a>

        <Routes>
          {/* 🔐 مسار تسجيل الدخول - توجيه ذكي حسب الرتبة */}
          <Route
            path="/login"
            element={!currentUser ? <Login /> : <Navigate to={isStaff ? "/admin" : "/"} />}
          />

          {/* ⚙️ مسار الإدارة - متاح للمدير والمساعد */}
          <Route
            path="/admin/*"
            element={isStaff ? <Admin /> : <Navigate to="/login" />}
          />

          {/* 🔔 مسار مركز الإشعارات الجديد */}
          <Route 
            path="/notifications" 
            element={currentUser ? <NotificationCenter /> : <Navigate to="/login" />} 
          />

          {/* 🏠 مسار المتجر وشاشة الصيانة */}
          <Route path="/*" element={
            !currentUser ? <Navigate to="/login" /> :
            (isStoreOpen || isStaff) ? <Home /> : (
              <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
                
                {/* أيقونة الصيانة */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-orange-500/20 blur-[60px] animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl rotate-3">
                    <Construction size={60} className="text-orange-500" />
                  </div>
                </div>

                <h1 className="text-3xl font-black text-white mb-4">نحن نطور تجربتك</h1>
                <p className="text-gray-400 font-bold max-w-sm leading-relaxed mb-10 text-sm">
                  المتجر حالياً في وضع الصيانة المؤقتة لتوفير خدمات أفضل. سنعود قريباً جداً! 🚀
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                   <div className="flex items-center justify-center gap-2 py-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-500 font-black text-xs uppercase tracking-[0.2em]">
                      <Clock size={16} />
                      <span>قريباً العودة للعمل</span>
                   </div>

                   <button
                     onClick={logout}
                     className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold bg-white/5 py-4 rounded-2xl border border-white/5 active:scale-95"
                   >
                     <LogOut size={18} />
                     تسجيل خروج (العودة للإدارة)
                   </button>
                </div>
              </div>
            )
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

