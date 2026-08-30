"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { signInPath } from "@/lib/path";
import { updateMenu } from "../actions/update-menu";

interface Props {
  menuId: string;
  categoryId?: string;
  name: string;
  price: number;
  hasSession?: boolean;
}

const UpdateMenuForm = ({
  menuId,
  categoryId,
  name,
  price,
  hasSession,
}: Props) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(updateMenu, {
    message: "",
    success: false,
  });

  const handleOpenChange = (open: boolean) => {
    if (open && !hasSession) {
      router.push(signInPath);
      toast.error("Please sign in to create a menu");
      return;
    }
    setIsOpen(open);
  };

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      setIsOpen(false);
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      {/* Trigger stays outside the form */}
      <DialogTrigger asChild>
        <Button
          variant="default"
          size={"sm"}
          className="bg-orange-600 hover:bg-orange-600 cursor-pointer"
        >
          Update
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        {/* Wrap form only around the content that needs to submit */}
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update</DialogTitle>
            <DialogDescription>update this menu</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Input type="hidden" name="id" defaultValue={menuId} required />
            <Input
              type="hidden"
              name="categoryId"
              defaultValue={categoryId}
              required
            />

            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={name} required />
            </Field>

            <Field>
              <Label htmlFor="name">Price</Label>
              <Input type="number" name="price" defaultValue={price} required />
            </Field>

            {/* <Field>
              <Label htmlFor="name"></Label>
              <Input id="name" name="name" required />
            </Field> */}
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-orange-600 hover:bg-orange-600 cursor-pointer"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMenuForm;
