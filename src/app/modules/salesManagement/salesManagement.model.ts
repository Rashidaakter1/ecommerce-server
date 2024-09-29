import { model, Schema, Types } from "mongoose";
import { TSalesManagement } from "./salesManagement.interface";


const salesHistorySchema = new Schema<TSalesManagement>({
    product: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    buyerDetails: {
      name: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
    },
    dateOfSale: {
      type: Date,
      required: true,
    },
    stock: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
})
const salesManagementSchema = new Schema<TSalesManagement>(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    buyerDetails: {
      name: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
    },
    dateOfSale: {
      type: Date,
      required: true,
    },
    stock: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    salesHistory:[salesHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Query Middleware
salesManagementSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

salesManagementSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
// 3. Create a Model.
export const SalesManagement = model<TSalesManagement>(
  "SalesManagement",
  salesManagementSchema
);
