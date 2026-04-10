import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, 
  BarChart3, Menu, X, LogOut, UserCircle, Settings, 
  Smartphone, Sparkles, BellRing, Wifi 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

// استيراد التبويبات
import DashboardTab from './admin/tabs/DashboardTab';
import CustomersTab from './admin/tabs/CustomersTab';
import ServicesTab from './admin/tabs/ServicesTab';
import OrdersTab from './admin/tabs/OrdersTab';
import ReportsTab from './admin/tabs/ReportsTab';
import SettingsTab from './admin/tabs/SettingsTab';
import TelecomAdminTab from './admin/tabs/TelecomAdminTab';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const store = useStore();
  const prevPendingRef = useRef(0);

  if (!store) return <div className="min-h-screen bg-[#050505] text-red-500 flex items-center justify-center font-black text-2xl">🚨 خطأ: لم يتم العثور على StoreContext</div>;

  const { orders, logout, currentUser, settings } = store;

  // حساب الطلبات المعلقة للتنبيه
  const pendingCount = (orders || []).filter(o => o?.status === 'pending').length;

  // 🛡️ نظام فلترة الصلاحيات الذكي
  const allowedMenuItems = useMemo(() => {
    const allItems = [
      { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} />, color: 'text-blue-500' },
      { id: 'orders', label: 'إدارة الطلبات', icon: <ShoppingCart size={20} />, color: 'text-orange-500', badge: pendingCount },
      { id: 'services', label: 'معرض المتجر', icon: <Package size={20} />, color: 'text-yellow-500' },
      { id: 'telecom_admin', label: 'كابينة الاتصالات', icon: <Smartphone size={20} />, color: 'text-pink-500' },
      { id: 'customers', label: 'قاعدة العملاء', icon: <Users size={20} />, color: 'text-green-500' },
      { id: 'reports', label: 'التقارير والأرباح', icon: <BarChart3 size={20} />, color: 'text-purple-500' },
      { id: 'settings', label: 'إعدادات النظام', icon: <Settings size={20} />, color: 'text-gray-400' },
    ];

    // 🟢 إذا كان المستخدم مساعد، نعطيه فقط الرئيسية والطلبات
    if (currentUser?.role === 'assistant') {
      return allItems.filter(item => item.id === 'dashboard' || item.id === 'orders');
    }

    // للمدير تظهر القائمة كاملة
    return allItems;
  }, [pendingCount, currentUser]);

  // حماية إضافية: لو المساعد حاول يدخل رابط تبويب ممنوع يرجعه للرئيسية
  useEffect(() => {
    if (currentUser?.role === 'assistant' && !['dashboard', 'orders'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    document.title = pendingCount > 0 ? `(${pendingCount}) طلبات جديدة - الإدارة` : (settings?.appName || "بدر أدمن");
    
    if (pendingCount > prevPendingRef.current && prevPendingRef.current !== 0) {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
      } catch (error) {}
    }
    prevPendingRef.current = pendingCount;
  }, [pendingCount, settings]);

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من الخروج؟')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'orders': return <OrdersTab />;
      // التبويبات التالية للمدير فقط
      case 'services': return currentUser?.role === 'admin' ? <ServicesTab /> : <Navigate to="/admin" />;
      case 'telecom_admin': return currentUser?.role === 'admin' ? <TelecomAdminTab /> : <Navigate to="/admin" />;
      case 'customers': return currentUser?.role === 'admin' ? <CustomersTab /> : <Navigate to="/admin" />;
      case 'reports': return currentUser?.role === 'admin' ? <ReportsTab /> : <Navigate to="/admin" />;
      case 'settings': return currentUser?.role === 'admin' ? <SettingsTab /> : <Navigate to="/admin" />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans" dir="rtl">
      
      {/* سكرينة التغطية للجوال */}
      <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden transition-all ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* 🟢 القائمة الجانبية المفلترة */}
      <aside className={`fixed lg:static top-0 right-0 h-full w-72 bg-[#0a0a0c]/95 backdrop-blur-3xl border-l border-white/5 z-[70] transform transition-transform duration-500 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} flex flex-col`}>
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                 <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white leading-none">{settings?.appName || 'BADR STORE'}</h2>
                <p className="text-[8px] text-orange-500 font-black tracking-widest uppercase mt-1">
                  {currentUser?.role === 'assistant' ? 'Assistant Panel' : 'Control Panel'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500"><X size={20}/></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {allowedMenuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                  isActive ? 'bg-white/10 border border-white/10 shadow-xl' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-l-full"></div>}
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-2 rounded-xl ${isActive ? item.color : 'text-gray-500'}`}>{item.icon}</div>
                  <span className={`font-black text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 text-red-500 py-4 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-2xl border border-red-500/20 font-black transition-all">
            <LogOut size={18} /> خروج من القيادة
          </button>
        </div>
      </aside>

      {/* 🟢 المحتوى الرئيسي */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#050505] relative custom-scrollbar">
        <header className="p-4 md:p-6 sticky top-0 z-40">
           <div className="bg-[#121217]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-4 flex justify-between items-center shadow-xl">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-orange-500"><Menu size={24}/></button>
                <h1 className="text-lg font-black text-white">{allowedMenuItems.find(m => m.id === activeTab)?.label}</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 px-3 py-1.5 rounded-full text-[#25D366]">
                    <Wifi size={12} className="animate-pulse" />
                    <span className="text-[9px] font-black uppercase">Live Mode</span>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5 pr-4">
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black text-white">{currentUser?.name}</p>
                    <p className="text-[9px] font-bold text-orange-500 uppercase">{currentUser?.role === 'admin' ? 'Admin' : 'Assistant'}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-black shadow-lg ${currentUser?.role === 'assistant' ? 'bg-cyan-400' : 'bg-orange-500'}`}>
                    <UserCircle size={24} />
                  </div>
                </div>
              </div>
           </div>
        </header>

        <div className="p-4 md:px-8 pb-32 max-w-7xl mx-auto w-full">
           {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

