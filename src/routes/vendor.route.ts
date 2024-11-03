import { Router } from "express";
import {
  getVendorDishCategory,
  getVendorOrdersController,
  getVendorProductsController,
  getVendorProfileController,
  ordersController,
  productsController,
  profileController,
} from "../controllers/vendor";
import authMiddleware, {
  isValidRole,
} from "../controllers/middlewares/authMiddleware";
import { Role } from "@prisma/client";

const vendorRoutes = Router();

// middlewares for authentication and authorization
vendorRoutes.use(authMiddleware);
vendorRoutes.use(isValidRole([Role.Vendor]));

vendorRoutes.post("/profile", profileController);
vendorRoutes.post("/orders/:venderProfileId", ordersController);
vendorRoutes.post("/products/:menuId", productsController);

vendorRoutes.get("/profile", getVendorProfileController);
vendorRoutes.get("/orders/:vendorProfileId", getVendorOrdersController);
vendorRoutes.get("/products/:menuId", getVendorProductsController);
vendorRoutes.get("/dish-category/:menuId", getVendorDishCategory);

export default vendorRoutes;
