import { getAdminOrderDetailAction } from "@/features/admin/order/actions/admin-order-actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Utensils } from "lucide-react";
import Link from "next/link";
import {
  OrderStatusSelect,
  PaymentStatusSelect,
} from "@/features/admin/order/components/order-status-select";
import { protectAdminRoute } from "@/lib/auth-guard";
import Image from "next/image";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await protectAdminRoute();
  const resolvedParams = await params;
  const result = await getAdminOrderDetailAction(resolvedParams.id);
  const order = result.order;

  if (!order) {
    return <div className="p-12 text-red-500 text-center">Order not found</div>;
  }

  return (
    <div className="space-y-6 mx-auto">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground hover:text-orange-500"
      >
        <Link href="/admin/dashboard/orders">
          <ArrowLeft className="mr-1 w-4 h-4" /> Back to Orders
        </Link>
      </Button>

      <Card className="border-none ring-1">
        <CardHeader className="bg-slate-50/50 border-b">
          <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
            <div>
              <CardTitle className="font-bold text-xl">
                Order #{order.id.slice(-6).toUpperCase()}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {order.user?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[10px] text-muted-foreground uppercase">
                  Order Status
                </span>
                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                />
              </div>

              {order.status !== "Cancelled" && (
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[10px] text-muted-foreground uppercase">
                    Payment Status
                  </span>
                  <PaymentStatusSelect
                    orderId={order.id}
                    currentStatus={order.paymentStatus}
                    orderStatus={order.status}
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Items</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="pr-6 text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item) => {
                const itemImg =
                  (item.menuItem as any)?.image ||
                  (item.menuItem as any)?.imageUrl;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center gap-3">
                        {/* Image Container */}
                        <div className="relative bg-slate-100 border rounded-md w-14 h-14 overflow-hidden shrink-0">
                          {itemImg ? (
                            <Image
                              src={itemImg}
                              alt={item.menuItem?.name || "Menu item"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex justify-center items-center h-full text-slate-400">
                              <Utensils className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span>{item.menuItem?.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right">
                      {item.price} Ks
                    </TableCell>
                    <TableCell className="pr-6 font-semibold text-right">
                      {item.price * item.quantity} Ks
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center bg-slate-50/50 p-6 border-t font-bold text-lg">
            <span>Total Amount</span>
            <span className="text-orange-600">{order.totalAmount} Ks</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
