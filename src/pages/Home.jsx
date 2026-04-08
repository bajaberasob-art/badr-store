import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Bell, Home as HomeIcon, User, Clock,
  Search, X, CheckCircle2, XCircle,
  Wallet, MessageSquare, Trash2, Zap, LayoutGrid, Settings, Smartphone
} from 'lucide-react';

// استيراد جميع التبويبات اللي طورناها
import MainTab from './home/tabs/MainTab';
import HistoryTab from './home/tabs/HistoryTab';
import ProfileTab from './home/tabs/ProfileTab';
import CategoryTab from './home/tabs/CategoryTab';
import TelecomTab from './home/tabs/TelecomTab';
import OrderModal from './home/tabs/OrderModal';

export default function Home() {
  const { currentUser, notifications = [], settings, deleteNotification } = useStore();

  // 🟢 حالات التنقل (Routing)
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // 🟢 حالات مركز الإشعارات الذكي
  const [showNotifs, setShowNotifs] = useState(false);
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  
  // نظام "المقروءة" عشان النقطة الحمراء تبرمج صح
  const [readNotifs, setReadNotifs] = useState(() => JSON.parse(localStorage.getItem('badr_read_notifs')) || []);

  const themeColor = settings?.primaryColor || '#FF8C00';

  // 1. جلب إشعارات الزبون
  const displayNotifs = useMemo(() => {
    return [...notifications]
      .filter(n => String(n.userId) === String(currentUser?.id) || n.targetUserId === 'all');
      // 🟢 تم حذف .reverse() من هنا ليبقى الأحدث في الأعلى
  }, [notifications, currentUser]);

  // 2. هل يوجد إشعارات غير مقروءة؟
  const hasNewNotifs = displayNotifs.some(n => !readNotifs.includes(n.id));

  // 3. فتح الإشعارات وتحديدها كمقروءة
  const handleOpenNotifs = () => {
    setShowNotifs(true);
    const allIds = displayNotifs.map(n => n.id);
    setReadNotifs(allIds);
    localStorage.setItem('badr_read_notifs', JSON.stringify(allIds));
  };

  // 4. مسح جميع الإشعارات (حذف فعلي من المخ)
  const handleClearAll = () => {
    displayNotifs.forEach(n => deleteNotification(n.id));
    alert('تم مسح جميع الإشعارات! 🧹');
  };

  // 5. طلب إذن إشعارات الهاتف (الإعدادات)
  const requestPushPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          alert('تم تفعيل إشعارات الهاتف بنجاح! ✅ ستصلك التنبيهات حتى لو التطبيق مغلق.');
        } else {
          alert('عذراً، يجب السماح بالإشعارات من إعدادات متصفحك.');
        }
      });
    } else {
      alert('جهازك لا يدعم إشعارات النظام المباشرة.');
    }
  };

  // 6. محرك الذكاء الاصطناعي لتصميم الإشعار
  const getNotifStyle = (title = '', msg = '') => {
    const text = (title + ' ' + msg).toLowerCase();
    if (text.includes('قبول') || text.includes('تسليم') || text.includes('نجاح'))
      return { icon: <CheckCircle2 size={20}/>, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (text.includes('رفض') || text.includes('استرجاع') || text.includes('فشل'))
      return { icon: <XCircle size={20}/>, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    if (text.includes('رصيد') || text.includes('شحن') || text.includes('تحويل'))
      return { icon: <Wallet size={20}/>, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    if (text.includes('إدارة') || text.includes('رسالة') || text.includes('تنبيه'))
      return { icon: <MessageSquare size={20}/>, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    
    return { icon: <Zap size={20}/>, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }; 
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white overflow-hidden relative">
      
      {/* ======================= الهيدر العلوي ======================= */}
      <header className="px-6 py-5 flex justify-between items-center sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl p-0.5 shadow-lg" style={{ background: `linear-gradient(to top right, ${themeColor}, #dc2626)` }}>
            <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center overflow-hidden">
              {settings?.appLogo ? (
                <img src={settings.appLogo} alt="Logo" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
              ) : (
                <span className="font-black text-white text-xs tracking-tighter uppercase">Badr</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* زر البحث (شكلي) */}
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5 shadow-inner">
            <Search size={18} />
          </button>
          
          {/* جرس الإشعارات النابض الذكي */}
          <button
            onClick={handleOpenNotifs}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative border border-white/5 shadow-inner"
          >
             <Bell size={18} className={hasNewNotifs && !showNotifs ? "animate-pulse text-white" : ""} />
             {hasNewNotifs && !showNotifs && (
               <>
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></span>
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]"></span>
               </>
             )}
          </button>
        </div>
      </header>

      {/* ======================= منطقة المحتوى ======================= */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        {!activeCategory && activeTab === 'home' && <MainTab onNavigate={setActiveCategory} />}
        {!activeCategory && activeTab === 'history' && <HistoryTab />}
        {!activeCategory && activeTab === 'profile' && <ProfileTab />}

        {/* التبويبات الفرعية (تظهر فوق الرئيسية) */}
        {activeCategory === 'telecom' && <TelecomTab onBack={() => setActiveCategory(null)} />}
        {activeCategory && activeCategory !== 'telecom' && (
          <CategoryTab
             catId={activeCategory}
             onBack={() => setActiveCategory(null)}
             onSelect={setSelectedService}
          />
        )}
      </main>

      {/* نافذة إتمام الطلب للخدمات */}
      {selectedService && <OrderModal service={selectedService} onClose={() => setSelectedService(null)} />}

      {/* ======================= شريط التنقل السفلي العائم ======================= */}
      <div className="fixed bottom-6 left-6 right-6 z-40">
        <div className="bg-[#121217]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {[
            { id: 'home', icon: <HomeIcon size={22} strokeWidth={2.5}/>, label: 'الرئيسية' },
            { id: 'history', icon: <Clock size={22} strokeWidth={2.5}/>, label: 'طلباتي' },
            { id: 'profile', icon: <User size={22} strokeWidth={2.5}/>, label: 'حسابي' }
          ].map((tab) => {
            const isActive = activeTab === tab.id && !activeCategory;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setActiveCategory(null); }}
                className={`relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-full transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {isActive && <div className="absolute inset-0 bg-white/10 rounded-[2rem] shadow-inner transition-all"></div>}
                <div className={`relative z-10 transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                  {tab.icon}
                </div>
                <span className={`text-[9px] font-black tracking-widest uppercase transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0 text-white' : 'opacity-0 translate-y-2 absolute'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================= درج الإشعارات الذكي الزجاجي ======================= */}
      <div className={`fixed inset-0 z-[120] flex justify-end transition-all duration-500 ${showNotifs ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} dir="rtl">
        {/* خلفية ضبابية للإغلاق */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNotifs(false)}></div>

        {/* الدرج نفسه */}
        <div className={`w-full max-w-sm bg-[#0a0a0c]/95 backdrop-blur-3xl h-full border-r border-white/10 shadow-2xl relative z-10 flex flex-col transition-transform duration-500 ${showNotifs ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white"><Bell size={20}/></div>
               <h2 className="text-xl font-black text-white">مركز الإشعارات</h2>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={() => setShowNotifSettings(!showNotifSettings)} className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all"><Settings size={20}/></button>
                <button onClick={() => setShowNotifs(false)} className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-red-500 transition-all"><X size={20}/></button>
             </div>
          </div>

          {/* لوحة إعدادات الإشعارات */}
          {showNotifSettings && (
             <div className="p-4 m-4 bg-[#121217] rounded-[1.5rem] border border-white/5 shadow-xl animate-in fade-in slide-in-from-top-4">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">إعدادات التنبيهات</h4>
                <button onClick={requestPushPermission} className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                   <div className="flex items-center gap-2 text-sm font-bold text-white"><Smartphone size={16} className="text-blue-400"/> إشعارات الهاتف المباشرة</div>
                   <div className="w-8 h-4 bg-blue-500/20 rounded-full flex items-center p-0.5"><div className="w-3 h-3 bg-blue-500 rounded-full"></div></div>
                </button>
             </div>
          )}

          <div className="px-6 py-4 flex justify-between items-center border-b border-white/5">
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">أحدث التنبيهات ({displayNotifs.length})</span>
             {displayNotifs.length > 0 && (
               <button onClick={handleClearAll} className="text-[10px] font-black text-red-500 flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full active:scale-95 transition-all">
                  <Trash2 size={12}/> مسح الكل
               </button>
             )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {displayNotifs.length > 0 ? (
              displayNotifs.map((n, idx) => {
                const style = getNotifStyle(n.title, n.message || n.msg);
                return (
                  <div key={`${n.id}-${idx}`} className="bg-[#121217] rounded-[1.5rem] border border-white/5 p-4 flex gap-4 items-start group hover:bg-[#18181c] transition-all relative overflow-hidden shadow-lg">
                    {/* خط جانبي يعكس لون الإشعار */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bg}`} style={{ opacity: 0.8 }}></div>
                    
                    <div className={`w-12 h-12 shrink-0 rounded-[1.2rem] flex items-center justify-center border ${style.bg} ${style.color} ${style.border} shadow-inner`}>
                      {style.icon}
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="text-sm font-black text-white leading-tight pr-2">{n.title}</h4>
                         <button onClick={() => deleteNotification(n.id)} className="text-gray-600 hover:text-red-500 transition-colors"><X size={14}/></button>
                      </div>
                      <p className="text-[11px] font-bold text-gray-400 leading-relaxed mb-3">{n.message || n.msg}</p>
                      <span className="text-[9px] font-black text-gray-600 bg-black/40 px-2 py-1 rounded-full">{n.date || 'الآن'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
                 <Bell size={48} className="text-white" />
                 <p className="text-xs font-black uppercase tracking-widest text-white">لا توجد إشعارات جديدة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

