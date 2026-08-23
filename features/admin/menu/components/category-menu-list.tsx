import { getAllMenuById } from "@/features/admin/menu/actions/get-all-menuById";
import MenuItem from "./menu-item";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  categoryId: string;
}

const CategoryMenuList = async ({ categoryId }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAdmin = session?.user?.role === "Admin";

  const allMenu = await getAllMenuById(categoryId);

  if (!allMenu || allMenu.length === 0) {
    return (
      <div className="bg-white p-8 border rounded-lg text-muted-foreground text-center">
        No menu items found in this category.
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[300px]">Items</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Availablity</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allMenu.map((menu) => (
              <MenuItem
                key={menu.id}
                categoryId={categoryId}
                id={menu.id}
                name={menu.name}
                price={menu.price}
                categoryName={menu.category.name}
                image={menu.imageUrl ?? undefined}
                isAvailable={menu.isAvailable}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {allMenu.map((menu) => (
        <MenuItem
          key={menu.id}
          categoryId={categoryId}
          id={menu.id}
          name={menu.name}
          price={menu.price}
          categoryName={menu.category.name}
          image={menu.imageUrl ?? undefined}
          isAvailable={menu.isAvailable}
        />
      ))}
    </div>
  );
};

export default CategoryMenuList;
