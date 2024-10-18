import { model, Schema } from "mongoose";
import { TOrder } from "./order.interface";

const orderSchema = new Schema<TOrder>({
  orderId: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  paymentMethod: {
    type: String,
    enum: ["credit card", "paypal", "stripe"],
    required: true,
  },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
});

orderSchema.pre("find", async function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
export const Order = model<TOrder>("Order", orderSchema);
