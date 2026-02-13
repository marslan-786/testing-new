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
  
  // Tabs: 'users', 'withdraws', 'plans', 'stats'
  const [activeTab, setActiveTab] = useState("users"); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [rejectModal, setRejectModal] = useState({ show: false, id: null, type: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [viewModal, setViewModal] = useState(null); // For viewing details
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
      console.error("Error");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  const handleLoginAsUser = (user) => {
    // Ye user object localStorage mein save karega aur wahan redirect karega
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
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ newUsername: creds.username, newPassword: creds.password })
      });
      if(res.ok) {
          toast.success("Admin Updated! Please login again.");
          localStorage.removeItem("adminAuth");
          router.push("/admin/login");
      }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Admin Panel...</div>;

  // Filter Users Search
  const filteredUsers = data.users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 relative">
      
      {/* --- TOP BAR --- */}
      <div className="bg-[#111] p-4 border-b border-white/10 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold text-red-500">STOREX ADMIN</h1>
          <button onClick={() => setMenuOpen(!menuOpen)}><Menu className="text-white" /></button>
          
          {/* Dropdown Menu */}
          {menuOpen && (
              <div className="absolute top-14 right-4 bg-[#222] border border-white/10 rounded-xl shadow-2xl p-2 w-48 z-50">
                  <button onClick={() => setSettingsModal(true)} className="w-full text-left px-4 py-2 hover:bg-white/10 rounded flex items-center gap-2 text-sm"><Settings className="w-4 h-4"/> Settings</button>
                  <button onClick={() => { localStorage.removeItem("adminAuth"); router.push("/admin/login"); }} className="w-full text-left px-4 py-2 hover:bg-white/10 rounded flex items-center gap-2 text-red-400 text-sm"><LogOut className="w-4 h-4"/> Logout</button>
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
                <div className="bg-white/5 p-2 rounded-xl flex items-center gap-2 mb-4 border border-white/10">
                    <Search className="text-gray-400 w-5 h-5 ml-2" />
                    <input 
                        type="text" placeholder="Search by name, username, email..." 
                        className="bg-transparent w-full outline-none text-sm p-1"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    {filteredUsers.map(user => (
                        <div key={user._id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{user.name}</h3>
                                <p className="text-xs text-gray-400">@{user.username}</p>
                                <p className="text-[10px] text-gray-500">{user.email}</p>
                                <div className="mt-1 flex gap-2">
                                    <span className="text-xs bg-green-900 text-green-400 px-1 rounded">Bal: {user.balance}</span>
                                    <span className={`text-xs px-1 rounded ${user.plan.isActive ? 'bg-blue-900 text-blue-400' : 'bg-red-900 text-red-400'}`}>
                                        {user.plan.isActive ? user.plan.planName : "No Plan"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleLoginAsUser(user)} className="bg-blue-600 px-3 py-1 rounded text-xs font-bold flex items-center gap-1"><LogIn className="w-3 h-3"/> Login</button>
                                {/* Suspend Logic (Just UI for now) */}
                                <button className="bg-red-600/50 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 border border-red-500"><Ban className="w-3 h-3"/> Block</button>
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
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold text-lg text-green-400">Rs {req.amount}</h3>
                                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">Pending</span>
                            </div>
                            <div className="bg-black/30 p-2 rounded text-xs mb-3">
                                <p><span className="text-gray-400">Method:</span> {req.method}</p>
                                <p><span className="text-gray-400">Account:</span> {req.accountNumber} ({req.accountTitle})</p>
                                <p><span className="text-gray-400">User ID:</span> {req.userId}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setViewModal({ type: 'withdraw', data: req })} className="flex-1 bg-gray-700 py-2 rounded text-xs font-bold">View Detail</button>
                                <button onClick={() => handleAction('withdraw', req._id, 'approve')} className="flex-1 bg-green-600 py-2 rounded text-xs font-bold">Approve</button>
                                <button onClick={() => setRejectModal({ show: true, id: req._id, type: 'withdraw' })} className="flex-1 bg-red-600 py-2 rounded text-xs font-bold">Decline</button>
                            </div>
                        </div>
                    ))}
                    {data.withdrawRequests.length === 0 && <div className="text-center text-gray-500 mt-10">No pending withdrawals</div>}
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
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold text-white">{req.planName}</h3>
                                <span className="text-blue-400 font-bold">Rs {req.price}</span>
                            </div>
                            <div className="bg-black/30 p-2 rounded text-xs mb-3">
                                <p><span className="text-gray-400">User:</span> {req.username}</p>
                                <p><span className="text-gray-400">Trx ID:</span> <span className="text-yellow-400">{req.trxId}</span></p>
                            </div>
                            <div className="flex gap-2">
                                {/* Proof Image Viewer */}
                                <button onClick={() => setViewModal({ type: 'plan', data: req })} className="flex-1 bg-gray-700 py-2 rounded text-xs font-bold flex items-center justify-center gap-1"><Eye className="w-3 h-3"/> Proof</button>
                                <button onClick={() => handleAction('plan', req._id, 'approve')} className="flex-1 bg-green-600 py-2 rounded text-xs font-bold">Approve</button>
                                <button onClick={() => setRejectModal({ show: true, id: req._id, type: 'plan' })} className="flex-1 bg-red-600 py-2 rounded text-xs font-bold">Decline</button>
                            </div>
                        </div>
                    ))}
                    {data.planRequests.length === 0 && <div className="text-center text-gray-500 mt-10">No pending plan requests</div>}
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
                    <StatBox title="All User Balance" value={`Rs ${data.stats.totalUserBalance}`} icon={Activity} color="bg-purple-600" desc="Liability (User ke accounts mein jo paisa hai)" />
                </div>
            </div>
        )}

      </div>

      {/* --- BOTTOM NAVIGATION (Fixed) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#151515] border-t border-white/10 p-3 z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
            <NavBtn active={activeTab==='users'} onClick={()=>setActiveTab('users')} icon={Users} label="Users" count={null} />
            <NavBtn active={activeTab==='withdraws'} onClick={()=>setActiveTab('withdraws')} icon={CreditCard} label="Withdraw" count={data.withdrawRequests.length} />
            <NavBtn active={activeTab==='plans'} onClick={()=>setActiveTab('plans')} icon={Layers} label="Plans" count={data.planRequests.length} />
            <NavBtn active={activeTab==='stats'} onClick={()=>setActiveTab('stats')} icon={BarChart} label="Data" count={null} />
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. REJECT MODAL */}
      {rejectModal.show && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
              <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/20">
                  <h3 className="font-bold mb-2 text-red-500">Decline Request</h3>
                  <textarea className="w-full bg-black/50 p-3 rounded border border-white/10 text-white mb-4" placeholder="Reason (e.g. Invalid TrxID)" onChange={(e)=>setRejectReason(e.target.value)}></textarea>
                  <div className="flex gap-2">
                      <button onClick={()=>setRejectModal({show:false})} className="flex-1 bg-gray-700 py-2 rounded">Cancel</button>
                      <button onClick={()=>handleAction(rejectModal.type, rejectModal.id, 'reject', rejectReason)} className="flex-1 bg-red-600 py-2 rounded">Confirm</button>
                  </div>
              </div>
          </div>
      )}

      {/* 2. VIEW DETAILS MODAL */}
      {viewModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
              <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/20 relative">
                  <button onClick={()=>setViewModal(null)} className="absolute top-3 right-3"><X/></button>
                  <h3 className="font-bold mb-4 text-xl">Request Details</h3>
                  
                  <div className="space-y-3 text-sm">
                      <p><span className="text-gray-400">User:</span> {viewModal.data.username}</p>
                      <p><span className="text-gray-400">Email:</span> {viewModal.data.userId}</p>
                      <hr className="border-white/10"/>
                      {viewModal.type === 'withdraw' ? (
                          <>
                            <p><span className="text-gray-400">Bank:</span> {viewModal.data.method}</p>
                            <p><span className="text-gray-400">Account:</span> {viewModal.data.accountNumber}</p>
                            <p><span className="text-gray-400">Title:</span> {viewModal.data.accountTitle}</p>
                            <p className="text-xl font-bold text-center mt-4 text-green-400">Amount: {viewModal.data.amount}</p>
                          </>
                      ) : (
                          <>
                            <p><span className="text-gray-400">Plan:</span> {viewModal.data.planName}</p>
                            <p><span className="text-gray-400">Price:</span> {viewModal.data.price}</p>
                            <p><span className="text-gray-400">TrxID:</span> {viewModal.data.trxId}</p>
                            <div className="mt-2 bg-black p-2 rounded text-center text-xs text-gray-500">
                                {viewModal.data.screenshot} <br/> (Image Logic here)
                            </div>
                          </>
                      )}
                  </div>
                  <button onClick={()=>handleLoginAsUser({ username: viewModal.data.username, email: viewModal.data.userId })} className="w-full mt-6 bg-blue-600 py-2 rounded font-bold flex items-center justify-center gap-2"><LogIn className="w-4 h-4"/> Login as User</button>
              </div>
          </div>
      )}

      {/* 3. SETTINGS MODAL */}
      {settingsModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
              <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/20">
                  <h3 className="font-bold mb-4">Admin Settings</h3>
                  <input type="text" placeholder="New Username" className="w-full bg-black/50 p-3 rounded mb-3 border border-white/10" onChange={(e)=>setCreds({...creds, username: e.target.value})} />
                  <input type="text" placeholder="New Password" className="w-full bg-black/50 p-3 rounded mb-4 border border-white/10" onChange={(e)=>setCreds({...creds, password: e.target.value})} />
                  <div className="flex gap-2">
                      <button onClick={()=>setSettingsModal(false)} className="flex-1 bg-gray-700 py-2 rounded">Cancel</button>
                      <button onClick={updateSettings} className="flex-1 bg-green-600 py-2 rounded">Update</button>
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
        <button onClick={onClick} className={`flex flex-col items-center gap-1 relative ${active ? 'text-red-500' : 'text-gray-500'}`}>
            <Icon className={`w-6 h-6 ${active ? 'fill-current/20' : ''}`} />
            <span className="text-[10px] font-bold">{label}</span>
            {count && count > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-black">{count}</span>}
        </button>
    )
}

function StatBox({ title, value, icon: Icon, color, desc }) {
    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
            <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-xs text-gray-400 uppercase">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
                {desc && <p className="text-[10px] text-gray-500">{desc}</p>}
            </div>
        </div>
    )
}
