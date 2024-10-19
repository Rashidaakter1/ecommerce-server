import { Types } from "mongoose";

export type TReviews = {
  productId: Types.ObjectId;
  rating: number;
  comment: string;
  date: Date;
  isDeleted: boolean;
  createdBy: Types.ObjectId;
};
