import { model, Schema } from "mongoose";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
  {
    transactionId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, default: "Pending" },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Payment = model("Payment", paymentSchema);
