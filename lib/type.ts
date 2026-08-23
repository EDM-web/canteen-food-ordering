import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    image?: string | null;
    imageUrl?: string | null; // imageUrl ဟု သုံးထားပါက ပါအောင် ထည့်ပေးထားပါသည်
  };
}

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  user?: {
    name?: string | null;
    email?: string | null;
  };
  orderItems: OrderItem[];
  createdAt: Date;
}

interface TodayOrder {
  id: string;
  totalAmount: number;
  status: any;
  paymentStatus: any;
  user: { name: string | null; email: string };
  orderItems: { menuItem: { name: string }; quantity: number }[];
}
