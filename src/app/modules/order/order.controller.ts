import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { orderServices } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.createOrderIntoDb(req.user,req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Order created successfully!",
    data: result,
  });
});

const getOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.getOrderFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const OrderId = req.params.OrderId;
  const result = await orderServices.getSingleOrderFromDb(OrderId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order is retrieved successfully!",
    data: result,
  });
});

const updateSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const OrderId = req.params.OrderId;
  const result = await orderServices.updateOrderFromDb(
    OrderId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order is updated successfully!",
    data: result,
  });
});

const deleteSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const OrderId = req.params.OrderId;
  const result = await orderServices.deleteOrderFromDb(OrderId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order is deleted successfully!",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getOrder,
  getSingleOrder,
  updateSingleOrder,
  deleteSingleOrder,
};
