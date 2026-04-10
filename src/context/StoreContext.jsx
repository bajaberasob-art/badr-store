import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase'; // ☁️ ربط السحابة
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, writeBatch, query, orderBy } from 'firebase/firestore';

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
      storeLogo: '',
      appLogo: '',
      primaryColor: '#FF8C00',
      scrollingNews: '🔥 أهلاً بك في متجر بدر .. سداد فوري وآمن لجميع الشبكات ⚡',
      homePromoText: '🔥 عروض حصرية على شدات ببجي وسداد اتصالات فوري ⚡',
      isStoreOpen: true,
      exchangeRate: 140,
      northGateTax: 210,
      whatsapp: '967736724105',
      adminUsername: 'admin',
      adminPassword: '123',
      adminName: 'بدر باجابر',
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
  // 5. محرك النظام (المزامنة المحلية + السحابية ☁️)
  // ==========================================
  
  // تفعيل الوضع الليلي
  useEffect(() => {
    const root = document.documentElement;
    const isDark = darkMode === true || (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('badr_theme', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => (prev === null ? true : prev === true ? false : null));

  // الحفظ المحلي السريع (Local Storage)
  useEffect(() => {
    const localDb = { 
      badr_settings: settings, badr_currentUser: currentUser, badr_users: users, 
      badr_orders: orders, badr_notifications: notifications, badr_ads: ads, 
      badr_services: services, badr_telecom: telecomData, badr_logs: logs 
    };
    Object.entries(localDb).forEach(([key, val]) => localStorage.setItem(key, JSON.stringify(val)));
  }, [settings, currentUser, users, orders, notifications, ads, services, telecomData, logs]);

  // الاستماع المستمر للسحابة (Firebase Realtime Listeners)
  useEffect(() => {
    if (!db) return; // حماية في حال تأخر تحميل فايربيس
    
    const unsubSettings = onSnapshot(doc(db, "store", "settings"), (d) => { if (d.exists()) setSettings(prev => ({...prev, ...d.data()})); });
    const unsubTelecom = onSnapshot(doc(db, "store", "telecom"), (d) => { if (d.exists()) setTelecomData(d.data()); });

    const unsubUsers = onSnapshot(collection(db, "users"), (s) => { 
      if(!s.empty) {
        const fetchedUsers = s.docs.map(d => d.data());
        setUsers(fetchedUsers);
        // تحديث رصيد المستخدم الحالي لحظياً إذا تغير في السحابة
        if (currentUser) {
          const updatedMe = fetchedUsers.find(u => u.id === currentUser.id);
          if (updatedMe && updatedMe.balance !== currentUser.balance) {
            setCurrentUser(updatedMe);
          }
        }
      } 
    });
    
    const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("_ts", "desc")), (s) => { if(!s.empty) setOrders(s.docs.map(d => d.data())); });
    const unsubServices = onSnapshot(query(collection(db, "services"), orderBy("_order", "asc")), (s) => { if(!s.empty) setServices(s.docs.map(d => d.data())); });
    const unsubAds = onSnapshot(query(collection(db, "ads"), orderBy("_ts", "desc")), (s) => { if(!s.empty) setAds(s.docs.map(d => d.data())); });
    const unsubNotif = onSnapshot(query(collection(db, "notifications"), orderBy("_ts", "desc")), (s) => { if(!s.empty) setNotifications(s.docs.map(d => d.data())); });

    return () => { unsubSettings(); unsubTelecom(); unsubUsers(); unsubOrders(); unsubServices(); unsubAds(); unsubNotif(); };
  }, [currentUser?.id]);

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
      const customAdmin = { id: '000', name: settings.adminName || 'المدير العام', role: 'admin', balance: 9999999 };
      setCurrentUser(customAdmin);
      return { success: true, role: 'admin' };
    }
    
    const u = users.find(x => x.phone === phoneOrUser && x.password === password);
    if (u) {
      if (u.status === 'suspended') return { success: false, msg: 'عذراً، حسابك موقوف مؤقتاً.' };
      setCurrentUser(u);
      return { success: true, role: u.role || 'user' };
    }
    return { success: false, msg: 'عذراً، بيانات الدخول غير صحيحة' };
  };

  const logout = () => { setCurrentUser(null); localStorage.removeItem('badr_currentUser'); };

  const updateAdminSecurity = (u, p) => {
    const newSet = { ...settings, adminUsername: u, adminPassword: p };
    setSettings(newSet);
    setDoc(doc(db, "store", "settings"), newSet); // ☁️ تحديث سحابي
    addLog('تحديث بيانات أمان الإدارة');
    return { success: true, msg: 'تم تحديث بيانات الأمان بنجاح' };
  };

  // ==========================================
  // 7. دوال العمليات (الطلبات والمالية)
  // ==========================================
  const placeOrder = async (serviceName, details, price) => {
    if (!settings.isStoreOpen && currentUser?.role !== 'admin') return { success: false, msg: 'المتجر مغلق حالياً لإجراء بعض التحسينات 🛠️' };
    if (!currentUser) return { success: false, msg: 'يجب عليك تسجيل الدخول أولاً!' };

    const finalPrice = Number(price);
    if ((currentUser.balance || 0) < finalPrice) return { success: false, msg: 'عذراً، رصيدك الحالي لا يكفي لإتمام الطلب 💸' };

    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      userId: String(currentUser.id), 
      userName: currentUser.name, 
      serviceName, 
      details, 
      price: finalPrice, 
      status: 'pending',
      date: new Date().toLocaleString('ar-YE', { hour12: true }),
      _ts: Date.now() // ☁️ للترتيب السحابي
    };

    // تحديث محلي سريع
    setOrders(prev => [newOrder, ...prev]);
    updateUserBalance(currentUser.id, -finalPrice);

    // تحديث سحابي
    await setDoc(doc(db, "orders", String(newOrder.id)), newOrder);
    return { success: true };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const targetOrder = orders.find(o => String(o.id) === String(orderId));
    if (!targetOrder) return;

    if (newStatus === 'accepted' && (targetOrder.serviceName.includes('سداد') || targetOrder.serviceName.includes('رصيد'))) {
      const user = users.find(u => String(u.id) === String(targetOrder.userId));
      if (user && user.isDistributor) {
         const cashback = Math.round(targetOrder.price * 0.01); // 1% عمولة
         updateUserBalance(user.id, cashback);
         addNotification(user.id, 'عمولة موزع VIP 🎁', `تم إضافة عمولة ${cashback} ر.ي لعملية سداد.`);
      }
    }

    if (newStatus === 'rejected') {
      updateUserBalance(targetOrder.userId, targetOrder.price);
      addNotification(targetOrder.userId, 'إشعار إرجاع رصيد 🔄', `تم رفض طلبك وإرجاع مبلغ ${targetOrder.price} ر.ي لمحفظتك.`);
    }

    setOrders(prev => prev.map(o => String(o.id) === String(orderId) ? { ...o, status: newStatus } : o));
    setDoc(doc(db, "orders", String(orderId)), { ...targetOrder, status: newStatus }, { merge: true }); // ☁️ سحابة
  };

  const updateUserBalance = (userId, amount) => {
    const num = Number(amount);
    setUsers(prev => prev.map(u => {
      if (String(u.id) === String(userId)) {
        const newBalance = u.balance + num;
        if (currentUser?.id === userId) setCurrentUser(c => ({ ...c, balance: newBalance }));
        setDoc(doc(db, "users", String(u.id)), { ...u, balance: newBalance }, { merge: true }); // ☁️ سحابة
        return { ...u, balance: newBalance };
      }
      return u;
    }));
  };

  // ==========================================
  // 8. إدارة الخدمات والمستخدمين
  // ==========================================
  const addService = (s) => {
    const id = `S-${Date.now()}`;
    const newS = { ...s, id, _order: Date.now() };
    setServices(prev => [...prev, newS]);
    setDoc(doc(db, "services", String(id)), newS);
  };

  const updateService = (updatedS) => {
    setServices(prev => prev.map(s => s.id === updatedS.id ? updatedS : s));
    setDoc(doc(db, "services", String(updatedS.id)), updatedS, { merge: true });
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    deleteDoc(doc(db, "services", String(id)));
  };

  const cloneService = (serviceId) => {
    const original = services.find(s => s.id === serviceId);
    if (original) {
      const id = Date.now();
      const newService = { 
        ...original, 
        id: id.toString(), 
        name: `${original.name} (نسخة)`, 
        isPopular: false, 
        packages: original.packages.map(p => ({ ...p, id: Date.now() + Math.random() })), 
        _order: Date.now() 
      };
      setServices(prev => [...prev, newService]);
      setDoc(doc(db, "services", String(id)), newService);
    }
  };

  const reorderService = (id, direction) => {
    const index = services.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;
    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];
    setServices(newServices);
    
    // حفظ الترتيب الجديد في السحابة
    const batch = writeBatch(db);
    newServices.forEach((s, idx) => {
      batch.update(doc(db, "services", String(s.id)), { _order: idx });
    });
    batch.commit();
  };

  const addUser = (u) => {
    const newUser = { ...u, id: `ID-${Date.now().toString().slice(-4)}`, role: u.role || 'user', balance: Number(u.balance) || 0, status: 'active' };
    setUsers(prev => [...prev, newUser]);
    setDoc(doc(db, "users", String(newUser.id)), newUser);
  };

  const updateUser = (userId, updatedData) => {
    setUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, ...updatedData } : u));
    updateDoc(doc(db, "users", String(userId)), updatedData);
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    deleteDoc(doc(db, "users", String(id)));
  };

  const toggleDistributor = (userId) => {
    setUsers(prev => prev.map(u => {
      if(String(u.id) === String(userId)){
        const newVal = !u.isDistributor;
        updateDoc(doc(db, "users", String(userId)), { isDistributor: newVal });
        return { ...u, isDistributor: newVal };
      }
      return u;
    }));
  };

  const addAd = (adData) => {
    const id = Date.now();
    const newAd = typeof adData === 'string' ? { id, image: adData, _ts: id } : { id, ...adData, _ts: id };
    setAds(prev => [...prev, newAd]);
    setDoc(doc(db, "ads", String(id)), newAd);
  };

  const deleteAd = (id) => {
    setAds(prev => prev.filter(a => a.id !== id));
    deleteDoc(doc(db, "ads", String(id)));
  };

  const addLog = (action) => setLogs(prev => [{ id: Date.now(), action, time: new Date().toLocaleTimeString('ar-SA') }, ...prev].slice(0, 50));

  // ==========================================
  // 9. الإشعارات
  // ==========================================
  const addNotification = (userId, title, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif = {
      id: id, userId: String(userId), title: title, message: message,
      date: new Date().toLocaleString('ar-YE', { hour12: true }), _ts: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev]);
    setDoc(doc(db, "notifications", String(id)), newNotif);

    triggerPushNotification(title, message);
  };

  const sendGlobalNotification = (title, message, target = 'all') => {
    const id = Date.now();
    const newNotif = { id, title, message, targetUserId: target, date: new Date().toLocaleString('ar-YE', { hour12: true }), _ts: id };
    setNotifications(prev => [newNotif, ...prev]);
    setDoc(doc(db, "notifications", String(id)), newNotif);

    triggerPushNotification(title, message);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    deleteDoc(doc(db, "notifications", String(id)));
  };

  const triggerPushNotification = (title, message) => {
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

  // ==========================================
  // 10. أدوات قاعدة البيانات (استيراد وتصدير)
  // ==========================================
  const exportDatabase = () => {
    const blob = new Blob([JSON.stringify({ settings, users, ads, services, telecomData, orders, notifications, logs }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `BadrStore_Backup.json`; a.click();
  };

  const importDatabase = async (json) => {
    try {
      const d = JSON.parse(json);
      const batch = writeBatch(db); // 🚀 استخدام Batch لرفع كل البيانات دفعة واحدة للسيرفر
      
      if (d.settings) { setSettings(d.settings); batch.set(doc(db, "store", "settings"), d.settings); }
      if (d.telecomData) { setTelecomData(d.telecomData); batch.set(doc(db, "store", "telecom"), d.telecomData); }
      
      if (d.users) { setUsers(d.users); d.users.forEach(u => batch.set(doc(db, "users", String(u.id)), u)); }
      if (d.services) { setServices(d.services); d.services.forEach(s => batch.set(doc(db, "services", String(s.id)), s)); }
      if (d.orders) { setOrders(d.orders); d.orders.forEach(o => batch.set(doc(db, "orders", String(o.id)), o)); }
      if (d.ads) { setAds(d.ads); d.ads.forEach(a => batch.set(doc(db, "ads", String(a.id)), a)); }
      
      await batch.commit(); // تنفيذ الرفع
      return { success: true, msg: 'تم استيراد قاعدة البيانات للسحابة بنجاح ☁️✅' };
    } catch (e) { return { success: false, msg: 'خطأ: الملف المرفوع غير صالح أو الاتصال ضعيف' }; }
  };

  const updateSettings = (newSet) => {
    const updated = { ...settings, ...newSet };
    setSettings(updated);
    setDoc(doc(db, "store", "settings"), updated); // ☁️ سحابة
  };

  const setTelecomDataCloud = (val) => {
    setTelecomData(val);
    const resolvedVal = typeof val === 'function' ? val(telecomData) : val;
    setDoc(doc(db, "store", "telecom"), resolvedVal);
  };

  // ==========================================
  // القيمة المصدرة للمشروع بالكامل
  // ==========================================
  const value = {
    settings, currentUser, users, ads, services, telecomData, orders, notifications, darkMode, logs,
    toggleDarkMode, login, logout, placeOrder, updateSettings, updateAdminSecurity,
    addUser, updateUser, deleteUser, updateUserBalance, toggleDistributor,
    addService, updateService, deleteService, cloneService, reorderService, setServices,
    addAd, deleteAd, setAds, setTelecomData: setTelecomDataCloud, updateOrderStatus, setOrders,
    addNotification, sendGlobalNotification, deleteNotification, exportDatabase, importDatabase
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

