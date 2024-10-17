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
  const { dimensions, tags, images, ...remainingData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData,
  };


  if (dimensions && Object.keys(dimensions).length) {
    for (const [key, value] of Object.entries(dimensions)) {
      modifiedUpdatedData[`dimensions.${key}`] = value;
    }
  }
   if (tags && Array.isArray(tags)) {
     await Product.findByIdAndUpdate(id, {
       $addToSet: { tags: { $each: tags } },
     });
   }
   if (images && Array.isArray(images)) {
     await Product.findByIdAndUpdate(id, {
       $addToSet: { images: { $each: images } },
     });
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
