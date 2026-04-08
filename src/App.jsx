import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MessageCircle, Construction, Clock, LogOut } from 'lucide-react'; 
import { useStore } from './context/StoreContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import InstallPrompt from './components/InstallPrompt';

export default function App() {
  const { currentUser, settings, logout } = useStore();
  
  // 🟢 هنا السر: رجعنا الأسماء زي ما هي مبرمجة في صفحة الإدارة حقتك!
  const isStoreOpen = settings?.isStoreOpen !== false; 
  const whatsappNumber = settings?.whatsapp || "967736724105";

  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#050505] selection:bg-orange-500/30 relative">
        <InstallPrompt />
        
        {/* زر الواتساب العائم */}
        <a 
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-6 z-[99] bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all animate-bounce-slow"
        >
          <MessageCircle size={28} fill="currentColor" />
        </a>

        <Routes>
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to={currentUser.role === 'admin' ? "/admin" : "/"} />} />
          <Route path="/admin/*" element={currentUser?.role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
          
          <Route path="/*" element={
            !currentUser ? <Navigate to="/login" /> : 
            (isStoreOpen || currentUser.role === 'admin') ? <Home /> : (
              <div className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-32 h-32 bg-orange-500/10 rounded-full flex items-center justify-center mb-8 border border-orange-500/20 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                  <Construction size={60} className="text-orange-500 animate-pulse" />
                </div>
                <h1 className="text-3xl font-black text-white mb-4">المتجر في صيانة مؤقتة</h1>
                <p className="text-gray-400 font-bold max-w-xs leading-relaxed mb-8 text-sm">
                  نحن نحدث النظام لنقدم لك خدمة أسرع. سنعود لاستقبال طلباتكم قريباً! 🚀
                </p>
                <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-orange-500 font-black text-xs uppercase tracking-widest mb-8">
                  <Clock size={16} />
                  <span>ترقبوا العودة قريباً</span>
                </div>
                
                <button 
                  onClick={logout} 
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold bg-white/5 px-6 py-3 rounded-2xl border border-white/5 active:scale-95"
                >
                  <LogOut size={18} />
                  تسجيل خروج للعودة للإدارة
                </button>
              </div>
            )
          } />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

