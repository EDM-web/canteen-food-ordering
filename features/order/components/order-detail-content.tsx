// components/order/OrderDetailContent.tsx
import { getOrderDetailAction } from "@/features/order/actions/user-order-actions";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  ChefHat,
  CheckCircle2,
  ShoppingBag,
  XCircle,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import { CancelOrderModal } from "./cancel-order-modal";

export async function OrderDetailContent({ orderId }: { orderId: string }) {
  // Direct Server-side Action Call
  const res = await getOrderDetailAction(orderId);

  if (!res.success || !res.order) {
    return (
      <div className="p-12 font-medium text-rose-500 text-center">
        {res.error || "Order not found"}
      </div>
    );
  }

  const order = res.order;
  const steps = [
    { key: "Pending", label: "Order Placed", icon: Clock },
    { key: "Preparing", label: "Preparing", icon: ChefHat },
    { key: "Ready", label: "Ready for Pickup", icon: ShoppingBag },
    { key: "Completed", label: "Completed", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-lg p-0 border-amber-100/60 dark:border-slate-800 rounded-3xl overflow-hidden">
      <CardHeader className="bg-slate-50/80 dark:bg-slate-800/50 p-6 border-slate-100 dark:border-slate-800 border-b">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="font-extrabold text-slate-900 dark:text-slate-100 text-xl sm:text-2xl tracking-tight">
              Order #{order.id.slice(-6).toUpperCase()}
            </CardTitle>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            {!isCancelled && (
              <PaymentStatusBadge status={order.paymentStatus} />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        {/* Timeline Tracker */}
        {isCancelled ? (
          <Alert
            variant="destructive"
            className="bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 rounded-2xl text-rose-800 dark:text-rose-300"
          >
            <XCircle className="inline mr-2 w-4 h-4 text-rose-600 dark:text-rose-400" />
            <AlertDescription className="inline font-medium">
              This order has been cancelled.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Order Status
            </h3>
            <div className="relative gap-2 grid grid-cols-4 pt-2 text-center">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-400"
                      } ${
                        isCurrent ? "ring-4 ring-orange-500/20 scale-105" : ""
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isPassed
                          ? "text-slate-900 dark:text-slate-100"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Items Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Items Ordered
          </h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/60 dark:bg-slate-800/40">
                <TableRow>
                  <TableHead className="pl-4">Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="pr-4 text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderItems.map((item: any) => {
                  const itemImg =
                    item.menuItem?.image || item.menuItem?.imageUrl;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3 pl-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0 bg-slate-100 border rounded-xl w-12 h-12 overflow-hidden">
                            {itemImg ? (
                              <Image
                                src={itemImg}
                                alt="Food"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex justify-center items-center h-full text-slate-400">
                                <Utensils className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                            {item.menuItem?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        x{item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.price} Ks
                      </TableCell>
                      <TableCell className="pr-4 font-bold text-right">
                        {item.price * item.quantity} Ks
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center bg-slate-50/80 px-6 py-4 border-t">
              <span className="font-bold text-sm">Total Amount</span>
              <span className="font-black text-orange-600 text-lg">
                {order.totalAmount} Ks
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {order.status === "Pending" && (
        <CardFooter className="flex justify-between items-center bg-amber-50/30 p-4 border-t">
          <p className="text-amber-700 text-xs">
            You can cancel as long as the kitchen hasn't started preparing.
          </p>
          <CancelOrderModal orderId={order.id} />
        </CardFooter>
      )}
    </Card>
  );
}
