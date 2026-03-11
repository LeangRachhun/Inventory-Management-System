import orderMedel from "../models/order-medel";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import productModel from "../models/product-model";
import mongoose from "mongoose";

const getReports = asyncHandler(async (req: Request, res: Response) => {
  // get monthly Revenue
  const monthlyRevenue = await orderMedel.aggregate([
    {
      $match: {
        orderDate: {
          $gte: new Date(new Date().getFullYear(), 0, 1), // Start of current year
          $lte: new Date(new Date().getFullYear(), 11, 31), // End of current year
        },
      },
    },
    {
      $group: {
        _id: { $month: "$orderDate" },
        revenue: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        revenue: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);
  // Transform to include all months with 0 revenue for months with no orders
  // Transform to include all months with 0 revenue for months with no orders
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyRevenueResult = months.map((label, index) => {
    const monthData = monthlyRevenue.find((item) => item.month === index + 1);
    return {
      label,
      value: monthData ? monthData.revenue : 0,
    };
  });

  // Query to get yearly revenue
  const yearlyRevenue = await orderMedel.aggregate<{
    year: number;
    revenue: number;
  }>([
    {
      $match: {
        orderDate: {
          $gte: new Date("2020-01-01"),
          $lte: new Date("2026-12-31"),
        },
      },
    },
    {
      $group: {
        _id: { $year: "$orderDate" },
        revenue: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        revenue: 1,
      },
    },
    {
      $sort: { year: 1 },
    },
  ]);

  // Define the years you want to include
  const targetYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

  // Transform to include all years with 0 revenue for years with no orders
  const yearlyRevenueResult = targetYears.map((year) => {
    const yearData = yearlyRevenue.find((item) => item.year === year);
    return {
      label: year.toString(),
      value: yearData ? yearData.revenue : 0,
    };
  });

  // get total stock by category
  const stockByCategory = await productModel.aggregate<{
    _id: mongoose.Types.ObjectId;
    totalStock: number;
    categoryName: string;
  }>([
    {
      $match: {
        isDeleted: false, // Only include non-deleted products
      },
    },
    {
      $group: {
        _id: "$category",
        totalStock: { $sum: "$stock" }, // Sum the stock field instead of counting
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        _id: 0,
        label: "$category.name",
        value: "$totalStock",
      },
    },
    {
      $sort: { value: -1 }, // Sort by stock descending
    },
  ]);

  res.send({ monthlyRevenueResult, yearlyRevenueResult, stockByCategory });
});

export { getReports };
