import express from "express";
import { USER_ROLE } from "../auth/auth.constant";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ShoppingCartValidationSchema } from "./cart.validation";
import { ShoppingCartControllers } from "./cart.controller";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.user),
  validateRequest(
    ShoppingCartValidationSchema.createShoppingCartValidationSchema
  ),
  ShoppingCartControllers.createShoppingCart
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  ShoppingCartControllers.getShoppingCart
);
router.get(
  "/user",
  auth(USER_ROLE.admin, USER_ROLE.user),
  ShoppingCartControllers.getSingleUserCart
);
router.get(
  "/:cartId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  ShoppingCartControllers.getSingleShoppingCart
);
router.put(
  "/:cartId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  ShoppingCartControllers.updateSingleShoppingCart
);
router.delete(
  "/:cartId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  ShoppingCartControllers.deleteSingleShoppingCart
);
router.patch(
  "/:productId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  ShoppingCartControllers.deleteSingleShoppingCartFromUser
);

export const ShoppingCartRoutes = router;
