import CategoryList from "@/features/admin/category/components/category-list";

import { protectUserRoute } from "@/lib/auth-guard";

const CategoryPage = async () => {
  await protectUserRoute();
  return <CategoryList />;
};

export default CategoryPage;
