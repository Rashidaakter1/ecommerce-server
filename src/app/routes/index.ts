import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
 
];

const router = express.Router();

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
