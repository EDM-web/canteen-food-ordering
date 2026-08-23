import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/features/admin/menu/components/add-to-cart-button";
import { menuDetailPath } from "@/lib/path";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  price: number;
  image?: string;
  categoryId?: string;
  categoryName?: string;
  isAvailable?: boolean;
}

const ClientMenuItem = ({
  id,
  name,
  price,
  image,
  categoryId,
  categoryName,
  isAvailable = true,
}: Props) => {
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
          {/* <h3 className="font-bold text-gray-800 text-base line-clamp-1 leading-snug"> */}
          <Link
            href={menuDetailPath(id)}
            className="font-bold text-slate-800 hover:text-orange-600 text-base line-clamp-1 leading-snug transition-colors"
          >
            {name}
          </Link>
          {/* </h3> */}
        </div>

        {/* Price & Action Button Row */}
        <div className="flex justify-between items-center">
          <p className="font-bold text-orange-500 text-base">{price} Ks</p>

          <AddToCartButton id={id} name={name} price={price} image={image} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientMenuItem;
