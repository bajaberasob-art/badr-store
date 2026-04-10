import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import { 
  UserPlus, Trash2, X, Search, Lock, 
  CreditCard, Phone, Copy, CheckCircle, 
  Wallet, MinusCircle, Star, ShieldCheck, 
  Edit, Users, TrendingUp, UserCog, ShieldAlert 
} from 'lucide-react';

export default function CustomersTab() {
  const { users = [], addUser, deleteUser, updateUser, updateUserBalance, addNotification, toggleDistributor } = useStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCust, setNewCust] = useState({ name: '', phone: '', password: '' });
  const [copiedId, setCopiedId] = useState(null);
  const [balanceModal, setBalanceModal] = useState({ isOpen: false, type: '', user: null, amount: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });

  // 🟢 فلترة العملاء والمساعدين (استبعاد المدير فقط)
  const filteredList = useMemo(() => {
    return (users || []).filter(u => 
      (u.role === 'user' || u.role === 'assistant') &&
      (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone?.includes(searchQuery))
    );
  }, [users, searchQuery]);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const list = users.filter(u => u.role === 'user' || u.role === 'assistant');
    return {
      total: list.length,
      distributors: list.filter(u => u.isDistributor).length,
      assistants: list.filter(u => u.role === 'assistant').length,
      balance: list.reduce((sum, u) => sum + (Number(u.balance) || 0), 0)
    };
  }, [users]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone || !newCust.password) return alert("يرجى إكمال جميع البيانات!");
    addUser({ ...newCust, role: 'user', balance: 0, isDistributor: false });
    setNewCust({ name: '', phone: '', password: '' });
    setShowAddForm(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const { user } = editModal;
    updateUser(user.id, { name: user.name, phone: user.phone, password: user.password });
    setEditModal({ isOpen: false, user: null });
  };

  const toggleAssistantRole = (user) => {
    const newRole = user.role === 'assistant' ? 'user' : 'assistant';
    const confirmMsg = newRole === 'assistant' 
      ? `هل تريد ترقية ${user.name} لمساعد إدارة؟ سيتمكن من دخول لوحة التحكم!` 
      : `هل تريد إلغاء صلاحيات المساعد عن ${user.name}؟`;
    
    if (window.confirm(confirmMsg)) {
      updateUser(user.id, { role: newRole });
      addNotification(user.id, 'تحديث الرتبة 🎖️', `تم تغيير رتبتك في النظام إلى: ${newRole === 'assistant' ? 'مساعد إدارة' : 'زبون'}`);
    }
  };

  const executeBalanceUpdate = (e) => {
    e.preventDefault();
    const { type, user, amount } = balanceModal;
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return alert('الرجاء إدخال مبلغ صحيح!');
    
    const finalAmount = type === 'add' ? numAmount : -numAmount;
    updateUserBalance(user.id, finalAmount);
    
    const title = type === 'add' ? 'إيداع رصيد جديد 💰' : 'خصم من الرصيد 📉';
    const msg = type === 'add' 
      ? `تم إضافة مبلغ ${numAmount.toLocaleString()} ر.ي إلى محفظتك بنجاح.` 
      : `تم خصم مبلغ ${numAmount.toLocaleString()} ر.ي من محفظتك.`;
    addNotification(user.id, title, msg);
    
    setBalanceModal({ isOpen: false, type: '', user: null, amount: '' });
  };

  const copyPassword = (password, id) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto" dir="rtl">
      
      {/* نافذة التعديل */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-blue-500/30 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative">
            <h3 className="text-2xl font-black text-white mb-6 text-center">تعديل البيانات</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <input type="text" value={editModal.user.name} onChange={e => setEditModal({...editModal, user: {...editModal.user, name: e.target.value}})} className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none" placeholder="الاسم" />
              <input type="tel" value={editModal.user.phone} onChange={e => setEditModal({...editModal, user: {...editModal.user, phone: e.target.value}})} className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none text-left" dir="ltr" />
              <input type="text" value={editModal.user.password} onChange={e => setEditModal({...editModal, user: {...editModal.user, password: e.target.value}})} className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none text-left" dir="ltr" />
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-4 bg-blue-600 rounded-2xl text-white font-black">حفظ</button>
                <button type="button" onClick={() => setEditModal({isOpen: false, user: null})} className="flex-1 py-4 bg-white/5 rounded-2xl text-white font-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة الرصيد */}
      {balanceModal.isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`bg-[#121217] border p-8 rounded-[2.5rem] w-full max-w-md text-center ${balanceModal.type === 'add' ? 'border-green-500/30' : 'border-red-500/30'}`}>
            <h3 className="text-2xl font-black text-white mb-6">{balanceModal.type === 'add' ? 'إيداع رصيد' : 'سحب رصيد'}</h3>
            <input type="number" value={balanceModal.amount} onChange={(e) => setBalanceModal({...balanceModal, amount: e.target.value})} placeholder="المبلغ..." className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-2xl font-black text-center text-white outline-none mb-6" autoFocus />
            <div className="flex gap-3">
              <button onClick={executeBalanceUpdate} className={`flex-1 py-4 rounded-2xl text-white font-black ${balanceModal.type === 'add' ? 'bg-green-600' : 'bg-red-600'}`}>تأكيد</button>
              <button onClick={() => setBalanceModal({isOpen: false, type: '', user: null, amount: ''})} className="flex-1 py-4 bg-white/5 rounded-2xl text-white font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 1. شريط الإحصائيات (محدث ليعرض المساعدين) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121217] p-5 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-lg">
           <div className="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
           <Users size={20} className="text-blue-500 mb-2"/>
           <p className="text-[10px] font-black text-gray-500 uppercase">الزبائن</p>
           <h4 className="text-xl font-black text-white">{stats.total}</h4>
        </div>
        <div className="bg-[#121217] p-5 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-lg">
           <div className="absolute left-0 top-0 w-1 h-full bg-cyan-400"></div>
           <ShieldCheck size={20} className="text-cyan-400 mb-2"/>
           <p className="text-[10px] font-black text-gray-500 uppercase">المساعدين</p>
           <h4 className="text-xl font-black text-white">{stats.assistants}</h4>
        </div>
        <div className="bg-[#121217] p-5 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-lg">
           <div className="absolute left-0 top-0 w-1 h-full bg-yellow-500"></div>
           <Star size={20} className="text-yellow-500 mb-2"/>
           <p className="text-[10px] font-black text-gray-500 uppercase">الموزعين</p>
           <h4 className="text-xl font-black text-white">{stats.distributors}</h4>
        </div>
        <div className="bg-[#121217] p-5 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-lg">
           <div className="absolute left-0 top-0 w-1 h-full bg-green-500"></div>
           <TrendingUp size={20} className="text-green-500 mb-2"/>
           <p className="text-[10px] font-black text-gray-500 uppercase">الأرصدة</p>
           <h4 className="text-lg font-black text-green-500">{stats.balance.toLocaleString()}</h4>
        </div>
      </div>

      {/* 2. أدوات البحث والإضافة */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#121217] p-5 rounded-[2rem] border border-white/5 shadow-xl relative z-10">
        <div className="flex items-center gap-3 bg-black/40 px-5 py-3.5 rounded-2xl border border-white/5 w-full md:w-96">
          <Search size={18} className="text-gray-500" />
          <input type="text" placeholder="بحث بالاسم أو الرقم..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none text-sm w-full text-white font-bold" />
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${showAddForm ? 'bg-red-500/10 text-red-500' : 'bg-green-600 text-black shadow-lg shadow-green-600/10'}`}>
          {showAddForm ? <X size={20}/> : <UserPlus size={20}/>} {showAddForm ? 'إلغاء' : 'إضافة زبون'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-[#121217] p-8 rounded-[2.5rem] border border-green-500/20 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in zoom-in-95 shadow-2xl">
          <input type="text" required placeholder="اسم الزبون" value={newCust.name} onChange={e=>setNewCust({...newCust, name: e.target.value})} className="bg-black/50 p-4 rounded-2xl border border-white/5 text-white text-sm font-bold" />
          <input type="tel" required placeholder="رقم الهاتف" value={newCust.phone} onChange={e=>setNewCust({...newCust, phone: e.target.value})} className="bg-black/50 p-4 rounded-2xl border border-white/5 text-white text-sm font-bold text-left" dir="ltr" />
          <input type="text" required placeholder="كلمة المرور" value={newCust.password} onChange={e=>setNewCust({...newCust, password: e.target.value})} className="bg-black/50 p-4 rounded-2xl border border-white/5 text-white text-sm font-bold text-left" dir="ltr" />
          <button type="submit" className="md:col-span-3 py-4 bg-green-600 text-black rounded-2xl font-black shadow-lg">إنشاء الحساب فوراً</button>
        </form>
      )}

      {/* 3. القائمة (محدثة لتشمل المساعدين) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredList.map((user) => (
          <div key={user.id} className={`bg-[#0d0d0f] rounded-[2.5rem] border hover:border-white/10 transition-all shadow-xl relative overflow-hidden group ${user.role === 'assistant' ? 'border-cyan-500/40' : user.isDistributor ? 'border-yellow-500/30' : 'border-white/5'}`}>
            
            <div className="p-7 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border shadow-inner ${user.role === 'assistant' ? 'bg-cyan-500 text-black border-cyan-300' : user.isDistributor ? 'bg-yellow-500 text-black border-yellow-300' : 'bg-white/5 text-white border-white/10'}`}>
                     {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm leading-tight mb-1.5 flex items-center gap-2">
                      {user.name} 
                      {user.role === 'assistant' && <ShieldAlert size={14} className="text-cyan-400" />}
                      {user.isDistributor && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                    </h4>
                    <span className="text-[9px] font-black text-gray-500 uppercase bg-white/5 px-2.5 py-1 rounded-full border border-white/5 tracking-widest">{user.role === 'assistant' ? 'مساعد إدارة' : user.isDistributor ? 'موزع VIP' : 'زبون متجر'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* 🟢 ميزة الترقية لمساعد */}
                  <button onClick={() => toggleAssistantRole(user)} className={`p-2.5 rounded-xl border transition-all ${user.role === 'assistant' ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-gray-600 border-white/5 hover:text-cyan-400'}`}>
                    <UserCog size={18} />
                  </button>
                  <button onClick={() => { if(window.confirm(`تغيير حالة الموزع؟`)) toggleDistributor(user.id); }} className={`p-2.5 rounded-xl border transition-all ${user.isDistributor ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 'bg-white/5 text-gray-600 border-white/5 hover:text-yellow-400'}`}>
                    <Star size={18} className={user.isDistributor ? 'fill-yellow-500' : ''}/>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center bg-black/40 p-3.5 rounded-2xl border border-white/5 mb-5 group-hover:border-white/10 transition-all">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-600 uppercase">اليوزر / الرقم</span>
                  <span className="text-xs font-bold text-gray-300 tracking-wider" dir="ltr">{user.phone}</span>
                </div>
                <button onClick={() => copyPassword(user.password, user.id)} className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-gray-600 uppercase">كلمة السر</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">{user.password}</span>
                    {copiedId === user.id ? <CheckCircle size={12} className="text-green-500"/> : <Copy size={12} className="text-gray-600"/>}
                  </div>
                </button>
              </div>

              <div className="bg-black/60 p-6 rounded-[1.5rem] border border-white/5 text-center relative overflow-hidden group-hover:bg-black/80 transition-all">
                <p className="text-[9px] text-gray-500 font-black uppercase mb-1">الرصيد المتوفر</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-3xl font-black tracking-tighter ${user.balance > 0 ? (user.role === 'assistant' ? 'text-cyan-400' : 'text-green-500') : 'text-gray-600'}`}>
                    {(user.balance || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-600">ر.ي</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-white/5 bg-black/20">
              <button onClick={() => setBalanceModal({ isOpen: true, type: 'add', user: user, amount: '' })} className="py-4 flex justify-center items-center gap-2 font-black text-[10px] text-green-500 hover:bg-green-500/10 border-l border-white/5">
                <CreditCard size={14}/> إيداع
              </button>
              <button onClick={() => setBalanceModal({ isOpen: true, type: 'deduct', user: user, amount: '' })} className="py-4 flex justify-center items-center gap-2 font-black text-[10px] text-red-500 hover:bg-red-500/10 border-l border-white/5">
                <MinusCircle size={14}/> سحب
              </button>
              <button onClick={() => setEditModal({ isOpen: true, user: user })} className="py-4 flex justify-center items-center gap-2 font-black text-[10px] text-blue-400 hover:bg-blue-400/10">
                <Edit size={14}/> تعديل
              </button>
            </div>

            {/* زر الحذف السريع في الزاوية */}
            <button onClick={() => { if(window.confirm(`حذف المستخدم نهائياً؟`)) deleteUser(user.id); }} className="absolute bottom-[70px] right-6 p-2 text-gray-800 hover:text-red-500 transition-colors">
               <Trash2 size={16}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

