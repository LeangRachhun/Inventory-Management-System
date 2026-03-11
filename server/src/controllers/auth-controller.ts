import { Request, Response } from "express";
import userModel from "../models/user-model";
import bcrypt from "bcrypt";
import { signJWT } from "../utils";
import asyncHandler from "express-async-handler";

const Login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401).send("Invalid credentials");
    return;
  }

  //sign jwt
  const token = signJWT(user._id.toString(), user.email, user.role);

  res.json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
});

const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.send({
    _id: req.user?.id,
    email: req.user?.email,
    role: req.user?.role,
  });
});

export { Login, getMe };
