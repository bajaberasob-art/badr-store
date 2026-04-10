import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, MessageCircle, Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react';

export default function Login() {
  const { login, settings } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // محاكاة تأخير بسيط للفخامة ولضمان معالجة البيانات
    setTimeout(() => {
      const result = login(username, password);
      if (result && result.success) {
        // توجيه ذكي: المدير والمساعد يروحون للوحة التحكم، الزبون للرئيسية
        if (result.role === 'admin' || result.role === 'assistant') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(result.msg || 'بيانات الدخول غير صحيحة');
        setLoading(false);
      }
    }, 800);
  };

  const themeColor = settings?.primaryColor || '#FF8C00';

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden" dir="rtl">

      {/* خلفية نيون احترافية */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[120px] opacity-20 rounded-full animate-pulse"
        style={{ backgroundColor: themeColor }}
      ></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[150px] opacity-10 rounded-full"
        style={{ backgroundColor: themeColor }}
      ></div>

      <div className="w-full max-w-sm z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">

        {/* اللوجو الدائري الفخم */}
        <div className="relative group mb-8">
           <div className="absolute inset-0 bg-white blur-2xl opacity-10 group-hover:opacity-30 transition-opacity rounded-full"></div>
           <div className="w-32 h-32 rounded-full bg-[#0d0d0f] flex items-center justify-center shadow-2xl overflow-hidden relative z-10 border-2 border-white/5">
              {settings?.storeLogo ? (
                <img src={settings.storeLogo} className="w-full h-full object-cover" alt="Store Logo" />
              ) : (
                <div className="text-white font-black text-3xl tracking-tighter">BADR</div>
              )}
           </div>
           <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#050505] z-20"></div>
        </div>

        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 text-center uppercase">
          {settings?.appName || 'BADR-STORE'}
        </h1>
        
        <p className="text-orange-500 font-black text-[10px] mb-10 tracking-[0.3em] uppercase bg-orange-500/10 px-5 py-2 rounded-full border border-orange-500/20 flex items-center gap-2">
          <Zap size={12} fill="currentColor"/> {settings?.loginMessage || 'أهلاً بك في عالم التميز'}
        </p>

        {/* صندوق الدخول الزجاجي */}
        <div className="w-full bg-[#0d0d0f]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-black text-center animate-in shake duration-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* حقل اليوزر */}
              <div className="relative group">
                <User className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  placeholder="اسم المستخدم أو الهاتف"
                  value={username}
                  onChange={e=>setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pr-14 pl-5 text-white font-bold outline-none focus:border-orange-500/50 focus:bg-black/60 transition-all placeholder:text-gray-700 text-sm"
                />
              </div>

              {/* حقل الباسورد مع خيار العين */}
              <div className="relative group">
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pr-14 pl-14 text-white font-bold outline-none focus:border-orange-500/50 focus:bg-black/60 transition-all placeholder:text-gray-700 text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group overflow-hidden relative ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              style={{ background: `linear-gradient(135deg, ${themeColor}, #000)` }}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>دخول الحساب</span>
                  <LogIn size={22} className="group-hover:translate-x-[-5px] transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* الروابط السفلية للدعم */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 opacity-30">
             <div className="h-px w-10 bg-gray-600"></div>
             <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">ليس لديك حساب؟</span>
             <div className="h-px w-10 bg-gray-600"></div>
          </div>
          
          <button
            onClick={()=>window.open(`https://wa.me/${settings?.whatsapp}`)}
            className="flex items-center gap-3 bg-white/5 hover:bg-green-500/10 text-gray-400 hover:text-green-500 px-10 py-4 rounded-2xl border border-white/5 hover:border-green-500/20 transition-all active:scale-95"
          >
            <MessageCircle size={20} className="text-green-500" />
            <span className="font-black text-xs">تواصل مع الإدارة لفتح حساب</span>
          </button>
        </div>

        {/* تذييل تقني */}
        <div className="mt-16 flex items-center gap-2 text-[8px] font-black text-gray-700 uppercase tracking-[0.4em] opacity-50">
           <ShieldCheck size={10} /> Powered by Badr Tech 2026
        </div>
      </div>
    </div>
  );
}

