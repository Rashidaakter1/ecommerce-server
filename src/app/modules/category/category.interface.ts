import { Types } from "mongoose";

export type TCategory = {
  categoryId: string;
  name: string;

  isDeleted: boolean;
  products: Types.ObjectId;
  createdBy: Types.ObjectId;
};


