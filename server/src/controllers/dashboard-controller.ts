import productModel from "../models/product-model";
import orderMedel from "../models/order-medel";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const getSummary = asyncHandler(async (req: Request, res: Response) => {
  // Total Products
  const totalProducts = await productModel.countDocuments({ isDeleted: false });

  // Total Stock
  const stockResult = await productModel.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, totalStock: { $sum: "$stock" } } },
  ]);
  const totalStock = stockResult[0]?.totalStock || 0;

  // Orders Today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const ordersToday = await orderMedel.countDocuments({
    orderDate: { $gte: startOfDay, $lte: endOfDay },
  });
  // Total Revenue
  const revenueResult = await orderMedel.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
  ]);
  const revenue = revenueResult[0]?.totalRevenue || 0;

  // Out of Stock Products
  const outOfStock = await productModel
    .find({ stock: 0, isDeleted: false })
    .select("name category stock")
    .populate("category", "name");

  // Highest Sale Product
  const highestSaleResult = await orderMedel.aggregate([
    { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" } } },
    { $sort: { totalQuantity: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "product.category",
      },
    },
    { $unwind: "$product.category" },
    {
      $project: {
        name: "$product.name",
        category: "$product.category.name",
        totalQuantity: 1,
      },
    },
  ]);
  const highestSaleProduct = highestSaleResult[0] || {
    message: "No sales data available",
  };
  // Low Stock Products
  const lowStock = await productModel
    .find({ stock: { $gt: 0, $lt: 5 } }, { isDeleted: false })
    .select("name category stock")
    .populate("category", "name");

  // Combine all data into one response
  const dashboardData = {
    totalProducts,
    totalStock,
    ordersToday,
    revenue,
    outOfStock,
    highestSaleProduct,
    lowStock,
  };
  res.send(dashboardData);
});

export { getSummary };
