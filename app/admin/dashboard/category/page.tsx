import CategoryList from "@/features/admin/category/components/category-list";
import CreateCategoryForm from "@/features/admin/category/components/create-category-form";
import { protectAdminRoute } from "@/lib/auth-guard";

const CategoryPage = async () => {
  const session = await protectAdminRoute();
  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between">
          <h2 className="font-bold text-slate-700 text-3xl tracking-tight">
            {" "}
            Categories
          </h2>

          <CreateCategoryForm />
        </div>

        <CategoryList />
      </div>
    </>
  );
};

export default CategoryPage;
