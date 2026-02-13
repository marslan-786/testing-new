"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, Users, Share2, ShieldCheck, Zap } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) router.push("/login");
    else setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24 relative overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Welcome Back</p>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {user.name}
          </h1>
        </div>
        <img src="/logo.png" className="w-12 h-12 drop-shadow-[0_0_10px_rgba(120,50,255,0.5)]" />
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Balance */}
        <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Wallet className="w-6 h-6 text-purple-400 mb-2" />
            <span className="text-xs text-gray-400">Total Balance</span>
            <span className="text-xl font-bold font-mono">${user.balance}</span>
        </div>

        {/* Direct Referrals */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Users className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-xs text-gray-400">Direct Referrals</span>
            <span className="text-xl font-bold font-mono">{user.referrals || 0}</span>
        </div>

        {/* Indirect Referrals */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <Share2 className="w-6 h-6 text-pink-400 mb-2" />
            <span className="text-xs text-gray-400">Team Referrals</span>
            <span className="text-xl font-bold font-mono">0</span>
        </div>

        {/* Plan Status */}
        <div className={`border p-4 rounded-2xl flex flex-col items-center justify-center text-center ${user.isPlanActive ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
            <ShieldCheck className={`w-6 h-6 mb-2 ${user.isPlanActive ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-xs text-gray-400">Plan Status</span>
            <span className={`text-sm font-bold ${user.isPlanActive ? 'text-green-400' : 'text-red-400'}`}>
                {user.isPlanActive ? 'Active' : 'Inactive'}
            </span>
        </div>
      </div>

      {/* Branding & Ad Area */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <img src="/logo.png" className="w-20 opacity-50 grayscale hover:grayscale-0 transition-all" />
        
        {/* Ad Banner Place */}
        <div className="w-full h-32 bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-gray-600 text-xs">
          [ Advertising Banner Space ]
        </div>
      </div>

    </div>
  );
}
