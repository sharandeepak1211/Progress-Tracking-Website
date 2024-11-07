import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  data: Array<{
    date: string;
    satisfaction: number;
  }>;
}

export default function TrendChart({ data }: TrendChartProps) {
  const chartData = {
    labels: data.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Satisfaction Level',
        data: data.map(entry => entry.satisfaction),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progress Satisfaction Trend',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Line data={chartData} options={options} />
    </div>
  );
}