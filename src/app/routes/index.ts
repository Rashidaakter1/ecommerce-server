import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ProductRoutes } from "../modules/product/product.routes";
import { ReviewsRoutes } from "../modules/review/review.route";

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/reviews",
    route: ReviewsRoutes,
  },
];

const router = express.Router();

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
