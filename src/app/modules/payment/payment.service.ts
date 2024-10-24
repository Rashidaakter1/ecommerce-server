import qs from "qs";
import { ObjectId } from "mongodb";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { TPayment } from "./payment.interface";
import { Payment } from "./payment.model";
import axios from "axios";
import { JwtPayload } from "jsonwebtoken";

const createPaymentIntoDb = async (user: JwtPayload, payload: TPayment) => {
  const txn = new ObjectId().toString();
  const paymentData = {
    store_id: "ebuy6719e32ab12b3",
    store_passwd: "ebuy6719e32ab12b3@ssl",
    total_amount: payload.totalAmount,
    currency: "BDT",
    tran_id: txn,
    success_url: "http://localhost:5000/api/success-payment",
    fail_url: "http://yoursite.com/fail.php",
    cancel_url: "http://yoursite.com/cancel.php",
    cus_name: "Customer Name",
    cus_email: "cust@yahoo.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    product_name: "tsetest",
    product_category: "beauty",
    product_profile: "general",
    emi_option: 0,
    ship_name: "Customer Name",
    shipping_method: "YES",
    num_of_item: 10,
    weight_of_items: 1,
    logistic_pickup_id: "testingId",
    logistic_delivery_type: "deleveryType",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
    multi_card_name: "mastercard,visacard,amexcard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
  };

  const paymentDataToDb = {
    transactionId: txn,
    totalAmount: payload.totalAmount,
    currency: "BDT",
    status: "Pending",
    customer: {
      name: user.name,
      email: user.email,
    },
  };
  const result = await Payment.create(paymentDataToDb);
  const response = axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    qs.stringify(paymentData),
    {
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response;
};

const getPaymentFromDb = async () => {
  const result = await Payment.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "PaymentId",
        as: "reviews",
      },
    },
  ]);
  return result;
};

const getSinglePaymentFromDb = async (id: string) => {
  const result = await Payment.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "PaymentId",
        as: "reviews",
      },
    },
  ]);

  console.log(result);
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return result[0];
};

const updatePaymentIntoDb = async (id: string, payload: TPayment) => {
  const isPaymentExist = await Payment.findById(id, { isDeleted: false });
  if (!isPaymentExist) {
    throw new AppError(httpStatus.NOT_FOUND, " Payment not found");
  }

  return isPaymentExist;
};

const deletePaymentFromDb = async (id: string) => {
  const result = await Payment.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

export const PaymentServices = {
  createPaymentIntoDb,
  getPaymentFromDb,
  deletePaymentFromDb,
  updatePaymentIntoDb,
  getSinglePaymentFromDb,
};
