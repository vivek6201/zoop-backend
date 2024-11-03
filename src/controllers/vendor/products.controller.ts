import { Request, RequestHandler, Response } from "express";
import { vendorDishSchema } from "../../validations/vendorValidations";
import { STATUS_CODES } from "../../lib/constants";
import prisma from "../../lib/db";
import { VendorDish, VendorMenu } from "@prisma/client";
import { z } from "zod";

const productsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { menuId } = req.params;

  let menu: VendorMenu | null = null;

  try {
    menu = await prisma.vendorMenu.findUnique({
      where: {
        id: menuId as string,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "error while verifying menu id!",
    });
    return;
  }

  if (!menu) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "menu not found with corresponding menu id!",
    });
    return;
  }

  const reqBody: z.infer<typeof vendorDishSchema> = req.body;

  const { success, error, data } = await vendorDishSchema.safeParseAsync(
    reqBody
  );

  if (!success) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
    return;
  }

  let dishImageUrl: string | null = null;

  if (data.dishImage) {
    //upload image to any storage bucket
  }

  try {
    await prisma.$transaction(async (tx) => {
      const category = await tx.dishCategory.upsert({
        where: {
          id: data?.dishCategoryId ?? "",
        },
        create: {
          categoryName: data?.dishCategoryName as string,
          vendorMenuId: menuId as string,
        },
        update: {},
      });

      const newDish = await tx.vendorDish.create({
        data: {
          dishDescription: data.dishDescription,
          dishName: data.dishName,
          dishPrice: data.dishPrice.toString(),
          dishCategoryId: category.id,
          dishImage: dishImageUrl,
          vendorMenuId: menuId as string,
          dishRating: data.dishRating,
        },
      });

      return newDish;
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while creating dish!",
    });
    return;
  }

  res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "Dish created successfully",
  });
};

export const getVendorProductsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { menuId } = req.params;

  try {
    let menu = await prisma.vendorMenu.findUnique({
      where: {
        id: menuId as string,
      },
    });

    if (!menu) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "menu not found with corresponding menu id!",
      });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "error while verifying menu id!",
    });
    return;
  }

  let dishes: (VendorDish & { category: { categoryName: string } })[] = [];

  try {
    dishes = await prisma.vendorDish.findMany({
      where: {
        vendorMenuId: menuId as string,
      },
      include: {
        category: {
          select: {
            categoryName: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "failed to fetch dishes",
    });
    return;
  }

  //creating a flatlist
  const mappedDishes = dishes.map((dish) => {
    return {
      ...dish,
      category: dish.category.categoryName,
    };
  });

  //filtering dishes according to categories and grouping them.
  const groupedData = Object.values(
    mappedDishes.reduce(
      (
        acc: Record<string, { category: string; dishes: typeof mappedDishes }>,
        dish
      ) => {
        const category = dish.category;
        if (!acc[category]) {
          acc[category] = { category, dishes: [] };
        }
        acc[category].dishes.push(dish);
        return acc;
      },
      {}
    )
  );

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    data: groupedData,
  });
};

export const getVendorDishCategory: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { menuId } = req.params;

  try {
    const menu = await prisma.vendorMenu.findUnique({
      where: {
        id: menuId,
      },
    });

    if (!menu) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Menu not found!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while verifying menu",
    });
  }

  try {
    const categories = await prisma.dishCategory.findMany({
      where: {
        vendorMenuId: menuId,
      },
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Categories fetched sucessfully!",
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching categories!",
    });
  }
};

export default productsController;
