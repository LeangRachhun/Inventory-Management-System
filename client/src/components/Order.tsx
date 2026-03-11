// src/components/Orders.jsx
import React, { useEffect, useMemo, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";

import axiosInstance from "../utils/api";
import { useAuth } from "../context/AuthContext";
import type { Order, User } from "../types";
import Swal from "sweetalert2";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();
  const [filterData, setFilterData] = useState({
    fromDate: "",
    toDate: "",
    user: "",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/order/${user?._id}`, {
        params: filterData,
      });
      setOrders(response.data || []);
    } catch (error: any) {
      if (error.response.data.message === "jwt expired") {
        Swal.fire({
          title: "Unauthorized",
          text: "access denied!",
          icon: "error",
        });
      } else {
        alert(error?.response?.data?.message || "something went wrong!");
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/user`, {
          params: { role: "user" },
        });
        setUsers(response.data || []);
      } catch (error: any) {
        if (error.response.data.message === "jwt expired") {
          Swal.fire({
            title: "Unauthorized",
            text: "access denied!",
            icon: "error",
          });
        } else {
          alert(error?.response?.data?.message || "something went wrong!");
        }
      }
    };

    fetchOrders();
    fetchUser();

    setLoading(false);
  }, [user?._id]);

  //handle cahnge
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchOrders();
    setLoading(false);
  };

  const columns: TableColumn<Order>[] = useMemo(() => {
    const cols: TableColumn<Order>[] = [
      {
        name: "S NO",
        cell: (_row, index) => index + 1,
        width: "80px",
      },
    ];

    if (user?.role === "admin") {
      cols.push(
        {
          name: "Name",
          selector: (row) => row.user?.username || "Resigned",
          sortable: true,
        },
        {
          name: "Address",
          selector: (row) => row.user?.address || "Resigned",
        },
      );
    }

    cols.push(
      {
        name: "Product Name",
        selector: (row) => row.product.name,
        sortable: true,
      },
      {
        name: "Category",
        selector: (row) => row.product.category.name,
        sortable: true,
      },
      {
        name: "Quantity",
        selector: (row) => row.quantity,
        sortable: true,
      },
      {
        name: "Total Price",
        selector: (row) => `$${row.totalPrice.toFixed(2)}`,
        sortable: true,
      },
      {
        name: "Order Date",
        selector: (row) => new Date(row.orderDate).toLocaleDateString(),
        sortable: true,
      },
    );

    return cols;
  }, [user?.role]);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">
        {user?.role === "admin" ? "Orders" : "My Orders"}
      </h1>
      {/* Filters Card */}
      {user?.role === "admin" ? (
        <div className=" py-5">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  By User
                </label>
                <select
                  name="user"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  onChange={handleInputChange}
                >
                  <option value="" hidden>
                    Select User
                  </option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-end">
                <button className="w-1xl bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium transition-all cursor-pointer">
                  Filter orders
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={orders}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent={<p className="p-4 text-gray-500">No orders found</p>}
          customStyles={{
            headCells: {
              style: {
                fontSize: "16px",
                fontWeight: "700",
              },
            },
            cells: {
              style: {
                fontSize: "15px",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Orders;
