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
import { createCategory } from "../actions/create-category";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInPath } from "@/lib/path";
import { PlusIcon } from "lucide-react";

interface Props {
  hasSession: boolean;
}

const CreateCategoryForm = ({ hasSession }: Props) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  // isPending ကို ပါ ထုတ်ယူလိုက်ပါ
  const [state, action, isPending] = useActionState(createCategory, {
    message: "",
    success: false,
  });

  const handleOpenChange = (open: boolean) => {
    if (open && !hasSession) {
      router.push(signInPath);
      toast.error("Please sign in to create a category");
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
      <DialogTrigger asChild className="w-fit">
        <Button
          variant="default"
          className="bg-orange-600 hover:bg-orange-600 shadow-lg py-4 rounded-md cursor-pointer"
        >
          <PlusIcon /> New Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create</DialogTitle>
            <DialogDescription>Create a new category</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required disabled={isPending} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-orange-600 hover:bg-orange-600 shadow-lg py-4 rounded-md cursor-pointer"
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryForm;
