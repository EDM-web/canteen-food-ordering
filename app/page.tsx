import { getAllCategory } from "@/features/admin/category/actions/get-all-category";
import { getAllMenu } from "@/features/admin/menu/actions/get-all-menu";
import CanteenMenuClient from "@/components/canteen-menu-client";
import { protectUserRoute } from "@/lib/auth-guard";
import { UtensilsCrossed, ShoppingBag, Zap } from "lucide-react";
import { HeroSection } from "@/components/hero-section";

export default async function HomePage() {
  const session = await protectUserRoute();
  const categories = (await getAllCategory()) || [];
  const allMenu = (await getAllMenu()) || [];

  return (
    <div className="space-y-12 py-6 min-h-screen no-scrollbar">
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
        <CanteenMenuClient
          categories={categories}
          initialMenu={allMenu}
          hasSession={!!session?.user}
        />
      </section>
    </div>
  );
}
