import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Gamepad2, Smartphone, Globe, LayoutGrid,
  Wallet, ArrowUpRight, Zap, Sparkles,
  User, ShieldCheck, CreditCard, ChevronLeft, Flame,
  Moon, Sun, Monitor // 🟢 أيقونات وضع الحرابة
} from 'lucide-react';

// 🟢 مكون عداد الأرقام البنكي (تأثير تزايد الرصيد)
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    let totalDuration = 1000;
    let incrementTime = (totalDuration / end) * 50;

    let timer = setInterval(() => {
      start += Math.ceil(end / 20);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count.toLocaleString()}</>;
};

export default function MainTab({ onNavigate }) {
  // 🟢 جلب الخدمات والمخ
  const { currentUser, ads = [], settings, services = [], darkMode, toggleDarkMode } = useStore();
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

  // 🟢 فلترة الخدمات "النار 🔥" من الإدارة
  const hotDeals = services.filter(s => s.isPopular && s.isVisible);

  return (
    <div className="p-5 pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 transition-colors duration-500">
      
      {/* الترحيب وزر وضع الحرابة 🌗 */}
      <div className="flex justify-between items-end px-1 pt-2">
        <div>
          <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-1">{greeting}</p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-500">
            {currentUser?.name?.split(' ')[0] || 'يا غالي'} <Sparkles size={18} className="text-yellow-500 animate-pulse" />
          </h2>
        </div>
        <div className="flex items-center gap-3">
           {/* 🌗 زر وضع الحرابة (ليلي/نهاري/نظام) */}
           <button 
              onClick={toggleDarkMode} 
              className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 shadow-sm dark:shadow-inner hover:scale-105 active:scale-95 transition-all"
           >
              {darkMode === true ? <Moon size={22} className="text-indigo-400" /> : 
               darkMode === false ? <Sun size={22} className="text-orange-500" /> : 
               <Monitor size={22} className="text-gray-500" />}
           </button>

           <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 shadow-sm dark:shadow-inner">
             <User size={24} />
           </div>
        </div>
      </div>

      {/* كرت الرصيد الملكي */}
      <div className="relative rounded-[3rem] p-8 overflow-hidden shadow-2xl group active:scale-[0.98] transition-all duration-300"
           style={{ background: `linear-gradient(145deg, ${themeColor} 0%, #050505 120%)` }}>
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex justify-between items-start">
           <div>
              <div className="flex items-center gap-2 mb-3">
                 <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md"><Wallet size={16} className="text-white" /></div>
                 <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">المحفظة الإلكترونية</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter flex items-baseline gap-2">
                <AnimatedCounter value={currentUser?.balance || 0} />
                <span className="text-sm opacity-80 font-bold">ر.ي</span>
              </h2>
           </div>
           <button className="p-4 bg-white/10 backdrop-blur-xl rounded-[1.5rem] text-white border border-white/20 shadow-xl hover:bg-white/20 transition-colors">
              <ArrowUpRight size={24} />
           </button>
        </div>
        <div className="mt-8 flex items-center gap-2 text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">
           <ShieldCheck size={12} /> نظام مالي مشفر ومزامن سحابياً
        </div>
      </div>

      {/* الشريط الإخباري الحديث */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#0a0a0c] p-3 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-inner overflow-hidden relative transition-colors duration-500">
        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 animate-pulse z-10 relative">
           <Zap size={16} />
        </div>
        <div className="flex-1 overflow-hidden relative h-5">
           <div className="whitespace-nowrap absolute right-0 text-[11px] font-black text-gray-700 dark:text-white/80 tracking-widest uppercase flex gap-8 animate-[marquee_15s_linear_infinite]">
              {settings?.scrollingNews || '🔥 عروض حصرية على شدات ببجي ... ⚡️ سداد يمن موبايل فوري وآمن'}
           </div>
        </div>
      </div>

      {/* الإعلانات المتحركة (البنرات) */}
      {ads.length > 0 && (
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[21/9] shadow-lg border border-gray-200 dark:border-white/5 group">
          <img src={ads[adIdx]?.image} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="Promotion" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {ads.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === adIdx ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}></div>
            ))}
          </div>
        </div>
      )}

      {/* شبكة الأقسام (تأثير ضغط 3D) */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'programs', label: 'البرامج', icon: <LayoutGrid size={28}/>, color: 'from-blue-500/20 to-blue-600/5', iconColor: 'text-blue-500' },
          { id: 'games', label: 'الألعاب', icon: <Gamepad2 size={28}/>, color: 'from-orange-500/20 to-orange-600/5', iconColor: 'text-orange-500' },
          { id: 'wifi', label: 'WIFI', icon: <Globe size={28}/>, color: 'from-green-500/20 to-green-600/5', iconColor: 'text-green-500' },
          { id: 'telecom', label: 'سداد', icon: <Smartphone size={28}/>, color: 'from-purple-500/20 to-purple-600/5', iconColor: 'text-purple-500' },
          { id: 'cards', label: 'البطاقات الرقمية', icon: <CreditCard size={28}/>, color: 'from-pink-500/20 to-pink-600/5', iconColor: 'text-pink-500' }
        ].map(cat => (
          <button key={cat.id} onClick={() => onNavigate(cat.id)}
            className={`relative bg-gradient-to-br ${cat.color} p-7 rounded-[2.5rem] border border-gray-200/50 dark:border-white/5 flex flex-col items-center justify-center gap-4 hover:brightness-105 active:scale-95 transition-all overflow-hidden group shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${cat.id === 'cards' ? 'col-span-2 flex-row py-5 h-24' : 'aspect-square'}`}>
            <div className={`p-4 bg-white dark:bg-black/40 rounded-2xl shadow-sm dark:shadow-inner ${cat.iconColor} group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <span className="font-black text-[11px] text-gray-800 dark:text-white/90 tracking-widest uppercase transition-colors">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* شريط العروض السحابي */}
      {hotDeals.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 px-1 transition-colors">
            عروض نارية <Flame size={18} className="text-orange-500 fill-orange-500 animate-pulse" />
          </h3>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pr-1 -mr-1 custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
             {hotDeals.map((service) => {
               const startingPrice = service.packages?.[0] ? Math.round(service.packages[0].price * exchangeRate) : 0;

               return (
                 <div
                    key={service.id}
                    onClick={() => onNavigate(service.category)}
                    className="min-w-[80%] snap-center bg-white dark:bg-[#121217] p-5 rounded-[2rem] border border-gray-200 dark:border-white/5 flex flex-col gap-4 group active:scale-[0.98] transition-all shadow-sm dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:border-gray-300 dark:hover:border-white/10 cursor-pointer"
                 >
                    <div className="flex justify-between items-start">
                       <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner bg-gray-50 dark:bg-transparent">
                          {service.image ? (
                             <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={service.name} />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-orange-500"><Gamepad2 size={24} /></div>
                          )}
                       </div>
                    </div>
                    <div>
                       <h4 className="font-black text-gray-900 dark:text-white text-base mb-2 truncate transition-colors">{service.name}</h4>
                       <div className="flex justify-between items-center">
                          <span className="text-gray-900 dark:text-white font-black text-xl transition-colors">
                            {startingPrice.toLocaleString()} <small className="text-[10px] text-gray-500 dark:opacity-40">ر.ي</small>
                          </span>
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-orange-500 group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
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

