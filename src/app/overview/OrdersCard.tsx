import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface OrdersCardProps {
  title: string;
  icon: React.ReactNode;
  current: number;
  previous: number;
}

const OrdersCard: React.FC<OrdersCardProps> = ({
  title,
  icon,
  current,
  previous,
}) => {
  // Tính toán phần trăm thay đổi
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100; // Nếu không có giá trị trước đó, coi là tăng 100%
    return ((current - previous) / previous) * 100;
  };

  const percentageChange = calculatePercentageChange(current, previous);

  // Hàm so sánh giá trị
  const getGrowthIcon = (current: number, previous: number) => {
    if (current === 0 && previous === 0) {
      return null; // Không hiển thị khi cả hai đều 0
    } else if (current === 0) {
      return <ArrowDownwardIcon className="text-red-500" />;
    } else if (previous === 0) {
      return <ArrowUpwardIcon className="text-green-500" />;
    } else if (current > previous) {
      return <ArrowUpwardIcon className="text-green-500" />;
    } else if (current < previous) {
      return <ArrowDownwardIcon className="text-red-500" />;
    }
    return null;
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center dark:bg-gray-800">
      {/* Biểu tượng và thông tin */}
      <div className="flex items-center">
        <div className="text-blue-500 p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {current}
          </p>
        </div>
      </div>
      {/* Phần trăm thay đổi */}
      <div className="flex items-center">
        {getGrowthIcon(current, previous)}
        <span
          className={`ml-1 text-sm font-medium ${
            percentageChange > 0
              ? "text-green-500"
              : percentageChange < 0
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {percentageChange.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default OrdersCard;
