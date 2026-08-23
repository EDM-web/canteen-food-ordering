"use server";

import { auth } from "@/lib/auth";
import { adminDashboardPath, homePath } from "@/lib/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema } from "../schemas/sign-up-schema";

export type SignUpActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

export const signUp = async (
  _prevState: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // 1. Zod Validation (Server-side)
  const validationResult = signUpSchema.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string> = {};
    validationResult.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        fieldErrors[issue.path[0].toString()] = issue.message;
      }
    });

    return {
      success: false,
      message: "Please fix the validation errors.",
      fieldErrors,
    };
  }

  const { name, email, password } = validationResult.data;
  const role = (formData.get("role") as string) || "Customer";
  let redirectUrl = homePath;

  // 2. Better Auth API Call
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role,
      },
      headers: await headers(),
    });

    const userRole = res?.user?.role;
    if (userRole === "Admin") {
      redirectUrl = adminDashboardPath;
    } else {
      redirectUrl = homePath;
    }
  } catch (error: any) {
    console.error("Sign up failed:", error);
    return {
      success: false,
      message: error?.message || "Sign up failed. Please try again.",
    };
  }

  // Success ဖြစ်ပါက Redirect လုပ်မည်
  redirect(redirectUrl);
};

// "use server";

// import { auth } from "@/lib/auth";
// import { adminDashboardPath, homePath } from "@/lib/path";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// export const signUp = async (formData: FormData) => {
//   const name = formData.get("name") as string;
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const role = (formData.get("role") as string) || "Customer";

//   let redirectUrl = homePath; // Default redirect လမ်းကြောင်း

//   try {
//     const res = await auth.api.signUpEmail({
//       body: {
//         email,
//         password,
//         name,
//         role,
//       },
//       headers: await headers(),
//     });

//     const userRole = res?.user?.role;

//     if (userRole === "Admin") {
//       redirectUrl = adminDashboardPath;
//     } else if (userRole === "Customer") {
//       redirectUrl = homePath;
//     }
//   } catch (error) {
//     console.error("Sign up failed:", error);
//     return;
//   }

//   redirect(redirectUrl);
// };
