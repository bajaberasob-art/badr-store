import React from 'react';
import { useStore } from '../context/StoreContext';
import { Clock, CheckCircle2, XCircle, ChevronLeft, Hash } from 'lucide-react';

export default function History() {
  const { orders, currentUser } = useStore();

  // جلب طلبات الزبون الحالي فقط وترتيبها من الأحدث للأقدم
  const myOrders = orders
    .filter(order => order.userId === currentUser?.id)
    .sort((a, b) => b.id - a.id);

  // دالة لتحديد لون وشكل الحالة
  const getStatusDetails = (status) => {
    switch (status) {
      case 'accepted':
        return { label: 'تم التنفيذ', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <CheckCircle2 size={16}/> };
      case 'rejected':
        return { label: 'مرفوض', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle size={16}/> };
      default:
        return { label: 'قيد الانتظار', color: 'text-[#FF8C00]', bg: 'bg-[#FF8C00]/10', border: 'border-[#FF8C00]/20', icon: <Clock size={16}/> };
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 pr-4 border-r-4 border-[#FF8C00]">سجل طلباتي</h1>
        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">تتبع حالة شحناتك وعملياتك</p>
      </div>

      <div className="p-5 space-y-4">
        {myOrders.map((order) => {
          const status = getStatusDetails(order.status);
          return (
            <div key={order.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              {/* شريط الحالة الجانبي */}
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${status.bg.replace('/10', '')}`}></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Hash size={14}/></div>
                   <span className="text-[10px] font-black text-gray-400 tracking-tighter">ID: {order.id}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black ${status.color} ${status.bg} ${status.border}`}>
                  {status.icon}
                  {status.label}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-gray-800 text-lg leading-tight">{order.serviceName}</h3>
                <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                   <Clock size={12}/> {order.date}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المبلغ المدفوع</span>
                <span className="text-xl font-black text-gray-900">{order.price} <small className="text-xs font-bold opacity-50">ر.س</small></span>
              </div>
            </div>
          );
        })}

        {myOrders.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Clock size={40} className="text-gray-200" />
            </div>
            <h3 className="text-gray-400 font-black tracking-tight">لا توجد طلبات سابقة حالياً</h3>
            <p className="text-gray-300 text-xs mt-2 font-bold">ابدأ بطلب أول خدمة من معرض الألعاب!</p>
          </div>
        )}
      </div>
    </div>
  );
}

