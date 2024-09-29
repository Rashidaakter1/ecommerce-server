import { Types } from "mongoose";
import { z } from "zod";

const createSalesManagementValidation = z.object({
  body: z.object({
    stock: z.number().int().min(0, "Stock must be a non-negative integer"),
    buyerDetails: z.object({
      name: z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
      }),
    }),
    dateOfSale: z.string(),
    isDeleted: z.boolean(),
  }),
});

export const SalesManagementValidations = {
  createSalesManagementValidation,
};
