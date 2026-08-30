"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { signInPath } from "@/lib/path";
import { PlusIcon } from "lucide-react";

interface AddToCartButtonProps {
  paramId?: string; //to check add to cart text from "add" to "add to cart"
  id: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  hasSession?: boolean;
}

export function AddToCartButton({
  paramId,
  id,
  name,
  price,
  image,
  imageUrl,
  hasSession,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!hasSession) {
      toast.error("Please sign in to add items to your cart");
      router.push(signInPath);
      return;
    }

    // ၃။ Session ရှိပါက Cart ထဲသို့ ပစ္စည်းထည့်ခြင်း
    addToCart({ menuItemId: id, name, price, image, imageUrl });
    toast.success(`${name} added to cart!`);
  };

  return (
    <>
      <Button
        onClick={handleAddToCart}
        // disabled={isPending}
        className="bg-orange-100/50 hover:bg-orange-100 shadow-none px-6 py-2.5 border-none rounded-md h-auto font-semibold text-orange-500 text-xs transition-colors cursor-pointer"
      >
        <PlusIcon /> {paramId ? "Add to Cart" : "Add"}
      </Button>
    </>
  );
}
