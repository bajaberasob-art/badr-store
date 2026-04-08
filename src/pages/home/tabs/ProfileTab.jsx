import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { 
  User, LogOut, Phone, ShieldCheck, 
  Settings, Moon, Sun, ChevronLeft, 
  IdCard, Wallet, Star, LayoutGrid,
  CheckCircle // 🟢 تم إضافة هذه الكلمة هنا لإصلاح الخطأ
} from 'lucide-react';

export default function ProfileTab() {
  const { currentUser, logout, settings, toggleDarkMode, darkMode } = useStore();

  const isDark = darkMode !== false;
  const themeColor = settings?.primaryColor || '#FF8C00';

  return (
    <div className="p-6 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-700" dir="rtl">
      
      {/* 🟢 بطاقة الهوية الرقمية */}
      <div className="relative bg-[#0d0d0f] rounded-[3rem] p-8 border border-white/5 overflow-hidden shadow-2xl mb-10 group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/5 blur-[80px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 p-1 animate-pulse">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-4 border-[#0d0d0f]">
                   <User size={40} className="text-white" />
                </div>
             </div>
             <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0d0d0f] shadow-lg"></div>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight mb-1">{currentUser?.name || 'مستخدم عزيز'}</h3>
          <div className="flex items-center gap-2 px-4 py-1 bg-white/5 rounded-full border border-white/5">
             <IdCard size={12} className="text-gray-500" />
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">المعرف: {currentUser?.id}</span>
          </div>
        </div>

        {/* شريط الرصيد والعضوية */}
        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
           <div className="text-center border-l border-white/5">
              <p className="text-[9px] font-black text-gray-600 uppercase mb-1">الرصيد</p>
              <p className="text-sm font-black text-white">{(currentUser?.balance || 0).toLocaleString()} <small className="text-[8px] opacity-40">ر.ي</small></p>
           </div>
           <div className="text-center">
              <p className="text-[9px] font-black text-gray-600 uppercase mb-1">العضوية</p>
              <p className="text-sm font-black text-orange-500 flex items-center justify-center gap-1">VIP <Star size={10} className="fill-orange-500"/></p>
           </div>
        </div>
      </div>

      {/* 🟢 خيارات التحكم */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-2 mb-4">إعدادات النظام</h4>
        
        {/* تبديل المظهر */}
        <button 
          onClick={toggleDarkMode}
          className="w-full bg-[#0d0d0f]/60 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex justify-between items-center group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/5 rounded-2xl text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-all">
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
             </div>
             <span className="text-sm font-black text-white">المظهر الداكن</span>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 flex items-center transition-all ${isDark ? 'bg-green-500' : 'bg-gray-800'}`}>
             <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${isDark ? 'translate-x-0' : '-translate-x-6'}`}></div>
          </div>
        </button>

        {/* الدعم الفني */}
        <button 
          onClick={() => window.open(`https://wa.me/${settings?.whatsapp}`)}
          className="w-full bg-[#0d0d0f]/60 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex justify-between items-center group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-500/10 rounded-2xl text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
                <Phone size={20} />
             </div>
             <span className="text-sm font-black text-white">مركز الدعم الفني</span>
          </div>
          <ChevronLeft size={18} className="text-gray-700 group-hover:translate-x-[-5px] transition-transform" />
        </button>

        {/* أمان الحساب (هنا كان الخطأ ✅) */}
        <div className="w-full bg-[#0d0d0f]/60 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex justify-between items-center opacity-40">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/5 rounded-2xl text-gray-500">
                <ShieldCheck size={20} />
             </div>
             <span className="text-sm font-black text-white">تشفير الحساب (مفعل)</span>
          </div>
          <CheckCircle size={18} className="text-green-500" />
        </div>
      </div>

      {/* زر تسجيل الخروج */}
      <button 
        onClick={logout}
        className="w-full mt-12 py-5 bg-red-600/10 border border-red-600/20 rounded-[2rem] flex items-center justify-center gap-3 text-red-500 font-black text-sm active:scale-95 transition-all shadow-xl shadow-red-600/5"
      >
        <LogOut size={20} /> تسجيل الخروج من المتجر
      </button>

    </div>
  );
}

