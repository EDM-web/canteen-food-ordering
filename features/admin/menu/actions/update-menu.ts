// features/admin/menu/actions/update-menu.ts
"use server";

import {
  adminDashboardPath,
  adminMenuPath,
  categoryDetailPath,
} from "@/lib/path";
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
  const imageUrl = formData.get("imageUrl") as string; // Image URL string

  try {
    // Database ထဲတွင် Name, Price နှင့် Image URL ကို Update လုပ်မည်
    await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        // Image URL ပါလာခဲ့ရင် Update လုပ်မည်၊ မပါရင် သို့မဟုတ် ခါးနေရင် မူလ Image အဟောင်းအတိုင်း ထားမည်
        ...(imageUrl ? { imageUrl } : {}),
      },
    });

    revalidatePath(adminDashboardPath);
    revalidatePath(adminMenuPath);

    if (categoryId) {
      revalidatePath(categoryDetailPath(categoryId));
    }

    return { message: "Menu updated successfully", success: true };
  } catch (error) {
    console.error("Update menu error:", error);
    return { message: "Something went wrong", success: false };
  }
};
// "use server";

// import { categoryDetailPath } from "@/lib/path";
// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// interface ActionStateProps {
//   message: string;
//   success: boolean;
// }

// export const updateMenu = async (
//   _state: ActionStateProps,
//   formData: FormData
// ) => {
//   const id = formData.get("id") as string;
//   const name = formData.get("name") as string;
//   const price = formData.get("price") as string;
//   const categoryId = formData.get("categoryId") as string;

//   try {
//     await prisma.menuItem.update({
//       where: { id },
//       data: {
//         name,
//         price: parseFloat(price),
//       },
//     });

//     revalidatePath(categoryDetailPath(categoryId));
//     // revalidatePath("/admin/dashboard/category/[id]", "page");

//     return { message: "Menu updated successfully", success: true };
//   } catch (error) {
//     return { message: "Something went wrong", success: false };
//   }
// };
