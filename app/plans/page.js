"use client";
import { motion } from "framer-motion";
import { CheckCircle, Crown } from "lucide-react";

export default function Plans() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Unlock Earning</h1>

      {/* VIP CARD */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative w-full bg-gradient-to-b from-yellow-600/20 to-black border border-yellow-500/50 rounded-3xl p-8 shadow-[0_0_30px_rgba(234,179,8,0.2)] overflow-hidden"
      >
        {/* Shine Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 blur-[50px] rounded-full" />

        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                    <Crown className="fill-yellow-400 text-yellow-400" /> VIP Plan
                </h2>
                <p className="text-xs text-yellow-200/60 mt-1">Lifetime Access</p>
            </div>
            <div className="text-right">
                <span className="text-3xl font-bold text-white">$20</span>
                <p className="text-[10px] text-gray-400">One Time</p>
            </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-sm text-gray-300">Direct Referral: <b className="text-white">$1.50</b></span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-sm text-gray-300">Indirect Referral: <b className="text-white">$0.50</b></span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-sm text-gray-300">Unlimited Earnings</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-sm text-gray-300">Instant Withdrawal</span>
            </div>
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-all">
            Activate Plan Now
        </button>

      </motion.div>
    </div>
  );
}
