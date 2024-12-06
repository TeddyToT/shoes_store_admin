import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Image from 'next/image';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  name: string;
  sales: number;
  image: string;
}

// Định nghĩa props cho TopSellingDashboard component
interface TopSellingDashboardProps {
  products: Product[];
}

const TopSellingDashboard: React.FC<TopSellingDashboardProps> = ({ products }) => {
  const chartData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: 'Số lượng bán',
        data: products.map((product) => product.sales),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-white dark:shadow-gray-700">
      <h2 className="text-2xl font-semibold mb-4">Top-selling Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.name}
            className="border rounded-lg p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            <div className="flex items-center mb-3">
              <Image
                src={product.image}
                alt={product.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <span className="ml-4 font-medium">{product.name}</span>
            </div>
            <div className="text-center text-sm">
              <p>Số lượng bán: {product.sales}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ cột */}
      <div className="mt-8 min-h-90  justify-center flex ">
  <Bar data={chartData} options={{
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.5)',
        },
        ticks: {
          color: '#3579BC',
        },
      },
      y: {
        grid: {
          color:  'rgba(200, 200, 200, 0.5)',
        },
        ticks: {
          color: '#3579BC',
        },
      },
    },
  }} />
</div>

    </div>
  );
};

export default TopSellingDashboard;
