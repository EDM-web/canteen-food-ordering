"use server";

import { categoryDetailPath, menuPath, categoryPath } from "@/lib/path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ActionStateProps {
  message: string;
  success: boolean;
}

export const createMenu = async (
  _state: ActionStateProps,
  formData: FormData
) => {
  const categoryId = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("image") as string;

  if (!categoryId) {
    return {
      message: "Please select a category",
      success: false,
    };
  }

  if (!imageUrl) {
    return {
      message: "Please upload an image for the menu item",
      success: false,
    };
  }

  try {
    await prisma.menuItem.create({
      data: {
        categoryId,
        name,
        price,
        imageUrl,
      },
    });

    // Path Dynamic Revalidation
    revalidatePath(categoryDetailPath(categoryId));
    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/admin/dashboard/menu");

    return { message: "Menu created successfully", success: true };
  } catch (error) {
    console.error("Create menu error:", error);
    return { message: "Something went wrong", success: false };
  }
};
