import CategoryList from "@/features/admin/category/components/category-list";
import CreateCategoryForm from "@/features/admin/category/components/create-category-form";
import { protectAdminRoute } from "@/lib/auth-guard";

const CategoryPage = async () => {
  const session = await protectAdminRoute();

  return (
    <div className="space-y-8">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-6">
        <h2 className="font-bold text-slate-700 text-2xl sm:text-3xl xl:text-4xl tracking-tight">
          Categories
        </h2>

        <CreateCategoryForm hasSession={!!session?.user} />
      </div>

      <CategoryList />
    </div>
  );
};

export default CategoryPage;
