"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateOrderStatusAction,
  updatePaymentStatusAction,
} from "@/features/admin/order/actions/admin-order-actions";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

// 1. Order Status Select
export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  // Customer က Cancel လုပ်ထားလျှင် Select Dropdown ပြစရာမလိုဘဲ Badge ပဲပြမည်
  if (status === "Cancelled") {
    return <OrderStatusBadge status="Cancelled" />;
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setLoading(true);
    setStatus(newStatus);
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (!res.success) {
      alert(res.error);
      setStatus(currentStatus);
    }
    setLoading(false);
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={loading}
    >
      <SelectTrigger className="h-8 font-normal text-xs">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent className="p-1">
        <SelectItem value="Pending">
          <span className="bg-amber-500 rounded-full w-2 h-2" />
          Pending
        </SelectItem>
        <SelectItem value="Preparing">
          <span className="bg-blue-500 rounded-full w-2 h-2" />
          Preparing
        </SelectItem>
        <SelectItem value="Ready">
          <span className="bg-emerald-500 rounded-full w-2 h-2" />
          Ready
        </SelectItem>
        <SelectItem value="Completed">
          <span className="bg-green-500 rounded-full w-2 h-2" />
          Completed
        </SelectItem>
        {/* Cancelled ကို Admin Dropdown မှ မမြင်ရအောင် ဖြုတ်ထားပါသည် */}
      </SelectContent>
    </Select>
  );
}

// 2. Payment Status Select
export function PaymentStatusSelect({
  orderId,
  currentStatus,
  orderStatus,
}: {
  orderId: string;
  currentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<PaymentStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  // Order သည် Cancelled ဖြစ်နေလျှင် Payment Dropdown မပြဘဲ Cancelled Badge ပဲ ပြမည်
  if (orderStatus === "Cancelled") {
    return <PaymentStatusBadge status="Cancelled" />;
  }

  const handlePaymentChange = async (newStatus: PaymentStatus) => {
    setLoading(true);
    setStatus(newStatus);
    const res = await updatePaymentStatusAction(orderId, newStatus);
    if (!res.success) {
      alert(res.error);
      setStatus(currentStatus);
    }
    setLoading(false);
  };

  return (
    <Select
      value={status}
      onValueChange={handlePaymentChange}
      disabled={loading}
    >
      <SelectTrigger className="h-8 font-normal text-xs">
        <SelectValue placeholder="Select Payment" />
      </SelectTrigger>
      <SelectContent className="p-1">
        <SelectItem value="Unpaid">
          <span className="bg-red-500 rounded-full w-2 h-2" />
          Unpaid
        </SelectItem>
        <SelectItem value="Paid">
          <span className="bg-emerald-500 rounded-full w-2 h-2" />
          Paid
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
