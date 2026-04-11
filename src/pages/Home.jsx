import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Bell, Home as HomeIcon, User, Clock,
  Search, X, CheckCircle2, XCircle,
  Wallet, MessageSquare, Trash2, Zap, LayoutGrid, Settings, Smartphone
} from 'lucide-react';

// استيراد جميع التبويبات
import MainTab from './home/tabs/MainTab';
import HistoryTab from './home/tabs/HistoryTab';
import ProfileTab from './home/tabs/ProfileTab';
import CategoryTab from './home/tabs/CategoryTab';
import TelecomTab from './home/tabs/TelecomTab';
import OrderModal from './home/tabs/OrderModal';

export default function Home() {
  const { currentUser, notifications = [], settings, deleteNotification } = useStore();
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState(() => JSON.parse(localStorage.getItem('badr_read_notifs')) || []);

  // 🟢 حالة صلاحية الإشعارات
  const [notifPermission, setNotifPermission] = useState(
    ("Notification" in window) ? Notification.permission : "denied"
  );

  const themeColor = settings?.primaryColor || '#FF8C00';

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const timeWord = hour < 12 ? 'صباح الخير' : 'مساء الخير';
    const firstName = currentUser?.name?.split(' ')[0] || 'يا غالي';
    return `${timeWord}، ${firstName}`;
  }, [currentUser]);

  const displayNotifs = useMemo(() => {
    return [...notifications]
      .filter(n => String(n.userId) === String(currentUser?.id) || n.targetUserId === 'all');
  }, [notifications, currentUser]);

  const unreadCount = displayNotifs.filter(n => !readNotifs.includes(n.id)).length;
  const hasNewNotifs = unreadCount > 0;

  const handleOpenNotifs = () => {
    setShowNotifs(true);
    const allIds = displayNotifs.map(n => n.id);
    setReadNotifs(allIds);
    localStorage.setItem('badr_read_notifs', JSON.stringify(allIds));
  };

  // 🟢 دالة طلب تفعيل الإشعارات الحقيقية
  const requestPushPermission = () => {
    if (!("Notification" in window)) {
      alert('عذراً، متصفحك أو جهازك لا يدعم الإشعارات الحقيقية 📱');
      return;
    }
    Notification.requestPermission().then(permission => {
      setNotifPermission(permission);
      if (permission === "granted") {
        alert('تم تفعيل الإشعارات بنجاح! بيوصلك تنبيه مع كل طلب ✅🔔');
      } else {
        alert('تم رفض الإشعارات. تقدر تفعلها لاحقاً من إعدادات المتصفح ❌');
      }
    });
  };

  const getNotifStyle = (title = '', msg = '') => {
    const text = (title + ' ' + msg).toLowerCase();
    if (text.includes('قبول') || text.includes('تسليم')) return { icon: <CheckCircle2 size={20}/>, color: 'text-green-600 dark:text-green-500', bg: 'bg-green-100 dark:bg-green-500/10' };
    if (text.includes('رفض') || text.includes('فشل')) return { icon: <XCircle size={20}/>, color: 'text-red-600 dark:text-red-500', bg: 'bg-red-100 dark:bg-red-500/10' };
    return { icon: <Zap size={20}/>, color: 'text-purple-600 dark:text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/10' };
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white overflow-hidden relative transition-colors duration-500" dir="rtl">

      {/* ======================= الهيدر العلوي (ثابت) ======================= */}
      <header className="px-6 py-5 flex justify-between items-center z-40 bg-white/80 dark:bg-[#050505]/90 backdrop-blur-2xl border-b border-gray-200 dark:border-white/5 shrink-0 transition-colors">
        <div className={`flex items-center gap-3 transition-all ${isSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
          <div className="w-10 h-10 rounded-xl p-0.5 shadow-lg shadow-orange-500/10" style={{ background: `linear-gradient(to top right, ${themeColor}, #dc2626)` }}>
            <div className="w-full h-full bg-white dark:bg-[#050505] rounded-[10px] flex items-center justify-center overflow-hidden transition-colors">
              {settings?.appLogo ? (
                <img src={settings.appLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="font-black text-gray-900 dark:text-white text-xs">BADR</span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-white font-black text-sm transition-colors">{settings?.appName || 'متجر بدر'}</span>
            <span className="text-gray-500 dark:text-gray-400 font-bold text-[10px]">{greeting}</span>
          </div>
        </div>

        <div className="flex gap-3 flex-1 justify-end">
          <div className={`flex items-center transition-all duration-500 ${isSearchOpen ? 'w-full sm:w-64 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-3' : 'w-10 bg-transparent'}`}>
            <button onClick={() => setIsSearchOpen(true)} className={`h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 ${!isSearchOpen && 'w-10 rounded-full bg-gray-100 dark:bg-white/5'}`}>
              <Search size={18} />
            </button>
            {isSearchOpen && (
              <input type="text" placeholder="بحث..." autoFocus onBlur={() => setIsSearchOpen(false)} className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white w-full px-2" />
            )}
          </div>

          <button onClick={handleOpenNotifs} className="w-10 h-10 shrink-0 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 relative border border-gray-200 dark:border-white/5 transition-colors">
            <Bell size={18} className={hasNewNotifs && !showNotifs ? "animate-pulse text-gray-900 dark:text-white" : ""} />
            {hasNewNotifs && !showNotifs && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-md">
                {unreadCount > 9 ? '+9' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ======================= منطقة المحتوى (قابلة للتمرير) ======================= */}
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 pt-2 custom-scrollbar">
        {!activeCategory && activeTab === 'home' && <MainTab onNavigate={setActiveCategory} />}
        {!activeCategory && activeTab === 'history' && <HistoryTab />}
        {!activeCategory && activeTab === 'profile' && <ProfileTab />}
        
        {activeCategory === 'telecom' && <TelecomTab onBack={() => setActiveCategory(null)} />}
        {activeCategory && activeCategory !== 'telecom' && (
          <CategoryTab catId={activeCategory} onBack={() => setActiveCategory(null)} onSelect={setSelectedService} />
        )}
      </main>

      {/* مودال الطلب */}
      {selectedService && <OrderModal service={selectedService} onClose={() => setSelectedService(null)} />}

      {/* ======================= شريط التنقل السفلي (ثابت) ======================= */}
      <div className="fixed bottom-6 left-6 right-6 z-40">
        <div className="bg-white/95 dark:bg-[#121217]/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl transition-colors">
          {[
            { id: 'home', icon: <HomeIcon size={22}/>, label: 'الرئيسية' },
            { id: 'history', icon: <Clock size={22}/>, label: 'طلباتي' },
            { id: 'profile', icon: <User size={22}/>, label: 'حسابي' }
          ].map((tab) => {
            const isActive = activeTab === tab.id && !activeCategory;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveCategory(null); }} className={`relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-full transition-all ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                {isActive && <div className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-[2rem] scale-100 shadow-inner transition-colors"></div>}
                <div className={`relative z-10 transition-transform ${isActive ? '-translate-y-1 scale-110' : ''}`}>{tab.icon}</div>
                <span className={`text-[9px] font-black transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================= درج الإشعارات ======================= */}
      <div className={`fixed inset-0 z-[120] flex justify-end transition-all duration-500 ${showNotifs ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} dir="rtl">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNotifs(false)}></div>
        
        <div className={`w-full max-w-sm bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-3xl h-full border-r border-gray-200 dark:border-white/10 shadow-2xl relative z-10 flex flex-col transition-transform duration-500 ${showNotifs ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-black/20 transition-colors">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-900 dark:text-white"><Bell size={20}/></div>
               <h2 className="text-xl font-black text-gray-900 dark:text-white">مركز التنبيهات</h2>
             </div>
             <button onClick={() => setShowNotifs(false)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"><X size={20}/></button>
          </div>

          {/* 🟢 البانر الذكي لطلب صلاحية الإشعارات */}
          {notifPermission === 'default' && (
            <div className="mx-4 mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex justify-between items-center animate-in fade-in zoom-in-95">
               <div className="flex flex-col">
                  <span className="text-[11px] font-black text-orange-500">تفعيل إشعارات الهاتف</span>
                  <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-0.5">ليصلك تنبيه فوري عند تنفيذ طلبك</span>
               </div>
               <button onClick={requestPushPermission} className="px-4 py-2 bg-orange-500 text-white text-[10px] font-black rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/20">
                  تفعيل 🔔
               </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {displayNotifs.length > 0 ? (
              displayNotifs.map((n) => {
                const style = getNotifStyle(n.title, n.message || n.msg);
                return (
                  <div key={n.id} className="bg-gray-50 dark:bg-[#121217] rounded-[1.5rem] border border-gray-200 dark:border-white/5 p-4 flex gap-4 items-start relative overflow-hidden group hover:bg-gray-100 dark:hover:bg-[#18181c] transition-all">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bg.replace('bg-', 'text-')} opacity-80`}></div>
                      <div className={`w-12 h-12 shrink-0 rounded-[1.2rem] flex items-center justify-center border ${style.bg} ${style.color} shadow-sm dark:shadow-inner`}>{style.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white pr-2">{n.title}</h4>
                        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 my-1">{n.message || n.msg}</p>
                        <span className="text-[9px] font-black text-gray-500 dark:text-gray-600 bg-gray-200 dark:bg-black/40 px-2 py-1 rounded-full">{n.date || 'الآن'}</span>
                      </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20"><Bell size={48} className="text-gray-400 dark:text-white" /></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

