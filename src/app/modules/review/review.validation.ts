import { z } from "zod";

// Main validation schema for Reviews
const createReviewsValidation = z.object({
  body: z.object({
    productId: z.string({ required_error: "Product Id  is required" }),
    rating: z
      .number()
      .positive({ message: "rating must be a positive number" })
      .max(5, { message: "rating can not be above 5" })
      .min(1, { message: "rating must  be above 1" }),
    comment: z.string({ required_error: "comment is required" }),
    isDeleted: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
  }),
});

const updateReviewsValidation = z.object({
  body: z.object({
    productId: z
      .string({ required_error: "product Id is required" })
      .optional(),
    rating: z
      .number()
      .positive({ message: "rating must be a positive number" })
      .max(5, { message: "rating can not be above 5" })
      .min(1, { message: "rating must  be above 1" })
      .optional(),
    comment: z.string({ required_error: "Comment name is required" }).optional(),
    isDeleted: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
  }),
});

export const ReviewsValidations = {
  createReviewsValidation,
  updateReviewsValidation,
};
