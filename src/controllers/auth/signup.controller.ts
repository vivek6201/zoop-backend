import { Request, RequestHandler, Response } from "express";
import { signupSchema } from "../../validations/authValidations";
import { STATUS_CODES } from "../../lib/constants";
import prisma from "../../lib/db";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../../utils/sendVerificationEmail";
import { generateOtp, verifyOtp } from "../../utils/util";
import { z } from "zod";

const signupController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqData: z.infer<typeof signupSchema> = req.body;
  const queryType: {
    sendOtp?: boolean;
    verifyOtp?: boolean;
  } = req.query;

  const { success, data, error } = await signupSchema.safeParseAsync(reqData);

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
        email: data.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while verifying user!, please try after sometime :(",
    });
    return;
  }

  if (user) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "User already exists, please login to access the platform",
    });
    return;
  }

  if (queryType.sendOtp) {
    try {
      const Otp = {
        otp: generateOtp(),
        userEmail: data.email,
        expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes from now
      };
      await prisma.otp.create({
        data: Otp,
      });
      await sendVerificationEmail(Otp.otp, data.email);
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Otp sent Successfully",
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: "Error while sending verification email!",
      });
      return;
    }
  } else {
    if (!data.otp) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: "Otp is required!",
      });
      return;
    }
    const status = await verifyOtp(data.otp, data.email);

    if (!status) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: "Otp Invalid or Expired",
      });
      return;
    }

    let newUser: User | null = null;

    try {
      newUser = await prisma.user.create({
        data: {
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          role: data.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: "Error while creating user!",
      });
      return;
    }

    const payload = {
      email: data.email,
      id: newUser?.id,
      role: newUser?.role,
    };

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: "jwt secret not found!",
      });
      return;
    }

    const token: string = jwt.sign(payload, jwtSecret);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "User created successfully",
      token,
    });
    return;
  }
};

export default signupController;
