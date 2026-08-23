import { getAllCategory } from "@/features/admin/category/actions/get-all-category";
import AllMenuList from "@/features/admin/menu/components/all-menu-list";
import CreateMenuForm from "@/features/admin/menu/components/create-menu-form";
import { protectAdminRoute } from "@/lib/auth-guard";

const MenuPage = async () => {
  const session = await protectAdminRoute();
  const categories = await getAllCategory();

  if (!categories) return <p>No menu item in this category</p>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-slate-700 text-3xl">All Menu Items</h1>
        <CreateMenuForm categories={categories} />
      </div>
      <AllMenuList />
    </div>
  );
};

export default MenuPage;
