"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Copy, UploadCloud, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get("name");
  const planPrice = searchParams.get("price");

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [trxId, setTrxId] = useState("");

  // --- ADMIN ACCOUNT DETAILS (Fake for now) ---
  const adminAccount = {
    bank: "SadaPay",
    name: "Muhammad Ali", // Fake Name
    number: "0300 1234567", // Fake Number
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5LY00sKvg1smaAPky_8r3NWoc7xrhDjIfhy1CwD8eRg&s=10"
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(adminAccount.number);
    toast.success("Account Number Copied!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // In real app, upload to Cloudinary/Firebase here
      toast.success("Screenshot Selected!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !trxId) return toast.error("Please provide Trx ID & Screenshot");
    
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      // Save Pending Status to LocalStorage (Temporary) or DB
      const pendingPlan = { name: planName, price: planPrice, status: "pending", date: new Date().toISOString() };
      localStorage.setItem("pendingPlan", JSON.stringify(pendingPlan));
      
      toast.success("Request Submitted! Waiting for Approval.");
      router.push("/plans"); // Back to Plans Page
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-5 pb-24">
        {/* Header */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <h1 className="text-2xl font-bold mb-2">Activate {planName}</h1>
        <p className="text-gray-400 text-xs mb-6">Send <span className="text-green-400 font-bold">Rs. {planPrice}</span> to the account below</p>

        {/* Admin Account Card */}
        <div className="bg-gradient-to-r from-teal-900/40 to-black border border-teal-500/30 p-6 rounded-2xl mb-8 flex flex-col items-center text-center relative overflow-hidden">
            <img src={adminAccount.logo} className="w-16 h-16 rounded-full mb-3 border-2 border-white/10" />
            <h2 className="text-xl font-bold">{adminAccount.bank}</h2>
            <p className="text-sm text-gray-300 mt-1">{adminAccount.name}</p>
            
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl mt-4 border border-white/10">
                <span className="font-mono text-lg font-bold tracking-wider">{adminAccount.number}</span>
                <button onClick={handleCopy}><Copy className="w-4 h-4 text-gray-400 hover:text-white" /></button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Tap copy icon to copy number</p>
        </div>

        {/* Proof Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Trx ID Input */}
            <div>
                <label className="text-xs text-gray-500 ml-2 mb-1 block">Transaction ID (Trx ID)</label>
                <input 
                    type="text" 
                    placeholder="e.g. 8234XXXXXXX" 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-purple-500 transition-all"
                    onChange={(e) => setTrxId(e.target.value)}
                />
            </div>

            {/* Screenshot Upload */}
            <div>
                <label className="text-xs text-gray-500 ml-2 mb-1 block">Payment Screenshot</label>
                <label className="w-full h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all">
                    {image ? (
                        <div className="flex flex-col items-center text-green-400">
                            <CheckCircle className="w-8 h-8 mb-2" />
                            <span className="text-xs">{image.name.substring(0, 20)}...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <UploadCloud className="w-8 h-8 mb-2" />
                            <span className="text-xs">Tap to Upload</span>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
            </div>

            <button disabled={loading} className="w-full py-4 bg-purple-600 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : "Submit Payment Proof"}
            </button>
        </form>
    </div>
  );
}
