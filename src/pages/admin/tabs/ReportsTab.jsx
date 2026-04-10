import React, { useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Wallet, TrendingUp, BarChart3, PieChart,
  ArrowUpRight, Users, ShoppingBag,
  ArrowDownRight, Star, Clock, Activity, Gamepad2, Smartphone, ShieldCheck, Award
} from 'lucide-react';

export default function ReportsTab() {
  const { orders = [], users = [] } = useStore();

  const stats = useMemo(() => {
    // 1. فلترة وتجهيز البيانات
    const acceptedOrders = orders.filter(o => o.status === 'accepted');
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const rejectedOrders = orders.filter(o => o.status === 'rejected');
    
    // 2. حساب مبيعات اليوم (باستخدام الـ Timestamp لضمان الدقة 100%)
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const todaySales = acceptedOrders
      .filter(o => (o._ts || 0) >= startOfToday)
      .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    // 3. إجمالي الأرباح والمصادر
    const totalRevenue = acceptedOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const telecomRev = acceptedOrders
      .filter(o => o.serviceName?.includes('سداد') || o.serviceName?.includes('رصيد'))
      .reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const gamesRev = totalRevenue - telecomRev;

    // 4. إجمالي أرصدة العملاء (التزاماتك المالية)
    const customerBalances = users
      .filter(u => u.role === 'user')
      .reduce((sum, u) => sum + (Number(u.balance) || 0), 0);

    // 5. أفضل 4 عملاء من حيث الرصيد الحالي
    const topCustomers = [...users]
      .filter(u => u.role === 'user')
      .sort((a, b) => (Number(b.balance) || 0) - (Number(a.balance) || 0))
      .slice(0, 4);

    return {
      totalRevenue,
      todaySales,
      telecomRev,
      gamesRev,
      customerBalances,
      topCustomers,
      acceptedCount: acceptedOrders.length,
      pendingCount: pendingOrders.length,
      rejectedCount: rejectedOrders.length,
      totalCount: orders.length || 1,
      recentSales: acceptedOrders.slice(0, 10)
    };
  }, [orders, users]);

  // مكون الكرت المالي بتصميم فخم
  const FinCard = ({ title, value, icon: Icon, colorClass, shadowColor }) => (
    <div className={`bg-[#121217] p-7 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-500`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-[50px] opacity-10 rounded-full ${colorClass}`}></div>
      <div className="flex justify-between items-start relative z-10 mb-6">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${colorClass.replace('bg-', 'text-')}`}>
          <Icon size={24} />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</span>
          <div className="flex items-center gap-1 text-green-500 mt-1">
             <TrendingUp size={12} />
             <span className="text-[9px] font-black">مباشر</span>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-black text-white tracking-tighter">
          {value.toLocaleString()} <span className="text-xs font-bold text-gray-600">ر.ي</span>
        </h2>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32" dir="rtl">
      
      {/* القسم الأول: المبيعات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinCard title="إجمالي مبيعات المتجر" value={stats.totalRevenue} icon={TrendingUp} colorClass="bg-orange-500" />
        <FinCard title="مبيعات اليوم فقط" value={stats.todaySales} icon={BarChart3} colorClass="bg-green-500" />
        <FinCard title="أرصدة الزبائن الحالية" value={stats.customerBalances} icon={Wallet} colorClass="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* القسم الثاني: جدول أحدث العمليات الناجحة */}
        <div className="lg:col-span-2 bg-[#121217] rounded-[3rem] border border-white/5 shadow-2xl flex flex-col overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
             <h3 className="font-black text-xl flex items-center gap-3">
               <PieChart size={22} className="text-orange-500"/> تقرير آخر العمليات
             </h3>
             <span className="text-[10px] font-black text-gray-500 bg-black/40 px-4 py-2 rounded-full border border-white/5">أحدث 10 طلبات مقبولة</span>
          </div>

          <div className="p-6 overflow-y-auto max-h-[500px] custom-scrollbar">
            <div className="space-y-3">
               {stats.recentSales.map(o => (
                 <div key={o.id} className="flex justify-between items-center p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20">
                          {o.serviceName?.includes('سداد') ? <Smartphone size={18}/> : <Gamepad2 size={18}/>}
                       </div>
                       <div>
                          <p className="font-black text-sm text-white">{o.serviceName}</p>
                          <p className="text-[9px] text-gray-500 font-bold">{o.userName} • {o.date}</p>
                       </div>
                    </div>
                    <div className="text-left">
                       <p className="text-lg font-black text-white">+{Number(o.price).toLocaleString()}</p>
                       <p className="text-[8px] text-green-500 font-black uppercase">ناجحة ✅</p>
                    </div>
                 </div>
               ))}
               {stats.recentSales.length === 0 && <p className="text-center py-20 text-gray-600 font-bold">لا يوجد مبيعات مسجلة</p>}
            </div>
          </div>
        </div>

        {/* القسم الثالث: تحليل المصادر والعملاء */}
        <div className="space-y-8">
          
          {/* كرت مصادر الدخل */}
          <div className="bg-[#121217] p-8 rounded-[3rem] border border-white/5 shadow-xl relative overflow-hidden">
             <h3 className="font-black text-white mb-6 flex items-center gap-3">
               <Activity size={20} className="text-orange-500"/> تحليل المصادر
             </h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                   <span className="text-xs font-bold text-gray-400">الألعاب والبطائق</span>
                   <span className="text-sm font-black text-white">{stats.gamesRev.toLocaleString()} ر.ي</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                   <span className="text-xs font-bold text-gray-400">خدمات الاتصالات</span>
                   <span className="text-sm font-black text-white">{stats.telecomRev.toLocaleString()} ر.ي</span>
                </div>
             </div>
          </div>

          {/* كرت كبار العملاء */}
          <div className="bg-[#121217] p-8 rounded-[3rem] border border-white/5 shadow-xl">
             <h3 className="font-black text-white mb-6 flex items-center gap-3">
               <Award size={20} className="text-yellow-500"/> قائمة الـ VIP
             </h3>
             <div className="space-y-3">
                {stats.topCustomers.map((u, i) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-500'}`}>#{i+1}</span>
                       <span className="text-xs font-bold text-gray-300">{u.name}</span>
                    </div>
                    <span className="text-xs font-black text-green-500">{u.balance?.toLocaleString()}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* كرت نسب الإنجاز */}
          <div className="bg-[#121217] p-8 rounded-[3rem] border border-white/5 shadow-xl">
             <h3 className="font-black text-white mb-6 flex items-center gap-3">
               <Activity size={20} className="text-blue-500"/> حالة المتجر العامة
             </h3>
             <div className="space-y-5">
                {[
                  { label: 'طلبات ناجحة', count: stats.acceptedCount, color: 'bg-green-500' },
                  { label: 'طلبات معلقة', count: stats.pendingCount, color: 'bg-orange-500' },
                  { label: 'طلبات مرفوضة', count: stats.rejectedCount, color: 'bg-red-500' }
                ].map((item, idx) => {
                  const pct = ((item.count / stats.totalCount) * 100).toFixed(0);
                  return (
                    <div key={idx} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white">{pct}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                          <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

