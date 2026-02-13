"use client";
import { useState, useEffect } from "react";
import { Lock, Copy, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function Referrals() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://storex.com/signup?ref=${user.username}`);
    toast.success("Link Copied!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      <h1 className="text-2xl font-bold mb-6">My Team</h1>

      {/* Referral Link Card */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 relative overflow-hidden">
        
        {!user.isPlanActive && (
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 text-center">
                 <Lock className="w-10 h-10 text-red-500 mb-2" />
                 <h3 className="font-bold text-red-400">Referral Link Locked</h3>
                 <p className="text-xs text-gray-400">Activate VIP Plan to unlock your referral link.</p>
             </div>
        )}

        <p className="text-sm text-gray-400 mb-2">Your Referral Link</p>
        <div className="flex items-center gap-2 bg-black/50 p-3 rounded-xl border border-white/5">
            <span className="text-xs text-purple-300 truncate flex-1">
                https://storex.com/signup?ref={user.username}
            </span>
            <button onClick={handleCopy}>
                <Copy className="w-4 h-4 text-white hover:text-purple-400" />
            </button>
        </div>
      </div>

      {/* Referrals List Tabs */}
      <div className="flex gap-4 mb-4 border-b border-white/10 pb-2">
          <button className="text-purple-400 text-sm font-bold border-b-2 border-purple-400 pb-1">Direct Team</button>
          <button className="text-gray-500 text-sm font-bold pb-1">Indirect Team</button>
      </div>

      {/* List Placeholder */}
      <div className="flex flex-col items-center justify-center h-40 text-gray-600">
        <Users className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs">No referrals found yet.</p>
      </div>
    </div>
  );
        }
        
