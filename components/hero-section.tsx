"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { menuPath, signUpPath } from "@/lib/path";
import { Clock, UtensilsCrossed, ArrowRight } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80",
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // 4 စက္ကန့်တိုင်း ပုံပြောင်းမည်
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex items-center bg-slate-800 shadow-2xl shadow-orange-500/10 border-orange-500/20 border-none rounded-3xl min-h-[360px] sm:min-h-[440px] overflow-hidden text-white">
      {/* Background Images with Crossfade */}
      {HERO_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt="Canteen Food Banner"
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex
              ? "opacity-85 scale-105"
              : "opacity-0 scale-100"
          } transition-transform duration-10000`}
        />
      ))}

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      {/* Hero Content */}
      <div className="z-10 relative space-y-5 p-6 sm:p-12 max-w-2xl">
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-orange-500 hover:from-orange-600 to-amber-500 hover:to-amber-600 shadow-md shadow-orange-500/30 px-3 py-1 border-none font-semibold text-white text-xs">
            CU Canteen
          </Badge>
        </div>

        <h1 className="font-black text-3xl sm:text-5xl leading-tight tracking-tight">
          Order Fresh & <br />
          <span className="bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 text-transparent">
            Delicious Foods
          </span>
        </h1>

        <p className="max-w-md text-slate-300 text-sm sm:text-base leading-relaxed">
          Skip the long queue at the canteen. Place your order online and pick
          up seamlessly when your food is ready!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-orange-500 hover:from-orange-600 to-amber-500 hover:to-amber-600 shadow-lg shadow-orange-500/30 border-none font-semibold text-white cursor-pointer"
            asChild
          >
            <Link href={menuPath}>
              Explore Menu
              <ArrowRight className="ml-2 w-4 h-4 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Info Badges */}
        {/* <div className="flex items-center gap-6 pt-4 text-slate-300 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>8:00 AM - 4:00 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>Freshly Prepared Daily</span>
          </div>
        </div> */}
      </div>
    </section>
  );
}
