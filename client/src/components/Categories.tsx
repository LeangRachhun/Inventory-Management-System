// Categories.tsx
import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import axiosInstance from "../utils/api";
import type { Category } from "../types";
import Swal from "sweetalert2";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [formCategory, setFormCategory] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/category");

      if (response.statusText === "OK") {
        setCategories(response.data);
        setFilteredCategories(response.data);
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
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formCategory.trim()) {
      alert({ name: "Please enter a valid category name." });
      return;
    }

    try {
      if (editingId) {
        const category = { name: formCategory, description: formDescription };
        const response = await axiosInstance.put(
          `/category/update/${editingId}`,
          category,
        );

        if (response.statusText === "OK") {
          fetchCategories();
        }
        setEditingId(null);
      } else {
        const category = { name: formCategory, description: formDescription };
        const response = await axiosInstance.post("/category/create", category);

        if (response.statusText === "OK") {
          fetchCategories();
        }
      }

      setFormCategory("");
      setFormDescription("");
      Swal.fire({
        title: "Saved!",
        text: "Your file has been saved.",
        icon: "success",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(value),
      ),
    );
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
          const response = await axiosInstance.delete(`/category/delete/${id}`);

          if (response.statusText === "OK") {
            setCategories((prev) => prev.filter((c) => c._id !== id));
            setFilteredCategories((prev) => prev.filter((c) => c._id !== id));
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        } catch (error: any) {
          if (error.response) {
            Swal.fire({
              title: "Error!",
              text: error.response.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          } else {
            alert(error.message);
          }
        }
      }
    });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setFormCategory(category.name);
    setFormDescription(category.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormCategory("");
    setFormDescription("");
  };

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Add/Edit Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Category description (optional)"
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
                  {editingId ? "Save Changes" : "Add Category"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Table and Search */}
        <div className="lg:w-2/3">
          <div className="mb-4">
            <input
              type="text"
              onChange={handleSearchInput}
              placeholder="Search categories..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {category.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {category.createdAt?.slice(0, 10).replace(/-/g, "/")}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          disabled={editingId === category._id}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 disabled:opacity-50 cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCategories.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">
                No categories found
              </div>
            )}
            {filteredCategories.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      Showing {filteredCategories.length} of {categories.length}{" "}
                      categories
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Click on a category to view details
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
