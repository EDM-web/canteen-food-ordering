import { Card, CardContent } from "@/components/ui/card";
import { TableRow, TableCell } from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DeleteMenuButton } from "./delete-menu-button";
import UpdateMenuForm from "./update-menu-form";
import { AddToCartButton } from "./add-to-cart-button";

import Link from "next/link";
import { Utensils } from "lucide-react";
import { ToggleAvailability } from "@/components/toggle-availability";
import { adminMenuDetailPath } from "@/lib/path";

interface Props {
  id: string;
  name: string;
  price: number;
  image?: string;
  categoryId?: string;
  categoryName?: string;
  isAvailable?: boolean;
  hasSession?: boolean;
}

const MenuItem = async ({
  id,
  name,
  price,
  image,
  categoryId,
  categoryName,
  isAvailable = true,
}: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user?.role;
  const isAdmin = userRole === "Admin";

  // ADMIN VIEW: Table Row
  if (isAdmin) {
    return (
      <TableRow className="hover:bg-slate-50/80 transition-colors">
        {/* ITEM (Image + Name Link to Detail) */}
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="relative flex justify-center items-center bg-slate-100 border rounded-md w-10 min-w-12 h-12 overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Utensils className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <Link
              href={adminMenuDetailPath(id)}
              className="font-semibold text-slate-900 hover:text-orange-600 line-clamp-1 transition-colors"
            >
              {name}
            </Link>
          </div>
        </TableCell>

        {/* CATEGORY */}
        <TableCell className="font-medium text-slate-500 text-sm">
          {categoryName || "-"}
        </TableCell>

        {/* PRICE */}
        <TableCell className="font-semibold text-orange-500 text-sm">
          {price.toLocaleString()} Ks
        </TableCell>

        {/* AVAILABILITY SELECTOR */}
        <TableCell>
          <ToggleAvailability id={id} isAvailable={isAvailable} />
        </TableCell>

        {/* ACTIONS */}
        <TableCell className="text-left">
          <div className="flex items-center gap-1.5">
            <UpdateMenuForm
              menuId={id}
              name={name}
              price={price}
              categoryId={categoryId}
              hasSession={!!session?.user}
            />
            {/* <DeleteMenuButton id={id} /> */}
          </div>
        </TableCell>
      </TableRow>
    );
  }

  // CUSTOMER VIEW: Card
  return (
    <Card className="flex flex-col justify-between bg-white shadow-gray-200 shadow-sm hover:shadow-gray-200/80 hover:shadow-xl ring-0 transition-all hover:-translate-y-1 duration-200">
      {/* 1. Image Container Section */}
      {image ? (
        <img
          src={image}
          alt={name}
          className="rounded-none w-full h-44 object-cover"
        />
      ) : (
        <div className="flex justify-center items-center h-full text-gray-400 text-xs">
          No Image
        </div>
      )}

      {/* 2. Content Section */}
      <CardContent className="flex flex-col flex-1 justify-between gap-2">
        {/* Category & Title */}
        <div className="space-y-1">
          {categoryName && (
            <p className="font-medium text-[.7rem] text-gray-400 tracking-wide">
              {categoryName}
            </p>
          )}
          <h3 className="font-bold text-gray-800 text-base line-clamp-1">
            {name}
          </h3>
        </div>

        {/* Price & Action Button Row */}
        <div className="flex justify-between items-center">
          <p className="font-bold text-orange-500 text-base">{price} Ks</p>

          {/* User Role ဧ့ Action Buttons */}
          {userRole === "Admin" ? (
            <div className="flex items-center gap-1.5">
              <UpdateMenuForm
                menuId={id}
                name={name}
                price={price}
                categoryId={categoryId}
                hasSession={!!session?.user}
              />
              {/* <DeleteMenuButton id={id} /> */}
            </div>
          ) : (
            <AddToCartButton id={id} name={name} price={price} image={image} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
