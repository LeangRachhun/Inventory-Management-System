import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import Swal from "sweetalert2";

/* =======================
   Type Definitions
======================= */

interface HighestSaleProduct {
  name: string;
  category: string;
  totalQuantity: number;
  message?: string;
}

interface DashboardData {
  totalProducts: number;
  totalStock: number;
  ordersToday: number;
  revenue: number;
  outOfStock: Product[];
  highestSaleProduct: HighestSaleProduct | null;
  lowStock: Product[];
}

/* =======================
   Component
======================= */

const Summary: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    revenue: 0,
    outOfStock: [],
    highestSaleProduct: null,
    lowStock: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/dashboard");

        setDashboardData(response.data);
      } catch (error: any) {
        console.log(error.response);
        const message = error?.response?.data?.message;

        if (message === "jwt expired") {
          Swal.fire({
            title: "Unauthorized",
            text: "access denied!",
            icon: "error",
          });
        } else {
          alert(message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Total Stock</h2>
          <p className="text-2xl font-bold">{dashboardData.totalStock}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Order Today</h2>
          <p className="text-2xl font-bold">{dashboardData.ordersToday}</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-2xl font-bold">${dashboardData.revenue}</p>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Out of Stock */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Out of Stock Products
          </h3>

          {dashboardData.outOfStock.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.outOfStock.map((product, index) => (
                <li key={index} className="text-gray-600">
                  {product.name}{" "}
                  <span className="text-gray-400">
                    ({product.category?.name})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No products out of stock.</p>
          )}
        </div>

        {/* Highest Sale */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Highest Sale Product
          </h3>

          {dashboardData.highestSaleProduct?.name ? (
            <div className="text-gray-600">
              <p>
                <strong>Name:</strong> {dashboardData.highestSaleProduct.name}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {dashboardData.highestSaleProduct.category}
              </p>
              <p>
                <strong>Total Units Sold:</strong>{" "}
                {dashboardData.highestSaleProduct.totalQuantity}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              {dashboardData.highestSaleProduct?.message || "Loading..."}
            </p>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Low Stock Products
          </h3>

          {dashboardData.lowStock.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.lowStock.map((product, index) => (
                <li key={index} className="text-gray-600">
                  <strong>{product.name}</strong> - {product.stock} left{" "}
                  <span className="text-gray-400">
                    ({product.category?.name})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No low stock products.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
