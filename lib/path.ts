export const signUpPath = "/sign-up";
export const signInPath = "/sign-in";

// Route Path for Customer sice
export const homePath = "/";
export const menuPath = "/menu";
export const menuDetailPath = (id: string) => `/menu/${id}`;
export const checkoutPath = "/checkout";
export const orderPath = "/order";
export const orderDetailPath = (id: string) => `/order/${id}`;
export const categoryPath = "/category";
export const categoryDetailPath = (id: string) => `/category/${id}`;

// Route Path for Admin side
export const adminDashboardPath = "/admin/dashboard";
export const adminCategoryPath = "/admin/dashboard/category";
export const adminCategoryDetailPath = (id: string) =>
  `/admin/dashboard/category/${id}`;
export const adminMenuPath = "/admin/dashboard/menu";
export const adminMenuDetailPath = (id: string) =>
  `/admin/dashboard/menu/${id}`;
export const adminOrderPath = "/admin/dashboard/orders";
export const adminOrderDetailPath = (id: string) =>
  `/admin/dashboard/orders/${id}`;
export const adminCustomerPath = "/admin/dashboard/customers";
