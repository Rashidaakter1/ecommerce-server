import express from "express";
import { USER_ROLE } from "../auth/auth.constant";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";


import { WishlistValidationSchema } from "./wishlist.validation";
import { WishlistControllers } from "./wishlist.controller";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.user),
  validateRequest(
   WishlistValidationSchema.createWishlistValidationSchema
  ),
  WishlistControllers.createWishlist
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  WishlistControllers.getWishlist
);
router.get(
  "/user",
  auth(USER_ROLE.admin, USER_ROLE.user),
  WishlistControllers.getSingleUserCart
);
router.get(
  "/:productId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  WishlistControllers.getSingleWishlist
);
router.put(
  "/:productId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  WishlistControllers.updateSingleWishlist
);
router.delete(
  "/:productId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  WishlistControllers.deleteSingleWishlist
);
router.patch(
  "/:productId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  WishlistControllers.deleteSingleWishlistFromUser
);

export const WishlistRoutes = router;
