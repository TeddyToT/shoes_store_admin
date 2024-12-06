"use client"
import { useState, useEffect, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
import { Contexts } from '@/app/Contexts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartDataLabels);

interface Order {
  createdAt: string;
  deliveryStatus: string;
  paymentStatus: string;
  total: number;
}

const RevenueChart = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>('month'); // 'day', 'week', 'month'
  const [selectedDate, setSelectedDate] = useState<string>('2024-11'); // Mặc định chọn tháng hiện tại

  const { orders } = useContext(Contexts);

  const groupRevenue = (orders: Order[], filter: string, date: string) => {
    let groupedData: number[] = [];
    const targetDate = new Date(date);

    if (filter === 'day') {
      const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
      groupedData = Array(daysInMonth).fill(0);

      orders.forEach(order => {
        const createdAt = new Date(order.createdAt);
        if (
          order.deliveryStatus === 'success' &&
          order.paymentStatus === 'paid' &&
          createdAt.getMonth() === targetDate.getMonth() &&
          createdAt.getFullYear() === targetDate.getFullYear()
        ) {
          const day = createdAt.getDate() - 1;
          groupedData[day] += order.total;
        }
      });
    } else if (filter === 'week') {
      groupedData = Array(7).fill(0); // 7 ngày trong tuần
      const weekStart = new Date(targetDate);
      weekStart.setDate(targetDate.getDate() - targetDate.getDay()); // Đầu tuần

      orders.forEach(order => {
        const createdAt = new Date(order.createdAt);
        if (
          order.deliveryStatus === 'success' &&
          order.paymentStatus === 'paid' &&
          createdAt >= weekStart &&
          createdAt < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        ) {
          const day = createdAt.getDay();
          groupedData[day] += order.total;
        }
      });
    } else if (filter === 'month') {
      groupedData = Array(12).fill(0);
      orders.forEach(order => {
        const createdAt = new Date(order.createdAt);
        if (
          order.deliveryStatus === 'success' &&
          order.paymentStatus === 'paid' &&
          createdAt.getFullYear() === targetDate.getFullYear()
        ) {
          const month = createdAt.getMonth();
          groupedData[month] += order.total;
        }
      });
    }

    return groupedData;
  };

  useEffect(() => {
    const data = groupRevenue(orders, filter, selectedDate);
    setChartData(data);
  }, [filter, selectedDate]);

  const labels =
    filter === 'day'
      ? Array.from({ length: chartData.length }, (_, i) => `Day ${i + 1}`)
      : filter === 'week'
      ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      : [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
          
        ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: chartData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)', 
        borderWidth: 2,
        
      },
    ],
  };



  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue Chart',
        color: '#3c82f6', // Tiêu đề
      },
      tooltip: {
        callbacks: {
          label: (context) => `Revenue: ${context.raw.toLocaleString("vi-VN")} VNĐ`,
        },
      },
      
      datalabels: {
        display: false,
        color: '#3579BC',
        align: 'top',
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
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
  };
  
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Revenue Chart</h1>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 mx-2 ${filter === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setFilter('day')}
        >
          Day
        </button>
        <button
          className={`px-4 py-2 mx-2 ${filter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setFilter('week')}
        >
          Week
        </button>
        <button
          className={`px-4 py-2 mx-2 ${filter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setFilter('month')}
        >
          Month
        </button>
      </div>

      <div className="flex justify-center mb-4">
        {filter === 'day' && (
          <input
            type="month"
            className="border rounded px-2 py-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        )}
        {filter === 'week' && (
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        )}
        {filter === 'month' && (
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={selectedDate.split('-')[0]}
            onChange={(e) => setSelectedDate(`${e.target.value}-01`)}
          />
        )}
      </div>

      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
