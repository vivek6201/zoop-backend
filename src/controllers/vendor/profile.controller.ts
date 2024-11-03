import { Request, RequestHandler, Response } from "express";
import { STATUS_CODES } from "../../lib/constants";
import { vendorProfileSchema } from "../../validations/profileValidation";
import prisma from "../../lib/db";
import { JwtPayload } from "jsonwebtoken";
import { User, VendorProfile } from "@prisma/client";
import { z } from "zod";

const profileController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof vendorProfileSchema> = req.body;
  const token = req.headers.token as unknown as JwtPayload;
  const { success, data, error } = await vendorProfileSchema.safeParseAsync(
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

  let user: User | null = null;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: token.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "error while verifying user",
    });
    return;
  }

  if (!user) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "user not found!",
    });
    return;
  }

  let vendorProfile: VendorProfile | null = null;

  try {
    vendorProfile = await prisma.$transaction(async (tx) => {
      const profile = await tx.profile.upsert({
        where: {
          userId: token.id,
        },
        create: {
          userId: token.id,
        },
        update: {},
      });

      const newVendorProfile = await tx.vendorProfile.create({
        data: {
          ...data,
          phoneNumber: data.phoneNumber.toString(),
          profile: {
            connect: {
              id: profile.id,
            },
          },
          vendorMenu: {
            create: {},
          },
        },
      });

      return newVendorProfile;
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while creating vendor profile!",
    });
    return;
  }

  res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "Vendor profile created successfully",
  });
};

export const getVendorProfileController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const token = req.headers.token as unknown as JwtPayload;

  let user: User | null = null;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: token.id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "error while verifying user",
    });
    return;
  }

  if (!user) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "User not found!",
    });
    return;
  }

  let vendorProfile: VendorProfile | null = null;

  try {
    vendorProfile = await prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findUnique({
        where: {
          userId: token.id,
        },
      });

      const vendorProfile = await tx.vendorProfile.findUnique({
        where: {
          profileId: profile?.id,
        },
        include: {
          vendorMenu: true,
        },
      });

      return vendorProfile;
    });
  } catch (error) {
    console.error(error);

    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while finding vendor profile!",
    });
    return;
  }

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    message: "Profile fetched successfully",
    vendorProfile,
  });
};

export default profileController;
