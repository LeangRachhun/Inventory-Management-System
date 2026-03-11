import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import userModel from "../models/user-model";
import bcrypt from "bcrypt";

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  if (req.query.role) {
    const Users = await userModel.find({ role: req.query.role });
    res.send(Users);
    return;
  }
  const Users = await userModel.find();
  res.send(Users);
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.user?.id.toString() !== id) {
    res.status(403).send({ message: "Unauthorized" });
    return;
  }

  const user = await userModel.findById(id).select("-password");
  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  }
  res.send(user);
});

const addUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, address } = req.body;

  // Check if user already exists with the same email
  let existingUser = await userModel.findOne({ email });
  if (existingUser) {
    res.status(400).send({ message: "User already exists" });
    return;
  }

  // Hash the password before storing the user
  const hashedPassword = await bcrypt.hash(password, 10);

  req.body.password = hashedPassword;

  const newuser = new userModel(req.body);
  const user = await newuser.save();
  res.send(user);
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const updateData = req.body;

  // If password is included, hash it
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(
      userId,
      {
        username: updateData.username,
        email: updateData.email,
        password: updateData.password,
        address: updateData.address,
      },
      { new: true, runValidators: true },
    )
    .select("-password");
  if (!updatedUser) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  res.send(updatedUser);
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    res.status(404).send({ message: "user not found." });
    return;
  }
  res.send({ data: user });
});

export { getUsers, getUser, addUser, updateUser, deleteUser };
