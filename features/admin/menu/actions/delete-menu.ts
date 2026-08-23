"use server";

import { categoryPath, homePath } from "@/lib/path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deleteMenu = async (formData: FormData) => {
  const id = formData.get("id") as string;

  await prisma.menuItem.delete({
    where: { id },
  });

  revalidatePath(homePath);

  //   redirect(categoryPath);
};
