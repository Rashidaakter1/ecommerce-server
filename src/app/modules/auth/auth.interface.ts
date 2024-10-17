import { Model } from "mongoose";
import { USER_ROLE } from "./auth.constant";

export type TPasswordHistory = {
  password: string;
  createdAt: Date;
};

export interface TUser {
  email: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  contactNo: number;
  role: "admin" | "user";
  isDeleted: boolean;
  passwordChangedAt: Date;
}

export type TLoginUser = {
  username: string;
  password: string;
};

export interface UserModel extends Model<TUser> {
  isJWTIssuedBBeforePasswordChange(
    passwordChangedAt: Date,
    iat: number
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
