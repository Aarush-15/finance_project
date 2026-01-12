import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Gullak",
  description: "One stop finance platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" >
      <body
        className={`${inter.className}`}
      >
        {/* header */}
        <Header/>
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster richColors/>
        {/* footer */}
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
