import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronRight, Search, RefreshCw, ShoppingCart } from 'lucide-react';

export default function Games() {
  const { services, placeOrder } = useStore();
  const [selected, setSelected] = useState(null); // الخدمة المختارة حالياً

  // إذا اختار الزبون لعبة، نعرض الباقات
  if (selected) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pb-24 animate-fade-in" dir="rtl">
        <div className="bg-white p-5 sticky top-0 z-50 border-b flex justify-between items-center shadow-sm">
          <button onClick={() => setSelected(null)} className="p-2 bg-gray-50 rounded-xl text-gray-800"><ChevronRight size={24} /></button>
          <h2 className="font-black text-lg">{selected.name}</h2>
          <div className="w-10"></div>
        </div>

        {/* صورة كبيرة للخدمة فوق الباقات */}
        <div className="p-4">
          <img src={selected.image} className="w-full h-48 object-cover rounded-[2.5rem] shadow-xl mb-8 border-4 border-white" />
          
          <div className="space-y-3">
            {selected.packages.map((pkg) => (
              <div 
                key={pkg.id} 
                onClick={() => {
                  const res = placeOrder(selected.name, pkg.name, pkg.price);
                  alert(res.msg);
                }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-95 transition-all group"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="font-black text-gray-800">{pkg.name}</h4>
                  <p className="text-green-600 font-black text-sm">{pkg.price} <small className="text-[10px] font-bold">ر.س</small></p>
                </div>
                <div className="bg-[#FF8C00]/10 p-3 rounded-xl text-[#FF8C00] group-hover:bg-[#FF8C00] group-hover:text-white transition-all">
                  <ShoppingCart size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // عرض الشبكة (الصور وتحتها الأسماء)
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24" dir="rtl">
      <div className="p-6 bg-white border-b sticky top-0 z-50">
        <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <Search size={20} className="text-gray-400" />
          <input type="text" placeholder="ابحث عن لعبتك المفضلة..." className="bg-transparent outline-none text-sm w-full font-bold" />
        </div>
      </div>

      <div className="p-5 grid grid-cols-3 gap-4">
        {services.map((s) => (
          <div 
            key={s.id} 
            onClick={() => setSelected(s)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-md border-2 border-white group-active:scale-90 transition-all">
              <img src={s.image} className="w-full h-full object-cover" alt={s.name} />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all"></div>
            </div>
            <p className="text-[11px] font-black text-gray-800 text-center leading-tight truncate w-full">{s.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

