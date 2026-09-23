import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "LegalClarity AI - Understand, Analyze & Compare Legal Documents",
  description:
    "AI-powered legal document understanding, risk and clause detection, actionable checklists, contract comparison, and lawyer preparation assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0d0f13] text-slate-100 antialiased selection:bg-indigo-600 selection:text-white flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
