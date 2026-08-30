// import CanteenMenuClient from "@/components/canteen-menu-client";
// import { getAllCategory } from "@/features/admin/category/actions/get-all-category";
// import { getAllMenu } from "@/features/admin/menu/actions/get-all-menu";
// import { protectUserRoute } from "@/lib/auth-guard";

// const AllMenuPage = async () => {
//   await protectUserRoute();

//   const categories = (await getAllCategory()) || [];
//   const allMenu = (await getAllMenu()) || [];

//   return <CanteenMenuClient categories={categories} initialMenu={allMenu} />;
// };

// export default AllMenuPage;

// app/menu/page.tsx (or your AllMenuPage path)
import CanteenMenuClient from "@/components/canteen-menu-client";

import { getAllCategory } from "@/features/admin/category/actions/get-all-category";
import { getAllMenu } from "@/features/admin/menu/actions/get-all-menu";
import { protectUserRoute } from "@/lib/auth-guard";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

const AllMenuPage = async ({ searchParams }: PageProps) => {
  const session = await protectUserRoute();

  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.search;

  const categories = (await getAllCategory()) || [];
  const allMenu = (await getAllMenu(false, searchQuery)) || [];

  return (
    <div className="space-y-6 px-2 py-4">
      <CanteenMenuClient
        categories={categories}
        initialMenu={allMenu}
        hasSession={!!session?.user}
      />
    </div>
  );
};

export default AllMenuPage;
