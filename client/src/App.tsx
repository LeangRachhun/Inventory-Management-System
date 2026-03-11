import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Root from "./utils/Root";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Products from "./components/Products";
import Logout from "./components/Logout";
import Orders from "./components/Order";
import EmployeeProduct from "./components/EmployeeProduct";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Summary from "./components/Summary";
import Reports from "./components/Reports";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Summary />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="supplier" element={<Suppliers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute requiredRole={["user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/unauthorized" element={<h2>Unauthorized...</h2>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<div>no found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
