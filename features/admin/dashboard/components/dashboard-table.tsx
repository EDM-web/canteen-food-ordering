"use client";

import { useState } from "react";
import {
  OrderStatusSelect,
  PaymentStatusSelect,
} from "@/features/admin/order/components/order-status-select";
import { ToggleAvailability } from "@/components/toggle-availability";
import { ExternalLink, Utensils } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UpdateMenuForm from "../../menu/components/update-menu-form";
import MenuItem from "../../menu/components/menu-item";
import { orderDetailPath } from "@/lib/path";
import { OrderDetailsSheet } from "../../order/components/order-details-sheet";
import { Order } from "@/lib/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null; // null value ပါ ခွင့်ပြုထားပါသည်
  isAvailable: boolean;
  category: { name: string };
}

interface Props {
  todayOrders: Order[];
  allMenuItems: MenuItem[];
  hasSession?: boolean;
}

export default function DashboardTable({
  todayOrders,
  allMenuItems,
  hasSession,
}: Props) {
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "AVAILABLE" | "UNAVAILABLE"
  >("ALL");

  const filteredMenuItems = allMenuItems.filter((item) => {
    if (filterStatus === "AVAILABLE") return item.isAvailable;
    if (filterStatus === "UNAVAILABLE") return !item.isAvailable;
    return true;
  });

  return (
    <div className="space-y-10">
      {/* 1. Today's Orders Table */}
      <section className="space-y-4">
        <h2 className="font-bold text-slate-700 text-xl tracking-tight">
          Today's Orders
        </h2>
        {/* <div className="flex justify-between items-center">
          
          <span className="font-medium text-slate-500 text-xs">
            Total: {todayOrders.length} orders
          </span>
        </div> */}

        <div className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
          {todayOrders.length === 0 ? (
            <div className="p-8 text-slate-500 text-sm text-center">
              No orders received today yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-slate-200 border-b font-semibold text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-mono font-medium text-xs">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {order.user?.name || order.user?.email || "Guest User"}
                      </td>
                      {/* <td className="p-4 max-w-xs text-slate-600 truncate">
                        {order.orderItems
                          .map(
                            (item) =>
                              `${item.quantity} ${
                                item.quantity === 1 ? "Item" : "Items"
                              }`
                          )
                          .join(", ")}
                      </td> */}
                      <td className="p-4 max-w-xs text-slate-600 truncate">
                        {(() => {
                          const totalQuantity = order.orderItems.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          );
                          return `${totalQuantity} ${
                            totalQuantity === 1 ? "Item" : "Items"
                          }`;
                        })()}
                      </td>
                      <td className="p-4 font-semibold text-orange-600">
                        {order.totalAmount.toLocaleString()} MMK
                      </td>
                      <td className="p-4">
                        <OrderStatusSelect
                          orderId={order.id}
                          currentStatus={order.status}
                        />
                      </td>
                      <td className="p-4">
                        <PaymentStatusSelect
                          orderId={order.id}
                          currentStatus={order.paymentStatus}
                          orderStatus={order.status}
                        />
                      </td>
                      <td className="flex gap-2 py-4 text-left">
                        <Button asChild size="sm" variant="outline">
                          <Link href={orderDetailPath(order.id)}>
                            Details{" "}
                            <ExternalLink className="ml-1 w-3.5 h-3.5" />
                          </Link>
                        </Button>
                        <OrderDetailsSheet order={order} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 2. Menu Items Table with Filter */}
      {/* <section className="space-y-4">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <h2 className="font-bold text-slate-700 text-xl tracking-tight">
            Menu Items List
          </h2>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "ALL"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("AVAILABLE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "AVAILABLE"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setFilterStatus("UNAVAILABLE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "UNAVAILABLE"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unavailable
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
          {filteredMenuItems.length === 0 ? (
            <div className="p-8 text-slate-500 text-sm text-center">
              No menu items found for this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-slate-200 border-b font-semibold text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="p-4">Item Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  
                  {filteredMenuItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="relative flex justify-center items-center bg-slate-100 border border-slate-200/80 rounded-lg w-10 h-10 overflow-hidden shrink-0">
                            {item.imageUrl && item.imageUrl.trim() !== "" ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.parentElement
                                    ?.querySelector(".fallback-icon")
                                    ?.classList.remove("hidden");
                                }}
                              />
                            ) : null}
                            <Utensils
                              className={`w-4 h-4 text-slate-400 fallback-icon ${
                                item.imageUrl && item.imageUrl.trim() !== ""
                                  ? "hidden"
                                  : ""
                              }`}
                            />
                          </div>
                          <span className="font-normal text-slate-700 line-clamp-1 leading-loose">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {item.category?.name || "-"}
                      </td>
                      <td className="p-4 font-semibold text-orange-600">
                        {item.price.toLocaleString()} MMK
                      </td>
                      <td className="p-4">
                        <ToggleAvailability
                          id={item.id}
                          isAvailable={item.isAvailable}
                        />
                      </td>

                      <td className="p-4">
                        <UpdateMenuForm
                          menuId={item.id}
                          name={item.name}
                          price={item.price}
                          hasSession={hasSession}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section> */}

      {/* 2. Menu Items Table with Filter */}
      <section className="space-y-4">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <h2 className="font-bold text-slate-700 text-xl tracking-tight">
            Menu Items List
          </h2>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "ALL"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("AVAILABLE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "AVAILABLE"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setFilterStatus("UNAVAILABLE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "UNAVAILABLE"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unavailable
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
          {filteredMenuItems.length === 0 ? (
            <div className="p-8 text-slate-500 text-sm text-center">
              No menu items found for this filter.
            </div>
          ) : (
            <Table className="w-full text-sm text-left">
              <TableHeader className="bg-slate-50/80 border-slate-200 border-b font-semibold text-slate-600 text-xs uppercase">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="p-4 h-auto font-semibold text-slate-600">
                    Item Name
                  </TableHead>
                  <TableHead className="p-4 h-auto font-semibold text-slate-600">
                    Category
                  </TableHead>
                  <TableHead className="p-4 h-auto font-semibold text-slate-600">
                    Price
                  </TableHead>
                  <TableHead className="p-4 h-auto font-semibold text-slate-600">
                    Availability
                  </TableHead>
                  <TableHead className="p-4 h-auto font-semibold text-slate-600">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {filteredMenuItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/50 border-b-0 transition-colors"
                  >
                    <TableCell className="p-4 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="relative flex justify-center items-center bg-slate-100 border border-slate-200/80 rounded-lg w-10 h-10 overflow-hidden shrink-0">
                          {item.imageUrl && item.imageUrl.trim() !== "" ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement
                                  ?.querySelector(".fallback-icon")
                                  ?.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <Utensils
                            className={`w-4 h-4 text-slate-400 fallback-icon ${
                              item.imageUrl && item.imageUrl.trim() !== ""
                                ? "hidden"
                                : ""
                            }`}
                          />
                        </div>
                        <span className="font-normal text-slate-700 line-clamp-1 leading-loose">
                          {item.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-slate-600">
                      {item.category?.name || "-"}
                    </TableCell>
                    <TableCell className="p-4 font-semibold text-orange-600">
                      {item.price.toLocaleString()} MMK
                    </TableCell>
                    <TableCell className="p-4">
                      <ToggleAvailability
                        id={item.id}
                        isAvailable={item.isAvailable}
                      />
                    </TableCell>
                    <TableCell className="p-4">
                      <UpdateMenuForm
                        menuId={item.id}
                        name={item.name}
                        price={item.price}
                        hasSession={hasSession}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}
