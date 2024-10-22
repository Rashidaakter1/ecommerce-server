import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ShoppingCartServices } from "./cart.service";

const createShoppingCart = catchAsync(async (req: Request, res: Response) => {
  const result = await ShoppingCartServices.createShoppingCartIntoDb(
    req.user,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "ShoppingCart created successfully!",
    data: result,
  });
});

const getShoppingCart = catchAsync(async (req: Request, res: Response) => {
  const result = await ShoppingCartServices.geTShoppingCartFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});

const getSingleShoppingCart = catchAsync(
  async (req: Request, res: Response) => {
    const ShoppingCartId = req.params.cartId;
    const result = await ShoppingCartServices.getSingleShoppingCartFromDb(
      ShoppingCartId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "ShoppingCart is retrieved successfully!",
      data: result,
    });
  }
);
const getSingleUserCart = catchAsync(async (req: Request, res: Response) => {
  const result = await ShoppingCartServices.getSingleUserCartFromDb(req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "users cart is retrieved successfully!",
    data: result,
  });
});

const updateSingleShoppingCart = catchAsync(
  async (req: Request, res: Response) => {
    const ShoppingCartId = req.params.cartId;
    const result = await ShoppingCartServices.updateShoppingCartFromDb(
      ShoppingCartId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "ShoppingCart is updated successfully!",
      data: result,
    });
  }
);

const deleteSingleShoppingCart = catchAsync(
  async (req: Request, res: Response) => {
    const ShoppingCartId = req.params.cartId;
    const result = await ShoppingCartServices.deleteShoppingCartFromDb(
      ShoppingCartId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "ShoppingCart is deleted successfully!",
      data: result,
    });
  }
);
const deleteSingleShoppingCartFromUser = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.productId;
    console.log(productId);
    const result = await ShoppingCartServices.deleteProductFromUserFromCart(
      req.user,
      productId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "ShoppingCart is deleted successfully from user!",
      data: result,
    });
  }
);

export const ShoppingCartControllers = {
  createShoppingCart,
  getShoppingCart,
  getSingleShoppingCart,
  updateSingleShoppingCart,
  deleteSingleShoppingCart,
  getSingleUserCart,
  deleteSingleShoppingCartFromUser,
};
