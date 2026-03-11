import React, { useEffect, useState } from "react";
import { defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import axiosInstance from "../utils/api";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";
defaults.plugins.title.font = {
  size: 20,
  weight: "bold",
};

interface Report {
  label: string;
  value: number;
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [monthlyRevenue, setmonthlyRevenue] = useState<Report[]>([]);
  const [yearlyRevenue, setyearlyRevenue] = useState<Report[]>([]);
  const [stockByCategory, setstockByCategory] = useState<Report[]>([]);
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/report");
        console.log(response);
        setmonthlyRevenue(response.data.monthlyRevenueResult);
        setyearlyRevenue(response.data.yearlyRevenueResult);
        setstockByCategory(response.data.stockByCategory);
      } catch (error: any) {
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen w-full flex flex-row items-center justify-center content-center gap-[2vw] flex-wrap bg-gray-300">
      {/* Revenue Card */}
      <div className="bg-white rounded-lg shadow-lg p-4 w-[92%] h-80">
        <Line
          data={{
            labels: monthlyRevenue.map((data) => data.label),
            datasets: [
              {
                label: "Revenue",
                data: monthlyRevenue.map((data) => data.value),
                backgroundColor: "#064FF0",
                borderColor: "#064FF0",
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.5,
              },
            },
            plugins: {
              title: {
                text: "Monthly Revenue",
              },
            },
          }}
        />
      </div>

      {/* Customer Card */}
      <div className="bg-white rounded-lg shadow-lg p-4 w-1/2 h-80">
        <Bar
          data={{
            labels: yearlyRevenue.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: yearlyRevenue.map((data) => data.value),

                borderRadius: 0,
              },
            ],
          }}
          options={{
            animation: false,
            plugins: {
              title: {
                text: "yearly Revenue",
              },
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
          }}
        />
      </div>

      {/* Category Card */}
      <div className="bg-white rounded-lg shadow-lg p-4 w-[40%] h-80">
        <Doughnut
          data={{
            labels: stockByCategory.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: stockByCategory.map((data) => data.value),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Product Resources",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Reports;
