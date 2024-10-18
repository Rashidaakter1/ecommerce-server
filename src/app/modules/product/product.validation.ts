import { z } from "zod";

const createProductValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters long" }),
    category: z
      .string()
      .min(3, { message: "Category must be at least 3 characters long" }),
    price: z.number().positive({ message: "Price must be a positive number" }),
    discountPercentage: z
      .number()
      .min(0)
      .max(100, { message: "Discount must be between 0 and 100" }),
    rating: z
      .number()
      .min(1)
      .max(5, { message: "Rating must be between 1 and 5" }),
    stock: z
      .number()
      .int()
      .nonnegative({ message: "Stock must be a non-negative integer" }),
    tags: z
      .array(z.string())
      .min(1, { message: "At least one tag is required" }),
    brand: z
      .string()
      .min(2, { message: "Brand must be at least 2 characters long" }),
    sku: z
      .string()
      .min(3, { message: "SKU must be at least 3 characters long" }),
    weight: z
      .number()
      .positive({ message: "Weight must be a positive number" }),
    dimensions: z.object({
      width: z
        .number()
        .positive({ message: "Width must be a positive number" }),
      height: z
        .number()
        .positive({ message: "Height must be a positive number" }),
      depth: z
        .number()
        .positive({ message: "Depth must be a positive number" }),
    }),
    warrantyInformation: z.string().min(5, {
      message: "Warranty Information must be at least 5 characters long",
    }),
    shippingInformation: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
    availabilityStatus: z.enum(["instock", "outofstock", "lowstock"]),
    returnPolicy: z
      .string()
      .min(5, { message: "Return Policy must be at least 5 characters long" }),
    minimumOrderQuantity: z.number().int().nonnegative({
      message: "Minimum Order Quantity must be a non-negative integer",
    }),

    images: z
      .array(z.string().url({ message: "Invalid image URL" }))
      .min(1, { message: "At least one image is required" }),
    thumbnail: z.string().url({ message: "Invalid thumbnail URL" }),
    isDeleted: z.boolean().optional(),
  }),
});

export const ProductValidations = {
  createProductValidation,
};
