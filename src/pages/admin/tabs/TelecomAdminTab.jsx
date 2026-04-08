import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Plus, Trash2, Smartphone, Globe, Zap,
  Wifi, Signal, Layers, Database, ArrowRightLeft, ShieldAlert
} from 'lucide-react';

export default function TelecomAdminTab() {
  // 🟢 جلبنا الإعدادات عشان نأخذ منها نسبة بوابة الشمال
  const { telecomData, setTelecomData, settings } = useStore();

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

  const handleAdd = () => {
    if (!formData.name || !formData.price) return alert('أدخل البيانات الأساسية يا بطل!');

    const newItem = {
      id: `TEL-${Date.now()}`,
      name: formData.name,
      price: Number(formData.price), // 🟢 الحفظ يتم بالسعر الأساسي فقط
      mb: formData.mb || '0',
      min: formData.min || '0',
      sms: formData.sms || '0',
      days: formData.days || '30'
    };

    setTelecomData(prev => ({
      ...prev,
      [activeNet]: {
        ...prev[activeNet],
        [activeType]: [...(prev[activeNet][activeType] || []), newItem]
      }
    }));

    setFormData({ name: '', price: '', mb: '', min: '', sms: '', days: '' });
  };

  const handleDelete = (id) => {
    if(!window.confirm('حذف نهائي؟')) return;
    
    setTelecomData(prev => ({
      ...prev,
      [activeNet]: {
        ...prev[activeNet],
        [activeType]: prev[activeNet][activeType].filter(item => item.id !== id)
      }
    }));
  };

  const handleInlineEdit = (id, field, value) => {
    setTelecomData(prev => {
      const updatedItems = prev[activeNet][activeType].map(item => 
        item.id === id ? { ...item, [field]: field === 'price' ? Number(value) : value } : item
      );
      return {
        ...prev,
        [activeNet]: {
          ...prev[activeNet],
          [activeType]: updatedItems
        }
      };
    });
  };

  const currentTheme = networks.find(n => n.id === activeNet);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24" dir="rtl">
      
      <div className="bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
           <ArrowRightLeft className="text-orange-500" size={24}/> كابينة التحكم بالشبكات
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {networks.map(net => (
            <button
              key={net.id}
              onClick={() => setActiveNet(net.id)}
              className={`p-5 rounded-[2rem] flex flex-col items-center justify-center gap-3 border transition-all duration-300 ${
                activeNet === net.id
                  ? `bg-white/5 border-white/20 shadow-xl scale-105 ${net.color}`
                  : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'
              }`}
            >
              <div className={`p-3 rounded-2xl ${activeNet === net.id ? net.bg : 'bg-white/5'}`}>
                {net.icon}
              </div>
              <span className="text-[11px] font-black">{net.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 shadow-xl h-fit">
          <div className="flex bg-black p-1.5 rounded-2xl border border-white/5 mb-8">
            <button onClick={() => setActiveType('packages')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${activeType === 'packages' ? 'bg-orange-500 text-black shadow-lg' : 'text-gray-500'}`}>باقة جديدة</button>
            <button onClick={() => setActiveType('instant')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${activeType === 'instant' ? 'bg-orange-500 text-black shadow-lg' : 'text-gray-500'}`}>شحن فوري</button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 pr-2 uppercase">اسم الباقة / الخدمة</label>
              <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-black/60 border border-white/5 p-4 rounded-xl text-white font-bold outline-none focus:border-orange-500 shadow-inner" placeholder="مثلاً: مزايا الأسبوعية"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 pr-2 uppercase">السعر الأساسي (ر.ي)</label>
              <input type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-black/60 border border-white/5 p-4 rounded-xl text-orange-500 font-black text-2xl outline-none focus:border-orange-500 shadow-inner" placeholder="0"/>
            </div>

            {/* 🟢 تلميح ذكي للآدمن: يوريه سعر الزبون بعد الضريبة إذا كان يمن موبايل */}
            {activeNet === 'Yemen Mobile' && formData.price > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <ShieldAlert size={14} className="text-red-500"/>
                   <span className="text-[10px] font-black text-red-500">سعر بوابة الشمال للزبون:</span>
                </div>
                <span className="text-sm font-black text-white">{Math.round(formData.price * (northGateRatio/100)).toLocaleString()} ر.ي</span>
              </div>
            )}

            {activeType === 'packages' && (
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="النت MB" value={formData.mb} onChange={e=>setFormData({...formData, mb: e.target.value})} className="bg-black/40 p-3 rounded-xl border border-white/5 text-white text-center text-xs outline-none focus:border-orange-500"/>
                <input type="text" placeholder="الدقائق" value={formData.min} onChange={e=>setFormData({...formData, min: e.target.value})} className="bg-black/40 p-3 rounded-xl border border-white/5 text-white text-center text-xs outline-none focus:border-orange-500"/>
                <input type="text" placeholder="الرسائل" value={formData.sms} onChange={e=>setFormData({...formData, sms: e.target.value})} className="bg-black/40 p-3 rounded-xl border border-white/5 text-white text-center text-xs outline-none focus:border-orange-500"/>
                <input type="text" placeholder="الأيام" value={formData.days} onChange={e=>setFormData({...formData, days: e.target.value})} className="bg-black/40 p-3 rounded-xl border border-white/5 text-white text-center text-xs outline-none focus:border-orange-500"/>
              </div>
            )}

            <button onClick={handleAdd} className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-black rounded-2xl font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2">
               <Plus size={20}/> إضافة لـ {currentTheme.label}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-8 p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
             <h3 className="text-lg font-black text-white flex items-center gap-3">
               <span className={`w-2 h-6 rounded-full ${currentTheme.color.replace('text', 'bg')}`}></span>
               خدمات {currentTheme.label} الحالية
             </h3>
             <span className="text-[10px] font-black bg-white/5 text-gray-400 px-4 py-1.5 rounded-full border border-white/5 uppercase">العناصر: {items.length}</span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-orange-500/30 transition-all shadow-sm">
                <div className="flex-1">
                  <input type="text" value={item.name} onChange={(e) => handleInlineEdit(item.id, 'name', e.target.value)} className="bg-transparent border-none outline-none font-black text-white text-lg w-full focus:text-orange-500 transition-colors" />
                  
                  {/* عرض تنبيه السعر المخفي تحت كل خدمة يمن موبايل */}
                  {activeNet === 'Yemen Mobile' && (
                     <p className="text-[9px] font-bold text-red-500/80 mt-1">
                        سيظهر لمستخدمي بوابة الشمال بسعر: {Math.round(item.price * (northGateRatio/100)).toLocaleString()} ر.ي
                     </p>
                  )}

                  {activeType === 'packages' && (
                    <div className="flex gap-2 text-[9px] font-bold text-gray-500 mt-2">
                      <span className="bg-white/5 px-2 py-0.5 rounded">📦 {item.mb} MB</span> • 
                      <span className="bg-white/5 px-2 py-0.5 rounded">📞 {item.min} د</span> • 
                      <span className="bg-white/5 px-2 py-0.5 rounded">⏳ {item.days} يوم</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input type="number" value={item.price} onChange={(e) => handleInlineEdit(item.id, 'price', e.target.value)} className="bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl text-orange-500 font-black text-center w-28 outline-none focus:border-orange-500" />
                    <span className="absolute -top-5 right-0 text-[8px] text-gray-600 font-black">ر.ي (أساسي)</span>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="py-24 text-center opacity-20">
                <Database size={50} className="mx-auto mb-4 text-gray-600"/>
                <p className="text-sm font-black uppercase tracking-widest">المخزن فارغ.. أضف أول خدمة الآن</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

