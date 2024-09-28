import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    name: z.object({
      firstName: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        })
        .max(20, { message: "Must be 20 or fewer characters long" }),
      lastName: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        })
        .max(20, { message: "Must be 20 or fewer characters long" }),
    }),
    email: z.string().email({ message: "Invalid email address" }),
    contactNo: z.number(),
    password: z
      .string()
      .min(8, { message: "The character must be above 8" })
      .max(20, { message: "The character must be within 20" })
      .refine((password) => /[A-Z]/.test(password), {
        message: "There should be at least a capital letter",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "There should be at least a small letter",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "There should be at least a number",
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "There should be at least a special character",
      }),
  }),

  isDeleted: z.boolean().default(false),
});

const loginUserValidation = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "The character must be above 8" })
      .max(20, { message: "The character must be within 20" })
      .refine((password) => /[A-Z]/.test(password), {
        message: "There should be at least a capital letter",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "There should be at least a small letter",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "There should be at least a number",
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "There should be at least a special character",
      }),
  }),
});

const changePasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old Password is required." }),
    newPassword: z.string({ required_error: "New Password is required." }),
  }),
});

const forgetPasswordValidation = z.object({
  body: z.object({
    id: z.string({ required_error: "Id  is required." }),
  }),
});

const resetPasswordValidation = z.object({
  body: z.object({
    id: z.string({ required_error: "Id  is required." }),
    newPassword: z.string({ required_error: "Forget password is required" }),
  }),
});

const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const AuthValidations = {
  createUserValidation,
  loginUserValidation,
  refreshTokenValidation,
  changePasswordValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
};
