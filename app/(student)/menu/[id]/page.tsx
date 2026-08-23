import { prisma } from "@/lib/prisma";
import { protectUserRoute } from "@/lib/auth-guard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Utensils,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "@/features/admin/menu/components/add-to-cart-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MenuDetailPage({ params }: Props) {
  await protectUserRoute();
  const { id } = await params;

  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!menuItem) {
    return (
      <div className="p-12 font-medium text-red-500 text-center">
        Menu item not found
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-orange-600"
      >
        <Link href="/admin/dashboard/menu">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to All Menu
        </Link>
      </Button>

      <Card className="bg-white shadow-sm p-6 border rounded-xl">
        <div className="items-start gap-8 grid md:grid-cols-2">
          {/* Image Container */}
          <div className="relative flex justify-center items-center bg-slate-50 border rounded-lg w-full aspect-square overflow-hidden">
            {menuItem.imageUrl ? (
              <Image
                src={menuItem.imageUrl}
                alt={menuItem.name}
                fill
                className="object-cover"
              />
            ) : (
              <Utensils className="w-16 h-16 text-slate-300" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-orange-50 px-3 py-1 border border-orange-200 rounded-full font-semibold text-orange-600 text-xs">
                <Tag className="w-3.5 h-3.5" />
                {menuItem.category.name}
              </span>
              <h1 className="mt-2 font-extrabold text-slate-900 text-3xl">
                {menuItem.name}
              </h1>
            </div>

            <div className="font-bold text-orange-600 text-2xl">
              {menuItem.price.toLocaleString()} Ks
            </div>

            <div className="space-y-3 pt-4 border-slate-100 border-t text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Status:</span>
                {menuItem.isAvailable ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-red-500">
                    <XCircle className="w-4 h-4" /> Unavailable
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>
                  Created Date:{" "}
                  {new Date(menuItem.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-8">
                <AddToCartButton
                  paramId={id}
                  id={menuItem.id}
                  name={menuItem.name}
                  price={menuItem.price}
                  image={menuItem.imageUrl ?? undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
