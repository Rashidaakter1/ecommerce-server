import { model, Schema } from "mongoose";
import { TUser } from "./auth.interface";

const userSchema = new Schema<TUser>(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNo: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// 3. Create a Model.
export const User = model<TUser>("User", userSchema);
