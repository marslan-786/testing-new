"use client";
import { motion } from "framer-motion";
import { CheckCircle, Crown, Shield, Zap, Users, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function Plans() {

  const plans = [
    {
      id: 1,
      name: "Student Plan",
      price: 500,
      limit: "2,500", // Max Earning Limit
      icon: Shield,
      color: "from-gray-800 to-gray-900",
      border: "border-gray-600",
      // Only Referral & VIP features
      features: [
        { text: "Direct Bonus: Rs. 150", highlight: true },
        { text: "Indirect Bonus: Rs. 40", highlight: false },
        { text: "Withdraw Limit: Rs. 2,500", highlight: false },
        { text: "Standard Support", highlight: false }
      ]
    },
    {
      id: 2,
      name: "Professional",
      price: 1000,
      limit: "10,000",
      icon: Zap,
      color: "from-blue-900 to-blue-800",
      border: "border-blue-500",
      features: [
        { text: "Direct Bonus: Rs. 350", highlight: true },
        { text: "Indirect Bonus: Rs. 80", highlight: false },
        { text: "Withdraw Limit: Rs. 10,000", highlight: false },
        { text: "Fast Withdrawal Approval", highlight: true }
      ]
    },
    {
      id: 3,
      name: "StoreX VIP",
      price: 2000,
      limit: "Unlimited",
      icon: Crown,
      color: "from-yellow-700 to-yellow-900",
      border: "border-yellow-500",
      features: [
        { text: "Direct Bonus: Rs. 800", highlight: true },
        { text: "Indirect Bonus: Rs. 200", highlight: false },
        { text: "No Withdrawal Limits", highlight: true },
        { text: "Instant Priority Support", highlight: true },
        { text: "Premium Badge", highlight: false }
      ]
    }
  ];

  const handleSubscribe = (planName) => {
    toast.success(`Request for ${planName} Plan Sent!`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Unlock Earnings</h1>
        <p className="text-xs text-gray-400 mt-2">One Time Investment - Lifetime Earning</p>
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

            {/* Features List */}
            <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                        {feature.highlight ? 
                            <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" /> : 
                            <CheckCircle className="text-green-400 w-4 h-4" />
                        }
                        <span className={`text-xs ${feature.highlight ? "text-white font-bold" : "text-gray-300"}`}>
                            {feature.text}
                        </span>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => handleSubscribe(plan.name)}
                className="w-full py-3 bg-white text-black font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2"
            >
                Activate Now <Users className="w-4 h-4" />
            </button>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
