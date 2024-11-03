import { Router } from "express";
import {
  cartController,
  getProfileController,
  getRestrauntsController,
  getUserCartController,
  getUserOrdersController,
  ordersController,
  profileController,
} from "../controllers/user";
import authMiddleware, { isValidRole } from "../controllers/middlewares/authMiddleware";
import { Role } from "@prisma/client";

const userRoutes = Router();

userRoutes.use(authMiddleware);
userRoutes.use(isValidRole([Role.User]))

//post routes
userRoutes.post("/profile", profileController);
userRoutes.post("/cart", cartController);
userRoutes.post("/orders", ordersController);

//get routes
userRoutes.get("/profile", getProfileController);
userRoutes.get("/orders", getUserOrdersController);
userRoutes.get("/cart", getUserCartController);
userRoutes.get("/restraunts", getRestrauntsController)

export default userRoutes;
