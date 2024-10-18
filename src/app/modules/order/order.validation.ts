import z from "zod";

const createOrderValidationSchema = z.object({
  body: z.object({
    orderId: z.string({
      required_error: "Id is required",
    }),
    user: z.string(),
    products: z.array(
      z.object({
        product: z.string(),
        quantity: z.number().positive(),
        priceAtPurchase: z.number().positive(),
      })
    ),
    totalAmount: z.number().positive(),
    status: z.enum([
      "pending",
      "processed",
      "shipped",
      "delivered",
      "cancelled",
    ]),
    shippingAddress: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    paymentMethod: z.enum(["credit card", "paypal", "stripe"]),
    orderDate: z.date().optional(),
    deliveryDate: z.date().optional(),
  }),
});
const updateOrderValidationSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    name: z.string().optional(),
    products: z.string().optional(),
    isDeleted: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
  }),
});

export const orderValidationSchema = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
