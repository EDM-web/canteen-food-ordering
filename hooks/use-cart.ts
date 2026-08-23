"use client";

import { useState, useEffect } from "react";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  imageUrl?: string;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = () => {
    const savedCart = localStorage.getItem("canteen_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    } else {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    // Custom Event ကို နားထောင်ပြီး Real-time Update လုပ်ခြင်း
    const handleCartChange = () => loadCart();
    window.addEventListener("cart-updated", handleCartChange);

    return () => {
      window.removeEventListener("cart-updated", handleCartChange);
    };
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("canteen_cart", JSON.stringify(newCart));
    // Cart ပြောင်းလဲသွားကြောင်း အခြား Component တွေကို အကြောင်းကြားခြင်း
    window.dispatchEvent(new Event("cart-updated"));
  };

  const addToCart = (item: {
    menuItemId: string;
    name: string;
    price: number;
    image?: string; // 👈 image ကို optional အနေနဲ့ ဖြည့်ပေးပါ
    imageUrl?: string; // 👈 သို့မဟုတ် imageUrl
  }) => {
    const existingIndex = cart.findIndex(
      (i) => i.menuItemId === item.menuItemId
    );
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cart, { ...item, quantity: 1 }];
    }
    saveCart(updated);
  };

  const removeFromCart = (menuItemId: string) => {
    const updated = cart.filter((i) => i.menuItemId !== menuItemId);
    saveCart(updated);
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    const updated = cart.map((i) =>
      i.menuItemId === menuItemId ? { ...i, quantity } : i
    );
    saveCart(updated);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("canteen_cart");
    window.dispatchEvent(new Event("cart-updated"));
  };

  // စုစုပေါင်း အရေအတွက် (Badge Count အတွက်)
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    totalAmount,
  };
}

// "use client";

// import { useState, useEffect } from "react";

// export interface CartItem {
//   menuItemId: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// export function useCart() {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     const savedCart = localStorage.getItem("canteen_cart");
//     if (savedCart) {
//       try {
//         setCart(JSON.parse(savedCart));
//       } catch (e) {
//         console.error("Failed to parse cart", e);
//       }
//     }
//   }, []);

//   const saveCart = (newCart: CartItem[]) => {
//     setCart(newCart);
//     localStorage.setItem("canteen_cart", JSON.stringify(newCart));
//   };

//   const addToCart = (item: {
//     menuItemId: string;
//     name: string;
//     price: number;
//   }) => {
//     const existingIndex = cart.findIndex(
//       (i) => i.menuItemId === item.menuItemId
//     );
//     if (existingIndex > -1) {
//       const updated = [...cart];
//       updated[existingIndex].quantity += 1;
//       saveCart(updated);
//     } else {
//       saveCart([...cart, { ...item, quantity: 1 }]);
//     }
//   };

//   const removeFromCart = (menuItemId: string) => {
//     const updated = cart.filter((i) => i.menuItemId !== menuItemId);
//     saveCart(updated);
//   };

//   const updateQuantity = (menuItemId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(menuItemId);
//       return;
//     }
//     const updated = cart.map((i) =>
//       i.menuItemId === menuItemId ? { ...i, quantity } : i
//     );
//     saveCart(updated);
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem("canteen_cart");
//   };

//   const totalAmount = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     totalAmount,
//   };
// }
