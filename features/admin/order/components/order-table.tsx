// features/admin/order/components/orders-table.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client"; // သင့် Pusher Client Config Path

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  OrderStatusSelect,
  PaymentStatusSelect,
} from "@/features/admin/order/components/order-status-select";
import { OrderDetailsSheet } from "@/features/admin/order/components/order-details-sheet";

export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);

  // Initial Prop ပြောင်းပါက State ပါ Sync လုပ်ပေးမည်
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Pusher Real-time Listener
  useEffect(() => {
    const channel = pusherClient.subscribe("admin-orders");

    // Order အသစ်ဝင်လာပါက Table ၏ ထိပ်ဆုံးသို့ ထည့်မည်
    channel.bind("new-order", (newOrder: any) => {
      setOrders((prev) => {
        const exists = prev.some((o) => o.id === newOrder.id);
        if (exists) return prev;
        return [newOrder, ...prev];
      });
    });

    // Customer က Cancel လုပ်ခြင်း သို့မဟုတ် Admin ဘက်မှ Status ပြောင်းခြင်းအတွက်
    channel.bind("update-order", (updatedOrder: any) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    return () => {
      pusherClient.unsubscribe("admin-orders");
    };
  }, []);

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white p-8 border rounded-lg text-muted-foreground text-center">
        No orders found
      </div>
    );
  }

  return (
    <Card className="border-none ring-1">
      <CardHeader className="pb-3">
        <CardTitle className="font-medium text-lg">
          {orders.length} Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-left">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const itemCount =
                order.orderItems?.reduce(
                  (sum: number, item: any) => sum + item.quantity,
                  0
                ) || 0;

              return (
                <TableRow
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="py-4 font-mono font-medium text-xs">
                    #{order.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-600 text-sm">
                        {order.user?.name || "Guest User"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-sm">
                    <span className="text-slate-600">
                      {itemCount} {itemCount === 1 ? "Item" : "Items"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 font-semibold text-orange-600">
                    ${order.totalAmount}
                  </TableCell>

                  <TableCell className="py-4">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </TableCell>

                  <TableCell className="py-4">
                    <PaymentStatusSelect
                      orderId={order.id}
                      currentStatus={order.paymentStatus}
                      orderStatus={order.status}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2 py-4">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/dashboard/orders/${order.id}`}>
                          Details <ExternalLink className="ml-1 w-3.5 h-3.5" />
                        </Link>
                      </Button>

                      <OrderDetailsSheet order={order} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
