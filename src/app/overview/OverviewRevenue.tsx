import React, { useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  orders: { total: number; createdAt: string }[]; // Thêm orders để tính tổng doanh thu
}

const OverviewRevenue: React.FC<OverviewCardProps> = ({ title, value, icon, orders }) => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString()); // Mặc định là năm hiện tại
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // Mặc định là toàn bộ tháng
  const [selectedDate, setSelectedDate] = useState<string>('all'); // Mặc định là toàn bộ ngày

  // Hàm tính toán doanh thu theo thời gian chọn
  const calculateRevenue = () => {
    let filteredOrders = [...orders];

    // Lọc theo năm
    if (selectedYear !== 'all') {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear().toString() === selectedYear;
      });
    }

    // Lọc theo tháng
    if (selectedMonth !== 'all') {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === parseInt(selectedMonth) && orderDate.getFullYear().toString() === selectedYear;
      });
    }

    // Lọc theo ngày
    if (selectedDate !== 'all') {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toLocaleDateString() === selectedDate;
      });
    }

    // Tính tổng doanh thu
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    return totalRevenue;
  };

  // Lọc theo năm
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value); // Cập nhật năm khi người dùng thay đổi
    setSelectedMonth('all'); // Reset chọn tháng
    setSelectedDate('all'); // Reset chọn ngày
  };

  // Lọc theo tháng
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value); // Cập nhật tháng khi người dùng thay đổi
    setSelectedDate('all'); // Reset chọn ngày
  };

  // Lọc theo ngày
  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value); // Cập nhật ngày khi người dùng thay đổi
  };

  const totalRevenue = calculateRevenue(); // Lấy tổng doanh thu theo lựa chọn

  // Lấy danh sách các năm và tháng trong dữ liệu
  const years = Array.from(new Set(orders.map((order) => new Date(order.createdAt).getFullYear())));
  const months = Array.from(new Set(orders.map((order) => new Date(order.createdAt).getMonth())));

  // Lấy danh sách các ngày trong tháng được chọn mà có doanh thu
  const getDaysWithRevenue = (month: number, year: number) => {
    const date = new Date(year, month);
    const daysWithRevenue: string[] = [];

    // Lặp qua các đơn hàng để xác định các ngày có doanh thu
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getMonth() === month && orderDate.getFullYear() === year) {
        const formattedDate = orderDate.toLocaleDateString();
        if (!daysWithRevenue.includes(formattedDate)) {
          daysWithRevenue.push(formattedDate);
        }
      }
    });

    return daysWithRevenue;
  };

 
  const getGrowthIcon = (currentRevenue: number, previousRevenue: number) => {
    if (currentRevenue > previousRevenue) {
      return <ArrowUpwardIcon className="text-green-500" />;
    } else if (currentRevenue < previousRevenue) {
      return <ArrowDownwardIcon className="text-red-500" />;
    }
    return null;
  };
  const getRevenueForPreviousYear = (orders: { total: number; createdAt: string }[], currentYear: string) => {
    const previousYear = parseInt(currentYear) - 1;
    const previousYearRevenue = orders
      .filter(order => new Date(order.createdAt).getFullYear() === previousYear)
      .reduce((sum, order) => sum + order.total, 0);
    
    return previousYearRevenue;
  };

  const getRevenueForPreviousMonth = (orders: { total: number; createdAt: string }[], currentYear: string, currentMonth: number) => {
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? parseInt(currentYear) - 1 : currentYear;
    
    const previousMonthRevenue = orders
      .filter(order => new Date(order.createdAt).getFullYear().toString() === previousMonthYear.toString() && new Date(order.createdAt).getMonth() === previousMonth)
      .reduce((sum, order) => sum + order.total, 0);
    
    return previousMonthRevenue;
  };

  const getRevenueForPreviousDay = (orders: { total: number; createdAt: string }[], currentDate: Date) => {
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    
    const previousDayRevenue = orders
      .filter(order => new Date(order.createdAt).toLocaleDateString() === previousDate.toLocaleDateString())
      .reduce((sum, order) => sum + order.total, 0);
    
    return previousDayRevenue;
  };
  
  const previousYearRevenue = getRevenueForPreviousYear(orders, selectedYear);
  const previousMonthRevenue = selectedMonth !== 'all' ? getRevenueForPreviousMonth(orders, selectedYear, parseInt(selectedMonth)) : 0;
  const previousDateRevenue = selectedDate !== 'all' ? getRevenueForPreviousDay(orders, new Date(selectedDate)) : 0;

    
  const daysWithRevenue = selectedMonth !== 'all' ? getDaysWithRevenue(parseInt(selectedMonth), parseInt(selectedYear)) : [];


  const getPercentageChange = (currentRevenue: number, previousRevenue: number) => {
    if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0; // Tránh chia cho 0
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between dark:bg-gray-800">
  {/* Nội dung (tiêu đề và giá trị) bên trái */}
  <div className="flex items-center basis-1/2">
    {/* Biểu tượng bên trái */}
    <div className="text-blue-500 p-3 rounded-lg bg-blue-100 dark:bg-blue-900">{icon}</div>

    {/* Tiêu đề và giá trị */}
    <div className="ml-4 flex-1 flex-row">
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 break-words">
          {`${totalRevenue.toLocaleString()} VND`}
        </p>
      </div>
      <div>
        {selectedYear !== "all" && selectedMonth === "all" && selectedDate === "all" ? (
          <div className=" flex items-center">
            {getGrowthIcon(totalRevenue, previousYearRevenue)}
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              {` ${getPercentageChange(totalRevenue, previousYearRevenue).toFixed(2)}%`}
            </span>
          </div>
        ) : selectedYear !== "all" && selectedMonth !== "all" && selectedDate === "all" ? (
          <div className=" flex items-center">
            {getGrowthIcon(totalRevenue, previousMonthRevenue)}
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              {` ${getPercentageChange(totalRevenue, previousMonthRevenue).toFixed(2)}%`}
            </span>
          </div>
        ) : selectedYear !== "all" && selectedMonth !== "all" && selectedDate !== "all" ? (
          <div className=" flex items-center">
            {getGrowthIcon(totalRevenue, previousDateRevenue)}
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              {` ${getPercentageChange(totalRevenue, previousDateRevenue).toFixed(2)}%`}
            </span>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  </div>

  {/* Dropdown để chọn khoảng thời gian lọc (ở bên phải) */}
  <div className="flex flex-col space-y-4 basis-1/3">
    {/* Chọn Năm */}
    <select
      value={selectedYear}
      onChange={handleYearChange}
      className="p-2 bg-gray-100 border border-gray-300 rounded w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
    >
      <option value="all">All Time</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>

    {/* Chọn Tháng */}
    <select
      value={selectedMonth}
      onChange={handleMonthChange}
      className="p-2 bg-gray-100 border border-gray-300 rounded w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
    >
      <option value="all">All Month</option>
      {months.map((month) => (
        <option key={month} value={month}>
          {new Date(2024, month).toLocaleString("default", { month: "long" })}
        </option>
      ))}
    </select>

    {/* Chọn Ngày */}
    <select
      value={selectedDate}
      onChange={handleDateChange}
      className="p-2 bg-gray-100 border border-gray-300 rounded w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
    >
      <option value="all">All Day</option>
      {selectedMonth !== "all" && daysWithRevenue.length > 0 ? (
        daysWithRevenue.map((date, index) => (
          <option key={index} value={date}>
            {date}
          </option>
        ))
      ) : (
        <option value="all">Choose month to select date</option>
      )}
    </select>
  </div>
</div>

  );
};

export default OverviewRevenue;
