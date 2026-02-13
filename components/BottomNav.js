"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, Users, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Plans", icon: Zap, path: "/plans" },
    { name: "Team", icon: Users, path: "/referrals" },
    { name: "Profile", icon: Settings, path: "/profile" },
  ];

  // Don't show nav on login/signup pages
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 p-4 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-purple-400 scale-110" : "text-gray-500 hover:text-gray-300"}`}>
                <item.icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
    }
        
