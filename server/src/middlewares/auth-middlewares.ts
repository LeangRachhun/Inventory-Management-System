import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { JwtUser } from "../types/express";

//verify JWT
const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json("Unauthorized.");
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = JWT.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtUser;
    req.user = decoded;

    next();
  },
);

export default verifyJWT;
