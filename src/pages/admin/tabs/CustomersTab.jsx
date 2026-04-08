import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  UserPlus, Trash2, X, Search, Lock,
  CreditCard, Phone, Copy, CheckCircle, 
  Wallet, MinusCircle, ArrowLeftRight, 
  Star, ShieldCheck, Edit, Users, TrendingUp
} from 'lucide-react';

export default function CustomersTab() {
  // 🟢 استدعينا updateUser من المخ
  const { users, addUser, deleteUser, updateUser, updateUserBalance, addNotification, toggleDistributor } = useStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCust, setNewCust] = useState({ name: '', phone: '', password: '' });
  const [copiedId, setCopiedId] = useState(null);

  const [balanceModal, setBalanceModal] = useState({ isOpen: false, type: '', user: null, amount: '' });
  
  // 🟢 حالة نافذة التعديل
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });

  const customerList = (users || []).filter(u =>
    u.role === 'user' && 
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone?.includes(searchQuery))
  );

  // إحصائيات سريعة
  const totalCustomers = customerList.length;
  const totalDistributors = customerList.filter(u => u.isDistributor).length;
  const totalBalance = customerList.reduce((sum, u) => sum + (u.balance || 0), 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone || !newCust.password) return alert("يرجى إكمال جميع البيانات!");
    addUser({ ...newCust, balance: 0, isDistributor: false }); 
    setNewCust({ name: '', phone: '', password: '' });
    setShowAddForm(false);
  };

  // 🟢 تنفيذ تعديل بيانات الزبون
  const handleEdit = (e) => {
    e.preventDefault();
    const { user } = editModal;
    if (!user.name || !user.phone || !user.password) return alert("لا تترك حقولاً فارغة!");
    
    updateUser(user.id, { name: user.name, phone: user.phone, password: user.password });
    setEditModal({ isOpen: false, user: null });
  };

  const executeBalanceUpdate = (e) => {
    e.preventDefault();
    const { type, user, amount } = balanceModal;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) return alert('الرجاء إدخال مبلغ صحيح!');
    if (type === 'deduct' && numAmount > (user.balance || 0)) return alert('المبلغ المراد خصمه أكبر من الرصيد!');

    const finalAmount = type === 'add' ? numAmount : -numAmount;
    updateUserBalance(user.id, finalAmount);

    if (addNotification) {
       const title = type === 'add' ? 'إيداع رصيد جديد 💰' : 'خصم من الرصيد 📉';
       const msg = type === 'add' 
          ? `تم إضافة مبلغ ${numAmount.toLocaleString()} ر.ي إلى محفظتك بنجاح.` 
          : `تم خصم مبلغ ${numAmount.toLocaleString()} ر.ي من محفظتك من قِبل الإدارة.`;
       addNotification(user.id, title, msg);
    }
    setBalanceModal({ isOpen: false, type: '', user: null, amount: '' });
  };

  const copyPassword = (password, id) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto" dir="rtl">
      
      {/* 🟢 نافذة تعديل الزبون */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-[#121217] border border-blue-500/30 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-blue-500/10 text-blue-500 border border-blue-500/20">
                 <Edit size={30} />
              </div>
              <h3 className="relative z-10 text-2xl font-black text-white mb-6 text-center">تعديل بيانات الزبون</h3>

              <form onSubmit={handleEdit} className="relative z-10 space-y-4">
                 <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">اسم الزبون</label>
                   <input type="text" value={editModal.user.name} onChange={e => setEditModal({ ...editModal, user: { ...editModal.user, name: e.target.value } })} className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500/50" />
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">الرقم (اليوزر)</label>
                   <input type="tel" value={editModal.user.phone} onChange={e => setEditModal({ ...editModal, user: { ...editModal.user, phone: e.target.value } })} className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500/50 text-left tracking-widest" dir="ltr" />
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">كلمة المرور</label>
                   <input type="text" value={editModal.user.password} onChange={e => setEditModal({ ...editModal, user: { ...editModal.user, password: e.target.value } })} className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500/50 text-left" dir="ltr" />
                 </div>

                 <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-[1.5rem] text-white font-black active:scale-95 transition-all shadow-lg shadow-blue-600/20">
                       حفظ التعديلات
                    </button>
                    <button type="button" onClick={() => setEditModal({ isOpen: false, user: null })} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] text-white font-black active:scale-95 transition-all">
                       إلغاء
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* نافذة الرصيد */}
      {balanceModal.isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
           <div className={`bg-[#121217] border p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center relative overflow-hidden animate-in zoom-in-95 ${balanceModal.type === 'add' ? 'border-green-500/30' : 'border-red-500/30'}`}>
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none ${balanceModal.type === 'add' ? 'bg-green-500/20' : 'bg-red-500/20'}`}></div>
              <div className={`relative z-10 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 border ${balanceModal.type === 'add' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                 {balanceModal.type === 'add' ? <CreditCard size={40} /> : <MinusCircle size={40} />}
              </div>
              <h3 className="relative z-10 text-2xl font-black text-white mb-1">{balanceModal.type === 'add' ? 'إضافة رصيد' : 'خصم رصيد'}</h3>
              <p className="relative z-10 text-sm font-bold text-gray-400 mb-6">الزبون: <span className="text-white">{balanceModal.user.name}</span></p>

              <form onSubmit={executeBalanceUpdate} className="relative z-10 space-y-6">
                 <div className="relative">
                    <input type="number" value={balanceModal.amount} onChange={(e) => setBalanceModal({...balanceModal, amount: e.target.value})} placeholder="المبلغ..." className={`w-full bg-black/50 border rounded-2xl p-5 text-2xl font-black text-center text-white outline-none transition-colors ${balanceModal.type === 'add' ? 'focus:border-green-500/50' : 'focus:border-red-500/50'}`} autoFocus />
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button type="submit" className={`flex-1 py-4 rounded-[1.5rem] text-white font-black active:scale-95 transition-all shadow-lg ${balanceModal.type === 'add' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>تأكيد</button>
                    <button type="button" onClick={() => setBalanceModal({isOpen: false, type: '', user: null, amount: ''})} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-[1.5rem] text-white font-black active:scale-95 transition-all">إلغاء</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* 🟢 1. شريط الإحصائيات الذكي */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#121217]/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-lg relative overflow-hidden">
           <div className="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
           <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20"><Users size={24}/></div>
           <div>
              <p className="text-[10px] font-black text-gray-500 uppercase">إجمالي العملاء</p>
              <h4 className="text-2xl font-black text-white">{totalCustomers}</h4>
           </div>
        </div>
        <div className="bg-[#121217]/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-lg relative overflow-hidden">
           <div className="absolute left-0 top-0 w-1 h-full bg-yellow-500"></div>
           <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20"><Star size={24}/></div>
           <div>
              <p className="text-[10px] font-black text-gray-500 uppercase">الموزعين (VIP)</p>
              <h4 className="text-2xl font-black text-white">{totalDistributors}</h4>
           </div>
        </div>
        <div className="bg-[#121217]/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-lg relative overflow-hidden">
           <div className="absolute left-0 top-0 w-1 h-full bg-green-500"></div>
           <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20"><TrendingUp size={24}/></div>
           <div>
              <p className="text-[10px] font-black text-gray-500 uppercase">إجمالي الأرصدة</p>
              <h4 className="text-xl font-black text-green-500">{totalBalance.toLocaleString()} <span className="text-[10px] text-gray-500">ر.ي</span></h4>
           </div>
        </div>
      </div>

      {/* 2. أدوات البحث العلوية */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#121217]/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] border border-white/5 shadow-xl relative z-10">
        <div className="flex items-center gap-3 bg-black/40 px-5 py-4 rounded-[1.5rem] border border-white/5 w-full md:w-96 focus-within:border-green-500/50 transition-all">
          <Search size={20} className="text-gray-500" />
          <input type="text" placeholder="بحث عن اسم أو رقم جوال..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none text-sm w-full text-white font-bold" />
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className={`px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 transition-all ${showAddForm ? 'bg-red-500/10 text-red-500' : 'bg-green-600 text-black hover:bg-green-500 shadow-green-600/20 shadow-lg'}`}>
          {showAddForm ? <X size={20}/> : <UserPlus size={20}/>} {showAddForm ? 'إلغاء' : 'إضافة زبون'}
        </button>
      </div>

      {/* 3. نموذج إضافة زبون */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-[#121217]/90 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-green-500/30 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-2xl animate-in zoom-in-95">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400">اسم الزبون</label>
            <input type="text" required value={newCust.name} onChange={e=>setNewCust({...newCust, name: e.target.value})} className="w-full bg-black/50 p-4 rounded-2xl outline-none border border-white/5 text-white focus:border-green-500/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400">رقم الهاتف</label>
            <input type="tel" required value={newCust.phone} onChange={e=>setNewCust({...newCust, phone: e.target.value})} className="w-full bg-black/50 p-4 rounded-2xl outline-none border border-white/5 text-white focus:border-green-500/50 text-left" dir="ltr" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400">كلمة المرور</label>
            <input type="text" required value={newCust.password} onChange={e=>setNewCust({...newCust, password: e.target.value})} className="w-full bg-black/50 p-4 rounded-2xl outline-none border border-white/5 text-white focus:border-green-500/50 text-left" dir="ltr" />
          </div>
          <button type="submit" className="md:col-span-3 py-4 mt-2 bg-green-600 text-black rounded-2xl font-black text-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">إنشاء الحساب</button>
        </form>
      )}

      {/* 4. قائمة الزبائن */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customerList.map((user) => (
          <div key={user.id} className={`bg-[#121217] rounded-[2.5rem] border hover:border-white/10 transition-all shadow-xl relative flex flex-col group overflow-hidden ${user.isDistributor ? 'border-yellow-500/30' : 'border-white/5'}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] rounded-full pointer-events-none transition-colors ${user.isDistributor ? 'bg-yellow-500/10' : 'bg-white/5 group-hover:bg-green-500/10'}`}></div>

            <div className="p-6 md:p-8 flex-1 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border shadow-inner ${user.isDistributor ? 'bg-gradient-to-br from-yellow-600 to-yellow-500 text-black border-yellow-400' : 'bg-white/5 text-white border-white/10'}`}>
                     {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg leading-tight mb-1.5 flex items-center gap-2">
                      {user.name} {user.isDistributor && <ShieldCheck size={16} className="text-yellow-500" />}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-black/40 px-3 py-1 rounded-full w-fit border border-white/5">
                       <Phone size={12} className="text-green-500"/> <span dir="ltr">{user.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button onClick={() => { if(window.confirm(user.isDistributor ? `إلغاء الموزع؟` : `ترقية لموزع؟`)) toggleDistributor(user.id); }} className={`p-2.5 rounded-xl border ${user.isDistributor ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-white/5 text-gray-500 border-white/5 hover:text-yellow-500'}`}>
                    <Star size={18} className={user.isDistributor ? 'fill-yellow-500' : ''}/>
                  </button>
                  {/* 🟢 زر التعديل الجديد */}
                  <button onClick={() => setEditModal({ isOpen: true, user: user })} className="p-2.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                    <Edit size={18}/>
                  </button>
                  <button onClick={() => { if(window.confirm(`حذف ${user.name}؟`)) deleteUser(user.id); }} className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center bg-black/40 p-4 rounded-[1.5rem] border border-white/5 mb-6 shadow-inner">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase"><Lock size={14}/> المرور:</div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-sm tracking-widest">{user.password}</span>
                  <button onClick={() => copyPassword(user.password, user.id)} className="text-gray-500 hover:text-white bg-white/5 p-1.5 rounded-lg transition-colors">
                    {copiedId === user.id ? <CheckCircle size={14} className="text-green-500"/> : <Copy size={14}/>}
                  </button>
                </div>
              </div>

              <div className="bg-black/60 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                <Wallet size={100} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">الرصيد المتاح</p>
                <div className="flex items-baseline gap-1 relative z-10">
                  <span className={`text-4xl font-black tracking-tighter ${(user.balance || 0) > 0 ? (user.isDistributor ? 'text-yellow-500' : 'text-green-500') : 'text-gray-500'}`}>
                     {(user.balance || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500">ر.ي</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-white/5 relative z-10 bg-black/20">
              <button onClick={() => setBalanceModal({ isOpen: true, type: 'add', user: user, amount: '' })} className="py-5 flex justify-center items-center gap-2 font-black text-[11px] text-green-500 hover:bg-green-500/10 border-l border-white/5">
                <CreditCard size={18}/> إيداع
              </button>
              <button onClick={() => setBalanceModal({ isOpen: true, type: 'deduct', user: user, amount: '' })} className="py-5 flex justify-center items-center gap-2 font-black text-[11px] text-red-500 hover:bg-red-500/10">
                <MinusCircle size={18}/> سحب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

