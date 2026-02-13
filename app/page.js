"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Wallet, Image as ImageIcon } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login"); // Redirect to Login if not logged in
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 relative">
      
      {/* Header: Small Logo */}
      <div className="flex justify-between items-center mb-6">
        <motion.img 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          src="/logo.png" 
          alt="Logo" 
          className="w-24 drop-shadow-[0_0_10px_rgba(120,50,255,0.5)]"
        />
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
      </div>

      {/* User Stats Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-1">Welcome Back</h2>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
            {user.name}
          </h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Wallet className="w-4 h-4" />
                <span className="text-xs">Balance</span>
              </div>
              <p className="text-xl font-mono font-bold">${user.balance.toFixed(2)}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Users className="w-4 h-4" />
                <span className="text-xs">Referrals</span>
              </div>
              <p className="text-xl font-mono font-bold">{user.referrals}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Advertisement Banner Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 w-full h-40 bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 transition-colors cursor-pointer group"
      >
        <ImageIcon className="w-8 h-8 mb-2 group-hover:text-purple-400 transition-colors" />
        <span className="text-xs">Advertisement Banner Space</span>
        <span className="text-[10px] text-gray-600">(Upload Picture via Admin)</span>
      </motion.div>

    </div>
  );
}
