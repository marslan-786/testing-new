import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import BottomNav from "@/components/BottomNav"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StoreX - VIP Earning",
  description: "Secure & Fast Earning Platform",
  manifest: "/manifest.webmanifest", // PWA Link
  icons: {
    icon: "/logo.png", // Browser Tab Icon
    shortcut: "/logo.png",
    apple: "/logo.png", // iPhone ke liye icon
  },
  themeColor: "#0a0a0a", // Mobile header color
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Taake app zoom na ho, real app lage
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <BottomNav />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
