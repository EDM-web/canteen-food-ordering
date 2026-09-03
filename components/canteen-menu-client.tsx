"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ClientMenuItem from "./client-menu-item";
import SearchInput from "./search-bar";
import { pusherClient } from "@/lib/pusher-client"; // Pusher client path သေချာစစ်ပါ

interface Category {
  id: string;
  name: string;
}

interface MenuItemData {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  categoryId: string;
  isAvailable: boolean;
  category: {
    name: string;
  };
}

interface Props {
  categories: Category[];
  initialMenu: MenuItemData[];
  hasSession?: boolean;
}

export default function CanteenMenuClient({
  categories,
  initialMenu,
  hasSession,
}: Props) {
  const router = useRouter();
  const [menuList, setMenuList] = useState<MenuItemData[]>(initialMenu);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // 1. Initial Menu Props ပြောင်းတိုင်း Local State ကို အမြဲ Update လုပ်ပေးမည်
  useEffect(() => {
    setMenuList(initialMenu);
  }, [initialMenu]);

  // 2. Pusher Listener ချိတ်ဆက်ခြင်း
  useEffect(() => {
    // Channel Subscribe လုပ်ခြင်း
    const channel = pusherClient.subscribe("menu-channel");

    const handleAvailabilityUpdate = (data: {
      id: string;
      isAvailable: boolean;
    }) => {
      console.log("Realtime Pusher Event Received:", data); // Debugging အတွက်

      // Local State ကို Instant ပြောင်းမည်
      setMenuList((prevMenu) =>
        prevMenu.map((item) =>
          item.id === data.id
            ? { ...item, isAvailable: data.isAvailable }
            : item
        )
      );

      // Server Data Cache ပါ Refresh ပြုလုပ်မည်
      router.refresh();
    };

    channel.bind("menu-availability-updated", handleAvailabilityUpdate);

    return () => {
      channel.unbind("menu-availability-updated", handleAvailabilityUpdate);
      pusherClient.unsubscribe("menu-channel");
    };
  }, [router]);

  const availableCategories = useMemo(() => {
    const activeCategoryIds = new Set(menuList.map((menu) => menu.categoryId));
    return categories.filter((category) => activeCategoryIds.has(category.id));
  }, [categories, menuList]);

  const filteredMenu = useMemo(() => {
    return menuList.filter((menu) => {
      const matchesCategory =
        selectedCategory === "all" || menu.categoryId === selectedCategory;

      const matchesSearch = menu.name.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesSearch;
    });
  }, [menuList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Categories Bar */}
      <section className="space-y-5 text-left md:text-center">
        <div className="space-y-1.5">
          <h2 className="font-serif font-bold text-orange-500 text-3xl tracking-tight">
            Categories
          </h2>
          <p className="text-slate-500 text-sm">
            Select a category to filter available items
          </p>
        </div>
        <div className="flex justify-start md:justify-center items-center gap-2.5 py-1 overflow-x-auto scroll-smooth no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              selectedCategory === "all"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            All Menus
          </button>

          {availableCategories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-start md:justify-center">
        <SearchInput placeholder="Search menu items..." />
      </div>

      {/* Menu Grid */}
      <section className="space-y-8">
        <div className="gap-y-6">
          <h2 className="font-bold text-orange-500 text-2xl tracking-tight">
            {selectedCategory === "all"
              ? "All Menus"
              : availableCategories.find((c) => c.id === selectedCategory)
                  ?.name}
          </h2>
        </div>

        {filteredMenu.length === 0 ? (
          <div className="bg-white py-12 border border-slate-200 border-dashed rounded-xl text-slate-500 text-center">
            No items available.
          </div>
        ) : (
          <div className="gap-5 md:gap-5 xl:gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:p-0 px-4 pb-8">
            {filteredMenu.map((menu) => (
              <ClientMenuItem
                key={menu.id}
                id={menu.id}
                name={menu.name}
                price={menu.price}
                image={menu.imageUrl ?? undefined}
                categoryName={menu.category.name}
                categoryId={menu.categoryId}
                isAvailable={menu.isAvailable}
                hasSession={hasSession}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// "use client";

// import { useMemo, useState } from "react";
// import { useSearchParams } from "next/navigation"; // 1. useSearchParams ကို Import လုပ်ပါ
// import ClientMenuItem from "./client-menu-item";
// import SearchInput from "./search-bar";

// interface Category {
//   id: string;
//   name: string;
// }

// interface MenuItemData {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl?: string | null;
//   categoryId: string;
//   isAvailable: boolean;
//   category: {
//     name: string;
//   };
// }

// interface Props {
//   categories: Category[];
//   initialMenu: MenuItemData[];
//   hasSession?: boolean;
// }

// export default function CanteenMenuClient({
//   categories,
//   initialMenu,
//   hasSession,
// }: Props) {
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");

//   // 2. URL Params ထဲမှ search တန်ဖိုးကို ယူပါ
//   const searchParams = useSearchParams();
//   const searchQuery = searchParams.get("search")?.toLowerCase() || "";

//   // Menu item အနည်းဆုံး ၁ ခုရှိသော Category များကိုသာ စစ်ထုတ်ခြင်း
//   const availableCategories = useMemo(() => {
//     const activeCategoryIds = new Set(
//       initialMenu.map((menu) => menu.categoryId)
//     );
//     return categories.filter((category) => activeCategoryIds.has(category.id));
//   }, [categories, initialMenu]);

//   // 3. Category ရော Search Query ပါ နှစ်ခုစလုံးကို စစ်ပြီး Filter လုပ်ခြင်း
//   const filteredMenu = useMemo(() => {
//     return initialMenu.filter((menu) => {
//       // Category စစ်ခြင်း
//       const matchesCategory =
//         selectedCategory === "all" || menu.categoryId === selectedCategory;

//       // Search Word စစ်ခြင်း (Case-insensitive ဖြစ်စေရန် toLowerCase သုံးထားသည်)
//       const matchesSearch = menu.name.toLowerCase().includes(searchQuery);

//       return matchesCategory && matchesSearch;
//     });
//   }, [initialMenu, selectedCategory, searchQuery]);

//   return (
//     <div className="space-y-8">
//       {/* Categories Bar */}
//       <section className="space-y-5 text-left md:text-center">
//         <div className="space-y-1.5">
//           <h2 className="font-serif font-bold text-orange-500 text-3xl tracking-tight">
//             Categories
//           </h2>
//           <p className="text-slate-500 text-sm">
//             Select a category to filter available items
//           </p>
//         </div>
//         <div className="flex justify-start md:justify-center items-center gap-2.5 py-1 overflow-x-auto scroll-smooth no-scrollbar">
//           <button
//             onClick={() => setSelectedCategory("all")}
//             className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
//               selectedCategory === "all"
//                 ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
//                 : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
//             }`}
//           >
//             All Menus
//           </button>

//           {availableCategories.map((category) => {
//             const isActive = selectedCategory === category.id;
//             return (
//               <button
//                 key={category.id}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
//                   isActive
//                     ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
//                     : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
//                 }`}
//               >
//                 {category.name}
//               </button>
//             );
//           })}
//         </div>
//       </section>

//       <div className="flex justify-start md:justify-center">
//         <SearchInput placeholder="Search menu items..." />
//       </div>

//       {/* Menu Grid */}
//       <section className="space-y-8">
//         <div className="gap-y-6">
//           <h2 className="font-bold text-orange-500 text-2xl tracking-tight">
//             {selectedCategory === "all"
//               ? "All Menus"
//               : availableCategories.find((c) => c.id === selectedCategory)
//                   ?.name}
//           </h2>
//         </div>

//         {filteredMenu.length === 0 ? (
//           <div className="bg-white py-12 border border-slate-200 border-dashed rounded-xl text-slate-500 text-center">
//             No items available.
//           </div>
//         ) : (
//           <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:p-0 px-4 pb-8">
//             {filteredMenu.map((menu) => (
//               <ClientMenuItem
//                 key={menu.id}
//                 id={menu.id}
//                 name={menu.name}
//                 price={menu.price}
//                 image={menu.imageUrl ?? undefined}
//                 categoryName={menu.category.name}
//                 categoryId={menu.categoryId}
//                 isAvailable={menu.isAvailable}
//                 hasSession={hasSession}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }
