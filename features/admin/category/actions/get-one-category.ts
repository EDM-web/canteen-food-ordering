"use server";

import { prisma } from "@/lib/prisma";

// interface Props {
//   id: string;
// }

export const getOneCategory = async (id: string) => {
  try {
    return await prisma.category.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    // return { message: "Something went wrong", success: false };
  }
};
