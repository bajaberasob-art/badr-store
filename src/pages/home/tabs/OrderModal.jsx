import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  X, Check, Info, ShieldCheck,
  Zap, Sparkles, CheckCircle2, XCircle, AlertTriangle, ClipboardPaste, Loader2
} from 'lucide-react';

export default function OrderModal({ service, onClose }) {
  const { placeOrder, settings } = useStore();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [input, setInput] = useState('');

  const [customAlert, setCustomAlert] = useState(null);
  // 🟢 حالة نافذة التأكيد قبل الشراء
  const [confirmData, setConfirmData] = useState(null);
  
  // 🟢 حالة التحميل لمنع النقرة المزدوجة (حماية الرصيد)
  const [isProcessing, setIsProcessing] = useState(false);

  const exchangeRate = settings?.exchangeRate || 140;
  const calculateFinalPrice = (usdPrice) => Math.round(Number(usdPrice) * exchangeRate);

  // 🟢 تحديد الحد الأقصى بناءً على فئة الخدمة (13 للألعاب، 9 للبرامج/أخرى)
  const isGame = service?.category === 'games';
  const maxLength = isGame ? 13 : 9;

  // 🟢 ميزة اللصق السريع (Paste API)
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numbersOnly = text.replace(/\D/g, '').slice(0, maxLength); // تنظيف ولصق الأرقام فقط
      if (numbersOnly) setInput(numbersOnly);
    } catch (err) {
      alert("عذراً، المتصفح منع اللصق التلقائي، قم باللصق يدوياً.");
    }
  };

  // 1. زر التأكيد الأول (يفتح نافذة المراجعة)
  const handlePreConfirm = () => {
    if (!selectedPkg) {
      return setCustomAlert({ type: 'error', title: 'تنبيه', msg: 'يا وحش، اختر الباقة أولاً! 🎮' });
    }
    
    // التحقق من الإدخال بناءً على الفئة
    if (!input.trim() || input.length < 5) {
      return setCustomAlert({ type: 'error', title: 'بيانات ناقصة', msg: isGame ? 'الآيدي المدخل غير صحيح! 🆔' : 'يرجى إدخال رقم هاتف صحيح! 📱' });
    }

    const finalPrice = calculateFinalPrice(selectedPkg.price);

    // حفظ البيانات في نافذة التأكيد وعرضها للزبون
    setConfirmData({
      serviceName: service.name,
      pkgName: selectedPkg.name,
      inputDetails: input,
      price: finalPrice
    });
  };

  // 2. زر التنفيذ النهائي (الخصم الفعلي من السحابة)
  const executeOrder = async () => {
    if (isProcessing) return; // منع التكرار
    setIsProcessing(true); // تشغيل اللودينق

    try {
      const res = await placeOrder(
        confirmData.serviceName,
        `${confirmData.pkgName} | بيانات: ${confirmData.inputDetails}`,
        confirmData.price
      );

      setConfirmData(null); // إغلاق نافذة التأكيد

      if (res && res.success) {
        setCustomAlert({
          type: 'success',
          title: 'تم الطلب بنجاح!',
          msg: `تم إرسال طلبك لخدمة "${service.name}" بمبلغ ${confirmData.price} ر.ي.\nتقدر تتابع الحالة من سجل طلباتي.`
        });
      } else {
        setCustomAlert({
          type: 'error',
          title: 'فشل الطلب',
          msg: res?.msg || 'حدث خطأ، يرجى المحاولة لاحقاً.'
        });
      }
    } catch (error) {
      setCustomAlert({ type: 'error', title: 'خطأ بالاتصال', msg: 'حدث خطأ بالاتصال بالسحابة.' });
    } finally {
      setIsProcessing(false); // إيقاف اللودينق
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end overflow-hidden" dir="rtl">

      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>

      <div className="relative bg-[#08080a] rounded-t-[3.5rem] border-t border-white/10 p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-700 max-h-[90vh] flex flex-col">

        {/* 🟢 نافذة التأكيد الفخمة (تظهر قبل الخصم) */}
        {confirmData && (
          <div className="absolute inset-0 z-40 bg-[#08080a]/95 backdrop-blur-xl rounded-t-[3.5rem] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
            <div className="bg-[#121217] border border-orange-500/30 p-8 rounded-[3rem] shadow-[0_0_50px_rgba(249,115,22,0.15)] w-full max-w-sm">
               <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-xl">
                  <AlertTriangle size={36} />
               </div>
               <h3 className="text-2xl font-black text-white mb-2 text-center">تأكيد عملية الشراء</h3>
               <p className="text-[11px] font-bold text-gray-400 mb-6 text-center">يرجى مراجعة البيانات جيداً، لا يمكن التراجع بعد التنفيذ.</p>

               <div className="bg-black/50 p-5 rounded-[2rem] border border-white/5 space-y-4 mb-8">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                     <span className="text-[10px] text-gray-500 font-black uppercase">الخدمة والباقة</span>
                     <span className="text-xs text-white font-black">{confirmData.serviceName} - {confirmData.pkgName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                     <span className="text-[10px] text-gray-500 font-black uppercase">{isGame ? 'الآيدي' : 'رقم الهاتف'}</span>
                     <span className="text-sm text-orange-500 font-black tracking-widest" dir="ltr">{confirmData.inputDetails}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] text-gray-500 font-black uppercase">المبلغ الإجمالي</span>
                     <span className="text-lg text-white font-black">{confirmData.price} <small className="text-[10px] opacity-50">ر.ي</small></span>
                  </div>
               </div>

               <div className="flex gap-3">
                  {/* 🟢 زر الدفع مع تأثير التحميل */}
                  <button 
                    onClick={executeOrder} 
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 rounded-[2rem] text-black font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <><Loader2 size={18} className="animate-spin" /> جاري التنفيذ</> : 'تأكيد وخصم'}
                  </button>
                  <button 
                    onClick={() => setConfirmData(null)} 
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] text-white font-black text-sm transition-all disabled:opacity-50"
                  >
                    مراجعة وتعديل
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* طبقة التنبيه (النجاح/الخطأ) */}
        {customAlert && (
          <div className="absolute inset-0 z-50 bg-[#08080a]/95 backdrop-blur-xl rounded-t-[3.5rem] flex items-center justify-center p-8 animate-in zoom-in-95 duration-300">
            <div className="bg-[#121217] border border-white/10 p-8 rounded-[3rem] text-center shadow-2xl w-full max-w-sm">
               <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl ${customAlert.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {customAlert.type === 'success' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
               </div>
               <h3 className="text-2xl font-black text-white mb-2">{customAlert.title}</h3>
               <p className="text-sm font-bold text-gray-400 mb-8 whitespace-pre-line leading-relaxed">{customAlert.msg}</p>
               <button onClick={() => customAlert.type === 'success' ? onClose() : setCustomAlert(null)} className={`w-full py-5 rounded-[2rem] text-white font-black text-lg active:scale-95 transition-all ${customAlert.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                 {customAlert.type === 'success' ? 'حسناً، إغلاق' : 'رجوع للتعديل'}
               </button>
            </div>
          </div>
        )}

        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 shrink-0"></div>

        <div className="flex justify-between items-start mb-8 shrink-0">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 p-1 overflow-hidden shadow-xl">
                 <img src={service.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-white leading-tight">{service.name}</h3>
                 <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1 flex items-center gap-1"><Zap size={10} className="fill-orange-500" /> تنفيذ فوري</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 pb-6">
           <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Info size={12} /> {isGame ? 'أدخل الآيدي (ID)' : 'أدخل رقم الهاتف للواتساب'}
                </label>
                {/* 🟢 زر اللصق السريع */}
                <button onClick={handlePaste} className="flex items-center gap-1 text-[10px] text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20 active:scale-95 transition-all">
                   <ClipboardPaste size={12} /> لصق
                </button>
              </div>
              
              {/* 🟢 حقل الإدخال الذكي: أرقام فقط وتحديد الحد الأقصى */}
              <input 
                type="tel" 
                maxLength={maxLength}
                value={input} 
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, maxLength); // تنظيف الحروف والسماح بالأرقام فقط
                  setInput(val);
                }} 
                placeholder={isGame ? "1234567890" : "7XXXXXXXX"} 
                className="w-full bg-[#121217] border border-white/5 p-6 rounded-[2rem] text-white font-black text-2xl text-center outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 tracking-[0.2em]" 
                dir="ltr"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] px-2">اختر الباقة المناسبة</label>
              <div className="grid grid-cols-1 gap-3">
                 {service.packages?.map((pkg) => {
                    const isSelected = selectedPkg?.id === pkg.id;
                    return (
                      <button key={pkg.id} onClick={() => setSelectedPkg(pkg)} className={`p-5 rounded-[2rem] border-2 flex justify-between items-center transition-all duration-300 relative overflow-hidden ${isSelected ? 'border-orange-500 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-white/5 bg-[#121217]'}`}>
                         <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-800'}`}>
                               {isSelected && <Check size={14} className="text-black" strokeWidth={4} />}
                            </div>
                            <span className={`font-black text-sm transition-colors ${isSelected ? 'text-white' : 'text-gray-500'}`}>{pkg.name}</span>
                         </div>
                         <div className="text-left relative z-10">
                            <span className={`text-xl font-black transition-colors ${isSelected ? 'text-orange-500' : 'text-white'}`}>{calculateFinalPrice(pkg.price)} <small className="text-[10px] opacity-40 mr-1">ر.ي</small></span>
                         </div>
                      </button>
                    );
                 })}
              </div>
           </div>
        </div>

        <div className="pt-6 shrink-0 border-t border-white/5 mt-2">
           <button onClick={handlePreConfirm} style={{ background: `linear-gradient(to left, ${settings?.primaryColor || '#FF8C00'}, #000)` }} className="w-full py-6 rounded-[2.5rem] text-white font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 group">
              متابعة عملية الشراء <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
           </button>
           <p className="text-[8px] text-center text-gray-700 font-black uppercase tracking-[0.4em] mt-5 flex items-center justify-center gap-2"><ShieldCheck size={10} /> سيتم تأكيد البيانات قبل الخصم</p>
        </div>

      </div>
    </div>
  );
}

