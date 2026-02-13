"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });

  // Simulate Code Sending (for UI flow)
  const handleSendCode = () => {
    if (!formData.email) return toast.error("Please enter email!");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCodeSent(true);
      toast.success("Verification code sent!");
    }, 2000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
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
      
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

      {/* LOGO (Outside Card) */}
      <motion.img 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        src="/logo.png" 
        alt="StoreX Logo" 
        className="w-80 mb-8 drop-shadow-[0_0_15px_rgba(120,50,255,0.5)]"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10"
      >
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="text" placeholder="Full Name" required className="input-field w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="text" placeholder="Username" required className="input-field w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm" onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="email" placeholder="Email Address" required disabled={codeSent} className="input-field w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-28 text-sm" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <button type="button" onClick={handleSendCode} disabled={loading || codeSent} className="absolute right-1 top-1 bottom-1 bg-white/10 px-3 rounded-lg text-xs hover:bg-white/20 transition-all">{loading ? <Loader2 className="animate-spin h-4 w-4"/> : codeSent ? "Sent" : "Verify"}</button>
          </div>

          {codeSent && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-green-500" />
                <input type="text" placeholder="Enter Code" className="w-full bg-black/40 border border-green-500/50 rounded-xl py-3 pl-10 text-sm" />
              </div>
            </motion.div>
          )}

          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="password" placeholder="Password" required className="input-field w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2">Register</motion.button>
        </form>
        <p className="text-center text-gray-500 text-xs mt-6">Already have an account? <Link href="/login" className="text-purple-400 font-semibold">Login</Link></p>
      </motion.div>
    </div>
  );
}
