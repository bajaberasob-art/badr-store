import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Plus, Trash2, Edit3, X, Upload, Save, LayoutGrid, Gamepad2,
  Smartphone, Globe, CreditCard, DollarSign, ArrowRightLeft,
  Search, Flame, Eye, EyeOff, Copy, ArrowUp, ArrowDown, Settings2, Sparkles, Check
} from 'lucide-react';

export default function ServicesTab() {
  const { services = [], setServices, updateSettings, settings, addService, deleteService } = useStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '', category: 'games', image: '', packages: [], isVisible: true, isPopular: false
  });
  
  const [tempPkg, setTempPkg] = useState({ name: '', price: '' });
  const sarRate = Number(settings?.exchangeRate) || 140;

  // ☢️ [الضربة القاضية للحفظ]: هذي الدالة تجبر النظام على الحفظ في كل مكان!
  const forceSaveAll = (newServicesArray) => {
    // 1. تحديث الشاشة فوراً
    if (setServices) setServices(newServicesArray);
    
    // 2. تحديث المخ (Context) مع الحفاظ على باقي الإعدادات
    const updatedSettings = { ...settings, services: newServicesArray };
    if (updateSettings) updateSettings(updatedSettings);

    // 3. الحفظ الإجباري المباشر في قاعدة المتصفح (LocalStorage) عشان ما يتبخر التعديل
    try {
      const currentStorage = JSON.parse(localStorage.getItem('badr_settings') || '{}');
      currentStorage.services = newServicesArray;
      localStorage.setItem('badr_settings', JSON.stringify(currentStorage));
    } catch (err) {
      console.error('خطأ في الحفظ الإجباري:', err);
    }
  };

  const categories = [
    { id: 'all', label: 'الكل', icon: <LayoutGrid size={18}/> },
    { id: 'games', label: 'الألعاب', icon: <Gamepad2 size={18}/> },
    { id: 'programs', label: 'البرامج', icon: <LayoutGrid size={18}/> },
    { id: 'telecom', label: 'الاتصالات', icon: <Smartphone size={18}/> },
    { id: 'wifi', label: 'WIFI', icon: <Globe size={18}/> },
    { id: 'cards', label: 'بطائق', icon: <CreditCard size={18}/> }
  ];

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesCat = activeFilter === 'all' || s.category === activeFilter;
      const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [services, activeFilter, searchTerm]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;
          canvas.width = MAX_WIDTH;
          canvas.height = MAX_HEIGHT;
          ctx.drawImage(img, 0, 0, MAX_WIDTH, MAX_HEIGHT);
          const compressedBase64 = canvas.toDataURL('image/webp', 0.7);
          setFormData({ ...formData, image: compressedBase64 });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const addPkg = () => {
    if (!tempPkg.name || !tempPkg.price) return;
    setFormData({
      ...formData,
      packages: [...formData.packages, { ...tempPkg, id: Date.now() + Math.random() }]
    });
    setTempPkg({ name: '', price: '' });
  };

  const updatePkgInline = (id, field, value) => {
    setFormData({
      ...formData,
      packages: formData.packages.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  // 🟢 زر حفظ الخدمة والتعديلات
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.image || !formData.name) return alert('أكمل البيانات يا بطل!');
    
    if (editingId) {
      // تعديل خدمة موجودة (نستخدم دالة الضربة القاضية)
      const updatedServices = services.map(s => s.id === editingId ? { ...formData, id: editingId } : s);
      forceSaveAll(updatedServices);
    } else {
      // إضافة خدمة جديدة (نستخدم طريقة المخ الأصلية لأنها شغالة)
      addService({ ...formData, id: Date.now() });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'games', image: '', packages: [], isVisible: true, isPopular: false });
    setShowAddForm(false);
    setEditingId(null);
  };

  const startEdit = (service) => {
    setFormData({
      ...service,
      isVisible: service.isVisible !== false, 
      isPopular: service.isPopular || false,
      packages: service.packages ? [...service.packages] : []
    });
    setEditingId(service.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🟢 أزرار التحكم السريع (النار، الإخفاء)
  const toggleQuickAction = (serviceId, field) => {
    const updatedServices = services.map(s => {
      if (s.id === serviceId) {
        const currentValue = s[field];
        const actualValue = currentValue === undefined ? (field === 'isVisible' ? true : false) : currentValue;
        return { ...s, [field]: !actualValue };
      }
      return s;
    });
    forceSaveAll(updatedServices); // حفظ إجباري
  };

  // 🟢 ميزة النسخ المتطابق
  const handleClone = (serviceId) => {
    const original = services.find(s => s.id === serviceId);
    if (original) {
      const clonedPackages = (original.packages || []).map(p => ({ ...p, id: Date.now() + Math.random() }));
      const newService = { 
        ...original, 
        id: Date.now(), 
        name: `${original.name} (نسخة)`,
        isPopular: false,
        packages: clonedPackages
      };
      forceSaveAll([...services, newService]); // حفظ إجباري
    }
  };

  // 🟢 ميزة الترتيب
  const handleReorder = (id, direction) => {
    const index = services.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;
    
    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];
    
    forceSaveAll(newServices); // حفظ إجباري
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20" dir="rtl">
      
      {/* شريط البحث والفلترة */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#121217]/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveFilter(cat.id)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] transition-all whitespace-nowrap ${activeFilter === cat.id ? 'bg-[#FF8C00] text-black shadow-lg shadow-orange-500/20' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-80 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF8C00] transition-colors" size={18} />
          <input type="text" placeholder="ابحث عن لعبة أو خدمة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 pr-12 rounded-[1.5rem] text-sm font-bold text-white outline-none focus:border-[#FF8C00]/50" />
        </div>
      </div>

      {!showAddForm && (
        <button onClick={() => { resetForm(); setShowAddForm(true); }} className="w-full py-10 bg-black/40 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-[#FF8C00] hover:border-[#FF8C00]/40 transition-all group relative overflow-hidden shadow-inner">
          <div className="p-4 bg-white/5 rounded-full group-hover:rotate-90 transition-transform duration-500"><Plus size={36} /></div>
          <span className="font-black text-sm tracking-widest uppercase">توسيع المتجر: إضافة خدمة جديدة</span>
        </button>
      )}

      {showAddForm && (
        <form onSubmit={handleSave} className="bg-[#121217] p-6 md:p-10 rounded-[3.5rem] border border-orange-500/30 space-y-8 shadow-2xl relative animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl font-black text-white flex items-center gap-3"><Settings2 className="text-orange-500" /> {editingId ? 'تعديل الخدمة' : 'إنشاء خدمة جديدة'}</h3>
            <button type="button" onClick={resetForm} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-red-500"><X size={24}/></button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem] p-8 relative group bg-black/40 aspect-square overflow-hidden hover:border-[#FF8C00]/40 transition-all shadow-inner">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-contain rounded-[2.5rem]" alt="preview" />
                ) : (
                  <div className="text-center text-gray-600 group-hover:text-orange-500">
                    <Upload size={50} className="mx-auto mb-3" />
                    <p className="text-xs font-black uppercase">ارفع أيقونة شفافة</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImage} />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 pr-4 uppercase tracking-[0.2em]">اسم الخدمة</label>
                   <input type="text" required placeholder="مثلاً: ببجي موبايل" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/60 border border-white/5 p-5 rounded-[1.5rem] text-white font-black text-lg outline-none focus:border-orange-500 shadow-inner" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 pr-4 uppercase tracking-[0.2em]">القسم</label>
                   <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/60 border border-white/5 p-5 rounded-[1.5rem] text-white font-black text-lg outline-none focus:border-orange-500 shadow-inner appearance-none">
                     {categories.filter(c=>c.id!=='all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                   </select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, isVisible: !formData.isVisible})} className={`p-5 rounded-[1.5rem] border flex items-center justify-center gap-3 transition-all font-black text-xs ${formData.isVisible ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  {formData.isVisible ? <><Eye size={18}/> تظهر للزبائن</> : <><EyeOff size={18}/> مخفية حالياً</>}
                </button>
                <button type="button" onClick={() => setFormData({...formData, isPopular: !formData.isPopular})} className={`p-5 rounded-[1.5rem] border flex items-center justify-center gap-3 transition-all font-black text-xs ${formData.isPopular ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                  <Flame size={18} className={formData.isPopular ? 'fill-orange-500' : ''}/> تمييز "نار" 🔥
                </button>
              </div>
            </div>
          </div>

          {/* محرر الباقات الذكي */}
          <div className="bg-black/40 p-8 rounded-[3rem] border border-white/5 shadow-inner space-y-6">
            <div className="flex justify-between items-center">
               <h4 className="text-lg font-black text-white flex items-center gap-3"><DollarSign size={22} className="text-green-500"/> محرر الباقات (ر.س ➡️ ر.ي)</h4>
               <span className="text-[10px] font-black text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">صرف اليوم: {sarRate}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white/5 p-5 rounded-[2rem] border border-white/5">
              <input type="text" placeholder="اسم الباقة..." value={tempPkg.name} onChange={e => setTempPkg({ ...tempPkg, name: e.target.value })} className="md:col-span-5 bg-black/60 p-4 rounded-xl border border-white/5 outline-none text-white font-bold" />
              <div className="md:col-span-3 relative">
                <input type="number" placeholder="السعر ر.س" value={tempPkg.price} onChange={e => setTempPkg({ ...tempPkg, price: e.target.value })} className="w-full bg-black/60 p-4 rounded-xl border border-white/5 outline-none text-green-500 font-black text-center" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-[10px] font-black uppercase">ر.س</span>
              </div>
              <div className="md:col-span-3 bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 text-orange-500 font-black text-center flex items-center justify-center gap-2">
                {tempPkg.price ? Math.round(tempPkg.price * sarRate).toLocaleString() : 0} <span className="text-[9px] opacity-60">ر.ي</span>
              </div>
              <button type="button" onClick={addPkg} className="md:col-span-1 bg-green-600 text-black rounded-xl font-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><Plus/></button>
            </div>

            <div className="space-y-3">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">
                 <div className="col-span-5">اسم الباقة</div>
                 <div className="col-span-3 text-center">السعر بالريال السعودي</div>
                 <div className="col-span-3 text-center">المعادل بالريال اليمني</div>
                 <div className="col-span-1"></div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.packages.map((pkg) => (
                  <div key={pkg.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-black/40 p-3 rounded-2xl border border-white/5 group hover:border-white/10 transition-all items-center">
                    <input type="text" value={pkg.name} onChange={(e) => updatePkgInline(pkg.id, 'name', e.target.value)} className="md:col-span-5 bg-transparent border-none outline-none text-white font-bold px-3 text-sm focus:text-orange-500" />
                    <div className="md:col-span-3 relative">
                       <input type="number" value={pkg.price} onChange={(e) => updatePkgInline(pkg.id, 'price', e.target.value)} className="w-full bg-black/40 p-2 rounded-lg border border-white/5 text-green-500 font-black text-center outline-none focus:border-green-500/50" />
                    </div>
                    <div className="md:col-span-3 text-center text-orange-500 font-black text-sm">
                       {Math.round((Number(pkg.price) || 0) * sarRate).toLocaleString()} <span className="text-[9px] opacity-40">ر.ي</span>
                    </div>
                    <div className="md:col-span-1 flex justify-center">
                       <button type="button" onClick={() => setFormData({...formData, packages: formData.packages.filter(p=>p.id!==pkg.id)})} className="p-2 text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-6 bg-gradient-to-l from-orange-500 to-red-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
            <Save size={24} className="inline ml-3" /> {editingId ? 'حفظ كافة التعديلات' : 'نشر الخدمة في المتجر'}
          </button>
        </form>
      )}

      {/* عرض الخدمات (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map(service => {
          const isVisible = service.isVisible !== false;
          const isPopular = service.isPopular || false;

          return (
          <div key={service.id} className={`bg-[#121217] p-6 rounded-[3rem] border transition-all shadow-xl relative group overflow-hidden flex flex-col ${isVisible ? 'border-white/5' : 'border-red-500/20 opacity-50'}`}>
            
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <button 
                onClick={() => toggleQuickAction(service.id, 'isPopular')} 
                className={`p-2 rounded-xl transition-all shadow-lg cursor-pointer ${isPopular ? 'bg-orange-500 text-black shadow-orange-500/30' : 'bg-black/50 text-gray-500 hover:text-orange-500 border border-white/5'}`}
                title={isPopular ? "إزالة من العروض النارية" : "إضافة للعروض النارية"}
              >
                <Flame size={18} fill={isPopular ? "black" : "none"} />
              </button>
              
              <button 
                onClick={() => toggleQuickAction(service.id, 'isVisible')} 
                className={`p-2 rounded-xl transition-all shadow-lg cursor-pointer ${!isVisible ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-black/50 text-gray-400 hover:text-red-500 border border-white/5'}`}
                title={isVisible ? "إخفاء عن الزبائن" : "إظهار للزبائن"}
              >
                {!isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="absolute top-4 left-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
              <button onClick={() => handleReorder(service.id, 'up')} className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-orange-500 hover:text-black transition-all"><ArrowUp size={16}/></button>
              <button onClick={() => handleReorder(service.id, 'down')} className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-orange-500 hover:text-black transition-all"><ArrowDown size={16}/></button>
              <button onClick={() => handleClone(service.id)} className="p-2.5 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20 hover:bg-green-500 hover:text-black transition-all"><Copy size={16}/></button>
              <button onClick={() => startEdit(service)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={16}/></button>
              <button onClick={() => { if(window.confirm('حذف؟')) deleteService(service.id); }} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
            </div>

            <div className="flex items-center gap-5 mb-8 mt-4">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-white/5 shadow-2xl group-hover:scale-105 transition-transform duration-500 flex items-center justify-center bg-black/20">
                {service.image ? <img src={service.image} className="w-full h-full object-contain p-1" alt="" /> : <Gamepad2 size={32} className="text-gray-600"/>}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-white text-xl line-clamp-1">{service.name}</h4>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">
                   {categories.find(c=>c.id===service.category)?.label} • {(service.packages || []).length} باقة
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
               <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-[10px] font-black text-gray-500 uppercase">بداية من:</span>
                  <span className="text-sm font-black text-green-500">{service.packages?.[0]?.price || 0} <small className="text-[9px]">ر.س</small></span>
               </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

