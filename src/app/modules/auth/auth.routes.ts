import express from "express";
import { AuthControllers } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(AuthValidations.createUserValidation),
  AuthControllers.createUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginUserValidation),
  AuthControllers.loginUser
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidation),
  AuthControllers.refreshToken
);

router.post(
  "/change-password",
  auth(),
  validateRequest(AuthValidations.changePasswordValidation),
  AuthControllers.changePassword
);

router.post(
  "/forget-password",
  validateRequest(AuthValidations.forgetPasswordValidation),
  AuthControllers.forgetPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordValidation),
  AuthControllers.resetPassword
);
router.get("/users", auth(), AuthControllers.getUser);

export const AuthRoutes = router;
