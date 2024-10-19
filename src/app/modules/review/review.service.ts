import { JwtPayload } from "jsonwebtoken";

import { searchableReviewArray } from "./review.constant";
import { TReviews } from "./review.interface";
import { Reviews } from "./review.model";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { Product } from "../product/product.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { User } from "../auth/auth.model";

const createReviewsIntoDb = async (user: JwtPayload, payload: TReviews) => {
  const { productId } = payload;
  const isProductExists = await Product.findById(productId);
  if (!isProductExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product is  not found");
  }
  const userId = await User.findOne({ email: user?.email });
  const reviews = await Reviews.create({ ...payload, createdBy: userId });
  return reviews;
};
const getReviewsFromDb = async (query: Record<string, unknown>) => {
  const queryReview = new QueryBuilder(
    Reviews.find()
      .select("-isDeleted")
      .populate("createdBy", { _id: 1, name: 1 }),
    query
  )
    .search(searchableReviewArray)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await queryReview.modelQuery;
  return result;
};
const getSingleReviewsFromDb = async (id: string) => {
  const isReviewsExists = await Reviews.findById(id);
  if (!isReviewsExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Review is  not found");
  }

  const reviews = await Reviews.findById(id)
    .select("-isDeleted")
    .where({ isDeleted: { $ne: true } })
    .populate("createdBy", { _id: 1, name: 1 });
  return reviews;
};
const updateReviewsFromDb = async (
  user: JwtPayload,
  id: string,
  payload: Partial<TReviews>
) => {
  const isReviewsExists = await Reviews.findById(id);
  if (!isReviewsExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Review is  not found");
  }

  const userId = await User.findOne({ email: user.email });
  if (
    !isReviewsExists.createdBy.equals(new mongoose.Types.ObjectId(userId?._id))
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you can not update this review "
    );
  }
  const isProductExists = await Product.findById(isReviewsExists.productId);
  if (!isProductExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product is  not found");
  }
  const reviews = await Reviews.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return reviews;
};
const deleteReviewsFromDb = async (user: JwtPayload, id: string) => {
  const isReviewsExists = await Reviews.findById(id);
  if (!isReviewsExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Review is  not found");
  }
  if (isReviewsExists.isDeleted === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "Review is  already deleted");
  }
  const userId = await User.findOne({ email: user.email });
  if (
    !isReviewsExists.createdBy.equals(new mongoose.Types.ObjectId(userId?._id))
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you can not delete this review "
    );
  }
  const reviews = await Reviews.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );
  return reviews;
};

export const ReviewsServices = {
  createReviewsIntoDb,
  getReviewsFromDb,
  getSingleReviewsFromDb,
  updateReviewsFromDb,
  deleteReviewsFromDb,
};
