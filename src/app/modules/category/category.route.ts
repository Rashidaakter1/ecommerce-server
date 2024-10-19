import express from "express";
import { CategoryControllers } from "./category.controller";
import { categoryValidationSchema } from "./category.validation";
import { USER_ROLE } from "../auth/auth.constant";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-category",
  auth(USER_ROLE.admin),
  validateRequest(categoryValidationSchema.createCategoryValidationSchema),
  CategoryControllers.createCategory
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  CategoryControllers.getCategory
);
router.get(
  "/:categoryId",
  auth(USER_ROLE.admin),
  CategoryControllers.getSingleCategory
);
router.put(
  "/:categoryId",
  auth(USER_ROLE.admin),
  CategoryControllers.updateSingleCategory
);
router.delete(
  "/:categoryId",
  auth(USER_ROLE.admin),
  CategoryControllers.deleteSingleCategory
);

export const CategoryRoutes = router;
