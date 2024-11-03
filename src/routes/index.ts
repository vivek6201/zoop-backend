import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.routes";
import vendorRoutes from "./vendor.route";
import deliveryRoutes from "./delivery.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/vendor", vendorRoutes);
router.use("/delivery", deliveryRoutes);

export default router;