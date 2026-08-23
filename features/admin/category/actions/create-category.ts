"use server";

import { categoryPath } from "@/lib/path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ActionStateProps {
  message: string;
  success: boolean;
}

export const createCategory = async (
  _state: ActionStateProps,
  formData: FormData
) => {
  const name = formData.get("name") as string;
  try {
    await prisma.category.create({
      data: {
        name,
      },
    });

    revalidatePath(categoryPath);

    return { message: "Category created", success: true };
  } catch (error) {
    return { message: "Something went wrong", success: false };
  }
};
