import express from "express";




import { USER_ROLE } from "../auth/auth.constant";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { orderValidationSchema } from "./order.validation";
import { OrderControllers } from "./order.controller";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin),
  validateRequest(orderValidationSchema.createOrderValidationSchema),
  OrderControllers.createOrder
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  OrderControllers.getOrder
);
router.get(
  "/:OrderId",
  auth(USER_ROLE.admin),
  OrderControllers.getSingleOrder
);
router.put(
  "/:OrderId",
  auth(USER_ROLE.admin),
  OrderControllers.updateSingleOrder
);
router.delete(
  "/:OrderId",
  auth(USER_ROLE.admin),
  OrderControllers.deleteSingleOrder
);

export const OrderRoutes = router;
