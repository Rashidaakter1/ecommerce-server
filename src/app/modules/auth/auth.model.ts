import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./auth.interface";
import config from "../../config";
import bcrypt from "bcrypt";

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
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: 0,
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

userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt__saltRound)
  );
  next();
});
userSchema.pre("find", function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
userSchema.pre("findOne", function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// 3. Create a Model.
export const User = model<TUser, UserModel>("User", userSchema);
