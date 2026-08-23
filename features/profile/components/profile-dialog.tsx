"use client";

import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateProfileAction } from "@/features/profile/actions/update-profile";

interface ProfileDialogProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({
  user,
  open,
  onOpenChange,
}: ProfileDialogProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        onOpenChange(false);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name || ""}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email </Label>
            <Input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              className="bg-slate-100 text-slate-700 cursor-not-allowed"
            />
          </div>

          {/* <div className="space-y-1.5">
            <Label htmlFor="password">New Password (Optional)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
            />
          </div> */}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
