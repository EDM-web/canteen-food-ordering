"use client";

import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  OrderStatusSelect,
  PaymentStatusSelect,
} from "@/features/admin/order/components/order-status-select";

import { Order } from "@/lib/type";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { adminOrderDetailPath, orderDetailPath } from "@/lib/path";

export function OrderDetailsSheet({ order }: { order: Order }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="secondary" className="cursor-pointer">
          Quick View
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-3 w-[50%] overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex flex-col font-bold text-lg">
            <span>Order #{order.id.slice(-6).toUpperCase()}</span>
            <Button asChild size="sm" variant="ghost" className="w-fit text-xs">
              <Link href={adminOrderDetailPath(order.id)}>
                Full Detail <ExternalLink className="ml-1 w-3 h-3" />
              </Link>
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pt-4">
          {/* Status Updates */}
          <div className="gap-3 grid grid-cols-2 bg-slate-50 p-3 border-slate-100 border-none rounded-md">
            <div>
              <p className="mb-1.5 font-medium text-muted-foreground text-xs">
                Order Status
              </p>
              <OrderStatusSelect
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
            <div>
              <p className="mb-1.5 font-medium text-muted-foreground text-xs">
                Payment Status
              </p>
              <PaymentStatusSelect
                orderId={order.id}
                currentStatus={order.paymentStatus}
                orderStatus={order.status}
              />
            </div>
          </div>

          {/* Menu Items List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Items ({order.orderItems.length})
              </h4>
              <p className="text-slate-500 text-sm">
                {/* {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} */}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="space-y-3">
              {order.orderItems.map((item) => {
                // Image URL ကို image သို့မဟုတ် imageUrl နှစ်ခုလုံး စစ်ဆေးခြင်း
                const imgSrc = item.menuItem?.image || item.menuItem?.imageUrl;

                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white p-2 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0 bg-slate-100 border rounded-md w-14 h-14 overflow-hidden">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={item.menuItem?.name || "Menu item"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex justify-center items-center p-1 w-full h-full text-[10px] text-muted-foreground text-center">
                            No Image
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm leading-tight">
                          {item.menuItem?.name || "Menu Item"}
                        </p>
                        <p className="mt-1 text-muted-foreground text-xs">
                          Qty: {item.quantity} × {item.price} Ks
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      {item.quantity * item.price} Ks
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
            <span>Total Amount</span>
            <span className="text-orange-600">{order.totalAmount} Ks</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
