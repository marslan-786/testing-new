"use client";
import { motion } from "framer-motion";
import { CheckCircle, Crown, Shield, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function Plans() {

  const plans = [
    {
      id: 1,
      name: "Starter",
      price: 500,
      limit: "2,500",
      icon: Shield,
      color: "from-gray-700 to-gray-900", // Silver/Dark look
      border: "border-gray-500",
      features: ["Daily Ads", "Direct Bonus", "Withdraw Limit: Rs. 2,500"]
    },
    {
      id: 2,
      name: "Pro Plus",
      price: 1000,
      limit: "10,000",
      icon: Zap,
      color: "from-blue-900 to-blue-700", // Blue look
      border: "border-blue-500",
      features: ["Higher Ads Rate", "Team Bonus", "Withdraw Limit: Rs. 10,000"]
    },
    {
      id: 3,
      name: "StoreX VIP",
      price: 2000,
      limit: "Unlimited",
      icon: Crown,
      color: "from-yellow-600 to-yellow-800", // Gold look
      border: "border-yellow-400",
      features: ["Max Earnings", "Priority Support", "No Withdraw Limit", "Instant Approval"]
    }
  ];

  const handleSubscribe = (planName) => {
    // Yahan baad mein payment gateway lagega
    toast.success(`Request for ${planName} Plan Sent!`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Choose Plan</h1>
        <p className="text-xs text-gray-400 mt-2">Upgrade to unlock higher earning limits</p>
      </div>

      <div className="space-y-6">
        {plans.map((plan, index) => (
          <motion.div 
            key={plan.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative w-full bg-gradient-to-br ${plan.color} border ${plan.border} rounded-2xl p-6 shadow-2xl overflow-hidden`}
          >
            {/* Background Glow */}
            <div className="absolute top-[-50%] right-[-50%] w-40 h-40 bg-white/10 blur-[60px] rounded-full" />

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

            {/* Earning Limit Highlight */}
            <div className="bg-black/30 rounded-lg p-3 mb-4 border border-white/5 text-center">
                <p className="text-xs text-gray-300">Earning Limit</p>
                <p className="text-lg font-bold text-green-400">Rs. {plan.limit}</p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="text-green-400 w-4 h-4" />
                        <span className="text-xs text-gray-200">{feature}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => handleSubscribe(plan.name)}
                className="w-full py-3 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all text-sm"
            >
                Activate {plan.name}
            </button>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
