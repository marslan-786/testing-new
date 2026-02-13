"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, Lock, Loader2, ShieldCheck, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // Data State
  const [formData, setFormData] = useState({ 
    name: "", 
    username: "", 
    email: "", 
    password: "",
    code: "" // Code ab yahan save hoga
  });

  // Send Code Function
  const handleSendCode = async () => {
    if (!formData.email) return toast.error("Please enter email first!");
    if (timer > 0) return toast.error(`Wait ${timer}s before resending`);
    
    const toastId = toast.loading("Sending Code...");
    
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (res.ok) {
        toast.success("Code Sent to Email!", { id: toastId });
        setCodeSent(true);
        setTimer(60);
        // Countdown Timer Logic
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) clearInterval(interval);
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error("Failed to send code", { id: toastId });
      }
    } catch (error) {
      toast.error("Error sending code", { id: toastId });
    }
  };

  // Register Function
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!codeSent) return toast.error("Please verify email first!");
    if (!formData.code) return toast.error("Please enter verification code!");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Account Created Successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

      {/* BIG LOGO */}
      <motion.img 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        src="/logo.png" 
        alt="StoreX Logo" 
        className="w-80 mb-8 drop-shadow-[0_0_15px_rgba(120,50,255,0.5)]"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10"
      >
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="text" placeholder="Full Name" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-purple-500 outline-none transition-all" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          {/* Username */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="text" placeholder="Username" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-purple-500 outline-none transition-all" onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>

          {/* Email + Send Button */}
          <div className="relative group flex gap-2">
            <div className="relative w-full">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                <input type="email" placeholder="Email Address" required disabled={codeSent} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-purple-500 outline-none transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            
            <button 
                type="button" 
                onClick={handleSendCode} 
                disabled={timer > 0 || codeSent}
                className="bg-white/10 hover:bg-purple-600/50 border border-white/10 rounded-xl px-4 flex items-center justify-center transition-all"
            >
                {timer > 0 ? <span className="text-xs font-mono">{timer}s</span> : <Send className="w-5 h-5 text-purple-400" />}
            </button>
          </div>

          {/* NEW: Code Input (Only shows after sending email) */}
          {codeSent && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-green-500" />
                <input 
                    type="text" 
                    placeholder="Enter 6-digit Code" 
                    required
                    className="w-full bg-black/40 border border-green-500/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-green-500 outline-none transition-all" 
                    onChange={(e) => setFormData({...formData, code: e.target.value})} 
                />
              </div>
            </motion.div>
          )}

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="password" placeholder="Password" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-purple-500 outline-none transition-all" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          {/* Register Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Create Account"}
          </motion.button>

        </form>
        <p className="text-center text-gray-500 text-xs mt-6">Already have an account? <Link href="/login" className="text-purple-400 font-semibold">Login</Link></p>
      </motion.div>
    </div>
  );
}
