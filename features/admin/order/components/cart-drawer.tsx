"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { placeOrderAction } from "../actions/admin-order-actions";
import { Trash2, X } from "lucide-react";

export function CartDrawer({ userId }: { userId: string }) {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError("");

    const result = await placeOrderAction({
      userId,
      totalAmount,
      items: cart,
    });

    if (result.success) {
      clearCart();
      router.push(`/order`);
      // router.push(`/orders/${result.orderId}`);
    } else {
      setError(result.error || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-white shadow-sm p-4 border rounded-xl w-md">
      <h2 className="font-bold text-xl">Your Cart</h2>

      {error && (
        <div className="bg-red-50 p-2 rounded text-red-500 text-sm">
          {error}
        </div>
      )}

      {cart.length === 0 ? (
        <p className="text-gray-500 text-sm">No order here</p>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.menuItemId}
              className="flex justify-between items-center pb-2 border-b"
            >
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-500 text-xs">${item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateQuantity(item.menuItemId, item.quantity - 1)
                  }
                >
                  -
                </Button>
                <span className="font-semibold text-sm">{item.quantity}</span>
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateQuantity(item.menuItemId, item.quantity + 1)
                  }
                >
                  +
                </Button>
                <Button
                  onClick={() => removeFromCart(item.menuItemId)}
                  className="ml-2 text-muted-foreground hover:text-red-500 text-xs cursor-pointer"
                  variant={"ghost"}
                  size={"icon"}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2 font-bold text-base">
            <span>Total:</span>
            <span className="text-orange-600">${totalAmount}</span>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 w-full font-semibold text-white"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      )}
    </div>
  );
}
