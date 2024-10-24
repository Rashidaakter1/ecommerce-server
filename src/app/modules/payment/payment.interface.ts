export type TPayment = {
  transactionId: string;
  totalAmount: number;
  currency: string;
  status?: string;
  customer: {
    name: string;
    email: string;

  };
};
