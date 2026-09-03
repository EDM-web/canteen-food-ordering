import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, CheckCircle2, XCircle } from "lucide-react";
import { protectAdminRoute } from "@/lib/auth-guard";

import DashboardTable from "@/features/admin/dashboard/components/dashboard-table";
import { OrdersTable } from "@/features/admin/order/components/order-table";

export default async function AdminDashboardPage() {
  const session = await protectAdminRoute();

  // ယနေ့အတွက် Start & End Date သတ်မှတ်ခြင်း
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Parallel Database Queries
  const [
    todaySuccessOrders,
    todayTotalOrdersCount,
    availableCount,
    unavailableCount,
    todayOrders,
    allMenuItems,
  ] = await Promise.all([
    // ၁။ ယနေ့ ရရှိသော ဝင်ငွေ (Paid သာ)
    prisma.order.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        paymentStatus: { equals: "Paid" },
      },
      _sum: { totalAmount: true },
    }),

    // ၂။ ယနေ့ Order အရေအတွက် Total
    prisma.order.count({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    }),

    // ၃။ ရနိုင်သော Menu Items
    prisma.menuItem.count({ where: { isAvailable: true } }),

    // ၄။ မရနိုင်သေးသော Menu Items
    prisma.menuItem.count({ where: { isAvailable: false } }),

    // ၅။ ယနေ့ Order စာရင်းများ Fetch လုပ်ခြင်း
    prisma.order.findMany({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: {
          include: {
            menuItem: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    // ၆။ DashboardTable အတွက် Menu Items အားလုံး Fetch လုပ်ခြင်း
    prisma.menuItem.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        isAvailable: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const todayRevenue = todaySuccessOrders._sum.totalAmount || 0;

  return (
    <div className="space-y-8 min-h-screen">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-bold text-slate-700 text-2xl sm:text-3xl xl:text-4xl tracking-tight">
          Admin Dashboard
        </h1>
      </div>

      {/* Card Grid */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
              Today's Revenue
            </span>
            <div className="flex justify-center items-center bg-emerald-50 rounded-xl w-10 h-10 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="font-bold text-slate-700 text-2xl">
              {todayRevenue.toLocaleString()}{" "}
              <span className="font-semibold text-base">MMK</span>
            </h2>
          </div>
        </div>

        {/* <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
              Today's Orders
            </span>
            <div className="flex justify-center items-center bg-orange-50 rounded-xl w-10 h-10 text-orange-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="font-bold text-slate-700 text-2xl">
              {todayTotalOrdersCount}
            </h2>
          </div>
        </div> */}

        <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
              Available Items
            </span>
            <div className="flex justify-center items-center bg-blue-50 rounded-xl w-10 h-10 text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="font-bold text-slate-700 text-2xl">
              {availableCount}
            </h2>
          </div>
        </div>

        <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
              Unavailable Items
            </span>
            <div className="flex justify-center items-center bg-rose-50 rounded-xl w-10 h-10 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="font-bold text-slate-700 text-2xl">
              {unavailableCount}
            </h2>
          </div>
        </div>
      </div>

      {/* Real-time Orders Table */}
      <OrdersTable initialOrders={todayOrders as any} />

      {/* Menu Items Table with Filter */}
      <DashboardTable
        todayOrders={todayOrders as any}
        allMenuItems={allMenuItems}
        hasSession={!!session?.user}
      />
    </div>
  );
}

// import { prisma } from "@/lib/prisma";
// import { DollarSign, ShoppingBag, CheckCircle2, XCircle } from "lucide-react";
// import { protectAdminRoute } from "@/lib/auth-guard";
// import { OrdersTable } from "@/features/admin/order/components/order-table";

// export default async function AdminDashboardPage() {
//   await protectAdminRoute();

//   // ယနေ့အတွက် Start & End Date သတ်မှတ်ခြင်း
//   const todayStart = new Date();
//   todayStart.setHours(0, 0, 0, 0);

//   const todayEnd = new Date();
//   todayEnd.setHours(23, 59, 59, 999);

//   // Parallel Database Queries
//   const [
//     todaySuccessOrders,
//     todayTotalOrdersCount,
//     availableCount,
//     unavailableCount,
//     todayOrders,
//   ] = await Promise.all([
//     // ၁။ ယနေ့ ရရှိသော ဝင်ငွေ (Paid သာ)
//     prisma.order.aggregate({
//       where: {
//         createdAt: { gte: todayStart, lte: todayEnd },
//         paymentStatus: { equals: "Paid" },
//       },
//       _sum: { totalAmount: true },
//     }),

//     // ၂။ ယနေ့ Order အရေအတွက် Total
//     prisma.order.count({
//       where: { createdAt: { gte: todayStart, lte: todayEnd } },
//     }),

//     // ၃။ ရနိုင်သော Menu Items
//     prisma.menuItem.count({ where: { isAvailable: true } }),

//     // ၄။ မရနိုင်သေးသော Menu Items
//     prisma.menuItem.count({ where: { isAvailable: false } }),

//     // ၅။ ယနေ့ Order စာရင်းများ Fetch လုပ်ခြင်း
//     prisma.order.findMany({
//       where: { createdAt: { gte: todayStart, lte: todayEnd } },
//       include: {
//         user: { select: { name: true, email: true } },
//         orderItems: {
//           include: {
//             menuItem: {
//               select: {
//                 name: true,
//                 imageUrl: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     }),
//   ]);

//   const todayRevenue = todaySuccessOrders._sum.totalAmount || 0;

//   return (
//     <div className="space-y-8 min-h-screen">
//       {/* Header */}
//       <div className="space-y-1">
//         <h1 className="font-bold text-slate-700 text-2xl sm:text-3xl xl:text-4xl tracking-tight">
//           Admin Dashboard
//         </h1>
//       </div>

//       {/* Card Grid */}
//       <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
//               Today's Revenue
//             </span>
//             <div className="flex justify-center items-center bg-emerald-50 rounded-xl w-10 h-10 text-emerald-600">
//               <DollarSign className="w-5 h-5" />
//             </div>
//           </div>
//           <div className="mt-3">
//             <h2 className="font-bold text-slate-700 text-2xl">
//               {todayRevenue.toLocaleString()}{" "}
//               <span className="font-semibold text-base">MMK</span>
//             </h2>
//           </div>
//         </div>

//         <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
//               Today's Orders
//             </span>
//             <div className="flex justify-center items-center bg-orange-50 rounded-xl w-10 h-10 text-orange-600">
//               <ShoppingBag className="w-5 h-5" />
//             </div>
//           </div>
//           <div className="mt-3">
//             <h2 className="font-bold text-slate-700 text-2xl">
//               {todayTotalOrdersCount}
//             </h2>
//           </div>
//         </div>

//         <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
//               Available Items
//             </span>
//             <div className="flex justify-center items-center bg-blue-50 rounded-xl w-10 h-10 text-blue-600">
//               <CheckCircle2 className="w-5 h-5" />
//             </div>
//           </div>
//           <div className="mt-3">
//             <h2 className="font-bold text-slate-700 text-2xl">
//               {availableCount}
//             </h2>
//           </div>
//         </div>

//         <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
//               Unavailable Items
//             </span>
//             <div className="flex justify-center items-center bg-rose-50 rounded-xl w-10 h-10 text-rose-600">
//               <XCircle className="w-5 h-5" />
//             </div>
//           </div>
//           <div className="mt-3">
//             <h2 className="font-bold text-slate-700 text-2xl">
//               {unavailableCount}
//             </h2>
//           </div>
//         </div>
//       </div>

//       {/* Orders Table - todayOrders Variable ကို သုံးထားပါသည် */}
//       <OrdersTable initialOrders={todayOrders} />
//     </div>
//   );
// }
