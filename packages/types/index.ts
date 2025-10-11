import z from "zod";

export const SignUpSchema = z.object({
  email: z
    .email({ error: "Please enter a correct email" })
    .trim()
    .min(1, { error: "Email is needed" }),

  username: z
    .string()
    .trim()
    .min(3, { error: "Username should atleast be 3 characters" }),

  password: z
    .string()
    .min(5, { error: "Password should atleast be 5 characters" }),
});

export const SignInSchema = z.object({
  email: z
    .email({ error: "Please enter a correct email" })
    .trim()
    .min(1, { error: "Email is needed" }),

  password: z
    .string()
    .min(5, { error: "Password should atleast be 5 characters" }),
});

