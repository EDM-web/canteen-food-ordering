"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, SignInActionState } from "@/features/auth/actions/sign-in";
import { signInSchema } from "@/features/auth/schemas/sign-in-schema";
import { signUpPath } from "@/lib/path";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";

const initialState: SignInActionState = {
  success: false,
  message: "",
};

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [liveErrors, setLiveErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success("Success", { description: state.message });
      } else {
        toast.error("Error", { description: state.message });
      }
    }
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    const fieldSchema = signInSchema.shape[name as keyof typeof formData];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value);
      if (!result.success) {
        setLiveErrors((prev) => ({
          ...prev,
          [name]: result.error.issues[0].message,
        }));
      } else {
        setLiveErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };

  const isFormValid = signInSchema.safeParse(formData).success;

  return (
    <div className="mx-2 my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white shadow-xl border border-slate-100 rounded-xl sm:rounded-2xl lg:rounded-3xl w-full overflow-hidden">
        {/* Left Column: Food Image */}
        <div className="hidden relative lg:flex flex-col justify-between bg-slate-900 p-10 min-h-[550px] text-white">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
            alt="Canteen Food"
            fill
            priority
            className="opacity-70 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50" />

          <div className="z-10 relative flex items-center gap-2">
            <div className="flex justify-center items-center bg-orange-500 shadow-md shadow-orange-500/30 rounded-xl w-10 h-10 text-white">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">CU Canteen</span>
          </div>

          <div className="z-10 relative space-y-2">
            <h2 className="font-extrabold text-3xl leading-tight">
              Welcome back to <br /> Campus Dining
            </h2>
            <p className="max-w-sm text-slate-300 text-sm">
              Sign in to manage your orders, check daily menus, and skip the
              canteen lines.
            </p>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="flex flex-col justify-center p-4 sm:p-10 lg:p-12">
          <div className="space-y-2 mb-8">
            <h1 className="font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500 text-sm">
              Enter your existing account
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-medium text-slate-700 text-xs uppercase tracking-wider"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-slate-50/50 focus:bg-white border-slate-200 focus:border-orange-500 h-9 sm:h-11 transition-all"
              />
              {(liveErrors.email || state.fieldErrors?.email) && (
                <p className="font-medium text-rose-500 text-xs">
                  {liveErrors.email || state.fieldErrors?.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-medium text-slate-700 text-xs uppercase tracking-wider"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-slate-50/50 focus:bg-white border-slate-200 focus:border-orange-500 h-9 sm:h-11 transition-all"
              />
              {(liveErrors.password || state.fieldErrors?.password) && (
                <p className="font-medium text-rose-500 text-xs">
                  {liveErrors.password || state.fieldErrors?.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending || !isFormValid}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 shadow-lg shadow-orange-500/25 rounded-xl w-full h-11 font-semibold text-white text-base transition-all cursor-pointer"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>

            <p className="pt-2 text-slate-500 text-sm text-center">
              Don't have an account?{" "}
              <Link
                href={signUpPath}
                className="font-semibold text-orange-600 hover:text-orange-700 hover:underline underline-offset-4"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
