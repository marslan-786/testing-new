"use client";
import { useState, useEffect, Suspense } from "react"; // Suspense zaroori hai searchParams ke liye
import { motion } from "framer-motion";
import { Mail, User, Lock, Loader2, ShieldCheck, Send, CheckCircle, XCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

// Inner Component for Logic
function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // Data State
  const [formData, setFormData] = useState({ 
    name: "", 
    username: "", 
    email: "", 
    password: "",
    code: "",
    referredBy: "" // New Field
  });

  // Auto-fill Referral Code from URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setFormData(prev => ({ ...prev, referredBy: refCode }));
    }
  }, [searchParams]);

  // Check States
  const [usernameStatus, setUsernameStatus] = useState(null); 
  const [emailStatus, setEmailStatus] = useState(null);

  // --- LIVE CHECK FUNCTION ---
  const checkAvailability = async (field, value) => {
    if (!value) return;
    if (field === "username") setUsernameStatus("checking");
    if (field === "email") setEmailStatus("checking");

    try {
      const res = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      const data = await res.json();

      if (field === "username") setUsernameStatus(data.exists ? "taken" : "available");
      if (field === "email") setEmailStatus(data.exists ? "taken" : "available");
    } catch (error) {
      console.error("Check failed", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.username.length > 2) checkAvailability("username", formData.username);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.username]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.email.includes("@") && formData.email.includes(".")) {
        checkAvailability("email", formData.email);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.email]);


  // Send Code Function
  const handleSendCode = async () => {
    if (!formData.email) return toast.error("Please enter email first!");
    if (emailStatus === "taken") return toast.error("Email already registered!");
    if (timer > 0) return toast.error(`Wait ${timer}s`);
    
    const toastId = toast.loading("Sending Code...");
    
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (res.ok) {
        toast.success("Code Sent!", { id: toastId });
        setCodeSent(true);
        setTimer(60);
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
    if (usernameStatus === "taken") return toast.error("Username unavailable");
    if (emailStatus === "taken") return toast.error("Email exists");
    if (!codeSent) return toast.error("Verify email first!");
    if (!formData.code) return toast.error("Enter verification code!");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Account Created!");
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
    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="text" placeholder="Full Name" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-purple-500 outline-none transition-all" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          {/* Username LIVE CHECK */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Username" 
              required 
              className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-10 text-sm outline-none transition-all
                ${usernameStatus === 'taken' ? 'border-red-500' : usernameStatus === 'available' ? 'border-green-500' : 'border-white/10 focus:border-purple-500'}
              `}
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
            <div className="absolute right-3 top-3.5">
              {usernameStatus === 'checking' && <Loader2 className="animate-spin h-5 w-5 text-gray-400" />}
              {usernameStatus === 'available' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {usernameStatus === 'taken' && <XCircle className="h-5 w-5 text-red-500" />}
            </div>
          </div>

          {/* Referral Code (Optional) */}
          <div className="relative group">
            <Share2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Referral Code (Optional)" 
              value={formData.referredBy}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-purple-500 outline-none transition-all" 
              onChange={(e) => setFormData({...formData, referredBy: e.target.value})} 
            />
          </div>

          {/* Email LIVE CHECK */}
          <div className="relative group">
            <div className="relative w-full flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-16 text-sm outline-none transition-all
                    ${emailStatus === 'taken' ? 'border-red-500' : emailStatus === 'available' ? 'border-green-500' : 'border-white/10 focus:border-purple-500'}
                  `}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    setCodeSent(false); setTimer(0);
                  }} 
                />
                <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
                  {emailStatus !== 'taken' && !codeSent && (
                     <button type="button" onClick={handleSendCode} disabled={timer > 0 || emailStatus !== 'available'} className="bg-white/10 hover:bg-purple-600/50 border border-white/10 rounded-lg px-3 py-1.5 transition-all disabled:opacity-50">
                        {timer > 0 ? <span className="text-xs font-mono">{timer}s</span> : <Send className="w-4 h-4 text-purple-400" />}
                     </button>
                  )}
                  {codeSent && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                </div>
            </div>
          </div>

          {/* Code Input */}
          {codeSent && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-green-500" />
                <input type="text" placeholder="Enter 6-digit Code" required className="w-full bg-black/40 border border-green-500/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-green-500 outline-none transition-all" onChange={(e) => setFormData({...formData, code: e.target.value})} />
              </div>
            </motion.div>
          )}

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input type="password" placeholder="Password" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-purple-500 outline-none transition-all" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Create Account"}
          </motion.button>

        </form>
        <p className="text-center text-gray-500 text-xs mt-6">Already have an account? <Link href="/login" className="text-purple-400 font-semibold">Login</Link></p>
    </div>
  );
}

// Wrapper for Suspense (Next.js Requirement)
export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
      <motion.img initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} src="/logo.png" alt="StoreX Logo" className="w-80 mb-8 drop-shadow-[0_0_15px_rgba(120,50,255,0.5)]" />
      
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
