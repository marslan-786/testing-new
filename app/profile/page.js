"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Edit, LogOut, ChevronRight, Wallet, History, Phone, CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("main"); 
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  // --- WITHDRAW VIEW (UPDATED WITH LOGOS) ---
  if (activeView === "withdraw") {
      const methods = [
          { id: "easypaisa", name: "EasyPaisa", logo: "https://play-lh.googleusercontent.com/ShTKyjQ2V5m0tFzT_pyL7bL7hTjE6W3V7vJ5x1Xg8g_1x_XX8_X_X8_X_X8_X_X8", color: "border-green-500" },
          { id: "jazzcash", name: "JazzCash", logo: "https://play-lh.googleusercontent.com/B_T_1MhV8-x-0X6_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8", color: "border-red-500" },
          { id: "sadapay", name: "SadaPay", logo: "https://play-lh.googleusercontent.com/3_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8", color: "border-teal-400" }, // Placeholder links, in production keep images in public folder
          { id: "nayapay", name: "NayaPay", logo: "https://play-lh.googleusercontent.com/1_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8_X_X8", color: "border-orange-500" },
          { id: "bank", name: "Bank Transfer", logo: "", icon: true, color: "border-blue-500" }
      ];

      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
            <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
            
            <h1 className="text-2xl font-bold mb-2">Withdraw Funds</h1>
            <p className="text-gray-400 text-xs mb-6">Select your payment method</p>
            
            {/* Logos Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {methods.map((method) => (
                    <div 
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all border-2 
                        ${selectedMethod === method.id ? `${method.color} bg-white/10` : 'border-transparent hover:bg-white/10'}`}
                    >
                        {method.icon ? (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs mb-2">BANK</div>
                        ) : (
                             // Using stylized text divs instead of external images to prevent broken links if internet restricts.
                             // You can replace these divs with <img src="..." /> if you have the files.
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] text-white mb-2 overflow-hidden
                                ${method.id === 'easypaisa' ? 'bg-green-500' : 
                                  method.id === 'jazzcash' ? 'bg-red-600' : 
                                  method.id === 'sadapay' ? 'bg-teal-500' : 'bg-orange-500'}`}>
                                {method.name.substring(0,4)}..
                             </div>
                        )}
                        <span className="text-[10px] text-gray-300">{method.name}</span>
                        {selectedMethod === method.id && <CheckCircle className="w-4 h-4 text-green-400 mt-1" />}
                    </div>
                ))}
            </div>

            {selectedMethod && (
                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Account Title</label>
                        <input type="text" placeholder="e.g. Ali Khan" className="w-full bg-transparent outline-none text-sm font-bold" />
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Account Number / IBAN</label>
                        <input type="number" placeholder="0300xxxxxxx" className="w-full bg-transparent outline-none text-sm font-bold" />
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-gray-500 mb-1 block">Amount (PKR)</label>
                        <input type="number" placeholder="Min Rs. 500" className="w-full bg-transparent outline-none text-xl font-bold text-green-400" />
                    </div>

                    <button type="button" onClick={() => toast.success("Withdraw Request Sent!")} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold shadow-lg mt-4">
                        Confirm Withdraw
                    </button>
                </motion.form>
            )}
        </div>
      );
  }

  // --- OTHER VIEWS (Edit, Contact etc - Same as before) ---
  // (Main Menu Code neeche hai, bilkul pehle jaisa bas currency PKR hogi)

  // 1. EDIT PROFILE VIEW
  if (activeView === "edit") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
          <form className="space-y-4">
              <input type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm" placeholder="Full Name" />
              <input type="text" defaultValue={user.username} disabled className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-sm text-gray-500" />
              <input type="email" defaultValue={user.email} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm" placeholder="Email" />
              <button className="w-full py-4 bg-purple-600 rounded-xl font-bold shadow-lg">Update Profile</button>
          </form>
      </div>
  );

  // 3. CONTACT VIEW
  if (activeView === "contact") return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24 flex flex-col items-center">
         <button onClick={() => setActiveView("main")} className="self-start flex items-center gap-2 text-gray-400 mb-10"><ArrowLeft className="w-4 h-4" /> Back</button>
         <h1 className="text-3xl font-bold mb-10">Contact Support</h1>
         <div className="space-y-6 w-full max-w-xs">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 cursor-pointer">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold">WA</div>
                <div><h3 className="font-bold">WhatsApp</h3><p className="text-xs text-gray-400">Live Chat</p></div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 cursor-pointer">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold">TG</div>
                <div><h3 className="font-bold">Telegram</h3><p className="text-xs text-gray-400">Channel</p></div>
            </div>
         </div>
    </div>
  );

  // --- MAIN MENU VIEW ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
            {user.name[0]}
        </div>
        <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-400">@{user.username}</p>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Standard Member</span>
        </div>
      </div>

      <div className="space-y-3">
        <MenuItem icon={User} title="My Account" subtitle="Edit Profile details" onClick={() => setActiveView("edit")} />
        <MenuItem icon={Wallet} title="Withdraw Funds" subtitle="Easypaisa, Jazzcash, NayaPay" onClick={() => setActiveView("withdraw")} />
        <MenuItem icon={History} title="Withdraw History" subtitle="Check past transactions" onClick={() => toast("No history yet")} />
        <MenuItem icon={Phone} title="Contact Us" subtitle="Help & Support" onClick={() => setActiveView("contact")} />
        <button onClick={handleLogout} className="w-full flex items-center justify-between bg-red-900/10 border border-red-900/30 p-4 rounded-2xl mt-8 hover:bg-red-900/20 transition-all">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg"><LogOut className="w-5 h-5 text-red-500" /></div>
                <div className="text-left"><h3 className="font-bold text-red-400">Log Out</h3></div>
            </div>
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, title, subtitle, onClick }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg"><Icon className="w-5 h-5 text-purple-400" /></div>
                <div className="text-left"><h3 className="font-medium text-sm">{title}</h3><p className="text-[10px] text-gray-500">{subtitle}</p></div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
    )
}
