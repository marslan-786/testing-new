"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, Lock, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    verificationCode: "",
    password: "",
  });

  // Function to Send Email via API
  const handleSendCode = async () => {
    if (!formData.email) return alert("Please enter email first!");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setCodeSent(true);
        alert("Code sent to your email!");
      } else {
        alert("Error sending code");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StoreX
          </h1>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Join the Revolution</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* Full Name */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-all text-sm placeholder-gray-600"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Username */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-all text-sm placeholder-gray-600"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          {/* Email with Send Code Button */}
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-28 focus:outline-none focus:border-purple-500 transition-all text-sm placeholder-gray-600"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={codeSent} // Email lock after code sent
            />
            
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || codeSent}
              className={`absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1
                ${codeSent ? 'bg-green-500/20 text-green-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white'}`}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : codeSent ? "Sent ✓" : "Send Code"}
            </button>
          </div>

          {/* Verification Code Input (Hidden Initially) */}
          {codeSent && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              className="relative group"
            >
              <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-green-500" />
              <input
                type="text"
                placeholder="Enter 6-digit Code"
                className="w-full bg-black/40 border border-green-500/50 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-green-500 transition-all text-sm placeholder-gray-600"
                onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
              />
            </motion.div>
          )}

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-purple-500 transition-all text-sm placeholder-gray-600"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 mt-4 flex items-center justify-center gap-2"
          >
            Create Account <ArrowRight className="h-4 w-4" />
          </motion.button>

        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}
