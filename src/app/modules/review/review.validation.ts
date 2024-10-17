import { z } from "zod";

// Validation schema for details
const detailsValidation = z.object({
  level: z.string({
    required_error: "Level is required",
    invalid_type_error: "Name must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
});

// Validation schema for tags
const tagValidation = z.object({
  name: z.string({
    required_error: "Tag name is required",
  }),
  isDeleted: z.boolean().optional().default(false),
});

// Main validation schema for Reviews
const createReviewsValidation = z.object({
  body: z.object({
    courseId: z.string({ required_error: "courseId name is required" }),
    rating: z
      .number()
      .positive({ message: "rating must be a positive number" })
      .max(5, { message: "rating can not be above 5" })
      .min(1, { message: "rating must  be above 1" }),
    review: z.string({ required_error: "Review name is required" }),
    isDeleted: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
  }),
});

const updateReviewsValidation = z.object({
  body: z.object({
    courseId: z
      .string({ required_error: "courseId name is required" })
      .optional(),
    rating: z
      .number()
      .positive({ message: "rating must be a positive number" })
      .max(5, { message: "rating can not be above 5" })
      .min(1, { message: "rating must  be above 1" })
      .optional(),
    review: z.string({ required_error: "Review name is required" }).optional(),
    isDeleted: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
  }),
});

export const ReviewsValidations = {
  createReviewsValidation,
  updateReviewsValidation,
};
