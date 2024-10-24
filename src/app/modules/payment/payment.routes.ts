import express from "express";

import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";

import { USER_ROLE } from "../auth/auth.constant";
import { paymentValidationSchema } from "./payment.validation";
import { PaymentControllers } from "./payment.controller";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Payment } from "./payment.model";

const router = express.Router();

router.post(
  "/create-payment",
  auth(USER_ROLE.user),
  validateRequest(paymentValidationSchema.createPaymentValidationSchema),
  PaymentControllers.createPayment
);

router.post("/success-payment", async (req, res) => {
  const successData = req.body;
  if (successData.status !== "VALID") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment failed ");
  }
  const query = {
    transactionId: successData.tran_id,
  };
  const update = {
    $set: {
      status: "Success",
    },
  };
  await Payment.updateOne(query, update);
  res.redirect("http://localhost:3000/payment/success");
});
router.post("/fail", async (req, res) => {
  res.redirect("http://localhost:3000/payment/fail");
});
router.post("/cancel", async (req, res) => {
  res.redirect("http://localhost:3000/payment/cancel");
});

router.get("/", PaymentControllers.getPayment);
router.get("/:id", PaymentControllers.getSinglePayment);
router.put("/:id", auth(USER_ROLE.user), PaymentControllers.updatePayment);
router.delete("/:id", auth(USER_ROLE.user), PaymentControllers.deletePayment);

export const PaymentRoutes = router;
