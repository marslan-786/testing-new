"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, DollarSign, Activity, AlertCircle, Search, LogIn, Ban, 
  Check, X, Eye, Menu, LogOut, Settings, BarChart, CreditCard, Layers 
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  
  // --- STATES ---
  const [activeTab, setActiveTab] = useState("users"); // users, withdraws, plans, stats
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Modals State
  const [rejectModal, setRejectModal] = useState({ show: false, id: null, type: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [viewModal, setViewModal] = useState(null); // For viewing details & Proof
  const [settingsModal, setSettingsModal] = useState(false); // Change Pass
  const [menuOpen, setMenuOpen] = useState(false);

  // Settings Form
  const [creds, setCreds] = useState({ username: "", password: "" });

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminAuth");
    if (!isAdmin) router.push("/admin/login");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) {
      console.error("Error fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  const handleLoginAsUser = (user) => {
    // User ka data localStorage mein daal kar main page par bhej do
    localStorage.setItem("user", JSON.stringify(user));
    toast.success(`Logged in as ${user.username}`);
    // New tab mein open karein taake admin panel band na ho
    window.open("/", "_blank"); 
  };

  const handleAction = async (type, id, action, reason = "") => {
    const toastId = toast.loading("Processing...");
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, action, reason }),
      });
      if (res.ok) {
        toast.success("Done!", { id: toastId });
        setRejectModal({ show: false, id: null, type: "" });
        setViewModal(null);
        setRejectReason("");
        fetchData(); // Refresh Data
      } else {
        toast.error("Failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Error", { id: toastId });
    }
  };

  const updateSettings = async () => {
      if(!creds.username || !creds.password) return toast.error("Fill all fields");
      const res = await fetch("/api/admin/settings", {
          method: "PUT", // PUT request for update
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ newUsername: creds.username, newPassword: creds.password })
      });
      if(res.ok) {
          toast.success("Admin Updated! Please login again.");
          localStorage.removeItem("adminAuth");
          router.push("/admin/login");
      }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center animate-pulse">Loading StoreX Admin...</div>;

  // Filter Users Logic
  const filteredUsers = data?.users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 relative">
      
      {/* --- TOP BAR --- */}
      <div className="bg-[#111] p-4 border-b border-white/10 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold text-red-600 tracking-wider">STOREX ADMIN</h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-white/10 rounded-full"><Menu className="text-white" /></button>
          
          {/* Dropdown Menu */}
          {menuOpen && (
              <div className="absolute top-14 right-4 bg-[#222] border border-white/10 rounded-xl shadow-2xl p-2 w-48 z-50 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => { setSettingsModal(true); setMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white/10 rounded flex items-center gap-2 text-sm text-gray-200"><Settings className="w-4 h-4"/> Settings</button>
                  <button onClick={() => { localStorage.removeItem("adminAuth"); router.push("/admin/login"); }} className="w-full text-left px-4 py-3 hover:bg-red-900/20 rounded flex items-center gap-2 text-red-400 text-sm"><LogOut className="w-4 h-4"/> Logout</button>
              </div>
          )}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-4">
        
        {/* TAB 1: ALL MEMBERS */}
        {activeTab === "users" && (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Total Users: <span className="text-blue-400">{data.stats.totalUsers}</span></h2>
                </div>
                
                {/* Search Bar */}
                <div className="bg-white/5 p-3 rounded-xl flex items-center gap-2 mb-4 border border-white/10 focus-within:border-blue-500/50 transition-colors">
                    <Search className="text-gray-400 w-5 h-5 ml-2" />
                    <input 
                        type="text" placeholder="Search by name, username or email..." 
                        className="bg-transparent w-full outline-none text-sm p-1 placeholder-gray-600"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    {filteredUsers.map(user => (
                        <div key={user._id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                            <div>
                                <h3 className="font-bold">{user.name}</h3>
                                <p className="text-xs text-gray-400">@{user.username}</p>
                                <p className="text-[10px] text-gray-500 mb-1">{user.email}</p>
                                <div className="flex gap-2">
                                    <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/20">Bal: {user.balance}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${user.plan.isActive ? 'bg-blue-900/30 text-blue-400 border-blue-500/20' : 'bg-red-900/30 text-red-400 border-red-500/20'}`}>
                                        {user.plan.isActive ? user.plan.planName : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleLoginAsUser(user)} className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 hover:bg-blue-600 hover:text-white transition"><LogIn className="w-3 h-3"/> Login</button>
                                <button className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 hover:bg-red-600 hover:text-white transition"><Ban className="w-3 h-3"/> Block</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* TAB 2: WITHDRAW REQUESTS */}
        {activeTab === "withdraws" && (
            <div>
                <h2 className="text-xl font-bold mb-4">Withdraw Requests</h2>
                <div className="space-y-3">
                    {data.withdrawRequests.map(req => (
                        <div key={req._id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between mb-3 border-b border-white/5 pb-2">
                                <h3 className="font-bold text-lg text-green-400 font-mono">Rs {req.amount}</h3>
                                <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs px-2 py-1 rounded">Pending</span>
                            </div>
                            <div className="text-xs mb-3 space-y-1">
                                <p className="flex justify-between"><span className="text-gray-500">Method:</span> <span className="text-white">{req.method}</span></p>
                                <p className="flex justify-between"><span className="text-gray-500">Account:</span> <span className="text-white font-mono">{req.accountNumber}</span></p>
                                <p className="flex justify-between"><span className="text-gray-500">Title:</span> <span className="text-white">{req.accountTitle}</span></p>
                                <p className="flex justify-between"><span className="text-gray-500">User ID:</span> <span className="text-gray-400 truncate w-32 text-right">{req.userId}</span></p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setViewModal({ type: 'withdraw', data: req })} className="flex-1 bg-gray-700 py-2 rounded text-xs font-bold hover:bg-gray-600">Details</button>
                                <button onClick={() => handleAction('withdraw', req._id, 'approve')} className="flex-1 bg-green-600 py-2 rounded text-xs font-bold hover:bg-green-500">Approve</button>
                                <button onClick={() => setRejectModal({ show: true, id: req._id, type: 'withdraw' })} className="flex-1 bg-red-600 py-2 rounded text-xs font-bold hover:bg-red-500">Decline</button>
                            </div>
                        </div>
                    ))}
                    {data.withdrawRequests.length === 0 && <div className="text-center text-gray-500 mt-20 flex flex-col items-center"><CheckCircle className="w-10 h-10 mb-2 opacity-20"/> No pending withdrawals</div>}
                </div>
            </div>
        )}

        {/* TAB 3: PLAN REQUESTS */}
        {activeTab === "plans" && (
            <div>
                <h2 className="text-xl font-bold mb-4">Plan Activations</h2>
                <div className="space-y-3">
                    {data.planRequests.map(req => (
                        <div key={req._id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between mb-3 border-b border-white/5 pb-2">
                                <h3 className="font-bold text-white">{req.planName}</h3>
                                <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">Rs {req.price}</span>
                            </div>
                            <div className="text-xs mb-3 space-y-1">
                                <p className="flex justify-between"><span className="text-gray-500">Username:</span> <span className="text-white">@{req.username}</span></p>
                                <p className="flex justify-between"><span className="text-gray-500">Trx ID:</span> <span className="text-yellow-400 font-mono">{req.trxId}</span></p>
                            </div>
                            <div className="flex gap-2">
                                {/* Proof Image Viewer */}
                                <button onClick={() => setViewModal({ type: 'plan', data: req })} className="flex-1 bg-gray-700 py-2 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-600"><Eye className="w-3 h-3"/> Proof</button>
                                <button onClick={() => handleAction('plan', req._id, 'approve')} className="flex-1 bg-green-600 py-2 rounded text-xs font-bold hover:bg-green-500">Approve</button>
                                <button onClick={() => setRejectModal({ show: true, id: req._id, type: 'plan' })} className="flex-1 bg-red-600 py-2 rounded text-xs font-bold hover:bg-red-500">Decline</button>
                            </div>
                        </div>
                    ))}
                    {data.planRequests.length === 0 && <div className="text-center text-gray-500 mt-20 flex flex-col items-center"><CheckCircle className="w-10 h-10 mb-2 opacity-20"/> No pending plan requests</div>}
                </div>
            </div>
        )}

        {/* TAB 4: TOTAL DATA (Stats) */}
        {activeTab === "stats" && (
            <div>
                <h2 className="text-xl font-bold mb-6">System Statistics</h2>
                <div className="grid grid-cols-1 gap-4">
                    <StatBox title="Total Members" value={data.stats.totalUsers} icon={Users} color="bg-blue-600" />
                    <StatBox title="Total Withdraw Given" value={`Rs ${data.stats.totalWithdrawn}`} icon={CreditCard} color="bg-orange-600" />
                    <StatBox title="Total Investment" value={`Rs ${data.stats.totalInvestment}`} icon={DollarSign} color="bg-green-600" />
                    <StatBox title="All User Balance" value={`Rs ${data.stats.totalUserBalance}`} icon={Activity} color="bg-purple-600" desc="Liability (Users ke accounts mein mojood paisa)" />
                </div>
            </div>
        )}

      </div>

      {/* --- BOTTOM NAVIGATION (Fixed) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#151515] border-t border-white/10 p-3 z-40 pb-safe">
        <div className="flex justify-around items-center max-w-md mx-auto">
            <NavBtn active={activeTab==='users'} onClick={()=>setActiveTab('users')} icon={Users} label="Users" count={null} />
            <NavBtn active={activeTab==='withdraws'} onClick={()=>setActiveTab('withdraws')} icon={CreditCard} label="Withdraw" count={data.withdrawRequests.length} />
            <NavBtn active={activeTab==='plans'} onClick={()=>setActiveTab('plans')} icon={Layers} label="Plans" count={data.planRequests.length} />
            <NavBtn active={activeTab==='stats'} onClick={()=>setActiveTab('stats')} icon={BarChart} label="Data" count={null} />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      
      {/* 1. REJECT MODAL */}
      {rejectModal.show && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-6 backdrop-blur-sm">
              <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/20 shadow-2xl animate-in zoom-in-95">
                  <h3 className="font-bold mb-2 text-red-500 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Decline Request</h3>
                  <textarea className="w-full bg-black/50 p-3 rounded-xl border border-white/10 text-white mb-4 text-sm focus:border-red-500 outline-none" rows="3" placeholder="Reason (e.g. Invalid TrxID)" onChange={(e)=>setRejectReason(e.target.value)}></textarea>
                  <div className="flex gap-2">
                      <button onClick={()=>setRejectModal({show:false})} className="flex-1 bg-gray-700 py-3 rounded-xl text-sm font-bold">Cancel</button>
                      <button onClick={()=>handleAction(rejectModal.type, rejectModal.id, 'reject', rejectReason)} className="flex-1 bg-red-600 py-3 rounded-xl text-sm font-bold">Confirm</button>
                  </div>
              </div>
          </div>
      )}

      {/* 2. VIEW DETAILS / PROOF MODAL (FIXED IMAGE) */}
      {viewModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
              <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/20 relative shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                  <button onClick={()=>setViewModal(null)} className="absolute top-4 right-4 bg-white/10 p-1 rounded-full"><X className="w-4 h-4"/></button>
                  <h3 className="font-bold mb-4 text-xl capitalize flex items-center gap-2">
                      {viewModal.type} Details
                  </h3>
                  
                  <div className="space-y-3 text-sm bg-black/30 p-4 rounded-xl border border-white/5">
                      <p className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-400">User:</span> <span className="text-white font-bold">{viewModal.data.username}</span></p>
                      <p className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-400">Email:</span> <span className="text-white text-xs truncate w-32">{viewModal.data.userId}</span></p>
                      
                      {viewModal.type === 'withdraw' ? (
                          <>
                            <p className="flex justify-between"><span className="text-gray-400">Bank:</span> <span className="text-blue-400">{viewModal.data.method}</span></p>
                            <p className="flex justify-between"><span className="text-gray-400">Account:</span> <span className="text-white font-mono select-all">{viewModal.data.accountNumber}</span></p>
                            <p className="flex justify-between"><span className="text-gray-400">Title:</span> <span className="text-white">{viewModal.data.accountTitle}</span></p>
                            <div className="bg-green-900/20 p-3 rounded-lg text-center mt-2 border border-green-500/20">
                                <p className="text-gray-400 text-xs">Total Amount</p>
                                <p className="text-2xl font-bold text-green-400">Rs {viewModal.data.amount}</p>
                            </div>
                          </>
                      ) : (
                          <>
                            <p className="flex justify-between"><span className="text-gray-400">Plan:</span> <span className="text-white">{viewModal.data.planName}</span></p>
                            <p className="flex justify-between"><span className="text-gray-400">Price:</span> <span className="text-green-400">Rs {viewModal.data.price}</span></p>
                            <p className="flex justify-between"><span className="text-gray-400">TrxID:</span> <span className="text-yellow-400 font-mono select-all">{viewModal.data.trxId}</span></p>
                            
                            {/* --- IMAGE FIX --- */}
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Payment Screenshot:</p>
                                <div className="rounded-lg overflow-hidden border-2 border-white/10 bg-black">
                                    {viewModal.data.screenshot ? (
                                        <img src={viewModal.data.screenshot} alt="Proof" className="w-full h-auto object-contain" />
                                    ) : (
                                        <div className="h-20 flex items-center justify-center text-gray-600 text-xs">No Image Uploaded</div>
                                    )}
                                </div>
                            </div>
                          </>
                      )}
                  </div>
                  
                  <button onClick={()=>handleLoginAsUser({ username: viewModal.data.username, email: viewModal.data.userId })} className="w-full mt-4 bg-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors">
                      <LogIn className="w-4 h-4"/> Login to User Account
                  </button>
              </div>
          </div>
      )}

      {/* 3. SETTINGS MODAL */}
      {settingsModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-6 backdrop-blur-sm">
              <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/20 shadow-2xl animate-in zoom-in-95">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5"/> Admin Settings</h3>
                  <input type="text" placeholder="New Username" className="w-full bg-black/50 p-3 rounded-xl mb-3 border border-white/10 outline-none focus:border-green-500" onChange={(e)=>setCreds({...creds, username: e.target.value})} />
                  <input type="text" placeholder="New Password" className="w-full bg-black/50 p-3 rounded-xl mb-4 border border-white/10 outline-none focus:border-green-500" onChange={(e)=>setCreds({...creds, password: e.target.value})} />
                  <div className="flex gap-2">
                      <button onClick={()=>setSettingsModal(false)} className="flex-1 bg-gray-700 py-3 rounded-xl font-bold text-sm">Cancel</button>
                      <button onClick={updateSettings} className="flex-1 bg-green-600 py-3 rounded-xl font-bold text-sm">Update Credentials</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

// --- SUB COMPONENTS ---

function NavBtn({ active, onClick, icon: Icon, label, count }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-1 relative p-2 transition-all ${active ? 'text-red-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <Icon className={`w-6 h-6 ${active ? 'fill-current/20' : ''}`} />
            <span className="text-[10px] font-bold">{label}</span>
            {count && count > 0 && <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full border-2 border-black font-mono">{count}</span>}
        </button>
    )
}

function StatBox({ title, value, icon: Icon, color, desc }) {
    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold font-mono">{value}</p>
                {desc && <p className="text-[10px] text-gray-500 mt-1">{desc}</p>}
            </div>
        </div>
    )
}
