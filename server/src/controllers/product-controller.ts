import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import productModel from "../models/product-model";
import categoryModel from "../models/category-model";
import supplierModel from "../models/supplier-model";

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productModel
    .find({ isDeleted: false })
    .populate("category")
    .populate("supplier");
  const categories = await categoryModel.find();
  const suppliers = await supplierModel.find();
  res.send({ products, categories, suppliers });
});

const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, stock, category, supplier } = req.body;

  // Create new product
  const newProduct = new productModel(req.body);
  const product = await newProduct.save();
  res.send({ product });
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock, category, supplier } = req.body;

  const updatedProduct = await productModel.findByIdAndUpdate(
    { _id: id },
    req.body,
  );
  if (!updatedProduct) {
    res.status(404).json("Product Not Found");
    return;
  }
  res.send(updatedProduct);
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productModel.findById({ _id: req.params.id });
  if (!product) {
    res.status(404).json("Product not found");
    return;
  }
  // Optional: Check if product is already deleted
  if (product.isDeleted) {
    res.status(400).json("Product is already deleted");
    return;
  }
  // Soft delete the product
  await productModel.updateOne({ _id: req.params.id }, { isDeleted: true });
  res.json(product);
});

export { getProducts, addProduct, updateProduct, deleteProduct };
