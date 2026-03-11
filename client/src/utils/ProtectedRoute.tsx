import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useEffect } from "react";
import axiosInstance from "./api";

interface ProtectedRoute {
  children: React.ReactNode;
  requiredRole: ["admin" | "user"];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRoute) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const verifyUser = async () => {
    const token = localStorage.getItem("ims_token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response.statusText === "OK") {
        console.log("hello");
      }
    } catch (error: any) {
      if (error.response.data.message === "jwt expired") {
        navigate("/logout", { replace: true });
      }
    }
  };

  useEffect(() => {
    verifyUser();
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!requiredRole.includes(user.role)) {
      navigate("/unauthorized", { replace: true });
      return;
    }
  }, [user, navigate, requiredRole]);

  if (!user) return null;
  if (!requiredRole.includes(user.role)) return null;

  return children;
};

export default ProtectedRoute;
