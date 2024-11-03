import { Request, RequestHandler, Response } from "express";
import prisma from "../../lib/db";
import { STATUS_CODES } from "../../lib/constants";

const ordersController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  
};

export const getVendorOrdersController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { vendorProfileId } = req.params;

  try {
    const orders = await prisma.vendorOrders.findUnique({
      where: {
        vendorProfileId,
      },
      include: {
        orderDeliveryAgent: true,
      },
    });

    if (!orders) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No orders found related to vendor profile",
      });
      return;
    }

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Order fetched successfully!",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Internal error while fetching vendor orders",
    });
  }
};

export default ordersController;
