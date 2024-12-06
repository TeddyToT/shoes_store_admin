"use client";
import React, { useState, useEffect, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Category } from "@mui/icons-material";
import { Contexts } from "@/app/Contexts";

const CategoryChart: React.FC = () => {
  const { orders, categories: allCategories } = useContext(Contexts);
  const [series, setSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("month");
  const [selectedDate, setSelectedDate] = useState<string>("2024-08");

  const getFilteredOrders = (filter: string, date: string) => {
    const targetDate = new Date(date);
    return orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      if (order.deliveryStatus !== "success" || order.paymentStatus !== "paid")
        return false;

      if (filter === "day") {
        return createdAt.toDateString() === targetDate.toDateString();
      } else if (filter === "month") {
        return (
          createdAt.getMonth() === targetDate.getMonth() &&
          createdAt.getFullYear() === targetDate.getFullYear()
        );
      } else if (filter === "year") {
        return createdAt.getFullYear() === targetDate.getFullYear();
      }
      return false;
    });
  };

  const calculateCategoryData = (filteredOrders) => {
    const categoryMap = {};
  
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const categoryId = item.product.categoryId;
        const category = allCategories.find((cat) => cat._id === categoryId);
  
        if (!category) return; // Bỏ qua nếu không tìm thấy danh mục
  
        const categoryName = category.name;
        const totalRevenue = item.price * item.quantity;
  
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }
        categoryMap[categoryName] += totalRevenue;
      });
    });
  
    setCategories(Object.keys(categoryMap));
    setSeries(Object.values(categoryMap));
  };
  

  useEffect(() => {
    const filteredOrders = getFilteredOrders(filter, selectedDate);
    calculateCategoryData(filteredOrders);
  }, [filter, selectedDate]);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#4F6EFF", "#5D7BFF", "#77B6D9", "#00B1D6", "#57D08E"],
    labels: categories,
    legend: {
      show: true,
      position: "bottom",
      fontSize: "16px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "15px",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} VNĐ`
      },
    },
  };
  

  

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-gray-100 px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Category Analytics
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name=""
              id=""
              className=" outline-1 outline relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-base font-medium outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="day" className="dark:bg-boxdark">
                Daily
              </option>
              <option value="month" className="dark:bg-boxdark">
                Monthly
              </option>
              <option value="year" className="dark:bg-boxdark">
                Yearly
              </option>
            </select>
          </div>
          <input
            type={
              filter === "day"
                ? "date"
                : filter === "month"
                  ? "month"
                  : "number"
            }
            className="outline-1 outline ml-2 rounded border px-2 py-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className=" capitalize  mb-2 flex min-h-[500px] items-center justify-center">
        <div className="w-[90%] max-w-[600px]">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
