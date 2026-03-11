import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <>
      <div className="flex ">
        <Sidebar />

        <div className="flex-1 ml-16 md:ml-64 bg-gray-100 h-screen overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
