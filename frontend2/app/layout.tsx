import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamVerse - Video Streaming Platform",
  description: "Stream and share your videos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ Wrap whole app with AuthProvider */}
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
