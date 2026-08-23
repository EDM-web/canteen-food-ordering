"use server";

import { categoryDetailPath } from "@/lib/path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ActionStateProps {
  message: string;
  success: boolean;
}

export const updateMenu = async (
  _state: ActionStateProps,
  formData: FormData
) => {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const categoryId = formData.get("categoryId") as string;

  try {
    await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
      },
    });

    revalidatePath(categoryDetailPath(categoryId));
    // revalidatePath("/admin/dashboard/category/[id]", "page");

    return { message: "Menu updated successfully", success: true };
  } catch (error) {
    return { message: "Something went wrong", success: false };
  }
};
