import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must not exceed 20 characters"),
    email: z.string().email("Invalid email address format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (val) =>
          /[A-Za-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val),
        "Password must contain letters, numbers, and at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
