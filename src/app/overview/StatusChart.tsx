import React from 'react';
import { PieChart } from '@mui/x-charts';

interface StatusChartProps {
  data: { label: string; value: number }[];  // Cập nhật lại kiểu dữ liệu
}

const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 dark:bg-gray-800">
      <h3 className="font-medium text-gray-500 mb-4 dark:text-gray-400">
      Order Status
      </h3>
      <PieChart
        series={[
          {
            data, 
            type: "pie",
          },
        ]}
        height={300}
        tooltip={{
          trigger: "item", 
        }}
        slotProps={{
          legend: {
            position: { vertical: "middle", horizontal: "right" },
            labelStyle: {
         
              color: "currentColor", 
              fontSize: 14,
            },
          },
        }}
      />
    </div>
  );
  
  
};

export default StatusChart;
