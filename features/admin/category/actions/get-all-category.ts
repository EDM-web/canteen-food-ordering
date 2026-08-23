"use server";

import { categoryPath } from "@/lib/path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getAllCategory = async () => {
  try {
    return await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    // return { message: "Something went wrong", success: false };
  }
};
