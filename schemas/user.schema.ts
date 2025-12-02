import { UserRoles } from "@/types/main.types";
import { z } from "zod";

export const userSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username should be at least 3 characters long."),

    email: z
        .email("Please enter a valid email address."),

    password: z
        .string()
        .trim()
        .min(8, "Password should be at least 8 characters long.")
        .regex(/[A-Z]/, "Password should include at least one uppercase letter (A–Z).")
        .regex(/[a-z]/, "Password should include at least one lowercase letter (a–z).")
        .regex(/[0-9]/, "Password should include at least one number (0–9).")
        .regex(/[^A-Za-z0-9]/, "Password should include at least one special character (!,@,#,...)."),

    role: z
        .enum(UserRoles, {
            message: "Please select a valid role."
        })
});
