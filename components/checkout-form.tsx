"use client";

import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useActionState, startTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, Utensils, ArrowRight, ArrowLeft } from "lucide-react";
import { placeOrderAction } from "@/features/admin/order/actions/admin-order-actions";
import { menuPath } from "@/lib/path";
import Image from "next/image";
import { toast } from "sonner"; // Shadcn Sonner toast (သို့မဟုတ် @/components/ui/use-toast)

export default function CheckOutForm({ userId }: { userId: string }) {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount } =
    useCart();
  const router = useRouter();

  // Server action wrapper with useActionState
  const handleCheckoutAction = async (prevState: any, formData: FormData) => {
    if (cart.length === 0) return { success: false, error: "Cart is empty" };

    const result = await placeOrderAction({
      userId,
      totalAmount,
      items: cart,
    });

    if (result.success) {
      toast.success("Order Placed Successfully!");
      clearCart();
      router.push(`/order/${result.orderId}`);
    } else {
      toast.error("Order Failed");
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(
    handleCheckoutAction,
    null
  );

  if (cart.length === 0) {
    return (
      <div className="space-y-4 mx-auto p-8 max-w-md h-screen text-center container">
        <h1 className="font-bold text-orange-500 text-2xl">
          Your Cart is Empty
        </h1>
        <p className="text-slate-500">
          Looks like you haven't added anything yet.
        </p>
        <Button
          size={"lg"}
          asChild
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Link href={menuPath}>Start Ordering</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl container">
      {/* Title Header */}
      <div>
        <p className="font-bold text-orange-500 text-xs uppercase tracking-wider">
          YOUR ORDER
        </p>
        <h1 className="font-serif font-bold text-slate-900 text-4xl sm:text-5xl">
          Your <span className="text-orange-500">cart.</span>
        </h1>
      </div>

      {state?.error && (
        <div className="bg-rose-50 p-3 rounded-lg text-rose-600 text-sm">
          {state.error}
        </div>
      )}

      {/* Grid Layout (Side-by-Side) */}
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 bg-white p-6 border border-slate-300/80 rounded-2xl">
          <div className="divide-y divide-slate-100">
            {cart.map((item) => {
              const itemImg = item.image || item.imageUrl;

              return (
                <div
                  key={item.menuItemId}
                  className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0 bg-slate-100 rounded-xl w-16 h-16 overflow-hidden">
                      {itemImg ? (
                        <Image
                          src={itemImg}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex justify-center items-center h-full text-slate-400">
                          <Utensils className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-900 text-base">
                        {item.name}
                      </h3>
                      <p className="font-medium text-slate-600 text-sm">
                        {item.price} Ks
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex justify-between sm:justify-end items-center gap-4">
                    <div className="flex items-center bg-slate-50 p-1 border border-slate-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity - 1)
                        }
                        className="flex justify-center items-center hover:bg-slate-200/60 rounded-md w-7 h-7 font-semibold text-slate-600 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 font-semibold text-slate-800 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity + 1)
                        }
                        className="flex justify-center items-center hover:bg-slate-200/60 rounded-md w-7 h-7 font-semibold text-slate-600 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <span className="min-w-[70px] font-bold text-slate-900 text-sm text-right">
                      {item.price * item.quantity} Ks
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="bg-rose-50 hover:bg-rose-100 p-2 rounded-lg text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-4 lg:col-span-5">
          <div className="space-y-6 bg-white p-6 border border-slate-300/80 rounded-2xl">
            <h2 className="font-bold text-slate-900 text-lg">Order summary</h2>

            <div className="space-y-3 text-sm">
              {cart.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex justify-between items-center text-slate-600"
                >
                  <span className="max-w-[200px] leading-loose">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-slate-900">
                    {item.price * item.quantity} Ks
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 font-bold text-slate-900 text-lg">
                <span>Total</span>
                <span className="text-orange-500 text-2xl">
                  {totalAmount} Ks
                </span>
              </div>
            </div>

            {/* Actions wrapped with form / useActionState */}
            <form
              action={formAction}
              onSubmit={(e) => {
                // optional custom validation if needed
              }}
              className="space-y-3 pt-2"
            >
              <Button
                type="submit"
                disabled={isPending}
                className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 py-6 rounded-xl w-full font-semibold text-white text-base transition-all cursor-pointer"
              >
                {isPending ? (
                  "Placing Order..."
                ) : (
                  <span className="flex items-center gap-2">
                    Place order <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="text-center">
                <Link
                  href={menuPath}
                  className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800 text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> continue shopping
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useCart } from "@/hooks/use-cart";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { Trash2, Utensils, ArrowRight, ArrowLeft } from "lucide-react";
// import { placeOrderAction } from "@/features/admin/order/actions/admin-order-actions";
// import { menuPath } from "@/lib/path";
// import Image from "next/image";

// export default function CheckOutForm({ userId }: { userId: string }) {
//   const { cart, removeFromCart, updateQuantity, clearCart, totalAmount } =
//     useCart();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleCheckout = async () => {
//     if (cart.length === 0) return;
//     setLoading(true);
//     setError("");

//     const result = await placeOrderAction({
//       userId,
//       totalAmount,
//       items: cart,
//     });

//     if (result.success) {
//       clearCart();
//       router.push(`/order/${result.orderId}`);
//     } else {
//       setError(result.error || "Failed to place order");
//       setLoading(false);
//     }
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="space-y-4 mx-auto p-12 max-w-md text-center container">
//         <h1 className="font-bold text-slate-800 text-2xl">
//           Your Cart is Empty
//         </h1>
//         <p className="text-slate-500">
//           ခြင်းတောင်းထဲတွင် အစားအသောက်များ မရှိသေးပါ။
//         </p>
//         <Button asChild className="bg-orange-600 hover:bg-orange-700">
//           <Link href={menuPath}>Back to Menu</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl container">
//       {/* Title Header */}
//       <div>
//         <p className="font-bold text-orange-500 text-xs uppercase tracking-wider">
//           YOUR ORDER
//         </p>
//         <h1 className="font-serif font-bold text-slate-900 text-4xl sm:text-5xl">
//           Your <span className="text-orange-500">cart.</span>
//         </h1>
//       </div>

//       {error && (
//         <div className="bg-rose-50 p-3 rounded-lg text-rose-600 text-sm">
//           {error}
//         </div>
//       )}

//       {/* Grid Layout (Side-by-Side) */}
//       <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-12">
//         {/* Left Column: Cart Items List */}
//         <div className="lg:col-span-7 bg-white p-6 border border-slate-300/80 rounded-2xl">
//           <div className="divide-y divide-slate-100">
//             {cart.map((item) => {
//               const itemImg = item.image || item.imageUrl;

//               return (
//                 <div
//                   key={item.menuItemId}
//                   className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 py-4 first:pt-0 last:pb-0"
//                 >
//                   {/* Product Info */}
//                   <div className="flex items-center gap-4">
//                     <div className="relative flex-shrink-0 bg-slate-100 rounded-xl w-16 h-16 overflow-hidden">
//                       {itemImg ? (
//                         <Image
//                           src={itemImg}
//                           alt={item.name}
//                           fill
//                           className="object-cover"
//                         />
//                       ) : (
//                         <div className="flex justify-center items-center h-full text-slate-400">
//                           <Utensils className="w-6 h-6" />
//                         </div>
//                       )}
//                     </div>

//                     <div className="space-y-1">
//                       <h3 className="font-semibold text-slate-900 text-base">
//                         {item.name}
//                       </h3>
//                       <p className="font-medium text-slate-600 text-sm">
//                         {item.price} Ks
//                       </p>
//                     </div>
//                   </div>

//                   {/* Quantity Controls & Delete */}
//                   <div className="flex justify-between sm:justify-end items-center gap-4">
//                     {/* Quantity Selector */}
//                     <div className="flex items-center bg-slate-50 p-1 border border-slate-200 rounded-lg">
//                       <button
//                         onClick={() =>
//                           updateQuantity(item.menuItemId, item.quantity - 1)
//                         }
//                         className="flex justify-center items-center hover:bg-slate-200/60 rounded-md w-7 h-7 font-semibold text-slate-600 transition-colors"
//                       >
//                         -
//                       </button>
//                       <span className="px-3 font-semibold text-slate-800 text-sm">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() =>
//                           updateQuantity(item.menuItemId, item.quantity + 1)
//                         }
//                         className="flex justify-center items-center hover:bg-slate-200/60 rounded-md w-7 h-7 font-semibold text-slate-600 transition-colors"
//                       >
//                         +
//                       </button>
//                     </div>

//                     {/* Total Price for Item */}
//                     <span className="min-w-[70px] font-bold text-slate-900 text-sm text-right">
//                       {item.price * item.quantity} Ks
//                     </span>

//                     {/* Remove Button */}
//                     <button
//                       onClick={() => removeFromCart(item.menuItemId)}
//                       className="bg-rose-50 hover:bg-rose-100 p-2 rounded-lg text-rose-500 transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Right Column: Order Summary */}
//         <div className="space-y-4 lg:col-span-5">
//           <div className="space-y-6 bg-white p-6 border border-slate-300/80 rounded-2xl">
//             <h2 className="font-bold text-slate-900 text-lg">Order summary</h2>

//             {/* Summary Items breakdown */}
//             <div className="space-y-3 divide-y divide-slate-100 text-sm">
//               {cart.map((item) => (
//                 <div
//                   key={item.menuItemId}
//                   className="flex justify-between items-center pt-3 first:pt-0 text-slate-600"
//                 >
//                   <span className="max-w-[200px] truncate">
//                     {item.name} × {item.quantity}
//                   </span>
//                   <span className="font-medium text-slate-900">
//                     {item.price * item.quantity} Ks
//                   </span>
//                 </div>
//               ))}

//               {/* Total Row */}
//               <div className="flex justify-between items-center pt-4 font-bold text-slate-900 text-lg">
//                 <span>Total</span>
//                 <span className="text-orange-500 text-2xl">
//                   {totalAmount} Ks
//                 </span>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="space-y-3 pt-2">
//               <Button
//                 onClick={handleCheckout}
//                 disabled={loading}
//                 className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 py-6 rounded-xl w-full font-semibold text-white text-base transition-all cursor-pointer"
//               >
//                 {loading ? (
//                   "Placing Order..."
//                 ) : (
//                   <span className="flex items-center gap-2">
//                     Place order <ArrowRight className="w-5 h-5" />
//                   </span>
//                 )}
//               </Button>

//               <div className="text-center">
//                 <Link
//                   href={menuPath}
//                   className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800 text-sm transition-colors"
//                 >
//                   <ArrowLeft className="w-4 h-4" /> continue shopping
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
