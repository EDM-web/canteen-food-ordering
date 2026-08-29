import MenuItem from "./menu-item";
import { getAllMenu } from "../actions/get-all-menu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const AllMenuList = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAdmin = session?.user?.role === "Admin";

  const allMenu = await getAllMenu(isAdmin);

  if (!allMenu || allMenu.length === 0) {
    return (
      <div className="bg-white p-8 border rounded-lg text-muted-foreground text-center">
        No menu items found
      </div>
    );
  }

  if (isAdmin) {
    return (
      // <div className="bg-white shadow-sm border rounded-lg overflow-hidden">

      // </div>
      <Card className="border-none">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Items</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Availabiliby</TableHead>
                <TableHead className="text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allMenu.map((menu) => (
                <MenuItem
                  key={menu.id}
                  id={menu.id}
                  name={menu.name}
                  price={menu.price}
                  image={menu.imageUrl ?? undefined}
                  categoryName={menu.category.name}
                  categoryId={menu.categoryId}
                  isAvailable={menu.isAvailable}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {allMenu.map((menu) => (
        <MenuItem
          key={menu.id}
          id={menu.id}
          name={menu.name}
          price={menu.price}
          image={menu.imageUrl ?? undefined}
          categoryName={menu.category.name}
          categoryId={menu.categoryId}
          isAvailable={menu.isAvailable}
        />
      ))}
    </div>
  );
};

export default AllMenuList;
