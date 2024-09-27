import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./auth.interface";

const userSchema = new Schema<TUser>(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNo: { type: Number, required: true },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isJWTIssuedBBeforePasswordChange = function (
  passwordChangedAt: Date,
  iat: number
) {
  const passwordChangedAtIntoNumber =
    new Date(passwordChangedAt).getTime() / 1000;
  console.log(passwordChangedAtIntoNumber);
  return passwordChangedAtIntoNumber > iat;
};

// 3. Create a Model.
export const User = model<TUser, UserModel>("User", userSchema);
