import React, { useState } from "react";
import Select from "react-select";  // Thêm import react-select
import { LineChart } from "@mui/x-charts";

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [timeFilter, setTimeFilter] = useState<'day' | 'month' | 'year'>('month');
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  // Helper: Chuyển đổi chuỗi ngày thành đối tượng Date
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map((item) => parseInt(item, 10));
    return new Date(year, month - 1, day);
  };

  // Helper: Format tuần theo dạng "DD/MM/YYYY - DD/MM/YYYY"
  const formatWeek = (start: Date, end: Date): string => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
    return `${start.toLocaleDateString("en-GB", options)} - ${end.toLocaleDateString("en-GB", options)}`;
  };

  // Helper: Format ngày, tháng, năm tùy theo filter
  const formatDate = (dateString: string, filter: 'day' | 'month' | 'year'): string => {
    const date = parseDate(dateString);
    if (filter === 'month') {
      return `${date.getFullYear()}-${date.getMonth() + 1}`; // Tháng (YYYY-MM)
    } else if (filter === 'year') {
      return `${date.getFullYear()}`; // Năm (YYYY)
    }
    return date.toLocaleDateString(); // Ngày (DD/MM/YYYY)
  };

  // Tạo danh sách tuần
  const getWeeksInData = (data: { date: string }[]): string[] => {
    if (data.length === 0) return [];
    const sortedDates = data.map((d) => parseDate(d.date)).sort((a, b) => a.getTime() - b.getTime());

    let start = new Date(sortedDates[0]);
    let end = new Date(start);
    end.setDate(end.getDate() + 6);

    const weeks: string[] = [];
    while (start <= sortedDates[sortedDates.length - 1]) {
      weeks.push(formatWeek(start, end));
      start.setDate(start.getDate() + 7);
      end.setDate(end.getDate() + 7);
    }

    return weeks;
  };

  // Lọc dữ liệu theo tuần
  const filterDataByWeek = (data: { date: string; revenue: number }[], week: string) => {
    if (!week) return data;
    const [startStr, endStr] = week.split(" - ").map((d) => parseDate(d));
    return data.filter((d) => {
      const date = parseDate(d.date);
      return date >= startStr && date <= endStr;
    });
  };

  // Tổng hợp doanh thu theo ngày, tháng, hoặc năm
  const aggregateData = (data: { date: string; revenue: number }[], filter: 'day' | 'month' | 'year') => {
    const groupedData: Record<string, number> = {};

    data.forEach((d) => {
      const formattedDate = filter === 'day' ? d.date : formatDate(d.date, filter);
      groupedData[formattedDate] = (groupedData[formattedDate] || 0) + d.revenue;
    });

    return Object.keys(groupedData).map((key) => ({
      date: key,
      revenue: groupedData[key],
    }));
  };

  // Lọc dữ liệu theo thời gian
  const filteredData = timeFilter === "day" && selectedWeek
    ? filterDataByWeek(data, selectedWeek)
    : data;
  const aggregatedData = aggregateData(filteredData, timeFilter);

  const seriesData = aggregatedData.map((d) => d.revenue);
  const xAxisData = aggregatedData.map((d) => d.date);

  // Tạo options cho react-select
  const weekOptions = getWeeksInData(data).map((week) => ({
    value: week,
    label: week,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-4 dark:bg-gray-800">
      <h3 className="text-sm font-medium text-gray-500 mb-4 dark:text-gray-400">
        Revenue Over Time
      </h3>

      {/* Nút lọc */}
      <div className="mb-4 flex items-center">
        <label className="mr-2 text-gray-600 dark:text-gray-300">Filter: </label>
        <select
          value={timeFilter}
          onChange={(e) => {
            const filter = e.target.value as 'day' | 'month' | 'year';
            setTimeFilter(filter);
            if (filter !== "day") setSelectedWeek(""); // Reset tuần nếu không phải "day"
          }}
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        {/* Chọn tuần nếu filter là "day" */}
        {timeFilter === "day" && (
          <Select
            value={selectedWeek ? { value: selectedWeek, label: selectedWeek } : null}
            onChange={(option) => setSelectedWeek(option ? option.value : "")}
            options={weekOptions}
            className="ml-4 w-1/3"
            placeholder="Select a Week"
            isSearchable
          />
        )}
      </div>

      {/* Biểu đồ */}
      <div className="w-full">
      <LineChart 
  series={[{ type: 'line', data: seriesData }]}
  xAxis={[
    {
      scaleType: 'band',
      data: xAxisData,
      tickLabelStyle: {
        fontSize: 12,
        fill: 'currentColor',
      },
    },
  ]}
  yAxis={[
    {
      tickLabelStyle: {
        fontSize: 12,
        fill: 'currentColor',
      },
      labelOffset: 15,  // Điều chỉnh khoảng cách nhãn y-axis
      axisLabel: {  // Thêm labelMargin để tạo thêm không gian cho các nhãn
        margin: 20,  // Tăng khoảng cách giữa nhãn trục y và biên trái
      },
    },
  ]}
  height={300}
  margin={{ left: 72, right: 30, top: 10, bottom: 30 }}  // Điều chỉnh margin thêm khoảng trống cho trục Y
  tooltip={{
    valueFormatter: (value) => `${value.toLocaleString()} VND`,
  }}
/>


      </div>
    </div>
  );
};

export default RevenueChart;
