"use server";

import { auth } from "@/lib/auth";
import { adminDashboardPath, homePath } from "@/lib/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signInSchema } from "../schemas/sign-in-schema";

export type SignInActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

export const signIn = async (
  _prevState: SignInActionState,
  formData: FormData
): Promise<SignInActionState> => {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 1. Zod Validation
  const validationResult = signInSchema.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string> = {};
    validationResult.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        fieldErrors[issue.path[0].toString()] = issue.message;
      }
    });

    return {
      success: false,
      message: "Please check your input credentials.",
      fieldErrors,
    };
  }

  const { email, password } = validationResult.data;
  let redirectUrl = homePath;

  // 2. Better Auth API Call
  try {
    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    const userRole = res?.user?.role;

    if (userRole === "Admin") {
      redirectUrl = adminDashboardPath;
    } else if (userRole === "Customer") {
      redirectUrl = homePath;
    }
  } catch (error: any) {
    console.error("Sign in error:", error);
    return {
      success: false,
      message: error?.message || "Invalid email or password.",
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

// export const signIn = async (formData: FormData) => {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   let redirectUrl = homePath; // Default redirect လမ်းကြောင်း

//   try {
//     // 1. Sign In ဝင်ပြီး ရလာသော response ကို variable ထဲသိမ်းပါ
//     const res = await auth.api.signInEmail({
//       body: {
//         email,
//         password,
//       },
//       headers: await headers(),
//     });

//     // 2. User ၏ role ကို စစ်ဆေးပြီး Redirect လမ်းကြောင်း သတ်မှတ်ပါ
//     // (မှတ်ချက် - သင်၏ Auth Schema ပေါ်မူတည်၍ res.user.role သို့မဟုတ် res.data.user.role ဖြစ်နိုင်ပါတယ်)
//     const userRole = res?.user?.role;

//     if (userRole === "Admin") {
//       redirectUrl = adminDashboardPath;
//     } else if (userRole === "Customer") {
//       redirectUrl = homePath;
//     }
//   } catch (error) {
//     console.log(error);
//     // Error တက်ပါက redirect မလုပ်ဘဲ ဤနေရာတွင် ရပ်ရန် သို့မဟုတ် error return ပြန်ရန် စီစဉ်နိုင်ပါသည်
//     return;
//   }

//   // 3. try/catch ၏ အပြင်ဘက်တွင် redirect ကို ခေါ်ယူပါ
//   redirect(redirectUrl);
// };
