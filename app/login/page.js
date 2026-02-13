"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message); // VIP Toast
        localStorage.setItem("user", JSON.stringify(data.user)); // Save Session
        setTimeout(() => router.push("/"), 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

      {/* LOGO (Outside Card) */}
      <motion.img 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        src="/logo.png" 
        alt="StoreX Logo" 
        className="w-48 mb-8 drop-shadow-[0_0_15px_rgba(120,50,255,0.5)]"
      />

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10"
      >
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-all text-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-all text-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Login Now <ArrowRight className="h-4 w-4" /></>}
          </motion.button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Don't have an account? <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
