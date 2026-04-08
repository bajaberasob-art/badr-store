import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Users, 
  BarChart3, Menu, X, LogOut, UserCircle, Settings, 
  Smartphone, Sparkles, BellRing
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

  if (!store) return <div className="min-h-screen bg-[#050505] text-red-500 flex items-center justify-center font-black text-2xl">🚨 خطأ: لم يتم العثور على StoreContext</div>;

  const { orders, logout, currentUser, settings } = store;

  // حساب الطلبات المعلقة
  const pendingCount = (orders || []).filter(o => o?.status === 'pending').length;

  useEffect(() => {
    document.title = pendingCount > 0 ? `(${pendingCount}) طلبات جديدة - الإدارة` : (settings?.appName || "بدر أدمن");
  }, [pendingCount, settings]);

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من إغلاق غرفة العمليات؟')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} />, color: 'text-blue-500', glow: 'shadow-blue-500/20' },
    { id: 'orders', label: 'إدارة الطلبات', icon: <ShoppingCart size={20} />, color: 'text-orange-500', badge: pendingCount, glow: 'shadow-orange-500/20' },
    { id: 'services', label: 'معرض المتجر', icon: <Package size={20} />, color: 'text-yellow-500', glow: 'shadow-yellow-500/20' },
    { id: 'telecom_admin', label: 'كابينة الاتصالات', icon: <Smartphone size={20} />, color: 'text-pink-500', glow: 'shadow-pink-500/20' },
    { id: 'customers', label: 'قاعدة العملاء', icon: <Users size={20} />, color: 'text-green-500', glow: 'shadow-green-500/20' },
    { id: 'reports', label: 'التقارير والأرباح', icon: <BarChart3 size={20} />, color: 'text-purple-500', glow: 'shadow-purple-500/20' },
    { id: 'settings', label: 'إعدادات النظام', icon: <Settings size={20} />, color: 'text-gray-400', glow: 'shadow-gray-500/20' },
  ];

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard': return <DashboardTab />;
        case 'orders': return <OrdersTab />;
        case 'services': return <ServicesTab />;
        case 'telecom_admin': return <TelecomAdminTab />;
        case 'customers': return <CustomersTab />;
        case 'reports': return <ReportsTab />;
        case 'settings': return <SettingsTab />;
        default: return <DashboardTab />;
      }
    } catch (error) {
      console.error("Tab Error:", error);
      return (
        <div className="p-10 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-center space-y-4">
           <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500"><X size={32}/></div>
           <h3 className="text-xl font-black text-red-500">حدث خطأ في النظام!</h3>
           <p className="text-sm font-bold text-gray-400">تأكد من تحديث ملف التبويب ليتوافق مع المعايير الجديدة.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans selection:bg-orange-500/30 selection:text-orange-500" dir="rtl">

      {/* 🟢 القائمة الجانبية (Sidebar) - تصميم زجاجي فخم */}
      <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)}></div>
      
      <aside className={`fixed lg:static top-0 right-0 h-full w-72 bg-[#0a0a0c]/95 backdrop-blur-3xl border-l border-white/5 z-[70] transform transition-transform duration-500 ease-out shadow-[20px_0_50px_rgba(0,0,0,0.5)] ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} flex flex-col`}>
        
        {/* اللوجو */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl p-0.5 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                 <div className="w-full h-full bg-[#0a0a0c] rounded-[10px] flex items-center justify-center">
                    <Sparkles size={18} className="text-orange-500" />
                 </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">{settings?.appName || 'BADR STORE'}</h2>
                <p className="text-[9px] text-orange-500 font-black tracking-[0.3em] uppercase">Control Panel</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all"><X size={20}/></button>
        </div>

        {/* روابط التنقل */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {menuItems.map((item) => {
             const isActive = activeTab === item.id;
             return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.2rem] transition-all duration-300 group relative overflow-hidden ${
                  isActive ? 'bg-white/10 border border-white/10 shadow-xl' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {/* خط جانبي للتبويب النشط */}
                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-l-full shadow-[0_0_10px_#f97316]"></div>}
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? `bg-white/10 ${item.color} shadow-inner` : 'text-gray-500 group-hover:text-white'}`}>
                     {item.icon}
                  </div>
                  <span className={`font-black text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                     {item.label}
                  </span>
                </div>

                {/* شارة الطلبات (Badge) */}
                {item.badge > 0 && (
                  <div className="relative flex items-center justify-center">
                     <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40"></span>
                     <span className="relative bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                        {item.badge}
                     </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* زر الخروج المرعب */}
        <div className="p-6 shrink-0 border-t border-white/5 bg-black/20">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 text-red-500 py-4 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-[1.2rem] border border-red-500/20 font-black transition-all shadow-[0_0_20px_rgba(239,68,68,0.05)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> خروج من القيادة
          </button>
        </div>
      </aside>

      {/* 🟢 المحتوى الرئيسي */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#050505] relative custom-scrollbar">
        
        {/* خلفية الإضاءة العامة للمنطقة */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        {/* الهيدر العائم الفخم */}
        <header className="p-4 md:p-6 sticky top-0 z-40">
           <div className="bg-[#121217]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-4 flex justify-between items-center shadow-2xl">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white/5 hover:bg-white/10 rounded-xl text-orange-500 transition-all"><Menu size={24}/></button>
                <div className="hidden md:block">
                   <h1 className="text-xl font-black text-white">{menuItems.find(m => m.id === activeTab)?.label}</h1>
                   <p className="text-[10px] font-bold text-gray-500 mt-0.5">مرحباً بك في لوحة التحكم، استعرض بياناتك الحية.</p>
                </div>
                <div className="md:hidden">
                   <h1 className="text-lg font-black text-white">{menuItems.find(m => m.id === activeTab)?.label}</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* جرس تنبيه سريع للطلبات */}
                {pendingCount > 0 && (
                  <div className="hidden md:flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full text-red-500 animate-pulse">
                     <BellRing size={14} />
                     <span className="text-[10px] font-black">{pendingCount} طلبات بالانتظار</span>
                  </div>
                )}

                <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5 pr-4 shadow-inner hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black text-white">{currentUser?.name || 'المدير العام'}</p>
                    <p className="text-[9px] font-bold text-orange-500 uppercase">Admin</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-black shadow-lg">
                    <UserCircle size={24} />
                  </div>
                </div>
              </div>
           </div>
        </header>

        {/* منطقة عرض التبويبات */}
        <div className="p-4 md:px-8 pb-32 max-w-7xl mx-auto w-full relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
             {renderTabContent()}
          </div>
        </div>

      </main>
    </div>
  );
}

