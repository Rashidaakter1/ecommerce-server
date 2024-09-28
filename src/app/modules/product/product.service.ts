import { Request, Response } from "express";
import { TProduct } from "./product.interface";
import { Product } from "./product.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createProductIntoDb = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};
const getProductFromDb = async () => {
  const result = await Product.find();
  return result;
};
const getSingleProductFromDb = async (id: string) => {
  const result = await Product.findById(id, { isDeleted: false });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, " Product not found");
  }
  return result;
};

const updateProductIntoDb = async (id: string, payload: TProduct) => {
  const isProductExist = await Product.findById(id, { isDeleted: false });
  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, " Product not found");
  }
  const { cameraQuality, additionalFeatures, ...remainingData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (cameraQuality && Object.keys(cameraQuality).length) {
    for (const [key, value] of Object.entries(cameraQuality)) {
      modifiedUpdatedData[`cameraQuality.${key}`] = value;
    }
  }
  if (additionalFeatures && Object.keys(additionalFeatures).length) {
    for (const [key, value] of Object.entries(additionalFeatures)) {
      modifiedUpdatedData[`additionalFeatures.${key}`] = value;
    }
  }

  const result = await Product.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });
  return result;
};

const deleteProductFromDb = async (id: string) => {
  const result = await Product.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

export const ProductServices = {
  createProductIntoDb,
  getProductFromDb,
  deleteProductFromDb,
  updateProductIntoDb,
  getSingleProductFromDb,
};
