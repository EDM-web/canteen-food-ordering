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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { signInPath } from "@/lib/path";
import { createMenu } from "../actions/create-menu";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { PlusIcon, X } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface Props {
  categoryId?: string; // Optional ပြုလုပ်ထားပါသည်
  categoryName?: string;
  categories?: CategoryOption[]; // All Menu Page အတွက် Passing Data
  trigger?: ReactNode;
}

const CreateMenuForm = ({
  categoryId,
  categoryName,
  categories = [],
  trigger,
}: Props) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categoryId || ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(createMenu, {
    message: "",
    success: false,
  });

  const handleOpenChange = (open: boolean) => {
    if (open && !session?.user) {
      router.push(signInPath);
      toast.error("Please sign in to create a menu");
      return;
    }
    setIsOpen(open);
    if (!open) {
      setImageUrl("");
      setSelectedCategoryId(categoryId || "");
    }
  };

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      setIsOpen(false);
      setImageUrl("");
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="default"
            className="bg-orange-600 hover:bg-orange-600 shadow-lg py-4 rounded-md cursor-pointer"
          >
            <PlusIcon /> Create Menu
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create Menu Item</DialogTitle>
            <DialogDescription>
              Add a new menu{" "}
              {categoryName ? `to "${categoryName}"` : "item to your menu list"}
            </DialogDescription>
          </DialogHeader>

          {/* Hidden Inputs */}
          <Input
            type="hidden"
            name="id"
            value={categoryId || selectedCategoryId}
            required
          />
          <Input type="hidden" name="image" value={imageUrl} />

          {/* 2-Column Grid Layout */}
          <div className="items-start gap-4 grid grid-cols-1 md:grid-cols-2">
            {/* Column 1: Image Upload */}
            <div className="flex flex-col space-y-2">
              <Label>Menu Image</Label>
              {imageUrl ? (
                <div className="relative bg-slate-50 border rounded-xl w-full h-48 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt="Uploaded Menu"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="top-2 right-2 absolute bg-red-600 hover:bg-red-700 shadow-md p-1.5 rounded-full text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center items-center bg-slate-50/50 border-2 border-slate-200 hover:border-orange-400 border-dashed rounded-xl w-full h-48 transition-colors">
                  {/* <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setImageUrl(res[0].ufsUrl);
                        toast.success("Image uploaded successfully");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                    content={{
                      label: (
                        <span className="font-medium text-slate-500 text-xs">
                          Upload Image
                        </span>
                      ),
                      allowedContent: null,
                    }}
                    appearance={{
                      container:
                        "border-none p-0 h-full w-full flex flex-col items-center justify-center cursor-pointer",
                      button:
                        "!bg-orange-600 hover:!bg-orange-600 text-white text-xs  !py-4 rounded-md mt-2   cursor-pointer shadow-none" +
                        "ut-uploading:!bg-orange-600" +
                        "ut-uploading:after:!bg-orange-600 ut-uploading:before:!bg-orange-600 focus-within:!ring-orange-500",
                      label: "text-xs text-slate-500 mt-1",
                    }}
                  /> */}
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setImageUrl(res[0].ufsUrl);
                        toast.success("Image uploaded successfully");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                    content={{
                      label: (
                        <span className="font-medium text-slate-500 text-xs">
                          Upload Image
                        </span>
                      ),

                      allowedContent: null,
                    }}
                    appearance={{
                      container:
                        "border-none p-0 h-full w-full flex flex-col items-center justify-center cursor-pointer",
                      button:
                        "!bg-orange-600 hover:!bg-orange-600 text-white text-xs !py-2 rounded-md mt-2 cursor-pointer shadow-none " +
                        "ut-uploading:!bg-orange-600 " +
                        "ut-uploading:after:!bg-orange-600 ut-uploading:before:!bg-orange-600 focus-within:!ring-orange-500",
                      label: "text-xs text-slate-500 mt-1",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Column 2: Inputs & Conditional Category Select */}
            <div className="flex flex-col justify-between h-full">
              <FieldGroup className="">
                {/* Menu Name */}
                <Field>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Chicken Burger"
                    required
                  />
                </Field>

                {/* Price */}
                <Field>
                  <Label htmlFor="price">Price (Ks)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="1000"
                    required
                  />
                </Field>

                {/* Category ID မပါလာမှသာ Category Select Box ကို Render လုပ်ပေးမည် */}
                {!categoryId && (
                  <Field>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={setSelectedCategoryId}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </FieldGroup>
            </div>
          </div>

          <DialogFooter className="mt-6">
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
              // disabled={
              //   isPending || !imageUrl || (!categoryId && !selectedCategoryId)
              // }
              disabled={isPending}
              className="bg-orange-600 hover:bg-orange-600 shadow-lg cursor-pointer"
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenuForm;

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
// import { useActionState, useEffect, useState, ReactNode } from "react";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import { signInPath } from "@/lib/path";
// import { createMenu } from "../actions/create-menu";
// import { UploadDropzone } from "@/lib/uploadthing";
// import Image from "next/image";
// import { PlusIcon, UploadCloud, X } from "lucide-react";

// interface Props {
//   categoryId: string;
//   categoryName?: string;
//   trigger?: ReactNode;
// }

// const CreateMenuForm = ({ categoryId, categoryName, trigger }: Props) => {
//   const router = useRouter();
//   const { data: session } = authClient.useSession();

//   const [imageUrl, setImageUrl] = useState<string>("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [state, action, isPending] = useActionState(createMenu, {
//     message: "",
//     success: false,
//   });

//   const handleOpenChange = (open: boolean) => {
//     if (open && !session?.user) {
//       router.push(signInPath);
//       toast.error("Please sign in to create a menu");
//       return;
//     }
//     setIsOpen(open);
//     if (!open) setImageUrl("");
//   };

//   useEffect(() => {
//     if (!state.message) return;

//     if (state.success) {
//       setIsOpen(false);
//       setImageUrl("");
//       toast.success(state.message);
//     } else {
//       toast.error(state.message);
//     }
//   }, [state]);

//   return (
//     <Dialog onOpenChange={handleOpenChange} open={isOpen}>
//       <DialogTrigger asChild>
//         {trigger ? (
//           trigger
//         ) : (
//           <Button
//             variant="default"
//             className="bg-orange-600 hover:bg-orange-600 shadow-lg py-4 rounded-md cursor-pointer"
//           >
//             <PlusIcon /> Create Menu
//           </Button>
//         )}
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-xl">
//         <form action={action} className="space-y-4">
//           <DialogHeader>
//             <DialogTitle>Create Menu Item</DialogTitle>
//             <DialogDescription>
//               Add a new menu{" "}
//               {categoryName ? `to "${categoryName}"` : "to this category"}
//             </DialogDescription>
//           </DialogHeader>

//           {/* Hidden Inputs */}
//           <Input type="hidden" name="id" defaultValue={categoryId} required />
//           <Input type="hidden" name="image" value={imageUrl} />

//           {/* 2-Column Grid Layout */}
//           <div className="items-start gap-4 grid grid-cols-1 md:grid-cols-2">
//             {/* Column 1: Clean Image Upload */}
//             <div className="flex flex-col space-y-2">
//               <Label>Menu Image</Label>
//               {imageUrl ? (
//                 <div className="relative bg-slate-50 border rounded-xl w-full h-48 overflow-hidden">
//                   <Image
//                     src={imageUrl}
//                     alt="Uploaded Menu"
//                     fill
//                     className="object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setImageUrl("")}
//                     className="top-2 right-2 absolute bg-red-600 hover:bg-red-700 shadow-md p-1.5 rounded-full text-white transition cursor-pointer"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex justify-center items-center bg-slate-50/50 border-2 border-slate-200 hover:border-orange-400 border-dashed rounded-xl w-full h-48 transition-colors">
//                   <UploadDropzone
//                     endpoint="imageUploader"
//                     onClientUploadComplete={(res) => {
//                       if (res && res[0]) {
//                         setImageUrl(res[0].ufsUrl);
//                         toast.success("Image uploaded successfully");
//                       }
//                     }}
//                     onUploadError={(error: Error) => {
//                       toast.error(`Upload failed: ${error.message}`);
//                     }}
//                     content={{
//                       label: (
//                         <span className="font-medium text-slate-500 text-xs">
//                           Upload Image
//                         </span>
//                       ),
//                       allowedContent: null, // Max size စာသား ဖြုတ်ခြင်း
//                     }}
//                     appearance={{
//                       container:
//                         "border-none p-0 h-full w-full flex flex-col items-center justify-center cursor-pointer",
//                       button:
//                         "bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-md mt-2 ut-uploading:bg-orange-400 cursor-pointer shadow-none",
//                       label: "text-xs text-slate-500 mt-1",
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Column 2: Name & Price Inputs */}
//             <div className="flex flex-col justify-between space-y-3 h-full">
//               <FieldGroup className="space-y-3">
//                 {/* Menu Name */}
//                 <Field>
//                   <Label htmlFor="name">Name</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     placeholder="e.g. Chicken Burger"
//                     required
//                   />
//                 </Field>

//                 {/* Price */}
//                 <Field>
//                   <Label htmlFor="price">Price (Ks)</Label>
//                   <Input
//                     id="price"
//                     name="price"
//                     type="number"
//                     placeholder="1000"
//                     required
//                   />
//                 </Field>
//               </FieldGroup>
//             </div>
//           </div>

//           <DialogFooter className="mt-6">
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
//               disabled={isPending || !imageUrl}
//               className="bg-orange-600 hover:bg-orange-600 shadow-lg cursor-pointer"
//             >
//               {isPending ? "Creating..." : "Create"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateMenuForm;
