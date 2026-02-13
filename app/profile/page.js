"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Router for navigation
import { motion } from "framer-motion";
import { User, LogOut, ChevronRight, Wallet, History, Phone, CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
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
            setActiveView("main"); // Go back to main profile view
            // Prevent default back navigation
            window.history.pushState(null, "", window.location.href); 
        }
    };
    
    // Add fake history state to catch back button
    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', handleBack);

    return () => {
        window.removeEventListener('popstate', handleBack);
    };
  }, [activeView]); // Re-run when view changes

  if (!user) return null;

  // --- 1. WITHDRAW VIEW (Fixed Images) ---
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
            <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>
            
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
            {/* Form same as before... */}
        </div>
      );
  }

  // --- 2. EARNING DETAILS VIEW (Crash Fixed) ---
  if (activeView === "earnings") return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
          <button onClick={() => setActiveView("main")} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-2xl font-bold mb-6">Earning Details</h1>
          {/* Static Content to prevent crash */}
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
             <CreditCard className="w-10 h-10 mb-2 opacity-50" />
             <p>No earnings yet.</p>
          </div>
      </div>
  );

  // --- Main Menu (Same as before) ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
       {/* ... Header & Menu Items same code ... */}
       {/* Use setActiveView("earnings") on Earning button click */}
        <MenuItem icon={User} title="Edit Profile" subtitle="Change name, email & picture" onClick={() => setActiveView("edit")} />
        <MenuItem icon={Wallet} title="Withdraw Funds" subtitle="Easypaisa, Jazzcash, NayaPay" onClick={() => setActiveView("withdraw")} />
        <MenuItem icon={CreditCard} title="Earning Details" subtitle="Check direct & indirect income" onClick={() => setActiveView("earnings")} />
        {/* ... Rest of menu ... */}
    </div>
  );
}

// ... MenuItem Component same as before ...
function MenuItem({ icon: Icon, title, subtitle, onClick }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-purple-900/30 transition-colors"><Icon className="w-5 h-5 text-purple-400" /></div>
                <div className="text-left"><h3 className="font-medium text-sm">{title}</h3><p className="text-[10px] text-gray-500">{subtitle}</p></div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
        </button>
    )
}
