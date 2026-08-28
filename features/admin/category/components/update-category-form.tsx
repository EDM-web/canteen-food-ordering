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
import { updateCategory } from "../actions/update-category";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { signInPath } from "@/lib/path";
import { checkSession } from "@/lib/session";

interface UpdateCategoryFormProps {
  category: {
    id: string;
    name: string;
  };
}

const UpdateCategoryForm = ({ category }: UpdateCategoryFormProps) => {
  const router = useRouter();
  // const { data: session } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);

  // Action ထဲကို category.id ပါအောင် bind လုပ်ပေးထားပါသည်
  const updateCategoryWithId = updateCategory.bind(null, category.id);
  const [state, action] = useActionState(updateCategoryWithId, {
    message: "",
    success: false,
  });

  const handleOpenChange = async (open: boolean) => {
    const hasSession = await checkSession();

    if (!hasSession) {
      router.push(signInPath);
      toast.error("Please sign in to update category");
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
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Update
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
            <DialogDescription>Update the category name</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={category.name}
                required
              />
            </Field>
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
              className="bg-orange-600 hover:bg-orange-600 shadow-lg py-4 rounded-md cursor-pointer"
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryForm;
