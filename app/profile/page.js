"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, LogOut, ChevronRight, Wallet, History, Phone, CreditCard, ArrowLeft, CheckCircle, Camera, Save, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("main"); 
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Hardware Back Button Handling (Android Style)
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  // --- 1. WITHDRAW VIEW ---
  if (activeView === "withdraw") {
      const methods = [
          { id: "easypaisa", name: "EasyPaisa", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLEe3uWvU4m4PPvRnPmxLzgMGLnO2EUREMVLIXyDGNEQ&s=10" },
          { id: "jazzcash", name: "JazzCash", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIineXs3mUB_3M1xPlnYOrgQnnacDKll9Jtg&s" },
          { id: "nayapay", name: "NayaPay", logo: "https://cdn.aptoide.com/imgs/9/2/9/929cb3fcf04bdcfdb0e2ee04ffe7d77b_icon.png" },
          { id: "sadapay", name: "SadaPay", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5LY00sKvg1smaAPky_8r3NWoc7xrhDjIfhy1CwD8eRg&s=10" },
          { id: "bank", name: "Bank Transfer", icon: true }
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
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Account Title</label>
                        <input type="text" placeholder="e.g. Ali Khan" className="w-full bg-transparent outline-none text-sm font-bold" />
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Account Number</label>
                        <input type="number" placeholder="0300xxxxxxx" className="w-full bg-transparent outline-none text-sm font-bold" />
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Amount (PKR)</label>
                        <input type="number" placeholder="Min Rs. 500" className="w-full bg-transparent outline-none text-xl font-bold text-green-400" />
                    </div>
                    <button type="button" onClick={() => toast.success("Withdraw Request Sent!")} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold shadow-lg mt-4">Confirm Withdraw</button>
                </motion.form>
            )}
        </div>
      );
  }

  // --- 2. EARNING DETAILS VIEW ---
  if (activeView === "earnings") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Earning Details</h1>
          
          <div className="space-y-3">
             {/* Dummy Data - Will connect to API later */}
             <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-full"><Wallet className="w-4 h-4 text-green-400" /></div>
                    <div>
                        <p className="text-sm font-bold">Direct Referral Bonus</p>
                        <p className="text-[10px] text-gray-500">From: @ali123</p>
                    </div>
                </div>
                <span className="text-green-400 font-bold font-mono">+Rs. 350</span>
             </div>

             <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-full"><CreditCard className="w-4 h-4 text-purple-400" /></div>
                    <div>
                        <p className="text-sm font-bold">Team Bonus (Indirect)</p>
                        <p className="text-[10px] text-gray-500">From: @hamza_k</p>
                    </div>
                </div>
                <span className="text-purple-400 font-bold font-mono">+Rs. 80</span>
             </div>

             {/* Empty State if no earnings */}
             {/* <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>No earnings yet.</p>
             </div> 
             */}
          </div>
      </div>
  );

  // --- 3. WITHDRAW HISTORY VIEW ---
  if (activeView === "history") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Withdraw History</h1>
          
          <div className="flex flex-col items-center justify-center h-60 text-gray-600 border-2 border-dashed border-white/10 rounded-2xl">
                <History className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">No transactions found.</p>
          </div>
      </div>
  );

  // --- 4. EDIT PROFILE VIEW ---
  if (activeView === "edit") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
          
          <div className="flex flex-col items-center mb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-[#0a0a0a] shadow-xl">
                  {user.name[0]}
              </div>
              <button className="absolute bottom-0 right-[35%] bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200">
                  <Camera className="w-4 h-4" />
              </button>
          </div>

          <form className="space-y-4">
              <div>
                  <label className="text-xs text-gray-500 ml-2">Full Name</label>
                  <input type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-purple-500 transition-all" />
              </div>
              <div>
                  <label className="text-xs text-gray-500 ml-2">Username</label>
                  <input type="text" defaultValue={user.username} disabled className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                  <label className="text-xs text-gray-500 ml-2">Email Address</label>
                  <input type="email" defaultValue={user.email} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-purple-500 transition-all" />
              </div>
              
              <button type="button" onClick={() => toast.success("Profile Updated!")} className="w-full py-4 bg-purple-600 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
              </button>
          </form>
      </div>
  );

  // --- 5. CONTACT VIEW ---
  if (activeView === "contact") return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24 flex flex-col items-center">
         <button onClick={() => setActiveView("main")} className="self-start flex items-center gap-2 text-gray-400 mb-10"><ArrowLeft className="w-4 h-4" /> Back</button>
         <h1 className="text-3xl font-bold mb-10">Contact Support</h1>
         
         <div className="space-y-4 w-full max-w-xs">
            {/* WhatsApp */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-green-900/20 border border-transparent hover:border-green-500/50 cursor-pointer transition-all">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold text-lg">WA</div>
                <div>
                    <h3 className="font-bold">WhatsApp</h3>
                    <p className="text-xs text-gray-400">Live Chat Support</p>
                </div>
            </div>
            
            {/* Telegram */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-blue-900/20 border border-transparent hover:border-blue-500/50 cursor-pointer transition-all">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-lg">TG</div>
                <div>
                    <h3 className="font-bold">Telegram</h3>
                    <p className="text-xs text-gray-400">Join Channel</p>
                </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-red-900/20 border border-transparent hover:border-red-500/50 cursor-pointer transition-all">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center font-bold text-lg">@</div>
                <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-xs text-gray-400">support@storex.com</p>
                </div>
            </div>
         </div>
    </div>
  );


  // --- MAIN MENU VIEW (Root) ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg relative">
            {user.name[0]}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
        </div>
        <div className="flex-1">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-400">@{user.username}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{user.email}</p>
        </div>
        <button onClick={() => setActiveView("edit")} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <User className="w-5 h-5 text-purple-400" />
        </button>
      </div>

      {/* Menu List */}
      <div className="space-y-3">
        <MenuItem icon={User} title="Edit Profile" subtitle="Change name, email & picture" onClick={() => setActiveView("edit")} />
        <MenuItem icon={Wallet} title="Withdraw Funds" subtitle="Easypaisa, Jazzcash, NayaPay" onClick={() => setActiveView("withdraw")} />
        <MenuItem icon={CreditCard} title="Earning Details" subtitle="Check direct & indirect income" onClick={() => setActiveView("earnings")} />
        <MenuItem icon={History} title="Withdraw History" subtitle="Check past transaction status" onClick={() => setActiveView("history")} />
        <MenuItem icon={Phone} title="Contact Us" subtitle="Help & Support" onClick={() => setActiveView("contact")} />

        {/* Logout Button */}
        <button onClick={handleLogout} className="w-full flex items-center justify-between bg-red-900/10 border border-red-900/30 p-4 rounded-2xl mt-8 hover:bg-red-900/20 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg"><LogOut className="w-5 h-5 text-red-500" /></div>
                <div className="text-left">
                    <h3 className="font-bold text-red-400">Log Out</h3>
                </div>
            </div>
        </button>
      </div>
    </div>
  );
}

// Reusable Menu Item Component
function MenuItem({ icon: Icon, title, subtitle, onClick }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-purple-900/30 transition-colors"><Icon className="w-5 h-5 text-purple-400" /></div>
                <div className="text-left text-left">
                    <h3 className="font-medium text-sm">{title}</h3>
                    <p className="text-[10px] text-gray-500">{subtitle}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
        </button>
    )
}
