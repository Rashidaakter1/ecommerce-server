import { model, Schema } from "mongoose";
import { TCategory } from "./category.interface";

const categorySchema = new Schema<TCategory>({
  categoryId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },

  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  isDeleted: { type: Boolean, default: false },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

categorySchema.pre("find", async function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
export const Category = model<TCategory>("Category", categorySchema);
