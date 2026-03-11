import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail, FiLogIn } from "react-icons/fi";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        {
          email,
          password,
        },
      );

      if (response.status === 200) {
        login(response.data.user, response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        setErrorMessage(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        setErrorMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message || "Login failed",
        );
      } else {
        setErrorMessage("Network error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Inventory Pro
          </h1>
          <p className="text-gray-600">POS Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-linear-to-r from-emerald-500 to-cyan-500 rounded-xl shadow-md mb-4">
              <FiLogIn className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-1">Please sign in to continue</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-red-600 text-center text-sm font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                           outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                           outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-linear-to-r from-emerald-500 to-cyan-500 
                       text-white font-semibold rounded-lg shadow-md hover:shadow-lg 
                       transform hover:-translate-y-0.5 transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiLogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <span className="font-semibold">Demo credentials:</span>{" "}
              admin@example.com / password123
            </p>
          </div>
        </div>

        {/* Simple Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Inventory Pro. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
