"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@/generated/prisma/enums";

// 1. Customer ရဲ့ Order History အားလုံးကို ယူခြင်း
export async function getUserOrdersAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch orders" };
  }
}

// 2. Order Detail တစ်ခုချင်းစီကို ယူခြင်း
export async function getOrderDetailAction(orderId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id, // Security: မိမိ Order ဟုတ်မဟုတ် စစ်ထုတ်ခြင်း
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return { success: true, order };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch order detail",
    };
  }
}

// features/order/actions/user-order-actions.ts

import { pusherServer } from "@/lib/pusher-server"; // Pusher Server import လုပ်ပါ

export async function cancelOrderAction(orderId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId, userId: session.user.id },
    });

    if (!existingOrder) {
      return { success: false, error: "Order not found" };
    }

    if (existingOrder.status !== OrderStatus.Pending) {
      return {
        success: false,
        error: "Cannot cancel order. Kitchen is already preparing your order!",
      };
    }

    // 1. Order Status ကို Cancelled သို့ Update လုပ်ပြီး Data အပြည့်အစုံ ပြန်ယူမည်
    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.Cancelled },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // 2. Admin Dashboard သို့ Real-time Event လွှင့်ပေးမည်
    await pusherServer.trigger("admin-orders", "update-order", cancelledOrder);

    // 3. Customer သီးသန့် Channel သို့ပါ Real-time Event လွှင့်ပေးမည်
    await pusherServer.trigger(
      `user-orders-${session.user.id}`,
      "update-order",
      cancelledOrder
    );

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to cancel order" };
  }
}
// 3. Customer မှ Order ကို Cancel လုပ်ခြင်း (Pending အဆင့်တွင်သာ ရမည်)
// export async function cancelOrderAction(orderId: string) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     // စစ်ဆေးမည်: Order သည် Pending ဖြစ်နေဆဲ ဟုတ်မဟုတ်
//     const existingOrder = await prisma.order.findUnique({
//       where: { id: orderId, userId: session.user.id },
//     });

//     if (!existingOrder) {
//       return { success: false, error: "Order not found" };
//     }

//     if (existingOrder.status !== OrderStatus.Pending) {
//       return {
//         success: false,
//         error: "Cannot cancel order. Kitchen is already preparing your order!",
//       };
//     }

//     // Cancel လုပ်ခြင်း
//     await prisma.order.update({
//       where: { id: orderId },
//       data: { status: OrderStatus.Cancelled },
//     });

//     revalidatePath(`/orders/${orderId}`);
//     revalidatePath("/orders");

//     return { success: true };
//   } catch (error: any) {
//     return { success: false, error: error.message || "Failed to cancel order" };
//   }
// }
