"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, LogOut, ChevronRight, Wallet, History, Phone, CreditCard, ArrowLeft, CheckCircle, Save, Loader2, AlertCircle, Camera, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const router = useRouter();
  
  // --- STATES ---
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("main"); 
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Edit Profile State
  const [editForm, setEditForm] = useState({ name: "", username: "", email: "" });
  const [updating, setUpdating] = useState(false);

  // Withdraw Form State
  const [withdrawForm, setWithdrawForm] = useState({ title: "", number: "", amount: "" });
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  
  // History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // --- 1. FETCH USER DATA FROM DB (Master API) ---
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/login");
        return;
      }
      
      const localData = JSON.parse(storedUser);
      
      try {
        // Database se fresh data mangwao
        const res = await fetch(`/api/user/profile?email=${localData.email}`);
        const data = await res.json();
        
        if (data.success) {
          setUser(data.user);
          setEditForm({ 
            name: data.user.name, 
            username: data.user.username, 
            email: data.user.email 
          });
          // LocalStorage ko bhi update kar do taake sync rahe
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Failed to load profile");
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, []);

  // --- 2. BACK BUTTON HANDLER (Android Style) ---
  useEffect(() => {
    const handleBack = () => {
        if (activeView !== "main") {
            setActiveView("main"); 
            window.history.pushState(null, "", window.location.href); 
        }
    };
    
    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', handleBack);

    return () => {
        window.removeEventListener('popstate', handleBack);
    };
  }, [activeView]);

  // --- 3. FETCH HISTORY ---
  useEffect(() => {
    if (activeView === "history" && user) {
        fetchHistory();
    }
  }, [activeView]);

  const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
          const res = await fetch(`/api/withdraw?userId=${user.email}`);
          const data = await res.json();
          if (data.history) setHistory(data.history);
      } catch (error) {
          console.error("Failed to load history");
      } finally {
          setLoadingHistory(false);
      }
  };

  // --- 4. HANDLE WITHDRAW SUBMIT ---
  const handleWithdrawSubmit = async () => {
      if (!selectedMethod || !withdrawForm.title || !withdrawForm.number || !withdrawForm.amount) {
          return toast.error("Please fill all fields");
      }
      if (Number(withdrawForm.amount) < 500) return toast.error("Minimum withdraw is Rs. 500");
      if (Number(withdrawForm.amount) > user.balance) return toast.error("Insufficient Balance");

      setLoadingWithdraw(true);
      try {
          const res = await fetch("/api/withdraw", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  userId: user.email,
                  method: selectedMethod,
                  accountTitle: withdrawForm.title,
                  accountNumber: withdrawForm.number,
                  amount: withdrawForm.amount
              })
          });
          
          const data = await res.json();
          if (res.ok) {
              toast.success("Withdrawal Requested!");
              setActiveView("history"); 
          } else {
              toast.error(data.message);
          }
      } catch (error) {
          toast.error("Request Failed");
      } finally {
          setLoadingWithdraw(false);
      }
  };

  // --- 5. HANDLE PROFILE UPDATE ---
  const handleUpdateProfile = async () => {
      setUpdating(true);
      try {
          const res = await fetch("/api/user/profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  currentEmail: user.email, // Identity ke liye
                  newName: editForm.name,
                  newUsername: editForm.username,
                  newEmail: editForm.email
              })
          });

          const data = await res.json();
          if (data.success) {
              toast.success("Profile Updated Successfully!");
              setUser(data.user); // Update UI
              localStorage.setItem("user", JSON.stringify(data.user)); // Update LocalStorage
          } else {
              toast.error(data.message);
          }
      } catch (error) {
          toast.error("Update Failed");
      } finally {
          setUpdating(false);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loadingData || !user) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

  // ================= VIEWS =================

  // --- A. WITHDRAW VIEW ---
  if (activeView === "withdraw") {
      const methods = [
          { id: "EasyPaisa", name: "EasyPaisa", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLEe3uWvU4m4PPvRnPmxLzgMGLnO2EUREMVLIXyDGNEQ&s=10" },
          { id: "JazzCash", name: "JazzCash", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIineXs3mUB_3M1xPlnYOrgQnnacDKll9Jtg&s" },
          { id: "NayaPay", name: "NayaPay", logo: "https://cdn.aptoide.com/imgs/9/2/9/929cb3fcf04bdcfdb0e2ee04ffe7d77b_icon.png" },
          { id: "SadaPay", name: "SadaPay", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5LY00sKvg1smaAPky_8r3NWoc7xrhDjIfhy1CwD8eRg&s=10" },
          { id: "Bank", name: "Bank Transfer", icon: true }
      ];

      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
            <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
            <h1 className="text-2xl font-bold mb-2">Withdraw Funds</h1>
            <p className="text-gray-400 text-xs mb-6">Current Balance: <span className="text-green-400 font-bold">Rs. {user.balance}</span></p>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
                {methods.map((method) => (
                    <div 
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all border-2 
                        ${selectedMethod === method.id ? 'border-purple-500 bg-white/10' : 'border-transparent hover:bg-white/10'}`}
                    >
                        {method.icon ? (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs mb-2">BANK</div>
                        ) : (
                             <img src={method.logo} className="w-10 h-10 object-contain mb-2 rounded-full bg-white p-0.5" />
                        )}
                        <span className="text-[10px] text-gray-300">{method.name}</span>
                        {selectedMethod === method.id && <CheckCircle className="w-4 h-4 text-green-400 mt-1" />}
                    </div>
                ))}
            </div>

            {selectedMethod && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Account Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Ali Khan" 
                            className="w-full bg-transparent outline-none text-sm font-bold"
                            onChange={(e) => setWithdrawForm({...withdrawForm, title: e.target.value})}
                        />
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Account Number</label>
                        <input 
                            type="number" 
                            placeholder="0300xxxxxxx" 
                            className="w-full bg-transparent outline-none text-sm font-bold"
                            onChange={(e) => setWithdrawForm({...withdrawForm, number: e.target.value})}
                        />
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Amount (PKR)</label>
                        <input 
                            type="number" 
                            placeholder="Min Rs. 500" 
                            className="w-full bg-transparent outline-none text-xl font-bold text-green-400"
                            onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                        />
                    </div>
                    <button 
                        disabled={loadingWithdraw}
                        onClick={handleWithdrawSubmit} 
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold shadow-lg mt-4 flex items-center justify-center gap-2"
                    >
                        {loadingWithdraw ? <Loader2 className="animate-spin" /> : "Confirm Withdraw"}
                    </button>
                </motion.div>
            )}
        </div>
      );
  }

  // --- B. WITHDRAW HISTORY VIEW ---
  if (activeView === "history") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Withdraw History</h1>
          
          {loadingHistory ? (
              <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-purple-500" /></div>
          ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-gray-600 border-2 border-dashed border-white/10 rounded-2xl">
                    <History className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-sm">No transactions yet.</p>
              </div>
          ) : (
              <div className="space-y-4">
                  {history.map((item) => (
                      <div key={item._id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <h3 className="font-bold text-sm">{item.method}</h3>
                                  <p className="text-[10px] text-gray-400">{new Date(item.createdAt).toDateString()}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded border capitalize
                                  ${item.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                                    item.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                  {item.status}
                              </span>
                          </div>
                          <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500">{item.accountNumber}</p>
                              <p className="text-lg font-bold">Rs. {item.amount}</p>
                          </div>
                          {item.status === 'rejected' && item.adminMessage && (
                              <div className="mt-2 pt-2 border-t border-white/5 flex items-start gap-2">
                                  <AlertCircle className="w-3 h-3 text-red-400 mt-0.5" />
                                  <p className="text-[10px] text-red-300">{item.adminMessage}</p>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          )}
      </div>
  );

  // --- C. EARNING DETAILS VIEW (Dummy for now) ---
  if (activeView === "earnings") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Earning Details</h1>
          <div className="space-y-3">
             <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-full"><Wallet className="w-4 h-4 text-green-400" /></div>
                    <div><p className="text-sm font-bold">Direct Referral</p><p className="text-[10px] text-gray-500">System Bonus</p></div>
                </div>
                <span className="text-green-400 font-bold font-mono">+Rs. 0</span>
             </div>
             {/* Future: Map through earningHistory from user object */}
          </div>
      </div>
  );

  // --- D. EDIT PROFILE VIEW (Working) ---
  if (activeView === "edit") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
          
          <div className="flex flex-col items-center mb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-[#0a0a0a] shadow-xl overflow-hidden">
                  {user.profilePic ? (
                      <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                      user.name[0]
                  )}
              </div>
              <button className="absolute bottom-0 right-[35%] bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200">
                  <Camera className="w-4 h-4" />
              </button>
          </div>

          <div className="space-y-4">
              <div>
                  <label className="text-xs text-gray-500 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-purple-500 transition-all" 
                   />
              </div>
              <div>
                  <label className="text-xs text-gray-500 ml-2">Username</label>
                  <input 
                    type="text" 
                    value={editForm.username} 
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-purple-500 transition-all" 
                   />
              </div>
              <div>
                  <label className="text-xs text-gray-500 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-purple-500 transition-all" 
                   />
              </div>
              
              <button 
                disabled={updating}
                onClick={handleUpdateProfile} 
                className="w-full py-4 bg-purple-600 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                  {updating ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
          </div>
      </div>
  );

  // --- E. CONTACT VIEW ---
  if (activeView === "contact") return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24 flex flex-col items-center">
         <button onClick={() => setActiveView("main")} className="self-start flex items-center gap-2 text-gray-400 mb-10"><ArrowLeft className="w-4 h-4" /> Back</button>
         <h1 className="text-3xl font-bold mb-10">Contact Support</h1>
         <div className="space-y-4 w-full max-w-xs">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10"><div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold">WA</div><div><h3 className="font-bold">WhatsApp</h3></div></div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10"><div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold">TG</div><div><h3 className="font-bold">Telegram</h3></div></div>
         </div>
    </div>
  );

  // --- MAIN MENU VIEW ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg relative overflow-hidden">
             {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                  user.name[0]
              )}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
        </div>
        <div className="flex-1">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-400">@{user.username}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{user.email}</p>
        </div>
        <button onClick={() => setActiveView("edit")} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><User className="w-5 h-5 text-purple-400" /></button>
      </div>

      <div className="space-y-3">
        <MenuItem icon={User} title="Edit Profile" subtitle="Change name, email & picture" onClick={() => setActiveView("edit")} />
        <MenuItem icon={Wallet} title="Withdraw Funds" subtitle="Easypaisa, Jazzcash, NayaPay" onClick={() => setActiveView("withdraw")} />
        <MenuItem icon={CreditCard} title="Earning Details" subtitle="Check direct & indirect income" onClick={() => setActiveView("earnings")} />
        <MenuItem icon={History} title="Withdraw History" subtitle="Check past transaction status" onClick={() => setActiveView("history")} />
        <MenuItem icon={Phone} title="Contact Us" subtitle="Help & Support" onClick={() => setActiveView("contact")} />

        <button onClick={handleLogout} className="w-full flex items-center justify-between bg-red-900/10 border border-red-900/30 p-4 rounded-2xl mt-8 hover:bg-red-900/20 transition-all cursor-pointer">
            <div className="flex items-center gap-3"><div className="p-2 bg-red-500/10 rounded-lg"><LogOut className="w-5 h-5 text-red-500" /></div><div className="text-left"><h3 className="font-bold text-red-400">Log Out</h3></div></div>
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, title, subtitle, onClick }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-purple-900/30 transition-colors"><Icon className="w-5 h-5 text-purple-400" /></div>
                <div className="text-left text-left"><h3 className="font-medium text-sm">{title}</h3><p className="text-[10px] text-gray-500">{subtitle}</p></div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
        </button>
    )
}
