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
        <UpdateCategoryForm
          category={{ id: id, name: name }}
          hasSession={!!session?.user}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryItem;
