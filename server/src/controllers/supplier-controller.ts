import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import supplierModel from "../models/supplier-model";
import productModel from "../models/product-model";

const getSuppliers = asyncHandler(async (req: Request, res: Response) => {
  const suppliers = await supplierModel.find();
  res.json(suppliers);
});

const addSupplier = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, address } = req.body;

  // Check if user already exists with the same email
  const existingSupplier = await supplierModel.findOne({ email });
  if (existingSupplier) {
    res.status(400).json({ message: "Supplier already exists" });
    return;
  }

  // Create new user
  const newsupplier = new supplierModel(req.body);
  const supplier = await newsupplier.save();

  res.json(supplier);
});

const updateSupllier = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  const updatedCategory = await supplierModel.findByIdAndUpdate(
    { _id: id },
    req.body,
  );
  if (!updatedCategory) {
    res.status(404).json("Supplier Not Found");
    return;
  }

  res.send(updatedCategory);
});

const deletesupplier = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const productCount = await productModel.countDocuments({ supplier: id });
  if (productCount > 0) {
    res
      .status(400)
      .json({ message: "Cannot delete supplier with associated products" });
    return;
  }

  const Supplier = await supplierModel.findByIdAndDelete({ _id: id });
  if (!Supplier) {
    res.status(404).json("supplier not found");
    return;
  }
  res.json(Supplier);
});

export { getSuppliers, addSupplier, updateSupllier, deletesupplier };
