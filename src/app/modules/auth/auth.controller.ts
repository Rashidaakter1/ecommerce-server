import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const createUser = catchAsync(async (req, res) => {
  const user = req.body;
  console.log(user);
  const result = await AuthServices.createUserIntoDb(user);
  sendResponse(res, {
    success: true,
    message: "User created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const result = await AuthServices.getUserFromDb();
  sendResponse(res, {
    success: true,
    message: "Users retried successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AuthServices.getSingleUserFromDb(id);
  sendResponse(res, {
    success: true,
    message: "User retrieved successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const result = await AuthServices.updateUserIntoDb(id, user);
  sendResponse(res, {
    success: true,
    message: "User created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const result = await AuthServices.deleteUserFromDb(id);
  sendResponse(res, {
    success: true,
    message: "User id deleted successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await AuthServices.loginUserIntoDb(user);
  const { accessToken, refreshToken } = result;

  // Set the token as a cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600000,
  });

  sendResponse(res, {
    success: true,
    message: "User is logged in successfully",
    statusCode: httpStatus.OK,
    data: {
      accessToken,
    },
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshTokenIntoDB(refreshToken);
  sendResponse(res, {
    success: true,
    message: "Access token is regenerated successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user = await AuthServices.changePasswordIntoDb(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password is changed successfully!",
    data: user,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const user = await AuthServices.forgetPasswordDb(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Forget password link is generated successfully!",
    data: user,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthServices.resetPasswordDb(req.body, token as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password is reset successfully!",
    data: result,
  });
});

export const AuthControllers = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getSingleUser,
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
