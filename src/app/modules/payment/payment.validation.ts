import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    totalAmount: z.number().min(0, "Total amount must be greater than 0"),
    status: z.string().optional().default("Pending"),
  }),
});

export const paymentValidationSchema = {
  createPaymentValidationSchema,
};
