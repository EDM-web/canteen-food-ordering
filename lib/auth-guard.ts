// lib/auth-guard.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminDashboardPath, homePath } from "./path";

export async function protectUserRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role === "Admin") {
    // Admin များကို dashboard သို့ ပို့ပြီး message ပြရန် param ထည့်ပေးလိုက်သည်
    redirect("/admin/dashboard?error=admin_access_only");
  }

  return session;
}

export async function protectAdminRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in?error=unauthenticated");
  }

  if (session.user.role !== "Admin") {
    // User များကို / သို့ ပို့ပြီး message ပြရန် param ထည့်ပေးလိုက်သည်
    redirect("/?error=unauthorized");
  }

  return session;
}

export async function protectAuthRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role === "Admin") {
    redirect(adminDashboardPath);
  }

  if (session?.user.role == "Customer") {
    // User များကို / သို့ ပို့ပြီး message ပြရန် param ထည့်ပေးလိုက်သည်
    redirect(homePath);
  }

  return session;
}
