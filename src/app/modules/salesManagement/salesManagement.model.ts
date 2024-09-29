import { model, Schema } from "mongoose";
import { TProduct } from "./salesManagement.interface";

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    operatingSystem: {
      type: String,
      required: true,
      enum: ["ios", "android", "other"],
    },
    storageCapacity: { type: Number, required: true },
    screenSize: { type: Number, required: true },
    cameraQuality: {
      main: { type: Number, required: true },
      front: { type: Number, required: true },
    },
    batteryCapacity: { type: Number, required: true },
    additionalFeatures: {
      isWaterResistant: { type: Boolean, required: true },
      has5G: { type: Boolean, required: true },
      hasWirelessCharging: { type: Boolean, required: true },
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
