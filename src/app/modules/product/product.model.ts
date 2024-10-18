import { model, Schema } from "mongoose";
import { TProduct } from "./product.interface";

const productSchema = new Schema<TProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    stock: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    dimensions: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
    },
    warrantyInformation: {
      type: String,
      required: true,
    },
    shippingInformation: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    availabilityStatus: {
      type: String,
      enum: ["instock", "outofstock", "lowstock"],
    },
    reviews: {
      type: Schema.Types.ObjectId,
      ref: "Reviews",
      default: "",
    },
    returnPolicy: {
      type: String,
      required: true,
    },
    minimumOrderQuantity: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Query Middleware
productSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

productSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
// 3. Create a Model.
export const Product = model<TProduct>("Product", productSchema);
