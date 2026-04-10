import React, { useMemo } from 'react';
import { useStore } from './context/StoreContext';
import { 
  Bell, Trash2, CheckCircle2, XCircle, 
  Wallet, MessageSquare, Zap, Clock, 
  ArrowRight, BellOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationCenter() {
  const { notifications = [], deleteNotification, currentUser } = useStore();
  const navigate = useNavigate();

  // 🟢 1. تصفية الإشعارات الخاصة بهذا المستخدم + الإشعارات العامة
  const myNotifs = useMemo(() => {
    return notifications
      .filter(n => String(n.userId) === String(currentUser?.id) || n.targetUserId === 'all')
      .sort((a, b) => (b._ts || 0) - (a._ts || 0)); // الأحدث فوق
  }, [notifications, currentUser]);

  // 🟢 2. تنسيق الأيقونات حسب نوع الإشعار
  const getStyle = (title = '', msg = '') => {
    const text = (title + ' ' + msg).toLowerCase();
    if (text.includes('تم') || text.includes('نجاح') || text.includes('مقبول'))
      return { icon: <CheckCircle2 size={22}/>, color: 'text-green-500', bg: 'bg-green-500/10' };
    if (text.includes('رفض') || text.includes('عذراً') || text.includes('فشل'))
      return { icon: <XCircle size={22}/>, color: 'text-red-500', bg: 'bg-red-500/10' };
    if (text.includes('رصيد') || text.includes('محفظة') || text.includes('شحن'))
      return { icon: <Wallet size={22}/>, color: 'text-orange-500', bg: 'bg-orange-500/10' };
    
    return { icon: <Bell size={22}/>, color: 'text-blue-500', bg: 'bg-blue-500/10' };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24" dir="rtl">
      
      {/* الهيدر */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 active:scale-90 transition-all">
            <ArrowRight size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black">مركز الإشعارات</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">لديك {myNotifs.length} تنبيه</p>
          </div>
        </div>
        
        {myNotifs.length > 0 && (
          <button 
            onClick={() => { if(window.confirm('حذف جميع الإشعارات؟')) myNotifs.forEach(n => deleteNotification(n.id)) }}
            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={18} />
          </button>
        )}
      </header>

      {/* قائمة الإشعارات */}
      <div className="p-4 max-w-2xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {myNotifs.length > 0 ? (
          myNotifs.map((n) => {
            const style = getStyle(n.title, n.message);
            return (
              <div key={n.id} className="bg-[#0d0d0f] rounded-[2rem] border border-white/5 p-5 flex gap-4 items-start relative group overflow-hidden shadow-lg">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bg.replace('bg-', 'text-')} opacity-50`}></div>
                
                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner ${style.bg} ${style.color}`}>
                  {style.icon}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-sm">{n.title}</h3>
                    <button onClick={() => deleteNotification(n.id)} className="text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 font-bold leading-relaxed mb-3">{n.message}</p>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 uppercase">
                    <Clock size={10} /> {n.date}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-40 flex flex-col items-center justify-center opacity-20">
            <BellOff size={64} className="mb-4" />
            <p className="font-black uppercase tracking-widest text-sm">لا توجد إشعارات</p>
          </div>
        )}
      </div>
    </div>
  );
}

