"use client";

import { useEffect, useState, use } from "react";
import {
  getOrderDetailAction,
  cancelOrderAction,
} from "@/features/order/actions/user-order-actions";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Clock,
  ChefHat,
  CheckCircle2,
  ShoppingBag,
  XCircle,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { orderPath } from "@/lib/path";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const fetchOrder = async () => {
    const res = await getOrderDetailAction(orderId);
    if (res.success) {
      setOrder(res.order);
    } else {
      setError(res.error || "Failed to load order");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await cancelOrderAction(orderId);
      if (res.success) {
        toast.success("Order cancelled successfully");
        fetchOrder();
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-muted-foreground text-sm text-center">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-12 font-medium text-rose-500 text-center">
        {error || "Order not found"}
      </div>
    );
  }

  const steps = [
    { key: "Pending", label: "Order Placed", icon: Clock },
    { key: "Preparing", label: "Preparing", icon: ChefHat },
    { key: "Ready", label: "Ready for Pickup", icon: ShoppingBag },
    { key: "Completed", label: "Completed", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="space-y-4 mx-auto py-6 max-w-3xl container">
      {/* Back Button */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 text-slate-600 hover:text-orange-600 dark:hover:text-orange-400 dark:text-slate-400"
      >
        <Link href={orderPath}>
          <ArrowLeft className="mr-1.5 w-4 h-4" /> Back to Orders
        </Link>
      </Button>

      {/* Main Single Combined Card */}
      <Card className="bg-white dark:bg-slate-900 shadow-lg p-0 border-amber-100/60 dark:border-slate-800 rounded-3xl overflow-hidden">
        {/* 1. Header Section */}
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
          {/* 2. Order Timeline Tracker */}
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
                            ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                        } ${
                          isCurrent
                            ? "ring-4 ring-orange-500/20 dark:ring-orange-500/30 scale-105"
                            : ""
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isPassed
                            ? "text-slate-900 dark:text-slate-100"
                            : "text-slate-400 dark:text-slate-500"
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

          {/* 3. Order Items Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Items Ordered
            </h3>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/60 dark:bg-slate-800/40">
                  <TableRow className="border-slate-100 dark:border-slate-800">
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
                      <TableRow
                        key={item.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-slate-100 dark:border-slate-800/60"
                      >
                        <TableCell className="py-3 pl-4 font-medium">
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-12 h-12 overflow-hidden">
                              {itemImg ? (
                                <Image
                                  src={itemImg}
                                  alt={item.menuItem?.name || "Food"}
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
                        <TableCell className="font-medium text-slate-600 dark:text-slate-400 text-center">
                          x{item.quantity}
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400 text-xs text-right">
                          {item.price} Ks
                        </TableCell>
                        <TableCell className="pr-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                          {item.price * item.quantity} Ks
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Total Amount Summary Box */}
              <div className="flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/60 px-6 py-4 border-slate-100 dark:border-slate-800 border-t">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                  Total Amount
                </span>
                <span className="font-black text-orange-600 dark:text-amber-500 text-lg sm:text-xl">
                  {order.totalAmount} Ks
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* 4. Action Footer (If Order is Pending) */}
        {order.status === "Pending" && (
          <CardFooter className="flex sm:flex-row flex-col justify-between items-center gap-3 bg-amber-50/30 dark:bg-slate-800/30 p-4 border-slate-100 dark:border-slate-800 border-t">
            <p className="text-amber-700 dark:text-amber-400 text-xs">
              You can cancel as long as the kitchen hasn't started preparing.
            </p>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto font-semibold text-white cursor-pointer"
                >
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently cancel your order. This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={cancelling}
                    className="rounded-xl"
                  >
                    Back
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancel();
                    }}
                    disabled={cancelling}
                    className="bg-rose-600 hover:bg-rose-700 rounded-xl text-white"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
