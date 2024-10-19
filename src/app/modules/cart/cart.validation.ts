import z from "zod";

const createShoppingCartValidationSchema = z.object({
  body: z.object({
 
    products: z.array(
      z.object({
        product: z.string(),
        quantity: z.number().int().positive(), 
      })
    ),
    totalItems: z.number().int().nonnegative().optional(), 
    totalPrice: z.number().nonnegative().optional(), 
  
  }),
});
const updateShoppingCartValidationSchema = z.object({
  body: z.object({
    ShoppingCartId: z.string().optional(),
    name: z.string().optional(),
    products: z.string().optional(),
    isDeleted: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
  }),
});

export const ShoppingCartValidationSchema = {
  createShoppingCartValidationSchema,
  updateShoppingCartValidationSchema,
};
