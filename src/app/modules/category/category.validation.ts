import z from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    categoryId: z.string(),
    name: z.string(),
    products: z.string(),
    isDeleted: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
  }),
});
const updateCategoryValidationSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    name: z.string().optional(),
    products: z.string().optional(),
    isDeleted: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
  }),
});

export const categoryValidationSchema = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
