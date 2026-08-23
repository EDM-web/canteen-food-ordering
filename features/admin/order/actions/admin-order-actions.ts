"use server";

import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CartItemInput {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

// 1. Customer အားလုံး၏ Order များကို ယူခြင်း
export async function getAllOrdersAction() {
  try {
    const orders = await prisma.order.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch orders" };
  }
}

// 2. Admin မှ Order Status (Pending, Preparing, etc.) ကို Update လုပ်ခြင်း
export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true, order: updatedOrder };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update order status",
    };
  }
}

// 3. Admin မှ Payment Status (Unpaid, Paid) ကို Update လုပ်ခြင်း
export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true, order: updatedOrder };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update payment status",
    };
  }
}

// 4. Single Order Detail ကို Admin အတွက် ယူခြင်း
export async function getAdminOrderDetailAction(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) return { success: false, error: "Order not found" };

    return { success: true, order };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch order detail",
    };
  }
}

export async function placeOrderAction(data: {
  userId: string;
  totalAmount: number;
  items: CartItemInput[];
}) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Cart ထဲတွင် ပစ္စည်းမရှိပါ" };
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          totalAmount: data.totalAmount,
          status: OrderStatus.Pending,
          paymentStatus: PaymentStatus.Unpaid,
        },
      });

      const orderItemsData = data.items.map((item) => ({
        orderId: order.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/orders");

    return { success: true, orderId: newOrder.id };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to place order" };
  }
}
