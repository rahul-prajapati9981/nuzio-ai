import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    const token = authorizationHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
