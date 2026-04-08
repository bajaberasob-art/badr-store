import React from 'react';
import { useStore } from '../context/StoreContext';
import { Bell, X, CheckCircle2, Zap, Wallet, Trash2, Clock } from 'lucide-react';

export default function NotificationCenter({ isOpen, onClose }) {
  const { notifications, currentUser, deleteNotification, settings } = useStore();

  const themeColor = settings?.primaryColor || '#FF8C00';

  // 🟢 الفلترة الفولاذية: يعرض فقط الإشعارات اللي الـ userId حقها يطابق الزبون، أو الإشعارات العامة (all)
  const myNotifications = notifications.filter(
    n => String(n.userId) === String(currentUser?.id) || n.targetUserId === 'all'
  );

  // دالة لتحديد أيقونة ولون الإشعار بناءً على محتواه
  const getNotifStyle = (title) => {
    if (title.includes('نجاح') || title.includes('تم التنفيذ')) return { icon: <CheckCircle2 size={16}/>, color: 'text-green-500', bg: 'bg-green-500/10' };
    if (title.includes('إرجاع') || title.includes('مرفوض')) return { icon: <Wallet size={16}/>, color: 'text-orange-500', bg: 'bg-orange-500/10' };
    if (title.includes('موزع') || title.includes('عمولة')) return { icon: <Zap size={16}/>, color: 'text-purple-500', bg: 'bg-purple-500/10' };
    return { icon: <Bell size={16}/>, color: `text-[${themeColor}]`, bg: `bg-[${themeColor}]/10` };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex flex-col justify-end animate-in fade-in duration-300" dir="rtl">
      {/* خلفية معتمة تغلق المركز عند الضغط عليها */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* جسم المركز */}
      <div className="relative bg-[#050505] w-full h-[85vh] rounded-t-[2.5rem] border-t border-white/10 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-500">
        
        {/* الهيدر */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10">
                <Bell size={20} className="animate-pulse" />
             </div>
             <div>
                <h3 className="text-lg font-black text-white">مركز الإشعارات</h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{myNotifications.length} إشعار جديد</p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all">
             <X size={20} />
          </button>
        </div>

        {/* قائمة الإشعارات */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {myNotifications.length > 0 ? (
            myNotifications.map((n) => {
              const style = getNotifStyle(n.title);
              return (
                <div key={n.id} className="bg-[#121217] p-4 rounded-[1.5rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                   <div className={`absolute right-0 top-0 bottom-0 w-1 ${style.bg} opacity-50`}></div>
                   <div className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.color}`}>
                         {style.icon}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-white text-sm">{n.title}</h4>
                            <span className="text-[9px] font-bold text-gray-500 shrink-0 mt-1">{n.date}</span>
                         </div>
                         <p className="text-xs font-bold text-gray-400 leading-relaxed">{n.message}</p>
                      </div>
                      <button onClick={() => deleteNotification(n.id)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-500 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0">
                         <Trash2 size={14} />
                      </button>
                   </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
               <Bell size={48} className="text-gray-500 mb-4" />
               <p className="text-sm font-black text-white uppercase tracking-widest">لا توجد إشعارات</p>
               <p className="text-xs font-bold text-gray-400 mt-1">أنت على اطلاع بكل جديد</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

