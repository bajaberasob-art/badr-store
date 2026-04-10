import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Save, Store, MessageCircle, Lock, User, RefreshCcw, ShieldAlert,
  BellRing, Image as LucideImage, LayoutTemplate, Trash2, Upload,
  Download, Palette, Zap, FileJson, CheckCircle, UploadCloud,
  ShieldCheck, MessageSquare, Globe, Plus, RotateCcw
} from 'lucide-react';

export default function SettingsTab() {
  const {
    settings, updateSettings, updateAdminSecurity,
    sendGlobalNotification, exportDatabase, importDatabase,
    ads = [], addAd, deleteAd
  } = useStore();

  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [adminCreds, setAdminCreds] = useState({
    username: settings.adminUsername || '',
    password: settings.adminPassword || ''
  });
  const [notif, setNotif] = useState({ title: '', message: '' });

  // 🟢 نظام ضغط الصور الذكي لضمان سرعة المتجر
  const compressImage = (base64Str, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', quality)); // غيرناها لـ webp لضغط أفضل
      };
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result, 400, 0.8);
      setLocalSettings(prev => ({ ...prev, storeLogo: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const handleAppIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      // أيقونة التطبيق يفضل أن تكون مربعة 512x512
      const compressed = await compressImage(reader.result, 512, 0.9);
      setLocalSettings(prev => ({ ...prev, pwaIcon: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result, 1000, 0.6);
      if (typeof addAd === 'function') addAd({ image: compressed });
    };
    reader.readAsDataURL(file);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importDatabase(event.target.result);
      if (res.success) {
        alert('تمت استعادة البيانات بنجاح! 🚀');
        setTimeout(() => window.location.reload(), 500);
      } else {
        alert(res.msg);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    alert('تم حفظ كافة التغييرات بنجاح! ✅');
  };

  const handleSendNotif = () => {
    if (!notif.title || !notif.message) return alert('أكمل عنوان ونص الإشعار');
    sendGlobalNotification(notif.title, notif.message);
    setNotif({ title: '', message: '' });
    alert('تم بث الإشعار لجميع الزبائن! 📢');
  };

  // 🟢 زر التراجع عن التغييرات غير المحفوظة
  const handleReset = () => {
    if(window.confirm('هل تريد إلغاء التعديلات والعودة للإعدادات المحفوظة؟')) {
      setLocalSettings({ ...settings });
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-2 text-right" dir="rtl">

      <div className="flex justify-between items-center bg-[#121217]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 shadow-xl">
         <div>
            <h2 className="text-2xl font-black text-white">إعدادات النظام الشاملة</h2>
            <p className="text-xs font-bold text-gray-500 mt-1">تخصيص المظهر، البيانات، والأمان</p>
         </div>
         <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-xs font-black">
            <RotateCcw size={16} /> تراجع
         </button>
      </div>

      {/* المظهر والنسخ الاحتياطي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] p-6 rounded-[2rem] border border-[#FF8C00]/20 shadow-xl relative overflow-hidden group">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#FF8C00]/10 rounded-2xl text-[#FF8C00] group-hover:scale-110 transition-transform"><Palette size={24} /></div>
              <h3 className="text-lg font-black text-white">مظهر المتجر (الثيم)</h3>
           </div>
           <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
              <label className="text-xs font-bold text-gray-400">اللون الأساسي:</label>
              <input type="color" value={localSettings.primaryColor || '#FF8C00'} onChange={e => setLocalSettings({...localSettings, primaryColor: e.target.value})} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
              <span className="font-mono text-white text-xs uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">{localSettings.primaryColor || '#FF8C00'}</span>
           </div>
        </div>

        <div className="bg-[#111] p-6 rounded-[2rem] border border-blue-500/20 shadow-xl group">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform"><FileJson size={24} /></div>
              <h3 className="text-lg font-black text-white">البيانات والنسخ الاحتياطي</h3>
           </div>
           <div className="flex gap-3">
              <button onClick={exportDatabase} className="flex-1 py-4 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"><Download size={18}/> تصدير (حفظ)</button>
              <label className="flex-1 py-4 bg-gray-800/40 text-gray-300 border border-white/5 rounded-2xl font-black flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-all">
                <Upload size={18}/> استعادة (رفع) <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
           </div>
        </div>
      </div>

      {/* هوية المتجر والترحيب */}
      <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
         <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500"><LayoutTemplate size={28} /></div>
            <h3 className="text-xl font-black text-white">هوية المتجر والأيقونات</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-500 pr-2 uppercase">اسم المتجر</label>
             <input type="text" value={localSettings.appName || ''} onChange={e => setLocalSettings({...localSettings, appName: e.target.value})} placeholder="مثال: متجر بدر" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 transition-colors" />
           </div>

           <div className="space-y-2">
             <label className="text-[10px] font-black text-[#FFD700] pr-2 uppercase">عبارة الترحيب (شاشة الدخول)</label>
             <div className="relative">
                <input type="text" value={localSettings.loginMessage || ''} onChange={e => setLocalSettings({...localSettings, loginMessage: e.target.value})} placeholder="مثال: أهلاً بك في أسرع متجر شحن" className="w-full bg-black/50 border border-white/10 p-5 pr-12 rounded-2xl text-white font-bold outline-none focus:border-[#FFD700] transition-colors" />
                <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
             </div>
           </div>

           {/* 🟢 رفع الشعار (يظهر داخل المتجر) */}
           <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-500 pr-2 uppercase">شعار المتجر (يظهر في الهيدر)</label>
             <div className="flex gap-4 items-center bg-black/30 p-3 rounded-2xl border border-white/5">
               <label className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl font-black cursor-pointer text-center flex justify-center items-center gap-2 transition-all text-xs">
                 <UploadCloud size={18} /> رفع شعار (Header) <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
               </label>
               {localSettings.storeLogo && <div className="p-2 bg-white/5 rounded-xl shrink-0"><img src={localSettings.storeLogo} className="w-12 h-12 object-contain" alt="Logo" /></div>}
             </div>
           </div>

           {/* 🟢 رفع أيقونة التطبيق PWA (تظهر على شاشة الجوال الرئيسية) */}
           <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-500 pr-2 uppercase">أيقونة التطبيق (PWA App Icon)</label>
             <div className="flex gap-4 items-center bg-black/30 p-3 rounded-2xl border border-white/5">
               <label className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl font-black cursor-pointer text-center flex justify-center items-center gap-2 transition-all text-xs">
                 <UploadCloud size={18} /> رفع أيقونة (App Icon) <input type="file" accept="image/*" className="hidden" onChange={handleAppIconUpload} />
               </label>
               {localSettings.pwaIcon && <div className="p-2 bg-white/5 rounded-xl shrink-0"><img src={localSettings.pwaIcon} className="w-12 h-12 object-cover rounded-lg" alt="App Icon" /></div>}
             </div>
           </div>
         </div>
      </div>

      {/* 🟢 إدارة نصوص الواجهة (Home UI) */}
      <div className="bg-[#121217] p-8 rounded-[2.5rem] border border-orange-500/20 shadow-xl space-y-6">
         <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500"><Zap size={28} /></div>
            <h3 className="text-xl font-black text-white tracking-tight">إدارة نصوص الواجهة (Home UI)</h3>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {/* 1. شريط الأخبار المتحرك */}
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-500 pr-2 uppercase flex items-center gap-2"><Globe size={12}/> شريط الأخبار العلوي (المتحرك)</label>
               <textarea
                  value={localSettings.scrollingNews || ''}
                  onChange={e => setLocalSettings({...localSettings, scrollingNews: e.target.value})}
                  placeholder="اكتب الإعلانات هنا..."
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-orange-500 min-h-[80px] resize-none transition-colors"
               />
            </div>

            {/* 2. نص العروض تحت المحفظة */}
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-500 pr-2 uppercase flex items-center gap-2"><LayoutTemplate size={12}/> نص شريط العروض (تحت المحفظة)</label>
               <input
                  type="text"
                  value={localSettings.homePromoText || ''}
                  onChange={e => setLocalSettings({...localSettings, homePromoText: e.target.value})}
                  placeholder="مثال: 🔥 عروض حصرية على شدات ببجي..."
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-orange-500 transition-colors"
               />
            </div>
         </div>
      </div>

      {/* إدارة الإعلانات البنرات */}
      <div className="bg-[#111] p-8 rounded-[2.5rem] border border-purple-500/20 shadow-xl">
         <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500"><LucideImage size={28} /></div><h3 className="text-xl font-black text-white">البنرات الإعلانية (Carousel)</h3></div>
         
         <label className="w-full py-6 border-2 border-dashed border-purple-500/30 text-purple-400 rounded-2xl font-black cursor-pointer flex items-center justify-center gap-3 mb-8 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all">
            <Plus size={24} /> إضافة إعلان جديد (بنر) <input type="file" accept="image/*" className="hidden" onChange={handleAdUpload} />
         </label>
         
         {ads.length === 0 && (
           <div className="text-center py-10 opacity-30">
             <LucideImage size={48} className="mx-auto mb-2 text-white" />
             <p className="text-xs font-black uppercase text-white">لا توجد إعلانات مرفوعة</p>
           </div>
         )}

         <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
           {ads.map(ad => (
             <div key={ad.id} className="relative group aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
               <img src={ad.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Ad" />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                 <button onClick={() => deleteAd(ad.id)} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-500 active:scale-90 transition-all"><Trash2 size={20}/></button>
               </div>
             </div>
           ))}
         </div>
      </div>

      {/* الإعدادات المالية وحالة المتجر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-xl">
          <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3"><RefreshCcw size={22} className="text-green-500"/> الإعدادات المالية</h3>
          <div className="space-y-6">
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-center hover:border-green-500/30 transition-colors">
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase">سعر صرف السعودي مقابل اليمني</label>
              <div className="flex items-center justify-center gap-2">
                 <input type="number" value={localSettings.exchangeRate} onChange={e=>setLocalSettings({...localSettings, exchangeRate: Number(e.target.value)})} className="w-32 bg-transparent text-white font-black text-center text-3xl outline-none" />
                 <span className="text-xs text-green-500 font-bold">ر.ي</span>
              </div>
            </div>
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-center hover:border-orange-500/30 transition-colors">
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase">ضريبة سداد يمن موبايل (بوابة الشمال)</label>
              <div className="flex items-center justify-center gap-2">
                 <input type="number" value={localSettings.northGateTax} onChange={e=>setLocalSettings({...localSettings, northGateTax: Number(e.target.value)})} className="w-32 bg-transparent text-white font-black text-center text-3xl outline-none" />
                 <span className="text-xs text-orange-500 font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-xl">
          <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3"><Store size={22} className="text-blue-500"/> حالة المتجر والتواصل</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5">
              <span className="font-black text-white text-xs">استقبال الطلبات (فتح/إغلاق المتجر)</span>
              <button
                onClick={() => setLocalSettings({...localSettings, isStoreOpen: !localSettings.isStoreOpen})}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${localSettings.isStoreOpen ? 'bg-green-500' : 'bg-red-500'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${localSettings.isStoreOpen ? 'translate-x-0' : '-translate-x-6'}`}></div>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 pr-2 uppercase">رقم واتساب الدعم الفني</label>
              <div className="flex items-center bg-black/50 border border-white/10 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-colors">
                 <div className="px-4 text-xs font-black text-gray-500 bg-white/5 border-l border-white/10">wa.me/</div>
                 <input type="text" value={localSettings.whatsapp} onChange={e=>setLocalSettings({...localSettings, whatsapp: e.target.value})} placeholder="مثال: 967770000000" className="w-full bg-transparent p-5 text-white font-bold text-left font-mono outline-none" dir="ltr" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* أمان الإدارة */}
      <div className="bg-red-500/5 p-8 rounded-[3rem] border border-red-500/20 space-y-6">
        <div className="flex items-center gap-4 text-red-500 mb-2">
          <ShieldCheck size={28} />
          <h4 className="font-black text-xl">أمان حساب الإدارة الرئيسي</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="اسم المستخدم (اليوزر) الجديد" value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} className="w-full bg-black/60 border border-white/5 p-5 rounded-2xl text-white font-bold outline-none focus:border-red-500/50 transition-colors text-left" dir="ltr" />
          <input type="password" placeholder="كلمة المرور (الباسورد) الجديد" value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} className="w-full bg-black/60 border border-white/5 p-5 rounded-2xl text-white font-bold outline-none focus:border-red-500/50 transition-colors text-left" dir="ltr" />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!adminCreds.username || !adminCreds.password) return alert('أكمل البيانات');
            updateAdminSecurity(adminCreds.username, adminCreds.password);
            alert('✅ تم تحديث بيانات الدخول بنجاح! سيتم تطبيقها في المرة القادمة التي تسجل فيها دخولك.');
          }}
          className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-red-600/20 active:scale-95 transition-all"
        >
          تحديث بيانات الدخول 🔐
        </button>
      </div>

      {/* الإشعارات العامة */}
      <div className="bg-[#111] p-8 rounded-[2.5rem] border border-[#FF8C00]/20 shadow-xl">
         <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <BellRing size={24} className="text-[#FF8C00]"/> إرسال إشعار عام (لجميع المستخدمين)
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
           <input type="text" placeholder="عنوان التنبيه (مثال: عروض جديدة!)" value={notif.title} onChange={e=>setNotif({...notif, title: e.target.value})} className="bg-black/50 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-[#FF8C00] transition-colors" />
           <input type="text" placeholder="نص الرسالة..." value={notif.message} onChange={e=>setNotif({...notif, message: e.target.value})} className="bg-black/50 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-[#FF8C00] transition-colors" />
         </div>
         <button onClick={handleSendNotif} className="w-full py-5 bg-[#FF8C00] hover:bg-orange-400 text-black rounded-2xl font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all">بث الإشعار لجميع الأجهزة الآن 📢</button>
      </div>

      {/* زر الحفظ النهائي العائم */}
      <div className="fixed bottom-6 left-6 right-6 lg:left-8 lg:right-80 z-[100] animate-in slide-in-from-bottom-10 duration-700">
        <button onClick={handleSaveSettings} className="w-full py-5 bg-gradient-to-r from-white to-gray-300 text-black rounded-[2.5rem] font-black text-lg shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 active:scale-95 transition-transform hover:scale-[1.02]">
          <Save size={24}/> حفظ كافة الإعدادات بشكل نهائي
        </button>
      </div>

    </div>
  );
}

