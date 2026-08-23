"use server";

import { categoryPath } from "@/lib/path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getAllMenuById = async (id: string) => {
  try {
    return await prisma.menuItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        categoryId: id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    // return { message: "Something went wrong", success: false };
  }
};
