export type TSalesManagement = {
  productQuantity: number;
  buyerDetails: {
    name: {
      firstName: string;
      lastName: string;
    };
  };
  salesHistory:{
    
  }
  dateOfSale: Date;
  isDeleted: boolean;
};
