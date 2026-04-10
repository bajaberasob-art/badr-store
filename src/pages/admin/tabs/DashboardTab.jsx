import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  TrendingUp, ShoppingCart, Users, Activity,
  CheckCircle2, XCircle, Package, ArrowUpRight,
  Wallet, AlertCircle, Clock, User, Copy, Check,
  Gamepad2, Hash, MessageSquareX, Zap, ZapOff
} from 'lucide-react';

export default function DashboardTab() {
  // 🟢 جلب currentUser لمعرفة صلاحيات الشخص اللي داخل
  const { orders = [], users = [], services = [], updateOrderStatus, updateUserBalance, addNotification, currentUser } = useStore();

  const [confirmModal, setConfirmModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // 🟢 التحقق هل الشخص هذا "مساعد" ولا "المدير العام (أنت)"
  const isAssistant = currentUser?.role === 'assistant';

  // حساب الإحصائيات بذكاء
  const stats = useMemo(() => {
    const pending = orders.filter(o => o.status === 'pending');
    const accepted = orders.filter(o => o.status === 'accepted');

    // إجمالي الإيرادات
    const totalRevenue = accepted.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    // تقسيم الإيرادات (ألعاب vs اتصالات)
    const telecomRev = accepted.filter(o => o.serviceName?.includes('سداد')).reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const gamesRev = totalRevenue - telecomRev;

    const customers = users.filter(u => u.role === 'user').length;

    return { pending, totalRevenue, telecomRev, gamesRev, customers };
  }, [orders, users]);

  const handleCopy = (text, id) => {
    const parts = text.split('|');
    const cleanId = parts.length > 1 ? parts[1].replace('بيانات:', '').replace('رقم:', '').trim() : text;
    navigator.clipboard.writeText(cleanId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openConfirm = (type, order) => {
    setRejectReason('');
    setConfirmModal({ type, order });
  };

  const executeAction = () => {
    const { type, order } = confirmModal;
    if (type === 'reject') {
      updateOrderStatus(order.id, 'rejected');
      updateUserBalance(order.userId, order.price);
      const finalReason = rejectReason.trim() ? `السبب: ${rejectReason}` : 'تم إرجاع المبلغ لرصيدك.';
      if (addNotification) addNotification(order.userId, `إرجاع رصيد ${order.price} ر.ي 🔄`, finalReason);
    } else {
      updateOrderStatus(order.id, 'accepted');
      if (addNotification) addNotification(order.userId, 'طلبك جاهز ✅', `تم تنفيذ (${order.serviceName}) بنجاح.`);
    }
    setConfirmModal(null);
  };

  const StatCard = ({ title, value, subValue, icon: Icon, color, glowColor }) => (
    <div className="bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl transition-all hover:scale-[1.02]">
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-[50px] opacity-10 rounded-full transition-all group-hover:opacity-30 ${glowColor}`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
          {subValue && <p className="text-[9px] font-bold text-gray-500 mt-2">{subValue}</p>}
        </div>
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${color} shadow-inner`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20" dir="rtl">

      {/* نافذة التأكيد الفخمة */}
      {confirmModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-[#121217] border border-white/10 p-8 rounded-[3rem] shadow-2xl w-full max-w-md text-center animate-in zoom-in-95">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 border ${confirmModal.type === 'accept' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]'}`}>
                 {confirmModal.type === 'accept' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{confirmModal.type === 'accept' ? 'تأكيد التنفيذ' : 'رفض وإرجاع المبلغ'}</h3>
              <p className="text-sm font-bold text-gray-400 mb-6">الزبون: {confirmModal.order.userName}</p>

              {confirmModal.type === 'reject' && (
                <div className="mb-6 text-right">
                   <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="اكتب سبب الرفض هنا..." className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-red-500/50 h-24" />
                </div>
              )}

              <div className="flex gap-3">
                 <button onClick={executeAction} className={`flex-1 py-4 rounded-[1.5rem] text-white font-black active:scale-95 transition-all ${confirmModal.type === 'accept' ? 'bg-green-600 shadow-green-600/20' : 'bg-red-600 shadow-red-600/20'}`}>تأكيد</button>
                 <button onClick={() => setConfirmModal(null)} className="flex-1 py-4 bg-white/5 rounded-[1.5rem] text-white font-black border border-white/10">إلغاء</button>
              </div>
           </div>
        </div>
      )}

      {/* 🟢 إخفاء كروت الإحصائيات والفلوس إذا كان الدخول من حساب مساعد */}
      {!isAssistant && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="إجمالي الإيرادات" value={`${stats.totalRevenue.toLocaleString()} ر.ي`} subValue={`🎮 ${stats.gamesRev.toLocaleString()} | 📱 ${stats.telecomRev.toLocaleString()}`} icon={Wallet} color="text-green-500" glowColor="bg-green-500" />
          <StatCard title="طلبات الانتظار" value={stats.pending.length} subValue="بانتظار التحويل أو التنفيذ" icon={Clock} color="text-orange-500" glowColor="bg-orange-500" />
          <StatCard title="العملاء النشطين" value={stats.customers} subValue="إجمالي المسجلين في المتجر" icon={Users} color="text-blue-500" glowColor="bg-blue-500" />
          <StatCard title="الخدمات" value={services.length} subValue="عدد المنتجات المتاحة حالياً" icon={Package} color="text-purple-500" glowColor="bg-purple-500" />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* 2. الطلبات الواردة (تتوسع الشاشة كاملة للمساعد عشان يركز) */}
        <div className={`${isAssistant ? 'xl:col-span-3' : 'xl:col-span-2'} bg-[#121217] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative`}>
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_15px_#f97316]"></div>
               <h3 className="font-black text-white text-xl">الرادار: طلبات واردة</h3>
            </div>
            <button className="text-[10px] font-black text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:text-white transition-colors">استعراض الكل</button>
          </div>

          <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
            {stats.pending.length === 0 ? (
              <div className="py-24 text-center opacity-30 flex flex-col items-center">
                 <ZapOff size={60} className="mb-4" />
                 <p className="font-black uppercase tracking-widest text-sm">الرادار نظيف تماماً</p>
              </div>
            ) : (
              <div className="space-y-6">
                {stats.pending.map(order => {
                  const parts = (order.details || '').split('|');
                  const packageInfo = parts[0]?.trim() || 'باقة غير محددة';
                  const playerInfo = parts[1] ? parts[1].replace('بيانات:', '').replace('رقم:', '').trim() : '';

                  return (
                    <div key={order.id} className="bg-black/40 p-6 rounded-[2.2rem] border border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group hover:border-orange-500/30 transition-all duration-500">

                      <div className="flex items-center gap-5 flex-1">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/5 group-hover:scale-110 transition-transform shadow-inner">
                           <Package size={28} />
                        </div>
                        <div className="space-y-3 flex-1">
                           <div>
                              <h4 className="font-black text-white text-lg leading-none mb-1">{order.serviceName}</h4>
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest"><User size={10} className="inline ml-1" /> {order.userName} • ID: {String(order.id).substring(0,6)}</p>
                           </div>

                           <div className="flex flex-wrap gap-2">
                              <span className="bg-[#18181c] text-[11px] font-bold text-gray-300 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-1.5">
                                 <Gamepad2 size={12} className="text-gray-500" /> {packageInfo}
                              </span>
                              {playerInfo && (
                                <button onClick={() => handleCopy(order.details, order.id)} className="bg-orange-500/10 text-[12px] font-black text-orange-500 px-4 py-1.5 rounded-xl border border-orange-500/10 flex items-center gap-2 active:scale-95 transition-all">
                                   <Hash size={12} /> {playerInfo} {copiedId === order.id ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                              )}
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-5 lg:pt-0">
                        {/* 🟢 إخفاء السعر عن المساعد إذا حبيت (اختياري)، حالياً خليناه يشوف السعر عشان يعرف حجم الطلب */}
                        <div className="text-right">
                           <span className="text-2xl font-black text-white tracking-tighter">{order.price?.toLocaleString()} <small className="text-[10px] text-gray-500">ر.ي</small></span>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => openConfirm('accept', order)} className="w-12 h-12 flex items-center justify-center text-green-500 bg-green-500/10 rounded-2xl border border-green-500/20 hover:bg-green-500 hover:text-black transition-all shadow-lg"><CheckCircle2 size={24}/></button>
                           <button onClick={() => openConfirm('reject', order)} className="w-12 h-12 flex items-center justify-center text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg"><XCircle size={24}/></button>
                        </div>
                      </div>

                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* 🟢 إخفاء قسم "النبض" و "النصائح" عن المساعدين لأنها لك أنت كمدير */}
        {!isAssistant && (
          <div className="flex flex-col gap-6">
             <div className="bg-[#121217] rounded-[2.5rem] border border-white/5 p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-red-600 rounded-[1.8rem] flex items-center justify-center text-black shadow-xl mx-auto rotate-3">
                   <Activity size={36} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-white">نبض المتجر</h4>
                   <p className="text-[11px] font-bold text-gray-500 mt-2">النظام يعمل بكفاءة 100% وبدون أي مشاكل تقنية.</p>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                      <span className="text-[10px] text-gray-500 font-black uppercase">سرعة الاستجابة:</span>
                      <span className="text-xs text-green-500 font-black tracking-widest">خارق 🔥</span>
                   </div>
                   <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                      <span className="text-[10px] text-gray-500 font-black uppercase">حالة السيرفر:</span>
                      <span className="text-xs text-blue-500 font-black tracking-widest">مستقر ⚡</span>
                   </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-6 rounded-[2.2rem] border border-orange-500/10 space-y-3">
                <div className="flex items-center gap-2">
                   <AlertCircle size={16} className="text-orange-500" />
                   <h5 className="text-xs font-black text-white uppercase">مركز التلميحات</h5>
                </div>
                <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                   عند رفض طلب، حاول دائماً كتابة السبب (مثلاً: الآيدي غلط) لتقليل استفسارات الزبائن وتوفير وقتك.
                </p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

