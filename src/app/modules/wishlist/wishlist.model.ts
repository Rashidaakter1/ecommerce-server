import { model, Schema } from "mongoose";
import { TWishlist } from "./wishlist.interface";

const wishlistSchema = new Schema<TWishlist>(
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
  },
  {
    timestamps: true,
  }
);

wishlistSchema.pre("find", async function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const Wishlist = model<TWishlist>("Wishlist", wishlistSchema);
