import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import orderMedel from "../models/order-medel";
import productModel from "../models/product-model";

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userRole = req.user?.role;

  const { fromDate, toDate, user } = req.query as {
    fromDate?: string;
    toDate?: string;
    user?: string;
  };

  const query: any = {};

  // role-based user filter
  if (userRole === "user") {
    query.user = id;
  } else if (user) {
    query.user = user;
  } // Else, no filter - get all orders

  // date range filter (THIS IS THE MISSING PART)
  if (fromDate || toDate) {
    query.orderDate = {};

    if (fromDate) {
      query.orderDate.$gte = new Date(fromDate).setHours(0, 0, 0, 0);
    }

    if (toDate) {
      // optional: include full end day
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
      query.orderDate.$lte = endDate;
    }
  }

  const orders = await orderMedel
    .find(query)
    .populate({
      path: "product",
      populate: {
        path: "category",
        select: "name",
      },
      select: "name",
    })
    .populate({
      path: "user",
      select: "username address",
    })
    .sort({ orderDate: -1 });

  res.send(orders);
});

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity, total } = req.body;
  const userId = req.user?.id;

  const product = await productModel.findById(productId);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  if (quantity > product.stock) {
    res.status(400).json({ message: "Not enough stock" });
    return;
  }
  product.stock -= Number(quantity);
  await product.save();

  const order = new orderMedel({
    user: userId,
    product: productId,
    quantity,
    totalPrice: total,
  });
  await order.save();

  res.send({ message: "Order created successfully" });
});

export { getOrders, createOrder };
