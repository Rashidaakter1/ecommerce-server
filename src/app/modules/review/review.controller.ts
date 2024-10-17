import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ReviewsServices } from "./review.service";

const createReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsServices.createReviewsIntoDb(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Reviews created successfully!",
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsServices.getReviewsFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews are retrieved successfully",
    data: result,
  });
});

const getSingleReviews = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId;
  const result = await ReviewsServices.getSingleReviewsFromDb(reviewId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review  is retrieved  successfully!",
    data: result,
  });
});
const updateSingleReviews = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId;
  console.log(req.body);
  const result = await ReviewsServices.updateReviewsFromDb(
    req.user,
    reviewId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review  is updated  successfully!",
    data: result,
  });
});
const deleteSingleReviews = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId;
  const result = await ReviewsServices.deleteReviewsFromDb(req.user, reviewId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review  is deleted  successfully!",
    data: result,
  });
});

export const ReviewsControllers = {
  createReviews,
  getReviews,
  getSingleReviews,
  updateSingleReviews,
  deleteSingleReviews,
};
