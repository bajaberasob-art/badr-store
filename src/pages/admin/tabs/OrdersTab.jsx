import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  CheckCircle2, XCircle, Search, User, Package,
  Calendar, AlertCircle, FileText, Copy, Check, Info, MessageSquareX, Gamepad2, Hash
} from 'lucide-react';

export default function OrdersTab() {
  const { orders, updateOrderStatus, addNotification } = useStore();

  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const quickReasons = [
    'الآيدي (ID) غير صحيح',
    'الحساب خاص (Private)',
    'الخدمة متوقفة حالياً من المصدر'
  ];

  // 🟢 نظام الفلترة المطور والمضمون
  const filteredOrders = orders.filter(o => {
    // التأكد من مطابقة الفلتر (pending, accepted, rejected)
    const matchesFilter = filter === 'all' ? true : String(o.status) === String(filter);
    
    const nameToSearch = String(o.userName || '').toLowerCase();
    const serviceToSearch = String(o.serviceName || '').toLowerCase();
    const detailsToSearch = String(o.details || '').toLowerCase();
    const idToSearch = String(o.id || '').toLowerCase();

    const matchesSearch = nameToSearch.includes(searchTerm.toLowerCase()) ||
                          serviceToSearch.includes(searchTerm.toLowerCase()) ||
                          detailsToSearch.includes(searchTerm.toLowerCase()) ||
                          idToSearch.includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const extractIdForCopy = (text) => {
    if (!text) return '';
    const parts = text.split('|');
    if (parts.length > 1) {
      return parts[1].replace('بيانات:', '').replace('رقم:', '').replace('الآيدي:', '').trim();
    }
    return text;
  };

  const handleCopy = (text, id) => {
    const cleanId = extractIdForCopy(text);
    navigator.clipboard.writeText(cleanId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmReject = (order) => {
    setRejectReason('');
    setConfirmModal({
      type: 'reject',
      order: order,
      title: 'رفض الطلب وإرجاع الرصيد',
      msg: `سيتم إرجاع مبلغ ${(order.price || 0).toLocaleString()} ر.ي تلقائياً لمحفظة ${order.userName}.`
    });
  };

  const confirmAccept = (order) => {
    setConfirmModal({
      type: 'accept',
      order: order,
      title: 'تأكيد التنفيذ والتسليم',
      msg: `هل أنت متأكد من إتمام الطلب؟ سيصل إشعار فوري للزبون بنجاح العملية.`
    });
  };

  const executeAction = () => {
    const { type, order } = confirmModal;

    if (type === 'reject') {
      // 🟢 المخ الآن يتكفل بإرجاع الرصيد وإرسال إشعار الجوال
      updateOrderStatus(order.id, 'rejected');
      
      // إضافة إشعار إضافي لو فيه سبب معين للرفض
      if (rejectReason.trim() && addNotification) {
        addNotification(order.userId, 'توضيح بخصوص الرفض ⚠️', `سبب الرفض: ${rejectReason}`);
      }
    } else if (type === 'accept') {
      // 🟢 المخ يتكفل بتحديث الحالة وإرسال إشعار "تم التنفيذ" للجوال
      updateOrderStatus(order.id, 'accepted');
    }

    setConfirmModal(null);
    setRejectReason('');
  };

  const getStatusColor = (status) => {
    if (status === 'accepted') return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (status === 'rejected') return 'text-red-500 bg-red-500/10 border-red-500/20';
    return 'text-orange-500 bg-orange-500/10 border-orange-500/20 animate-pulse';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto" dir="rtl">
      
      {/* نافذة التأكيد الاحترافية */}
      {confirmModal && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-[#121217] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full ${confirmModal.type === 'accept' ? 'bg-green-500/20' : 'bg-red-500/20'}`}></div>
              
              <div className={`relative z-10 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 border ${confirmModal.type === 'accept' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]'}`}>
                {confirmModal.type === 'accept' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>

              <h3 className="text-2xl font-black text-white mb-2">{confirmModal.title}</h3>
              <p className="text-sm font-bold text-gray-400 mb-6">{confirmModal.msg}</p>

              {confirmModal.type === 'reject' && (
                <div className="mb-6 text-right space-y-3">
                   <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1.5"><MessageSquareX size={12}/> سبب الرفض (اختياري)</label>
                   <textarea
                     value={rejectReason}
                     onChange={(e) => setRejectReason(e.target.value)}
                     placeholder="مثال: الآيدي غير صحيح..."
                     className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-red-500/50 h-24"
                   ></textarea>
                   <div className="flex flex-wrap gap-2">
                      {quickReasons.map((r, i) => <button key={i} onClick={() => setRejectReason(r)} className="px-3 py-1.5 bg-white/5 rounded-full border border-white/5 text-[9px] font-black text-gray-400 hover:text-white transition-all">{r}</button>)}
                   </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                 <button onClick={executeAction} className={`flex-1 py-4 rounded-[1.5rem] text-white font-black active:scale-95 transition-all ${confirmModal.type === 'accept' ? 'bg-green-600 shadow-green-600/20 shadow-lg' : 'bg-red-600 shadow-red-600/20 shadow-lg'}`}>تأكيد</button>
                 <button onClick={() => setConfirmModal(null)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-black active:scale-95 transition-all">إلغاء</button>
              </div>
           </div>
        </div>
      )}

      {/* شريط الفلترة المطور */}
      <div className="bg-[#121217]/80 backdrop-blur-xl p-4 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col xl:flex-row gap-4 justify-between items-center relative overflow-hidden">
        <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] border border-white/5 w-full xl:w-auto overflow-x-auto hide-scrollbar">
          {[
            { id: 'all', label: 'كافة الطلبات' },
            { id: 'pending', label: 'الانتظار ⏳' },
            { id: 'accepted', label: 'منفذة ✅' },
            { id: 'rejected', label: 'مرفوضة ❌' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-3 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap flex-1 ${filter === f.id ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-500 hover:text-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-black/40 px-5 py-4 rounded-[1.5rem] border border-white/5 w-full xl:w-96 focus-within:border-orange-500/50 transition-all">
          <Search size={18} className="text-gray-500 ml-3" />
          <input
            type="text"
            placeholder="ابحث بالاسم، الخدمة، أو الآيدي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-white font-bold"
          />
        </div>
      </div>

      {/* قائمة الطلبات */}
      <div className="grid grid-cols-1 gap-5">
        {filteredOrders.map((order) => {
          const detailsParts = (order.details || '').split('|');
          const packageInfo = detailsParts[0]?.trim() || 'باقة غير محددة';
          const playerInfo = detailsParts[1] ? detailsParts[1].replace('بيانات:', '').replace('رقم:', '').replace('الآيدي:', '').trim() : '';
          
          return (
            <div key={order.id} className="bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all shadow-xl relative overflow-hidden">
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${order.status === 'accepted' ? 'bg-green-500' : order.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
              
              <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
                
                <div className="flex items-center gap-5 w-full xl:w-auto">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-400 border border-white/5">
                    <Package size={28} className={order.status === 'pending' ? 'text-orange-500' : ''} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-white text-lg mb-1">{order.serviceName}</h4>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-500">
                      <span className="flex items-center gap-1 bg-black px-3 py-1 rounded-full"><User size={12}/> {order.userName}</span>
                      <span className="flex items-center gap-1 bg-black px-3 py-1 rounded-full"><Calendar size={12}/> {order.date}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 p-4 rounded-[1.5rem] flex-1 w-full max-w-md">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1"><FileText size={12}/> التفاصيل</span>
                      <button onClick={() => handleCopy(order.details, order.id)} className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${copiedId === order.id ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                        {copiedId === order.id ? 'تم النسخ ✅' : 'نسخ الآيدي 📋'}
                      </button>
                   </div>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl">
                        <span className="text-[10px] text-gray-500 font-black">الباقة:</span>
                        <span className="text-xs text-white font-bold">{packageInfo}</span>
                     </div>
                     {playerInfo && (
                       <div className="flex justify-between items-center bg-orange-500/5 p-2 rounded-xl border border-orange-500/10">
                          <span className="text-[10px] text-orange-500 font-black">المستلم:</span>
                          <span className="text-sm text-orange-500 font-black select-all tracking-wider">{playerInfo}</span>
                       </div>
                     )}
                   </div>
                </div>

                <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between w-full xl:w-auto gap-4">
                  <div className="text-right">
                     <span className="text-2xl font-black text-white">{(order.price)?.toLocaleString()} <span className="text-xs text-gray-500">ر.ي</span></span>
                  </div>

                  {order.status === 'pending' ? (
                    <div className="flex gap-2 w-full xl:w-48">
                      <button onClick={() => confirmAccept(order)} className="flex-1 bg-green-500/10 text-green-500 border border-green-500/20 py-3 rounded-2xl font-black text-xs hover:bg-green-500 hover:text-black transition-all shadow-lg">تنفيذ ✅</button>
                      <button onClick={() => confirmReject(order)} className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all shadow-lg">إرجاع ❌</button>
                    </div>
                  ) : (
                    <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status === 'accepted' ? 'تم التسليم بنجاح' : 'طلب مرفوض'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] text-center">
            <Search size={48} className="text-gray-700 mb-4" />
            <h3 className="text-xl font-black text-white mb-1">لا توجد طلبات هنا</h3>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">جرب تغيير الفلتر أو البحث عن طلب آخر</p>
          </div>
        )}
      </div>
    </div>
  );
}

