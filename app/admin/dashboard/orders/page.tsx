import Link from "next/link";
import { getAllOrdersAction } from "@/features/admin/order/actions/admin-order-actions";
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

import { ExternalLink } from "lucide-react";
import {
  OrderStatusSelect,
  PaymentStatusSelect,
} from "@/features/admin/order/components/order-status-select";
import { protectAdminRoute } from "@/lib/auth-guard";
import { OrderDetailsSheet } from "@/features/admin/order/components/order-details-sheet";

export default async function AdminOrdersPage() {
  const session = await protectAdminRoute();
  const result = await getAllOrdersAction();
  const orders = result.orders || [];

  return (
    <div className="space-y-8 mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-slate-700 text-2xl sm:text-3xl xl:text-4xl tracking-tight">
            Orders
          </h1>
          {/* <p className="text-muted-foreground text-sm">
            Manage incoming orders, update cooking status, and track payments.
          </p> */}
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-white p-8 border rounded-lg text-muted-foreground text-center">
          No orders found
        </div>
      ) : (
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
                  <TableHead className="">Order ID</TableHead>
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
                  const itemCount = order.orderItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

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
                          {/* <span className="text-muted-foreground text-xs">
                          {order.user?.email}
                        </span> */}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm">
                        <span className="text-slate-600">
                          {itemCount} {itemCount === 1 ? "Item" : "Items"}{" "}
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
                              Details{" "}
                              <ExternalLink className="ml-1 w-3.5 h-3.5" />
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
      )}
    </div>
  );
}
