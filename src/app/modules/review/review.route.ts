import express from "express";
import { ReviewsControllers } from "./review.controller";

import { ReviewsValidations } from "./review.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";



const router = express.Router();

router.post(
  "/create-review",
  auth(USER_ROLE.user),
  validateRequest(ReviewsValidations.createReviewsValidation),
  ReviewsControllers.createReviews
);
router.get(
  "/",
  auth(USER_ROLE.user, USER_ROLE.admin),
  ReviewsControllers.getReviews
);
router.get(
  "/:reviewId",
  auth(USER_ROLE.user, USER_ROLE.admin),
  ReviewsControllers.getSingleReviews
);
router.put(
  "/:reviewId",
  auth(USER_ROLE.user),
  validateRequest(ReviewsValidations.updateReviewsValidation),
  ReviewsControllers.updateSingleReviews
);
router.delete(
  "/:reviewId",
  auth(USER_ROLE.user),
  ReviewsControllers.deleteSingleReviews
);

export const ReviewsRoutes = router;
