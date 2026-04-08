import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { 
  Wallet, TrendingUp, BarChart3, PieChart, 
  ArrowUpRight, Users, ShoppingBag, 
  ArrowDownRight, Star, Clock, Activity // 🟢 أضفنا Activity هنا لإصلاح الخطأ
} from 'lucide-react';

export default function ReportsTab() {
  const { orders = [], users = [] } = useStore();

  // 🟢 1. الحسابات المالية (باستخدام قيم افتراضية لمنع الأخطاء)
  const customerUsers = (users || []).filter(u => u.role === 'user');
  const totalUserBalances = customerUsers.reduce((sum, u) => sum + (Number(u.balance) || 0), 0);
  
  const acceptedOrders = (orders || []).filter(o => o.status === 'accepted');
  const pendingOrders = (orders || []).filter(o => o.status === 'pending');
  const rejectedOrders = (orders || []).filter(o => o.status === 'rejected');
  
  // إجمالي المبيعات باليمني
  const totalRevenue = acceptedOrders.reduce((sum, o) => sum + (Number(o.yerPrice) || Number(o.price) || 0), 0);

  // مبيعات اليوم
  const todaySales = acceptedOrders.filter(o => {
    const today = new Date().toLocaleDateString('ar-SA').split(' ')[0];
    return o.date && o.date.includes(today);
  }).reduce((sum, o) => sum + (Number(o.yerPrice) || Number(o.price) || 0), 0);

  // 🟢 2. تحليل أفضل العملاء
  const topCustomers = [...customerUsers]
    .sort((a, b) => (Number(b.balance) || 0) - (Number(a.balance) || 0))
    .slice(0, 3);

  // مكوّن الكرت المالي
  const FinCard = ({ title, value, icon: Icon, color, subText, trend }) => (
    <div className="bg-[#121217] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 rounded-full ${color}`}></div>
      <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-4 ${color.replace('bg-', 'text-')}`}>
        <Icon size={28} />
      </div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h2 className="text-3xl font-black text-white tracking-tighter flex items-baseline gap-2">
        {value} <span className="text-xs font-bold opacity-30">ر.ي</span>
      </h2>
      <div className="mt-4 flex items-center gap-2">
        {trend === 'up' ? <ArrowUpRight size={14} className="text-green-500" /> : <Clock size={14} className="text-orange-500" />}
        <span className="text-[10px] font-bold text-gray-400">{subText}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20" dir="rtl">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinCard 
          title="إجمالي أرصدة الزبائن" 
          value={totalUserBalances.toLocaleString()} 
          icon={Wallet} 
          color="bg-blue-500" 
          subText="سيولة معلقة في المحافظ"
          trend="down"
        />
        <FinCard 
          title="إجمالي المبيعات" 
          value={totalRevenue.toLocaleString()} 
          icon={TrendingUp} 
          color="bg-[#FF8C00]" 
          subText={`${acceptedOrders.length} عملية ناجحة`}
          trend="up"
        />
        <FinCard 
          title="مبيعات اليوم" 
          value={todaySales.toLocaleString()} 
          icon={BarChart3} 
          color="bg-green-500" 
          subText="تحديث لحظي للسجل"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-[#121217] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
             <h3 className="font-black text-lg flex items-center gap-2 text-white">
               <PieChart size={20} className="text-[#FFD700]"/> سجل العمليات المنفذة
             </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
               {acceptedOrders.slice(0, 10).map(o => (
                 <div key={o.id} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-black/60 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <p className="font-black text-white text-sm group-hover:text-[#FF8C00] transition-colors">{o.serviceName}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{String(o.userName || 'زبون')} • {o.date}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-green-500 font-black text-lg">+{o.yerPrice || o.price}</span>
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">مكتمل</p>
                    </div>
                 </div>
               ))}
               {acceptedOrders.length === 0 && (
                 <div className="py-20 text-center opacity-20">
                   <BarChart3 size={48} className="mx-auto mb-4" />
                   <p className="font-black uppercase tracking-widest text-gray-400">لا توجد مبيعات مسجلة</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* كرت VIP */}
          <div className="bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
             <h3 className="font-black text-white mb-6 flex items-center gap-2 text-sm">
               <Star size={18} className="text-[#FFD700] fill-[#FFD700]/20"/> كبار المودعين (VIP)
             </h3>
             <div className="space-y-4">
               {topCustomers.map((u, i) => (
                 <div key={u.id} className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black text-gray-500">#{i + 1}</span>
                     <span className="text-xs font-black text-white">{u.name}</span>
                   </div>
                   <span className="text-xs font-black text-[#FFD700]">{u.balance} ر.ي</span>
                 </div>
               ))}
             </div>
          </div>

          {/* كرت الكفاءة - هنا تم إصلاح أيقونة Activity */}
          <div className="bg-[#121217] p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
             <h3 className="font-black text-white mb-6 flex items-center gap-2 text-sm">
               <Activity size={18} className="text-purple-500"/> تحليل كفاءة المتجر
             </h3>
             <div className="space-y-4">
               {[
                 { label: 'مكتمل', count: acceptedOrders.length, color: 'bg-green-500' },
                 { label: 'معلق', count: pendingOrders.length, color: 'bg-orange-500' },
                 { label: 'مرفوض', count: rejectedOrders.length, color: 'bg-red-500' }
               ].map((item, idx) => {
                 const total = orders.length || 1;
                 const percent = ((item.count / total) * 100).toFixed(0);
                 return (
                   <div key={idx} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className={item.color.replace('bg-', 'text-')}>{item.label} ({item.count})</span>
                       <span className="text-gray-500">{percent}%</span>
                     </div>
                     <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
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

