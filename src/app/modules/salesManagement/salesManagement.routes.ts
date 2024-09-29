import express from "express";

import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ProductControllers } from "./salesManagement.controller";
import { ProductValidations } from "./salesManagement.validation";

const router = express.Router();

router.post(
  "/create-product",
  auth(),
  validateRequest(ProductValidations.createProductValidation),
  ProductControllers.createProduct
);

router.get("/", auth(), ProductControllers.getProduct);
router.get("/:id", auth(), ProductControllers.getSingleProduct);
router.put("/:id", auth(), ProductControllers.updateProduct);
router.delete("/:id", auth(), ProductControllers.deleteProduct);

export const ProductRoutes = router;
