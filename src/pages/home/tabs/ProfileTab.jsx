import React, { useMemo, useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  User, LogOut, Phone, ShieldCheck,
  Moon, Sun, ChevronLeft,
  IdCard, Wallet, Star, Copy, Check,
  ShoppingBag, ShieldAlert, Award
} from 'lucide-react';

export default function ProfileTab() {
  const { currentUser, logout, settings, toggleDarkMode, darkMode, orders = [] } = useStore();
  const [copied, setCopied] = useState(false);

  const isDark = darkMode !== false;
  const themeColor = settings?.primaryColor || '#FF8C00';

  // 🟢 حساب إجمالي طلبات المستخدم
  const myOrdersCount = useMemo(() => {
    return orders.filter(o => String(o.userId) === String(currentUser?.id)).length;
  }, [orders, currentUser]);

  // 🟢 تحديد نوع العضوية والشارة
  const membership = useMemo(() => {
    if (currentUser?.role === 'admin') return { label: 'المدير العام', color: 'text-red-500', icon: <ShieldAlert size={14}/> };
    if (currentUser?.role === 'assistant') return { label: 'طاقم الإدارة', color: 'text-blue-400', icon: <ShieldCheck size={14}/> };
    if (currentUser?.isDistributor) return { label: 'موزع VIP', color: 'text-[#FFD700]', icon: <Star size={14} className="fill-[#FFD700]"/> };
    return { label: 'عضو مميز', color: 'text-gray-400', icon: <Award size={14}/> };
  }, [currentUser]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentUser?.id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-700" dir="rtl">
      
      {/* 🟢 بطاقة الهوية الرقمية الاحترافية */}
      <div className="relative bg-[#0d0d0f] rounded-[3rem] p-8 border border-white/5 overflow-hidden shadow-2xl mb-10 group">
        {/* توهج خلفي يتغير حسب العضوية */}
        <div className={`absolute -right-10 -top-10 w-40 h-40 blur-[80px] rounded-full opacity-10 ${currentUser?.isDistributor ? 'bg-yellow-500' : 'bg-orange-500'}`}></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className={`w-24 h-24 rounded-full p-1 shadow-2xl ${currentUser?.isDistributor ? 'bg-gradient-to-tr from-yellow-400 to-yellow-700' : 'bg-gradient-to-tr from-orange-500 to-red-600'}`}>
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-4 border-[#0d0d0f]">
                   <User size={40} className="text-white" />
                </div>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0d0d0f] shadow-lg"></div>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight mb-1">{currentUser?.name || 'مستخدم عزيز'}</h3>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyId}
              className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all active:scale-95"
            >
              <IdCard size={12} className="text-gray-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {currentUser?.id}</span>
              {copied ? <Check size={12} className="text-green-500"/> : <Copy size={10} className="text-gray-600"/>}
            </button>
          </div>
        </div>

        {/* شبكة الإحصائيات (رصيد | طلبات | عضوية) */}
        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-2">
           <div className="text-center border-l border-white/5">
              <p className="text-[8px] font-black text-gray-600 uppercase mb-1">الرصيد</p>
              <p className="text-xs font-black text-white">{(currentUser?.balance || 0).toLocaleString()}</p>
              <small className="text-[8px] opacity-30 text-gray-400">ر.ي</small>
           </div>
           <div className="text-center border-l border-white/5">
              <p className="text-[8px] font-black text-gray-600 uppercase mb-1">الطلبات</p>
              <p className="text-xs font-black text-white">{myOrdersCount}</p>
              <small className="text-[8px] opacity-30 text-gray-400">عملية</small>
           </div>
           <div className="text-center">
              <p className="text-[8px] font-black text-gray-600 uppercase mb-1">العضوية</p>
              <p className={`text-[10px] font-black flex items-center justify-center gap-1 ${membership.color}`}>
                {membership.icon} {membership.label}
              </p>
           </div>
        </div>
      </div>

      {/* 🟢 خيارات التحكم والإعدادات */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-4 mb-4">إعدادات النظام</h4>

        {/* تبديل المظهر */}
        <button
          onClick={toggleDarkMode}
          className="w-full bg-[#0d0d0f]/60 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/5 flex justify-between items-center group active:scale-[0.98] transition-all shadow-lg"
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
          className="w-full bg-[#0d0d0f]/60 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/5 flex justify-between items-center group active:scale-[0.98] transition-all shadow-lg"
        >
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-500/10 rounded-2xl text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all border border-green-500/10">
                <Phone size={20} />
             </div>
             <div className="text-right">
                <p className="text-sm font-black text-white">مركز الدعم الفني</p>
                <p className="text-[9px] text-gray-500 font-bold">تواصل معنا عبر واتساب</p>
             </div>
          </div>
          <ChevronLeft size={18} className="text-gray-700 group-hover:translate-x-[-5px] transition-transform" />
        </button>

        {/* أمان الحساب */}
        <div className="w-full bg-[#0d0d0f]/40 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/5 flex justify-between items-center opacity-60">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/5 rounded-2xl text-gray-500">
                <ShieldCheck size={20} />
             </div>
             <span className="text-sm font-black text-white">تشفير الحساب (SSL)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
             <span className="text-[8px] font-black text-green-500 uppercase">مفعل</span>
          </div>
        </div>
      </div>

      {/* زر تسجيل الخروج */}
      <button
        onClick={() => { if(window.confirm('هل تريد تسجيل الخروج؟')) logout(); }}
        className="w-full mt-12 py-5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 rounded-[2.5rem] flex items-center justify-center gap-3 font-black text-sm active:scale-95 transition-all shadow-xl shadow-red-600/5"
      >
        <LogOut size={20} /> تسجيل الخروج من الحساب
      </button>

      {/* لمسة تقنية */}
      <p className="mt-10 text-center text-[8px] font-black text-gray-700 uppercase tracking-[0.4em]">
        Version 2.0.4 • Badr Tech
      </p>

    </div>
  );
}

