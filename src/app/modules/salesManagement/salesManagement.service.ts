import { Request, Response } from "express";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TSalesManagement } from "./salesManagement.interface";
import { SalesManagement } from "./salesManagement.model";
import { Product } from "../product/product.model";
import mongoose from "mongoose";

const createSalesManagementIntoDb = async (payload: TSalesManagement) => {
  const isProductExist = await Product.findById(payload.product);
  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // check the quantity of the product id available or not
  const productQuantity = isProductExist.quantity;
  if (payload.stock > productQuantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `That much stock of product are not available , please try less than  ${productQuantity}`
    );
  }

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const updatedQuantity = isProductExist.quantity - payload.stock;
    const updatedQuantityINProduct = await Product.findByIdAndUpdate(
      payload.product,
      {
        quantity: updatedQuantity,
      },
      { new: true }
    );
    if (!updatedQuantityINProduct) {
      throw new AppError(httpStatus.BAD_REQUEST, `Something went wrong`);
    }
    const result = await SalesManagement.create({
      ...payload,
      salesHistory: [{ ...payload }],
    });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `Something went wrong`);
  }
};
const getSalesManagementFromDb = async () => {
  const result = await SalesManagement.find();
  return result;
};
const getSingleSalesManagementFromDb = async (id: string) => {
  const result = await SalesManagement.findById(id, { isDeleted: false });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, " SalesManagement not found");
  }
  return result;
};

const updateSalesManagementIntoDb = async (
  id: string,
  payload: TSalesManagement
) => {
  const isSalesManagementExist = await SalesManagement.findById(id, {
    isDeleted: false,
  });
  if (!isSalesManagementExist) {
    throw new AppError(httpStatus.NOT_FOUND, " SalesManagement not found");
  }
  // const { cameraQuality, additionalFeatures, ...remainingData } = payload;
  // const modifiedUpdatedData: Record<string, unknown> = {
  //   ...remainingData,
  // };

  // if (cameraQuality && Object.keys(cameraQuality).length) {
  //   for (const [key, value] of Object.entries(cameraQuality)) {
  //     modifiedUpdatedData[`cameraQuality.${key}`] = value;
  //   }
  // }
  // if (additionalFeatures && Object.keys(additionalFeatures).length) {
  //   for (const [key, value] of Object.entries(additionalFeatures)) {
  //     modifiedUpdatedData[`additionalFeatures.${key}`] = value;
  //   }
  // }

  // const result = await SalesManagement.findByIdAndUpdate(id, modifiedUpdatedData, {
  //   new: true,
  // });
  // return result;
};

const deleteSalesManagementFromDb = async (id: string) => {
  const result = await SalesManagement.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

export const SalesManagementServices = {
  createSalesManagementIntoDb,
  getSalesManagementFromDb,
  deleteSalesManagementFromDb,
  updateSalesManagementIntoDb,
  getSingleSalesManagementFromDb,
};
