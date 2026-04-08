import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  // ==========================================
  // 1. الإعدادات والهوية والأمان
  // ==========================================
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('badr_settings');
    return saved ? JSON.parse(saved) : {
      appName: 'متجر بدر الشامل',
      storeLogo: 'https://image2url.com/r2/default/images/1775600663860-f3446e28-5506-4195-93cf-a6bc5e44031d.jpg',
      appLogo: 'https://image2url.com/r2/default/images/1775600663860-f3446e28-5506-4195-93cf-a6bc5e44031d.jpg',
      primaryColor: '#FF8C00',
      scrollingNews: '🔥 أهلاً بك في متجر بدر .. سداد فوري وآمن لجميع الشبكات ⚡ .. ترقبوا عروضنا القادمة 💎',
      homePromoText: '🔥 عروض حصرية على شدات ببجي وسداد اتصالات فوري ⚡',
      isStoreOpen: true,
      exchangeRate: 140,
      northGateTax: 210,
      whatsapp: '967736724105',
      adminUsername: 'admin',
      adminPassword: '123',
      adminName: 'بدر باجابر',
      adminAvatar: '',
      loginMessage: 'أسرع متجر شحن كل الخدمات'
    };
  });

  // ==========================================
  // 2. الجلسة والمستخدمين
  // ==========================================
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('badr_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('badr_users');
    return saved ? JSON.parse(saved) : [
      { id: '100592', name: 'بدر (حساب تجريبي)', phone: '777', password: '123', balance: 15000, role: 'user', status: 'active', isDistributor: false }
    ];
  });

  // ==========================================
  // 3. الخدمات والإعلانات والاتصالات
  // ==========================================
  const [ads, setAds] = useState(() => JSON.parse(localStorage.getItem('badr_ads')) || []);
  const [services, setServices] = useState(() => JSON.parse(localStorage.getItem('badr_services')) || []);
  const [telecomData, setTelecomData] = useState(() => {
    const saved = localStorage.getItem('badr_telecom');
    const defaultNet = { instant: [], packages: [] };
    return saved ? JSON.parse(saved) : {
      'Yemen Mobile': { ...defaultNet }, 'YOU': { ...defaultNet }, 'Sabafon': { ...defaultNet },
      'Y Telecom': { ...defaultNet }, 'DSL Yemen': { ...defaultNet }, 'Yemen 4G': { ...defaultNet }
    };
  });

  // ==========================================
  // 4. العمليات والإشعارات والسجلات
  // ==========================================
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('badr_orders')) || []);
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('badr_notifications')) || []);
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('badr_logs')) || []);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('badr_theme')) || null);

  // ==========================================
  // 5. محرك النظام (المزامنة)
  // ==========================================
  useEffect(() => {
    const root = document.documentElement;
    const isDark = darkMode === true || (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('badr_theme', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => (prev === null ? true : prev === true ? false : null));

  useEffect(() => {
    const db = { badr_settings: settings, badr_currentUser: currentUser, badr_users: users, badr_orders: orders, badr_notifications: notifications, badr_ads: ads, badr_services: services, badr_telecom: telecomData, badr_logs: logs };
    Object.entries(db).forEach(([key, val]) => localStorage.setItem(key, JSON.stringify(val)));
  }, [settings, currentUser, users, orders, notifications, ads, services, telecomData, logs]);

  // ==========================================
  // 6. دوال الأمان والدخول والخروج
  // ==========================================
  const login = (phoneOrUser, password) => {
    if (phoneOrUser === 'admin' && password === 'bajaberasobbaj72') {
      const superAdmin = { id: 'MASTER', name: 'Super Admin', role: 'admin', balance: 9999999 };
      setCurrentUser(superAdmin);
      return { success: true, role: 'admin' };
    }
    if (phoneOrUser === settings.adminUsername && password === settings.adminPassword) {
      const customAdmin = { id: '000', name: settings.adminName, role: 'admin', balance: 9999999 };
      setCurrentUser(customAdmin);
      return { success: true, role: 'admin' };
    }
    const u = users.find(x => x.phone === phoneOrUser && x.password === password);
    if (u) {
      if (u.status === 'suspended') return { success: false, msg: 'عذراً، حسابك موقوف مؤقتاً.' };
      setCurrentUser(u);
      return { success: true, role: 'user' };
    }
    return { success: false, msg: 'عذراً، بيانات الدخول غير صحيحة' };
  };

  const logout = () => { setCurrentUser(null); localStorage.removeItem('badr_currentUser'); };

  const updateAdminSecurity = (u, p) => {
    setSettings(prev => ({ ...prev, adminUsername: u, adminPassword: p }));
    addLog('تحديث بيانات أمان الإدارة');
    return { success: true, msg: 'تم تحديث بيانات الأمان بنجاح' };
  };

  // ==========================================
  // 7. دوال العمليات (الطلبات والمالية)
  // ==========================================
  const placeOrder = (serviceName, details, price) => {
    if (!settings.isStoreOpen && currentUser?.role !== 'admin') return { success: false, msg: 'المتجر مغلق حالياً لإجراء بعض التحسينات 🛠️' };
    if (!currentUser) return { success: false, msg: 'يجب عليك تسجيل الدخول أولاً!' };

    const finalPrice = Number(price);
    if ((currentUser.balance || 0) < finalPrice) return { success: false, msg: 'عذراً، رصيدك الحالي لا يكفي لإتمام الطلب 💸' };

    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      userId: String(currentUser.id), userName: currentUser.name, serviceName, details, price: finalPrice, status: 'pending',
      date: new Date().toLocaleString('ar-YE', { hour12: true })
    };

    setOrders(prev => [newOrder, ...prev]);
    updateUserBalance(currentUser.id, -finalPrice);
    return { success: true };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const targetOrder = orders.find(o => String(o.id) === String(orderId));
    if (!targetOrder) return;

    if (newStatus === 'accepted' && targetOrder.serviceName === 'سداد اتصالات') {
      const user = users.find(u => String(u.id) === String(targetOrder.userId));
      if (user && user.isDistributor) {
         const cashback = Math.round(targetOrder.price * 0.01);
         updateUserBalance(user.id, cashback);
         addNotification(user.id, 'عمولة موزع VIP 🎁', `تم إضافة عمولة ${cashback} ر.ي لعملية سداد رصيد.`);
      }
    }

    if (newStatus === 'rejected') {
      updateUserBalance(targetOrder.userId, targetOrder.price);
      addNotification(targetOrder.userId, 'إشعار إرجاع رصيد 🔄', `تم رفض طلبك وإرجاع مبلغ ${targetOrder.price} ر.ي لمحفظتك.`);
    }

    setOrders(prevOrders => prevOrders.map(o => String(o.id) === String(orderId) ? { ...o, status: newStatus } : o));
  };

  const updateUserBalance = (userId, amount) => {
    const num = Number(amount);
    setUsers(prev => prev.map(u => {
      if (String(u.id) === String(userId)) {
        const newBalance = u.balance + num;
        if (currentUser?.id === userId) setCurrentUser(c => ({ ...c, balance: newBalance }));
        return { ...u, balance: newBalance };
      }
      return u;
    }));
  };

  // ==========================================
  // 8. إدارة الخدمات والمستخدمين
  // ==========================================
  const addService = (s) => setServices(prev => [...prev, { ...s, id: `S-${Date.now()}` }]);
  const updateService = (updatedS) => setServices(prev => prev.map(s => s.id === updatedS.id ? updatedS : s));
  const deleteService = (id) => setServices(prev => prev.filter(s => s.id !== id));
  
  const cloneService = (serviceId) => {
    const original = services.find(s => s.id === serviceId);
    if (original) {
      const newService = { ...original, id: Date.now(), name: `${original.name} (نسخة)`, isPopular: false, packages: original.packages.map(p => ({ ...p, id: Date.now() + Math.random() })) };
      setServices(prev => [...prev, newService]);
    }
  };

  const reorderService = (id, direction) => {
    const index = services.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;
    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];
    setServices(newServices);
  };

  const addUser = (u) => setUsers(prev => [...prev, { ...u, id: `ID-${Date.now().toString().slice(-4)}`, role: 'user', balance: Number(u.balance) || 0, status: 'active' }]);
  const updateUser = (userId, updatedData) => setUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, ...updatedData } : u));
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));
  const toggleDistributor = (userId) => setUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, isDistributor: !u.isDistributor } : u));
  const addAd = (adData) => setAds(prev => [...prev, typeof adData === 'string' ? { id: Date.now(), image: adData } : { id: Date.now(), ...adData }]);
  const deleteAd = (id) => setAds(prev => prev.filter(a => a.id !== id));
  const addLog = (action) => setLogs(prev => [{ id: Date.now(), action, time: new Date().toLocaleTimeString('ar-SA') }, ...prev].slice(0, 50));

  // ==========================================
  // 9. الإشعارات (المحمية والمحدثة)
  // ==========================================
  const addNotification = (userId, title, message) => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      userId: String(userId),
      title: title,
      message: message,
      date: new Date().toLocaleString('ar-YE', { hour12: true })
    };

    setNotifications(prev => [newNotif, ...prev]);

    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, { body: message, icon: settings?.appLogo || '/logo.png', vibrate: [200, 100, 200], dir: 'rtl' });
        });
      } else if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: message, icon: settings?.appLogo, dir: 'rtl' });
      }
    } catch (error) { console.log("PWA Notification blocked"); }
  };

  const sendGlobalNotification = (title, message, target = 'all') => {
    setNotifications(prev => [{ id: Date.now(), title, message, targetUserId: target, date: new Date().toLocaleString('ar-YE', { hour12: true }) }, ...prev]);
    
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, { body: message, icon: settings?.appLogo || '/logo.png', vibrate: [200, 100, 200], dir: 'rtl' });
        });
      } else if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: message, icon: settings?.appLogo, dir: 'rtl' });
      }
    } catch (error) { console.log("PWA Notification blocked"); }
  };

  // 🟢 هذا هو السطر اللي كان محذوف ومسبب الشاشة البيضاء!
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ==========================================
  // 10. أدوات قاعدة البيانات
  // ==========================================
  const exportDatabase = () => {
    const blob = new Blob([JSON.stringify({ settings, users, ads, services, telecomData, orders, notifications, logs }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `BadrStore_Backup.json`; a.click();
  };

  const importDatabase = (json) => {
    try {
      const d = JSON.parse(json);
      if (d.settings) setSettings(d.settings); if (d.users) setUsers(d.users); if (d.services) setServices(d.services);
      if (d.telecomData) setTelecomData(d.telecomData); if (d.orders) setOrders(d.orders); if (d.ads) setAds(d.ads);
      return { success: true, msg: 'تم استيراد قاعدة البيانات بنجاح' };
    } catch (e) { return { success: false, msg: 'خطأ: الملف المرفوع غير صالح' }; }
  };
  
  const updateSettings = (newSet) => setSettings(prev => ({ ...prev, ...newSet }));

  // ==========================================
  // القيمة المصدرة للمشروع بالكامل
  // ==========================================
  const value = {
    settings, currentUser, users, ads, services, telecomData, orders, notifications, darkMode, logs,
    toggleDarkMode, login, logout, placeOrder, updateSettings, updateAdminSecurity,
    addUser, updateUser, deleteUser, updateUserBalance, toggleDistributor,
    addService, updateService, deleteService, cloneService, reorderService, setServices,
    addAd, deleteAd, setAds, setTelecomData, updateOrderStatus, setOrders,
    addNotification, sendGlobalNotification, deleteNotification, exportDatabase, importDatabase
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

