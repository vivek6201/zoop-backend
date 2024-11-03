import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../../lib/constants";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: "JWT secret key not found!",
      });
      return;
    }

    const authHeader = req.header("Authorization");
    if (!authHeader) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: "Authorization header not found!",
      });
      return;
    }

    const token: string = authHeader.split(" ").pop() || "";
    const decoded = jwt.verify(token, jwtSecret);
    req.headers.token = decoded as string;

    next();
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Authentication failed due to server error!",
    });
  }
};

export const isValidRole =
  (requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.token as string | jwt.JwtPayload;
      if (!token || typeof token === "string") {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Invalid token",
        });
        return;
      }

      const userRole = (token as jwt.JwtPayload).role;
      if (!requiredRoles.includes(userRole)) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Forbidden: You do not have the required role",
        });
        return;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: "Authorization failed due to server error!",
      });
    }
  };

export default authMiddleware;
