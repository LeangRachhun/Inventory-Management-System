import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import categoryModel from "../models/category-model";
import productModel from "../models/product-model";

const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryModel.find();
  res.json(categories);
});

const addCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  // Check if Category already exists with the same name
  const existingCategory = await categoryModel.findOne({ name: name });
  if (existingCategory) {
    res.status(400).json({ message: "Category already exists" });
    return;
  }

  // Create new user
  const newCategory = new categoryModel({
    name,
    description,
  });
  const category = await newCategory.save();

  res.json(category);
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await categoryModel.findById({ _id: id });
  if (!category) {
    res.status(404).json("Category Not Found");
    return;
  }

  const updatedCategory = await categoryModel.findByIdAndUpdate(
    { _id: id },
    { name, description },
  );

  res.send(updatedCategory);
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const productCount = await productModel.countDocuments({ category: id });
  if (productCount > 0) {
    res
      .status(400)
      .json({ message: "Cannot delete category with associated products" });
    return;
  }

  const category = await categoryModel.findByIdAndDelete({ _id: id });
  if (!category) {
    res.status(404).json("document not found");
    return;
  }
  res.json(category);
});

export { getCategories, addCategory, updateCategory, deleteCategory };
