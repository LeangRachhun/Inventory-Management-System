import React, { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/api";
import Swal from "sweetalert2";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  useEffect(() => {
    const fetchuserData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/user/${user?._id}`);
        if (response.statusText === "OK") {
          const userInfo = {
            username: response.data.username,
            email: response.data.email,
            address: response.data.address,
            password: "",
          };
          setUserData(userInfo);
        }
      } catch (error: any) {
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
    fetchuserData();
  }, [user?._id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const updateData =
          userData.password === ""
            ? {
                username: userData.username,
                email: userData.email,
                address: userData.address,
              }
            : userData;
        try {
          const response = await axiosInstance.put(
            `/user/update/${user?._id}`,
            updateData,
          );

          if (response.statusText === "OK") {
            setUserData({
              username: response.data.username,
              email: response.data.email,
              address: response.data.address,
              password: "",
            });

            setIsEditing(false);
            setError(null);
            Swal.fire({
              title: "Updated!",
              text: "Your file has been updated.",
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
        } finally {
          setLoading(false);
        }
      }
    });
  };
  if (error) return <p className="text-red-500 mb-4">{error}</p>;
  if (loading) return <p className="text-gray-500 mb-4">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-md"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={userData.password || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password (optional)"
            />
          </div>
        )}

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300 cursor-pointer"
              disabled={loading}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300 cursor-pointer"
                disabled={loading}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300 cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
