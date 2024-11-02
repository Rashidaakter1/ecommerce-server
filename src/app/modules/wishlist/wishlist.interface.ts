import { Types } from "mongoose";

export type TWishlist = {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalItems: number;
};
