import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Gamepad2, Smartphone, Globe, LayoutGrid,
  Wallet, ArrowUpRight, Zap, Star, Sparkles,
  User, ShieldCheck, CreditCard, ChevronLeft, Flame
} from 'lucide-react';

export default function MainTab({ onNavigate }) {
  // 🟢 جلب الخدمات (services) عشان نفلتر منها العروض النارية
  const { currentUser, ads = [], settings, services = [] } = useStore();
  const [adIdx, setAdIdx] = useState(0);
  const [greeting, setGreeting] = useState('طاب يومك،');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('صباح الخير،');
    else if (hour < 18) setGreeting('طاب يومك،');
    else setGreeting('مساء الخير،');
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => setAdIdx(p => (p + 1) % ads.length), 5000);
    return () => clearInterval(interval);
  }, [ads]);

  const themeColor = settings?.primaryColor || '#FF8C00';
  const exchangeRate = settings?.exchangeRate || 1400;

  // 🟢 فلترة الخدمات التي تم تحديدها كـ "نار 🔥" من الإدارة
  const hotDeals = services.filter(s => s.isPopular && s.isVisible);

  return (
    <div className="p-5 pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* الترحيب */}
      <div className="flex justify-between items-end px-1 pt-2">
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">{greeting}</p>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            {currentUser?.name || 'يا وحش'} <Sparkles size={18} className="text-yellow-500 shadow-xl" />
          </h2>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shadow-lg">
           <User size={24} />
        </div>
      </div>

      {/* كرت الرصيد الملكي */}
      <div className="relative rounded-[3rem] p-8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] group active:scale-[0.98] transition-all"
           style={{ background: `linear-gradient(145deg, ${themeColor} 0%, #000 120%)` }}>
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 blur-[80px] rounded-full"></div>
        <div className="relative z-10 flex justify-between items-start">
           <div>
              <div className="flex items-center gap-2 mb-3">
                 <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md"><Wallet size={16} className="text-white" /></div>
                 <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">المحفظة الإلكترونية</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter flex items-baseline gap-2">
                {(currentUser?.balance || 0).toLocaleString()}
                <span className="text-sm opacity-60 font-bold">ر.ي</span>
              </h2>
           </div>
           <button className="p-4 bg-white/10 backdrop-blur-xl rounded-[1.5rem] text-white border border-white/10 shadow-xl">
              <ArrowUpRight size={24} />
           </button>
        </div>
        <div className="mt-8 flex items-center gap-2 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
           <ShieldCheck size={12} /> نظام مالي مشفر وآمن
        </div>
      </div>

      {/* الشريط الإخباري المتحرك */}
      <div className="flex items-center gap-3 bg-[#0a0a0c] p-3 rounded-2xl border border-white/5 shadow-inner overflow-hidden">
        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 animate-pulse">
           <Zap size={16} />
        </div>
        <div className="flex-1 overflow-hidden">
           <marquee scrollamount="4" direction="right" className="text-[11px] font-black text-white/80 tracking-widest uppercase flex gap-8">
              {settings?.scrollingNews || '🔥 عروض حصرية على شدات ببجي ... ⚡️ سداد يمن موبايل فوري وآمن'}
           </marquee>
        </div>
      </div>

      {/* الإعلانات المتحركة (البنرات) */}
      {ads.length > 0 && (
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[21/9] shadow-2xl border border-white/5 group">
          <img src={ads[adIdx]?.image} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="Promotion" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {ads.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === adIdx ? 'bg-white w-6' : 'bg-white/20 w-1.5'}`}></div>
            ))}
          </div>
        </div>
      )}

      {/* 🟢 تم حذف الشريط العشوائي (عروووووض خااااصه) من هنا بناءً على طلبك */}

      {/* شبكة الأقسام */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'programs', label: 'البرامج', icon: <LayoutGrid size={28}/>, color: 'from-blue-500/20 to-blue-600/5', iconColor: 'text-blue-500' },
          { id: 'games', label: 'الألعاب', icon: <Gamepad2 size={28}/>, color: 'from-orange-500/20 to-orange-600/5', iconColor: 'text-orange-500' },
          { id: 'wifi', label: 'WIFI', icon: <Globe size={28}/>, color: 'from-green-500/20 to-green-600/5', iconColor: 'text-green-500' },
          { id: 'telecom', label: 'سداد', icon: <Smartphone size={28}/>, color: 'from-purple-500/20 to-purple-600/5', iconColor: 'text-purple-500' },
          { id: 'cards', label: 'البطاقات الرقمية', icon: <CreditCard size={28}/>, color: 'from-pink-500/20 to-pink-600/5', iconColor: 'text-pink-500' }
        ].map(cat => (
          <button key={cat.id} onClick={() => onNavigate(cat.id)}
                  className={`relative bg-gradient-to-br ${cat.color} p-7 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 active:scale-95 transition-all overflow-hidden group shadow-lg ${cat.id === 'cards' ? 'col-span-2 flex-row py-5 h-24' : 'aspect-square'}`}>
            <div className={`p-4 bg-black/40 rounded-2xl shadow-inner ${cat.iconColor} group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <span className="font-black text-[11px] text-white/90 tracking-widest uppercase">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 🟢 شريط العروض القابل للسحب (مربوط بقاعدة البيانات الحقيقية) */}
      {hotDeals.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2 px-1">
             عروض نارية <Flame size={18} className="text-orange-500 fill-orange-500 animate-pulse" />
          </h3>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pr-1 -mr-1 custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
             {hotDeals.map((service) => {
               // نأخذ سعر أول باقة في اللعبة كـ "سعر مبدئي"
               const startingPrice = service.packages?.[0] ? Math.round(service.packages[0].price * exchangeRate) : 0;
               
               return (
                 <div 
                    key={service.id} 
                    onClick={() => onNavigate(service.category)} // 🟢 يحوله فوراً لقسم اللعبة
                    className="min-w-[80%] snap-center bg-[#121217] p-5 rounded-[2rem] border border-white/5 flex flex-col gap-4 group active:scale-[0.98] transition-all shadow-xl cursor-pointer"
                 >
                    <div className="flex justify-between items-start">
                       {/* عرض صورة اللعبة الحقيقية من الإدارة */}
                       <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                          {service.image ? (
                             <img src={service.image} className="w-full h-full object-cover" alt={service.name} />
                          ) : (
                             <div className="w-full h-full bg-white/5 flex items-center justify-center text-orange-500"><Gamepad2 size={24} /></div>
                          )}
                       </div>                                                             
                       {/* 🟢 تم حذف التاج (خصم 15%) من هنا */}
                    </div>
                    <div>                                                                 
                       <h4 className="font-black text-white text-base mb-2 truncate">{service.name}</h4>
                       <div className="flex justify-between items-center">
                          <span className="text-white font-black text-xl">
                            {startingPrice.toLocaleString()} <small className="text-[10px] opacity-40">ر.ي</small>
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-all">
                             <ChevronLeft size={16} />                                       
                          </div>
                       </div>
                    </div>
                 </div>
               )
             })}
          </div>
        </div>
      )}

    </div>
  );
}

