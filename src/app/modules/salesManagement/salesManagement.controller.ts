import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SalesManagementServices } from "./salesManagement.service";


const createSalesManagement = catchAsync(async (req, res) => {
  const SalesManagement = req.body;
  console.log(SalesManagement);
  const result = await SalesManagementServices.createSalesManagementIntoDb(SalesManagement);
  sendResponse(res, {
    success: true,
    message: "SalesManagement created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getSalesManagement = catchAsync(async (req, res) => {
  const result = await SalesManagementServices.getSalesManagementFromDb();
  sendResponse(res, {
    success: true,
    message: "SalesManagements retried successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getSingleSalesManagement = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SalesManagementServices.getSingleSalesManagementFromDb(id);
  sendResponse(res, {
    success: true,
    message: "SalesManagement retrieved successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateSalesManagement = catchAsync(async (req, res) => {
  const { id } = req.params;
  const SalesManagement = req.body;
  const result = await SalesManagementServices.updateSalesManagementIntoDb(id, SalesManagement);
  sendResponse(res, {
    success: true,
    message: "SalesManagement created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const deleteSalesManagement = catchAsync(async (req, res) => {
  const { id } = req.params;
  const SalesManagement = req.body;
  const result = await SalesManagementServices.deleteSalesManagementFromDb(id);
  sendResponse(res, {
    success: true,
    message: "SalesManagement id deleted successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const SalesManagementControllers = {
  createSalesManagement,
  getSalesManagement,
  updateSalesManagement,
  deleteSalesManagement,
  getSingleSalesManagement,
};
