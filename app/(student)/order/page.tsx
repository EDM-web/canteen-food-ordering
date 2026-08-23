import Link from "next/link";
import { getUserOrdersAction } from "@/features/order/actions/user-order-actions";
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
import { orderDetailPath } from "@/lib/path";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { ExternalLink, ShoppingBag, Utensils } from "lucide-react";
import { protectUserRoute } from "@/lib/auth-guard";
import Image from "next/image";

export default async function OrderHistoryPage() {
  await protectUserRoute();
  const result = await getUserOrdersAction();
  const orders = result.orders || [];

  return (
    <div className="space-y-6 mx-auto max-w-5xl container">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-sans font-bold text-muted-foreground text-sm tracking-wide">
            Order History
          </p>
          <h1 className="my-4 font-serif font-bold text-orange-500 text-3xl tracking-tight">
            My Orders
          </h1>
          {/* <p className="text-muted-foreground text-sm">
            Track your live orders and view past receipts.
          </p> */}
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ShoppingBag className="mr-2 w-4 h-4 text-orange-500" /> Order More
          </Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="space-y-3 py-12 text-center">
          <p className="text-muted-foreground text-sm">
            You haven't placed any orders yet.
          </p>
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link href="/">Browse Menu</Link>
          </Button>
        </div>
      ) : (
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
                (sum, item) => sum + item.quantity,
                0
              );

              const firstMenuItem = order.orderItems[0]?.menuItem;
              const firstItemName = firstMenuItem?.name || "Food Item";
              const firstItemImg =
                (firstMenuItem as any)?.image ||
                (firstMenuItem as any)?.imageUrl;

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

                  {/* Item Image + Summary Row */}
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

                  {/* <TableCell className="text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell> */}
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
      )}
    </div>
  );
}
