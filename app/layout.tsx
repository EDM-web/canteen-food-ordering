import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AuthToastListener } from "@/components/auth-toast-listener";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CU Canteen",
  description: "Developed by CU group",
};

async function UTSSR() {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentSession = await auth.api.getSession({
    headers: await headers(),
  });

  // User ရဲ့ Role သည် Admin ဟုတ်မဟုတ် စစ်ဆေးခြင်း
  const isAdmin = currentSession?.user?.role === "Admin";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="flex flex-col px-0 min-h-full">
        {/* <body className="flex flex-col bg-amber-50/40 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 antialiased transition-colors"> */}
        <Suspense>
          <UTSSR />
        </Suspense>
        <TooltipProvider>
          <Suspense fallback={null}>
            <AuthToastListener />
          </Suspense>
          {!isAdmin && <Navbar />}

          {/* Main Content Area */}
          <main
            className={cn(!isAdmin && "mx-auto px-4 md:px-0 py-4 container")}
          >
            {children}

            <Toaster richColors={true} />
          </main>
          {!isAdmin && <Footer />}
        </TooltipProvider>
      </body>
    </html>
  );
}
