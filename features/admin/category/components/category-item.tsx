import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { adminCategoryDetailPath, categoryDetailPath } from "@/lib/path";
import { headers } from "next/headers";
import Link from "next/link";
import CreateMenuForm from "@/features/admin/menu/components/create-menu-form"; // CreateMenuForm ရဲ့ Path အမှန်စစ်ပေးပါ
import { Plus } from "lucide-react";
import UpdateCategoryForm from "./update-category-form";

interface Props {
  id: string;
  name: string;
  isCard: boolean;
}

const CategoryItem = async ({ id, name, isCard }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user.role;
  const isAdmin = userRole === "Admin";

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader>
        <Link
          href={
            isCard
              ? isAdmin
                ? adminCategoryDetailPath(id)
                : categoryDetailPath(id)
              : "#"
          }
        >
          <CardTitle className="font-bold hover:text-orange-600 text-lg transition-colors">
            {name}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex justify-between">
        {/* Admin ဖြစ်ပါက Category Card ပေါ်တွင် Direct "Add Menu" Button ပြသခြင်း */}
        {isAdmin && isCard && (
          <CreateMenuForm
            categoryId={id}
            categoryName={name}
            trigger={
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-600 shadow-lg text-white hover:text-white text-xs cursor-pointer"
              >
                <Plus className="mr-1 w-3.5 h-3.5" /> Menu
              </Button>
            }
          />
        )}
        <UpdateCategoryForm category={{ id: id, name: name }} />
      </CardContent>
    </Card>
  );
};

export default CategoryItem;

// import { Button } from "@/components/ui/button";
// import { auth } from "@/lib/auth";
// import { adminCategoryDetailPath, categoryDetailPath } from "@/lib/path";
// import { headers } from "next/headers";
// import Link from "next/link";
// import CreateMenuForm from "@/features/admin/menu/components/create-menu-form";
// import { Plus } from "lucide-react";

// interface Props {
//   id: string;
//   name: string;
//   isCard: boolean;
// }

// const CategoryItem = async ({ id, name, isCard }: Props) => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   const userRole = session?.user.role;
//   const isAdmin = userRole === "Admin";

//   // ADMIN VIEW: Original Card structure (မပြောင်းလဲဘဲ မူလအတိုင်း ထိန်းထားပါသည်)
//   if (isAdmin) {
//     return (
//       <div className="group relative flex justify-between items-center bg-white hover:bg-slate-50 p-3 px-4 border border-slate-200/80 rounded-xl transition-all">
//         <Link
//           href={isCard ? adminCategoryDetailPath(id) : "#"}
//           className="flex-1"
//         >
//           <span className="font-medium text-slate-700 group-hover:text-orange-600 text-sm transition-colors">
//             {name}
//           </span>
//         </Link>

//         {isAdmin && isCard && (
//           <CreateMenuForm
//             categoryId={id}
//             categoryName={name}
//             trigger={
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="hover:bg-orange-50 hover:border-orange-500 text-orange-600 hover:text-orange-600 text-xs cursor-pointer"
//               >
//                 <Plus className="mr-1 w-3.5 h-3.5" /> Menu
//               </Button>
//             }
//           />
//         )}
//       </div>
//     );
//   }

//   // CUSTOMER VIEW: Pill / Capsule Design (ပုံထဲကအတိုင်း ပြင်ထားပါသည်)
//   return (
//     <Link
//       href={isCard ? categoryDetailPath(id) : "#"}
//       className="inline-flex justify-center items-center bg-white hover:bg-slate-50 shadow-sm px-6 py-2.5 border border-slate-200/80 rounded-2xl font-medium text-slate-700 hover:text-orange-600 text-sm whitespace-nowrap transition-all"
//     >
//       {name}
//     </Link>
//   );
// };

// export default CategoryItem;

// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { auth } from "@/lib/auth";
// import { adminCategoryDetailPath, categoryDetailPath } from "@/lib/path";
// import { headers } from "next/headers";
// import Link from "next/link";
// import CreateMenuForm from "@/features/admin/menu/components/create-menu-form";
// import { Plus } from "lucide-react";

// interface Props {
//   id: string;
//   name: string;
//   isCard: boolean;
// }

// const CategoryItem = async ({ id, name, isCard }: Props) => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   const userRole = session?.user.role;
//   const isAdmin = userRole === "Admin";

//   return (
//     <Card className="group relative bg-white hover:bg-slate-50 shadow-none hover:shadow-sm border border-slate-200/80 rounded-xl transition-all">
//       <CardHeader className="flex flex-row justify-between items-center space-y-0 p-3 px-4">
//         <Link
//           href={
//             isCard
//               ? isAdmin
//                 ? adminCategoryDetailPath(id)
//                 : categoryDetailPath(id)
//               : "#"
//           }
//           className="flex-1"
//         >
//           <CardTitle className="font-medium text-slate-700 group-hover:text-orange-600 text-sm transition-colors">
//             {name}
//           </CardTitle>
//         </Link>

//         {/* Admin Direct "Add Menu" Button (မူလအတိုင်း မပျက်မစီး ထိန်းထားပါသည်) */}
//         {isAdmin && isCard && (
//           <CreateMenuForm
//             categoryId={id}
//             categoryName={name}
//             trigger={
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="hover:bg-orange-50 hover:border-orange-500 text-orange-600 hover:text-orange-600 text-xs cursor-pointer"
//               >
//                 <Plus className="mr-1 w-3.5 h-3.5" /> Menu
//               </Button>
//             }
//           />
//         )}
//       </CardHeader>
//     </Card>
//   );
// };

// export default CategoryItem;
