import CategoryMenuList from "@/features/admin/menu/components/category-menu-list";
import { protectUserRoute } from "@/lib/auth-guard";

interface Props {
  params: Promise<{ id: string }>;
}

const CategoryDetailPage = async ({ params }: Props) => {
  await protectUserRoute();
  const { id } = await params;
  return <CategoryMenuList categoryId={id} />;
};

export default CategoryDetailPage;
