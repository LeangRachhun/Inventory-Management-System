import { Request, Response, NextFunction } from "express";

const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);
  if (err.message === "jwt expired") {
    res.status(401).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: err.message });
};

export default handleError;
