import { z } from "zod";

export const usernamevalidate=z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long")
        .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers");

export const signupSchema = z.object({
    username: usernamevalidate,
    email: z.string().email({message:"Email is not valid"}),
    password: z.string().min(6, {message:"Password must be at least 6 characters long"}),
})        