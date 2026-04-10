import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Plus, Trash2, Smartphone, Globe, Zap,
  Wifi, Signal, Database, ArrowRightLeft, ShieldAlert
} from 'lucide-react';

export default function TelecomAdminTab() {
  // 🟢 جلبنا الإعدادات ودالة التحديث السحابية
  const { telecomData, setTelecomData, settings, updateSettings } = useStore();

  const networks = [
    { id: 'Yemen Mobile', label: 'يمن موبايل', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: <Signal size={24}/> },
    { id: 'YOU', label: 'يو (YOU)', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: <Smartphone size={24}/> },
    { id: 'Sabafon', label: 'سبأفون', color: 'text-red-500', bg: 'bg-red-500/10', icon: <Zap size={24}/> },
    { id: 'Y Telecom', label: 'واي (Y)', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: <Globe size={24}/> },
    { id: 'DSL Yemen', label: 'يمن نت ADSL', color: 'text-green-500', bg: 'bg-green-500/10', icon: <Wifi size={24}/> },
    { id: 'Yemen 4G', label: 'يمن فورجي', color: 'text-blue-600', bg: 'bg-blue-600/10', icon: <Wifi size={24}/> },
  ];

  const [activeNet, setActiveNet] = useState('Yemen Mobile');
  const [activeType, setActiveType] = useState('packages');
  const [formData, setFormData] = useState({
    name: '', price: '', mb: '', min: '', sms: '', days: ''
  });

  const currentNetData = telecomData[activeNet] || { instant: [], packages: [] };
  const items = currentNetData[activeType] || [];

  // 🟢 جلب نسبة بوابة الشمال من الإعدادات (مثلاً 210)
  const northGateRatio = Number(settings?.northGateTax) || 210;

  // ☢️ دالة الحفظ الإجباري للسحابة والمحلي
  const forceSaveTelecom = (newData) => {
    if (setTelecomData) setTelecomData(newData);
    
    // حفظ سحابي
    if (updateSettings) {
      updateSettings({ ...settings, telecomData: newData });
    }

    // حفظ محلي (احتياطي)
    try {
      const currentStorage = JSON.parse(localStorage.getItem('badr_settings') || '{}');
      currentStorage.telecomData = newData;
      localStorage.setItem('badr_settings', JSON.stringify(currentStorage));
    } catch (err) {}
  };

  const handleAdd = () => {
    if (!formData.name || !formData.price) return alert('أدخل البيانات الأساسية يا بطل!');

    const newItem = {
      id: `TEL-${Date.now()}`,
      name: formData.name,
      price: Number(formData.price), // الحفظ يتم بالسعر الأساسي فقط
      mb: formData.mb || '-',
      min: formData.min || '-',
      sms: formData.sms || '-',
      days: formData.days || '-'
    };

    const newData = {
      ...telecomData,
      [activeNet]: {
        ...telecomData[activeNet],
        [activeType]: [...(telecomData[activeNet]?.[activeType] || []), newItem]
      }
    };

    forceSaveTelecom(newData);
    setFormData({ name: '', price: '', mb: '', min: '', sms: '', days: '' });
  };

  const handleDelete = (id) => {
    if(!window.confirm('متأكد من الحذف النهائي للخدمة؟')) return;

    const newData = {
      ...telecomData,
      [activeNet]: {
        ...telecomData[activeNet],
        [activeType]: telecomData[activeNet][activeType].filter(item => item.id !== id)
      }
    };
    forceSaveTelecom(newData);
  };

  const handleInlineEdit = (id, field, value) => {
    const newData = {
      ...telecomData,
      [activeNet]: {
        ...telecomData[activeNet],
        [activeType]: telecomData[activeNet][activeType].map(item =>
          item.id === id ? { ...item, [field]: field === 'price' ? Number(value) : value } : item
        )
      }
    };
    forceSaveTelecom(newData);
  };

  const currentTheme = networks.find(n => n.id === activeNet);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24" dir="rtl">                                                                              
      
      {/* 1. قائمة الشبكات */}
      <div className="bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
           <ArrowRightLeft className="text-orange-500" size={24}/> كابينة التحكم بالشبكات
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {networks.map(net => (
            <button key={net.id} onClick={() => setActiveNet(net.id)} className={`p-5 rounded-[2rem] flex flex-col items-center justify-center gap-3 border transition-all duration-300 active:scale-95 ${activeNet === net.id ? `bg-white/5 border-white/20 shadow-xl scale-105 ${net.color}` : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'}`}>
              <div className={`p-3 rounded-2xl transition-colors ${activeNet === net.id ? net.bg : 'bg-white/5'}`}>
                {net.icon}
              </div>
              <span className="text-[11px] font-black">{net.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. منطقة الإضافة وعرض الباقات */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* قسم إضافة خدمة جديدة */}
        <div className="lg:col-span-4 bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 shadow-xl h-fit">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-8 shadow-inner">
            <button onClick={() => setActiveType('packages')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all active:scale-95 ${activeType === 'packages' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-white'}`}>باقة ذكية</button>
            <button onClick={() => setActiveType('instant')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all active:scale-95 ${activeType === 'instant' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-white'}`}>شحن فوري</button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 pr-2 uppercase">اسم الباقة / الخدمة</label>
              <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-black/60 border border-white/5 p-4 rounded-xl text-white font-bold outline-none focus:border-orange-500 shadow-inner transition-colors" placeholder="مثلاً: مزايا الأسبوعية"/>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 pr-2 uppercase">السعر الأساسي (ر.ي)</label>
              <input type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-black/60 border border-white/5 p-4 rounded-xl text-orange-500 font-black text-2xl outline-none focus:border-orange-500 shadow-inner transition-colors" placeholder="0"/>
            </div>

            {/* 🟢 تلميح ذكي للآدمن: سعر بوابة الشمال */}
            {activeNet === 'Yemen Mobile' && formData.price > 0 && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                   <ShieldAlert size={16} className="text-red-500"/>
                   <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">السعر لبوابة الشمال:</span>
                </div>
                <span className="text-sm font-black text-white">{Math.round(formData.price * (northGateRatio/100)).toLocaleString()} ر.ي</span>
              </div>
            )}

            {activeType === 'packages' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-600 px-1">النت (MB)</label>
                  <input type="text" placeholder="-" value={formData.mb} onChange={e=>setFormData({...formData, mb: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-center text-xs outline-none focus:border-orange-500 transition-colors"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-600 px-1">الدقائق</label>
                  <input type="text" placeholder="-" value={formData.min} onChange={e=>setFormData({...formData, min: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-center text-xs outline-none focus:border-orange-500 transition-colors"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-600 px-1">الرسائل</label>
                  <input type="text" placeholder="-" value={formData.sms} onChange={e=>setFormData({...formData, sms: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-center text-xs outline-none focus:border-orange-500 transition-colors"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-600 px-1">الأيام</label>
                  <input type="text" placeholder="-" value={formData.days} onChange={e=>setFormData({...formData, days: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-center text-xs outline-none focus:border-orange-500 transition-colors"/>
                </div>
              </div>
            )}

            <button onClick={handleAdd} className="w-full py-5 bg-gradient-to-l from-orange-500 to-red-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-all mt-6 flex items-center justify-center gap-2 group">
               <Plus size={24} className="group-hover:scale-125 transition-transform"/> إضافة للشبكة المحددة
            </button>
          </div>
        </div>

        {/* قسم استعراض الخدمات */}
        <div className="lg:col-span-8 bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-8 p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
             <h3 className="text-lg font-black text-white flex items-center gap-3">
               <span className={`w-2 h-6 rounded-full ${currentTheme.color.replace('text', 'bg')}`}></span>
               خدمات {currentTheme.label} الحالية
             </h3>
             <span className="text-[10px] font-black bg-white/5 text-gray-400 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">العدد: {items.length}</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-orange-500/30 transition-all shadow-sm gap-4">
                
                <div className="flex-1 w-full">
                  <input type="text" value={item.name} onChange={(e) => handleInlineEdit(item.id, 'name', e.target.value)} className="bg-transparent border-none outline-none font-black text-white text-lg w-full focus:text-orange-500 transition-colors" />

                  {/* تنبيه السعر المخفي تحت كل خدمة يمن موبايل */}
                  {activeNet === 'Yemen Mobile' && (
                     <p className="text-[9px] font-bold text-red-500/80 mt-1 flex items-center gap-1">
                        <ShieldAlert size={10} /> سيظهر لبوابة الشمال بسعر: {Math.round(item.price * (northGateRatio/100)).toLocaleString()} ر.ي
                     </p>
                  )}

                  {activeType === 'packages' && (
                    <div className="flex flex-wrap gap-2 text-[9px] font-bold text-gray-500 mt-3">
                      <span className="bg-white/5 px-2 py-1 rounded border border-white/5">📦 {item.mb} MB</span>
                      <span className="bg-white/5 px-2 py-1 rounded border border-white/5">📞 {item.min} دقيقة</span>
                      <span className="bg-white/5 px-2 py-1 rounded border border-white/5">⏳ {item.days} يوم</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t border-white/5 md:border-none pt-4 md:pt-0">
                  <div className="relative">
                    <label className="absolute -top-5 right-1 text-[8px] text-gray-600 font-black uppercase">السعر الأساسي (ر.ي)</label>
                    <input type="number" value={item.price} onChange={(e) => handleInlineEdit(item.id, 'price', e.target.value)} className="bg-black/60 border border-white/10 px-4 py-3 rounded-xl text-orange-500 font-black text-center w-32 outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-90">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
            ))}
            
            {items.length === 0 && (
              <div className="py-24 text-center opacity-30 animate-pulse">
                <Database size={60} className="mx-auto mb-4 text-gray-600"/>
                <p className="text-sm font-black uppercase tracking-widest text-white">المخزن فارغ.. أضف أول خدمة الآن</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

