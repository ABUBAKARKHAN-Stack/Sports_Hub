import { z } from "zod";

const signupSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters."),

    email: z
        .email("Invalid email address."),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),

    confirmPassword: z
        .string()
        .trim()
        .min(1, "Confirm Password is required ")
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"]
})


export {
    signupSchema
}