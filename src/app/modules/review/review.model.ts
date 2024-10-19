import { model, Schema } from "mongoose";
import { TReviews } from "./review.interface";

const ReviewsSchema = new Schema<TReviews>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

ReviewsSchema.pre("find", async function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const Reviews = model<TReviews>("Reviews", ReviewsSchema);
