// "use client";
//useEffect version

// import { useEffect } from "react";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import { toast } from "sonner";

// export function AuthToastListener() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const error = searchParams.get("error");

//     if (!error) return;

//     if (error === "unauthorized") {
//       toast.error("Access Denied", {
//         description: "Admin သာလျှင် ထို page ကို ဝင်ရောက်ကြည့်ရှုနိုင်ပါသည်။",
//       });
//     } else if (error === "admin_access_only") {
//       toast.info("Redirected", {
//         description:
//           "Admin Account ဖြစ်သောကြောင့် Dashboard သို့ ပို့ပေးလိုက်ပါသည်။",
//       });
//     } else if (error === "unauthenticated") {
//       toast.warning("Login Required", {
//         description: "ကျေးဇူးပြု၍ အကောင့် အရင်ဝင်ပါ။",
//       });
//     }

//     // Toast ပြပြီးပါက URL ထဲမှ ?error=... query string ကို ပြန်ရှင်းထုတ်ရန်
//     const params = new URLSearchParams(searchParams.toString());
//     params.delete("error");
//     const newUrl = params.toString()
//       ? `${pathname}?${params.toString()}`
//       : pathname;
//     router.replace(newUrl, { scroll: false });
//   }, [searchParams, pathname, router]);

//   return null;
// }

// components/auth-toast-listener.tsx
//useRef version
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function AuthToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toastedRef = useRef<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");

    if (!error || toastedRef.current === error) return;

    // Flag as shown to prevent duplicate triggers
    toastedRef.current = error;

    if (error === "unauthorized") {
      toast.warning("You are not Admin");
    } else if (error === "admin_access_only") {
      toast.warning("You are not Customer");
    } else if (error === "unauthenticated") {
      toast.warning("Login Required");
    }

    // Clean up the URL query param
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}
