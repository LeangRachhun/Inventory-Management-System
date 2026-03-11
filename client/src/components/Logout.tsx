import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return null;
};

export default Logout;
