// lib/auth-types.d.ts
import { auth } from "./auth";

declare module "better-auth/client" {
  interface User {
    role?: string; // သို့မဟုတ် "Customer" | "Admin" စသည်ဖြင့်
  }
}

declare module "better-auth" {
  interface User {
    role?: string;
  }
}
