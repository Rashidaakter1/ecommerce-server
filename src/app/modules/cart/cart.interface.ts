import { Types } from "mongoose";



export type TShoppingCart ={
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalItems: number;
  totalPrice: number;
  updatedAt?: Date;
}


