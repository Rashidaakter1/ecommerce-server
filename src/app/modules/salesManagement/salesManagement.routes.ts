import express from "express";

import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { SalesManagementValidations } from "./salesManagement.validation";
import { SalesManagementControllers } from "./salesManagement.controller";

const router = express.Router();

router.post(
  "/create",
  auth(),
  validateRequest(SalesManagementValidations.createSalesManagementValidation),
  SalesManagementControllers.createSalesManagement
);

router.get("/", auth(), SalesManagementControllers.getSalesManagement);
router.get("/:id", auth(), SalesManagementControllers.getSingleSalesManagement);
router.put("/:id", auth(), SalesManagementControllers.updateSalesManagement);
router.delete("/:id", auth(), SalesManagementControllers.deleteSalesManagement);

export const SalesManagementRoutes = router;
