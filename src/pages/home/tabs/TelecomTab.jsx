import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  X, Smartphone, Wifi, Mic, Calendar, Info,
  CheckCircle2, XCircle, ShieldAlert, Zap, History,
  LayoutGrid, Phone, Gift, AlertTriangle, ChevronLeft, Percent
} from 'lucide-react';

export default function TelecomTab({ onBack }) {
  const { telecomData, placeOrder, settings } = useStore();
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState('Yemen Mobile');
  const [tab, setTab] = useState('packages'); // packages أو instant
  const [northGate, setNorthGate] = useState(false);
  const [customAlert, setCustomAlert] = useState(null);
  const [recentPhones, setRecentPhones] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [confirmData, setConfirmData] = useState(null);

  // 🟢 جلب نسبة ضريبة بوابة الشمال من الإعدادات (الافتراضي 210)
  const northGateRatio = Number(settings?.northGateTax) || 210;

  useEffect(() => {
    const saved = localStorage.getItem('badr_recent_phones');
    if (saved) setRecentPhones(JSON.parse(saved));
  }, []);

  // 🟢 محرك التعرف الذكي على الشبكة
  useEffect(() => {
    const p = phone.trim();
    if (p.startsWith('77') || p.startsWith('78')) setNetwork('Yemen Mobile');
    else if (p.startsWith('73')) setNetwork('YOU');
    else if (p.startsWith('71')) setNetwork('Sabafon');
    else if (p.startsWith('70')) setNetwork('Y Telecom');
    else if (p.startsWith('0')) setNetwork('DSL Yemen');
    else if (p.startsWith('10')) setNetwork('Yemen 4G');

    // إعادة تعيين بوابة الشمال إذا تغيرت الشبكة (حصرية ليمن موبايل)
    if (!p.startsWith('77') && !p.startsWith('78')) setNorthGate(false);
  }, [phone]);

  const netThemes = {
    'Yemen Mobile': { color: '#ef4444', label: 'يمن موبايل', logo: 'YM', bg: 'https://images.unsplash.com/photo-1614064641913-6b7140414c71?q=80&w=1000&auto=format&fit=crop' },
    'YOU': { color: '#eab308', label: 'العمانية YOU', logo: 'YOU', bg: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop' },
    'Sabafon': { color: '#3b82f6', label: 'سبأفون', logo: 'S', bg: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop' },
    'Y Telecom': { color: '#a855f7', label: 'واي تليكوم', logo: 'Y', bg: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000&auto=format&fit=crop' },
    'DSL Yemen': { color: '#2563eb', label: 'ADSL منزلي', logo: 'NET', bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop' },
    'Yemen 4G': { color: '#14b8a6', label: 'يمن فورجي', logo: '4G', bg: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=1000&auto=format&fit=crop' }
  };

  const activeNet = netThemes[network] || netThemes['Yemen Mobile'];

  const networkPackages = telecomData?.[network]?.packages || [];
  const networkInstant = telecomData?.[network]?.instant || [];

  const filteredPackages = useMemo(() => {
    return networkPackages.filter(p => {
      if (activeFilter === 'all') return true;
      const hasNet = p.mb && p.mb !== '-' && p.mb.trim() !== '' && p.mb !== '0';
      const hasCalls = p.min && p.min !== '-' && p.min.trim() !== '' && p.min !== '0';
      if (activeFilter === 'internet') return hasNet && !hasCalls;
      if (activeFilter === 'calls') return hasCalls && !hasNet;
      if (activeFilter === 'mix') return hasNet && hasCalls;
      return true;
    });
  }, [networkPackages, activeFilter]);

  // 🟢 دالة حساب السعر النهائي (بالنسبة المئوية الحقيقية)
  const getFinalPrice = (basePrice) => {
    if (network === 'Yemen Mobile' && northGate) {
      // السعر الأساسي × (النسبة ÷ 100)
      return Math.round(Number(basePrice) * (northGateRatio / 100));
    }
    return Number(basePrice);
  };

  // 1. التجهيز للمراجعة قبل الطلب (الفاتورة التفصيلية)
  const handlePreConfirm = (item) => {
    if (!phone || phone.length < 9) {
      return setCustomAlert({ type: 'error', title: 'رقم غير صالح', msg: 'يا وحش، الرجاء إدخال رقم هاتف صحيح! 📱' });
    }

    const finalPrice = getFinalPrice(item.price);

    setConfirmData({
      pkg: item,
      details: `شبكة ${activeNet.label} - ${item.name} | رقم: ${phone} ${northGate ? `(نظام بوابة الشمال ${northGateRatio}%)` : ''}`,
      price: finalPrice 
    });
  };

  // 2. التنفيذ الفعلي
  const executeTelecomOrder = () => {
    const { details, price, pkg } = confirmData;
    const res = placeOrder('سداد اتصالات', details, price);

    setConfirmData(null);

    if (res && res.success) {
      const updatedRecents = [...new Set([phone, ...recentPhones])].slice(0, 4);
      setRecentPhones(updatedRecents);
      localStorage.setItem('badr_recent_phones', JSON.stringify(updatedRecents));

      setCustomAlert({
        type: 'success',
        title: 'تم إرسال طلب السداد!',
        msg: `تم طلب "${pkg.name}" للرقم ${phone} بنجاح.\nجاري التنفيذ وتقدر تتابعه من السجل.`
      });
    } else {
      setCustomAlert({ type: 'error', title: 'فشل السداد', msg: res?.msg || 'عذراً، رصيدك غير كافٍ لإتمام العملية.' });
    }
  };

  const closeAlert = () => {
    if (customAlert?.type === 'success') onBack();
    else setCustomAlert(null);
  };

  return (
    <div className="absolute inset-0 bg-[#050505] z-50 overflow-y-auto pb-40 animate-in slide-in-from-bottom-10 duration-500" dir="rtl">
      
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 opacity-30">
        <img src={activeNet.bg} className="w-full h-full object-cover mix-blend-screen" alt="background" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/90 to-[#050505]"></div>
      </div>

      {/* 🟢 نافذة التأكيد الفخمة (الفاتورة) */}
      {confirmData && (
        <div className="fixed inset-0 z-[110] bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="bg-[#121217] border border-white/10 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-sm relative overflow-hidden">
             
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[60px] opacity-40 pointer-events-none" style={{ backgroundColor: activeNet.color }}></div>

             <div className="w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-xl relative z-10" style={{ backgroundColor: `${activeNet.color}20`, color: activeNet.color, border: `1px solid ${activeNet.color}40` }}>
                <AlertTriangle size={36} />
             </div>
             <h3 className="text-2xl font-black text-white mb-2 text-center relative z-10">فاتورة السداد</h3>
             <p className="text-[11px] font-bold text-gray-400 mb-6 text-center relative z-10">يرجى مراجعة التفاصيل، لا يمكن التراجع بعد التنفيذ.</p>

             <div className="bg-black/50 p-5 rounded-[2rem] border border-white/5 space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                   <span className="text-[10px] text-gray-500 font-black uppercase">الخدمة المطلوبة</span>
                   <span className="text-xs text-white font-black">{confirmData.pkg.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                   <span className="text-[10px] text-gray-500 font-black uppercase">رقم الهاتف</span>
                   <span className="text-sm font-black tracking-widest" style={{ color: activeNet.color }} dir="ltr">{phone}</span>
                </div>
                
                {/* تفصيل السعر للزبون */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                   <span className="text-[10px] text-gray-500 font-black uppercase">السعر الأساسي</span>
                   <span className="text-xs text-white font-black">{Number(confirmData.pkg.price).toLocaleString()} <small className="text-[9px] opacity-70">ر.ي</small></span>
                </div>

                {network === 'Yemen Mobile' && northGate && (
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                     <span className="text-[10px] text-red-500 font-black uppercase">رسوم التحويل ({northGateRatio}%)</span>
                     <span className="text-xs text-red-500 font-black">
                        +{ (confirmData.price - Number(confirmData.pkg.price)).toLocaleString() } <small className="text-[9px] opacity-70">ر.ي</small>
                     </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1">
                   <span className="text-[11px] text-gray-400 font-black uppercase">الإجمالي المخصوم</span>
                   <span className="text-2xl text-white font-black">{(confirmData.price).toLocaleString()} <small className="text-[10px] opacity-50">ر.ي</small></span>
                </div>
             </div>

             <div className="flex gap-3 relative z-10">
                <button onClick={executeTelecomOrder} className="flex-1 py-4 rounded-[2rem] text-black font-black text-sm active:scale-95 transition-all shadow-lg" style={{ backgroundColor: activeNet.color }}>تأكيد واخصم</button>
                <button onClick={() => setConfirmData(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] text-white font-black text-sm active:scale-95 transition-all">تعديل</button>
             </div>
          </div>
        </div>
      )}

      {/* التنبيهات (تم السداد / خطأ) */}
      {customAlert && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#121217] border border-white/10 p-8 rounded-[3rem] text-center shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-300">
             <div className={`w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-xl ${customAlert.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {customAlert.type === 'success' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
             </div>
             <h3 className="text-xl font-black text-white mb-2">{customAlert.title}</h3>
             <p className="text-sm font-bold text-gray-400 mb-8 whitespace-pre-line leading-relaxed">{customAlert.msg}</p>
             <button onClick={closeAlert} className={`w-full py-4 rounded-[2rem] text-white font-black text-lg active:scale-95 transition-all ${customAlert.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {customAlert.type === 'success' ? 'حسناً، عودة للرئيسية' : 'رجوع'}
             </button>
          </div>
        </div>
      )}

      {/* الهيدر */}
      <div className="sticky top-0 z-30 px-6 py-6 flex justify-between items-center bg-black/20 backdrop-blur-3xl border-b border-white/5">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-white shadow-2xl transition-colors duration-500" style={{ backgroundColor: activeNet.color }}>
               {activeNet.logo}
            </div>
            <div>
               <h2 className="font-black text-white text-lg tracking-tight shadow-black drop-shadow-md">كابينة السداد</h2>
               <p className="text-[10px] font-black uppercase tracking-widest transition-colors duration-500" style={{ color: activeNet.color }}>شبكة {activeNet.label}</p>
            </div>
         </div>
         <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 active:scale-95 transition-all backdrop-blur-md"><X size={24}/></button>
      </div>

      <div className="p-5 space-y-8 mt-4 relative z-10">

        {/* منطقة إدخال الرقم */}
        <div className="relative group">
           <div className="absolute inset-0 blur-3xl opacity-20 transition-colors duration-700 rounded-[3rem]" style={{ backgroundColor: activeNet.color }}></div>

           <div className="relative bg-[#0a0a0c]/80 backdrop-blur-xl p-8 rounded-[3rem] border-2 transition-colors duration-500 shadow-2xl" style={{ borderColor: phone.length > 0 ? `${activeNet.color}66` : '#ffffff10' }}>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 text-center">أدخل رقم الهاتف للتعرف على الشبكة</label>

              <input
                 type="tel"
                 value={phone}
                 onChange={e => setPhone(e.target.value)}
                 placeholder="7XXXXXXXX"
                 className="w-full bg-transparent text-white text-5xl font-black text-center outline-none tracking-[0.2em] placeholder:text-gray-800 transition-colors duration-300 drop-shadow-lg"
                 style={{ color: phone.length > 0 ? activeNet.color : 'white' }}
                 dir="ltr"
              />

              {phone.length === 0 && recentPhones.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-2 animate-in fade-in duration-500">
                  <div className="w-full text-center flex items-center justify-center gap-1 mb-2 text-gray-500">
                     <History size={12} /> <span className="text-[9px] font-black uppercase tracking-widest">أرقام سابقة</span>
                  </div>
                  {recentPhones.map((num, i) => (
                    <button key={i} onClick={() => setPhone(num)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-xs font-black text-white transition-all active:scale-95">
                      {num}
                    </button>
                  ))}
                </div>
              )}

              {/* 🟢 نظام بوابة الشمال (يظهر ليمن موبايل فقط) */}
              {network === 'Yemen Mobile' && (
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center px-2 animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${northGate ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-gray-500'}`}>
                         <Percent size={14} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-white">رقمي في المحافظات الشمالية</span>
                      </div>
                   </div>
                   <button onClick={() => setNorthGate(!northGate)} className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors duration-300 ${northGate ? 'bg-red-500' : 'bg-white/10 border border-white/5'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${northGate ? 'translate-x-0' : '-translate-x-6'}`}></div>
                   </button>
                </div>
              )}
           </div>
        </div>

        {/* أزرار التبديل */}
        <div className="flex bg-[#0a0a0c]/80 backdrop-blur-md p-2 rounded-[1.8rem] border border-white/5 shadow-inner">
           <button onClick={() => setTab('packages')} className={`flex-1 py-4 rounded-2xl font-black text-[11px] transition-all duration-300 ${tab === 'packages' ? 'text-white shadow-lg' : 'text-gray-500'}`} style={{ backgroundColor: tab === 'packages' ? activeNet.color : 'transparent' }}>باقات ذكية</button>
           <button onClick={() => setTab('instant')} className={`flex-1 py-4 rounded-2xl font-black text-[11px] transition-all duration-300 ${tab === 'instant' ? 'text-white shadow-lg' : 'text-gray-500'}`} style={{ backgroundColor: tab === 'instant' ? activeNet.color : 'transparent' }}>شحن فوري (رصيد)</button>
        </div>

        {/* 🟢 قسم الباقات */}
        {tab === 'packages' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             {networkPackages.length > 0 && (
               <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {[
                    { id: 'all', label: 'الكل', icon: <LayoutGrid size={12}/> },
                    { id: 'internet', label: 'إنترنت', icon: <Wifi size={12}/> },
                    { id: 'calls', label: 'مكالمات', icon: <Phone size={12}/> },
                    { id: 'mix', label: 'مكس', icon: <Gift size={12}/> }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`shrink-0 px-4 py-2.5 rounded-full text-[10px] font-black flex items-center gap-2 border transition-all active:scale-95 ${
                        activeFilter === f.id ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-gray-500 border-white/5 backdrop-blur-sm'
                      }`}
                    >
                      {f.icon} {f.label}
                    </button>
                  ))}
               </div>
             )}

             {filteredPackages.map((p) => (
                <button
                   key={p.id}
                   onClick={() => handlePreConfirm(p)}
                   className="w-full bg-[#0d0d0f]/90 backdrop-blur-md p-6 rounded-[2.2rem] border border-white/5 flex flex-col gap-5 hover:bg-[#121217] active:scale-[0.97] transition-all relative overflow-hidden group shadow-xl text-right"
                >
                   <div className="absolute top-0 right-0 w-1.5 h-full opacity-60 transition-colors duration-500" style={{ backgroundColor: activeNet.color }}></div>

                   <div className="flex justify-between items-start w-full">
                      <div className="flex-1">
                         <h4 className="font-black text-white text-base mb-1">{p.name}</h4>
                         <p className="text-[10px] font-bold text-gray-400 truncate">مخصصة لشبكة {activeNet.label}</p>
                      </div>
                      <div className="text-xl font-black flex flex-col items-end gap-1 transition-colors duration-500 drop-shadow-md shrink-0" style={{ color: activeNet.color }}>
                         <div className="flex items-baseline gap-1">
                            {getFinalPrice(p.price).toLocaleString()} <small className="text-[9px] opacity-50">ر.ي</small>
                         </div>
                         {network === 'Yemen Mobile' && northGate && <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full border border-red-500/30">شامل بوابة الشمال</span>}
                      </div>
                   </div>

                   <div className="flex justify-between items-center w-full bg-black/50 p-4 rounded-2xl border border-white/5">
                      <div className="flex flex-col items-center gap-1"><Wifi size={14} className="text-gray-500" /><span className="text-[10px] text-white font-black">{p.mb || '-'}</span></div>
                      <div className="w-[1px] h-4 bg-white/10"></div>
                      <div className="flex flex-col items-center gap-1"><Mic size={14} className="text-gray-500" /><span className="text-[10px] text-white font-black">{p.min || '-'}</span></div>
                      <div className="w-[1px] h-4 bg-white/10"></div>
                      <div className="flex flex-col items-center gap-1"><Calendar size={14} className="text-gray-500" /><span className="text-[10px] text-white font-black">{p.days || '-'} يوم</span></div>
                   </div>
                </button>
             ))}

             {networkPackages.length === 0 && (
                <div className="py-16 text-center space-y-4 opacity-40">
                   <Zap size={40} className="mx-auto text-gray-500" />
                   <p className="text-xs font-black uppercase tracking-widest text-white">لا توجد باقات متاحة حالياً</p>
                </div>
             )}
          </div>
        )}

        {/* 🟢 قسم الشحن الفوري */}
        {tab === 'instant' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
             {networkInstant.length > 0 ? (
                networkInstant.map(p => (
                   <button
                      key={p.id}
                      onClick={() => handlePreConfirm(p)}
                      className="bg-[#0d0d0f]/90 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center gap-3 active:scale-[0.95] transition-all group shadow-xl"
                   >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform" style={{ color: activeNet.color }}>
                         <Zap size={24} />
                      </div>
                      <h4 className="font-black text-white text-sm">{p.name}</h4>
                      <div className="px-3 py-1.5 rounded-xl border border-white/5 bg-black/40 font-black text-base" style={{ color: activeNet.color }}>
                         {getFinalPrice(p.price).toLocaleString()} <small className="text-[8px] opacity-60">ر.ي</small>
                      </div>
                      {network === 'Yemen Mobile' && northGate && <span className="text-[8px] text-red-500 font-bold bg-red-500/10 px-2 rounded-full">شامل الضريبة</span>}
                   </button>
                ))
             ) : (
                <div className="col-span-2 py-16 text-center space-y-4 opacity-40">
                   <Smartphone size={40} className="mx-auto text-gray-500" />
                   <p className="text-xs font-black uppercase tracking-widest text-white">لا توجد تعبئة فورية متاحة</p>
                </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}

