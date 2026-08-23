"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface ProfileFormState {
  success: boolean;
  message: string;
}

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized request." };
  }

  const name = formData.get("name") as string;
  //   const password = formData.get("password") as string;

  if (!name || name.trim() === "") {
    return { success: false, message: "Name is required." };
  }

  try {
    const updateData: { name: string; password?: string } = {
      name: name.trim(),
    };

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to update profile." };
  }
}
