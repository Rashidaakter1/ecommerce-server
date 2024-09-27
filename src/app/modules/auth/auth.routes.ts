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

router.get("/users", auth(), AuthControllers.getUser);

export const AuthRoutes = router;
