import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/generated/prisma/enums";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const statusStyles: Record<OrderStatus, string> = {
    Pending: "bg-amber-50 text-amber-600 border-amber-300 ",
    Preparing: "bg-blue-50 text-blue-600 border-blue-300 animate-pulse",
    Ready: "bg-green-50 text-green-600 border-green-300 font-semibold",
    Completed: "bg-emerald-100 text-emerald-600 border-emerald-300",
    Cancelled: "bg-rose-50 text-rose-600 border-rose-300",
  };

  return (
    <Badge
      variant="outline"
      className={`capitalize px-2.5 py-0.5 text-xs ${statusStyles[status]}`}
    >
      {status}
    </Badge>
  );
}
