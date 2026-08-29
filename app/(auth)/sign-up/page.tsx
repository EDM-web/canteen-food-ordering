"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, SignUpActionState } from "@/features/auth/actions/sign-up";
import { signUpSchema } from "@/features/auth/schemas/sign-up-schema";
import { signInPath } from "@/lib/path";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";

const initialState: SignUpActionState = {
  success: false,
  message: "",
};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const validation = signUpSchema.safeParse(updatedData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setLiveErrors(errors);
    } else {
      setLiveErrors({});
    }
  };

  return (
    <div className="mx-2 my-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white shadow-xl border border-slate-100 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
        {/* Left Column: Food Image */}
        <div className="hidden relative lg:flex flex-col justify-between bg-slate-900 p-10 min-h-[620px] text-white">
          <Image
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80"
            alt="Delicious Meal"
            fill
            priority
            className="opacity-70 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20" />

          <div className="z-10 relative flex items-center gap-2">
            <div className="flex justify-center items-center bg-orange-500 shadow-md shadow-orange-500/30 rounded-xl w-10 h-10 text-white">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">CU Canteen</span>
          </div>

          <div className="z-10 relative space-y-2">
            <h2 className="font-extrabold text-3xl leading-tight">
              Join us & order <br /> fresh food daily
            </h2>
            <p className="max-w-sm text-slate-300 text-sm">
              Create an account to save time, pre-order your meals, and enjoy
              fresh dishes every day.
            </p>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="flex flex-col justify-center p-4 sm:p-10 lg:p-12">
          <div className="space-y-2 mb-6">
            <h1 className="font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm">
              Create a new account to order delicious food
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="font-medium text-slate-700 text-xs md:text-sm uppercase tracking-wider"
              >
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-slate-50/50 focus:bg-white border-slate-200 focus:border-orange-500 h-9 sm:h-11 text-sm md:text-base transition-all"
              />
              {(liveErrors.name || state.fieldErrors?.name) && (
                <p className="font-medium text-rose-500 text-xs">
                  {liveErrors.name || state.fieldErrors?.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="font-medium text-slate-700 text-xs md:text-sm uppercase tracking-wider"
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
                className="bg-slate-50/50 focus:bg-white border-slate-200 focus:border-orange-500 h-9 sm:h-11 text-sm md:text-base transition-all"
              />
              {(liveErrors.email || state.fieldErrors?.email) && (
                <p className="font-medium text-rose-500 text-xs">
                  {liveErrors.email || state.fieldErrors?.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="font-medium text-slate-700 text-xs md:text-sm uppercase tracking-wider"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="example@123#"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-slate-50/50 focus:bg-white border-slate-200 focus:border-orange-500 h-9 sm:h-11 text-sm md:text-base transition-all"
              />
              {(liveErrors.password || state.fieldErrors?.password) && (
                <p className="font-medium text-rose-500 text-xs">
                  {liveErrors.password || state.fieldErrors?.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="font-medium text-slate-700 text-xs md:text-sm uppercase tracking-wider"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="example@123#"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-slate-50/50 focus:bg-white border-slate-200 focus:border-orange-500 h-9 sm:h-11 text-sm md:text-base transition-all"
              />
              {(liveErrors.confirmPassword ||
                state.fieldErrors?.confirmPassword) && (
                <p className="font-medium text-rose-500 text-xs">
                  {liveErrors.confirmPassword ||
                    state.fieldErrors?.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending || Object.keys(liveErrors).length > 0}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 shadow-lg shadow-orange-500/25 mt-2 rounded-xl w-full h-11 font-semibold text-white text-base transition-all cursor-pointer"
            >
              {isPending ? "Creating account..." : "Register"}
            </Button>

            <p className="pt-1 text-slate-500 text-sm text-center">
              Already have an account?{" "}
              <Link
                href={signInPath}
                className="font-semibold text-orange-600 hover:text-orange-700 hover:underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
