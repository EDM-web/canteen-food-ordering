import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/generated/prisma/enums";

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus | "Cancelled";
}) {
  if (status === "Cancelled") {
    return (
      <Badge
        variant="outline"
        className="bg-rose-50 px-2.5 py-0.5 border-rose-300 font-normal text-rose-600 text-xs"
      >
        Cancelled
      </Badge>
    );
  }

  const isPaid = status === "Paid";

  return (
    <Badge
      variant="outline"
      className={`capitalize px-2.5 py-0.5 text-xs font-normal ${
        isPaid
          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
          : "bg-rose-50 text-rose-600 border-rose-300 "
      }`}
    >
      {status}
    </Badge>
  );
}
