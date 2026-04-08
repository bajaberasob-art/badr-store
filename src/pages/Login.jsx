import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, MessageCircle, UserPlus, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login, settings } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    if (result && result.success) {
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.msg || 'بيانات الدخول غير صحيحة');
    }
  };

  const themeColor = settings?.primaryColor || '#FF8C00';

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      
      {/* خلفية نيون متحركة (تأثير بصري فخم) */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[150px] opacity-20 rounded-full animate-pulse" 
        style={{ backgroundColor: themeColor }}
      ></div>
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] opacity-10 rounded-full" 
        style={{ backgroundColor: themeColor }}
      ></div>

      <div className="w-full max-w-sm z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
        
        {/* اللوجو دائري - تم تكبيره وإزالة الفراغات */}
        <div className="relative group">
           <div className="absolute inset-0 bg-white blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
           <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative z-10 border-4 border-white/10">
              {settings?.storeLogo ? (
                <img 
                  src={settings.storeLogo} 
                  className="w-full h-full object-cover" // تم تغييرها لـ cover لملء الدائرة بالكامل
                  alt="Store Logo" 
                />
              ) : (
                <div className="text-black font-black text-3xl">BADR</div>
              )}
           </div>
        </div>

        {/* اسم المتجر وعبارة الترحيب المربوطة بالإدارة */}
        <h1 className="text-4xl font-black text-white tracking-tight mb-2 text-center uppercase">
          {settings?.appName || 'BADR-STORE'}
        </h1>
        <p className="text-orange-500 font-black text-sm mb-8 tracking-[0.2em] bg-orange-500/10 px-6 py-1.5 rounded-full border border-orange-500/20">
          {settings?.loginMessage || 'أهلاً بكم في عالم التميز'} {/* 🟢 هنا الربط مع الإدارة */}
        </p>

        {/* صندوق الدخول */}
        <div className="w-full bg-[#0d0d0f]/80 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-2xl text-[10px] font-black text-center animate-bounce">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute right-5 top-5 text-gray-600 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="اسم المستخدم / الهاتف" 
                  value={username} 
                  onChange={e=>setUsername(e.target.value)} 
                  className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 pr-14 pl-5 text-white font-bold outline-none focus:border-white/20 focus:bg-black/60 transition-all placeholder:text-gray-700" 
                />
              </div>
              
              <div className="relative group">
                <Lock className="absolute right-5 top-5 text-gray-600 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 pr-14 pl-5 text-white font-bold outline-none focus:border-white/20 focus:bg-black/60 transition-all placeholder:text-gray-700" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{ background: `linear-gradient(to left, ${themeColor}, #000)` }} 
              className="w-full py-5 rounded-[1.5rem] text-white font-black text-lg shadow-2xl shadow-orange-500/10 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              دخول الحساب <LogIn size={22} className="group-hover:translate-x-[-5px] transition-transform" />
            </button>
          </form>
        </div>

        {/* الروابط السفلية */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="flex items-center gap-2 opacity-50">
             <div className="h-px w-8 bg-gray-600"></div>
             <span className="text-gray-500 font-bold text-[10px]">ليس لديك حساب؟</span>
             <div className="h-px w-8 bg-gray-600"></div>
          </div>
          
          <button 
            onClick={()=>window.open(`https://wa.me/${settings?.whatsapp}`)} 
            className="group flex items-center gap-3 bg-white/[0.03] hover:bg-green-500/10 text-gray-400 hover:text-green-500 px-8 py-4 rounded-2xl border border-white/5 hover:border-green-500/20 transition-all active:scale-95 shadow-xl"
          >
            <div className="p-2 bg-green-500/10 rounded-xl group-hover:bg-green-500 group-hover:text-black transition-all">
              <MessageCircle size={20}/>
            </div>
            <span className="font-black text-xs">تواصل مع الإدارة لفتح حساب</span>
          </button>
        </div>

        {/* لمسة تقنية في الأسفل */}
        <div className="mt-12 flex items-center gap-2 text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">
           <ShieldCheck size={10} /> Powered by Badr Tech 2026
        </div>
      </div>
    </div>
  );
}

