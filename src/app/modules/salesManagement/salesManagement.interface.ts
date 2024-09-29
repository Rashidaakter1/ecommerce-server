import { Types } from "mongoose";

export type TSalesManagement = {
  product: Types.ObjectId;
  stock: number;
  buyerDetails: {
    name: {
      firstName: string;
      lastName: string;
    };
  };
  dateOfSale: Date;
  isDeleted: boolean;
  salesHistory: TSalesManagement[];
};
