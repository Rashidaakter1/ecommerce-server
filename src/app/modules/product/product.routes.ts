import express from "express";

import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ProductControllers } from "./product.controller";
import { ProductValidations } from "./product.validation";

const router = express.Router();

router.post(
  "/create-product",
  auth(),
  validateRequest(ProductValidations.createProductValidation),
  ProductControllers.createProduct
);

router.get("/", ProductControllers.getProduct);
router.get("/:id", ProductControllers.getSingleProduct);
router.put("/:id", auth(), ProductControllers.updateProduct);
router.delete("/:id", auth(), ProductControllers.deleteProduct);

export const ProductRoutes = router;
