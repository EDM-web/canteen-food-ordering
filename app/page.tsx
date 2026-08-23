// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { getAllCategory } from "@/features/admin/category/actions/get-all-category";
// import { getAllMenu } from "@/features/admin/menu/actions/get-all-menu";
// import CanteenMenuClient from "@/components/canteen-menu-client";
// import { protectUserRoute } from "@/lib/auth-guard";

// export default async function HomePage() {
//   const session = await protectUserRoute();
//   // undefined မဖြစ်စေရန် Empty Array (|| []) ထည့်ပေးထားပါသည်
//   const categories = (await getAllCategory()) || [];
//   const allMenu = (await getAllMenu()) || [];

//   return (
//     <div className="py-4 min-h-screen no-scrollbar">
//       <div className="space-y-8">
//         {/* 1. Hero Section */}
//         <section className="relative flex items-center bg-slate-900 shadow-xl rounded-2xl min-h-[280px] sm:min-h-[360px] overflow-hidden text-white">
//           <Image
//             src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
//             alt="Canteen Food Banner"
//             fill
//             priority
//             className="opacity-80 object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

//           <div className="z-10 relative space-y-3 p-6 sm:p-10 max-w-xl">
//             <Badge className="bg-orange-500/80 hover:bg-orange-500 backdrop-blur-sm px-3 py-1 border-none font-medium text-white text-xs">
//               CU Canteen
//             </Badge>
//             <h1 className="font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight">
//               Order Fresh & <br />
//               Delicious Meals
//             </h1>
//             <p className="text-slate-200 text-sm sm:text-base">
//               Skip the queue. Order your favorite food online and pick up
//               easily!
//             </p>
//           </div>
//         </section>

