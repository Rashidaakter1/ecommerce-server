import { model, Schema } from "mongoose";
import { TShoppingCart } from "./cart.interface";

const shoppingCartSchema = new Schema<TShoppingCart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

shoppingCartSchema.pre("find", async function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const ShoppingCart = model<TShoppingCart>(
  "ShoppingCart",
  shoppingCartSchema
);
