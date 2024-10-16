import { Types } from "mongoose";


// export type TReview ={
//   rating: number;
//   comment: string;
//   date: Date;
//   reviewerName: string;
//   reviewerEmail: string;
// }


export type TDimensions ={
  width: number;
  height: number;
  depth: number;
}
export type TProduct = {
  id: number;
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
  shippingInformation: string;
  availabilityStatus: "instock" | "outofstock" | "lowstock";
  reviews: Types.ObjectId;
  isDeleted: boolean;
};
