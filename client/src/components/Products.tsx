import React, { useEffect, useState } from "react";
import { type Category, type Product, type Supplier } from "../types";
import axiosInstance from "../utils/api";
import DataTable, { type TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    supplier: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/product");
      if (response.statusText === "OK") {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        setCategories(response.data.categories);
        setSuppliers(response.data.suppliers);
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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      // Edit existing products
      try {
        const response = await axiosInstance.put(
          `/product/update/${editingId}`,
          formData,
        );
        if (response.statusText === "OK") {
          fetchProducts();
        }
      } catch (error: any) {
        alert(error.response.data.message);
      }
    } else {
      // Add new supplier
      try {
        const response = await axiosInstance.post("/product/create", formData);
        if (response.statusText === "OK") {
          fetchProducts();
        }
      } catch (error: any) {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
        });
      }
    }

    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      supplier: "",
    });
    setEditingId(null);
    setIsModalOpen(false);
    Swal.fire({
      title: "Saved!",
      text: "Your file has been saved.",
      icon: "success",
    });
  };
  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category._id,
      supplier: product.supplier._id,
    });
    setIsModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/product/delete/${id}`);
          if (response.statusText === "OK") {
            setProducts((prev) => prev.filter((product) => product._id !== id));
            setFilteredProducts((prev) =>
              prev.filter((product) => product._id !== id),
            );
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        } catch (error: any) {
          alert(error.response.data.message);
        }
      }
    });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      supplier: "",
    });
  };

  const columns: TableColumn<Product>[] = [
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
      name: "Supplier",
      selector: (row) => row.supplier.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `$${Number(row.price).toFixed(2)}`,
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
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Loading ....</div>;
  }
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>

      {/* Search and Add Product Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products by name..."
          onChange={handleSearchInput}
          className="w-full sm:flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredProducts}
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" hidden>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold">
                  Supplier
                </label>
                <select
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" hidden>
                    Select Supplier
                  </option>
                  {suppliers.map((sup) => (
                    <option key={sup._id} value={sup._id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                >
                  {editingId ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
