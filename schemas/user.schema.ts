import { z } from "zod";

export const userSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3,  "Username must be at least 3 characters." ),

    email: z
        .email( "Invalid email address." ),

    phone: z
        .string()
        .trim()
        .min(10,  "Invalid phone number." ),

    password: z
        .string()
        .trim()
        .min(8,  "Password must be at least 8 characters." )
        .regex(/[A-Z]/,  "Password must contain at least one uppercase letter." )
        .regex(/[a-z]/,  "Password must contain at least one lowercase letter." )
        .regex(/[0-9]/,  "Password must contain at least one number." )
        .regex(/[^A-Za-z0-9]/,  "Password must contain at least one special character." ),
});
