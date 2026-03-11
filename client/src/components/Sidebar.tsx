import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaTruck,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTable,
} from "react-icons/fa";
import { IoBarChart } from "react-icons/io5";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaHome />, isParent: true },
    {
      name: "Products",
      path: "/admin-dashboard/products",
      icon: <FaBox />,
      isParent: false,
    },
    {
      name: "Categories",
      path: "/admin-dashboard/categories",
      icon: <FaTable />,
      isParent: false,
    },
    {
      name: "Orders",
      path: "/admin-dashboard/orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: "Suppliers",
      path: "/admin-dashboard/supplier",
      icon: <FaTruck />,
      isParent: false,
    },
    {
      name: "Users",
      path: "/admin-dashboard/users",
      icon: <FaUsers />,
      isParent: false,
    },
    {
      name: "Reports",
      path: "/admin-dashboard/reports",
      icon: <IoBarChart />,
      isParent: false,
    },
    {
      name: "Profile",
      path: "/admin-dashboard/profile",
      icon: <FaCog />,
      isParent: true,
    },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt />, isParent: true },
  ];

  const userMenuItems = [
    {
      name: "Products",
      path: "/employee-dashboard",
      icon: <FaBox />,
      isParent: true,
    },
    {
      name: "Orders",
      path: "/employee-dashboard/orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: "Profile",
      path: "/employee-dashboard/profile",
      icon: <FaCog />,
      isParent: false,
    },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt />, isParent: true },
  ];

  const [itemsToRender, setItemsToRender] = useState(userMenuItems);
  // let itemsToRender = userMenuItems;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("ims_user")!);
    if (user && user.role === "admin") {
      setItemsToRender(menuItems);
      // itemsToRender = menuItems;
    }
  }, []);

  return (
    <div className="fixed z-10 h-full bg-gray-800 text-white w-16 md:w-64 flex flex-col">
      {/* Logo or Branding (optional) */}
      <div className="h-16 flex items-center justify-center md:justify-start md:pl-6">
        <span className="hidden md:block text-xl font-bold">Inventory MS</span>
        <span className="block md:hidden text-xl font-bold">IMS</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2 p-2">
          {itemsToRender.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.isParent}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-gray-600" : "hover:bg-gray-700"
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="ml-4 hidden md:block">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
