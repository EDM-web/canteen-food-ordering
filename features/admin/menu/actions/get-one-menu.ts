"use server";

import { prisma } from "@/lib/prisma";

export const getOneMenu = async (id: string) => {
  try {
    return await prisma.menuItem.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    // return { message: "Something went wrong", success: false };
  }
};
