import express from "express";
import { AuthControllers } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(AuthValidations.createUserValidation),
  AuthControllers.createUser
);

export const AuthRoutes = router;
