"use server";

import { prisma } from "@/lib/prisma"; // သင့် Prisma client path အတိုင်း ပြင်ပါ

export async function getAllCustomersAction() {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: "Customer", // Customer များကိုသာ Filter လုပ်မည်
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            paymentStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Customer တစ်ယောက်ချင်းစီအတွက် Total Spent နှင့် Total Orders တွက်ချက်ခြင်း
    const formattedCustomers = customers.map((customer) => {
      // မပယ်ဖျက်ထားသော (Cancelled မဟုတ်သော) Order များကိုသာ စုစုပေါင်း ပမာဏ တွက်မည်
      const validOrders = customer.orders.filter(
        (order) => order.paymentStatus == "Paid"
      );

      const totalSpent = validOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0
      );

      return {
        id: customer.id,
        name: customer.name || "Unknown User",
        email: customer.email,
        image: customer.image || "",
        totalOrders: customer.orders.length,
        totalSpent: totalSpent,
        createdAt: customer.createdAt.toISOString().split("T")[0],
      };
    });

    return { success: true, customers: formattedCustomers };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      error: "Failed to fetch customers data",
      customers: [],
    };
  }
}
