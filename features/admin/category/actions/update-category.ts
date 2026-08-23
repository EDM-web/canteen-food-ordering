"use server";

import { categoryPath } from "@/lib/path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ActionStateProps {
  message: string;
  success: boolean;
}

export const updateCategory = async (
  id: string,
  _state: ActionStateProps,
  formData: FormData
) => {
  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    return { message: "Category name is required", success: false };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: { name },
    });

    revalidatePath(categoryPath);

    return { message: "Category updated successfully", success: true };
  } catch (error) {
    return { message: "Failed to update category", success: false };
  }
};
