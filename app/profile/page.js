"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Edit, LogOut, ChevronRight, Wallet, History, Phone, CreditCard, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("main"); // main, edit, withdraw, history, contact

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  // --- SUB VIEWS ---
  
  // 1. EDIT PROFILE VIEW
  if (activeView === "edit") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
          <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold mb-2">{user.name[0]}</div>
              <p className="text-xs text-purple-400">Tap to change photo</p>
          </div>
          <form className="space-y-4">
              <input type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm" placeholder="Full Name" />
              <input type="text" defaultValue={user.username} disabled className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-sm text-gray-500" />
              <input type="email" defaultValue={user.email} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm" placeholder="Email" />
              <button className="w-full py-4 bg-purple-600 rounded-xl font-bold shadow-lg">Update Profile</button>
          </form>
      </div>
  );

  // 2. WITHDRAW VIEW
  if (activeView === "withdraw") return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
        <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="flex justify-center mb-6"><img src="/logo.png" className="w-20" /></div>
        <h1 className="text-2xl font-bold text-center mb-8">Withdraw Funds</h1>
        
        <form className="space-y-4">
            <select className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none text-gray-300">
                <option>Select Method</option>
                <option>EasyPaisa</option>
                <option>JazzCash</option>
                <option>SadaPay</option>
                <option>Bank Transfer</option>
            </select>
            <input type="text" placeholder="Account Holder Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm" />
            <input type="number" placeholder="Account Number" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm" />
            <input type="number" placeholder="Amount (Min $10)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm" />
            <button type="button" onClick={() => toast.success("Withdraw Request Sent!")} className="w-full py-4 bg-green-600 rounded-xl font-bold shadow-lg mt-4">Withdraw Now</button>
        </form>
    </div>
  );

  // 3. CONTACT VIEW
  if (activeView === "contact") return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24 flex flex-col items-center">
         <button onClick={() => setActiveView("main")} className="self-start flex items-center gap-2 text-gray-400 mb-10"><ArrowLeft className="w-4 h-4" /> Back</button>
         <h1 className="text-3xl font-bold mb-10">Contact Support</h1>
         
         <div className="space-y-6 w-full max-w-xs">
            {/* WhatsApp */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-green-900/20 border border-transparent hover:border-green-500/50 cursor-pointer transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-12 h-12" />
                <div>
                    <h3 className="font-bold">WhatsApp</h3>
                    <p className="text-xs text-gray-400">Live Chat Support</p>
                </div>
            </div>
            
            {/* Telegram */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-blue-900/20 border border-transparent hover:border-blue-500/50 cursor-pointer transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" className="w-12 h-12" />
                <div>
                    <h3 className="font-bold">Telegram</h3>
                    <p className="text-xs text-gray-400">Join Channel</p>
                </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-red-900/20 border border-transparent hover:border-red-500/50 cursor-pointer transition-all">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl">@</div>
                <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-xs text-gray-400">support@storex.com</p>
                </div>
            </div>
         </div>
    </div>
  );

  // --- MAIN MENU VIEW ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
            {user.name[0]}
        </div>
        <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-400">@{user.username}</p>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">VIP Member</span>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-3">
        
        <MenuItem icon={User} title="My Account" subtitle="Edit Profile details" onClick={() => setActiveView("edit")} />
        <MenuItem icon={Wallet} title="Withdraw Funds" subtitle="Easypaisa, Jazzcash, Bank" onClick={() => setActiveView("withdraw")} />
        <MenuItem icon={History} title="Withdraw History" subtitle="Check past transactions" onClick={() => toast("No history yet")} />
        <MenuItem icon={CreditCard} title="Earning Details" subtitle="Direct vs Indirect Income" onClick={() => toast("Feature coming soon")} />
        <MenuItem icon={Phone} title="Contact Us" subtitle="Help & Support" onClick={() => setActiveView("contact")} />

        {/* Logout */}
        <button onClick={handleLogout} className="w-full flex items-center justify-between bg-red-900/10 border border-red-900/30 p-4 rounded-2xl mt-8 hover:bg-red-900/20 transition-all">
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
        <button onClick={onClick} className="w-full flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg"><Icon className="w-5 h-5 text-purple-400" /></div>
                <div className="text-left">
                    <h3 className="font-medium text-sm">{title}</h3>
                    <p className="text-[10px] text-gray-500">{subtitle}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
    )
  }
    
