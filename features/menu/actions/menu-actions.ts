"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ActionStateProps {
  message: string;
  success: boolean;
}

// 1. Category အသစ်ဖန်တီးခြင်း
export async function createCategoryAction(
  _state: ActionStateProps,
  formData: FormData
) {
  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    return { message: "Category name is required", success: false };
  }

  try {
    await prisma.category.create({
      data: { name: name.trim() },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { message: "Category created successfully!", success: true };
  } catch (error: any) {
    return {
      message: "Failed to create category",
      success: false,
    };
  }
}

// 2. Menu Item အသစ်ထည့်သွင်းခြင်း
export async function createMenuItemAction(
  _state: ActionStateProps,
  formData: FormData
) {
  const categoryId = formData.get("categoryId") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;

  if (!categoryId || !name || isNaN(price)) {
    return {
      message: "Please fill all required fields correctly",
      success: false,
    };
  }

  try {
    await prisma.menuItem.create({
      data: {
        categoryId,
        name,
        price,
        imageUrl: imageUrl || null,
        isAvailable: true,
      },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { message: "Menu item added successfully!", success: true };
  } catch (error: any) {
    return {
      message: error.message || "Failed to add menu item",
      success: false,
    };
  }
}

// 3. Toggle Availability (In Stock / Out of Stock Switch)
export async function toggleMenuItemAvailabilityAction(
  id: string,
  currentStatus: boolean
) {
  try {
    await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !currentStatus },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { message: "Update successfully", success: true };
  } catch (error: any) {
    return {
      message: error.message || "Failed to update status",
      success: false,
    };
  }
}

// 4. Menu Item အချက်အလက် ပြင်ဆင်ခြင်း
export async function updateMenuItemAction(
  _state: ActionStateProps,
  formData: FormData
) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;

  try {
    await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        price,
        categoryId,
      },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { message: "Item updated successfully!", success: true };
  } catch (error: any) {
    return {
      message: error.message || "Failed to update item",
      success: false,
    };
  }
}

// 5. Menu Item ဖျက်ပစ်ခြင်း
export async function deleteMenuItemAction(id: string) {
  try {
    await prisma.menuItem.delete({
      where: { id },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { message: "Delete successfully", success: true };
  } catch (error: any) {
    return {
      message: error.message || "Failed to delete item",
      success: false,
    };
  }
}
