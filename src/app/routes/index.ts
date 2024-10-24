import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ProductRoutes } from "../modules/product/product.routes";
import { ReviewsRoutes } from "../modules/review/review.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ShoppingCartRoutes } from "../modules/cart/cart.route";
import { PaymentRoutes } from "../modules/payment/payment.routes";

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
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/review",
    route: ReviewsRoutes,
  },
  {
    path: "/cart",
    route: ShoppingCartRoutes,
  },
  {
    path: "/",
    route: PaymentRoutes,
  },
];

const router = express.Router();

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
