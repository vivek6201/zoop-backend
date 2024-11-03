import profileController, {
  getVendorProfileController,
} from "./profile.controller";
import ordersController, {
  getVendorOrdersController,
} from "./orders.controller";
import productsController, {
  getVendorProductsController,
  getVendorDishCategory,
} from "./products.controller";

export {
  productsController,
  profileController,
  ordersController,
  getVendorOrdersController,
  getVendorProductsController,
  getVendorProfileController,
  getVendorDishCategory,
};
