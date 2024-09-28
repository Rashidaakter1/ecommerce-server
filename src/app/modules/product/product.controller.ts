import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";

const createProduct = catchAsync(async (req, res) => {
  const Product = req.body;
  console.log(Product);
  const result = await ProductServices.createProductIntoDb(Product);
  sendResponse(res, {
    success: true,
    message: "Product created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getProductFromDb();
  sendResponse(res, {
    success: true,
    message: "Products retried successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getSingleProductFromDb(id);
  sendResponse(res, {
    success: true,
    message: "Product retrieved successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Product = req.body;
  const result = await ProductServices.updateProductIntoDb(id, Product);
  sendResponse(res, {
    success: true,
    message: "Product created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Product = req.body;
  const result = await ProductServices.deleteProductFromDb(id);
  sendResponse(res, {
    success: true,
    message: "Product id deleted successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
};
