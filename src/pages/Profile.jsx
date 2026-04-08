import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, Phone, Shield, Settings, ChevronLeft, LogOut, 
  Gamepad2, Smartphone, Home as HomeIcon, LayoutGrid, Clock, Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  // 🔴 تم استدعاء كل الدوال المطلوبة هنا لحل مشكلة الشاشة البيضاء نهائياً
  const { currentUser, orders, settings, logout, toggleDarkMode } = useStore();
  const navigate = useNavigate();

  // مراقبة وضع الجهاز التلقائي (دارك مود)
  const [isDark, setIsDark] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleLogout = () => { 
    logout(); 
    navigate('/', { replace: true }); 
  };

  // فلترة الطلبات الخاصة بالمستخدم بأمان
  const myOrders = (orders || []).filter(o => o.userId === currentUser?.id);

  // 🎨 الألوان المركزية (تتناسب مع الفاتح والداكن)
  const bgMain = isDark ? 'bg-[#0f0f13]' : 'bg-[#f4f6f9]';
  const bgCard = isDark ? 'bg-[#18181c] border-white/5' : 'bg-white border-gray-100 shadow-md';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen font-sans relative pb-20 ${bgMain} transition-colors duration-500`} dir="rtl">
      
      {/* 🔴 الهيدر العلوي */}
      <div className={`p-5 sticky top-0 z-40 backdrop-blur-xl border-b ${isDark ? 'bg-[#0f0f13]/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
         <h1 className={`text-xl font-black ${textMain} text-center`}>حسابي</h1>
      </div>

      <div className="animate-fade-in pt-4 px-5">
        
        {/* 🔴 معلومات الحساب */}
        <header className={`flex items-center gap-4 mb-6 ${bgCard} p-5 rounded-[2rem] border transition-all`}>
          <div className="w-20 h-20 rounded-full border-4 border-rose-500/20 flex items-center justify-center bg-rose-500/10 shrink-0">
             <User size={40} className="text-rose-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="overflow-hidden">
                <h2 className={`text-xl font-black mb-1 truncate ${textMain}`}>{currentUser?.name || 'ضيف'}</h2>
                <p className={`text-xs font-bold ${textMuted} flex items-center gap-1 truncate`}><User size={12} /> @{currentUser?.username}</p>
              </div>
              <button className="text-rose-500 p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 transition-colors">
                <Edit2 size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* 🔴 بطاقة الرصيد (لون روز فخم) */}
        <div className={`rounded-[2rem] p-6 mb-8 shadow-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full"></div>
          <div className="flex justify-between items-center mb-2 relative z-10">
            <span className="text-white/90 text-xs font-bold">الرصيد الإجمالي</span>
            <button onClick={() => navigate('/home')} className="text-pink-600 text-[10px] font-black px-3 py-1.5 rounded-full bg-white shadow-sm hover:scale-105 transition-transform">شحن الرصيد</button>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-black tracking-tighter">{currentUser?.balance || 0}</span>
            <span className="text-sm font-bold">ر.ي</span>
          </div>
        </div>

        {/* 🔴 أحدث العمليات */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
             <h3 className={`text-sm font-black ${textMain}`}>أحدث العمليات</h3>
             <button onClick={() => navigate('/history')} className={`text-rose-500 text-[10px] font-bold flex items-center gap-1 hover:underline`}>عرض الكل <ChevronLeft size={12}/></button>
          </div>
          
          <div className="space-y-3">
            {myOrders.length === 0 ? (
               <div className={`text-center p-6 ${bgCard} rounded-2xl border`}><p className={`text-xs ${textMuted} font-bold`}>لا توجد عمليات سابقة</p></div>
            ) : myOrders.slice(0, 3).map(act => (
              <div key={act.id} className={`flex justify-between items-center ${bgCard} rounded-2xl border p-4 shadow-sm transition-all`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* أيقونة ذكية تتغير حسب نوع الطلب */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${act.serviceName?.includes('سداد') ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {act.serviceName?.includes('سداد') ? <Smartphone size={16}/> : <Gamepad2 size={16}/>}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`font-black text-xs mb-1 truncate ${textMain}`}>{act.serviceName?.split(' |')[0] || 'خدمة'}</p>
                    <p className={`text-[9px] ${textMuted} font-bold`}>
                      {act.date?.split(',')[0]} • 
                      <span className={act.status === 'accepted' ? 'text-green-500 ml-1' : act.status === 'rejected' ? 'text-red-500 ml-1' : 'text-orange-500 ml-1'}>
                        {act.status === 'accepted' ? ' مكتمل' : act.status === 'pending' ? ' معلق' : ' مرفوض'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-left shrink-0 pl-2">
                  <p className={`font-black text-sm ${textMain}`}>{act.price}</p>
                  <p className={`text-[9px] ${textMuted} font-bold`}>ر.ي</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🔴 الإعدادات والروابط */}
        <section className="space-y-2 mb-8">
          <button 
            onClick={() => {
              if(typeof toggleDarkMode === 'function') toggleDarkMode();
              else alert('يرجى تغيير المظهر من إعدادات جهازك.');
            }} 
            className={`w-full flex justify-between items-center ${bgCard} rounded-2xl border p-4 transition-all hover:border-rose-500/30 group`}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-gray-500 group-hover:text-rose-500 transition-colors"/>
              <span className={`font-bold text-xs ${textMain}`}>الوضع الداكن/الفاتح</span>
            </div>
            <ChevronLeft size={16} className={textMuted} />
          </button>
          
          <button onClick={() => window.open(`https://wa.me/${settings?.whatsapp || ''}`, '_blank')} className={`w-full flex justify-between items-center ${bgCard} rounded-2xl border p-4 transition-all hover:border-rose-500/30 group`}>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-500 group-hover:text-rose-500 transition-colors"/>
              <span className={`font-bold text-xs ${textMain}`}>الدعم الفني والتواصل</span>
            </div>
            <ChevronLeft size={16} className={textMuted} />
          </button>

          <button onClick={() => alert('سيتم إضافة الشروط قريباً')} className={`w-full flex justify-between items-center ${bgCard} rounded-2xl border p-4 transition-all hover:border-rose-500/30 group`}>
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-gray-500 group-hover:text-rose-500 transition-colors"/>
              <span className={`font-bold text-xs ${textMain}`}>الشروط والأحكام</span>
            </div>
            <ChevronLeft size={16} className={textMuted} />
          </button>
        </section>

        {/* 🔴 زر تسجيل الخروج */}
        <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl p-4 font-black text-sm hover:bg-red-500 hover:text-white transition-all shadow-sm">
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>

      {/* 🔴 الشريط السفلي للراوتر (Bottom Nav) */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 px-5 py-3 pb-safe border-t backdrop-blur-xl ${isDark ? 'bg-[#0f0f13]/90 border-white/5' : 'bg-white/90 border-gray-200'}`}>
        <div className="flex justify-around items-center">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 transition-all">
             <HomeIcon size={22} className={textMuted}/>
             <span className={`text-[9px] font-black ${textMuted}`}>الرئيسية</span>
          </button>
          <button onClick={() => navigate('/games')} className="flex flex-col items-center gap-1 transition-all">
             <Gamepad2 size={22} className={textMuted}/>
             <span className={`text-[9px] font-black ${textMuted}`}>الألعاب</span>
          </button>
          <button onClick={() => navigate('/programs')} className="flex flex-col items-center gap-1 transition-all">
             <LayoutGrid size={22} className={textMuted}/>
             <span className={`text-[9px] font-black ${textMuted}`}>البرامج</span>
          </button>
          <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 transition-all">
             <Clock size={22} className={textMuted}/>
             <span className={`text-[9px] font-black ${textMuted}`}>سجلنا</span>
          </button>
          <button className="flex flex-col items-center gap-1 transition-all">
             <User size={22} className="text-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]"/>
             <span className={`text-[9px] font-black text-rose-500`}>حسابي</span>
          </button>
        </div>
      </div>

    </div>
  );
}

