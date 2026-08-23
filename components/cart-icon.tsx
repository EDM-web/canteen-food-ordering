"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { checkoutPath } from "@/lib/path";

export function CartIcon() {
  const { totalCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href={checkoutPath}
      className="inline-flex relative justify-center items-center p-2 rounded-full transition"
    >
      <ShoppingCartIcon className="w-5 md:w-6 h-5 md:h-6 text-gray-700" />

      {/* Badge ကို Icon ရဲ့ ညာဘက်အပေါ် ထောင့်မှာ တိတိကျကျ ကပ်ထားခြင်း */}
      {mounted && totalCount > 0 && (
        <span className="-top-1 -right-1 absolute flex justify-center items-center bg-orange-500 p-2.5 border-2 border-white rounded-full w-4 h-4 font-bold text-[10px] text-white animate-in zoom-in-50">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
