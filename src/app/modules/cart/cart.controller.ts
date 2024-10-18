import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CategoryServices } from "./category.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategoryIntoDb(req.user,req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Category created successfully!",
    data: result,
  });
});

const getCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getCategoryFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const result = await CategoryServices.getSingleCategoryFromDb(categoryId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category is retrieved successfully!",
    data: result,
  });
});

const updateSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const result = await CategoryServices.updateCategoryFromDb(
    categoryId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category is updated successfully!",
    data: result,
  });
});

const deleteSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const result = await CategoryServices.deleteCategoryFromDb(categoryId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category is deleted successfully!",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getCategory,
  getSingleCategory,
  updateSingleCategory,
  deleteSingleCategory,
};
