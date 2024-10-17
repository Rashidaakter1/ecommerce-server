import { Types } from "mongoose";

export type TReviews = {
  productId: Types.ObjectId;
  rating: number;
  comment: string;
  date: Date;
  isDeleted: boolean;

  // createdBy: Types.ObjectId;
  createdBy: {
    equals(arg0: Types.ObjectId): unknown;
    reviewerName: string;
    reviewerEmail: string;
  };
};
