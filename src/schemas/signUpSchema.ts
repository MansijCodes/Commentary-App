import {z} from "zod";

export const usernameSchema = z
    .string()
    .min(2,"Username must be atleast 2 character")
    .max(20,"Username must me maximum 20 character")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username:usernameSchema,
    email:z.string().email({message:"Invalid email format"}),
    password:z.string().min(4,{message:"Password must be atleast 4 character"})
})