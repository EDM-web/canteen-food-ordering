import { Button } from "@/components/ui/button";
import CategoryMenuList from "@/features/admin/menu/components/category-menu-list";
import CreateMenuForm from "@/features/admin/menu/components/create-menu-form";
import { protectAdminRoute } from "@/lib/auth-guard";
import { adminCategoryPath } from "@/lib/path";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

const CategoryDetailPage = async ({ params }: Props) => {
  const session = await protectAdminRoute();
  const categoryId = (await params).id;

  //   const allMenu = await getAllMenuById(categoryId);

  //   const category = await getOneCategory(categoryId);

  return (
    <>
      <div className="space-y-8">
        {/* header banner  */}
        <div className="flex justify-between">
          <Link href={adminCategoryPath}>
            <Button
              size={"sm"}
              variant={"ghost"}
              className="text-muted-foreground hover:text-orange-500 cursor-pointer"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Categories
            </Button>
          </Link>
          <CreateMenuForm categoryId={categoryId} />
        </div>

        <CategoryMenuList categoryId={categoryId} />
      </div>
    </>
  );
};

export default CategoryDetailPage;
