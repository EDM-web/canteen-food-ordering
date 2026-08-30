// components/order/CancelOrderModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cancelOrderAction } from "@/features/order/actions/user-order-actions";
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

export function CancelOrderModal({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await cancelOrderAction(orderId);
      if (res.success) {
        toast.success("Order cancelled successfully");
        setOpen(false);
        // Page ကို Server-side Data ပြန် Refresh လုပ်ရန်
        window.location.reload();
      } else {
        toast.error(res.error || "Failed to cancel order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-500 hover:bg-red-600 font-semibold text-white"
        >
          Cancel Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently cancel your order.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelling}>Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            disabled={cancelling}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
