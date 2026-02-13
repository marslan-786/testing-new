"use client";
import { useState, useEffect } from "react";
import { Lock, Copy, Users, UserCheck, UserX, Crown, Zap, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Referrals() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("direct"); // direct | rewards
  const router = useRouter();

  // Load User Data with Team
  useEffect(() => {
    const fetchTeam = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return router.push("/login");

      const localData = JSON.parse(storedUser);
      
      try {
        const res = await fetch(`/api/user/profile?email=${localData.email}`);
        const data = await res.json();
        if (data.success) {
            setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to load team");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleCopy = () => {
    if(user) {
        // Dynamic Origin handle karne ke liye
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        navigator.clipboard.writeText(`${origin}/signup?ref=${user.username}`);
        toast.success("Link Copied!");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading Team...</div>;
  if (!user) return null;

  const isPlanActive = user.plan?.isActive;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
      <h1 className="text-2xl font-bold mb-6">My Team</h1>

      {/* Referral Link Card */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 relative overflow-hidden group">
        
        {!isPlanActive && (
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-4 text-center">
                 <Lock className="w-10 h-10 text-red-500 mb-2" />
                 <h3 className="font-bold text-red-400">Link Locked</h3>
                 <p className="text-xs text-gray-400 mt-1">Activate any plan to unlock your referral link & start earning.</p>
             </div>
        )}

        <p className="text-sm text-gray-400 mb-2">Your Invite Link</p>
        <div className="flex items-center gap-2 bg-black/50 p-3 rounded-xl border border-white/5 group-hover:border-purple-500/30 transition-all">
            <span className="text-xs text-purple-300 truncate flex-1 font-mono">
                {user.username ? `https://storex.com/signup?ref=${user.username}` : 'Loading...'}
            </span>
            <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg">
                <Copy className="w-4 h-4 text-white hover:text-purple-400" />
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10">
          <button 
            onClick={() => setActiveTab("direct")}
            className={`pb-2 text-sm font-bold transition-all ${activeTab === 'direct' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}
          >
            Team List
          </button>
          <button 
            onClick={() => setActiveTab("rewards")}
            className={`pb-2 text-sm font-bold transition-all ${activeTab === 'rewards' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}
          >
            Reward Info
          </button>
      </div>

      {/* --- TAB 1: TEAM LIST --- */}
      {activeTab === "direct" && (
        <div className="space-y-3">
            {/* Stats */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-white/5 p-3 rounded-xl text-center">
                    <p className="text-xs text-gray-400">Total Members</p>
                    <p className="text-xl font-bold">{user.directTeam ? user.directTeam.length : 0}</p>
                </div>
                <div className="flex-1 bg-white/5 p-3 rounded-xl text-center">
                    <p className="text-xs text-gray-400">Active</p>
                    <p className="text-xl font-bold text-green-400">
                        {user.directTeam ? user.directTeam.filter(m => m.activationStatus).length : 0}
                    </p>
                </div>
            </div>

            {user.directTeam && user.directTeam.length > 0 ? (
                user.directTeam.map((member, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm 
                                ${member.activationStatus ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                {member.username[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold">@{member.username}</p>
                                <p className="text-[10px] text-gray-500">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        {member.activationStatus ? (
                            <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                                <UserCheck className="w-3 h-3" /> Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                <UserX className="w-3 h-3" /> Inactive
                            </span>
                        )}
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-600 border-2 border-dashed border-white/10 rounded-2xl">
                    <Users className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs">No team members yet.</p>
                </div>
            )}
        </div>
      )}

      {/* --- TAB 2: REWARD INFO --- */}
      {activeTab === "rewards" && (
          <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <h3 className="font-bold text-white">Student Plan</h3>
                  </div>
                  <div className="flex justify-between text-sm mt-2 border-t border-gray-600 pt-2">
                      <span className="text-gray-400">Direct Reward</span>
                      <span className="text-green-400 font-bold">Rs. 150</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Indirect Reward</span>
                      <span className="text-purple-400 font-bold">Rs. 50</span>
                  </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded-xl border border-blue-600">
                  <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-300" />
                      <h3 className="font-bold text-white">Professional Plan</h3>
                  </div>
                  <div className="flex justify-between text-sm mt-2 border-t border-blue-500 pt-2">
                      <span className="text-blue-200">Direct Reward</span>
                      <span className="text-green-300 font-bold">Rs. 300</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                      <span className="text-blue-200">Indirect Reward</span>
                      <span className="text-purple-300 font-bold">Rs. 100</span>
                  </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-700 to-yellow-900 p-4 rounded-xl border border-yellow-500">
                  <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-300" />
                      <h3 className="font-bold text-white">VIP Plan</h3>
                  </div>
                  <div className="flex justify-between text-sm mt-2 border-t border-yellow-600 pt-2">
                      <span className="text-yellow-100">Direct Reward</span>
                      <span className="text-white font-bold">Rs. 500</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                      <span className="text-yellow-100">Indirect Reward</span>
                      <span className="text-white font-bold">Rs. 150</span>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
