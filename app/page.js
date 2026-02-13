"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, Users, Share2, ShieldCheck, Loader2 } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreshData = async () => {
      // 1. Get Email from LocalStorage to identify user
      const storedUser = localStorage.getItem("user");
      
      if (!storedUser) {
        router.push("/login"); 
        return;
      }
      
      const localData = JSON.parse(storedUser);
      
      try {
        // 2. Fetch FULL Profile from DB (Balance, Plan, Team, etc.)
        const res = await fetch(`/api/user/profile?email=${localData.email}`);
        const data = await res.json();
        
        if (data.success) {
          setUser(data.user);
          // Keep LocalStorage updated
          localStorage.setItem("user", JSON.stringify(data.user)); 
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchFreshData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Calculations
  const directTeamCount = user.directTeam ? user.directTeam.length : 0;
  // Total Team (Direct + Indirect) - Direct = Indirect count
  const indirectTeamCount = (user.teamCount || 0) - directTeamCount; 

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-28 relative overflow-y-auto">
      
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Welcome Back</p>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {user.name}
          </h1>
        </div>
        {/* Profile Pic Handling */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center font-bold text-xl overflow-hidden border-2 border-white/10 shadow-lg shadow-purple-500/20">
           {user.profilePic ? (
             <img src={user.profilePic} className="w-full h-full object-cover"/>
           ) : (
             user.name[0]
           )}
        </div>
      </div>

      {/* 4 Stats Grid (Real Data from DB) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        
        {/* Box 1: Balance */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg shadow-purple-900/10"
        >
            <div className="p-2 bg-purple-500/20 rounded-full mb-2">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total Balance</span>
            <span className="text-xl font-bold font-mono text-white mt-1">Rs {user.balance.toFixed(2)}</span>
        </motion.div>

        {/* Box 2: Direct Referrals */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center"
        >
            <div className="p-2 bg-blue-500/20 rounded-full mb-2">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Direct Team</span>
            <span className="text-xl font-bold font-mono text-white mt-1">{directTeamCount}</span>
        </motion.div>

        {/* Box 3: Indirect Referrals */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center"
        >
            <div className="p-2 bg-pink-500/20 rounded-full mb-2">
              <Share2 className="w-5 h-5 text-pink-400" />
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">In-Direct Team</span>
            <span className="text-xl font-bold font-mono text-white mt-1">{indirectTeamCount < 0 ? 0 : indirectTeamCount}</span>
        </motion.div>

        {/* Box 4: Plan Status */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`border p-4 rounded-2xl flex flex-col items-center justify-center text-center 
            ${user.plan?.isActive ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}
        >
            <div className={`p-2 rounded-full mb-2 ${user.plan?.isActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <ShieldCheck className={`w-5 h-5 ${user.plan?.isActive ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Plan Status</span>
            <span className={`text-sm font-bold mt-1 ${user.plan?.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {user.plan?.isActive ? user.plan.planName : 'Inactive'}
            </span>
        </motion.div>
      </div>

      {/* Branding & Ad Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Small Center Logo */}
        <img src="/logo.png" className="w-16 opacity-30 grayscale" />
        
        {/* Ad Banner Placeholder - Public folder mein banner.png rakhna */}
        <div className="w-full h-36 bg-gradient-to-r from-gray-900 to-black border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-gray-600 gap-2 group cursor-pointer hover:border-purple-500/30 transition-all overflow-hidden">
           {/* Agar picture ho to yahan img tag laga dein */}
           <span className="text-xs font-mono group-hover:text-purple-400 transition-colors">[ Banner Ad Space ]</span>
           <span className="text-[10px] bg-white/5 px-2 py-1 rounded">1080 x 300px</span>
        </div>
      </motion.div>

    </div>
  );
}
