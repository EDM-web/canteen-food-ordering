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
}

export function AddToCartButton({
  paramId,
  id,
  name,
  price,
  image,
  imageUrl,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Better-Auth (သို့မဟုတ် သင်သုံးထားသော Auth Library) မှ Session ယူခြင်း
  const { data: session, isPending } = authClient.useSession();

  const handleAddToCart = () => {
    // ၁။ Session Loading ဖြစ်နေစဉ် နှိပ်ပါက မလိုလားအပ်သည်များ မဖြစ်အောင် တားဆီးခြင်း
    if (isPending) return;

    // ၂။ Session / User မရှိပါက Toast ပြပြီး Sign-in Page သို့ လမ်းကြောင်းလွှဲခြင်း
    if (!session?.user) {
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
      {paramId ? (
        <Button
          onClick={handleAddToCart}
          // disabled={isPending}
          className="bg-orange-100/50 hover:bg-orange-100 shadow-none px-6 py-2.5 border-none rounded-md h-auto font-semibold text-orange-500 text-xs transition-colors cursor-pointer"
        >
          <PlusIcon /> {isPending ? "Add to cart" : "Add to cart"}
        </Button>
      ) : (
        <Button
          onClick={handleAddToCart}
          // disabled={isPending}
          className="bg-orange-100/50 hover:bg-orange-100 shadow-none px-2 py-1.5 border-none rounded-md h-auto font-semibold text-orange-500 text-xs transition-colors cursor-pointer"
        >
          <PlusIcon /> {isPending ? "Add" : "Add"}
        </Button>
      )}
    </>
  );
}
