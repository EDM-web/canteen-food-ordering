"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateMenuAvailability = async (
  id: string,
  isAvailable: boolean
) => {
  try {
    await prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });

    revalidatePath("/admin/dashboard/menu");
    revalidatePath("/admin/dashboard/categories");
    return { success: true, message: "Availability updated" };
  } catch (error) {
    console.error("Availability update error:", error);
    return { success: false, message: "Failed to update availability" };
  }
};
