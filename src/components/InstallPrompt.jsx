import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isApple);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // ظهور النافذة بعد 3 ثواني من فتح الموقع
      setTimeout(() => setShowModal(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isApple && !window.navigator.standalone) {
      setTimeout(() => setShowModal(true), 4000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center p-6 animate-in fade-in duration-500 bg-black/80 backdrop-blur-md" dir="rtl">
      <div className="bg-[#121217] w-full max-w-sm rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-20 duration-700 relative">
        <div className="p-8 text-center relative z-10">
          <button onClick={() => setShowModal(false)} className="absolute top-4 left-4 p-2 bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
          
          <div className="w-28 h-28 mx-auto rounded-[2rem] bg-black p-2 border border-white/10 shadow-2xl mb-6 relative">
            <img src="https://image2url.com/r2/default/images/1775600663860-f3446e28-5506-4195-93cf-a6bc5e44031d.jpg" className="w-full h-full object-cover rounded-xl" alt="Badr Store" />
          </div>
          
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">تطبيق متجر بدر</h3>
          <p className="text-xs font-bold text-gray-400 px-2 leading-relaxed">استمتع بتجربة أسرع وشحن بضغطة زر من شاشتك!</p>
        </div>

        <div className="p-8 pt-0 relative z-10">
          {isIOS ? (
            <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 space-y-4 text-right">
              <p className="text-[11px] font-black text-orange-500 uppercase text-center">لمستخدمي آيفون </p>
              <div className="flex items-center gap-3 text-white text-xs font-bold">
                <div className="p-2.5 bg-white/10 rounded-xl"><Share size={18}/></div>
                <span>اضغط على زر "مشاركة" في الأسفل</span>
              </div>
              <div className="flex items-center gap-3 text-white text-xs font-bold">
                <div className="p-2.5 bg-white/10 rounded-xl"><PlusSquare size={18}/></div>
                <span>اختر "إضافة إلى الشاشة الرئيسية"</span>
              </div>
            </div>
          ) : (
            <button onClick={handleInstall} className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
              <Download size={22} /> تثبيت التطبيق الآن
            </button>
          )}
          <button onClick={() => setShowModal(false)} className="w-full mt-5 text-[10px] font-black text-gray-600 uppercase hover:text-white transition-colors">إكمال التصفح بدون تثبيت</button>
        </div>
      </div>
    </div>
  );
}

