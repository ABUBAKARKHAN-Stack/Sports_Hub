import { z } from "zod";


const baseSchema = z.object({
    email: z
        .email("Please enter a valid email address"),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters.")
})

const strongPassword = z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.");

const signupSchema = baseSchema.extend({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters."),

    password: strongPassword,

    confirmPassword: z
        .string()
        .trim()
        .min(1, "Confirm Password is required ")
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"]
})




const signinSchema = baseSchema;

const forgotPasswordSchema = z.object({
    email: z
        .email("Please enter a valid email address"),
})

const resetPasswordSchema = z.object({
    password: strongPassword,

    confirmPassword: z
        .string()
        .trim()
        .min(1, "Confirm Password is required ")
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"]
})

const accountVerificationSchema = z.object({
    code: z
      .string()
      .min(6, "Code must be 6 digits")
      .max(6, "Code must be 6 digits"),
  });


export {
    signupSchema,
    signinSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    accountVerificationSchema
}