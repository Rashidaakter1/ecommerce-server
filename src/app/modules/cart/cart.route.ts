import express from "express";
import { USER_ROLE } from "../auth/auth.constant";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ShoppingCartValidationSchema } from "./cart.validation";
import { ShoppingCartControllers } from "./cart.controller";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin),
  validateRequest(ShoppingCartValidationSchema.createShoppingCartValidationSchema),
  ShoppingCartControllers.createShoppingCart
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  ShoppingCartControllers.getShoppingCart
);
router.get(
  "/:ShoppingCartId",
  auth(USER_ROLE.admin),
  ShoppingCartControllers.getSingleShoppingCart
);
router.put(
  "/:ShoppingCartId",
  auth(USER_ROLE.admin),
  ShoppingCartControllers.updateSingleShoppingCart
);
router.delete(
  "/:ShoppingCartId",
  auth(USER_ROLE.admin),
  ShoppingCartControllers.deleteSingleShoppingCart
);

export const ShoppingCartRoutes = router;
