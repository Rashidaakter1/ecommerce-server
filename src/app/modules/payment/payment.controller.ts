import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
import { ObjectId } from "mongodb";

const createPayment = catchAsync(async (req, res) => {
  const payment = req.body;
  const txn = new ObjectId().toString();
  await PaymentServices.createPaymentIntoDb(req.user, payment)
    .then((response) => {
      res.json({
        paymentUrl: response.data.GatewayPageURL,
        paymentId: txn,
        status: "Pending",
        amount: payment.price,
      });
    })
    .catch((error) => {
      console.log(error.response ? error.response.data : error.message);
      res.status(500).send("Payment failed");
    });
});

const getPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentFromDb();
  sendResponse(res, {
    success: true,
    message: "Payments retried successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PaymentServices.getSinglePaymentFromDb(id);
  sendResponse(res, {
    success: true,
    message: "Payment retrieved successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Payment = req.body;
  const result = await PaymentServices.updatePaymentIntoDb(id, Payment);
  sendResponse(res, {
    success: true,
    message: "Payment created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const deletePayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Payment = req.body;
  const result = await PaymentServices.deletePaymentFromDb(id);
  sendResponse(res, {
    success: true,
    message: "Payment id deleted successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const PaymentControllers = {
  createPayment,
  getPayment,
  updatePayment,
  deletePayment,
  getSinglePayment,
};
