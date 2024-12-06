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
  const { orders } = useContext(Contexts);

  // Tổng số đơn hàng
  const totalOrders = orders.length;

  // Tổng doanh thu
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Trạng thái đơn hàng
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.deliveryStatus] = (acc[order.deliveryStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Cập nhật statusData với label tương ứng với deliveryStatus
  const statusData = Object.keys(statusCounts).map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),  // Viết hoa chữ cái đầu tiên
    value: statusCounts[status],  // Số lượng đơn hàng
  }));

  // Nhóm đơn hàng theo ngày và tính tổng doanh thu cho mỗi ngày
  const revenueData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString('en-GB'); // Định dạng ngày theo 'DD/MM/YYYY'
    if (!acc[date]) {
      acc[date] = { date, revenue: 0 };
    }
    acc[date].revenue += order.total; // Cộng doanh thu vào ngày
    return acc;
  }, {} as Record<string, { date: string; revenue: number }>);

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
  isSameDay(new Date(order.createdAt), today)
).length;

// Tổng số đơn hàng hôm qua
const yesterdayOrders = orders.filter((order) =>
  isSameDay(new Date(order.createdAt), yesterday)
).length;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Overview" />

      <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-900">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
  <OrdersCard
  title="Total Orders Today"
  current={todayOrders}
  previous={yesterdayOrders}
  icon={<ShoppingCartIcon className="text-blue-500" />}
/>
    <OverviewRevenue
      title="Revenue"
      value={`${totalRevenue.toLocaleString()} VND`}
      icon={<AttachMoneyIcon className="text-green-500" />}
      orders={orders}  // Truyền orders vào OverviewCard
    />
    <OverviewCard
      title="Customers"
      value={new Set(orders.map((order) => order.user)).size}
      icon={<PersonIcon className="text-purple-500" />}
    />
  </div>

  <div className="flex flex-col md:flex-row gap-4">
    <div className="basis-2/5">
      <StatusChart data={statusData} /> 
    </div>

    <div className="basis-3/5">
      <RevenueChart data={revenueChartData} /> {/* Dữ liệu doanh thu theo thời gian đã nhóm */}
    </div>
  </div>
</div>

    </DefaultLayout>
  );
};

export default Overview;
