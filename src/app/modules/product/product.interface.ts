import { Types } from "mongoose";
import { TShippingAddress } from "../order/order.interface";

export type TDimensions = {
  width: number;
  height: number;
  depth: number;
};
export type TProduct = {
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: TDimensions;
  warrantyInformation: string;
  shippingInformation: TShippingAddress;
  availabilityStatus: "instock" | "outofstock" | "lowstock";
  reviews: Types.ObjectId;
  returnPolicy: string;
  minimumOrderQuantity: number;
  images: string[];
  thumbnail: string;
  isDeleted: boolean;
};
