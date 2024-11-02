import z from "zod";

const createWishlistValidationSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        product: z.string(),
        quantity: z.number().int().positive(),
      })
    ),
    totalItems: z.number().int().nonnegative().optional(),
  }),
});
const updateWishlistValidationSchema = z.object({
  body: z.object({
    WishlistId: z.string().optional(),
    name: z.string().optional(),
    products: z.array(
      z.object({
        product: z.string(),
        quantity: z.number().int().positive(),
      })
    ),
  }),
});

export const WishlistValidationSchema = {
  createWishlistValidationSchema,
  updateWishlistValidationSchema,
};
