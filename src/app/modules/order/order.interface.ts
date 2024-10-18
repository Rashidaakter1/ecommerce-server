import { Types } from "mongoose";

export type TOrderProduct = {
  productId: Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
};

export type TShippingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type TOrder = {
  orderId: string;
  user: Types.ObjectId;
  products: TOrderProduct[];
  totalAmount: number;
  status: "pending" | "processed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: TShippingAddress;
  paymentMethod: "credit card" | "paypal" | "stripe";
  orderDate: Date;
  deliveryDate?: Date;
};
