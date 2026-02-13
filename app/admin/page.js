"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, DollarSign, Activity, AlertCircle, Search, LogIn, Ban, Check, X, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("stats"); // stats, users, plans, withdraws
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'plan' or 'withdraw'

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
    localStorage.setItem("user", JSON.stringify(user));
    toast.success(`Logged in as ${user.username}`);
    window.open("/", "_blank"); // Open user dashboard in new tab
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
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedItem(null);
        fetchData(); // Refresh Data
      } else {
        toast.error("Failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Error", { id: toastId });
    }
  };

  const openRejectModal = (item, type) => {
    setSelectedItem(item);
    setActionType(type);
    setShowRejectModal(true);
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-[#111] text-white flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-white/10 p-5 hidden md:block">
        <h1 className="text-2xl font-bold text-red-500 mb-10">STOREX ADMIN</h1>
        <nav className="space-y-2">
            <button onClick={() => setActiveTab("stats")} className={`w-full text-left p-3 rounded ${activeTab === 'stats' ? 'bg-red-600' : 'hover:bg-white/5'}`}>Dashboard Stats</button>
            <button onClick={() => setActiveTab("users")} className={`w-full text-left p-3 rounded ${activeTab === 'users' ? 'bg-red-600' : 'hover:bg-white/5'}`}>All Members ({data.stats.totalUsers})</button>
            <button onClick={() => setActiveTab("plans")} className={`w-full text-left p-3 rounded flex justify-between ${activeTab === 'plans' ? 'bg-red-600' : 'hover:bg-white/5'}`}>
                Plan Requests {data.planRequests.length > 0 && <span className="bg-white text-red-600 px-2 rounded-full text-xs font-bold">{data.planRequests.length}</span>}
            </button>
            <button onClick={() => setActiveTab("withdraws")} className={`w-full text-left p-3 rounded flex justify-between ${activeTab === 'withdraws' ? 'bg-red-600' : 'hover:bg-white/5'}`}>
                Withdraw Requests {data.withdrawRequests.length > 0 && <span className="bg-white text-red-600 px-2 rounded-full text-xs font-bold">{data.withdrawRequests.length}</span>}
            </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* --- STATS TAB --- */}
        {activeTab === "stats" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={data.stats.totalUsers} icon={Users} color="bg-blue-600" />
                <StatCard title="Total Investment" value={`Rs ${data.stats.totalInvestment}`} icon={DollarSign} color="bg-green-600" />
                <StatCard title="Total Withdrawn" value={`Rs ${data.stats.totalWithdrawn}`} icon={Activity} color="bg-orange-600" />
                <StatCard title="User Liabilities" value={`Rs ${data.stats.totalUserBalance}`} icon={AlertCircle} color="bg-purple-600" />
            </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === "users" && (
            <div>
                <h2 className="text-2xl font-bold mb-6">All Members</h2>
                <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Balance</th>
                                <th className="p-4">Plan</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => (
                                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{user.name}</div>
                                        <div className="text-xs">@{user.username}</div>
                                    </td>
                                    <td className="p-4 text-green-400 font-mono font-bold">{user.balance}</td>
                                    <td className="p-4">{user.plan.isActive ? <span className="text-green-400">{user.plan.planName}</span> : <span className="text-red-400">Inactive</span>}</td>
                                    <td className="p-4 flex gap-2">
                                        <button onClick={() => handleLoginAsUser(user)} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded border border-blue-500/50 flex items-center gap-1 hover:bg-blue-600 hover:text-white transition"><LogIn className="w-3 h-3" /> Login As</button>
                                        <button className="bg-red-600/20 text-red-400 px-3 py-1 rounded border border-red-500/50 flex items-center gap-1 hover:bg-red-600 hover:text-white transition"><Ban className="w-3 h-3" /> Suspend</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- PLAN REQUESTS TAB --- */}
        {activeTab === "plans" && (
            <div>
                <h2 className="text-2xl font-bold mb-6">Pending Plan Approvals</h2>
                <div className="grid gap-4">
                    {data.planRequests.map(req => (
                        <div key={req._id} className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{req.planName} (Rs {req.price})</h3>
                                <p className="text-gray-400 text-sm">User: {req.username} ({req.userId})</p>
                                <p className="text-gray-500 text-xs mt-1">TrxID: <span className="text-yellow-400 font-mono">{req.trxId}</span></p>
                            </div>
                            <div className="flex gap-3">
                                {/* Proof Button (Normally opens modal/image) */}
                                <button className="bg-gray-700 px-4 py-2 rounded font-bold flex items-center gap-2"><Eye className="w-4 h-4" /> View Proof</button>
                                <button onClick={() => handleAction('plan', req._id, 'approve')} className="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-500">Approve</button>
                                <button onClick={() => openRejectModal(req, 'plan')} className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500">Decline</button>
                            </div>
                        </div>
                    ))}
                    {data.planRequests.length === 0 && <p className="text-gray-500 text-center py-10">No pending plan requests.</p>}
                </div>
            </div>
        )}

        {/* --- WITHDRAW REQUESTS TAB --- */}
        {activeTab === "withdraws" && (
            <div>
                <h2 className="text-2xl font-bold mb-6">Pending Withdrawals</h2>
                <div className="grid gap-4">
                    {data.withdrawRequests.map(req => (
                        <div key={req._id} className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-green-400 font-mono">Rs {req.amount}</h3>
                                    <p className="text-white font-bold">{req.method} - {req.accountNumber}</p>
                                    <p className="text-gray-400 text-sm">Title: {req.accountTitle}</p>
                                    <p className="text-gray-500 text-xs mt-2">Requested by: {req.userId}</p>
                                </div>
                                <div className="text-right">
                                    <button className="text-blue-400 text-xs underline mb-2 block">Check Earning History</button>
                                </div>
                            </div>
                            <div className="flex gap-3 border-t border-white/10 pt-4">
                                <button onClick={() => handleAction('withdraw', req._id, 'approve')} className="flex-1 bg-green-600 py-2 rounded font-bold hover:bg-green-500">Approve & Pay</button>
                                <button onClick={() => openRejectModal(req, 'withdraw')} className="flex-1 bg-red-600 py-2 rounded font-bold hover:bg-red-500">Decline</button>
                            </div>
                        </div>
                    ))}
                    {data.withdrawRequests.length === 0 && <p className="text-gray-500 text-center py-10">No pending withdrawals.</p>}
                </div>
            </div>
        )}

      </div>

      {/* --- REJECT MODAL --- */}
      {showRejectModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Decline Request</h3>
                  <p className="text-sm text-gray-400 mb-2">Reason for rejection (will be shown to user):</p>
                  <textarea 
                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-red-500"
                    rows="4"
                    placeholder="e.g. Invalid Transaction ID / Account Details Incorrect"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                  <div className="flex gap-3 mt-4">
                      <button onClick={() => setShowRejectModal(false)} className="flex-1 bg-gray-700 py-2 rounded font-bold">Cancel</button>
                      <button 
                        onClick={() => handleAction(actionType, selectedItem._id, 'reject', rejectReason)}
                        className="flex-1 bg-red-600 py-2 rounded font-bold hover:bg-red-500"
                      >
                          Confirm Decline
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <span className="text-gray-400 text-xs uppercase tracking-wider">{title}</span>
                <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
                    <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
            <span className="text-2xl font-bold">{value}</span>
        </div>
    )
}
