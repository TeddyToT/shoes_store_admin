"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import React, { useContext } from "react";
import { Contexts } from "../Contexts";
import OverviewCard from "./OverviewCard";
import StatusChart from "./StatusChart";
import RevenueChart from "./RevenueChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import OverviewRevenue from "./OverviewRevenue";
import OrdersCard from "./OrdersCard";

const Overview = () => {
  const { orders, users } = useContext(Contexts);

  // Tổng số đơn hàng
  const totalOrders = orders.length;

  // Tổng doanh thu
  const totalRevenue = orders
  .sort((a, b) => new Date(a.orderDate.replace(" ", "T")).getTime() - new Date(b.orderDate.replace(" ", "T")).getTime()) // Sắp xếp theo thời gian
  .reduce((sum, order) => sum + Number(order.totalPrice), 0); // Tính tổng doanh thu

console.log(totalRevenue);

  // Trạng thái đơn hàng
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.state] = (acc[order.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Cập nhật statusData với label tương ứng với deliveryStatus
  const statusData = Object.keys(statusCounts).map((status) => {
    let label = "";
  
    switch (status.toLowerCase()) {
      case "pending":
        label = "Đang chờ xử lý";
        break;
      case "shipping":
        label = "Đang vận chuyển";
        break;
      case "confirming":
        label = "Đang xác nhận";
        break;
      case "cancel":
        label = "Đã hủy";
        break;
      case "done":
        label = "Hoàn thành";
        break;
      default:
        label = "Không xác định"; // Xử lý trường hợp trạng thái không nằm trong danh sách
    }
  
    return {
      label,
      value: statusCounts[status], // Số lượng đơn hàng
    };
  });
  

  // Nhóm đơn hàng theo ngày và tính tổng doanh thu cho mỗi ngày
  const revenueData = orders
  .reduce((acc, order) => {
    const date = new Date(order.orderDate.replace(" ", "T")).toLocaleDateString('en-GB'); // Định dạng ngày theo 'DD/MM/YYYY'
    const existingEntry = acc.find((entry) => entry.date === date);
    if (existingEntry) {
      existingEntry.revenue += Number(order.totalPrice); // Cộng thêm nếu ngày đã tồn tại
    } else {
      acc.push({ date, revenue: Number(order.totalPrice) }); // Thêm mục mới nếu chưa tồn tại
    }
    return acc;
  }, [] as { date: string; revenue: number }[])
  .sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('/')); // Chuyển 'DD/MM/YYYY' thành 'YYYY/MM/DD'
    const dateB = new Date(b.date.split('/').reverse().join('/'));
    return dateA.getTime() - dateB.getTime(); // Sắp xếp cũ nhất trước
  });

console.log(revenueData);


  // Chuyển dữ liệu nhóm theo ngày thành mảng
  const revenueChartData = Object.values(revenueData).map((data) => ({
    date: data.date,
    revenue: data.revenue,
  }));
  console.log(revenueChartData)

  // Hàm kiểm tra ngày giống nhau
const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Lấy ngày hôm nay và hôm qua
const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

// Tổng số đơn hàng hôm nay
const todayOrders = orders.filter((order) =>
  isSameDay(new Date(order.orderDate.replace(" ", "T")), today)
).length;

// Tổng số đơn hàng hôm qua
const yesterdayOrders = orders.filter((order) =>
  isSameDay(new Date(order.orderDate.replace(" ", "T")), yesterday)
).length;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tổng quan" />

      <div className="bg-gray-100 min-h-screen dark:bg-[#1b222c]">
  <div className="flex flex-col md:flex-row gap-4 mb-4">
  <OrdersCard
  title="Tổng đơn hàng hôm nay"
  current={todayOrders}
  previous={yesterdayOrders}
  icon={<ShoppingCartIcon className="text-blue-500" />}
/>
    <OverviewRevenue
      title="Doanh thu"
      value={`${totalRevenue.toLocaleString()} VND`}
      icon={<AttachMoneyIcon className="text-green-500" />}
      orders={orders}  // Truyền orders vào OverviewCard
    />
    <OverviewCard
      title="Khách hàng"
      value={users.length}
      icon={<PersonIcon className="text-purple-500" />}
    />
  </div>

  <div className="flex flex-col gap-4">
    <div className="w-full">
      <StatusChart data={statusData} /> 
    </div>

    <div className="w-full">
      <RevenueChart data={revenueChartData} /> {/* Dữ liệu doanh thu theo thời gian đã nhóm */}
    </div>
  </div>
</div>

    </DefaultLayout>
  );
};

export default Overview;
