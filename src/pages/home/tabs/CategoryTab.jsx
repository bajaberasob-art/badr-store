import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  ChevronLeft, Gamepad2, LayoutGrid, Globe,
  CreditCard, Search, ShoppingBag, Star,
  Flame, Filter, Sparkles, X, ArrowRight
} from 'lucide-react';

export default function CategoryTab({ catId, onBack, onSelect }) {
  const { services = [], settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const sarRate = Number(settings?.exchangeRate) || 140;

  // 1. محرك التصفية الذكي
  const filteredServices = useMemo(() => {
    let list = services.filter(s => s.category === catId && s.isVisible !== false);

    if (searchTerm) {
      list = list.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (activeFilter === 'popular') list = list.filter(s => s.isPopular);
    if (activeFilter === 'new') list = [...list].sort((a, b) => b.id - a.id).slice(0, 5);

    return list;
  }, [services, catId, searchTerm, activeFilter]);

  // إعدادات مظهر كل قسم
  const categoryMeta = {
    games: { title: 'معرض الألعاب', subtitle: 'أقوى شحنات الألعاب', icon: <Gamepad2 size={28}/>, color: 'text-orange-500', glow: 'shadow-orange-500/20', borderHover: 'hover:border-orange-500/50', btnHover: 'group-hover:bg-orange-500' },
    programs: { title: 'متجر البرامج', subtitle: 'اشتراكات وتطبيقات', icon: <LayoutGrid size={28}/>, color: 'text-blue-500', glow: 'shadow-blue-500/20', borderHover: 'hover:border-blue-500/50', btnHover: 'group-hover:bg-blue-500' },
    wifi: { title: 'شبكات WIFI', subtitle: 'كرت شبكتك بضغطة', icon: <Globe size={28}/>, color: 'text-green-500', glow: 'shadow-green-500/20', borderHover: 'hover:border-green-500/50', btnHover: 'group-hover:bg-green-500' },
    cards: { title: 'بطاقات رقمية', subtitle: 'آيتونز، جوجل، بلس', icon: <CreditCard size={28}/>, color: 'text-purple-500', glow: 'shadow-purple-500/20', borderHover: 'hover:border-purple-500/50', btnHover: 'group-hover:bg-purple-500' }
  };

  const meta = categoryMeta[catId] || { title: 'الخدمات', subtitle: 'تصفح العروض', icon: <ShoppingBag size={28}/>, color: 'text-white', glow: 'shadow-white/20', borderHover: 'hover:border-white/50', btnHover: 'group-hover:bg-white' };

  return (
    <div className="min-h-screen p-5 pb-32 animate-in fade-in slide-in-from-right-10 duration-700" dir="rtl">
      
      {/* 🟢 الهيدر الفخم (Dynamic Header) */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <div className={`w-16 h-16 bg-[#121217] rounded-[1.5rem] border border-white/10 ${meta.color} flex items-center justify-center shadow-2xl ${meta.glow} animate-pulse-slow`}>
              {meta.icon}
           </div>
           <div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-none">{meta.title}</h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">{meta.subtitle}</p>
           </div>
        </div>
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white hover:bg-white/10 active:scale-90 transition-all backdrop-blur-md border border-white/5">
          <ArrowRight size={20} />
        </button>
      </div>

      {/* 🟢 شريط البحث والفلاتر الزجاجية */}
      <div className="space-y-4 mb-8">
         <div className="relative group">
            <Search className={`absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:${meta.color} transition-colors`} size={22} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن خدمتك هنا..."
              className={`w-full bg-[#121217] border border-white/5 p-5 pr-14 rounded-[2rem] text-sm font-bold text-white outline-none focus:border-white/20 transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]`}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"><X size={20}/></button>
            )}
         </div>

         <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { id: 'all', label: 'الكل', icon: <Filter size={14}/> },
              { id: 'popular', label: 'تريند', icon: <Flame size={14}/> },
              { id: 'new', label: 'جديد', icon: <Sparkles size={14}/> }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black flex items-center gap-2 transition-all duration-300 ${
                  activeFilter === f.id 
                  ? 'bg-white text-black shadow-lg shadow-white/20 translate-y-[-2px]' 
                  : 'bg-[#121217] text-gray-400 border border-white/5 hover:text-white'
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
         </div>
      </div>

      {/* 🟢 شبكة الخدمات (Creative Grid) */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 mt-12">
          {filteredServices.map((s, index) => {
             const startingSarPrice = s.packages?.[0]?.price ? Number(s.packages[0].price) : 0;
             const startingYerPrice = Math.round(startingSarPrice * sarRate);

             return (
             <div
                key={s.id}
                onClick={() => onSelect(s)}
                // 👇 سحر الأنيميشن: ظهور متدرج بناءً على ترتيب الكرت
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                className={`relative bg-[#0a0a0c] rounded-[2rem] border border-white/5 overflow-visible group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700 ${meta.borderHover} transition-colors shadow-2xl`}
             >
                {/* 1. قسم الصورة (يخرج قليلاً عن الإطار) */}
                <div className="h-32 w-full relative rounded-t-[2rem] overflow-hidden bg-black/50">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/40 to-transparent z-10"></div>
                   {s.image ? (
                     <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700" alt={s.name} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center opacity-10"><Gamepad2 size={50} /></div>
                   )}

                   {/* بادج النار */}
                   {s.isPopular && (
                     <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                        <Flame size={10} fill="black" className="text-black" />
                        <span className="text-[9px] font-black text-black uppercase">نار</span>
                     </div>
                   )}
                </div>

                {/* 2. الكبسولة العائمة للسعر المزدوج (Floating Pill) */}
                <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 w-[85%]">
                   <div className="flex items-center justify-between bg-[#1a1a24]/90 backdrop-blur-xl px-4 py-2 rounded-[1rem] border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                      <div className="flex flex-col items-center">
                         <span className="text-[11px] font-black text-green-500 leading-none">{startingSarPrice}</span>
                         <span className="text-[7px] text-gray-500 font-bold uppercase">ر.س</span>
                      </div>
                      <div className="w-px h-6 bg-white/10"></div>
                      <div className="flex flex-col items-center">
                         <span className="text-[12px] font-black text-white leading-none">{startingYerPrice.toLocaleString()}</span>
                         <span className="text-[7px] text-orange-500 font-bold uppercase">ر.ي</span>
                      </div>
                   </div>
                </div>

                {/* 3. تفاصيل الخدمة والزر المدمج */}
                <div className="pt-8 pb-4 px-4 relative z-20 flex flex-col items-center">
                   <h3 className="text-sm font-black text-white truncate w-full text-center mb-3 group-hover:text-white transition-colors">{s.name}</h3>
                   
                   <button className={`w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-gray-300 flex items-center justify-center gap-2 transition-all duration-300 ${meta.btnHover} group-hover:text-white group-hover:border-transparent group-hover:shadow-lg`}>
                      عرض الباقات <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
             )
          })}
        </div>
      ) : (
        /* 🟢 حالة فارغة فخمة جداً */
        <div className="py-32 flex flex-col items-center justify-center space-y-6">
           <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 shadow-inner relative">
              <Search size={40} className="text-gray-600 absolute animate-ping opacity-20" />
              <Search size={40} className="text-gray-400 relative z-10" />
           </div>
           <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] bg-white/5 px-6 py-2 rounded-full">القسم فارغ حالياً</p>
        </div>
      )}
    </div>
  );
}

