import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import type { Supplier } from "../types";
import DataTable, { type TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/supplier");
      if (response.statusText === "OK") {
        setSuppliers(response.data);
        setFilteredSuppliers(response.data);
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
    fetchSuppliers();
  }, []);
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      // Edit existing supplier
      try {
        const response = await axiosInstance.put(
          `/supplier/update/${editingId}`,
          formData,
        );
        if (response.statusText === "OK") {
          fetchSuppliers();
          Swal.fire({
            title: "Saved!",
            text: "Your file has been saved.",
            icon: "success",
          });
        }
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } else {
      // Add new supplier
      try {
        const response = await axiosInstance.post("/supplier/create", formData);
        if (response.statusText === "OK") {
          fetchSuppliers();
          Swal.fire({
            title: "Saved!",
            text: "Your file has been saved.",
            icon: "success",
          });
        }
      } catch (error: any) {
        console.log(error.response);
        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    }

    setFormData({ name: "", email: "", phone: "", address: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };
  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier._id);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
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
          const response = await axiosInstance.delete(`/supplier/delete/${id}`);
          if (response.statusText === "OK") {
            setSuppliers((prev) =>
              prev.filter((supplier) => supplier._id !== id),
            );
            setFilteredSuppliers((prev) =>
              prev.filter((supplier) => supplier._id !== id),
            );
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        } catch (error: any) {
          Swal.fire({
            title: "Error!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "Okay",
          });
        }
      }
    });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  const columns: TableColumn<Supplier>[] = [
    {
      name: "ID",
      selector: (_row, index) => (index ?? 0) + 1,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      wrap: true,
    },
    {
      name: "Actions",
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
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600  cursor-pointer"
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supplier Management</h1>

      {/* Top Section: Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            onChange={handleSearchInput}
            placeholder="Search suppliers..."
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow ">
        <div className="bg-white rounded-lg shadow">
          <DataTable
            columns={columns}
            data={filteredSuppliers}
            pagination
            highlightOnHover
            striped
            responsive
            progressPending={loading}
            noDataComponent="No suppliers found"
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

      {/* Modal for Add/Edit Supplier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Supplier" : "Add New Supplier"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Supplier name"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Supplier email"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Supplier phone"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Supplier address"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 ${
                    editingId
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-4 py-2 rounded-md cursor-pointer`}
                >
                  {editingId ? "Save Changes" : "Add Supplier"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
