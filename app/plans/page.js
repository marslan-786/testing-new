"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Crown, Shield, Zap, ArrowRight, Clock, AlertCircle, Check } from "lucide-react";
import Link from "next/link";

export default function Plans() {
  const [activeRequest, setActiveRequest] = useState(null);

  // Load Request Status on Page Load
  useEffect(() => {
    // Ye data abhi LocalStorage se utha raha hai, baad mein Database se layega
    const storedRequest = localStorage.getItem("planRequest");
    if (storedRequest) {
      setActiveRequest(JSON.parse(storedRequest));
    }
  }, []);

  const plans = [
    {
      id: "starter",
      name: "Student Plan",
      price: 500,
      totalEarning: "2,500",
      icon: Shield,
      color: "from-gray-800 to-gray-900",
      border: "border-gray-600",
      features: ["Low Investment", "Total Income: Rs. 2,500", "Direct & Indirect Rewards", "Standard Support"]
    },
    {
      id: "pro",
      name: "Professional",
      price: 1000,
      totalEarning: "10,000",
      icon: Zap,
      color: "from-blue-900 to-blue-800",
      border: "border-blue-500",
      features: ["Moderate Investment", "Total Income: Rs. 10,000", "High Networking Bonus", "Fast Withdrawals"]
    },
    {
      id: "vip",
      name: "StoreX VIP",
      price: 2000,
      totalEarning: "Unlimited",
      icon: Crown,
      color: "from-yellow-700 to-yellow-900",
      border: "border-yellow-500",
      features: ["Maximum Earnings", "No Income Limit", "Priority Support", "Premium Badge"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Unlock Earnings</h1>
        <p className="text-xs text-gray-400 mt-2">One Time Investment - Lifetime Earning</p>
      </div>

      <div className="space-y-6">
        {plans.map((plan, index) => {
          
          // Check Status for this specific plan
          const isPending = activeRequest?.planId === plan.id && activeRequest?.status === "pending";
          const isApproved = activeRequest?.planId === plan.id && activeRequest?.status === "approved";
          const isRejected = activeRequest?.planId === plan.id && activeRequest?.status === "rejected";

          return (
            <motion.div 
              key={plan.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative w-full bg-gradient-to-br ${plan.color} border ${plan.border} rounded-2xl p-6 shadow-2xl overflow-hidden`}
            >
              {/* Glossy Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full" />

              <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                          <plan.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                          <p className="text-[10px] text-gray-300">Validity: Lifetime</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <span className="text-2xl font-bold text-white">Rs. {plan.price}</span>
                  </div>
              </div>

              {/* Total Earning Highlight */}
              <div className="bg-black/30 rounded-lg p-3 mb-4 border border-white/5 text-center flex justify-between items-center px-4">
                  <p className="text-xs text-gray-300">Total Earning Potential</p>
                  <p className="text-lg font-bold text-green-400">{plan.totalEarning === "Unlimited" ? "Unlimited" : `Rs. ${plan.totalEarning}`}</p>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="text-green-400 w-4 h-4" />
                          <span className="text-xs text-gray-200">{feature}</span>
                      </div>
                  ))}
              </div>

              {/* --- DYNAMIC BUTTONS LOGIC --- */}
              
              {/* 1. APPROVED STATE */}
              {isApproved ? (
                <button disabled className="w-full py-3 bg-green-500/20 border border-green-500 text-green-400 font-bold rounded-xl cursor-default flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Current Active Plan
                </button>
              ) 
              
              // 2. PENDING STATE
              : isPending ? (
                <button disabled className="w-full py-3 bg-yellow-500/20 border border-yellow-500 text-yellow-400 font-bold rounded-xl cursor-wait flex items-center justify-center gap-2 animate-pulse">
                    <Clock className="w-5 h-5" /> Verification Pending...
                </button>
              ) 
              
              // 3. REJECTED STATE (Or Normal)
              : (
                <div>
                    <Link href={`/plans/${plan.id}?price=${plan.price}&name=${plan.name}`}>
                        <button className={`w-full py-3 font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2
                            ${isRejected ? "bg-red-600 text-white" : "bg-white text-black"}
                        `}>
                            {isRejected ? "Try Again (Re-Activate)" : "Activate Now"} <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                    
                    {/* Rejection Reason Message */}
                    {isRejected && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 bg-red-900/40 border border-red-500/50 p-3 rounded-lg flex items-start gap-2"
                        >
                            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-red-300">Request Declined</p>
                                <p className="text-[10px] text-gray-300">{activeRequest.reason || "Payment screenshot was unclear. Please upload again."}</p>
                            </div>
                        </motion.div>
                    )}
                </div>
              )}

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
