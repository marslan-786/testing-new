import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import BottomNav from "@/components/BottomNav"; // Import zaroori hai

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StoreX - VIP Earning",
  description: "Secure & Fast Earning Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <BottomNav /> {/* Ye line lazmi honi chahiye */}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
