import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingBag, DollarSign, Mail } from "lucide-react";
import { getAllCustomersAction } from "@/features/admin/customers/actions/get-all-customers";
import { protectAdminRoute } from "@/lib/auth-guard";

export default async function AdminCustomersPage() {
  const session = await protectAdminRoute();
  // Server Action ထံမှ Real Data ရယူခြင်း
  const result = await getAllCustomersAction();
  const customers = result.customers || [];

  // Stat Overview Calculations
  const totalCustomers = customers.length;
  const totalOrdersCount = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6 mx-auto max-w-7xl">
      {/* Header Title */}
      <div>
        <h1 className="font-bold text-slate-700 text-2xl sm:text-3xl xl:text-4xl tracking-tight">
          Customers Overview
        </h1>
        {/* <p className="text-muted-foreground text-sm">
          View and manage registered canteen customers and their ordering
          activities.
        </p> */}
      </div>

      {/* Top Stat Cards */}
      <div className="gap-4 grid md:grid-cols-3">
        <Card className="shadow-sm border border-slate-200/80 ring-0">
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className="font-medium text-sm">
              Total Customers
            </CardTitle>
            <div className="flex justify-center items-center bg-orange-50 rounded-xl w-10 h-10 text-orange-600">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalCustomers}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200/80 ring-0">
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className="font-medium text-sm">
              Total Orders Placed
            </CardTitle>

            <div className="flex justify-center items-center bg-blue-50 rounded-xl w-10 h-10 text-blue-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalOrdersCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200/80 ring-0">
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className="font-medium text-sm">
              Total Customer Value
            </CardTitle>

            <div className="flex justify-center items-center bg-emerald-50 rounded-xl w-10 h-10 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-emerald-600/80 text-2xl">
              {totalRevenue.toLocaleString()} MMK
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List Table */}
      <Card className="shadow-sm border border-slate-200/80 ring-0 text-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="font-medium text-lg">All Customer</CardTitle>
          <CardDescription>Detailed list of all customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-left">Total Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                {/* <TableHead className="text-right">Joined Date</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-muted-foreground text-center"
                  >
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => {
                  const initials = customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Customer Profile Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarImage
                              src={customer.image}
                              alt={customer.name}
                            />
                            <AvatarFallback className="bg-orange-100 font-semibold text-orange-700 text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-slate-800 text-sm">
                            {customer.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{customer.email}</span>
                        </div>
                      </TableCell>

                      {/* Orders Count */}
                      <TableCell className="font-medium text-left">
                        {customer.totalOrders > 0 ? (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700"
                          >
                            {customer.totalOrders}{" "}
                            {customer.totalOrders === 1 ? "Order" : "Orders"}
                          </Badge>
                        ) : (
                          <Badge variant="ghost" className="text-slate-700">
                            {customer.totalOrders} Order
                          </Badge>
                        )}
                      </TableCell>

                      {/* Total Spent Amount */}
                      <TableCell className="font-semibold text-orange-600 text-right">
                        {customer.totalSpent.toLocaleString()} MMK
                      </TableCell>

                      {/* Joined Date */}
                      {/* <TableCell className="text-muted-foreground text-xs text-right">
                        {customer.createdAt}
                      </TableCell> */}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
