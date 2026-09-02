// app/orders/[id]/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { orderPath } from "@/lib/path";
import { OrderDetailContent } from "@/features/order/components/order-detail-content";
import { Skeleton } from "@/components/ui/skeleton";

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 p-6 border border-slate-100 rounded-3xl animate-pulse">
      <div className="flex justify-between items-center pb-6 border-b">
        <div className="space-y-2">
          <Skeleton className="w-40 h-8" />
          <Skeleton className="w-60 h-4" />
        </div>
        <Skeleton className="rounded-full w-20 h-6" />
      </div>
      <Skeleton className="rounded-2xl w-full h-24" />
      <Skeleton className="rounded-2xl w-full h-48" />
    </div>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div className="space-y-4 mx-auto py-6 max-w-3xl min-h-screen container">
      {/* ၁။ Back Button က Link နှိပ်လိုက်တာနဲ့ Instant ပေါ်မည် */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 text-slate-600 hover:text-orange-600"
      >
        <Link href={orderPath}>
          <ArrowLeft className="mr-1.5 w-4 h-4" /> Back to Orders
        </Link>
      </Button>

      {/* ၂။ DB ကနေ Data ဆွဲနေစဉ် အောက်ပါ Skeleton ကို အစားထိုးပြထားမည် */}
      {/* <Suspense fallback={<LoadingSpinner />}>

      </Suspense> */}
      <OrderDetailContent orderId={resolvedParams.id} />
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { pusherClient } from "@/lib/pusher-client";
// import { getOrderDetailAction } from "@/features/order/actions/user-order-actions";
// import { OrderStatusBadge } from "@/components/order-status-badge";
// import { PaymentStatusBadge } from "@/components/payment-status-badge";

// export function OrderDetailPage({ orderId }: { orderId: string }) {
//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   // 初回 Data Fetching
//   const fetchOrder = async () => {
//     const res = await getOrderDetailAction(orderId);
//     if (res.success) {
//       setOrder(res.order);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchOrder();

//     // 1. Admin Order Actions ထဲမှာ သုံးထားသည့် Channel name "admin-orders" ကို Subscribe လုပ်မည်
//     const channel = pusherClient.subscribe("admin-orders");

//     // 2. Admin ဘက်က Trigger လုပ်သည့် "update-order" Event ကို နားထောင်မည်
//     channel.bind("update-order", (updatedOrder: any) => {
//       // 3. Update ဖြစ်လာသော Order ID သည် လက်ရှိ Customer ကြည့်နေသော Order ID နှင့် တူမှ State ကို Update လုပ်မည်
//       if (updatedOrder.id === orderId) {
//         setOrder((prevOrder: any) => ({
//           ...prevOrder,
//           status: updatedOrder.status,
//           paymentStatus: updatedOrder.paymentStatus,
//         }));
//       }
//     });

//     // Component Unmount ဖြစ်လျှင် Channel ကို Unsubscribe ပြန်လုပ်ပေးရမည် (Memory Leak မဖြစ်စေရန်)
//     return () => {
//       pusherClient.unsubscribe("admin-orders");
//     };
//   }, [orderId]);

//   if (loading) return <p>Loading...</p>;
//   if (!order) return <p>Order not found</p>;

//   return (
//     <div className="space-y-6">
//       {/* Real-time ပြောင်းလဲသွားမည့် Badges များ */}
//       <div className="flex gap-2">
//         <OrderStatusBadge status={order.status} />
//         <PaymentStatusBadge status={order.paymentStatus} />
//       </div>

//       {/* အခြား Order Details UI များ... */}
//     </div>
//   );
// }
