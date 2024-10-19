import express from "express";

import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ProductControllers } from "./product.controller";
import { ProductValidations } from "./product.validation";
import { USER_ROLE } from "../auth/auth.constant";

const router = express.Router();

router.post(
  "/create-product",
  auth(USER_ROLE.admin),
  validateRequest(ProductValidations.createProductValidation),
  ProductControllers.createProduct
);

router.get("/", ProductControllers.getProduct);
router.get("/:id", ProductControllers.getSingleProduct);
router.put("/:id", auth(USER_ROLE.admin), ProductControllers.updateProduct);
router.delete("/:id", auth(USER_ROLE.admin), ProductControllers.deleteProduct);

export const ProductRoutes = router;
