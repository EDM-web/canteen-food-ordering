// features/admin/menu/actions/update-menu-availability.ts
"use server";

import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server"; // သင့် Pusher Server Config Path
import { revalidatePath } from "next/cache";

export const updateMenuAvailability = async (
  id: string,
  isAvailable: boolean
) => {
  try {
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });

    // 1. Pusher Server မှတစ်ဆင့် Event Broadcast လုပ်ခြင်း
    await pusherServer.trigger("menu-channel", "menu-availability-updated", {
      id: updatedItem.id,
      isAvailable: updatedItem.isAvailable,
    });

    revalidatePath("/admin/dashboard/menu");
    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/"); // Customer ရဲ့ Home/Menu path ပါ Revalidate လုပ်ရန်

    return { success: true, message: "Availability updated" };
  } catch (error) {
    console.error("Availability update error:", error);
    return { success: false, message: "Failed to update availability" };
  }
};

// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// export const updateMenuAvailability = async (
//   id: string,
//   isAvailable: boolean
// ) => {
//   try {
//     await prisma.menuItem.update({
//       where: { id },
//       data: { isAvailable },
//     });

//     revalidatePath("/admin/dashboard/menu");
//     revalidatePath("/admin/dashboard/categories");
//     return { success: true, message: "Availability updated" };
//   } catch (error) {
//     console.error("Availability update error:", error);
//     return { success: false, message: "Failed to update availability" };
//   }
// };
