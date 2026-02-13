"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      localStorage.setItem("adminAuth", "true");
      toast.success("Welcome Boss!");
      router.push("/admin");
    } else {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded-2xl border border-white/20 w-80">
        <div className="flex justify-center mb-6"><Lock className="w-10 h-10 text-red-500" /></div>
        <h2 className="text-xl font-bold text-center mb-6">Admin Panel</h2>
        <input 
          type="text" placeholder="Username" className="w-full bg-black/50 p-3 rounded mb-3 border border-white/10"
          onChange={(e) => setForm({...form, username: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" className="w-full bg-black/50 p-3 rounded mb-4 border border-white/10"
          onChange={(e) => setForm({...form, password: e.target.value})}
        />
        <button className="w-full bg-red-600 py-3 rounded font-bold hover:bg-red-700">Enter</button>
      </form>
    </div>
  );
}
