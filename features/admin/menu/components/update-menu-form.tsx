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
import { signInPath } from "@/lib/path";
import { updateMenu } from "../actions/update-menu";
import { UploadButton } from "@/lib/uploadthing"; // သင့် UploadThing Component Path အတိုင်း စစ်ပေးပါ
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface Props {
  menuId: string;
  categoryId?: string;
  name: string;
  price: number;
  image?: string | null;
  hasSession?: boolean;
}

const UpdateMenuForm = ({
  menuId,
  categoryId,
  name,
  price,
  image,
  hasSession,
}: Props) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(image || "");
  const [state, action, isPending] = useActionState(updateMenu, {
    message: "",
    success: false,
  });

  const handleOpenChange = (open: boolean) => {
    if (open && !hasSession) {
      router.push(signInPath);
      toast.error("Please sign in to update a menu");
      return;
    }
    setIsOpen(open);
    if (open) {
      setImageUrl(image || "");
    }
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
        <Button
          variant="default"
          size={"sm"}
          className="bg-orange-600 hover:bg-orange-600 text-white cursor-pointer"
        >
          Update
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Menu</DialogTitle>
            <DialogDescription>Update menu details and image</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Input type="hidden" name="id" defaultValue={menuId} required />
            <Input type="hidden" name="categoryId" defaultValue={categoryId} />
            {/* Image URL String ကို Server Action သို့ Hidden Field ဖြင့် ပါးမည် */}
            <Input type="hidden" name="imageUrl" value={imageUrl} />

            {/* Menu Image Preview & Simple Upload Button */}
            <Field>
              <Label>Menu Image</Label>
              <div className="space-y-3">
                {imageUrl ? (
                  <div className="relative border-2 border-slate-200 rounded-xl w-full h-36 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt="Menu Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="top-2 right-2 absolute bg-red-500 hover:bg-red-600 p-1.5 rounded-full text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center border-2 border-slate-300 border-dashed rounded-xl w-full h-36">
                    <UploadButton
                      endpoint="imageUploader" // သင့် UploadThing Core ထဲက Endpoint Name ဖြစ်ရမည်
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          setImageUrl(res[0].url); // Image URL string ကို ရယူပြီး state ထဲ သိမ်းမည်
                          toast.success("Image uploaded successfully");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                      appearance={{
                        container:
                          "border-none p-0 h-full w-full flex flex-col items-center justify-center cursor-pointer",
                        button:
                          "!bg-orange-600 hover:!bg-orange-600 text-white text-xs !py-2 rounded-md mt-2 cursor-pointer shadow-none " +
                          "ut-uploading:!bg-orange-600 " +
                          "ut-uploading:after:!bg-orange-600 ut-uploading:before:!bg-orange-600 focus-within:!ring-orange-500",
                      }}
                    />
                  </div>
                )}
              </div>
            </Field>

            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={name} required />
            </Field>

            <Field>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                name="price"
                defaultValue={price}
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
              disabled={isPending}
              className="bg-orange-600 hover:bg-orange-600 text-white cursor-pointer"
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

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Field, FieldGroup } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useActionState, useEffect, useState } from "react";

// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import { signInPath } from "@/lib/path";
// import { updateMenu } from "../actions/update-menu";

// interface Props {
//   menuId: string;
//   categoryId?: string;
//   name: string;
//   price: number;
//   hasSession?: boolean;
// }

// const UpdateMenuForm = ({
//   menuId,
//   categoryId,
//   name,
//   price,
//   hasSession,
// }: Props) => {
//   const router = useRouter();

//   const [isOpen, setIsOpen] = useState(false);
//   const [state, action, isPending] = useActionState(updateMenu, {
//     message: "",
//     success: false,
//   });

//   const handleOpenChange = (open: boolean) => {
//     if (open && !hasSession) {
//       router.push(signInPath);
//       toast.error("Please sign in to create a menu");
//       return;
//     }
//     setIsOpen(open);
//   };

//   useEffect(() => {
//     if (!state.message) return;

//     if (state.success) {
//       setIsOpen(false);
//       toast.success(state.message);
//     } else {
//       toast.error(state.message);
//     }
//   }, [state]);

//   return (
//     <Dialog onOpenChange={handleOpenChange} open={isOpen}>
//       {/* Trigger stays outside the form */}
//       <DialogTrigger asChild>
//         <Button
//           variant="default"
//           size={"sm"}
//           className="bg-orange-600 hover:bg-orange-600 cursor-pointer"
//         >
//           Update
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-sm">
//         {/* Wrap form only around the content that needs to submit */}
//         <form action={action} className="space-y-4">
//           <DialogHeader>
//             <DialogTitle>Update</DialogTitle>
//             <DialogDescription>update this menu</DialogDescription>
//           </DialogHeader>

//           <FieldGroup>
//             <Input type="hidden" name="id" defaultValue={menuId} required />
//             <Input
//               type="hidden"
//               name="categoryId"
//               defaultValue={categoryId}
//               required
//             />

//             <Field>
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" name="name" defaultValue={name} required />
//             </Field>

//             <Field>
//               <Label htmlFor="name">Price</Label>
//               <Input type="number" name="price" defaultValue={price} required />
//             </Field>

//             {/* <Field>
//               <Label htmlFor="name"></Label>
//               <Input id="name" name="name" required />
//             </Field> */}
//           </FieldGroup>

//           <DialogFooter className="mt-4">
//             <DialogClose asChild>
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="cursor-pointer"
//               >
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button
//               type="submit"
//               disabled={isPending}
//               className="bg-orange-600 hover:bg-orange-600 cursor-pointer"
//             >
//               {isPending ? "Updating..." : "Update"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UpdateMenuForm;
