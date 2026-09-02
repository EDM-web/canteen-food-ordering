// components/user-order-table.tsx
"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client"; // သင့် Pusher Client Config Path
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { orderDetailPath } from "@/lib/path";
import { ExternalLink, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function UserOrderTable({
  initialOrders,
  userId,
}: {
  initialOrders: any[];
  userId: string;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const router = useRouter();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    // Customer မိမိ၏ သီးသန့် Channel ကို Subscribe လုပ်မည်
    const channel = pusherClient.subscribe(`user-orders-${userId}`);

    channel.bind("update-order", (updatedOrder: any) => {
      // State ထဲက သက်ဆိုင်ရာ Order ရဲ့ status/paymentStatus ကို တန်းပြောင်းပေးမည်
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id
            ? {
                ...order,
                status: updatedOrder.status,
                paymentStatus: updatedOrder.paymentStatus,
              }
            : order
        )
      );

      // Next.js Server Data ကိုပါ နောက်ကွယ်မှ Cache Sync ပြန်လုပ်ပေးမည်
      router.refresh();
    });

    return () => {
      pusherClient.unsubscribe(`user-orders-${userId}`);
    };
  }, [userId, router]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 hover:bg-transparent">
          <TableHead className="w-[120px]">Order ID</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const itemCount = order.orderItems.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          );

          const firstMenuItem = order.orderItems[0]?.menuItem;
          const firstItemName = firstMenuItem?.name || "Food Item";
          const firstItemImg = firstMenuItem?.imageUrl || firstMenuItem?.image;

          const itemSummary =
            itemCount > 1 ? (
              <div className="flex flex-col">
                {firstItemName}
                <span className="text-muted-foreground text-xs">
                  +{itemCount - 1} more
                </span>
              </div>
            ) : (
              firstItemName
            );

          return (
            <TableRow
              key={order.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="font-mono font-medium text-xs">
                #{order.id.slice(-6).toUpperCase()}
              </TableCell>

              <TableCell className="font-medium text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-shrink-0 bg-slate-100 border rounded-md w-12 h-12 overflow-hidden">
                    {firstItemImg ? (
                      <Image
                        src={firstItemImg}
                        alt={firstItemName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex justify-center items-center h-full text-slate-400">
                        <Utensils className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <span className="line-clamp-1">{itemSummary}</span>
                </div>
              </TableCell>

              <TableCell className="font-semibold text-orange-600">
                {order.totalAmount} Ks
              </TableCell>

              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>

              <TableCell>
                <PaymentStatusBadge status={order.paymentStatus} />
              </TableCell>

              <TableCell className="text-muted-foreground text-xs">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <Link href={orderDetailPath(order.id)}>
                    Details <ExternalLink className="ml-1 w-3.5 h-3.5" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
