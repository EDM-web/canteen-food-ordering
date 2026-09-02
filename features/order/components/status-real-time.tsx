// features/orders/components/order-status-stream.tsx
"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { Badge } from "@/components/ui/badge"; // သင့် UI Component Path အလိုက် ပြင်ပါ

interface StatusRealTimeProps {
  orderId: string;
  initialStatus: string;
  initialPaymentStatus: string;
}

export function StatusRealTime({
  orderId,
  initialStatus,
  initialPaymentStatus,
}: StatusRealTimeProps) {
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);

  useEffect(() => {
    // Admin Side က Trigger လုပ်နေသည့် Channel Name
    const channel = pusherClient.subscribe("admin-orders");

    channel.bind(
      "update-order",
      (updatedOrder: { id: string; status: string; paymentStatus: string }) => {
        // လက်ရှိ ရောက်နေသည့် Order ID နဲ့ တူမှသာ State ကို Update လုပ်မည်
        if (updatedOrder.id === orderId) {
          if (updatedOrder.status) setStatus(updatedOrder.status);
          if (updatedOrder.paymentStatus)
            setPaymentStatus(updatedOrder.paymentStatus);
        }
      }
    );

    return () => {
      pusherClient.unsubscribe("admin-orders");
    };
  }, [orderId]);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="capitalize">
        Order: {status.toLowerCase()}
      </Badge>
      <Badge
        variant={paymentStatus === "PAID" ? "default" : "destructive"}
        className="capitalize"
      >
        Payment: {paymentStatus.toLowerCase()}
      </Badge>
    </div>
  );
}
