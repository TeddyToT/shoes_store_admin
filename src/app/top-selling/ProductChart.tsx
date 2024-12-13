import React from "react";
import { BarChart } from "@mui/x-charts";

interface ProductChartProps {
  data: { product: any; sales: number }[];
}

const ProductChart: React.FC<ProductChartProps> = ({ data }) => {
  const seriesData = data.map((d) => d.sales);
  const xAxisData = data.map((d) => d.product.name);



  const valueFormatter = (value) => `${value} đã bán`;

  return (
    <div className="rounded-lg bg-white p-4 shadow h-auto dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-300">
      Sản phẩm bán chạy
      </h3>
      <div className="w-full h-auto">
        <BarChart
          xAxis={[
            {
              data: xAxisData,
              scaleType: "band",
            },
          ]}
          height={700}
          margin={{ bottom:150 }}  // Điều chỉnh margin thêm khoảng trống cho trục Y
          series={[{ data: seriesData, valueFormatter, }]}
          bottomAxis={{
            tickLabelStyle: {
              angle: 75,
              textAnchor: "start",
              fontSize: 12,
              fill: "var(--text-color, #3579BC)", // Ensures text color adapts to themes
            },
          }}
        />
      </div>
    </div>
  );
};

export default ProductChart;
