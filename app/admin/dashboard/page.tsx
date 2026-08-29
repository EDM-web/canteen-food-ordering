import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, CheckCircle2, XCircle } from "lucide-react";
import DashboardTable from "@/features/admin/dashboard/components/dashboard-table";
import { protectAdminRoute } from "@/lib/auth-guard";

export default async function AdminDashboardPage() {
  const session = await protectAdminRoute();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    todaySuccessOrders,
    todayTotalOrdersCount,
    availableCount,
    unavailableCount,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        paymentStatus: { equals: "Paid" },
      },
      _sum: { totalAmount: true },
    }),

    prisma.order.count({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    }),

    prisma.menuItem.count({ where: { isAvailable: true } }),

    prisma.menuItem.count({ where: { isAvailable: false } }),
  ]);

  const [todayOrders, allMenuItems] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
        orderItems: {
          select: {
            id: true, // ဖြည့်ရန်
            quantity: true,
            price: true, // ဖြည့်ရန် (Sheet UI တွင် တွက်ချက်ပြသရန်)

            menuItem: {
              select: {
                name: true,
                imageUrl: true, // ဖြည့်ရန် (Sheet UI တွင် ပုံပြသရန်)
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

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
      <div className="space-y-1">
        <h1 className="font-bold text-slate-700 text-2xl sm:text-3xl xl:text-4xl tracking-tight">
          Admin Dashboard
        </h1>
        {/* <p className="text-slate-500 text-sm">
          Overview of today's performance and inventory management
        </p> */}
      </div>

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

        <div className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
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
        </div>

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

      <DashboardTable todayOrders={todayOrders} allMenuItems={allMenuItems} />
    </div>
  );
}