//         {/* 2. Interactive Menu Section (Category Bar + Filtered Menu Items) */}
//         <CanteenMenuClient categories={categories} initialMenu={allMenu} />
//       </div>
//     </div>
//   );
// }

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getAllCategory } from "@/features/admin/category/actions/get-all-category";
import { getAllMenu } from "@/features/admin/menu/actions/get-all-menu";
import CanteenMenuClient from "@/components/canteen-menu-client";
import { protectUserRoute } from "@/lib/auth-guard";
import {
  Clock,
  UtensilsCrossed,
  ShoppingBag,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { HeroSection } from "@/components/hero-section";

export default async function HomePage() {
  const session = await protectUserRoute();
  const categories = (await getAllCategory()) || [];
  const allMenu = (await getAllMenu()) || [];

  return (
    <div className="space-y-12 py-6 min-h-screen no-scrollbar">
      {/* 1. Enhanced Hero Section */}
      {/* <section className="relative flex items-center bg-slate-900 shadow-xl rounded-3xl min-h-[320px] sm:min-h-[400px] overflow-hidden text-white">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
          alt="Canteen Food Banner"
          fill
          priority
          className="opacity-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

        <div className="z-10 relative space-y-4 p-6 sm:p-12 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500 hover:bg-orange-600 px-3 py-1 border-none font-medium text-white text-xs">
              CU Canteen
            </Badge>
            <span className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md px-2.5 py-1 rounded-full font-medium text-emerald-400 text-xs">
              <span className="bg-emerald-400 rounded-full w-2 h-2 animate-pulse" />
              Open for Orders
            </span>
          </div>

          <h1 className="font-extrabold text-3xl sm:text-5xl leading-tight tracking-tight">
            Order Fresh & <br />
            <span className="text-orange-500">Delicious Meals</span>
          </h1>

          <p className="max-w-md text-slate-300 text-sm sm:text-base">
            Skip the long queue at the canteen. Order your favorite food online
            and pick up seamlessly when it's ready!
          </p>

          <div className="flex items-center gap-4 pt-2 text-slate-300 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>8:00 AM - 4:00 PM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4 text-orange-400" />
              <span>Freshly Prepared</span>
            </div>
          </div>
        </div>
      </section> */}
      <HeroSection />

      {/* 2. Canteen Order Steps Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 border border-slate-100 dark:border-slate-800 rounded-2xl">
        <div className="space-y-1 mb-8 text-center">
          <h2 className="font-bold text-orange-500 dark:text-slate-100 text-xl sm:text-2xl">
            How It Works
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Quick and easy steps to get your food
          </p>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-3 bg-background shadow-sm p-4 border border-slate-100 dark:border-slate-800 rounded-xl text-center">
            <div className="bg-orange-100/80 dark:bg-orange-950/50 p-3 rounded-full text-orange-500">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-orange-500 dark:text-slate-200 text-base">
              1. Browse Menu
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Explore daily available meals and choose your favorite food.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3 bg-background shadow-sm p-4 border border-slate-100 dark:border-slate-800 rounded-xl text-center">
            <div className="bg-orange-100/80 dark:bg-orange-950/50 p-3 rounded-full text-orange-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-orange-500 dark:text-slate-200 text-base">
              2. Place Order
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Add items to your cart and place your order directly online.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3 bg-background shadow-sm p-4 border border-slate-100 dark:border-slate-800 rounded-xl text-center">
            <div className="bg-orange-100/80 dark:bg-orange-950/50 p-3 rounded-full text-orange-500">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-orange-500 dark:text-slate-200 text-base">
              3. Quick Pickup
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Show your order status at the counter and pick up without waiting.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Interactive Menu Section */}
      <section>
        <CanteenMenuClient categories={categories} initialMenu={allMenu} />
      </section>
    </div>
  );
}

// import { getAllCategory } from "@/features/admin/category/actions/get-all-category";
// import { getAllMenu } from "@/features/admin/menu/actions/get-all-menu";
// import CanteenMenuClient from "@/components/canteen-menu-client";
// import { protectUserRoute } from "@/lib/auth-guard";
// import { HeroSection } from "@/components/hero-section";
// import { UtensilsCrossed, ShoppingBag, Zap } from "lucide-react";

// export default async function HomePage() {
//   const session = await protectUserRoute();
//   const categories = (await getAllCategory()) || [];
//   const allMenu = (await getAllMenu()) || [];

//   return (
//     <div className="space-y-12 py-6 min-h-screen">
//       {/* 1. Dynamic Auto-Slide Hero Section */}
//       <HeroSection isLoggedIn={!!session} />

//       {/* 2. Canteen Steps Section */}
//       <section className="bg-white/80 dark:bg-slate-900/60 shadow-sm backdrop-blur-md p-6 sm:p-8 border border-amber-100 dark:border-slate-800 rounded-3xl">
//         <div className="space-y-1 mb-8 text-center">
//           <h2 className="bg-clip-text bg-gradient-to-r from-orange-600 dark:from-orange-400 via-amber-600 to-orange-500 dark:to-amber-400 font-extrabold text-transparent text-2xl sm:text-3xl">
//             How It Works
//           </h2>
//           <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
//             3 simple steps to get your canteen order
//           </p>
//         </div>

//         <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
//           <div className="flex flex-col items-center space-y-3 bg-amber-50/50 dark:bg-slate-800/50 p-5 border border-amber-100/80 dark:border-slate-700/50 rounded-2xl text-center">
//             <div className="bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/20 p-3.5 rounded-2xl text-white">
//               <UtensilsCrossed className="w-6 h-6" />
//             </div>
//             <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
//               1. Browse Menu
//             </h3>
//             <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
//               Explore daily available meals and choose your favorite dish.
//             </p>
//           </div>

//           <div className="flex flex-col items-center space-y-3 bg-amber-50/50 dark:bg-slate-800/50 p-5 border border-amber-100/80 dark:border-slate-700/50 rounded-2xl text-center">
//             <div className="bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/20 p-3.5 rounded-2xl text-white">
//               <ShoppingBag className="w-6 h-6" />
//             </div>
//             <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
//               2. Place Order
//             </h3>
//             <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
//               Add items to your cart and confirm your order online.
//             </p>
//           </div>

//           <div className="flex flex-col items-center space-y-3 bg-amber-50/50 dark:bg-slate-800/50 p-5 border border-amber-100/80 dark:border-slate-700/50 rounded-2xl text-center">
//             <div className="bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/20 p-3.5 rounded-2xl text-white">
//               <Zap className="w-6 h-6" />
//             </div>
//             <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
//               3. Fast Pickup
//             </h3>
//             <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
//               Show your order at the counter and pick up without waiting.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* 3. Interactive Menu Section */}
//       <section className="space-y-6">
//         <div className="flex justify-between items-end pb-4 border-slate-200 dark:border-slate-800 border-b">
//           <div className="space-y-1">
//             <h2 className="bg-clip-text bg-gradient-to-r from-orange-600 dark:from-orange-400 via-amber-500 to-orange-500 dark:to-amber-300 font-extrabold text-transparent text-2xl sm:text-3xl tracking-tight">
//               Today's Menu
//             </h2>
//             <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
//               Select a category to filter available dishes
//             </p>
//           </div>
//         </div>

//         <CanteenMenuClient categories={categories} initialMenu={allMenu} />
//       </section>
//     </div>
//   );
// }
