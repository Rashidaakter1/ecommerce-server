import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { WishlistServices } from "./wishlist.service";


const createWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistServices.createWishlistIntoDb(
    req.user,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Wishlist created successfully!",
    data: result,
  });
});

const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistServices.geTWishlistFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});

const getSingleWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const WishlistId = req.params.productId;
    const result = await WishlistServices.getSingleWishlistFromDb(
      WishlistId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wishlist is retrieved successfully!",
      data: result,
    });
  }
);
const getSingleUserCart = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistServices.getSingleUserCartFromDb(req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "users wishlist is retrieved successfully!",
    data: result,
  });
});

const updateSingleWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const WishlistId = req.params.productId;
    const result = await WishlistServices.updateWishlistFromDb(
      WishlistId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wishlist is updated successfully!",
      data: result,
    });
  }
);

const deleteSingleWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const WishlistId = req.params.productId;
    const result = await WishlistServices.deleteWishlistFromDb(
      WishlistId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wishlist is deleted successfully!",
      data: result,
    });
  }
);
const deleteSingleWishlistFromUser = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.productId;
    console.log(productId);
    const result = await WishlistServices.deleteProductFromUserFromCart(
      req.user,
      productId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wishlist is deleted successfully from user!",
      data: result,
    });
  }
);

export const WishlistControllers = {
  createWishlist,
  getWishlist,
  getSingleWishlist,
  updateSingleWishlist,
  deleteSingleWishlist,
  getSingleUserCart,
  deleteSingleWishlistFromUser,
};
