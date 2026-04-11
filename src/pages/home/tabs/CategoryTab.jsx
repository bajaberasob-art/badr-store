import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  ChevronLeft, Gamepad2, LayoutGrid, Globe,
  CreditCard, Search, ShoppingBag, Star,
  Flame, Filter, Sparkles, X, ArrowRight, TrendingUp
} from 'lucide-react';

export default function CategoryTab({ catId, onBack, onSelect }) {
  const { services = [], settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const sarRate = Number(settings?.exchangeRate) || 140;

  // 1. محرك التصفية الذكي مع حساب الأعداد
  const counts = useMemo(() => {
    const list = services.filter(s => s.category === catId && s.isVisible !== false);
    return {
      all: list.length,
      popular: list.filter(s => s.isPopular).length,
      new: list.filter(s => {
          const isRecentlyAdded = (Date.now() - (Number(s.id.split('-')[1]) || 0)) < 7 * 24 * 60 * 60 * 1000;
          return isRecentlyAdded;
      }).length || 2 // افتراضي لو البيانات قديمة
    };
  }, [services, catId]);

  const filteredServices = useMemo(() => {
    let list = services.filter(s => s.category === catId && s.isVisible !== false);
    
    if (searchTerm) {
      list = list.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (activeFilter === 'popular') list = list.filter(s => s.isPopular);
    if (activeFilter === 'new') list = [...list].sort((a, b) => b.id - a.id).slice(0, 10);
    
    return list;
  }, [services, catId, searchTerm, activeFilter]);

  const categoryMeta = {
    games: { title: 'معرض الألعاب', subtitle: 'شحن فوري ومباشر', icon: <Gamepad2 size={28}/>, color: 'text-orange-500', glow: 'shadow-orange-500/20 dark:shadow-orange-500/10', border: 'group-hover:border-orange-500/30' },
    programs: { title: 'متجر البرامج', subtitle: 'اشتراكات بريميوم', icon: <LayoutGrid size={28}/>, color: 'text-blue-500', glow: 'shadow-blue-500/20 dark:shadow-blue-500/10', border: 'group-hover:border-blue-500/30' },
    wifi: { title: 'شبكات WIFI', subtitle: 'كروت إنترنت محلية', icon: <Globe size={28}/>, color: 'text-green-500', glow: 'shadow-green-500/20 dark:shadow-green-500/10', border: 'group-hover:border-green-500/30' },
    cards: { title: 'بطاقات رقمية', subtitle: 'كودات عالمية', icon: <CreditCard size={28}/>, color: 'text-purple-500', glow: 'shadow-purple-500/20 dark:shadow-purple-500/10', border: 'group-hover:border-purple-500/30' }
  };

  const meta = categoryMeta[catId] || { title: 'الخدمات', subtitle: 'تصفح العروض', icon: <ShoppingBag size={28}/>, color: 'text-gray-900 dark:text-white', glow: 'shadow-gray-200 dark:shadow-white/10' };

  return (
    <div className="min-h-screen p-5 pb-32 animate-in fade-in slide-in-from-right-10 duration-700 transition-colors" dir="rtl">

      {/* 🟢 الهيدر الديناميكي */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <div className={`w-14 h-14 bg-white dark:bg-[#121217] rounded-2xl border border-gray-100 dark:border-white/10 ${meta.color} flex items-center justify-center shadow-md dark:shadow-2xl ${meta.glow} transition-colors`}>
              {meta.icon}
           </div>
           <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">{meta.title}</h2>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mt-1 transition-colors">{meta.subtitle}</p>
           </div>
        </div>
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:text-white transition-all border border-transparent dark:border-white/5 active:scale-90">
           <ArrowRight size={20} />
        </button>
      </div>

      {/* 🟢 البحث والفلاتر */}
      <div className="space-y-4 mb-8">
         <div className="relative group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="عن ماذا تبحث اليوم؟"
              className="w-full bg-white dark:bg-[#121217] border border-gray-200 dark:border-white/5 p-4 pr-12 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-gray-300 dark:focus:border-white/10 transition-all shadow-sm dark:shadow-inner"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={18}/></button>
            )}
         </div>

         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'الكل', icon: <Filter size={12}/>, count: counts.all },
              { id: 'popular', label: 'تريند', icon: <Flame size={12}/>, count: counts.popular },
              { id: 'new', label: 'جديد', icon: <Sparkles size={12}/>, count: counts.new }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${
                  activeFilter === f.id
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-md scale-105'
                    : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-500 border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {f.icon} {f.label}
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${activeFilter === f.id ? 'bg-gray-700 text-white dark:bg-black/10 dark:text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-600'}`}>{f.count}</span>
              </button>
            ))}
         </div>
      </div>

      {/* 🟢 شبكة الخدمات */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 mt-10">
          {filteredServices.map((s, index) => {
             const startingSarPrice = s.packages?.[0]?.price ? Number(s.packages[0].price) : 0;
             const startingYerPrice = Math.round(startingSarPrice * sarRate);

             return (
             <div
                key={s.id}
                onClick={() => onSelect(s)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`relative bg-white dark:bg-[#0d0d0f] rounded-[2.2rem] border border-gray-100 dark:border-white/5 group cursor-pointer animate-in fade-in slide-in-from-bottom-6 duration-500 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none ${meta.border}`}
             >
                {/* قسم الصورة */}
                <div className="h-28 w-full relative rounded-t-[2.2rem] overflow-hidden bg-gray-50 dark:bg-black/40">
                   {s.image ? (
                      <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.name} />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20 dark:opacity-10 text-gray-400 dark:text-white"><Gamepad2 size={40} /></div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0d0d0f]"></div>

                   {/* شارة التميز */}
                   {s.isPopular && (
                     <div className="absolute top-3 right-3 bg-[#FF8C00] text-white dark:text-black px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 shadow-md dark:shadow-lg">
                        <TrendingUp size={10} /> نار
                     </div>
                   )}
                </div>

                {/* كبسولة السعر المزدوج (The Master Pill) */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-[90%] flex items-center justify-center">
                   <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a20] px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-md dark:shadow-2xl backdrop-blur-md">
                      <div className="flex items-baseline gap-0.5">
                         <span className="text-[11px] font-black text-gray-900 dark:text-white">{startingYerPrice.toLocaleString()}</span>
                         <span className="text-[6px] font-bold text-orange-500 uppercase">ر.ي</span>
                      </div>
                      <div className="w-[1px] h-3 bg-gray-200 dark:bg-white/10"></div>
                      <div className="flex items-baseline gap-0.5">
                         <span className="text-[10px] font-black text-green-600 dark:text-green-500">{startingSarPrice}</span>
                         <span className="text-[6px] font-bold text-gray-400 dark:text-gray-500 uppercase">ر.س</span>
                      </div>
                   </div>
                </div>

                {/* الاسم والزر */}
                <div className="pt-7 pb-4 px-3 text-center">
                   <h3 className="text-xs font-black text-gray-800 dark:text-white truncate mb-4 group-hover:text-orange-500 transition-colors">{s.name}</h3>
                   <div className="w-full py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[9px] font-black text-gray-500 dark:text-gray-400 group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all flex items-center justify-center gap-2">
                      تفاصيل الطلب <ChevronLeft size={12} />
                   </div>
                </div>
             </div>
             )
          })}
        </div>
      ) : (
        /* حالة البحث بدون نتائج */
        <div className="py-40 text-center opacity-40 dark:opacity-30 flex flex-col items-center animate-in zoom-in-95">
           <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 dark:border-white/10 text-gray-400 dark:text-white">
              <Search size={32} />
           </div>
           <p className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-white">لا توجد نتائج مطابقة</p>
        </div>
      )}

    </div>
  );
}

