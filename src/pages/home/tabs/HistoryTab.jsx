import React from 'react'; // 🟢 تم إصلاح الحرف الكبير هنا
import { useStore } from '../../../context/StoreContext';
import {
  Clock, CheckCircle2, XCircle, Timer,
  ShoppingBag, Receipt, Calendar
} from 'lucide-react';

export default function HistoryTab() {
  const { orders, currentUser, settings } = useStore();

  const safeOrders = Array.isArray(orders) ? orders : [];
  const currentUserId = String(currentUser?.id || '');

  // 🟢 فلترة فولاذية: يعرض فقط طلبات هذا المستخدم بالتحديد
  const myOrders = [...safeOrders]
    .filter(o => String(o.userId) === currentUserId);
    // 🟢 تم حذف .reverse() من هنا ليبقى الأحدث في الأعلى

  const themeColor = settings?.primaryColor || '#FF8C00';

  const statusConfig = {
    pending: { label: 'قيد التنفيذ', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <Timer size={14} className="animate-pulse" /> },
    accepted: { label: 'تم التسليم', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <CheckCircle2 size={14} /> },
    rejected: { label: 'مرفوض', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle size={14} /> }
  };

  return (
    <div className="p-5 pb-32 animate-in fade-in slide-in-from-left-10 duration-700" dir="rtl">

      <div className="flex justify-between items-end mb-10 px-1">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">سجل طلباتي</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">
            إجمالي العمليات: {myOrders.length}
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-[1.5rem] border border-white/5 text-orange-500 shadow-[0_10px_30px_rgba(249,115,22,0.15)]">
           <Receipt size={24} />
        </div>
      </div>

      <div className="space-y-5">
        {myOrders.length > 0 ? (
          myOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;

            return (
              <div
                key={order.id}
                className="bg-[#0a0a0c] rounded-[2.2rem] border border-white/5 p-6 relative overflow-hidden group hover:border-white/10 transition-all shadow-xl"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 opacity-80 ${status.bg}`}
                  style={{ backgroundColor: status.color === 'text-orange-500' ? themeColor : '' }}
                ></div>

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${status.bg} ${status.color} ${status.border}`}>
                       <ShoppingBag size={20} />
                    </div>
                    <div>
                       <h4 className="font-black text-white text-sm line-clamp-1">{order.serviceName}</h4>
                       <div className="flex items-center gap-2 mt-1 opacity-50">
                          <Calendar size={10} className="text-gray-400" />
                          <span className="text-[9px] font-bold text-gray-400">{order.date}</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.border} ${status.bg} ${status.color}`}>
                     {status.icon}
                     <span className="text-[9px] font-black uppercase tracking-tighter">{status.label}</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-end">
                   <div className="flex-1 pr-2">
                      <p className="text-[9px] font-black text-gray-600 uppercase mb-1">تفاصيل العملية</p>
                      <p className="text-[11px] font-bold text-gray-400 line-clamp-2 leading-relaxed">{order.details}</p>
                   </div>
                   <div className="text-left shrink-0 pl-2">
                      <span className="text-2xl font-black text-white leading-none">
                        {(order.yerPrice || order.price)?.toLocaleString()} <small className="text-[10px] opacity-40 mr-1">ر.ي</small>
                      </span>
                   </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-32 text-center space-y-6 opacity-30 animate-in zoom-in-95 duration-700">
             <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-xl"></div>
                <div className="relative w-full h-full bg-white/5 rounded-full flex items-center justify-center border-2 border-dashed border-white/10">
                   <Clock size={40} className="text-white" />
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-white">لا توجد طلبات بعد</p>
                <p className="text-[10px] font-bold text-gray-400">اطلب الآن وستظهر جميع عملياتك هنا بشكل تلقائي</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

