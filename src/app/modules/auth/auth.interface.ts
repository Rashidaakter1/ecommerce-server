import { Model } from "mongoose";

export interface TUser  {
  email: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  contactNo: number;
  isDeleted: boolean;
  passwordChangedAt: Date;
};


export interface UserModel extends Model<TUser> {
  isJWTIssuedBBeforePasswordChange(
    passwordChangedAt: Date,
    iat: number
  ): boolean;
}