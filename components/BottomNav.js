"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, Users, UserCircle } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // --- HIDE NAV LOGIC ---
  // 1. Login/Signup pe mat dikhao
  // 2. Admin Panel ke kisi bhi page (/admin, /admin/login etc) pe mat dikhao
  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Plans", icon: Zap, path: "/plans" },
    { name: "Team", icon: Users, path: "/referrals" },
    { name: "Profile", icon: UserCircle, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-white/10 p-3 z-50 pb-safe">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "text-purple-500 scale-110" : "text-gray-500 hover:text-gray-300"}`}>
                <item.icon className={`w-6 h-6 ${isActive ? "fill-current/20" : ""}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
    }

