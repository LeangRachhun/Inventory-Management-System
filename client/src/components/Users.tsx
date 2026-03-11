import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/api";
import type { User } from "../types";
import Swal from "sweetalert2";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/user");
      if (response.statusText === "OK") {
        setUsers(response.data);
        setFilteredUsers(response.data);
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
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/user/create", formData);
      if (response.statusText === "OK") {
        fetchUsers();
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
  };
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredUsers(
      users.filter((user) =>
        user.username
          .toLowerCase()
          .includes(e.target.value.toLocaleLowerCase()),
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
          const response = await axiosInstance.delete(`/user/delete/${id}`);

          if (response.statusText === "OK") {
            setUsers((prev) => prev.filter((user) => user._id !== id));
            setFilteredUsers((prev) => prev.filter((user) => user._id !== id));
          }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
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
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Add/Edit Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Uer Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Enter Name"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter Email"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="*******"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Address
                </label>
                <input
                  type="text"
                  name="address"
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter Address"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                name="role"
                required
                id=""
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" hidden>
                  Select Role
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer`}
                >
                  Add User
                </button>
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
              placeholder="Search users..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center p-4 text-gray-500">No User found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
