import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import type { Category, Product } from "../types";
import DataTable, { type TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";

const EmployeeProduct: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [filterProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/product");
      if (response.statusText === "OK") {
        setCategories(response.data.categories);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error: any) {
      if (error.response.data.message === "jwt expired") {
        Swal.fire({
          title: "Unauthorized",
          text: "access denied!",
          icon: "error",
        });
      } else {
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };

  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilteredProducts(
      products.filter((product) => product.category._id === e.target.value),
    );
    setSelectedCategory(e.target.value);
  };

  const handleOrderClick = (product: Product) => {
    setOrderData({
      productId: product._id,
      quantity: 1,
      total: product.price,
      price: product.price,
      stock: product.stock,
    });
    setIsModalOpen(true);
  };
  const IncreaseQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) > orderData.stock) {
      //sweet alert
      Swal.fire({
        title: "Error!",
        text: "There is not enough stock!",
        icon: "error",
        confirmButtonText: "Okay",
      });

      // e.target.value = orderData.stock;
    } else {
      setOrderData((prev) => ({
        ...prev,
        quantity: Number(e.target.value),
        total: Number(e.target.value) * Number(orderData.price),
      }));
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/order/create", orderData);
      console.log(response.data);
      if (response.statusText === "OK") {
        setIsModalOpen(false);
        setOrderData({
          productId: "",
          quantity: 1,
          total: 0,
          stock: 0,
          price: 0,
        });
        fetchProducts();
        Swal.fire({
          title: "Success Order!",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (err: any) {
      alert(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const columns: TableColumn<Product>[] = [
    {
      name: "ID",
      selector: (_row, index) => (index ?? 0) + 1,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category.name,
      sortable: true,
    },

    {
      name: "Price",
      selector: (row) => `${row.price}`,
      sortable: true,
    },
    {
      name: "Stock",
      cell: (row) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
            row.stock === 0
              ? "bg-red-100 text-red-600"
              : row.stock <= 5
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
          }`}
        >
          {row.stock}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleOrderClick(row)}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:bg-green-300"
          disabled={loading || row.stock === 0}
        >
          Order
        </button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {loading ? (
        <p className="text-gray-500 mb-4">Loading...</p>
      ) : (
        <>
          {/* Category Dropdown and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <select
              value={selectedCategory}
              onChange={handleChangeCategory}
              className="w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              onChange={handleFilterProducts}
              placeholder="Search products..."
              className="w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <DataTable
              columns={columns}
              data={filterProducts}
              pagination
              highlightOnHover
              striped
              responsive
              progressPending={loading}
              noDataComponent="No products found."
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

          {/* Order Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Place Order</h2>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={orderData.quantity}
                      onChange={IncreaseQuantity}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <strong>Total: {orderData.total}</strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
                      disabled={loading}
                    >
                      Place Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeProduct;
